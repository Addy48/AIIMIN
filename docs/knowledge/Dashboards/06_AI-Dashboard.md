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
dashboard_id: DB-CONTEXT
migration_batch: W2
fm_source: script
---

# AI Dashboard


## Nav

- [[Dashboards/00_Founder-Workspace-Index|Workspace Index]]
- [[Dashboards/01_Executive-Dashboard|Executive]]
- [[15_MEMORY/Current-Context|Current Context]]
- [[00_HOME|Home]]
- [[Maps of Content/00_Knowledge-Graph|Knowledge Graph]]

> [!abstract] Derived
> Derived view. Edit sources/MOCs — not this query — except curated tables.

## Living prompts SoT

```dataview
TABLE status, last_reviewed
FROM "14_PROMPTS"
SORT file.name ASC
```

## Memory packs

```dataview
TABLE status, last_reviewed
FROM "15_MEMORY"
WHERE file.name != "Current-Context"
SORT file.name ASC
```

- [[14_PROMPTS/Proof-or-Stop]]
- [[Roadmap/Program-V1-Obsidian-Knowledge-OS/09_AI_Workspace]] (frozen design cite)
