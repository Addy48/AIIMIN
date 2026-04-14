/**
 * lib/db.js
 * 
 * Central database pool (M-1 fix: extracted from googleClient.js).
 * All route files should import pool from here.
 */
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
});

pool.on('error', (err) => {
    console.error('[DB Pool] Unexpected error on idle client:', err);
});

export { pool };
export default pool;
