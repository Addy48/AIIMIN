# Chapter 20 — Onboarding & Identity Formation

| Field | Value |
|-------|-------|
| **Status** | FROZEN |
| **Version** | P8 v1.0 |
| **Chapter** | 20 — Onboarding & Identity Formation |
| **Subsystem** | Batch 7 — Continuity of Control (with Ch 19, Ch 21) |
| **Approval** | Founder Approved — Freeze Certificate 2026-07-23 |
| **Last Modified** | 2026-07-23 |
| **Supersedes** | P8 v0.3-patched |

This chapter is normative.

Any modification requires a Founder ADR.

```yaml
chapter: 20
title: Onboarding & Identity Formation
p8_version: P8 v1.0
status: FROZEN
authored: 2026-07-23
freeze_date: 2026-07-23
governance_source: P7 Governance v1.0 (FROZEN)
depends_on:
  - Chapter 01 — Product Identity (FROZEN v1.0)
  - Chapter 02 — Core Product Philosophy (FROZEN v1.0)
  - Chapter 05 — Core Objects & Data Model (FROZEN v1.0)
  - Chapter 06 — Capture System (FROZEN v1.0)
  - Chapter 15 — Privacy & Security (FROZEN v1.0)
  - Chapter 18 — Personalization & Adaptation (FROZEN v1.0)
  - Chapter 19 — Settings & Configuration (FROZEN v1.0)
architectural_question: "What must remain true of first-run formation and onboarding for as long as AIIMIN exists?"
```

---

## 1. Purpose

Define **formation law**: how a person first enters lawful participation; how initial preferences and consent are established; how trust is formed without coercion; how onboarding may complete, interrupt, recover, re-run, or evolve — while identity continuity of the personal life graph remains intact.

This chapter owns **formation of participation**. It MUST NOT own product identity (Chapter 01), life-entity ownership (Chapter 15), preference sovereignty doctrine (Chapter 18), or onboarding screens.

---

## 2. Scope

### Includes

- First-run principles
- Identity formation within frozen meaning
- Progressive depth vs core capability
- Initial preference establishment
- Consent during onboarding
- Trust formation
- Completion, interruption, recovery, re-onboarding
- Onboarding evolution and identity continuity
- Chapter-local non-regression
- Canonical rules `P8-R-306`…`P8-R-322`

### Excludes

| Topic | Owner |
|-------|-------|
| Product identity / brand | Chapter 01 |
| Life-entity ownership / export / delete | Chapter 15 |
| Preference sovereignty / learned fit | Chapter 18 |
| Configuration precedence / reset | Chapter 19 |
| Onboarding screen flows / copy | Implementation |
| Minimum completion checklist | FB-P8-026 |

---

## 3. Canonical Model

### 3.1 Terms (canonical)

| Term | Meaning |
|------|---------|
| **Onboarding** | The process of establishing lawful first participation and initial configuration/consent |
| **First-run** | The person's initial onboarding episode |
| **Identity formation** | Establishment of the person's self-description and participation posture within frozen life-entity and product-identity meaning — not creation of a new product identity |
| **Onboarding completion** | Knowable state that required formation obligations for the episode are satisfied |
| **Onboarding interruption** | Formation paused before completion |
| **Re-onboarding** | A later formation episode for the same person and personal life graph |
| **Identity continuity** | Same person, same personal life graph across formation states |

### 3.2 Axiom

**Onboarding forms participation. It does not seize ownership. It does not redefine AIIMIN.**

Capture remains available when the person is ready (Chapters 02, 06). Infinite required customization onboarding MUST NOT ship (GOV-079; Chapter 18). Consent remains purpose-clear and revocable (Chapter 15).

Minimum completion criteria: FB-P8-026.

**Governance:** GOV-079, GOV-028, GOV-158, GOV-014, GOV-001

---

## 4. Canonical Rules

### §4.1 — Formation posture

**P8-R-306** — Onboarding forms lawful participation. It MUST NOT transfer ownership of life entities away from the person (Chapter 15).

**Referenced GOV IDs:** GOV-014, GOV-001

---

**P8-R-307** — Onboarding MUST NOT change product identity or redefine life-entity meaning (Chapters 01, 05, 13).

**Referenced GOV IDs:** GOV-001, GOV-040

---

**P8-R-308** — First-run MUST NOT block Capture when the person is ready to admit life (Chapters 02, 06). Required formation MUST NOT become capture ceremony.

**Referenced GOV IDs:** GOV-028, GOV-066

---

**P8-R-309** — Infinite customization onboarding MUST NOT ship as a required path (GOV-079; Chapter 18 `P8-R-284`).

**Referenced GOV IDs:** GOV-079, GOV-080, GOV-056

---

### §4.2 — Progressive formation and preferences

**P8-R-310** — Formation MUST prefer progressive depth: core capability first; optional depth later. Depth MUST NOT be mandatory ceremony for first lawful participation.

**Referenced GOV IDs:** GOV-032, GOV-056

---

**P8-R-311** — Initial preferences established in onboarding are preferences under Chapter 18. They MUST remain overridable.

**Referenced GOV IDs:** GOV-027, GOV-035

---

**P8-R-312** — Identity formation MAY record the person's self-description only within frozen life-entity and product-identity meaning. It MUST NOT invent a parallel identity ontology.

**Referenced GOV IDs:** GOV-001, GOV-040

---

### §4.3 — Consent and trust

**P8-R-313** — Consent collected during onboarding MUST be purpose-clear, opt-in where required, and revocable (Chapter 15). Consent by coercion or deception is void.

**Referenced GOV IDs:** GOV-158, GOV-058

---

**P8-R-314** — Trust formation MUST NOT use deception, fake urgency, dark patterns, or engagement hostage (Chapters 02, 16, 18).

**Referenced GOV IDs:** GOV-079, GOV-031

---

**P8-R-315** — Onboarding MUST NOT require clinical framing or social comparison as a condition of participation (Chapters 07, 02).

**Referenced GOV IDs:** GOV-050, GOV-005

---

### §4.4 — Completion, interruption, recovery, re-onboarding

**P8-R-316** — Onboarding completion MUST be knowable. Incomplete formation MUST NOT be presented as complete.

**Referenced GOV IDs:** GOV-132, GOV-089

---

**P8-R-317** — Onboarding MUST be interruptible. Interrupted formation MUST remain resumable or safely restartable without silent loss of already-admitted life entities.

**Referenced GOV IDs:** GOV-028, GOV-015

---

**P8-R-318** — Re-onboarding MUST preserve identity continuity of the personal life graph. Re-onboarding MUST NOT create a second life graph or erase the first by default.

**Referenced GOV IDs:** GOV-040, GOV-014

---

**P8-R-319** — Abandoned onboarding MUST offer recovery: resume or restart with honest disclosure of what is kept and what is reset.

**Referenced GOV IDs:** GOV-132, GOV-035

---

### §4.5 — Continuity, authority, evolution

**P8-R-320** — Across first-run, interruption, completion, and re-onboarding, the person and personal life graph MUST remain continuous. Formation state MUST NOT fork identity.

**Referenced GOV IDs:** GOV-001, GOV-040

---

**P8-R-321** — Onboarding MUST NOT expand authorization, authentication, or billing beyond declared purpose and explicit assent (Chapters 15, 07).

**Referenced GOV IDs:** GOV-140, GOV-015

---

**P8-R-322** — Evolution of onboarding controls in this chapter MUST NOT regress interruptibility of formation, consent revocability, capture-first availability, or identity continuity. Global ownership, export, delete, and anti-surveillance non-regression remain Chapter 15 (`P8-R-233`). Minimum completion criteria remain FB-P8-026.

**Referenced GOV IDs:** GOV-014, GOV-058, GOV-079

---

## 5. Referenced GOV IDs

| GOV ID | Title | Status in P7 | Used in Ch 20 |
|--------|-------|--------------|---------------|
| GOV-001 | Personal Life OS | Approved | Yes |
| GOV-005 | Refuse social network / public feed | Approved | Yes |
| GOV-014 | Export and delete always | Approved | Yes |
| GOV-015 | Destructive confirm | Approved | Yes |
| GOV-027 | Intent over interface | Approved | Yes |
| GOV-028 | Capture first | Approved | Yes |
| GOV-031 | Emotional refuse list | Approved | Yes |
| GOV-032 | Progressive disclosure by stakes | Approved | Yes |
| GOV-035 | Correctable inference | Approved | Yes |
| GOV-040 | Shared primitives | Approved | Yes |
| GOV-050 | No AI therapist | Approved | Yes |
| GOV-056 | Cognitive accessibility under load | Approved | Yes |
| GOV-058 | No surveillance feeling | Approved | Yes |
| GOV-066 | Ceremony-free save | Approved | Yes |
| GOV-079 | No infinite customization onboarding | Approved | Yes |
| GOV-080 | Anti-picker proliferation | Approved | Yes |
| GOV-089 | No silent failed sync as success | Approved | Yes |
| GOV-132 | Latency honesty | Approved | Yes |
| GOV-140 | No auth/billing change without user | Approved | Yes |
| GOV-158 | Ambient / non-explicit consent | Approved | Yes |

---

## 6. Dependencies

| Direction | Chapter | Relationship |
|-----------|---------|--------------|
| Upstream | 01, 05, 06, 15, 18 | Identity, entities, capture, ownership, preference |
| Upstream | 19 | Initial settings establishment |
| Downstream | 21 | Extensions MUST NOT hijack first-run |

---

## 7. Edge Cases

| Condition | Expected behavior |
|-----------|-------------------|
| Required 20-step setup before first capture | Violates P8-R-308 / P8-R-309 |
| Re-onboarding creates second life graph | Violates P8-R-318 / P8-R-320 |
| Incomplete onboarding shown as done | Violates P8-R-316 |
| Consent buried as pre-checked engagement opt-in | Violates P8-R-313 / P8-R-314 |
| Restart deletes journal without disclosure | Violates P8-R-319 / P8-R-306 |

---

## 8. Founder Decision Blocks

| ID | Issue | Why blocked |
|----|-------|-------------|
| FB-P8-026 | Minimum onboarding completion criteria | Multiple valid architectures; obligation to be knowable is frozen in `P8-R-316` |

---

## 9. Acceptance Criteria

| ID | Criterion | Measure |
|----|-----------|---------|
| AC-01 | Rules `P8-R-306`…`322` sequential | Grep count = 17 |
| AC-02 | No screen-flow / copy normative | Review |
| AC-03 | Ownership / identity cited from Ch 01/15, not redefined | Conflict PASS |
| AC-04 | Status is FROZEN | Header |

---

## Internal Notes

- “Identity formation” is participation posture + self-description within frozen ontology — not a rival to Chapter 01 product identity.
- Completion criteria stay Founder-open (FB-P8-026).

---

## Changelog

### 2026-07-23 — Official freeze (P8 v1.0)

- **What:** Batch 7 Continuity of Control frozen. Certificate issued.
- **Why:** Founder Final Ratification PASS.
- **Status:** frozen

### 2026-07-23 — Batch 7 draft v0.1

- **What:** Initial draft Chapter 20. Rules P8-R-306…322.
- **Why:** Begin Batch 7 — Continuity of Control.
- **Status:** draft
