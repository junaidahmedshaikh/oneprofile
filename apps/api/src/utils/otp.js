import { generateSecureToken, sha256 } from './crypto.js';

export function generateOtp(length = 6) {
  const max = 10 ** length;
  const value = `${Math.floor(Math.random() * max)}`.padStart(length, '0');
  return value;
}

export function createOtpChallenge(length = 6) {
  const otp = generateOtp(length);
  return {
    otp,
    hash: sha256(otp),
    token: generateSecureToken(24)
  };
}
