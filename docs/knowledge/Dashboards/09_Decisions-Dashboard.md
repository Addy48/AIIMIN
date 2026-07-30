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
dashboard_id: DB-AUTH
migration_batch: W2
fm_source: script
---

# Decisions Dashboard


## Nav

- [[Dashboards/00_Founder-Workspace-Index|Workspace Index]]
- [[Dashboards/01_Executive-Dashboard|Executive]]
- [[15_MEMORY/Current-Context|Current Context]]
- [[00_HOME|Home]]
- [[Maps of Content/00_Knowledge-Graph|Knowledge Graph]]

> [!abstract] Derived
> Derived view. Edit sources/MOCs — not this query — except curated tables.

## Decision sources

- Native Base: [[Decisions.base]]
- V1 open decisions: [[Roadmap/AIIMIN-V1-Blueprint#22. Open decisions register (Founder input required)]]
- Vault operating model: [[10_DECISIONS/2026-07-30-vault-operating-model]]

```dataview
TABLE status, owner, last_reviewed
FROM "10_DECISIONS"
SORT file.mtime DESC
LIMIT 40
```

## Founder certificates

```dataview
TABLE status, last_reviewed
FROM "Founder"
WHERE contains(lowercase(file.name), "certificate") OR contains(lowercase(file.name), "freeze")
SORT file.name ASC
```
