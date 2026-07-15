import { OtpChallenge } from '../models/OtpChallenge.js';
import { EmailOtp } from '../models/EmailOtp.js';
import { createOtpChallenge } from '../utils/otp.js';
import { env } from '../config/env.js';
import { sha256 } from '../utils/crypto.js';
import crypto from 'crypto';

export async function issueOtp({ identifier, identifierType, purpose, userId = null, metadata = {} }) {
  await OtpChallenge.deleteMany({ identifier, purpose, usedAt: null, expiresAt: { $gt: new Date() } });

  const { otp, hash } = createOtpChallenge(env.OTP_LENGTH);
  const expiresAt = new Date(Date.now() + env.OTP_TTL_MINUTES * 60 * 1000);

  const challenge = await OtpChallenge.create({
    identifier,
    identifierType,
    purpose,
    userId,
    codeHash: hash,
    expiresAt,
    metadata
  });

  return { challenge, otp };
}

export async function verifyOtp({ identifier, purpose, otp }) {
  const challenge = await OtpChallenge.findOne({
    identifier,
    purpose,
    usedAt: null,
    expiresAt: { $gt: new Date() }
  }).sort({ createdAt: -1 });

  if (!challenge) return { valid: false, reason: 'invalid_or_expired' };
  if (challenge.attempts >= challenge.maxAttempts) return { valid: false, reason: 'too_many_attempts' };

  challenge.attempts += 1;

  if (challenge.codeHash !== sha256(otp)) {
    await challenge.save();
    return { valid: false, reason: 'invalid_code' };
  }

  challenge.usedAt = new Date();
  challenge.verifiedAt = new Date();
  await challenge.save();
  return { valid: true, challenge };
}

// Secure 6-digit cryptographically random OTP generator
export function generateSecureOtp(length = 6) {
  const min = 10 ** (length - 1);
  const max = (10 ** length) - 1;
  return crypto.randomInt(min, max).toString();
}

// new EmailOtp generation flow
export async function generateEmailOtp({ userId = null, email, purpose }) {
  const normalizedEmail = email.toLowerCase().trim();

  // Cooldown check: 60 seconds
  const recentOtp = await EmailOtp.findOne({
    email: normalizedEmail,
    purpose,
    createdAt: { $gt: new Date(Date.now() - 60 * 1000) }
  });

  if (recentOtp) {
    const error = new Error('Please wait 60 seconds before requesting a new code.');
    error.code = 'COOLDOWN';
    throw error;
  }

  // Invalidate previous OTPs
  await EmailOtp.deleteMany({ email: normalizedEmail, purpose });

  const otp = generateSecureOtp(6);
  const otpHash = sha256(otp);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration

  const emailOtp = await EmailOtp.create({
    userId,
    email: normalizedEmail,
    otpHash,
    purpose,
    expiresAt
  });

  return { emailOtp, otp };
}

// new EmailOtp verification flow
export async function verifyEmailOtp({ email, purpose, otp }) {
  const normalizedEmail = email.toLowerCase().trim();

  const challenge = await EmailOtp.findOne({
    email: normalizedEmail,
    purpose,
    expiresAt: { $gt: new Date() }
  }).sort({ createdAt: -1 });

  if (!challenge) {
    return { valid: false, reason: 'invalid_or_expired' };
  }

  if (challenge.attempts >= 5) {
    return { valid: false, reason: 'max_attempts_exceeded' };
  }

  challenge.attempts += 1;
  await challenge.save();

  if (challenge.otpHash !== sha256(otp)) {
    return { valid: false, reason: 'incorrect_otp' };
  }

  // OTP verified successfully - invalidate it so it can't be used again
  await EmailOtp.deleteOne({ _id: challenge._id });
  return { valid: true, challenge };
}

