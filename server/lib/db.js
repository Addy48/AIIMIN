/**
 * lib/db.js
 * Supabase PostgreSQL via pg Pool.
 * EC2 has no IPv6 — use Supavisor pooler host (IPv4), not db.*.supabase.co (IPv6-only on free tier).
 */
import dns from 'node:dns';
import { resolve } from 'node:path';
import pg from 'pg';
import * as dotenv from 'dotenv';

dns.setDefaultResultOrder('ipv4first');
dotenv.config({ path: resolve(process.cwd(), '.env') });

const { Pool } = pg;

let _pool = null;

/** Rewrite IPv6-only direct host → IPv4 Supavisor pooler when needed */
export function resolveDatabaseUrl(rawUrl) {
    if (!rawUrl) return rawUrl;

    const poolerRegion = process.env.SUPABASE_POOLER_REGION || 'ap-south-1';
    const projectRefMatch = rawUrl.match(/@db\.([a-z0-9]+)\.supabase\.co:(\d+)\//i);
    if (!projectRefMatch) return rawUrl;

    const projectRef = projectRefMatch[1];
    const port = projectRefMatch[2] || '6543';
    let url = rawUrl.replace(
        `@db.${projectRef}.supabase.co:${port}`,
        `@aws-0-${poolerRegion}.pooler.supabase.com:${port}`,
    );

    // Supavisor expects username.projectref for non-postgres roles
    const userMatch = url.match(/^postgres(?:ql)?:\/\/([^:@]+):/);
    if (userMatch && userMatch[1] !== 'postgres' && !userMatch[1].includes('.')) {
        url = url.replace(
            `://${userMatch[1]}:`,
            `://${userMatch[1]}.${projectRef}:`,
        );
    } else if (userMatch?.[1] === 'postgres') {
        url = url.replace('://postgres:', `://postgres.${projectRef}:`);
    }

    if (!url.includes('pgbouncer=true')) {
        url += url.includes('?') ? '&pgbouncer=true' : '?pgbouncer=true';
    }

    return url;
}

export const getPool = () => {
    if (_pool) return _pool;

    let connectionString = resolveDatabaseUrl(process.env.DATABASE_URL);
    if (!connectionString) {
        const msg = '[DB] FATAL: DATABASE_URL is not set. Cannot initialize database pool.';
        console.error(msg);
        throw new Error(msg);
    }

    if (!connectionString.startsWith('postgres://') && !connectionString.startsWith('postgresql://')) {
        const msg = `[DB] FATAL: DATABASE_URL is malformed. Got: ${connectionString.slice(0, 30)}...`;
        console.error(msg);
        throw new Error(msg);
    }

    // pg v8+ treats sslmode=require as verify-full — breaks Supavisor on EC2
    connectionString = connectionString
        .replace(/([?&])sslmode=[^&]*/g, '$1')
        .replace(/[?&]$/, '')
        .replace(/\?&/, '?');

    const hostPrefix = connectionString.split('@')[1]?.slice(0, 48) ?? 'unknown';
    console.log(`[DB] Initializing pool. Host: ${hostPrefix}`);

    _pool = new Pool({
        connectionString,
        ssl: { rejectUnauthorized: false },
        max: 2,
        min: 0,
        idleTimeoutMillis: 5000,
        connectionTimeoutMillis: 10000,
        allowExitOnIdle: true,
    });

    _pool.on('error', (err) => {
        console.error('[DB Pool] Unexpected client error:', err.message);
        _pool = null;
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
