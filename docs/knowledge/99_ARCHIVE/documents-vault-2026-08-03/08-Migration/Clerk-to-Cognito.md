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

# Clerk to Cognito Migration

#migration #open

## Why

User wants to drop Clerk; use AWS Cognito with generous free tier + existing credits.

## Steps (high level)

1. Create Cognito User Pool + Google IdP
2. Add `cognito_sub` to users table (or replace clerk_id)
3. Replace `@clerk/clerk-react` with Cognito SDK / Amplify Auth
4. Update backend JWT middleware
5. User migration script (export Clerk → import Cognito)
6. Update Vercel env vars
7. Deprecate [[09-Integrations/Clerk]]

## Size: XL

## Related

- [[08-Migration/AWS-Cognito-Exploration]]
- [[07-Backlog/Master-Backlog]] E3, H3
