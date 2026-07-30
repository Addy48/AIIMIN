---
authority: engineering
derived_from: Genesis/P8 Master Specification
status: active
owner: eng
lifecycle: living
last_reviewed: 2026-07-25
can_override_genesis: false
knowledge_layer: KL-BUILD
graph_role: leaf
note_type: NT-ENG-LEAF
migration_batch: W4
fm_source: script
---
# Authentication Architecture

## Current stack

- Better Auth for session + Google login
- Login OAuth callback: `{BETTER_AUTH_URL}/api/auth/callback/google`
- Calendar Google OAuth is a **separate** integration path (`/api/google/auth/callback` style) — do not confuse with login

## Access gates

- Waitlist mode: public users without allowlist see pending / waitlist UX
- `DEV_EMAILS` / `TESTER_EMAILS` / allowlist tables grant elevated access
- Env: `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `FRONTEND_URL`, Google login client id/secret

## Feature doc

- [[09_FEATURES/Auth/Auth]]

## Related

- [[Overview]]
- [[01_PRODUCT/Product]]
