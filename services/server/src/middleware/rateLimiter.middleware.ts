import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitEntry>();

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetTime < now) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

export const rateLimiter = (windowMs: number = 60000, maxRequests: number = 100) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const entry = store.get(key);

    if (!entry || entry.resetTime < now) {
      store.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (entry.count >= maxRequests) {
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
      res.set('Retry-After', String(retryAfter));
      throw new ApiError(429, `Too many requests. Try again in ${retryAfter}s`);
    }

    entry.count++;
    return next();
  };
};

export const authLimiter = rateLimiter(60000, 10);
export const apiLimiter = rateLimiter(60000, 200);
export const strictLimiter = rateLimiter(60000, 30);