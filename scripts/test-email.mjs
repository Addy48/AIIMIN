#!/usr/bin/env node
/**
 * Send a test waitlist confirmation email.
 * Usage:
 *   node scripts/test-email.mjs you@example.com
 *   node scripts/test-email.mjs you@example.com --variant v3
 *   node scripts/test-email.mjs you@example.com --all
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { sendEmail, getEmailProvider, isEmailConfigured } from '../server/lib/email.js';
import { WAITLIST_VARIANT_IDS } from '../server/lib/waitlistEmailVariants.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const args = process.argv.slice(2);
const to = args.find((a) => !a.startsWith('--'));
const variantFlag = args.find((a) => a.startsWith('--variant='))
  || (args.includes('--variant') ? args[args.indexOf('--variant') + 1] : null);
const sendAll = args.includes('--all');

if (!to) {
  console.error(`Usage: node scripts/test-email.mjs <email> [--variant v1] [--all]

Variants: ${WAITLIST_VARIANT_IDS.join(', ')}
Default production variant: ${process.env.WAITLIST_EMAIL_VARIANT || 'v8'}`);
  process.exit(1);
}

const baseVars = {
  name: 'Aaditya',
  reserved_username: 'AU10',
  referral_code: 'FOUND01',
  member_number: 142,
  total_count: 500,
};

async function sendOne(variant) {
  const label = variant ? `waitlist_confirmation (${variant})` : 'waitlist_confirmation';
  console.log('Sending', label, 'to', to);
  const result = await sendEmail(to, 'waitlist_confirmation', {
    ...baseVars,
    ...(variant ? { variant } : {}),
  });
  console.log('OK:', result);
}

console.log('Provider:', isEmailConfigured() ? getEmailProvider() : 'stub (not configured)');

try {
  if (sendAll) {
    for (const id of WAITLIST_VARIANT_IDS) {
      await sendOne(id);
      await new Promise((r) => setTimeout(r, 1200));
    }
    console.log(`Sent ${WAITLIST_VARIANT_IDS.length} variant emails.`);
  } else {
    await sendOne(variantFlag || process.env.WAITLIST_EMAIL_VARIANT || null);
  }
} catch (err) {
  console.error('FAILED:', err.message);
  process.exit(1);
}
