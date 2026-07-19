# Architecture Overview

## Monorepo (read first)

**One repo, three clients** — web Life OS, Capacitor `/m` shell, native Android V2. Shared API and auth; **separate UI code and commits**.

→ Full diagram and rules: [[Monorepo]] · root `CONTRIBUTING.md`

## Current state

- Frontend: React app under `frontend/src`
- Backend: Express/Hono-style routes under `server/routes` (entry via `server/` + `api/`)
- Data: Supabase PostgreSQL with route-level auth and RLS where applicable
- Auth: Better Auth + Google OAuth (login callback under Better Auth path)

## Product split

| Surface | Route / package | Role |
|---------|-----------------|------|
| Desktop | app routes (`/overview`, …) | Full Life OS — analytics, tools, pages |
| Tablet / iPad | same routes | Full Life OS — touch masthead; see [[Device-Tiers]] |
| Phone web | `/m` | Capture-only daily log (web stopgap) |
| **Native Android V2** | `in.aiimin.app` | Rich companion — see [[17_NATIVE_APP_V2/00_INDEX]] |
| Capacitor (legacy) | WebView → `/m` | Thin installable shell — see [[09_FEATURES/Mobile/Capacitor-Android]] |
| Waitlist | `/` when waitlist mode | Marketing + signup gate |
| Brand | `/brand` | Public brand book |

## Subsystem map

| Area | Doc |
|------|-----|
| Frontend | [[Frontend]] |
| Backend | [[Backend]] |
| Database | [[Database]] |
| Authentication | [[Authentication]] |
| Notifications | [[Notifications]] |
| Calendar sync | [[Calendar-Sync]] |
| AI pipeline | [[AI-Pipeline]] |

## Canonical docs

- Home: [[00_HOME]]
- Product: [[01_PRODUCT/Product]]
- Design: [[08_DESIGN/Palette]]
- Deploy: [[07_DEPLOYMENT/Deploy]]

## Constraints

- Solo developer; one feature at a time preferred
- MacBook Air M2 8GB — avoid high-memory local processes
- Do not change auth or schema without explicit user instruction
- Palette locked

## Recent architecture changes (2026-07-19)

- **Life Score / Intelligence:** `/intelligence/report` drivers, drift, forecast, clusters, archetypes computed from `intelligenceReportService.js` (real timeline data). Hardcoded placeholders removed.
- **Client scoring:** `useLifeScore` + `calculateLifeScore` API-first via `/intelligence/lhs`; local fallback for guests/offline.
- **Data writes:** `/api/db` blocks POST/PATCH/DELETE/upsert on `goals`, `habits`, `habit_logs`, `daily_logs` — use dedicated routes.
- **React Query:** `useFinanceQuery` wired in Finance; `useDashboardPrefetch` mounted in AuthContext.
- **Wealth:** AI text import logic in `server/services/wealthAiImportService.js`.
- **Iteration 2 (2026-07-19):** `GET /dashboard/widgets` (was missing — WeekInNumbers lied); `GET /daily-logs` list; `useOverviewWeekSignals`; HabitManager → `/api/habits`; `useDailyStats` → API routes; wealth helpers extracted.
- **Iteration 4 (2026-07-19):** `correlationService.js` (pool-backed Spearman + BH-FDR); `GET/POST /intelligence/correlations`; cron `/cron/correlations`; `useDailyLogsQuery` + `useCorrelationsQuery` — all analytics widgets share React Query cache; `CausalNodeAnalysis` uses real ρ not fake constants.
