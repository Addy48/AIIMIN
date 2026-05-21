/**
 * lib/db.js
 * Central database connector — Neon PostgreSQL via pg Pool.
 * Optimized for Vercel Serverless (short-lived function instances).
 */
import pg from 'pg';

const { Pool } = pg;

let _pool = null;

const getPool = () => {
    if (_pool) return _pool;

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error('DATABASE_URL environment variable is not set');
    }

    _pool = new Pool({
        connectionString,
        ssl: { rejectUnauthorized: false },
        // Serverless-optimized: keep connections small and fast
        max: 2,
        min: 0,
        idleTimeoutMillis: 5000,         // Release idle connections quickly
        connectionTimeoutMillis: 5000,   // Fail fast — must stay well under Vercel 10s limit
        allowExitOnIdle: true,           // Let Node exit between invocations
    });

    _pool.on('error', (err) => {
        console.error('[DB Pool] Client error:', err.message);
        _pool = null; // Reset pool on error so it's recreated fresh
    });

    return _pool;
};

// Lazy proxy — pool only created on first query
export const pool = new Proxy({}, {
    get: (target, prop) => {
        const activePool = getPool();
        const val = activePool[prop];
        return typeof val === 'function' ? val.bind(activePool) : val;
    }
});

export default pool;
