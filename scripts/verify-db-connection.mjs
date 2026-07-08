#!/usr/bin/env node
/**
 * Verify Supabase DB connection from .env (local or EC2).
 * Usage:
 *   node scripts/verify-db-connection.mjs
 *   DOTENV_CONFIG_PATH=/home/ubuntu/AIIMIN/.env node scripts/verify-db-connection.mjs
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import pg from 'pg';
import dotenv from 'dotenv';
import { resolveDatabaseUrl } from '../server/lib/db.js';

const envPath = process.env.DOTENV_CONFIG_PATH || resolve(process.cwd(), '.env');
if (!existsSync(envPath)) {
  console.error(`❌ .env not found at ${envPath}`);
  process.exit(1);
}

const parsed = dotenv.parse(readFileSync(envPath));
const raw = parsed.DATABASE_URL;
if (!raw) {
  console.error('❌ DATABASE_URL is not set in .env');
  process.exit(1);
}

const connectionString = resolveDatabaseUrl(raw)
  .replace(/([?&])sslmode=[^&]*/g, '$1')
  .replace(/[?&]$/, '')
  .replace(/\?&/, '?');

const safeHost = connectionString.split('@')[1]?.split('/')[0] ?? 'unknown';
const dbUser = connectionString.match(/^postgres(?:ql)?:\/\/([^:@]+)/)?.[1] ?? 'unknown';

console.log('Checking DATABASE_URL...');
console.log(`  user: ${dbUser}`);
console.log(`  host: ${safeHost}`);

const pool = new pg.Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000,
});

try {
  const { rows } = await pool.query('SELECT 1 AS ok, current_user, current_database()');
  console.log('\n✅ Database connection OK');
  console.log(`   user: ${rows[0].current_user}`);
  console.log(`   database: ${rows[0].current_database}`);

  const { rows: countRows } = await pool.query(
    'SELECT COUNT(*)::int AS n FROM waitlist_emails',
  ).catch(() => ({ rows: [{ n: null }] }));
  if (countRows[0].n !== null) {
    console.log(`   waitlist_emails rows: ${countRows[0].n}`);
  }

  process.exit(0);
} catch (err) {
  console.error('\n❌ Database connection FAILED');
  console.error(`   ${err.message}`);
  if (err.message.includes('tenant/user')) {
    console.error('   → Wrong pooler host. Use aws-1-ap-south-1 (not aws-0). Copy from Supabase Connect.');
  }
  if (err.message.includes('password authentication')) {
    console.error('   → Wrong password. Reset in Supabase → Database → Reset password.');
  }
  process.exit(1);
} finally {
  await pool.end().catch(() => {});
}
