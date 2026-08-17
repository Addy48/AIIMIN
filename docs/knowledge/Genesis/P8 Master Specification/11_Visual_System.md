# Chapter 11 — Visual System

| Field | Value |
|-------|-------|
| **Status** | FROZEN |
| **Version** | P8 v1.0 |
| **Chapter** | 11 — Visual System |
| **Subsystem** | Batch 4 — Interaction Layer (with Ch 09, Ch 10, Ch 12) |
| **Approval** | Founder Approved — Final Constitutional Audit PASS |
| **Last Modified** | 2026-07-22 |
| **Supersedes** | P8 v0.2-draft |

This chapter is normative.

Any modification requires a Founder ADR.

```yaml
chapter: 11
title: Visual System
p8_version: P8 v1.0
status: FROZEN
authored: 2026-07-22
governance_source: P7 Governance v1.0 (FROZEN)
research_source:
  - P8 Research/Interaction_Language.md (RL-002)
  - P8 Research/Interaction_Decision_Matrix.md (RL-004)
depends_on:
  - Chapter 01 — Product Identity (FROZEN v1.0)
  - Chapter 10 — Component System (FROZEN v1.0)
architectural_question: "What visual truths MUST hold so AIIMIN is recognizable and honest?"
```

---

## 1. Purpose

Define **visual architecture**: semantic tokens, typography roles, density system, color semantics, theme contracts, and visual invariants.

Visual tokens express cognitive **tone** (Breath · Scan · Command · Ritual) and **truth state** (Settle · Hold · Uncertain). This chapter owns meaning and contracts — not component behavior, motion, or page layout.

**Token values:** `docs/knowledge/08_DESIGN/Palette.md` holds locked hex. This chapter holds **what tokens mean**.

---

## 2. Scope

### Includes

- Visual contracts (tone, truth, hierarchy)
- Semantic token architecture
- Typography roles
- Density system tied to cognitive mode
- Color semantics and theme contracts
- Iconography and elevation principles
- Accessibility color obligations
- Canonical rules `P8-R-163`…`P8-R-174`

### Excludes

| Topic | Owner |
|-------|-------|
| Component contracts, states | Chapter 10 — Component System |
| Motion timing, easing | Chapter 12 — Motion System |
| Interaction logic, grammar | Chapter 09 — Interaction System |
| Surface I/O, layout regions | Chapter 08 — Surface Specifications |

---

## 3. Canonical Model

### 3.1 Visual philosophy — truth before beauty

Visual treatment MUST serve **legibility of system state** first. Beauty MAY enhance Scan clarity and Ritual expression — beauty MUST NOT obscure Settle, Hold, uncertainty, or failure.

When Visual Beauty conflicts with Truth, **Truth wins** (RL-004).

**Governance:** GOV-087, GOV-132, GOV-106

### 3.2 Tone-to-visual mapping

Cognitive tones (Ch 09 §3.4) map to visual density contracts:

| Tone | Visual character | Density token mode |
|------|------------------|-------------------|
| **Breath** | Low chrome; focal Pulse and Anchor dominate | `density.capture` |
| **Scan** | Scan tone defaults; peripheral Offers; Command-density chrome MUST NOT be default | `density.review` |
| **Command** | Higher information permitted; anchor remains singular | `density.command` |
| **Ritual** | Expressive sparse hero; brand surfaces only | `density.brand` |

Tone-to-mode mismatch (Command widgets on Breath capture) is a visual defect.

**Research:** RL-002 §Tones; RL-004 Density vs Readability

**Governance:** GOV-109, GOV-032

### 3.3 Truth-state visual contracts

Interaction truth states MUST have distinct visual semantics:

| State | Visual contract | Forbidden |
|-------|-----------------|-----------|
| **Settle** | Success semantics; proportional ack only; casino motion forbidden | Hold styling |
| **Hold** | Pending semantics; reason visible | Success/checkmark styling |
| **Uncertain** | Soft chip posture; provenance visible | High-confidence styling for low confidence |
| **Error** | Honest failure; recovery path visible | Shame copy styling |
| **Veil** | Focal elevation; consequence readable | Decorative background competing with copy |

Color alone MUST NOT carry status — text, icon, or pattern MUST reinforce.

**Research:** RL-002 §Trust model; RL-003 §Canonical waiting state, §Canonical uncertainty state

**Governance:** GOV-087, GOV-104, GOV-132

### 3.4 Palette lock (cross-ref)

Brand palette is locked per Chapter 01 / GOV-036. New brand colors without explicit founder approval MUST NOT ship.

| Semantic role | Locked reference |
|---------------|------------------|
| Accent / action | `#ff6b35` |
| Done / positive | `#10b981` |
| Muted | `#6b7280` |
| Dark canvas | `#1a1a1a` |
| Dark card | `#2d2d2d` |
| Light canvas | `#f9f9f9` |
| Light card | `#ffffff` |

Semantic roles MUST NOT drift across themes or native mappings.

**Governance:** GOV-036, GOV-104, GOV-081

### 3.5 Semantic color roles

Color encodes **meaning** — not decoration:

| Role | Meaning |
|------|---------|
| `color.action` | Anchor, primary commit |
| `color.done` | Settle success, completion |
| `color.danger` | Destructive, Veil consequence |
| `color.muted` | Peripheral, latent, disabled |
| `color.surface` | Canvas and card layers |
| `color.hold` | Pending — distinct from done |
| `color.uncertain` | Low-confidence Offer |

Decorative-only color on product surfaces MUST NOT ship.

**Governance:** GOV-104

### 3.6 Typography roles

| Role | Family | Scope |
|------|--------|-------|
| Wordmark / manifesto | Bodoni Moda | Brand lockup and `/brand` only |
| Ritual / display | Familjen Grotesk | Brand moments, key OS headlines |
| Product UI | Figtree | Nav, buttons, titles, body |
| Measure | JetBrains Mono | Scores, money, timers, OS IDs |

A fifth brand-identity face MUST NOT ship. Typography selects by **role**, not by designer preference per screen.

**Governance:** GOV-105, GOV-090

### 3.7 Token architecture

Tokens flow in three tiers — downstream MUST NOT skip tiers:

```text
primitive → semantic → component
```

| Tier | Owns | Example |
|------|------|---------|
| **Primitive** | Raw values from Palette.md | `primitive.orange.500` |
| **Semantic** | Meaning stable across theme | `color.action`, `density.review` |
| **Component** | Family-specific overrides | `chip.uncertain.border` |

Semantic tokens MUST map to locked meaning before component overrides. Native clients map platform roles from semantic tier — not invent cousin-brand palettes.

**Governance:** GOV-104, GOV-110

### 3.8 Density system

Density is **cognitive**, not breakpoint-only:

| Mode | Spacing rhythm | Chrome | Information |
|------|----------------|--------|-------------|
| `density.capture` | Generous | Minimal | Focal only |
| `density.review` | Comfortable | Low | Scannable rows |
| `density.command` | Compact | Permitted | Results-dense |
| `density.brand` | Expressive | Sparse hero | Narrative |

Mode is selected by surface job and interaction tone — not form factor alone.

**Governance:** GOV-109

### 3.9 Dual theme contract

Light and dark themes MUST preserve semantic meaning. Theme is user preference plus system respect — not a separate product skin.

| Requirement | Contract |
|-------------|----------|
| Semantic parity | `color.action` means action in both themes |
| Hold visibility | Hold state readable in both themes |
| Contrast | Critical paths operable in both themes |

**Governance:** GOV-108, GOV-107, GOV-071

### 3.10 Composition philosophy

Layouts favor intentional asymmetry and breathing room over generic dashboard grids. Brand surfaces MAY be expressive; product surfaces stay disciplined.

Ritual spacing on product paths; Breath spacing on brand-only paths — cross-contamination is a visual defect.

**Governance:** GOV-106, GOV-091

### 3.11 Iconography contract

| Rule | Contract |
|------|----------|
| Critical paths | Icon + text or accessible name — not icon-only save, capture, delete |
| Semantic consistency | Same icon family for same verb across surfaces |
| Density | Legible at target mode; Command may be smaller than Breath |
| Status | Icon reinforces text — never replaces it alone |

**Governance:** GOV-111, GOV-071

### 3.12 Elevation contract

Elevation encodes **layer class** — not decoration:

| Layer | Use |
|-------|-----|
| Base | Breath capture, Scan review |
| Raised | Cards, EntityPresent |
| Overlay | OfferStack, HandBackControl |
| Veil | VeilGate — highest product focal layer |

Breath Catch surfaces MUST NOT add decorative elevation beyond Base layer.

**Governance:** GOV-109, GOV-032

### 3.13 Attention visual weight

Visual weight MUST mirror Ch 09 attention layers:

| Layer | Visual weight |
|-------|---------------|
| Focal | Anchor, Pulse, Veil consequence |
| Peripheral | Offers, Chips, secondary |
| Latent | Threads — not focal until Recall |

Latent elements MUST NOT animate into focal weight without user intent.

**Research:** RL-002 §User attention model

**Governance:** GOV-123, GOV-122

### 3.14 Anti-personality lock

Product surfaces MUST NOT adopt interchangeable SaaS personalities:

- Purple-oauth / cream-editorial defaults
- Glass-card-only dashboard aesthetic
- Generic gradient hero on product paths

AIIMIN visual identity is warm discipline — Human Momentum — not cold command aesthetic (Linear) nor decorative document chrome (Craft).

**Governance:** GOV-091, GOV-106, GOV-036

---

## 4. Canonical Rules

### §4.1 — Color and truth

**P8-R-163** — Color MUST encode semantic roles; decorative-only color on product surfaces MUST NOT ship.

**Referenced GOV IDs:** GOV-104, GOV-036

---

**P8-R-164** — Status MUST NOT rely on color alone; Hold and Settle MUST be visually distinct.

**Referenced GOV IDs:** GOV-087, GOV-104, GOV-132

---

**P8-R-165** — Locked palette accents MUST NOT change without explicit founder approval.

**Referenced GOV IDs:** GOV-036, GOV-104, GOV-081

---

### §4.2 — Typography and composition

**P8-R-166** — Typography MUST use approved role families; font buffet on product surfaces MUST NOT ship.

**Referenced GOV IDs:** GOV-105, GOV-090

---

**P8-R-167** — Product surfaces MUST favor intentional composition over generic dashboard grids; Ritual density MUST NOT leak onto Breath paths.

**Referenced GOV IDs:** GOV-106, GOV-091

---

### §4.3 — Contrast and theme

**P8-R-168** — Critical-path contrast MUST support operability in both themes; ND contrast floors defer to Accessibility Principles.

**Referenced GOV IDs:** GOV-107, GOV-071, GOV-108

---

**P8-R-169** — Light and dark themes MUST preserve semantic color meaning across all truth states.

**Referenced GOV IDs:** GOV-108, GOV-104

---

### §4.4 — Density and native

**P8-R-170** — Visual density MUST match cognitive tone (capture / review / command / brand) — not form factor alone.

**Referenced GOV IDs:** GOV-109

---

**P8-R-171** — Native clients MUST map platform roles from AIIMIN semantic tokens — not invent cousin-brand palettes.

**Referenced GOV IDs:** GOV-110, GOV-040

---

### §4.5 — Spacing, icons, tokens

**P8-R-172** — Spacing and layout rhythm MUST use the shared token architecture — not ad-hoc values on product surfaces.

**Referenced GOV IDs:** GOV-036, GOV-109

---

**P8-R-173** — Critical-path icons MUST pair with text or accessible labels.

**Referenced GOV IDs:** GOV-111, GOV-071

---

**P8-R-174** — Design tokens MUST flow primitive → semantic → component; semantic meaning MUST be stable across clients.

**Referenced GOV IDs:** GOV-104, GOV-110

---

## 5. Referenced GOV IDs

| GOV ID | Title | Status in P7 | Used in Ch 11 |
|--------|-------|--------------|---------------|
| GOV-032 | Progressive disclosure | Approved | Yes |
| GOV-036 | Palette lock | Approved | Yes |
| GOV-040 | Shared primitives | Approved | Yes |
| GOV-071 | Critical-path contrast | Needs Discussion | Yes |
| GOV-081 | Dead accent revival ban | Approved | Cross-ref |
| GOV-087 | No color-only status | Approved | Yes |
| GOV-090 | No font buffet | Approved | Yes |
| GOV-091 | No glass-card-only personality | Approved | Yes |
| GOV-104 | Semantic color roles | Approved | Yes |
| GOV-105 | Typography roles | Approved | Yes |
| GOV-106 | Composition | Approved | Yes |
| GOV-107 | Contrast ND | Needs Discussion | Yes |
| GOV-108 | Dual theme | Approved | Yes |
| GOV-109 | Density modes | Approved | Yes |
| GOV-110 | Native extends tokens | Approved | Yes |
| GOV-111 | Iconography | Approved | Yes |
| GOV-122 | One primary action | Approved | Cross-ref Ch 09 |
| GOV-123 | Reduce decisions | Approved | Yes |
| GOV-132 | Latency honesty | Approved | Yes |

---

## 6. Dependencies

### Depends on

| Dependency | Role |
|------------|------|
| Chapter 01 — Product Identity | Brand lock |
| Chapter 09 — Interaction System | Tones, truth states |
| Chapter 10 — Component System | Token consumers |

### Required by

| Consumer | Relationship |
|----------|--------------|
| Chapter 12 — Motion System | Motion respects visual layering |
| All clients | Semantic meaning parity |

---

## 7. Edge Cases

### EC-P8-1101 — Ritual density on Breath capture

**Condition:** Sparse hero spacing and display type on capture flow.

**Expected behavior:** Violates P8-R-170 and P8-R-167.

**Governance:** GOV-109, GOV-106

---

### EC-P8-1102 — Hold styled as Settle

**Condition:** Pending sync shows done color and checkmark.

**Expected behavior:** Violates P8-R-164.

**Governance:** GOV-132, GOV-087

---

### EC-P8-1103 — Native cousin palette

**Condition:** Native client invents a new accent hue outside AIIMIN semantic tokens.

**Expected behavior:** Violates P8-R-171.

**Governance:** GOV-110

---

### EC-P8-1104 — Command widgets on Today capture

**Condition:** Dashboard-density cards surround PulseInput.

**Expected behavior:** Violates P8-R-170.

**Governance:** GOV-109, GOV-123

---

## 8. Founder Decision Blocks

*No Founder Decision Blocks. GOV-107 ND numeric floors defer to Accessibility Principles without blocking visual architecture.*

---

## 9. Acceptance Criteria

| # | Criterion | Verification method |
|---|-----------|---------------------|
| AC-01 | No component/motion/interaction/nav redefinition | Ownership audit |
| AC-02 | Rules P8-R-163 through P8-R-174 sequential | Rule count = 12 |
| AC-03 | Every rule cites GOV ID from §5 | GOV traceability audit |
| AC-04 | Tone-to-density mapping present | Research alignment audit |
| AC-05 | Status FROZEN | Header check |

---

## Changelog

### 2026-07-22 — Frozen v1.0 (Subsystem Batch 4)

- **What:** Final constitutional audit (platform independence, testability, vocabulary, ownership, research, leakage). Freeze header/footer.
- **Status:** FROZEN


### 2026-07-22 — Authoritative rewrite from Interaction Research

- **What:** Full rewrite. Truth-state visual contracts, tone-to-density mapping, token architecture, anti-personality lock. P8-R-163…174 retained with research-aligned semantics.
- **Why:** Prior draft listed tokens without Exhale Interaction truth semantics.
- **Research:** RL-002, RL-004
- **Status:** superseded

---

## Freeze Summary

**Status:** Frozen

**Subsystem:** Batch 4 — Interaction Layer (Ch 09–12)

**Canonical Rules:** 12 (P8-R-163…174)

**Referenced GOV IDs:** 19

**Founder Decision Blocks:** 0 in-chapter

**Research Layer:** RL-002, RL-004 REFERENCED

**Known Dependencies:**

- Chapter 01 — Product Identity
- Chapter 09 — Interaction System
- Chapter 10 — Component System

**Architecture Review:** PASS

**Governance Traceability:** PASS

**Final Constitutional Audit:** PASS (01–10)

**Ready for Implementation:** YES (pending open Founder Decision Blocks / ADR-P8-001 from prior subsystems)
