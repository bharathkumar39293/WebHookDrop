import { Queue } from 'bullmq';
import dotenv from 'dotenv';
dotenv.config();

const connection = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6381', 10),
};

export const deliveryQueue = new Queue('deliveries', { connection });
