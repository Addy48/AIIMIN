# Chapter 16 — Notification System

| Field | Value |
|-------|-------|
| **Status** | FROZEN |
| **Version** | P8 v1.0 |
| **Chapter** | 16 — Notification System |
| **Subsystem** | Batch 6 — Agency & Adaptation (with Ch 16, Ch 17, Ch 18) |
| **Approval** | Founder Approved — Freeze Certificate 2026-07-23 |
| **Last Modified** | 2026-07-23 |
| **Supersedes** | P8 v0.4-freeze-blocker |

This chapter is normative.

Any modification requires a Founder ADR.

```yaml
chapter: 16
title: Notification System
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
  - Chapter 07 — AI Architecture (FROZEN v1.0)
  - Chapter 09 — Interaction System (FROZEN v1.0)
  - Chapter 13 — Platform Specifications (FROZEN v1.0)
  - Chapter 15 — Privacy & Security (FROZEN v1.0)
architectural_question: "What must remain true of interruption, attention, and notice for as long as AIIMIN exists?"
```

---

## 1. Purpose

Define **attention law**: when the system may claim attention; how urgency is justified; how notice may remain silent, deferred, digested, escalated, dismissed, or persistent; who owns attention; and which uses of interruption are forever forbidden.

This chapter owns **whether and why attention may be claimed**. It MUST NOT own delivery media, vendors, templates, Knock/Offer/Dismiss grammar (Chapter 09), coaching eligibility (Chapter 07), automation authority (Chapter 17), or preference surfaces (Chapter 19).

---

## 2. Scope

### Includes

- Attention stewardship and interruption worthiness
- Interruptiveness hierarchy
- Urgency philosophy
- Silent communication, deferral, digest
- Escalation, dismissal, persistence
- Suppressibility and anti-hostage
- Notice honesty and meaning invariance
- Anti-manipulation and anti-engagement
- Non-regression of attention guarantees
- Canonical rules `P8-R-234`…`P8-R-245`, `P8-R-247`…`P8-R-251`, `P8-R-288` (`P8-R-246` retired — Ch 13 owns meaning invariance)

### Excludes

| Topic | Owner |
|-------|-------|
| Knock / Offer / Dismiss / Veil grammar | Chapter 09 |
| Coaching when interruptibility is open | Chapter 07 |
| Suggestion vs automated action | Chapter 17 |
| Mute surface layout | Chapter 19 — Settings (pending) |
| Life-entity ownership; private-reflection observation | Chapter 15 |
| Delivery media, vendors, templates | Implementation |
| Attention-worthiness taxonomy | FB-P8-021 |
| Concrete escalation ladders | FB-P8-022 |

---

## 3. Canonical Model

### 3.1 Terms (canonical)

| Term | Meaning |
|------|---------|
| **Notice** | Any system claim on the person's attention about personal-life-graph state, obligation, failure, or opportunity — interruptive or not |
| **Interruption** | A notice that demands attention now, displacing current focus |
| **Silent communication** | State made knowable without claiming interruptive attention |
| **Deferred attention** | Notice held until interruptibility is open or the person elects review |
| **Digest** | Batched, calm summary of deferred or low-urgency notices |
| **Escalation** | Lawful increase of interruptiveness after quieter modes were insufficient for real stakes |
| **Dismissal** | The person ends a notice's present claim on attention |
| **Persistence** | The underlying matter remains available for elected review without re-interrupting by default |
| **Attention stewardship** | AIIMIN may claim attention only as steward for Capture, Connect, Coach — never as proprietor of attention |
| **Suppressibility** | The person may refuse ordinary interruptive notice classes without losing core Life OS capability |
| **Non-suppressible notice** | Interruptive notice required to protect trust integrity or to prevent irreversible harm to the person's stated commitments — ordinary mute MUST NOT extinguish it |

Presentation medium is not a constitutional category. The same laws bind every present and future medium.

### 3.2 Axioms

**AIIMIN is steward of interruption — not proprietor of attention, not hunter of engagement.**

Every interruption MUST deserve the attention it claims and serve at least one existence outcome. Class lists and numeric thresholds for worthiness remain FB-P8-021 (GOV-064 Needs Discussion) — the obligation to deserve attention is not deferred. Lower interruptiveness MUST be preferred when it suffices. Urgency is consequence to life obligations or trust integrity — never product metrics.

While interruptibility is closed, interruptive notice MUST NOT enter. Escalation requires real stakes and quieter insufficiency — never engagement recovery. Dismissal ends the claim without penalty. Persistence is not license to re-interrupt by default.

Ordinary interruptive notice is suppressible. Notice required to protect trust integrity or to prevent irreversible harm to stated commitments is not extinguishable by ordinary mute. Which concrete classes fall where: FB-P8-021 / FB-P8-022.

**Governance:** GOV-064, GOV-033, GOV-026, GOV-004, GOV-029, GOV-079, GOV-083, GOV-153

---

## 4. Canonical Rules

### §4.1 — Stewardship and urgency

**P8-R-234** — Every interruption MUST deserve the attention it claims and MUST serve at least one existence outcome (Capture, Connect, or Coach). Notices that fail either requirement MUST NOT ship as interruptions. Concrete worthiness classes and thresholds remain FB-P8-021; this rule freezes the obligation, not the taxonomy.

**Referenced GOV IDs:** GOV-064, GOV-033, GOV-004

---

**P8-R-235** — AIIMIN is steward of notice — not proprietor of the person's attention. Stewardship of interruption MUST NOT be confused with ownership of life entities (Chapter 15).

**Referenced GOV IDs:** GOV-064, GOV-030

---

**P8-R-236** — Urgency MUST reflect consequence to the person's life obligations or trust integrity. Urgency MUST NOT be manufactured from streak pressure, vanity metrics, or growth theater.

**Referenced GOV IDs:** GOV-064, GOV-022, GOV-009

---

### §4.2 — Hierarchy and modes

**P8-R-237** — When silent, deferred, or digest modes suffice, interruptive notice MUST NOT be used.

**Referenced GOV IDs:** GOV-033, GOV-029, GOV-123

---

**P8-R-238** — Silent communication of state MUST be a lawful first-class mode of notice.

**Referenced GOV IDs:** GOV-029, GOV-132

---

**P8-R-239** — Digest MUST remain calm summary communication and MUST NOT demand input as interrogation.

**Referenced GOV IDs:** GOV-029, GOV-149

---

**P8-R-240** — Interruptive notice MUST NOT enter while interruptibility is closed. Deferrable notice MUST wait for open interruptibility or the person's elected review.

**Referenced GOV IDs:** GOV-033, GOV-088, GOV-141

---

### §4.3 — Escalation, dismissal, persistence

**P8-R-241** — Escalation of interruptiveness MUST require real stakes and prior quieter insufficiency (or stakes quieter modes cannot serve). Escalation MUST NOT serve habit formation or engagement recovery.

**Referenced GOV IDs:** GOV-064, GOV-033, GOV-079

---

**P8-R-242** — Dismissal MUST end the present attention claim without penalty and MUST NOT be followed by dark-pattern re-prompt in the same attention episode.

**Referenced GOV IDs:** GOV-079, GOV-030

---

**P8-R-243** — After dismissal or deferral, the underlying matter MUST remain available for elected review and MUST NOT re-interrupt by default.

**Referenced GOV IDs:** GOV-033, GOV-128

---

### §4.4 — Anti-manipulation, honesty, meaning

**P8-R-244** — Interruptive notice MUST NOT be designed, ranked, or timed (including volume over time) to optimize engagement, retention theater, or addictive return. Product-level nag-loop refusal remains Chapter 02 (`P8-R-034`).

**Referenced GOV IDs:** GOV-079, GOV-026, GOV-009

---

**P8-R-245** — Private reflection body MUST NEVER appear in interruptive notice, regardless of medium. Custody and observation limits for private reflection remain Chapter 15.

**Referenced GOV IDs:** GOV-083, GOV-016

---

**P8-R-247** — Interruptive notice MUST NOT use coercion, deception, fake urgency, or surveillance framing to obtain compliance.

**Referenced GOV IDs:** GOV-058, GOV-079, GOV-031

---

**P8-R-248** — What a notice asserts about personal-life-graph state or obligation MUST be honest. False claim MUST NOT be used to force attention.

**Referenced GOV IDs:** GOV-064, GOV-022, GOV-058

---

### §4.5 — Suppressibility, precedence, non-regression

**P8-R-249** — The person MUST be able to refuse ordinary classes of interruptive notice without losing Capture, Connect, or Coach core capability.

**Referenced GOV IDs:** GOV-064, GOV-004, GOV-014

---

**P8-R-250** — Interruptive notice MUST NOT require immediate response as a condition of preserving the person's rights, data, or core capability.

**Referenced GOV IDs:** GOV-079, GOV-014, GOV-031

---

**P8-R-251** — Ordinary suppressibility MUST NOT extinguish interruptive notice required to protect trust integrity or to prevent irreversible harm to the person's stated commitments. Which concrete classes are ordinary vs non-suppressible remains FB-P8-021 / FB-P8-022 — this rule freezes precedence, not the class list.

**Referenced GOV IDs:** GOV-064, GOV-022, GOV-033

---

**P8-R-288** — Evolution of notice controls in this chapter MUST NOT regress this chapter's attention stewardship, dismissibility, ordinary suppressibility, non-suppressible precedence, private-reflection exclusion from interruptive notice, or anti-engagement obligations. Global ownership, export, delete, and anti-surveillance non-regression remain Chapter 15 (`P8-R-233`).

**Referenced GOV IDs:** GOV-064, GOV-083

---

## 5. Referenced GOV IDs

| GOV ID | Title | Status in P7 | Used in Ch 16 |
|--------|-------|--------------|---------------|
| GOV-004 | Three existence outcomes | Approved | Yes |
| GOV-009 | Refuse gamification casino | Approved | Yes |
| GOV-014 | Export and delete always | Approved | Yes |
| GOV-016 | Journal body out of analytics | Approved | Cross-ref |
| GOV-022 | Official failure triggers | Approved | Yes |
| GOV-026 | Optimize / avoid matrix | Approved | Yes |
| GOV-029 | Read surfaces stay calm | Approved | Yes |
| GOV-030 | Emotional contract triad | Approved | Yes |
| GOV-031 | Emotional refuse list | Approved | Yes |
| GOV-033 | Interruptibility; no JITAI nag loops | Approved | Yes |
| GOV-034 | Compression as craft | Approved | Yes |
| GOV-040 | Shared primitives | Approved | Yes |
| GOV-058 | No surveillance feeling | Approved | Yes |
| GOV-064 | Every notification must deserve attention | Needs Discussion | Obligation; taxonomy FB-P8-021 |
| GOV-079 | No dark-pattern upgrade nags | Approved | Yes |
| GOV-083 | Journal body never in push notifications | Approved | Generalized to all media |
| GOV-088 | No mid-Focus coaching modals | Approved | Yes |
| GOV-123 | Reduce decisions | Approved | Yes |
| GOV-128 | Undo over fear | Approved | Yes |
| GOV-131 | Consistency of verbs | Approved | Yes |
| GOV-132 | Latency honesty | Approved | Yes |
| GOV-141 | Coaching when interruptibility open | Approved | Yes |
| GOV-149 | Read components stay calm | Approved | Yes |
| GOV-153 | Growth axiom / environment identity | Approved | Yes |

---

## 6. Dependencies

| Direction | Chapter | Relationship |
|-----------|---------|--------------|
| Upstream | 02, 07, 09, 13, 15 | Philosophy, coaching gate, interaction forms, environments, privacy |
| Downstream | 17, 18, 19 | Automation must not abuse interruption; personalized notice still bound; suppressibility surfaces |

---

## 7. Edge Cases

| Condition | Expected behavior |
|-----------|-------------------|
| Low-value tip as interruption | Violates P8-R-234 / P8-R-237 |
| Interruptive notice while interruptibility closed | Violates P8-R-240 |
| Private reflection body in any interruptive medium | Violates P8-R-245 |
| Dismissed notice re-interrupts by default | Violates P8-R-242 / P8-R-243 |
| Engagement ranking or high-frequency nag | Violates P8-R-244 |
| False urgency to force a tap | Violates P8-R-247 / P8-R-248 |
| Mute class disables Capture | Violates P8-R-249 |
| Ordinary mute extinguishes trust-integrity / irreversible-harm notice | Violates P8-R-251 |
| Rights held hostage until notice answered | Violates P8-R-250 |

---

## 8. Founder Decision Blocks

| ID | Issue | Why blocked |
|----|-------|-------------|
| FB-P8-021 | Attention-worthiness classes / thresholds (GOV-064 ND) | Bound by P8-R-234 — obligation frozen; taxonomy not |
| FB-P8-022 | Escalation ladder; ordinary vs non-suppressible class assignment | Bound by P8-R-241 / P8-R-251 — precedence frozen; class list not |

---

## 9. Acceptance Criteria

| ID | Criterion | Measure |
|----|-----------|---------|
| AC-01 | Rules `P8-R-234`…`251` + `288` present; no undefined bar frozen as taxonomy | Grep + review |
| AC-02 | No delivery vendor / medium category normative | Review |
| AC-03 | Mute vs non-suppressible precedence explicit (`P8-R-251`) | Review |
| AC-04 | Non-regression chapter-local (`P8-R-288`); cites `P8-R-233` | Review |
| AC-05 | Status FROZEN; amendment requires Founder ADR | Header |

---

## Changelog

### 2026-07-23 — Freeze v1.0

- **What:** Founder Freeze Certificate. Status FROZEN. Immutable without Founder ADR.
- **Why:** Final Ratification PASS (integrity 91 / readiness 92).
- **Status:** shipped
- **Certificate:** `Batch_6_Freeze_Certificate.md`

### 2026-07-23 — Freeze-blocker resolution v0.4

- **What:** Resolved undefined bar (bind FB-021); attention stewardship vocabulary; mute vs non-suppressible precedence (`P8-R-251`); chapter-local non-regression (`P8-R-288`); drop nag restatement of `P8-R-034`; retire hollow Ch 13 restatement (`P8-R-246`).
- **Why:** Final freeze-blocker pass after hostile audit.
- **Status:** draft

### 2026-07-23 — Constitutional compression v0.3

- **What:** Compressed to 18 rules.
- **Status:** superseded by v0.4

### 2026-07-23 — Constitutional remediation v0.2

- **Status:** superseded

### 2026-07-22 — Batch 6 draft v0.1

- **Status:** superseded
