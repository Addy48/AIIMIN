# Chapter 02 — Core Product Philosophy

| Field | Value |
|-------|-------|
| **Status** | FROZEN |
| **Version** | P8 v1.0 |
| **Chapter** | 02 — Core Product Philosophy |
| **Approval** | Founder Approved |
| **Last Modified** | 2026-07-22 |
| **Supersedes** | None |

This chapter is normative.

Any modification requires a Founder ADR.

```yaml
chapter: 02
title: Core Product Philosophy
p8_version: P8 v1.0
status: FROZEN
governance_source: P7 Governance v1.0 (FROZEN)
depends_on: Chapter 01 — Product Identity (FROZEN v1.0)
architectural_question: "How should AIIMIN behave?"
```

---

## 1. Purpose

Define **how AIIMIN behaves** at the product-philosophy level: mission outcomes, emotional contract, core doctrines, Human Momentum behavioral expression, success/failure philosophy, and philosophy decision hierarchy.

This chapter depends on Chapter 01 for identity terms (`Personal Life OS`, `Human Momentum`, `Vision lock`, `Living Momentum OS`, `Connected graph`, `Primitive`, etc.) and MUST NOT redefine them.

This chapter does **not** define interaction mechanics, capture UI contracts, surface composition, AI band thresholds, motion tokens, navigation shells, privacy operations, or implementation governance. Those belong in later chapters (see §2 Scope — Excludes).

---

## 2. Scope

### Includes

- Three existence outcomes and outcome-mapping philosophy
- Optimize / avoid matrix (product trade-off philosophy)
- Philosophy decision hierarchy (outcomes → matrix → emotional contract)
- Emotional contract (feel / never feel)
- Core product doctrines (intent, capture, read, friction, memory, coaching, inference)
- Human Momentum behavioral philosophy
- Success and failure philosophy (non-vanity; not analytics dashboards)
- Philosophy invariants
- Numbered canonical rules (`P8-R-###`) continuing from Chapter 01

### Excludes

| Topic | Deferred to | Governance pointer |
|-------|-------------|-------------------|
| Product identity, IS/IS NOT boundaries, brand lockup | Chapter 01 — Product Identity | GOV-001…012, 036, 039, 047, 162 |
| Life entity schema, linking system API | Chapter 05 — Core Objects & Data Model | GOV-019, GOV-043 |
| IA intents, nav shells, surface jobs | Chapter 03 — Information Architecture | GOV-094…103, GOV-163 |
| Capture paths, Enter-save ceremony, taxonomy-first interaction law | Chapter 06 — Capture System | GOV-066, GOV-127, GOV-130 |
| AI confidence bands, roles, pipeline order | Chapter 07 — AI Architecture | GOV-048, GOV-137, GOV-138, GOV-139 |
| Today composition, Life Score formula, XP surface contracts | Chapter 08 — Surface Specifications | GOV-068, GOV-076, GOV-149, FB-P8-005 |
| Interaction primitives (primary action, chips, undo, forms-last) | Chapter 09 — Interaction System | GOV-122…135 |
| Motion duration, easing, reduced-motion tokens | Chapter 12 — Motion System | GOV-054, GOV-055, GOV-112…121 |
| Platform `/m` ceiling enforcement | Chapter 13 — Platform Specifications | GOV-013, GOV-041 |
| Performance SLO instrumentation | Chapter 14 — Offline / Sync / Performance | GOV-057, GOV-059, GOV-060 |
| Notification taxonomy | Chapter 16 — Notifications | GOV-064, GOV-033 |
| Feature intake process, amendment law, vault ship gate | Chapter 24 — Implementation Constraints (Pending) | GOV-023, GOV-024, GOV-025, GOV-044 |

---

## 3. Canonical Product Philosophy

### Premise

AIIMIN exists for **one human under cognitive load** (Chapter 01 §3). Philosophy translates identity into behavioral law: what the product optimizes, what it refuses, and what emotional outcomes interactions MUST produce.

**Governance:** GOV-004, GOV-056

### Three existence outcomes

AIIMIN MUST enable exactly three outcomes:

| Outcome | Requirement |
|---------|-------------|
| **Capture** | Capture life as it happens without becoming a data-entry clerk |
| **Connect** | See one **Connected graph** of goals, habits, money, calendar, body, mind, family, and work |
| **Coach** | Act tomorrow with less friction than today through memory, connection, and honest coaching |

Every feature MUST map to at least one outcome. Orphan features MUST NOT ship.

Domain-adoption scope for **Connected graph** is unresolved — FB-P8-004.

**Governance:** GOV-004, GOV-061

### Optimize / avoid matrix

Product decisions MUST score against this matrix:

| Optimize | Deliberately avoid |
|----------|-------------------|
| Capture speed | Configuration theater |
| Connected memory | Siloed widgets |
| Correctable inference | Silent wrongness |
| Interruptibility respect | JITAI nag loops |
| Pattern language | Punitive streaks |
| Progressive disclosure by stakes | Same friction everywhere |
| Long-term trust | Short-term engagement hacks |
| Timeless identity | Trend following |

**Governance:** GOV-026

*Pattern language operational definition: Chapter 10 — Component System (CF-014).*

### Philosophy decision hierarchy

When principles compete, apply in this order:

1. **Existence outcomes** (§3) — feature MUST map to Capture, Connect, or Coach.
2. **Optimize / avoid matrix** (§3) — proposal MUST not optimize the avoid column.
3. **Emotional contract** (§4) — interaction MUST not violate feel / never-feel law.
4. **Core doctrines** (§5) — specific behavioral rules apply within the above.

Identity law in Chapter 01 ALWAYS supersedes philosophy if in conflict until amended via Founder ADR.

**Governance:** GOV-004, GOV-026, GOV-030, GOV-025

---

## 4. Emotional Contract

Philosophy of emotional outcomes only. Wording guidelines and component copy belong in later chapters.

### Users MUST feel

Calm. Capable. Honest. Respected. In momentum — not in debt to the product.

### Primary emotional contract (triad)

| Phase | Required feeling |
|-------|------------------|
| After capture | **Relief** |
| After review | **Clarity** |
| After coaching | **Agency** |

**Governance:** GOV-030

### Users MUST NOT feel

Interrogated. Shamed. Trapped. Surveilled. Confused by decoration. Patronized by "AI magic." Forced to choose among five moods or fourteen lab modules to do one simple thing.

**Governance:** GOV-031

### Privacy dignity

Users MUST NOT feel surveilled. Dignity and control are philosophical requirements supported by identity law in Chapter 01 (export/delete) and privacy implementation in Chapter 15.

**Governance:** GOV-058

---

## 5. Core Doctrines

### Intent over interface

Users arrive with needs, not taxonomies. The product MUST prefer need-based entry over taxonomy browsing.

**Governance:** GOV-027 · **Detail:** Chapter 03 — Information Architecture

### Capture first, structure later

Raw expression is the highest-fidelity signal. Structure is derived after capture, not required before first save.

**Governance:** GOV-028, GOV-052 · **Detail:** Chapter 06 — Capture System

### Read surfaces stay calm

Review MUST produce clarity, not new anxiety. Intelligence MUST be presented without interrogation.

**Governance:** GOV-029 · **Detail:** Chapter 08 — Surface Specifications

### Progressive disclosure by stakes

Friction MUST match stakes. High-stakes actions earn friction; capture does not. Same friction MUST NOT be applied everywhere.

**Governance:** GOV-032 · **Detail:** Chapter 09 — Interaction System (destructive confirm: GOV-015)

### Interruptibility

The product MUST respect interruptibility and MUST NOT use JITAI nag loops.

**Governance:** GOV-033 · **Detail:** Chapter 16 — Notifications

### Compression as craft

Median daily meaningful interactions MUST trend toward ~5, not ~15+, for the same human outcomes. Rising interaction count for the same outcomes equals product failure.

Compression is a **ceremony budget**, not a capability ceiling — depth MUST NOT require mandatory daily ceremony (REC-013).

**Governance:** GOV-034, GOV-060, GOV-135 · **Measurement philosophy:** FB-P8-002

### Correctable inference

Silent wrong automation without a correction path equals failure. The product MUST optimize for correctable inference and MUST avoid silent wrongness.

**Governance:** GOV-035, GOV-051 · **Detail:** Chapter 07 — AI Architecture

### One primitive, many surfaces

Duplicate primitives for the same concept MUST NOT proliferate.

**Governance:** GOV-020 · **Detail:** Chapter 10 — Component System

### Tomorrow lighter

The product MUST reduce next-day planning friction via remembered context. Yesterday MUST be remembered so tomorrow requires less re-entry.

**Governance:** GOV-061 · **Detail:** Chapter 08 — Surface Specifications

### Cognitive accessibility under load

The product MUST NOT force complex mode, category, or lab-module choices for simple capture.

**Governance:** GOV-056, GOV-008, GOV-080

### Capture speed

Daily capture MUST be possible in under ~60 seconds when the user is ready. Capture speed is a first-class philosophical optimization target.

**Governance:** GOV-057, GOV-059 · **Instrumentation:** FB-P8-002, Chapter 14

---

## 6. Human Momentum Behavioral Philosophy

Chapter 01 §5 defines **Human Momentum** as brand frame. This section defines behavioral expression only — not algorithms, scoring formulas, or surface implementation.

### Behavioral honesty

Human Momentum REQUIRES behavioral honesty — especially **Life Score** honesty and sparring — not slogan without substance.

**Governance:** GOV-003, GOV-009, GOV-049

### Sparring over sycophancy

Coaching MUST challenge weak habits with data. Empty praise and shame theater are both forbidden.

**Governance:** GOV-049 · **Tone bounds:** FB-P8-006

### Life Score vs XP (philosophical roles)

**Life Score** MUST remain honest composite truth. Celebratory XP MUST remain celebratory. Roles MUST NOT be mixed.

**Governance:** GOV-009, GOV-068 · **Formula:** FB-P8-005, Chapter 08

### No AI magic patronage

The product MUST NOT patronize users with vague "AI magic." Outcomes MUST be explainable in human terms.

**Governance:** GOV-053

### Coaching timing

Coaching MUST appear only when the interruptibility window is open. Coaching MUST NOT interrupt active focus.

**Governance:** GOV-141, GOV-088 · **Detail:** Chapter 08 — Surface Specifications

---

## 7. Success & Failure Philosophy

Philosophical definitions of winning and losing — not KPI dashboards, analytics implementations, or metric tooling.

### Success is not vanity

Success is NOT downloads, DAU vanity, or feature count.

Official success criteria (philosophical outcome definitions):

1. Daily capture possible in under ~60 seconds when the user is ready.
2. Median meaningful interactions per active day trending toward ~5, not ~15+.
3. User can answer "how am I doing?" without visiting four apps.
4. User trusts the system enough to write privately and still export everything.
5. Tomorrow's plan is lighter because yesterday was remembered.
6. Designers and contributors can ship without asking "who are we?"

Measurement method and SLO/OKR classification are unresolved — FB-P8-002, Chapter 14.

**Governance:** GOV-021

### Failure philosophy

Any of the following is a governance red flag:

1. Rising daily interaction count for the same human outcomes.
2. Duplicate primitives proliferating.
3. Clinical or therapist framing.
4. Analytics tools on phone web `/m`.
5. Social comparison as growth strategy.
6. Silent wrong automation without correction path.
7. Feature shipped without a human problem.
8. Redesign that belongs to another brand after removing the logo.

**Governance:** GOV-022 · **Operational checklist:** Chapter 24 — Implementation Constraints (Pending) (REC-006)

---

## 8. Philosophy Invariants

Immutable philosophy rules. Identity invariants remain in Chapter 01 §7.

| ID | Invariant | Governance |
|----|-----------|------------|
| PHIL-01 | Every feature MUST map to at least one existence outcome (Capture, Connect, Coach). | GOV-004 |
| PHIL-02 | The emotional contract triad (relief / clarity / agency) MUST hold after capture, review, and coaching respectively. | GOV-030 |
| PHIL-03 | Users MUST NOT be shamed, interrogated, trapped, surveilled, or patronized by "AI magic." | GOV-031, GOV-053 |
| PHIL-04 | Capture MUST precede structure; structure MUST NOT block raw capture. | GOV-028, GOV-052 |
| PHIL-05 | Read paths MUST stay calm — intelligence without interrogation. | GOV-029 |
| PHIL-06 | Friction MUST scale with stakes — progressive disclosure by stakes. | GOV-032 |
| PHIL-07 | JITAI nag loops MUST NOT ship. | GOV-033 |
| PHIL-08 | Inference MUST be correctable; silent wrongness MUST NOT ship. | GOV-035, GOV-051 |
| PHIL-09 | Coaching MUST use sparring with data, not sycophancy or shame theater. | GOV-049, GOV-003 |
| PHIL-10 | Success MUST NOT be measured by vanity metrics alone. | GOV-021 |

---

## 9. Canonical Rules

### §9.1 — Existence outcomes

**P8-R-020** — AIIMIN MUST enable three existence outcomes for a person under cognitive load: **Capture**, **Connect**, and **Coach**, as defined in §3.

**Referenced GOV IDs:** GOV-004

---

**P8-R-021** — Every feature MUST map to at least one existence outcome. Features that map to zero outcomes MUST NOT ship.

**Referenced GOV IDs:** GOV-004

---

**P8-R-022** — The **Connected graph** outcome MUST NOT be interpreted as requiring full life-domain adoption on day one until FB-P8-004 is resolved.

**Referenced GOV IDs:** GOV-004

---

**P8-R-023** — The product MUST reduce next-day planning friction via remembered context.

**Referenced GOV IDs:** GOV-061

---

### §9.2 — Optimize / avoid and decision hierarchy

**P8-R-024** — Product and design reviews MUST score proposals against the optimize / avoid matrix in §3.

**Referenced GOV IDs:** GOV-026

---

**P8-R-025** — When principles compete, the philosophy decision hierarchy in §3 MUST be applied.

**Referenced GOV IDs:** GOV-004, GOV-026, GOV-030

---

### §9.3 — Emotional contract

**P8-R-026** — Interactions MUST produce the emotional contract triad: relief after capture, clarity after review, agency after coaching.

**Referenced GOV IDs:** GOV-030

---

**P8-R-027** — Interactions MUST NOT produce the emotional refuse states listed in §4.

**Referenced GOV IDs:** GOV-031

---

**P8-R-028** — The product MUST NOT create a surveillance feeling.

**Referenced GOV IDs:** GOV-058

---

### §9.4 — Core doctrines

**P8-R-029** — The product MUST prefer user intent over taxonomy (intent over interface).

**Referenced GOV IDs:** GOV-027

---

**P8-R-030** — Capture MUST precede structure. Raw expression is the highest-fidelity signal.

**Referenced GOV IDs:** GOV-028

---

**P8-R-031** — Structure MUST be derived after raw capture. Structure MUST NOT be required before first save.

**Referenced GOV IDs:** GOV-052, GOV-028

---

**P8-R-032** — Read paths MUST stay calm — intelligence without interrogation.

**Referenced GOV IDs:** GOV-029

---

**P8-R-033** — Friction MUST match stakes. High-stakes actions earn friction; capture paths MUST remain low-friction.

**Referenced GOV IDs:** GOV-032

---

**P8-R-034** — The product MUST respect interruptibility and MUST NOT ship JITAI nag loops.

**Referenced GOV IDs:** GOV-033

---

**P8-R-035** — Median meaningful daily interactions MUST trend toward ~5, not ~15+, for the same human outcomes.

**Referenced GOV IDs:** GOV-034, GOV-060

---

**P8-R-036** — Compression MUST be interpreted as ceremony budget, not capability ceiling (REC-013).

**Referenced GOV IDs:** GOV-034, GOV-060

---

**P8-R-037** — Silent wrong automation without a correction path MUST NOT ship.

**Referenced GOV IDs:** GOV-035, GOV-051

---

**P8-R-038** — Duplicate primitives for the same concept MUST NOT proliferate.

**Referenced GOV IDs:** GOV-020

---

**P8-R-039** — The product MUST NOT force complex mode, category, or lab-module choices for simple capture under cognitive load.

**Referenced GOV IDs:** GOV-056, GOV-080

---

**P8-R-040** — Daily capture MUST be possible in under ~60 seconds when the user is ready.

**Referenced GOV IDs:** GOV-057, GOV-059

---

### §9.5 — Human Momentum behavior

**P8-R-041** — Human Momentum claims MUST be backed by behavioral honesty (Life Score honesty, sparring). Slogan without honesty is a named risk.

**Referenced GOV IDs:** GOV-003, GOV-009, GOV-049

---

**P8-R-042** — Coaching MUST spar with data. Sycophancy and shame theater MUST NOT ship.

**Referenced GOV IDs:** GOV-049, GOV-031

---

**P8-R-043** — **Life Score** and celebratory XP MUST remain role-separated. Life Score MUST NOT become vanity XP.

**Referenced GOV IDs:** GOV-009, GOV-068

---

**P8-R-044** — The product MUST NOT patronize users with vague "AI magic" claims.

**Referenced GOV IDs:** GOV-053

---

**P8-R-045** — Coaching MUST appear only when the interruptibility window is open and MUST NOT interrupt active focus.

**Referenced GOV IDs:** GOV-141, GOV-088

---

### §9.6 — Success & failure

**P8-R-046** — Product success MUST NOT be measured by downloads, DAU vanity, or feature count alone.

**Referenced GOV IDs:** GOV-021

---

**P8-R-047** — Official success criteria in §7 MUST serve as the non-vanity success philosophy until FB-P8-002 resolves measurement rigor.

**Referenced GOV IDs:** GOV-021

---

**P8-R-048** — Any condition in §7 failure philosophy is a governance red flag and MUST trigger review before ship.

**Referenced GOV IDs:** GOV-022

---

## 10. Referenced GOV IDs

| GOV ID | Title | Status in P7 | Used in Ch 02 |
|--------|-------|--------------|---------------|
| GOV-003 | Brand frame — Human Momentum | Approved | Yes |
| GOV-004 | Three existence outcomes | Approved | Yes |
| GOV-008 | Refuse form-builder / capture blockers | Approved | Yes |
| GOV-009 | Refuse gamification casino; honest Life Score | Approved | Yes |
| GOV-015 | Destructive actions must confirm | Approved | Cross-ref (GOV-032) |
| GOV-020 | One primitive, many surfaces | Approved | Yes |
| GOV-021 | Official success criteria (non-vanity) | Needs Discussion | Yes |
| GOV-022 | Official failure triggers | Approved | Yes |
| GOV-025 | Article supremacy over later principles | Approved | Yes (decision hierarchy) |
| GOV-026 | Optimize / avoid matrix | Approved | Yes |
| GOV-027 | Intent over interface | Approved | Yes |
| GOV-028 | Capture first, structure later | Approved | Yes |
| GOV-029 | Read surfaces stay calm | Approved | Yes |
| GOV-030 | Emotional contract triad | Approved | Yes |
| GOV-031 | Emotional refuse list | Approved | Yes |
| GOV-032 | Progressive disclosure by stakes | Approved | Yes |
| GOV-033 | Interruptibility; no JITAI nag loops | Approved | Yes |
| GOV-034 | Compression as craft (~5 interactions) | Approved | Yes |
| GOV-035 | Correctable inference; no silent wrongness | Approved | Yes |
| GOV-049 | Sparring over sycophancy | Approved | Yes |
| GOV-051 | Inference must be correctable | Approved | Yes |
| GOV-052 | Structure after raw capture | Approved | Yes |
| GOV-053 | No AI magic patronage | Approved | Yes |
| GOV-056 | Cognitive accessibility under load | Approved | Yes |
| GOV-057 | Operable capture within ~60s | Approved | Yes |
| GOV-058 | No surveillance feeling; privacy dignity | Approved | Yes |
| GOV-059 | Capture speed first-class | Approved | Yes |
| GOV-060 | Interaction economy as performance | Needs Discussion | Yes |
| GOV-061 | Tomorrow lighter via remembered context | Approved | Yes |
| GOV-068 | Life Score honest; XP celebratory — roles unmixed | Needs Discussion | Yes |
| GOV-080 | Anti-picker proliferation | Approved | Yes |
| GOV-088 | No mid-Focus coaching modals | Approved | Yes |
| GOV-135 | Compression is continuous | Needs Discussion | Yes |
| GOV-141 | Coaching surfaces only when interruptibility window is open | Approved | Yes |

**Deferred to later chapters (valid in P7; not cited by Ch 02 rules):** GOV-014, GOV-016, GOV-054, GOV-055, GOV-076, GOV-149

**REC references (not canon):** REC-006, REC-013, REC-015

---

## 11. Dependencies

### Depends on

| Dependency | Role |
|------------|------|
| Chapter 01 — Product Identity (FROZEN v1.0) | Identity terms, vision lock, Living Momentum OS, IS/IS NOT |
| P7 Governance v1.0 (FROZEN) | Sole source of truth |
| `AIIMIN GENESIS/P5 Constitution/01_AIIMIN_CONSTITUTION.md` v3.0 | Articles I, V–X |

### Required by

| Consumer | Relationship |
|----------|--------------|
| Chapter 03 — Information Architecture | Intent model, calm read philosophy |
| Chapter 06 — Capture System | Capture-first doctrine |
| Chapter 07 — AI Architecture | Correctable inference, coaching windows |
| Chapter 08 — Surface Specifications | Tomorrow lighter, Life Score roles |
| Chapter 09 — Interaction System | Compression, friction by stakes |
| Chapter 12 — Motion System | Emotional triad motion law (GOV-054, GOV-055) |
| Chapter 14 — Offline / Sync / Performance | Capture latency instrumentation |
| Chapter 16 — Notifications | Interruptibility |
| Chapter 20 — Onboarding & Identity Formation | Connected graph scope (FB-P8-004) |
| Chapter 24 — Implementation Constraints (Pending) | Failure checklist operationalization |

### Cross references

| Document | Path |
|----------|------|
| Chapter 01 — Product Identity | `01_Product_Identity.md` |
| P8 Index | `00_INDEX.md` |
| P7 Decision Registry | `../P7 Governance/02_MASTER_DECISION_REGISTRY.json` |

---

## 12. Edge Cases

### EC-P8-201 — Power user depth vs compression budget

**Condition:** User seeks deep engagement in one life domain.

**Expected behavior:** Permitted when depth is user-initiated, not mandatory ceremony (P8-R-036, REC-013). Compression philosophy MUST NOT penalize optional depth.

**Governance:** GOV-034, GOV-060, CF-012

---

### EC-P8-202 — Sparring perceived as shame

**Condition:** Data-driven coaching is perceived as harsh.

**Expected behavior:** Sparring MUST use evidence, not insult. Tone bounds unresolved — FB-P8-006. MUST NOT cross into GOV-031 shame states.

**Governance:** GOV-049, GOV-031, CF-007

---

### EC-P8-203 — Connected graph with sparse domains

**Condition:** User engages only a subset of life domains.

**Expected behavior:** Connect outcome is satisfied for active domains. Full-domain mandate MUST NOT apply until FB-P8-004 resolves.

**Governance:** GOV-004, CF-011, FB-P8-004

---

### EC-P8-204 — Coaching during Focus

**Condition:** System has habit insight during active Focus.

**Expected behavior:** Coaching MUST NOT interrupt active focus (P8-R-045). Defer to interruptibility window (GOV-141).

**Governance:** GOV-088, GOV-141

---

### EC-P8-205 — Structured inference without "magic"

**Condition:** System derives structure from capture input.

**Expected behavior:** Outcome MUST be explainable in human terms (P8-R-044). Correction path required (P8-R-037).

**Governance:** GOV-053, GOV-035, GOV-051

---

### EC-P8-206 — Success philosophy before measurement law

**Condition:** Product ships before FB-P8-002 resolves.

**Expected behavior:** Philosophical success criteria in §7 remain binding. Instrumentation and SLO law remain blocked until FB-P8-002 resolves.

**Governance:** GOV-021, GOV-060, FB-P8-002

---

## 13. Founder Decision Blocks

### FB-P8-002 — Success metric measurement rigor

| Field | Value |
|-------|-------|
| **Identifier** | FB-P8-002 |
| **Issue** | GOV-021 success criteria use ~60 seconds and ~5 median interactions without telemetry definitions or SLO/OKR classification. |
| **Context** | CF-008. GOV-021 status: Needs Discussion. GOV-060 (interaction economy) also open. **Canonical home: Chapter 02** (ADR-P8-001). |
| **Why governance is insufficient** | Governance states success criteria but does not define measurement method, telemetry fields, or SLO vs OKR classification. |
| **Options** | (A) Hard SLOs with instrumented definitions. (B) Directional OKRs without engineering gates. (C) Hybrid — SLO for capture latency; OKR for interaction median. |
| **Recommendation** | Option C — capture latency is safety-critical (GOV-057, GOV-059); interaction median is product health signal, not per-request gate. |
| **Impact** | Blocks analytics spec, release gates, and Chapter 14 performance budgets until resolved. |
| **Status** | Pending Founder Decision |

**Referenced GOV IDs:** GOV-021, GOV-060 · **Conflict:** CF-008 · **REC:** REC-002, REC-013 · **Mirror:** Chapter 01 §12 (non-canonical)

---

### FB-P8-004 — Connected graph vs optional domains

| Field | Value |
|-------|-------|
| **Identifier** | FB-P8-004 |
| **Issue** | "One connected graph" may be read as mandating full-domain adoption. |
| **Context** | CF-011. Tension with Living Momentum OS pillar model. **Canonical home: Chapter 02** (ADR-P8-001). |
| **Why governance is insufficient** | GOV-004 asserts a connected graph without domain-adoption requirements or onboarding scope. |
| **Options** | (A) Graph is aspirational — connect what user uses. (B) Graph requires minimum domain set at onboarding. (C) Graph requires all domains visible but empty until used. |
| **Recommendation** | Option A — matches progressive disclosure by stakes (GOV-032). |
| **Impact** | Affects onboarding (Chapter 20 — Onboarding & Identity Formation) and Today composition (Chapter 08). |
| **Status** | Pending Founder Decision |

**Referenced GOV IDs:** GOV-004 · **Conflict:** CF-011 · **Mirror:** Chapter 01 §12 (non-canonical)

---

### FB-P8-006 — Sparring vs shame tone bounds

| Field | Value |
|-------|-------|
| **Identifier** | FB-P8-006 |
| **Issue** | Tension between GOV-049 (sparring with data) and GOV-031 (never shamed / interrogated). |
| **Context** | CF-007. No written tone examples in governance. |
| **Why governance is insufficient** | Governance requires sparring and forbids shame but does not define the boundary with examples. |
| **Options** | (A) Founder publishes tone guide with approved / forbidden coaching copy pairs. (B) Coaching limited to neutral data summaries only until guide exists. (C) Sparring disabled until guide exists — **conflicts with GOV-049 Approved status**. |
| **Recommendation** | Option A — REC-015 tone bounds document. |
| **Impact** | Blocks AI coaching copy, habit insights, and notification coaching until resolved. |
| **Status** | Pending Founder Decision |

**Referenced GOV IDs:** GOV-049, GOV-031 · **Conflict:** CF-007 · **REC:** REC-015

---

## Tracked conflicts (not resolved in this chapter)

| Conflict ID | Summary | Handling |
|-------------|---------|----------|
| CF-007 | Sparring vs never shame/interrogated | FB-P8-006 |
| CF-008 | ~60s / ~5 interactions measurability | FB-P8-002 |
| CF-011 | Connected graph assumes unified domains | FB-P8-004 |
| CF-012 | Median ~5 vs power-user breadth | P8-R-036, REC-013 |
| CF-014 | Pattern language undefined | Chapter 10 |

**Cross-chapter Founder blocks (not duplicated):** FB-P8-005 — Chapter 01 (canonical). FB-P8-001 — Chapter 04 (canonical; mirrored in Ch 01). FB-P8-003 merged into FB-P8-018 (Ch 15).

---

## 14. Acceptance Criteria

Chapter 02 freeze verification — each item MUST be marked **PASS** or **FAIL**:

| # | Criterion | Verification method |
|---|-----------|---------------------|
| AC-01 | Body text answers only "How should AIIMIN behave?" with no identity redefinition | Zero conflicts with Chapter 01 §6 terminology |
| AC-02 | Rules P8-R-020 through P8-R-048 exist sequentially with no gaps or duplicates | grep `^\*\*P8-R-` yields exactly 29 IDs (020–048) |
| AC-03 | Philosophy invariants PHIL-01 through PHIL-10 each cite at least one GOV ID | Cross-check §8 against §10 |
| AC-04 | Every P8-R rule cites at least one GOV ID listed in §10 | Cross-check §9 against §10 |
| AC-05 | No GOV ID in §10 is absent from P7 registry | Registry lookup |
| AC-06 | FB-P8-002, FB-P8-004, FB-P8-006 present with Status = Pending Founder Decision | Count = 3 |
| AC-07 | No surface, motion, navigation, or implementation specs in body text | Manual ownership audit |
| AC-08 | No forbidden vague words outside Founder Decision Blocks | Manual language audit |
| AC-09 | Freeze header and footer present with correct counts | See Freeze Summary |

---

## Changelog


### 2026-07-23 — Publication remediation (ADR-P8-001)

- **What:** Pointer corrections only. FB-002/004 marked canonical home; Ch 01 mirrors noted. No doctrine or rule-body change.
- **Why:** Publication blockers 1–3.
- **Status:** shipped
- **Governance:** ADR-P8-001 Resolved


### 2026-07-22 — Frozen v1.0

- **What:** Architecture review and freeze pass. Removed surface/motion implementation leakage. Renumbered P8-R-020…048 (29 rules). Added philosophy decision hierarchy. Normalized emotional contract and Human Momentum to philosophy-only.
- **Why:** Chapter must answer only "How should AIIMIN behave?"
- **Status:** FROZEN
- **Governance:** unchanged

### 2026-07-22 — Initial draft (v0.1)

- **What:** Chapter 02 Core Product Philosophy authored from P7 Governance v1.0.
- **Status:** superseded by v1.0

---

## Freeze Summary

**Status:** Frozen

**Canonical Rules:** 29

**Philosophy Invariants:** 10

**Referenced GOV IDs:** 34

**Founder Decision Blocks:** 3 (Pending Resolution)

**Known Dependencies:**

- Chapter 01
- Chapter 03
- Chapter 04
- Chapter 05
- Chapter 06
- Chapter 08
- Chapter 14
- Chapter 24 (Pending)

**Architecture Review:** PASS

**Governance Traceability:** PASS

**Ready for Implementation:** YES
