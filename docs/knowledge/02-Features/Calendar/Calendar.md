# Calendar

## Current state

- Modern route-backed calendar is active
- Tolerant column-aware writes are implemented in backend calendar route
- Legacy direct-Supabase calendar component path was removed
- System type normalization now maps legacy values into the UI vocabulary

## Key files

- `server/routes/calendar.js`
- `frontend/src/pages/CalendarPage.jsx`
- `frontend/src/hooks/useCalendarEvents.js`
- `server/migrations/029_calendar_events_modernization.sql`

## Changelog

### 2026-07-04
- Moved: schema modernization into git migration with backfill + constraints
- Why: document production shape in source control and remove dead calendar path
- Files: `server/migrations/029_calendar_events_modernization.sql`, `server/routes/calendar.js`, `frontend/src/hooks/useCalendarEvents.js`
- Status: shipped
