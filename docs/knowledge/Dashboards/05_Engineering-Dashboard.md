---
authority: operations
derived_from: Roadmap/Program-V1-Obsidian-Knowledge-OS/04_Founder_Workspace_Dataview_Spec
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-26
can_override_genesis: false
knowledge_layer: KL-META
graph_role: dashboard
nav_role: dashboard
note_type: NT-DASHBOARD
tags:
  - type/dashboard
  - domain/ops
  - status/living
dashboard_id: DB-ENG
migration_batch: W2
fm_source: script
---

# Engineering Dashboard


## Nav

- [[Dashboards/00_Founder-Workspace-Index|Workspace Index]]
- [[Dashboards/01_Executive-Dashboard|Executive]]
- [[15_MEMORY/Current-Context|Current Context]]
- [[00_HOME|Home]]
- [[Maps of Content/00_Knowledge-Graph|Knowledge Graph]]

> [!abstract] Derived
> Derived view. Edit sources/MOCs — not this query — except curated tables.

## Router

- [[Maps of Content/Engineering]]
- [[02_ARCHITECTURE/Monorepo]]

```dataview
TABLE status, last_reviewed
FROM "02_ARCHITECTURE" OR "03_DATABASE" OR "04_API" OR "05_FRONTEND" OR "06_AI" OR "07_DEPLOYMENT" OR "17_NATIVE_APP_V2"
SORT file.path ASC
LIMIT 50
```
