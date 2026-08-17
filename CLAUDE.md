# AIIMIN — Claude Code

> Deep memory = the vault. Boot through it, never scan the repo.

## Boot (every session, in order)

1. `docs/knowledge/00_HOME.md`
2. **`docs/knowledge/00_ROUTING.md`** — "for X, read exactly this file". Find your job, open
   only what it names. This exists so you never scan the repo or the whole vault.
3. `docs/knowledge/15_MEMORY/Current-Context.md` — what is actually happening now
4. Constitutional work only → `docs/knowledge/Maps of Content/Genesis.md` → `Genesis/`
   (immutable, never edit)

## Current mission (2026-08-03)

Two tracks, each in its own chat. The paste-ready prompt for each is in the handoff:

| Track | Handoff |
|-------|---------|
| **Native Android app — from scratch, Kotlin + Compose, screen by screen** | `docs/knowledge/15_MEMORY/Handoff-Native-App-Build.md` §3 |
| **Website hardening · Vercel · AWS · machine** | `docs/knowledge/15_MEMORY/Handoff-Website-Hardening.md` §2 |

Guardrails G1–G10 (one surface at a time, one-job law, evidence before claims):
`docs/knowledge/17_NATIVE_APP_V2/AIIMIN_APP_BUILD_AGENT_PLAN.md` §0.

**FULL APP POTENTIAL · ZERO SKIP · GENESIS SCOPE**

## Locked — do not re-litigate

- **App stack:** Kotlin + Jetpack Compose, native, Android-first, **from scratch** at
  `native-android-v3/`. `native-android/` (V2) is the **old app** — reference only for its
  `sync/`, `session/`, `security/`, `data/network/`; **never copy its `ui/`**.
- **Design:** the Drafting Table palette and typography are founder-approved and **LOCKED**.
  Source of truth: `frontend/prototypes/AIIMIN-Drafting-Table.html`, tokens at
  `frontend/src/prototypes/drafting-table/tokens.css`. Accent steel `#749dc4` / `#416180`;
  `#ff6b35` is the peak-A brand spark only. Craft, layout and motion are open.
- **Life Score:** five dimensions, keys `physical · cognitive · discipline · financial ·
  emotional`, labelled BODY · MIND · DISCIPLINE · MONEY · MOOD. Computed **server-side only**
  (`server/services/lifeHealthEngine.js`) — clients never recompute.
  → `docs/knowledge/10_DECISIONS/2026-08-03-life-score-taxonomy.md`
- **Genesis is constitutional:** Today is capture-first, there is no Dashboard surface, every
  surface declares one job.

## Rules

- Data goes through `/api/*` with the session cookie. Never direct PostgREST, never a
  client-supplied user id. New table ⇒ `USER_SCOPED_TABLES` **and** an RLS policy, same migration.
- Never type the founder's PIN or any credential — he types it.
- Do not revive `frontend/prototypes/personal-os/` (deleted 2026-08-14; see
  `docs/knowledge/16_DOCUMENTATION/Completed-Work-Ledger.md`). Do not change auth or schema unless the
  founder asks. No secrets in the vault or in git.
- Commit / push / PR only when the founder asks.
- Evidence before claims — no "done" without real output.

## Monorepo (do not mix in one commit)

| Client | Path | State |
|--------|------|-------|
| Web Life OS | `frontend/` | live at aiimin.in |
| Capacitor `/m` | `frontend/android/`, `frontend/src/components/mobile/` | capture-only |
| **Native Android V3** | `native-android-v3/` | **being built** |
| Native Android V2 | `native-android/` | old — reference only |

## Personal vault (symlinked — one copy, not a duplicate)

`~/Documents/AIIMIN VAULT/` is the founder's Obsidian vault:

- **`Reference/`** — a **symlink** to `docs/knowledge/`. Not a copy. Editing a note there
  edits the repo and shows in `git status`. This is why drift is impossible.
- **`My Notes/`** — the founder's private notes. Outside the repo. **Never read, write or
  reference it** unless he asks.
- `00-Home.md` — the only generated file.

Regenerate Home after vault changes (a Stop hook also does it automatically):

```
node scripts/sync-personal-vault.mjs
```

Canonical is always `docs/knowledge/`. Human-readable orientation: `docs/knowledge/Guides/`.
