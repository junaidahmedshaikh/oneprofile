import { OtpChallenge } from '../models/OtpChallenge.js';
import { createOtpChallenge } from '../utils/otp.js';
import { env } from '../config/env.js';
import { sha256 } from '../utils/crypto.js';

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
