#!/usr/bin/env node
/**
 * Fail Vercel build if critical REACT_APP_* vars are missing.
 * Committed frontend/.env.production is source of truth for public keys.
 * Vercel may inject empty placeholders — backfill from file when unset.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '..', '.env.production');

if (fs.existsSync(envPath)) {
  const fromFile = dotenv.parse(fs.readFileSync(envPath));
  for (const [key, value] of Object.entries(fromFile)) {
    if (!process.env[key] || !String(process.env[key]).trim()) {
      process.env[key] = value;
    }
  }
}

const required = [
  'REACT_APP_SUPABASE_URL',
  'REACT_APP_SUPABASE_ANON_KEY',
  'REACT_APP_API_URL',
  'REACT_APP_WAITLIST_MODE',
];

const missing = required.filter((k) => !process.env[k] || !String(process.env[k]).trim());
if (missing.length) {
  console.error('Missing production env:', missing.join(', '));
  process.exit(1);
}

if (process.env.REACT_APP_WAITLIST_MODE !== 'true') {
  console.error('REACT_APP_WAITLIST_MODE must be "true" for production waitlist landing.');
  process.exit(1);
}

console.log('Production env OK (waitlist mode on, API + Supabase set).');
