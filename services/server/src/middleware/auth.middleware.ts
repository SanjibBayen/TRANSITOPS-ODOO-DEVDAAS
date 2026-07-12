import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { ApiError } from '../utils/ApiError';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
        name: string;
      };
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      throw new ApiError(401, 'No token provided. Please login.');
    }

    const token = authHeader.split(' ')[1];

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      throw new ApiError(401, 'Invalid or expired token');
    }

    req.user = {
      id: user.id,
      email: user.email!,
      role: user.user_metadata?.role || 'DRIVER',
      name: user.user_metadata?.name || user.email!,
    };

    next();
  } catch (error) {
    next(error instanceof ApiError ? error : new ApiError(401, 'Authentication failed'));
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, 'Not authenticated'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, `Access denied. Required role: ${roles.join(' or ')}`));
    }

    next();
  };
};