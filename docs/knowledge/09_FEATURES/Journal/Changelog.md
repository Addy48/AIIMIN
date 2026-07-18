# Journal Changelog

### 2026-07-18 — Editor / canvas / read dates en-IN (lie-check pass 2)
- **What:** `JournalEditor` (was en-US), `JournalWriteCanvas` (was en-GB), `JournalReadView` (was en-GB) now use `formatDate` / `formatDateLong`.
- **Why:** Prior “journal dates done” only covered sidebar + page header — incomplete claim
- **Files:** `frontend/src/components/journal/JournalEditor.jsx`, `JournalWriteCanvas.jsx`, `JournalReadView.jsx`, `frontend/src/utils/formatDate.js`
- **Status:** local

### 2026-07-18 — Sidebar + header dates en-IN
- **What:** Journal sidebar uses `formatDate`. Header uses `formatDateLong` (en-IN), not en-GB.
- **Why:** Screenshot audit P0 ISO / locale consistency; lie-check leftover
- **Files:** `frontend/src/components/journal/JournalSidebar.jsx`, `frontend/src/pages/Journal.jsx`, `frontend/src/utils/formatDate.js`
- **Status:** local

### 2026-07-18 — Mode chips in write area
- **What:** Replaced hidden "Structured modes…" ghost pill with equal-weight chips: Free Write, CBT Record, Morning Pages, Weekly Review (orange active).
- **Why:** Screenshot audit P1 — structured modes too hidden; research shows prompts lift completion
- **Files:** `frontend/src/pages/Journal.jsx`
- **Status:** local

### 2026-07-13 — OS-ID auto-advance + speech + notes schema fix
- **What:** Login OS-ID auto-continues at 8 chars (email path separate); journal speech utterance-mode faster; Journal capture craft polish; evolved legacy `notes` columns (`042`) so Notes API works
- **Why:** User request — PIN-like OS-ID, faster mic, Journal quality, local table correctness
- **Files:** `Login.jsx`, `useJournalVoice.js`, `JournalCapture.jsx`, `journalStudio.css`, `server/routes/notes.js`, `042_evolve_legacy_notes.sql`
- **Status:** shipped (local)
- **Notes:** Email detected via @+domain heuristics; OS-ID charset still allows `@` inside 8 chars
