import { createClient, RedisClientType } from 'redis';

let redisClient: RedisClientType | null = null;

export const initRedis = async (): Promise<RedisClientType | null> => {
  try {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

    redisClient = createClient({
      url: redisUrl,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            console.warn('Redis: Max reconnection attempts reached');
            return new Error('Max reconnection attempts reached');
          }
          return Math.min(retries * 100, 3000);
        },
      },
    });

    redisClient.on('error', (err) => {
      console.warn('Redis connection error:', err.message);
    });

    redisClient.on('connect', () => {
      console.log('Redis connected successfully');
    });

    redisClient.on('ready', () => {
      console.log('Redis client ready');
    });

    redisClient.on('end', () => {
      console.log('Redis connection closed');
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    console.warn('Redis not available, caching disabled');
    redisClient = null;
    return null;
  }
};

export const getRedisClient = (): RedisClientType | null => {
  return redisClient;
};

export const closeRedis = async (): Promise<void> => {
  if (redisClient?.isOpen) {
    await redisClient.quit();
    console.log('Redis connection closed gracefully');
  }
};

// Cache helpers
export const cacheGet = async (key: string): Promise<string | null> => {
  if (!redisClient?.isOpen) return null;
  try {
    return await redisClient.get(key);
  } catch {
    return null;
  }
};

export const cacheSet = async (key: string, value: string, ttlSeconds: number = 300): Promise<void> => {
  if (!redisClient?.isOpen) return;
  try {
    await redisClient.setEx(key, ttlSeconds, value);
  } catch (error) {
    console.warn('Cache set error:', error);
  }
};

export const cacheDelete = async (key: string): Promise<void> => {
  if (!redisClient?.isOpen) return;
  try {
    await redisClient.del(key);
  } catch (error) {
    console.warn('Cache delete error:', error);
  }
};

export const cacheDeletePattern = async (pattern: string): Promise<void> => {
  if (!redisClient?.isOpen) return;
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (error) {
    console.warn('Cache delete pattern error:', error);
  }
};

export const cacheExists = async (key: string): Promise<boolean> => {
  if (!redisClient?.isOpen) return false;
  try {
    return (await redisClient.exists(key)) === 1;
  } catch {
    return false;
  }
};

export const cacheTTL = async (key: string): Promise<number> => {
  if (!redisClient?.isOpen) return -1;
  try {
    return await redisClient.ttl(key);
  } catch {
    return -1;
  }
};

export const cacheIncrement = async (key: string): Promise<number> => {
  if (!redisClient?.isOpen) return 0;
  try {
    return await redisClient.incr(key);
  } catch {
    return 0;
  }
};

export const cacheGetSet = async (key: string, value: string, ttlSeconds: number = 300): Promise<string | null> => {
  if (!redisClient?.isOpen) return null;
  try {
    const oldValue = await redisClient.get(key);
    await redisClient.setEx(key, ttlSeconds, value);
    return oldValue;
  } catch {
    return null;
  }
};

export default redisClient;