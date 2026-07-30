---
Purpose: Build, deploy, hosting, environment names, CI/CD, configuration, scripts.
Confidence: 0.92
Generated From: package.json scripts; vercel.json; .github/workflows/*; docs/knowledge/07_DEPLOYMENT/Deploy.md; .env.example; frontend/.env.example; deploy/*
Dependencies: [01_REPOSITORY_MAP.md](01_REPOSITORY_MAP.md), [12_DEPENDENCY_GRAPH.md](12_DEPENDENCY_GRAPH.md)
Consumers: Ops / ship agents
Last Updated: 2026-07-22
Pass: 1/6
---

# 13 — Build System

## Local development

| Command | Effect |
|---------|--------|
| `npm run dev` | API + frontend concurrently |
| `npm run dev:api` / `node dev_server.js` | Hono API :3001 |
| `npm run dev:frontend` / `cd frontend && npm start` | CRACO CRA :3000, proxy→3001 |
| `npm run build` | verify-production-env + frontend build |
| `npm test` | `node --test server/services/*.test.js` |
| Auth helpers | `auth:migrate`, `auth:import-users`, `auth:backfill-accounts`, `auth:reset-fresh` |

Frontend Capacitor:

- `cap:sync`, `cap:android`, `cap:build:android`, `cap:dev:phone`, `cap:open:android`

Native:

```bash
cd native-android
export JAVA_HOME="$(/usr/libexec/java_home -v 17)"
./gradlew :app:assembleDebug
```

## Frontend build

1. `frontend/scripts/export-logo-assets.mjs` (on build)
2. `craco build` → `frontend/build`
3. Root `vercel.json` `@vercel/static-build` `distDir: frontend/build`
4. SPA rewrite `/(.*) → /index.html`
5. `/api/(.*) → https://api.aiimin.in/api/$1`

## API deploy

| Path | Detail |
|------|--------|
| Host | EC2 `aiimin-api`, EIP `13.207.146.15`, `api.aiimin.in` |
| Process | PM2 via `deploy/ecosystem.config.cjs` |
| Script | `deploy/github-ec2-deploy.sh` |
| CI | `.github/workflows/deploy-api.yml` on `server/**` `api/**` `deploy/**` |
| Health | `GET https://api.aiimin.in/api/health` |
| Nginx | `deploy/nginx.conf` |

Agent rule (Deploy.md / git workflow): after commit+push touching API, ship EC2 same turn.

## Other CI

| Workflow | Role |
|----------|------|
| `verify-frontend.yml` | Frontend verification |
| `native-android.yml` | Native Android CI |

## Hosting matrix

| Surface | Host |
|---------|------|
| Web | Vercel `aiimin.in` |
| API | EC2 `api.aiimin.in` |
| DB | Supabase |
| Native | Play / sideload APK |
| Capacitor | Play + remote WebView to `/m` |

## Cron / keepalive

- Vercel cron daily → `/api/keepalive` (rewritten to EC2)
- `deploy/cron.sh` — sports etc.; Bearer `CRON_SECRET`
- `/api/cron/re-engagement`, `/api/cron/correlations`

## Environment variable **names** (no values)

### From `.env.example` (server/root oriented)

`AI_DAILY_LIMIT_CORE|ELITE|EXPLORE|PRO`, `BETTER_AUTH_API_KEY`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `BLOB_READ_WRITE_TOKEN`, `CRICAPI_KEY`, `CRON_SECRET`, `DATABASE_URL`, `DEV_EMAILS`, `FRONTEND_URL`, `GEMINI_API_KEY`, `GEMINI_DAILY_LIMIT`, `GEMINI_LITE_API_KEY`, `GEMINI_LITE_MODEL`, `GOOGLE_CALENDAR_CLIENT_ID`, `GOOGLE_CALENDAR_CLIENT_SECRET`, `GOOGLE_CALENDAR_REDIRECT_URI`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_LOGIN_CLIENT_ID`, `GOOGLE_LOGIN_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`, `GROQ_API_KEY`, `GROQ_DAILY_LIMIT`, `GROQ_MODEL`, `KIMI_API_KEY`, `MOONSHOT_DAILY_LIMIT`, `NODE_ENV`, `NVIDIA_API_KEY`, `OPENROUTER_*`, `OWNER_EMAILS`, `PORT`, `RAPIDAPI_CRICKET_HOST`, `RAPIDAPI_CRICKET_KEY`, `REACT_APP_*` (also listed), `RESEND_*`, `SENTRY_DSN`, `STRIPE_*`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL`, `TESTER_EMAILS`, `TOKEN_ENCRYPTION_KEY`, `WAITLIST_*`, `XAI_API_KEY`

Product.md also names: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` (may or may not be in `.env.example` — listed as product matrix).

### Frontend `REACT_APP_*` observed in code/examples

`REACT_APP_API_URL`, `REACT_APP_WAITLIST_MODE`, `REACT_APP_DEV_EMAILS`, `REACT_APP_DEV_EMAIL`, `REACT_APP_TESTER_EMAILS`, `REACT_APP_GA_MEASUREMENT_ID`, `REACT_APP_SENTRY_DSN`, `REACT_APP_SUPABASE_URL`, `REACT_APP_SUPABASE_ANON_KEY`, `REACT_APP_SUBSCRIPTION_MODE`, `REACT_APP_USE_MOCK`, `REACT_APP_GEMINI_API_KEY` (discouraged by example comments)

### Waitlist mode files

- Local full app: `REACT_APP_WAITLIST_MODE=false` in `.env.local`
- Production waitlist: `true` via committed `frontend/.env.production` (per Deploy.md)

## Scripts folder (selected)

Auth migrate/import/reset · waitlist clear/invite/screenshots · seed demo/realistic · AI key test · email test · vault helpers · `verify-repo.sh` · EC2 AI env sync · launch-local/verify

## Config files of note

`vercel.json` · `deploy/ecosystem.config.cjs` · `deploy/nginx.conf` · `frontend/capacitor` configs · `native-android/gradle*` · `.mcp.json` / `.mcp.json.example`

## Cross-references

- Architecture → [02_ARCHITECTURE.md](02_ARCHITECTURE.md)
- Stats → [14_REPOSITORY_STATISTICS.md](14_REPOSITORY_STATISTICS.md)
