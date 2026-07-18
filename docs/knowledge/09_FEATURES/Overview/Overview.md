# Today / Overview

## Current state

- Status: J0 = **A** — Quick Capture tiles deprecated; Universal Logger is sole Today-fold capture
- Last reviewed: 2026-07-14

## Capture decision (J0)

**Chosen:** Option A — one AI logger owns the fold.  
**Why:** Both tiles and logger did overlapping jobs; dual surfaces hurt focus and retention. Soft footer links (Habits / Journal / Finance / Goals) remain for intentional deep work.

**Rejected:** Option B (keep both + labels).

## UX

- Hero position: left column under Weekly Insight (above the fold)
- Copy: “Tell AIIMIN what happened” — describe → AI sorts
- Shortcut chord: Space · L (existing)
- Widget picker: `logger` on by default; `quick_capture` removed from registry + migrated off

## Files

- `frontend/src/components/dashboard/UniversalLogger.jsx`
- `frontend/src/styles/todayCapture.css`
- `frontend/src/pages/Overview.jsx`
- `frontend/src/components/overview/OverviewWidgetGrid.jsx`

## Changelog

### 2026-07-18 — Weekend Review: stop showing AI prompt text
- **What:** Insight cache bumped to `v3` (clears polluted keys). Stricter prompt-leak filter. If model echoes instructions or returns <2 real bullets, client builds 4 bullets from habits/mood/money/lab/discipline signals. `generateWeeklyInsight` returns empty on leak so fallback always wins. Command Center money uses `formatINR`.
- **Why:** User screenshot — boxes 1–3 showed “under 110 words / no dollar signs” etc. instead of real review
- **Files:** `frontend/src/components/overview/MondayInsight.jsx`, `frontend/src/services/aiService.js`, `frontend/src/components/overview/CommandCenter.jsx`
- **Status:** local

### 2026-07-14 — J0=A single capture logger
- **What:** Removed Quick Capture tile grid from Today. Redesigned Universal Logger (locked palette, no purple). Forced widget migration `logger=true`, drop `quick_capture`. Soft destination chips only.
- **Why:** Adi chose option A for retention / one clear job
- **Files:** UniversalLogger.jsx, todayCapture.css, Overview.jsx, OverviewWidgetGrid.jsx, navItems BASE_WIDGETS, DashboardSections.jsx
- **Status:** local (not commit/push unless asked)
