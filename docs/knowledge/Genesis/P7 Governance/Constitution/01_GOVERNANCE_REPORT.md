# 01 — Constitution Governance Report

```yaml
document: Constitution Governance Report
phase: P7
standard: AIIMIN GENESIS/P7 Governance/00_GOVERNANCE_STANDARD.md
standard_version: 1.0
source: AIIMIN GENESIS/P5 Constitution/01_AIIMIN_CONSTITUTION.md
source_version: 3.0
source_status: FROZEN
baseline: AIIMIN GENESIS/P7 Governance/_baseline/01_CONSTITUTION_GOVERNANCE.v1-baseline.md
upgrade: v2 — evidence, confidence, cost, dependency graph, canon/recommendation split
governance_date: 2026-07-22
gov_ids: GOV-001…GOV-061
```

> Machine-readable twin: `02_GOVERNANCE_DECISIONS.json` · Index: `03_GOVERNANCE_INDEX.md` · Standard: `../00_GOVERNANCE_STANDARD.md`

Constitution **not modified**. Baseline accepted. This file upgrades governance quality only.

---

## 1. Artifact Overview

| Field | Value |
|-------|-------|
| Source | `01_AIIMIN_CONSTITUTION.md` v3.0 FROZEN |
| Articles | I–XI + Purpose/Reasoning/Evidence/Dependencies/Future impact/Tradeoffs/Known risks |
| Hierarchy | Article wins over later principles until amended |
| Amendment | Founder + ADR + vault + Design Bible changelog |
| Decisions | 61 canonical GOV IDs |
| Recommendations | 15 REC IDs (not canon) |
| Confidence mix | High = explicitly stated; Medium = multi-article implication; Low = recommendation only (REC) |

**Separation law:** Canonical Decisions ≠ Governance Recommendations. Recommendations require founder approval.

---

## 2. CANONICAL DECISIONS

Only decisions supported by the Constitution (Confidence High or Medium). Binding for implementation when Status is Approved.

### Canonical Product Decisions

### GOV-001 — Personal Life OS category lock

| Field | Value |
|-------|-------|
| Category | Product Identity |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Extreme |
| Canon Class | canonical |

**Decision:** AIIMIN is officially a Personal Life OS — Personal (one human's life graph, not a network) + Life (whole person: execution, money, health, reflection, family, career) + OS (shared primitives, shared memory, shared intelligence across surfaces).

**Reason:** Category lock prevents single-domain drift and social-network drift.

**Evidence:**

- **Articles:** Article II
  - **Sections:** What AIIMIN is
  - **Quote:** AIIMIN is a **Personal Life OS**.
- **Articles:** Article II
  - **Sections:** What AIIMIN is — table
  - **Quote:** Personal | One human's life graph; not a network
- **Articles:** Article II
  - **Sections:** What AIIMIN is — table
  - **Quote:** OS | Shared primitives, shared memory, shared intelligence across surfaces

**Depends On:** _None_

**Blocks:** Master Product Specification, Feature Intake, All Clients Domain Model

**Referenced By:** P8, P9, Android Build, Website, Desktop, Backend, AI, Design System

**Implementation Impact:** Feature proposals that are single-domain-only without Life OS linkage are out of canon. Cross-surface entity model required.


### GOV-002 — Vision lock — Capture once

| Field | Value |
|-------|-------|
| Category | Product Vision |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | High |
| Canon Class | canonical |

**Decision:** Vision lock is mandatory copy/strategy north star: Capture once. AIIMIN remembers, connects, and coaches — without turning life into data entry.

**Reason:** Survived multiple redesigns; protects coherent purpose.

**Evidence:**

- **Articles:** Article I
  - **Sections:** Why AIIMIN exists
  - **Quote:** Vision lock: *Capture once. AIIMIN remembers, connects, and coaches — without turning life into data entry.*

**Depends On:** `GOV-001`

**Blocks:** Capture UX, Marketing Copy, Onboarding

**Referenced By:** P8, P9, Android Build, Website, AI, Content System

**Implementation Impact:** Any flow that forces taxonomy-first capture violates vision. Marketing and in-product copy must not contradict.


### GOV-003 — Brand frame — Human Momentum

| Field | Value |
|-------|-------|
| Category | Brand Frame |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** Brand frame is Human Momentum — precision, feedback loops, behavioral intelligence, data sovereignty, momentum engineering. Explicitly never shame theater.

**Reason:** Emotional and ethical identity of the brand.

**Evidence:**

- **Articles:** Article I
  - **Sections:** Why AIIMIN exists
  - **Quote:** Brand frame: **Human Momentum** — precision, feedback loops, behavioral intelligence, data sovereignty, momentum engineering — never shame theater.

**Depends On:** `GOV-001`

**Blocks:** Life Score UX, Gamification, Coaching Tone, Brand Book

**Referenced By:** P8, Design System, Motion, AI, Content System

**Implementation Impact:** Streak/shame UX, guilt copy, punitive empty states are non-canon. Brand book and product UI must share this frame.


### GOV-004 — Three existence outcomes

| Field | Value |
|-------|-------|
| Category | Product Mission |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Extreme |
| Canon Class | canonical |

**Decision:** Product must enable three outcomes under cognitive load: (1) capture life as it happens without data-entry clerking; (2) show one connected graph of goals, habits, money, calendar, body, mind, family, work; (3) act tomorrow with less friction via memory, connection, honest coaching.

**Reason:** Defines existence criteria — features must serve at least one of these.

**Evidence:**

- **Articles:** Article I
  - **Sections:** Why AIIMIN exists
  - **Quote:** AIIMIN exists so a person under cognitive load can:
- **Articles:** Article I
  - **Sections:** Why AIIMIN exists §1–3
  - **Quote:** Capture life as it happens… See one connected graph… Act tomorrow with less friction…

**Depends On:** `GOV-001`, `GOV-002`

**Blocks:** Feature Intake, Roadmap, Life Graph

**Referenced By:** P8, P9, Android Build, Website, AI

**Implementation Impact:** Feature intake filter: map to capture / connect / coach. Orphan features fail governance.


### GOV-005 — Refuse social network / public feed / leaderboard

| Field | Value |
|-------|-------|
| Category | Hard Refuse — Social |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Low |
| Canon Class | canonical |

**Decision:** AIIMIN will never become a social network, public feed, or public leaderboard.

**Reason:** Personal Life OS is not a network product.

**Evidence:**

- **Articles:** Article III
  - **Sections:** What AIIMIN will never become §1
  - **Quote:** A social network, public feed, or public leaderboard.

**Depends On:** `GOV-001`

**Blocks:** Growth Strategy, Sharing Features, Gamification Leaderboards

**Referenced By:** P8, P9, Android Build, Website, Backend

**Implementation Impact:** No public feeds, no public rankings. Private sharing (if ever) requires separate founder decision and must not create social graph product.


### GOV-006 — Refuse clinical / therapist claims

| Field | Value |
|-------|-------|
| Category | Hard Refuse — Clinical |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** AIIMIN will never become a clinical mental health device, diagnostic tool, or AI therapist. No clinical claims.

**Reason:** Ethics and liability.

**Evidence:**

- **Articles:** Article III
  - **Sections:** §2
  - **Quote:** A clinical mental health device, diagnostic tool, or AI therapist.
- **Articles:** Article IV
  - **Sections:** No clinical claims
  - **Quote:** No clinical claims | Ethics and liability
- **Articles:** Article VII
  - **Sections:** Failure
  - **Quote:** Clinical or therapist framing.

**Depends On:** `GOV-001`

**Blocks:** AI Prompt Policy, Health Module Copy, Store Listings

**Referenced By:** P8, AI, Android Build, Website, Marketing

**Implementation Impact:** Ban diagnostic language, therapy framing, clinical claims in UI/docs/store. Health data may exist as life context, not clinical product.


### GOV-007 — Refuse single-domain Life OS clothing

| Field | Value |
|-------|-------|
| Category | Hard Refuse — Single-domain |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** AIIMIN will never become a single-domain app (finance-only, fitness-only, notes-only) wearing Life OS clothing.

**Reason:** Protects Life OS category integrity.

**Evidence:**

- **Articles:** Article III
  - **Sections:** §3
  - **Quote:** A single-domain app (finance-only, fitness-only, notes-only) wearing Life OS clothing.

**Depends On:** `GOV-001`

**Blocks:** Module Packaging, Marketing Positioning

**Referenced By:** P8, P9, Roadmap

**Implementation Impact:** Vertical modules allowed as surfaces of the OS, not as the product identity.


### GOV-008 — Refuse form-builder / capture blockers

| Field | Value |
|-------|-------|
| Category | Hard Refuse — Forms |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | High |
| Canon Class | canonical |

**Decision:** AIIMIN will never become a form builder disguised as productivity, nor block capture behind mode pickers, category interrogations, or vanity configuration.

**Reason:** Capture-first identity; cognitive load honesty.

**Evidence:**

- **Articles:** Article III
  - **Sections:** §4
  - **Quote:** A form builder disguised as productivity.
- **Articles:** Article III
  - **Sections:** §8
  - **Quote:** A product that blocks capture behind mode pickers, category interrogations, or vanity configuration.
- **Articles:** Article X
  - **Sections:** Optimize / Avoid
  - **Quote:** Capture speed | Configuration theater

**Depends On:** `GOV-002`, `GOV-028`

**Blocks:** Capture UX, Onboarding, Entity Creation Flows

**Referenced By:** P8, Android Build, Website, Desktop, AI

**Implementation Impact:** Capture path must allow primary save without ceremony. Structure/categories deferred or inferred.


### GOV-009 — Refuse gamification casino; honest Life Score

| Field | Value |
|-------|-------|
| Category | Hard Refuse — Gamification |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | High |
| Canon Class | canonical |

**Decision:** AIIMIN will never become a gamification casino that optimizes for streaks and shame. Life Score must remain honest composite truth, not vanity XP.

**Reason:** Human Momentum is not an engagement hack; honesty over vanity.

**Evidence:**

- **Articles:** Article III
  - **Sections:** §5
  - **Quote:** A gamification casino that optimizes for streaks and shame.
- **Articles:** Article V
  - **Sections:** §7
  - **Quote:** **Honesty of Life Score** — composite truth, not vanity XP.

**Depends On:** `GOV-003`

**Blocks:** Life Score Model, XP System, Streak UI

**Referenced By:** P8, P9, Android Build, Website, Design System

**Implementation Impact:** Separate celebratory XP from honest Life Score roles. Punitive streak systems non-canon.


### GOV-011 — Refuse sell/share lifelog data

| Field | Value |
|-------|-------|
| Category | Hard Refuse — Data commerce |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** AIIMIN will never sell or share lifelog data.

**Reason:** Data sovereignty pillar of Human Momentum.

**Evidence:**

- **Articles:** Article III
  - **Sections:** §7
  - **Quote:** A product that sells or shares lifelog data.

**Depends On:** `GOV-003`

**Blocks:** Analytics Partnerships, Vendor Contracts, Export Policy

**Referenced By:** P8, Backend, Infrastructure, Privacy

**Implementation Impact:** No data-sale features or silent third-party lifelog sharing. Analytics must respect journal-body ban (GOV-016).


### GOV-012 — Split brand lockup (mark /brand, wordmark Today)

| Field | Value |
|-------|-------|
| Category | Brand Navigation Lock |
| Status | Needs Discussion |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Low |
| Canon Class | canonical |

**Decision:** Split brand lockup is permanent: logo mark to /brand (brand book); wordmark to Today (daily OS). Brand book is not daily OS.

**Reason:** Recognition continuity; separates identity education from daily use.

**Evidence:**

- **Articles:** Article IV
  - **Sections:** Split brand lockup
  - **Quote:** Split brand lockup (mark→`/brand`, wordmark→Today) | Brand book ≠ daily OS

**Depends On:** `GOV-003`

**Blocks:** Navbar, BrandLockup, Routing

**Referenced By:** P8, Website, Desktop, Design System

**Implementation Impact:** Do not unify click targets. Do not replace with mini-story or purple OAuth chrome. Route ID for Today needs founder bind (see REC-003).


### GOV-013 — Phone web /m capture-only ceiling

| Field | Value |
|-------|-------|
| Category | Platform Ceiling — Phone web |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** Phone web /m is capture-first / capture-only. Analytics tools on /m equal failure. Native capture richness does not authorize breaking the /m lock.

**Reason:** Device honesty. Known risk explicitly called out.

**Evidence:**

- **Articles:** Article IV
  - **Sections:** Capture-first on phone web /m
  - **Quote:** Capture-first on phone web `/m` | Device honesty
- **Articles:** Article VII
  - **Sections:** Failure
  - **Quote:** Analytics tools on phone web `/m`.
- **Articles:** Known risks
  - **Sections:** Known risks
  - **Quote:** Treating native capture-richness as permission to break phone-web `/m` lock.

**Depends On:** `GOV-002`, `GOV-028`

**Blocks:** Capacitor /m Scope, Mobile Web Feature Flags, Release Checks

**Referenced By:** P8, Website, Android Build, Infrastructure

**Implementation Impact:** No analytics, insights, pomodoro, or tools on /m. Native Android may be richer; /m stays collection stopgap.


### GOV-014 — Export and delete always available

| Field | Value |
|-------|-------|
| Category | Trust — Export / Delete |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | High |
| Canon Class | canonical |

**Decision:** Export and delete must always be available. User trust includes writing privately and exporting everything.

**Reason:** Trust and data sovereignty.

**Evidence:**

- **Articles:** Article IV
  - **Sections:** Export and delete always available
  - **Quote:** Export and delete always available | Trust
- **Articles:** Article VI
  - **Sections:** Success
  - **Quote:** User trusts the system enough to write privately and still export everything.

**Depends On:** `GOV-011`

**Blocks:** Account Settings, Export APIs, Deletion Cascades

**Referenced By:** P8, Backend, Website, Android Build, Desktop

**Implementation Impact:** Ship/keep export + delete paths. Blocking either is constitutional violation.


### GOV-015 — Destructive actions must confirm

| Field | Value |
|-------|-------|
| Category | Safety — Destructive actions |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** Destructive actions must confirm.

**Reason:** Safety.

**Evidence:**

- **Articles:** Article IV
  - **Sections:** Destructive actions confirm
  - **Quote:** Destructive actions confirm | Safety

**Depends On:** _None_

**Blocks:** Confirm Dialog Pattern, Delete Flows

**Referenced By:** P8, Design System, Android Build, Website, Desktop

**Implementation Impact:** No silent destructive ops. Confirmations required on every client. Branded confirm detail deferred to Non-Negotiables governance.


### GOV-016 — Journal body out of analytics

| Field | Value |
|-------|-------|
| Category | Privacy — Journal analytics |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** Journal body stays out of analytics.

**Reason:** Privacy.

**Evidence:**

- **Articles:** Article IV
  - **Sections:** Journal body out of analytics
  - **Quote:** Journal body out of analytics | Privacy

**Depends On:** `GOV-011`

**Blocks:** Analytics Pipelines, Telemetry Allowlists

**Referenced By:** P8, Backend, Infrastructure, AI

**Implementation Impact:** Do not send journal body content to analytics vendors. Event names/metadata only if policy allows — body never.


### GOV-020 — One primitive, many surfaces

| Field | Value |
|-------|-------|
| Category | Primitives Policy |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | High |
| Canon Class | canonical |

**Decision:** One primitive, many surfaces — no duplicate mood/theme/arc/resume UIs. Duplicate primitives proliferating equals failure.

**Reason:** OS coherence; compression.

**Evidence:**

- **Articles:** Article V
  - **Sections:** §3
  - **Quote:** **One primitive, many surfaces** — no duplicate mood/theme/arc/resume UIs.
- **Articles:** Article VII
  - **Sections:** Failure
  - **Quote:** Duplicate primitives proliferating.

**Depends On:** `GOV-001`, `GOV-040`

**Blocks:** Component System, IA, Domain Models

**Referenced By:** P8, Design System, Android Build, Website

**Implementation Impact:** Before new UI for a concept, prove no existing primitive covers it. Kill duplicate surfaces.


### GOV-021 — Official success criteria (non-vanity)

| Field | Value |
|-------|-------|
| Category | Success Metrics |
| Status | Needs Discussion |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | High |
| Canon Class | canonical |

**Decision:** Official success criteria (not downloads, DAU vanity, or feature count): (1) Daily capture possible in under ~60 seconds when the user is ready; (2) Median meaningful interactions per active day trending toward ~5, not ~15+; (3) User can answer how am I doing? without visiting four apps; (4) User trusts system enough to write privately and still export everything; (5) Tomorrow's plan is lighter because yesterday was remembered; (6) Designers and agents can ship without asking who are we?

**Reason:** Outcome-aligned product truth.

**Evidence:**

- **Articles:** Article VI
  - **Sections:** What success means
  - **Quote:** Success is not downloads, DAU vanity, or feature count.
- **Articles:** Article VI
  - **Sections:** Success list
  - **Quote:** Daily capture possible in under ~60 seconds when the user is ready.
- **Articles:** Article VI
  - **Sections:** Success list
  - **Quote:** Median meaningful interactions per active day trending toward ~5, not ~15+.

**Depends On:** `GOV-002`, `GOV-014`

**Blocks:** Telemetry Spec, KPI Dashboards, Product OKRs

**Referenced By:** P8, P9, Analytics, Product

**Implementation Impact:** KPI dashboards must prefer these over vanity DAU. Exact telemetry definitions for meaningful interaction and ready capture require founder session (REC-002).


### GOV-022 — Official failure triggers

| Field | Value |
|-------|-------|
| Category | Failure Triggers |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** Official failure conditions (any is a governance red flag): rising daily interaction count for same human outcomes; duplicate primitives proliferating; clinical or therapist framing; analytics tools on phone web /m; social comparison as growth strategy; silent wrong automation without correction path; feature shipped without a human problem; redesign that could belong to another brand after removing the logo.

**Reason:** Early identity-death detectors.

**Evidence:**

- **Articles:** Article VII
  - **Sections:** What failure means
  - **Quote:** Failure is:
- **Articles:** Article VII
  - **Sections:** Failure bullets
  - **Quote:** Rising daily interaction count… Duplicate primitives… Clinical or therapist framing… Analytics tools on phone web `/m`… Social comparison… Silent wrong automation… Feature shipped without a human problem… Redesign that could belong to another brand…

**Depends On:** `GOV-006`, `GOV-013`, `GOV-020`, `GOV-023`

**Blocks:** Ship/Kill Checklist, Product Review

**Referenced By:** P8, P9, PR Review, Design Review

**Implementation Impact:** Use as ship/kill checklist. Automation without correction path is forbidden.


### GOV-023 — Feature must justify human problem

| Field | Value |
|-------|-------|
| Category | Feature Intake Gate |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Low |
| Canon Class | canonical |

**Decision:** Every feature must justify a human problem. Feature without human problem equals failure / refuse.

**Reason:** Prevent novelty-driven identity drift.

**Evidence:**

- **Articles:** Article VII
  - **Sections:** Failure
  - **Quote:** Feature shipped without a human problem.

**Depends On:** `GOV-004`

**Blocks:** PRD Process, Sprint Intake, Agent Feature Proposals

**Referenced By:** P8, P9, All Agents, Product

**Implementation Impact:** Intake template must state human problem before build.


### GOV-026 — Optimize / avoid matrix

| Field | Value |
|-------|-------|
| Category | Optimization Policy |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | High |
| Canon Class | canonical |

**Decision:** Product optimizes for: capture speed; connected memory; correctable inference; interruptibility respect; pattern language; progressive disclosure by stakes; long-term trust; timeless identity. Deliberately avoids: configuration theater; siloed widgets; silent wrongness; JITAI nag loops; punitive streaks; same friction everywhere; short-term engagement hacks; trend following.

**Reason:** Explicit optimize/avoid matrix for roadmap and UX.

**Evidence:**

- **Articles:** Article X
  - **Sections:** What the product optimizes for — table
  - **Quote:** Capture speed | Configuration theater
- **Articles:** Article X
  - **Sections:** Optimize column
  - **Quote:** Connected memory; Correctable inference; Interruptibility respect; Pattern language; Progressive disclosure by stakes; Long-term trust; Timeless identity

**Depends On:** `GOV-002`, `GOV-003`

**Blocks:** Roadmap Scoring, Notification Policy, Design Reviews

**Referenced By:** P8, Design System, AI, Android Build, Website

**Implementation Impact:** Design/product reviews score against this matrix. Nag loops and trend-chasing aesthetics fail.


### Canonical UX Decisions

### GOV-027 — Intent over interface

| Field | Value |
|-------|-------|
| Category | UX — Intent model |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | High |
| Canon Class | canonical |

**Decision:** Intent over interface — users arrive with needs, not taxonomies.

**Reason:** Cognitive load reality.

**Evidence:**

- **Articles:** Article V
  - **Sections:** §1
  - **Quote:** **Intent over interface** — users arrive with needs, not taxonomies.

**Depends On:** `GOV-002`

**Blocks:** Navigation Labels, Search/Command, Onboarding

**Referenced By:** P8, IA, Android Build, Website, AI

**Implementation Impact:** Prefer need-based entry (capture, review, plan) over taxonomy browsers as primary.


### GOV-028 — Capture first, structure later

| Field | Value |
|-------|-------|
| Category | UX — Capture doctrine |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | High |
| Canon Class | canonical |

**Decision:** Capture first, structure later. Raw expression is highest-fidelity signal. Primary emotional contract includes relief after capture.

**Reason:** Fidelity and speed under load.

**Evidence:**

- **Articles:** Article V
  - **Sections:** §2
  - **Quote:** **Capture first, structure later** — raw expression is highest-fidelity signal.
- **Articles:** Article I
  - **Sections:** Vision lock
  - **Quote:** Capture once. AIIMIN remembers, connects, and coaches — without turning life into data entry.
- **Articles:** Article VIII
  - **Sections:** Emotional contract
  - **Quote:** **relief after capture**

**Depends On:** `GOV-002`, `GOV-004`

**Blocks:** Capture UX, AI Structuring Pipeline

**Referenced By:** P8, Android Build, Website, Desktop, AI

**Implementation Impact:** Default capture = free expression + fast save. Structure via AI/later edit, not pre-forms.


### GOV-029 — Read surfaces stay calm

| Field | Value |
|-------|-------|
| Category | UX — Read surfaces |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** Read surfaces stay calm — intelligence without interrogation.

**Reason:** Review should produce clarity, not new anxiety.

**Evidence:**

- **Articles:** Article V
  - **Sections:** §5
  - **Quote:** **Read surfaces stay calm** — intelligence without interrogation.
- **Articles:** Article VIII
  - **Sections:** Emotional contract
  - **Quote:** **clarity after review**

**Depends On:** `GOV-030`

**Blocks:** Today, Reports, Insights

**Referenced By:** P8, Website, Android Build, Desktop

**Implementation Impact:** Ban quiz-like interrogation on read paths. Show connected signal calmly.


### GOV-030 — Emotional contract triad

| Field | Value |
|-------|-------|
| Category | UX — Emotional contract |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** Users should feel: Calm, Capable, Honest, Respected, In momentum — not in debt to the product. Contract triad: relief after capture, clarity after review, agency after coaching.

**Reason:** Defines acceptable post-interaction emotional state.

**Evidence:**

- **Articles:** Article VIII
  - **Sections:** What users should feel
  - **Quote:** Calm. Capable. Honest. Respected. In momentum — not in debt to the product.
- **Articles:** Article VIII
  - **Sections:** Primary emotional contract
  - **Quote:** Primary emotional contract: **relief after capture**, **clarity after review**, **agency after coaching**.

**Depends On:** `GOV-003`

**Blocks:** UX Acceptance, Empty States, Coaching Copy

**Referenced By:** P8, Design System, Content System, AI, Motion

**Implementation Impact:** UX review includes emotional outcome check against triad.


### GOV-031 — Emotional refuse list

| Field | Value |
|-------|-------|
| Category | UX — Emotional refuse |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** Users must never feel: Interrogated, Shamed, Trapped, Surveilled, Confused by decoration, Patronized by AI magic, Forced to choose among five moods or fourteen lab modules to do one simple thing.

**Reason:** Anti-patterns proven by history (lab module sprawl, mood pickers).

**Evidence:**

- **Articles:** Article IX
  - **Sections:** What users should never feel
  - **Quote:** Interrogated. Shamed. Trapped. Surveilled. Confused by decoration. Patronized by "AI magic." Forced to choose among five moods or fourteen lab modules to do one simple thing.

**Depends On:** `GOV-030`

**Blocks:** Lab/Modules IA, Mood UI, AI Copy

**Referenced By:** P8, IA, Content System, AI, Design System

**Implementation Impact:** Mood/lab pickers that block simple tasks are non-canon. AI magic patronizing copy banned.


### GOV-032 — Progressive disclosure by stakes

| Field | Value |
|-------|-------|
| Category | UX — Progressive disclosure |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** Progressive disclosure by stakes — not same friction everywhere.

**Reason:** High-stakes (destructive, money, privacy) earn friction; capture does not.

**Evidence:**

- **Articles:** Article X
  - **Sections:** Optimize / Avoid
  - **Quote:** Progressive disclosure by stakes | Same friction everywhere

**Depends On:** `GOV-015`, `GOV-026`

**Blocks:** Friction Mapping, Settings Depth

**Referenced By:** P8, Design System, Android Build, Website

**Implementation Impact:** Map friction to stakes. Capture low friction; destructive high friction.


### GOV-033 — Interruptibility; no JITAI nag loops

| Field | Value |
|-------|-------|
| Category | UX — Interruptibility |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** Respect interruptibility; deliberately avoid JITAI nag loops.

**Reason:** Agency and long-term trust.

**Evidence:**

- **Articles:** Article X
  - **Sections:** Optimize / Avoid
  - **Quote:** Interruptibility respect | JITAI nag loops

**Depends On:** `GOV-026`

**Blocks:** Notification Policy, Focus Mode, Reminders

**Referenced By:** P8, Android Build, Website, Infrastructure

**Implementation Impact:** Notification policy must justify attention. No engagement-maximizing nag loops.


### GOV-034 — Compression as craft (~5 interactions)

| Field | Value |
|-------|-------|
| Category | UX — Compression craft |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | High |
| Canon Class | canonical |

**Decision:** Compression as craft — median daily interactions trend down (~5), not up (~15+). Rising interaction count for same outcomes equals failure.

**Reason:** Less product debt; more life.

**Evidence:**

- **Articles:** Article V
  - **Sections:** §8
  - **Quote:** **Compression as craft** — median daily interactions trend down, not up.
- **Articles:** Article VI
  - **Sections:** Success
  - **Quote:** Median meaningful interactions per active day trending toward ~5, not ~15+.
- **Articles:** Article VII
  - **Sections:** Failure
  - **Quote:** Rising daily interaction count for the same human outcomes.

**Depends On:** `GOV-021`, `GOV-026`

**Blocks:** IA Density, Today Composition, Shortcuts

**Referenced By:** P8, P9, IA, Analytics

**Implementation Impact:** Prefer fewer higher-leverage interactions. Resist adding daily touchpoints without removing others.


### GOV-035 — Correctable inference; no silent wrongness

| Field | Value |
|-------|-------|
| Category | UX — Correction path |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | High |
| Canon Class | canonical |

**Decision:** Silent wrong automation without correction path is failure. Optimize for correctable inference; avoid silent wrongness.

**Reason:** Trust + mixed-initiative partnership.

**Evidence:**

- **Articles:** Article VII
  - **Sections:** Failure
  - **Quote:** Silent wrong automation without correction path.
- **Articles:** Article X
  - **Sections:** Optimize / Avoid
  - **Quote:** Correctable inference | Silent wrongness

**Depends On:** `GOV-048`, `GOV-051`

**Blocks:** AI Structuring UI, Entity Linking UX

**Referenced By:** P8, AI, Android Build, Website, Design System

**Implementation Impact:** Every inference UI needs edit/correct/undo path.


### Canonical Visual Decisions

### GOV-010 — Refuse purple/cream clones and GoodNotes PWA

| Field | Value |
|-------|-------|
| Category | Hard Refuse — Visual clones |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** AIIMIN will never become a purple SaaS clone, cream-terracotta editorial AI look, or GoodNotes handwriting PWA. Redesign that could belong to another brand after removing the logo equals failure.

**Reason:** Timeless identity; Design History survivors/deaths.

**Evidence:**

- **Articles:** Article III
  - **Sections:** §6
  - **Quote:** A purple SaaS clone, cream-terracotta editorial AI look, or GoodNotes handwriting PWA.
- **Articles:** Article VII
  - **Sections:** Failure
  - **Quote:** Redesign that could belong to another brand after removing the logo.

**Depends On:** `GOV-036`

**Blocks:** Visual QA, Prototype Studio, Brand Reviews

**Referenced By:** P8, Design System, Website, Android Build

**Implementation Impact:** Design review gate: brand-test after logo removal. Forbidden aesthetic clusters are product law.


### GOV-036 — Palette identity non-negotiable

| Field | Value |
|-------|-------|
| Category | Visual — Palette identity |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** Palette identity is non-negotiable until founder override. Recognition requires continuity.

**Reason:** Brand continuity across redesigns.

**Evidence:**

- **Articles:** Article IV
  - **Sections:** Palette identity
  - **Quote:** Palette identity | Recognition requires continuity
- **Articles:** Dependencies
  - **Sections:** Dependencies
  - **Quote:** Product Bible; Palette.md; Product Decisions locks; Never-to-Build.

**Depends On:** `GOV-003`

**Blocks:** Design Tokens, All Client Themes

**Referenced By:** P8, Design System, Android Build, Website, Desktop

**Implementation Impact:** Token values live in Palette.md (named Constitution dependency). No new brand colors without founder approval. Do not invent hex in Constitution governance beyond Palette.md lock.


### GOV-037 — Forbidden aesthetics + brand-test

| Field | Value |
|-------|-------|
| Category | Visual — Forbidden aesthetics |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Low |
| Canon Class | canonical |

**Decision:** Forbidden: purple SaaS clone; cream-terracotta editorial AI look; GoodNotes handwriting PWA aesthetic; any redesign interchangeable after logo removal.

**Reason:** Timeless identity over trend following.

**Evidence:**

- **Articles:** Article III
  - **Sections:** §6
  - **Quote:** A purple SaaS clone, cream-terracotta editorial AI look, or GoodNotes handwriting PWA.
- **Articles:** Article VII
  - **Sections:** Failure
  - **Quote:** Redesign that could belong to another brand after removing the logo.
- **Articles:** Article X
  - **Sections:** Optimize / Avoid
  - **Quote:** Timeless identity | Trend following

**Depends On:** `GOV-010`, `GOV-036`

**Blocks:** Visual QA Checklist

**Referenced By:** P8, Design System, Website, Android Build

**Implementation Impact:** Visual QA includes anti-clone checklist + brand-test.


### GOV-038 — Decoration must not confuse

| Field | Value |
|-------|-------|
| Category | Visual — Decoration vs identity |
| Status | Approved |
| Priority | P1 |
| Confidence | Medium |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** Decoration must not confuse. Avoid visual clutter as personality. Timeless identity over trend following.

**Reason:** Calm/capable emotional contract.

**Evidence:**

- **Articles:** Article IX
  - **Sections:** Never feel
  - **Quote:** Confused by decoration.
- **Articles:** Article X
  - **Sections:** Optimize / Avoid
  - **Quote:** Timeless identity | Trend following

**Depends On:** `GOV-030`, `GOV-031`, `GOV-026`

**Blocks:** Illustration Budget, Today Widgets, Motion Decor

**Referenced By:** P8, Design System, Motion

**Implementation Impact:** Decoration budget subordinate to clarity. Reject personality clutter.


### GOV-039 — Split lockup visual+IA law

| Field | Value |
|-------|-------|
| Category | Visual — Brand lockup behavior |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Low |
| Canon Class | canonical |

**Decision:** Split lockup is visual+IA law: mark and wordmark are separate destinations (/brand vs Today).

**Reason:** Brand book is not daily OS.

**Evidence:**

- **Articles:** Article IV
  - **Sections:** Split brand lockup
  - **Quote:** Split brand lockup (mark→`/brand`, wordmark→Today) | Brand book ≠ daily OS

**Depends On:** `GOV-012`

**Blocks:** Navbar Components, Brand Page

**Referenced By:** P8, Website, Desktop, Design System

**Implementation Impact:** Do not merge targets; do not substitute decorative lockups that break split behavior. Route bind pending GOV-012 / REC-003.


### Canonical Technical Decisions

### GOV-018 — Auth/schema only with explicit ask

| Field | Value |
|-------|-------|
| Category | Auth / Schema Gate |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Low |
| Canon Class | canonical |

**Decision:** Auth and database schema change only with explicit human ask.

**Reason:** Safety for agents and humans.

**Evidence:**

- **Articles:** Article IV
  - **Sections:** Auth/schema only with explicit ask
  - **Quote:** Auth/schema only with explicit ask | Safety for agents and humans

**Depends On:** _None_

**Blocks:** Migrations, Auth Config Changes

**Referenced By:** P8, Backend, Infrastructure, All Agents

**Implementation Impact:** Agents must refuse unsolicited auth/schema edits. Founder ask required before any change.


### GOV-019 — One linking system for life entities

| Field | Value |
|-------|-------|
| Category | Life Graph Integrity |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Extreme |
| Canon Class | canonical |

**Decision:** One linking system for life entities.

**Reason:** Graph integrity; prevent duplicate link models.

**Evidence:**

- **Articles:** Article IV
  - **Sections:** One linking system for life entities
  - **Quote:** One linking system for life entities | Graph integrity

**Depends On:** `GOV-001`, `GOV-004`

**Blocks:** Entity Model, API Link Endpoints, AI Entity Resolution

**Referenced By:** P8, P9, Backend, Android Build, Website, AI

**Implementation Impact:** No parallel linking systems. New entity types plug into the one graph. Named schema/API still missing (see REC-005).


### GOV-040 — Shared primitives across surfaces

| Field | Value |
|-------|-------|
| Category | Technical — Multi-surface OS |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Extreme |
| Canon Class | canonical |

**Decision:** OS means shared primitives, shared memory, shared intelligence across surfaces. Clients are surfaces of one OS, not separate products with divergent models.

**Reason:** Personal Life OS definition.

**Evidence:**

- **Articles:** Article II
  - **Sections:** OS row
  - **Quote:** OS | Shared primitives, shared memory, shared intelligence across surfaces

**Depends On:** `GOV-001`

**Blocks:** Cross-Client Contracts, Entity Alignment, Token Alignment

**Referenced By:** P8, P9, Android Build, Website, Desktop, Backend, AI

**Implementation Impact:** Cross-client token/entity alignment required. Divergent domain models need ADR.


### GOV-041 — /m technical ceiling enforcement

| Field | Value |
|-------|-------|
| Category | Technical — Platform honesty |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** /m capture ceiling is technical product lock. Native richness does not equal permission to expand /m into analytics/tools.

**Reason:** Device honesty.

**Evidence:**

- **Articles:** Article IV
  - **Sections:** Capture-first on phone web /m
  - **Quote:** Capture-first on phone web `/m` | Device honesty
- **Articles:** Known risks
  - **Sections:** Known risks
  - **Quote:** Treating native capture-richness as permission to break phone-web `/m` lock.

**Depends On:** `GOV-013`

**Blocks:** Route Guards, Feature Flags, Release Checks

**Referenced By:** P8, Website, Infrastructure, Android Build

**Implementation Impact:** Enforce ceiling in routing and release checks.


### GOV-042 — Auth/schema change control

| Field | Value |
|-------|-------|
| Category | Technical — Auth/schema change control |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Low |
| Canon Class | canonical |

**Decision:** Auth logic and DB schema are change-controlled: explicit human ask only.

**Reason:** Safety.

**Evidence:**

- **Articles:** Article IV
  - **Sections:** Auth/schema only with explicit ask
  - **Quote:** Auth/schema only with explicit ask | Safety for agents and humans

**Depends On:** `GOV-018`

**Blocks:** Migrations, Better Auth Config

**Referenced By:** P8, Backend, All Agents

**Implementation Impact:** CI/review culture + agent refusal. No opportunistic schema cleanup without ask.


### GOV-043 — Single linking system (unnamed)

| Field | Value |
|-------|-------|
| Category | Technical — One linking system |
| Status | Needs Discussion |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Extreme |
| Canon Class | canonical |

**Decision:** Single linking system for life entities (graph integrity).

**Reason:** Prevent fragmented graphs and duplicate relation models.

**Evidence:**

- **Articles:** Article IV
  - **Sections:** One linking system for life entities
  - **Quote:** One linking system for life entities | Graph integrity

**Depends On:** `GOV-019`

**Blocks:** DB Relations, API Link Endpoints, Second Graph Store Ban

**Referenced By:** P8, P9, Backend, AI, Android Build

**Implementation Impact:** New relations use existing link primitive; no second graph store. Constitution asserts one but does not name schema/API — founder/tech lead must name it (REC-005).


### GOV-044 — Vault as ship gate

| Field | Value |
|-------|-------|
| Category | Technical — Vault as ship gate |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Low |
| Canon Class | canonical |

**Decision:** Behavior change incomplete without vault update; constitutional amendment incomplete without vault + Bible changelog.

**Reason:** Institutional memory.

**Evidence:**

- **Articles:** Article IV
  - **Sections:** Vault ships with behavior change
  - **Quote:** Vault ships with behavior change | Institutional memory
- **Articles:** Article XI
  - **Sections:** Amendment
  - **Quote:** vault update, and Design Bible revision with changelog

**Depends On:** `GOV-017`, `GOV-024`

**Blocks:** PR Definition of Done

**Referenced By:** P8, P9, All Agents, Docs

**Implementation Impact:** Definition of Done includes vault paths.


### GOV-045 — Data sovereignty operations bundle

| Field | Value |
|-------|-------|
| Category | Technical — Data sovereignty ops |
| Status | Approved |
| Priority | P0 |
| Confidence | Medium |
| Implementation Cost | High |
| Canon Class | canonical |

**Decision:** No sell/share of lifelog; export+delete always available; journal body out of analytics.

**Reason:** Trust + lawfulness of product posture.

**Evidence:**

- **Articles:** Article III
  - **Sections:** §7
  - **Quote:** A product that sells or shares lifelog data.
- **Articles:** Article IV
  - **Sections:** Export / Journal / Trust rows
  - **Quote:** Export and delete always available; Journal body out of analytics
- **Articles:** Article VI
  - **Sections:** Success
  - **Quote:** write privately and still export everything

**Depends On:** `GOV-011`, `GOV-014`, `GOV-016`

**Blocks:** Export APIs, Deletion Cascades, Analytics Scrubbing

**Referenced By:** P8, Backend, Infrastructure, Privacy

**Implementation Impact:** Backend and client must implement and regression-test export/delete; analytics allowlists exclude journal body. Bundle is Medium confidence as composite of High items.


### GOV-046 — Destructive confirm on all platforms

| Field | Value |
|-------|-------|
| Category | Technical — Destructive confirm |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** Destructive actions require confirmation on all platforms.

**Reason:** Safety.

**Evidence:**

- **Articles:** Article IV
  - **Sections:** Destructive actions confirm
  - **Quote:** Destructive actions confirm | Safety
- **Articles:** Article II
  - **Sections:** OS
  - **Quote:** Shared primitives… across surfaces

**Depends On:** `GOV-015`, `GOV-040`

**Blocks:** Shared Confirm Pattern

**Referenced By:** P8, Android Build, Website, Desktop, Design System

**Implementation Impact:** Shared interaction contract across clients.


### Canonical AI Decisions

### GOV-047 — AI-first means NL intent + derived structure

| Field | Value |
|-------|-------|
| Category | AI — Role of AI |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | High |
| Canon Class | canonical |

**Decision:** AIIMIN is AI-first meaning: intent expressed in natural language; structure is derived. AI-first does not mean chatbot is the product. Over-interpreting as chatbot-first is a named risk.

**Reason:** Protect Life OS from collapsing into chat wrapper.

**Evidence:**

- **Articles:** Article II
  - **Sections:** AI-first
  - **Quote:** AIIMIN is **AI-first** in the sense that intent is expressed in natural language and structure is derived — not in the sense that a chatbot is the product.
- **Articles:** Known risks
  - **Sections:** Known risks
  - **Quote:** Over-interpreting "AI-first" as chatbot-first.

**Depends On:** `GOV-001`, `GOV-002`

**Blocks:** AI Product Shell, Capture NLP, Structuring Pipeline

**Referenced By:** P8, AI, Android Build, Website

**Implementation Impact:** Chat may exist as a surface; product is not a chatbot. Structure derivation is core.


### GOV-048 — AI confidence bands gate action

| Field | Value |
|-------|-------|
| Category | AI — Mixed-initiative partnership |
| Status | Needs Discussion |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Extreme |
| Canon Class | canonical |

**Decision:** Mixed-initiative partnership — AI confidence bands gate action.

**Reason:** Correctable inference; user agency.

**Evidence:**

- **Articles:** Article V
  - **Sections:** §4
  - **Quote:** **Mixed-initiative partnership** — AI confidence bands gate action.

**Depends On:** `GOV-047`, `GOV-035`

**Blocks:** Confidence Model, Action Gating Rules, AI UX States

**Referenced By:** P8, AI, Design System, Android Build, Website

**Implementation Impact:** Bands gate action. Exact thresholds/UI states not in Constitution — founder must define (REC-004).


### GOV-049 — Sparring over sycophancy

| Field | Value |
|-------|-------|
| Category | AI — Sparring over sycophancy |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | High |
| Canon Class | canonical |

**Decision:** Sparring over sycophancy — challenge weak habits with data. Human Momentum without behavioral honesty (Life Score, sparring) is invalid.

**Reason:** Honest coaching; agency after coaching.

**Evidence:**

- **Articles:** Article V
  - **Sections:** §6
  - **Quote:** **Sparring over sycophancy** — challenge weak habits with data.
- **Articles:** Known risks
  - **Sections:** Known risks
  - **Quote:** Using "Human Momentum" as slogan without behavioral honesty (Life Score, sparring).
- **Articles:** Article VIII
  - **Sections:** Emotional contract
  - **Quote:** **agency after coaching**

**Depends On:** `GOV-003`, `GOV-009`, `GOV-030`

**Blocks:** Coaching Copy, Habit Insights Tone

**Referenced By:** P8, AI, Content System

**Implementation Impact:** AI tone: challenge with evidence, not empty praise or shame. Tone bounds vs Article IX shame ban need founder examples (REC related).


### GOV-050 — No AI therapist / clinical framing

| Field | Value |
|-------|-------|
| Category | AI — No therapist / clinical AI |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** No AI therapist, diagnostic, or clinical framing.

**Reason:** Ethics/liability.

**Evidence:**

- **Articles:** Article III
  - **Sections:** §2
  - **Quote:** A clinical mental health device, diagnostic tool, or AI therapist.
- **Articles:** Article VII
  - **Sections:** Failure
  - **Quote:** Clinical or therapist framing.

**Depends On:** `GOV-006`

**Blocks:** System Prompts, Safety Classifiers, Store Listings

**Referenced By:** P8, AI, Android Build, Website

**Implementation Impact:** System prompts and copy refuse clinical role.


### GOV-051 — Inference must be correctable

| Field | Value |
|-------|-------|
| Category | AI — Correctable inference |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | High |
| Canon Class | canonical |

**Decision:** Inference must be correctable; silent wrongness forbidden.

**Reason:** Trust.

**Evidence:**

- **Articles:** Article X
  - **Sections:** Optimize / Avoid
  - **Quote:** Correctable inference | Silent wrongness
- **Articles:** Article VII
  - **Sections:** Failure
  - **Quote:** Silent wrong automation without correction path.

**Depends On:** `GOV-035`, `GOV-048`

**Blocks:** Edit Chips, Undo, Confidence UI

**Referenced By:** P8, AI, Design System, Android Build, Website

**Implementation Impact:** Ship correction affordance with every structured inference.


### GOV-052 — Structure after raw capture

| Field | Value |
|-------|-------|
| Category | AI — Capture structuring |
| Status | Approved |
| Priority | P0 |
| Confidence | Medium |
| Implementation Cost | High |
| Canon Class | canonical |

**Decision:** AI may structure after raw capture; must not force structure before capture.

**Reason:** Capture-first, structure-later.

**Evidence:**

- **Articles:** Article V
  - **Sections:** §2
  - **Quote:** **Capture first, structure later** — raw expression is highest-fidelity signal.
- **Articles:** Article II
  - **Sections:** AI-first
  - **Quote:** intent is expressed in natural language and structure is derived
- **Articles:** Article I
  - **Sections:** Vision
  - **Quote:** without turning life into data entry

**Depends On:** `GOV-028`, `GOV-047`

**Blocks:** NLP Pipeline Order, Mobile/Web Capture

**Referenced By:** P8, AI, Android Build, Website, Backend

**Implementation Impact:** Pipeline order: raw save → structure → user correction. Medium: pipeline order is clear implication of multiple High articles.


### GOV-053 — No AI magic patronage

| Field | Value |
|-------|-------|
| Category | AI — No AI magic patronage |
| Status | Approved |
| Priority | P1 |
| Confidence | High |
| Implementation Cost | Low |
| Canon Class | canonical |

**Decision:** Users must never feel patronized by AI magic.

**Reason:** Respect + honesty.

**Evidence:**

- **Articles:** Article IX
  - **Sections:** Never feel
  - **Quote:** Patronized by "AI magic."

**Depends On:** `GOV-031`, `GOV-047`

**Blocks:** Microcopy, Onboarding, Empty States

**Referenced By:** P8, Content System, AI

**Implementation Impact:** Ban vague magical claims; explain in human terms what system did.


### Canonical Motion Decisions

### GOV-054 — Motion serves emotional triad

| Field | Value |
|-------|-------|
| Category | Motion — Subordinate to calm/clarity |
| Status | Approved |
| Priority | P1 |
| Confidence | Medium |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** Motion must support calm, clarity, and agency — never confuse via decoration or create interrogation/shame theater.

**Reason:** Emotional contract + anti-decoration confusion.

**Evidence:**

- **Articles:** Article VIII
  - **Sections:** Feel / contract
  - **Quote:** Calm… Primary emotional contract: **relief after capture**, **clarity after review**, **agency after coaching**.
- **Articles:** Article IX
  - **Sections:** Never feel
  - **Quote:** Confused by decoration.
- **Articles:** Article X
  - **Sections:** Optimize
  - **Quote:** Timeless identity | Trend following

**Depends On:** `GOV-030`, `GOV-031`, `GOV-038`

**Blocks:** Motion Principles Governance, Motion Reviews

**Referenced By:** P8, Design System, Motion, Android Build, Website

**Implementation Impact:** Motion reviews ask: does this communicate meaning for capture relief / review clarity / coaching agency? Else cut. Durations/easing not in Constitution.


### GOV-055 — Motion anti-nag / anti-casino

| Field | Value |
|-------|-------|
| Category | Motion — Anti-nag / anti-casino |
| Status | Approved |
| Priority | P1 |
| Confidence | Medium |
| Implementation Cost | Low |
| Canon Class | canonical |

**Decision:** Motion must not serve streak/shame casino or JITAI nag urgency theater.

**Reason:** Hard refuse gamification casino; avoid nag loops.

**Evidence:**

- **Articles:** Article III
  - **Sections:** §5
  - **Quote:** A gamification casino that optimizes for streaks and shame.
- **Articles:** Article X
  - **Sections:** Avoid
  - **Quote:** JITAI nag loops
- **Articles:** Article X
  - **Sections:** Avoid
  - **Quote:** Punitive streaks

**Depends On:** `GOV-009`, `GOV-033`, `GOV-026`

**Blocks:** Streak Celebrations, Notification Animation

**Referenced By:** P8, Design System, Motion, Android Build

**Implementation Impact:** Celebratory motion OK for XP role; punitive/urgency loops non-canon.


### Canonical Accessibility Decisions

### GOV-056 — Cognitive accessibility under load

| Field | Value |
|-------|-------|
| Category | Accessibility — Cognitive load |
| Status | Approved |
| Priority | P0 |
| Confidence | Medium |
| Implementation Cost | High |
| Canon Class | canonical |

**Decision:** Product exists for person under cognitive load. UX must not force complex mode/category/lab choices for simple capture. Progressive disclosure by stakes.

**Reason:** Accessibility includes cognitive accessibility.

**Evidence:**

- **Articles:** Article I
  - **Sections:** Why
  - **Quote:** AIIMIN exists so a person under cognitive load can:
- **Articles:** Article IX
  - **Sections:** Never feel
  - **Quote:** Forced to choose among five moods or fourteen lab modules to do one simple thing.
- **Articles:** Article X
  - **Sections:** Optimize
  - **Quote:** Progressive disclosure by stakes

**Depends On:** `GOV-004`, `GOV-008`, `GOV-031`, `GOV-032`

**Blocks:** Capture UX, Lab Modules, IA Density

**Referenced By:** P8, Accessibility, Android Build, Website

**Implementation Impact:** Cognitive a11y is constitutional, not optional polish.


### GOV-057 — Operable capture within ~60s

| Field | Value |
|-------|-------|
| Category | Accessibility — Capture operable when ready |
| Status | Approved |
| Priority | P0 |
| Confidence | Medium |
| Implementation Cost | High |
| Canon Class | canonical |

**Decision:** Daily capture must be possible in under ~60 seconds when user is ready — implies operable, low-friction, interruptible capture path.

**Reason:** Success metric.

**Evidence:**

- **Articles:** Article VI
  - **Sections:** Success
  - **Quote:** Daily capture possible in under ~60 seconds when the user is ready.

**Depends On:** `GOV-021`, `GOV-028`, `GOV-059`

**Blocks:** Critical Path A11y, Offline Capture, IME/Focus Order

**Referenced By:** P8, Accessibility, Android Build, Website

**Implementation Impact:** Critical path a11y and performance for capture is P0. WCAG numeric bar not in Constitution (later A11y Principles).


### GOV-058 — No surveillance feeling; privacy dignity

| Field | Value |
|-------|-------|
| Category | Accessibility — No surveillance feeling |
| Status | Approved |
| Priority | P0 |
| Confidence | Medium |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** Users must never feel surveilled; journal privacy + export/delete support dignity and control.

**Reason:** Emotional refuse + trust.

**Evidence:**

- **Articles:** Article IX
  - **Sections:** Never feel
  - **Quote:** Surveilled.
- **Articles:** Article IV
  - **Sections:** Journal / Export
  - **Quote:** Journal body out of analytics; Export and delete always available

**Depends On:** `GOV-014`, `GOV-016`, `GOV-031`

**Blocks:** Privacy UX, Permissions Copy, Analytics Framing

**Referenced By:** P8, Privacy, Website, Android Build

**Implementation Impact:** Permission and analytics copy must be honest and non-creepy; no dark-pattern tracking framing.


### Canonical Performance Decisions

### GOV-059 — Capture speed first-class

| Field | Value |
|-------|-------|
| Category | Performance — Capture latency |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | High |
| Canon Class | canonical |

**Decision:** Capture speed is a first-class optimization target: under ~60 seconds end-to-end when ready; avoid configuration theater that slows capture.

**Reason:** Success + optimize matrix.

**Evidence:**

- **Articles:** Article VI
  - **Sections:** Success
  - **Quote:** Daily capture possible in under ~60 seconds when the user is ready.
- **Articles:** Article X
  - **Sections:** Optimize / Avoid
  - **Quote:** Capture speed | Configuration theater

**Depends On:** `GOV-021`, `GOV-026`, `GOV-028`

**Blocks:** Client Performance, Offline Sync, Async AI Structuring

**Referenced By:** P8, Android Build, Website, Backend, AI, Infrastructure

**Implementation Impact:** Structure/AI work must not block primary save. Measure time-to-saved-capture.


### GOV-060 — Interaction economy as performance

| Field | Value |
|-------|-------|
| Category | Performance — Interaction economy |
| Status | Needs Discussion |
| Priority | P0 |
| Confidence | Medium |
| Implementation Cost | High |
| Canon Class | canonical |

**Decision:** Product performance includes interaction economy: median meaningful interactions/day toward ~5. Extra steps for same outcome equal performance regression (human time).

**Reason:** Compression as craft.

**Evidence:**

- **Articles:** Article V
  - **Sections:** §8
  - **Quote:** **Compression as craft** — median daily interactions trend down, not up.
- **Articles:** Article VI
  - **Sections:** Success
  - **Quote:** Median meaningful interactions per active day trending toward ~5, not ~15+.
- **Articles:** Article VII
  - **Sections:** Failure
  - **Quote:** Rising daily interaction count for the same human outcomes.

**Depends On:** `GOV-034`, `GOV-021`

**Blocks:** Instrumentation Spec, IA Ceremony Budget

**Referenced By:** P8, P9, Analytics, IA

**Implementation Impact:** Treat added daily taps as budgeted cost. Remove when adding. Instrumentation definition pending founder (REC-002).


### GOV-061 — Tomorrow lighter via remembered context

| Field | Value |
|-------|-------|
| Category | Performance — Tomorrow lighter |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Extreme |
| Canon Class | canonical |

**Decision:** System must reduce next-day planning friction via remembered context (memory/connection/coaching).

**Reason:** Core existence outcome.

**Evidence:**

- **Articles:** Article I
  - **Sections:** §3
  - **Quote:** Act tomorrow with less friction than today — through memory, connection, and honest coaching.
- **Articles:** Article VI
  - **Sections:** Success
  - **Quote:** Tomorrow's plan is lighter because yesterday was remembered.

**Depends On:** `GOV-004`, `GOV-019`, `GOV-047`

**Blocks:** Memory Graph Jobs, Plan Surfaces, Today Remembered Context

**Referenced By:** P8, P9, AI, Backend, Android Build, Website

**Implementation Impact:** Plan/Today should surface remembered context without re-entry.


### Canonical Governance Process Decisions

### GOV-017 — Vault ships with behavior change

| Field | Value |
|-------|-------|
| Category | Institutional Memory |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Low |
| Canon Class | canonical |

**Decision:** Vault ships with every behavior change.

**Reason:** Institutional memory; agents must not drift.

**Evidence:**

- **Articles:** Article IV
  - **Sections:** Vault ships with behavior change
  - **Quote:** Vault ships with behavior change | Institutional memory

**Depends On:** _None_

**Blocks:** Definition of Done, PR Checklist

**Referenced By:** P8, P9, All Agents, Docs

**Implementation Impact:** Code + vault update same unit of work. Behavior change without vault update = non-compliant ship.


### GOV-024 — Constitution amendment process

| Field | Value |
|-------|-------|
| Category | Amendment Process |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Low |
| Canon Class | canonical |

**Decision:** Constitutional change requires: (1) explicit founder approval, (2) written ADR or decision log entry, (3) vault update, (4) Design Bible revision with changelog. Silent amendment by agents/sprints forbidden.

**Reason:** Immutability intentional — threat is identity drift, not insufficient novelty.

**Evidence:**

- **Articles:** Article XI
  - **Sections:** Amendment
  - **Quote:** Constitutional change requires **explicit founder approval**, written ADR or decision log entry, vault update, and Design Bible revision with changelog. Agents and redesign sprints may not silently amend Articles I–X.
- **Articles:** Tradeoffs
  - **Sections:** Tradeoffs
  - **Quote:** Immutability slows opportunistic pivots. That is intentional. AIIMIN's threat is identity drift, not insufficient novelty.

**Depends On:** `GOV-017`

**Blocks:** ADR Process, Design Bible Changelog

**Referenced By:** P8, P9, All Agents, Governance Board

**Implementation Impact:** Governance Board may recommend; founder amends. No silent Article edits.


### GOV-025 — Article supremacy over later principles

| Field | Value |
|-------|-------|
| Category | Hierarchy of Law |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Low |
| Canon Class | canonical |

**Decision:** If a later principle, blueprint, or growth rule contradicts an Article, the Article wins until amended.

**Reason:** Constitution is supreme identity law within Design Bible stack.

**Evidence:**

- **Articles:** Future impact
  - **Sections:** Future impact
  - **Quote:** If a later principle contradicts an Article, the Article wins until amended.

**Depends On:** `GOV-024`

**Blocks:** Conflict Resolution, Later P5 Governance Passes

**Referenced By:** P8, P9, All P7 Artifact Passes

**Implementation Impact:** Conflict resolution always prefers Articles I–X.


---

## 3. GOVERNANCE RECOMMENDATIONS

**NOT CANON.** Board proposals. Require founder approval before binding.

### REC-001 — Ratify all Status:Approved GOV items as citeable product canon

| Field | Value |
|-------|-------|
| Status | Pending Founder |
| Priority | P0 |
| Canon Class | recommendation |
| Related GOV | _None_ |

**Reason:** Implementation needs stable GOV-ID citations without re-reading Constitution.

**Impact:** PRs and specs may cite GOV-IDs as binding.

**Risk:** Low — decisions already High/Medium confidence from Constitution.

### REC-002 — Founder session on Needs Discussion items GOV-012, GOV-021, GOV-043, GOV-048, GOV-060

| Field | Value |
|-------|-------|
| Status | Pending Founder |
| Priority | P0 |
| Canon Class | recommendation |
| Related GOV | `GOV-012`, `GOV-021`, `GOV-043`, `GOV-048`, `GOV-060` |

**Reason:** Unblock route bind, telemetry, linking name, AI bands, instrumentation.

**Impact:** Closes CF/Missing blockers for Android and Master Spec.

**Risk:** Medium — delay blocks P8/P9 readiness.

### REC-003 — Publish Route Alias Map: Today = /overview

| Field | Value |
|-------|-------|
| Status | Pending Founder |
| Priority | P0 |
| Canon Class | recommendation |
| Related GOV | `GOV-012`, `GOV-039` |

**Reason:** Constitution says Today; product lock says /overview (Today). Same intent, different identifiers (CF-001).

**Impact:** Navbar/BrandLockup wiring unambiguous without amending Constitution.

**Risk:** Low if alias only; High if wrong route chosen.

### REC-004 — Publish AI Confidence Band Spec (names, thresholds, allowed actions)

| Field | Value |
|-------|-------|
| Status | Pending Founder |
| Priority | P0 |
| Canon Class | recommendation |
| Related GOV | `GOV-048`, `GOV-035`, `GOV-051` |

**Reason:** GOV-048 asserts bands gate action but Constitution defines no thresholds.

**Impact:** Unblocks AI action gating UX across clients.

**Risk:** High if bands wrong — silent automation or over-asking.

### REC-005 — Publish Linking System Spec pointer (named schema/API)

| Field | Value |
|-------|-------|
| Status | Pending Founder |
| Priority | P0 |
| Canon Class | recommendation |
| Related GOV | `GOV-019`, `GOV-043` |

**Reason:** GOV-019/043 assert one linking system without naming it.

**Impact:** Prevents Android/web graph divergence.

**Risk:** Extreme if delayed — dual graphs.

### REC-006 — Adopt Ship Kill Checklist from GOV-022 + Article III refuse list

| Field | Value |
|-------|-------|
| Status | Pending Founder |
| Priority | P0 |
| Canon Class | recommendation |
| Related GOV | `GOV-022` |

**Reason:** Operationalize failure triggers in PR/product review.

**Impact:** Identity-death detectors become checklist.

**Risk:** Low.

### REC-007 — Adopt Feature Intake requiring human problem statement

| Field | Value |
|-------|-------|
| Status | Pending Founder |
| Priority | P0 |
| Canon Class | recommendation |
| Related GOV | `GOV-023` |

**Reason:** GOV-023 failure condition needs process enforcement.

**Impact:** Stops feature-without-problem.

**Risk:** Low process friction.

### REC-008 — Adopt Emotional Triad QA (relief / clarity / agency)

| Field | Value |
|-------|-------|
| Status | Pending Founder |
| Priority | P1 |
| Canon Class | recommendation |
| Related GOV | `GOV-030` |

**Reason:** GOV-030 contract needs UX acceptance gate.

**Impact:** UX reviews check triad explicitly.

**Risk:** Low.

### REC-009 — Enforce /m ceiling in release checks

| Field | Value |
|-------|-------|
| Status | Pending Founder |
| Priority | P0 |
| Canon Class | recommendation |
| Related GOV | `GOV-013`, `GOV-041` |

**Reason:** GOV-013/041 need automated prevention of analytics creep.

**Impact:** Release gate blocks /m analytics/tools.

**Risk:** Low.

### REC-010 — Enforce journal body not in analytics allowlists

| Field | Value |
|-------|-------|
| Status | Pending Founder |
| Priority | P0 |
| Canon Class | recommendation |
| Related GOV | `GOV-016` |

**Reason:** GOV-016 privacy lock needs engineering enforcement.

**Impact:** Telemetry scrubbing regression tests.

**Risk:** Medium if missed — privacy incident.

### REC-011 — Keep Constitution FROZEN; amend only via Article XI

| Field | Value |
|-------|-------|
| Status | Pending Founder |
| Priority | P0 |
| Canon Class | recommendation |
| Related GOV | `GOV-024` |

**Reason:** Already constitutional; board restates as operating rule for P7.

**Impact:** No silent Article edits during governance passes.

**Risk:** None.

### REC-012 — Next P7 pass: Non-Negotiables then IA Principles

| Field | Value |
|-------|-------|
| Status | Pending Founder |
| Priority | P0 |
| Canon Class | recommendation |
| Related GOV | _None_ |

**Reason:** Fill M-001 nav IA and M-016 meds/allergies/PIN gaps Constitution cannot supply.

**Impact:** Raises build-without-reread completeness.

**Risk:** Low.

### REC-013 — Clarify compression = ceremony budget, not capability ceiling

| Field | Value |
|-------|-------|
| Status | Pending Founder |
| Priority | P1 |
| Canon Class | recommendation |
| Related GOV | `GOV-034`, `GOV-060` |

**Reason:** CF-012: ~5 interactions may conflict with power-user Life OS breadth if misread.

**Impact:** Power users deepen surfaces without raising mandatory daily taps.

**Risk:** Medium misinterpretation if skipped.

### REC-014 — Agents cite GOV-IDs in PRs touching identity, /m, palette, clinical, social, capture

| Field | Value |
|-------|-------|
| Status | Pending Founder |
| Priority | P1 |
| Canon Class | recommendation |
| Related GOV | _None_ |

**Reason:** Operationalize governance graph.

**Impact:** Traceable PR review against canon.

**Risk:** Low process overhead.

### REC-015 — Define sparring vs shame tone bounds with written examples

| Field | Value |
|-------|-------|
| Status | Pending Founder |
| Priority | P0 |
| Canon Class | recommendation |
| Related GOV | `GOV-049`, `GOV-031` |

**Reason:** CF-007 tension between GOV-049 sparring and GOV-031 never shame/interrogated.

**Impact:** Safe coaching copy across AI surfaces.

**Risk:** High if undefined — shame theater or empty praise.

---

## 4. Conflicts

| ID | Type | Detail | Recommendation |
|----|------|--------|----------------|
| CF-001 | Ambiguous wording vs product lock | Article IV: wordmark → Today. Product lock elsewhere: wordmark → /overview (Today). | REC-003 Route Alias Map. Do not amend Constitution. |
| CF-002 | Incomplete vs Non-Negotiables | Constitution: destructive actions confirm. Non-Negotiables add branded. | Elevate branded confirm when governing Non-Negotiables. |
| CF-003 | Duplicate thematic rules | Capture-first in Art I, III§8, V§2, VI, X. | Cite GOV-028 as implementation primary. |
| CF-004 | Duplicate refuse | Clinical ban in Art III, IV, VII. | Cite GOV-006. |
| CF-005 | Potential tension | AI-first vs not chatbot / not AI magic. | Resolved by GOV-047 + GOV-053. |
| CF-006 | Potential tension | Native richness vs /m capture-only. | Resolved by GOV-013/041. |
| CF-007 | Potential tension | Sparring vs never shame/interrogated. | REC-015 tone bounds. |
| CF-008 | Weak / unmeasurable as written | ~60 seconds, ~5 interactions, meaningful interactions. | Founder: SLO vs directional OKR (REC-002). |
| CF-009 | Missing definition | One linking system unnamed. | REC-005. |
| CF-010 | Missing definition | AI confidence bands without thresholds. | REC-004. |
| CF-011 | Hidden assumption | One connected graph assumes unified domains desire. | Progressive disclosure; do not force unused domains. |
| CF-012 | Scalability | Median ~5 vs power-user breadth. | REC-013 ceremony vs capability. |
| CF-013 | Monitor | GoodNotes PWA risk via stylus revival. | Keep refuse; stylus OK if not handwriting-PWA identity. |
| CF-014 | Undefined term | Pattern language in Art X. | Define when governing Component/IA principles. |
| CF-015 | Cross-doc authority | Articles vs always-on agent rules. | Founder ADR if conflict; Articles + founder locks co-equal for ship. |

---

## 5. Missing Decisions

Constitution does **not** decide these (must not invent as canon):

| Gap ID | Missing | Why | Next |
|--------|---------|-----|------|
| M-001 | Bottom nav / primary destinations | IA not in Constitution | P5 06_INFORMATION_ARCHITECTURE_PRINCIPLES + D-NAV |
| M-002 | Exact Today route ID | Brand lockup wiring | REC-003 |
| M-003 | Confidence band thresholds & UI states | AI gating | REC-004 |
| M-004 | Named linking system | Graph integrity enforcement | REC-005 |
| M-005 | Life Score formula / inputs | Honesty vs vanity XP | Product Bible / gamification |
| M-006 | Telemetry: meaningful interaction | Success metrics | REC-002 |
| M-007 | Capture ready definition & timing method | 60s metric | REC-002 |
| M-008 | WCAG level / contrast / targets | A11y engineering | P5 11_ACCESSIBILITY_PRINCIPLES |
| M-009 | Motion durations/easing/reduced-motion | Motion impl | P5 09_MOTION_PRINCIPLES |
| M-010 | Notification taxonomy | Interruptibility | Interaction principles + Non-Negotiables |
| M-011 | Pattern language operational definition | Art X | Component/IA principles |
| M-012 | Sparring tone guide | Art V vs IX | REC-015 |
| M-013 | Export formats & delete cascade scope | Trust ops | Privacy/API specs |
| M-014 | Surface × primitive matrix | OS shared primitives claim | Monorepo architecture + P1 |
| M-015 | Growth vs social-refuse detail | Monetization/waitlist | Product / launch docs |
| M-016 | Meds/allergies/PIN inference bans | In Non-Negotiables only | Govern Non-Negotiables |

---

## 6. Questions for Founder

1. Confirm Today ≡ /overview for wordmark lockup (CF-001 / GOV-012 / REC-003)?
2. Are ~60s capture and ~5 median interactions hard SLOs or directional OKRs?
3. What is the named one linking system (tables/APIs) for GOV-043?
4. Define AI confidence bands (names, thresholds, allowed actions).
5. Ratify sparring vs shame boundary — written tone examples (REC-015)?
6. Is Life Score formula already locked elsewhere — point as dependent canon?
7. For native vs /m, any founder exception path ever, or absolute forever?
8. Does sell or share lifelog data forbid anonymized aggregates, or only identifiable lifelog?
9. Should Status:Approved GOV decisions become enforceable PR checklist items immediately?
10. Next artifact to govern: Non-Negotiables (18) or Product Philosophy (02) or IA Principles (06)?

---

## 7. Dependency Graph Summary

### Highest fan-in (most `depends_on` references)

| GOV ID | Referenced as Depends On (count) |
|--------|----------------------------------|
| GOV-001 | 10 — Personal Life OS category lock |
| GOV-002 | 8 — Vision lock — Capture once |
| GOV-003 | 7 — Brand frame — Human Momentum |
| GOV-026 | 6 — Optimize / avoid matrix |
| GOV-028 | 5 — Capture first, structure later |
| GOV-004 | 5 — Three existence outcomes |
| GOV-030 | 5 — Emotional contract triad |
| GOV-031 | 5 — Emotional refuse list |
| GOV-021 | 4 — Official success criteria (non-vanity) |
| GOV-047 | 4 — AI-first means NL intent + derived structure |
| GOV-011 | 3 — Refuse sell/share lifelog data |
| GOV-014 | 3 — Export and delete always available |
| GOV-036 | 2 — Palette identity non-negotiable |
| GOV-040 | 2 — Shared primitives across surfaces |
| GOV-006 | 2 — Refuse clinical / therapist claims |

### Extreme cost decisions (cross-platform)

| GOV ID | Title | Blocks |
|--------|-------|--------|
| GOV-001 | Personal Life OS category lock | Master Product Specification, Feature Intake, All Clients Domain Model |
| GOV-004 | Three existence outcomes | Feature Intake, Roadmap, Life Graph |
| GOV-019 | One linking system for life entities | Entity Model, API Link Endpoints, AI Entity Resolution |
| GOV-040 | Shared primitives across surfaces | Cross-Client Contracts, Entity Alignment, Token Alignment |
| GOV-043 | Single linking system (unnamed) | DB Relations, API Link Endpoints, Second Graph Store Ban |
| GOV-048 | AI confidence bands gate action | Confidence Model, Action Gating Rules, AI UX States |
| GOV-061 | Tomorrow lighter via remembered context | Memory Graph Jobs, Plan Surfaces, Today Remembered Context |

### Needs Discussion (canonical but incomplete for ship)

| GOV ID | Title | Why open |
|--------|-------|----------|
| GOV-012 | Split brand lockup (mark /brand, wordmark Today) | See Implementation Impact |
| GOV-021 | Official success criteria (non-vanity) | See Implementation Impact |
| GOV-043 | Single linking system (unnamed) | See Implementation Impact |
| GOV-048 | AI confidence bands gate action | See Implementation Impact |
| GOV-060 | Interaction economy as performance | See Implementation Impact |

---

## 8. Final Governance Score

| Dimension | Score (/10) |
|-----------|-------------|
| Identity clarity | 9 |
| Enforceability | 8 |
| Cross-platform readiness | 6 |
| AI readiness | 7 |
| Conflict hygiene | 8 |
| Metric rigor | 5 |
| Amendment process | 9 |
| Completeness for build-without-reread | 6 |
| Traceability / evidence | 9 |
| Machine-readability | 9 |

### Final Governance Score: **76 / 100**

Constitution remains strong identity law. Upgrade adds evidence trails, confidence, cost, dependency graph, and canon/recommendation separation. Still insufficient alone for nav IA, confidence thresholds, and telemetry SLOs.

---

## Evidence (process)

- Source read: Constitution v3.0 (unchanged / FROZEN)
- Baseline preserved: `_baseline/01_CONSTITUTION_GOVERNANCE.v1-baseline.md`
- GOV IDs preserved: GOV-001…GOV-061
- Upgrade fields added: Confidence, Evidence, Implementation Cost, Depends On, Blocks, Referenced By
- Canon separated from Recommendations (REC-001…REC-015)
- Objective correction: GOV-036 no longer embeds Palette hex as if Constitution text (hex live in Palette.md dependency)

