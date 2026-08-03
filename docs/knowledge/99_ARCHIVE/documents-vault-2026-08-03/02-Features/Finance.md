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

# Finance

#feature

## Capabilities

- Excel import, manual entry, 13 categories, accounts
- Safe-to-spend, health score, SIP planner, subscription audit
- What-If simulator (Pro gated), emotion tags
- React Query data layer

## Open issues

- Excel import H12 — "No valid data" on some files (I3)
- AI import needs `GEMINI_API_KEY` for full path; regex fallback exists (I4)
- Negative expense validation fixed (security audit)

## Key files

- `MoneyManager.jsx`, `Finance.jsx`
- `server/routes` wealth/finance

## Related

- [[09-Integrations/Gemini-AI]]
- [[09-Integrations/Stripe]]
