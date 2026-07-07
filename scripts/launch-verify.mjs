#!/usr/bin/env node
/**
 * Read-only launch checklist verifier (LC-04, LC-07 partial, health).
 *
 * Usage:
 *   node scripts/launch-verify.mjs
 *   node scripts/sync-react-env.mjs   # sync REACT_APP_* into root .env first
 *   API_URL=https://api.aiimin.in/api node scripts/launch-verify.mjs
 */
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import { resolveDatabaseUrl } from '../server/lib/db.js';
import { isEmailConfigured, getEmailProvider } from '../server/lib/email.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function loadEnvLayer(filePath) {
  if (!fs.existsSync(filePath)) return;
  dotenv.config({ path: filePath, override: false });
}

function loadFrontendReactEnv() {
  const sources = [
    path.join(root, 'frontend', '.env.production'),
    path.join(root, 'frontend', '.env'),
  ];
  for (const filePath of sources) {
    if (!fs.existsSync(filePath)) continue;
    const parsed = dotenv.parse(fs.readFileSync(filePath));
    for (const [key, val] of Object.entries(parsed)) {
      if (key.startsWith('REACT_APP_') || key === 'SENTRY_DSN') {
        if (!process.env[key]) process.env[key] = val;
      }
    }
  }
}

loadEnvLayer(path.join(root, '.env'));
loadFrontendReactEnv();

const PROD_API_URL = 'https://api.aiimin.in/api';
const API_URL = (process.env.API_URL || PROD_API_URL).replace(/\/$/, '');
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
  'RESEND_WAITLIST_TEMPLATE_ID',
  'WAITLIST_MEMBER_OFFSET',
  'WAITLIST_DISPLAY_CAP',
];

const OBSERVABILITY = [
  'REACT_APP_GA_MEASUREMENT_ID',
  'REACT_APP_SENTRY_DSN',
  'SENTRY_DSN',
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

function isPlaceholderGa(id) {
  return !id || /X{4,}/i.test(id) || id === 'G-XXXXXXXXXX';
}

function isRealEnvValue(key, val) {
  if (!val || !String(val).trim()) return false;
  if (key === 'REACT_APP_GA_MEASUREMENT_ID' && isPlaceholderGa(val)) return false;
  return true;
}

function checkEnv(keys, label, { optional = false } = {}) {
  console.log(`\n## ${label}`);
  let ok = true;
  for (const key of keys) {
    const val = process.env[key];
    if (isRealEnvValue(key, val)) {
      pass(`${key} set`);
    } else if (optional) {
      warn(`${key} not set`);
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

async function checkProductionBundle() {
  console.log('\n## Vercel production bundle (live LC-04)');
  try {
    const htmlRes = await fetch(FRONTEND_URL, {
      signal: AbortSignal.timeout(15000),
      headers: { 'Cache-Control': 'no-cache' },
    });
    const html = await htmlRes.text();
    const mainMatch = html.match(/\/static\/js\/main\.[a-f0-9]+\.js/);
    if (!mainMatch) {
      warn('Could not find main.js in production HTML');
      return;
    }
    const jsUrl = new URL(mainMatch[0], FRONTEND_URL).href;
    const jsRes = await fetch(jsUrl, { signal: AbortSignal.timeout(20000) });
    const js = await jsRes.text();

    const checks = [
      { label: 'REACT_APP_API_URL → api.aiimin.in', ok: js.includes('api.aiimin.in') },
      { label: 'REACT_APP_SUPABASE_URL baked in', ok: js.includes('yubxgftugxbwtywyhcsv.supabase.co') },
      { label: 'Waitlist mode active', ok: /waitlist/i.test(js) },
    ];
    for (const { label, ok } of checks) {
      if (ok) pass(label);
      else warn(`${label} — not found in bundle`);
    }
  } catch (err) {
    warn(`Production bundle check failed: ${err.message}`);
  }
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
  console.log('\n## Observability (LC-09, LC-10 — optional until launch)');
  const ga = process.env.REACT_APP_GA_MEASUREMENT_ID;
  if (isRealEnvValue('REACT_APP_GA_MEASUREMENT_ID', ga)) {
    pass(`GA4: ${ga}`);
  } else if (ga && isPlaceholderGa(ga)) {
    warn('REACT_APP_GA_MEASUREMENT_ID is placeholder (G-XXXXXXXXXX) — create GA4 property');
  } else {
    warn('REACT_APP_GA_MEASUREMENT_ID missing — create at analytics.google.com');
  }

  const sentry = process.env.REACT_APP_SENTRY_DSN || process.env.SENTRY_DSN;
  if (sentry) {
    pass('Sentry DSN set');
  } else {
    warn('Sentry DSN missing — create project at sentry.io (LC-09, not blocking waitlist)');
  }
}

async function main() {
  console.log('AIIMIN Launch Verify');
  console.log(`API: ${API_URL}`);
  console.log(`Frontend: ${FRONTEND_URL}`);

  checkEnv(EC2_REQUIRED, 'EC2 env (root .env)');
  checkEnv(VERCEL_REQUIRED, 'Frontend env (root .env + frontend/.env*)');

  console.log('\n## Optional env');
  for (const key of OPTIONAL) {
    if (process.env[key]) pass(`${key} set`);
    else warn(`${key} not set`);
  }

  checkEmail();
  checkObservability();
  await checkProductionBundle();
  await checkApi();
  await checkFrontend();
  await checkAllowlist();

  const missingReact = VERCEL_REQUIRED.filter((k) => !isRealEnvValue(k, process.env[k]));
  if (missingReact.length > 0) {
    console.log('\n## Fix missing frontend env locally');
    console.log('  Run: node scripts/sync-react-env.mjs');
    console.log('  Or copy frontend/.env.production → add REACT_APP_* to root .env');
  }

  console.log('\n## Manual steps still required');
  console.log('  · Phase 0.5: E2E waitlist — node scripts/test-waitlist-e2e.mjs <email>');
  console.log('  · Phase 0.7: Rotate Resend API key if pasted in chat');
  console.log('  · LC-12: Each tester Google login → onboarding → /overview');
  console.log('  · LC-09/10: GA4 + Sentry when ready (not blocking waitlist)');
  console.log('  · LC-01: IDOR + SQLi smoke (authenticated routes)');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
