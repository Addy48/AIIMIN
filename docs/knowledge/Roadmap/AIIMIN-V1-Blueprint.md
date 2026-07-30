---
authority: engineering
derived_from: Genesis P5/P7/P8/P9 · UX-Architecture v1.0 · UX-Intelligence v1.0 · Program-0
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-30
can_override_genesis: false
knowledge_layer: KL-BUILD
graph_role: hub
note_type: NT-BLUEPRINT
program: V1-Product-Blueprint
tags:
  - type/hub
  - domain/product
  - status/living
---

# AIIMIN V1 — Product Blueprint (single source for implementation)

> [!important] Authority
> This document **expresses** Genesis (P1–P9). It **cannot amend** Genesis (`can_override_genesis: false`).
> Conflict order: **P8 → P9 Phase 1 → Phase 2 → Phase 3 → Phase 4 → UX Architecture → this Blueprint**.
> Where this Blueprint proposes something Genesis does not already permit, it is tagged **`[ADR REQUIRED]`** and MUST NOT be built until the Founder issues an ADR in `10_DECISIONS/`.

> [!abstract] Purpose
> Everything needed to derive the PRD, UX spec, Design System, DB schema, API spec, engineering docs, test plans, and roadmap — **without another discovery phase**.

**Product:** AIIMIN — Personal Life OS · *One screen. Every day.* · Brand frame **Human Momentum**
**Owner:** Aaditya Upadhyay
**Blueprint version:** 1.0 · **Date:** 2026-07-30

---

## 0. How to use this document

### 0.1 Reading order for an implementing agent

| Step | Read | Why |
|------|------|-----|
| 1 | `docs/knowledge/00_HOME.md` | Boot, blockers |
| 2 | `docs/knowledge/15_MEMORY/Current-Context.md` | Today's focus + V1 backlog |
| 3 | `Maps of Content/Genesis.md` → `Genesis/` | Immutable law (read-only) |
| 4 | **This file** | Product blueprint |
| 5 | Only the feature note + source files being changed | Token discipline |

### 0.2 Terminology lock (P9 §1)

| Term | Meaning | Never use as |
|------|---------|--------------|
| **Catch** | Interaction verb — system receives a Pulse | synonym for Capture pipeline |
| **Capture** | P8 Ch06 pipeline / Ch02 outcome | interaction verb |
| **Settle** | Truth committed, acknowledged | loading finish |
| **Hold** | Pending, not yet true (e.g. queued sync) | success styling |
| **Offer** | AI proposes structure | auto-apply |
| **Adjust** | Human corrects an Offer | AI self-correct |
| **Commit** | Human accepts | silent write |
| **Veil** | Elevated assurance gate for irreversible acts | generic modal |
| **Hand-back** | Undo / return control | toast only |
| **Knock** | Earned attention request | push spam |
| **Drift** | Unsettled Pulse preserved on exit | discard |

### 0.3 Status vocabulary used throughout

`EXISTS` (shipped in repo) · `PARTIAL` · `PLANNED` (V1 scope) · `[ADR REQUIRED]` · `POST-V1`

### 0.4 What V1 means for this product

Founder mandate: **V1 is not an MVP.** V1 must be complete enough that the next update can be delayed without the product feeling unfinished. No corner cutting. Features are cut only when Genesis forbids them or a platform API makes them impossible.

### 0.5 Research note

Mobbin MCP (`user-Mobbin`) is wired but returned `Mobbin MCP requires a paid plan` on 2026-07-30. All external-pattern guidance in this Blueprint therefore derives from:
- Genesis **P3 UX Intelligence** and **P4 Visual Intelligence** (already contain competitive/visual audits)
- `frontend-design` skill anti-slop rules
- Platform guidance (Android Material 3 / Health Connect / UsageStats; iOS HIG / HealthKit) as cited in feature chapters

When a Mobbin paid seat exists, re-run: onboarding personalization flows, finance transaction rows, calendar conflict UI, speaking-practice scorecards, contact detail screens, permission-rationale sheets. Findings must be adapted, never copied (Genesis anti-slop law).

---

## 1. Vision, philosophy, personality

### 1.1 Mission

Give one human a single honest surface for their whole life — capture what happened, see what it means, act on what matters — without ads, shame, or surveillance.

### 1.2 The twenty-year truths (P5 `00_EXECUTIVE_SUMMARY.md`, verbatim intent)

1. Personal Life OS — **one graph**, not twelve apps
2. Human expresses intent; system structures — **capture first**
3. One primitive, many surfaces
4. **Mixed-initiative AI** — acts, suggests, asks; never clinical, never silently wrong
5. Trust — export, delete, encryption, no dark patterns, no social feed
6. Identity locked — Human Momentum; burnt orange; mark→`/brand`, wordmark→Today
7. Calm command surfaces; motion only communicates
8. Device roles honest — phone web captures; desktop commands; native is a **rich companion**, not a crippled `/m`
9. Honesty over vanity — Life Score honest; **shame is never retention**
10. Every feature justifies a human problem + compression + the kill list

### 1.3 What AIIMIN will never become (P5 Article III)

Social network · clinical/diagnostic device · single-domain app · form builder · gamification casino · purple SaaS template · cream editorial reader · GoodNotes clone · lifelog data broker · capture hidden behind mode pickers.

### 1.4 Personality

| Dimension | AIIMIN | Not AIIMIN |
|-----------|--------|------------|
| Voice | Plain, exact, adult | Cute mascot, hype, therapy-speak |
| Posture | Steward of your data | Owner of your attention |
| Feedback | Honest number + one next action | Confetti for existing |
| Failure | "Sync pending — 3 items held" | "Oops! Something went wrong" |
| Encouragement | Recovery path | Guilt streak |
| Density | Calm to read, fast to write | Dashboard landfill |

### 1.5 Emotional design — the Depth metaphor `[ADR REQUIRED for hero form]`

Founder concept: the user is **in water**. Do nothing → sink. Execute → rise → break surface → glide.

This is the emotional expression of **Human Momentum** and of the honest Life Score. It replaces the generic "big number ring" hero template (`frontend-design`: avoid hero-metric template; P8: Today is not a collage).

| Depth state | Entry condition (see §8.1) | Visual | Copy tone |
|-------------|---------------------------|--------|-----------|
| `depth.submerged` | 0 of daily minimum met **and** past 11:00 local | Figure low, cool neutral field, slow ambient drift | "One action lifts you." — never "you failed" |
| `depth.rising` | 1 of 3 minimum met | Figure ascends; light gradient upward | "Two more to surface." |
| `depth.surface` | daily minimum met (3 of 3) | Head at waterline; accent `#ff6b35` line = waterline | "Surfaced. Day is honest." |
| `depth.glide` | minimum met **and** 5+ of last 7 days met | Calm horizon, near-still motion | "Momentum holding." |
| `depth.recover` | streak broken yesterday | Figure with visible handhold + one micro-action | "Yesterday broke. Today starts." |

**Laws binding the hero (non-negotiable):**
- Motion is **After-Settle** only (P8 Ch12) — depth changes *after* the write is true, never as a loading animation.
- `prefers-reduced-motion` → depth is a static position + text state. Meaning must survive with zero animation (P8 Ch12 "Meaning Without Animation").
- No shame semantics in `submerged` (INV-S-11, C-UX-09).
- The figure is an **abstract silhouette or line form** — no stock photography, no cartoon mascot (P5 forbidden list).
- Depth is **derived from the same Life Score inputs** — it may not invent a second score (C-UX-13, D05).

### 1.6 Interaction philosophy

- **Catch → Settle before organization** (IP-11). Nothing blocks a write.
- **Chips beat forms; infer then correct** (IP-12).
- **One Anchor per moment** (IP-10) — one focal task; nothing self-promotes into focus.
- **OS chrome wins gestures; AIIMIN wins verbs** (IP-14) — never reinvent back/swipe-back.
- **Gesture is never the only path** (IP-16 / P8-R-147/148) — every swipe has a tap/keyboard equivalent.
- **Progressive disclosure by stakes** (IP-06) — a habit tick is one tap; deleting a family document enters Veil.

### 1.7 Trust philosophy

The user must be able to answer four questions at any time, in under 30 seconds, without contacting support:

1. What does AIIMIN hold about me?
2. Who/what touched it, and when?
3. How do I get it out?
4. How do I make it stop?

Chapter 12 designs the machinery. This is a **product surface**, not a legal page.

### 1.8 Privacy philosophy (P8 Ch15)

Person **owns** life entities; AIIMIN is **steward** (P8-R-215). Export always available (217). Delete is real removal (218). Journal-class private reflection is excluded from analytics (219). High-sensitivity meanings are never inferred (223/224). Non-explicit signal collection is opt-in, purpose-clear, revocable (221). No selling or sharing lifelog data, ever (216).

### 1.9 AI philosophy (P8 Ch07/Ch17)

Five roles only — **Router, Inferencer, Analyzer, Coach, Composer**. Confidence bands govern behavior: ≥70% auto-fill (correctable), 40–70% pre-fill + confirm, <40% ask, safety/legal never inferred. Coaching never precedes persistence. Prediction never creates permission (P8-R-254). Automation failure never presents as success (265). Uncertainty **fails closed** to ask (266).

---

## 2. Product architecture — the whole ecosystem

### 2.1 Surface map

```text
┌───────────────────────── PUBLIC ─────────────────────────┐
│ aiimin.in (Vercel)                                        │
│  /            waitlist / marketing (WAITLIST_MODE)        │
│  /brand       Human Momentum manifesto  ← logo mark       │
│  /privacy /terms /security /data-deletion /about /contact  │
│  /login /auth/callback /verify-email                      │
└───────────────────────────────────────────────────────────┘
                │ one account (user_id) · one policy
                ▼
┌──────────── PRODUCT SURFACES (S-*) ─────────────────────┐
│ S-DESKTOP  aiimin.in  desktop/tablet  — FULL Life OS     │
│ S-M        aiimin.in/m  phone web     — CAPTURE ONLY     │
│ S-NATIVE   Play Store in.aiimin.app   — RICH COMPANION   │
│ S-COMMAND  ⌘K palette (desktop/tablet)                   │
│ S-AMBIENT  widgets, notifications, quick settings tiles  │
└──────────────────────────────────────────────────────────┘
                │ HTTPS · session cookie / bearer
                ▼
┌──────────────── API (api.aiimin.in) ────────────────────┐
│ Hono router (api/index.js) · 30 route modules            │
│ /api/auth/*  Better Auth        /api/mobile/*  native     │
│ /api/<domain>/*  Life OS        /api/cron/*   jobs        │
└──────────────────────────────────────────────────────────┘
                ▼
┌──────────────── DATA & SERVICES ────────────────────────┐
│ Supabase PostgreSQL (RLS)   · Redis (Upstash) rate/cache │
│ Object storage (vault docs, resumes)                     │
│ AI providers: Gemini · Groq · OpenRouter · NVIDIA         │
│ Email: Resend  ·  Google APIs: Calendar/Tasks/Drive/People│
└──────────────────────────────────────────────────────────┘
```

### 2.2 Capability ceilings (P9 Phase 4 — LOCKED)

| Surface | ID | May do | MUST NOT do |
|---------|-----|--------|-------------|
| Desktop/tablet web | `S-DESKTOP` | Full Life OS: all domains, analytics, billing, family vault, reports, settings | — |
| Phone web | `S-M` | `Catch → Settle | Hold | Drift`; account lite | Analytics, insights, pomodoro, focus tools, Review/Coach surfaces, Life Score display, **any** mutation flow beyond capture, Structure AI Offers (CS-13) |
| Native Android | `S-NATIVE` | Rich companion: Today, capture, journal, notes, vault, habits, focus, discipline, goals-lite, **health**, **money capture**, **English drills**, settings | Be treated as `/m` (CS-14); claim desktop parity it does not have |
| Command palette | `S-COMMAND` | Navigate, capture, search, run actions | Become a second nav system |
| Ambient (widgets/notifications) | `S-AMBIENT` | Bounded entry into an existing surface | Orphan chrome; own IA |

**`/m/score` is NULL** — removed by Founder Decision D05. Deep links to it route to Today.

### 2.3 Device detection contract (EXISTS — `DeviceGate.jsx`)

| Condition | Result |
|-----------|--------|
| Phone UA **or** viewport < 768 and not iPad | → `/m` |
| iPad or 768–1099 | Full OS, TabRail, ≥44px targets |
| ≥1100 | Full OS, masthead |
| `?forceDesktop=1` | Bypass (support/debug) |

### 2.4 Client ownership rules (Monorepo law)

| Client | Path | Branch | Never mixed with |
|--------|------|--------|------------------|
| Web Life OS | `frontend/` (excl. `components/mobile/`) | `main` | native, Capacitor |
| Capacitor `/m` shell (legacy) | `frontend/android/`, `frontend/src/components/mobile/` | `feat/mobile-capture-capacitor` | web, native |
| Native Android V2 | `native-android/`, `server/routes/mobile.js` | native feature branch | web, Capacitor |

### 2.5 Data flow — one write, many reads

```text
Human utterance / tap
   │
   ├── (S-M / S-NATIVE offline) → local store (IndexedDB / Room) → Hold
   │                                  │ WorkManager / queue
   ▼                                  ▼
POST /api/<domain>            POST /api/mobile/sync/batch (Idempotency-Key)
   │                                  │
   └────────────► Postgres (life entities, RLS per user_id) ◄──┘
                        │
        ┌───────────────┼────────────────┬──────────────┐
        ▼               ▼                ▼              ▼
   Life Score      Life Graph edges   Derived reads   AI pipeline
   (0–98)          (typed links)      (Reports)       (Router→Coach)
        └──────────────► Today (Depth + Open Loops) ◄────────┘
```

### 2.6 Non-negotiable system invariants

| ID | Invariant |
|----|-----------|
| SYS-01 | One `user_id` across web, `/m`, native. No second account model. |
| SYS-02 | Backend is the **sole authority** for entitlement/tier. Clients never grant features. |
| SYS-03 | Every mutation from a mobile client carries an idempotency key. |
| SYS-04 | Every sensitive scope has a row in the consent registry before first use (§12). |
| SYS-05 | Life Score is API-computed; clients never compute a competing score. |
| SYS-06 | Deletion and export behave identically regardless of originating surface. |
| SYS-07 | No client stores raw SMS bodies or raw contact books server-side (§8.6, §8.7). |
| SYS-08 | Offline writes never display as Settled until the server confirms (Hold semantics). |

---

## 3. Complete information architecture

### 3.1 Domain registry (Genesis-canonical + V1 additions)

| Domain | Canonical status | V1 surfaces | Change in V1 |
|--------|------------------|-------------|--------------|
| DOM-ACCESS | KEEP | `/`, `/login`, `/onboarding`, pending gate | Onboarding REDESIGN (§7) |
| DOM-PUBLIC | KEEP | `/brand`, legal | Storage ledger updated for new data types |
| DOM-DAY | REDESIGN | `/overview` (Today), native Home | **Depth hero + Open Loops** |
| DOM-CAPTURE | KEEP | Logger, Journal, Notes, Daily Log, `/m` | Voice capture added (native) |
| DOM-EXEC | KEEP | Habits, Calendar, Focus, Discipline | Calendar two-way; Discipline REDESIGN |
| DOM-PLAN | KEEP | Goals (+ Identity merged) | Reverse-planner |
| DOM-MONEY | KEEP | Finance | **Lend/borrow ledger, UPI ingest, subscriptions, bills** |
| DOM-FAMILY | KEEP | Family (+ Documents nested) | **People model, doc expiry, vault lock, Documents OS viewer** |
| DOM-CAREER | KEEP | `/placements` | English↔interview linkage |
| DOM-CONTEXT | KEEP | Sports | unchanged |
| DOM-GROWTH | PARTIAL | Today score, Reports | Movement + sleep wired into score |
| DOM-DERIVED | KEEP | Reports (Insights merged) | Graph-cited insights |
| DOM-LEARN | FUTURE→**V1 core** | `/lab` | **English system (AEI) promoted** `[ADR REQUIRED]` |
| DOM-CONFIG | MERGE | `/account` (Settings merged) | **Privacy dashboard, consents, font scale, Dim mode** |
| DOM-SYSTEM | KEEP | ⌘K, Notifications | Global search = palette; Notifications REDESIGN |
| DOM-NATIVE | KEEP | native screens | Health, Money capture, English drills added |
| DOM-DEV | REMOVE from user IA | design-lab, seed-data | Hidden behind dev flag |

### 3.2 IA additions requiring Founder ADR

| # | Proposal | Why needed | Genesis tension | Recommended resolution |
|---|----------|------------|-----------------|------------------------|
| ADR-B1 | **People** as a first-class entity with its own detail surface | Contacts must be real humans linked to money/calendar/docs (Founder ask) | BR-03 bans new top-level alias hubs; People is not in the banned list but is not in the inventory either | **Extend DOM-FAMILY** → domain label "Family & People", route stays `/family`, People becomes the first tab and the target of person deep links. **No new top-level route.** |
| ADR-B2 | **English / AEI** as a named module with its own progress model | Founder flagship | DOM-LEARN is marked FUTURE/Experimental | Promote **inside `/lab`** as `Lab → English` with deep link `/lab?module=english`. No `/voice` top-level route. |
| ADR-B3 | **Soft Monotone dark skin** (see §4.3) | User feedback: current dark hurts eyes | Palette LOCKED by P8 Ch11 | Add **neutral ramp tokens only** (surface/border/text). Accent `#ff6b35`, done `#10b981`, muted `#6b7280` unchanged. Requires ADR because dark canvas/card hexes are named in P8. |
| ADR-B4 | **Health signals** (steps, distance, screen time, sleep) on Today | Founder ask | BR-03 bans a Health hub | Health is **signal only**: Day metrics on Today + family health records in Family. **No Health route.** |
| ADR-B5 | **Documents viewer** (PDF/DOCX/XLSX) | "app should open files" | BR-03 bans a Documents hub | Viewer is a **component invoked from Family Documents, Notes attachments, and Career resumes**. No `/documents` route. |
| ADR-B6 | **Lend/borrow ledger** | Founder ask | none — Finance domain | No ADR needed; documented for completeness. `money_lent` table already EXISTS. |

### 3.3 Complete route table (V1 target)

| Route | Surface | Min tier | Notes |
|-------|---------|----------|-------|
| `/` | Public | — | Waitlist when `REACT_APP_WAITLIST_MODE=true`, else redirect |
| `/brand` | Public | — | Logo mark target (LOCKED) |
| `/privacy` `/terms` `/security` `/data-deletion` `/about` `/contact` | Public | — | Legal |
| `/login/*` | Access | — | OS-ID or email + PIN, Google |
| `/auth/callback` | Access | — | OTT exchange |
| `/verify-email` | Access | — | Required before product |
| `/onboarding` | Access | — | 12 steps (§7) |
| `/overview` | Day | explore | **Today** — wordmark target |
| `/journal` | Capture | explore | Modes |
| `/notes` | Capture | explore | Drive watch, attachments |
| `/calendar` | Exec | explore | Two-way Google |
| `/habits` | Exec | core | Heatmap |
| `/focus` | Exec | core | Pomodoro + calendar write-back |
| `/discipline` | Exec | core | Streak, urge |
| `/goals` | Plan | core | Pipeline + reverse planner (Identity merged) |
| `/finance` | Money | core | Overview/Analytics/Accounts/Transactions/Budgets/Wealth/**Lending** |
| `/family` | Family | pro | **People**/Members/Documents/Insurance/Health/Vehicles/Finance/Reminders |
| `/placements` | Career | core | Kanban/Timeline/Resources/Resumes/Trajectory |
| `/sports` | Context | core | Cricket/Football/Basketball/F1 |
| `/lab` | Learn | core | **English (AEI)** + cognitive/interview modules |
| `/reports` | Derived | explore | Snapshot (core), PDF (pro), Interactive (elite) |
| `/insights` | Derived | explore | **Redirect → `/reports`** (BR-04) |
| `/identity` | Plan | explore | **Redirect → `/goals?view=arc`** (BR-04) |
| `/account` | Config | explore | Profile/Personalization/**Privacy**/Data/Subscription/Security/Support |
| `/settings` | Config | explore | **Redirect → `/account`** (BR-05) |
| `/m` | Capture (phone web) | explore | Capture only |
| `/m/account` | Config lite | explore | Lite only |
| `/m/score` | — | — | **REMOVED** (D05) → redirect `/overview` |
| `/design-lab` `/seed-data` | Dev | — | Dev flag only; excluded from nav/search/sitemap |

### 3.4 Navigation model

**Desktop/tablet (S-DESKTOP)**

```text
┌ masthead ─────────────────────────────────────────────────────┐
│ [mark→/brand]  AIIMIN(→/overview)   pinned nav (1–12)  ⌘K  🔔 ▾│
└───────────────────────────────────────────────────────────────┘
```
- **Brand lockup split is LOCKED**: mark → `/brand`; wordmark → `/overview`.
- Free-pin registry, max 12; **Today always pinned and first**.
- Overflow = "More" menu listing all permitted domains grouped by domain family.
- Sidebar MUST NOT become the canonical primary nav (BR-06).
- Utility cluster: Command palette, Notifications, Account.

**Tablet:** left TabRail (icons + labels on expand), 44px minimum targets.

**Phone web `/m`:** bottom nav = **Capture · Account** only (no Score — D05).

**Native (S-NATIVE) — V1 tabs:**

| Tab | Contents |
|-----|----------|
| **Today** | Depth, minimum, Open Loops, habits strip, agenda, health chips, quick capture |
| **Capture** | Logger, Journal, Notes, Voice, receipt/doc scan |
| **Money** | Transactions, UPI review queue, Lending, budgets (read + capture) |
| **Practice** | English drills (AEI), Focus timer, Discipline toolkit |
| **More** | Vault, People/Family, Goals-lite, Calendar, Settings, Account |

Native bottom nav = 5 items max; **no center FAB as the only primary action** (anti-slop); back respects platform predictive back.

### 3.5 Surface inventory — screens, sheets, modals, overlays

Legend: **P** page/route · **T** tab within page · **S** bottom sheet · **D** dialog (Veil-capable) · **O** overlay · **W** widget

#### Access & public
| ID | Type | Name | Notes |
|----|------|------|-------|
| A-01 | P | Waitlist landing | Hero, personas, 4 tiers, journey, FAQ, signup |
| A-02 | P | Brand book | Manifesto, pillars, storage ledger, legal links |
| A-03 | P | Login | OS-ID/email → PIN; Google; forgot |
| A-04 | O | OS-ID resolve hint | Live availability/resolution |
| A-05 | P | Verify email | Resend, change email |
| A-06 | P | Pending access | Waitlist approved-not-yet gate — **not** an error |
| A-07 | P | Onboarding | 12 steps (§7) |
| A-08 | S | Permission rationale | One per sensitive scope, before OS dialog |
| A-09 | D | Sign out | Confirm if unsynced items exist |

#### Today (DOM-DAY)
| ID | Type | Name |
|----|------|------|
| T-01 | P | Today |
| T-02 | O | Depth hero (state machine §8.1) |
| T-03 | O | Daily minimum tracker (3 slots) |
| T-04 | O | Open Loops carousel |
| T-05 | S | Universal Logger sheet |
| T-06 | O | Habits strip |
| T-07 | O | Command timeline (day spine) |
| T-08 | O | Health chips (steps/km/screen/sleep) |
| T-09 | O | Weekly insight card (Coach — Knock rules apply) |
| T-10 | O | Life Score card (D05 primary location) |
| T-11 | S | Widget arrangement sheet |
| T-12 | O | Micro-task |
| T-13 | O | Recovery card (after break) |

#### Capture
| ID | Type | Name |
|----|------|------|
| C-01 | S | Logger (free text → Router) |
| C-02 | O | Offer stack (AI structure proposal + confidence + provenance) |
| C-03 | S | Correction chips |
| C-04 | P | Journal list |
| C-05 | P | Journal editor (modes: Today, Free, CBT, WWW, Morning Pages, Weekly Review) |
| C-06 | P | Notes list |
| C-07 | P | Note editor (+ attachments, links, anchors) |
| C-08 | S | Voice capture (native) |
| C-09 | S | Scan (receipt/document, native) |
| C-10 | P | Daily log form |
| C-11 | S | Drift restore ("unsaved Pulse kept") |

#### Execution
| ID | Type | Name |
|----|------|------|
| E-01 | P | Habits |
| E-02 | S | Habit editor |
| E-03 | O | Yearly heatmap |
| E-04 | P | Calendar (Month/Week/Day/Agenda) |
| E-05 | S | Event editor |
| E-06 | D | Conflict resolver (Google vs AIIMIN) |
| E-07 | O | Sync status pill |
| E-08 | P | Focus room |
| E-09 | S | Focus intent picker |
| E-10 | P | Discipline |
| E-11 | S | Urge surfing timer |
| E-12 | S | Slip log (recovery tone) |

#### Planning
| ID | Type | Name |
|----|------|------|
| P-01 | P | Goals (Pipeline / Grid / Archive) |
| P-02 | S | Goal editor + deadline picker |
| P-03 | T | Life Arc (merged Identity) |
| P-04 | O | Reverse planner (goal date → weekly targets) |

#### Money
| ID | Type | Name |
|----|------|------|
| M-01 | T | Finance overview |
| M-02 | T | Analytics |
| M-03 | T | Accounts |
| M-04 | T | Transactions |
| M-05 | T | Budgets |
| M-06 | T | Wealth |
| M-07 | T | **Lending** (lent / borrowed / settled) |
| M-08 | S | Transaction editor |
| M-09 | S | Lend editor + repayment schedule |
| M-10 | P/S | **UPI review queue** (native) |
| M-11 | S | Statement import (upload → parse → confirm) |
| M-12 | O | Subscriptions list |
| M-13 | O | Bills due |
| M-14 | S | What-if simulator (pro) |
| M-15 | D | Delete transaction (Veil if reconciled) |

#### Family & People
| ID | Type | Name |
|----|------|------|
F-01 | T | **People** (all persons, roles) |
| F-02 | P | Person detail (linked money/docs/calendar/notes) |
| F-03 | S | Contact import picker |
| F-04 | D | Merge duplicates |
| F-05 | T | Documents (nested — depth 3 allowed) |
| F-06 | O | **Document viewer** (PDF/DOCX/XLSX) |
| F-07 | T | Insurance |
| F-08 | T | Health records |
| F-09 | T | Vehicles |
| F-10 | T | Family finance |
| F-11 | T | Reminders |
| F-12 | T | Emergency contacts |
| F-13 | D | Vault unlock (PIN/biometric) |
| F-14 | S | Visibility/sharing rules |
| F-15 | O | Emergency card (export) |

#### Learning (Lab) — English system
| ID | Type | Name |
|----|------|------|
| L-01 | P | Lab hub |
| L-02 | P | **English home** (AEI, skill radar, prescription) |
| L-03 | S | Session runner (Spark / Deep / Debate / Shadow / Word / Accent) |
| L-04 | S | Scorecard (metrics + transcript + upgrade words) |
| L-05 | O | Word bank |
| L-06 | O | Progress graph (AEI over time) |
| L-07 | S | Placement test |
| L-08 | O | Certificate export (pro) |
| L-09 | P | Other Lab modules (typing, aptitude, STAR, ATS, flashcards, system design, decisions, reading, personality) |

#### Derived / intelligence
| ID | Type | Name |
|----|------|------|
| R-01 | P | Reports hub |
| R-02 | T | Ivory Snapshot (core) |
| R-03 | T | Life OS Review PDF (pro) |
| R-04 | T | Patterns / correlations (pro) |
| R-05 | T | Interactive Intelligence (elite) |
| R-06 | O | Provenance drawer ("why this insight") |

#### Config
| ID | Type | Name |
|----|------|------|
| G-01 | P | Account hub |
| G-02 | T | Profile & OS-ID |
| G-03 | T | Personalization (theme, Dim, font scale, density, pins, persona, widgets) |
| G-04 | T | **Privacy & data** (consents, dashboard, activity log, export, wipe, delete) |
| G-05 | T | Connections (Google Calendar, Drive, People; Health; SMS; devices) |
| G-06 | T | Subscription (4 tiers) |
| G-07 | T | Security (PIN, biometric, sessions) |
| G-08 | T | Notifications (types, quiet hours) |
| G-09 | T | Support & legal |
| G-10 | D | Delete account (Typed Veil) |
| G-11 | D | Wipe life data (Typed Veil) |

#### System
| ID | Type | Name |
|----|------|------|
| S-01 | O | Command palette (⌘K) — nav, capture, search, actions |
| S-02 | O | Notification center |
| S-03 | S | Notification detail |
| S-04 | O | Global search results (graph query) |
| S-05 | O | Offline banner |
| S-06 | O | Sync/Hold tray ("3 items pending") |
| S-07 | O | Undo/Hand-back toast |
| S-08 | D | Generic Veil confirm |
| S-09 | O | Update available (native) |
| W-01 | W | Home widget: Life Score + one-tap habit |
| W-02 | W | Home widget: Capture |
| W-03 | W | Home widget: English drill |

### 3.6 Depth and hierarchy rules

- Default depth **2** (route → tab). Family Documents may reach **3** (route → tab → doc).
- Person detail (F-02) is depth 3 under Family; reachable directly by deep link.
- Document viewer is an **overlay**, not a route — it does not add depth.
- No user-facing surface may exceed depth 3 in V1.

### 3.7 Deep link table

| Link | Target | Fallback |
|------|--------|----------|
| `aiimin.in/overview` | Today | Login → Today |
| `aiimin.in/family?person=<id>` | Person detail | Family → People |
| `aiimin.in/finance?tab=lending&loan=<id>` | Lend detail | Finance overview |
| `aiimin.in/lab?module=english` | English home | Lab hub |
| `aiimin.in/lab?module=english&session=spark` | Session runner | English home |
| `aiimin.in/calendar?date=YYYY-MM-DD` | Day view | Calendar month |
| `aiimin.in/reports?report=<id>` | Report | Reports hub |
| `aiimin.in/account?section=privacy` | Privacy tab | Account |
| `aiimin.in/m` | Capture | Login |
| `aiimin.in/m/score` | **→ `/overview`** | Today (D05) |
| notification payload `target` | Any of the above | Today |

Native intent filter: `https://aiimin.in/app/...` + custom scheme `aiimin://` mapped to the same table.

---

## 4. Design system

### 4.1 Token architecture (P8 Ch11)

```text
primitive  →  semantic  →  component
(#ff6b35)     (color.action)  (button.primary.bg)
```

Native (Compose) and web (CSS custom properties) both bind at the **semantic** tier. No client may introduce a cousin palette.

### 4.2 Locked colors (P8 Ch11 — immutable)

| Semantic | Hex | Use |
|----------|-----|-----|
| `color.action` | `#ff6b35` | Primary action, waterline, focus ring accent |
| `color.done` | `#10b981` | Settled / completed / positive |
| `color.muted` | `#6b7280` | Incomplete, secondary meta |
| `color.canvas.dark` | `#1a1a1a` | Dark app background (current) |
| `color.surface.dark` | `#2d2d2d` | Dark card (current) |
| `color.canvas.light` | `#f9f9f9` | Light background |
| `color.surface.light` | `#ffffff` | Light card |

**Danger** is not fixed in P8 by hex; V1 uses a **desaturated red** (`#d9534f`-class) defined in §4.3 ramp — semantic only, never decorative.

### 4.3 Soft Monotone dark ramp `[ADR REQUIRED — ADR-B3]`

**Problem (user feedback):** current dark mode fatigues eyes. Causes: near-black canvas against near-white text (contrast ratio too high for long reads), multiple saturated domain colors (calendar/event chips), and `#2d2d2d` cards on `#1a1a1a` giving low surface separation while text sits at 100% white.

**Proposal:** keep all brand/semantic colors; replace only the neutral ramp and text opacities. Three dark levels.

| Token | `dark` (default) | `dim` (new) | `light` |
|-------|------------------|-------------|---------|
| `color.canvas` | `#202124` | `#17181a` | `#f9f9f9` |
| `color.surface` | `#2a2c30` | `#202225` | `#ffffff` |
| `color.surface.raised` | `#32343a` | `#282a2e` | `#ffffff` |
| `color.border.subtle` | `#3a3d44` | `#2c2f34` | `#e8e8e8` |
| `color.border.strong` | `#4a4e57` | `#3a3d44` | `#d4d4d4` |
| `color.text.primary` | `rgba(255,255,255,.90)` | `rgba(255,255,255,.86)` | `#1a1a1a` |
| `color.text.secondary` | `rgba(255,255,255,.66)` | `rgba(255,255,255,.62)` | `#4b5563` |
| `color.text.muted` | `#9099a4` | `#828b96` | `#6b7280` |
| `color.action` | `#ff6b35` | `#ff6b35` | `#ff6b35` |
| `color.done` | `#10b981` | `#10b981` | `#10b981` |
| `color.danger` | `#e0685f` | `#d9605a` | `#c0483f` |
| `color.hold` | `#c9922f` | `#bd8a2c` | `#a3701c` |
| `color.uncertain` | `#7d8794` | `#75808d` | `#7b828c` |

**Notes**
- Neutrals are **tinted 2–4° toward the brand warm hue** — subtle cohesion, no visible color cast (`frontend-design` guidance).
- Body text capped at 90% white on dark; never `#ffffff` on `#1a1a1a`.
- `dim` is an explicit third option in Personalization, **not** an automatic OLED hack.
- `light` canvas remains `#f9f9f9` per P8 (supersedes older ivory).
- **Backward compatibility:** if the ADR is refused, V1 ships with `#1a1a1a`/`#2d2d2d` and applies only the text-opacity cap and monotone chip rules below — those need no ADR.

### 4.4 Monotone discipline rules (no ADR needed)

| Rule | Detail |
|------|--------|
| MD-01 | Domain/event types are conveyed by **shape + label + 3px accent edge**, not full-color chips |
| MD-02 | Charts use one neutral ramp + `color.action` for the active series; categorical color only where legally required for legibility, max 3 hues |
| MD-03 | Color alone never carries status (P8 Ch11) — always icon or text as well |
| MD-04 | Maximum **one** `color.action` element per visual group ("do this now") |
| MD-05 | No gradients on product surfaces; `/brand` may use atmosphere |
| MD-06 | No glass/blur cards as personality; blur only for genuine layering (sheet scrim) |

### 4.5 Typography (P8 Ch11 — LOCKED families)

| Role | Family | Where |
|------|--------|-------|
| Wordmark / manifesto | **Bodoni Moda** | Brand lockup, `/brand` only |
| Ritual / display | **Familjen Grotesk** | Brand moments, key OS headlines |
| Product UI | **Figtree** | All nav, body, buttons, labels |
| Measure | **JetBrains Mono** | Scores, money, timers, OS-ID, AEI |

A fifth identity face is forbidden. Inter as brand identity is forbidden.

**Type scale (product UI, fluid):**

| Token | Size (clamp) | Weight | Use |
|-------|--------------|--------|-----|
| `text.display` | clamp(28px, 4vw, 40px) | 600 | Ritual/brand headline |
| `text.h1` | clamp(22px, 2.6vw, 28px) | 600 | Page title |
| `text.h2` | 20px | 600 | Section |
| `text.h3` | 17px | 600 | Card title |
| `text.body` | 15px | 400 | Body |
| `text.body.sm` | 13.5px | 400 | Secondary |
| `text.label` | 12.5px | 500, +0.02em | Labels, chips |
| `text.measure.lg` | 34px | 500 mono | Life Score, AEI |
| `text.measure` | 15px | 500 mono | Money, timers |

**Font scale accessibility control:** Personalization slider ×0.9 / ×1.0 / ×1.15 / ×1.3 applied via root font-size; all sizes use relative units so the slider works. Native mirrors with `fontScale` clamp (respects OS setting; user override allowed up to 1.3).

### 4.6 Spacing, layout, radius

Spacing tokens (8pt-derived, existing `tokens.css`): `4, 8, 12, 16, 24, 32, 40, 48, 64`.

| Token | Value |
|-------|-------|
| `content.max` | 1320px |
| `content.pad` | 40px desktop / 20px tablet / 16px phone |
| `section.gap` | 32px |
| `nav.height` | 68px desktop / 64px mobile |
| `bottomnav.height` | 64px + safe area |
| `radius.sm` | 8px (chips, inputs) |
| `radius.md` | 12px (cards) |
| `radius.lg` | 18px (sheets) |
| `radius.full` | 999px (avatars, pills) |
| `touch.min` | 44×44 (48 native) |

**Rhythm rule:** vary spacing intentionally — tight groups (8/12) inside generous separations (32/48). Uniform padding everywhere is a slop signal.

### 4.7 Density modes (P8 Ch11 tone→density)

| Mode | Token | Applied to |
|------|-------|------------|
| Breath | `density.capture` | Logger, Journal editor, Voice session, Onboarding |
| Scan | `density.review` | Today reads, lists, Reports |
| Command | `density.command` | ⌘K results, Transactions table, Calendar week |
| Ritual | `density.brand` | `/brand`, splash, tier upgrade |

### 4.8 Elevation

| Layer | Web | Native | Use |
|-------|-----|--------|-----|
| Base | flat on canvas | 0dp | Capture surfaces, scan lists |
| Raised | 1px border + `0 1px 2px rgba(0,0,0,.18)` | 1dp | Cards, EntityPresent |
| Overlay | `0 12px 32px rgba(0,0,0,.32)` | 3dp | Sheets, Offer stack, palette |
| Veil | overlay + scrim `rgba(0,0,0,.56)` | 6dp + scrim | Irreversible confirms |

Capture (Breath) surfaces get **no decorative elevation** beyond Base.

### 4.9 Iconography & illustration

- Single icon family, 1.5px stroke, 20/24px grid (current: Lucide) — no mixed sets.
- **No large rounded icon tiles above every heading** (slop signal).
- Illustration is limited to: Depth hero figure (abstract), empty-state line marks, `/brand` diagrams. No mascots, no 3D blobs, no stock photos of people.
- Emoji is never IA (P5 forbidden).

### 4.10 Data visualization subset

Permitted in V1: line/area (trend), bar (period compare), dot-grid heatmap (habits, topic coverage), radial ring (score/AEI, one per screen), horizontal stacked bar (budget), sparkline **only when the number alone is ambiguous** (never decorative).

Every chart ships with: loading skeleton, empty state, error state, and a **text alternative** summarizing the trend (accessibility law INV-C-*).

---

## 5. Motion, gesture, and interaction system

### 5.1 Motion law (P8 Ch12)

| Law | Meaning |
|-----|---------|
| After-Settle | Celebration/feedback motion happens **after** truth is committed |
| Honest Hold | Pending never animates like success |
| One Motion | One meaningful motion per interaction, not layered flourishes |
| Interruptibility | Any animation is cancellable by user input |
| Meaning Without Animation | Reduced motion loses no information |
| Proportional Celebration | Habit tick ≠ tier upgrade ≠ nothing |
| Platform Body | Platform easing/back gestures win |

### 5.2 Duration bands + easing

| Band | Duration | Easing | Examples |
|------|----------|--------|----------|
| Instant | 0–80ms | linear | Press state, checkbox fill |
| Productivity | 150–250ms | `cubic-bezier(.16,1,.3,1)` (ease-out-expo-ish) | Row swipe settle, chip add, toast |
| Orient | 250–400ms | `cubic-bezier(.32,.72,0,1)` | Screen push, sheet open, depth transition |
| Ritual | 400–900ms | `cubic-bezier(.16,1,.3,1)` | Splash, tier upgrade, Sunday replay |

Forbidden: bounce/elastic easing; animating `width/height/margin/padding` (transform + opacity only; use `grid-template-rows` for expansion); idle "breathing" AI glow; casino motion on Scan surfaces.

### 5.3 Named transitions

| ID | Interaction | Motion |
|----|-------------|--------|
| MO-01 | Screen forward | translateX +12px + fade, 220ms |
| MO-02 | Screen back | reverse, 200ms (platform gesture wins) |
| MO-03 | Bottom sheet | translateY 100%→0, 280ms Orient |
| MO-04 | Sheet dismiss by drag | follows finger; settle 200ms |
| MO-05 | Habit/task complete | scale .96→1 + fill + strikethrough, 150ms + haptic light |
| MO-06 | Depth change | figure translateY + field gradient, 400ms, After-Settle |
| MO-07 | Life Score ring | stroke-dashoffset draw 700ms **once per session** |
| MO-08 | AEI ring | same, 700ms, once |
| MO-09 | Toast / Hand-back | translateY 8px + opacity 250ms; dwell 6s (undo) |
| MO-10 | Offer stack appear | stagger 60ms per chip, max 5 |
| MO-11 | List enter | fadeUp 24px + blur(4px)→0, stagger 60ms, max 8 rows |
| MO-12 | Theme change | cross-fade tokens 350ms |
| MO-13 | Tier upgrade | 3-beat: hold → land → unlock list, ~1.2s |
| MO-14 | Sync Hold → Settle | pill morph + count decrement, 200ms |
| MO-15 | Veil enter | scrim fade 180ms + dialog scale .98→1 |
| MO-16 | Voice waveform | live amplitude only while recording; stops on stop |

### 5.4 Reduced motion contract

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 1ms !important; transition-duration: 1ms !important; }
}
```
Plus behavioral fallbacks: depth = static position + label; ring = final value immediately; stagger = simultaneous; waveform = static level meter with numeric dB-free "recording" state.

### 5.5 Gesture grammar (V1, cross-surface)

| Gesture | Meaning | Where | Required non-gesture equivalent |
|---------|---------|-------|--------------------------------|
| Tap | Primary activate | Everywhere | — |
| Swipe right on row | **Complete / settle** | Habits, tasks, open loops, UPI review approve | Checkbox / button |
| Swipe left on row | **Snooze / archive** | Reminders, notifications, loops, UPI review skip | Row menu |
| Long-press row | Context menu (link, edit, delete) | Lists, person, transaction | Overflow "⋯" button |
| Pull down | Refresh / sync now | Today, Money, Calendar, Vault | Sync button in header |
| Drag handle | Reorder | Habits, Today widgets, nav pins | Move up/down in menu |
| Drag sheet | Expand/collapse/dismiss | All sheets | Close button |
| Horizontal carousel | Browse peer items | Open loops, people owing, drills | Arrow buttons (desktop) / list view |
| Pinch | Zoom | Document viewer only | Zoom buttons |
| Two-finger swipe | — | **Unused** (reserved) | — |
| Shake | — | **Never** used | — |

Rules: no gesture is the **only** path (IP-16); platform back/predictive back always wins (IP-14); back from Veil = **cancel**; back with an unsettled Pulse = **Drift**, never silent discard.

### 5.6 Haptics (native)

| Event | Pattern |
|-------|---------|
| Habit/loop complete | Light impact |
| Settle after sync | Light impact (once per batch, not per item) |
| Veil open | Warning tick |
| Destructive confirmed | Medium impact |
| Voice session start/stop | Light / medium |
| Error | Double light (never long buzz) |
| Depth surface reached | Medium — **once per day maximum** |

Respect system haptic setting; user toggle in Personalization.

### 5.7 When to click vs when to gesture

| Situation | Choose |
|-----------|--------|
| Repeated micro-action in a list | Swipe (with tap fallback) |
| Navigating to a detail | Tap |
| Any irreversible act | **Tap into Veil** — never gesture-only |
| Desktop bulk work | Click + keyboard, ⌘K, multi-select |
| Editing a small object | Sheet, not a new page |
| Editing a big object (goal, report) | Page |
| Reordering | Drag with handle |

### 5.8 Keyboard model (desktop)

| Key | Action |
|-----|--------|
| `⌘/Ctrl K` | Command palette |
| `L` | Logger focus (when no field focused) |
| `⌘/Ctrl Enter` | Save/settle in editors |
| `Esc` | Dismiss sheet/overlay; from Veil = cancel |
| `⌘/Ctrl Z` | Hand-back (undo) where reversible |
| `G` then `T/H/M/C/F/R` | Go to Today/Habits/Money/Calendar/Family/Reports |
| `/` | Search within current surface |
| `?` | Shortcut cheat sheet |
| `Tab` | Visible focus ring (2px `color.action`, 2px offset) |

All shortcuts documented in-app (Interaction inventory flagged "undocumented shortcuts" as debt — closed in V1).

---

## 6. Component library

Tiers follow UX-Architecture Phase 3 (T0–T10). For each component: **variants · states · motion · a11y · platform delta · usage rule**.

### 6.1 T0 Primitives

| Component | Variants | States | Notes |
|-----------|----------|--------|-------|
| `Button` | primary, secondary, ghost, danger, icon | default, hover, focus-visible, active, loading, disabled | Only **one** primary per group; loading shows spinner + keeps label; min 44px touch |
| `Input` | text, number, money (mono), search, PIN | default, focus, invalid, disabled, readonly | Label always present (no placeholder-as-label); error text below, `aria-describedby` |
| `Textarea` | plain, autogrow | as Input | `⌘Enter` saves |
| `Select` | native, custom listbox | + open | Custom only when native cannot (e.g. avatars); keyboard arrow support |
| `Checkbox` / `Toggle` | — | + indeterminate | Toggle = instant effect; Checkbox = form scope |
| `Chip` | filter, correction, tag, tier | selectable, selected, removable | Correction chips are the primary AI adjust mechanism |
| `Badge` | neutral, done, hold, danger, tier | — | Never color-only; includes text |
| `Avatar` | initials, photo, group | — | Initials derive from person name; deterministic neutral background |
| `Tooltip` | — | — | Never the only source of critical info |
| `Divider`, `Skeleton`, `Spinner` | — | — | Skeleton preferred over spinner for content |

### 6.2 T1 Feedback / overlay family

| Component | Purpose | Rules |
|-----------|---------|-------|
| `EmptyState` | Teach the next legal verb | Must contain: what this is, one action, why it's empty. No shame, no illustration-only |
| `StatusAlert` | inline honest status | variants: info, hold, warning, error, offline |
| `Toast` | ephemeral ack + Hand-back | 6s when undo present; never for errors requiring action |
| `Sheet` | small edits, session runners | drag handle, 3 sizes (peek/half/full), scrim, focus trap |
| `Dialog` | confirmations | non-destructive: Cancel/Confirm |
| `VeilGate` | irreversible acts | shows consequence, entity name, count; **Typed Veil** at peak (type `DELETE` / `WIPE ALL DATA`); no Hand-back after typed confirm |
| `Drawer` | side detail (desktop) | never used to hold primary nav |
| `LiveRegion` | announce async state | `aria-live=polite`; assertive only for errors |
| `ConflictResolver` | sync conflicts | shows both versions + timestamps + source; user chooses; "keep both" where lossless |

`window.confirm` is forbidden anywhere (P5).

### 6.3 T2 Navigation

| Component | Rules |
|-----------|-------|
| `BrandLockup` | **Split targets locked**: mark → `/brand`, wordmark → `/overview`. Never unified. |
| `Masthead` | pins (max 12), overflow More, utility cluster |
| `TabRail` | tablet; icon + expandable label |
| `BottomNav` | native 5 tabs; `/m` 2 items; active = weight + `color.action` underline (not glow) |
| `CommandPalette` | sections: Go, Capture, Search results, Actions; fuzzy; recent first; keyboard-complete |
| `Breadcrumb` | only where depth 3 (Family Documents, Person) |
| `SyncPill` | `Synced 2m ago` / `3 held` / `Offline` — tappable → Sync tray |

### 6.4 T3 Capture (sacred)

| Component | Rules |
|-----------|-------|
| `Logger` | Single free-text field; Enter-to-save must always work; no required category; AI runs **after** raw save |
| `OfferStack` | AI structure proposals; each shows domain, parsed fields, **confidence band**, provenance ("from your text"); Accept / Adjust / Dismiss |
| `CorrectionChip` | one-tap field fix |
| `MoodSelector` | 1–5, single row; **no second mood picker anywhere** |
| `PinEntry` | 6 digits, auto-advance, auto-submit, never in telemetry |
| `VoiceCapture` | record/stop, live level, local-first; shows where audio lives |
| `ScanCapture` | camera → crop → OCR → draft (transaction or document) |

### 6.5 T4 Domain rows

`HabitRow` (circle + streak + swipe), `TaskRow`, `TransactionRow` (mono amount, category, person link), `LendRow` (direction, person, outstanding, due), `PersonRow` (avatar, role, last interaction, owed amount), `DocumentRow` (type glyph, expiry badge, shared-with), `EventRow`, `NotificationRow`, `LoopRow` (open loop with one action), `DrillRow` (English drill with duration + skill tag).

All rows: 44px+, swipe grammar per §5.5, long-press menu, keyboard focusable, single-line truncation with tooltip/detail.

### 6.6 T5 Metric family (MERGE target D11)

**One** metric component with variants — replaces the current three (Hero/Tile/Metric).

| Variant | Use |
|---------|-----|
| `Metric.ring` | Life Score, AEI, steps goal (max one ring per screen) |
| `Metric.stat` | number + label + delta |
| `Metric.bar` | budget usage, skill level |
| `Metric.trend` | value + 7/30-day sparkline (only when trend matters) |

Rules: `AnimatedNumber` counts once per session; never fabricate precision; always show the period ("this week"); no gradient text on numbers.

### 6.7 T6 Charts

`LineChart`, `BarChart`, `DotHeatmap`, `StackedBar`, `RadialProgress`. Each: L/E/Err states + text alternative + keyboard-accessible data table fallback.

### 6.8 T7 Domain shells

`FocusRoom` (timer + intent + stats), `FinanceWorkspace` (tabs + filters + import), `CareerKanban` (drag columns), `CalendarGrid` (month/week/day/agenda), `DocumentViewer` (§8.8), `SessionRunner` (English §8.9), `VaultShell` (locked container).

### 6.9 T8 Marketing

Waitlist components stay isolated (`components/waitlist/*`) — must never be imported into product surfaces (prevents template drift).

### 6.10 T9 Experimental — REMOVE in V1

`kokonutui/*`, `DesktopWindow` — audited out of the shell (Phase 3 classification). Any needed pattern is re-implemented in the canonical tiers.

### 6.11 T10 Native kit (Compose)

Mirror of semantic tokens: `AiiminTheme` (color/typography/shape), `AiiminButton`, `AiiminCard`, `MetricRing`, `SwipeRow`, `AiiminSheet`, `VeilDialog`, `SyncBanner`, `DepthHero`, `PinPad`, `BiometricGate`, `SessionRunner`, `DocPreview`.

Contract: same **verbs and states** as web; rendering is platform-native (no WebView UI, no CSS port).

### 6.12 Forbidden components (P5 / Phase 3)

Decorative AI sparkle badges · second confirm system · any Life-Score chrome on `/m` · forced sidebar as primary nav · duplicate mood/theme/arc editors · `window.confirm` · glass-card grid as identity · DEMO/LIVE vanity chrome on Today.

---

## 7. Complete onboarding

### 7.1 Objectives

| # | Objective | Success measure |
|---|-----------|-----------------|
| 1 | Reach one true value moment fast | First Settle (a real capture) < 90s from first product screen |
| 2 | Make the system feel **real and connected** | ≥1 person imported **or** ≥1 calendar connected **or** ≥1 health source linked |
| 3 | Establish honest baseline | Life Arc written; daily minimum chosen; optional AEI baseline |
| 4 | Earn trust before asking for sensitive scopes | Every permission preceded by rationale; refusal fully supported |
| 5 | Set day-2 return hook | Widget added, or one notification type chosen, or drill scheduled |

### 7.2 Before signup (public)

| Stage | Surface | Content |
|-------|---------|---------|
| Discover | `/` | Hero (*One screen. Every day.*), personas, four tiers with founding prices, launch journey, FAQ, waitlist form (email required; first name + OS-ID optional) |
| Understand | `/brand` | Human Momentum manifesto, pillars, **storage ledger** (what is stored, where, for how long), privacy/terms links |
| Reserve | `POST /api/waitlist` | Position, referral code, reserved OS-ID; confirmation email |
| Guest tour | `/` modal | Read-only slices (Today shape, Depth explainer, Money shape). **No fake data claiming to be theirs.** |

### 7.3 Signup / auth options

| Method | V1 status | Flow |
|--------|-----------|------|
| **Google** | EXISTS | OAuth (login client only, minimal scopes: `openid email profile`) → API handoff → OTT → SPA → profile completion |
| **Email + PIN** | EXISTS | Email → verify → 6-digit PIN as credential; OS-ID assigned/claimed |
| **OS-ID + PIN** | EXISTS | `GET /api/auth/resolve` OS-ID→email → PIN |
| **Apple** | POST-V1 (iOS gate) | Mandatory only when iOS ships with Google |
| **Passkeys** | POST-V1 | Better Auth plugin path documented |
| **Guest** | Read-only tour only | Guest **cannot** write life data (prevents orphan data + trust ambiguity) |

**Waitlist gate:** signed-in but not approved → `A-06 Pending access` (explicitly *not* an error state; shows position, referral, expected window).

### 7.4 The 12-step onboarding (V1 canonical)

Progress is a thin top bar; **Skip** visible except where marked Required; every step is resumable (server-persisted `onboarding_step`).

| Step | Screen | Ask | Required | Writes |
|------|--------|-----|----------|--------|
| 0 | Welcome | Name; one-line promise; theme picker (light/dark/dim) | Name | `users.name`, `theme` |
| 1 | OS-ID | Claim 8-char handle (live availability) | Yes | `username` |
| 2 | Security | Set 6-digit PIN + confirm; offer biometric (native) | Yes | credential, `biometric_enabled` |
| 3 | Life mode | Persona: student / professional / founder / family / athlete / custom | Yes | `persona`, applies nav pins + widget preset |
| 4 | Life Arc | North Star sentence (AI "sharpen" optional) | **Yes** (product redirects if missing) | `users.life_arc` |
| 5 | Focus areas | Pick 3–6 domains to pin | ≥3 | `nav_pins`, widget set |
| 6 | Daily minimum | Choose the 3 actions that define a surfaced day (default: 1 habit + 1 log + 1 movement/voice) | Yes | `daily_minimum` config |
| 7 | Starter habits | 1–5 from persona suggestions or custom | ≥1 | `habits` |
| 8 | **Privacy briefing** | One screen: tiers of data, what is never done (no selling, no ads, journal excluded from analytics), where controls live | Ack | `consent_ack` |
| 9 | **Connections** (progressive) | Google Calendar · Contacts/People · Health (native) · Notifications · SMS money (native) · Microphone (English) · Location (**not requested in V1**) | All optional | `user_consents` rows |
| 10 | **English baseline** (optional) | 3-part placement: read-aloud → 60s topic → 1 debate exchange → AEI + skill radar | Optional | `english_sessions`, `english_index` |
| 11 | First success | Guided single action: tick one habit **or** log one line → Depth rises visibly → "Surfaced" | Yes | real life entity |
| 12 | Land | Today with real content + widget prompt (native) + one notification choice | — | `onboarding_complete` |

Total target: **~4 minutes** with connections, **~90 seconds** if all optional steps skipped.

### 7.5 Permission model — rationale before dialog

Every sensitive scope uses the same 4-part pattern (component `A-08`):

1. **Plain purpose** — one sentence: what it enables
2. **Exact scope** — what is read; what is *not* read
3. **Where it lives** — device only / server / both, and retention
4. **Reversal** — "You can turn this off in Account → Privacy anytime"

| Permission | Platform | Purpose sentence | Read | Never | Storage | Refusal behavior |
|------------|----------|------------------|------|-------|---------|------------------|
| Google Calendar | web + native | See and manage your day alongside habits | events (r/w), Tasks (r) | Gmail, contacts | server (event metadata) | Manual events only; sync UI hidden |
| Google People / Contacts | web (People API) / native (device) | Turn names into real linked people | name, phone, email, photo of contacts **you select** | full book upload, call logs | server: name + normalized phone hash + optional display phone | Manual person entry |
| Health Connect | native | Count steps, distance, sleep toward your day | daily aggregates | per-workout GPS routes | server: **daily totals only** | Manual movement log |
| Usage stats (screen time) | native | Show screen time next to focus | daily total + top apps (local) | per-minute history upload | server: daily total (+ top-3 categories if opted) | Screen chip hidden |
| SMS / notification read | native | Turn UPI alerts into transactions | bank/UPI sender templates only | personal messages, OTPs beyond discard, raw body upload | server: parsed transaction only | Manual + statement import |
| Microphone | web + native | Record practice so you can hear progress | audio during an active session | background listening | device by default; cloud only if opted | Text-only English drills (typed) |
| Notifications | both | Only what you choose to be reminded about | — | — | token in `mobile_devices` | In-app only |
| Camera | native | Scan receipts and documents | frames during scan | background | uploaded doc only | Gallery/file picker |
| Storage/files | both | Attach and open your documents | files you pick | library scan | vault object storage | View-only, no attach |
| Location | — | **Not requested in V1** | — | — | — | — |
| Call log | — | **Not requested in V1** (relationship ledger stays manual) | — | — | — | — |

Rules: no permission is requested during step 0–8; refusing never blocks the app; a refused scope is re-askable at most **once per 30 days** and only in context ("Add from contacts?"), never as a modal on launch.

### 7.6 Guest, re-entry, and multi-device onboarding

| Case | Behavior |
|------|----------|
| Guest tour → signup | Nothing to migrate (guest cannot write); tour choices (theme) carried in `sessionStorage` |
| Returning user, new device (web) | Login → session → **no onboarding**; a 2-card "what's here" hint if `last_seen > 30d` |
| First native install for existing web user | Login → bootstrap → 3 native-only asks (biometric, notifications, health) → Today. **No repeat of steps 0–8** |
| Web after native | Nothing asked again; Connections tab shows native-only scopes as "managed on your phone" |
| Account restored after deletion | Treated as new user; prior data is gone (documented in delete Veil copy) |

### 7.7 First week / first month (activation, not nagging)

| Day | Moment | Channel | Rule |
|-----|--------|---------|------|
| 1 | Land + first Settle | in-app | — |
| 2 | One tip in-app: swipe to complete | in-app card, dismissible | Never a push |
| 3 | "Add one person or connect calendar" if neither done | in-app Open Loop | Once |
| 4 | First Depth surface celebration (proportional) | in-app | Once ever |
| 7 | **Weekly insight** — first real narrative with citations | in-app + optional push if opted | Requires ≥3 days data or says so honestly |
| 10 | Widget suggestion (native) | in-app | Once |
| 14 | Ivory Snapshot / first report offered | in-app | Tier-aware, no dark-pattern nag |
| 21 | Skill/AEI progress card if English used | in-app | Only with ≥5 sessions |
| 30 | Month replay + "what to change" | in-app | Optional push |

Re-engagement (`/api/cron/re-engagement` EXISTS) rules: maximum **1 message per 72h**, always specific ("₹500 from Rahul is 3 days overdue", "AEI +3 this week"), never "we miss you", never streak shame, honors quiet hours and notification prefs, stops after 3 unopened messages.

<!-- APPEND-HERE -->
