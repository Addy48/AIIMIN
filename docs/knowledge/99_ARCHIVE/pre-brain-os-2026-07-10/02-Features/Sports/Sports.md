# Sports

## Current state

- Backend cache: `server/services/sportsCacheService.js` — provider registry with fallbacks
- Client fallback: `frontend/src/services/sportsService.js`
- Cron refresh: `POST /api/sports/refresh/system` (Bearer `CRON_SECRET`) every 2h via `deploy/cron.sh`
- AI preview: `frontend/src/pages/Sports.jsx` via `getSportsPreview`

## Provider registry

| Key | Primary | Fallback chain | Env required |
|-----|---------|----------------|--------------|
| football | ESPN API | — | None |
| cricket | CricAPI (CricketData.org) | RapidAPI cricket → ESPN | `CRICAPI_KEY`, `RAPIDAPI_CRICKET_KEY`, `RAPIDAPI_CRICKET_HOST` |
| basketball | ESPN NBA | — | None |
| f1 | Jolpi Ergast mirror | — | None |
| baseball | ESPN MLB | — | None |
| hockey | ESPN NHL | — | None |
| tennis | ESPN ATP | — | None |
| volleyball | ESPN FIVB | — | None |
| tableTennis | ESPN ITTF | — | None |
| news | `sportsNewsService.js` | — | None |

Cricket priority order: **CricAPI → RapidAPI → ESPN** (budget-aware; skips exhausted paid tiers).

## Environment variables

| Variable | Purpose |
|----------|---------|
| `CRICAPI_KEY` | CricketData.org / CricAPI (primary cricket, 100 hits/day free) |
| `RAPIDAPI_CRICKET_KEY` | RapidAPI cricket fallback |
| `RAPIDAPI_CRICKET_HOST` | RapidAPI host (default `cricket-api-free-data.p.rapidapi.com`) |
| `CRICAPI_DAILY_LIMIT` / `RAPIDAPI_CRICKET_DAILY_LIMIT` | Optional budget overrides |
| `CRON_SECRET` | Authorize cron sports refresh |
| `DATABASE_URL` | `sports_cache` table persistence |

Document in `deploy/.env.production.example`.

## Routes

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/sports` | Required |
| POST | `/api/sports/refresh` | Required |
| POST | `/api/sports/refresh/system` | `CRON_SECRET` Bearer |

## Related files

- `server/routes/sports.js`
- `server/jobs/sportsFetcher.js`
- `server/services/sportsNewsService.js`
- `frontend/src/pages/Sports.jsx`
- `frontend/src/hooks/useSportsFeedQuery.js`
- `deploy/cron.sh`

## Status

C3 provider registry shipped. C4 volleyball + table tennis in registry. C5 news pipeline baseline live. Future: quality tuning, deeper AI summaries.
