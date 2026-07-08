#!/usr/bin/env node
/**
 * Find the correct Supavisor pooler host for this project.
 * Usage: node scripts/probe-supabase-pooler.mjs
 * Reads password from DATABASE_URL in .env (or EC2 .env path via DOTENV_CONFIG_PATH).
 */
import 'dotenv/config';
import pg from 'pg';

const PROJECT_REF = 'yubxgftugxbwtywyhcsv';
const REGION = process.env.SUPABASE_POOLER_REGION || 'ap-south-1';

function parsePasswordFromUrl(url) {
  if (!url) return null;
  const m = url.match(/^postgres(?:ql)?:\/\/[^:]+:([^@]+)@/);
  return m ? decodeURIComponent(m[1]) : null;
}

const password = parsePasswordFromUrl(process.env.DATABASE_URL);
if (!password) {
  console.error('Set DATABASE_URL in .env first (with password).');
  process.exit(1);
}

const shards = ['aws-0', 'aws-1', 'aws-2'];
const ports = [
  { port: 5432, mode: 'session' },
  { port: 6543, mode: 'transaction' },
];

console.log(`Probing pooler for ${PROJECT_REF} in ${REGION}...\n`);

for (const shard of shards) {
  for (const { port, mode } of ports) {
    const host = `${shard}-${REGION}.pooler.supabase.com`;
    const user = `postgres.${PROJECT_REF}`;
    const url = `postgresql://${user}:${encodeURIComponent(password)}@${host}:${port}/postgres`;
    const pool = new pg.Pool({
      connectionString: url,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 8000,
    });
    try {
      await pool.query('SELECT 1 AS ok');
      console.log(`✅ WORKS  ${mode.padEnd(11)} ${host}:${port}`);
      console.log(`\nUse this DATABASE_URL in EC2 .env:`);
      console.log(`DATABASE_URL=postgresql://${user}:YOUR_URL_ENCODED_PASSWORD@${host}:${port}/postgres`);
      await pool.end();
      process.exit(0);
    } catch (err) {
      console.log(`❌ FAIL   ${mode.padEnd(11)} ${host}:${port} — ${err.message.slice(0, 70)}`);
    } finally {
      await pool.end().catch(() => {});
    }
  }
}

console.log('\nNo pooler host worked. Reset DB password in Supabase Dashboard → Database → Reset password, then update .env.');
process.exit(1);
