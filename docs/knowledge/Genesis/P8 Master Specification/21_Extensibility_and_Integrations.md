# Chapter 21 — Extensibility & Integrations

| Field | Value |
|-------|-------|
| **Status** | FROZEN |
| **Version** | P8 v1.0 |
| **Chapter** | 21 — Extensibility & Integrations |
| **Subsystem** | Batch 7 — Continuity of Control (with Ch 19, Ch 20) |
| **Approval** | Founder Approved — Freeze Certificate 2026-07-23 |
| **Last Modified** | 2026-07-23 |
| **Supersedes** | P8 v0.3-patched |

This chapter is normative.

Any modification requires a Founder ADR.

```yaml
chapter: 21
title: Extensibility & Integrations
p8_version: P8 v1.0
status: FROZEN
authored: 2026-07-23
remediated: 2026-07-23
freeze_blocker_pass: 2026-07-23
freeze_date: 2026-07-23
governance_source: P7 Governance v1.0 (FROZEN)
depends_on:
  - Chapter 01 — Product Identity (FROZEN v1.0)
  - Chapter 05 — Core Objects & Data Model (FROZEN v1.0)
  - Chapter 13 — Platform Specifications (FROZEN v1.0)
  - Chapter 15 — Privacy & Security (FROZEN v1.0)
  - Chapter 16 — Notification System (FROZEN v1.0)
  - Chapter 17 — Intelligence & Automation (FROZEN v1.0)
  - Chapter 18 — Personalization & Adaptation (FROZEN v1.0)
  - Chapter 19 — Settings & Configuration (FROZEN v1.0)
  - Chapter 20 — Onboarding & Identity Formation (FROZEN v1.0)
architectural_question: "What must remain true of extensions and integrations for as long as AIIMIN exists?"
```

---

## 1. Purpose

Define **extensibility law**: how external capabilities may participate; permission and capability boundaries; negotiation, revocation, and lifecycle; isolation and graceful degradation; interoperability without a second life graph; external failure honesty; import/export contracts with externals; and future admission of new extension classes.

This chapter owns **governance of external capability**. It MUST NOT own API shapes, vendor SDKs, plugin marketplaces, or transport protocols.

Extensions are guests. The person remains authority. AIIMIN remains one Personal Life OS.

---

## 2. Scope

### Includes

- Integrations, extensions, plugins, external capabilities (constitutional category)
- Permission boundaries and capability negotiation
- Revocation and lifecycle honesty
- Compatibility, isolation, graceful degradation
- Interoperability without graph fork
- External failure handling
- Import/export contracts with externals
- Future extensibility gates
- Chapter-local non-regression
- Canonical rules `P8-R-323`…`P8-R-339`, `P8-R-342`, `P8-R-343`

### Excludes

| Topic | Owner |
|-------|-------|
| External-party data minimization / confidentiality | Chapter 15 |
| Attention / automation / preference law | Chapters 16–18 |
| Execution-environment admission | Chapter 13 |
| API / SDK / protocol design | Implementation |
| Extension capability class taxonomy | FB-P8-027 |

---

## 3. Canonical Model

### 3.1 Terms (canonical)

| Term | Meaning |
|------|---------|
| **External capability** | Any extension, integration, plugin, or outside service that participates in or alongside AIIMIN |
| **Permission** | Explicit human grant for an external capability to act within a purpose-bound scope |
| **Capability negotiation** | Declaration and acceptance of what an external may and may not do |
| **Revocation** | Withdrawal of permission; authority of the external ends |
| **Isolation** | External failure or misbehavior MUST NOT silently corrupt personal-life-graph integrity claims |
| **Graceful degradation** | When an external is unavailable, core Life OS participation continues within ceiling |
| **Interoperability** | Lawful exchange without creating a second personal life graph |

### 3.2 Axiom

**Externals are guests. The person remains authority. One personal life graph remains one.**

External capability MUST NOT redefine product identity. Externals MUST NOT become owners of Capture, Connect, or Coach. Permission is explicit, purpose-bound, and revocable. Failure is honest. After revocation, AIIMIN ends its grant of authority and MUST NOT imply power over copies already outside its boundary. Future classes require a human problem, transferred contracts, explicit refuses, and intact trust (Chapter 13 spirit / GOV-161).

Capability class lists: FB-P8-027.

**Governance:** GOV-011, GOV-014, GOV-040, GOV-161, GOV-023, GOV-153

---

## 4. Canonical Rules

### §4.1 — Guest posture and identity

**P8-R-323** — External capabilities are guests. The person remains authority over life entities (Chapter 15). Externals MUST NOT become sovereign.

**Referenced GOV IDs:** GOV-014, GOV-001

---

**P8-R-324** — External capabilities MUST NOT redefine product identity, life-entity meaning, verbs, or Outcomes (Chapters 01, 05, 13).

**Referenced GOV IDs:** GOV-001, GOV-040, GOV-153

---

**P8-R-325** — Interoperability MUST NOT create a second personal life graph for the same person.

**Referenced GOV IDs:** GOV-040, GOV-001

---

**P8-R-342** — External capabilities, plugins, integrations, services, and extensions MUST NOT become constitutional owners of Capture, Connect, or Coach. They may participate only under explicit grant. Ownership of those verbs remains with the previously frozen constitution.

**Referenced GOV IDs:** GOV-001, GOV-028, GOV-040

---

### §4.2 — Permission, negotiation, revocation

**P8-R-326** — Permission for an external capability MUST be explicit, purpose-bound, and revocable. Implied consent from usage patterns MUST NOT create permission.

**Referenced GOV IDs:** GOV-158, GOV-140

---

**P8-R-327** — Capability negotiation MUST declare permitted and refused acts before the external operates with authority. Silent expansion of capability MUST NOT ship.

**Referenced GOV IDs:** GOV-023, GOV-132

---

**P8-R-328** — Revocation MUST be effective. After revocation, the external MUST NOT retain authority to act on the personal life graph.

**Referenced GOV IDs:** GOV-014, GOV-140

---

**P8-R-343** — After revocation, AIIMIN MUST terminate its own grant of authority to the external immediately. AIIMIN MUST NOT imply authority over information already transferred outside its constitutional boundary. AIIMIN MUST represent those limits truthfully. This rule does not create a deletion guarantee for copies held outside AIIMIN.

**Referenced GOV IDs:** GOV-089, GOV-132, GOV-014

---

**P8-R-329** — Which concrete capability classes may be granted remains FB-P8-027 — this chapter freezes permission/revocation law, not the class list.

**Referenced GOV IDs:** GOV-023, GOV-161

---

### §4.3 — Lifecycle, isolation, degradation

**P8-R-330** — External lifecycle states (admitted, operating, revoked, removed) MUST be honest. Absent or failed externals MUST NOT be presented as healthy authority.

**Referenced GOV IDs:** GOV-089, GOV-132

---

**P8-R-331** — Isolation: external failure or misbehavior MUST NOT silently corrupt personal-life-graph integrity claims or present corruption as success.

**Referenced GOV IDs:** GOV-089, GOV-051

---

**P8-R-332** — Graceful degradation: when an external is unavailable, core Capture, Connect, and Coach participation MUST remain possible within the execution-environment ceiling (Chapter 13).

**Referenced GOV IDs:** GOV-153, GOV-028

---

**P8-R-333** — Unknown or incompatible extensions MUST be ignored or quarantined safely. They MUST NOT silently gain authority.

**Referenced GOV IDs:** GOV-089, GOV-140

---

### §4.4 — Data, failure, contracts, future admission

**P8-R-334** — Externals MAY receive only the minimum data required for an explicit purpose (Chapter 15). Lifelog non-commerce remains Chapter 15 (`P8-R-216`).

**Referenced GOV IDs:** GOV-011, GOV-016

---

**P8-R-335** — External failure or pending state MUST NOT be presented as personal-life-graph success.

**Referenced GOV IDs:** GOV-089, GOV-132

---

**P8-R-336** — Import/export contracts with externals MUST NOT hostage the person's export or delete rights for the personal life graph (Chapter 15).

**Referenced GOV IDs:** GOV-014

---

**P8-R-337** — A new class of external capability MUST NOT ship unless it shows a human problem it uniquely serves, transferred shared meaning contracts, explicit refuses, and intact trust obligations (Chapter 13 admission spirit; GOV-161).

**Referenced GOV IDs:** GOV-161, GOV-093, GOV-023

---

### §4.5 — Constitutional subordination and non-regression

**P8-R-338** — External capabilities MUST NOT replace, bypass, override, redefine, or establish parallel constitutional authority for any governed subsystem. This includes privacy/security law (Chapter 15), attention law (Chapter 16), automation law (Chapter 17), personalization law (Chapter 18), configuration law (Chapter 19), and onboarding/formation law (Chapter 20).

**Referenced GOV IDs:** GOV-025, GOV-011

---

**P8-R-339** — Evolution of extensibility controls in this chapter MUST NOT regress guest posture, non-ownership of Capture/Connect/Coach, explicit permission, effective revocation, post-revocation honesty of boundary limits, isolation honesty, or one-graph interoperability. Global ownership, export, delete, and anti-surveillance non-regression remain Chapter 15 (`P8-R-233`).

**Referenced GOV IDs:** GOV-014, GOV-058

---

## 5. Referenced GOV IDs

| GOV ID | Title | Status in P7 | Used in Ch 21 |
|--------|-------|--------------|---------------|
| GOV-001 | Personal Life OS | Approved | Yes |
| GOV-011 | Refuse sell/share lifelog | Approved | Yes |
| GOV-014 | Export and delete always | Approved | Yes |
| GOV-016 | Journal body out of analytics | Approved | Cross-ref |
| GOV-023 | Human-problem gate | Approved | Yes |
| GOV-025 | Article supremacy | Approved | Yes |
| GOV-028 | Capture first | Approved | Yes |
| GOV-040 | Shared primitives | Approved | Yes |
| GOV-051 | Inference must be correctable | Approved | Yes |
| GOV-058 | No surveillance feeling | Approved | Yes |
| GOV-089 | No silent failed sync as success | Approved | Yes |
| GOV-093 | Eight gate questions | Approved | Yes |
| GOV-132 | Latency honesty | Approved | Yes |
| GOV-140 | No auth/billing change without user | Approved | Yes |
| GOV-153 | Growth axiom | Approved | Yes |
| GOV-158 | Ambient / non-explicit consent | Approved | Yes |
| GOV-161 | Expansion decision gate | Approved | Yes |

---

## 6. Dependencies

| Direction | Chapter | Relationship |
|-----------|---------|--------------|
| Upstream | 01, 05, 13, 15–18 | Identity, graph, environments, trust, agency, fit |
| Upstream | 19 | Extension-exposed configuration still under settings law |
| Upstream | 20 | Extern MUST NOT hijack formation |

---

## 7. Edge Cases

| Condition | Expected behavior |
|-----------|-------------------|
| Plugin renames Outcomes | Violates P8-R-324 |
| Integration writes second life graph | Violates P8-R-325 |
| Revoked plugin still mutates entities | Violates P8-R-328 |
| External down blocks all capture | Violates P8-R-332 |
| External error shown as save success | Violates P8-R-335 / P8-R-331 |
| Extension posts private life automatically | Violates P8-R-338; Ch 17 |
| Plugin claims ownership of Capture | Violates P8-R-342 |
| Product implies it can erase copies already held by revoked external | Violates P8-R-343 |

---

## 8. Founder Decision Blocks

| ID | Issue | Why blocked |
|----|-------|-------------|
| FB-P8-027 | Extension / integration capability class taxonomy | Multiple valid architectures; permission law frozen without class list |

---

## 9. Acceptance Criteria

| ID | Criterion | Measure |
|----|-----------|---------|
| AC-01 | Rules `P8-R-323`…`339` plus `342`–`343` | Grep count = 19 |
| AC-02 | No API / SDK / protocol normative | Review |
| AC-03 | Privacy/attention/automation cited, not redefined | Conflict PASS |
| AC-04 | Status is FROZEN | Header |

---

## Internal Notes

- “Plugin / integration / extension” are one constitutional category: external capability.
- Admission gate mirrors Chapter 13 environment admission without owning environments.

---

## Changelog

### 2026-07-23 — Official freeze (P8 v1.0)

- **What:** Batch 7 Continuity of Control frozen. Certificate issued.
- **Why:** Founder Final Ratification PASS.
- **Status:** frozen

### 2026-07-23 — Freeze-blocker patch (P8-R-338)

- **What:** Extended external subordination to Ch19 configuration and Ch20 formation; forbid parallel constitutional authority.
- **Why:** Hostile Audit freeze blocker 2.
- **Status:** draft remediation

### 2026-07-23 — Founder remediation v0.2

- **What:** Explicit non-ownership of Capture/Connect/Coach (`P8-R-342`); post-revocation boundary honesty (`P8-R-343`); non-regression extended.
- **Why:** Founder Review Batch 7 remediations 3–4.
- **Status:** draft remediation

### 2026-07-23 — Batch 7 draft v0.1

- **What:** Initial draft Chapter 21. Rules P8-R-323…339.
- **Why:** Begin Batch 7 — Continuity of Control.
- **Status:** draft
