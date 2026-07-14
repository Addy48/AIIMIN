# Reports

## Contract

- Route: `/reports` (Pro tier gate via `TierRouteGuard`)
- Legacy: `/insights` → `Navigate` to `/reports?tab=patterns` (or `skills` if `?tab=skills`)
- Tabs:
  - **Report** — period KPIs, charts, domains, PDF
  - **Patterns** — drivers, action plan, diagnostics, InsightEngine, WeeklyLifeReview, SideQuests (former Insights substance; vanity mastery chrome removed)
  - **Skills** — skill tree sketch relocated from Insights
- Data: `GET /api/intelligence/report?days=&start=&end=`
  - Rolling `days` (7–365) **or** inclusive `start`/`end` (`YYYY-MM-DD`) for past windows
  - Skips `weekly_summaries` cache when range is custom / not default 30d
  - Payload includes LHS domains, drivers, best/worst, action plan, plus `meta.timeline`
- Analytics source: `getAnalyticsDataset(userId, days, { start, end })`
- PDF export: `PDFReportGenerator` uses same window

## UI

- Period chips shared by Report + Patterns: 7 / 15 / 30 / 90 / YTD / custom
- Tab sync via `?tab=report|patterns|skills` (`insights` alias → patterns)

## Files

- `frontend/src/pages/Reports.jsx`
- `frontend/src/pages/Insights.jsx` (redirect only)
- `frontend/src/components/reports/PatternsPanel.jsx`
- `frontend/src/components/reports/SkillTreePanel.jsx`
- `frontend/src/components/PDFReportGenerator.jsx`
- `server/routes/intelligence.js`
- `server/services/analyticsData.js`

## Changelog

### 2026-07-15 — Report 500: pomodoro schema mismatch
- **What:** `getAnalyticsDataset` used `started_at`/`duration` on `pomodoro_sessions`; live columns are `date`, `cycles_completed`, `total_focus_minutes`. Hardened report generators for empty timeline.
- **Why:** Prod `/reports` showed `Failed to generate intelligence report`
- **Files:** `server/services/analyticsData.js`, `reportGenerator.js`, `weeklyReviewEngine.js`, `weeklyDigestService.js`
- **Status:** shipping

### 2026-07-15 — Merge Insights into Reports
- **What:** Reports hosts Report / Patterns / Skills. `/insights` redirects. Fake “Top 4% practitioner” Insights chrome dropped from patterns path; live drivers + InsightEngine kept.
- **Why:** User found orphan Insights page; wanted full merge into Reports
- **Files:** `Reports.jsx`, `Insights.jsx`, `PatternsPanel.jsx`, `SkillTreePanel.jsx`, `CommandPalette.jsx`, `tierGating.js`, `Identity.jsx`
- **Status:** local
- **Schema migrations:** none

### 2026-07-15 — Real period wiring
- **What:** Reports page + PDF pull live intelligence report for selected range; past/custom ranges use past data
- **Why:** User asked Reports wired to real timeline data
- **Status:** shipped (with craft push)
- **Schema migrations:** none
