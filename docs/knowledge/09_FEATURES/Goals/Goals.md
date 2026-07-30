# Goals & Vision

## Current state

- Status: pipeline / grid / archive views live
- Scope: goal cards by status (Active, On Track, At Risk, Achieved)
- Last reviewed: 2026-07-13

## UX

- Pipeline: all four status columns (including Achieved)
- Grid: active commitments only (excludes Achieved)
- Archive: Achieved only
- WON counter = count of `status === Achieved` across all goals

## Files

- `frontend/src/pages/Goals.jsx`
- API: `GET/POST /goals`, `PUT/DELETE /goals/:id`

## Changelog

See [[Changelog]]
