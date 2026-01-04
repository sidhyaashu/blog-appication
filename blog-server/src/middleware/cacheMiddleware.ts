import type { Request, Response, NextFunction } from 'express';
import redis from '../config/redis.js';
import logger from '../config/logger.js';

// Cache duration in seconds (e.g., 1 hour)
const DEFAULT_EXPIRATION = 3600;

export const cacheMiddleware = (duration: number = DEFAULT_EXPIRATION) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // Skip if Redis is not connected
        if (!redis) {
            return next();
        }

        // Skip for non-GET requests
        if (req.method !== 'GET') {
            return next();
        }

        const key = `cache:${req.originalUrl || req.url}`;

        try {
            const cachedData = await redis.get(key);
            if (cachedData) {
                logger.info(`Cache hit for ${key}`);
                return res.json(JSON.parse(cachedData));
            }

            // If not cached, we need to intercept the response securely
            // But modifying res.send/res.json is tricky in strict TS/Express middleware
            // A simpler approach for this "implementation plan" phase to allow progress:
            // We'll attach a helper to the request or just let controllers handle setting cache explicitly 
            // OR use a wrapper.

            // Standard approach: Overload res.send/json
            const originalJson = res.json;
            res.json = (body: any): Response => {
                redis?.setex(key, duration, JSON.stringify(body)).catch(err => {
                    logger.error('Redis setex error:', err);
                });
                return originalJson.call(res, body);
            };

            next();
        } catch (error) {
            logger.error('Redis cache middleware error:', error);
            next();
        }
    };
};

export const clearCache = async (pattern: string) => {
    if (!redis) return;
    try {
        const keys = await redis.keys(`cache:${pattern}*`);
        if (keys.length > 0) {
            await redis.del(keys);
            logger.info(`Cleared cache for keys matching ${pattern}`);
        }
    } catch (error) {
        logger.error('Redis clear cache error:', error);
    }
};
