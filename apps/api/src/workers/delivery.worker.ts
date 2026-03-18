import { Worker, Job } from 'bullmq';
import axios from 'axios';
import { db } from '../db/client';
import { getBackoffDelay } from '../lib/backoff';
import { signPayload } from '../lib/hmac';
import { redisConnection } from '../lib/redis';

export const deliveryWorker = new Worker('deliveries', async (job: Job) => {
    const { deliveryId, endpointUrl, secret, payload, attempt, maxAttempts } = job.data;
    const body = JSON.stringify(payload);

    try {
        console.log(`[Worker] Attempt ${attempt + 1} for delivery ${deliveryId} to ${endpointUrl}`);

        await axios.post(endpointUrl, body, {
            headers: {
                'Content-Type': 'application/json',
                'X-Webhook-Signature': signPayload(body, secret)
            },
            timeout: 10_000,
        });

        // SUCCESS
        await db.query(
            `UPDATE deliveries SET status='delivered', attempts=$1, updated_at=NOW() WHERE id=$2`,
            [attempt + 1, deliveryId]
        );
        console.log(`[Worker] Delivery ${deliveryId} successful`);
    } catch (err: any) {
        const nextAttempt = attempt + 1;
        console.error(`[Worker] Attempt ${nextAttempt} failed for ${deliveryId}: ${err.message}`);

        if (nextAttempt >= maxAttempts) {
            // DEAD LETTER - No more retries
            await db.query(
                `UPDATE deliveries SET status='dead', attempts=$1, updated_at=NOW(), last_response=$2 WHERE id=$3`,
                [nextAttempt, err.response?.status?.toString() || err.code || 'ERROR', deliveryId]
            );
            console.log(`[Worker] Delivery ${deliveryId} marked as DEAD after ${nextAttempt} attempts`);
        } else {
            // RETRY - Schedule next attempt with delay
            const delay = getBackoffDelay(nextAttempt);

            await db.query(
                `UPDATE deliveries SET status='retrying', attempts=$1, next_retry_at=NOW() + $2 * interval '1 ms', updated_at=NOW(), last_response=$3 WHERE id=$4`,
                [nextAttempt, delay, err.response?.status?.toString() || err.code || 'ERROR', deliveryId]
            );

            // Re-queue the job with updated attempt count and delay
            // We throw the error so BullMQ knows it failed, but we also manually handle the re-queue logic if needed or use BullMQ's native retry.
            // Actually, the guide says: throw err; BullMQ will re-queue with delay.
            // But we need to pass the updated 'attempt' in job data.

            await job.updateData({ ...job.data, attempt: nextAttempt });

            // We use job.moveToDelayed to schedule it precisely with our jittered backoff
            await job.moveToDelayed(Date.now() + delay, job.token);

            return; // Return so BullMQ doesn't try to handle failure for a moved job
        }
    }
}, { connection: redisConnection as any });
