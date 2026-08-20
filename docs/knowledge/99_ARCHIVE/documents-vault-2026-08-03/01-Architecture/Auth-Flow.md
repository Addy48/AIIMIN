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

# Auth Flow

#architecture #auth

## Current (production intent)

1. **Clerk** — primary auth ([[09-Integrations/Clerk]])
2. Google OAuth via Clerk
3. Backend verifies Clerk JWT
4. `users` row ensured on first API hit (family fix)

## Legacy

- OS-ID system (`9491d22b`) — 8 char alphanumeric
- Supabase Auth planned in early AGENTS.md — partially superseded by Clerk

## Waitlist gating

`REACT_APP_WAITLIST_MODE` — see [[02-Features/Waitlist]]

Owner/tester bypass: `OWNER_CLERK_IDS`, `TESTER_CLERK_IDS`

## Future

[[08-Migration/Clerk-to-Cognito]] — AWS Cognito User Pools + Google IdP

## Guest mode

`user.isGuest` — data not persisted; banner in [[04-Deploy/Production-Stack]]
