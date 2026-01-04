import Redis from 'ioredis';
import dotenv from 'dotenv';
import logger from './logger.js';

dotenv.config();

const redisUrl = process.env.UPSTASH_REDIS_URL;

let redis: Redis | null = null;

if (redisUrl) {
    redis = new Redis(redisUrl);

    redis.on('connect', () => {
        logger.info('Connected to Redis');
    });

    redis.on('error', (err) => {
        logger.error('Redis connection error:', err);
    });
} else {
    logger.warn('UPSTASH_REDIS_URL not found in environment variables. Caching disabled.');
}

export default redis;
