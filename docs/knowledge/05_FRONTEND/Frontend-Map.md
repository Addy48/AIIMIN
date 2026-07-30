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
# Frontend Map

## Trees

- Pages: `frontend/src/pages/`
- Components: `frontend/src/components/` (mobile, waitlist, calendar, dashboard, habits, account, …)
- Hooks / services / utils / styles as under `frontend/src/`

## Rule

Prefer feature MOC + this map over dumping entire `frontend/src` into context.

## Related

- [[02_ARCHITECTURE/Frontend]]
- [[08_DESIGN/Palette]]
- [[09_FEATURES/Index]]
