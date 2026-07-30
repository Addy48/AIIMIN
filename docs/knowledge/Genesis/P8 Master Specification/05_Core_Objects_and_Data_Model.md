# Chapter 05 — Core Objects & Data Model

| Field | Value |
|-------|-------|
| **Status** | FROZEN |
| **Version** | P8 v1.0 |
| **Chapter** | 05 — Core Objects & Data Model |
| **Subsystem** | Batch 2 — Information Model (with Ch 03, Ch 04) |
| **Approval** | Founder Approved |
| **Last Modified** | 2026-07-22 |
| **Supersedes** | P8 v0.1-draft |

This chapter is normative.

Any modification requires a Founder ADR.

```yaml
chapter: 05
title: Core Objects & Data Model
p8_version: P8 v1.0
status: FROZEN
governance_source: P7 Governance v1.0 (FROZEN)
depends_on:
  - Chapter 01 — Product Identity (FROZEN v1.0)
  - Chapter 02 — Core Product Philosophy (FROZEN v1.0)
architectural_question: "What are the canonical objects, relationships, ownership rules, metadata, states, identifiers, and lifecycle model that every platform must implement?"
```

---

## 1. Purpose

Define the **canonical object model** for AIIMIN: what entities exist, how they relate in one life graph, ownership rules, required metadata contracts, and lifecycle philosophy.

This chapter is the logical foundation for Information Architecture (Chapter 03) and Navigation (Chapter 04). It MUST NOT define databases, SQL, APIs, sync, storage, UI, or navigation mechanics.

---

## 2. Scope

### Includes

- **Life entity** as the canonical graph node abstraction
- One linking system for all relationships (graph edges)
- Distinct entity classes where governance requires separation (Knowledge, Journal, Documents)
- IA layer assignment per entity (Capture, Execution, Planning, Derived)
- Entity intake contract (layer, write owner, edges, ceiling, blueprint)
- Object ownership model (personal life graph)
- Philosophy of identifiers, timestamps, and lifecycle states supported by governance
- Object invariants and canonical rules (`P8-R-080`…)

### Excludes

| Topic | Deferred to |
|-------|-------------|
| Information topology, grouping, visibility | Chapter 03 — Information Architecture |
| Routes, shells, deep links | Chapter 04 — Navigation |
| Capture sheet, Enter-save, chip UX | Chapter 06 — Capture System (future) |
| SQL schemas, sync stores | Backend implementation (out of P8 scope) |
| Component primitives | Chapter 10 — Component System |

---

## 3. Canonical Model

### 3.1 Life entity

A **Life entity** is the canonical unit in AIIMIN's one life graph (Chapter 01 §6). Life entities represent one human's life data — not a social network graph.

**Governance:** GOV-001, GOV-019

Every platform MUST implement life entities through **one linking system**. Parallel link models or second graph stores MUST NOT exist.

**Governance:** GOV-019, GOV-043

### 3.2 Graph edges (relationships)

Life entities relate through **edges** in one linking system. Relationships MUST express life connections (e.g., goal→habit→log→score) — not folder containment mirroring storage implementation names.

**Governance:** GOV-004, GOV-094

*Named linking system: unresolved — FB-P8-007.*

### 3.3 Governed entity classes (IA separation)

Governance requires these concepts remain **distinct** at the object/IA level:

| Class | Role | Governance |
|-------|------|------------|
| **Knowledge / Notes** | Source-grounded reference library | GOV-101 |
| **Journal** | Reflection capture | GOV-101 |
| **Documents** | Files/artifacts (often family/vault-linked) | GOV-101 |

Unified presentation of Journal and Notes under a Knowledge region is an IA tension (Chapter 03 §3.8, FB-P8-009); entity separation MUST NOT be erased at the object level without founder decision.

**Governance:** GOV-101, GOV-167

### 3.4 IA node layer (per entity)

Every life entity MUST declare exactly one IA node layer:

| Layer | Role | Examples (governance) |
|-------|------|-------------------------|
| **Capture** | Fast write; minimal fields | Journal, notes, transactions, logs |
| **Execution** | Direct action | (entity-specific; declared at intake) |
| **Planning** | Direction first | (entity-specific; declared at intake) |
| **Derived** | Calm read; no fake input | Life Score, insights, reports |

Derived-layer entities MUST NOT masquerade as capture-layer write targets.

**Governance:** GOV-096, GOV-028, GOV-029

### 3.5 Write primitive owner

Each entity concept MUST map to **one write Primitive** (Chapter 01 §6). Duplicate write primitives for the same concept MUST NOT proliferate.

**Governance:** GOV-020

### 3.6 Entity intake contract

New life entities MUST declare at intake:

1. IA node layer (Capture / Execution / Planning / Derived)
2. Write primitive owner
3. Edge types participated in (linking system)
4. Device ceiling (per platform governance)
5. Page blueprint owner (one-job surface — GOV-164)

**Governance:** GOV-103, GOV-074

### 3.7 Ownership

The life graph is **personal**: one human's data. Life entities are user-owned within that graph. AIIMIN MUST NOT model a social graph product at the object layer.

**Governance:** GOV-001, GOV-005

### 3.8 Identifiers and timestamps

Governance requires graph integrity and cross-surface shared primitives but does **not** define identifier format or temporal field names.

**Status:** Implementation naming deferred — FB-P8-008.

Platforms MUST support stable entity identity and temporal ordering sufficient to enforce linking integrity and remembered context (Chapter 02 §5).

**Governance:** GOV-019, GOV-040, GOV-061

### 3.9 Lifecycle philosophy

Governance defines behavioral lifecycle expectations, not storage state machines:

| Expectation | Governance basis |
|-------------|------------------|
| Raw capture precedes derived structure | GOV-028, GOV-052 |
| Inference MUST be correctable | GOV-035, GOV-051 |
| Destructive removal requires confirm | GOV-015 |
| Export and delete MUST remain available | GOV-014 |

Explicit entity state enum (draft/active/archived/deleted) is **not defined in governance** — FB-P8-008.

---

## 4. Canonical Rules

### §4.1 — Graph integrity

**P8-R-080** — All life data MUST be modeled as **Life entities** in one personal life graph.

**Referenced GOV IDs:** GOV-001, GOV-019

---

**P8-R-081** — Exactly **one linking system** MUST connect life entities. Second graph stores or parallel link models MUST NOT ship.

**Referenced GOV IDs:** GOV-019, GOV-043

---

**P8-R-082** — Relationships MUST be expressed as graph **edges**, not folder hierarchies mirroring storage implementation names.

**Referenced GOV IDs:** GOV-094, GOV-019

---

### §4.2 — Entity separation

**P8-R-083** — **Knowledge / Notes**, **Journal**, and **Documents** MUST remain distinct entity classes at the object model level.

**Referenced GOV IDs:** GOV-101

---

**P8-R-084** — Entity classes MUST NOT be merged into a single mush type that erases Journal, Knowledge, or Documents contracts.

**Referenced GOV IDs:** GOV-101, GOV-010

---

### §4.3 — Layer and primitive

**P8-R-085** — Every life entity MUST declare an IA node layer: Capture, Execution, Planning, or Derived.

**Referenced GOV IDs:** GOV-096

---

**P8-R-086** — Derived-layer entities MUST NOT present fake capture/write affordances as primary interaction.

**Referenced GOV IDs:** GOV-096, GOV-029

---

**P8-R-087** — Each entity concept MUST have one write **Primitive** owner. Duplicate write primitives for the same concept MUST NOT ship.

**Referenced GOV IDs:** GOV-020

---

### §4.4 — Intake and ownership

**P8-R-088** — New life entities MUST satisfy the entity intake contract in §3.6 before ship.

**Referenced GOV IDs:** GOV-103, GOV-074

---

**P8-R-089** — Life entities MUST be owned within one user's personal graph. Social-graph object models MUST NOT ship.

**Referenced GOV IDs:** GOV-001, GOV-005

---

**P8-R-090** — New entity fields MUST consult the Kill List before addition.

**Referenced GOV IDs:** GOV-074

---

### §4.5 — Lifecycle philosophy

**P8-R-091** — Structure derived from capture MUST NOT be required before raw capture is persisted.

**Referenced GOV IDs:** GOV-028, GOV-052

---

**P8-R-092** — Structured inference applied to life entities MUST be correctable; silent wrongness MUST NOT ship.

**Referenced GOV IDs:** GOV-035, GOV-051

---

**P8-R-093** — Cross-client implementations MUST share life entity and link meaning. Divergent domain models REQUIRE founder ADR.

**Referenced GOV IDs:** GOV-040

---

## 5. Referenced GOV IDs

| GOV ID | Title | Status in P7 | Used in Ch 05 |
|--------|-------|--------------|---------------|
| GOV-001 | Personal Life OS category lock | Approved | Yes |
| GOV-004 | Three existence outcomes | Approved | Yes |
| GOV-005 | Refuse social network | Approved | Yes |
| GOV-010 | Refuse GoodNotes PWA mush | Approved | Yes |
| GOV-014 | Export and delete always available | Approved | Yes |
| GOV-015 | Destructive actions must confirm | Approved | Yes |
| GOV-019 | One linking system for life entities | Approved | Yes |
| GOV-020 | One primitive, many surfaces | Approved | Yes |
| GOV-028 | Capture first, structure later | Approved | Yes |
| GOV-029 | Read surfaces stay calm | Approved | Yes |
| GOV-035 | Correctable inference | Approved | Yes |
| GOV-040 | Shared primitives across surfaces | Approved | Yes |
| GOV-043 | Single linking system (unnamed) | Needs Discussion | Yes |
| GOV-051 | Inference must be correctable | Approved | Yes |
| GOV-052 | Structure after raw capture | Approved | Yes |
| GOV-061 | Tomorrow lighter via remembered context | Approved | Yes |
| GOV-074 | Kill List consulted before new fields | Approved | Yes |
| GOV-094 | Graph-over-folders IA | Approved | Yes |
| GOV-096 | Four IA node layers | Approved | Yes |
| GOV-101 | Knowledge/Notes ≠ Journal ≠ Documents | Approved | Yes |
| GOV-103 | New entities must declare IA contract | Approved | Yes |
| GOV-167 | Knowledge surface unifies Journal/Notes | Needs Discussion | Cross-ref FB-P8-009 |

---

## 6. Dependencies

### Depends on

| Dependency | Role |
|------------|------|
| Chapter 01 — Product Identity | Life graph, Primitive, entity terminology |
| Chapter 02 — Core Product Philosophy | Capture-first, correctable inference, outcomes |

### Required by

| Consumer | Relationship |
|----------|--------------|
| Chapter 03 — Information Architecture | Topology references entity layers and intake contract |
| Chapter 04 — Navigation | Deep links reference intake contract; no object redefinition |
| Chapter 06+ Capture / AI / Surfaces | Entity write and link contracts |

### Cross references

| Document | Path |
|----------|------|
| Chapter 03 — Information Architecture | `03_Information_Architecture.md` |
| Chapter 04 — Navigation | `04_Navigation.md` |
| P7 Decision Registry | `../P7 Governance/02_MASTER_DECISION_REGISTRY.json` |

---

## 7. Edge Cases

### EC-P8-501 — New entity type spans layers

**Condition:** Proposed entity behaves as both capture and derived.

**Expected behavior:** Intake MUST pick one primary layer per GOV-096. Split into two entity types if both behaviors are required.

**Governance:** GOV-096, GOV-103

---

### EC-P8-502 — Second link store proposed

**Condition:** Team proposes separate finance-graph link store.

**Expected behavior:** Rejected per P8-R-081 unless founder ADR amends GOV-019.

**Governance:** GOV-019, GOV-043

---

### EC-P8-503 — Journal and Notes merged at object layer

**Condition:** Implementation collapses Journal and Notes into one entity class.

**Expected behavior:** Violates P8-R-083 unless FB-P8-009 resolves with founder approval.

**Governance:** GOV-101, GOV-167, FB-P8-009

---

## 8. Founder Decision Blocks

### FB-P8-007 — Named linking system

| Field | Value |
|-------|-------|
| **Identifier** | FB-P8-007 |
| **Issue** | GOV-019 and GOV-043 require one linking system but do not name the canonical link primitive. |
| **Context** | CF-IA-005, CF-009. REC-005. Blocks all clients sharing one graph. |
| **Why governance is insufficient** | Constitution asserts graph integrity without primitive naming. |
| **Options** | (A) Founder ratifies existing production link model as canon (pointer only). (B) New ADR defines link primitive contract. (C) Defer naming — **blocks cross-client graph alignment**. |
| **Recommendation** | Option B — single link primitive documented in vault architecture note. |
| **Impact** | Blocks Chapter 06+, backend, Android, web graph features until resolved. |
| **Status** | Pending Founder Decision |

**Referenced GOV IDs:** GOV-019, GOV-043 · **REC:** REC-005

---

### FB-P8-008 — Entity identifier and lifecycle state model

| Field | Value |
|-------|-------|
| **Identifier** | FB-P8-008 |
| **Issue** | P8 requires stable identity and lifecycle behavior but governance does not define ID format or state enum. |
| **Context** | Cross-surface sync and export/delete depend on identity contract. |
| **Why governance is insufficient** | GOV-019/040 assert shared model without field-level contract. |
| **Options** | (A) Adopt existing production schema as canon (pointer only in P8). (B) Founder ADR defines minimal state set (e.g., active, tombstoned). (C) Leave to implementation — **risks client drift**. |
| **Recommendation** | Option B — minimal states tied to GOV-014/015 only. |
| **Impact** | Blocks sync chapter and export contract tests. |
| **Status** | Pending Founder Decision |

**Referenced GOV IDs:** GOV-019, GOV-040, GOV-014, GOV-015

---

### FB-P8-009 — Knowledge surface vs entity separation

| Field | Value |
|-------|-------|
| **Identifier** | FB-P8-009 |
| **Issue** | GOV-167 unifies Journal/Notes under Knowledge surface; GOV-101 requires distinct entity classes. |
| **Context** | CF-PS-002. REC-078. |
| **Why governance is insufficient** | Both GOVs Approved/ND — presentation vs entity law in tension. |
| **Options** | (A) Tabs on Knowledge surface; separate entity types and routes under the hood (Studio intent). (B) Reject GOV-167; separate nav peers for Journal and Notes. (C) Merge entity types — **conflicts with GOV-101**. |
| **Recommendation** | Option A — align with GOV-167 quote "separate routes OK". |
| **Impact** | Blocks Android Knowledge migration and entity routing. |
| **Status** | Pending Founder Decision |

**Referenced GOV IDs:** GOV-101, GOV-167 · **REC:** REC-078 · **Also in:** Chapter 03 §8

---

## 9. Acceptance Criteria

| # | Criterion | Verification method |
|---|-----------|---------------------|
| AC-01 | Answers object model question without DB/API/SQL/UI/nav | Manual scope audit |
| AC-02 | Rules P8-R-080 through P8-R-093 sequential, no gaps | grep count = 14 |
| AC-03 | Every rule cites GOV ID from §5 | Cross-check |
| AC-04 | No term redefined from Chapter 01 §6 | Terminology diff |
| AC-05 | FB-P8-007, FB-P8-008, FB-P8-009 present | Count = 3 |
| AC-06 | Subsystem architecture review PASS | §10 |
| AC-07 | Freeze header and footer present | See Freeze Summary |

---

## 10. Subsystem Architecture Review (Batch 2 — Ch 03–05)

| Audit | Result | Notes |
|-------|--------|-------|
| 1. Ownership | PASS | Objects (Ch05), topology (Ch03), movement (Ch04); duplicates replaced with cross-refs |
| 2. Dependency | PASS | Chain: Ch05 → Ch03 → Ch04; no reverse depends_on |
| 3. Terminology | PASS | Life entity, Primitive, Connected graph — Ch01 §6 referenced only |
| 4. Rules | PASS | P8-R-050…093 sequential; gap at 049 (post Ch02) |
| 5. GOV | PASS | All rules cite registry GOVs; weak mappings removed |
| 6. Founder blocks | PASS | 7 open blocks; full field tables where owned |
| 7. Circular refs | PASS | No object↔nav cycles |
| 8. Implementation leakage | PASS | SQL/API/JSON/storage refs removed from normative text |
| 9. Cross-chapter | PASS | Ch03/Ch04 reference Ch05 for objects; no redefinition |
| 10. Pointer drift | ADR | ADR-P8-001 — Ch01 §2 stale pointers (see §11) |

**Subsystem status:** FROZEN v1.0

---

## 11. Founder ADR Required

| Field | Value |
|-------|-------|
| **ADR** | ADR-P8-001 |
| **Reason (historical)** | At freeze, Chapter 01 §2 Excludes contained stale chapter pointers: linking system → "Chapter 03"; lockup routes → "Chapter 07". Canonical owners: **Chapter 05** (objects/linking), **Chapter 04** (navigation). |
| **Resolution** | ADR-P8-001 completed 2026-07-23. Pointer migration finished. Ch 01/02/15 references synchronized. No constitutional doctrine changed. |
| **Status** | Resolved (2026-07-23) |

---

## Changelog

### 2026-07-23 — Publication metadata sync (ADR-P8-001)

- **What:** Chapter-local ADR-P8-001 status set to Resolved. Historical rationale retained. No rule or doctrine change.
- **Status:** shipped

### 2026-07-22 — Frozen v1.0 (Subsystem Batch 2)

- **What:** Subsystem architecture review. Dependency cycle removed. Implementation leakage scrubbed. Freeze header/footer. ADR-P8-001.
- **Status:** FROZEN

### 2026-07-22 — Initial draft (Batch 2)

- **What:** Chapter 05 Core Objects & Data Model; P8-R-080…093.
- **Status:** superseded

---

## Freeze Summary

**Status:** Frozen

**Subsystem:** Batch 2 — Information Model (Ch 03–05)

**Canonical Rules:** 14 (P8-R-080…093)

**Referenced GOV IDs:** 22

**Founder Decision Blocks:** 3 (FB-P8-007, FB-P8-008, FB-P8-009)

**Known Dependencies:**

- Chapter 01 — Product Identity
- Chapter 02 — Core Product Philosophy

**Required by:** Chapter 03, Chapter 04, Chapter 06+

**Architecture Review:** PASS

**Governance Traceability:** PASS

**Ready for Implementation:** YES (pending open Founder Decision Blocks)
