# Chapter 12 — Motion System

| Field | Value |
|-------|-------|
| **Status** | FROZEN |
| **Version** | P8 v1.0 |
| **Chapter** | 12 — Motion System |
| **Subsystem** | Batch 4 — Interaction Layer (with Ch 09, Ch 10, Ch 11) |
| **Approval** | Founder Approved — Final Constitutional Audit PASS |
| **Last Modified** | 2026-07-22 |
| **Supersedes** | P8 v0.2-draft |

This chapter is normative.

Any modification requires a Founder ADR.

```yaml
chapter: 12
title: Motion System
p8_version: P8 v1.0
status: FROZEN
authored: 2026-07-22
governance_source: P7 Governance v1.0 (FROZEN)
research_source:
  - P8 Research/Interaction_Grammar.md (RL-003)
  - P8 Research/Interaction_Decision_Matrix.md (RL-004)
depends_on:
  - Chapter 09 — Interaction System (FROZEN v1.0)
  - Chapter 10 — Component System (FROZEN v1.0)
  - Chapter 11 — Visual System (FROZEN v1.0)
architectural_question: "How may AIIMIN move without delaying truth or breaking grammar?"
```

---

## 1. Purpose

Define **motion architecture**: motion contracts, motion laws, timing bands, continuity rules, interruptibility, reduced-motion obligations, and capture latency guarantees.

Motion clarifies state change after truth is known. It MUST NOT gate Catch, delay Settle, or disguise Hold. This chapter owns **when and why things may move** — not interaction logic, component ownership, or visual token values.

---

## 2. Scope

### Includes

- Motion purpose allowlist tied to interaction states
- Motion laws and invariants
- Duration bands and easing families
- Continuity and spatial orientation
- Interruptibility of in-flight motion
- Reduced motion contracts
- Capture latency guarantees
- Loading and Hold motion honesty
- Canonical rules `P8-R-175`…`P8-R-186`

### Excludes

| Topic | Owner |
|-------|-------|
| Interaction state machine, grammar | Chapter 09 — Interaction System |
| Component contracts, mandatory states | Chapter 10 — Component System |
| Color, type, elevation tokens | Chapter 11 — Visual System |
| Capture pipeline | Chapter 06 — Capture System |

---

## 3. Canonical Model

### 3.1 Motion philosophy — after truth

Motion in AIIMIN follows **grammar rhythm** (RL-003):

| Rhythm | Motion character | When |
|--------|------------------|------|
| **Exhale** | Immediate or absent | Catch, Settle, Hand-back, Dismiss |
| **Silence** | No system focal motion | Breath Catch, honest Hold, Chip Adjust |
| **Inhale** | Short orienting motion | Veil open, Orient on high-stakes recall |
| **Acknowledge** | Brief proportional | Complete, micro-wins |

**Perform → Settle** is forbidden: motion MUST NOT complete before raw Settle on capture path.

**Research:** RL-003 §Interaction rhythm; RL-004 Motion vs Latency

**Governance:** GOV-116, GOV-066, GOV-063

### 3.2 Motion laws

| Law | Statement |
|-----|-----------|
| **Law of After-Settle** | Motion on capture path MUST begin after Settle — never before |
| **Law of Honest Hold** | Hold motion indicates pending — never success choreography |
| **Law of One Motion** | One primary motion per moment — no stacked competing motion |
| **Law of Interruptibility** | New user intent cancels non-critical in-flight motion |
| **Law of Meaning Without Animation** | Reduced motion MUST preserve state change legibility |
| **Law of Proportional Celebration** | Complete acknowledgment matches stakes — no casino on Scan surfaces |
| **Law of Platform Body** | Standard navigation physics follow OS — not reinvented |

### 3.3 Motion purpose allowlist

Motion MUST serve at least one allowlisted purpose:

| Purpose | Interaction anchor | Example |
|---------|-------------------|---------|
| **Feedback** | Settle, Hand-back, Dismiss | Brief ack after commit |
| **Continuity** | Recall → Orient, route change | Spatial where model supports |
| **Hierarchy** | Veil open, Offer appear | Elevation change |
| **State** | Hold → Settle resolve | Pending to done transition |
| **Orient** | Command results, deep link | Where user landed |

Decorative motion with no allowlisted purpose MUST NOT ship on product surfaces. Idle "AI breathing" glow is forbidden.

**Governance:** GOV-054, GOV-112, GOV-063

### 3.4 Motion sentences (interaction-state binding)

Motion MUST bind to interaction states — not arbitrary UI events:

| State transition | Motion permitted | Motion forbidden |
|------------------|------------------|------------------|
| Catch → Settle | None or instant | Pre-save animation |
| Settle → Offer | Peripheral fade-in | Focal bounce blocking Adjust |
| Adjust → Commit | Subtle chip settle | Multi-step transition |
| Settle ↔ Hold | Honest pending indicator | Success confetti |
| Act → Veil | Short inhale open | Delay before consequence visible |
| Veil → Settle | Close + brief ack | Celebration on destructive |
| Hand-back | Instant or productivity-band revert | Fear/shake animation |
| Knock present | Peripheral only; MUST NOT steal Anchor focal attention | Focal attention competition with Anchor |
| Complete | Proportional ack within stakes band | Casino / streak explosion on Scan |

**Research:** RL-003 §Canonical completion, §Canonical waiting state

**Governance:** GOV-116, GOV-119, GOV-055

### 3.5 Duration bands

| Band | Range | Use |
|------|-------|-----|
| **Instant** | 0ms | Catch → Settle; reduced-motion default |
| **Productivity** | ~150–250ms | Feedback, chip, overlay, Hand-back |
| **Orient** | ~250–400ms | Route continuity where supported |
| **Ritual** | >400ms | Brand surfaces only; capture path unaffected |

Longer motion MUST justify allowlisted purpose. Productivity paths MUST NOT exceed Orient band without Founder exception.

**Governance:** GOV-113, GOV-063, GOV-054

### 3.6 Easing families

| Family | Character | Use |
|--------|-----------|-----|
| **Productivity** | Restrained ease-out | Feedback, state, Hand-back |
| **Orient** | Ease-in-out | Spatial continuity |
| **Ritual** | Expressive | Brand only |

Bouncy default easing on productivity paths MUST NOT ship.

**Governance:** GOV-117, GOV-119

### 3.7 Preferred properties

Transitions MUST prefer **opacity and transform** as primary animated properties. Layout-geometry animation MUST NOT be used for frequent state transitions.

**Governance:** GOV-114, GOV-072

### 3.8 Motion budget

| Rule | Contract |
|------|----------|
| One primary motion | Per moment — aligns with one Anchor |
| No cascade | Knock MUST NOT chain motion into second Knock |
| Breath silence | No ambient motion on PulseInput during Catch |
| Hold honesty | Spinner/skeleton only — not decorative loop |

**Governance:** GOV-115, GOV-122

### 3.9 Capture latency guarantee

**Hard guarantee:** Primary Catch commit (and equivalent Catch commits on any modality) MUST NOT wait for animation completion.

| Path | Guarantee |
|------|-----------|
| PulseInput primary commit | Settle fires on commit action — motion follows |
| Voice / photo / structured Catch | Settle on ingest ack — motion follows |
| Command Catch | Same grammar — no extra motion gate |

Violation of capture latency guarantee is a motion defect and interaction defect (cross-ref P8-R-179, Ch 09 non-negotiables).

**Governance:** GOV-116, GOV-066, GOV-148

### 3.10 Continuity

Route transitions MUST preserve spatial continuity when the navigation model defines it (Chapter 04). Instant cuts are permitted when continuity is undefined.

OfferStack and KnockCard motion MUST originate from a logical Anchor-related origin — not an arbitrary spatial origin.

**Governance:** GOV-120, GOV-150

### 3.11 Loading and Hold motion

| Hold type | Motion contract | Forbidden |
|-----------|-----------------|-----------|
| Sync hold | Honest indicator | Progress at 100% while holding |
| Inference hold | Pending indicator only | Identity glow / decorative AI motion |
| Durability hold | Skeleton or spinner | Fake Settle animation |

Loading motion MUST reflect real pending work — not mask latency or fake completion.

**Governance:** GOV-121, GOV-132, GOV-089

### 3.12 Reduced motion contract

When `prefers-reduced-motion` or OS equivalent is active:

| Requirement | Contract |
|-------------|----------|
| Duration | Instant band for productivity paths |
| State change | Non-animated cue required (text, icon, border) |
| Meaning | Settle, Hold, Error, Veil MUST remain perceptible |
| Ritual | May simplify further — never block capture |

Reduced motion is not "disable all feedback" — it is **instant truth with alternate cue**.

**Governance:** GOV-072, GOV-063

### 3.13 Interruptibility

| Motion class | On new user intent |
|--------------|-------------------|
| Non-critical (Offer fade, Knock slide) | Cancel immediately |
| Feedback in flight | Complete or snap to end state |
| Veil open | MUST NOT be stolen — explicit confirm or Hand-back only |
| Breath Catch | No motion to interrupt — silence |

Protected focus and Veil states MUST NOT be stolen by ambient animation.

**Governance:** GOV-033, GOV-115

### 3.14 Platform vernacular

System sheet behavior, back transitions, and platform navigation physics MUST be respected. Reinvented physics for standard navigation MUST NOT ship.

AIIMIN meaning (Settle honesty, Hand-back) MUST persist inside platform motion idioms.

**Governance:** GOV-118, GOV-134

### 3.15 Celebration proportional

| Stakes | Motion |
|--------|--------|
| Micro-complete (habit tick) | Subtle — productivity band |
| Meaningful milestone | Orient band — Scan tone only |
| Brand ritual | Ritual band — brand surfaces only |

Gamification motion (streaks, confetti, casino) on Scan surfaces MUST NOT ship.

**Governance:** GOV-119, GOV-109, GOV-055

---

## 4. Canonical Rules

### §4.1 — Purpose and capture guarantee

**P8-R-175** — Motion MUST serve an allowlisted purpose; decorative-only motion on product surfaces MUST NOT ship.

**Referenced GOV IDs:** GOV-054, GOV-112, GOV-063

---

**P8-R-176** — Productivity-band transitions MUST complete within 250ms; Ritual band MUST NOT delay Catch Settle latency.

**Referenced GOV IDs:** GOV-113, GOV-063

---

### §4.2 — Properties and budget

**P8-R-177** — Transitions MUST use opacity and/or transform as primary animated properties; layout-geometry animation MUST NOT be used for frequent state transitions.

**Referenced GOV IDs:** GOV-114, GOV-072

---

**P8-R-178** — Surfaces MUST NOT stack competing primary motions in one moment.

**Referenced GOV IDs:** GOV-115, GOV-122

---

### §4.3 — Capture sacred and easing

**P8-R-179** — Motion MUST NOT delay Catch Settle or insert pre-Settle ceremony; primary Catch commit MUST NOT wait for animation.

**Referenced GOV IDs:** GOV-116, GOV-066, GOV-148

---

**P8-R-180** — Productivity-path easing MUST stay restrained; Ritual easing MAY be expressive on brand surfaces only.

**Referenced GOV IDs:** GOV-117, GOV-119

---

### §4.4 — Platform and orientation

**P8-R-181** — Platform motion idioms MUST be respected; reinvented physics for standard navigation MUST NOT ship.

**Referenced GOV IDs:** GOV-118, GOV-134

---

**P8-R-182** — When the navigation model defines spatial continuity, route transitions MUST preserve it; otherwise instant cut is permitted.

**Referenced GOV IDs:** GOV-120, GOV-150

---

### §4.5 — Honesty, accessibility, celebration

**P8-R-183** — Hold and loading motion MUST reflect real pending state — not mask latency or fake success.

**Referenced GOV IDs:** GOV-121, GOV-132, GOV-089

---

**P8-R-184** — Reduced-motion preferences MUST be honored with instant state and non-animated equivalents for meaning.

**Referenced GOV IDs:** GOV-072, GOV-063

---

**P8-R-185** — User intent MUST interrupt non-critical in-flight motion; Veil and protected focus MUST NOT be stolen.

**Referenced GOV IDs:** GOV-033, GOV-115

---

**P8-R-186** — Celebration motion MUST be proportional to stakes; casino motion on Scan surfaces MUST NOT ship.

**Referenced GOV IDs:** GOV-119, GOV-109, GOV-055

---

## 5. Referenced GOV IDs

| GOV ID | Title | Status in P7 | Used in Ch 12 |
|--------|-------|--------------|---------------|
| GOV-033 | Interruptibility | Approved | Yes |
| GOV-054 | Motion serves emotional triad | Approved | Yes |
| GOV-055 | Anti-casino motion | Approved | Yes |
| GOV-063 | Animation communicates meaning | Approved | Yes |
| GOV-066 | Ceremony-free save | Approved | Cross-ref |
| GOV-072 | Reduced motion honored | Approved | Yes |
| GOV-089 | Honest loading/sync | Approved | Yes |
| GOV-109 | Density modes | Approved | Yes |
| GOV-112 | Motion allowlist | Approved | Yes |
| GOV-113 | Duration band | Needs Discussion | Yes |
| GOV-114 | Opacity/transform preferred | Approved | Yes |
| GOV-115 | Motion budget | Approved | Yes |
| GOV-116 | Never delay capture | Approved | Yes |
| GOV-117 | Easing family | Approved | Yes |
| GOV-118 | Platform vernacular | Approved | Yes |
| GOV-119 | Celebration proportional | Approved | Yes |
| GOV-120 | Page transitions orient | Approved | Yes |
| GOV-121 | Loading honesty | Approved | Yes |
| GOV-122 | One primary action | Approved | Cross-ref Ch 09 |
| GOV-132 | Latency honesty | Approved | Cross-ref Ch 09 |
| GOV-134 | Device gestures | Approved | Cross-ref Ch 09 |
| GOV-148 | Capture sacred | Approved | Cross-ref Ch 10 |
| GOV-150 | Navigation components | Needs Discussion | Yes |

---

## 6. Dependencies

### Depends on

| Dependency | Role |
|------------|------|
| Chapter 09 — Interaction System | States, rhythm, non-negotiables |
| Chapter 10 — Component System | Family state transitions |
| Chapter 11 — Visual System | Layering, elevation |

### Required by

| Consumer | Relationship |
|----------|--------------|
| All clients | Motion parity on meaning |
| Chapter 13+ | Platform specs consume motion law |

---

## 7. Edge Cases

### EC-P8-1201 — Pre-save animation on capture

**Condition:** Capture requires animation completion before Settle.

**Expected behavior:** Violates P8-R-179 and Ch 09 non-negotiables.

**Governance:** GOV-116

---

### EC-P8-1202 — Reduced motion hides state change

**Condition:** User enables reduced motion; Settle success invisible.

**Expected behavior:** Violates P8-R-184 — non-animated cue required.

**Governance:** GOV-072

---

### EC-P8-1203 — Hold progress at 100%

**Condition:** Progress animation completes while sync still pending.

**Expected behavior:** Violates P8-R-183.

**Governance:** GOV-132, GOV-121

---

### EC-P8-1204 — Streak confetti on Today review

**Condition:** Habit complete triggers casino motion on Scan surface.

**Expected behavior:** Violates P8-R-186.

**Governance:** GOV-119, GOV-055

---

## 8. Founder Decision Blocks

*No Founder Decision Blocks. GOV-113 duration band uses governance default without blocking architecture.*

---

## 9. Acceptance Criteria

| # | Criterion | Verification method |
|---|-----------|---------------------|
| AC-01 | No interaction/component/visual/surface redefinition | Ownership audit |
| AC-02 | Rules P8-R-175 through P8-R-186 sequential | Rule count = 12 |
| AC-03 | Every rule cites GOV ID from §5 | GOV traceability audit |
| AC-04 | Motion bound to interaction states | Research alignment audit |
| AC-05 | Capture latency guarantee stated | Rule audit |
| AC-06 | Status FROZEN | Header check |

---

## 10. Final Constitutional Audit (Batch 4 Freeze)

| # | Audit | Result |
|---|-------|--------|
| 01 | Platform independence | PASS — modality-agnostic; no form-factor assumption |
| 02 | Testability | PASS — rules use MUST / MUST NOT / only-when; soft SHOULD scrubbed from rules |
| 03 | Vocabulary | PASS — Catch ≠ Capture locked; one meaning per noun |
| 04 | Derivability | PASS — five designers can derive same sentences from state machine + grammar refs |
| 05 | Engineering determinism | PASS — contracts and invariants leave no interpretation gap |
| 06 | Rule quality P8-R-139…186 | PASS — 48 sequential unique; no contradictions found |
| 07 | Ownership | PASS — 09 interaction / 10 component / 11 visual / 12 motion |
| 08 | Research | PASS — RL-001…004 referenced, not copied |
| 09 | Implementation leakage | PASS — no framework / data-layer / UI-library wiring |
| 10 | Frozen compatibility Ch 01–08 | PASS — cross-ref only; ADR-P8-001 unchanged |

**Open ADRs:** ADR-P8-001 (Ch 01 §2 stale pointers)

**Open Founder Decision Blocks:** FB-P8-001, 005, 007–012 (prior subsystems)

**Subsystem status:** FROZEN v1.0

---

## Changelog

### 2026-07-22 — Frozen v1.0 (Subsystem Batch 4)

- **What:** Final constitutional audit (platform independence, testability, vocabulary, ownership, research, leakage). Freeze header/footer.
- **Status:** FROZEN


### 2026-07-22 — Authoritative rewrite from Interaction Research

- **What:** Full rewrite. Motion laws, state-bound motion sentences, capture latency guarantee, grammar rhythm. P8-R-175…186 retained with research-aligned semantics. Subsystem audit updated.
- **Why:** Prior draft listed generic motion rules without interaction-state binding.
- **Research:** RL-003, RL-004
- **Status:** superseded

---

## Freeze Summary

**Status:** Frozen

**Subsystem:** Batch 4 — Interaction Layer (Ch 09–12)

**Canonical Rules:** 12 (P8-R-175…186)

**Referenced GOV IDs:** 23

**Founder Decision Blocks:** 0 in-chapter

**Research Layer:** RL-003, RL-004 REFERENCED

**Known Dependencies:**

- Chapter 09 — Interaction System
- Chapter 10 — Component System
- Chapter 11 — Visual System

**Architecture Review:** PASS

**Governance Traceability:** PASS

**Final Constitutional Audit:** PASS (01–10)

**Ready for Implementation:** YES (pending open Founder Decision Blocks / ADR-P8-001 from prior subsystems)
