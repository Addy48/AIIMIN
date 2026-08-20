---
authority: engineering
derived_from: 09_FEATURES/Auth/Auth
status: shipped
owner: eng
lifecycle: frozen
last_reviewed: 2026-07-30
can_override_genesis: false
knowledge_layer: KL-BUILD
graph_role: leaf
note_type: NT-DOC
tags:
  - type/migration
  - domain/auth
  - status/shipped
---

# Better Auth Migration — AIIMIN (2026-07-08)

> [!abstract] Satellite note
> Not the primary feature MOC. Primary contracts live in the folder’s main feature note + [[09_FEATURES/Index]].


> [!note] Migration record
> This note records the July 2026 cutover. Use [[09_FEATURES/Auth/Auth]] for the current authentication contract.

## Status: Local complete, production deploy pending

### What replaced Supabase Auth
- App login: Better Auth at `/api/auth/*`
- Session: Bearer token (`set-auth-token` header) + cookies
- OS-ID + 6-digit PIN via `username` + `emailAndPassword` plugins
- Google login via Better Auth `socialProviders.google`
- Calendar/YouTube: **unchanged** separate OAuth at `/api/google/auth/*`

### Local env (configured in `.env`)
- `BETTER_AUTH_SECRET` — set (match EC2 production value)
- `BETTER_AUTH_URL=http://localhost:3001`
- `FRONTEND_URL=http://localhost:3000`
- `REACT_APP_API_URL=http://localhost:3001/api`
- `REACT_APP_WAITLIST_MODE=false` (local full app for dev/testers)
- `WAITLIST_MODE=true` on API (production gate; dev/tester emails bypass)
- Google redirects: `http://localhost:3001/api/...` — see [[09_FEATURES/Auth/GOOGLE-CLOUD-OAUTH-SETUP]]

### Database
- Better Auth tables: `user`, `session`, `account`, `verification`, `twoFactor`
- 18 users migrated; 16 credential accounts backfilled from `auth.users` password hashes
- Google identities backfilled for OAuth users
- `user_oauth_tokens.linked_email` for calendar account tracking

### Scripts
```bash
npm run auth:migrate           # apply Better Auth schema
npm run auth:import-users      # public.users → Better Auth user
npm run auth:backfill-accounts # auth.users passwords + Google identities
```

### Production (EC2) — still required
Set on `api.aiimin.in`:
```
BETTER_AUTH_SECRET=<same or new secret — if new, users re-login>
BETTER_AUTH_URL=https://api.aiimin.in
GOOGLE_REDIRECT_URI=https://api.aiimin.in/api/google/auth/callback
```

Google Cloud Console redirect URIs:
- `https://api.aiimin.in/api/auth/callback/google` (login)
- `https://api.aiimin.in/api/google/auth/callback` (calendar)
- `http://localhost:3001/api/auth/callback/google` (local login)
- `http://localhost:3001/api/google/auth/callback` (local calendar)

### Test locally
```bash
npm run dev:api          # port 3001
cd frontend && npm start # port 3000
curl http://localhost:3001/api/auth/ok  # → {"ok":true}
```
