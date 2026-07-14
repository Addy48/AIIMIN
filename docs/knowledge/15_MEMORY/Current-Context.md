# Current Context

> Agents read after Home. Keep ≤400 lines.

**Date:** 2026-07-15

## Today

Honest gap: tour + Insights→Reports stayed **local** (never pushed) — prod still old UI.
Report 500 root: `analyticsData` queried `pomodoro_sessions.started_at` / `duration` — live table is daily rollup `date`, `cycles_completed`, `total_focus_minutes`. Fixed.

## Next

1. Push fix + UI ship; verify Vercel READY + EC2 + `/reports` loads
2. Hard-refresh prod; old tour pill gone

## Touch

- `server/services/analyticsData.js`, `reportGenerator.js`, `weeklyReviewEngine.js`, `weeklyDigestService.js`
- Tour/Reports merge frontend files (unpushed → shipping)
