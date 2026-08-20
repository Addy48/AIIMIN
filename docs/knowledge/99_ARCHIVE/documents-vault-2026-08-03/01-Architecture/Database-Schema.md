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

# Database Schema

#architecture #supabase

**Source of truth:** `backend/supabase_init.sql` (16 sections)

## Sections (high level)

1. Functions & triggers
2. Users
3. Daily tracking (`daily_logs`)
4. Goals & focus (pomodoro, DSA)
5. Calendar & notes
6. Wins & commitments
7. Money system
8. Habits & routines
9. Auth / OAuth
10. Notifications & analytics
11. Admin & system
12. Schema upgrade guards
13. Extended financial
14. Views
15. Gamification (`user_xp`, `xp_log`, `achievements`)
16. Verification queries

## Known gaps

See [[05-Security/Production-Gap-Report]]:
- Missing `users.clerk_id`
- Missing `tester_allowlist`
- RLS holes on `daily_logs`

## Migration policy

All schema changes go in **one file** — no separate migration files per AGENTS.md.

## Related

- [[09-Integrations/Supabase]]
- [[08-Migration/AWS-Cognito-Exploration]] (future data plane)
