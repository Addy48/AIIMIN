# P7 — Permanent Governance Standard

```yaml
document: Governance Standard
phase: P7
version: 1.0
date: 2026-07-22
authority: Product Governance Board
applies_to: Every remaining P7 artifact governance pass
```

## Purpose

Machine-readable, traceable, implementation-ready governance for frozen Discovery artifacts.

**Do not** rewrite source artifacts.  
**Do** extract decisions, evidence, confidence, cost, and dependency graphs.

## Required output trio (every artifact)

| File | Role |
|------|------|
| `01_GOVERNANCE_REPORT.md` | Human-readable board report |
| `02_GOVERNANCE_DECISIONS.json` | Machine-readable decision objects |
| `03_GOVERNANCE_INDEX.md` | Searchable index table |

Place each artifact’s trio under:

`AIIMIN GENESIS/P7 Governance/<ArtifactName>/`

Example: `…/Constitution/`, `…/Non-Negotiables/`, `…/IA-Principles/`.

## Separation law

| Bucket | Contents | Binding? |
|--------|----------|----------|
| **CANONICAL DECISIONS** | Explicitly supported by source (Confidence High or Medium) | Yes — cite as law |
| **GOVERNANCE RECOMMENDATIONS** | Board proposals / interpretations (Confidence Low or REC-*) | No — founder approval required |

Never mix buckets in one list.

## Decision object schema (JSON)

```json
{
  "id": "GOV-001",
  "title": "Short title",
  "category": "Product | UX | Visual | Technical | AI | Motion | Accessibility | Performance | …",
  "domain": "product|ux|visual|technical|ai|motion|accessibility|performance|governance",
  "decision": "Normative statement",
  "reason": "Why this exists",
  "status": "Approved | Needs Discussion | Reject | Pending Founder",
  "priority": "P0 | P1 | P2",
  "confidence": "High | Medium | Low",
  "implementation_cost": "Low | Medium | High | Extreme",
  "depends_on": ["GOV-002"],
  "blocks": ["Android Navigation", "Master Product Specification"],
  "referenced_by": ["P8", "P9", "Design System", "Android Build"],
  "evidence": [
    {
      "articles": ["Article II"],
      "sections": ["What AIIMIN is"],
      "quote": "Exact quotation when appropriate"
    }
  ],
  "implementation_impact": "What teams must do",
  "source_document": "relative path to frozen source",
  "canon_class": "canonical | recommendation"
}
```

### Field rules

**Confidence**

| Value | Rule |
|-------|------|
| High | Explicitly stated in source |
| Medium | Clearly implied by multiple articles/sections |
| Low | Board recommendation or interpretation |

**Implementation cost** — estimate across Android, Backend, Desktop, Website, AI, Infrastructure.

**Dependencies**

- `depends_on` — GOV IDs this decision requires
- `blocks` — workstreams / specs blocked until this is clear
- `referenced_by` — later phases, systems, builds that must cite this

**Evidence** — every decision needs ≥1 evidence object. Nothing without evidence.

## Report structure (01)

1. Artifact Overview  
2. Canonical Decisions (by domain)  
3. Governance Recommendations (separate)  
4. Conflicts  
5. Missing Decisions  
6. Questions for Founder  
7. Dependency Graph Summary  
8. Final Governance Score  

Each canonical GOV block must include: ID, Title, Category, Decision, Reason, Status, Priority, Confidence, Evidence, Implementation Cost, Depends On, Blocks, Referenced By, Implementation Impact.

## Recommendation object (REC)

```json
{
  "id": "REC-001",
  "title": "…",
  "reason": "…",
  "impact": "…",
  "risk": "…",
  "priority": "P0|P1|P2",
  "status": "Pending Founder",
  "related_gov": ["GOV-012"],
  "canon_class": "recommendation"
}
```

## ID stability

- Preserve GOV IDs across upgrades whenever possible.
- Do not renumber.
- New decisions append next free ID.
- Do not change Approved decision text unless objectively incorrect; fix via amendment / founder ADR.

## Baseline

First Constitution extraction archived at:

`_baseline/01_CONSTITUTION_GOVERNANCE.v1-baseline.md`

Upgraded Constitution trio:

`Constitution/01_GOVERNANCE_REPORT.md`  
`Constitution/02_GOVERNANCE_DECISIONS.json`  
`Constitution/03_GOVERNANCE_INDEX.md`
