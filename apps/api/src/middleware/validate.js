import { ApiError } from '../utils/apiError.js';

export const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errorDetails = result.error.flatten();
    let customMessage = 'Validation failed';
    if (errorDetails.fieldErrors && Object.keys(errorDetails.fieldErrors).length > 0) {
      const firstField = Object.keys(errorDetails.fieldErrors)[0];
      const firstError = errorDetails.fieldErrors[firstField][0];
      const capitalizedField = firstField.charAt(0).toUpperCase() + firstField.slice(1);
      customMessage = `${capitalizedField}: ${firstError}`;
    }
    return next(new ApiError(400, customMessage, 'VALIDATION_ERROR', errorDetails));
  }
  req.body = result.data;
  return next();
};
