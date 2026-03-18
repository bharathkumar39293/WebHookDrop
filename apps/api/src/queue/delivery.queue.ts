import { Queue } from 'bullmq';
import dotenv from 'dotenv';
dotenv.config();

const connection = process.env.REDIS_URL || {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6381', 10),
    password: process.env.REDIS_PASSWORD,
};

export const deliveryQueue = new Queue('deliveries', { connection: connection as any });
