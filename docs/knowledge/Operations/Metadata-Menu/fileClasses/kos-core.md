---
authority: operations
derived_from: Roadmap/Program-V1-Obsidian-Knowledge-OS/06_Metadata_Migration_Plan
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-30
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
| status | Select | active, draft, proposed, accepted, in-progress, open, closed, blocked, superseded, archived, partial, shipped |
| owner | Select | founder, eng, product, design, ops, shared |
| lifecycle | Select | living, frozen, archive, sealed |
| knowledge_layer | Select | KL-LAW, KL-EXPR, KL-EVID, KL-ARCH, KL-PROG, KL-PROD, KL-BUILD, KL-OPS, KL-DEC, KL-COLD, KL-META |
| graph_role | Select | boot, context, master-hub, domain-hub, struct-hub, hub, index, leaf, decision, certificate, dashboard, cold, template, law, envelope |
| nav_role | Select | boot, spine, hub, index, leaf, crosswalk, dashboard, context |
| can_override_genesis | Boolean | false (default; never true without Founder ADR) |
| note_type | Select | NT-BOOT, NT-CONTEXT, NT-BLUEPRINT, NT-DOMAIN-MOC, NT-FEATURE-LEAF, NT-ENG-LEAF, NT-ADR, NT-BUG, NT-DASHBOARD, NT-DOC, NT-COLD |

## Cite

[[Roadmap/Program-V1-Obsidian-Knowledge-OS/06_Metadata_Migration_Plan]] §2
