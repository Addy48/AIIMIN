# Chapter 18 — Personalization & Adaptation

| Field | Value |
|-------|-------|
| **Status** | FROZEN |
| **Version** | P8 v1.0 |
| **Chapter** | 18 — Personalization & Adaptation |
| **Subsystem** | Batch 6 — Agency & Adaptation (with Ch 16, Ch 17, Ch 18) |
| **Approval** | Founder Approved — Freeze Certificate 2026-07-23 |
| **Last Modified** | 2026-07-23 |
| **Supersedes** | P8 v0.4-freeze-blocker |

This chapter is normative.

Any modification requires a Founder ADR.

```yaml
chapter: 18
title: Personalization & Adaptation
p8_version: P8 v1.0
status: FROZEN
authored: 2026-07-22
remediated: 2026-07-23
compressed: 2026-07-23
freeze_blocker_pass: 2026-07-23
freeze_date: 2026-07-23
governance_source: P7 Governance v1.0 (FROZEN)
depends_on:
  - Chapter 01 — Product Identity (FROZEN v1.0)
  - Chapter 02 — Core Product Philosophy (FROZEN v1.0)
  - Chapter 05 — Core Objects & Data Model (FROZEN v1.0)
  - Chapter 13 — Platform Specifications (FROZEN v1.0)
  - Chapter 15 — Privacy & Security (FROZEN v1.0)
  - Chapter 16 — Notification System (FROZEN v1.0)
  - Chapter 17 — Intelligence & Automation (FROZEN v1.0)
architectural_question: "What must remain true of personalization, adaptation, and preference for as long as AIIMIN exists?"
```

---

## 1. Purpose

Define **fit-to-person law**: how AIIMIN may adapt to a human without erasing product identity or self-authored meaning; how preferences and defaults work; how learned fit stays non-destructive, explainable, stable, and overridable; and which personalization is forever forbidden as manipulation.

This chapter owns **how the product may fit the person**. It MUST NOT own Settings layout (Chapter 19), first-run ceremony (Chapter 20), automated action authority (Chapter 17), or attention worthiness (Chapter 16).

---

## 2. Scope

### Includes

- Personalization and adaptation bounds
- Preference sovereignty
- Personal defaults and non-destructive evolution
- Learned fit (not automated authority)
- Context awareness without meaning fork or capability smuggle
- Behavioral consistency, habits, stability, predictability
- Override, explainability, visibility
- Anti-manipulation and non-regression
- Canonical rules `P8-R-270`…`P8-R-277`, `P8-R-279`, `P8-R-281`…`P8-R-285`, `P8-R-287` (`P8-R-278`, `P8-R-280`, `P8-R-286` retired)

### Excludes

| Topic | Owner |
|-------|-------|
| Product identity / brand lock | Chapter 01 |
| Settings surface | Chapter 19 (pending); GOV-100 |
| Onboarding ceremony | Chapter 20 (pending) |
| Learning that drives automated action | Chapter 17 |
| Privacy consent for observational signals | Chapter 15 |
| Attention worthiness of notice | Chapter 16 |
| Stability window thresholds | FB-P8-024 |
| Personalization engines / cohort harnesses | Implementation |

---

## 3. Canonical Model

### 3.1 Terms (canonical)

| Term | Meaning |
|------|---------|
| **Personalization** | Lawful fit of presentation, defaults, and assistance timing to one person |
| **Adaptation** | Change in system fit based on context, preferences, or learned patterns |
| **Preference** | Explicit person-stated choice that overrides defaults and inferred habits |
| **Personal default** | Starting configuration — never a trap, never irreversible |
| **Learned fit** | Inferred patterns used to reduce friction of presentation and defaults — not to coerce and not to authorize action |
| **Hidden adaptation** | Material fit change the person cannot discover, explain, or override — forbidden |

### 3.2 Axiom

**Product identity is invariant. Personal fit is variable. Preference is sovereign over inference.**

Adaptation MAY change defaults, density, ordering, and assistance timing. Adaptation MUST NOT change what AIIMIN is, redefine life-entity meaning, create automated authority, or optimize engagement against the person. Material fit MUST be discoverable, explainable, stable, and overridable.

**Governance:** GOV-001, GOV-153, GOV-027, GOV-061, GOV-058, GOV-079, GOV-053

---

## 4. Canonical Rules

### §4.1 — Identity and preference

**P8-R-270** — Personalization MUST NOT change product identity (Chapter 01), redefine life-entity meaning or Outcome definitions, or fork those meanings via cohort or experiment-driven fit. Product-identity invariance remains Chapter 01 / Chapter 13; this rule applies it to personalization.

**Referenced GOV IDs:** GOV-001, GOV-040, GOV-153

---

**P8-R-271** — Explicit preferences MUST outrank inferred habits and system defaults.

**Referenced GOV IDs:** GOV-027, GOV-035

---

**P8-R-272** — Personal defaults MUST remain reversible and overridable. Defaults MUST NOT hostage configuration or personal-life-graph access.

**Referenced GOV IDs:** GOV-014, GOV-079

---

**P8-R-273** — Adaptation MUST be non-destructive: override, reset, and refuse of learned fit MUST remain available for exposed preferences without loss of export or delete rights.

**Referenced GOV IDs:** GOV-014, GOV-058, GOV-035

---

### §4.2 — Learned fit bounds

**P8-R-274** — Learned fit MUST serve declared user benefit (including tomorrow-lighter friction reduction). Silent override of explicit preferences is already forbidden by `P8-R-271`.

**Referenced GOV IDs:** GOV-061, GOV-035

---

**P8-R-275** — Learning and adaptation MUST NOT optimize engagement, retention theater, or addictive return against the person's interests. Personalized ordering MUST NOT disguise engagement optimization as care. Interruptive notice remains Chapter 16.

**Referenced GOV IDs:** GOV-079, GOV-026, GOV-009

---

**P8-R-276** — Adaptation MUST NOT treat observational inference as intimate authority over the person. Anti-surveillance dignity remains Chapter 02 (`P8-R-028`) and Chapter 15.

**Referenced GOV IDs:** GOV-058, GOV-031

---

**P8-R-277** — Learned fit MUST NOT create automated authority (Chapter 17). Personalization MUST NOT alter authorization scope, authentication, or billing (Chapters 15, 07 / `P8-R-122`).

**Referenced GOV IDs:** GOV-140, GOV-015, GOV-035

---

### §4.3 — Context, habits, stability

**P8-R-279** — Context awareness MAY shape timing and presentation of assistance. Context MUST NOT change verb meaning or life-entity meaning, and MUST NOT smuggle refused environment capabilities (Chapter 13).

**Referenced GOV IDs:** GOV-153, GOV-131, GOV-013

---

**P8-R-281** — Respect for habits MUST reduce re-entry friction. Habit memory MUST NOT become nag, streak coercion, or shame theater.

**Referenced GOV IDs:** GOV-061, GOV-049, GOV-009

---

**P8-R-282** — Relied-upon fit MUST remain stable and predictable enough that the person can anticipate it. Thrash without the person's cause is a failure mode. Numeric stability windows and disclosure thresholds remain FB-P8-024 — this rule freezes the stability obligation, not the cadence.

**Referenced GOV IDs:** GOV-061, GOV-030

---

### §4.4 — Visibility, setup, manipulation, non-regression

**P8-R-283** — Adaptation that changes assistance or defaults MUST NOT be hidden. The person MUST be able to obtain an explanation in human terms. Vague "AI magic" MUST NOT ship as explanation.

**Referenced GOV IDs:** GOV-053, GOV-058, GOV-132

---

**P8-R-284** — Infinite customization onboarding and picker proliferation MUST NOT ship as a required path. Daily essential actions MUST NOT be buried behind personalization setup debt.

**Referenced GOV IDs:** GOV-079, GOV-080, GOV-056, GOV-100, GOV-028

---

**P8-R-285** — Personalization MUST NOT use dark patterns, fake urgency, or social comparison to shape behavior. Clinical framing refuse remains Chapter 07 (`P8-R-122`).

**Referenced GOV IDs:** GOV-079, GOV-005, GOV-031

---

**P8-R-287** — Evolution of personalization controls in this chapter MUST NOT regress this chapter's preference sovereignty, override availability, or non-destructive adaptation obligations. Global ownership, export, delete, and anti-surveillance non-regression remain Chapter 15 (`P8-R-233`).

**Referenced GOV IDs:** GOV-014, GOV-058

---

## 5. Referenced GOV IDs

| GOV ID | Title | Status in P7 | Used in Ch 18 |
|--------|-------|--------------|---------------|
| GOV-001 | Personal Life OS | Approved | Yes |
| GOV-005 | Refuse social network / public feed | Approved | Yes |
| GOV-009 | Refuse gamification casino | Approved | Yes |
| GOV-013 | Phone web /m capture-only ceiling | Approved | Yes |
| GOV-014 | Export and delete always | Approved | Yes |
| GOV-015 | Destructive confirm | Approved | Yes |
| GOV-020 | One primitive, many surfaces | Approved | Yes |
| GOV-026 | Optimize / avoid matrix | Approved | Yes |
| GOV-027 | Intent over interface | Approved | Yes |
| GOV-028 | Capture first | Approved | Yes |
| GOV-030 | Emotional contract triad | Approved | Yes |
| GOV-031 | Emotional refuse list | Approved | Yes |
| GOV-033 | Interruptibility | Approved | Cross-ref |
| GOV-035 | Correctable inference | Approved | Yes |
| GOV-040 | Shared primitives | Approved | Yes |
| GOV-049 | Sparring over sycophancy | Approved | Yes |
| GOV-050 | No AI therapist | Approved | Yes |
| GOV-053 | No AI magic patronage | Approved | Yes |
| GOV-056 | Cognitive accessibility under load | Approved | Yes |
| GOV-058 | No surveillance feeling | Approved | Yes |
| GOV-061 | Tomorrow lighter | Approved | Yes |
| GOV-064 | Notifications deserve attention | Needs Discussion | Cross-ref |
| GOV-079 | No dark-pattern nags; no infinite customization onboarding | Approved | Yes |
| GOV-080 | Anti-picker proliferation | Approved | Yes |
| GOV-100 | Settings are a penalty box | Approved | Yes |
| GOV-131 | Consistency of verbs | Approved | Yes |
| GOV-132 | Latency honesty | Approved | Yes |
| GOV-140 | No auth/billing change without user | Approved | Yes |
| GOV-153 | Growth axiom | Approved | Yes |

---

## 6. Dependencies

| Direction | Chapter | Relationship |
|-----------|---------|--------------|
| Upstream | 01, 02, 13, 15, 16, 17 | Identity, philosophy, environments, privacy, attention, agency |
| Downstream | 19, 20 | Preference surfaces; first-run bounds |

---

## 7. Edge Cases

| Condition | Expected behavior |
|-----------|-------------------|
| Inferred theme locks out explicit preference | Violates P8-R-271 / P8-R-273 |
| Cohort renames verbs | Violates P8-R-270 / P8-R-279 |
| Required multi-step personalization before capture | Violates P8-R-284 |
| Habit streak as "personalization" | Violates P8-R-281 / P8-R-285 |
| Engagement-ranked care feed | Violates P8-R-275 |
| Material fit change with no discoverable reason | Violates P8-R-283 |
| Personalization expands billing | Violates P8-R-277 |
| Learned fit auto-commits a plan | Violates P8-R-277; Ch 17 |

---

## 8. Founder Decision Blocks

| ID | Issue | Why blocked |
|----|-------|-------------|
| FB-P8-024 | Stability windows / disclosure thresholds for relied-upon fit | Bound by P8-R-282 — obligation frozen; cadence not |

---

## 9. Acceptance Criteria

| ID | Criterion | Measure |
|----|-----------|---------|
| AC-01 | Retired `278`/`280`/`286`; no self-authored-meaning ontology | Grep |
| AC-02 | No personalization engine / cohort harness normative | Review |
| AC-03 | Ch 13/02/07/15/17 cited not redefined | Ownership PASS |
| AC-04 | FB-P8-024 bound, not invented | FB present |
| AC-05 | Status FROZEN; amendment requires Founder ADR | Header |

---

## Changelog

### 2026-07-23 — Freeze v1.0

- **What:** Founder Freeze Certificate. Status FROZEN. Immutable without Founder ADR.
- **Why:** Final Ratification PASS (integrity 91 / readiness 92).
- **Status:** shipped
- **Certificate:** `Batch_6_Freeze_Certificate.md`

### 2026-07-23 — Freeze-blocker resolution v0.4

- **What:** Remove ontology invention (`278`), Ch 13 restatement (`280`), hollow Ch 16 tautology (`286`); bind FB-024 on stability; scope identity/surveillance/auth/clinical to frozen chapters; chapter-local non-regression.
- **Why:** Final freeze-blocker pass after hostile audit.
- **Status:** draft

### 2026-07-23 — Constitutional compression v0.3

- **Status:** superseded by v0.4

### 2026-07-23 — Constitutional remediation v0.2

- **Status:** superseded

### 2026-07-22 — Batch 6 draft v0.1

- **Status:** superseded
