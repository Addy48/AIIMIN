#!/usr/bin/env node
/**
 * Generate production waitlist email preview (c6).
 * Usage: node scripts/preview-waitlist-emails.mjs
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { renderWaitlistConfirmation } from '../server/lib/waitlistEmailVariants.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'deploy', 'email-preview');
mkdirSync(outDir, { recursive: true });

for (const f of readdirSync(outDir)) {
  if (f.endsWith('.html')) unlinkSync(path.join(outDir, f));
}

const { subject, html } = renderWaitlistConfirmation({
  name: 'Aaditya',
  reserved_username: 'AU10',
  referral_code: 'FOUND01',
  member_number: 145,
  total_count: 500,
});

writeFileSync(path.join(outDir, 'waitlist-confirmation.html'), html);
writeFileSync(path.join(outDir, 'index.html'), `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>AIIMIN Waitlist Email — Production</title>
  <style>
    body { margin: 0; font-family: Figtree, system-ui, sans-serif; background: #F0EDE8; color: #1A1A1A; }
    .bar { padding: 20px 24px; background: #FAFAF9; border-bottom: 1px solid #E2DDD7; }
    .bar h1 { margin: 0 0 6px; font-size: 22px; color: #164530; }
    .bar p { margin: 0; font-size: 14px; color: #4A5340; }
    iframe { width: 100%; height: calc(100vh - 100px); border: 0; }
  </style>
</head>
<body>
  <div class="bar">
    <h1>Production email (c6 · Gradient Grove)</h1>
    <p><strong>Subject:</strong> ${subject}</p>
  </div>
  <iframe src="./waitlist-confirmation.html" title="Waitlist confirmation"></iframe>
</body>
</html>`);

console.log('Preview: deploy/email-preview/index.html');
console.log('Subject:', subject);
