#!/usr/bin/env node
/**
 * Push production waitlist HTML to Resend template + publish.
 * Usage: node scripts/sync-resend-waitlist-template.mjs
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { getResendTemplateHtml, RESEND_TEMPLATE_VARIABLES } from '../server/lib/waitlistResendTemplate.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const apiKey = process.env.RESEND_API_KEY;
const templateId = process.env.RESEND_WAITLIST_TEMPLATE_ID || 'cf437c26-b3c9-4474-a312-1a4ec4e7340c';

if (!apiKey) {
  console.error('RESEND_API_KEY required');
  process.exit(1);
}

const payload = {
  name: 'AIIMIN Waitlist Confirmation',
  alias: 'aiimin-waitlist-confirmation',
  from: 'AIIMIN <noreply@admin.aiimin.in>',
  replyTo: process.env.RESEND_REPLY_TO || 'aadityaupadhyay10@gmail.com',
  subject: '#{{{MEMBER_NUM}}} — {{{GREETING}}}, it starts here',
  html: getResendTemplateHtml(),
  text: 'It starts here. {{{GREETING}}} — {{{COUNT_LABEL}}}. Visit {{{CTA_URL}}}',
  variables: RESEND_TEMPLATE_VARIABLES,
};

async function resend(pathname, options = {}) {
  const res = await fetch(`https://api.resend.com${pathname}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body?.message || JSON.stringify(body) || `HTTP ${res.status}`);
  }
  return body;
}

let id = templateId;

try {
  const updated = await resend(`/templates/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  id = updated?.id || id;
  console.log('Updated template:', id);
} catch (err) {
  console.error('Update failed:', err.message);
  process.exit(1);
}

await resend(`/templates/${id}/publish`, { method: 'POST', body: '{}' });
console.log('Published:', id);
console.log('\nAdd to .env and EC2:');
console.log(`RESEND_WAITLIST_TEMPLATE_ID=${id}`);
