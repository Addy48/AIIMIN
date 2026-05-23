/**
 * lib/db.js
 * Central database connector — Neon PostgreSQL via pg Pool.
 * Supabase has been fully removed. Use pool.query() everywhere.
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
        max: 5,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 20000,
    });

    _pool.on('error', (err) => {
        console.error('[DB Pool] Unexpected error on idle client:', err.message);
    });

    return _pool;
};

// Lazy proxy so pool is only created on first use
export const pool = new Proxy({}, {
    get: (target, prop) => {
        const activePool = getPool();
        const val = activePool[prop];
        return typeof val === 'function' ? val.bind(activePool) : val;
    }
});

export default pool;
