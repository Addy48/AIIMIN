---
authority: engineering
derived_from: Genesis/P8 Master Specification
status: active
owner: eng
lifecycle: living
last_reviewed: 2026-08-20
can_override_genesis: false
knowledge_layer: KL-PROD
graph_role: leaf
note_type: NT-FEATURE-LEAF
migration_batch: W4
fm_source: script
---
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

---

## Structure (Phase V4)

> Added 2026-08-20 so every living feature MOC shares the same skeleton. Fill stubs when next touching this feature.

## Why this exists

One job this feature serves for the user.

## Contracts

Routes, tables, env names (no secret values).

## Related

- [[09_FEATURES/Index|Features Index]]
- [[15_MEMORY/Current-Context]]

