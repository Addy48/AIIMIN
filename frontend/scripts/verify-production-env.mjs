#!/usr/bin/env node
/**
 * Fail Vercel build if critical REACT_APP_* vars are missing.
 * Loads frontend/.env.production (committed) then process.env overrides.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '..', '.env.production');

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
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
