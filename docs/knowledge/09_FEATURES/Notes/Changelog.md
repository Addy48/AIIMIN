# Notes Changelog

### 2026-07-15 — Create broken: FK + content NOT NULL
- **What:** `notes.user_id` FK retargeted `auth.users` → `public.users` (migration **044** applied). `content` DEFAULT `''`. API dual-write always non-null `content` from body/transcript/ocr. Drive import same. PATCH syncs `content` with `body_text`. Voice create no longer sends null-only body.
- **Why:** Legacy table survived `CREATE TABLE IF NOT EXISTS` in 041; Better Auth ids not in `auth.users` — every create failed. Voice/PDF paths also hit `content NOT NULL`.
- **Files:** `server/migrations/044_fix_notes_user_fk.sql`, `server/routes/notes.js`, `server/lib/notesDrive.js`, `frontend/src/pages/Notes.jsx`
- **Status:** schema applied on `yubxgftugxbwtywyhcsv`; code local until commit+push+EC2
- **Notes:** Hard-refresh `/notes` → New → Save. Drive still needs Google reconnect for `drive.readonly`.

### 2026-07-15 — Studio craft rewrite
- **What:** Notes UI rebuilt — clean list rail (search + notes only); compose / empty / reader on main canvas; Drive moved to secondary toolbar panel; empty state with Text/Voice/PDF capture; locked palette; denser reader measure
- **Why:** Previous UI stacked create + Drive + list in dashed boxes; product craft debt
- **Files:** `frontend/src/pages/Notes.jsx`, `frontend/src/styles/notesStudio.css`
- **Status:** local

### 2026-07-15 — Migration 043 applied on Supabase
- **What:** `public.note_drive_watches` created via MCP `apply_migration` (`note_drive_watches_043`). Columns verified.
- **Why:** Track C Drive watch blocked without table
- **Status:** schema applied on project `yubxgftugxbwtywyhcsv`
- **Notes:** API code still local until commit+push+EC2. User must reconnect Google for `drive.readonly`. App pool uses DATABASE_URL (bypasses RLS).

### 2026-07-14 — PDF OCR + Drive folder watch
- **What:** Real PDF text extract (client pdf.js + server pdf-parse + optional Gemini OCR). Drive folder watch table + sync imports PDFs into notes. UI: file picker + folder ID + Sync now. Google OAuth adds `drive.readonly`. Privacy lists Drive scope.
- **Why:** User required OCR + Drive watch; placeholders were not acceptable
- **Files:** `Notes.jsx`, `api/notes.js`, `server/routes/notes.js`, `server/lib/notesOcr.js`, `server/lib/notesDrive.js`, `043_note_drive_watches.sql`, `googleAuth.js`, `Privacy.jsx`, `pdf-parse` dep
- **Status:** shipped (local); **043 applied 2026-07-15** — still need API redeploy for prod
- **Notes:** User must reconnect Google once for Drive scope. Cron auto-watch deferred — Sync now is the v1 watcher.

### 2026-07-13 — Craft program C1–C3 Notes + recall
- **What:** `notes` + `anchor_edges` + `voice_recall_queue` schema; `/api/notes` CRUD + link-suggest/confirm + recall Leitner; Notes page list+detail (1px borders); iPad drawer; quiet recall banner
- **Why:** Life OS craft Track C
- **Files:** `server/routes/notes.js`, `frontend/src/pages/Notes.jsx`, `api/notes.js`, `styles/notesStudio.css`, `api/index.js`
- **Status:** partial
- **Notes:** OCR/Drive watch later delivered 2026-07-14
