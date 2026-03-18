import IORedis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

const redisUrl = process.env.REDIS_URL;

export const redisConnection = redisUrl
    ? new IORedis(redisUrl, {
        maxRetriesPerRequest: null,
        // For Upstash TLS might be required, ioredis handles it via rediss://
    })
    : new IORedis({
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6381', 10),
        password: process.env.REDIS_PASSWORD,
        maxRetriesPerRequest: null,
    });

redisConnection.on('error', (err) => {
    console.error('Redis Connection Error:', err.message);
});

redisConnection.on('connect', () => {
    console.log('✅ Connected to Redis successfully');
});
