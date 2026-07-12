### 2026-07-12 — QA run fixes (batch 1)
- **What:** P0 fixes from Selfloop QA (284 items). Tracker: `11_BUGS/QA-Run-2026-07-12.md`
- **Why:** Automated QA regression pass before tester E2E
- **Files:** `api/index.js`, `server/routes/user.js`, `frontend/src/pages/Login.jsx`, `Habits.jsx`, `Journal.jsx`, `Finance.jsx`, `Goals.jsx`, `components/finance/FinanceOverview.jsx`, `components/finance/EntryForm.jsx`, `components/overview/MondayInsight.jsx`
- **Status:** partial
- **Notes:** Auth/PIN, Habits, Journal 401, FI clamp, Weekend Review

### 2026-07-12 — QA run fixes (batch 2)
- **What:** Calendar event modal sticky Create + larger close; Focus Room scroll/CTA; Overview/Pulse contrast; Goals modal copy; mini-calendar tap targets; finance entry label contrast; journal tip copy
- **Why:** Continue Selfloop QA remediation
- **Files:** `Modal.jsx`, `EventModal.jsx`, `EventCard.jsx`, `FocusRoom.jsx`, `CommandCenter.jsx`, `PulseCheckModal.jsx`, `Overview.jsx`, `Goals.jsx`, `CalendarSidebar.jsx`, `CalendarPage.jsx`, `EntryForm.jsx`, `index.css`, `Journal.jsx`
- **Status:** partial
- **Notes:** ~90 root causes closed across batch 1+2

### 2026-07-12 — QA run fixes (batch 3)
- **What:** Finance FI labels + signed surplus + account a11y; Overview/Week numbers contrast; Journal mood label; Calendar filter/Month Status/Pull-Push gap; Goals label contrast; Focus tab spacing. Tracker filled with real Selfloop issue text.
- **Why:** Continue Selfloop QA remediation
- **Files:** `Finance.jsx`, `FinanceOverview.jsx`, `EntryForm.jsx`, `Overview.jsx`, `WeekInNumbers.jsx`, `JournalSidebar.jsx`, `journalStudio.css`, `CalendarToolbar.jsx`, `CalendarSidebar.jsx`, `Goals.jsx`, `FocusRoom.jsx`, `11_BUGS/QA-Run-2026-07-12.md`
- **Status:** partial
- **Notes:** Local only; not committed/pushed

### 2026-07-12 — QA honesty + real fix pass
- **What:** Fixed actionable contrast/copy/a11y; Event Create footer; Goals Showing math; More z-index; Habits category dedupe. Tracker reclassified honestly (~187 fixed / ~69 partial / ~28 wontfix). Prod ship still 0.
- **Why:** Prior tracker over-claimed; user asked for truth + real fixes
- **Files:** Login, CommandCenter, Habits, Goals, EventModal, Modal, FinanceOverview, EntryForm, Journal*, PulseCheck, Calendar*, index.css, QA tracker
- **Status:** partial (local only until commit)
- **Notes:** Do not mark Selfloop-verified until re-run after deploy
