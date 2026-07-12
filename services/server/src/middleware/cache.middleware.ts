import { Request, Response, NextFunction } from 'express';
import { createClient } from 'redis';

let redisClient: any = null;

// Initialize Redis connection
export const initRedis = async () => {
  try {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    redisClient = createClient({ url: redisUrl });
    
    redisClient.on('error', (err: any) => {
      console.warn('Redis connection error (caching disabled):', err.message);
      redisClient = null;
    });

    redisClient.on('connect', () => {
      console.log('Redis connected successfully');
    });

    await redisClient.connect();
  } catch (error) {
    console.warn('Redis not available, caching disabled');
    redisClient = null;
  }
};

// Cache middleware
export const cacheMiddleware = (duration: number = 300) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Skip cache if Redis is not available
    if (!redisClient?.isOpen) {
      return next();
    }

    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.originalUrl}`;

    try {
      const cachedData = await redisClient.get(key);
      
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        return res.json({
          success: true,
          data: parsedData,
          cached: true,
        });
      }

      // Override res.json to cache the response
      const originalJson = res.json.bind(res);
      res.json = function (body: any) {
        if (res.statusCode === 200 && body?.data) {
          redisClient.setEx(key, duration, JSON.stringify(body.data))
            .catch(() => {});
        }
        return originalJson(body);
      };

      next();
    } catch (error) {
      next();
    }
  };
};

// Clear cache by pattern
export const clearCache = async (pattern: string) => {
  if (!redisClient?.isOpen) return;

  try {
    const keys = await redisClient.keys(`cache:${pattern}`);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (error) {
    console.error('Cache clear error:', error);
  }
};

// Clear specific cache keys
export const clearCacheKeys = {
  vehicles: () => clearCache('*/vehicles*'),
  drivers: () => clearCache('*/drivers*'),
  trips: () => clearCache('*/trips*'),
  maintenance: () => clearCache('*/maintenance*'),
  fuel: () => clearCache('*/fuel*'),
  expenses: () => clearCache('*/expenses*'),
  analytics: () => clearCache('*/analytics*'),
  dispatch: () => clearCache('*/dispatch*'),
  dashboard: () => clearCache('*/analytics/dashboard*'),
  all: () => clearCache('*'),
};

export { redisClient };