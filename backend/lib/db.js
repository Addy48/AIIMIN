/**
 * lib/db.js
 * 
 * Central database connector for Cloudflare Workers & AWS Lambda.
 * Optimized with connection pooling for serverless architectures (Neon pg).
 */
import { createClient } from '@supabase/supabase-js';
import pg from 'pg';

const { Pool } = pg;

let _supabase = null;
let _pool = null;

const getSupabase = () => {
    if (_supabase) return _supabase;

    const url = globalThis.process?.env?.SUPABASE_URL || process.env.SUPABASE_URL;
    const key = globalThis.process?.env?.SUPABASE_SERVICE_ROLE_KEY || globalThis.process?.env?.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        return null;
    }
    
    _supabase = createClient(url, key);
    return _supabase;
};

const getPool = () => {
    if (_pool) return _pool;

    const connectionString = globalThis.process?.env?.DATABASE_URL || process.env.DATABASE_URL;
    if (!connectionString) {
        return null;
    }

    _pool = new Pool({
        connectionString,
        ssl: { rejectUnauthorized: false },
        max: 5,                  // Keep pool size small for AWS Lambda instances
        idleTimeoutMillis: 15000, // Release connections quickly
        connectionTimeoutMillis: 5000,
    });

    _pool.on('error', (err) => {
        console.error('[DB Pool] Unexpected error on idle client:', err);
    });

    return _pool;
};

// Export as a getter proxy to maintain the 'import { supabase }' syntax
export const supabase = new Proxy({}, {
    get: (target, prop) => {
        const client = getSupabase();
        if (!client) {
            throw new Error(`Supabase client not initialized. Missing env vars? Attempted to access: ${prop}`);
        }
        return client[prop];
    }
});

// Export as a getter proxy to maintain the 'import { pool }' syntax
export const pool = new Proxy({}, {
    get: (target, prop) => {
        const activePool = getPool();
        if (!activePool) {
            throw new Error(`Database Pool not initialized. Missing DATABASE_URL? Attempted to access: ${prop}`);
        }
        return activePool[prop];
    }
});

export const supabaseAdmin = supabase;
export default supabase;


