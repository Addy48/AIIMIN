# Chapter 17 — Intelligence & Automation

| Field | Value |
|-------|-------|
| **Status** | FROZEN |
| **Version** | P8 v1.0 |
| **Chapter** | 17 — Intelligence & Automation |
| **Subsystem** | Batch 6 — Agency & Adaptation (with Ch 16, Ch 17, Ch 18) |
| **Approval** | Founder Approved — Freeze Certificate 2026-07-23 |
| **Last Modified** | 2026-07-23 |
| **Supersedes** | P8 v0.4-freeze-blocker |

This chapter is normative.

Any modification requires a Founder ADR.

```yaml
chapter: 17
title: Intelligence & Automation
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
  - Chapter 07 — AI Architecture (FROZEN v1.0)
  - Chapter 09 — Interaction System (FROZEN v1.0)
  - Chapter 15 — Privacy & Security (FROZEN v1.0)
  - Chapter 16 — Notification System (FROZEN v1.0)
architectural_question: "What must remain true of automation, human authority, and machine initiative for as long as AIIMIN exists?"
```

---

## 1. Purpose

Define **agency law**: where automation may assist; where only the person may decide; how suggestion differs from action; what approval, delegation, reversibility, transparency, prediction, and restraint require; and which autonomous behavior is forever forbidden.

This chapter owns **whether the system may act on the personal life graph**. It MUST NOT own how intelligence reasons (Chapter 07), interaction grammar (Chapter 09), attention worthiness (Chapter 16), or fit personalization (Chapter 18).

---

## 2. Scope

### Includes

- Human authority over automated effect
- Suggestion vs automated action
- Initiative bounds
- Approval, delegation, autonomy
- Execution boundaries (purpose, authorization, prediction≠permission)
- Reversibility, transparency, inspectability
- Prediction philosophy
- Failure handling, Hand-back, anti-coercion
- Non-regression of agency guarantees
- Canonical rules `P8-R-252`…`P8-R-256`, `P8-R-258`…`P8-R-269` (`P8-R-257` retired)

### Excludes

| Topic | Owner |
|-------|-------|
| AI roles, confidence bands, orchestration | Chapter 07 |
| Offer / Adjust / Settle / Veil grammar | Chapter 09 |
| Authorization expansion without grant | Chapter 15 — `P8-R-230` |
| Interruptive notice law | Chapter 16 |
| Preference sovereignty and fit adaptation | Chapter 18 |
| Model providers, schedulers | Implementation |
| Standing-delegation class list | FB-P8-023 |
| Private-data execution locus | FB-P8-019 (Chapter 15) |

---

## 3. Canonical Model

### 3.1 Terms (canonical)

| Term | Meaning |
|------|---------|
| **Suggestion** | Proposed structure, plan, or action that does not alter durable life-entity state until the person accepts |
| **Automated action** | System-initiated durable change to life entities, permissions, finances, privacy scope, or external commitments |
| **Human authority** | The person remains final decision-maker over life entities and high-stakes commitments |
| **Delegation** | Explicit human grant allowing a bounded class of automated actions |
| **Approval** | Explicit human assent for a specific automated action or standing delegation |
| **Reversibility** | Capacity to undo or correct an automated effect without hostage outcomes |
| **Transparency** | The person can know that automation acted or proposed, and on what basis in human terms |
| **Inspectability** | The person can know what is currently delegated and within what bounds |
| **Autonomous behavior** | Automated action without per-act approval — lawful only inside explicit delegation |
| **Hand-back** | *(Chapter 09 interaction verb — recovery after recoverable Settle. Not redefined here.)* |
| **Return of control** | When automation cannot proceed lawfully, the person resumes authority over the next act |

### 3.2 Axiom

**The person remains authority over life entities (Chapter 15). Automation remains assistant — never sovereign.**

Suggestions do not write durable state until accepted. Irreversible and high-stakes acts require approval or elevated assurance per Chapter 15. Delegation is explicit, purpose-bound, revocable, and inspectable. Which classes may receive standing delegation: FB-P8-023. Prediction does not create permission. Uncertainty fails closed. Failure is not success. When automation cannot proceed lawfully, control returns to the person.

**Governance:** GOV-035, GOV-051, GOV-136, GOV-140, GOV-015, GOV-128, GOV-053

---

## 4. Canonical Rules

### §4.1 — Authority and execution

**P8-R-252** — Automation remains subject to the person's authority over life entities (Chapter 15). Automation MUST remain assistant — never sovereign over the personal life graph. This rule applies that authority to automation; it MUST NOT redefine Chapter 15.

**Referenced GOV IDs:** GOV-136, GOV-035

---

**P8-R-253** — Automation MUST operate only within declared product purpose and granted authorization scope.

**Referenced GOV IDs:** GOV-140, GOV-023

---

**P8-R-254** — Prediction, inference, and usage patterns MUST NOT create permission or authorization.

**Referenced GOV IDs:** GOV-140, GOV-158

---

### §4.2 — Suggestion vs action

**P8-R-255** — Suggestions — including planning and coaching proposals — MUST NOT alter durable life-entity state until the person accepts. Suggestions MUST remain dismissible without penalty. Auto-commit of life plans MUST NOT ship. Partial acceptance and correction MUST remain available where structure was proposed.

**Referenced GOV IDs:** GOV-136, GOV-035, GOV-126

---

**P8-R-256** — Automated actions that irreversibly alter life entities, finances, privacy scope, or principal identity MUST require approval or elevated assurance before execution (Chapter 15). Authentication and billing changes remain bound by Chapter 07 (`P8-R-122`) and Chapter 15 — automation MUST NOT bypass them.

**Referenced GOV IDs:** GOV-015, GOV-046, GOV-140

---

### §4.3 — Delegation and autonomy

**P8-R-258** — Delegation of automated action MUST be explicit, purpose-bound, and revocable. Implied consent from usage patterns MUST NOT create delegation.

**Referenced GOV IDs:** GOV-140, GOV-158

---

**P8-R-259** — Autonomous behavior MUST NOT occur outside an explicit bounded delegation. Learning that drives automated action MUST NOT create authority beyond that delegation. Which action classes may receive standing delegation remains FB-P8-023 — this rule freezes the explicit-bound requirement, not the class list.

**Referenced GOV IDs:** GOV-140, GOV-015, GOV-061

---

**P8-R-260** — Standing delegation MUST be inspectable: the person MUST be able to know what is delegated and within what bounds.

**Referenced GOV IDs:** GOV-053, GOV-132

---

**P8-R-261** — Automation MUST NOT automatically post or publish private life.

**Referenced GOV IDs:** GOV-078, GOV-011

---

### §4.4 — Reversibility, transparency, prediction

**P8-R-262** — Recoverable automated effects MUST offer undo or correction. Silent wrong automation without a correction path remains forbidden (`P8-R-037`). This rule applies that guarantee to automated effects; it MUST NOT redefine Chapter 02.

**Referenced GOV IDs:** GOV-035, GOV-051, GOV-128

---

**P8-R-263** — When automation acts or proposes, the person MUST be able to know that it did, and receive an explanation in human terms. Vague "AI magic" patronage MUST NOT ship.

**Referenced GOV IDs:** GOV-053, GOV-132

---

**P8-R-264** — Prediction MAY inform suggestions. Prediction MUST NOT invent life-graph facts the person did not provide, infer high-sensitivity meanings, or authorize irreversible acts.

**Referenced GOV IDs:** GOV-082, GOV-070, GOV-015, GOV-035

---

### §4.5 — Failure, return of control, non-regression

**P8-R-265** — Automation failure or pending state MUST NOT be presented as success.

**Referenced GOV IDs:** GOV-089, GOV-132

---

**P8-R-266** — Under uncertainty that would risk silent wrong durable write, automation MUST fail closed to suggestion or ask — not silent commit.

**Referenced GOV IDs:** GOV-035, GOV-048, GOV-137

---

**P8-R-267** — When automation cannot proceed lawfully, control MUST return to the person. This MUST NOT redefine Chapter 09 **Hand-back** (recovery after recoverable Settle).

**Referenced GOV IDs:** GOV-035, GOV-022

---

**P8-R-268** — Automation MUST NOT escalate interruption to cover failure or to coerce assent. Attention law remains Chapter 16.

**Referenced GOV IDs:** GOV-033, GOV-079, GOV-064

---

**P8-R-269** — Evolution of automation controls in this chapter MUST NOT regress this chapter's assistant bounds, dismissibility of suggestions, reversibility of recoverable effects, inspectability of delegation, or fail-closed uncertainty handling. Global ownership, export, delete, and anti-surveillance non-regression remain Chapter 15 (`P8-R-233`).

**Referenced GOV IDs:** GOV-035, GOV-140, GOV-128

---

## 5. Referenced GOV IDs

| GOV ID | Title | Status in P7 | Used in Ch 17 |
|--------|-------|--------------|---------------|
| GOV-011 | Refuse sell/share lifelog | Approved | Yes |
| GOV-015 | Destructive actions must confirm | Approved | Yes |
| GOV-022 | Official failure triggers | Approved | Yes |
| GOV-023 | Feature must justify human problem | Approved | Yes |
| GOV-033 | Interruptibility; no JITAI nag | Approved | Yes |
| GOV-035 | Correctable inference | Approved | Yes |
| GOV-046 | Destructive confirm all platforms | Approved | Yes |
| GOV-048 | Confidence bands gate action | Needs Discussion | Cross-ref Ch 07 |
| GOV-051 | Inference must be correctable | Approved | Yes |
| GOV-053 | No AI magic patronage | Approved | Yes |
| GOV-061 | Tomorrow lighter | Approved | Yes |
| GOV-064 | Notifications deserve attention | Needs Discussion | Anti-coercion cross-ref |
| GOV-070 | Safety fields never infer | Approved | Yes |
| GOV-078 | No automatic posting of private life | Approved | Yes |
| GOV-079 | No dark-pattern nags | Approved | Yes |
| GOV-082 | No invented finance without utterance | Approved | Generalized |
| GOV-088 | No mid-Focus coaching modals | Approved | Yes |
| GOV-089 | No silent failed sync as success | Approved | Yes |
| GOV-126 | Infer then chip | Approved | Yes |
| GOV-128 | Undo over fear | Approved | Yes |
| GOV-132 | Latency honesty | Approved | Yes |
| GOV-136 | Mixed-initiative layer | Approved | Yes |
| GOV-137 | Confidence band thresholds | Needs Discussion | Cross-ref Ch 07 |
| GOV-140 | No auth/billing change without user | Approved | Yes |
| GOV-141 | Coaching when interruptibility open | Approved | Yes |
| GOV-158 | Ambient / non-explicit consent | Approved | Yes |

---

## 6. Dependencies

| Direction | Chapter | Relationship |
|-----------|---------|--------------|
| Upstream | 05, 07, 09, 15, 16 | Entities, intelligence, interaction, authz, attention |
| Downstream | 18 | Learned fit MUST NOT create automated authority |

---

## 7. Edge Cases

| Condition | Expected behavior |
|-----------|-------------------|
| Auto-commit life plan | Violates P8-R-255 |
| Usage pattern as billing consent | Violates P8-R-254 / P8-R-256 / P8-R-258 |
| Prediction invents finance event | Violates P8-R-264 |
| Automation fails; UI shows success | Violates P8-R-265 |
| Low-certainty silent durable write | Violates P8-R-266 |
| Autonomous act with no standing grant | Violates P8-R-259 |
| Interruption escalated to force approval | Violates P8-R-268 |
| Delegation exists but bounds unknowable | Violates P8-R-260 |

---

## 8. Founder Decision Blocks

| ID | Issue | Why blocked |
|----|-------|-------------|
| FB-P8-023 | Standing-delegation automation classes | Bound by P8-R-259 — explicit-bound requirement frozen; class list not |
| FB-P8-019 | AI execution boundary for private data | Owned with Chapter 15 — not resolved here |

---

## 9. Acceptance Criteria

| ID | Criterion | Measure |
|----|-----------|---------|
| AC-01 | Rules present; `P8-R-257` absent; no Hand-back overload | Grep + review |
| AC-02 | No model vendor / scheduler normative | Review |
| AC-03 | Authority / silent-wrong / auth-billing cite frozen chapters | Conflict PASS |
| AC-04 | FB-P8-023 bound, not invented | FB present |
| AC-05 | Status FROZEN; amendment requires Founder ADR | Header |

---

## Changelog

### 2026-07-23 — Freeze v1.0

- **What:** Founder Freeze Certificate. Status FROZEN. Immutable without Founder ADR.
- **Why:** Final Ratification PASS (integrity 91 / readiness 92).
- **Status:** shipped
- **Certificate:** `Batch_6_Freeze_Certificate.md`

### 2026-07-23 — Freeze-blocker resolution v0.4

- **What:** Authority scoped to Ch 15; auth/billing cite Ch 07/15; remove hollow `P8-R-257`; FB-023 bind on autonomy; silent-wrong cites `P8-R-037`; Hand-back overload fixed (return of control); chapter-local non-regression.
- **Why:** Final freeze-blocker pass after hostile audit.
- **Status:** draft

### 2026-07-23 — Constitutional compression v0.3

- **Status:** superseded by v0.4

### 2026-07-23 — Constitutional remediation v0.2

- **Status:** superseded

### 2026-07-22 — Batch 6 draft v0.1

- **Status:** superseded
