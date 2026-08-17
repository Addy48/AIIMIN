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

# Journal

#feature #partial

## Modes (5)

1. Free Write
2. CBT Record
3. What Went Well
4. Morning Pages
5. Weekly Review

**Files:** `frontend/src/components/journal/*`, `JournalPage.jsx`

## Backend

- `POST /api/intelligence/analyze-journal` — Gemini emotion analysis
- Respects `ai_journal_opt_in` privacy toggle

## Open work

- iPad API sync (copy-paste MVP) — backlog A1
- Full UI pass — backlog F1
- [[07-Backlog/Master-Backlog]] C8 bug sweep

## Related

- [[02-Features/Command-Palette]]
- [[09-Integrations/Gemini-AI]]
