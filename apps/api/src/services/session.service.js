import { Session } from '../models/Session.js';
import { Device } from '../models/Device.js';
import { sha256 } from '../utils/crypto.js';

export function refreshTokenFingerprint(refreshToken) {
  return sha256(refreshToken);
}

export async function createOrUpdateDevice({ userId, fingerprint, name, type, os, browser }) {
  return Device.findOneAndUpdate(
    { userId, fingerprint },
    {
      $set: {
        name: name || '',
        type: type || 'web',
        os: os || '',
        browser: browser || '',
        lastSeenAt: new Date()
      },
      $setOnInsert: {
        firstSeenAt: new Date()
      }
    },
    { upsert: true, new: true }
  );
}

export async function createSession({
  userId,
  tenantId = null,
  deviceId = null,
  refreshToken,
  userAgent = '',
  ipAddress = '',
  deviceName = '',
  deviceType = 'web',
  os = '',
  browser = '',
  expiresAt
}) {
  return Session.create({
    userId,
    tenantId,
    deviceId,
    refreshTokenHash: refreshTokenFingerprint(refreshToken),
    userAgent,
    ipAddress,
    deviceName,
    deviceType,
    os,
    browser,
    expiresAt
  });
}

export async function rotateSession({ refreshToken, nextRefreshToken, expiresAt }) {
  const refreshTokenHash = refreshTokenFingerprint(refreshToken);
  const session = await Session.findOne({ refreshTokenHash, isRevoked: false, expiresAt: { $gt: new Date() } });
  if (!session) return null;
  session.refreshTokenHash = refreshTokenFingerprint(nextRefreshToken);
  session.expiresAt = expiresAt;
  session.lastUsedAt = new Date();
  await session.save();
  return session;
}

export async function findSessionByRefreshToken(refreshToken) {
  return Session.findOne({ refreshTokenHash: refreshTokenFingerprint(refreshToken), isRevoked: false });
}

export async function revokeSessionByRefreshToken(refreshToken) {
  const session = await findSessionByRefreshToken(refreshToken);
  if (!session) return null;
  session.isRevoked = true;
  session.revokedAt = new Date();
  await session.save();
  return session;
}

export async function revokeAllUserSessions(userId, exceptSessionId = null) {
  const filter = { userId, isRevoked: false };
  if (exceptSessionId) filter._id = { $ne: exceptSessionId };
  return Session.updateMany(filter, { $set: { isRevoked: true, revokedAt: new Date() } });
}

export async function listUserSessions(userId) {
  return Session.find({ userId })
    .select('-refreshTokenHash')
    .sort({ createdAt: -1 })
    .lean();
}
