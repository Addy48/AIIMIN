# 01 — Component Principles Governance Report

```yaml
document: Component Principles Governance Report
phase: P7
standard: AIIMIN GENESIS/P7 Governance/00_GOVERNANCE_STANDARD.md
standard_version: 1.0
source: AIIMIN GENESIS/P5 Constitution/10_COMPONENT_PRINCIPLES.md
source_alias: exact match (no remap)
source_version: 3.0
source_status: FROZEN
governance_date: 2026-07-22
gov_ids_new: GOV-142…GOV-152
```

> Twin: `02_GOVERNANCE_DECISIONS.json` · Index: `03_GOVERNANCE_INDEX.md` · Standard: `../00_GOVERNANCE_STANDARD.md`

**Alias:** Requested `10_COMPONENT_PRINCIPLES.md` — **exact frozen path** `AIIMIN GENESIS/P5 Constitution/10_COMPONENT_PRINCIPLES.md`. Prior governance trios + Governance Standard + source **not modified**.

---

## 1. Artifact Overview

| Field | Value |
|-------|-------|
| Source | `10_COMPONENT_PRINCIPLES.md` v3.0 FROZEN |
| Structure | C-1…C-14 + Future impact + Tradeoffs + Known risks |
| New canonical GOV | GOV-142…GOV-152 (11) |
| Existing GOV referenced | 32 unique (no re-mint) |
| Recommendations | REC-062…REC-068 (7) |
| Conflicts | CF-C-001…CF-C-005 |
| Needs Discussion | GOV-150 |
| Governance score | **80 / 100** |

### Existing GOV references (do not re-mint)

| C item | Existing GOV | Note |
|--------|--------------|------|
| C-7 (feedback belongs to system) | GOV-077, GOV-089, GOV-132 | Mandatory feedback + sync/latency honesty — shared toast/error patterns elevated lightly via C-7 reuse; no new feedback-existence GOV |
| C-10 (destructive branded confirm) | GOV-065, GOV-015, GOV-046, GOV-125 | Branded ConfirmDialog + ban window.confirm + optimistic/confirm already canon — no re-mint |
| C-11 (chips first-class) | GOV-126, GOV-136 | Infer-then-chip + mixed-initiative already Interaction/AI canon — no re-mint |
| C-8 capture speed anchors | GOV-066, GOV-116, GOV-059, GOV-008 | Enter-to-save / after-commit / capture speed / anti-form — sacred capture components elevated in GOV-148 |
| C-9 calm read anchors | GOV-029, GOV-109 | Calm read + density modes — read-component law elevated in GOV-149 |
| C-12 lockup + ceilings | GOV-012, GOV-039, GOV-013, GOV-041, GOV-085, GOV-075 | Split lockup + /m ceiling + native≠/m + nav primacy ND — nav component obedience elevated in GOV-150 |
| C-6 / C-13 a11y + anti-AI-magic | GOV-133, GOV-053, GOV-112 | A11y as interaction quality + no AI magic + motion refuse AI-awake — component API / decorative AI bans elevated |
| C-14 vault ship gate | GOV-017, GOV-044 | Vault ships with behavior change — component contract versioning elevated in GOV-152 |
| Shared primitives / one primitive many surfaces | GOV-040, GOV-020, GOV-110 | Shared primitives + native token extension — ownership/extract laws elevated in GOV-143/144 |
| Empty / cards / icons | GOV-067, GOV-106, GOV-111 | Empty teach + cards-for-interaction + icons-keep-words support component states/composition |

### Extract coverage

| Principle | Treatment |
|-----------|-----------|
| C-1 behavior contracts | GOV-142 |
| C-2 extract on second demand | GOV-143 |
| C-3 one owner per primitive | GOV-144 |
| C-4 mandatory states | GOV-145 |
| C-5 composition over props | GOV-146 |
| C-6 a11y in component API | GOV-147 |
| C-7 system feedback | Reuse GOV-077/089/132 |
| C-8 sacred capture | GOV-148 |
| C-9 calm read | GOV-149 |
| C-10 destructive branded | Reuse GOV-065/015/046/125 |
| C-11 chips first-class | Reuse GOV-126 |
| C-12 nav locks | GOV-150 (ND) |
| C-13 no decorative AI | GOV-151 |
| C-14 versioning by contract | GOV-152 |

---

## 2. CANONICAL DECISIONS

### GOV-142 — Components encode behavior contracts — not duplicate cards

| Field | Value |
|-------|-------|
| Category | Component — Existence Justification |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** A component is justified when it standardizes interaction, accessibility, and state — not when it duplicates a slightly different card.

**Reason:** Principle C-1 — Components exist to encode behavior contracts.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** C-1 — Components exist to encode behavior contracts
  - **Quote:** A component is justified when it standardizes interaction, accessibility, and state — not when it duplicates a slightly different card.
- **Articles:** _n/a_
  - **Sections:** Purpose
  - **Quote:** Define how reusable components earn existence, behave, and relate — without styling recipes.

**Depends On:** `GOV-040`, `GOV-106`, `GOV-062`

**Blocks:** Component Library Intake, Design System, Component Blueprints

**Referenced By:** P8, Design System, Android Build, Desktop, Website

**Implementation Impact:** Reject new shared components that only restyle cards. Require stated interaction/a11y/state contract.

### GOV-143 — Prefer primitives over snowflakes — extract on second demand

| Field | Value |
|-------|-------|
| Category | Component — Extraction Rule |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** If two pages need the same behavior, extract a primitive. If one page needs a one-off, keep it local until the second demand appears.

**Reason:** Principle C-2 — Prefer primitives over page-specific snowflakes.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** C-2 — Prefer primitives over page-specific snowflakes
  - **Quote:** If two pages need the same behavior, extract. If one page needs a one-off, keep it local until the second demand appears.

**Depends On:** `GOV-142`, `GOV-040`, `GOV-020`

**Blocks:** Component Library Intake, Page Refactors

**Referenced By:** P8, Design System, Android Build, Desktop

**Implementation Impact:** No premature abstraction. Second consumer triggers extract. Document extract decisions in vault when contract-level.

### GOV-144 — One component owns a primitive — variants not parallel inventions

| Field | Value |
|-------|-------|
| Category | Component — Ownership |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | High |
| Canon Class | canonical |

**Decision:** One component owns each primitive. Examples: one Mood control family; one Confirm destructive pattern; one Capture input family. Variants are sizes/contexts, not parallel inventions.

**Reason:** Principle C-3 — One component owns a primitive. Prevents identity fracture via duplicate primitives.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** C-3 — One component owns a primitive
  - **Quote:** Examples: one Mood control family; one Confirm destructive pattern; one Capture input family. Variants are sizes/contexts, not parallel inventions.
- **Articles:** _n/a_
  - **Sections:** Reasoning
  - **Quote:** AIIMIN’s debt includes duplicate primitives and lingering `window.confirm`.

**Depends On:** `GOV-142`, `GOV-143`, `GOV-065`, `GOV-066`, `GOV-126`

**Blocks:** Mood Component, ConfirmDialog, CaptureBar/Logger, Component Audit

**Referenced By:** P8, Design System, Android Build, Desktop, Website

**Implementation Impact:** Audit and kill parallel Confirm/Mood/Capture inventions. New variants must extend owner, not fork.

### GOV-145 — Interactive component states are mandatory design work

| Field | Value |
|-------|-------|
| Category | Component — States |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | High |
| Canon Class | canonical |

**Decision:** Every interactive component defines: default, hover/focus (as applicable), active, disabled, loading, error, empty, success. Missing states ship as bugs.

**Reason:** Principle C-4 — States are mandatory design work.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** C-4 — States are mandatory design work
  - **Quote:** Every interactive component defines: default, hover/focus (as applicable), active, disabled, loading, error, empty, success. Missing states ship as bugs.

**Depends On:** `GOV-142`, `GOV-077`, `GOV-067`, `GOV-132`

**Blocks:** Component Specs, Visual QA, Android Components

**Referenced By:** P8, Design System, Android Build, Desktop, Website, Accessibility

**Implementation Impact:** Component checklists include full state matrix. Missing state = bug, not polish backlog.

### GOV-146 — Composition over configuration explosion

| Field | Value |
|-------|-------|
| Category | Component — API Shape |
| Status | Approved |
| Priority | P1 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** Prefer slots/composition to large boolean-prop matrices that recreate the universe.

**Reason:** Principle C-5 — Composition over configuration explosion.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** C-5 — Composition over configuration explosion
  - **Quote:** Prefer slots/composition to 40 boolean props that recreate the universe.
- **Articles:** _n/a_
  - **Sections:** Known risks
  - **Quote:** Mega-components that do everything poorly.

**Depends On:** `GOV-142`, `GOV-143`

**Blocks:** Component API Reviews, Design System

**Referenced By:** P8, Design System, Android Build, Desktop

**Implementation Impact:** Reject mega-components with sprawling booleans. Prefer composable slots. Refactor when prop matrices explode.

### GOV-147 — Accessibility is part of the component API

| Field | Value |
|-------|-------|
| Category | Component — Accessibility |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | High |
| Canon Class | canonical |

**Decision:** Focus management, labels, roles, and hit targets ship with the component — not as a consumer afterthought.

**Reason:** Principle C-6 — Accessibility is part of the component API. Elevates GOV-133 into component-contract law.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** C-6 — Accessibility is part of the component API
  - **Quote:** Focus management, labels, roles, hit targets ship with the component — not as a consumer afterthought.

**Depends On:** `GOV-133`, `GOV-071`, `GOV-142`, `GOV-056`

**Blocks:** Component Specs, Accessibility Audit, Hit Target Spec

**Referenced By:** P8, Accessibility, Design System, Android Build, Desktop, Website

**Implementation Impact:** Component APIs include a11y affordances by default. Consumers must not re-implement labels/focus for basic use.

### GOV-148 — Capture components are sacred — no ceremony wrapping Enter-to-save

| Field | Value |
|-------|-------|
| Category | Component — Capture |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** CaptureBar / Logger / Palette routing components may not be wrapped in ceremony that slows Enter-to-save.

**Reason:** Principle C-8 — Capture components are sacred.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** C-8 — Capture components are sacred
  - **Quote:** CaptureBar / Logger / Palette routing components may not be wrapped in ceremony that slows Enter-to-save.

**Depends On:** `GOV-066`, `GOV-116`, `GOV-059`, `GOV-008`, `GOV-144`

**Blocks:** CaptureBar, Universal Logger, Command Palette UI, Onboarding Wrappers

**Referenced By:** P8, Design System, Desktop, Android Build, Website

**Implementation Impact:** Ban ceremony wrappers around capture submit. Measure against Enter-to-save. Align with GOV-116 after-commit motion.

### GOV-149 — Read components stay calm — score, chart, digest do not demand input

| Field | Value |
|-------|-------|
| Category | Component — Read Surfaces |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** Score, chart, and digest components optimize scan and comprehension; they do not demand input.

**Reason:** Principle C-9 — Read components stay calm.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** C-9 — Read components stay calm
  - **Quote:** Score, chart, and digest components optimize scan and comprehension; they do not demand input.

**Depends On:** `GOV-029`, `GOV-109`, `GOV-142`

**Blocks:** Score Components, Charts, Digest/Briefing UI

**Referenced By:** P8, Design System, Desktop, Android Build, Website

**Implementation Impact:** Read components: no forced input chrome. Separate capture/edit affordances from scan surfaces.

### GOV-150 — Navigation components obey locks — BrandLockup split and device-tier shells

| Field | Value |
|-------|-------|
| Category | Component — Navigation |
| Status | Needs Discussion |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | High |
| Canon Class | canonical |

**Decision:** Navigation components obey product locks: BrandLockup split targets; device-tier nav shells (BottomNav / TabRail / Masthead) respect ceilings.

**Reason:** Principle C-12 — Navigation components obey locks.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** C-12 — Navigation components obey locks
  - **Quote:** BrandLockup split targets; device-tier nav shells (BottomNav / TabRail / Masthead) respect ceilings.

**Depends On:** `GOV-012`, `GOV-039`, `GOV-013`, `GOV-041`, `GOV-085`, `GOV-075`

**Blocks:** BrandLockup, BottomNav, TabRail, Masthead, Device Tier Shells

**Referenced By:** P8, Design System, Desktop, Android Build, Website

**Implementation Impact:** Do not unify BrandLockup click targets. Shell components enforce /m vs desktop vs native ceilings. Depends on open GOV-012/075 ND — founder align.

### GOV-151 — No decorative AI components — intelligence via outcomes and chips

| Field | Value |
|-------|-------|
| Category | Component — AI Refusal |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Low |
| Canon Class | canonical |

**Decision:** Components named or styled to signify “AI” without behavior are banned. Intelligence appears as outcomes and chips, not badges.

**Reason:** Principle C-13 — No decorative AI components.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** C-13 — No decorative AI components
  - **Quote:** Components named or styled to signify “AI” without behavior are banned. Intelligence appears as outcomes and chips, not badges.

**Depends On:** `GOV-053`, `GOV-126`, `GOV-136`, `GOV-112`, `GOV-142`

**Blocks:** AI Badge Components, Marketing Chrome, Insights Decor

**Referenced By:** P8, Design System, AI, Desktop, Website, Android Build

**Implementation Impact:** Remove AI-glow badges without behavior. Prefer chips/outcomes. Ban idle AI identity chrome in component library.

### GOV-152 — Component versioning by contract — vault note when behavior defaults change

| Field | Value |
|-------|-------|
| Category | Component — Versioning / Governance |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Low |
| Canon Class | canonical |

**Decision:** Changing a component’s default behavior requires a vault/Bible note when it alters product contracts (e.g., confirm patterns, capture submit).

**Reason:** Principle C-14 — Versioning by contract.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** C-14 — Versioning by contract
  - **Quote:** Changing a component’s default behavior requires vault/Bible note when it alters product contracts (e.g., confirm patterns, capture submit).

**Depends On:** `GOV-017`, `GOV-044`, `GOV-142`, `GOV-144`

**Blocks:** Component Changelogs, ConfirmDialog Changes, Capture Submit Changes

**Referenced By:** P8, Design System, Vault, Desktop, Android Build

**Implementation Impact:** Contract-altering component PRs must update vault/Bible. Cosmetic-only changes do not require contract notes.


---

## 3. GOVERNANCE RECOMMENDATIONS (NOT CANON)

### REC-062 — Ratify Approved Component GOVs (142–149, 151–152) as citeable component canon

- **Reason:** C-1…C-14 extract library existence/ownership/state/API laws.
- **Impact:** PRs cite GOV-IDs for component intake.
- **Risk:** Medium — duplicate primitives return.
- **Priority:** P0 · **Status:** Pending Founder
- **Related GOV:** GOV-142, GOV-143, GOV-144, GOV-145, GOV-146, GOV-147, GOV-148, GOV-149, GOV-151, GOV-152

### REC-063 — Audit and kill parallel Mood / Confirm / Capture inventions under GOV-144

- **Reason:** Reasoning cites duplicate primitives + lingering window.confirm.
- **Impact:** Single owner per primitive.
- **Risk:** High identity fracture if skipped.
- **Priority:** P0 · **Status:** Pending Founder
- **Related GOV:** GOV-144, GOV-065, GOV-066

### REC-064 — Publish mandatory state matrix checklist for interactive components

- **Reason:** GOV-145 — missing states ship as bugs.
- **Impact:** QA gate on component PRs.
- **Risk:** Medium.
- **Priority:** P0 · **Status:** Pending Founder
- **Related GOV:** GOV-145, GOV-077, GOV-067

### REC-065 — Founder align GOV-150 nav shells with GOV-012 lockup ND and GOV-075/097 primacy

- **Reason:** C-12 Depends on open navigation/lockup Needs Discussion items.
- **Impact:** Unblocks BrandLockup + BottomNav/TabRail/Masthead as citeable.
- **Risk:** High thrash if shells fight IA.
- **Priority:** P0 · **Status:** Pending Founder
- **Related GOV:** GOV-150, GOV-012, GOV-039, GOV-075, GOV-097

### REC-066 — Cross-client component contract parity audit (web vs native)

- **Reason:** Known risks: Web and native drifting into differently behaving “same” components. Future impact: contracts first.
- **Impact:** Same contracts across renderers.
- **Risk:** High cousin-behavior.
- **Priority:** P0 · **Status:** Pending Founder
- **Related GOV:** GOV-144, GOV-110, GOV-118, GOV-040

### REC-067 — Ban design-system theater — tokens without behavior contracts

- **Reason:** Known risks: Design-system theater (tokens without behavior contracts).
- **Impact:** Token work must cite GOV-142 contracts.
- **Risk:** Medium vanity DS.
- **Priority:** P1 · **Status:** Pending Founder
- **Related GOV:** GOV-142, GOV-073, GOV-145

### REC-068 — Next P7: 16_COMPONENT_BLUEPRINTS or 14_DESIGN_SYSTEM_SPECIFICATION or 11_ACCESSIBILITY

- **Reason:** C Dependencies cite blueprints + DSS; a11y detail still deferred.
- **Impact:** Continues build-without-reread.
- **Risk:** Low.
- **Priority:** P0 · **Status:** Pending Founder
- **Related GOV:** GOV-142, GOV-147, GOV-145, GOV-073


---

## 4. Conflicts

| ID | Type | Detail | Action |
|----|------|--------|--------|
| CF-C-001 | Dependency on open ND — BrandLockup / nav primacy | GOV-150 Needs Discussion because GOV-012 and GOV-075 still open. | REC-065 |
| CF-C-002 | Known risk — design-system theater | Tokens without behavior contracts. | REC-067 |
| CF-C-003 | Known risk — mega-components | Mega-components that do everything poorly — tension with GOV-146. | REC-063 + API review |
| CF-C-004 | Known risk — web/native behavior drift | Same-named components behaving differently across clients. | REC-066 |
| CF-C-005 | Complementary reuse — Confirm/chips already canon | C-10/C-11 restated GOV-065/126; no re-mint. | Keep REC-018 ConfirmDialog CI ban |

---

## 5. Missing Decisions

| ID | Missing | Why | Next |
|----|---------|-----|------|
| M-C-001 | Component Blueprints inventory (concrete APIs) | Principles cite 16_COMPONENT_BLUEPRINTS | REC-068 |
| M-C-002 | Named toast/inline-error system component owners | C-7 says shared patterns; owners unnamed | Blueprints + GOV-077 |
| M-C-003 | Hit-target numeric floors in component API | C-6 names hit targets; numbers in Accessibility | Govern 11_ACCESSIBILITY |
| M-C-004 | Full Mood/Confirm/Capture owner map | C-3 examples only | REC-063 |

---

## 6. Questions for Founder

1. Approve one-owner-per-primitive (GOV-144) including Mood/Confirm/Capture families?
2. Approve mandatory state matrix as ship bugs (GOV-145)?
3. GOV-150 nav shells — Approve after lockup/primacy ADR / Amend / Reject?
4. Ban decorative AI components (GOV-151) including marketing?
5. Run web↔native contract parity audit now (REC-066)?
6. Next: Component Blueprints / Design System Spec / Accessibility (REC-068)?

---

## 7. Dependency Graph Summary

| GOV ID | Fan-in |
|--------|-------|
| GOV-142 | 8 |
| GOV-040 | 2 |
| GOV-143 | 2 |
| GOV-066 | 2 |
| GOV-126 | 2 |
| GOV-144 | 2 |
| GOV-106 | 1 |
| GOV-062 | 1 |
| GOV-020 | 1 |
| GOV-065 | 1 |
| GOV-077 | 1 |
| GOV-067 | 1 |

### Needs Discussion

| GOV-150 | Navigation components obey locks — BrandLockup split and device-tier shells |

---

## 8. Final Governance Score

| Dimension | Score (/10) |
|-----------|-------------|
| Identity Clarity | 9 |
| Enforceability | 8 |
| Cross Platform Readiness | 7 |
| Ai Readiness | 7 |
| Conflict Hygiene | 8 |
| Metric Rigor | 7 |
| Amendment Process | 9 |
| Completeness Build Without Reread | 7 |
| Traceability Evidence | 9 |
| Machine Readability | 9 |

### Final Governance Score: **80 / 100**

Component Principles supply existence justification, extract-on-second-demand, one-owner primitives, mandatory states, composition-over-props, a11y-in-API, sacred capture, calm read, decorative-AI ban, and contract versioning. C-10/C-11 reused. GOV-150 Needs Discussion until lockup/nav ND closes. Cross-client drift flagged, not invented away.
