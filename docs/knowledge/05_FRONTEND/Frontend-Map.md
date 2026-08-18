---
authority: engineering
derived_from: Genesis/P8 Master Specification
status: active
owner: eng
lifecycle: living
last_reviewed: 2026-08-20
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

## Surface diet (2026-08-20)

Product chrome follows [[16_DOCUMENTATION/Web-Surface-Diet-R4]]:
- **Parked out of masthead:** `/placements` (deep-link only)
- **Dev-only:** `/seed-data`
- **Kill redirect:** `/design-lab` → Account design
- **Craft park:** `/proto/draft`
- **Phone:** `/m/*` capture-only (Capacitor sunset path)

Nav source of truth: `frontend/src/constants/navItems.js`.

## Related

- [[02_ARCHITECTURE/Frontend]]
- [[05_FRONTEND/UI_LIBRARIES]]
- [[08_DESIGN/Palette]]
- [[09_FEATURES/Index]]
- [[16_DOCUMENTATION/Web-Surface-Diet-R4]]
