# Discipline Changelog

### 2026-07-18 — Urge Surfing 3-step modal + milestone SVG
- **What:** Urge flow extracted to `DisciplineUrgeModal` — 10s breath → 5min observe → log surfed/gave_in. Milestone labels use lucide SVG icons (not emoji).
- **Why:** Screenshot audit P2/P4; prior claim incomplete
- **Files:** `frontend/src/pages/Discipline.jsx`, `frontend/src/pages/DisciplineUrgeModal.jsx`
- **Status:** local

### 2026-07-18 — Enum labels + crisis link accent
- **What:** Target field uses label map (`phone_scroll` → Phone scrolling). Crisis "Find help now" underlined orange. Testimonial keys by author+days. Slip dates via `formatDate`.
- **Why:** Screenshot audit P0/P3
- **Files:** `frontend/src/pages/Discipline.jsx`, `frontend/src/utils/enumLabels.js`, `frontend/src/utils/formatDate.js`
- **Status:** local

### 2026-07-18 — Hydrate from API (not localStorage-only)
- **What:** Discipline page loads streak + urges + logs from `/api/discipline/*` on mount; start/reset write API. Seeded `discipline_streaks` for demo account. Slip log merges urge history.
- **Why:** Seeded DB data never appeared — UI was localStorage-only while Lab/Focus had same class of bug
- **Files:** `frontend/src/pages/Discipline.jsx`, `server/routes/discipline.js`, `scripts/seed-realistic-life.mjs`
- **Status:** shipped (local; restart `dev_server.js`)
- **Notes:** Keep localStorage as cache only

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
