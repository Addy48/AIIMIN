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

# Typography

#design #feature

## Current

- Global type scale now follows tokenized classes and font-scale controls.
- Frontend has both legacy inline sizes and token classes; rollout is ongoing.
- Backend profile sync for text size is now tracked as C1 in the backlog.

## Canonical references

- `~/Desktop/DASHBOARD PROJECT/docs/knowledge/02-Features/Typography/Typography.md`
- `~/Desktop/DASHBOARD PROJECT/frontend/src/index.css`
- `~/Desktop/DASHBOARD PROJECT/frontend/src/styles/globals.css`

## Notes

- Prefer token classes (`text-h*`, `text-body`, `text-caption`) over inline `fontSize`.
- Keep changes append-only in feature changelog notes.
