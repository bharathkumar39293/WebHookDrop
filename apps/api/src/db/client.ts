import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

import net from 'net';

export const db = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgres://user:password@localhost:5434/webhookdrop',
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
    // Force IPv4 because Render/Supabase IPv6 can be unreliable on some tiers
    // We cast to any to satisfy the complex 'stream' type in node-postgres
    stream: (options: any) => net.connect({ ...options, family: 4 }) as any
} as any);
