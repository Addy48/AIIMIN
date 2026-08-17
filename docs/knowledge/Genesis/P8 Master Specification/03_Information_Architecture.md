# Chapter 03 — Information Architecture

| Field | Value |
|-------|-------|
| **Status** | FROZEN |
| **Version** | P8 v1.0 |
| **Chapter** | 03 — Information Architecture |
| **Subsystem** | Batch 2 — Information Model (with Ch 04, Ch 05) |
| **Approval** | Founder Approved |
| **Last Modified** | 2026-07-22 |
| **Supersedes** | P8 v0.1-draft |

This chapter is normative.

Any modification requires a Founder ADR.

```yaml
chapter: 03
title: Information Architecture
p8_version: P8 v1.0
status: FROZEN
governance_source: P7 Governance v1.0 (FROZEN)
depends_on:
  - Chapter 01 — Product Identity (FROZEN v1.0)
  - Chapter 02 — Core Product Philosophy (FROZEN v1.0)
  - Chapter 05 — Core Objects & Data Model (FROZEN v1.0)
architectural_question: "How is information organized throughout AIIMIN?"
```

---

## 1. Purpose

Define how life information is **organized** in AIIMIN: graph topology, IA layers, intents, domain grouping, visibility, parent-child structure, and cross-link philosophy.

This chapter owns information topology only. It MUST NOT define navigation mechanics, UI components, AI behavior, or storage implementation.

---

## 2. Scope

### Includes

- Graph-over-folders organization principle
- Four IA node layers (Capture, Execution, Planning, Derived)
- Intent taxonomy and destination domains (not navigation mechanics)
- Consolidated read surfaces
- Settings as penalty box placement
- Timeline as chronology (not feed)
- Entity IA contract (topology view)
- Six hierarchy layers (governance IA stack)
- Visibility and grouping principles
- Cross-link / graph philosophy
- Canonical rules `P8-R-050`…

### Excludes

| Topic | Owner chapter |
|-------|---------------|
| Routes, shells, FAB, breadcrumbs | Chapter 04 — Navigation |
| Entity schemas, link stores | Chapter 05 — Core Objects & Data Model |
| Capture sheet UX | Chapter 06 — Capture System (future) |
| Page blueprints / widgets | Surface chapters |

---

## 3. Canonical Model

### 3.1 Graph-over-folders

AIIMIN organizes life information as a **connected graph**, not a file tree. Folders MAY exist as presentation aids but MUST NOT be the primary organizing metaphor for life entities.

**Governance:** GOV-094

Life domains (health, money, focus, etc.) are **graph regions** — groupings of related entities and edges — not parallel silo databases.

**Governance:** GOV-004, Chapter 01 §6 Connected graph

### 3.2 Four IA node layers (topology)

Information is organized across four node layers. Layer **definitions and entity binding** are owned by Chapter 05 §3.4 (`P8-R-085`). This chapter owns how layers shape **information topology**:

| Layer | Topology role |
|-------|----------------|
| **Capture** | Fast-write information ingress |
| **Execution** | Action-oriented information regions |
| **Planning** | Direction-first information regions |
| **Derived** | Calm read-only information regions |

Derived-layer regions MUST NOT be organized as capture-first input topology.

**Governance:** GOV-096, GOV-028, GOV-029 · **Object binding:** Chapter 05 §3.4

### 3.3 Intent taxonomy

User **intents** classify what kind of information operation is sought. Intents map to destination **domains** in the IA — not to routes or navigation chrome.

Governance defines intent families (capture, review, plan, execute, settings) but not a complete destination map.

**Governance:** GOV-095 · *Full map: FB-P8-010*

### 3.4 Consolidated read

Read-heavy information SHOULD consolidate into calm surfaces rather than scattering duplicate read paths across the graph.

**Governance:** GOV-098

### 3.5 Settings penalty box

Configuration, account, export, and destructive preferences belong in **Settings** — a penalty-box region of the IA. Settings MUST NOT absorb primary life-work surfaces.

**Governance:** GOV-100

### 3.6 Timeline ≠ feed

**Timeline** organizes information **chronologically** across entity types. It is NOT a social feed, engagement feed, or algorithmic stream.

**Governance:** GOV-102

### 3.7 Entity IA contract (topology reference)

New information regions MUST satisfy the entity intake contract defined in **Chapter 05 §3.6** (`P8-R-088`). This chapter does not redefine contract fields.

**Governance:** GOV-103

### 3.8 Entity separation in IA

**Knowledge / Notes**, **Journal**, and **Documents** MUST remain distinct IA regions. Entity class definitions: Chapter 05 §3.3 (`P8-R-083`).

**Governance:** GOV-101 · *Presentation tension: FB-P8-009*

### 3.9 Six hierarchy layers (IA stack)

Governance orders product page hierarchy in **six layers**. New screens MUST declare which layer they belong to:

| Layer | Scope (governance) |
|-------|---------------------|
| **1 — System** | Splash, Onboarding, Auth |
| **2 — Day** | Today |
| **3 — Memory** | Knowledge, Timeline, Search |
| **4 — Pillars** | Family, Finance, Documents |
| **5 — Intelligence** | AI |
| **6 — Account** | Profile, Settings |

**Governance:** GOV-169

### 3.10 Cross-link architecture

Cross-links connect information across life domains through the one linking system (Chapter 05 §3.2). IA treats edges as first-class **semantic connections** — not folder drill-down.

**Governance:** GOV-019, GOV-094, GOV-043

### 3.11 Information collections

An **information collection** is a named grouping of related information nodes within a domain or layer — for consolidated read and domain navigation. Collections are topology constructs; they MUST NOT become parallel object types or storage silos.

**Governance:** GOV-098, GOV-094

### 3.12 Visibility model

Information visibility follows:

| Principle | Rule |
|-----------|------|
| Personal graph | One user's data; no public-by-default regions |
| Device ceiling | Some IA regions MAY be hidden on constrained devices per platform governance |
| Derived calm | Derived layers default to read-only presentation in IA |

**Governance:** GOV-001, GOV-013, GOV-041, GOV-029

### 3.13 Kill List gate

New IA fields, groupings, or top-level regions MUST consult the Kill List before addition.

**Governance:** GOV-074

---

## 4. Canonical Rules

### §4.1 — Graph organization

**P8-R-050** — Life information MUST be organized as a **connected graph**, not a primary folder tree.

**Referenced GOV IDs:** GOV-094, GOV-004

---

**P8-R-051** — Folder hierarchies MUST NOT replace graph edges as the canonical organization model.

**Referenced GOV IDs:** GOV-094, GOV-019

---

### §4.2 — Node layers

**P8-R-052** — Every information node MUST declare its IA node layer per Chapter 05 §3.4 (`P8-R-085`).

**Referenced GOV IDs:** GOV-096

---

**P8-R-053** — Derived-layer information MUST NOT be organized or labeled as primary capture input.

**Referenced GOV IDs:** GOV-096, GOV-029

---

**P8-R-054** — Capture-layer nodes MUST allow structure-after-capture; required structure before first save MUST NOT ship.

**Referenced GOV IDs:** GOV-028, GOV-052

---

### §4.3 — Intents and read surfaces

**P8-R-055** — User intents MUST map to IA destination domains; orphan feature pages outside intent taxonomy MUST NOT ship without founder ADR.

**Referenced GOV IDs:** GOV-095

---

**P8-R-056** — Read-heavy information SHOULD consolidate into calm read surfaces per consolidated-read principle.

**Referenced GOV IDs:** GOV-098

---

### §4.4 — Regions and separation

**P8-R-057** — Settings MUST remain a penalty-box IA region; primary life-work regions MUST NOT migrate into Settings.

**Referenced GOV IDs:** GOV-100

---

**P8-R-058** — Timeline MUST present chronological life information; feed-style engagement ordering MUST NOT ship.

**Referenced GOV IDs:** GOV-102

---

**P8-R-059** — Knowledge / Notes, Journal, and Documents MUST remain distinct IA regions per Chapter 05 §3.3 (`P8-R-083`).

**Referenced GOV IDs:** GOV-101

---

**P8-R-060** — New information regions MUST satisfy the entity intake contract in Chapter 05 §3.6 (`P8-R-088`).

**Referenced GOV IDs:** GOV-103, GOV-074

---

### §4.5 — Cross-links and visibility

**P8-R-061** — Cross-domain relationships MUST use the one linking system; parallel IA link models MUST NOT ship.

**Referenced GOV IDs:** GOV-019, GOV-043

---

**P8-R-062** — Device ceilings MUST be declared for IA regions that are not available on all platforms.

**Referenced GOV IDs:** GOV-013, GOV-041, GOV-103

---

**P8-R-063** — New IA groupings or fields MUST consult the Kill List.

**Referenced GOV IDs:** GOV-074

---

**P8-R-064** — IA stack layers (GOV-169) MUST be respected when placing new surfaces; ad-hoc top-level regions MUST NOT bypass the stack without founder ADR.

**Referenced GOV IDs:** GOV-169

---

## 5. Referenced GOV IDs

| GOV ID | Title | Status in P7 | Used in Ch 03 |
|--------|-------|--------------|---------------|
| GOV-001 | Personal Life OS category lock | Approved | Yes |
| GOV-004 | Three existence outcomes | Approved | Yes |
| GOV-013 | Device ceiling (platform) | Approved | Yes |
| GOV-019 | One linking system | Approved | Yes |
| GOV-028 | Capture first, structure later | Approved | Yes |
| GOV-029 | Read surfaces stay calm | Approved | Yes |
| GOV-041 | Device ceiling (mobile) | Approved | Yes |
| GOV-043 | Single linking system (unnamed) | Needs Discussion | Yes |
| GOV-052 | Structure after raw capture | Approved | Yes |
| GOV-074 | Kill List consulted | Approved | Yes |
| GOV-094 | Graph-over-folders IA | Approved | Yes |
| GOV-095 | Intent taxonomy | Approved | Yes |
| GOV-096 | Four IA node layers | Approved | Yes |
| GOV-098 | Consolidated read | Approved | Yes |
| GOV-100 | Settings penalty box | Approved | Yes |
| GOV-101 | Knowledge ≠ Journal ≠ Documents | Approved | Yes |
| GOV-102 | Timeline ≠ feed | Approved | Yes |
| GOV-103 | Entity IA contract | Approved | Yes |
| GOV-164 | Page blueprint one-job | Approved | Cross-ref |
| GOV-167 | Knowledge surface unifies Journal/Notes | Needs Discussion | FB-P8-009 |
| GOV-169 | Six IA hierarchy layers | Approved | Yes |

---

## 6. Dependencies

### Depends on

| Dependency | Role |
|------------|------|
| Chapter 01 — Product Identity | Connected graph, life domains, terminology |
| Chapter 02 — Core Product Philosophy | Capture-first, calm read |
| Chapter 05 — Core Objects & Data Model | Entity classes, edges, intake contract |

### Required by

| Consumer | Relationship |
|----------|--------------|
| Chapter 04 — Navigation | IA regions inform routes; nav does not redefine topology |
| Surface / Capture chapters | Placement and grouping |

### Cross references

| Document | Path |
|----------|------|
| Chapter 04 — Navigation | `04_Navigation.md` |
| Chapter 05 — Core Objects & Data Model | `05_Core_Objects_and_Data_Model.md` |

---

## 7. Edge Cases

### EC-P8-301 — Folder UI on graph backend

**Condition:** Users see folders; backend is graph.

**Expected behavior:** Folders are presentation-only; canonical organization remains graph edges per P8-R-050.

**Governance:** GOV-094

---

### EC-P8-302 — Derived metric placed in Capture nav region

**Condition:** Life Score listed beside Journal in capture-first IA.

**Expected behavior:** Rejected — derived layer MUST NOT masquerade as capture (P8-R-053).

**Governance:** GOV-096, GOV-029

---

### EC-P8-303 — Settings absorbs feature

**Condition:** New life feature placed under Settings for convenience.

**Expected behavior:** Rejected unless penalty-box criteria met (P8-R-057).

**Governance:** GOV-100

---

## 8. Founder Decision Blocks

### FB-P8-009 — Knowledge surface vs entity separation

*Primary definition: Chapter 05 §8. IA impact: unified Knowledge region MAY present Journal and Notes as sub-regions while entity classes remain distinct per `P8-R-083`.*

| Field | Value |
|-------|-------|
| **Identifier** | FB-P8-009 |
| **Issue** | GOV-167 unifies Journal/Notes under Knowledge surface; GOV-101 requires distinct entity classes and IA regions. |
| **Context** | CF-PS-002. REC-078. |
| **Why governance is insufficient** | Presentation GOV (ND) vs separation GOV (Approved) in tension. |
| **Options** | (A) Knowledge region with Journal/Notes sub-regions; distinct entity types (Studio intent). (B) Reject GOV-167; separate top-level IA regions. (C) Merge entity types — **conflicts with GOV-101**. |
| **Recommendation** | Option A — separate routes acceptable per GOV-167. |
| **Impact** | Blocks Knowledge IA placement and entity routing. |
| **Status** | Pending Founder Decision |

**Referenced GOV IDs:** GOV-101, GOV-167 · **REC:** REC-078

---

### FB-P8-010 — Intent → destination map

| Field | Value |
|-------|-------|
| **Identifier** | FB-P8-010 |
| **Issue** | GOV-095 defines intent families without complete destination map. |
| **Context** | IA and Navigation both need stable intent targets. |
| **Why governance is insufficient** | Intents approved; mapping incomplete. |
| **Options** | (A) Founder publishes intent→region table in vault. (B) Defer — **blocks consistent IA placement**. |
| **Recommendation** | Option A — minimal table aligned with GOV-169 stack. |
| **Impact** | Blocks nav spine and command palette routing. |
| **Status** | Pending Founder Decision |

**Referenced GOV IDs:** GOV-095, GOV-169

---

## 9. Acceptance Criteria

| # | Criterion | Verification method |
|---|-----------|---------------------|
| AC-01 | Answers IA question without nav/UI/storage | Scope audit |
| AC-02 | Rules P8-R-050 through P8-R-064 sequential | grep count = 15 |
| AC-03 | Every rule cites GOV ID from §5 | Cross-check |
| AC-04 | No navigation mechanics defined | Boundary audit vs Ch 04 |
| AC-05 | FB-P8-009, FB-P8-010 present or cross-ref | Count |
| AC-07 | Freeze header and footer present | See Freeze Summary |
| AC-08 | Subsystem dependency chain 05→03→04 respected | Dependency audit |

---

## 10. Founder ADR Required

| Field | Value |
|-------|-------|
| **ADR** | ADR-P8-001 |
| **Reason (historical)** | At freeze, Chapter 01 §2 Excludes deferred "One linking system schema/API" to "Chapter 03 — Core Objects & Data Model". Canonical ownership is **Chapter 05**. Frozen text was not to be edited silently. |
| **Resolution** | ADR-P8-001 completed 2026-07-23. Pointer migration finished. Ch 01/02/15 references synchronized. No constitutional doctrine changed. |
| **Status** | Resolved (2026-07-23) |

---

## Changelog

### 2026-07-23 — Publication metadata sync (ADR-P8-001)

- **What:** Chapter-local ADR-P8-001 status set to Resolved. Historical rationale retained. No rule or doctrine change.
- **Status:** shipped

### 2026-07-22 — Frozen v1.0 (Subsystem Batch 2)

- **What:** Architecture review pass. Ownership/dependency/terminology fixes. Freeze header/footer. ADR-P8-001 logged.
- **Status:** FROZEN

### 2026-07-22 — Initial draft (Batch 2)

- **What:** Chapter 03 Information Architecture; P8-R-050…064.
- **Status:** superseded

---

## Freeze Summary

**Status:** Frozen

**Subsystem:** Batch 2 — Information Model (Ch 03–05)

**Canonical Rules:** 15 (P8-R-050…064)

**Referenced GOV IDs:** 21

**Founder Decision Blocks:** 2 in-chapter (FB-P8-009 cross-ref, FB-P8-010); 5 subsystem-open total

**Known Dependencies:**

- Chapter 01 — Product Identity
- Chapter 02 — Core Product Philosophy
- Chapter 05 — Core Objects & Data Model

**Architecture Review:** PASS

**Governance Traceability:** PASS

**Ready for Implementation:** YES (pending open Founder Decision Blocks)
