import { Queue } from 'bullmq';
import { redisConnection } from '../lib/redis';

export const deliveryQueue = new Queue('deliveries', {
    connection: redisConnection as any
});
