import { Router } from 'express';

const router = Router();

/**
 * Chaos Simulator Route
 * Randomly returns 500 based on failRate parameter (0.0 to 1.0)
 * Example: /chaos?failRate=0.6 will fail 60% of the time.
 */
router.post('/', (req, res) => {
    const failRate = parseFloat(req.query.failRate as string) || 0.5;
    const rand = Math.random();

    if (rand < failRate) {
        console.log(`[Chaos] Simulating failure (rate: ${failRate}, rand: ${rand.toFixed(2)})`);
        return res.status(500).json({ error: 'Chaos Simulator: Random Failure' });
    }

    res.status(200).json({ message: 'Chaos Simulator: Success' });
});

export default router;
