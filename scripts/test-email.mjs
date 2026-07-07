#!/usr/bin/env node
/**
 * Send a test waitlist confirmation email (v8).
 * Usage:
 *   node scripts/test-email.mjs you@example.com
 *   node scripts/test-email.mjs you@example.com --theme c2
 *   node scripts/test-email.mjs you@example.com --all-themes
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { sendEmail, getEmailProvider, isEmailConfigured } from '../server/lib/email.js';
import { COLOR_THEME_IDS, DISPLAY_CAP } from '../server/lib/waitlistEmailVariants.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const args = process.argv.slice(2);
const to = args.find((a) => !a.startsWith('--'));
const themeFlag = args.find((a) => a.startsWith('--theme='))
  || (args.includes('--theme') ? args[args.indexOf('--theme') + 1] : null);
const sendAll = args.includes('--all-themes');

if (!to) {
  console.error(`Usage: node scripts/test-email.mjs <email> [--theme c1] [--all-themes]

Themes: ${COLOR_THEME_IDS.join(', ')}
Default: c6 (Gradient Grove)`);
  process.exit(1);
}

const baseVars = {
  name: 'Aaditya',
  reserved_username: 'AU10',
  referral_code: 'FOUND01',
  member_number: 145,
  total_count: DISPLAY_CAP,
};

async function sendOne(theme) {
  const label = theme ? `v8 (${theme})` : 'v8';
  console.log('Sending', label, 'to', to);
  const result = await sendEmail(to, 'waitlist_confirmation', {
    ...baseVars,
    ...(theme ? { color_theme: theme } : {}),
  });
  console.log('OK:', result);
}

console.log('Provider:', isEmailConfigured() ? getEmailProvider() : 'stub (not configured)');

try {
  if (sendAll) {
    for (const id of COLOR_THEME_IDS) {
      await sendOne(id);
      await new Promise((r) => setTimeout(r, 1200));
    }
    console.log(`Sent ${COLOR_THEME_IDS.length} theme emails.`);
  } else {
    await sendOne(themeFlag || process.env.WAITLIST_EMAIL_THEME || null);
  }
} catch (err) {
  console.error('FAILED:', err.message);
  process.exit(1);
}
