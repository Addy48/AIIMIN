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

# Waitlist

#feature #deploy #open

## Components

- `WaitlistLanding.jsx`, `WaitlistForm.jsx`
- `REACT_APP_WAITLIST_MODE` in `App.js`

## API

- `POST /api/waitlist`
- `GET /api/waitlist/count` — **🔴 masks errors as `{ count: 0 }`**

## Open items

| ID | Issue |
|----|-------|
| G2 | Broken on production — not verified |
| G3 | Count error masking |
| G4 | OWNER/TESTER env vars not confirmed |

## Related

- [[04-Deploy/Launch-Checklist]]
- [[01-Architecture/Auth-Flow]]
