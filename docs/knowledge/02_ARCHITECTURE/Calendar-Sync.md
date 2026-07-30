---
authority: engineering
derived_from: Genesis/P8 Master Specification
status: active
owner: eng
lifecycle: living
last_reviewed: 2026-07-25
can_override_genesis: false
knowledge_layer: KL-BUILD
graph_role: leaf
note_type: NT-ENG-LEAF
migration_batch: W4
fm_source: script
---
# Calendar Sync Architecture

## Current state

- Google Calendar OAuth integration (separate from login OAuth)
- Events table: `calendar_events`
- Frontend: `CalendarPage.jsx`, calendar components
- Feature note: [[09_FEATURES/Calendar/Calendar]]

## Related

- [[Authentication]]
- [[03_DATABASE/calendar_events]]
- [[04_API/calendar]]
