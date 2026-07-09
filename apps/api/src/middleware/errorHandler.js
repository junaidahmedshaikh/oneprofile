import { ApiError } from '../utils/apiError.js';
import { logger } from '../config/logger.js';

export function notFound(_req, _res, next) {
  next(new ApiError(404, 'Route not found', 'NOT_FOUND'));
}

export function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const message = err.message || 'Something went wrong';

  logger.error({
    err,
    requestId: req.id,
    path: req.path,
    method: req.method
  }, 'Request failed');

  res.status(statusCode).json({
    success: false,
    message,
    code,
    details: err.details || null
  });
}
