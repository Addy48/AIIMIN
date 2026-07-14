# Goals Changelog

### 2026-07-13 — Pipeline shows Achieved column
- **What:** Pipeline view includes Achieved goals in the Achieved column. Grid still hides them (active only); Archive still shows won only. Fixes WON=1 while Achieved column empty.
- **Why:** `baseGoals` excluded Achieved for both pipeline and grid, so column always filtered to zero while `wonCount` used full list.
- **Files:** `frontend/src/pages/Goals.jsx`
- **Status:** shipped (local)
