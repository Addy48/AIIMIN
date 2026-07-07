#!/usr/bin/env node
/**
 * Read-only launch checklist verifier (LC-04, LC-07 partial, health).
 *
 * Usage:
 *   node scripts/launch-verify.mjs
 *   API_URL=https://api.aiimin.in/api node scripts/launch-verify.mjs
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import { resolveDatabaseUrl } from '../server/lib/db.js';
import { isEmailConfigured, getEmailProvider } from '../server/lib/email.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const API_URL = (process.env.API_URL || process.env.REACT_APP_API_URL || 'https://api.aiimin.in/api').replace(/\/$/, '');
const FRONTEND_URL = process.env.PROD_FRONTEND_URL || 'https://www.aiimin.in';

const EC2_REQUIRED = [
  'DATABASE_URL',
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'RESEND_API_KEY',
  'RESEND_FROM_EMAIL',
  'OWNER_NOTIFY_EMAIL',
  'WAITLIST_MODE',
  'CRON_SECRET',
  'NODE_ENV',
  'FRONTEND_URL',
];

const VERCEL_REQUIRED = [
  'REACT_APP_SUPABASE_URL',
  'REACT_APP_SUPABASE_ANON_KEY',
  'REACT_APP_API_URL',
  'REACT_APP_WAITLIST_MODE',
];

const OPTIONAL = [
  'REACT_APP_GA_MEASUREMENT_ID',
  'REACT_APP_SENTRY_DSN',
  'SENTRY_DSN',
  'RESEND_WAITLIST_TEMPLATE_ID',
  'WAITLIST_MEMBER_OFFSET',
  'WAITLIST_DISPLAY_CAP',
];

function pass(msg) {
  console.log(`  ✅ ${msg}`);
}

function fail(msg) {
  console.log(`  ❌ ${msg}`);
}

function warn(msg) {
  console.log(`  ⚠️  ${msg}`);
}

function checkEnv(keys, label) {
  console.log(`\n## ${label}`);
  let ok = true;
  for (const key of keys) {
    const val = process.env[key];
    if (val && String(val).trim()) {
      pass(`${key} set`);
    } else {
      fail(`${key} missing`);
      ok = false;
    }
  }
  return ok;
}

async function fetchJson(url, options = {}) {
  const res = await fetch(url, { ...options, signal: AbortSignal.timeout(15000) });
  const text = await res.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = text.slice(0, 200);
  }
  return { status: res.status, body };
}

async function checkApi() {
  console.log('\n## Production API');
  try {
    const health = await fetchJson(`${API_URL}/health`);
    if (health.status === 200 && health.body?.status === 'ok') {
      pass(`GET ${API_URL}/health → 200`);
    } else {
      fail(`GET /health → ${health.status}`);
    }

    const count = await fetchJson(`${API_URL}/waitlist/count`);
    if (count.status === 200) {
      pass(`GET /waitlist/count → ${count.body?.count ?? JSON.stringify(count.body)}`);
    } else {
      fail(`GET /waitlist/count → ${count.status}`);
    }
  } catch (err) {
    fail(`API unreachable: ${err.message}`);
  }
}

async function checkFrontend() {
  console.log('\n## Production frontend');
  try {
    const res = await fetch(FRONTEND_URL, { signal: AbortSignal.timeout(15000) });
    if (res.status === 200) {
      pass(`${FRONTEND_URL} → 200`);
    } else {
      fail(`${FRONTEND_URL} → ${res.status}`);
    }
    const html = await res.text();
    if (html.includes('AIIMIN_logo')) {
      pass('Arch Bracket logo asset referenced');
    } else {
      warn('AIIMIN_logo not found in HTML (may be bundled)');
    }
  } catch (err) {
    fail(`Frontend unreachable: ${err.message}`);
  }
}

async function checkAllowlist() {
  console.log('\n## Tester allowlist (DB)');
  const cs = resolveDatabaseUrl(process.env.DATABASE_URL)
    ?.replace(/([?&])sslmode=[^&]*/g, '$1')
    .replace(/[?&]$/, '')
    .replace(/\?&/, '?');

  if (!cs) {
    warn('DATABASE_URL missing — skip allowlist check');
    return;
  }

  const pool = new pg.Pool({ connectionString: cs, ssl: { rejectUnauthorized: false } });
  try {
    const { rows } = await pool.query(
      'SELECT email, role, tier FROM tester_allowlist ORDER BY role, email',
    );
    pass(`${rows.length} allowlist row(s)`);
    for (const row of rows) {
      console.log(`     · ${row.email} (${row.role}, ${row.tier})`);
    }

    const expected = 6;
    if (rows.length < expected) {
      warn(`Expected ${expected} emails — run: node scripts/seed-access-allowlist.mjs`);
    }
  } catch (err) {
    fail(`Allowlist query failed: ${err.message}`);
  } finally {
    await pool.end().catch(() => {});
  }
}

function checkEmail() {
  console.log('\n## Email (Resend)');
  if (isEmailConfigured()) {
    pass(`Provider: ${getEmailProvider()}`);
  } else {
    fail('Email not configured (RESEND_API_KEY missing)');
  }
  if (process.env.RESEND_WAITLIST_TEMPLATE_ID) {
    pass('Waitlist template ID set');
  } else {
    warn('RESEND_WAITLIST_TEMPLATE_ID missing — falls back to inline HTML');
  }
}

function checkObservability() {
  console.log('\n## Observability (LC-09, LC-10)');
  if (process.env.REACT_APP_GA_MEASUREMENT_ID) {
    pass('GA4 measurement ID set locally');
  } else {
    warn('REACT_APP_GA_MEASUREMENT_ID missing — set on Vercel for LC-10');
  }
  if (process.env.REACT_APP_SENTRY_DSN || process.env.SENTRY_DSN) {
    pass('Sentry DSN set');
  } else {
    warn('Sentry DSN missing — LC-09 pending');
  }
}

async function main() {
  console.log('AIIMIN Launch Verify');
  console.log(`API: ${API_URL}`);
  console.log(`Frontend: ${FRONTEND_URL}`);

  checkEnv(EC2_REQUIRED, 'EC2 env (local .env proxy)');
  console.log('\n## Vercel env (set in Vercel dashboard; local REACT_APP_* if present)');
  for (const key of VERCEL_REQUIRED) {
    const val = process.env[key];
    if (val && String(val).trim()) pass(`${key} set locally`);
    else warn(`${key} not in local .env — verify on Vercel (LC-04)`);
  }

  console.log('\n## Optional env');
  for (const key of OPTIONAL) {
    if (process.env[key]) pass(`${key} set`);
    else warn(`${key} not set`);
  }

  checkEmail();
  checkObservability();
  await checkApi();
  await checkFrontend();
  await checkAllowlist();

  console.log('\n## Manual steps still required');
  console.log('  · Phase 0.5: E2E waitlist signup on www.aiimin.in (confirmation + owner notify)');
  console.log('  · Phase 0.7: Rotate Resend API key if pasted in chat');
  console.log('  · LC-12: Each tester Google login → onboarding → /overview');
  console.log('  · LC-01: IDOR + SQLi smoke (authenticated routes)');
  console.log('\nRun: node scripts/test-waitlist-e2e.mjs <email>  (production signup test)');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
