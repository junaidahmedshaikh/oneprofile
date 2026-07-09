import { User } from "../models/User.js";
import { OAuthAccount } from "../models/OAuthAccount.js";
import { PasswordResetToken } from "../models/PasswordResetToken.js";
import { Role } from "../models/Role.js";
import { env } from "../config/env.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import { ApiError } from "../utils/apiError.js";
import { generateSecureToken, sha256 } from "../utils/crypto.js";
import { issueOtp, verifyOtp } from "./otp.service.js";
import {
  createOrUpdateDevice,
  createSession,
  listUserSessions,
  revokeAllUserSessions,
  revokeSessionByRefreshToken,
  rotateSession,
} from "./session.service.js";
import {
  buildAuthTokens,
  decodeRefreshToken,
  getRefreshTokenExpiresAt,
} from "./token.service.js";
import { sendMail } from "./email.service.js";
import { sendSms } from "./sms.service.js";

function sanitizeUser(user) {
  return user.toJSON ? user.toJSON() : user;
}

async function ensureDefaultRoles() {
  const defaults = [
    {
      name: "user",
      scope: "platform",
      description: "Default authenticated user",
      permissions: ["auth:read:self"],
    },
    {
      name: "admin",
      scope: "platform",
      description: "Platform administrator",
      permissions: [
        "auth:read:self",
        "auth:manage:sessions",
        "auth:manage:roles",
      ],
    },
    {
      name: "moderator",
      scope: "platform",
      description: "Content moderator",
      permissions: ["auth:read:self"],
    },
  ];

  for (const role of defaults) {
    await Role.updateOne(
      { name: role.name },
      { $setOnInsert: role },
      { upsert: true },
    );
  }
}

export async function registerUser({
  name,
  email,
  phone,
  password,
  firstName = "",
  lastName = "",
  userAgent = "",
  ipAddress = "",
  device = {},
}) {
  await ensureDefaultRoles();

  const existing = await User.findOne({
    $or: [
      email ? { email: email.toLowerCase() } : null,
      phone ? { phone } : null,
    ].filter(Boolean),
  });

  if (existing) {
    throw new ApiError(409, "Account already exists", "AUTH_ACCOUNT_EXISTS");
  }

  const user = await User.create({
    name,
    firstName,
    lastName,
    email: email || undefined,
    phone: phone || undefined,
    passwordHash: password ? await hashPassword(password) : null,
    roles: ["user"],
    status: "pending",
  });

  const deviceRecord = await createOrUpdateDevice({
    userId: user._id,
    fingerprint: device.fingerprint || generateSecureToken(8),
    name: device.name || "",
    type: device.type || "web",
    os: device.os || "",
    browser: device.browser || "",
  });

  const verificationTasks = [];
  if (email) {
    verificationTasks.push(
      issueOtp({
        identifier: email.toLowerCase(),
        identifierType: "email",
        purpose: "email_verification",
        userId: user._id,
      }).then(async (otpResponse) => {
        await sendMail({
          to: email,
          subject: "Verify your oneprofile email",
          text: `Your verification code is ${otpResponse.otp}. It expires in ${env.OTP_TTL_MINUTES} minutes.`,
        });
        return otpResponse;
      }),
    );
  }
  if (phone) {
    verificationTasks.push(
      issueOtp({
        identifier: phone,
        identifierType: "phone",
        purpose: "phone_verification",
        userId: user._id,
      }).then(async (otpResponse) => {
        await sendSms({
          to: phone,
          message: `Your oneprofile phone verification code is ${otpResponse.otp}. It expires in ${env.OTP_TTL_MINUTES} minutes.`,
        });
        return otpResponse;
      }),
    );
  }

  const [emailOtpResponse, phoneOtpResponse] =
    await Promise.all(verificationTasks);

  const session = await createSession({
    userId: user._id,
    deviceId: deviceRecord._id,
    refreshToken: generateSecureToken(64),
    userAgent,
    ipAddress,
    deviceName: deviceRecord.name,
    deviceType: deviceRecord.type,
    os: deviceRecord.os,
    browser: deviceRecord.browser,
    expiresAt: getRefreshTokenExpiresAt(),
  });

  const { accessToken, refreshToken } = buildAuthTokens(user, session._id);
  session.refreshTokenHash = sha256(refreshToken);
  await session.save();

  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken,
    requiresEmailVerification: Boolean(email && !user.emailVerifiedAt),
    requiresPhoneVerification: Boolean(phone && !user.phoneVerifiedAt),
    otpChallenge:
      emailOtpResponse?.challenge || phoneOtpResponse?.challenge || null,
  };
}

export async function loginWithEmailOrPhone({
  identifier,
  password,
  userAgent = "",
  ipAddress = "",
  device = {},
}) {
  const query = identifier.includes("@")
    ? { email: identifier.toLowerCase() }
    : { phone: identifier };

  const user = await User.findOne(query);
  if (!user || !user.passwordHash) {
    throw new ApiError(401, "Invalid credentials", "AUTH_INVALID_CREDENTIALS");
  }

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) {
    throw new ApiError(401, "Invalid credentials", "AUTH_INVALID_CREDENTIALS");
  }

  const deviceRecord = await createOrUpdateDevice({
    userId: user._id,
    fingerprint: device.fingerprint || generateSecureToken(8),
    name: device.name || "",
    type: device.type || "web",
    os: device.os || "",
    browser: device.browser || "",
  });

  user.lastLoginAt = new Date();
  user.lastLoginIp = ipAddress;
  user.status = "active";
  await user.save();

  const session = await createSession({
    userId: user._id,
    deviceId: deviceRecord._id,
    refreshToken: generateSecureToken(64),
    userAgent,
    ipAddress,
    deviceName: deviceRecord.name,
    deviceType: deviceRecord.type,
    os: deviceRecord.os,
    browser: deviceRecord.browser,
    expiresAt: getRefreshTokenExpiresAt(),
  });

  const tokens = buildAuthTokens(user, session._id);
  session.refreshTokenHash = sha256(tokens.refreshToken);
  await session.save();

  return { user: sanitizeUser(user), ...tokens, session };
}

export async function requestOtpLogin({ identifier, purpose = "login" }) {
  const user = await User.findOne(
    identifier.includes("@")
      ? { email: identifier.toLowerCase() }
      : { phone: identifier },
  );
  if (!user) {
    throw new ApiError(404, "Account not found", "AUTH_ACCOUNT_NOT_FOUND");
  }

  const channel = identifier.includes("@") ? "email" : "phone";
  const otp = await issueOtp({
    identifier: identifier.toLowerCase(),
    identifierType: channel,
    purpose,
    userId: user._id,
  });

  if (channel === "email") {
    await sendMail({
      to: identifier,
      subject: "Your oneprofile login code",
      text: `Your login code is ${otp.otp}. It expires in ${env.OTP_TTL_MINUTES} minutes.`,
    });
  } else {
    await sendSms({
      to: identifier,
      message: `Your oneprofile login code is ${otp.otp}. It expires in ${env.OTP_TTL_MINUTES} minutes.`,
    });
  }

  return { purpose, channel, expiresAt: otp.challenge.expiresAt };
}

export async function verifyOtpLogin({
  identifier,
  otp,
  userAgent = "",
  ipAddress = "",
  device = {},
}) {
  const result = await verifyOtp({
    identifier: identifier.toLowerCase(),
    purpose: "login",
    otp,
  });

  if (!result.valid) {
    throw new ApiError(401, "Invalid or expired code", "AUTH_OTP_INVALID");
  }

  const user = await User.findOne(
    identifier.includes("@")
      ? { email: identifier.toLowerCase() }
      : { phone: identifier },
  );
  if (!user) {
    throw new ApiError(404, "Account not found", "AUTH_ACCOUNT_NOT_FOUND");
  }

  const deviceRecord = await createOrUpdateDevice({
    userId: user._id,
    fingerprint: device.fingerprint || generateSecureToken(8),
    name: device.name || "",
    type: device.type || "web",
    os: device.os || "",
    browser: device.browser || "",
  });

  const session = await createSession({
    userId: user._id,
    deviceId: deviceRecord._id,
    refreshToken: generateSecureToken(64),
    userAgent,
    ipAddress,
    deviceName: deviceRecord.name,
    deviceType: deviceRecord.type,
    os: deviceRecord.os,
    browser: deviceRecord.browser,
    expiresAt: getRefreshTokenExpiresAt(),
  });

  const tokens = buildAuthTokens(user, session._id);
  session.refreshTokenHash = sha256(tokens.refreshToken);
  await session.save();

  user.lastLoginAt = new Date();
  user.lastLoginIp = ipAddress;
  user.status = "active";
  await user.save();

  return { user: sanitizeUser(user), ...tokens };
}

export async function refreshSession(refreshToken) {
  if (!refreshToken)
    throw new ApiError(401, "Missing refresh token", "AUTH_REFRESH_REQUIRED");

  let payload;
  try {
    payload = decodeRefreshToken(refreshToken);
  } catch {
    throw new ApiError(
      401,
      "Refresh token is invalid or expired",
      "AUTH_REFRESH_INVALID",
    );
  }

  const nextRefreshToken = generateSecureToken(64);
  const session = await rotateSession({
    refreshToken,
    nextRefreshToken,
    expiresAt: getRefreshTokenExpiresAt(),
  });

  if (!session) {
    throw new ApiError(
      401,
      "Refresh token is invalid or revoked",
      "AUTH_REFRESH_INVALID",
    );
  }

  const user = await User.findById(payload.sub);
  if (!user) {
    throw new ApiError(404, "Account not found", "AUTH_ACCOUNT_NOT_FOUND");
  }

  const tokens = buildAuthTokens(
    user,
    session._id,
    payload.tenantId || null,
    nextRefreshToken,
  );
  session.refreshTokenHash = sha256(tokens.refreshToken);
  await session.save();

  return { user: sanitizeUser(user), ...tokens };
}

export async function logoutSession(refreshToken) {
  return revokeSessionByRefreshToken(refreshToken);
}

export async function logoutEverywhere(userId, exceptSessionId = null) {
  return revokeAllUserSessions(userId, exceptSessionId);
}

export async function me(userId) {
  const user = await User.findById(userId);
  if (!user)
    throw new ApiError(404, "Account not found", "AUTH_ACCOUNT_NOT_FOUND");
  return sanitizeUser(user);
}

export async function listSessions(userId) {
  return listUserSessions(userId);
}

export async function startForgotPassword({ identifier }) {
  const user = await User.findOne(
    identifier.includes("@")
      ? { email: identifier.toLowerCase() }
      : { phone: identifier },
  );
  if (!user) return { ok: true };
  if (!user.email) return { ok: true };

  const rawToken = generateSecureToken(32);
  const tokenHash = sha256(rawToken);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

  await PasswordResetToken.deleteMany({ userId: user._id, usedAt: null });
  await PasswordResetToken.create({ userId: user._id, tokenHash, expiresAt });

  await sendMail({
    to: user.email,
    subject: "Reset your oneprofile password",
    text: `Use this secure reset token: ${rawToken}. It expires in 30 minutes.`,
  });

  return { ok: true };
}

export async function resetPassword({ token, password }) {
  const tokenHash = sha256(token);
  const record = await PasswordResetToken.findOne({
    tokenHash,
    usedAt: null,
    expiresAt: { $gt: new Date() },
  });

  if (!record) {
    throw new ApiError(
      400,
      "Reset token is invalid or expired",
      "AUTH_RESET_TOKEN_INVALID",
    );
  }

  const user = await User.findById(record.userId);
  if (!user) {
    throw new ApiError(404, "Account not found", "AUTH_ACCOUNT_NOT_FOUND");
  }

  user.passwordHash = await hashPassword(password);
  user.status = "active";
  await user.save();

  record.usedAt = new Date();
  await record.save();

  await logoutEverywhere(user._id);
  return { ok: true };
}

export async function requestEmailVerification(userId, email) {
  const otp = await issueOtp({
    identifier: email.toLowerCase(),
    identifierType: "email",
    purpose: "email_verification",
    userId,
  });

  await sendMail({
    to: email,
    subject: "Verify your oneprofile email",
    text: `Your verification code is ${otp.otp}. It expires in ${env.OTP_TTL_MINUTES} minutes.`,
  });

  return { ok: true };
}

export async function verifyEmail({ email, otp }) {
  const result = await verifyOtp({
    identifier: email.toLowerCase(),
    purpose: "email_verification",
    otp,
  });
  if (!result.valid) {
    throw new ApiError(
      400,
      "Invalid verification code",
      "AUTH_EMAIL_VERIFICATION_INVALID",
    );
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user)
    throw new ApiError(404, "Account not found", "AUTH_ACCOUNT_NOT_FOUND");

  user.emailVerifiedAt = new Date();
  user.status = "active";
  await user.save();
  return { ok: true, user: sanitizeUser(user) };
}

export async function requestPhoneVerification(userId, phone) {
  const otp = await issueOtp({
    identifier: phone,
    identifierType: "phone",
    purpose: "phone_verification",
    userId,
  });

  await sendSms({
    to: phone,
    message: `Your oneprofile verification code is ${otp.otp}. It expires in ${env.OTP_TTL_MINUTES} minutes.`,
  });

  return { ok: true };
}

export async function verifyPhone({ phone, otp }) {
  const result = await verifyOtp({
    identifier: phone,
    purpose: "phone_verification",
    otp,
  });
  if (!result.valid) {
    throw new ApiError(
      400,
      "Invalid verification code",
      "AUTH_PHONE_VERIFICATION_INVALID",
    );
  }

  const user = await User.findOne({ phone });
  if (!user)
    throw new ApiError(404, "Account not found", "AUTH_ACCOUNT_NOT_FOUND");

  user.phoneVerifiedAt = new Date();
  user.status = "active";
  await user.save();
  return { ok: true, user: sanitizeUser(user) };
}

export async function linkGoogleAccount({
  userId,
  providerAccountId,
  email,
  metadata = {},
}) {
  const existing = await OAuthAccount.findOne({
    provider: "google",
    providerAccountId,
  });
  if (existing) return existing;
  return OAuthAccount.create({
    userId,
    provider: "google",
    providerAccountId,
    email,
    metadata,
  });
}

export async function loginWithGoogleProfile(
  profile,
  userAgent = "",
  ipAddress = "",
  device = {},
) {
  if (!profile?.email) {
    throw new ApiError(
      400,
      "Google profile is invalid",
      "AUTH_GOOGLE_PROFILE_INVALID",
    );
  }

  let user = await User.findOne({ email: profile.email.toLowerCase() });
  if (!user) {
    user = await User.create({
      name: profile.name || profile.email.split("@")[0],
      firstName: profile.given_name || "",
      lastName: profile.family_name || "",
      email: profile.email.toLowerCase(),
      avatarUrl: profile.picture || "",
      roles: ["user"],
      status: "active",
      emailVerifiedAt: profile.email_verified ? new Date() : null,
    });
  }

  await linkGoogleAccount({
    userId: user._id,
    providerAccountId: profile.sub,
    email: profile.email.toLowerCase(),
    metadata: profile,
  });

  const deviceRecord = await createOrUpdateDevice({
    userId: user._id,
    fingerprint: device.fingerprint || generateSecureToken(8),
    name: device.name || "",
    type: device.type || "web",
    os: device.os || "",
    browser: device.browser || "",
  });

  const refreshToken = generateSecureToken(64);
  const session = await createSession({
    userId: user._id,
    deviceId: deviceRecord._id,
    refreshToken,
    userAgent,
    ipAddress,
    deviceName: deviceRecord.name,
    deviceType: deviceRecord.type,
    os: deviceRecord.os,
    browser: deviceRecord.browser,
    expiresAt: getRefreshTokenExpiresAt(),
  });

  const tokens = buildAuthTokens(user, session._id);
  session.refreshTokenHash = sha256(tokens.refreshToken);
  await session.save();

  return { user: sanitizeUser(user), ...tokens };
}
