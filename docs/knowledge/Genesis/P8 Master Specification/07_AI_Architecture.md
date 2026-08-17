# Chapter 07 — AI Architecture

| Field | Value |
|-------|-------|
| **Status** | FROZEN |
| **Version** | P8 v1.0 |
| **Chapter** | 07 — AI Architecture |
| **Subsystem** | Batch 3 — Operational Model (with Ch 06, Ch 08) |
| **Approval** | Founder Approved |
| **Last Modified** | 2026-07-22 |
| **Supersedes** | P8 v0.1-draft |

This chapter is normative.

Any modification requires a Founder ADR.

```yaml
chapter: 07
title: AI Architecture
p8_version: P8 v1.0
status: FROZEN
governance_source: P7 Governance v1.0 (FROZEN)
depends_on:
  - Chapter 01 — Product Identity (FROZEN v1.0)
  - Chapter 02 — Core Product Philosophy (FROZEN v1.0)
  - Chapter 05 — Core Objects & Data Model (FROZEN v1.0)
  - Chapter 06 — Capture System (FROZEN v1.0)
architectural_question: "How does intelligence operate in AIIMIN?"
```

---

## 1. Purpose

Define **AI architecture**: roles, orchestration, reasoning boundaries, context assembly, inference, planning, memory model, safety philosophy, and responsibility limits.

AIIMIN is AI-first (Chapter 01) but **not chatbot-first** (GOV-047). This chapter owns intelligence behavior; it MUST NOT own UI components, capture entry UX, navigation, or platform implementation.

---

## 2. Scope

### Includes

- AI product posture (mixed-initiative layer)
- Five AI roles and orchestration
- Capture processing stack (post-raw-save)
- Confidence bands and action gating
- Context assembly from life graph
- Memory model (architectural)
- Coaching and planning boundaries
- AI safety and refusal philosophy
- Model routing principles (not vendor wiring)
- Canonical rules `P8-R-109`…

### Excludes

| Topic | Owner |
|-------|-------|
| Capture entry, FAB, ceremony-free save | Chapter 06 — Capture System |
| Chips, components, motion | Chapters 09–12 |
| Surface jobs and layouts | Chapter 08 — Surface Specifications |
| Provider keys, endpoints | Backend / deployment (out of P8) |
| Notifications delivery | Chapter 16 — Notifications |

---

## 3. Canonical Model

### 3.1 AI posture

AIIMIN AI is a **mixed-initiative layer** that routes intent, infers structure, generates insight, and proposes action — with the user always one correction away from override.

Conversational surfaces MAY exist; the product is not a chatbot and AI is not authoritative.

**Governance:** GOV-047, GOV-136

### 3.2 Five AI roles

| Role | Responsibility | Typical trigger |
|------|----------------|-----------------|
| **Router** | Classify free text → target entity class | Universal capture, command capture |
| **Inferencer** | Fill fields when confidence permits | Post-save structuring |
| **Analyzer** | Post-capture enrichment | Journal analyze, domain insights |
| **Coach** | Narrative + recommendation | Insights, briefings |
| **Composer** | Draft milestones, arcs, summaries | Goals, identity, reflection |

Every AI feature MUST declare which role(s) it exercises. A sixth brand role MUST NOT ship without founder ADR.

**Governance:** GOV-138

### 3.3 Orchestration (capture path)

After raw capture (Chapter 06 §3.6), AI orchestration MUST follow:

1. Parse intent (Human Intent Graph)
2. Identify target life entities (Information Graph — Chapter 05)
3. Check Kill List — which fields may be skipped
4. Persist inferred structure to target life entities
5. Emit telemetry event (architectural obligation; spec deferred to analytics chapter)
6. Surface coaching **only if** interruptibility window is open

Steps 1–5 are mandatory order. Coaching MUST NOT precede persist.

**Governance:** GOV-139, GOV-074, GOV-141

### 3.4 Confidence bands

AI action is gated by confidence bands:

| Band | Behavior | Human control |
|------|----------|---------------|
| **≥70%** | Auto-fill; persist permitted | Correction always available |
| **40–70%** | Pre-fill; confirm required | Explicit confirm before settle |
| **<40%** | Ask minimal question | User supplies missing signal |
| **Safety/legal** | Never infer | Always ask |

Safety/legal fields (e.g., meds, allergies, PIN-class data) MUST NOT be inferred.

**Governance:** GOV-137, GOV-048, GOV-070

### 3.5 Correctable inference

Every structured inference MUST expose a correction path. Silent wrongness MUST NOT ship.

Correction paths are architecturally required; presentation is deferred to Chapter 09 — Interaction System (GOV-126 cross-ref).

**Governance:** GOV-035, GOV-051, GOV-126

### 3.6 Decision reduction

If a choice can wait, it waits. If AI can infer with correction path, do not ask upfront. Kill List fields stay dead.

**Governance:** GOV-123, GOV-074

### 3.7 Context assembly

**Context assembly** gathers relevant life entities, edges, and recent captures from the personal life graph to inform Router/Inferencer/Analyzer/Coach/Composer.

Context MUST respect:

- Personal graph scope (one human)
- Entity IA contract (Chapter 05)
- Device ceiling (Chapter 03)
- Privacy export/delete laws (Chapter 15 cross-ref)

Context MUST NOT assemble a social graph or public data feed.

**Governance:** GOV-001, GOV-019, GOV-094

### 3.8 Memory model (architectural)

AI **memory** is derived from persisted life entities and links — not a separate chat memory silo.

Remembered context serves **tomorrow lighter** outcomes (Chapter 02): prior captures, edges, and derived reads inform inference and coaching.

Ephemeral session context MAY exist for active tasks; durable memory MUST reconcile to life entities.

**Governance:** GOV-061, GOV-004, GOV-040

### 3.9 Coaching and planning boundaries

**Coach** role delivers narrative and recommendations only when the **interruptibility window** is open. AI MUST NOT steal Focus or protected modal states.

Coaching tone MUST spar with data — not sycophancy, not shame theater.

**Governance:** GOV-141, GOV-049, GOV-033, GOV-088

Planning proposals (Composer) are suggestions requiring user agency; AI MUST NOT auto-commit life plans without explicit user action.

**Governance:** GOV-136, GOV-140

### 3.10 AI safety philosophy

AI MUST NOT:

- Adopt clinical/therapist/diagnostic framing
- Change auth or billing without explicit user action
- Patronize with vague "AI magic"
- Run JITAI nag loops

**Governance:** GOV-050, GOV-140, GOV-053, GOV-033

### 3.11 Model routing (principle)

Model routing selects capability by **role and stakes** — not by surface brand or vendor identity. Architecture is **model-independent**: no provider, model family, or host is normative in P8.

High-stakes inference uses stricter confidence bands. Provider selection is implementation discretion.

**Governance:** GOV-137, GOV-032, GOV-136

### 3.12 Structure timing

AI MAY structure after raw capture; AI MUST NOT force structure before capture.

**Governance:** GOV-052, GOV-028

---

## 4. Canonical Rules

### §4.1 — Posture

**P8-R-109** — AI MUST operate as a **mixed-initiative layer**, not a chatbot bolted onto forms; architecture MUST be model-independent (no provider normative in P8).

**Referenced GOV IDs:** GOV-047, GOV-136

---

**P8-R-110** — Conversational surfaces MUST NOT become the product identity; structure derivation is core.

**Referenced GOV IDs:** GOV-047

---

### §4.2 — Roles

**P8-R-111** — Every AI feature MUST declare which of the five AI roles it exercises.

**Referenced GOV IDs:** GOV-138

---

**P8-R-112** — Router MUST classify free-text capture to target life entity classes per universal capture (Chapter 06).

**Referenced GOV IDs:** GOV-138, GOV-170

---

### §4.3 — Orchestration

**P8-R-113** — Post-raw-save AI orchestration MUST follow the ordered stack in §3.3; coaching MUST NOT precede persist.

**Referenced GOV IDs:** GOV-139, GOV-141

---

**P8-R-114** — Kill List MUST be checked before field inference asks.

**Referenced GOV IDs:** GOV-074, GOV-139

---

### §4.4 — Confidence and correction

**P8-R-115** — AI action MUST be gated by confidence bands per §3.4.

**Referenced GOV IDs:** GOV-137, GOV-048

---

**P8-R-116** — Safety/legal fields MUST NOT be inferred; explicit ask is required.

**Referenced GOV IDs:** GOV-137, GOV-070

---

**P8-R-117** — Every structured inference MUST expose a user correction path; silent wrongness MUST NOT ship.

**Referenced GOV IDs:** GOV-035, GOV-051, GOV-126

---

**P8-R-118** — Infer-with-correction MUST be preferred over upfront interrogation when Kill List permits.

**Referenced GOV IDs:** GOV-123, GOV-035

---

### §4.5 — Context and memory

**P8-R-119** — Context assembly MUST draw from the personal life graph; separate social or chat-only memory silos MUST NOT ship.

**Referenced GOV IDs:** GOV-001, GOV-019, GOV-061

---

**P8-R-120** — Durable AI memory MUST reconcile to life entities and edges.

**Referenced GOV IDs:** GOV-061, GOV-040

---

### §4.6 — Coaching and safety

**P8-R-121** — Coach role output MUST surface only when interruptibility window is open.

**Referenced GOV IDs:** GOV-141, GOV-033

---

**P8-R-122** — AI MUST NOT use clinical/therapist framing or change auth/billing without explicit user action.

**Referenced GOV IDs:** GOV-050, GOV-140

---

**P8-R-123** — AI coaching MUST spar with data; sycophancy and vague magic patronage MUST NOT ship.

**Referenced GOV IDs:** GOV-049, GOV-053

---

## 5. Referenced GOV IDs

| GOV ID | Title | Status in P7 | Used in Ch 07 |
|--------|-------|--------------|---------------|
| GOV-001 | Personal Life OS | Approved | Yes |
| GOV-004 | Three existence outcomes | Approved | Yes |
| GOV-019 | One linking system | Approved | Yes |
| GOV-028 | Capture first | Approved | Yes |
| GOV-032 | Progressive disclosure by stakes | Approved | Yes |
| GOV-033 | Interruptibility; no JITAI nag | Approved | Yes |
| GOV-035 | Correctable inference | Approved | Yes |
| GOV-040 | Shared primitives | Approved | Yes |
| GOV-047 | AI-first ≠ chatbot-first | Approved | Yes |
| GOV-048 | Confidence bands gate action | Needs Discussion | Yes |
| GOV-049 | Sparring over sycophancy | Approved | Yes |
| GOV-050 | No AI therapist | Approved | Yes |
| GOV-051 | Inference correctable | Approved | Yes |
| GOV-052 | Structure after raw capture | Approved | Yes |
| GOV-053 | No AI magic patronage | Approved | Yes |
| GOV-061 | Tomorrow lighter / remembered context | Approved | Yes |
| GOV-070 | Safety fields never infer | Approved | Cross-ref |
| GOV-074 | Kill List | Approved | Yes |
| GOV-088 | No mid-Focus coaching modals | Approved | Cross-ref |
| GOV-094 | Graph-over-folders | Approved | Yes |
| GOV-123 | Reduce decisions | Approved | Yes |
| GOV-126 | Infer then chip | Approved | Cross-ref |
| GOV-136 | Mixed-initiative layer | Approved | Yes |
| GOV-137 | Confidence band thresholds | Needs Discussion | Yes |
| GOV-138 | Five AI roles | Approved | Yes |
| GOV-139 | Capture AI input stack order | Approved | Yes |
| GOV-140 | No auth/billing change without user | Approved | Yes |
| GOV-141 | Coaching when interruptibility open | Approved | Yes |
| GOV-170 | Universal capture routing | Approved | Cross-ref |

---

## 6. Dependencies

### Depends on

| Dependency | Role |
|------------|------|
| Chapter 01 — Product Identity | AI-first identity |
| Chapter 02 — Core Product Philosophy | Sparring, correctable inference |
| Chapter 05 — Core Objects & Data Model | Life entities, graph |
| Chapter 06 — Capture System | Raw-save-first pipeline |

### Required by

| Consumer | Relationship |
|----------|--------------|
| Chapter 08 — Surface Specifications | AI surface jobs |
| Chapter 16 — Notifications | Coach delivery windows |

---

## 7. Edge Cases

### EC-P8-701 — Coach fires during Focus

**Condition:** Morning briefing triggers during active Focus session.

**Expected behavior:** Deferred per P8-R-121 until window opens.

**Governance:** GOV-141, GOV-088

---

### EC-P8-702 — High-confidence wrong category

**Condition:** Router auto-saves finance inference at ≥70% but user meant journal.

**Expected behavior:** Correction path MUST remain available per P8-R-117.

**Governance:** GOV-051, GOV-126

---

### EC-P8-703 — Chat-only memory proposed

**Condition:** Feature stores long-term memory only in chat thread.

**Expected behavior:** Rejected per P8-R-119; must reconcile to life graph.

**Governance:** GOV-019, GOV-061

---

## 8. Founder Decision Blocks

*No new Founder Decision Blocks. Confidence bands are specified deterministically by GOV-137 (cited with GOV-048). Life Score formula remains FB-P8-005 (Chapter 01). Linking system naming remains FB-P8-007 (Chapter 05).*

---

## 9. Acceptance Criteria

| # | Criterion | Verification method |
|---|-----------|---------------------|
| AC-01 | Answers AI architecture without UI/storage/API | Scope audit |
| AC-02 | Rules P8-R-109 through P8-R-123 sequential | grep count = 15 |
| AC-03 | Every rule cites GOV ID from §5 | Cross-check |
| AC-04 | Orchestration respects Ch 06 raw-save-first | Cross-chapter diff |
| AC-05 | No capture entry or surface layout defined | Boundary audit |
| AC-06 | Model-independent; no provider assumptions | §3.11 audit |
| AC-07 | Freeze header and footer present | See Freeze Summary |

---

## Changelog

### 2026-07-22 — Frozen v1.0 (Subsystem Batch 3)

- **What:** Architecture review. UI/provider leakage scrub. Model-independence in P8-R-109. Freeze header/footer.
- **Status:** FROZEN

### 2026-07-22 — Initial draft (Batch 3)

- **What:** Chapter 07 AI Architecture; P8-R-109…123.
- **Status:** superseded

---

## Freeze Summary

**Status:** Frozen

**Subsystem:** Batch 3 — Operational Model (Ch 06–08)

**Canonical Rules:** 15 (P8-R-109…123)

**Referenced GOV IDs:** 28

**Founder Decision Blocks:** 0 in-chapter

**Known Dependencies:**

- Chapter 01 — Product Identity
- Chapter 02 — Core Product Philosophy
- Chapter 05 — Core Objects & Data Model
- Chapter 06 — Capture System

**Architecture Review:** PASS

**Governance Traceability:** PASS

**Ready for Implementation:** YES (pending open Founder Decision Blocks from prior subsystems)
