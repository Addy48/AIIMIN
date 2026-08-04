# API Usage Changelog

### 2026-07-16 — OpenRouter lite routing
- **What:** Free OpenRouter used for **low-token lite** tasks (`gpt-oss-20b:free` primary); Groq kept for heavy. Model CSV failover + reasoning.effort=minimal.
- **Why:** Llama:free always 429; weak free models must not own wealth/CBT/JSON.
- **Files:** `server/lib/aiChat.js`, `server/lib/geminiLite.js`, `server/routes/intelligence.js`, env examples
- **Status:** shipping (2026-07-17 push + EC2)
- **Notes:** `OPENROUTER_LITE_MODELS=openai/gpt-oss-20b:free,nvidia/nemotron-nano-9b-v2:free`

### 2026-07-16 — Tier-wise AI daily quotas
- **What:** Dual gate — per-user `subscription_tier` AI cap (Explore 1 / Core 10 / Pro 25 / Elite 40) plus tighter global free-key ceilings; `GET /intelligence/ai-budget`; wealth/journal/universal-log enforce budget (no bypass); marketing copy no longer says unlimited AI.
- **Why:** Stop one account emptying free Groq/OpenRouter/Gemini keys; align limits with website plans.
- **Files:** `server/services/apiUsageService.js`, `server/routes/intelligence.js`, `dailyLogs.js`, `wealth.js`, `billingService.js`, frontend subscription/landing copy, `scripts/sync-ec2-ai-env.sh`, env examples
- **Status:** shipping (2026-07-17 push + EC2)
- **Notes:** Override via `AI_DAILY_LIMIT_EXPLORE|_CORE|_PRO|_ELITE`. Global defaults: groq 800, openrouter 40, gemini 150, moonshot 80.

## 2026-07-08

- **Supabase CRITICAL RLS fix:** `api_usage_log` and `api_provider_budgets` had RLS disabled — anyone with anon key could read/write via PostgREST.
- Applied `server/migrations/035_rls_api_waitlist_feedback.sql`: ENABLE RLS + REVOKE anon/authenticated (Express pool still works).
- Status: applied on Supabase project `yubxgftugxbwtywyhcsv`; CRITICAL linter errors cleared

## 2026-07-04

- Added: `api_usage_log` + `api_provider_budgets` tables, `apiUsageService`, admin routes, AdminPanel API Usage tab
- Why: track free-tier cricket/AI quotas, enforce per-user sports refresh limits, give owner/dev budget visibility without exposing secrets
- Files: `server/migrations/032_api_usage_tracking.sql`, `server/services/apiUsageService.js`, `server/routes/admin.js`, `server/middleware/requireDev.js`, `frontend/src/components/account/AdminPanel.jsx`, `deploy/.env.production.example`
- Status: live for owner/dev roles
