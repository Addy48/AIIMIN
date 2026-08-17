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

# Sports

#feature #partial

## Current

- Backend cache + provider registry is active (`server/services/sportsCacheService.js`)
- Client feed renders personalized tabs, match cards, and AI previews
- Sports covered: cricket, football, basketball, F1, baseball, hockey, tennis, volleyball, table tennis
- News now has backend enrichment (`server/services/sportsNewsService.js`) and UI strip extraction

## Open (backlog)

- C3: complete parser unification and provider health telemetry
- C4: tune team presets and coverage quality for newly added sports
- C5: expand post-match summary surfaces and notification wiring

## Related

- [[09-Integrations/Gemini-AI]]
- Account → Personalization sports prefs
