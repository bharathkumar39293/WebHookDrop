import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import endpointsRouter from './routes/endpoints';
import eventsRouter from './routes/events';
import deliveriesRouter from './routes/deliveries';
import chaosRouter from './routes/chaos';
import './workers/delivery.worker'; // Import worker to start it up

const app = express();

console.log('--- WebhookDrop Startup ---');
console.log('DB URL:', process.env.DATABASE_URL ? `${process.env.DATABASE_URL.substring(0, 15)}...` : 'NOT SET (using local default)');
console.log('Redis URL:', process.env.REDIS_URL ? `${process.env.REDIS_URL.substring(0, 15)}...` : 'NOT SET (using local default)');
console.log('---------------------------');

app.use(cors());
app.use(express.json());

app.use('/endpoints', endpointsRouter);
app.use('/events', eventsRouter);
app.use('/deliveries', deliveriesRouter);
app.use('/chaos', chaosRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
});
