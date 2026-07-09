import { ApiError } from '../utils/apiError.js';

export function authorizeRoles(...roles) {
  return (req, _res, next) => {
    const userRoles = req.auth?.roles || [];
    if (!roles.some((role) => userRoles.includes(role))) {
      return next(new ApiError(403, 'Insufficient role permissions', 'AUTH_FORBIDDEN'));
    }
    return next();
  };
}

export function authorizePermissions(...permissions) {
  return (req, _res, next) => {
    const userPermissions = req.auth?.permissions || [];
    if (!permissions.every((permission) => userPermissions.includes(permission))) {
      return next(new ApiError(403, 'Insufficient permissions', 'AUTH_FORBIDDEN'));
    }
    return next();
  };
}
