# API Usage & Dev Tools

## Purpose

Owner/dev-only visibility into external API consumption and free-tier budget headroom. No API key values are ever returned by the API.

## Routes

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/admin/api-usage` | requireAuth + owner/dev |
| GET | `/api/admin/api-usage/providers` | requireAuth + owner/dev |
| POST | `/api/intelligence/usage-report` | requireAuth (client telemetry for Groq) |

## Database

- `api_usage_log` — per-call audit (user, provider, endpoint, units, timestamp)
- `api_provider_budgets` — global daily counters per provider

Migration: `server/migrations/032_api_usage_tracking.sql`

## Providers tracked

| Provider key | Source | Default daily limit |
|--------------|--------|---------------------|
| `cricapi` | CricketData.org CricAPI | 100 |
| `rapidapi_cricket` | RapidAPI cricket free data | 100 |
| `gemini` | Google Gemini server proxy | 200 |
| `groq` | Groq heavy (server) | 1000 |
| `openrouter` | OpenRouter free fallback | 50 |
| `moonshot` | NVIDIA Kimi (journal analyze) | 500 |
| `sports_cron` | Sports cache refresh | 48 |

Override limits via env: `CRICAPI_DAILY_LIMIT`, `GEMINI_DAILY_LIMIT`, etc. (see `deploy/.env.production.example`).

## Frontend

Settings → Admin Tools → **API Usage** tab (visible when `useAccessGate` role is `owner` or `dev`).

## Related files

- `server/services/apiUsageService.js`
- `server/routes/admin.js`
- `server/middleware/requireDev.js`
- `frontend/src/components/account/AdminPanel.jsx`

## Status

Shipped 2026-07-04 — budgets, logging, dev dashboard tab.
