# AIIMIN — Chat Handoff Context (2026-07-08)

**Paste this into a new chat** to continue without re-explaining the project.

---

## What we are

Personal Life OS dashboard — **www.aiimin.in** (Vercel) + **api.aiimin.in** (EC2 `13.207.146.15`).  
DB: **Supabase PostgreSQL** (`yubxgftugxbwtywyhcsv`). Auth: **Supabase Auth** for testers (Cognito deferred).

---

## Current branch state (recovery)

**Active recovery branch:** `recovery/pre-waitlist-full` — merged to `main` after stabilization.

Recovered Jul 4 pre-waitlist work (Design Lab, 2-theme system, masthead nav, trajectory sun-arc, Journal Studio, Finance fixes) **on top of** waitlist/auth fixes from `main`.

**Full inventory:** `docs/RECOVERY-2026-07-08.md`  
**Audit:** `docs/CODEBASE-AUDIT-2026-07-08.md`

### What's on the recovery branch

| Feature | Status |
|---------|--------|
| Design Lab (Account → Design) | ✅ Recovered |
| Waitlist landing + access gate | ✅ Wired with auth |
| Login / signup / onboarding | ✅ Compatible with waitlist mode |
| Masthead navbar + trajectory widget | ⚠️ Partial — verify against prototypes |
| 2-theme system (aiimin-dark/light) | ⚠️ Partial — legacy themes still in CSS |
| Journal Studio | ✅ Recovered |
| Finance ShippedSubNav + Wealth fix | ✅ Shipped |
| Auth debug logs | ✅ Removed |
| Production build | ✅ `npm run build` passes |

---

## How to run locally vs production

### Local — full dashboard (default, no setup)

`frontend/.env.development` is committed with `REACT_APP_WAITLIST_MODE=false`.  
CRA loads it automatically for `npm start` / `npm run dev` — you land on login/overview, not the waitlist.

```bash
npm run dev
```

Optional override: copy `frontend/.env.example` → `frontend/.env.local` if you need different API keys.

### Local — test waitlist UX

Set `REACT_APP_WAITLIST_MODE=true` in `frontend/.env.local` (overrides `.env.development`). Add your email to `REACT_APP_TESTER_EMAILS`.

### Production (Vercel)

Committed: `frontend/.env.production` (public keys, `REACT_APP_WAITLIST_MODE=true`).  
Vercel dashboard should match or override. Build runs `verify-production-env.mjs` first.

```bash
REACT_APP_WAITLIST_MODE=true
REACT_APP_API_URL=https://api.aiimin.in/api
```

---

## Email (Resend — production)

- **From:** `noreply@admin.aiimin.in`
- **Template:** `aiimin-waitlist-confirmation` (`cf437c26-b3c9-4474-a312-1a4ec4e7340c`)
- **Sync:** `node scripts/sync-resend-waitlist-template.mjs`
- **Test:** `node scripts/test-email.mjs you@email.com`

---

## Critical env (EC2 `~/AIIMIN/.env`)

```bash
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@admin.aiimin.in
WAITLIST_MODE=true
DATABASE_URL=...supabase...
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

---

## Key files

| Area | Path |
|------|------|
| App routing (waitlist + auth) | `frontend/src/App.js` |
| Access gate | `frontend/src/hooks/useAccessGate.js` |
| OAuth session | `frontend/src/utils/authSession.js` |
| Design Lab | `frontend/src/pages/account/sections/DesignSection.jsx` |
| Production env | `frontend/.env.production` |
| Dev env (waitlist off) | `frontend/.env.development` |
| Build verifier | `frontend/scripts/verify-production-env.mjs` |
| Waitlist API | `server/routes/waitlist.js` |
| Vault docs | `docs/knowledge/00-Command-Center.md` |

---

## Open TODOs

1. **LC-12** — Each of 6 allowlist emails: Google login → onboarding → `/overview`
2. **LC-09 / LC-10** — GA4 + Sentry DSNs on Vercel + EC2
3. **Rotate Resend API key** if exposed in chat
4. **Typography ship** — Figtree + Bodoni replace Inter + Playfair globally
5. **Theme cleanup** — Remove legacy nordic/vercel green accents when switching themes
6. Run `node scripts/launch-verify.mjs` for health snapshot

---

## Excluded from git (never commit)

- `.env`, `.env.local`, `Secrets, Keys /`
- `.agents/`, `.qwen/`, `.cursor/debug-*.log`
- `skills-lock.json` (local agent registry)

---

*Updated 2026-07-08 — dev defaults to full app via `.env.development`; waitlist CSS restored from v9 (71c52305).*
