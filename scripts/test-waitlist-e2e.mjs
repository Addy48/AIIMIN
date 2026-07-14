#!/usr/bin/env node
/**
 * Production waitlist signup E2E (Phase 0.5 / LC-07).
 * Creates a real waitlist row and sends confirmation + owner notify emails.
 *
 * Usage:
 *   node scripts/test-waitlist-e2e.mjs you+test@gmail.com
 *   node scripts/test-waitlist-e2e.mjs you+test@gmail.com --cleanup
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import { resolveDatabaseUrl } from '../server/lib/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const email = process.argv[2]?.trim().toLowerCase();
const cleanup = process.argv.includes('--cleanup');
const API_URL = (process.env.API_URL || process.env.REACT_APP_API_URL || 'https://api.aiimin.in/api').replace(/\/$/, '');

if (!email || !email.includes('@')) {
  console.error('Usage: node scripts/test-waitlist-e2e.mjs <email> [--cleanup]');
  process.exit(1);
}

const suffix = Date.now().toString(36).slice(-4).toUpperCase();
const payload = {
  email,
  first_name: 'E2E',
  reserved_username: `T${suffix}`,
  source: 'launch_verify',
};

console.log('POST', `${API_URL}/waitlist`);
console.log('Payload:', JSON.stringify(payload, null, 2));

const res = await fetch(`${API_URL}/waitlist`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
});

const body = await res.json().catch(() => ({}));
console.log('Status:', res.status);
console.log('Response:', JSON.stringify(body, null, 2));

if (!res.ok) {
  console.error('E2E signup failed');
  process.exit(1);
}

console.log('\n✅ Signup OK — check inbox for waitlist confirmation');
console.log('   Owner notify →', process.env.OWNER_NOTIFY_EMAIL || '(OWNER_NOTIFY_EMAIL not set locally)');

if (cleanup) {
  const cs = resolveDatabaseUrl(process.env.DATABASE_URL)
    ?.replace(/([?&])sslmode=[^&]*/g, '$1')
    .replace(/[?&]$/, '')
    .replace(/\?&/, '?');
  if (cs) {
    const pool = new pg.Pool({ connectionString: cs, ssl: { rejectUnauthorized: false } });
    const { rowCount } = await pool.query('DELETE FROM waitlist_emails WHERE lower(email) = lower($1)', [email]);
    await pool.end();
    console.log(`\n🧹 Cleanup: removed ${rowCount} row(s) for ${email}`);
  }
}
