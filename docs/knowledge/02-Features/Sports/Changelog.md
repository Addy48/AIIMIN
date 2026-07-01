# Sports Changelog

## 2026-07-04

- Moved: status from "research only" to "partially implemented fallback logic"
- Why: both backend and frontend already include multiple source paths, but without a shared provider layer
- Files: `server/services/sportsCacheService.js`, `frontend/src/services/sportsService.js`, `frontend/src/pages/Sports.jsx`
- Status: partial; C3-C5 remain open

## 2026-07-04 (implementation pass)

- Moved: backend now uses provider registry + cron-safe refresh endpoint + env-based CricAPI key; sports coverage includes volleyball and table tennis
- Why: reduce fallback drift, unlock scheduled refresh, and expand multi-sport personalization
- Files: `server/services/sportsCacheService.js`, `server/services/sportsNewsService.js`, `server/routes/sports.js`, `deploy/cron.sh`, `frontend/src/services/sportsService.js`, `frontend/src/pages/Sports.jsx`
- Status: C3/C4/C5 shipped baseline; future work is quality tuning and deeper summary surfaces

## 2026-07-04 (dual cricket providers + usage budgets)

- Added: CricAPI primary + RapidAPI cricket fallback + ESPN tertiary; provider chain pattern in registry; usage logged to `api_usage_log`
- Why: reliable cricket during CricAPI outages/quota exhaustion; unified multi-provider fallback model
- Files: `server/services/sportsCacheService.js`, `server/services/apiUsageService.js`, `server/migrations/032_api_usage_tracking.sql`, `deploy/.env.production.example`
- Status: cricket failover live; budgets enforced on paid cricket tiers

## 2026-07-04 (env documentation)

- Added: provider registry env table — `CRICAPI_KEY` optional, `CRON_SECRET` required for cron refresh
- Why: clarify which sports need keys vs free ESPN/Jolpi endpoints
- Files: `docs/knowledge/02-Features/Sports/Sports.md`, `deploy/.env.production.example`
- Status: documented; no code changes required
