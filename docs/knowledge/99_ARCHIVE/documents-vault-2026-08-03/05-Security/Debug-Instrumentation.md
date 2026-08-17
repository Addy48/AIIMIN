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

> [!danger] SUPERSEDED — DO NOT USE AS TRUTH
> Snapshot of the pre-Brain-OS `~/Documents/AIIMIN VAULT` (authored 2026-07-04).
> Its architecture claims are **factually wrong** for the current codebase: it names
> **Clerk** as auth (real: **Better Auth**, OS-ID+PIN — Clerk has 0 matches in the repo),
> a `backend/` directory and single `supabase_init.sql` (real: `server/` + `api/` with
> 48 numbered migrations), and git HEAD `4e28b7a2`. Kept for provenance only.
> Canonical: [[00_HOME]] · routing: [[00_ROUTING]].

# Debug Instrumentation Cleanup

#security #deploy #open

**Status:** 🔴 Must fix before production push

## Problem

`#region agent log` blocks with `fetch('http://127.0.0.1:7876/ingest/...')` left in codebase.

## Known files

- `WaitlistForm.jsx`
- `Settings.jsx`
- `api.js`
- `Family.jsx` / family pages
- `Finance.jsx`
- `PersonalizationSection.jsx`
- `server/routes/waitlist.js`
- `server/routes/wealth.js`

## Action

```bash
rg "127.0.0.1:7876|#region agent log" --glob "*.{js,jsx}"
```

Delete all matches before [[04-Deploy/Git-Push-Status]].

## Backlog ID: K1
