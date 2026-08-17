---
authority: engineering
derived_from: Genesis
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
# API — Admin

## Routes (usage)

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/admin/api-usage` | Usage dashboard data |
| GET | `/api/admin/api-usage/providers` | Provider budgets |

## Files

- `server/routes/admin.js`
- [[09_FEATURES/DevTools/ApiUsage]]
