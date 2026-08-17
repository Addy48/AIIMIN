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
# API — Auth

## Notable routes

| Method | Path | Notes |
|--------|------|-------|
| Better Auth handlers | `/api/auth/*` | Session + Google callback under Better Auth |
| GET | `/api/auth/me` | Current user |
| GET | `/api/auth/resolve` | Access resolution |
| POST | `/api/auth/complete-google-profile` | Profile completion |

## Warning

Login Google callback ≠ calendar Google callback. See [[02_ARCHITECTURE/Authentication]].

## Files

- `server/routes/auth.js`
- Feature: [[09_FEATURES/Auth/Auth]]
