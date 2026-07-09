import { ApiError } from '../utils/apiError.js';

export const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return next(new ApiError(400, 'Validation failed', 'VALIDATION_ERROR', result.error.flatten()));
  }
  req.body = result.data;
  return next();
};
