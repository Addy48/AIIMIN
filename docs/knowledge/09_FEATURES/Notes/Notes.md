# Notes

## Current state

- Status: CRUD path fixed 2026-07-15 — FK `public.users` + content dual-write (migrations **043** + **044** applied)
- Scope: PDF/voice/text import, OCR/transcript, AnchorEdge linking, Drive watch sync
- Last reviewed: 2026-07-15

## Why this exists

Reference layer grounded in sources (PDFs, voice, text). Not a second Journal. Not GoodNotes.

## UX

- Design Read: product Notes studio · calm Life OS reference library (NotebookLM-adjacent, not GoodNotes) · VARIANCE 4 · MOTION 3 · DENSITY 4 · locked AIIMIN palette
- List rail = search + notes only. Compose / empty / reader live on the main canvas.
- Drive watch is a secondary toolbar panel (not jammed into the left rail).
- PDF: browser `pdf.js` text extract; if thin/empty, server `pdf-parse` then Gemini OCR when keys present
- Drive: paste folder ID → Save watch → Sync now
- iPad: drawer ≤1099px; test Split View 500–600

## Backend / Database

- `notes` (+ `ocr_text`, `meta`, legacy `content` dual-write) — FK → `public.users` via `044_fix_notes_user_fk.sql`
- `note_drive_watches` — migration `server/migrations/043_note_drive_watches.sql`
- APIs: `POST /notes` (pdf_base64 / ocr_text), `GET/PUT/DELETE /notes/drive/*`, `POST /notes/drive/sync`

## Reject

- In-app PDF annotation, handwriting canvas, second linking table, collab, Web Share Target as primary, recall streaks

## Components / files

- `frontend/src/pages/Notes.jsx`, `frontend/src/api/notes.js`, `frontend/src/utils/pdfUtils.js`
- `server/routes/notes.js`, `server/lib/notesOcr.js`, `server/lib/notesDrive.js`
- Google scopes: `server/routes/googleAuth.js`

## Changelog

See [[Changelog]]
