# Reports

## Contract

- Route: `/reports` (Pro tier gate via `TierRouteGuard`)
- Data: `GET /api/intelligence/report?days=&start=&end=`
  - Rolling `days` (7–365) **or** inclusive `start`/`end` (`YYYY-MM-DD`) for past windows
  - Skips `weekly_summaries` cache when range is custom / not default 30d
  - Payload includes LHS domains, drivers, best/worst, action plan, plus `meta.timeline` of real daily signals (logs, habits, focus, spend)
- Analytics source: `getAnalyticsDataset(userId, days, { start, end })` — merges daily_logs, pomodoro, money_transactions, commitments, routines, habit_logs
- PDF export: `PDFReportGenerator` uses same `/intelligence/report` window (not a separate stub dataset)

## UI

- Period chips: 7 / 15 / 30 / 90 / YTD / custom dates
- KPIs + discipline chart + domain scores + peak/trough + drivers + action plan from that window

## Files

- `frontend/src/pages/Reports.jsx`
- `frontend/src/components/PDFReportGenerator.jsx`
- `server/routes/intelligence.js`
- `server/services/analyticsData.js`
- `server/services/reportGenerator.js`

## Changelog

### 2026-07-15 — Real period wiring
- **What:** Reports page + PDF pull live intelligence report for selected range; past/custom ranges use past data; Notes added to nav separately
- **Why:** User asked Reports wired to real timeline data
- **Status:** local
- **Schema migrations:** none
