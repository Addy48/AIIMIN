# Chapter 13 — Platform Specifications

| Field | Value |
|-------|-------|
| **Status** | FROZEN |
| **Version** | P8 v1.0 |
| **Chapter** | 13 — Platform Specifications |
| **Subsystem** | Batch 5 — Continuity & Trust (with Ch 14, Ch 15) |
| **Approval** | Founder Approved — Freeze Certificate 2026-07-22 |
| **Last Modified** | 2026-07-22 |
| **Supersedes** | P8 v0.5-remediation |

This chapter is normative.

Any modification requires a Founder ADR.

```yaml
chapter: 13
title: Platform Specifications
p8_version: P8 v1.0
status: FROZEN
authored: 2026-07-22
governance_source: P7 Governance v1.0 (FROZEN)
depends_on:
  - Chapter 01 — Product Identity (FROZEN v1.0)
  - Chapter 02 — Core Product Philosophy (FROZEN v1.0)
  - Chapter 05 — Core Objects & Data Model (FROZEN v1.0)
  - Chapter 08 — Surface Specifications (FROZEN v1.0)
  - Chapter 09 — Interaction System (FROZEN v1.0)
architectural_question: "What must remain true of AIIMIN across every present and future execution environment?"
```

---

## 1. Purpose

Define **execution-environment law**: what an environment is, how environments relate to one Life OS, which meaning invariants travel across interaction modalities, how capability ceilings stay intentional, how constrained participation preserves continuable work, and how new environments may enter without fracturing product identity.

This chapter owns **environment identity and capability law**. It MUST NOT own continuity mechanics (Chapter 14), privacy/security stewardship (Chapter 15), interaction grammar (Chapter 09), surface jobs (Chapter 08), or clinical/AI framing (Chapter 07).

---

## 2. Scope

### Includes

- Execution environment as a mode of participation in one Life OS
- Identity / modality / ceiling invariants
- Capability as intentional limit
- Continuability when an environment cannot safely complete an act
- Safety primacy under attention or hazard constraints
- Ambient participation without product-identity takeover
- Presentation-environment neutrality vs meaning invariance
- Admission of new environments
- Arbitration when environments diverge
- Canonical rules `P8-R-187`…`P8-R-201`

### Excludes

| Topic | Owner |
|-------|-------|
| Continuity, durability honesty, convergence | Chapter 14 — Offline & Synchronization |
| Ownership, export/delete, confidentiality, consent | Chapter 15 — Privacy & Security |
| Interaction verbs, state machine, Veil ladder | Chapter 09 — Interaction System |
| Clinical framing / AI correction | Chapter 07 — AI Architecture |
| Surface one-job contracts | Chapter 08 — Surface Specifications |
| Named hosts, vendors, form factors, SDKs | Implementation notes |

---

## 3. Canonical Model

### 3.1 Terms (canonical)

| Term | Meaning in this chapter |
|------|-------------------------|
| **Execution environment** | Any setting through which a person participates in AIIMIN. Constitutional term for what frozen documents may call platform, client, or surface when discussing participation setting. |
| **Product identity** | AIIMIN as Personal Life OS (Chapter 01) — not life-entity identity, not principal authority |
| **Interaction modality** | How meaning is expressed and received |
| **Capability ceiling** | What participation an environment permits and refuses |
| **Life entity** | Canonical unit in the personal life graph (Chapter 05) — not redefined here |

### 3.2 Growth axiom

**Product identity is invariant. Interaction modality is variable. Capability ceiling is intentional.**

**Governance:** GOV-153, GOV-025, GOV-001, GOV-040

### 3.3 Capability as limit

Capability is the set of permitted and forbidden participations in an environment.

Ceilings are stated as guarantees and refuses. Concrete engineering classes derive from these limits; they are not constitutional categories.

Interaction modality and presentation channel MUST NOT change verb meaning, life-entity meaning, or Outcomes (Chapter 09).

**Governance:** GOV-153, GOV-040, GOV-134

### 3.4 Intentional ceiling

Every shipped execution environment MUST make its ceiling knowable: constitutional obligations upheld; participation permitted and refused; shared meaning contracts reused; acts it will never do.

An undeclared or accidental ceiling is not a ceiling.

**Governance:** GOV-153, GOV-103, GOV-161

### 3.5 Constraint and continuability

Environments differ in how much attention, precision, and time the person can safely give.

When attention or hazard constraints bind: safety outranks completeness; work that cannot complete safely MUST remain continuable elsewhere; admitted intent MUST NOT silently vanish.

**Governance:** GOV-155, GOV-156, GOV-046, GOV-015, GOV-033

### 3.6 Limited-capability environments

Limited capability is lawful. Smuggling refused capabilities under another name is not. Growth inside a limited ceiling means better fulfillment of that ceiling — not silent expansion. Expanding a published ceiling requires Founder ADR (FB-P8-013).

**Governance:** GOV-013, GOV-041, GOV-085

### 3.7 Ambient participation

Environments that observe or prompt with little explicit action MUST NOT redefine product identity or cast the person as a fitness-only or clinical product.

Clinical labeling and inference correction remain Chapter 07. Consent for non-explicit collection remains Chapter 15.

**Governance:** GOV-158, GOV-005

### 3.8 Presentation environment vs meaning

The presentation environment MAY follow local convention for ordinary system acts.

AIIMIN meaning — verbs, Outcomes, life-entity sense — MUST NOT fork per presentation environment. (Chapter 09 owns gesture/chrome interaction detail.)

**Governance:** GOV-134, GOV-118

### 3.9 Admission of new environments

Before a new class of execution environment ships, it MUST show: a human problem this modality uniquely serves; which shared meaning contracts transfer; what the ceiling refuses; how trust obligations remain intact; that the claim remains true across decades — not a novelty demonstration.

**Governance:** GOV-161, GOV-093, GOV-023

### 3.10 Arbitration

When environments disagree: frozen constitution wins; shared meaning contracts win; recency of shipment MUST NOT win by default. Per-environment constitution forks MUST NOT exist.

Token/blueprint source-of-truth order when environments drift: FB-P8-014 (GOV-160 Needs Discussion — not resolved here).

**Governance:** GOV-025, GOV-040

---

## 4. Canonical Rules

### §4.1 — One OS

**P8-R-187** — AIIMIN MUST remain one Personal Life OS across all execution environments. Environments are modes of participation — not separate products with divergent product identity, life entities, or verbs.

**Referenced GOV IDs:** GOV-001, GOV-040, GOV-153

---

**P8-R-188** — Across execution environments, **product identity is invariant**, **interaction modality is variable**, and **capability ceiling is intentional**.

**Referenced GOV IDs:** GOV-153, GOV-025

---

### §4.2 — Capability and meaning

**P8-R-189** — Execution environments MUST be limited by intentional capability ceilings — not by vendor, operating-system brand, or form-factor fashion.

**Referenced GOV IDs:** GOV-153, GOV-040

---

**P8-R-190** — Interaction modality and presentation channel MUST NOT alter the meaning of primitives, life entities, verbs, or Outcomes.

**Referenced GOV IDs:** GOV-040, GOV-020, GOV-134

---

**P8-R-191** — Every shipped execution environment MUST have a knowable intentional ceiling: obligations upheld, participation permitted and refused, shared contracts reused, and acts refused. Accidental full-capability parity MUST NOT ship.

**Referenced GOV IDs:** GOV-153, GOV-103, GOV-161

---

### §4.3 — Continuability and safety

**P8-R-192** — When an environment's ceiling cannot complete an act without degrading trust or safety, the person's work MUST remain continuable in a compatible environment.

**Referenced GOV IDs:** GOV-155, GOV-156, GOV-046, GOV-015

---

**P8-R-193** — Intent already admitted MUST NOT silently vanish because an environment ceiling was reached.

**Referenced GOV IDs:** GOV-015, GOV-028

---

**P8-R-194** — While attention or hazard constraints bind an environment, **safety outranks completeness**.

**Referenced GOV IDs:** GOV-156, GOV-033

---

**P8-R-195** — Limited-capability environments MUST NOT smuggle refused capabilities under another name.

**Referenced GOV IDs:** GOV-013, GOV-041, GOV-085

---

**P8-R-196** — Growth inside a limited ceiling MUST mean better fulfillment of that ceiling — not silent expansion of the ceiling.

**Referenced GOV IDs:** GOV-013, GOV-041

---

### §4.4 — Ambient and presentation

**P8-R-197** — Ambient participation MUST NOT redefine product identity or cast the person as a fitness-only or clinical product.

**Referenced GOV IDs:** GOV-158, GOV-005

---

**P8-R-198** — Presentation-environment conventions for ordinary system acts MAY be followed. AIIMIN meaning MUST NOT fork per presentation environment.

**Referenced GOV IDs:** GOV-134, GOV-118

---

### §4.5 — Admission and arbitration

**P8-R-199** — A new class of execution environment MUST NOT ship unless it shows a modality-unique human problem, transferred shared contracts, explicit ceiling refuses, intact trust obligations, and a claim that remains true across decades.

**Referenced GOV IDs:** GOV-161, GOV-093, GOV-023

---

**P8-R-200** — When environments disagree, frozen constitution and shared meaning contracts arbitrate — not whichever environment shipped last.

**Referenced GOV IDs:** GOV-025, GOV-040

---

**P8-R-201** — Per-environment constitution forks MUST NOT exist.

**Referenced GOV IDs:** GOV-025

---

## 5. Referenced GOV IDs

| GOV ID | Title | Status in P7 | Used in Ch 13 |
|--------|-------|--------------|---------------|
| GOV-001 | Personal Life OS identity | Approved | Yes |
| GOV-005 | Not a social product | Approved | Yes |
| GOV-013 | Capture-limited ceiling | Approved | Yes |
| GOV-015 | High-stakes confirm | Approved | Yes |
| GOV-020 | Shared primitives | Approved | Yes |
| GOV-023 | Human-problem gate | Approved | Yes |
| GOV-025 | Article supremacy / no forks | Approved | Yes |
| GOV-028 | Capture first | Approved | Yes |
| GOV-033 | Interruptibility | Approved | Yes |
| GOV-040 | Clients are surfaces of one OS | Approved | Yes |
| GOV-041 | Capture ceiling lock | Approved | Yes |
| GOV-046 | Destructive confirm | Approved | Yes |
| GOV-085 | Rich companion ≠ capture-limited | Approved | Yes |
| GOV-093 | Eight-gate intake | Approved | Yes |
| GOV-103 | Ceiling field | Approved | Yes |
| GOV-118 | Presentation vernacular | Approved | Yes |
| GOV-134 | Environment conventions | Approved | Yes |
| GOV-153 | Growth axiom | Approved | Yes |
| GOV-155 | Glance-class ceiling (instance) | Approved | Principle only |
| GOV-156 | Attention-safety ceiling (instance) | Approved | Principle only |
| GOV-158 | Passive opt-in | Approved | Ambient |
| GOV-161 | Expansion decision gate | Approved | Yes |

*GOV-154 and GOV-160 remain Needs Discussion — not used as normative citations. See FB-P8-013, FB-P8-014.*

---

## 6. Dependencies

| Direction | Chapter | Relationship |
|-----------|---------|--------------|
| Upstream | 01 Product Identity | Product identity; one OS |
| Upstream | 05 Objects | Life entity meaning |
| Upstream | 09 Interaction | Meaning travels; presentation detail |
| Downstream | 14 Continuity | Continuability across environments |
| Downstream | 15 Privacy | Trust on every environment |

---

## 7. Edge Cases

| Condition | Expected behavior |
|-----------|-------------------|
| Unknown future environment | Apply P8-R-199; no brand-specific law |
| Limited ceiling gains analytics under another name | Violates P8-R-195 |
| Constrained environment forces irreversible high-stakes path | Violates P8-R-192 / P8-R-194 |
| Two environments diverge on verb meaning | Violates P8-R-190 / P8-R-200 |
| Ambient path redefines product as fitness app | Violates P8-R-197 |

---

## 8. Founder Decision Blocks

| ID | Issue | Why blocked |
|----|-------|-------------|
| FB-P8-013 | Concrete ceiling matrices; expansion of published ceilings | GOV-154 ND; living companion detail |
| FB-P8-014 | Shared-token / blueprint source-of-truth order | GOV-160 ND |

---

## 9. Acceptance Criteria

| ID | Criterion | Measure |
|----|-----------|---------|
| AC-01 | Rules P8-R-187…201 use Ch 05 life-entity vocabulary | Grep |
| AC-02 | No § section pointers in rules | Grep |
| AC-03 | No GOV-160/154 as normative rule citations | Grep |
| AC-04 | Compatible with frozen Ch 01–12 | Conflict PASS |

---

## Changelog

### 2026-07-22 — Freeze v1.0

- **What:** Founder Freeze Certificate. Status FROZEN. Immutable without Founder ADR.
- **Why:** Final verification PASS after v0.5 remediation.
- **Status:** shipped
