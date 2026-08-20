---
authority: operations
derived_from: Roadmap/Program-V1-Obsidian-Knowledge-OS/02_Vault_Architecture_Specification
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-30
can_override_genesis: false
knowledge_layer: KL-META
graph_role: leaf
nav_role: leaf
note_type: NT-DOC
tags:
  - type/runbook
  - domain/ops
  - status/living
migration_batch: W2
fm_source: script
---

# Path → Knowledge Layer Map

> Living ops note (REC-KL-02). Path implies layer when FM missing. **Genesis path = KL-LAW — do not bulk-edit Genesis FM.**

| Path prefix | knowledge_layer | Notes |
|-------------|-----------------|-------|
| `Genesis/**` | KL-LAW | Path-implied; no bulk FM |
| `Maps of Content/**` | KL-META | Hubs / envelope |
| `Constitution/` `Governance/` `Interaction Architecture/` `Glossary/` | KL-EXPR | |
| `Roadmap/UX-Architecture/**` | KL-ARCH | Frozen — no bulk FM |
| `Roadmap/UX-Intelligence/**` | KL-EVID | Frozen — no bulk FM |
| `Roadmap/AIIMIN-V1-Blueprint.md` | KL-BUILD | V1 contract exception; `note_type: NT-BLUEPRINT` |
| `Roadmap/**` (other) | KL-PROG | |
| `01_PRODUCT/` `09_FEATURES/` | KL-PROD | |
| `02_`–`07_` `03_DATABASE` `04_API` `17_NATIVE` | KL-BUILD | |
| `08_DESIGN/` | KL-BUILD | |
| `10_DECISIONS/` `Founder/` | KL-DEC | |
| `11_`–`16_` `15_MEMORY` | KL-OPS | |
| `Dashboards/` | KL-META | |
| `Archive/` `99_ARCHIVE/` | KL-COLD | |
| `_templates/` | KL-META | graph_role template |

Parent: [[Maps of Content/00_Knowledge-Graph]]
