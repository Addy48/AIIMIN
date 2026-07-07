# AIIMIN Codebase Audit — 2026-07-08

Full-stack audit: deploy parity, dead code, conflicting paths, CI/AWS/Vercel health.

---

## Executive summary

| Area | Status | Notes |
|------|--------|-------|
| **Git `main` vs `origin/main`** | ✅ In sync | HEAD `ac0a4896` — auth/onboarding fixes pushed |
| **Vercel production** | ✅ Deployed | `main.558dd5e6.js` at `www.aiimin.in` (commit `ac0a4896`) |
| **EC2 API** | ✅ Healthy | `GET https://api.aiimin.in/api/health` → 200 |
| **GitHub Actions** | ✅ Passing | Last 10 `deploy-api.yml` runs succeeded |
| **Local vs prod design** | ⚠️ Was stale cache | Prod now serves latest bundle; hard-refresh if old logo/layout |
| **Dual API path** | 🔧 Fixed this audit | Vercel `/api/*` proxied to EC2 (was broken serverless) |
| **Auth E2E** | ⚠️ Unverified | 6 commits fixed OAuth/onboarding; needs LC-12 retest |
| **Secrets in workspace** | 🔴 Risk | `Secrets, Keys /` folder untracked — added to `.gitignore` |
| **Debug instrumentation** | ⚠️ In prod bundle | `127.0.0.1:7876` fetch logs in auth files (harmless, remove after LC-12) |

---

## 1. Deploy parity (local → production)

### Frontend (Vercel)
- **Auto-deploy:** pushes to `main` trigger Vercel build.
- **Production bundle** embeds `REACT_APP_API_URL=https://api.aiimin.in/api` ✅ (verified in `main.558dd5e6.js`).
- **Bundle hash differs from local build** (`e6ed1f5d` local vs `558dd5e6` prod) — **expected**: CRA bakes env at build time; Vercel uses dashboard env, local uses `frontend/.env.production` (gitignored).
- **If design looks wrong online:** hard refresh (Cmd+Shift+R) or incognito. Earlier session saw stale `main.c049d01a.js`; now resolved.

### Backend (EC2 via GHA)
- Workflow: `.github/workflows/deploy-api.yml`
- Triggers only on `server/**`, `api/**`, `deploy/**`, `package.json` — **not** `frontend/**` alone.
- Recent auth fixes that touched `server/routes/auth.js` **did** trigger deploy (`ac0a4896`, `8d1f9430`).
- Frontend-only commits (`4e5be3e2`, `23890c8e`) correctly skipped EC2 — no API change needed.

### Uncommitted local work (should commit)
| File | Purpose |
|------|---------|
| `docs/CHAT-HANDOFF.md` | Session handoff |
| `scripts/launch-verify.mjs` | LC health checker |
| `scripts/test-waitlist-e2e.mjs` | Waitlist E2E |
| `scripts/seed-access-allowlist.mjs` | kuldeep email fix |
| `deploy/.env.production.example` | kuldeep + Resend template |
| `deploy/LAUNCH-PLAN.md` | Launch runbook |
| `frontend/.env.example` | Dev env template |

**Do NOT commit:** `Secrets, Keys /`, `.agents/`, `.qwen/`, `skills-lock.json`

---

## 2. Architecture conflicts (fixed / documented)

### Dual API (was broken)
```
Browser → www.aiimin.in
  ├─ REACT_APP_API_URL → api.aiimin.in (EC2) ✅ primary
  └─ fallback /api → Vercel serverless api/index.js ❌ broken DATABASE_URL
```

**Vercel runtime errors (7d):** `ENOTFOUND tenant/user dashboard_app.yubxgftugxbwtywyhcsv` on `/api/index.js` — Vercel env had malformed/stale Supabase pooler credentials.

**Fix (this audit):** `vercel.json` now **proxies** `/api/*` → `https://api.aiimin.in/api/*` and removes `@vercel/node` build. Cron `/api/keepalive` hits EC2 via proxy.

### Stale `.env.vercel` (local only)
- Contains `REACT_APP_API_URL=https://aiimin-backend.aiimin.workers.dev/api` — **dead Cloudflare Workers URL**.
- Gitignored now. Do not use for production; Vercel dashboard is source of truth.

### Legacy redirect URIs (Google OAuth console)
Still registered but unused:
- `aiimin-backend.aiimin.workers.dev`
- `clerk.aiimin.in`
Safe to remove from Google Cloud Console when convenient.

---

## 3. Dead / out-of-scope code

| Item | Location | Recommendation |
|------|----------|----------------|
| Clerk auth | Removed from code | Docs only — updated Command Center |
| Cognito | `deploy/COGNITO-SETUP.md` | **Deferred** per LAUNCH-PLAN |
| AWS SES email | `reEngagementService.js` comment | Resend is live; migrate re-engagement to Resend |
| Gmail nodemailer | `server/routes/feedback.js` | Optional fallback if `GMAIL_APP_PASSWORD` set; migrate to Resend |
| `backend/` folder | N/A | Already removed — schema in `server/` + `supabase_init.sql` |
| Mock data provider | `MockDataProvider.js` | Dev-only when `REACT_APP_USE_MOCK_DATA=true` |
| `demo-user-id` | `AGENTS.md` mention | Historical — real auth via Supabase |
| GCP console PNG | Deleted locally | Safe to commit deletion |
| Render config | `render.yaml` gitignored | Not in use |

---

## 4. GitHub Actions

| Workflow | Scope | Last run |
|----------|-------|----------|
| `deploy-api.yml` | EC2 SSH deploy | ✅ Success `ac0a4896` |

**Gap:** No frontend CI (lint/test/build). Vercel handles build. Consider adding `frontend` build check on PRs later.

---

## 5. AWS / EC2

- **Instance:** `13.207.146.15` → `api.aiimin.in`
- **Process:** PM2 `aiimin-api` → `dev_server.js` → `api/index.js` (Hono)
- **DB:** Supabase PostgreSQL via Supavisor pooler (`resolveDatabaseUrl` in `server/lib/db.js`)
- **Email:** Resend (`server/lib/email.js`) — SES removed
- **Future:** `docs/AWS_MIGRATION_MASTER_PLAN.md` — RDS + Cognito + S3 deferred until post-tester

---

## 6. Vercel

| Project | Domains | Production |
|---------|---------|------------|
| `aiimin` | `www.aiimin.in`, `aiimin.in` | `dpl_2fp4vp8vSF49wTtWcLLADBcF3Lza` READY |

**Required production env (verify dashboard):**
- `REACT_APP_SUPABASE_URL`
- `REACT_APP_SUPABASE_ANON_KEY`
- `REACT_APP_API_URL=https://api.aiimin.in/api`
- `REACT_APP_WAITLIST_MODE=true`
- `REACT_APP_TESTER_EMAILS` (include kuldeep)

**Missing (LC-09/10):** `REACT_APP_GA_MEASUREMENT_ID`, `REACT_APP_SENTRY_DSN`

---

## 7. Auth pipeline (6 fixes on main)

| Commit | Issue fixed |
|--------|-------------|
| `4e5be3e2` | OAuth callback hang (hash/PKCE deadlock) |
| `5c85d3ba` | Double PKCE code exchange |
| `23890c8e` | Tester bounced to waitlist after login |
| `4640a4d5` | Token invalid after PIN (admin password revoke) |
| `8d1f9430` | PIN keyboard + submit order |
| `ac0a4896` | No session — hydrate from `sb-*-auth-token` storage |

**Still needs:** LC-12 manual E2E per tester email.

---

## 8. Security actions

1. ✅ `Secrets, Keys /` added to `.gitignore` — never commit
2. ⚠️ Rotate Resend API key if exposed in chat
3. ⚠️ Google `client_secret` in untracked JSON — rotate if ever committed
4. ⚠️ Remove debug `fetch('http://127.0.0.1:7876/...')` from auth files after LC-12 pass

---

## 9. Launch checklist snapshot

Run anytime: `node scripts/launch-verify.mjs`

| Check | Result |
|-------|--------|
| API health | ✅ |
| Waitlist count | ✅ (1 signup) |
| Tester allowlist | ✅ 6/6 |
| Resend configured | ✅ |
| GA4 / Sentry | ❌ not set |
| LC-12 onboarding E2E | ⚠️ pending |

---

## 10. Recommended next steps (priority)

1. **Deploy `vercel.json` proxy fix** — push this audit commit
2. **LC-12:** Each tester: Google login → onboarding → `/overview`
3. **Set GA4 + Sentry** on Vercel + EC2
4. **Rotate Resend key** (Phase 0.7)
5. **Remove auth debug logs** after LC-12 confirmed
6. **Migrate feedback route** from Gmail nodemailer → Resend
7. **AWS Phase 0–1** — defer until September launch window

---

*Generated 2026-07-08 — see `docs/CHAT-HANDOFF.md` for session context.*
