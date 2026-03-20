import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

import net from 'net';

const databaseUrl = process.env.DATABASE_URL || 'postgres://user:password@localhost:5434/webhookdrop';

export const db = new Pool({
    connectionString: databaseUrl,
    ssl: databaseUrl.includes('localhost') ? false : { rejectUnauthorized: false },
});
