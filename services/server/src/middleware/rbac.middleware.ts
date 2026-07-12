import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(403, `Access denied. Required role: ${allowedRoles.join(' or ')}`)
      );
    }

    next();
  };
};

export const authorizeSelfOrRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required'));
    }

    if (roles.includes(req.user.role) || req.user.id === req.params.id) {
      return next();
    }

    return next(new ApiError(403, 'Access denied'));
  };
};