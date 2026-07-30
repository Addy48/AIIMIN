---
authority: operations
derived_from: Roadmap/Program-V1-Obsidian-Knowledge-OS/04_Founder_Workspace_Dataview_Spec
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-30
can_override_genesis: false
knowledge_layer: KL-META
graph_role: dashboard
nav_role: dashboard
note_type: NT-DASHBOARD
tags:
  - type/dashboard
  - domain/ops
  - status/living
dashboard_id: DB-INDEX
migration_batch: W2
fm_source: script
---

# Founder Workspace Index


## Nav

- [[Dashboards/00_Founder-Workspace-Index|Workspace Index]]
- [[Dashboards/01_Executive-Dashboard|Executive]]
- [[15_MEMORY/Current-Context|Current Context]]
- [[00_HOME|Home]]
- [[Maps of Content/00_Knowledge-Graph|Knowledge Graph]]

> [!abstract] Derived
> Derived view. Edit sources/MOCs — not this query — except curated tables.

## Cockpit map

| Start | Link |
|-------|------|
| **Build V1** | [[Roadmap/AIIMIN-V1-Blueprint]] |
| **Continue active work** | [[15_MEMORY/Current-Context]] |
| **Check law** | [[Maps of Content/Genesis]] |

| Dashboard | Link |
|-----------|------|
| Executive | [[01_Executive-Dashboard]] |
| Genesis | [[02_Genesis-Dashboard]] |
| UX | [[03_UX-Dashboard]] |
| Design | [[04_Design-Dashboard]] |
| Engineering | [[05_Engineering-Dashboard]] |
| AI | [[06_AI-Dashboard]] |
| Roadmap | [[07_Roadmap-Dashboard]] |
| Risk | [[08_Risk-Dashboard]] |
| Decisions | [[09_Decisions-Dashboard]] |
| Daily Ops | [[10_Daily-Operations-Dashboard]] |

## Live Bases

| View | Link |
|------|------|
| Active work | [[Active-Work.base]] |
| Decisions | [[Decisions.base]] |
| Knowledge health | [[Knowledge-Health.base]] |

## Boot

1. [[15_MEMORY/Current-Context]]
2. [[00_HOME]]
3. [[Roadmap/AIIMIN-V1-Blueprint]]
4. [[Maps of Content/00_Knowledge-Graph]]
5. [[Maps of Content/Genesis]] when constitutional context is required

## Plugin check

> Requires **Dataview** community plugin enabled for live tables. Path fallbacks still useful as curated lists.

```dataview
TABLE dashboard_id AS ID, status, last_reviewed
FROM "Dashboards"
WHERE nav_role = "dashboard" OR contains(tags, "type/dashboard")
SORT file.name ASC
```
