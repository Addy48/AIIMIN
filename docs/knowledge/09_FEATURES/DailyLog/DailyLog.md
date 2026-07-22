# Daily Log

## Current state

Core daily metrics logging on desktop and mobile. Mobile is capture-only.

## Fields (product)

Sleep, gym, breakfast, steps, water, mood, energy, learning, journal, brain fog, headache, wins, DSA, reset counter (clean streak), tasks/money/notes sections on mobile.

## Data

- Table: [[03_DATABASE/daily_logs]]
- API: [[04_API/daily-logs]]

## Files

- Mobile: `frontend/src/components/mobile/*`
- Desktop daily log components under `frontend/src/components/`
- Backend: `server/routes/dailyLogs.js`

## Rules

- Mobile = data collection only
- Do not re-add protein input to mobile

## Changelog

### 2026-07-10 — Vault Brain OS registration
- **What:** Daily Log MOC created under brain OS
- **Why:** Project Brain cutover
- **Files:** `docs/knowledge/09_FEATURES/DailyLog/DailyLog.md`
- **Status:** shipped
