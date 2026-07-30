# Chapter 15 — Privacy & Security

| Field | Value |
|-------|-------|
| **Status** | FROZEN |
| **Version** | P8 v1.0 |
| **Chapter** | 15 — Privacy & Security |
| **Subsystem** | Batch 5 — Continuity & Trust (with Ch 13, Ch 14) |
| **Approval** | Founder Approved — Freeze Certificate 2026-07-22 |
| **Last Modified** | 2026-07-22 |
| **Supersedes** | P8 v0.5-remediation |

This chapter is normative.

Any modification requires a Founder ADR.

```yaml
chapter: 15
title: Privacy & Security
p8_version: P8 v1.0
status: FROZEN
authored: 2026-07-22
governance_source: P7 Governance v1.0 (FROZEN)
depends_on:
  - Chapter 01 — Product Identity (FROZEN v1.0)
  - Chapter 02 — Core Product Philosophy (FROZEN v1.0)
  - Chapter 05 — Core Objects & Data Model (FROZEN v1.0)
  - Chapter 07 — AI Architecture (FROZEN v1.0)
  - Chapter 09 — Interaction System (FROZEN v1.0)
architectural_question: "What must remain true of ownership, authority, confidentiality, and dignity for as long as AIIMIN exists?"
```

---

## 1. Purpose

Define **trust law**: ownership of life entities in the personal life graph; privacy and security boundaries; authentication and authorization philosophy; confidentiality obligation; minimization and purpose limitation; consent for non-explicit collection; limits on sensitive inference; isolation of external parties; portability; deletion; non-regression of guarantees.

This chapter owns **who the personal life graph is for** and **what the system may never do with it**. It MUST NOT own cryptographic methods, identity vendors, transports, compliance theater, or clinical-framing detail beyond privacy bounds (Chapter 07).

Anti-surveillance product philosophy remains Chapter 02 (`P8-R-028`). This chapter owns privacy/security operationalization of dignity and non-regression.

---

## 2. Scope

### Includes

- Ownership and stewardship of the personal life graph
- Privacy vs security roles
- Authentication philosophy (establish authority)
- Authorization philosophy (determine permitted action)
- Confidentiality obligation (method-neutral)
- Minimization, purpose limitation, consent
- Limits on inference and observational telemetry for sensitive meaning
- External-party isolation
- Portability and deletion
- Non-regression of trust guarantees
- Canonical rules `P8-R-215`…`P8-R-233`

### Excludes

| Topic | Owner |
|-------|-------|
| Auth/schema change-control process | Chapter 24 — Implementation Constraints (Pending) |
| Export formats / delete cascade tables | FB-P8-020 / implementation |
| Cryptographic method selection | ADR / implementation |
| Identity-provider selection | ADR / implementation |
| Clinical framing / AI roles | Chapter 07 — AI Architecture |
| Veil / confirmation interaction | Chapter 09 — Interaction System |
| Anti-surveillance emotional contract | Chapter 02 — `P8-R-028` |
| Settings layout | Chapter 19 — Settings & Configuration |

---

## 3. Canonical Model

### 3.1 Terms (canonical)

| Term | Meaning |
|------|---------|
| **Life entity** | Canonical unit (Chapter 05) |
| **Personal life graph** | One human's life entities (Chapter 01, Chapter 05) |
| **Stewardship** | AIIMIN may process life entities for Capture, Connect, Coach — not ownership |
| **Principal authority** | The rightful person (or explicit delegate) acting on the graph |
| **Authentication** | Establishing principal authority |
| **Authorization** | Determining permitted actions for an established authority |
| **Private reflection** | Journal-class private reflection content (Chapter 05 entity separation) |
| **Product identity** | Chapter 01 — not principal authority, not life-entity identity |

### 3.2 Ownership

The person owns the life entities in their personal life graph.

AIIMIN is a **steward**. Stewardship is not ownership. The personal life graph is not inventory.

**Governance:** GOV-001, GOV-011, GOV-014

### 3.3 Privacy and security

| Domain | Concern |
|--------|---------|
| **Privacy** | What may be collected, inferred, retained, shared, or observed about a person |
| **Security** | How confidentiality, integrity, and access control uphold those obligations |

Security exists to protect privacy and agency — never as engagement.

**Governance:** GOV-058, GOV-014

### 3.4 Trust boundaries

| Boundary | Law |
|----------|-----|
| **Person ↔ System** | The person is principal; the system acts only within declared purpose |
| **Private reflection ↔ Observation** | Journal-class private reflection is excluded from analytics and surveillance-style observation |
| **Automation ↔ Authority** | Automation may propose; the person remains authority over life entities |
| **AIIMIN ↔ External parties** | Externals receive only what an explicit purpose requires |

**Governance:** GOV-011, GOV-016, GOV-058, GOV-003

### 3.5 Authentication

Authentication exists only to establish principal authority.

Authentication MUST NOT be used for engagement, interruption theater, or as a substitute for authorization.

Methods are open. Purpose is not.

**Governance:** GOV-015, GOV-046

### 3.6 Authorization

Authorization exists only to determine permitted actions for an established authority.

Permitted scope MUST be no greater than declared purpose requires.

Acts that irreversibly alter life entities, finances, privacy scope, or principal identity require elevated assurance that authority intends them. How assurance is interacted is Chapter 09 (Veil). That elevated assurance is required is this chapter.

Automation MUST NOT expand permitted actions without explicit human grant.

**Governance:** GOV-015, GOV-065, GOV-140

### 3.7 Confidentiality

Life entities in the personal life graph MUST remain confidential against unauthorized access.

Methods are not constitutional. The obligation is.

**Governance:** GOV-016, GOV-058, GOV-011

### 3.8 Minimization, consent, sensitive meaning

Collect and retain only what declared product purpose requires.

Collection of personal signals without explicit intentional act MUST be opt-in, purpose-clear, and revocable. Consent by coercion or deception is void.

High-sensitivity meanings MUST NOT be inferred; MUST NOT enter observational telemetry; require explicit human provision. Clinical framing refuse: Chapter 07.

**Governance:** GOV-016, GOV-158, GOV-070, GOV-050

### 3.9 Portability and deletion

Export always available. Delete always available and meaningful (removal from product custody, not cosmetic hiding). Hostage data is a constitutional violation. Formats may change; availability MUST NOT.

**Governance:** GOV-014, GOV-011

### 3.10 Evolution

Evolution of controls MUST NOT regress: ownership, export availability, delete availability, lifelog non-commerce, private-reflection exclusion from observation, or anti-surveillance dignity (Chapter 02).

**Governance:** GOV-011, GOV-014, GOV-016, GOV-058

---

## 4. Canonical Rules

### §4.1 — Ownership and commerce

**P8-R-215** — The person owns the life entities in their personal life graph. AIIMIN is steward, not owner.

**Referenced GOV IDs:** GOV-001, GOV-014

---

**P8-R-216** — AIIMIN MUST NOT sell or share lifelog data.

**Referenced GOV IDs:** GOV-011

---

### §4.2 — Portability and deletion

**P8-R-217** — Export of the person's personal life graph MUST always be available. Blocking export to retain the person MUST NOT ship.

**Referenced GOV IDs:** GOV-014

---

**P8-R-218** — Deletion MUST always be available and MUST be meaningful removal from product custody — not cosmetic hiding.

**Referenced GOV IDs:** GOV-014

---

### §4.3 — Observation limits and minimization

**P8-R-219** — Journal-class private reflection content MUST remain excluded from analytics and surveillance-style observation.

**Referenced GOV IDs:** GOV-016, GOV-058

---

**P8-R-220** — Collection and retention MUST be limited to what declared product purpose requires.

**Referenced GOV IDs:** GOV-016, GOV-011, GOV-023

---

### §4.4 — Consent and sensitive meaning

**P8-R-221** — Collection of personal signals without explicit intentional act MUST be opt-in, purpose-clear, and revocable.

**Referenced GOV IDs:** GOV-158, GOV-058

---

**P8-R-222** — Consent obtained by coercion or deception is void.

**Referenced GOV IDs:** GOV-158, GOV-058

---

**P8-R-223** — High-sensitivity meanings (including health treatments, credentials, secrets, and equivalents) MUST NOT be inferred. Explicit human provision is required.

**Referenced GOV IDs:** GOV-070, GOV-050

---

**P8-R-224** — High-sensitivity meanings MUST NOT enter observational telemetry.

**Referenced GOV IDs:** GOV-070

---

### §4.5 — Authentication and authorization

**P8-R-225** — Authentication exists only to establish principal authority of the acting person or an explicitly delegated agent.

**Referenced GOV IDs:** GOV-015, GOV-046

---

**P8-R-226** — Authentication MUST NOT be used for engagement, interruption theater, or as a substitute for authorization.

**Referenced GOV IDs:** GOV-015, GOV-046

---

**P8-R-227** — Authorization exists only to determine permitted actions for an established authority.

**Referenced GOV IDs:** GOV-015, GOV-140

---

**P8-R-228** — Permitted authorization scope MUST be no greater than declared purpose requires.

**Referenced GOV IDs:** GOV-015, GOV-140

---

**P8-R-229** — Acts that irreversibly alter life entities, finances, privacy scope, or principal identity MUST require elevated assurance that authority intends them.

**Referenced GOV IDs:** GOV-015, GOV-065

---

**P8-R-230** — Automation MUST NOT expand permitted actions without explicit human grant.

**Referenced GOV IDs:** GOV-140, GOV-003

---

### §4.6 — Confidentiality, externals, evolution

**P8-R-231** — Life entities in the personal life graph MUST remain confidential against unauthorized access. Confidentiality methods are not constitutional; the obligation is.

**Referenced GOV IDs:** GOV-016, GOV-058, GOV-011

---

**P8-R-232** — External parties MAY receive only the minimum data required for an explicit purpose.

**Referenced GOV IDs:** GOV-011, GOV-016

---

**P8-R-233** — Evolution of controls MUST NOT regress ownership, export availability, delete availability, lifelog non-commerce, private-reflection exclusion from observation, or anti-surveillance dignity.

**Referenced GOV IDs:** GOV-058, GOV-014, GOV-011, GOV-016

---

## 5. Referenced GOV IDs

| GOV ID | Title | Status in P7 | Used in Ch 15 |
|--------|-------|--------------|---------------|
| GOV-001 | Personal Life OS | Approved | Yes |
| GOV-003 | Human authority | Approved | Yes |
| GOV-011 | Refuse sell/share lifelog | Approved | Yes |
| GOV-014 | Export and delete always | Approved | Yes |
| GOV-015 | High-stakes confirm | Approved | Yes |
| GOV-016 | Journal body out of analytics | Approved | Yes |
| GOV-023 | Human-problem gate | Approved | Yes |
| GOV-046 | Destructive confirm | Approved | Yes |
| GOV-050 | No clinical framing | Approved | Cross-ref Ch 07 |
| GOV-058 | No surveillance feeling | Approved | Yes |
| GOV-065 | Branded destructive confirm | Approved | Yes |
| GOV-070 | Sensitive inference / telemetry ban | Approved | Yes |
| GOV-140 | Auth/billing not silently changed | Approved | Yes |
| GOV-158 | Passive opt-in | Approved | Yes |

---

## 6. Dependencies

| Direction | Chapter | Relationship |
|-----------|---------|--------------|
| Upstream | 01 Identity | Personal life graph; not a network |
| Upstream | 02 Philosophy | Anti-surveillance (`P8-R-028`); dignity |
| Upstream | 05 Objects | Life entities; Journal separation |
| Upstream | 07 AI | Clinical refuse; correctable inference |
| Upstream | 09 Interaction | Veil for elevated assurance interaction |
| Upstream | 13 Platform | Trust on every execution environment |
| Upstream | 14 Continuity | Must not bypass this chapter |

---

## 7. Edge Cases

| Condition | Expected behavior |
|-----------|-------------------|
| Growth experiment observes Journal bodies | Violates P8-R-219 |
| Export buried to retain the person | Violates P8-R-217 |
| Delete hides locally but retains undisclosed custody | Violates P8-R-218 |
| Authentication forced for engagement on recoverable micro-acts | Violates P8-R-226 |
| Automation expands billing rights alone | Violates P8-R-230 |
| Non-explicit sensing on by default | Violates P8-R-221 |

---

## 8. Founder Decision Blocks

| ID | Issue | Why blocked |
|----|-------|-------------|
| FB-P8-018 | Whether anonymized aggregates are permitted under lifelog non-commerce (**canonical**; absorbs former FB-P8-003 — ADR-P8-001) | P7 open question |
| FB-P8-019 | Which classes of life-entity content may leave the person's trusted custody for automated inference | Multiple valid trust architectures |
| FB-P8-020 | Operational definition of export completeness and delete completeness | Availability is constitutional; schema is not |

---

## 9. Acceptance Criteria

| ID | Criterion | Measure |
|----|-----------|---------|
| AC-01 | Rules P8-R-215…233; vocabulary = life entity / personal life graph only | Grep |
| AC-02 | No duplicate of `P8-R-028` as separate surveillance rule | Review |
| AC-03 | Authn/authz atomic and purpose-pure | Review |
| AC-04 | Compatible with Ch 05/07/09 | Conflict PASS |

---

## Changelog

### 2026-07-23 — Publication remediation (ADR-P8-001)

- **What:** Pointer corrections only (Implementation Constraints → Ch 24 Pending; Settings → Ch 19). FB-018 marked canonical absorber of FB-003. No doctrine or rule-body change.
- **Why:** Publication blockers 1–3.
- **Status:** shipped
- **Governance:** ADR-P8-001 Resolved


### 2026-07-22 — Freeze v1.0

- **What:** Founder Freeze Certificate. Status FROZEN. Immutable without Founder ADR.
- **Why:** Final verification PASS after v0.5 remediation.
- **Status:** shipped
