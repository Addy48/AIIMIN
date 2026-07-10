# Architecture

## Current state

- Frontend: React app under `frontend/src`
- Backend: Hono/Express routes under `server/routes` and `api/index.js`
- Data: Supabase PostgreSQL with route-level auth and RLS

## Product split

- Desktop `/`: analytics + command surfaces
- Mobile `/m`: data capture flow only

## Canonical docs

- Launch and product context: `docs/knowledge/00-Command-Center.md`
- Project memory snapshot: `AGENTS.md`
- Launch checklist and blockers: `AIIMIN_PROGRESS_SUMMARY.md`
