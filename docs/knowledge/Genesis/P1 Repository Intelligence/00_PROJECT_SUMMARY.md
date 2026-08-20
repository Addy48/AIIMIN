---
Purpose: Explain AIIMIN in under two pages — vision, architecture, repo, stack, status, confidence, known unknowns.
Confidence: 0.93
Generated From: README.md; docs/knowledge/00_HOME.md; docs/knowledge/01_PRODUCT/Product.md; docs/knowledge/02_ARCHITECTURE/Monorepo.md; docs/knowledge/15_MEMORY/Current-Context.md; package.json; frontend/package.json; vercel.json
Dependencies: None (bootstrap)
Consumers: All other AIIMIN_DESIGN_CONTEXT docs; Codex first-read
Last Updated: 2026-07-22
Pass: 1/6
---

# 00 — Project Summary

## Product vision

AIIMIN is a **Personal Life OS**: one account for daily metrics, money, calendar, focus, discipline, sports context, notes/journal, family vault, career placements, gamification, and AI-assisted intelligence reports.

Owner: **Aaditya Upadhyay**. Live web: `https://aiimin.in`. API: `https://api.aiimin.in`.

Primary user profile (from product docs): students / early-career builders under high cognitive load who want measurable routines and recovery loops — practical coaching over vanity analytics.

## Architecture summary (one screen)

```text
┌─────────────────────────────────────────────────────────────┐
│ Clients (ONE repo, THREE clients — never mix in one commit) │
│  1) Web Life OS     frontend/          React 19 → Vercel    │
│  2) Capacitor /m    frontend/android/  WebView → /m (legacy)│
│  3) Native Android  native-android/    Kotlin Compose       │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTPS
┌───────────────────────────▼─────────────────────────────────┐
│ API  api/index.js (Hono) on EC2  →  api.aiimin.in           │
│ Better Auth · feature routes · /api/mobile/* · cron         │
└───────────────────────────┬─────────────────────────────────┘
                            │
              ┌─────────────┴──────────────┐
              ▼                            ▼
     Supabase PostgreSQL            Storage (Supabase bucket
     (+ service-role pool)           dashboard-uploads; Blob refs)
```

Device split (web only):

| Tier | Detection | Experience |
|------|-----------|------------|
| Phone | `useDeviceTier` / Capacitor | Forced to `/m` capture shell |
| Tablet 768–1099 | TabRail + full OS | Full Life OS |
| Desktop ≥1100 | Masthead Navbar | Full Life OS |

Native app does **not** load `/m`; it calls `/api/mobile/*` directly.

## Repository summary

Monorepo root name: `aiimin-monorepo` (`package.json`).

| Path | Role | Label |
|------|------|-------|
| `frontend/` | Web Life OS + Capacitor Android shell | Production |
| `native-android/` | Kotlin Compose companion `in.aiimin.app` | Production |
| `server/` | Routes, services, jobs, migrations (JS) | Production |
| `api/` | Hono entry (`api/index.js`) — sole API entry | Production |
| `supabase/migrations/` | SQL migrations (subset) | Production |
| `docs/knowledge/` | Obsidian Brain OS (agent source of truth) | Production docs |
| `docs/AIIMIN_PRODUCT_BIBLE/`, `docs/product-intelligence/`, `docs/interaction-audit/` | Prior intelligence dumps | Archive / reference |
| `prototypes/`, `logo-designs/`, `frontend/public/prototypes/` | HTML / design prototypes | Experimental |
| `plans/`, `deploy/`, `scripts/` | Plans, EC2/Vercel ops, tooling | Production tooling |
| `Secrets, Keys /`, `aiimin.pem`, `.env*` | Secrets / local env | **Never commit / never document values** |

## Technology stack

| Layer | Tech |
|-------|------|
| Web UI | React 19, React Router 7, Tailwind (via CRA/CRACO), Framer Motion / Motion, Visx + Recharts, TanStack React Query 5, Lucide, Radix primitives, Vaul drawers |
| Auth | Better Auth (+ Google OAuth, username/OS-ID, optional 2FA, bearer, one-time token) |
| API | Hono on Node (`@hono/node-server`), Express-style route modules under `server/routes/` |
| DB | Supabase PostgreSQL via `pg` pool + `@supabase/supabase-js` (service role server-side) |
| Email | Resend (+ Nodemailer paths) |
| Billing | Stripe (plans Core/Pro; Elite referenced in product) |
| AI providers | Gemini, Groq, OpenRouter, NVIDIA, Kimi/Moonshot, xAI (env names present) |
| Native | Kotlin, Jetpack Compose, Room, DataStore, WorkManager, Retrofit (per native README) |
| Hosting | Frontend: Vercel. API: AWS EC2 `13.207.146.15` / `api.aiimin.in`. DB: Supabase |

## Current implementation status (as of vault 2026-07-19 + code inventory 2026-07-22)

| Area | Status |
|------|--------|
| Core web Life OS pages | Shipped / high code progress |
| Waitlist gate | Live when `REACT_APP_WAITLIST_MODE=true` |
| Auth + Google login | Better Auth shipped |
| Mobile web `/m` | Capture-only stopgap |
| Native Android V2 | Auth, bootstrap, journal/notes/habits outbox, WorkManager sync, biometric gate; APK `2.2.1-native` referenced in Current-Context |
| Intelligence / Life Score / correlations | API-backed; placeholders removed per Architecture Overview 2026-07-19 |
| Launch blockers | GA4/Sentry final prod, LC-01..LC-14 checklist, tester E2E |
| Go-live target | End Sep 2026; tester close 31 Jul (product docs) |

## Confidence score (this package)

**Overall: 0.88**

- High confidence on routes, mounts, stack, palette locks, monorepo rules (source-verified).
- Medium on full DB column inventories (migrations incomplete vs prod; no live introspection).
- Medium on component reuse counts (sampled, not full static analysis).
- Lower on runtime feature flags / live Stripe / live AI budgets (env-dependent).

## Known unknowns

1. **Live Postgres schema** may contain tables/columns applied via MCP or console not present in git migrations.
2. **`profiles` vs `user_profiles`** — both appear; app code prefers `user_profiles`.
3. **Legacy table names** (`personal_goals`, `habit_completions`, `google_tokens`) still appear in MCP/archive lists; runtime uses `goals`, `habit_logs`, `user_oauth_tokens`.
4. **Mobile RLS narrative conflict:** Current-Context says “deny-all” on mobile tables; migration `20260719_mobile_sync_rls.sql` defines user-scoped `auth.uid() = user_id` policies. API uses service role either way.
5. **External HTML prototypes** under `~/Downloads` and `~/prototype-chat/` are outside this repo — referenced in Current-Context only.
6. Whether `XPProvider` / several modals are intentionally unmounted or unfinished (files exist, imports missing).
7. AWS Option A (RDS/Cognito) docs exist under `deploy/` but Deploy.md states Option A **not** completed; auth = Better Auth, DB = Supabase.

## Cross-references

- Folder detail → [01_REPOSITORY_MAP.md](01_REPOSITORY_MAP.md)
- Systems → [02_ARCHITECTURE.md](02_ARCHITECTURE.md)
- Features → [03_FEATURE_INVENTORY.md](03_FEATURE_INVENTORY.md)
- Debt / conflicts → [11_TECHNICAL_DEBT.md](11_TECHNICAL_DEBT.md)
