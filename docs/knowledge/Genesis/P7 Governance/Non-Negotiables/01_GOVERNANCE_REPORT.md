# 01 — Non-Negotiables Governance Report

```yaml
document: Non-Negotiables Governance Report
phase: P7
standard: AIIMIN GENESIS/P7 Governance/00_GOVERNANCE_STANDARD.md
standard_version: 1.0
source: AIIMIN GENESIS/P5 Constitution/18_NON_NEGOTIABLES.md
source_version: 3.0
source_status: FROZEN
governance_date: 2026-07-22
gov_ids_new: GOV-062…GOV-093
gov_ids_referenced: GOV-001…GOV-061 (Constitution; not re-minted)
```

> Machine-readable twin: `02_GOVERNANCE_DECISIONS.json` · Index: `03_GOVERNANCE_INDEX.md` · Standard: `../00_GOVERNANCE_STANDARD.md`

Source Non-Negotiables **not modified**. Constitution governance trio **not modified**. New GOV IDs only for genuinely new canon; duplicates reference existing GOV IDs.

---

## 1. Artifact Overview

| Field | Value |
|-------|-------|
| Source | `18_NON_NEGOTIABLES.md` v3.0 FROZEN |
| Structure | Required (25) · Forbidden (46) · Gate questions (8) |
| New canonical GOV | GOV-062…GOV-093 (32) |
| Existing GOV referenced | 30 unique IDs from Constitution (no re-mint) |
| Recommendations | REC-016…REC-026 (11) — not canon |
| Conflicts flagged | CF-NN-001…CF-NN-008 |
| Needs Discussion | GOV-064, GOV-068, GOV-071, GOV-073, GOV-075 |
| Governance score | **79 / 100** |

**Separation law:** Canonical Decisions ≠ Governance Recommendations. Recommendations require founder approval.

### Existing GOV references (duplicates — do not re-mint)

| NN item | Existing GOV | Note |
|---------|--------------|------|
| Required 1 | `GOV-023` | Feature must justify human problem |
| Required 5 (confirm core) | `GOV-015`, `GOV-046` | Destructive confirm; branded elevated in GOV-065 |
| Required 6 | `GOV-035`, `GOV-051` | Correctable inference |
| Required 9 | `GOV-017`, `GOV-044` | Vault ships with behavior change |
| Required 10 | `GOV-014` | Export and delete |
| Required 11 | `GOV-016` | Journal body out of analytics |
| Required 12 | `GOV-036` | Palette locked |
| Required 13 | `GOV-012`, `GOV-039` | Split brand lockup |
| Required 14 | `GOV-013`, `GOV-041` | /m capture-only |
| Required 16 | `GOV-006`, `GOV-050` | No clinical claims |
| Required 17 | `GOV-018`, `GOV-042` | Auth/schema explicit ask |
| Required 19 | `GOV-020` | One write primitive per concept |
| Required 20 | `GOV-033` | Focus interruptibility |
| Forbidden 2 | `GOV-053` | No decorative AI / AI magic |
| Forbidden 4 | `GOV-037`, `GOV-038` | No visual clutter as personality |
| Forbidden 5 | `GOV-023` | No feature without user problem |
| Forbidden 7 | `GOV-005` | No social feed / leaderboards |
| Forbidden 8 | `GOV-006`, `GOV-050` | No AI therapist |
| Forbidden 12 | `GOV-008`, `GOV-028` | No mode gate before journal |
| Forbidden 13 | `GOV-008` | No mandatory finance category-only path |
| Forbidden 17 | `GOV-010` | No GoodNotes handwriting product |
| Forbidden 18 | `GOV-010`, `GOV-037` | No purple/cream/broadsheet identity |
| Forbidden 21 | `GOV-013`, `GOV-041` | No analytics/tools on /m |
| Forbidden 25 | `GOV-011` | No sell/share lifelog |
| Forbidden 26 | `GOV-009`, `GOV-031` | No shame-streak retention |
| Forbidden 27 | `GOV-033` | No JITAI while interruptibility unsolved |
| Forbidden 29 | `GOV-008` | No forced sidebar taxonomy |
| Forbidden 40 | `GOV-037` | Brand-test required |
| Forbidden 41 | `GOV-010`, `GOV-037` | No decorative purple/cyan/rainbow identity |

---

## 2. CANONICAL DECISIONS

Only new decisions supported by Non-Negotiables (Confidence High or Medium). Binding when Status is Approved. Duplicates of Constitution decisions are **referenced**, not duplicated below.

### Canonical Product Decisions

### GOV-068 — Life Score honest; XP celebratory — roles unmixed

| Field | Value |
|-------|-------|
| Category | Product — Score Roles |
| Status | Needs Discussion |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | High |
| Canon Class | canonical |

**Decision:** Life Score stays honest; XP stays celebratory. Their roles must not be mixed (no vanity Life Score; no dishonest XP-as-health).

**Reason:** Non-Negotiables Required 15; sharpens GOV-009.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** Required (must)
  - **Quote:** Life Score stays honest; XP stays celebratory — roles unmixed.

**Depends On:** `GOV-009`, `GOV-003`

**Blocks:** Life Score Spec, Gamification UX, Master Product Specification

**Referenced By:** P8, P9, Android Build, Website, AI

**Implementation Impact:** Needs Life Score formula/inputs (Constitution M-005) plus explicit XP role matrix before full enforcement.


### GOV-074 — Kill List consulted before new fields

| Field | Value |
|-------|-------|
| Category | Product — Kill List Gate |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Low |
| Canon Class | canonical |

**Decision:** The Kill List must be consulted before adding new fields. Fields that revive killed concepts are forbidden without founder override.

**Reason:** Non-Negotiables Required 25 + Gate question 1.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** Required (must)
  - **Quote:** Kill List consulted before new fields.

**Depends On:** `GOV-022`, `GOV-023`

**Blocks:** Schema Field Intake, Feature Intake, Master Product Specification

**Referenced By:** P8, P9, Backend, Android Build

**Implementation Impact:** Field/feature proposals must cite Kill List check; PR template checkbox.


### GOV-078 — No automatic posting of private life

| Field | Value |
|-------|-------|
| Category | Privacy — Auto-Post Ban |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Low |
| Canon Class | canonical |

**Decision:** Automatic posting of private life is forbidden.

**Reason:** Non-Negotiables Forbidden 9; sharpens social refuse.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** Forbidden (must not)
  - **Quote:** No automatic posting of private life.

**Depends On:** `GOV-005`, `GOV-011`

**Blocks:** Sharing Features, Social Integrations, Export-to-Public Paths

**Referenced By:** P8, Android Build, Backend, Website

**Implementation Impact:** Any share/publish path requires explicit user action; no silent auto-post.


### GOV-084 — Elite is not longer-PDF product definition

| Field | Value |
|-------|-------|
| Category | Product — Tier Definition Ban |
| Status | Approved |
| Priority | P1 |
| Confidence | High |
| Implementation Cost | Low |
| Canon Class | canonical |

**Decision:** Elite-as-longer-PDF must not define the product or tier value.

**Reason:** Non-Negotiables Forbidden 30.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** Forbidden (must not)
  - **Quote:** No Elite-as-longer-PDF as the product definition.

**Depends On:** `GOV-001`, `GOV-021`

**Blocks:** Pricing/Tier Spec, Elite Packaging, Marketing Copy

**Referenced By:** P8, P9, Website, Content System

**Implementation Impact:** Tier differentiation must be capability/outcome based, not PDF length.


### GOV-092 — No device bait-and-switch marketing vs shipped ceilings

| Field | Value |
|-------|-------|
| Category | Product — Marketing Honesty |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Low |
| Canon Class | canonical |

**Decision:** Device bait-and-switch marketing (e.g., "pocket Life OS") that contradicts shipped ceilings is forbidden.

**Reason:** Non-Negotiables Forbidden 45.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** Forbidden (must not)
  - **Quote:** No device bait-and-switch marketing ("pocket Life OS") that contradicts shipped ceilings.

**Depends On:** `GOV-013`, `GOV-085`, `GOV-041`

**Blocks:** Marketing Copy, Store Listings, Website Landing

**Referenced By:** P8, Website, Content System, Android Build

**Implementation Impact:** Marketing must match /m vs native vs desktop ceilings actually shipped.


### Canonical UX Decisions

### GOV-062 — Interaction must justify fidelity, speed, trust, or clarity

| Field | Value |
|-------|-------|
| Category | UX — Interaction Intake |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** Every interaction must justify at least one of: fidelity, speed, trust, or clarity. Interactions that add ceremony without one of these are non-canon.

**Reason:** Non-Negotiables Required 2 — extends feature intake to interaction-level economy.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** Required (must)
  - **Quote:** Every interaction justifies fidelity, speed, trust, or clarity.

**Depends On:** `GOV-023`, `GOV-026`, `GOV-034`

**Blocks:** Interaction Audit, Component Patterns, Android UX Review

**Referenced By:** P8, Design System, Android Build, Website

**Implementation Impact:** UX reviews reject taps/screens that cannot name which of the four they serve.


### GOV-064 — Every notification must deserve attention

| Field | Value |
|-------|-------|
| Category | UX — Notifications |
| Status | Needs Discussion |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | High |
| Canon Class | canonical |

**Decision:** Every notification must deserve attention. Notifications that do not clear an attention-worthiness bar are forbidden.

**Reason:** Non-Negotiables Required 4; fills Constitution M-010 partially (taxonomy still missing).

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** Required (must)
  - **Quote:** Every notification deserves attention.

**Depends On:** `GOV-033`, `GOV-026`

**Blocks:** Notification Taxonomy, Push Strategy, Interruptibility Spec

**Referenced By:** P8, Android Build, Backend, AI

**Implementation Impact:** Needs founder-approved notification taxonomy (channels, urgency, mute rules) before full enforcement. Until then: reject obviously low-value pushes.


### GOV-065 — Branded destructive confirm; ban window.confirm

| Field | Value |
|-------|-------|
| Category | Safety — Destructive Confirm Branding |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** Every destructive action must confirm with a branded confirm path. Product destructive paths must not use browser/native generic window.confirm.

**Reason:** Non-Negotiables Required 5 (branded) + Forbidden 28; elevates Constitution CF-002.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** Required (must)
  - **Quote:** Every destructive action confirms (branded).
- **Articles:** _n/a_
  - **Sections:** Forbidden (must not)
  - **Quote:** No `window.confirm` for product destructive paths.

**Depends On:** `GOV-015`, `GOV-046`

**Blocks:** Destructive UX Components, Web Safety Pass, Android Safety Pass

**Referenced By:** P8, Design System, Android Build, Website

**Implementation Impact:** Ship shared branded confirm pattern on web + Android; grep-ban window.confirm in product flows.


### GOV-066 — Ceremony-free Enter/primary save on every capture path

| Field | Value |
|-------|-------|
| Category | UX — Capture Ceremony Ban |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | High |
| Canon Class | canonical |

**Decision:** Every capture path must allow Enter or primary save without ceremony (no forced taxonomy, mode gates, or extra steps before save).

**Reason:** Non-Negotiables Required 7; operationalizes capture-first.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** Required (must)
  - **Quote:** Every capture path allows Enter/primary save without ceremony.

**Depends On:** `GOV-028`, `GOV-008`, `GOV-059`

**Blocks:** Capture UX, Journal Capture, Finance Capture, Android Capture

**Referenced By:** P8, Android Build, Website, AI

**Implementation Impact:** Capture flows must expose primary save/Enter first; structure optional after.


### GOV-067 — Every empty state must teach

| Field | Value |
|-------|-------|
| Category | UX — Empty States |
| Status | Approved |
| Priority | P1 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** Every empty state must teach — orient the user to the next useful action or meaning of the surface. Blank decorative emptiness is forbidden.

**Reason:** Non-Negotiables Required 8.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** Required (must)
  - **Quote:** Every empty state teaches.

**Depends On:** `GOV-030`, `GOV-031`

**Blocks:** Empty State Catalog, Onboarding Soft Paths

**Referenced By:** P8, Design System, Android Build, Website

**Implementation Impact:** Empty states require teaching copy/CTA; shame-empty and dead blank panels are non-canon.


### GOV-075 — No duplicate navigation systems fighting for primacy

| Field | Value |
|-------|-------|
| Category | IA — Navigation Primacy |
| Status | Needs Discussion |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | High |
| Canon Class | canonical |

**Decision:** There must not be duplicate navigation systems fighting for primacy.

**Reason:** Non-Negotiables Forbidden 1; nav destinations still missing (M-001 / IA Principles).

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** Forbidden (must not)
  - **Quote:** No duplicate navigation systems fighting for primacy.

**Depends On:** `GOV-012`, `GOV-020`

**Blocks:** Information Architecture, Bottom Nav, Sidebar Spec, Android Navigation

**Referenced By:** P8, Android Build, Website, Design System

**Implementation Impact:** Needs IA Principles + primary nav map; until then reject second competing nav shells.


### GOV-076 — Today anti-clutter: no meaningless widgets; no DEMO/LIVE vanity chrome

| Field | Value |
|-------|-------|
| Category | UX — Today Surface Integrity |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** Today must not host meaningless widgets. DEMO/LIVE vanity chrome must not compete with Capture on Today.

**Reason:** Non-Negotiables Forbidden 3 + Forbidden 46.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** Forbidden (must not)
  - **Quote:** No meaningless widgets on Today.
- **Articles:** _n/a_
  - **Sections:** Forbidden (must not)
  - **Quote:** No DEMO/LIVE vanity chrome competing with Capture on Today.

**Depends On:** `GOV-028`, `GOV-029`, `GOV-062`

**Blocks:** Today Layout, Prototype Studio Port, Android Today

**Referenced By:** P8, Android Build, Website, Design System

**Implementation Impact:** Today modules must justify capture/clarity value; strip vanity status chrome.


### GOV-077 — No interaction without feedback

| Field | Value |
|-------|-------|
| Category | UX — Feedback Mandatory |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** No interaction without feedback. User-initiated actions must produce perceptible confirmation, progress, or error state.

**Reason:** Non-Negotiables Forbidden 6.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** Forbidden (must not)
  - **Quote:** No interaction without feedback.

**Depends On:** `GOV-062`, `GOV-089`

**Blocks:** Interaction Patterns, Sync UX, Form Controls

**Referenced By:** P8, Design System, Android Build, Website

**Implementation Impact:** Buttons/gestures/sync actions need feedback states; silent no-ops forbidden.


### GOV-079 — No dark-pattern upgrade nags; no infinite customization onboarding

| Field | Value |
|-------|-------|
| Category | UX — Growth Ethics |
| Status | Approved |
| Priority | P1 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** Dark-pattern upgrade nags are forbidden. Infinite customization onboarding is forbidden.

**Reason:** Non-Negotiables Forbidden 10 + Forbidden 11.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** Forbidden (must not)
  - **Quote:** No dark-pattern upgrade nags.
- **Articles:** _n/a_
  - **Sections:** Forbidden (must not)
  - **Quote:** No infinite customization onboarding.

**Depends On:** `GOV-031`, `GOV-003`

**Blocks:** Monetization UX, Onboarding, Waitlist/Upgrade Flows

**Referenced By:** P8, Website, Android Build, Content System

**Implementation Impact:** Upgrade prompts honest + dismissible; onboarding finite and capture-first.


### GOV-080 — Anti-picker proliferation: mood, theme, Life Arc

| Field | Value |
|-------|-------|
| Category | UX — Primitive Uniqueness |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** Forbidden: a fifth mood picker family; a third theme picker family (prefer OS sync); parallel Life Arc editors.

**Reason:** Non-Negotiables Forbidden 14–16; enforces one-primitive doctrine.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** Forbidden (must not)
  - **Quote:** No fifth mood picker family.
- **Articles:** _n/a_
  - **Sections:** Forbidden (must not)
  - **Quote:** No third theme picker family (prefer OS sync).
- **Articles:** _n/a_
  - **Sections:** Forbidden (must not)
  - **Quote:** No parallel Life Arc editors.

**Depends On:** `GOV-020`, `GOV-040`

**Blocks:** Mood UX, Theme System, Life Arc Editors

**Referenced By:** P8, Design System, Android Build, Website

**Implementation Impact:** Reuse existing pickers/editors; theme prefers OS; no parallel Life Arc write UIs.


### GOV-088 — No mid-Focus coaching modals

| Field | Value |
|-------|-------|
| Category | UX — Focus Protection |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Low |
| Canon Class | canonical |

**Decision:** Mid-Focus coaching modals are forbidden.

**Reason:** Non-Negotiables Forbidden 38; specializes interruptibility.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** Forbidden (must not)
  - **Quote:** No mid-Focus coaching modals.

**Depends On:** `GOV-033`, `GOV-055`

**Blocks:** Focus Mode UX, Coaching Timing, JITAI

**Referenced By:** P8, Android Build, AI, Website

**Implementation Impact:** Defer coaching until Focus session ends or user opens coaching surface.


### Canonical Visual Decisions

### GOV-081 — Dead accent revival ban: electric blue; Waitlist forest-green as Life OS

| Field | Value |
|-------|-------|
| Category | Visual — Accent Death Locks |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Low |
| Canon Class | canonical |

**Decision:** Electric blue system accent revival is forbidden. Forest-green WaitlistBrand-as-Life-OS identity is forbidden.

**Reason:** Non-Negotiables Forbidden 19–20; Design History deaths.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** Forbidden (must not)
  - **Quote:** No electric blue system accent revival.
- **Articles:** _n/a_
  - **Sections:** Forbidden (must not)
  - **Quote:** No forest-green WaitlistBrand-as-Life-OS.

**Depends On:** `GOV-036`, `GOV-037`, `GOV-010`

**Blocks:** Palette Enforcement, Waitlist vs Product Chromes

**Referenced By:** P8, Design System, Website, Android Build

**Implementation Impact:** Keep WaitlistBrand scoped to waitlist surfaces; Life OS uses locked palette only.


### GOV-090 — No Inter-as-brand-identity; no unemployed font buffet

| Field | Value |
|-------|-------|
| Category | Visual — Typography Identity |
| Status | Approved |
| Priority | P1 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** Inter-as-brand-identity and unemployed font buffet on product surfaces are forbidden.

**Reason:** Non-Negotiables Forbidden 42.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** Forbidden (must not)
  - **Quote:** No Inter-as-brand-identity or unemployed font buffet on product surfaces.

**Depends On:** `GOV-037`, `GOV-003`

**Blocks:** Typography Spec, Design System Fonts, Brand Book

**Referenced By:** P8, Design System, Website, Android Build

**Implementation Impact:** Use locked brand typography; do not default Inter as identity or scatter unused font families.


### GOV-091 — No identical glass-card grids as only page personality

| Field | Value |
|-------|-------|
| Category | Visual — Composition Diversity |
| Status | Approved |
| Priority | P1 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** Identical glass-card grids must not be the only page personality.

**Reason:** Non-Negotiables Forbidden 44.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** Forbidden (must not)
  - **Quote:** No identical glass-card grids as the only page personality.

**Depends On:** `GOV-038`, `GOV-037`, `GOV-029`

**Blocks:** Page Composition, Design System Layouts

**Referenced By:** P8, Design System, Website, Android Build

**Implementation Impact:** Surfaces may use cards for interaction containers; pages need distinct composition beyond cloned glass grids.


### Canonical Technical Decisions

### GOV-073 — Cross-client token meaning aligned; drift is debt

| Field | Value |
|-------|-------|
| Category | Technical — Token Alignment |
| Status | Needs Discussion |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Extreme |
| Canon Class | canonical |

**Decision:** Cross-client token meaning must stay aligned. Treating conflicting token sources as options is forbidden — drift is debt.

**Reason:** Non-Negotiables Required 24 + Forbidden 43.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** Required (must)
  - **Quote:** Cross-client token meaning stays aligned.
- **Articles:** _n/a_
  - **Sections:** Forbidden (must not)
  - **Quote:** No treating conflicting token sources as "options" — drift is debt.

**Depends On:** `GOV-040`, `GOV-036`

**Blocks:** Design Tokens Source of Truth, Cross-Client Contracts, Design System

**Referenced By:** P8, Design System, Android Build, Website

**Implementation Impact:** Founder must name single token source of truth and audit web/Android/native drift.


### GOV-083 — Journal body never in push notifications

| Field | Value |
|-------|-------|
| Category | Privacy — Journal Push Ban |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** Journal body must never appear in push notifications.

**Reason:** Non-Negotiables Forbidden 23; extends GOV-016 beyond analytics.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** Forbidden (must not)
  - **Quote:** No journal body in push notifications.

**Depends On:** `GOV-016`, `GOV-064`

**Blocks:** Push Payload Schema, Notification Templates

**Referenced By:** P8, Android Build, Backend

**Implementation Impact:** Push templates use generic/safe titles only; never journal body text.


### GOV-085 — Capacitor not primary app; native not bound by /m capture ceiling

| Field | Value |
|-------|-------|
| Category | Platform — Client Destiny |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | High |
| Canon Class | canonical |

**Decision:** Capacitor-as-primary-app revival against founder decision is forbidden. The phone-web /m capture-only ceiling must not be applied as the native app's destiny.

**Reason:** Non-Negotiables Forbidden 31–32; reinforces Constitution CF-006 resolution.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** Forbidden (must not)
  - **Quote:** No Capacitor-as-primary-app revival against founder decision.
- **Articles:** _n/a_
  - **Sections:** Forbidden (must not)
  - **Quote:** No "capture-only" ceiling applied as the native app's destiny.

**Depends On:** `GOV-013`, `GOV-041`, `GOV-040`

**Blocks:** Native Roadmap, Capacitor Scope, Marketing Device Claims

**Referenced By:** P8, Android Build, Website, Monorepo

**Implementation Impact:** Native Android is rich companion; Capacitor /m remains capture stopgap only.


### GOV-089 — No silent failed sync presented as success

| Field | Value |
|-------|-------|
| Category | Technical — Sync Honesty |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | High |
| Canon Class | canonical |

**Decision:** Silent failed sync must never be presented as success.

**Reason:** Non-Negotiables Forbidden 39.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** Forbidden (must not)
  - **Quote:** No silent failed sync presented as success.

**Depends On:** `GOV-077`, `GOV-045`

**Blocks:** Sync UX Contract, Outbox/WorkManager UX, Offline Mode

**Referenced By:** P8, Android Build, Backend, Website

**Implementation Impact:** Failed/pending sync must surface truthful state; success chrome only on confirmed success.


### Canonical AI Decisions

### GOV-070 — Meds/allergies/PIN never inferred; PIN never in telemetry

| Field | Value |
|-------|-------|
| Category | Privacy — Sensitive Inference Ban |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | High |
| Canon Class | canonical |

**Decision:** Medications, allergies, and PIN must never be inferred by AI or automation. PIN must never appear in telemetry.

**Reason:** Non-Negotiables Required 21 + Forbidden 24; fills Constitution M-016.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** Required (must)
  - **Quote:** Meds/allergies/PIN never inferred.
- **Articles:** _n/a_
  - **Sections:** Forbidden (must not)
  - **Quote:** No PIN in telemetry.

**Depends On:** `GOV-051`, `GOV-016`, `GOV-058`

**Blocks:** AI Inference Allowlist, Telemetry Schema, Health Capture

**Referenced By:** P8, Android Build, Backend, AI

**Implementation Impact:** Hard deny-list in inference + telemetry scrubbers; explicit user entry only for these fields.


### GOV-082 — No invented finance transactions without utterance

| Field | Value |
|-------|-------|
| Category | AI — Finance Integrity |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | High |
| Canon Class | canonical |

**Decision:** Finance transactions must not be invented without an utterance (or equivalent explicit user capture).

**Reason:** Non-Negotiables Forbidden 22.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** Forbidden (must not)
  - **Quote:** No invented finance transactions without utterance.

**Depends On:** `GOV-035`, `GOV-051`, `GOV-047`

**Blocks:** Finance AI, Transaction Ingestion, Backend Finance APIs

**Referenced By:** P8, AI, Backend, Android Build

**Implementation Impact:** Finance write path requires user utterance/explicit capture; AI may suggest with correction chip only.


### Canonical Motion Decisions

### GOV-063 — Every animation must communicate meaning

| Field | Value |
|-------|-------|
| Category | Motion — Meaningful Motion |
| Status | Approved |
| Priority | P1 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** Every animation must communicate meaning. Decorative motion without semantic or emotional-contract purpose is forbidden.

**Reason:** Non-Negotiables Required 3.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** Required (must)
  - **Quote:** Every animation communicates meaning.

**Depends On:** `GOV-054`, `GOV-055`, `GOV-030`

**Blocks:** Motion Spec, Design System Motion Tokens

**Referenced By:** P8, Design System, Android Build, Website

**Implementation Impact:** Motion PRs must state what meaning the motion communicates; else remove.


### GOV-072 — Reduced motion must be honored

| Field | Value |
|-------|-------|
| Category | Motion — Reduced Motion |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** Reduced motion preferences must be honored across product surfaces.

**Reason:** Non-Negotiables Required 23; durations/easing still in Motion Principles (M-009).

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** Required (must)
  - **Quote:** Reduced motion honored.

**Depends On:** `GOV-063`, `GOV-054`

**Blocks:** Motion Spec, Android Motion, Web Motion

**Referenced By:** P8, Design System, Android Build, Website

**Implementation Impact:** Respect OS/prefers-reduced-motion; provide non-animated equivalents for meaning-bearing motion.


### Canonical Accessibility Decisions

### GOV-071 — Critical-path contrast and operable capture

| Field | Value |
|-------|-------|
| Category | Accessibility — Critical Paths |
| Status | Needs Discussion |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | High |
| Canon Class | canonical |

**Decision:** Accessibility contrasts and operable capture are required on critical paths.

**Reason:** Non-Negotiables Required 22; WCAG level still deferred to Accessibility Principles (M-008).

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** Required (must)
  - **Quote:** Accessibility contrasts and operable capture on critical paths.

**Depends On:** `GOV-056`, `GOV-057`, `GOV-059`

**Blocks:** A11y Spec, Capture Critical Path QA

**Referenced By:** P8, Design System, Android Build, Website

**Implementation Impact:** Needs WCAG target + contrast tokens from Accessibility Principles; until then enforce operable capture + no color-only status (GOV-087).


### GOV-087 — No emoji-as-IA; no color-only critical status

| Field | Value |
|-------|-------|
| Category | Accessibility — Status & IA Encoding |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** Emoji must not serve as information architecture. Critical status must not be color-only.

**Reason:** Non-Negotiables Forbidden 36–37.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** Forbidden (must not)
  - **Quote:** No emoji-as-IA.
- **Articles:** _n/a_
  - **Sections:** Forbidden (must not)
  - **Quote:** No color-only critical status.

**Depends On:** `GOV-071`, `GOV-056`

**Blocks:** IA Labels, Status Components, Design System

**Referenced By:** P8, Design System, Android Build, Website

**Implementation Impact:** IA uses text/structure; status uses text/icon + color, never color alone.


### Canonical Governance Process Decisions

### GOV-069 — Secrets never enter vault, docs, or commit chat dumps

| Field | Value |
|-------|-------|
| Category | Governance — Secrets Hygiene |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Low |
| Canon Class | canonical |

**Decision:** Secrets (API keys, tokens, passwords, connection strings) must never enter vault notes, docs, or chat dumps intended for commit. Env names OK; values stay in host secrets / local .env.

**Reason:** Non-Negotiables Required 18.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** Required (must)
  - **Quote:** Secrets never enter vault/docs/chat dumps for commit.

**Depends On:** `GOV-017`

**Blocks:** Vault Hygiene, Agent Output Review, Commit Checks

**Referenced By:** P8, Android Build, Backend, Website

**Implementation Impact:** Pre-commit and agent rules scrub secrets; vault review rejects secret values.


### GOV-086 — Agent memory hygiene: vault over whole-repo scan; slim AGENTS; no vendor vanity

| Field | Value |
|-------|-------|
| Category | Governance — Agent Operating Rules |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Low |
| Canon Class | canonical |

**Decision:** Whole-repo scan culture replacing vault Brain OS is forbidden. Fat AGENTS.md dump revival is forbidden. Vendor attribution vanity in product docs/commits is forbidden.

**Reason:** Non-Negotiables Forbidden 33–35.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** Forbidden (must not)
  - **Quote:** No whole-repo scan culture replacing vault Brain OS for agents.
- **Articles:** _n/a_
  - **Sections:** Forbidden (must not)
  - **Quote:** No fat AGENTS.md dump revival.
- **Articles:** _n/a_
  - **Sections:** Forbidden (must not)
  - **Quote:** No vendor attribution vanity in product docs/commits.

**Depends On:** `GOV-017`, `GOV-044`

**Blocks:** Agent Rules, AGENTS.md Policy, Documentation Style

**Referenced By:** P8, Vault, All Clients

**Implementation Impact:** Agents load Home → Current Context → relevant vault notes; keep AGENTS.md slim pointer.


### GOV-093 — Eight gate questions mandatory beside every proposal

| Field | Value |
|-------|-------|
| Category | Governance — Proposal Gate |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Low |
| Canon Class | canonical |

**Decision:** Every proposal must be checked against the eight Non-Negotiables gate questions (Kill List, duplicate primitive, interaction inflation, device ceiling, AI chip vs ask, ten-year truth, trust pillars, Constitution conflict). Any fail means redesign or reject.

**Reason:** Non-Negotiables Gate questions section.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** Gate questions (print beside every proposal)
  - **Quote:** Kill List conflict?
- **Articles:** _n/a_
  - **Sections:** Gate questions (print beside every proposal)
  - **Quote:** Any fail → redesign or reject.

**Depends On:** `GOV-074`, `GOV-023`, `GOV-025`, `GOV-020`

**Blocks:** Feature Intake, Design Reviews, PR Product Checklist

**Referenced By:** P8, P9, All Clients

**Implementation Impact:** Print 8 gates on proposal/PR templates; fail = redesign or reject.


---

## 3. GOVERNANCE RECOMMENDATIONS (NOT CANON)

Board proposals. Status: Pending Founder. Do not treat as law until ratified.

### REC-016 — Adopt Non-Negotiables eight-gate checklist on every feature/design proposal

- **Priority:** P0
- **Status:** Pending Founder
- **Reason:** GOV-093 needs process enforcement.
- **Impact:** Fastest refuse tool becomes operational.
- **Risk:** Low process friction; High if skipped — identity drift.
- **Related GOV:** `GOV-093`, `GOV-074`

### REC-017 — Publish Notification Taxonomy Spec (channels, urgency, mute, attention bar)

- **Priority:** P0
- **Status:** Pending Founder
- **Reason:** GOV-064 Approved intent but Needs Discussion on taxonomy; fills M-010.
- **Impact:** Unblocks push/interruptibility enforcement.
- **Risk:** High if delayed — nag culture returns.
- **Related GOV:** `GOV-064`, `GOV-033`, `GOV-083`

### REC-018 — Ship branded destructive-confirm component standard; ban window.confirm in CI

- **Priority:** P0
- **Status:** Pending Founder
- **Reason:** GOV-065 elevates CF-002.
- **Impact:** Cross-client safety UX consistency.
- **Risk:** Medium if web/Android diverge.
- **Related GOV:** `GOV-065`, `GOV-015`, `GOV-046`

### REC-019 — Publish Life Score vs XP role matrix + formula pointer

- **Priority:** P0
- **Status:** Pending Founder
- **Reason:** GOV-068 Needs Discussion; Constitution M-005 open.
- **Impact:** Prevents vanity Life Score / dishonest XP mix.
- **Risk:** High if undefined — gamification casino drift.
- **Related GOV:** `GOV-068`, `GOV-009`

### REC-020 — Name single design-token source of truth + run cross-client drift audit

- **Priority:** P0
- **Status:** Pending Founder
- **Reason:** GOV-073 Needs Discussion.
- **Impact:** Stops treating conflicting tokens as options.
- **Risk:** Extreme cost if delayed — visual/technical debt.
- **Related GOV:** `GOV-073`, `GOV-040`, `GOV-036`

### REC-021 — Wire Kill List living index into field/schema intake

- **Priority:** P0
- **Status:** Pending Founder
- **Reason:** GOV-074 operationalization.
- **Impact:** Prevents revival of killed fields.
- **Risk:** Low.
- **Related GOV:** `GOV-074`, `GOV-022`

### REC-022 — Resolve navigation primacy via IA Principles pass (primary nav map)

- **Priority:** P0
- **Status:** Pending Founder
- **Reason:** GOV-075 Needs Discussion; M-001 still open.
- **Impact:** Ends duplicate nav shells.
- **Risk:** High if skipped — IA thrash.
- **Related GOV:** `GOV-075`

### REC-023 — Engineering deny-list for meds/allergies/PIN inference + PIN telemetry scrub

- **Priority:** P0
- **Status:** Pending Founder
- **Reason:** GOV-070 fills M-016; needs enforcement.
- **Impact:** Privacy/safety hard gate.
- **Risk:** High if missed — sensitive data leak/inference.
- **Related GOV:** `GOV-070`

### REC-024 — Publish Sync Honesty UX contract (pending/fail/success states)

- **Priority:** P0
- **Status:** Pending Founder
- **Reason:** GOV-089 needs shared client contract.
- **Impact:** No silent fail-as-success on Android/web.
- **Risk:** Medium — trust erosion if skipped.
- **Related GOV:** `GOV-089`, `GOV-077`

### REC-025 — Founder confirm CF-002 closed by GOV-065 (branded confirm)

- **Priority:** P1
- **Status:** Pending Founder
- **Reason:** Constitution flagged incomplete confirm; NN elevates branded.
- **Impact:** Conflict hygiene clean for destructive UX.
- **Risk:** Low.
- **Related GOV:** `GOV-065`, `GOV-015`

### REC-026 — Next P7 artifact: 06_INFORMATION_ARCHITECTURE_PRINCIPLES.md

- **Priority:** P0
- **Status:** Pending Founder
- **Reason:** Unblock GOV-075 / M-001 after Non-Negotiables.
- **Impact:** Nav primacy + destinations become governable.
- **Risk:** Low.
- **Related GOV:** `GOV-075`

---

## 4. Conflicts

Flagged only — **not** auto-resolved. Constitution governance unchanged.

| Conflict ID | Type | Detail | Recommendation |
|-------------|------|--------|----------------|
| CF-NN-001 | Additive refinement (not contradiction) | Constitution GOV-015/046 require destructive confirm. Non-Negotiables require branded confirm and ban window.confirm. Flagged as CF-002 in Constitution governance; elevated here as GOV-065. Do not amend Constitution. | REC-018 + REC-025. Founder confirm CF-002 closed. |
| CF-NN-002 | Status tension | Non-Negotiables Required 13 states brand lockup split as absolute must. Constitution GOV-012 remains Needs Discussion solely for Today≡/overview route bind (CF-001), while split behavior itself is Approved via GOV-039. Do not auto-resolve route alias. | Keep REC-003. Cite GOV-039 for split law; leave GOV-012 Needs Discussion until route alias ratified. |
| CF-NN-003 | Incomplete definition (Needs Discussion) | GOV-064 asserts every notification deserves attention but Non-Negotiables give no taxonomy/thresholds (Constitution M-010). | REC-017. Do not invent taxonomy as canon. |
| CF-NN-004 | Incomplete definition (Needs Discussion) | GOV-068 requires Life Score/XP role separation but formula/inputs still missing (Constitution M-005). | REC-019. |
| CF-NN-005 | Incomplete definition (Needs Discussion) | GOV-073 requires token alignment but does not name the single source of truth. | REC-020. |
| CF-NN-006 | Incomplete definition (Needs Discussion) | GOV-075 forbids duplicate navigation primacy fights but does not name primary destinations (M-001). | REC-022 — govern IA Principles next. |
| CF-NN-007 | Incomplete definition (Needs Discussion) | GOV-071 requires critical-path contrast but WCAG level/targets still deferred (M-008). | Govern 11_ACCESSIBILITY_PRINCIPLES later; until then enforce GOV-087 color-only ban. |
| CF-NN-008 | Monitor (no contradiction) | Non-Negotiables Known risks: list may be weaponized to block Design Lab. Constitution allows sandboxed exploration; NN Tradeoffs affirm Design Lab valid. No auto-ban of Design Lab. | Design Lab remains sandboxed; Non-Negotiables bind shipping product, not lab experiments. |

---

## 5. Missing Decisions

| Gap ID | Missing | Why | Next |
|--------|---------|-----|------|
| M-NN-001 | Notification taxonomy / attention bar criteria | GOV-064 incomplete | REC-017 |
| M-NN-002 | Life Score formula + XP role matrix | GOV-068 incomplete | REC-019 |
| M-NN-003 | Named token source of truth | GOV-073 incomplete | REC-020 |
| M-NN-004 | Primary navigation destinations / primacy map | GOV-075 incomplete | REC-022 / IA Principles |
| M-NN-005 | WCAG level + contrast targets | GOV-071 incomplete | Accessibility Principles |
| M-NN-006 | Branded confirm component API across clients | GOV-065 needs shared pattern | REC-018 |
| M-NN-007 | Sync honesty state machine | GOV-089 needs contract | REC-024 |
| M-NN-008 | Sensitive inference deny-list engineering | GOV-070 needs code gate | REC-023 |
| M-NN-009 | Typography lock file pointer (which fonts) | GOV-090 forbids Inter-as-brand but does not name replacements here | Design Bible / Brand typography note |
| M-NN-010 | Kill List living index path for agents | GOV-074 needs single citeable list | REC-021 |

---

## 6. Questions for Founder

1. Confirm CF-002 closed by GOV-065 (branded confirm + window.confirm ban)?
2. Approve notification taxonomy process (REC-017) — who owns first draft?
3. Point to Life Score formula source for GOV-068 / REC-019.
4. Name the single design-token source of truth (REC-020).
5. Confirm Capacitor remains capture stopgap only; native rich companion (GOV-085) — any exception path?
6. Is Design Lab explicitly exempt from Non-Negotiables while sandboxed (CF-NN-008)?
7. Should GOV-093 eight gates become mandatory PR checklist immediately?
8. Confirm next artifact: 06_INFORMATION_ARCHITECTURE_PRINCIPLES.md (REC-026)?
9. Any Non-Negotiable rule founder wants softened before Approved status sticks?
10. For GOV-071, interim contrast rule until Accessibility Principles governed?

---

## 7. Dependency Graph Summary

### Highest fan-in (most `depends_on` references from new GOV-062…093)

| GOV ID | Referenced as Depends On (count) |
|--------|----------------------------------|
| GOV-023 | 3 — Feature must justify human problem |
| GOV-003 | 3 — Brand frame — Human Momentum |
| GOV-040 | 3 — Shared primitives across surfaces |
| GOV-020 | 3 — One primitive, many surfaces |
| GOV-037 | 3 — Forbidden aesthetics + brand-test |
| GOV-026 | 2 — Optimize / avoid matrix |
| GOV-054 | 2 — Motion serves emotional triad |
| GOV-055 | 2 — Motion anti-nag / anti-casino |
| GOV-030 | 2 — Emotional contract triad |
| GOV-033 | 2 — Interruptibility; no JITAI nag loops |
| GOV-028 | 2 — Capture first, structure later |
| GOV-059 | 2 — Capture speed first-class |
| GOV-031 | 2 — Emotional refuse list |
| GOV-017 | 2 — Vault ships with behavior change |
| GOV-051 | 2 — Inference must be correctable |

### Extreme cost decisions (new)

| GOV ID | Title | Blocks |
|--------|-------|--------|
| GOV-073 | Cross-client token meaning aligned; drift is debt | Design Tokens Source of Truth, Cross-Client Contracts, Design System |

### Needs Discussion (canonical but incomplete for ship)

| GOV ID | Title | Why open |
|--------|-------|----------|
| GOV-064 | Every notification must deserve attention | See Implementation Impact / Conflicts |
| GOV-068 | Life Score honest; XP celebratory — roles unmixed | See Implementation Impact / Conflicts |
| GOV-071 | Critical-path contrast and operable capture | See Implementation Impact / Conflicts |
| GOV-073 | Cross-client token meaning aligned; drift is debt | See Implementation Impact / Conflicts |
| GOV-075 | No duplicate navigation systems fighting for primacy | See Implementation Impact / Conflicts |

---

## 8. Final Governance Score

| Dimension | Score (/10) |
|-----------|-------------|
| Identity clarity | 9 |
| Enforceability | 8 |
| Cross-platform readiness | 7 |
| AI readiness | 8 |
| Conflict hygiene | 8 |
| Metric rigor | 6 |
| Amendment process | 8 |
| Completeness for build-without-reread | 7 |
| Traceability / evidence | 9 |
| Machine-readability | 9 |

### Final Governance Score: **79 / 100**

Non-Negotiables strongly operationalize Constitution refuse/require lists. New GOV-062…093 fill M-016 and many UX/privacy gates. Still Needs Discussion on notifications, Life Score/XP roles, token SoT, nav primacy, and WCAG targets. No hard contradiction with Constitution; additive refinements flagged.

---

## Evidence (process)

- Source read: `18_NON_NEGOTIABLES.md` v3.0 (unchanged / FROZEN)
- Constitution governance untouched: `Constitution/01|02|03`
- Standard untouched: `00_GOVERNANCE_STANDARD.md`
- New GOV IDs appended: GOV-062…GOV-093
- Existing GOV IDs preserved and referenced for duplicates
- Canon separated from Recommendations (REC-016…REC-026)
- Conflicts flagged CF-NN-001…008 — not auto-resolved

