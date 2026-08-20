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
dashboard_id: DB-ROAD
migration_batch: W2
fm_source: script
---

# Roadmap Dashboard


## Nav

- [[Dashboards/00_Founder-Workspace-Index|Workspace Index]]
- [[Dashboards/01_Executive-Dashboard|Executive]]
- [[15_MEMORY/Current-Context|Current Context]]
- [[00_HOME|Home]]
- [[Maps of Content/00_Knowledge-Graph|Knowledge Graph]]

> [!abstract] Derived
> Derived view. Edit sources/MOCs — not this query — except curated tables.

## Living spine

[[Roadmap/AIIMIN-V1-Blueprint]] → [[Roadmap/Operational-Priorities]] → subsystem roadmaps

- [[Maps of Content/Roadmap]]
- V1 waves: [[Roadmap/AIIMIN-V1-Blueprint#20. Implementation roadmap]]
- Founder decisions: [[Roadmap/AIIMIN-V1-Blueprint#22. Open decisions register (Founder input required)]]

## Frozen / historical programs

- [[Roadmap/Program-0-Product-Readiness/00_INDEX]]
- [[Roadmap/UX-Intelligence/00_INDEX]]
- [[Roadmap/UX-Architecture/00_INDEX]]
- [[Roadmap/Program-V1-Obsidian-Knowledge-OS/00_INDEX]]
- [[Roadmap/Brain-OS-Implementation/00_INDEX]]

```dataview
TABLE status, lifecycle, last_reviewed
FROM "Roadmap"
WHERE file.name = "00_INDEX" OR file.name = "01_Current_Status"
SORT file.path ASC
```
