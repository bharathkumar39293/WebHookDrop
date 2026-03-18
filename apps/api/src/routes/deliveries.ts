import { Router } from 'express';
import { db } from '../db/client';
import { deliveryQueue } from '../queue/delivery.queue';

const router = Router();

// GET /deliveries?page=1&limit=20&status=dead
router.get('/', async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;
    const offset = (page - 1) * limit;

    try {
        let query = `SELECT * FROM deliveries`;
        const params: any[] = [];

        if (status) {
            query += ` WHERE status = $1`;
            params.push(status);
        }

        query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);

        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// POST /deliveries/:id/retry - Manual retry for dead deliveries
router.post('/:id/retry', async (req, res) => {
    const { id } = req.params;

    try {
        // 1. Fetch the delivery and its details
        const deliveryResult = await db.query(
            `SELECT d.*, e.url, e.secret, ev.payload 
       FROM deliveries d
       JOIN endpoints e ON d.endpoint_id = e.id
       JOIN events ev ON d.event_id = ev.id
       WHERE d.id = $1`,
            [id]
        );

        if (deliveryResult.rows.length === 0) {
            return res.status(404).json({ error: 'Delivery not found' });
        }

        const delivery = deliveryResult.rows[0];

        // 2. Reset status to pending and attempt count to 0
        await db.query(
            `UPDATE deliveries SET status = 'pending', attempts = 0, updated_at = NOW() WHERE id = $1`,
            [id]
        );

        // 3. Re-queue the job
        await deliveryQueue.add('send-webhook', {
            deliveryId: delivery.id,
            endpointUrl: delivery.url,
            secret: delivery.secret,
            payload: delivery.payload,
            attempt: 0,
            maxAttempts: delivery.max_attempts
        });

        res.json({ message: 'Delivery re-queued', id });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
