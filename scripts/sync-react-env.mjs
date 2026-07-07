#!/usr/bin/env node
/**
 * Copy REACT_APP_* (and optional SENTRY_DSN) from frontend env into root .env.
 * Idempotent — skips keys already set in root .env unless --force.
 *
 * Usage:
 *   node scripts/sync-react-env.mjs
 *   node scripts/sync-react-env.mjs --force
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const rootEnvPath = path.join(root, '.env');
const sources = [
  path.join(root, 'frontend', '.env.production'),
  path.join(root, 'frontend', '.env'),
];

const PREFIXES = ['REACT_APP_', 'SENTRY_DSN'];

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const out = {};
  for (const line of fs.readFileSync(filePath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

function parseExistingRoot() {
  if (!fs.existsSync(rootEnvPath)) return { lines: [], map: {} };
  const lines = fs.readFileSync(rootEnvPath, 'utf8').split('\n');
  const map = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    map[trimmed.slice(0, eq).trim()] = true;
  }
  return { lines, map };
}

const force = process.argv.includes('--force');
const merged = {};
for (const src of sources) {
  const parsed = parseEnvFile(src);
  for (const [key, val] of Object.entries(parsed)) {
    if (!PREFIXES.some((p) => key === p || key.startsWith(p))) continue;
    if (!(key in merged) || force) merged[key] = val;
  }
}

const toCopy = Object.entries(merged).filter(([key]) =>
  PREFIXES.some((p) => key === p || key.startsWith(p)),
);

if (toCopy.length === 0) {
  console.error('No REACT_APP_* keys found in frontend/.env.production or frontend/.env');
  process.exit(1);
}

const { lines, map } = parseExistingRoot();
const additions = [];

for (const [key, val] of toCopy) {
  if (map[key] && !force) continue;
  if (map[key] && force) {
    const idx = lines.findIndex((l) => l.trim().startsWith(`${key}=`));
    if (idx !== -1) {
      lines[idx] = `${key}=${val}`;
      console.log(`  updated ${key}`);
      continue;
    }
  }
  additions.push(`${key}=${val}`);
  console.log(`  added ${key}`);
}

if (additions.length === 0 && !force) {
  console.log('Root .env already has all REACT_APP_* keys (use --force to overwrite).');
  process.exit(0);
}

let outLines = [...lines];
if (additions.length > 0) {
  if (outLines.length && outLines[outLines.length - 1] !== '') outLines.push('');
  outLines.push('# ── Frontend (synced by scripts/sync-react-env.mjs) ──');
  outLines.push(...additions);
}

fs.writeFileSync(rootEnvPath, outLines.join('\n').replace(/\n*$/, '\n'));
console.log(`\nWrote ${rootEnvPath}`);
