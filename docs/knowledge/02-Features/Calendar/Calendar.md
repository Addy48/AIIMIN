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
