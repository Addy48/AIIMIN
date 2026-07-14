# Current Context

> Agents read after Home. Keep ≤400 lines.

**Date:** 2026-07-15

## Today

- Notes create was broken: legacy FK `auth.users` + `content` NOT NULL
- Fixed: migration **044** applied; API dual-write; API restarted local :3001

## Next

1. Hard-refresh `/notes` → New → Save text note (smoke)
2. PDF upload + Drive sync after Google reconnect
3. Commit/push when asked (API needs EC2 after push)

## Touch

- `server/migrations/044_fix_notes_user_fk.sql`
- `server/routes/notes.js`, `server/lib/notesDrive.js`
- `frontend/src/pages/Notes.jsx`
- vault Notes MOC/Changelog
