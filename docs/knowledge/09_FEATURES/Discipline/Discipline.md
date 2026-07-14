# Discipline

## Current state

- Status: classic Discipline Engine UI restored and improved (not stripped)
- Scope: streak + pledge + milestones + toolkit + urge surf (API-backed when available) + slip log
- Last reviewed: 2026-07-13

## Why this exists

Compounding willpower: streak as primary signal, urge surfing as emergency tool, slip log as data not shame. Not clinical treatment.

## UX

- Design Read: calm trust-first · VARIANCE 3 · MOTION 3 · DENSITY 2
- Keep rich layout: big streak counter, milestones, emergency toolkit, community wall
- Urge Surfing: 15‑min timer, breathe cue, early “It passed”, extend +5, optional note; wires `urge/start` + `urge/:id/resolve` when API up
- Slip language softened (log a slip / slip log) — no red-shame hero
- Device tiers: phone stack · tablet single-column stats · desktop wide 2-col
- Persistent crisis/support link
- `/m`: capture-only (no analytics tools)

## Backend

- `server/routes/discipline.js` — streaks, logs, replacement_habits, urge start/resolve/list, patterns
- Client: `frontend/src/api/discipline.js`

## Database

- `discipline_streaks`, `discipline_logs`, `replacement_habits`, `urge_events`

## Reject

- Addiction score, AI therapist, recovery XP, gutting the Engine into a blank “Surf urge” page

## Components / files

- `frontend/src/pages/Discipline.jsx`
- `frontend/src/styles/disciplinePage.css`
- `frontend/src/api/discipline.js`
- `server/routes/discipline.js`
- Optional overlays: `frontend/src/components/discipline/*`, `disciplineStudio.css`

## Changelog

See [[Changelog]]
