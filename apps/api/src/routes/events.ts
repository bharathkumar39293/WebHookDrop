import { Router } from 'express';
import { db } from '../db/client';
import { deliveryQueue } from '../queue/delivery.queue';

const router = Router();

router.post('/', async (req, res) => {
    const { payload } = req.body;

    if (!payload || typeof payload !== 'object') {
        return res.status(400).json({ error: 'payload must be a JSON object' });
    }

    try {
        // 1. Insert Event
        const eventResult = await db.query(
            `INSERT INTO events (payload) VALUES ($1) RETURNING id`,
            [payload]
        );
        const eventId = eventResult.rows[0].id;

        // 2. Fetch all registered endpoints
        const endpointsResult = await db.query(`SELECT id, url, secret FROM endpoints`);
        const endpoints = endpointsResult.rows;

        let deliveryCount = 0;

        // 3. Create Deliveries and Enqueue Jobs
        for (const endpoint of endpoints) {
            const deliveryResult = await db.query(
                `INSERT INTO deliveries (event_id, endpoint_id, status) VALUES ($1, $2, 'pending') RETURNING id`,
                [eventId, endpoint.id]
            );
            const deliveryId = deliveryResult.rows[0].id;

            await deliveryQueue.add('send-webhook', {
                deliveryId,
                endpointUrl: endpoint.url,
                secret: endpoint.secret,
                payload,
                attempt: 0,
                maxAttempts: 5
            });
            deliveryCount++;
        }

        res.status(202).json({ id: eventId, deliveryCount });
    } catch (err: any) {
        console.error('Error in /events:', err);
        res.status(500).json({ error: err.message, detail: err.detail });
    }
});

export default router;
