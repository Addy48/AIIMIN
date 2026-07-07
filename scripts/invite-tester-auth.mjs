#!/usr/bin/env node
/**
 * Pre-create Supabase Auth users for tester/dev allowlist emails.
 * Required when Supabase "Enable signups" is OFF — Google OAuth then links to existing users.
 *
 * Usage:
 *   node scripts/invite-tester-auth.mjs
 *   node scripts/invite-tester-auth.mjs aadityaupadhyay10@gmail.com
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import pg from 'pg';
import { resolveDatabaseUrl } from '../server/lib/db.js';

const envPath = process.env.DOTENV_CONFIG_PATH || resolve(process.cwd(), '.env');
const parsed = dotenv.parse(readFileSync(envPath));

const supabaseUrl = parsed.SUPABASE_URL;
const serviceKey = parsed.SUPABASE_SERVICE_ROLE_KEY || parsed.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('❌ SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const DEFAULT_DEVS = ['aadityaupadhyay10@gmail.com'];
const DEFAULT_TESTERS = [
  'aadityaupadhyay85@gmail.com',
  'sanchitbhatia2006@gmail.com',
  'adityamehta298@gmail.com',
  'shishangthakur@icloud.com',
  'kuldeepyadav2911@gmail.com',
];

function parseList(envVar) {
  return (parsed[envVar] || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
}

async function listAllowlistEmails() {
  const cliEmails = process.argv.slice(2).map((e) => e.trim().toLowerCase()).filter(Boolean);
  if (cliEmails.length) return [...new Set(cliEmails)];

  const cs = resolveDatabaseUrl(parsed.DATABASE_URL)
    ?.replace(/([?&])sslmode=[^&]*/g, '$1')
    .replace(/[?&]$/, '')
    .replace(/\?&/, '?');

  if (!cs) {
    const devs = parseList('DEV_EMAILS').length ? parseList('DEV_EMAILS') : DEFAULT_DEVS;
    const testers = parseList('TESTER_EMAILS').length ? parseList('TESTER_EMAILS') : DEFAULT_TESTERS;
    return [...new Set([...devs, ...testers])];
  }

  const pool = new pg.Pool({ connectionString: cs, ssl: { rejectUnauthorized: false } });
  try {
    const { rows } = await pool.query('SELECT lower(email) AS email FROM tester_allowlist ORDER BY email');
    if (rows.length) return rows.map((r) => r.email);
  } finally {
    await pool.end().catch(() => {});
  }

  const devs = parseList('DEV_EMAILS').length ? parseList('DEV_EMAILS') : DEFAULT_DEVS;
  const testers = parseList('TESTER_EMAILS').length ? parseList('TESTER_EMAILS') : DEFAULT_TESTERS;
  return [...new Set([...devs, ...testers])];
}

async function ensureAuthUser(email) {
  const { data: list, error: listErr } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (listErr) throw listErr;

  const existing = list.users.find((u) => u.email?.toLowerCase() === email);
  if (existing) {
    console.log('exists:', email, existing.id);
    return { email, status: 'exists', id: existing.id };
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: { invited_by: 'invite-tester-auth' },
  });

  if (error) {
    console.error('failed:', email, error.message);
    return { email, status: 'error', error: error.message };
  }

  console.log('created:', email, data.user.id);
  return { email, status: 'created', id: data.user.id };
}

async function main() {
  const emails = await listAllowlistEmails();
  console.log(`Inviting ${emails.length} allowlist emails into Supabase Auth…\n`);

  const results = [];
  for (const email of emails) {
    results.push(await ensureAuthUser(email));
  }

  const created = results.filter((r) => r.status === 'created').length;
  const exists = results.filter((r) => r.status === 'exists').length;
  const failed = results.filter((r) => r.status === 'error').length;
  console.log(`\nDone. created=${created} exists=${exists} failed=${failed}`);
  if (failed) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
