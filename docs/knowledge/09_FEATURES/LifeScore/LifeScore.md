# Life Score

## What it is

Client-side daily composite (0–98 hard cap) from five weighted domains in `frontend/src/utils/lifeScoreEngine.js`. Shown on Today Command Center, Lab, Week-in-numbers, Growth panel.

## Scale

| Bound | Value |
|-------|-------|
| Floor | 15 |
| Soft baseline (empty) | ~45–55 |
| Hard ceiling | **98** |

## Weights + inputs (2026-07-18)

| Domain | Weight | Primary input |
|--------|--------|----------------|
| Behavioral | 28% | API `GET /habits` → `meta.completedDates` (fallback: localStorage habits) |
| Mental clarity | 22% | API `journal_entries` mood + text lexicon (fallback: Command Center notes) |
| Goal momentum | 20% | API `GET /goals` milestones / progress / status (fallback: Today’s Priorities) |
| Financial | 18% | API `/wealth/transactions` MTD savings rate |
| Recovery | 12% | API `daily_logs.sleep_hours` (fallback: localStorage sleep) |

Seed/demo data in Supabase **does** move the dial when the user is logged in.

## Wipe life data (keep login)

- **UI:** Account → Data & Export → “Wipe all life data” (type `WIPE ALL DATA`)
- **Also:** Settings → Wipe All Tracked Data (same confirm phrase)
- **API:** `POST /api/account/wipe-life-data` `{ confirm: "WIPE ALL DATA" }`
- Clears tracked tables for the authenticated user; keeps `users` + auth. Clears most `aiimin_*` localStorage keys (keeps theme).

## Files

- `frontend/src/utils/lifeScoreEngine.js`
- `frontend/src/components/overview/CommandCenter.jsx`
- `frontend/src/pages/account/sections/DataSection.jsx`
- `frontend/src/pages/Settings.jsx`
- `server/routes/account.js`

## Changelog

### 2026-07-18 — API-backed score + wipe-life-data
- **What:** Life Score reads habits/journals/goals/daily_logs/money from API so seed accounts show real mid/high scores. Added `POST /account/wipe-life-data` + Account Data UI to reset to empty while keeping login. Settings wipe now uses same API. Delta stored in localStorage.
- **Why:** Seed account sat ~45–55 because engine ignored Supabase; user needed fresh-start without new account
- **Files:** lifeScoreEngine.js, account.js, DataSection.jsx, Settings.jsx, CommandCenter.jsx
- **Status:** local

### 2026-07-18 — Documented score semantics + seed mismatch
- **What:** Vault note: scale, weights, inputs, why seed ≠ high score (pre-API wiring)
- **Why:** User saw 45–55 with heavy seed and suspected a bug
- **Files:** this note
- **Status:** superseded by API wiring above
