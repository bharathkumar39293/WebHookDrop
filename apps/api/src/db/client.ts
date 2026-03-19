import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

import net from 'net';

const databaseUrl = process.env.DATABASE_URL || 'postgres://user:password@localhost:5434/webhookdrop';

export const db = new Pool({
    connectionString: databaseUrl,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
    // Force IPv4 by manually parsing the URL and passing host/port to net.connect
    stream: () => {
        const url = new URL(databaseUrl);
        return net.connect({
            host: url.hostname,
            port: parseInt(url.port || '5432', 10),
            family: 4
        }) as any;
    }
} as any);
