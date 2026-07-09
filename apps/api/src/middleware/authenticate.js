import { ApiError } from '../utils/apiError.js';
import { verifyAccessToken } from '../utils/jwt.js';
import { env } from '../config/env.js';

export function authenticate(req, _res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : req.cookies?.[env.ACCESS_TOKEN_COOKIE_NAME];

  if (!token) {
    return next(new ApiError(401, 'Authentication required', 'AUTH_REQUIRED'));
  }

  try {
    req.auth = verifyAccessToken(token);
    return next();
  } catch {
    return next(new ApiError(401, 'Invalid or expired token', 'AUTH_INVALID_TOKEN'));
  }
}
