# Journal

## Current state

- Status: studio redesign in progress (craft program B1)
- Scope: desktop/tablet journal studio — capture, history, modes, read
- Last reviewed: 2026-07-13

## Why this exists

Low-friction reflection and mood capture. Structured modes (CBT, WWW, morning, weekly) optional — default is one capture row.

## UX

- Design Read: editorial writing room · VARIANCE 5 · MOTION 3 · DENSITY 3
- One instructional line (capture hint) — no duplicate FeatureTip + body tip
- Title + date on one baseline row
- Filters and mood share pill vocabulary (accent when selected)
- iPad tier (Track D): history drawer &lt;900px; capture above fold; 44px targets; test 500–600px

## Backend

- Entries via authenticated `/api/db/journal_entries`
- AI analyze: `/daily-logs/journal/ai-analyze` (best-effort tags)

## Database

- Tables: `journal_entries` (existing — no schema change in B1)

## API

- `GET/POST/PATCH /api/db/journal_entries`

## Components / files

- Frontend: `frontend/src/pages/Journal.jsx`, `components/journal/*`, `styles/journalStudio.css`
- Backend: db route + daily-logs journal analyze

## Acceptance criteria

- Selfloop partials 147–165 addressed in B1 where UI-owned
- Contrast body ≥4.5:1; touch ≥44px on tablet tier
- Prose measure ≤70ch

## Known bugs

- See `11_BUGS/QA-Run-2026-07-12.md` Journal rows

## Future ideas

- Shared CaptureBar with Notes voice
- Self-voice Leitner (C3) for audio entries

## iPad / tablet tier (Track D)

- Below ~900px: history is a slide-over drawer (not fixed rail)
- Capture stays above the fold with drawer closed
- Touch targets ≥44px
- Acceptance widths: 500, 600, 768, 1024 (Split View focus = 500–600)

## Changelog

See [[Changelog]]
