---
authority: engineering
derived_from: Genesis
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
# user_oauth_tokens

## Purpose

Stored OAuth tokens for integrations (e.g. Google Calendar) — not Better Auth session cookies.

## Related

- Migration: `036_oauth_tokens_calendar_fix.sql`
- [[02_ARCHITECTURE/Authentication]]
- [[02_ARCHITECTURE/Calendar-Sync]]
