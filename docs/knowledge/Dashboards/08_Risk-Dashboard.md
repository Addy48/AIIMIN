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
dashboard_id: DB-ORPHAN
migration_batch: W2
fm_source: script
---

# Risk Dashboard


## Nav

- [[Dashboards/00_Founder-Workspace-Index|Workspace Index]]
- [[Dashboards/01_Executive-Dashboard|Executive]]
- [[15_MEMORY/Current-Context|Current Context]]
- [[00_HOME|Home]]
- [[Maps of Content/00_Knowledge-Graph|Knowledge Graph]]

> [!abstract] Derived
> Derived view. Edit sources/MOCs — not this query — except curated tables.

## Product blockers

See [[00_HOME]]

## Open bugs

```dataview
TABLE status, last_reviewed
FROM "11_BUGS"
WHERE status != "closed" AND status != "resolved" AND status != "done"
SORT file.mtime DESC
LIMIT 30
```

## Living notes with zero outbound (heuristic)

```dataview
LIST
FROM ""
WHERE length(file.outlinks) = 0 AND !contains(file.path, "Genesis") AND !contains(file.path, "Archive") AND !contains(file.path, "99_ARCHIVE") AND !contains(file.path, "_templates") AND !contains(file.path, "Roadmap/UX-Architecture") AND !contains(file.path, "Roadmap/UX-Intelligence")
LIMIT 40
```
