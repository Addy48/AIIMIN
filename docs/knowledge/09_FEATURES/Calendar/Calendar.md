# Calendar

## Current state

- Modern route-backed calendar is active
- Google Calendar + Google Tasks (due items) pull via `/api/calendar/sync/pull` using shared `googleClient` OAuth credentials
- Pull runs automatically after OAuth connect success; toolbar **Pull Google** uses 90-day back / 365-day forward window
- All readable calendars are synced (not only `primary`)
- Tolerant column-aware writes are implemented in backend calendar route
- Legacy direct-Supabase calendar component path was removed
- System type normalization now maps legacy values into the UI vocabulary
- **Limitation:** Google Tasks without a due date do not appear; reconnect Google to grant `tasks.readonly` if phone tasks still missing

## Key files

- `server/routes/calendar.js`
- `server/routes/googleAuth.js`
- `server/lib/googleClient.js`
- `frontend/src/pages/CalendarPage.jsx`
- `frontend/src/hooks/useCalendarEvents.js`
- `frontend/src/components/calendar/CalendarToolbar.jsx`
- `server/migrations/029_calendar_events_modernization.sql`

## Changelog

### 2026-07-18 — Mini-month sidebar overflow (Sat/Sun outside box)
- **What:** Calendar right sidebar mini-month no longer uses `minWidth/minHeight: 36px` cells inside a ~188px content box (7×36 > panel → Sat/Sun spilled). Grid is `repeat(7, minmax(0, 1fr))`, cells `width:100%` + `aspect-ratio:1`, panel `overflow:hidden`. Sidebar width 240px.
- **Why:** User screenshot — orange “18” + weekend columns outside white card. This was **CalendarSidebar**, not Goals DeadlinePicker (labels M/T/W match sidebar).
- **Files:** `frontend/src/components/calendar/CalendarSidebar.jsx` (+ DeadlinePicker overflow hardening)
- **Status:** local
- **Notes:** Headless browser hit `/login` (no session) — layout fix verified in served webpack chunk (`minmax(0, 1fr)`, no `36px` minWidth).

### 2026-07-18 — Month chips v4 + Safari no-cache
- **What:** Chips now hard-coded white card, `#C9BCA3` 1.5px border, 5px accent strip, `5px 10px` padding, visible shadow (`aiimin-cal-chip-v4`). CRA `devServer` sends `Cache-Control: no-store`. Index meta cache-bust.
- **Why:** Safari kept stale JS; Cmd+Shift+R opens Reading List (not reload). Prior chip borders too faint on cream so looked “unchanged.”
- **Files:** `MonthView.jsx`, `craco.config.js`, `public/index.html`
- **Status:** local

### 2026-07-18 — Month event chips: real bordered boxes
- **What:** Chips rebuilt as surface card + 4px color strip + padded title (not border-left-only). Full `var(--color-border)` outline + light shadow so cream theme reads a closed box. Same pattern on compact `EventCard`.
- **Why:** User screenshot after cache fix — fill present but text jammed on accent bar, outer border still invisible
- **Files:** `frontend/src/components/calendar/MonthView.jsx`, `EventCard.jsx`
- **Status:** local

### 2026-07-18 — Month grid event chips solid boxes
- **What:** Month-view chips use readable text (`--color-text-1`), tinted surface fill via `color-mix`, full border + left accent bar. `SYSTEM_COLORS` aligned to locked palette. Compact `EventCard` same treatment.
- **Why:** User screenshots — “missing box”, colored text floating on white, low contrast
- **Files:** `frontend/src/components/calendar/MonthView.jsx`, `frontend/src/components/calendar/EventCard.jsx`
- **Status:** local

### 2026-07-09 — Google sync fix + Tasks + auto-pull
- **What:** Fixed OAuth client mismatch on calendar pull (now uses `googleClient.js` with `GOOGLE_CALENDAR_*` env); sync all calendars + due Google Tasks; auto-pull after connect; empty-state Pull CTA; hide Reconnect when connected on calendar toolbar
- **Why:** Connected toast showed but grid stayed empty — no auto-pull, wrong OAuth credentials on pull route, primary-only list, phone tasks are Tasks API not Calendar events
- **Files:** `server/routes/calendar.js`, `server/routes/googleAuth.js`, `server/lib/googleClient.js`, `frontend/src/hooks/useCalendarEvents.js`, `frontend/src/pages/CalendarPage.jsx`, `frontend/src/components/calendar/CalendarToolbar.jsx`, `frontend/src/pages/account/sections/SecuritySection.jsx`
- **Status:** shipped
- **Notes:** Existing Google connections need **Disconnect → Connect** once to grant `tasks.readonly`. Tasks without due dates won't sync.

### 2026-07-04
- Moved: schema modernization into git migration with backfill + constraints
- Why: document production shape in source control and remove dead calendar path
- Files: `server/migrations/029_calendar_events_modernization.sql`, `server/routes/calendar.js`, `frontend/src/hooks/useCalendarEvents.js`
- Status: shipped
