#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const repoRoot = resolve(process.cwd());
const targetPath = resolve(repoRoot, 'docs/knowledge/06-History/Git-Timeline.md');

const run = (cmd) => execSync(cmd, { cwd: repoRoot, encoding: 'utf8' }).trim();

const ensureFile = () => {
  if (!existsSync(dirname(targetPath))) mkdirSync(dirname(targetPath), { recursive: true });
  if (!existsSync(targetPath)) {
    writeFileSync(
      targetPath,
      '# Git Timeline\n\n## Ledger\n\n',
      'utf8',
    );
  }
};

const parseKnownCommits = (content) => {
  const known = new Set();
  const matches = content.matchAll(/^- ([a-f0-9]{7,40}) \|/gm);
  for (const match of matches) known.add(match[1]);
  return known;
};

const keywordTag = (subject) => {
  const s = String(subject || '').toLowerCase();
  if (s.includes('sports')) return 'sports';
  if (s.includes('clerk') || s.includes('auth')) return 'auth';
  if (s.includes('calendar')) return 'calendar';
  if (s.includes('theme') || s.includes('typography')) return 'design';
  if (s.startsWith('feat')) return 'feature';
  if (s.startsWith('fix')) return 'fix';
  return 'chore';
};

ensureFile();

const existing = readFileSync(targetPath, 'utf8');
const known = parseKnownCommits(existing);

const raw = run(`git log --date=short --pretty=format:%H%x09%ad%x09%s -200`);
const commits = raw
  .split('\n')
  .map((line) => {
    const [sha, date, ...subjectParts] = line.split('\t');
    return { sha, short: sha.slice(0, 8), date, subject: subjectParts.join('\t').trim() };
  })
  .filter((entry) => entry.sha && !known.has(entry.sha) && !known.has(entry.short))
  .reverse();

if (!commits.length) {
  console.log('No new commits to append.');
  process.exit(0);
}

const lines = [
  '',
  `### Sync ${new Date().toISOString()}`,
  ...commits.map((entry) => `- ${entry.short} | ${entry.date} | [${keywordTag(entry.subject)}] ${entry.subject}`),
];

writeFileSync(targetPath, `${existing.trimEnd()}\n${lines.join('\n')}\n`, 'utf8');
console.log(`Appended ${commits.length} commits to ${targetPath}`);
