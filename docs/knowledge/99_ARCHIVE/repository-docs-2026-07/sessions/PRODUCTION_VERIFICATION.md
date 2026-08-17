# AIIMIN Production Verification Matrix

Run against `https://api.aiimin.in` after EC2 bootstrap + DNS + `.env` on server.

| # | Module | Endpoint | Pass criteria |
|---|--------|----------|---------------|
| 1 | Health | `GET /api/health` | `{ status: "ok" }` |
| 2 | Auth | `GET /api/account/user-profile` (Clerk JWT) | Profile + `subscription_tier` |
| 3 | Owner tier | Sign in as owner Clerk ID | `subscription_tier = elite` |
| 4 | Tester | Sign in as tester / allowlist | Waitlist bypass + `core`+ tier |
| 5 | Dashboard | `GET /api/dashboard/*` | Widgets load |
| 6 | Daily logs | `GET/POST /api/daily-logs` | CRUD works |
| 7 | Habits | `GET/POST /api/habits` | CRUD + streaks |
| 8 | Goals | `GET/POST /api/goals` | CRUD |
| 9 | Journal + AI | `POST /api/intelligence/analyze-journal` | JSON analysis |
| 10 | Finance | `GET /api/wealth/*` | Transactions, accounts |
| 11 | Discipline | `GET/POST /api/discipline/*` | Streaks, triggers |
| 12 | Family vault | `POST /api/family/documents/upload-url` | Presigned S3 URL |
| 13 | Calendar | `GET /api/google/auth` | OAuth redirect |
| 14 | Focus | `GET/POST /api/focus/*` | Sessions save |
| 15 | Lab | `GET/POST /api/lab/*` | Typing tests |
| 16 | Waitlist | `POST /api/waitlist` | Signup + email (SES) |
| 17 | Crons | `GET /api/keepalive`, `POST /api/cron/re-engagement` | 200 with `CRON_SECRET` |
| 18 | DB proxy | `GET /api/db/daily_logs` | No direct Supabase from frontend |

## Quick smoke test

```bash
curl -sf https://api.aiimin.in/api/health
```

## Frontend checks (Vercel)

- `REACT_APP_API_URL=https://api.aiimin.in/api`
- `REACT_APP_WAITLIST_MODE=true` for public launch
- `REACT_APP_OWNER_CLERK_IDS` / `REACT_APP_TESTER_CLERK_IDS` set
- No `REACT_APP_GEMINI_API_KEY` in production build (server proxy only)

## Manual-only steps

1. GoDaddy: `api.aiimin.in` A → Elastic IP (`13.205.214.223`)
2. Clerk Dashboard: production app + domains
3. EC2 `.env` from `deploy/.env.production.example`
4. SES: verify `aiimin.in` + SMTP credentials on EC2
5. Google Cloud: OAuth redirect `https://api.aiimin.in/api/google/auth/callback`
