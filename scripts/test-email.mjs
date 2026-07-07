#!/usr/bin/env node
/**
 * Send a test waitlist confirmation email.
 * Usage: node scripts/test-email.mjs you@example.com
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { sendEmail, getEmailProvider, isEmailConfigured } from '../server/lib/email.js';
import { DISPLAY_CAP } from '../server/lib/waitlistEmailVariants.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const to = process.argv[2];

if (!to) {
  console.error('Usage: node scripts/test-email.mjs <email>');
  process.exit(1);
}

const vars = {
  name: 'Aaditya',
  reserved_username: 'AU10',
  referral_code: 'FOUND01',
  member_number: 123,
  total_count: DISPLAY_CAP,
};

console.log('Provider:', isEmailConfigured() ? getEmailProvider() : 'stub (not configured)');
if (process.env.RESEND_WAITLIST_TEMPLATE_ID) {
  console.log('Template:', process.env.RESEND_WAITLIST_TEMPLATE_ID);
}

try {
  console.log('Sending waitlist confirmation to', to);
  const result = await sendEmail(to, 'waitlist_confirmation', vars);
  console.log('OK:', result);
} catch (err) {
  console.error('FAILED:', err.message);
  process.exit(1);
}
