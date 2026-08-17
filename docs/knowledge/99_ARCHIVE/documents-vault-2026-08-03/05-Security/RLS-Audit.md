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

# RLS Audit

#security #open

Row Level Security on Supabase PostgreSQL.

## Known issues

- `daily_logs` policies dropped
- 11 tables: RLS enabled but **no policies** (API-only access may be OK)
- Missing `tester_allowlist` table

## Action

1. Export all policies from Supabase dashboard
2. Document per-table access model (user_id scoping)
3. Add missing policies to `supabase_init.sql`
4. Test IDOR scenarios

## Backlog: J5, J11

## Related

- [[05-Security/Production-Gap-Report]]
- [[09-Integrations/Supabase]]
