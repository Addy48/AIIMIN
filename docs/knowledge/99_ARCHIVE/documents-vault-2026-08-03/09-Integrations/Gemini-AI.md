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

# Gemini AI

#integration

## Uses

- Smart AI Log categorization (Command Palette)
- Journal emotion analysis
- Money import parsing (fallback: regex without key)
- Sports match preview
- Lab modules

## Env

`REACT_APP_GEMINI_API_KEY` (frontend)  
Server-side keys in EC2/Vercel env

## Open

- C5: richer news/buzz pipeline not built
- A6: weekly digest prose vs stats-only

## Related

- [[02-Features/Command-Palette]]
- [[02-Features/Journal]]
