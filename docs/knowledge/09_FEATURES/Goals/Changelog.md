# Goals Changelog

### 2026-07-18 — Goal cards + deadline picker visual pass 2
- **What:** Goal cards use solid `var(--color-surface)` + border + light shadow (no invisible translucent box). DeadlinePicker trigger is bordered chip; panel labeled “Deadline”, Mo–Su headers, accent orange select. Hide milestone rows that are just “Nd left” echoes of the deadline label.
- **Why:** User screenshots — cards looked borderless on cream; native-looking picker complaint; duplicate “49d left” rows
- **Files:** `frontend/src/pages/Goals.jsx`, `frontend/src/components/ui/DeadlinePicker.jsx`
- **Status:** local

### 2026-07-18 — Branded deadline calendar (replace native picker)
- **What:** Replaced browser `<input type="date">` with `DeadlinePicker` — full 7-day grid, month arrows, today, clear, orange selected day, portal so it never clips out of the card. Wired on goal cards + create modal.
- **Why:** Screenshots — native Safari/macOS calendar overflowed (Sat/Sun outside white card) and looked unbranded
- **Files:** `frontend/src/components/ui/DeadlinePicker.jsx`, `frontend/src/pages/Goals.jsx`
- **Status:** local

### 2026-07-18 — Pillar colors → locked palette
- **What:** Academic/Personal pillars + priority Low no longer blue/purple. Mapped to amber / muted / orange / green.
- **Why:** Lie-check pass 3 — contradicted palette lock; prior note said “intentional” was wrong
- **Files:** `frontend/src/pages/Goals.jsx`
- **Status:** local

### 2026-07-18 — Deadline picker hit-target fix
- **What:** Replaced 0×0 invisible date input with full-label overlay (clickable). Existing deadlines also editable via same control.
- **Why:** Lie-check pass 2 — prior “Set deadline” often unclickable
- **Files:** `frontend/src/pages/Goals.jsx`
- **Status:** local

### 2026-07-18 — Set deadline action
- **What:** Replaced dead "No date" label with tappable "Set deadline" date input that writes `targetDate` on pick.
- **Why:** Screenshot audit P1 — dead labels with no path forward
- **Files:** `frontend/src/pages/Goals.jsx`
- **Status:** local

### 2026-07-13 — Pipeline shows Achieved column
- **What:** Pipeline view includes Achieved goals in the Achieved column. Grid still hides them (active only); Archive still shows won only. Fixes WON=1 while Achieved column empty.
- **Why:** `baseGoals` excluded Achieved for both pipeline and grid, so column always filtered to zero while `wonCount` used full list.
- **Files:** `frontend/src/pages/Goals.jsx`
- **Status:** shipped (local)
