/**
 * lib/db.js
 * Supabase PostgreSQL via pg Pool — optimized for Vercel Serverless.
 * Uses the Supabase IPv4 transaction pooler (port 6543).
 */
import pg from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

let _pool = null;

export const getPool = () => {
    if (_pool) return _pool;

    let connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        const msg = '[DB] FATAL: DATABASE_URL is not set. Cannot initialize database pool.';
        console.error(msg);
        throw new Error(msg);
    }

    // Validate it looks like a postgres URL before trying to connect
    if (!connectionString.startsWith('postgres://') && !connectionString.startsWith('postgresql://')) {
        const msg = `[DB] FATAL: DATABASE_URL is malformed. Got: ${connectionString.slice(0, 30)}...`;
        console.error(msg);
        throw new Error(msg);
    }

    console.log(`[DB] Initializing pool. Host prefix: ${connectionString.split('@')[1]?.slice(0, 40) ?? 'unknown'}`);

    _pool = new Pool({
        connectionString,
        ssl: { rejectUnauthorized: false },
        max: 2,
        min: 0,
        idleTimeoutMillis: 5000,
        connectionTimeoutMillis: 5000,
        allowExitOnIdle: true,
    });

    _pool.on('error', (err) => {
        console.error('[DB Pool] Unexpected client error:', err.message);
        _pool = null; // Force recreation on next call
    });

    _pool.on('connect', () => {
        console.log('[DB Pool] New client connected');
    });

    return _pool;
};

// Lazy proxy — pool only created on first actual query call
export const pool = new Proxy({}, {
    get: (target, prop) => {
        const activePool = getPool();
        const val = activePool[prop];
        return typeof val === 'function' ? val.bind(activePool) : val;
    }
});

export default pool;
