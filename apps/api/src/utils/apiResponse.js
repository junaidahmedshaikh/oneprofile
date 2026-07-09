export function ok(res, { message = 'OK', data = null, meta = null, statusCode = 200 }) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta
  });
}
