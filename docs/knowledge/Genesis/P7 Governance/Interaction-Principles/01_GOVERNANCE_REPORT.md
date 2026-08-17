# 01 — Interaction Principles Governance Report

```yaml
document: Interaction Principles Governance Report
phase: P7
standard: AIIMIN GENESIS/P7 Governance/00_GOVERNANCE_STANDARD.md
standard_version: 1.0
source: AIIMIN GENESIS/P5 Constitution/08_INTERACTION_PRINCIPLES.md
source_version: 3.0
source_status: FROZEN
governance_date: 2026-07-22
gov_ids_new: GOV-122…GOV-135
gov_ids_referenced: GOV-001…GOV-121 (prior; not re-minted)
```

> Machine-readable twin: `02_GOVERNANCE_DECISIONS.json` · Index: `03_GOVERNANCE_INDEX.md` · Standard: `../00_GOVERNANCE_STANDARD.md`

**Scope:** Governance pass only. Source **not modified**. Constitution, Non-Negotiables, IA Principles, Visual Language / Design System Principles, Motion Principles, and Governance Standard **not modified**. New GOV IDs only for genuinely new interaction canon; duplicates reference existing GOV IDs.

---

## 1. Artifact Overview

| Field | Value |
|-------|-------|
| Source | `08_INTERACTION_PRINCIPLES.md` v3.0 FROZEN |
| Structure | Principles IX-1…IX-25 + Future impact + Tradeoffs + Known risks |
| New canonical GOV | GOV-122…GOV-135 (14) |
| Existing GOV referenced | 32 unique IDs from prior registry (no re-mint) |
| Recommendations | REC-048…REC-054 (7) — not canon |
| Conflicts flagged | CF-IX-001…CF-IX-007 |
| Needs Discussion | GOV-127, GOV-135 |
| Governance score | **80 / 100** |

**Separation law:** Canonical Decisions ≠ Governance Recommendations.

### Existing GOV references (duplicates — do not re-mint)

| IX item | Existing GOV | Note |
|---------|--------------|------|
| IX-2 (never surprise — silent wrong / confirm / feedback) | GOV-035, GOV-051, GOV-015, GOV-065, GOV-046, GOV-077 | Correctable inference + destructive confirm + mandatory feedback already canon — no re-mint for ambush core |
| IX-4 (progressive disclosure) | GOV-032 | Progressive disclosure by stakes already Constitution canon |
| IX-6 (intelligence without interruption) | GOV-033, GOV-088, GOV-048 | Interruptibility + no mid-Focus coaching + confidence bands — bands still Needs Discussion |
| IX-7 (justify fidelity/speed/trust/clarity) | GOV-062 | Identical Non-Negotiable — no re-mint |
| IX-8 (animation communicates) | GOV-063, GOV-112 | Motion meaning + purpose allowlist already governed |
| IX-9 (notification deserve attention) | GOV-064 | Already NN; still Needs Discussion — no re-mint |
| IX-10 (purpose / anti-clutter widgets) | GOV-076, GOV-062 | Today anti-clutter + justify interaction cover decorative/placeholder debt |
| IX-11 (Enter to save) | GOV-066 | Ceremony-free Enter/primary save already NN |
| IX-15 (feedback mandatory) | GOV-077, GOV-089 | No interaction without feedback + sync honesty |
| IX-19 (empty states teach) | GOV-067 | Every empty state must teach already NN |
| IX-24 (no duplicate navigation) | GOV-075, GOV-097 | Already NN Needs Discussion; free-pin model in IA — no re-mint |
| IX-3 Kill List clause | GOV-074 | Kill List consult already NN — reduce-decisions elevated separately |
| IX-25 compression craft anchor | GOV-034, GOV-060 | ~5 interactions craft + economy as performance — continuous delta elevated separately |
| Capture / AI structure anchors | GOV-028, GOV-047, GOV-052, GOV-059, GOV-008 | Capture-first / NL intent / structure later / speed / anti-form-builder |
| Command palette / intents | GOV-099, GOV-095, GOV-027 | Palette first-class IA + intents + intent-over-interface — still open ND on 099/095 |
| Settings / context | GOV-100 | Settings penalty box supports context-before-controls |

### Extract coverage map

| Extract topic | Treatment |
|---------------|-----------|
| Primary interaction philosophy | GOV-062 reuse + GOV-122 primary action |
| Capture flows | GOV-066/028/059 + GOV-127/130/126 |
| Reading flows | GOV-124 context before controls |
| Editing flows | GOV-125 optimistic/confirm + GOV-128 undo |
| AI interactions | GOV-033/088/048 + GOV-126 chips |
| Error recovery | GOV-128 + GOV-077/089 |
| Undo/redo | GOV-128 (undo; redo timing not in source) |
| Empty states | GOV-067 reuse |
| Progressive disclosure | GOV-032 reuse |
| Selection / Multi-select | **Absent** — CF-IX-006 / M-IX-001 |
| Gestures | GOV-134 |
| Navigation interactions | GOV-075 reuse + GOV-127 |
| Keyboard interactions | GOV-129 + GOV-066 |
| Command palette | GOV-099 + GOV-127/129 |
| Search behavior | Via palette only — M-IX-002 |
| Focus management | Bundle in GOV-133 — detail M-IX-003 |
| Accessibility interactions | GOV-133 |
| Cross-platform consistency | GOV-134 + GOV-129 + GOV-040 |
| Interaction refusal rules | GOV-062/063/064/076 + new allowlists |

---

## 2. CANONICAL DECISIONS

Only new decisions supported by Interaction Principles (Confidence High or Medium). Binding when Status is Approved.

### Canonical UX / Interaction Decisions

### GOV-122 — One obvious primary action per view

| Field | Value |
|-------|-------|
| Category | UX — Primary Action |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** Every view declares one primary action. Secondary actions stay visually and cognitively quieter. If everything is primary, nothing is.

**Reason:** Principle IX-1 — One obvious primary action. Interaction hierarchy law not previously citeable as GOV.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** IX-1 — One obvious primary action
  - **Quote:** Every view declares one primary action. Secondary actions stay visually and cognitively quieter. If everything is primary, nothing is.

**Depends On:** `GOV-062`, `GOV-029`, `GOV-106`

**Blocks:** Page Blueprints, Component Blueprints, Visual QA, Android Screens

**Referenced By:** P8, Design System, Android Build, Desktop, Website

**Implementation Impact:** Each screen/sheet names one primary CTA. Demote competing accents. Motion hierarchy (GOV-112) may support but not invent a second primary.

### GOV-123 — Reduce decisions — defer choice; infer with correction before asking

| Field | Value |
|-------|-------|
| Category | UX — Decision Reduction |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | High |
| Canon Class | canonical |

**Decision:** If a choice can wait, it waits. If AI can infer with a correction path, do not ask upfront. Kill List fields stay dead.

**Reason:** Principle IX-3 — Reduce decisions. Elevates deferral/inference order beyond GOV-032 disclosure and GOV-074 Kill List.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** IX-3 — Reduce decisions
  - **Quote:** If a choice can wait, it waits. If AI can infer with correction, do not ask upfront. Kill List fields stay dead.

**Depends On:** `GOV-032`, `GOV-074`, `GOV-035`, `GOV-051`, `GOV-080`

**Blocks:** Onboarding Flows, Capture Forms, AI Intake, Feature Field Intake

**Referenced By:** P8, AI, Android Build, Desktop, Design System

**Implementation Impact:** Default to fewer asks. Prefer infer+correct over upfront pickers. Consult Kill List before new fields. Watch chip fatigue (Known risks).

### GOV-124 — Context before controls — orient before toolbars

| Field | Value |
|-------|-------|
| Category | UX — Orientation |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** Orient the user (what is this moment for?) before presenting a toolbar of possibilities. Capture bar before settings. Briefing before widget garage.

**Reason:** Principle IX-5 — Context before controls. Reading/capture orientation law.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** IX-5 — Context before controls
  - **Quote:** Orient the user (what is this moment for?) before presenting a toolbar of possibilities. Capture bar before settings. Briefing before widget garage.

**Depends On:** `GOV-028`, `GOV-100`, `GOV-029`, `GOV-109`

**Blocks:** Today Layout, Capture Surfaces, Settings Entry Points, Page Blueprints

**Referenced By:** P8, Design System, Android Build, Desktop, Website

**Implementation Impact:** Lead with moment purpose + capture path. Do not open on settings/widget garages. Density modes (GOV-109) must still orient first.

### GOV-125 — Optimistic where safe; branded confirm where destructive

| Field | Value |
|-------|-------|
| Category | UX — Commit Strategy |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** Habit toggles and other low-stakes recoverable writes may be optimistic. Account delete, vault wipe, irreversible money, and privacy-affecting shares confirm — branded dialog, typed confirm when stakes peak.

**Reason:** Principle IX-12 — Optimistic where safe; confirm where destructive. Elevates optimistic path beside existing confirm canon (GOV-015/065).

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** IX-12 — Optimistic where safe; confirm where destructive
  - **Quote:** Habit toggles may be optimistic. Account delete, vault wipe, irreversible money, and privacy-affecting shares confirm — branded dialog, typed confirm when stakes peak.

**Depends On:** `GOV-015`, `GOV-065`, `GOV-046`, `GOV-077`, `GOV-089`

**Blocks:** Habit Toggle UX, Destructive Confirm Spec, Finance Irreversible Flows, Privacy Share Flows

**Referenced By:** P8, Android Build, Desktop, Website, Backend

**Implementation Impact:** Classify writes: optimistic vs confirm-required. Keep branded ConfirmDialog; ban window.confirm. Pair optimistic UI with honest sync states.

### GOV-126 — Infer then chip — correction chips are first-class UI

| Field | Value |
|-------|-------|
| Category | UX — AI Correction |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | High |
| Canon Class | canonical |

**Decision:** Pre-filled structure shows chips for correction. Chips are first-class UI, not afterthoughts.

**Reason:** Principle IX-13 — Infer, then chip. Operationalizes correctable inference as visible chip affordances.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** IX-13 — Infer, then chip
  - **Quote:** Pre-filled structure shows chips for correction. Chips are first-class UI, not afterthoughts.

**Depends On:** `GOV-035`, `GOV-051`, `GOV-047`, `GOV-052`, `GOV-123`

**Blocks:** AI Capture UI, Chip Component Spec, Finance NL Intake, Onboarding Inference

**Referenced By:** P8, AI, Design System, Android Build, Desktop

**Implementation Impact:** Ship chip patterns for inferred fields. Do not hide correction in buried edit menus. Mitigate chip fatigue (REC + Known risks).

### GOV-127 — Capture beats navigation — Palette/Logger outrank deep-link tourism

| Field | Value |
|-------|-------|
| Category | UX — Capture Priority |
| Status | Needs Discussion |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | High |
| Canon Class | canonical |

**Decision:** Getting data in beats touring the information architecture. Command Palette / Logger outrank deep-link tourism for daily intents.

**Reason:** Principle IX-14 — Capture beats navigation. Elevates daily capture primacy beyond GOV-028/059.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** IX-14 — Capture beats navigation
  - **Quote:** Getting data in beats touring the information architecture. Palette/Logger outrank deep-link tourism for daily intents.

**Depends On:** `GOV-028`, `GOV-059`, `GOV-066`, `GOV-099`, `GOV-095`

**Blocks:** Desktop IA Chrome, Command Palette Spec, Logger Placement, Onboarding Tours

**Referenced By:** P8, Desktop, Android Build, Website, Design System

**Implementation Impact:** Prioritize capture entry points over nav tourism. Depends on GOV-099 palette scope still Needs Discussion — founder align via REC.

### GOV-128 — Undo over fear — recoverable mistakes get undo; unrecoverable get confirm

| Field | Value |
|-------|-------|
| Category | UX — Error Recovery |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | High |
| Canon Class | canonical |

**Decision:** Prefer undo windows for recoverable mistakes; prefer confirm for unrecoverable ones. Do not use fear copy for recoverable acts.

**Reason:** Principle IX-16 — Undo over fear. Error-recovery / editing law missing from prior GOVs.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** IX-16 — Undo over fear
  - **Quote:** Prefer undo windows for recoverable mistakes; prefer confirm for unrecoverable ones. Do not use fear copy for recoverable acts.

**Depends On:** `GOV-125`, `GOV-015`, `GOV-065`, `GOV-030`

**Blocks:** Undo Spec, Toast/Undo Windows, Destructive Copy, Component Blueprints

**Referenced By:** P8, Design System, Android Build, Desktop, Website

**Implementation Impact:** Add undo windows for recoverable deletes/edits where feasible. Keep confirm for irreversible. Tone: calm agency, not fear.

### GOV-129 — Shortcuts are progressive enhancement — never the only essential path

| Field | Value |
|-------|-------|
| Category | UX — Keyboard / Shortcuts |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** Keyboard chords (e.g. ⌘K, Space→L, Esc) accelerate; they never become the only path for essential capture on desktop. Mobile provides equivalent one-thumb primary paths.

**Reason:** Principle IX-17 — Shortcuts are progressive enhancement. Keyboard + cross-platform path law.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** IX-17 — Shortcuts are progressive enhancement
  - **Quote:** Chords (`⌘K`, `Space→L`, `Esc`) accelerate; they never become the only path for essential capture on desktop. Mobile has equivalent one-thumb primary paths.

**Depends On:** `GOV-066`, `GOV-127`, `GOV-056`, `GOV-099`

**Blocks:** Keyboard Shortcut Map, Desktop Capture, Mobile One-Thumb Paths, Command Palette

**Referenced By:** P8, Desktop, Android Build, Accessibility, Design System

**Implementation Impact:** Every essential capture has visible primary control. Shortcuts documented/taught (Known risks). Mobile: one-thumb primary, not chord-dependent.

### GOV-130 — Forms are a last resort — NL + chips + progressive fields default

| Field | Value |
|-------|-------|
| Category | UX — Capture Forms |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | High |
| Canon Class | canonical |

**Decision:** Natural language + chips + progressive fields beat multi-field forms as the default personality. Forms remain for high-stakes accuracy when needed — not as default.

**Reason:** Principle IX-18 — Forms are a last resort. Elevates positive default beyond GOV-008 refuse form-builder.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** IX-18 — Forms are a last resort
  - **Quote:** NL + chips + progressive fields beat six-field finance as the only path. Forms remain for high-stakes accuracy when needed — not as default personality.

**Depends On:** `GOV-008`, `GOV-047`, `GOV-126`, `GOV-123`, `GOV-032`

**Blocks:** Finance Capture, Onboarding, Form Component Policy, AI Intake

**Referenced By:** P8, AI, Desktop, Android Build, Design System

**Implementation Impact:** Default capture = NL/chips/progressive. Multi-field forms only when stakes demand accuracy. Do not revive form-builder personality.

### GOV-131 — Consistency of verbs — same action, same verb across surfaces

| Field | Value |
|-------|-------|
| Category | UX — Verb Consistency |
| Status | Approved |
| Priority | P1 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** The same action uses the same verb across surfaces (e.g. Save, Log, Complete, Delete). Verb drift is interaction debt.

**Reason:** Principle IX-20 — Consistency of verbs. Interaction naming law pending Naming Language artifact.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** IX-20 — Consistency of verbs
  - **Quote:** Same action uses same verb across surfaces (Save, Log, Complete, Delete). See Naming Language.

**Depends On:** `GOV-040`, `GOV-062`

**Blocks:** Naming Language Governance, Copy QA, Cross-Client Labels

**Referenced By:** P8, Design System, Android Build, Desktop, Website, Content

**Implementation Impact:** Align button/menu verbs across web/native. Govern full lexicon in Naming Language (next). No synonym salad for same act.

### GOV-132 — Latency honesty — skeleton for waits; never fake instant if pending

| Field | Value |
|-------|-------|
| Category | UX — Latency Honesty |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** Use skeleton/progress for known waits. Do not fake instant success if sync is pending — especially on native outbox.

**Reason:** Principle IX-21 — Latency honesty. Elevates interaction-level honesty beyond GOV-089/121.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** IX-21 — Latency honesty
  - **Quote:** Skeleton/progress for known waits. Do not fake instant if sync is pending — especially on native outbox.

**Depends On:** `GOV-089`, `GOV-121`, `GOV-077`, `GOV-125`

**Blocks:** Sync Honesty UX, Native Outbox UI, Skeleton Patterns

**Referenced By:** P8, Android Build, Desktop, Website, Backend

**Implementation Impact:** Pending/outbox states visible. No success chrome while sync pending. Skeletons for known waits; loading motion not mask (GOV-121).

### GOV-133 — Accessibility is interaction quality — not a later audit

| Field | Value |
|-------|-------|
| Category | Accessibility — Interaction Quality |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | High |
| Canon Class | canonical |

**Decision:** Keyboard access, focus order, hit targets, and announcements are part of interaction design — not a later audit.

**Reason:** Principle IX-22 — Accessibility is interaction quality. Elevates a11y into interaction law (details still in Accessibility Principles).

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** IX-22 — Accessibility is interaction quality
  - **Quote:** Keyboard, focus order, hit targets, and announcements are part of interaction design — not a later audit (see Accessibility Principles).

**Depends On:** `GOV-056`, `GOV-071`, `GOV-129`, `GOV-072`

**Blocks:** Accessibility Principles Governance, Focus Order Spec, Hit Target Spec, Component Blueprints

**Referenced By:** P8, Accessibility, Android Build, Desktop, Website, Design System

**Implementation Impact:** Interaction PRs include focus order, keyboard path, hit targets, announcements. Defer numeric a11y floors to Accessibility Principles + GOV-071/107.

### GOV-134 — Device-appropriate gestures — platform conventions win

| Field | Value |
|-------|-------|
| Category | UX — Gestures |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** Platform conventions (back, share sheets, system biometrics) win over reinvented gestures — unless Constitution requires otherwise (e.g. capture ceiling).

**Reason:** Principle IX-23 — Device-appropriate gestures. Fills gesture gap left open in Motion pass.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** IX-23 — Device-appropriate gestures
  - **Quote:** Platform conventions (back, share sheets, system biometrics) win over reinvented gestures — unless Constitution requires otherwise (e.g., capture ceiling).

**Depends On:** `GOV-040`, `GOV-085`, `GOV-013`, `GOV-041`, `GOV-118`

**Blocks:** Android Gesture Map, iOS/Web Gesture Policy, Capture Ceiling Enforcement

**Referenced By:** P8, Android Build, Desktop, Website, Design System

**Implementation Impact:** Prefer system back/share/biometrics. Do not invent cousin gestures. /m capture ceiling and native≠/m still bind.

### GOV-135 — Compression is continuous — estimate interaction delta; net-positive count fails

| Field | Value |
|-------|-------|
| Category | UX — Interaction Compression |
| Status | Needs Discussion |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | High |
| Canon Class | canonical |

**Decision:** New features must estimate interaction delta. A net-positive interaction count for the same outcome is a fail unless stakes demand it.

**Reason:** Principle IX-25 — Compression is continuous. Elevates continuous delta accounting beyond GOV-034 craft target.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** IX-25 — Compression is continuous
  - **Quote:** New features must estimate interaction delta. Net-positive interaction count for the same outcome is a fail unless stakes demand it.
- **Articles:** _n/a_
  - **Sections:** Reasoning
  - **Quote:** Compression is not a slogan; it is interaction law.

**Depends On:** `GOV-034`, `GOV-060`, `GOV-062`, `GOV-093`

**Blocks:** Feature Intake, Interaction Audit Gate, Compression QA

**Referenced By:** P8, Product, Design System, Android Build, Desktop

**Implementation Impact:** Feature proposals include interaction-delta estimate. Ties to GOV-060 Needs Discussion (economy as performance) and eight-gate (GOV-093).


---

## 3. GOVERNANCE RECOMMENDATIONS (NOT CANON)

### REC-048 — Ratify Approved Interaction GOVs (122–126, 128–134) as citeable interaction canon

- **Reason:** IX pass extracts operational Article V rules not previously GOV-cited.
- **Impact:** PRs cite GOV-IDs for capture, chips, undo, shortcuts, forms, gestures.
- **Risk:** Medium if delayed — friction returns as taste.
- **Priority:** P0 · **Status:** Pending Founder
- **Related GOV:** GOV-122, GOV-123, GOV-124, GOV-125, GOV-126, GOV-128, GOV-129, GOV-130, GOV-131, GOV-132, GOV-133, GOV-134

### REC-049 — Publish Chip UX Spec — correction patterns + anti-fatigue limits

- **Reason:** GOV-126 + Known risks chip fatigue if everything inferred.
- **Impact:** Caps chip density; defines correction UX.
- **Risk:** High — chip spam destroys trust.
- **Priority:** P0 · **Status:** Pending Founder
- **Related GOV:** GOV-126, GOV-123, GOV-035

### REC-050 — Teach desktop shortcuts; document chord map; keep visible primary paths

- **Reason:** Known risks: Desktop shortcuts never taught → power features rot. GOV-129.
- **Impact:** Shortcuts discovered; essentials remain clickable.
- **Risk:** Medium — power features rot.
- **Priority:** P1 · **Status:** Pending Founder
- **Related GOV:** GOV-129, GOV-099, GOV-066

### REC-051 — Founder align GOV-127 capture-beats-nav with GOV-099 palette scope + GOV-095 intents

- **Reason:** GOV-127 Needs Discussion depends on open IA ND items.
- **Impact:** Unblocks Palette/Logger primacy vs deep-link tourism.
- **Risk:** High thrash if nav and capture fight.
- **Priority:** P0 · **Status:** Pending Founder
- **Related GOV:** GOV-127, GOV-099, GOV-095, GOV-075

### REC-052 — Add Interaction QA gates: primary action, context-before-controls, undo/confirm class, latency honesty, gesture platform-fit

- **Reason:** Operationalize new IX GOVs + Known risks over-compression.
- **Impact:** PR checklist for interaction debt.
- **Risk:** Low process; High drift if skipped.
- **Priority:** P0 · **Status:** Pending Founder
- **Related GOV:** GOV-122, GOV-124, GOV-125, GOV-128, GOV-132, GOV-134, GOV-135

### REC-053 — Founder resolve GOV-135 × GOV-060 — interaction delta accounting as performance/economy

- **Reason:** Both Needs Discussion; IX-25 supplies delta fail rule Constitution deferred.
- **Impact:** Feature intake gets numeric interaction delta gate.
- **Risk:** Medium — compression theater or ignored economy.
- **Priority:** P0 · **Status:** Pending Founder
- **Related GOV:** GOV-135, GOV-060, GOV-034

### REC-054 — Next P7 artifact: 11_ACCESSIBILITY_PRINCIPLES or 13_NAMING_LANGUAGE or 10_COMPONENT_PRINCIPLES

- **Reason:** IX-20/22 defer details; Motion/VL still need token contracts. Page Blueprints open.
- **Impact:** Continues build-without-reread.
- **Risk:** Low.
- **Priority:** P0 · **Status:** Pending Founder
- **Related GOV:** GOV-131, GOV-133, GOV-134, GOV-073


---

## 4. Conflicts

| ID | Type | Detail | Action |
|----|------|--------|--------|
| CF-IX-001 | Known risk — chip fatigue | Known risks: Chip fatigue if everything is inferred. GOV-126/123 create pressure toward chips.… | REC-049 |
| CF-IX-002 | Known risk — over-compression removes safety asks | Known risks: Over-compression removing necessary safety asks. Tension with GOV-135/125 confirm rules.… | REC-052; stakes override compression |
| CF-IX-003 | Known risk — shortcuts never taught | Desktop shortcuts never taught → power features rot. GOV-129 progressive enhancement.… | REC-050 |
| CF-IX-004 | Dependency on open ND — navigation primacy | IX-24 reuses GOV-075 Needs Discussion; GOV-127 also ND on palette/intents.… | REC-051 + keep REC-032 |
| CF-IX-005 | Complementary ND — notifications | IX-9 reuses GOV-064 still Needs Discussion; no new notification GOV minted.… | Keep REC-017 |
| CF-IX-006 | Extract gap — selection / multi-select / search detail / focus management | Founder extract asked selection, multi-select, search behavior, focus management. Source IX has no dedicated selection/m… | REC-054 Accessibility/Component; Missing M-IX-* |
| CF-IX-007 | Complementary ND — compression economy | GOV-135 continuous delta vs GOV-060 interaction economy as performance both Needs Discussion.… | REC-053 |

---

## 5. Missing Decisions

| ID | Missing | Why | Next |
|----|---------|-----|------|
| M-IX-001 | Selection and multi-select behavior | Not in 08_INTERACTION source | Component Principles / blueprints — do not invent |
| M-IX-002 | Search behavior beyond Command Palette primacy | Only Palette/Logger in IX-14/17; GOV-099 ND | REC-030 + REC-051 |
| M-IX-003 | Focus management detail (order, trap, restore) | IX-22 names focus order only | Govern 11_ACCESSIBILITY_PRINCIPLES |
| M-IX-004 | Chip anti-fatigue numeric limits | Known risk; GOV-126 | REC-049 |
| M-IX-005 | Undo window duration / scope matrix | GOV-128 states preference not timings | Component Blueprints / Undo Spec |
| M-IX-006 | Full verb lexicon | GOV-131 points to Naming Language | Govern 13_NAMING_LANGUAGE |

---

## 6. Questions for Founder

1. Approve one-primary-action law (GOV-122) on every view including sheets?
2. Confirm GOV-127: Palette/Logger outrank deep-link tourism — with GOV-099 scope (REC-051)?
3. Approve optimistic habit toggles + branded confirm peak stakes (GOV-125)?
4. Confirm undo windows for recoverable acts; no fear copy (GOV-128)?
5. Resolve GOV-135 × GOV-060 interaction delta as intake gate (REC-053)?
6. Chip fatigue: publish limits now (REC-049)?
7. Selection/multi-select: confirm defer — no invent (CF-IX-006)?
8. Next artifact: Accessibility / Naming / Component Principles (REC-054)?

---

## 7. Dependency Graph Summary

### Highest fan-in (from new GOV-122…135)

| GOV ID | Count |
|--------|-------|
| GOV-062 | 3 |
| GOV-029 | 2 |
| GOV-032 | 2 |
| GOV-035 | 2 |
| GOV-051 | 2 |
| GOV-028 | 2 |
| GOV-015 | 2 |
| GOV-065 | 2 |
| GOV-077 | 2 |
| GOV-089 | 2 |
| GOV-047 | 2 |
| GOV-123 | 2 |

### High cost (new)

| GOV-123 | Reduce decisions — defer choice; infer with correction before asking | High |
| GOV-126 | Infer then chip — correction chips are first-class UI | High |
| GOV-127 | Capture beats navigation — Palette/Logger outrank deep-link tourism | High |
| GOV-128 | Undo over fear — recoverable mistakes get undo; unrecoverable get confirm | High |
| GOV-130 | Forms are a last resort — NL + chips + progressive fields default | High |
| GOV-133 | Accessibility is interaction quality — not a later audit | High |
| GOV-135 | Compression is continuous — estimate interaction delta; net-positive count fails | High |

### Needs Discussion

| GOV-127 | Capture beats navigation — Palette/Logger outrank deep-link tourism |
| GOV-135 | Compression is continuous — estimate interaction delta; net-positive count fails |

---

## 8. Final Governance Score

| Dimension | Score (/10) |
|-----------|-------------|
| Identity Clarity | 9 |
| Enforceability | 8 |
| Cross Platform Readiness | 8 |
| Ai Readiness | 8 |
| Conflict Hygiene | 7 |
| Metric Rigor | 7 |
| Amendment Process | 8 |
| Completeness Build Without Reread | 7 |
| Traceability Evidence | 9 |
| Machine Readability | 9 |

### Final Governance Score: **80 / 100**

Interaction Principles operationalize Article V: primary action, decision reduction, context-before-controls, optimistic/confirm, chips, capture-over-nav, undo, shortcuts, forms-last, verbs, latency honesty, a11y-as-interaction, gestures, continuous compression. Heavy reuse of NN/Constitution/Motion. GOV-127 and GOV-135 Needs Discussion. Selection/multi-select absent — not invented.

---

## Evidence (process)

- Source read: `08_INTERACTION_PRINCIPLES.md` v3.0 FROZEN
- Cross-ref: Constitution + NN + IA + VL + Motion + MASTER_DECISION_REGISTRY
- Untouched: prior artifact trios + `00_GOVERNANCE_STANDARD.md` + source
- New GOV: GOV-122…GOV-135
- Validation: continuous IDs, schema, dup GOV, dup decision, broken deps/refs, evidence — see closeout
