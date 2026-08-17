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
dashboard_id: DB-FROZEN
migration_batch: W2
fm_source: script
---

# UX Dashboard


## Nav

- [[Dashboards/00_Founder-Workspace-Index|Workspace Index]]
- [[Dashboards/01_Executive-Dashboard|Executive]]
- [[15_MEMORY/Current-Context|Current Context]]
- [[00_HOME|Home]]
- [[Maps of Content/00_Knowledge-Graph|Knowledge Graph]]

> [!abstract] Derived
> Derived view. Edit sources/MOCs — not this query — except curated tables.

> [!success] Frozen
> Cite only — do not amend UX Architecture / Intelligence packs.

## Publication

- [[Roadmap/UX-Architecture/95_Publication_Record]]
- [[Roadmap/UX-Architecture/00_INDEX]]
- [[Roadmap/UX-Intelligence/00_INDEX]]

## Ceilings

> [!warning] Ceiling
> `/m` = capture-only · Palette locked · Navbar: logo→`/brand` · wordmark→`/overview`

```dataview
TABLE file.folder AS folder, status, lifecycle
FROM "Roadmap/UX-Architecture"
WHERE startswith(file.name, "00_") OR contains(file.name, "Publication") OR contains(file.name, "INDEX")
SORT file.path ASC
LIMIT 40
```
