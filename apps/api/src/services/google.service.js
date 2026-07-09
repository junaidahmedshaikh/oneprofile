import { OAuth2Client } from 'google-auth-library';
import { env } from '../config/env.js';
import { ApiError } from '../utils/apiError.js';

const client = env.GOOGLE_CLIENT_ID
  ? new OAuth2Client(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET, env.GOOGLE_REDIRECT_URI)
  : null;

export function getGoogleAuthUrl() {
  if (!client) {
    throw new ApiError(500, 'Google OAuth is not configured', 'GOOGLE_OAUTH_NOT_CONFIGURED');
  }

  return client.generateAuthUrl({
    access_type: 'offline',
    scope: ['openid', 'email', 'profile'],
    prompt: 'consent'
  });
}

export async function verifyGoogleIdToken(idToken) {
  if (!client) {
    throw new ApiError(500, 'Google OAuth is not configured', 'GOOGLE_OAUTH_NOT_CONFIGURED');
  }

  const ticket = await client.verifyIdToken({
    idToken,
    audience: env.GOOGLE_CLIENT_ID
  });

  return ticket.getPayload();
}

export async function exchangeGoogleCode(code) {
  if (!client) {
    throw new ApiError(500, 'Google OAuth is not configured', 'GOOGLE_OAUTH_NOT_CONFIGURED');
  }

  const { tokens } = await client.getToken(code);
  if (!tokens.id_token) {
    throw new ApiError(400, 'Google token exchange failed', 'AUTH_GOOGLE_EXCHANGE_FAILED');
  }

  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token,
    audience: env.GOOGLE_CLIENT_ID
  });

  return ticket.getPayload();
}
