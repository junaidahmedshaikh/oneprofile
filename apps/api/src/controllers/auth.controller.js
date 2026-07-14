import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/apiResponse.js';
import { env } from '../config/env.js';
import {
  registerUser,
  loginWithEmailOrPhone,
  requestOtpLogin,
  verifyOtpLogin,
  refreshSession,
  logoutSession,
  logoutEverywhere,
  me,
  listSessions,
  startForgotPassword,
  resetPassword as resetPasswordService,
  requestEmailVerification as requestEmailVerificationService,
  verifyEmail,
  requestPhoneVerification as requestPhoneVerificationService,
  verifyPhone,
  loginWithGoogleProfile
} from '../services/auth.service.js';
import { getGoogleAuthUrl, exchangeGoogleCode, verifyGoogleIdToken } from '../services/google.service.js';
import { env as runtimeEnv } from '../config/env.js';

function readDevice(req, fallback = {}) {
  return {
    fingerprint: req.body?.device?.fingerprint || req.headers['x-device-fingerprint'] || fallback.fingerprint || '',
    name: req.body?.device?.name || req.headers['x-device-name'] || fallback.name || '',
    type: req.body?.device?.type || req.headers['x-device-type'] || fallback.type || 'web',
    os: req.body?.device?.os || req.headers['x-device-os'] || fallback.os || '',
    browser: req.body?.device?.browser || req.headers['x-device-browser'] || fallback.browser || ''
  };
}

function setAuthCookies(res, { accessToken, refreshToken }) {
  res.cookie(runtimeEnv.ACCESS_TOKEN_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: runtimeEnv.NODE_ENV === 'production',
    sameSite: runtimeEnv.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
    maxAge: 1000 * 60 * 15
  });

  res.cookie(runtimeEnv.REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: runtimeEnv.NODE_ENV === 'production',
    sameSite: runtimeEnv.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 * 30
  });
}

function clearAuthCookies(res) {
  res.clearCookie(runtimeEnv.ACCESS_TOKEN_COOKIE_NAME, { path: '/' });
  res.clearCookie(runtimeEnv.REFRESH_TOKEN_COOKIE_NAME, { path: '/' });
}

export const register = asyncHandler(async (req, res) => {
  const result = await registerUser({
    ...req.body,
    userAgent: req.headers['user-agent'] || '',
    ipAddress: req.ip,
    device: readDevice(req)
  });
  setAuthCookies(res, result);
  return ok(res, {
    message: 'Account created successfully',
    data: {
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      requiresEmailVerification: result.requiresEmailVerification
    },
    statusCode: 201
  });
});

export const login = asyncHandler(async (req, res) => {
  const result = await loginWithEmailOrPhone({
    ...req.body,
    userAgent: req.headers['user-agent'] || '',
    ipAddress: req.ip,
    device: readDevice(req)
  });
  setAuthCookies(res, result);
  return ok(res, { message: 'Login successful', data: { user: result.user, accessToken: result.accessToken, refreshToken: result.refreshToken } });
});

export const otpLoginRequest = asyncHandler(async (req, res) => {
  const data = await requestOtpLogin({ identifier: req.body.identifier });
  return ok(res, { message: 'OTP sent', data });
});

export const otpLoginVerify = asyncHandler(async (req, res) => {
  const result = await verifyOtpLogin({
    ...req.body,
    userAgent: req.headers['user-agent'] || '',
    ipAddress: req.ip,
    device: readDevice(req)
  });
  setAuthCookies(res, result);
  return ok(res, { message: 'OTP verified', data: { user: result.user, accessToken: result.accessToken, refreshToken: result.refreshToken } });
});

export const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.body.refreshToken || req.cookies?.[env.REFRESH_TOKEN_COOKIE_NAME];
  const result = await refreshSession(refreshToken);
  setAuthCookies(res, result);
  return ok(res, { message: 'Session refreshed', data: { user: result.user, accessToken: result.accessToken, refreshToken: result.refreshToken } });
});

export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.body.refreshToken || req.cookies?.[env.REFRESH_TOKEN_COOKIE_NAME];
  await logoutSession(refreshToken);
  clearAuthCookies(res);
  return ok(res, { message: 'Logged out successfully' });
});

export const logoutAll = asyncHandler(async (req, res) => {
  await logoutEverywhere(req.auth.sub, req.auth.sessionId);
  clearAuthCookies(res);
  return ok(res, { message: 'Logged out from all devices' });
});

export const profile = asyncHandler(async (req, res) => {
  const user = await me(req.auth.sub);
  return ok(res, { data: { user } });
});

export const sessions = asyncHandler(async (req, res) => {
  const data = await listSessions(req.auth.sub);
  return ok(res, { data });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const data = await startForgotPassword(req.body);
  return ok(res, { message: 'If the account exists, a reset link has been sent.', data });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const data = await resetPasswordService(req.body);
  return ok(res, { message: 'Password updated successfully', data });
});

export const requestEmailVerification = asyncHandler(async (req, res) => {
  const data = await requestEmailVerificationService(req.auth.sub, req.body.email);
  return ok(res, { message: 'Verification code sent', data });
});

export const confirmEmailVerification = asyncHandler(async (req, res) => {
  const data = await verifyEmail(req.body);
  return ok(res, { message: 'Email verified', data });
});

export const requestPhoneVerification = asyncHandler(async (req, res) => {
  const data = await requestPhoneVerificationService(req.auth.sub, req.body.phone);
  return ok(res, { message: 'Verification code sent', data });
});

export const confirmPhoneVerification = asyncHandler(async (req, res) => {
  const data = await verifyPhone(req.body);
  return ok(res, { message: 'Phone verified', data });
});

export const googleStart = asyncHandler(async (req, res) => {
  const redirectUri = env.GOOGLE_REDIRECT_URI || `${req.protocol}://${req.get('host')}/api/v1/auth/google/callback`;
  const url = getGoogleAuthUrl(redirectUri);
  return ok(res, { data: { url } });
});

export const googleCallback = asyncHandler(async (req, res) => {
  const code = req.query.code || req.body.code;
  const redirectUri = env.GOOGLE_REDIRECT_URI || `${req.protocol}://${req.get('host')}/api/v1/auth/google/callback`;
  const profile = code ? await exchangeGoogleCode(code, redirectUri) : await verifyGoogleIdToken(req.body.idToken || req.query.id_token);
  const result = await loginWithGoogleProfile(profile, req.headers['user-agent'] || '', req.ip, readDevice(req));
  setAuthCookies(res, result);
  return res.redirect(`${runtimeEnv.CLIENT_URL}/dashboard?token=${result.accessToken}&refreshToken=${result.refreshToken}`);
});
