#!/usr/bin/env node
/**
 * Generate v8 color-theme preview gallery (c1–c6).
 * Usage: node scripts/preview-waitlist-emails.mjs
 * Open: deploy/email-preview/index.html
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { renderAllColorThemes } from '../server/lib/waitlistEmailVariants.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'deploy', 'email-preview');
mkdirSync(outDir, { recursive: true });

// Remove old v1–v7 and legacy previews
for (const f of readdirSync(outDir)) {
  if (f !== 'index.html' && f.endsWith('.html')) {
    unlinkSync(path.join(outDir, f));
  }
}

const samples = renderAllColorThemes({
  name: 'Aaditya',
  reserved_username: 'AU10',
  referral_code: 'FOUND01',
  member_number: 145,
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
        · Set <code>WAITLIST_EMAIL_THEME=${v.id}</code>
      </footer>
    </article>`;
}).join('\n');

const index = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>AIIMIN v8 — Color Themes</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; font-family: 'Figtree', system-ui, sans-serif; background: #F0EDE8; color: #1A1A1A; }
    .hero { padding: 32px 24px; background: #FAFAF9; border-bottom: 1px solid #E2DDD7; }
    .hero h1 { margin: 0 0 8px; font-family: Georgia, serif; font-size: 28px; color: #164530; }
    .hero p { margin: 0; color: #4A5340; max-width: 720px; line-height: 1.65; font-size: 15px; }
    .grid { display: grid; gap: 24px; padding: 24px; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); }
    .card { background: #FAFAF9; border: 1px solid #E2DDD7; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 24px rgba(30,92,58,0.06); }
    .card header { padding: 16px 18px; border-bottom: 1px solid #E2DDD7; }
    .id { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #1E5C3A; letter-spacing: 0.1em; font-weight: 600; }
    .card h2 { margin: 6px 0 4px; font-size: 18px; }
    .tag { margin: 0 0 10px; font-size: 13px; color: #9A9186; }
    .subject { margin: 0; font-size: 12px; color: #4A5340; }
    iframe { width: 100%; height: 540px; border: 0; background: #F0EDE8; }
    footer { padding: 12px 18px; border-top: 1px solid #E2DDD7; font-size: 13px; color: #4A5340; }
    footer a { color: #1E5C3A; text-decoration: none; font-weight: 600; }
    code { background: #E8F0EB; padding: 2px 6px; border-radius: 4px; font-size: 11px; color: #164530; }
  </style>
</head>
<body>
  <div class="hero">
    <h1>v8 final — 6 color themes</h1>
    <p>Production template locked to <strong>v8</strong>. Pick a theme (c1–c6), then set <code>WAITLIST_EMAIL_THEME=c1</code> on EC2. Member count displays from <strong>#123</strong> (offset 122) of <strong>500</strong>. Headline: <em>It starts here.</em></p>
  </div>
  <div class="grid">${cards}</div>
</body>
</html>`;

writeFileSync(path.join(outDir, 'index.html'), index);

console.log(`Generated ${samples.length} v8 color themes in deploy/email-preview/`);
console.log('Open: deploy/email-preview/index.html');
samples.forEach((v) => console.log(`  ${v.id} — ${v.name}`));
