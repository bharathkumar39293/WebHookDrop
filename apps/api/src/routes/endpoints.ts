import { Router } from 'express';
import { db } from '../db/client';

const router = Router();

router.post('/', async (req, res) => {
    const { url, secret, label } = req.body;
    if (!url || !secret) {
        return res.status(400).json({ error: 'url and secret are required' });
    }

    try {
        const result = await db.query(
            `INSERT INTO endpoints (url, secret, label) VALUES ($1, $2, $3) RETURNING *`,
            [url, secret, label]
        );
        res.status(201).json(result.rows[0]);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const result = await db.query(`SELECT * FROM endpoints ORDER BY created_at DESC`);
        res.json(result.rows);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
