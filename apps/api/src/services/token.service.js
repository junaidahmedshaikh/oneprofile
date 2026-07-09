import { env } from '../config/env.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { generateSecureToken, sha256 } from '../utils/crypto.js';

export function buildAuthTokens(user, sessionId, tenantId = null, refreshTokenOverride = null) {
  const payload = {
    sub: String(user._id),
    sessionId: String(sessionId),
    tenantId: tenantId ? String(tenantId) : null,
    roles: user.roles || [],
    permissions: user.permissions || []
  };

  const accessToken = signAccessToken(payload);
  const refreshToken = refreshTokenOverride || signRefreshToken({
    ...payload,
    jti: generateSecureToken(12)
  });

  return {
    accessToken,
    refreshToken
  };
}

export function decodeRefreshToken(token) {
  return verifyRefreshToken(token);
}

export function tokenHash(token) {
  return sha256(token);
}

export function getRefreshTokenExpiresAt() {
  const ttl = env.JWT_REFRESH_EXPIRES_IN;
  const match = /^(\d+)([smhd])$/.exec(ttl);
  if (!match) {
    return new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
  }

  const value = Number(match[1]);
  const unit = match[2];
  const multipliers = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
  return new Date(Date.now() + value * multipliers[unit]);
}
