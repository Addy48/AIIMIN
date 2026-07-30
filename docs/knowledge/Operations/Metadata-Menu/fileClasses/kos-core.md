---
authority: operations
derived_from: Roadmap/Program-V1-Obsidian-Knowledge-OS/06_Metadata_Migration_Plan
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-26
can_override_genesis: false
knowledge_layer: KL-META
graph_role: leaf
note_type: NT-DOC
migration_batch: W5
fileClass: kos-core
---

# KOS Core fileClass (Metadata Menu)

Living enums for Metadata Menu. **Exclude** Genesis / UXA / UXI paths (see plugin `fileClassExclude`).

## Fields (closed)

| Field | Type | Values |
|-------|------|--------|
| authority | Select | genesis, product, engineering, operations, founder, expression |
| status | Select | active, draft, open, closed, blocked, superseded |
| owner | Select | founder, eng, product, design, ops, shared |
| lifecycle | Select | living, frozen, archive, sealed |
| knowledge_layer | Select | KL-LAW, KL-EXPR, KL-EVID, KL-ARCH, KL-PROG, KL-PROD, KL-BUILD, KL-OPS, KL-DEC, KL-COLD, KL-META |
| graph_role | Select | boot, context, master-hub, domain-hub, struct-hub, index, leaf, certificate, dashboard, cold, template, law, envelope |
| nav_role | Select | boot, spine, hub, index, leaf, crosswalk, dashboard, context |
| can_override_genesis | Boolean | false (default; never true without Founder ADR) |

## Cite

[[Roadmap/Program-V1-Obsidian-Knowledge-OS/06_Metadata_Migration_Plan]] §2
