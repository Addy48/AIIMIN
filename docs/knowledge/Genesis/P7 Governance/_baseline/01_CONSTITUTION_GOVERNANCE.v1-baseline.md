# P7 — Constitution Governance Board

```yaml
document: Constitution Governance
phase: P7
source: AIIMIN GENESIS/P5 Constitution/01_AIIMIN_CONSTITUTION.md
source_version: 3.0
source_status: FROZEN — do not modify
governance_date: 2026-07-22
authority: Product Governance Board (pending founder ratification of Status fields)
```

> This document does **not** rewrite the Constitution. It extracts enforceable product canon from Articles I–XI so implementation teams can ship without re-reading the Constitution.

---

## 1. Constitution Overview

| Field | Value |
|-------|--------|
| Document | `01_AIIMIN_CONSTITUTION.md` |
| Version | 3.0 |
| Authority | Immutable unless founder override |
| Last updated | 2026-07-22 |
| Scope | Identity law — what AIIMIN is, refuses, optimizes, succeeds/fails at |
| Hierarchy | If later principle / blueprint / sprint contradicts an Article → **Article wins** until amended |
| Amendment path | Explicit founder approval + ADR/decision log + vault update + Design Bible revision + changelog |
| Agent power | Agents and redesign sprints **may not** silently amend Articles I–X |

**Articles governed:**

| Article | Title | Canon class |
|---------|-------|-------------|
| I | Why AIIMIN exists | Mission / vision lock |
| II | What AIIMIN is | Product category |
| III | What AIIMIN will never become | Hard refuse list |
| IV | What AIIMIN refuses to compromise | Permanent locks |
| V | What defines AIIMIN | Operating principles |
| VI | What success means | Success metrics (product, not vanity) |
| VII | What failure means | Anti-patterns / kill triggers |
| VIII | What users should feel | Emotional contract |
| IX | What users should never feel | Emotional refuse |
| X | What the product optimizes for | Optimization matrix |
| XI | Amendment | Governance process |

**Evidence cited by Constitution (frozen references):** Product Bible Vision & Philosophy; Knowledge Context Product Philosophy; Decisions D-PAL, D-NAV, D-MWEB, D-CLIN, D-JENC; Never-to-Build; Design History survivors/deaths.

**Dependencies named:** Product Bible; Palette.md; Product Decisions locks; Never-to-Build.

**Known risks named (must stay governed):** Over-interpreting “AI-first” as chatbot-first; treating native richness as permission to break `/m`; using “Human Momentum” as slogan without Life Score / sparring honesty.

---

## 2. Canonical Product Decisions

### GOV-001

- **Category:** Product Identity
- **Source:** Article II
- **Decision:** AIIMIN is officially a **Personal Life OS** — Personal (one human’s life graph, not a network) + Life (whole person: execution, money, health, reflection, family, career) + OS (shared primitives, shared memory, shared intelligence across surfaces).
- **Reason:** Category lock prevents single-domain drift and social-network drift.
- **Dependencies:** All surfaces (Android, web, desktop, backend, AI) must share primitives/memory/intelligence contracts.
- **Implementation Impact:** Feature proposals that are single-domain-only without Life OS linkage are out of canon. Cross-surface entity model required.
- **Priority:** P0
- **Status:** Approved

### GOV-002

- **Category:** Product Vision
- **Source:** Article I
- **Decision:** Vision lock is mandatory copy/strategy north star: *Capture once. AIIMIN remembers, connects, and coaches — without turning life into data entry.*
- **Reason:** Survived multiple redesigns; protects coherent purpose.
- **Dependencies:** Capture UX, memory graph, coaching AI, copy system.
- **Implementation Impact:** Any flow that forces taxonomy-first capture violates vision. Marketing and in-product copy must not contradict.
- **Priority:** P0
- **Status:** Approved

### GOV-003

- **Category:** Brand Frame
- **Source:** Article I
- **Decision:** Brand frame is **Human Momentum** — precision, feedback loops, behavioral intelligence, data sovereignty, momentum engineering. Explicitly **never shame theater**.
- **Reason:** Emotional and ethical identity of the brand.
- **Dependencies:** Life Score, gamification, coaching tone, motion, visual language.
- **Implementation Impact:** Streak/shame UX, guilt copy, punitive empty states are non-canon. Brand book and product UI must share this frame.
- **Priority:** P0
- **Status:** Approved

### GOV-004

- **Category:** Product Mission (capabilities)
- **Source:** Article I
- **Decision:** Product must enable three outcomes under cognitive load: (1) capture life as it happens without data-entry clerking; (2) show one connected graph of goals, habits, money, calendar, body, mind, family, work; (3) act tomorrow with less friction via memory, connection, honest coaching.
- **Reason:** Defines existence criteria — features must serve at least one of these.
- **Dependencies:** Capture surfaces, life graph/linking system, coaching/plan surfaces.
- **Implementation Impact:** Feature intake filter: map to capture / connect / coach. Orphan features fail governance.
- **Priority:** P0
- **Status:** Approved

### GOV-005

- **Category:** Hard Refuse — Social
- **Source:** Article III §1
- **Decision:** AIIMIN will never become a social network, public feed, or public leaderboard.
- **Reason:** Personal Life OS ≠ network product.
- **Dependencies:** Growth strategy, gamification, sharing features.
- **Implementation Impact:** No public feeds, no public rankings. Private sharing (if ever) requires separate founder decision and must not create social graph product.
- **Priority:** P0
- **Status:** Approved

### GOV-006

- **Category:** Hard Refuse — Clinical
- **Source:** Article III §2; Article IV; Article VII
- **Decision:** AIIMIN will never become a clinical mental health device, diagnostic tool, or AI therapist. No clinical claims.
- **Reason:** Ethics and liability (D-CLIN lineage).
- **Dependencies:** AI copy, health modules, coaching language, App Store / Play claims, marketing.
- **Implementation Impact:** Ban diagnostic language, therapy framing, clinical claims in UI/docs/store. Health data may exist as life context, not clinical product.
- **Priority:** P0
- **Status:** Approved

### GOV-007

- **Category:** Hard Refuse — Single-domain
- **Source:** Article III §3
- **Decision:** AIIMIN will never become a single-domain app (finance-only, fitness-only, notes-only) wearing Life OS clothing.
- **Reason:** Protects Life OS category integrity.
- **Dependencies:** Roadmap prioritization, module packaging, marketing positioning.
- **Implementation Impact:** Vertical modules allowed as surfaces of the OS, not as the product identity.
- **Priority:** P0
- **Status:** Approved

### GOV-008

- **Category:** Hard Refuse — Forms / config theater
- **Source:** Article III §4, §8; Article X
- **Decision:** AIIMIN will never become a form builder disguised as productivity, nor block capture behind mode pickers, category interrogations, or vanity configuration.
- **Reason:** Capture-first identity; cognitive load honesty.
- **Dependencies:** Capture UX, onboarding, settings, entity creation flows.
- **Implementation Impact:** Capture path must allow primary save without ceremony. Structure/categories deferred or inferred.
- **Priority:** P0
- **Status:** Approved

### GOV-009

- **Category:** Hard Refuse — Gamification casino
- **Source:** Article III §5; Article V §7
- **Decision:** AIIMIN will never become a gamification casino that optimizes for streaks and shame. Life Score must remain honest composite truth, not vanity XP.
- **Reason:** Human Momentum ≠ engagement hack; honesty over vanity.
- **Dependencies:** Life Score model, XP/celebration systems, streak UI, notifications.
- **Implementation Impact:** Separate celebratory XP from honest Life Score roles. Punitive streak systems non-canon.
- **Priority:** P0
- **Status:** Approved

### GOV-010

- **Category:** Hard Refuse — Visual clones / handwriting PWA
- **Source:** Article III §6; Article VII
- **Decision:** AIIMIN will never become a purple SaaS clone, cream-terracotta editorial AI look, or GoodNotes handwriting PWA. Redesign that could belong to another brand after removing the logo = failure.
- **Reason:** Timeless identity; Design History survivors/deaths.
- **Dependencies:** Palette, typography, brand lockup, frontend design rules.
- **Implementation Impact:** Design review gate: brand-test after logo removal. Forbidden aesthetic clusters are product law.
- **Priority:** P0
- **Status:** Approved

### GOV-011

- **Category:** Hard Refuse — Data commerce
- **Source:** Article III §7
- **Decision:** AIIMIN will never sell or share lifelog data.
- **Reason:** Data sovereignty pillar of Human Momentum.
- **Dependencies:** Privacy policy, analytics, partnerships, export tooling, vendor contracts.
- **Implementation Impact:** No data-sale features or silent third-party lifelog sharing. Analytics must respect journal-body ban (GOV-016).
- **Priority:** P0
- **Status:** Approved

### GOV-012

- **Category:** Brand Navigation Lock
- **Source:** Article IV
- **Decision:** Split brand lockup is permanent: **logo mark → `/brand`** (brand book); **wordmark → Today** (daily OS). Brand book ≠ daily OS.
- **Reason:** Recognition continuity; separates identity education from daily use.
- **Dependencies:** `BrandLockup`, routes `/brand` and Today surface route.
- **Implementation Impact:** Do not unify click targets. Do not replace with mini-story or purple OAuth chrome.
- **Priority:** P0
- **Status:** Needs Discussion *(route name: Constitution says “Today”; product lock elsewhere names `/overview` as Today — bind route ID in governance)*

### GOV-013

- **Category:** Platform Ceiling — Phone web
- **Source:** Article IV; Article VII
- **Decision:** Phone web `/m` is **capture-first / capture-only**. Analytics tools on `/m` = failure. Native capture richness does **not** authorize breaking `/m` lock.
- **Reason:** Device honesty (D-MWEB lineage). Known risk explicitly called out.
- **Dependencies:** Capacitor `/m`, mobile web routes, feature flags, IA.
- **Implementation Impact:** No analytics, insights, pomodoro, or tools on `/m`. Native Android may be richer; `/m` stays collection stopgap.
- **Priority:** P0
- **Status:** Approved

### GOV-014

- **Category:** Trust — Export / Delete
- **Source:** Article IV; Article VI
- **Decision:** Export and delete must always be available. User trust includes writing privately **and** exporting everything.
- **Reason:** Trust and data sovereignty.
- **Dependencies:** Settings, account deletion, export APIs, privacy UX.
- **Implementation Impact:** Ship/keep export + delete paths. Blocking either is constitutional violation.
- **Priority:** P0
- **Status:** Approved

### GOV-015

- **Category:** Safety — Destructive actions
- **Source:** Article IV
- **Decision:** Destructive actions must confirm.
- **Reason:** Safety.
- **Dependencies:** All delete/overwrite/irreversible UI patterns; branded confirm dialogs (expanded in Non-Negotiables, not this doc).
- **Implementation Impact:** No silent destructive ops. Confirmations required on every client.
- **Priority:** P0
- **Status:** Approved

### GOV-016

- **Category:** Privacy — Journal analytics
- **Source:** Article IV (D-JENC lineage)
- **Decision:** Journal body stays out of analytics.
- **Reason:** Privacy.
- **Dependencies:** Analytics pipelines (GA4/Sentry/custom), journaling features, AI training/telemetry.
- **Implementation Impact:** Do not send journal body content to analytics vendors. Event names/metadata only if policy allows — body never.
- **Priority:** P0
- **Status:** Approved

### GOV-017

- **Category:** Institutional Memory
- **Source:** Article IV
- **Decision:** Vault ships with every behavior change.
- **Reason:** Institutional memory; agents must not drift.
- **Dependencies:** `docs/knowledge/`, agent rules, changelog process.
- **Implementation Impact:** Code + vault update same unit of work. Behavior change without vault update = non-compliant ship.
- **Priority:** P0
- **Status:** Approved

### GOV-018

- **Category:** Auth / Schema Gate
- **Source:** Article IV
- **Decision:** Auth and database schema change only with **explicit human ask**.
- **Reason:** Safety for agents and humans.
- **Dependencies:** Better Auth, Supabase schema, migrations, agent skills.
- **Implementation Impact:** Agents must refuse unsolicited auth/schema edits. Founder ask required before any change.
- **Priority:** P0
- **Status:** Approved

### GOV-019

- **Category:** Life Graph Integrity
- **Source:** Article IV
- **Decision:** One linking system for life entities.
- **Reason:** Graph integrity; prevent duplicate link models.
- **Dependencies:** Entity model, APIs, AI structuring, all clients.
- **Implementation Impact:** No parallel linking systems. New entity types plug into the one graph.
- **Priority:** P0
- **Status:** Approved

### GOV-020

- **Category:** Primitives Policy
- **Source:** Article V §3; Article VII
- **Decision:** One primitive, many surfaces — no duplicate mood/theme/arc/resume UIs. Duplicate primitives proliferating = failure.
- **Reason:** OS coherence; compression.
- **Dependencies:** Component system, domain models, IA.
- **Implementation Impact:** Before new UI for a concept, prove no existing primitive covers it. Kill duplicate surfaces.
- **Priority:** P0
- **Status:** Approved

### GOV-021

- **Category:** Success Metrics (product)
- **Source:** Article VI
- **Decision:** Official success criteria (not downloads/DAU/feature count):
  1. Daily capture possible in under ~60 seconds when user is ready.
  2. Median meaningful interactions per active day trending toward ~5, not ~15+.
  3. User can answer “how am I doing?” without visiting four apps.
  4. User trusts system enough to write privately and still export everything.
  5. Tomorrow’s plan is lighter because yesterday was remembered.
  6. Designers/agents can ship without asking “who are we?”
- **Reason:** Outcome-aligned product truth.
- **Dependencies:** Telemetry definitions, Today/overview, capture, export, coaching/plan.
- **Implementation Impact:** KPI dashboards must prefer these over vanity DAU. Interaction-count rise for same outcomes = fail (GOV-022).
- **Priority:** P0
- **Status:** Needs Discussion *(exact telemetry definitions for “meaningful interaction” and “ready” capture not in Constitution)*

### GOV-022

- **Category:** Failure Triggers
- **Source:** Article VII
- **Decision:** Official failure conditions (any is a governance red flag):
  - Rising daily interaction count for same human outcomes
  - Duplicate primitives proliferating
  - Clinical/therapist framing
  - Analytics tools on phone web `/m`
  - Social comparison as growth strategy
  - Silent wrong automation without correction path
  - Feature shipped without a human problem
  - Redesign that could belong to another brand after logo removal
- **Reason:** Early identity-death detectors.
- **Dependencies:** Product review, growth, AI automation, `/m`, design review.
- **Implementation Impact:** Use as ship/kill checklist. Automation without correction path is forbidden.
- **Priority:** P0
- **Status:** Approved

### GOV-023

- **Category:** Feature Intake Gate
- **Source:** Article VII; Article X
- **Decision:** Every feature must justify a human problem. Feature without human problem = failure / refuse.
- **Reason:** Prevent novelty-driven identity drift.
- **Dependencies:** PRD process, sprint intake, agent feature proposals.
- **Implementation Impact:** Intake template must state human problem before build.
- **Priority:** P0
- **Status:** Approved

### GOV-024

- **Category:** Amendment Process
- **Source:** Article XI
- **Decision:** Constitutional change requires: (1) explicit founder approval, (2) written ADR or decision log entry, (3) vault update, (4) Design Bible revision with changelog. Silent amendment by agents/sprints forbidden.
- **Reason:** Immutability intentional — threat is identity drift, not insufficient novelty.
- **Dependencies:** ADR folder, vault, Design Bible changelog, founder process.
- **Implementation Impact:** Governance Board may recommend; founder amends. No silent Article edits.
- **Priority:** P0
- **Status:** Approved

### GOV-025

- **Category:** Hierarchy of Law
- **Source:** Future impact section
- **Decision:** If later principle, blueprint, or growth rule contradicts an Article, the Article wins until amended.
- **Reason:** Constitution is supreme identity law within Design Bible stack.
- **Dependencies:** All P5 documents; future P7+ governance of other artifacts.
- **Implementation Impact:** Conflict resolution always prefers Articles I–X.
- **Priority:** P0
- **Status:** Approved

### GOV-026

- **Category:** Optimization Policy
- **Source:** Article X
- **Decision:** Product optimizes for: capture speed; connected memory; correctable inference; interruptibility respect; pattern language; progressive disclosure by stakes; long-term trust; timeless identity. Deliberately avoids: configuration theater; siloed widgets; silent wrongness; JITAI nag loops; punitive streaks; same friction everywhere; short-term engagement hacks; trend following.
- **Reason:** Explicit optimize/avoid matrix for roadmap and UX.
- **Dependencies:** Notifications, focus/pomodoro, IA density, AI inference UX, design system.
- **Implementation Impact:** Design/product reviews score against this matrix. Nag loops and trend-chasing aesthetics fail.
- **Priority:** P0
- **Status:** Approved

---

## 3. Canonical UX Decisions

### GOV-027

- **Category:** UX — Intent model
- **Source:** Article V §1
- **Decision:** Intent over interface — users arrive with needs, not taxonomies.
- **Reason:** Cognitive load reality.
- **Dependencies:** Navigation labels, search/command, AI intent parsing, onboarding.
- **Implementation Impact:** Prefer need-based entry (capture, review, plan) over taxonomy browsers as primary.
- **Priority:** P0
- **Status:** Approved

### GOV-028

- **Category:** UX — Capture doctrine
- **Source:** Article V §2; Article I; Article VIII
- **Decision:** Capture first, structure later. Raw expression is highest-fidelity signal. Primary emotional contract includes **relief after capture**.
- **Reason:** Fidelity and speed under load.
- **Dependencies:** Journal/notes/mobile capture, AI structuring, correction UX.
- **Implementation Impact:** Default capture = free expression + fast save. Structure via AI/later edit, not pre-forms.
- **Priority:** P0
- **Status:** Approved

### GOV-029

- **Category:** UX — Read surfaces
- **Source:** Article V §5
- **Decision:** Read surfaces stay calm — intelligence without interrogation.
- **Reason:** Review should produce clarity, not new anxiety.
- **Dependencies:** Today, reports, insights, dashboards.
- **Implementation Impact:** Ban quiz-like interrogation on read paths. Show connected signal calmly.
- **Priority:** P0
- **Status:** Approved

### GOV-030

- **Category:** UX — Emotional contract
- **Source:** Article VIII
- **Decision:** Users should feel: Calm, Capable, Honest, Respected, In momentum — not in debt to the product. Contract triad: **relief after capture**, **clarity after review**, **agency after coaching**.
- **Reason:** Defines acceptable post-interaction emotional state.
- **Dependencies:** Empty states, coaching, Life Score, notifications, copy.
- **Implementation Impact:** UX review includes emotional outcome check against triad.
- **Priority:** P0
- **Status:** Approved

### GOV-031

- **Category:** UX — Emotional refuse
- **Source:** Article IX
- **Decision:** Users must never feel: Interrogated, Shamed, Trapped, Surveilled, Confused by decoration, Patronized by “AI magic,” Forced to choose among five moods or fourteen lab modules to do one simple thing.
- **Reason:** Anti-patterns proven by history (lab module sprawl, mood pickers).
- **Dependencies:** Lab/modules IA, mood UI, AI copy, onboarding, decoration budget.
- **Implementation Impact:** Mood/lab pickers that block simple tasks are non-canon. “AI magic” patronizing copy banned.
- **Priority:** P0
- **Status:** Approved

### GOV-032

- **Category:** UX — Progressive disclosure
- **Source:** Article X
- **Decision:** Progressive disclosure by stakes — not same friction everywhere.
- **Reason:** High-stakes (destructive, money, privacy) earn friction; capture does not.
- **Dependencies:** Confirmations, settings depth, capture vs delete flows.
- **Implementation Impact:** Map friction to stakes. Capture low friction; destructive high friction.
- **Priority:** P0
- **Status:** Approved

### GOV-033

- **Category:** UX — Interruptibility
- **Source:** Article X
- **Decision:** Respect interruptibility; deliberately avoid JITAI nag loops.
- **Reason:** Agency and long-term trust.
- **Dependencies:** Notifications, focus mode, reminders, coaching prompts.
- **Implementation Impact:** Notification policy must justify attention. No engagement-maximizing nag loops.
- **Priority:** P0
- **Status:** Approved

### GOV-034

- **Category:** UX — Compression craft
- **Source:** Article V §8; Article VI; Article VII
- **Decision:** Compression as craft — median daily interactions trend down (~5), not up (~15+). Rising interaction count for same outcomes = failure.
- **Reason:** Less product debt; more life.
- **Dependencies:** IA, Today composition, shortcuts, AI batching.
- **Implementation Impact:** Prefer fewer higher-leverage interactions. Resist adding daily touchpoints without removing others.
- **Priority:** P0
- **Status:** Approved

### GOV-035

- **Category:** UX — Correction path for automation
- **Source:** Article VII; Article X
- **Decision:** Silent wrong automation without correction path is failure. Optimize for correctable inference; avoid silent wrongness.
- **Reason:** Trust + mixed-initiative partnership.
- **Dependencies:** AI structuring, entity linking, coaching suggestions.
- **Implementation Impact:** Every inference UI needs edit/correct/undo path.
- **Priority:** P0
- **Status:** Approved

---

## 4. Canonical Visual Decisions

### GOV-036

- **Category:** Visual — Palette identity
- **Source:** Article IV; Article III §6
- **Decision:** Palette identity is non-negotiable until founder override. Recognition requires continuity.
- **Reason:** Brand continuity across redesigns (blue→orange survivor history).
- **Dependencies:** `docs/knowledge/08_DESIGN/Palette.md`; all clients’ tokens.
- **Implementation Impact:** Locked dark/light tokens (bg `#1a1a1a`, cards `#2d2d2d`, accent `#ff6b35`, done `#10b981`, muted `#6b7280`; light bg `#f9f9f9`, cards `#ffffff`). No new brand colors without founder approval.
- **Priority:** P0
- **Status:** Approved

### GOV-037

- **Category:** Visual — Forbidden aesthetics
- **Source:** Article III §6; Article VII
- **Decision:** Forbidden: purple SaaS clone; cream-terracotta editorial AI look; GoodNotes handwriting PWA aesthetic; any redesign interchangeable after logo removal.
- **Reason:** Timeless identity over trend following (Article X).
- **Dependencies:** Frontend design rules, brand reviews, prototype studio.
- **Implementation Impact:** Visual QA includes anti-clone checklist + brand-test.
- **Priority:** P0
- **Status:** Approved

### GOV-038

- **Category:** Visual — Decoration vs identity
- **Source:** Article IX; Article X
- **Decision:** Decoration must not confuse. Avoid visual clutter as personality. Timeless identity over trend following.
- **Reason:** Calm/capable emotional contract.
- **Dependencies:** Motion, illustration, Today widgets, empty states.
- **Implementation Impact:** Decoration budget subordinate to clarity. Reject “personality clutter.”
- **Priority:** P1
- **Status:** Approved

### GOV-039

- **Category:** Visual — Brand lockup behavior
- **Source:** Article IV
- **Decision:** Split lockup is visual+IA law: mark and wordmark are separate destinations (`/brand` vs Today).
- **Reason:** Brand book ≠ daily OS.
- **Dependencies:** Navbar components, brand page, Today route.
- **Implementation Impact:** Do not merge targets; do not substitute decorative lockups that break split behavior.
- **Priority:** P0
- **Status:** Approved *(pending route ID bind — see GOV-012)*

---

## 5. Canonical Technical Decisions

### GOV-040

- **Category:** Technical — Multi-surface OS
- **Source:** Article II
- **Decision:** OS means shared primitives, shared memory, shared intelligence **across surfaces**. Clients are surfaces of one OS, not separate products with divergent models.
- **Reason:** Personal Life OS definition.
- **Dependencies:** Android, website, desktop, backend, AI contracts.
- **Implementation Impact:** Cross-client token/entity alignment required. Divergent domain models need ADR.
- **Priority:** P0
- **Status:** Approved

### GOV-041

- **Category:** Technical — Platform honesty
- **Source:** Article IV; Known risks
- **Decision:** `/m` capture ceiling is technical product lock. Native richness ≠ permission to expand `/m` into analytics/tools.
- **Reason:** Device honesty.
- **Dependencies:** Route guards, feature flags, Capacitor app scope.
- **Implementation Impact:** Enforce ceiling in routing and release checks.
- **Priority:** P0
- **Status:** Approved

### GOV-042

- **Category:** Technical — Auth/schema change control
- **Source:** Article IV
- **Decision:** Auth logic and DB schema are change-controlled: explicit human ask only.
- **Reason:** Safety.
- **Dependencies:** Migrations, Better Auth config, agent rules.
- **Implementation Impact:** CI/review culture + agent refusal. No opportunistic schema “cleanup” without ask.
- **Priority:** P0
- **Status:** Approved

### GOV-043

- **Category:** Technical — One linking system
- **Source:** Article IV
- **Decision:** Single linking system for life entities (graph integrity).
- **Reason:** Prevent fragmented graphs and duplicate relation models.
- **Dependencies:** DB relations, API link endpoints, AI entity resolution.
- **Implementation Impact:** New relations use existing link primitive; no second graph store.
- **Priority:** P0
- **Status:** Needs Discussion *(Constitution asserts “one” but does not name schema/API of that system)*

### GOV-044

- **Category:** Technical — Vault as ship gate
- **Source:** Article IV; Article XI
- **Decision:** Behavior change incomplete without vault update; constitutional amendment incomplete without vault + Bible changelog.
- **Reason:** Institutional memory.
- **Dependencies:** Docs workflow, PR checklist.
- **Implementation Impact:** Definition of Done includes vault paths.
- **Priority:** P0
- **Status:** Approved

### GOV-045

- **Category:** Technical — Data sovereignty ops
- **Source:** Article III §7; Article IV; Article VI
- **Decision:** No sell/share of lifelog; export+delete always available; journal body out of analytics.
- **Reason:** Trust + lawfulness of product posture.
- **Dependencies:** Export APIs, deletion cascades, analytics scrubbing, vendor DPAs.
- **Implementation Impact:** Backend and client must implement and regression-test export/delete; analytics allowlists exclude journal body.
- **Priority:** P0
- **Status:** Approved

### GOV-046

- **Category:** Technical — Destructive confirm
- **Source:** Article IV
- **Decision:** Destructive actions require confirmation on all platforms.
- **Reason:** Safety.
- **Dependencies:** Shared confirm pattern; Android dialogs; web modals.
- **Implementation Impact:** Shared interaction contract across clients.
- **Priority:** P0
- **Status:** Approved

---

## 6. Canonical AI Decisions

### GOV-047

- **Category:** AI — Role of AI
- **Source:** Article II; Known risks
- **Decision:** AIIMIN is **AI-first** meaning: intent expressed in natural language; structure is derived. AI-first does **not** mean chatbot is the product. Over-interpreting as chatbot-first is a named risk.
- **Reason:** Protect Life OS from collapsing into chat wrapper.
- **Dependencies:** Capture NLP, structuring pipeline, coaching, UI shell.
- **Implementation Impact:** Chat may exist as a surface; product is not “a chatbot.” Structure derivation is core.
- **Priority:** P0
- **Status:** Approved

### GOV-048

- **Category:** AI — Mixed-initiative partnership
- **Source:** Article V §4
- **Decision:** Mixed-initiative partnership — AI confidence bands gate action.
- **Reason:** Correctable inference; user agency.
- **Dependencies:** Confidence model, UI for bands, action gating rules.
- **Implementation Impact:** High-confidence may propose/act with easy undo; low-confidence asks or stays suggestion-only. Exact band thresholds **not defined in Constitution** (see Missing).
- **Priority:** P0
- **Status:** Needs Discussion *(bands/thresholds unspecified)*

### GOV-049

- **Category:** AI — Sparring over sycophancy
- **Source:** Article V §6; Known risks
- **Decision:** Sparring over sycophancy — challenge weak habits with data. Human Momentum without behavioral honesty (Life Score, sparring) is invalid.
- **Reason:** Honest coaching; agency after coaching.
- **Dependencies:** Coaching copy, Life Score, habit insights.
- **Implementation Impact:** AI tone: challenge with evidence, not empty praise or shame.
- **Priority:** P0
- **Status:** Approved

### GOV-050

- **Category:** AI — No therapist / clinical AI
- **Source:** Article III §2; Article VII
- **Decision:** No AI therapist, diagnostic, or clinical framing.
- **Reason:** Ethics/liability.
- **Dependencies:** Prompt policies, safety classifiers, store listings.
- **Implementation Impact:** System prompts and copy refuse clinical role. Redirect to human care when appropriate (policy detail outside Constitution).
- **Priority:** P0
- **Status:** Approved

### GOV-051

- **Category:** AI — Correctable inference
- **Source:** Article X; Article VII
- **Decision:** Inference must be correctable; silent wrongness forbidden.
- **Reason:** Trust.
- **Dependencies:** Edit chips, undo, confidence UI.
- **Implementation Impact:** Ship correction affordance with every structured inference.
- **Priority:** P0
- **Status:** Approved

### GOV-052

- **Category:** AI — Capture structuring
- **Source:** Article V §2; Article I
- **Decision:** AI may structure after raw capture; must not force structure before capture.
- **Reason:** Capture-first, structure-later.
- **Dependencies:** Mobile/web capture, NLP pipeline.
- **Implementation Impact:** Pipeline order: raw save → structure → user correction.
- **Priority:** P0
- **Status:** Approved

### GOV-053

- **Category:** AI — No “AI magic” patronage
- **Source:** Article IX
- **Decision:** Users must never feel patronized by “AI magic.”
- **Reason:** Respect + honesty.
- **Dependencies:** Microcopy, onboarding, empty states.
- **Implementation Impact:** Ban vague magical claims; explain in human terms what system did.
- **Priority:** P1
- **Status:** Approved

---

## 7. Canonical Motion Decisions

### GOV-054

- **Category:** Motion — Subordinate to calm/clarity
- **Source:** Article VIII; Article IX; Article X
- **Decision:** Motion must support calm, clarity, and agency — never confuse via decoration or create interrogation/shame theater.
- **Reason:** Emotional contract + anti-decoration confusion.
- **Dependencies:** Motion principles doc (P5 `09_MOTION_PRINCIPLES.md` — govern later); reduced motion (accessibility).
- **Implementation Impact:** Motion reviews ask: does this communicate meaning for capture relief / review clarity / coaching agency? Else cut.
- **Priority:** P1
- **Status:** Approved *(Constitution does not specify durations/easing — those live in Motion Principles)*

### GOV-055

- **Category:** Motion — Anti-nag / anti-casino
- **Source:** Article III §5; Article X
- **Decision:** Motion must not serve streak/shame casino or JITAI nag urgency theater.
- **Reason:** Hard refuse gamification casino; avoid nag loops.
- **Dependencies:** Notification animation, streak celebrations, XP.
- **Implementation Impact:** Celebratory motion OK for XP role; punitive/urgency loops non-canon.
- **Priority:** P1
- **Status:** Approved

---

## 8. Canonical Accessibility Decisions

### GOV-056

- **Category:** Accessibility — Cognitive load
- **Source:** Article I; Article IX; Article X
- **Decision:** Product exists for person under cognitive load. UX must not force complex mode/category/lab choices for simple capture. Progressive disclosure by stakes.
- **Reason:** Accessibility includes cognitive accessibility.
- **Dependencies:** Capture UX, IA density, lab modules.
- **Implementation Impact:** Cognitive a11y is constitutional, not optional polish.
- **Priority:** P0
- **Status:** Approved

### GOV-057

- **Category:** Accessibility — Capture operable when ready
- **Source:** Article VI
- **Decision:** Daily capture must be possible in under ~60 seconds when user is ready — implies operable, low-friction, interruptible capture path.
- **Reason:** Success metric.
- **Dependencies:** Mobile capture, keyboard/IME, offline, focus order.
- **Implementation Impact:** Critical path a11y and performance for capture is P0. Exact WCAG levels not stated here (see Missing / later A11y Principles governance).
- **Priority:** P0
- **Status:** Approved *(metric approved; WCAG numeric bar not in Constitution)*

### GOV-058

- **Category:** Accessibility — No surveillance feeling
- **Source:** Article IX; Article IV
- **Decision:** Users must never feel surveilled; journal privacy + export/delete support dignity and control.
- **Reason:** Emotional refuse + trust.
- **Dependencies:** Privacy UX, analytics, permissions copy.
- **Implementation Impact:** Permission and analytics copy must be honest and non-creepy; no dark-pattern tracking framing.
- **Priority:** P0
- **Status:** Approved

---

## 9. Canonical Performance Decisions

### GOV-059

- **Category:** Performance — Capture latency (product)
- **Source:** Article VI; Article X
- **Decision:** Capture speed is a first-class optimization target: under ~60 seconds end-to-end when ready; avoid configuration theater that slows capture.
- **Reason:** Success + optimize matrix.
- **Dependencies:** Client performance, offline, sync, AI async structuring.
- **Implementation Impact:** Structure/AI work must not block primary save. Measure time-to-saved-capture.
- **Priority:** P0
- **Status:** Approved

### GOV-060

- **Category:** Performance — Interaction economy
- **Source:** Article V §8; Article VI; Article VII
- **Decision:** Product performance includes interaction economy: median meaningful interactions/day toward ~5. Extra steps for same outcome = performance regression (human time).
- **Reason:** Compression as craft.
- **Dependencies:** IA, shortcuts, batching, Today density.
- **Implementation Impact:** Treat added daily taps as budgeted cost. Remove when adding.
- **Priority:** P0
- **Status:** Needs Discussion *(instrumentation definition pending)*

### GOV-061

- **Category:** Performance — Tomorrow lighter than today
- **Source:** Article I; Article VI
- **Decision:** System must reduce next-day planning friction via remembered context (memory/connection/coaching).
- **Reason:** Core existence outcome.
- **Dependencies:** Memory graph, plan surfaces, overnight/async jobs.
- **Implementation Impact:** Plan/Today should surface remembered context without re-entry.
- **Priority:** P0
- **Status:** Approved

---

## 10. Conflicts

| ID | Type | Detail | Recommendation |
|----|------|--------|----------------|
| CF-001 | Ambiguous wording vs product lock | Article IV: wordmark → **Today**. Always-on product lock: wordmark → **`/overview` (Today)**. Same intent, different identifiers. | **Bind** Today = `/overview` in a ratified GOV decision. Do not amend Constitution; add governance alias map. |
| CF-002 | Incomplete vs Non-Negotiables | Constitution says “destructive actions confirm”; Non-Negotiables add “branded” confirm. Not contradictory, but incomplete here. | When governing Non-Negotiables, elevate “branded confirm” as dependent canon. Constitution remains supreme on “must confirm.” |
| CF-003 | Duplicate thematic rules | Capture-first appears in Art I, III§8, V§2, VI, X. Intentional reinforcement, not conflict. | Keep one **canonical decision** (GOV-028) as implementation cite; treat repeats as emphasis. |
| CF-004 | Duplicate refuse | Clinical ban in Art III, IV, VII. | Cite GOV-006 as single implementation rule. |
| CF-005 | Potential tension | “AI-first” (Art II) vs “never patronized by AI magic” / “chatbot is not the product.” | Resolved by GOV-047: AI-first = NL intent + derived structure, not chat shell. |
| CF-006 | Potential tension | Native rich companion vs `/m` capture-only. | Explicitly resolved by Known risks + GOV-013/041: native ≠ `/m` expansion. |
| CF-007 | Potential tension | Sparring (challenge) vs never shame / never feel interrogated. | **Needs Discussion:** define sparring tone bounds so challenge ≠ shame/interrogation. |
| CF-008 | Weak / unmeasurable as written | “~60 seconds,” “~5 interactions,” “lighter tomorrow,” “meaningful interactions.” | Founder must ratify measurement specs or accept as directional product OKRs, not hard SLOs. |
| CF-009 | Missing definition | “One linking system” asserted without naming it. | Founder/tech lead name canonical link model before Android/web diverge further. |
| CF-010 | Missing definition | “AI confidence bands” without thresholds or UX states. | Define band table (e.g., auto / suggest / ask) in AI governance pass. |
| CF-011 | Hidden assumption | “One connected graph” assumes user wants unified life domains in one product. | Already product bet — OK; onboarding must not force unused domains (progressive disclosure). |
| CF-012 | Scalability | “Median interactions → ~5” may conflict with power-user Life OS breadth. | Clarify: compress **ceremony**, not capability. Power users deepen surfaces without raising mandatory daily taps. |
| CF-013 | Outdated risk (monitor) | GoodNotes handwriting PWA rejection is historical; risk of revival via stylus features on native. | Keep refuse; stylus capture OK if not handwriting-PWA product identity. |
| CF-014 | Weak idea for implementers | “Pattern language” in Art X optimize column — undefined in Constitution. | Pull definition from later P5 principles when those are governed; until then mark ambiguous. |
| CF-015 | Cross-doc authority | Constitution says Articles win over later principles; agents also have always-on rules. | Treat Constitution + founder product locks as co-equal for shipped product; if conflict, founder ADR. |

---

## 11. Missing Decisions

Constitution does **not** decide (must not invent as if it did):

| Gap ID | Missing canon | Why it matters | Suggested next governance source |
|--------|---------------|----------------|----------------------------------|
| M-001 | Bottom nav / primary destinations (Today, Notes, Documents, Family, Settings, etc.) | Teams cannot build IA from Constitution alone | P5 `06_INFORMATION_ARCHITECTURE_PRINCIPLES` + D-NAV + Prototype Studio |
| M-002 | Exact Today route ID (`/overview` vs other) | Brand lockup wiring | Founder bind → GOV-012 resolution |
| M-003 | Confidence band thresholds & UI states | AI action gating | AI Principles / Non-Negotiables + founder |
| M-004 | Named linking system (schema/API) | Graph integrity enforcement | DB/API notes + ADR |
| M-005 | Life Score formula / inputs | Honesty vs vanity XP | Product Bible / gamification docs |
| M-006 | Telemetry definition of “meaningful interaction” | Success/failure metrics | Analytics governance |
| M-007 | Capture “ready” definition & timing method | 60s success metric | UX research + instrumentation |
| M-008 | WCAG level, contrast numbers, target sizes | A11y engineering bar | P5 `11_ACCESSIBILITY_PRINCIPLES` |
| M-009 | Motion durations/easing/reduced-motion details | Motion implementation | P5 `09_MOTION_PRINCIPLES` |
| M-010 | Notification taxonomy | Interruptibility vs nag | Interaction principles + Non-Negotiables |
| M-011 | What “pattern language” means operationally | Art X optimize column | Component/IA principles |
| M-012 | Sparring tone guide (challenge ≠ shame) | Art V vs Art IX tension | Content/microcopy principles |
| M-013 | Export formats & delete cascade scope | Trust ops | Privacy/API specs |
| M-014 | Desktop vs web vs Android surface matrix for each primitive | OS shared primitives claim | Monorepo architecture + P1 |
| M-015 | Monetization / waitlist / growth vs social-refuse | Growth without social comparison | Product / launch docs |
| M-016 | Meds/allergies/PIN inference bans | Appears in Non-Negotiables, not Constitution | Govern Non-Negotiables next |

---

## 12. Questions for Founder

1. Confirm **Today ≡ `/overview`** for wordmark lockup (resolve CF-001 / GOV-012).
2. Are **~60s capture** and **~5 median interactions** hard SLOs or directional OKRs?
3. What is the **named one linking system** (tables/APIs) for GOV-043?
4. Define **AI confidence bands** (names, thresholds, allowed actions).
5. Ratify **sparring vs shame** boundary — written tone examples?
6. Is **Life Score** formula already locked elsewhere — should Constitution governance point to it as dependent canon?
7. For **native vs `/m`**, any founder exception path ever, or absolute forever?
8. Does **“sell or share lifelog data”** forbid all aggregators (even anonymized benchmarks), or only identifiable lifelog?
9. Should **GOV decisions with Status: Approved** become enforceable PR checklist items immediately?
10. Next artifact to govern: **Non-Negotiables (18)** or **Product Philosophy (02)** or **IA Principles (06)**?

---

## 13. Recommended Governance Decisions

Board recommends founder ratify the following package:

| Rec ID | Action | Effect |
|--------|--------|--------|
| REC-001 | Ratify all **Status: Approved** GOV items as product canon | Implementation may cite GOV-IDs without re-reading Constitution |
| REC-002 | Open **Needs Discussion** items (GOV-012, 021, 043, 048, 060) in founder session | Unblock IA, telemetry, AI gating, graph |
| REC-003 | Publish **Route Alias Map**: Today = `/overview` | Close CF-001 without Constitution edit |
| REC-004 | Publish **AI Confidence Band Spec** as dependent canon | Close M-003 / GOV-048 |
| REC-005 | Publish **Linking System Spec** pointer | Close M-004 / GOV-043 |
| REC-006 | Adopt **Ship Kill Checklist** from GOV-022 + Art III refuse list | PR/product review gate |
| REC-007 | Adopt **Feature Intake**: human problem required (GOV-023) | Stop feature-without-problem |
| REC-008 | Adopt **Emotional Triad QA**: relief / clarity / agency (GOV-030) | UX acceptance |
| REC-009 | Enforce **`/m` ceiling** in release checks (GOV-013) | Prevent analytics creep |
| REC-010 | Enforce **journal body ∉ analytics** (GOV-016) | Privacy |
| REC-011 | Keep Constitution **FROZEN**; amend only via Art XI | Prevent identity drift |
| REC-012 | Next P7 pass: govern `18_NON_NEGOTIABLES.md` then `06_INFORMATION_ARCHITECTURE_PRINCIPLES.md` | Fill M-001, M-016 |
| REC-013 | Clarify **compression = ceremony budget**, not capability ceiling (CF-012) | Power-user scalability |
| REC-014 | Agents cite **GOV-IDs** in PRs touching identity, `/m`, palette, clinical, social, capture | Operationalize governance |

---

## 14. Final Governance Score

| Dimension | Score (/10) | Notes |
|-----------|-------------|-------|
| Identity clarity | 9 | Strong is/is-not/refuse |
| Enforceability | 7 | Many rules clear; metrics/bands/linking underspecified |
| Cross-platform readiness | 6 | OS claim strong; surface matrix missing |
| AI readiness | 7 | Role clear; confidence bands incomplete |
| Conflict hygiene | 8 | Few true contradictions; ambiguities manageable |
| Metric rigor | 5 | Tilde metrics need instrumentation decisions |
| Amendment process | 9 | Art XI clear and agent-safe |
| Completeness for build-without-reread | 6 | Identity yes; IA/nav/components no |

### Final Governance Score: **72 / 100**

**Interpretation:** Constitution is **strong identity law** and ready to be cited as supreme product canon for refuse lists, emotional contract, capture doctrine, `/m` ceiling, palette, clinical/social bans, and amendment process. It is **not yet sufficient alone** for navigation, component inventory, confidence thresholds, or telemetry SLOs. Score will rise after founder closes Needs Discussion items and P7 governs IA + Non-Negotiables.

---

## Evidence (governance process)

- Source read in full: `AIIMIN GENESIS/P5 Constitution/01_AIIMIN_CONSTITUTION.md` (Articles I–XI + Purpose/Reasoning/Evidence/Dependencies/Future impact/Tradeoffs/Known risks/Related).
- Source **not modified**.
- Decisions extracted as GOV-001…GOV-061.
- Status: **passed** (governance extraction complete). Founder ratification of Status fields: **pending**.
