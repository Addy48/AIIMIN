# Journal Changelog

### 2026-07-13 — OS-ID auto-advance + speech + notes schema fix
- **What:** Login OS-ID auto-continues at 8 chars (email path separate); journal speech utterance-mode faster; Journal capture craft polish; evolved legacy `notes` columns (`042`) so Notes API works
- **Why:** User request — PIN-like OS-ID, faster mic, Journal quality, local table correctness
- **Files:** `Login.jsx`, `useJournalVoice.js`, `JournalCapture.jsx`, `journalStudio.css`, `server/routes/notes.js`, `042_evolve_legacy_notes.sql`
- **Status:** shipped (local)
- **Notes:** Email detected via @+domain heuristics; OS-ID charset still allows `@` inside 8 chars
