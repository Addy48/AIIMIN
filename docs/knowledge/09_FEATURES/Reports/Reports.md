# Reports

## Contract

- Route: `/reports` — **Core+** (`TierRouteGuard` / `ROUTE_MIN_TIER`)
- Products by plan:
  - **Core+ — Ivory Snapshot:** 7-day pulse UI (Light/Dark follows app theme). No Patterns/Skills tabs. Upgrade CTA → Pro Folio PDF.
  - **Pro+ — Folio Life OS Standard:** full Report / Patterns / Skills + downloadable Folio PDF. Elite Deep **paused** (no Deep product).
- Legacy: `/insights` → `Navigate` to `/reports?tab=patterns` (or `skills` if `?tab=skills`) — Patterns/Skills require Pro+
- Data: `GET /api/intelligence/report?days=&start=&end=`
  - Rolling `days` (7–365) **or** inclusive `start`/`end` (`YYYY-MM-DD`) for past windows
  - Core Snapshot always requests `days=7`
  - Skips `weekly_summaries` cache when range is custom / not default 30d
  - Payload includes LHS domains, drivers, best/worst, action plan, plus `meta.timeline`
- Analytics source: `getAnalyticsDataset(userId, days, { start, end })`
- PDF export: `PDFReportGenerator` — Folio Life OS skin (Pro+ only on Reports page)

## UI

- Core: Ivory Snapshot only
- Pro+: period chips (7 / 15 / 30 / 90 / YTD / custom) + tabs Report / Patterns / Skills; Snapshot also shown above KPIs on Report tab
- Tab sync via `?tab=report|patterns|skills` (`insights` alias → patterns)

## Files

- `frontend/src/pages/Reports.jsx`
- `frontend/src/pages/Insights.jsx` (redirect only)
- `frontend/src/components/reports/IvorySnapshot.jsx` (+ `.css`)
- `frontend/src/components/reports/PatternsPanel.jsx`
- `frontend/src/components/reports/SkillTreePanel.jsx`
- `frontend/src/components/PDFReportGenerator.jsx`
- `frontend/src/utils/tierGating.js` (`/reports` → `core`, `REPORT_PRODUCT`)
- `server/routes/intelligence.js`
- `server/services/analyticsData.js`

## Related

- Selection gallery: [[09_FEATURES/Reports/Prototypes]] (`prototypes/reports/`)
- Architecture brief (Snapshot / Standard / Deep tier split): see Prototypes + Current Context

## Changelog

### 2026-07-17 — Ship Core Ivory + Pro Folio to production
- **What:** `/reports` open to Core+. Core sees Ivory Snapshot (7d). Pro+ keeps Patterns/Skills + Folio Life OS PDF. Elite Deep unchanged (paused).
- **Why:** User asked production for Core + Pro; Elite nothing now
- **Files:** `Reports.jsx`, `IvorySnapshot.*`, `PDFReportGenerator.jsx`, `tierGating.js`, `prototypes/reports/**`, vault
- **Status:** shipping
- **Notes:** Subscription marketing bullets for Snapshot/Folio may follow in a later commit (local AI-quota copy still unpushed)

### 2026-07-17 — Lock Core Ivory + Pro Life OS; Elite paused; Core device tiers
- **What:** Locked Snapshot Ivory Light/Dark and Standard Folio Life OS. Elite paused. Core preview shells for phone / iPad / laptop. Rule: no raw Appendix A dumps to users.
- **Why:** User locked Core/Pro; Elite craft not there yet; Core needed non-phone layouts
- **Files:** `prototypes/reports/**`, `docs/knowledge/09_FEATURES/Reports/Prototypes.md`
- **Status:** Core/Pro locked · Elite paused

### 2026-07-17 — Report prototypes round 3
- **What:** Core×3 Ivory; Pro×3 Folio; Elite×8 multipage scientific
- **Status:** superseded (locks above)

### 2026-07-16 — Report prototype gallery (18 directions)
- **What:** Initial Snapshot / Standard / Deep direction gallery
- **Why:** First visual selection pass
- **Files:** `prototypes/reports/**`
- **Status:** superseded
- **Notes:** Not wired to `/reports/generate`

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
