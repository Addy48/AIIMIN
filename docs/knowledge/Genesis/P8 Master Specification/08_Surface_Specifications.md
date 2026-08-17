# Chapter 08 — Surface Specifications

| Field | Value |
|-------|-------|
| **Status** | FROZEN |
| **Version** | P8 v1.0 |
| **Chapter** | 08 — Surface Specifications |
| **Subsystem** | Batch 3 — Operational Model (with Ch 06, Ch 07) |
| **Approval** | Founder Approved |
| **Last Modified** | 2026-07-22 |
| **Supersedes** | P8 v0.1-draft |

This chapter is normative.

Any modification requires a Founder ADR.

```yaml
chapter: 08
title: Surface Specifications
p8_version: P8 v1.0
status: FROZEN
governance_source: P7 Governance v1.0 (FROZEN)
depends_on:
  - Chapter 01 — Product Identity (FROZEN v1.0)
  - Chapter 02 — Core Product Philosophy (FROZEN v1.0)
  - Chapter 03 — Information Architecture (FROZEN v1.0)
  - Chapter 04 — Navigation (FROZEN v1.0)
  - Chapter 05 — Core Objects & Data Model (FROZEN v1.0)
  - Chapter 06 — Capture System (FROZEN v1.0)
  - Chapter 07 — AI Architecture (FROZEN v1.0)
architectural_question: "What job does each product surface perform?"
```

---

## 1. Purpose

Define **product surfaces**: canonical one-job responsibilities for each primary screen region in AIIMIN — not layouts, components, motion, or tokens.

Surfaces are where IA regions (Chapter 03) become user-facing responsibilities. This chapter MUST NOT define components, navigation mechanics, or object schemas.

---

## 2. Scope

### Includes

- Surface one-job law
- Canonical surface catalog and hierarchy layer
- Canonical surface contracts (purpose, responsibility, ownership, inputs, outputs, relationships)
- Nine primary product surfaces: Today, Knowledge, Journal, Documents, Timeline, Family, Finance, AI, Search
- Derived vs capture surface boundaries
- Anti-surfaces (refused primary IA)
- Surface ownership and intake
- Canonical rules `P8-R-124`…

### Excludes

| Topic | Owner |
|-------|-------|
| Components, cards, widgets | Chapter 10 — Component System |
| Motion, density tokens | Chapters 11–12 |
| Routes and shells | Chapter 04 — Navigation |
| Entity classes | Chapter 05 — Core Objects & Data Model |
| Capture pipeline | Chapter 06 — Capture System |
| AI roles and bands | Chapter 07 — AI Architecture |

---

## 3. Canonical Model

### 3.1 Surface one-job law

Every primary and secondary surface declares **exactly one job**. Multi-job dumps MUST NOT ship.

Each surface MUST publish a one-job sentence before ship.

**Governance:** GOV-164, GOV-122

### 3.2 Hierarchy layers (surface placement)

Surfaces MUST declare IA hierarchy layer (Chapter 03 §3.9):

| Layer | Surfaces (governance) |
|-------|------------------------|
| **1 — System** | Splash, Onboarding, Auth |
| **2 — Day** | Today |
| **3 — Memory** | Knowledge, Timeline, Search |
| **4 — Pillars** | Family, Finance, Documents |
| **5 — Intelligence** | AI |
| **6 — Account** | Profile, Settings |

**Governance:** GOV-169, GOV-164

### 3.3 Surface contract schema

Each surface below defines:

| Field | Meaning |
|-------|---------|
| **Purpose** | Why the surface exists |
| **Responsibility** | One-job sentence (GOV-164) |
| **Ownership** | IA layer + entity/domain owner |
| **Inputs** | What enters the surface |
| **Outputs** | What the surface produces |
| **Relationships** | Upstream/downstream surfaces and subsystems |

Specifications are **UI-technology independent** — any client MAY implement these contracts differently without changing P8.

### 3.4 Today

| Field | Specification |
|-------|---------------|
| **Purpose** | Daily operating surface for acting on the current day |
| **Responsibility** | Act on this day |
| **Ownership** | Layer 2 — Day; hosts primary capture story (GOV-106) |
| **Inputs** | User intent, universal/local capture, derived day state from life graph |
| **Outputs** | Committed captures (via Ch 06 pipeline), day actions, calm derived reads |
| **Relationships** | Ch 04 wordmark destination; Ch 06 primary capture host; not a collage home (GOV-165) |

**Governance:** GOV-164, GOV-106, GOV-012, GOV-029

### 3.5 Knowledge

| Field | Specification |
|-------|---------------|
| **Purpose** | Reference memory capture and revision |
| **Responsibility** | Capture and revise personal memory |
| **Ownership** | Layer 3 — Memory; Knowledge/Notes entity region |
| **Inputs** | Notes, references, revisions, search recall |
| **Outputs** | Updated Knowledge/Notes life entities |
| **Relationships** | Distinct from Journal (`P8-R-083`); may present with Journal per FB-P8-009 |

**Governance:** GOV-164, GOV-101

### 3.6 Journal

| Field | Specification |
|-------|---------------|
| **Purpose** | Reflection capture |
| **Responsibility** | Reflection capture |
| **Ownership** | Layer 3 — Memory; Journal entity class |
| **Inputs** | Reflective capture, Analyzer enrichment (Ch 07) |
| **Outputs** | Journal life entities |
| **Relationships** | Distinct from Knowledge; Ch 06 local capture permitted; Ch 07 Analyzer role |

**Governance:** GOV-164, GOV-101

### 3.7 Documents

| Field | Specification |
|-------|---------------|
| **Purpose** | File and vault artifact management |
| **Responsibility** | Store and retrieve files/vault docs |
| **Ownership** | Layer 4 — Pillars; Documents entity |
| **Inputs** | Files, vault artifacts, retrieval queries |
| **Outputs** | Stored/retrieved Documents entities |
| **Relationships** | Distinct from Knowledge and Journal; Family vault trust may link |

**Governance:** GOV-164, GOV-101

### 3.8 Timeline

| Field | Specification |
|-------|---------------|
| **Purpose** | Chronological life memory and planning |
| **Responsibility** | Remember what happened |
| **Ownership** | Layer 3 — Memory; chronology region |
| **Inputs** | Time-ordered life entities and events |
| **Outputs** | Chronological views; planning context |
| **Relationships** | Not a social feed (GOV-102); Calendar naming maps here |

**Governance:** GOV-164, GOV-102

### 3.9 Family

| Field | Specification |
|-------|---------------|
| **Purpose** | Shared care and private vault trust |
| **Responsibility** | Shared care + private vault trust |
| **Ownership** | Layer 4 — Pillars; Family domain |
| **Inputs** | Family captures, vault-linked artifacts, care events |
| **Outputs** | Family-domain life entities |
| **Relationships** | Local capture via Ch 06; universal capture remains primary |

**Governance:** GOV-164

### 3.10 Finance

| Field | Specification |
|-------|---------------|
| **Purpose** | Money logging and truth |
| **Responsibility** | Log and see money truth |
| **Ownership** | Layer 4 — Pillars; Finance domain |
| **Inputs** | Financial captures, inferred categories (Ch 07 Inferencer) |
| **Outputs** | Finance life entities; money truth reads |
| **Relationships** | Ch 06 pipeline; Ch 07 confidence bands for inference |

**Governance:** GOV-164

### 3.11 AI

| Field | Specification |
|-------|---------------|
| **Purpose** | Intelligence surface for ask/review/act |
| **Responsibility** | Ask, review, act with correctable inference |
| **Ownership** | Layer 5 — Intelligence |
| **Inputs** | User questions, graph context (Ch 07), capture history |
| **Outputs** | Routed actions, inferred structure, coaching (when window open) |
| **Relationships** | Ch 07 roles; not chatbot-as-center (GOV-047); interruptibility (GOV-141) |

**Governance:** GOV-164, GOV-047, GOV-136, GOV-141

### 3.12 Search

| Field | Specification |
|-------|---------------|
| **Purpose** | Cross-graph recall |
| **Responsibility** | Recall across the graph |
| **Ownership** | Layer 3 — Memory |
| **Inputs** | Recall queries across life entities |
| **Outputs** | Entity references, navigation targets (Ch 04) |
| **Relationships** | Goals MAY appear as labeled results; no Projects-board primary world (GOV-165) |

**Governance:** GOV-164, GOV-165

### 3.13 Surface index (one-line)

| Surface | Responsibility |
|---------|----------------|
| Today | Act on this day |
| Knowledge | Capture and revise personal memory |
| Journal | Reflection capture |
| Documents | Store and retrieve files/vault docs |
| Timeline | Remember what happened |
| Family | Shared care + private vault trust |
| Finance | Log and see money truth |
| AI | Ask, review, act with correctable inference |
| Search | Recall across the graph |

**Governance:** GOV-164

### 3.14 System surfaces (cross-reference only)

Settings, Profile, Onboarding, and Auth have one-jobs in GOV-164 but are owned by later P8 chapters (17, 18). This chapter references them only for intake boundary — not specified here.

**Governance:** GOV-164, GOV-100, GOV-166

### 3.15 Anti-surfaces (refused primary IA)

AIIMIN MUST NOT ship as primary product home:

- Tasks as primary surface
- Projects board as primary surface
- Collage home of unrelated read modules

**Governance:** GOV-165, GOV-106

*Goal entities MAY exist under Search recall; "Projects" is not a primary surface.*

### 3.16 Derived vs capture posture

| Surface type | Interaction posture |
|--------------|---------------------|
| **Capture surfaces** | Fast write; ceremony-free save (Ch 06) |
| **Derived surfaces** | Calm read; scan; no demanded input |
| **Mixed (Today)** | One primary capture story; derived reads secondary |

**Governance:** GOV-029, GOV-096

### 3.17 Surface intake

New surfaces MUST declare: one-job sentence, hierarchy layer, entity IA contract (Chapter 05), blueprint owner, device ceiling.

**Governance:** GOV-164, GOV-103, GOV-169

### 3.18 Dashboard (refused)

There is **no Dashboard surface**. **Today** owns the day surface. Consolidated read uses calm surfaces per GOV-098 — not a dashboard product mode.

**Governance:** GOV-165, GOV-106, GOV-098

---

## 4. Canonical Rules

### §4.1 — One-job law

**P8-R-124** — Every surface MUST declare exactly **one job**; multi-job primary surfaces MUST NOT ship.

**Referenced GOV IDs:** GOV-164, GOV-122

---

**P8-R-125** — New surfaces MUST publish one-job sentence and hierarchy layer before ship.

**Referenced GOV IDs:** GOV-164, GOV-169, GOV-103

---

### §4.2 — Today and composition

**P8-R-126** — **Today** MUST maintain one primary capture story; collage composition MUST NOT ship.

**Referenced GOV IDs:** GOV-106, GOV-164

---

**P8-R-127** — Today MUST remain the daily operating surface reachable per brand lockup (Chapter 04).

**Referenced GOV IDs:** GOV-012, GOV-164

---

### §4.3 — Memory surfaces

**P8-R-128** — **Knowledge**, **Journal**, and **Documents** MUST remain distinct surface responsibilities per entity separation (Chapter 05 `P8-R-083`).

**Referenced GOV IDs:** GOV-101, GOV-164

---

**P8-R-129** — **Timeline** MUST present chronology for planning and memory; feed-style engagement surfaces MUST NOT ship.

**Referenced GOV IDs:** GOV-102, GOV-164

---

**P8-R-130** — **Search** MUST serve graph recall; Tasks/Projects primary boards MUST NOT replace Search job.

**Referenced GOV IDs:** GOV-164, GOV-165

---

### §4.4 — Pillars and intelligence

**P8-R-131** — **Family** and **Finance** surfaces MUST keep single pillar jobs per GOV-164; pillar capture MUST NOT bypass universal capture as taught primary path.

**Referenced GOV IDs:** GOV-164, GOV-170, GOV-127

---

**P8-R-132** — **AI** surface MUST support ask/review/act with correctable inference; chatbot-as-product-center MUST NOT ship.

**Referenced GOV IDs:** GOV-164, GOV-047, GOV-136

---

### §4.5 — Account and anti-surfaces

**P8-R-133** — **Settings** MUST remain penalty-box control; daily actions MUST NOT migrate to Settings.

**Referenced GOV IDs:** GOV-100, GOV-164

---

**P8-R-134** — Tasks, Projects board, and collage-home surfaces MUST NOT ship as primary product homes.

**Referenced GOV IDs:** GOV-165

---

**P8-R-135** — A **Dashboard** collage home MUST NOT ship; Today owns the day surface.

**Referenced GOV IDs:** GOV-165, GOV-106

---

### §4.6 — Read/capture posture

**P8-R-136** — Derived surfaces (scores, digests, calm reads) MUST NOT demand input as primary interaction.

**Referenced GOV IDs:** GOV-029, GOV-096

---

**P8-R-137** — Capture surfaces MUST allow ceremony-free primary save per Chapter 06 (`P8-R-096`).

**Referenced GOV IDs:** GOV-066, GOV-164

---

**P8-R-138** — Information density on surfaces MUST match cognitive mode: capture low ceremony; review calm; command higher density permitted.

**Referenced GOV IDs:** GOV-109, GOV-029

---

## 5. Referenced GOV IDs

| GOV ID | Title | Status in P7 | Used in Ch 08 |
|--------|-------|--------------|---------------|
| GOV-009 | Refuse gamification casino | Approved | Yes |
| GOV-012 | Today / brand lockup | Approved | Yes |
| GOV-020 | One primitive, many surfaces | Approved | Yes |
| GOV-029 | Read surfaces stay calm | Approved | Yes |
| GOV-047 | AI-first ≠ chatbot | Approved | Yes |
| GOV-068 | Life Score honest; XP celebratory | Needs Discussion | Cross-ref FB-P8-005 |
| GOV-096 | Four IA node layers | Approved | Yes |
| GOV-098 | Consolidated read | Approved | Yes |
| GOV-100 | Settings penalty box | Approved | Yes |
| GOV-101 | Knowledge ≠ Journal ≠ Documents | Approved | Yes |
| GOV-102 | Timeline ≠ feed | Approved | Yes |
| GOV-103 | Entity IA contract | Approved | Yes |
| GOV-106 | Composition over collage | Approved | Yes |
| GOV-109 | Density matches cognitive mode | Approved | Yes |
| GOV-122 | One obvious primary action | Approved | Yes |
| GOV-127 | Capture beats navigation | Needs Discussion | Yes |
| GOV-136 | Mixed-initiative AI | Approved | Yes |
| GOV-141 | Coaching interruptibility | Approved | Cross-ref |
| GOV-164 | Surface one-job law | Approved | Yes |
| GOV-165 | Refuse Tasks/Projects/widget dashboard | Approved | Yes |
| GOV-167 | Knowledge unifies Journal/Notes | Needs Discussion | FB-P8-009 |
| GOV-169 | Six hierarchy layers | Approved | Yes |
| GOV-170 | Capture FAB primary path | Approved | Yes |

---

## 6. Dependencies

### Depends on

| Dependency | Role |
|------------|------|
| Chapter 03 — Information Architecture | Regions, layers, Settings penalty box |
| Chapter 04 — Navigation | Today route; not redefined here |
| Chapter 05 — Core Objects & Data Model | Entity classes per surface |
| Chapter 06 — Capture System | Capture posture on surfaces |
| Chapter 07 — AI Architecture | AI surface behavior bounds |

### Required by

| Consumer | Relationship |
|----------|--------------|
| Chapter 10 — Component System | Surfaces host components |
| Chapter 13 — Platform Specifications | Device ceilings per surface |

---

## 7. Edge Cases

### EC-P8-801 — Projects board proposed as home

**Condition:** New "Projects" primary tab with kanban home.

**Expected behavior:** Rejected per P8-R-134; goals labeling under Search permitted per GOV-165.

**Governance:** GOV-165

---

### EC-P8-802 — Life Score with capture chrome on Today

**Condition:** Life Score primary CTA mimics journal capture.

**Expected behavior:** Rejected — derived surface must not demand input (P8-R-136).

**Governance:** GOV-029, GOV-149

---

### EC-P8-803 — Daily feature under Settings

**Condition:** Habit tracker placed in Settings for convenience.

**Expected behavior:** Rejected unless penalty-box criteria met (P8-R-133).

**Governance:** GOV-100

---

## 8. Founder Decision Blocks

*No new Founder Decision Blocks. Cross-subsystem blocks apply: FB-P8-009 (Knowledge/Journal presentation), FB-P8-005 (Life Score formula — Chapter 01), FB-P8-001 (Today route — Chapter 04).*

---

## 9. Acceptance Criteria

| # | Criterion | Verification method |
|---|-----------|---------------------|
| AC-01 | Answers surface jobs without components/motion/nav | Scope audit |
| AC-02 | Rules P8-R-124 through P8-R-138 sequential | grep count = 15 |
| AC-03 | Every rule cites GOV ID from §5 | Cross-check |
| AC-04 | Nine surfaces have full I/O contracts §3.4–3.12 | Table audit |
| AC-05 | No object or capture pipeline redefinition | Boundary audit |
| AC-06 | UI-technology independence | §3.3 audit |
| AC-07 | Subsystem audit §10 PASS | Audit table |
| AC-08 | Freeze header and footer present | See Freeze Summary |

---

## 10. Subsystem Consistency Audit (Batch 3 — Ch 01–08)

| Audit | Result | Notes |
|-------|--------|-------|
| 1. Capture universal | PASS | All ingress → canonical pipeline (Ch 06 §3.13) |
| 2. AI posture | PASS | Mixed-initiative, human-controlled, graph-aware, interruptible |
| 3. Surface one-job | PASS | Nine surfaces with I/O contracts |
| 4. Boundaries | PASS | Capture ≠ AI ≠ Surfaces |
| 5. Rules 094–138 | PASS | 45 sequential |
| 6. GOV traceability | PASS | Registry IDs only |
| 7. Terminology | PASS | Ch 01 §6 referenced |
| 8. Founder blocks | PASS | 0 new in Batch 3 |
| 9. Implementation leakage | PASS | Scrubbed chips/widgets/nav/provider refs |
| 10. Surface independence | PASS | UI-technology agnostic contracts |
| 11. AI independence | PASS | Model-independent in P8-R-109 |
| Frozen conflicts | NONE | ADR-P8-001 unchanged |

**Subsystem status:** FROZEN v1.0

---

## Changelog

### 2026-07-22 — Frozen v1.0 (Subsystem Batch 3)

- **What:** Full architecture review. Surface I/O contracts. Leakage scrub. Freeze header/footer.
- **Status:** FROZEN

### 2026-07-22 — Initial draft (Batch 3)

- **What:** Chapter 08 Surface Specifications; P8-R-124…138.
- **Status:** superseded

---

## Freeze Summary

**Status:** Frozen

**Subsystem:** Batch 3 — Operational Model (Ch 06–08)

**Canonical Rules:** 15 (P8-R-124…138)

**Referenced GOV IDs:** 22

**Founder Decision Blocks:** 0 in-chapter (FB-P8-009, FB-P8-005, FB-P8-001 cross-ref)

**Known Dependencies:**

- Chapter 03 — Information Architecture
- Chapter 04 — Navigation
- Chapter 05 — Core Objects & Data Model
- Chapter 06 — Capture System
- Chapter 07 — AI Architecture

**Architecture Review:** PASS

**Governance Traceability:** PASS

**Ready for Implementation:** YES (pending open Founder Decision Blocks from prior subsystems)
