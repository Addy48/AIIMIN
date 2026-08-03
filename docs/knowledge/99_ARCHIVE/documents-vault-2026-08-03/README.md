---
authority: none
status: superseded
superseded_by: docs/knowledge (canonical vault)
owner: founder
lifecycle: archive
last_reviewed: 2026-08-03
can_override_genesis: false
knowledge_layer: KL-COLD
graph_role: cold
note_type: NT-COLD
archived_from: ~/Documents/AIIMIN VAULT
archived_on: 2026-08-03
---

# Shelf — `~/Documents/AIIMIN VAULT` (second vault, retired 2026-08-03)

> [!danger] Not truth. Provenance only.
> Every note on this shelf carries a superseded banner. Nothing here may be cited.
> Canonical vault: [[00_HOME]] · agent routing: [[00_ROUTING]].

## What this was

A second Obsidian vault at `~/Documents/AIIMIN VAULT` — 46 notes, 204 KB, hyphen taxonomy
(`00-Home`, `01-Architecture`, `02-Features`…), **not under version control**. Authored
2026-07-04. It is the same generation as [[99_ARCHIVE/pre-brain-os-2026-07-10/README|the
pre-Brain-OS shelf]] and was superseded by the same 2026-07-10 cutover — but it was never
retired, so it kept being opened alongside the real vault.

Its own Home pointed at `docs/knowledge/00-Command-Center.md`, a file that has not existed
since that cutover. That is the proof it was orphaned, not maintained.

## Why it was retired — verified contradictions

Checked against the repo on 2026-08-03, not inferred:

| This shelf claims | Repository reality | Check |
|---|---|---|
| **Clerk** is primary auth; plan is Clerk → Cognito | **Better Auth** (OS-ID + PIN, Google) | `grep -ril clerk frontend/src server api` → **0 matches** |
| Backend lives in `backend/`, schema is one `supabase_init.sql`, "no migration files" | `server/` + `api/`; 48 numbered migrations | `backend/` and `supabase_init.sql` do not exist; `server/migrations/048_*.sql` does |
| HEAD `4e28b7a2` (2026-06-24), large uncommitted tree | HEAD `941e7267`, branch `feat/drafting-table-prototype`, pushed | `git log` |
| Debug instrumentation `127.0.0.1:7876` must be stripped before push (K1) | Already gone | `grep -rl "127.0.0.1:7876\|#region agent log"` → **0 matches** |
| Accent `#ff6b35` is the primary interactive accent | Drafting Table: steel `#749dc4` / `#416180`; `#ff6b35` is the single brand spark only | [[08_DESIGN/Palette]] |
| Gemini is the AI integration | Multi-provider router — Groq · Gemini · OpenRouter · NVIDIA NIM · Kimi | `server/lib/aiChat.js` |

## What was salvaged before retirement

One live finding only — everything else was stale or already covered:

- **Waitlist count masking** — `GET /api/waitlist/count` returns `{ count: 0 }` on error,
  hiding failures. Still present at `server/routes/waitlist.js:177`. Carried to
  [[11_BUGS/Waitlist-Count-Masking]].

Historical session notes (`10-Sessions/`) and the Jul-4 git timeline are duplicated by
[[16_DOCUMENTATION/Git-Timeline]] and the pre-Brain-OS shelf; no unique content.

## Related

- [[16_DOCUMENTATION/VAULT-CONSOLIDATION-2026-08-03]] — the full consolidation report
- [[99_ARCHIVE/README]]
