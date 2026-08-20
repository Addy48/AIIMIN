#!/usr/bin/env node
/**
 * sync-personal-vault.mjs — hybrid personal vault
 *
 * WHY THIS EXISTS
 * ---------------
 * There used to be two hand-authored vaults. They drifted for a month and ended up
 * contradicting each other (the personal one still claimed auth was Clerk). Copying is what
 * allowed that. So this script does NOT copy notes.
 *
 * SHAPE
 *   ~/Documents/AIIMIN VAULT/
 *   ├── 00-Home.md                 generated each run
 *   ├── Reference/  ─────────────► SYMLINK to <repo>/docs/knowledge
 *   ├── My Notes/                  the founder's own. NEVER touched.
 *   └── 99-Superseded-Originals/   his 2026-07-04 notes. NEVER touched.
 *
 * Because Reference/ is a symlink there is exactly ONE copy of every note, under git, with
 * every wikilink intact and the Obsidian graph fully connected. Drift is not possible.
 *
 *   node scripts/sync-personal-vault.mjs            # write
 *   node scripts/sync-personal-vault.mjs --check    # exit 3 if stale, write nothing
 *   node scripts/sync-personal-vault.mjs --quiet    # print only on change/error
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execSync } from 'node:child_process';

const REPO = path.resolve(import.meta.dirname, '..');
const SRC = path.join(REPO, 'docs/knowledge');
const DEST = process.env.AIIMIN_PERSONAL_VAULT || path.join(os.homedir(), 'Documents/AIIMIN VAULT');
const CHECK = process.argv.includes('--check');
const QUIET = process.argv.includes('--quiet');

const LINK = 'Reference';
const PRIVATE = 'My Notes';
const BANNER = '<!-- AIIMIN-GENERATED -->';

const log = (...a) => { if (!QUIET) console.log(...a); };
const read = (p) => fs.readFileSync(p, 'utf8');

if (!fs.existsSync(SRC)) { console.error(`canonical vault missing: ${SRC}`); process.exit(1); }

// ---------------------------------------------------------------- live data

const now = new Date();
const pad = (n) => String(n).padStart(2, '0');
const day = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
const stamp = `${day} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

function git() {
  try {
    const g = (c) => execSync(c, { cwd: REPO, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    return { head: g('git rev-parse --short HEAD'), branch: g('git rev-parse --abbrev-ref HEAD'), subject: g('git log -1 --format=%s') };
  } catch { return { head: 'unknown', branch: 'unknown', subject: '' }; }
}
const G = git();

function countNotes(dir) {
  let n = 0;
  (function w(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      if (e.name.startsWith('.')) continue;
      const p = path.join(d, e.name);
      if (e.isDirectory()) w(p); else if (e.name.endsWith('.md')) n++;
    }
  })(dir);
  return n;
}

/** Pull a "## Heading" block out of a canonical note so Home is never stale. */
function section(rel, heading) {
  const p = path.join(SRC, rel);
  if (!fs.existsSync(p)) return '';
  const m = read(p).match(new RegExp(`##\\s*${heading}\\s*\\n([\\s\\S]*?)(?=\\n##\\s|\\n---|$)`));
  if (!m) return '';
  // Reference/ is the vault-side name for docs/knowledge, so [[X]] links keep resolving.
  return m[1].trim();
}

/** Guides that actually exist, so Home never links to a missing note. */
function guides() {
  const d = path.join(SRC, 'Guides');
  if (!fs.existsSync(d)) return [];
  return fs.readdirSync(d).filter((f) => f.endsWith('.md')).sort().map((f) => {
    const src = read(path.join(d, f));
    const title = (src.match(/^#\s+(.+)$/m) || [, path.basename(f, '.md')])[1].trim();
    let blurb = '';
    const body = src.replace(/^---\n[\s\S]*?\n---\n?/, '');
    for (const raw of body.split('\n')) {
      const l = raw.trim();
      if (!l || l.startsWith('#') || l.startsWith('|') || l.startsWith('```')) continue;
      blurb = l.replace(/^>\s*(\[!\w+\]\s*)?/, '')
               .replace(/\[\[([^\]|#^]+)(?:\|([^\]]*))?\]\]/g, (_, t, a) => a || path.basename(t))
               .replace(/[*_`]/g, '').trim();
      if (blurb.length > 12) break;
    }
    if (blurb.length > 130) blurb = blurb.slice(0, 127) + '…';
    return { file: path.basename(f, '.md'), title, blurb };
  });
}

// ---------------------------------------------------------------- Home

function renderHome() {
  const stage = section('15_MEMORY/Current-Context.md', 'Stage');
  const blocked = section('15_MEMORY/Current-Context.md', 'Blocked on founder');
  const g = guides();
  const total = countNotes(SRC);

  return `${BANNER}
---
generated: true
generated_on: ${day}
---

# AIIMIN

> [!tip] How this vault is put together
> **\`${LINK}/\`** is a **symlink** to the repo's \`docs/knowledge/\` — not a copy. One version
> of every note, under git, every link intact, full graph.
> **\`${PRIVATE}/\`** is yours. Nothing generated ever writes there, and it lives outside the
> repository, so nothing you write can reach the public GitHub repo.
> Only *this* file is generated. Editing it is pointless — it is rewritten each session.

**Synced** ${stamp} · **${G.branch}** @ \`${G.head}\` · ${total} notes in \`${LINK}/\`
${G.subject ? `\nLast commit — ${G.subject}` : ''}

---

## Right now

${stage || '_(Current-Context has no Stage section)_'}

${blocked ? `### Waiting on you\n\n${blocked}\n` : ''}
---

## Read these

${g.length ? g.map((x) => `- **[[${x.file}|${x.title}]]** — ${x.blurb}`).join('\n')
           : '_(no guides found in docs/knowledge/Guides/)_'}

---

## Jump to

| Looking for | Open |
|---|---|
| What's happening today | [[Current-Context]] |
| Everything's status | [[AIIMIN_MASTER_STATUS_AND_NEXT_STAGE]] |
| The agent index | [[00_ROUTING]] |
| The constitution | [[Genesis]] — immutable, never edit |
| Every feature | [[09_FEATURES/Index]] |
| Decisions and why | [[Decisions-And-Why]] |
| Open bugs | [[11_BUGS/README]] |
| Palette + type (locked) | [[08_DESIGN/Palette]] |
| The app build | [[The-App-Build]] |
| Your own notes | \`${PRIVATE}/\` |

---

## Not truth — never cite

- \`${LINK}/Archive/\` and \`${LINK}/99_ARCHIVE/\` — cold storage. True once, false now.
- \`99-Superseded-Originals/\` — your 2026-07-04 notes. They say auth is **Clerk**. It is
  **Better Auth**; Clerk has 0 matches in the codebase.

## Keeping it current

\`\`\`
cd ~/Desktop/DASHBOARD\\ PROJECT && node scripts/sync-personal-vault.mjs
\`\`\`

A Stop hook runs this at the end of any session, so it follows the repo on its own.
Because \`${LINK}/\` is a symlink, the notes themselves are **always** live — only this Home
page needs regenerating.
`;
}

// ---------------------------------------------------------------- plan

const outputs = new Map([['00-Home.md', renderHome()]]);

// ---------------------------------------------------------------- check mode

if (CHECK) {
  let stale = 0;
  const l = path.join(DEST, LINK);
  if (!fs.existsSync(l) || !fs.lstatSync(l).isSymbolicLink() || fs.realpathSync(l) !== fs.realpathSync(SRC)) stale++;
  for (const [rel, content] of outputs) {
    const p = path.join(DEST, rel);
    if (!fs.existsSync(p) || read(p) !== content) stale++;
  }
  if (stale) { console.log(`personal vault OUT OF DATE — ${stale} item(s) differ`); process.exit(3); }
  log('personal vault up to date');
  process.exit(0);
}

// ---------------------------------------------------------------- write

fs.mkdirSync(DEST, { recursive: true });

// 1. the symlink — the whole point. Replace only if wrong; never touch a real directory.
const linkPath = path.join(DEST, LINK);
let linkAction = 'ok';
if (fs.existsSync(linkPath) || fs.lstatSync(linkPath, { throwIfNoEntry: false })) {
  const st = fs.lstatSync(linkPath);
  if (st.isSymbolicLink()) {
    if (fs.realpathSync(linkPath) !== fs.realpathSync(SRC)) {
      fs.unlinkSync(linkPath);
      fs.symlinkSync(SRC, linkPath, 'dir');
      linkAction = 're-pointed';
    }
  } else {
    // A real directory sits where the symlink belongs. Do NOT delete it — that would be
    // destroying content this script did not create.
    console.error(`REFUSING to replace real directory: ${linkPath}\nMove it aside, then re-run.`);
    process.exit(2);
  }
} else {
  fs.symlinkSync(SRC, linkPath, 'dir');
  linkAction = 'created';
}

// 2. the private folder — created once, then never touched again
const privPath = path.join(DEST, PRIVATE);
let privAction = 'ok';
if (!fs.existsSync(privPath)) {
  fs.mkdirSync(privPath, { recursive: true });
  fs.writeFileSync(path.join(privPath, 'README.md'), `# My Notes

This folder is **yours**. Nothing generated ever writes here.

It lives at \`~/Documents/AIIMIN VAULT/${PRIVATE}/\`, which is **outside the git repository** —
so nothing you write here can reach the public GitHub repo. Write freely.

Links work in both directions: you can \`[[Start-Here]]\` or \`[[Current-Context]]\` from here
into the project notes, and Obsidian's graph will connect them.

> One caution: notes under \`${LINK}/\` **are** the repo. Editing one there shows up in
> \`git status\`. Edit those deliberately; keep loose thinking in this folder.
`);
  privAction = 'created';
}

// 3. retire the previous generated section folders (they are superseded by the symlink).
//    Only files carrying the generated banner are removed — anything you wrote is left alone.
const OLD_SECTIONS = ['01-Now','02-Product','03-Architecture','04-Features','05-Design','06-Deploy','07-Decisions','08-Bugs','09-App','10-Reference'];
let retired = 0, kept = 0;
for (const d of OLD_SECTIONS) {
  const dir = path.join(DEST, d);
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) continue;
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (!fs.statSync(p).isFile()) { kept++; continue; }
    if (read(p).startsWith(BANNER)) { fs.rmSync(p); retired++; } else { kept++; }
  }
  if (fs.readdirSync(dir).length === 0) fs.rmdirSync(dir);
}
// stale generated index from the old shape
for (const f of ['_SYNC-STATUS.md']) {
  const p = path.join(DEST, f);
  if (fs.existsSync(p) && read(p).startsWith(BANNER)) { fs.rmSync(p); retired++; }
}

// 4. generated files
let written = 0;
for (const [rel, content] of outputs) {
  const p = path.join(DEST, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  if (fs.existsSync(p) && read(p) === content) continue;
  fs.writeFileSync(p, content);
  written++;
}

log(`personal vault synced → ${DEST}`);
log(`  ${LINK}/ symlink ${linkAction} → docs/knowledge (${countNotes(SRC)} notes, all links live)`);
log(`  ${PRIVATE}/ ${privAction} · ${written} generated file(s) written` +
    (retired ? ` · ${retired} superseded copy/copies retired` : '') +
    (kept ? ` · ${kept} non-generated file(s) left untouched` : ''));
