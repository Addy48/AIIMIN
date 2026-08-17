# 01 — Motion Principles Governance Report

```yaml
document: Motion Principles Governance Report
phase: P7
standard: AIIMIN GENESIS/P7 Governance/00_GOVERNANCE_STANDARD.md
standard_version: 1.0
source: AIIMIN GENESIS/P5 Constitution/09_MOTION_PRINCIPLES.md
source_alias: 08_MOTION_PRINCIPLES.md → 09_MOTION_PRINCIPLES.md (P5; 08_ is Interaction Principles)
source_version: 3.0
source_status: FROZEN
governance_date: 2026-07-22
gov_ids_new: GOV-112…GOV-121
gov_ids_referenced: GOV-001…GOV-111 (prior; not re-minted)
```

> Machine-readable twin: `02_GOVERNANCE_DECISIONS.json` · Index: `03_GOVERNANCE_INDEX.md` · Standard: `../00_GOVERNANCE_STANDARD.md`

**Filename note:** Requested artifact label `08_MOTION_PRINCIPLES.md` does not exist. P5 `08_` = Interaction Principles. Governed frozen source is **`09_MOTION_PRINCIPLES.md`**. Source **not modified**. Constitution, Non-Negotiables, IA Principles, Design System Principles, and Governance Standard **not modified**. New GOV IDs only for genuinely new canon; duplicates reference existing GOV IDs.

---

## 1. Artifact Overview

| Field | Value |
|-------|-------|
| Source | `09_MOTION_PRINCIPLES.md` v3.0 FROZEN |
| Structure | Principles M-1…M-10 + Future impact + Tradeoffs + Known risks |
| New canonical GOV | GOV-112…GOV-121 (10) |
| Existing GOV referenced | 20 unique IDs from prior registry (no re-mint) |
| Recommendations | REC-041…REC-047 (7) — not canon |
| Conflicts flagged | CF-M-001…CF-M-006 |
| Needs Discussion | GOV-113 |
| Governance score | **80 / 100** |

**Separation law:** Canonical Decisions ≠ Governance Recommendations.

**Philosophy frame (cross-ref, not re-minted):** Motion reinforces Calm, Clarity, Agency, Human Momentum — via GOV-054, GOV-030, GOV-003, GOV-063. Never delight for delight.

### Existing GOV references (duplicates — do not re-mint)

| M item | Existing GOV | Note |
|--------|--------------|------|
| M-1 (general meaning + triad) | `GOV-063`, `GOV-054`, `GOV-038` | Meaning / emotional triad / decoration-not-confuse — purpose allowlist elevated in GOV-112 |
| M-5 (reduced motion core) | `GOV-072` | Honored already — ops via REC-045; no re-mint |
| M-6 (capture speed anchors) | `GOV-059`, `GOV-066`, `GOV-028` | Capture speed / ceremony-free save / capture-first — after-commit law elevated in GOV-116 |
| M-9 (anti-casino anchors) | `GOV-055`, `GOV-009`, `GOV-068` | Anti-nag/casino + Life Score — proportional celebration elevated in GOV-119 |
| Feedback existence | `GOV-077` | No interaction without feedback — motion is one channel |
| Calm / Human Momentum | `GOV-029`, `GOV-030`, `GOV-003`, `GOV-031` | Calm read + triad + brand + emotional refuse |
| Cross-surface | `GOV-040`, `GOV-085` | Shared primitives + native≠/m — tempo match elevated in GOV-118 |

### Extract coverage map

| Extract topic | Treatment |
|---------------|-----------|
| Motion philosophy | Reuse GOV-054/063 + new GOV-112 |
| Transition philosophy | GOV-120 |
| Duration philosophy | GOV-113 |
| Easing philosophy | GOV-117 |
| Spatial continuity | GOV-112 Continuity purpose (shared-element) |
| Navigation motion | GOV-120 |
| Feedback motion | GOV-112 Feedback + GOV-077 + GOV-116 |
| Success motion | GOV-119 |
| Error motion | GOV-112 Feedback (failed) + GOV-077 — no separate invent |
| Loading motion | GOV-121 |
| AI response motion | GOV-112 refuse “AI awake” breathing — positive pattern missing (M-M-005) |
| Gesture motion | **Absent from source** — CF-M-006 / M-M-003; do not invent |
| Accessibility motion | Reuse GOV-072 + GOV-114 vestibular + REC-045 |
| Performance constraints | GOV-116 + GOV-121 |
| Motion consistency | GOV-117 + GOV-118 |
| Motion refusal rules | GOV-112 forbid list + GOV-055 |

---

## 2. CANONICAL DECISIONS

Only new decisions supported by Motion Principles (Confidence High or Medium). Binding when Status is Approved.

### Canonical Motion Decisions

### GOV-112 — Motion purpose allowlist — feedback, continuity, hierarchy, state

| Field | Value |
|-------|-------|
| Category | Motion — Purpose |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** Motion is allowed only for: (1) Feedback (saved, failed, toggled), (2) Continuity (shared-element orientation), (3) Hierarchy (attention to primary action), (4) State (expand/collapse, enter/exit). Forbidden: idle flair, perpetual loops, and “AI awake” breathing glows as identity. Motion communicates; it does not entertain for its own sake.

**Reason:** Principle M-1 — Motion is meaning. Elevates concrete purpose allowlist + AI-identity refuse beyond GOV-063 general meaning law.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** M-1 — Motion is meaning
  - **Quote:** Allowed purposes: 1. Feedback (saved, failed, toggled) 2. Continuity (shared-element orientation) 3. Hierarchy (attention to primary action) 4. State (expand/collapse, enter/exit)
- **Articles:** _n/a_
  - **Sections:** M-1 — Motion is meaning
  - **Quote:** Forbidden purposes: idle flair, perpetual loops, “AI awake” breathing glows as identity.
- **Articles:** _n/a_
  - **Sections:** Purpose
  - **Quote:** Define when and why AIIMIN moves — so motion communicates rather than entertains.

**Depends On:** `GOV-063`, `GOV-054`, `GOV-038`, `GOV-053`

**Blocks:** Motion Spec, Design System Motion Tokens, Motion QA Checklist, AI Surface Motion

**Referenced By:** P8, Design System, Android Build, Website, Desktop, AI

**Implementation Impact:** Motion PRs must declare which allowlisted purpose they serve. Reject idle loops and AI breathing-glow identity. Spatial continuity = Continuity purpose (shared-element), not a separate inventable category.

### GOV-113 — Duration band — ~150–250ms micro; longer needs narrative reason

| Field | Value |
|-------|-------|
| Category | Motion — Duration |
| Status | Needs Discussion |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** Prefer ~150–250ms for micro-interactions. Longer motion requires a narrative reason (e.g. first-run brand moment), not a dashboard habit.

**Reason:** Principle M-2 — Short by default. Supplies the duration band Constitution explicitly deferred to Motion Principles.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** M-2 — Short by default
  - **Quote:** Prefer ~150–250ms for micro-interactions. Longer motion needs a narrative reason (first-run brand moment), not a dashboard habit.
- **Articles:** _n/a_
  - **Sections:** Reasoning
  - **Quote:** Craft history already set discipline: ~150–250ms, opacity+transform, max 2–3 intentional motions per composition.

**Depends On:** `GOV-112`, `GOV-054`, `GOV-118`

**Blocks:** Motion Spec, Design System Motion Tokens, Web Motion Presets, Android Motion Tokens

**Referenced By:** P8, Design System, Android Build, Website, Desktop

**Implementation Impact:** Default micro tokens live in ~150–250ms band. Brand/first-run may exceed with documented narrative reason. Resolve CF-M-001 with GOV-118 via REC-044 — emotional tempo wins over literal ms when OS tokens differ.

### GOV-114 — Prefer opacity + transform; avoid layout thrash and vestibular distress

| Field | Value |
|-------|-------|
| Category | Motion — Technique / Accessibility |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** Prefer fade/slide/scale (opacity + transform) over layout thrash and blur fireworks. Avoid motion that causes vestibular distress.

**Reason:** Principle M-3 — Opacity + transform preferred. Technique law + a11y bound.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** M-3 — Opacity + transform preferred
  - **Quote:** Prefer fade/slide/scale over layout thrash and blur fireworks. Avoid motion that causes vestibular distress (see Accessibility).
- **Articles:** _n/a_
  - **Sections:** Reasoning
  - **Quote:** Craft history already set discipline: ~150–250ms, opacity+transform, max 2–3 intentional motions per composition.

**Depends On:** `GOV-112`, `GOV-072`, `GOV-056`

**Blocks:** Motion Spec, Component Enter/Exit Patterns, Visual QA

**Referenced By:** P8, Design System, Android Build, Website, Desktop, Accessibility

**Implementation Impact:** Default enter/exit/feedback use opacity+transform. Ban blur-firework and large unexpected layout thrash on product surfaces. Vestibular-safe alternatives required under reduced motion.

### GOV-115 — Motion budget per composition — brand 2–3; product fewer

| Field | Value |
|-------|-------|
| Category | Motion — Budget |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Low |
| Canon Class | canonical |

**Decision:** Marketing/brand compositions may use 2–3 intentional motions to create presence. Product OS surfaces use fewer. If everything moves, calm is dead.

**Reason:** Principle M-4 — Budget per composition. Operationalizes calm under Human Momentum.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** M-4 — Budget per composition
  - **Quote:** Marketing/brand: 2–3 intentional motions can create presence. Product OS: fewer. If everything moves, calm is dead.
- **Articles:** _n/a_
  - **Sections:** Reasoning
  - **Quote:** Craft history already set discipline: ~150–250ms, opacity+transform, max 2–3 intentional motions per composition.

**Depends On:** `GOV-112`, `GOV-029`, `GOV-054`, `GOV-003`

**Blocks:** Brand Motion QA, Today Motion Budget, Landing Motion Reviews

**Referenced By:** P8, Design System, Website, Desktop, Brand

**Implementation Impact:** Brand/landing: cap intentional motions at 2–3 per composition. Product OS: prefer 0–1 motion moments per view unless purpose-justified. Motion reviews count intentional motions.

### GOV-116 — Never delay capture — animate after commit, not before

| Field | Value |
|-------|-------|
| Category | Motion — Performance / Capture |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** Motion must not add latency to save/log/toggle paths. Feedback may animate after commit, not before.

**Reason:** Principle M-6 — Never delay capture. Motion subordinate to capture speed and ceremony-free save.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** M-6 — Never delay capture
  - **Quote:** Motion must not add latency to save/log/toggle paths. Feedback can animate after commit, not before.

**Depends On:** `GOV-059`, `GOV-066`, `GOV-028`, `GOV-112`, `GOV-077`

**Blocks:** Capture Path Motion, Habit Toggle Motion, Save Feedback Spec

**Referenced By:** P8, Design System, Android Build, Desktop, Website

**Implementation Impact:** Commit/save/toggle execute immediately. Success/fail feedback may animate after state lands. Never gate commit behind animation start or duration.

### GOV-117 — One easing family per surface class

| Field | Value |
|-------|-------|
| Category | Motion — Easing |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** Use one easing family per surface class. Do not mix bouncy carnival with corporate easeInOut randomly.

**Reason:** Principle M-7 — Consistent physics metaphor. Consistency law for motion identity.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** M-7 — Consistent physics metaphor
  - **Quote:** One easing family per surface class. Do not mix bouncy carnival with corporate easeInOut randomly.

**Depends On:** `GOV-112`, `GOV-113`, `GOV-040`

**Blocks:** Motion Spec, Design System Motion Tokens, Easing Token Map

**Referenced By:** P8, Design System, Android Build, Website, Desktop

**Implementation Impact:** Define surface classes (e.g. Product OS, Brand/Marketing, Capture micro) each with one easing family. No ad-hoc bounce on product chrome. Named curves deferred to Design System Spec (REC-042).

### GOV-118 — Platform vernacular OK — emotional tempo must match

| Field | Value |
|-------|-------|
| Category | Motion — Cross-Platform Consistency |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | High |
| Canon Class | canonical |

**Decision:** Native may use platform motion tokens; web may use its motion stack — but emotional tempo (calm, quick, purposeful) must match across surfaces.

**Reason:** Principle M-8 — Platform vernacular. Consistency of feeling over identical implementation.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** M-8 — Platform vernacular
  - **Quote:** Native may use platform motion tokens; web may use Framer/Motion — but emotional tempo (calm, quick, purposeful) must match.
- **Articles:** _n/a_
  - **Sections:** Reasoning
  - **Quote:** Native has its own motion language doc; principles must keep web and native emotionally consistent.

**Depends On:** `GOV-040`, `GOV-085`, `GOV-054`, `GOV-112`

**Blocks:** Cross-Client Motion Parity, Android Motion Mapping, Web Motion Presets

**Referenced By:** P8, Design System, Android Build, Website, Desktop

**Implementation Impact:** Do not force identical ms/easing libraries across web/native. Audit emotional tempo: calm, quick, purposeful. Resolve duration-band tension with GOV-113 via REC-044.

### GOV-119 — Celebration rare and proportional — no habit-tick fireworks

| Field | Value |
|-------|-------|
| Category | Motion — Success / Celebration |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** Completion may acknowledge; it must not fireworks every habit tick. XP celebration ≠ confetti addiction. Success motion stays proportional to stakes.

**Reason:** Principle M-9 — Celebration is rare and proportional. Elevates success-motion law beyond GOV-055 anti-casino.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** M-9 — Celebration is rare and proportional
  - **Quote:** Completion can acknowledge; it must not fireworks every habit tick. XP celebration ≠ confetti addiction.

**Depends On:** `GOV-055`, `GOV-009`, `GOV-112`, `GOV-068`

**Blocks:** XP Celebration Spec, Habit Complete Motion, Gamification Motion QA

**Referenced By:** P8, Design System, Android Build, Desktop, Website

**Implementation Impact:** Habit ticks: quiet/instant or minimal ack. Reserve richer celebration for meaningful milestones aligned with XP role (GOV-068). No confetti loops.

### GOV-120 — Page transitions orient — not cinematic taxes on daily use

| Field | Value |
|-------|-------|
| Category | Motion — Navigation / Transitions |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** Route/page changes may gently orient the user; they must not become cinematic taxes on daily use.

**Reason:** Principle M-10 — Page transitions serve orientation. Navigation motion = orientation, not spectacle.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** M-10 — Page transitions serve orientation
  - **Quote:** Route changes may gently orient; they must not become cinematic taxes on daily use.

**Depends On:** `GOV-112`, `GOV-113`, `GOV-029`, `GOV-115`

**Blocks:** Router Transition Spec, Android Nav Transitions, Desktop Route Motion

**Referenced By:** P8, Design System, Android Build, Desktop, Website

**Implementation Impact:** Default route transitions: short, orienting, skippable under reduced motion. Ban long cinematic page plays on daily OS paths.

### GOV-121 — Loading motion must not mask poor performance

| Field | Value |
|-------|-------|
| Category | Motion — Loading / Performance Honesty |
| Status | Approved |
| Priority | P1 |
| Confidence | Medium |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** Loading animations must not be used to mask poor performance. Motion may communicate waiting state; it must not disguise latency as craft.

**Reason:** Known risks — Loading animations masking poor performance. Implied by Purpose (communicate, not entertain) + capture/performance posture.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** Known risks
  - **Quote:** Loading animations masking poor performance.
- **Articles:** _n/a_
  - **Sections:** Purpose
  - **Quote:** Define when and why AIIMIN moves — so motion communicates rather than entertains.

**Depends On:** `GOV-112`, `GOV-116`, `GOV-089`

**Blocks:** Loading Indicator Spec, Performance Budgets, Skeleton Motion

**Referenced By:** P8, Design System, Android Build, Desktop, Website, Backend

**Implementation Impact:** Treat slow loads as performance bugs first. Loading motion = honest wait signal, not polish theater. Pair with sync honesty (GOV-089).

---

## 3. GOVERNANCE RECOMMENDATIONS (NOT CANON)

### REC-041 — Ratify Approved Motion GOVs (112, 114–121) as citeable motion canon

- **Reason:** Motion Principles pass extracts duration/easing/budget/capture/platform laws Constitution deferred.
- **Impact:** Agents/PRs cite GOV-IDs for motion reviews instead of taste debates.
- **Risk:** Medium if delayed — motion debt and demo-polish return.
- **Priority:** P0 · **Status:** Pending Founder
- **Related GOV:** GOV-112, GOV-114…GOV-121

### REC-042 — Publish motion token companion (duration bands, easing families, surface classes) under Design System Spec / token SoT

- **Reason:** GOV-113/117 name rules; named curves and token file still missing (also REC-020).
- **Impact:** One SoT for web presets + Android mapping under GOV-118.
- **Risk:** High without tokens — each surface invents physics.
- **Priority:** P0 · **Status:** Pending Founder
- **Related GOV:** GOV-113, GOV-117, GOV-118, GOV-073

### REC-043 — Add Motion QA gates: purpose allowlist, capture-after-commit, budget count, celebration stakes, reduced-motion path

- **Reason:** Operationalize GOV-112/115/116/119 + GOV-072 + Known risks.
- **Impact:** PR checklist blocks idle flair, capture delay, habit fireworks, broken reduced-motion.
- **Risk:** Low process cost; High drift if skipped.
- **Priority:** P0 · **Status:** Pending Founder
- **Related GOV:** GOV-112, GOV-115, GOV-116, GOV-119, GOV-072

### REC-044 — Founder resolve CF-M-001: ~150–250ms band as emotional tempo with platform tokens (GOV-113 × GOV-118)

- **Reason:** GOV-113 Needs Discussion — literal ms vs native platform vernacular.
- **Impact:** Unblocks Android motion mapping without forcing web ms onto Material tokens.
- **Risk:** High if skipped — either rigid ms fights OS or duration law becomes optional.
- **Priority:** P0 · **Status:** Pending Founder
- **Related GOV:** GOV-113, GOV-118

### REC-045 — Ban animation-end as sole success path; essential feedback works as instant state under reduced motion

- **Reason:** M-5 + Known risks — Reduced-motion users getting broken states if logic tied to animation end events. Elevates GOV-072 ops without new GOV.
- **Impact:** State machines complete without awaiting animationend; decorative motion yields.
- **Risk:** High a11y break if ignored.
- **Priority:** P0 · **Status:** Pending Founder
- **Related GOV:** GOV-072, GOV-116, GOV-077, GOV-114

### REC-046 — Align celebration motion with Life Score vs XP role matrix when GOV-068 ratified

- **Reason:** GOV-119 proportional celebration depends on GOV-068 Needs Discussion role split.
- **Impact:** XP moments get celebration budget; Life Score stays honest/non-casino.
- **Risk:** Medium — celebration creep while roles unmixed.
- **Priority:** P1 · **Status:** Pending Founder
- **Related GOV:** GOV-119, GOV-068, GOV-055

### REC-047 — Next P7 artifact: 08_INTERACTION_PRINCIPLES or 11_ACCESSIBILITY_PRINCIPLES or 14_DESIGN_SYSTEM_SPECIFICATION

- **Reason:** Motion deps cite Interaction + Accessibility; Design System Spec still owns token contracts. Page Blueprints still open from IA.
- **Impact:** Continues build-without-reread for interaction/a11y/token stack.
- **Risk:** Low.
- **Priority:** P0 · **Status:** Pending Founder
- **Related GOV:** GOV-112, GOV-072, GOV-114, GOV-073

---

## 4. Conflicts

| ID | Type | Detail | Action |
|----|------|--------|--------|
| CF-M-001 | Duration vs platform | M-2 ms band × M-8 platform tokens | REC-044; GOV-113 ND |
| CF-M-002 | Open dependency | GOV-119 × GOV-068 ND | REC-046 |
| CF-M-003 | Tradeoff | Demoability vs calm — not contradiction | Cite Tradeoffs in QA |
| CF-M-004 | Known risk | Craft polish motion debt | REC-043 |
| CF-M-005 | Known risk | animation-end breaks reduced-motion | REC-045 |
| CF-M-006 | Extract gap | Gesture motion absent from source | Do not invent; REC-047 |

---

## 5. Missing Decisions

| ID | Missing | Why | Next |
|----|---------|-----|------|
| M-M-001 | Named easing curves / motion token file | GOV-117 family unnamed | REC-042 + DSS |
| M-M-002 | Founder rule ms vs platform | CF-M-001 | REC-044 |
| M-M-003 | Gesture motion principles | Not in source | Interaction Principles |
| M-M-004 | Error-motion choreography beyond Feedback | Only “failed” listed | Components / Interaction |
| M-M-005 | Positive AI response motion pattern | Only refuse stated | AI specs under GOV-112 |
| M-M-006 | Motion QA checklist | Process gap | REC-043 |

---

## 6. Questions for Founder

1. Confirm ~150–250ms as emotional-tempo band with native platform tokens allowed (REC-044 / GOV-113)?
2. Ratify purpose allowlist + AI-awake breathing refuse as citeable (GOV-112)?
3. Confirm celebration: quiet habit ticks; richer only for XP milestones (GOV-119 × GOV-068)?
4. Approve loading-must-not-mask-perf as Medium-confidence canon (GOV-121)?
5. Adopt REC-045: no animation-end-only success paths?
6. Gesture motion: defer to Interaction Principles (CF-M-006) — confirm no invent?
7. Next artifact: Interaction, Accessibility, or Design System Spec (REC-047)?

---

## 7. Dependency Graph Summary

### Highest fan-in (from new GOV-112…121)

| GOV ID | Count | Title (if known) |
|--------|-------|------------------|
| GOV-112 | 8 | Motion purpose allowlist |
| GOV-054 | 3 | Motion serves emotional triad |
| GOV-113 | 2 | Duration band |
| GOV-029 | 2 | Read surfaces stay calm |
| GOV-040 | 2 | Shared primitives across surfaces |
| GOV-072 | 1 | Reduced motion must be honored |
| GOV-063 | 1 | Every animation must communicate meaning |
| GOV-059 | 1 | Capture speed first-class |
| GOV-066 | 1 | Ceremony-free Enter/primary save |
| GOV-055 | 1 | Motion anti-nag / anti-casino |
| GOV-068 | 1 | Life Score honest; XP celebratory |
| GOV-118 | 1 | Platform vernacular |

### Extreme / High cost (new)

| GOV ID | Title | Cost | Blocks |
|--------|-------|------|--------|
| GOV-118 | Platform vernacular OK — emotional tempo must match | High | Cross-Client Motion Parity, Android Motion Mapping, Web Motion Presets |

### Needs Discussion

| GOV ID | Title |
|--------|-------|
| GOV-113 | Duration band — ~150–250ms micro; longer needs narrative reason |

---

## 8. Final Governance Score

| Dimension | Score (/10) |
|-----------|-------------|
| Identity clarity | 9 |
| Enforceability | 8 |
| Cross-platform readiness | 7 |
| AI readiness | 7 |
| Conflict hygiene | 8 |
| Metric rigor | 8 |
| Amendment process | 8 |
| Completeness for build-without-reread | 7 |
| Traceability / evidence | 9 |
| Machine-readability | 9 |

### Final Governance Score: **80 / 100**

Motion Principles supply purpose allowlist, duration band, technique, budget, capture-latency, easing family, platform tempo, celebration, page-transition, and loading-honesty laws deferred from Constitution. GOV-113 Needs Discussion until ms↔platform rule. Gesture motion absent from source — not invented. No hard contradiction with Constitution/NN/IA/VL.

---

## Evidence (process)

- Source read: `09_MOTION_PRINCIPLES.md` v3.0 FROZEN (requested label `08_MOTION_PRINCIPLES` remapped)
- Cross-ref: Constitution + Non-Negotiables + IA + Design System Principles + MASTER_DECISION_REGISTRY
- Untouched: prior artifact trios + `00_GOVERNANCE_STANDARD.md` + source
- New GOV: GOV-112…GOV-121
- Validation: continuous IDs, schema, dup GOV, dup decision, broken deps/refs, evidence — see closeout
