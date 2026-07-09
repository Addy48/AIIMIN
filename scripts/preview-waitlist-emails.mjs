#!/usr/bin/env node
/**
 * Generate HTML gallery of all waitlist email variants.
 * Usage: node scripts/preview-waitlist-emails.mjs
 * Open: deploy/email-preview/index.html
 */
import { mkdirSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { renderAllWaitlistVariants } from '../server/lib/waitlistEmailVariants.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'deploy', 'email-preview');
mkdirSync(outDir, { recursive: true });

const samples = renderAllWaitlistVariants({
  name: 'Aaditya',
  reserved_username: 'AU10',
  referral_code: 'FOUND01',
  member_number: 142,
  total_count: 500,
});

const cards = samples.map((v) => {
  const file = `${v.id}-${v.name.toLowerCase().replace(/\s+/g, '-')}.html`;
  writeFileSync(path.join(outDir, file), v.html);
  return `
    <article class="card">
      <header>
        <span class="id">${v.id.toUpperCase()}</span>
        <h2>${v.name}</h2>
        <p class="tag">${v.tagline}</p>
        <p class="subject"><strong>Subject:</strong> ${v.subject}</p>
      </header>
      <iframe src="./${file}" title="${v.name}"></iframe>
      <footer>
        <a href="./${file}" target="_blank">Open full screen</a>
      </footer>
    </article>`;
}).join('\n');

const index = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>AIIMIN Waitlist Email Variants</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; font-family: system-ui, sans-serif; background: #0A0A0C; color: #EDE4D3; }
    .hero { padding: 32px 24px; border-bottom: 1px solid #2a2a2e; }
    .hero h1 { margin: 0 0 8px; font-size: 28px; }
    .hero p { margin: 0; color: #9A9186; max-width: 640px; line-height: 1.6; }
    .grid { display: grid; gap: 24px; padding: 24px; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); }
    .card { background: #141416; border: 1px solid #2a2a2e; border-radius: 12px; overflow: hidden; }
    .card header { padding: 16px 18px; border-bottom: 1px solid #2a2a2e; }
    .id { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #1E5C3A; letter-spacing: 0.1em; }
    .card h2 { margin: 6px 0 4px; font-size: 18px; color: #fff; }
    .tag { margin: 0 0 10px; font-size: 13px; color: #9A9186; }
    .subject { margin: 0; font-size: 12px; color: #c8c0b4; }
    iframe { width: 100%; height: 520px; border: 0; background: #F0EDE8; }
    footer { padding: 12px 18px; border-top: 1px solid #2a2a2e; }
    footer a { color: #1E5C3A; text-decoration: none; font-size: 13px; }
    code { background: #1e1e22; padding: 2px 6px; border-radius: 4px; font-size: 12px; }
  </style>
</head>
<body>
  <div class="hero">
    <h1>Waitlist email variants (8)</h1>
    <p>Pick a winner, then set <code>WAITLIST_EMAIL_VARIANT=v8</code> on EC2 (default: <strong>v8 Hybrid Recommended</strong>). Send test: <code>node scripts/test-email.mjs you@gmail.com --variant v3</code></p>
  </div>
  <div class="grid">${cards}</div>
</body>
</html>`;

writeFileSync(path.join(outDir, 'index.html'), index);

console.log(`Generated ${samples.length} variants in deploy/email-preview/`);
console.log('Open: deploy/email-preview/index.html');
samples.forEach((v) => console.log(`  ${v.id} — ${v.name} — ${v.subject}`));
