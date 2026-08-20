---
Purpose: Map every HTTP API endpoint — purpose, auth, source file, consumers, dependencies.
Confidence: 0.91
Generated From: api/index.js; server/routes/*.js; blobService.js; auth.js middleware
Dependencies: [02_ARCHITECTURE.md](02_ARCHITECTURE.md), [07_DATA_MODELS.md](07_DATA_MODELS.md)
Consumers: Frontend/native clients; [03_FEATURE_INVENTORY.md](03_FEATURE_INVENTORY.md); [12_DEPENDENCY_GRAPH.md](12_DEPENDENCY_GRAPH.md)
Last Updated: 2026-07-22
Pass: 1/6
---

# 08 — API Map

**Base:** `https://api.aiimin.in/api` (local `http://localhost:3001/api`)  
**Entry:** `api/index.js` (Hono). Vercel rewrites `/api/*` → EC2.

**Auth legend:** `none` · `requireAuth` · `requireAuthUnlessGuest` · `owner` · `devOrOwner` · `cron` · `stripe-sig` · `better-auth`

Consumers column uses: **Web** · **Native** · **Public** · **Cron** · **Admin**.

---

## Inline (`api/index.js`)

| Method | Path | Auth | Purpose | Consumers |
|--------|------|------|---------|-----------|
| GET | `/health` | none | Liveness | Ops, badges |
| GET | `/keepalive` | none | DB + Supabase ping | Vercel cron |

---

## Auth — `server/routes/auth.js` + Better Auth catch-all

| Method | Path | Auth | Purpose | Consumers |
|--------|------|------|---------|-----------|
| GET | `/auth/oauth-handoff` | none | OTT handoff to SPA | Web OAuth |
| GET | `/auth/resolve` | none | OS-ID → email | Login |
| GET | `/auth/access` | requireAuth | Waitlist/tier gate | Web |
| GET | `/auth/me` | requireAuth | Profile | Web/Native |
| POST | `/auth/complete-google-profile` | requireAuth | Username onboarding | Web |
| POST | `/auth/set-pin` | requireAuth | 6-digit PIN | Native/Web |
| POST | `/auth/logout` | none | Sign out | Web/Native |
| * | `/auth/*` | better-auth | sign-in/up, session, Google callback, 2FA, bearer, OTT | All |

---

## Feature routers (mounted via routeMap)

### Daily logs — `dailyLogs.js`

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET/POST | `/daily-logs` | requireAuth | List / upsert |
| GET | `/daily-logs/:userId/:date` | requireAuth | Single day |
| POST | `/daily-logs/journal/ai-analyze` | requireAuth | Journal AI |

### Dashboard — `dashboard.js`

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/dashboard/summary` | requireAuth | Today aggregate |
| GET | `/dashboard/widgets` | requireAuth | 7-day widgets |

### Tasks — `tasks.js` (`auth` alias)

CRUD `/tasks`, `/tasks/:id`.

### Google integration — `googleAuth.js` → paths under `/google/auth/*`

| Method | Path | Auth | Notes |
|--------|------|------|-------|
| GET | `/google/auth/google` | none | **410** deprecated login |
| GET | `/google/auth/init` | requireAuth | Calendar/Drive OAuth start |
| GET | `/google/auth/callback` | none | Store tokens |
| GET | `/google/auth/status` | requireAuth | Status |
| POST | `/google/auth/disconnect` | requireAuth | Revoke |

### Calendar — `calendar.js`

events CRUD · sync status/pull/push · day/:date · heatmap — all requireAuth.

### Notifications — `notifications.js`

list · count · read · mark-all-read · delete · trigger-weekly — requireAuth.

### Account — `account.js`

profile GET/PATCH · user-profile GET/PATCH · export · wipe-life-data · DELETE account — requireAuth.

### Habits / Goals — `habits.js` / `goals.js`

Standard REST CRUD (+ habit logs) — requireAuth.

### Family — `family.js`

members · documents · insurance · health-records · reminders (+done) · emergency (+pin) — requireAuth.

### Lab — `lab.js`

summary · practice typing/speaking/reaction/decisions · mindset · onboard · typing GET · reading GET/POST — requireAuth.

### Placements — `placements.js`

resumes upload/list/confirm/view-url/delete · applications CRUD · habit-logs · readiness — requireAuth.

### Wealth — `wealth.js`

assets · accounts · transactions · budgets · categories CRUD · import · ai-summary · import/ai — requireAuth.

### Sports — `sports.js`

GET `/sports` · POST `/sports/refresh` — requireAuth.  
(**Note:** vault `_manifest.json` also lists `POST /api/sports/refresh/system` — verify if present in route file; inventory agent listed user refresh only.)

### Intelligence — `intelligence.js`

| Path | Auth | Purpose |
|------|------|---------|
| GET `/intelligence/lhs` | requireAuth | Life Health scores |
| GET `/intelligence/report` | requireAuth | Executive report |
| POST `/intelligence/lite` | requireAuth+aiLimiter | Gemini lite |
| GET `/intelligence/lite/status` | requireAuth | |
| POST `/intelligence/generate` | requireAuth+aiLimiter | Groq heavy |
| POST `/intelligence/gemini-proxy` | requireAuth+aiLimiter | |
| POST `/intelligence/chat` | requireAuth+aiLimiter | |
| POST `/intelligence/usage-report` | requireAuth+aiLimiter | |
| GET `/intelligence/ai-budget` | requireAuth | |
| POST/GET `/intelligence/report-gen/*` | requireAuth | quota |
| POST `/intelligence/universal-log` | requireAuth | |
| POST `/intelligence/arc/sharpen` | requireAuth+aiLimiter | |
| POST `/intelligence/north-star/sharpen` | requireAuth+aiLimiter | **alias** same handler |
| GET `/intelligence/correlations` | requireAuth | |
| POST `/intelligence/correlations/refresh` | requireAuth | |

### ATS — `ats.js`

POST `/ats/analyze` — requireAuthUnlessGuest.

### Blob — `blobService.js`

POST `/blob/upload` · DELETE `/blob/delete` — **none** (flag).

### Feedback — `feedback.js`

POST `/feedback` — requireAuth.

### Waitlist — `waitlist.js`

| Path | Auth |
|------|------|
| GET `/waitlist/count` | none |
| GET `/waitlist/list` | requireAuth+owner |
| POST `/waitlist/approve` | requireAuth+owner |
| POST `/waitlist/feedback` | feedbackLimiter |
| POST `/waitlist` | waitlistLimiter |

### Admin — `admin.js` (requireAuth + requireDevOrOwner)

api-usage · api-usage/providers · recent-logs · tables · tables/:name · simulate · wipe/:table

### Cron — `cron.js`

| Path | Auth |
|------|------|
| GET `/cron/re-engagement` | cron |
| GET `/cron/correlations` | cron |
| GET `/cron/health` | none |

### Billing — `billing.js`

plans · status · select-tier · checkout · webhook (stripe-sig) · simulate-upgrade

### Discipline — `discipline.js`

streak CRUD/increment/reset · log · logs · insights · replacement-habits · urge start/resolve/list · patterns

### Notes — `notes.js`

CRUD · anchors · link-suggest · recall queue · drive status/watch/sync

### Focus — `focus.js`

GET week-stats · POST sessions

### Journal — `journal.js`

CRUD list/get/create/patch/delete

### DB gateway — `db.js`

GET/POST/PATCH/DELETE `/db/:table` · POST upsert — requireAuth; write-blocks apply.

**Flag:** `NO_USER_SCOPE` referenced but undefined.

### User — `user.js`

POST `/user/pulse-check` — requireAuth → `user_feedback`

### Mobile — `mobile.js`

| Path | Auth | Consumers |
|------|------|-----------|
| GET `/mobile/bootstrap` | requireAuth | Native |
| POST `/mobile/devices` | requireAuth | Native |
| POST `/mobile/sync/batch` | requireAuth | Native |
| GET `/mobile/health` | none (+limiter) | Native/ops |

---

## Unmounted

`server/routes/health.js` — would expose `/health/` and `/health/db` if mounted; **not** in routeMap.

---

## Services dependency index

See agent inventory: `accessService`, `analyticsData`, `apiUsageService`, `billingService`, `blobService`, `correlationService`, `documentExpiryService`, `emailLogService`, `intelligenceReportService`, `kimiAtsService`, `lifeHealthEngine`, `lifeScoreDisplay`, `reEngagementService`, `reportGenerator`, `sportsCacheService`, `sportsNewsService`, `subscriptionAuditService`, `userProfileService`, `wealthAiImportService`, `wealthImportHelpers`, `wealthSpreadsheetImportService`, `weeklyDigestService`, `weeklyReviewEngine`.

Jobs: `correlationEngine.js`, `sportsFetcher.js`, `recurringTransactions.js` (**no HTTP mount**).

---

## Client helper modules (not HTTP servers)

`frontend/src/api/{correlations,dailyLogs,discipline,focus,goals,habits,journal,notes}.js` — fetch wrappers.

---

## Conflicts / flags

| Issue | Detail |
|-------|--------|
| Triple health | `/health`, `/cron/health`, `/mobile/health` |
| Blob unauthenticated | upload/delete |
| Google path doubling | `/api/google/auth/...` |
| Manifest vs code | `POST /sports/refresh/system` in `_manifest.json` — confirm in `sports.js` |
| Docs cite `server/index.js` | Does not exist |
| Vercel vs EC2 | Frontend on Vercel; API compute on EC2 |

## Cross-references

- Models → [07_DATA_MODELS.md](07_DATA_MODELS.md)
- Architecture → [02_ARCHITECTURE.md](02_ARCHITECTURE.md)
