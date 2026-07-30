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
# API — Waitlist

## Routes

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/api/waitlist/count` | Public | Signup count for social proof |
| POST | `/api/waitlist` | Public | Signup; returns position, referral_code, etc. |
| POST | `/api/waitlist/feedback` | Public/session as implemented | Feature vote / feedback |

## Files

- `server/routes/waitlist.js`
- Feature: [[09_FEATURES/Waitlist/Waitlist]]
- Table: [[03_DATABASE/waitlist_emails]]
