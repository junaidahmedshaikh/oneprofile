import { env } from '../config/env.js';

const cookieBase = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
  path: '/'
};

export function accessTokenCookieOptions() {
  return {
    ...cookieBase,
    maxAge: 1000 * 60 * 15
  };
}

export function refreshTokenCookieOptions() {
  return {
    ...cookieBase,
    maxAge: 1000 * 60 * 60 * 24 * 30
  };
}
