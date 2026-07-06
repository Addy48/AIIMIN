#!/usr/bin/env node
/**
 * Seed dev + tester emails into tester_allowlist.
 *
 * Usage:
 *   node scripts/seed-access-allowlist.mjs
 *   DEV_EMAILS=a@x.com TESTER_EMAILS=t1@x.com node scripts/seed-access-allowlist.mjs
 *
 * Defaults (when env empty) match deploy/.env.production.example.
 * Future tester slots — add to TESTER_EMAILS or uncomment below:
 *   tester5@example.com, tester6@example.com, tester7@example.com
 */
import pg from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

const DEFAULT_DEVS = ['aadityaupadhyay10@gmail.com'];
const DEFAULT_TESTERS = [
  'aadityaupadhyay85@gmail.com',
  'sanchitbhatia2006@gmail.com',
  'adityamehta298@gmail.com',
  'shishangthakur@icloud.com',
  // Reserved slots for future testers:
  // 'tester5@example.com',
  // 'tester6@example.com',
  // 'tester7@example.com',
];

function parseList(envVar) {
  return (process.env[envVar] || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
}

async function main() {
  const devs = parseList('DEV_EMAILS').length ? parseList('DEV_EMAILS') : DEFAULT_DEVS;
  const testers = parseList('TESTER_EMAILS').length ? parseList('TESTER_EMAILS') : DEFAULT_TESTERS;

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

  for (const email of devs) {
    await upsertAllowlist(email, 'dev');
    console.log('dev:', email);
  }

  for (const email of testers) {
    await upsertAllowlist(email, 'tester');
    console.log('tester:', email);
  }

  await pool.end();
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
