#!/usr/bin/env node
/**
 * Seed dev + tester emails into tester_allowlist.
 *
 * Usage:
 *   node scripts/seed-access-allowlist.mjs
 *   DEV_EMAILS=a@x.com TESTER_EMAILS=t1@x.com node scripts/seed-access-allowlist.mjs
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import pg from 'pg';
import dotenv from 'dotenv';
import { resolveDatabaseUrl } from '../server/lib/db.js';

const envPath = process.env.DOTENV_CONFIG_PATH || resolve(process.cwd(), '.env');
const parsed = dotenv.parse(readFileSync(envPath));
const connectionString = resolveDatabaseUrl(parsed.DATABASE_URL)
  ?.replace(/([?&])sslmode=[^&]*/g, '$1')
  .replace(/[?&]$/, '')
  .replace(/\?&/, '?');

if (!connectionString) {
  console.error('❌ DATABASE_URL missing');
  process.exit(1);
}

const { Pool } = pg;
const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });

const DEFAULT_DEVS = ['aadityaupadhyay10@gmail.com'];
const DEFAULT_TESTERS = [
  'aadityaupadhyay85@gmail.com',
  'sanchitbhatia2006@gmail.com',
  'adityamehta298@gmail.com',
  'shishangthakur@icloud.com',
];

function parseList(envVar) {
  return (process.env[envVar] || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
}

async function upsertAllowlist(email, role, tier = 'elite') {
  const updated = await pool.query(
    `UPDATE tester_allowlist SET role = $2, tier = $3 WHERE lower(email) = lower($1)`,
    [email, role, tier],
  );
  if (updated.rowCount === 0) {
    await pool.query(
      `INSERT INTO tester_allowlist (email, role, tier) VALUES ($1, $2, $3)`,
      [email, role, tier],
    );
  }
}

async function main() {
  const devs = parseList('DEV_EMAILS').length ? parseList('DEV_EMAILS') : DEFAULT_DEVS;
  const testers = parseList('TESTER_EMAILS').length ? parseList('TESTER_EMAILS') : DEFAULT_TESTERS;

  for (const email of devs) {
    await upsertAllowlist(email, 'dev');
    console.log('dev:', email);
  }

  for (const email of testers) {
    await upsertAllowlist(email, 'tester');
    console.log('tester:', email);
  }

  const { rows } = await pool.query(
    'SELECT email, role, tier FROM tester_allowlist ORDER BY role, email',
  );
  console.log('\nAllowlist rows:', rows.length);
  await pool.end();
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
