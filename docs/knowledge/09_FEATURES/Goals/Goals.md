# Goals & Vision

## Current state

- Status: pipeline / grid / archive views live
- Scope: goal cards by status (Active, On Track, At Risk, Achieved)
- Last reviewed: 2026-07-18

## UX

- Pipeline: all four status columns (including Achieved)
- Grid: active commitments only (excludes Achieved)
- Archive: Achieved only
- WON counter = count of `status === Achieved` across all goals
- Cards: solid surface + border (visible on cream theme)
- Deadline: branded `DeadlinePicker` (not native `<input type="date">`)

## Files

- `frontend/src/pages/Goals.jsx`
- `frontend/src/components/ui/DeadlinePicker.jsx`
- API: `GET/POST /goals`, `PUT/DELETE /goals/:id`

## Changelog

See [[Changelog]]
