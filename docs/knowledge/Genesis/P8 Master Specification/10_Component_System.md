# Chapter 10 — Component System

| Field | Value |
|-------|-------|
| **Status** | FROZEN |
| **Version** | P8 v1.0 |
| **Chapter** | 10 — Component System |
| **Subsystem** | Batch 4 — Interaction Layer (with Ch 09, Ch 11, Ch 12) |
| **Approval** | Founder Approved — Final Constitutional Audit PASS |
| **Last Modified** | 2026-07-22 |
| **Supersedes** | P8 v0.2-draft |

This chapter is normative.

Any modification requires a Founder ADR.

```yaml
chapter: 10
title: Component System
p8_version: P8 v1.0
status: FROZEN
authored: 2026-07-22
governance_source: P7 Governance v1.0 (FROZEN)
research_source:
  - P8 Research/Interaction_Language.md (RL-002)
  - P8 Research/Interaction_Grammar.md (RL-003)
depends_on:
  - Chapter 01 — Product Identity (FROZEN v1.0)
  - Chapter 09 — Interaction System (FROZEN v1.0)
architectural_question: "What building blocks implement interaction law — and what are their contracts?"
```

---

## 1. Purpose

Define **canonical component architecture**: families, responsibilities, contracts, composition rules, mandatory states, lifecycle boundaries, and accessibility obligations.

Components are the structural layer that implements Chapter 09 interaction law. This chapter owns **what each family MUST do** — not how it looks, how it moves, or where it sits on a page.

---

## 2. Scope

### Includes

- Canonical component families mapped to interaction nouns
- Component contracts (inputs, outputs, states, a11y)
- Composition and variant philosophy
- State ownership boundaries
- Component lifecycle obligations
- Accessibility obligations in component contracts
- Canonical rules `P8-R-151`…`P8-R-162`

### Excludes

| Topic | Owner |
|-------|-------|
| Interaction state machine, grammar | Chapter 09 — Interaction System |
| Color, typography, spacing values | Chapter 11 — Visual System |
| Transitions, duration, easing | Chapter 12 — Motion System |
| Routes, shells | Chapter 04 — Navigation |
| Surface I/O contracts | Chapter 08 — Surface Specifications |

---

## 3. Canonical Model

### 3.1 Primitive contract (cross-ref)

Chapter 01 defines **Primitive** as the shared interaction contract across clients. Every canonical component family MUST implement that contract — not reinterpret it per platform.

**Governance:** GOV-020, GOV-040, GOV-046

### 3.2 Behavior before appearance

Every canonical component MUST declare, in writing, before visual styling:

| Contract field | Content |
|----------------|---------|
| **Purpose** | Which interaction sentence(s) it implements |
| **Inputs** | Data and events it accepts |
| **Outputs** | Events and state changes it emits |
| **Mandatory states** | States relevant to its job |
| **Accessibility** | Labels, roles, focus, hit targets |

Components without declared contracts MUST NOT ship.

**Governance:** GOV-142

### 3.3 Canonical families

Families map interaction nouns (Ch 09 §3.3) to reusable structure. This list is **normative, not exhaustive** — new families require second demonstrated demand (§3.10).

| Family | Interaction noun | Responsibility |
|--------|------------------|----------------|
| **PulseInput** | Pulse | Receive raw intent; primary Catch commit; Breath tone |
| **AnchorControl** | Anchor | Declare and render the single primary action |
| **OfferStack** | Offer | Present peripheral inferred structure post-Settle |
| **CorrectionChip** | Chip | One field or link per chip; Adjust without form maze |
| **HoldSurface** | Hold | Honest pending — sync, inference, durability |
| **SettleAck** | Settle | Brief truthful acknowledgment; not celebration theater |
| **HandBackControl** | Hand-back | Undo, revert, recover without shame copy |
| **VeilGate** | Veil | Branded high-stakes confirm; blocks Knocks |
| **EntityPresent** | — | Scannable object row/card for Recall and Orient |
| **EmptyCoach** | — | Teach next valid sentence; no shame |
| **CommandSurface** | Recall (command) | Palette/logger routing shell; Command tone |
| **KnockCard** | Knock | Provenance, single action, dismiss — one focal turn |
| **ThreadHint** | Thread | Peripheral connection chip; dismissible at ingress |

Navigation chrome components bind routes per Chapter 04 — contracts here; route binding there.

**Research:** RL-002 §Nouns; RL-003 §Universal patterns

**Governance:** GOV-144, GOV-148, GOV-150

### 3.4 One primitive owner

Each interaction noun MUST map to exactly one owning family. Duplicate families with divergent behavior for the same noun MUST NOT ship.

| Noun | Owner | Forbidden duplicate |
|------|-------|---------------------|
| Chip | CorrectionChip | Per-domain chip variants with different Adjust behavior |
| Pulse | PulseInput | Logger-specific input with different Catch contract |
| Veil | VeilGate | Browser confirm or generic modal |

**Governance:** GOV-143

### 3.5 Mandatory states

Every interactive family MUST implement all states relevant to its job:

| State | When required |
|-------|---------------|
| **Default** | Always |
| **Focus / hover** | Focus always where focus exists; pointer-hover only where modality supports it |
| **Disabled** | When action unavailable |
| **Loading** | When awaiting async resolution |
| **Pending (Hold)** | When durability incomplete |
| **Error** | When operation failed honestly |
| **Empty** | When no content and next action teachable |
| **Uncertain** | When Offer confidence is low (CorrectionChip, OfferStack) |

Missing mandatory states = incomplete component.

**Governance:** GOV-144

### 3.6 Family-specific contracts

#### PulseInput

| Field | Contract |
|-------|----------|
| Purpose | Implement `Human · Catch · Pulse · Settle` |
| Inputs | Text, voice trigger, attachment reference |
| Outputs | Pulse committed, Drift draft saved |
| States | Default, loading (brief), error, disabled |
| A11y | Named field; Anchor reachable; primary commit action commits Catch |
| Invariant | MUST NOT wrap in ceremony that delays primary Catch commit |

#### CorrectionChip

| Field | Contract |
|-------|----------|
| Purpose | Implement `Adjust(chipᵢ)` |
| Inputs | Field key, proposed value, confidence band |
| Outputs | Adjust committed, Dismiss |
| States | Default, uncertain (soft), focus, disabled |
| A11y | Chip name includes field and value; reachable via available focus modality |
| Invariant | One chip = one field or link; Adjust MUST NOT clear unrelated Offers |

#### VeilGate

| Field | Contract |
|-------|----------|
| Purpose | Implement `Act · Destruct · Veil · Confirm · Settle` |
| Inputs | Consequence copy, scope, stakes level |
| Outputs | Confirm, Hand-back (before confirm only) |
| States | Open (focal), typed-confirm (peak stakes) |
| A11y | Focus trap with explicit exit; consequence announced |
| Invariant | MUST block Knocks and secondary Anchors while open |

#### HoldSurface

| Field | Contract |
|-------|----------|
| Purpose | Implement honest Hold |
| Inputs | Hold reason (sync, inference, durability) |
| Outputs | Resolved → SettleAck |
| States | Holding, resolved, failed-honest |
| A11y | Status announced; not aria-hidden while holding |
| Invariant | MUST NOT use success styling while holding |

#### HandBackControl

| Field | Contract |
|-------|----------|
| Purpose | Implement recovery transient |
| Inputs | Recoverable action reference, undo window |
| Outputs | Hand-back executed |
| States | Available, expired, unavailable (post-Veil) |
| A11y | Action named "Undo" or domain verb — not fear copy |
| Invariant | MUST NOT require confirm to undo recoverable act |

#### KnockCard

| Field | Contract |
|-------|----------|
| Purpose | Implement `Knock → Dismiss \| Act` |
| Inputs | Suggestion, provenance, confidence, single action |
| Outputs | Dismiss, Act |
| States | Default, dismissed (latent for session) |
| A11y | Provenance readable; dismiss always reachable |
| Invariant | One focal turn; no chain to second Knock |

**Research:** RL-003 §Canonical correction, §Canonical AI intervention, §Canonical waiting state

**Governance:** GOV-126, GOV-148, GOV-065

### 3.7 Composition over configuration

Families MUST compose via slots and children — not boolean-prop matrices encoding every surface variant.

| Pattern | Permitted | Forbidden |
|---------|-----------|-----------|
| PulseInput + OfferStack | Yes | — |
| EntityPresent + CorrectionChip row | Yes | — |
| MegaSurface with 40 boolean props | — | Yes |
| Wrapper that adds steps before PulseInput save | — | Yes |

**Governance:** GOV-146, GOV-032

### 3.8 Capture families are sacred

PulseInput, CommandSurface catch-from-command paths, and any family implementing Catch MUST NOT be wrapped in components that insert steps before Settle.

Forbidden wrappers: onboarding coach marks before first save; multi-step intro; modal gates before raw Pulse.

**Governance:** GOV-148, GOV-066

### 3.9 Read surfaces stay Scan

EntityPresent, OfferStack on review surfaces, and ThreadHint MUST default to Scan tone behavior: Command-density chrome MUST NOT be the default. Scan tone presentation is the default for review families.

**Governance:** GOV-149, GOV-109

### 3.10 Extract on second demand

A pattern becomes a canonical family only after **two demonstrated demands** with identical contract. Premature abstraction before second demand MUST NOT ship.

**Governance:** GOV-145

### 3.11 State ownership

| State class | Owner |
|-------------|-------|
| Domain truth | Server / sync layer (Chapter 05) |
| View selection, ephemeral UI | Surface coordinator |
| Component chrome | Component local state |
| AI suggestion presentation | Component + Chapter 07 contract |

Components MUST NOT own durable domain truth. Components MUST NOT silently mutate domain truth without emitting interaction events per Ch 09 contracts.

**Governance:** GOV-142, GOV-046

### 3.12 Variant philosophy

Variants express **semantic job** — not arbitrary visual skins:

| Variant | Job | Tone |
|---------|-----|------|
| `capture` | Ingress | Breath |
| `review` | Scan surfaces | Scan |
| `command` | Palette, search | Command |
| `brand` | Brand surfaces only | Ritual |

Density variant follows cognitive mode (cross-ref Ch 11) — not breakpoint alone.

**Governance:** GOV-109, GOV-104

### 3.13 Component lifecycle

| Phase | Obligation |
|-------|------------|
| **Mount** | Restore focus policy per surface; announce if Hold active |
| **Update** | Preserve Chip identity across Offer refresh where possible |
| **Unmount** | Return focus per a11y contract; persist Drift draft if Pulse in flight |
| **Destroy** | No orphaned Hand-back promises; Veil MUST resolve before destroy |

### 3.14 Accessibility contracts

Every family MUST ship:

- Accessible name (visible text or `aria-label` equivalent)
- Role appropriate to interaction job
- Focus order contribution per Ch 09 §3.14
- Minimum hit target on critical paths
- Focus return after VeilGate and CommandSurface close
- State change announcements for Settle, Hold, Error

Accessibility obligations ship in the component contract — not as consumer afterthought.

**Governance:** GOV-147, GOV-133, GOV-071

---

## 4. Canonical Rules

### §4.1 — Contracts

**P8-R-151** — Every canonical family MUST declare purpose, inputs, outputs, mandatory states, and accessibility obligations before styling.

**Referenced GOV IDs:** GOV-142

---

**P8-R-152** — Each interaction noun MUST map to exactly one owning family; duplicate primitives with divergent behavior MUST NOT ship.

**Referenced GOV IDs:** GOV-143

---

**P8-R-153** — Interactive families MUST implement all mandatory states relevant to their job, including Hold and Uncertain where applicable.

**Referenced GOV IDs:** GOV-144

---

### §4.2 — Composition and extraction

**P8-R-154** — Families MUST compose via slots and children — not configuration-explosion prop matrices.

**Referenced GOV IDs:** GOV-146

---

**P8-R-155** — Canonical families MUST be extracted only on second demonstrated demand with identical contract.

**Referenced GOV IDs:** GOV-145

---

### §4.3 — Sacred capture and correction

**P8-R-156** — PulseInput and Catch-implementing families MUST NOT be wrapped in ceremony that delays primary Catch commit.

**Referenced GOV IDs:** GOV-148, GOV-066

---

**P8-R-157** — CorrectionChip MUST enforce one chip per field or link; Adjust MUST NOT open multi-step form mazes.

**Referenced GOV IDs:** GOV-126, GOV-051

---

### §4.4 — Scan read and navigation

**P8-R-158** — Review families (EntityPresent, OfferStack on Scan surfaces) MUST default to Scan tone; Command-density chrome MUST NOT be the default on those families.

**Referenced GOV IDs:** GOV-149, GOV-109

---

**P8-R-159** — Navigation chrome families MUST bind routes per Chapter 04 — not redefine navigation law.

**Referenced GOV IDs:** GOV-150, GOV-012

---

### §4.5 — Ownership, variants, and honesty

**P8-R-160** — Components MUST NOT own durable domain truth or silently mutate it without interaction events.

**Referenced GOV IDs:** GOV-142, GOV-046

---

**P8-R-161** — Variants MUST express semantic job (capture / review / command / brand) — not arbitrary skins.

**Referenced GOV IDs:** GOV-109, GOV-104

---

**P8-R-162** — HoldSurface MUST present Hold honestly; EmptyCoach MUST teach the next valid sentence without shame copy.

**Referenced GOV IDs:** GOV-067, GOV-030, GOV-132

---

## 5. Referenced GOV IDs

| GOV ID | Title | Status in P7 | Used in Ch 10 |
|--------|-------|--------------|---------------|
| GOV-012 | Navigation locks | Approved | Cross-ref |
| GOV-020 | Primitive surfaces | Approved | Yes |
| GOV-032 | Progressive disclosure | Approved | Yes |
| GOV-040 | Shared primitives | Approved | Yes |
| GOV-046 | Shared interaction contract | Approved | Yes |
| GOV-051 | Inference correctable | Approved | Yes |
| GOV-066 | Ceremony-free save | Approved | Yes |
| GOV-067 | Empty states teach | Approved | Yes |
| GOV-071 | Critical-path operability | Needs Discussion | Yes |
| GOV-104 | Semantic color roles | Approved | Cross-ref Ch 11 |
| GOV-109 | Density modes | Approved | Yes |
| GOV-126 | Infer then chip | Approved | Yes |
| GOV-132 | Latency honesty | Approved | Yes |
| GOV-133 | Accessibility interaction quality | Approved | Cross-ref Ch 09 |
| GOV-142 | Behavior contracts first | Approved | Yes |
| GOV-143 | One primitive owner | Approved | Yes |
| GOV-144 | Mandatory states | Approved | Yes |
| GOV-145 | Extract on second demand | Approved | Yes |
| GOV-146 | Composition over config | Approved | Yes |
| GOV-147 | Accessibility in API | Approved | Yes |
| GOV-148 | Capture components sacred | Approved | Yes |
| GOV-149 | Read calm | Approved | Yes |
| GOV-150 | Navigation components | Approved | Yes |

---

## 6. Dependencies

### Depends on

| Dependency | Role |
|------------|------|
| Chapter 09 — Interaction System | Nouns, contracts, state machine |
| Chapter 06 — Capture System | Catch sacred rule |
| Chapter 08 — Surface Specifications | Surface jobs, tone selection |

### Required by

| Consumer | Relationship |
|----------|--------------|
| Chapter 11 — Visual System | Tokens style families |
| Chapter 12 — Motion System | Motion applies to family state transitions |

---

## 7. Edge Cases

### EC-P8-1001 — Mega-component with boolean prop matrix

**Condition:** Single family encodes all surface variants via props.

**Expected behavior:** Violates P8-R-154; refactor to composition.

**Governance:** GOV-146

---

### EC-P8-1002 — Onboarding wrapper on PulseInput

**Condition:** Capture wrapped in multi-step coach marks before save.

**Expected behavior:** Violates P8-R-156.

**Governance:** GOV-148

---

### EC-P8-1003 — HoldSurface with success styling

**Condition:** Hold displays checkmark and "Saved" while sync pending.

**Expected behavior:** Violates P8-R-162.

**Governance:** GOV-132

---

### EC-P8-1004 — Per-domain CorrectionChip behavior drift

**Condition:** Finance chip opens modal; journal chip inline-edits.

**Expected behavior:** Violates P8-R-152.

**Governance:** GOV-143, GOV-126

---

## 8. Founder Decision Blocks

*No Founder Decision Blocks. Component law is deterministic from governance and Chapter 09 interaction contracts.*

---

## 9. Acceptance Criteria

| # | Criterion | Verification method |
|---|-----------|---------------------|
| AC-01 | No color/type/motion/nav/layout redefinition | Ownership audit |
| AC-02 | Rules P8-R-151 through P8-R-162 sequential | Rule count = 12 |
| AC-03 | Every rule cites GOV ID from §5 | GOV traceability audit |
| AC-04 | Families map to Ch 09 nouns | Terminology audit |
| AC-05 | Status FROZEN | Header check |

---

## Changelog

### 2026-07-22 — Frozen v1.0 (Subsystem Batch 4)

- **What:** Final constitutional audit (platform independence, testability, vocabulary, ownership, research, leakage). Freeze header/footer.
- **Status:** FROZEN


### 2026-07-22 — Authoritative rewrite from Interaction Research

- **What:** Full rewrite. Canonical families tied to interaction nouns; per-family contracts; lifecycle and a11y. P8-R-151…162 retained with research-aligned semantics.
- **Why:** Prior draft listed generic families without Exhale Interaction mapping.
- **Research:** RL-002, RL-003
- **Status:** superseded

---

## Freeze Summary

**Status:** Frozen

**Subsystem:** Batch 4 — Interaction Layer (Ch 09–12)

**Canonical Rules:** 12 (P8-R-151…162)

**Referenced GOV IDs:** 23

**Founder Decision Blocks:** 0 in-chapter

**Research Layer:** RL-002, RL-003 REFERENCED

**Known Dependencies:**

- Chapter 09 — Interaction System
- Chapter 06 — Capture System
- Chapter 08 — Surface Specifications

**Architecture Review:** PASS

**Governance Traceability:** PASS

**Final Constitutional Audit:** PASS (01–10)

**Ready for Implementation:** YES (pending open Founder Decision Blocks / ADR-P8-001 from prior subsystems)
