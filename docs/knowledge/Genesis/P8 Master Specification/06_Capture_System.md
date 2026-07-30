# Chapter 06 — Capture System

| Field | Value |
|-------|-------|
| **Status** | FROZEN |
| **Version** | P8 v1.0 |
| **Chapter** | 06 — Capture System |
| **Subsystem** | Batch 3 — Operational Model (with Ch 07, Ch 08) |
| **Approval** | Founder Approved |
| **Last Modified** | 2026-07-22 |
| **Supersedes** | P8 v0.1-draft |

This chapter is normative.

Any modification requires a Founder ADR.

```yaml
chapter: 06
title: Capture System
p8_version: P8 v1.0
status: FROZEN
governance_source: P7 Governance v1.0 (FROZEN)
depends_on:
  - Chapter 01 — Product Identity (FROZEN v1.0)
  - Chapter 02 — Core Product Philosophy (FROZEN v1.0)
  - Chapter 05 — Core Objects & Data Model (FROZEN v1.0)
  - Chapter 03 — Information Architecture (FROZEN v1.0)
  - Chapter 04 — Navigation (FROZEN v1.0)
architectural_question: "How does life data enter AIIMIN?"
```

---

## 1. Purpose

Define the **capture subsystem**: how intent becomes persisted life data — entry points, universal capture path, processing order, lifecycle, ingestion contracts, and attachment philosophy.

This chapter owns capture behavior and contracts. It MUST NOT own AI reasoning (Chapter 07), surface layouts (Chapter 08), navigation mechanics (Chapter 04), or storage implementation.

---

## 2. Scope

### Includes

- Capture philosophy (capture-first, ceremony-free save)
- Universal capture and primary capture path
- Capture entry point classes (primary, ambient, local — not separate pipelines)
- Capture intent and ingestion contracts
- Processing pipeline order (raw save → structure)
- Capture lifecycle states (architectural, not storage enums)
- Source attribution philosophy
- Attachment philosophy
- Canonical rules `P8-R-094`…

### Excludes

| Topic | Owner |
|-------|-------|
| AI roles, confidence bands, coaching | Chapter 07 — AI Architecture |
| Page jobs, Today composition | Chapter 08 — Surface Specifications |
| Routes, FAB shell placement | Chapter 04 — Navigation |
| Life entity schemas | Chapter 05 — Core Objects & Data Model |
| Component implementations | Chapter 10 — Component System |
| Sync, outbox implementation | Chapter 14 — Offline / Sync / Performance |

---

## 3. Canonical Model

### 3.1 Capture philosophy

AIIMIN capture optimizes for **relief after capture** (Chapter 02): raw expression is the highest-fidelity signal; structure is derived later.

Capture MUST NOT block on taxonomy, mode pickers, category interrogation, or vanity configuration.

**Governance:** GOV-002, GOV-028, GOV-008, GOV-030

### 3.2 Universal capture

**Universal capture** is one utterance or expression that MAY route to multiple entity types (habit, journal, finance, note, event) with inference confirmation — not separate capture apps per pillar.

The global capture path is the **primary daily capture path** taught to users (Chapter 04 owns shell placement).

**Governance:** GOV-170, GOV-127, GOV-020

### 3.3 Capture entry points

| Entry class | Role | Governance |
|-------------|------|------------|
| **Primary** | Global universal capture path | GOV-170 |
| **Ambient** | Logger / command-style capture | GOV-127, GOV-099 |
| **Local** | Surface-initiated capture (same pipeline) | GOV-020, GOV-164 |

All entry classes MUST converge on the **canonical capture pipeline** (§3.6). Local capture is an ingress class, not a parallel ingestion system.

**Governance:** GOV-127, GOV-170, GOV-020

### 3.4 Ceremony-free save

Every capture path MUST allow **primary save without ceremony** — one-action commit before optional structure.

Structure, categories, and inferred fields MAY follow save; they MUST NOT gate first persistence.

**Governance:** GOV-066, GOV-028, GOV-052

### 3.5 Forms as last resort

Default capture personality is **natural language + progressive fields + correction affordances** — not multi-field forms.

Forms are permitted only for high-stakes accuracy when governance requires explicit human confirmation.

**Governance:** GOV-130, GOV-008

### 3.6 Processing pipeline (capture-owned order)

Capture processing MUST follow this architectural order:

1. **Persist raw capture** — life entity or capture record saved
2. **Queue structure** — inference/structuring MAY run asynchronously
3. **Present correction** — inferred fields exposed for user correction
4. **Finalize links** — edges written to one linking system (Chapter 05)

AI stack steps beyond persist are owned by Chapter 07; capture owns the **ordering invariant**: raw save precedes structure.

**Governance:** GOV-028, GOV-052, GOV-059, GOV-139 (steps 1–4 architectural split)

### 3.7 Capture lifecycle (architectural)

| State | Meaning |
|-------|---------|
| **Drafting** | User composing; not yet committed |
| **Saved (raw)** | Raw capture persisted; relief contract met |
| **Structuring** | Inference running or queued |
| **Correctable** | Inferred structure visible; user may correct |
| **Settled** | User accepted or corrected; links stable |

Pending sync honesty (no fake instant success) is a cross-cutting UX law — Chapter 14; capture MUST surface pending state when save is not yet durable.

**Governance:** GOV-132, GOV-059

### 3.8 Capture inbox

The **capture inbox** is the set of saved captures awaiting structure, routing, or user correction. It is not a social feed or engagement queue.

Inbox existence supports capture-first under load: user MAY leave after raw save; system completes structure without re-interrogation.

**Governance:** GOV-028, GOV-034

### 3.9 Ingestion contract

Every capture ingress MUST declare:

1. Source entry point (primary / ambient / local)
2. Target entity class or router outcome
3. Whether raw save is synchronous with user action
4. Correction affordance requirement (presentation: Chapter 09)
5. Device ceiling compliance (Chapter 03 §3.12)

**Governance:** GOV-103, GOV-170

### 3.10 Source attribution

Captures MUST retain **source attribution**: which entry point and surface initiated the capture. Attribution supports correctable inference and audit; it MUST NOT be used for engagement scoring.

**Governance:** GOV-035, GOV-051

### 3.11 Attachment philosophy

Attachments (files, images, voice) are **capture enrichments** bound to a parent capture or life entity. Attachments MUST NOT become a parallel content system detached from the life graph.

Voice and media MAY be first-class capture input; structure still derives after raw persist.

**Governance:** GOV-028, GOV-101

### 3.12 Speed and cognitive load

Capture MUST remain operable under cognitive load: no forced mood/lab/module choice for simple capture. Median path targets **~60 seconds when ready**.

**Governance:** GOV-056, GOV-057, GOV-059

### 3.13 Canonical pipeline convergence

All capture ingress — primary, ambient, or local — MUST execute the same canonical pipeline stages (§3.6). Surface-specific capture MUST NOT fork ingestion logic or bypass raw-save-first order.

**Governance:** GOV-020, GOV-028, GOV-170

---

## 4. Canonical Rules

### §4.1 — Philosophy

**P8-R-094** — Capture MUST follow **capture first, structure later**; raw expression MUST be persistable before required structure.

**Referenced GOV IDs:** GOV-028, GOV-052

---

**P8-R-095** — Capture MUST NOT block behind mode pickers, category interrogations, taxonomy browsers, or vanity configuration.

**Referenced GOV IDs:** GOV-008, GOV-027, GOV-056

---

### §4.2 — Save ceremony

**P8-R-096** — Every capture path MUST allow primary save **without ceremony**.

**Referenced GOV IDs:** GOV-066, GOV-028

---

**P8-R-097** — Multi-field forms MUST NOT be the default capture personality; natural language with progressive fields MUST be default.

**Referenced GOV IDs:** GOV-130, GOV-008

---

### §4.3 — Universal capture

**P8-R-098** — A **universal capture path** MUST exist as the primary daily capture path; one utterance MAY route to multiple entity types with inference confirmation.

**Referenced GOV IDs:** GOV-170, GOV-127

---

**P8-R-099** — Getting data in MUST outrank deep-link tourism through pillars for daily capture intents.

**Referenced GOV IDs:** GOV-127, GOV-028

---

### §4.4 — Pipeline and lifecycle

**P8-R-100** — Raw capture MUST be persisted before structuring or inference is required for save completion.

**Referenced GOV IDs:** GOV-028, GOV-059, GOV-052

---

**P8-R-101** — Structuring MUST NOT block primary save; async structuring is permitted.

**Referenced GOV IDs:** GOV-059, GOV-052

---

**P8-R-102** — Captures awaiting structure or correction MUST be trackable via a capture inbox model; inbox MUST NOT behave as a social feed.

**Referenced GOV IDs:** GOV-028, GOV-034, GOV-005

---

### §4.5 — Contracts and attribution

**P8-R-103** — Every capture ingress MUST satisfy the ingestion contract in §3.9 and converge on the canonical capture pipeline (§3.6).

**Referenced GOV IDs:** GOV-103, GOV-170, GOV-028

---

**P8-R-104** — Captures MUST retain source attribution for correction and audit.

**Referenced GOV IDs:** GOV-035, GOV-051

---

**P8-R-105** — Attachments MUST bind to parent captures or life entities in the life graph; parallel attachment silos MUST NOT ship.

**Referenced GOV IDs:** GOV-019, GOV-028

---

### §4.6 — Primitives and speed

**P8-R-106** — Each capture entity concept MUST use one write Primitive owner (Chapter 05 `P8-R-087`); duplicate capture primitives for the same concept MUST NOT ship.

**Referenced GOV IDs:** GOV-020

---

**P8-R-107** — Capture speed MUST be a first-class target: operable capture within ~60 seconds when the user is ready.

**Referenced GOV IDs:** GOV-059, GOV-057, GOV-021

---

**P8-R-108** — Pending durability MUST NOT present fake instant success; capture MUST surface honest pending state when save is not yet durable.

**Referenced GOV IDs:** GOV-132, GOV-059

---

## 5. Referenced GOV IDs

| GOV ID | Title | Status in P7 | Used in Ch 06 |
|--------|-------|--------------|---------------|
| GOV-002 | Vision lock — Capture once | Approved | Yes |
| GOV-005 | Refuse social feed | Approved | Yes |
| GOV-008 | Refuse form-builder / capture blockers | Approved | Yes |
| GOV-019 | One linking system | Approved | Yes |
| GOV-020 | One primitive, many surfaces | Approved | Yes |
| GOV-021 | Success criteria (~60s capture) | Approved | Yes |
| GOV-027 | Intent over interface | Approved | Yes |
| GOV-028 | Capture first, structure later | Approved | Yes |
| GOV-030 | Emotional contract (relief after capture) | Approved | Yes |
| GOV-034 | Compression craft (~5 interactions) | Approved | Yes |
| GOV-035 | Correctable inference | Approved | Yes |
| GOV-051 | Inference must be correctable | Approved | Yes |
| GOV-052 | Structure after raw capture | Approved | Yes |
| GOV-056 | Cognitive accessibility under load | Approved | Yes |
| GOV-057 | Operable capture within ~60s | Approved | Yes |
| GOV-059 | Capture speed first-class | Approved | Yes |
| GOV-066 | Ceremony-free Enter/primary save | Approved | Yes |
| GOV-099 | Command palette spine | Needs Discussion | Cross-ref |
| GOV-103 | Entity intake contract | Approved | Yes |
| GOV-127 | Capture beats navigation | Needs Discussion | Yes |
| GOV-130 | Forms are a last resort | Approved | Yes |
| GOV-132 | Latency honesty / pending sync | Approved | Yes |
| GOV-139 | Capture AI input stack order | Approved | Cross-ref Ch 07 |
| GOV-170 | Global Capture FAB sheet | Approved | Yes |

---

## 6. Dependencies

### Depends on

| Dependency | Role |
|------------|------|
| Chapter 01 — Product Identity | Vision lock, capture-once identity |
| Chapter 02 — Core Product Philosophy | Capture-first, relief contract |
| Chapter 05 — Core Objects & Data Model | Life entities, primitives, intake |
| Chapter 03 — Information Architecture | Capture layer topology |
| Chapter 04 — Navigation | FAB entry; not defined here |

### Required by

| Consumer | Relationship |
|----------|--------------|
| Chapter 07 — AI Architecture | Structuring pipeline after raw save |
| Chapter 08 — Surface Specifications | Local capture on surfaces |
| Chapter 14 — Offline / Sync | Pending durability |

---

## 7. Edge Cases

### EC-P8-601 — User abandons mid-structuring

**Condition:** Raw save completes; user leaves before correcting inferred structure.

**Expected behavior:** Capture remains in correctable/settled per product rules; MUST NOT lose raw capture.

**Governance:** GOV-028, GOV-051

---

### EC-P8-602 — Pillar requires form before save

**Condition:** Team proposes finance capture requiring category before save.

**Expected behavior:** Rejected unless high-stakes accuracy exception per GOV-130; default path violates P8-R-096.

**Governance:** GOV-066, GOV-130

---

### EC-P8-603 — Attachment without parent entity

**Condition:** Orphan file upload with no capture parent.

**Expected behavior:** Rejected per P8-R-105; attachment MUST bind to graph.

**Governance:** GOV-019

---

## 8. Founder Decision Blocks

*No new Founder Decision Blocks in this chapter. Open blocks from prior subsystems (FB-P8-001, FB-P8-011, FB-P8-012) affect capture entry wiring only; deterministic capture law is sufficient from GOV-028, GOV-066, GOV-170.*

---

## 9. Acceptance Criteria

| # | Criterion | Verification method |
|---|-----------|---------------------|
| AC-01 | Answers capture question without AI UI/storage/nav | Scope audit |
| AC-02 | Rules P8-R-094 through P8-R-108 sequential | grep count = 15 |
| AC-03 | Every rule cites GOV ID from §5 | Cross-check |
| AC-04 | No AI reasoning or surface layout defined | Boundary vs Ch 07, Ch 08 |
| AC-05 | Pipeline order respects Ch 05 + Ch 07 split | Cross-chapter diff |
| AC-06 | All ingress converges on canonical pipeline | §3.13 audit |
| AC-07 | Freeze header and footer present | See Freeze Summary |

---

## Changelog

### 2026-07-22 — Frozen v1.0 (Subsystem Batch 3)

- **What:** Architecture review. Pipeline convergence. Component/nav leakage scrub. Freeze header/footer.
- **Status:** FROZEN

### 2026-07-22 — Initial draft (Batch 3)

- **What:** Chapter 06 Capture System; P8-R-094…108.
- **Status:** superseded

---

## Freeze Summary

**Status:** Frozen

**Subsystem:** Batch 3 — Operational Model (Ch 06–08)

**Canonical Rules:** 15 (P8-R-094…108)

**Referenced GOV IDs:** 24

**Founder Decision Blocks:** 0 in-chapter (prior FBs cross-ref only)

**Known Dependencies:**

- Chapter 01 — Product Identity
- Chapter 02 — Core Product Philosophy
- Chapter 03 — Information Architecture
- Chapter 04 — Navigation
- Chapter 05 — Core Objects & Data Model

**Architecture Review:** PASS

**Governance Traceability:** PASS

**Ready for Implementation:** YES (pending open Founder Decision Blocks from prior subsystems)
