# API Usage & Dev Tools

## Purpose

Owner/dev-only visibility into external API consumption and free-tier budget headroom. No API key values are ever returned by the API.

## Dual budget model

1. **Per-user (tier)** — sum of Gemini/Groq/OpenRouter/moonshot hits today vs `AI_DAILY_LIMIT_*` (defaults: Explore 1, Core 10, Pro 25, Elite 40). Over → `429` `USER_AI_BUDGET_EXCEEDED`.
2. **Global (provider)** — org-wide free-key ceiling in `api_provider_budgets`. Over → `429` `BUDGET_EXCEEDED`.

Both enforced in `trackExternalCall` (wealth/journal no longer bypass).

## Routes

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/admin/api-usage` | requireAuth + owner/dev |
| GET | `/api/admin/api-usage/providers` | requireAuth + owner/dev |
| GET | `/api/intelligence/ai-budget` | requireAuth (caller's remaining AI quota) |
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
| `gemini` | Google Gemini server proxy | 150 |
| `groq` | Groq heavy (server) | 800 |
| `openrouter` | OpenRouter free fallback | 40 |
| `moonshot` | NVIDIA Kimi path | 80 |
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

### 2026-07-18 — Abuse harden
- **What:** `/intelligence/usage-report` no longer calls `trackExternalCall` (was draining **global** provider ceilings). Now user-tier log only, units capped ≤3. `trackExternalCall` uses advisory lock + unit cap ≤5. Lite settle uses full track path.
- **Why:** Authenticated attacker could burn org free-key budgets without real AI calls
- **Files:** `server/routes/intelligence.js`, `server/services/apiUsageService.js`
- **Status:** shipped local (restart API); prod needs EC2 deploy
