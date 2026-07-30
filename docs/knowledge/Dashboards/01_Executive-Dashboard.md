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
dashboard_id: DB-EXEC
migration_batch: W2
fm_source: script
---

# Executive Dashboard


## Nav

- [[Dashboards/00_Founder-Workspace-Index|Workspace Index]]
- [[Dashboards/01_Executive-Dashboard|Executive]]
- [[15_MEMORY/Current-Context|Current Context]]
- [[00_HOME|Home]]
- [[Maps of Content/00_Knowledge-Graph|Knowledge Graph]]

> [!abstract] Derived
> Derived view. Edit sources/MOCs — not this query — except curated tables.

## Today

- SoT: [[15_MEMORY/Current-Context]]
- V1 contract: [[Roadmap/AIIMIN-V1-Blueprint]]
- Daily Ops: [[10_Daily-Operations-Dashboard]]
- Active work: [[Active-Work.base]]

## Blockers (curated from Home)

See [[00_HOME#Current blockers]]

## Authority strip

- [[Maps of Content/Genesis|Genesis envelope]]
- [[Roadmap/UX-Architecture/95_Publication_Record|UXA Publication]]
- [[Roadmap/UX-Intelligence/00_INDEX|UX Intelligence]]
- [[Roadmap/Program-V1-Obsidian-Knowledge-OS/95_Publication_Record|Program V1 KOS]]

## Program status (path fallback)

```dataview
TABLE status, lifecycle, last_reviewed
FROM "Roadmap"
WHERE file.name = "00_INDEX" OR contains(file.name, "Publication") OR contains(file.name, "Completion")
SORT file.path ASC
```

## Open decisions

Native Base: [[Decisions.base]]

```dataview
TABLE status, last_reviewed
FROM "10_DECISIONS"
WHERE status = "proposed" OR status = "draft" OR status = "open"
SORT file.mtime DESC
LIMIT 20
```

## Vault health (FM coverage — living paths)

```dataview
TABLE length(rows) AS notes
FROM ""
WHERE !contains(file.path, "Genesis") AND !contains(file.path, "Archive") AND !contains(file.path, "99_ARCHIVE") AND !contains(file.path, "_templates")
FLATTEN file.name AS n
GROUP BY true
```

Native Base: [[Knowledge-Health.base]]
