#!/usr/bin/env node
/**
 * Send a test waitlist confirmation email.
 * Usage: node scripts/test-email.mjs you@example.com
 */
import dotenv from 'dotenv';
import { sendEmail, getEmailProvider, isEmailConfigured } from '../server/lib/email.js';

dotenv.config();

const to = process.argv[2];
if (!to) {
  console.error('Usage: node scripts/test-email.mjs <recipient-email>');
  process.exit(1);
}

console.log('Provider:', isEmailConfigured() ? getEmailProvider() : 'stub (not configured)');
console.log('Sending waitlist_confirmation to', to);

try {
  const result = await sendEmail(to, 'waitlist_confirmation', {
    name: 'Test',
    reserved_username: 'TESTID01',
    referral_code: 'ABC123',
  });
  console.log('OK:', result);
} catch (err) {
  console.error('FAILED:', err.message);
  process.exit(1);
}
