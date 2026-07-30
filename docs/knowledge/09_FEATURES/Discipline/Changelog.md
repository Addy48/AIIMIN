# Discipline Changelog

### 2026-07-13 — Restore Engine UI + improve urge (not strip)
- **What:** Reverted stripped Surf-only page; restored classic Discipline Engine (streak, milestones, toolkit). Urge modal: 15 min, early complete, extend, breathe cue, optional API urge sync + pattern headline. Softened slip copy. Device-tier CSS (`disciplinePage.css`). Crisis link.
- **Why:** User rejected gut rewrite; wanted old UI improved
- **Files:** `frontend/src/pages/Discipline.jsx`, `frontend/src/styles/disciplinePage.css`, `api/discipline.js`
- **Status:** shipped (local)
- **Notes:** Full-screen celebration is separate (account subscription)

### 2026-07-13 — Craft program A1–A2 urge system
- **What:** `urge_events` table; start/resolve/list/patterns APIs; Discipline page rewritten to Surf urge + pattern headline + equal-weight timeline; resist reinforces habit_logs; crisis link; GrowthNodes/MondayInsight prefer pattern copy
- **Why:** Life OS craft Track A
- **Files:** `server/migrations/041_urge_notes_anchor_recall.sql`, `server/routes/discipline.js`, `frontend/src/pages/Discipline.jsx`, `components/discipline/*`, `styles/disciplineStudio.css`, `api/discipline.js`, GrowthNodes, MondayInsight
- **Status:** partial (UI approach superseded by restore above; APIs remain)
- **Notes:** A5 JITAI deferred; prod API must redeploy for routes
