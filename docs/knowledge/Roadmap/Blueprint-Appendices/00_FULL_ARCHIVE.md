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

> [!warning] Full archive
> Unsplit copy retained for search. Prefer spine [[Roadmap/AIIMIN-V1-Blueprint]] + numbered appendices.



# AIIMIN V1 — Product Blueprint (single source for implementation)

> [!important] Authority
> This document **expresses** Genesis (P1–P9). It **cannot amend** Genesis (`can_override_genesis: false`).
> Conflict order: **P8 → P9 Phase 1 → Phase 2 → Phase 3 → Phase 4 → UX Architecture → this Blueprint**.
> Where this Blueprint proposes something Genesis does not already permit, it is tagged **`[ADR REQUIRED]`** and MUST NOT be built until the Founder issues an ADR in `10_DECISIONS/`.

> [!abstract] Purpose
> Everything needed to derive the PRD, UX spec, Design System, DB schema, API spec, engineering docs, test plans, and roadmap — **without another discovery phase**.

**Product:** AIIMIN — Personal Life OS · *One screen. Every day.* · Brand frame **Human Momentum**
**Owner:** Aaditya Upadhyay
**Blueprint version:** 1.1 · **Date:** 2026-07-31

### v1.1 delta (2026-07-31)

| Change | Detail |
|--------|--------|
| **Android-only native** | iOS **out of plan** for V1. Native = Kotlin Compose Android. Phone web `/m` remains capture-only. |
| **Journal flagship** | Research-backed design: [[09_FEATURES/Journal/Research-Backed-Design]]. Modes after Catch; 1–3 day cadence packs; no therapy claims. |
| **Mobile tiers more aggressive** | Same 4 tiers as web; Android unlocks Health Connect, UPI review, widgets, offline queue earlier in the value story — see §8.18 mobile column. |
| **Inspiration without Mobbin** | Refero, Page Flows, Pttrns, UI Garage, M3, founder GPT boards — recolor to Soft Neutral AIIMIN. |
| **Prototype** | `frontend/prototypes/AIIMIN-Drafting-Table.html` — locked visual language. Closed HTML bake-off recorded in `docs/knowledge/16_DOCUMENTATION/Completed-Work-Ledger.md`. |

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
| F-01 | T | **People** (all persons, roles) |
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

---

## 8. Feature specifications

Every feature is specified with the same 14 fields:
**Purpose · Why it exists · Discovery · Learning · Core use · Graph links · States · Edge cases · Permissions · Offline · Sync · AI · Notifications · Recovery/Deletion/History.**

### 8.1 Today + Depth (DOM-DAY) — the spine

**Purpose.** Answer "what is true today and what do I do next" on one screen.
**Why it exists.** P8 Ch08: Today owns the day; there is no Dashboard surface. Every other domain is reachable from here or from the palette.
**Discovery.** Default post-auth landing; wordmark click; native Today tab.
**Learning.** Onboarding step 11 performs one action and shows Depth respond. A one-time card explains the daily minimum.

**Core use (layout order, desktop):**

1. **Depth hero** — state machine below
2. **Daily minimum** — 3 slots with labels chosen in onboarding
3. **Open Loops** — carousel of things the system needs from the user (§8.14)
4. **Universal Logger** — one field, always focused by `L`
5. **Habits strip** — today's habits, swipe/tap
6. **Command timeline** — day spine merging calendar events + focus blocks + due items
7. **Health chips** — steps / km / screen time / sleep (native-sourced)
8. **Life Score card** — 0–98 with domain breakdown (D05 primary location)
9. **Weekly insight** — Coach output, only inside an open interruptibility window
10. **Micro-task** and **Recovery card** (conditional)

Widgets are user-toggleable and reorderable (drag handle); Today is **not** a widget landfill — max 8 visible blocks, others in "Show more of today".

**Depth state machine**

```text
inputs: minimumMet (0..3), hour, streak7 (days met of last 7), brokeYesterday

state =
  brokeYesterday && minimumMet == 0        -> depth.recover
  minimumMet == 0 && hour >= 11            -> depth.submerged
  minimumMet == 0 && hour <  11            -> depth.dawn        (neutral, no judgement)
  minimumMet in 1..2                       -> depth.rising
  minimumMet == 3 && streak7 <  5          -> depth.surface
  minimumMet == 3 && streak7 >= 5          -> depth.glide
```

- Transition animation only **After-Settle** of the action that changed `minimumMet`.
- Depth never reads a different data source than Life Score inputs.
- `depth.dawn` prevents "you are failing" at 7am — a real trust detail.

**Graph links.** Depth ← habits, daily_logs, focus_sessions, english_sessions, health_days. Open Loops ← every domain. Timeline ← calendar_events + focus_sessions + reminders + lend due dates.

**States.** Loading (skeleton per block, never a full-page spinner) · Partial (some APIs failed → that block shows honest error, rest renders) · Empty (first day: minimum slots + logger + "tick one habit") · Offline (banner + cached values labeled with timestamp) · Stale (`as of 9:02`) · Error per block.

**Edge cases.**
- Timezone change mid-day → day boundary follows `users.timezone`; a travel banner explains the shift once.
- Midnight rollover while app open → Today re-fetches at local midnight; unsettled Pulse is preserved as Drift.
- Clock skew (device vs server) → server `serverTime` wins for day boundary.
- Score unavailable (AI/DB partial) → show inputs and "score updating", never `0`.
- User completed minimum yesterday at 23:59 in another timezone → counted in the local day it was logged.
- Fresh account with zero data → `depth.dawn` regardless of hour.

**Permissions.** None required; health chips hidden without Health consent.
**Offline.** Today renders from cache; capture works; score shows last computed with timestamp.
**Sync.** Pull on focus + pull-to-refresh + after any local Settle.
**AI.** Coach (weekly insight, micro-task suggestion) only; Router for the logger. No AI blocks the page.
**Notifications.** None generated by Today itself except (opt-in) evening "minimum not met" single reminder at a user-chosen hour.
**Recovery / deletion / history.** Every block links to its domain where the record can be edited/deleted. Depth has no own data.

---

### 8.2 Capture system: Universal Logger, Journal, Notes, Daily Log

**Purpose.** Get anything out of the human's head into the graph in under 5 seconds, then structure it.
**Why.** P8 Ch06 + C-UX-02: capture first, structure later; no gate before Catch.

**Universal Logger flow (canonical Catch→Settle→Offer):**

```text
type "lent rahul 500 for cab, pay back friday"
  ↓ Enter (or ⌘Enter)
raw Pulse saved immediately  →  Settle ack ("Saved")     ← never blocked by AI
  ↓ async Router (Ch07)
OfferStack:
  [Lend ₹500 · person Rahul · due Fri 3 Aug]  confidence 82%  "from your text"
  [Add calendar reminder Fri 09:00]           confidence 61%  → needs confirm
  ↓ Accept / Adjust (chips) / Dismiss
Commit → money_lent row + person link + optional calendar_event
```

Rules: raw text is retained on the entity as `source_utterance` (provenance); AI never creates a finance record without an utterance (P5 kill list); dismissed Offers never re-appear in the same session; low confidence (<40%) asks one question instead of guessing.

**Journal (FLAGSHIP — Android + desktop).** Full research map: [[09_FEATURES/Journal/Research-Backed-Design]].

| Mode | Evidence (post-2020) | Session |
|------|----------------------|---------|
| Free write | Capture-first + EW baseline | 5–15 min |
| Expressive (one event) | Guo 2023 delayed durable effect; prefer 1–3 day intervals | Pack of 3 short sessions |
| 3 goods / WWW | Gratitude subset · Sohal 2022 meta | 2–5 min |
| Evening debrief | Day closure + delayed-effect support | ~5 min after 20:00 soft prompt |
| Structured reflection (CBT worksheet shape) | Common worksheet; **not therapy** | Labeled non-clinical |
| Weekly review | Links goals/habits | 10–15 min |

Mode is a **chip after entry starts**, never a gate (kill list: "journal mode gate"). Body = **private reflection** (P8-R-219) — never analytics, never push content, AI only on explicit per-entry ask. Never claim cure/diagnosis. Depth: journal can fill one daily-minimum slot. Android: biometric lock option on Journal; drafts survive process death. Streak freeze applies — no shame for skips.

**Notes.** List + editor, tags, search, attachments, Google Drive folder watch (EXISTS), anchor edges (link suggestions with confirm — `anchor_edges` EXISTS).
**Daily Log.** Structured day metrics (sleep, mood, water, energy, custom); the mobile version deliberately omits desktop-only fields (kill list: no protein input on mobile).

**States.** Draft (autosave local every 2s) · Saving · Settled · Hold (offline queued) · Conflict (same entity edited on two devices) · Drift (navigated away unsettled → restore card) · Error.
**Edge cases.** Empty submit ignored (no error) · 20k-character journal entry (server limit + graceful message) · paste of an image into notes (upload or reject with reason) · duplicate log for same day (upsert, not duplicate) · offline for 5 days then reconnect (batch of 200 → chunked 50 per request) · logger text that matches two domains (Offer stack shows both, user picks) · logger while a Veil is open (blocked — one Anchor rule).
**AI.** Router → Inferencer → Analyzer; Coach only outside capture. Journal AI is opt-in per entry.
**Deletion/history.** Soft delete with `deleted_at` + 30-day recovery bin for journal/notes; hard delete available in Privacy tab; edit history kept for journal (last 5 versions) so accidental overwrite is recoverable.

---

### 8.3 Habits (DOM-EXEC, core+)

**Purpose.** Make consistency visible.
**Core use.** CRUD with category, schedule (daily/weekly/N-per-week/custom days), reminder time; today's row swipe-to-complete; streak; 7-day strip; monthly dot grid; **yearly heatmap**; archive (never silent delete).
**Grid completion colors** (locked): 8/8 `#10b981`, 6–7/8 lighter green, <6/8 `#6b7280`.
**Graph links.** habit → daily minimum → Depth/Life Score; habit ↔ goal (a habit can serve a goal); habit ↔ english drill (the "English 3min" habit is satisfied by a real session, not a manual tick — the system ticks it and says why).
**Edge cases.** Habit created mid-week (no fake back-fill) · scheduled-day logic vs "any day" streaks (streak counts scheduled days only; UI states the rule) · retroactive tick (allowed up to 2 days back, marked `backfilled`) · timezone travel (day per user timezone) · archived habit with history (history preserved, excluded from score) · two devices tick the same habit (idempotent by `(habit_id, date)`).
**Offline/sync.** `habit.tick` is an idempotent mutation type (EXISTS).
**Notifications.** Per-habit reminder; one "streak at risk" per day maximum, calm tone; never guilt.
**Recovery.** Undo tick within toast window; unarchive; streak freeze (§8.13).

---

### 8.4 Goals + Life Arc (DOM-PLAN, core+)

**Purpose.** Keep direction visible and connected to daily action.
**Core use.** Pipeline kanban (Active / On Track / At Risk / Achieved), Grid by pillar (Academic, Career, Health, Personal), Archive; deadline picker (branded, not native input); progress %, notes; **Life Arc** tab (merged from `/identity`).
**Reverse planner.** From a goal deadline, generate weekly targets (e.g. "offer by Dec" → 3 applications/week + 2 English drills/week). Output is **suggestions** the user commits — never auto-created habits (P8-R-255).
**Graph links.** goal ↔ habits, goal ↔ job_applications, goal ↔ english sessions, goal ↔ savings target, goal ↔ calendar milestones.
**Edge cases.** Deadline in the past (allowed, marked overdue, no shame) · goal with no linked action (nudge once: "nothing feeds this goal") · achieved then reopened (history retained) · pillar deleted (goals reassigned to Personal).
**AI.** Composer drafts milestones; Coach flags at-risk based on linked activity, citing the evidence.

---

### 8.5 Calendar + two-way Google sync (DOM-EXEC, explore+)

**Purpose.** One honest day, whether the event came from Google or AIIMIN.

**Current (EXISTS):** read-only pull, all readable calendars, 90 days back / 365 forward, Google Tasks with due dates as `event_type=task`, upsert on `(user_id, google_event_id)`, manual "Pull Google" + auto-pull after connect. Push route exists but is limited.

**V1 target — two-way sync**

| Concern | Design |
|---------|--------|
| Scopes | `calendar.events` (read/write) + `tasks.readonly`; **separate OAuth from login** (EXISTS pattern) |
| Direction | AIIMIN-created events push to a dedicated **"AIIMIN" Google calendar** by default (user may choose primary) — keeps user's own calendars clean and makes rollback trivial |
| Change detection | Google `syncToken` incremental sync + webhook (`watch`) where available; fall back to 15-min poll on native, on-focus poll on web |
| Local changes | Outbox with `etag`/`updated` compare-and-set |
| Conflict | If both sides changed since last sync: `E-06 ConflictResolver` shows both versions + timestamps + source; options **Keep Google / Keep AIIMIN / Keep both**; never silent last-write-wins |
| Deletions | Tombstones both ways; deletion of a Google event that anchors a focus block asks what to do with the block |
| Recurrence | Read full RRULE; V1 **edits single instances only** (creating/editing a recurring rule is POST-V1 — clearly labeled in UI, not silently broken) |
| Timezones | Store UTC + original `tzid`; render in `users.timezone`; all-day events are date-only (no TZ shifting bug) |
| Privacy | Event **titles** are stored to be usable; user may switch to "busy-only" mode which stores times + a hash only |

**Sync status contract (user-visible).** `SyncPill`: `Synced 2m ago` · `Syncing…` · `3 held` · `Offline` · `Reconnect needed`. Tapping opens Sync tray with per-source detail and last error verbatim.
**Edge cases.** Token revoked externally → Reconnect state, not an error crash · quota exceeded (429) → backoff + honest "Google is rate-limiting; retry in Xm" · event moved to a different calendar · 5000-event month (virtualized rendering) · Tasks without due dates (documented as not synced) · DST boundary event (test case) · account switch on device (per-account token storage).
**Notifications.** Event reminders come from **one** source: if Google reminders are on, AIIMIN suppresses duplicates by default and says so.
**Deletion/history.** Disconnect asks: keep imported events (frozen copies) or delete them all.

---

### 8.6 Money: transactions, budgets, wealth, **UPI ingest**, **lend/borrow** (DOM-MONEY, core+)

**Purpose.** Know where money went and who owes whom, with minimal typing and zero surveillance creep.

#### 8.6.1 Structure

| Tab | Contents |
|-----|----------|
| Overview | Net position (assets − liabilities incl. borrowings), month spend vs budget, recent activity, bills due |
| Analytics | Category trend, month compare, merchant top-N |
| Accounts | Bank/cash/credit with balances (manual or statement-derived) |
| Transactions | Ledger with filters (date, category, account, person, source) |
| Budgets | Monthly per category with rollover option |
| Wealth | Investments/assets, net worth snapshots |
| **Lending** | Lent · Borrowed · Settled, per-person rollups |

#### 8.6.2 UPI / SMS ingest (native only) — privacy tier T3

```text
Android SMS/notification listener (opt-in, scoped)
  → on-device template match (bank/UPI senders allowlist)
  → extract {direction, amount, counterparty_raw, ref, timestamp}
  → discard raw body from memory; NEVER persisted, NEVER uploaded
  → draft transaction in local review queue (Hold)
  → user reviews (swipe right approve / left dismiss / tap edit)
  → approved → POST /api/wealth/transactions (source='upi_sms')
```

Rules: sender allowlist is shipped and updatable; unmatched messages are ignored silently (no "we couldn't read your SMS"); OTP messages are never parsed; a per-message "why did this appear" shows the matched template, not the raw text; the review queue is an **Open Loop** on Today.
Fallbacks when refused: manual entry, statement import, share-to-AIIMIN of a payment screenshot (OCR).

#### 8.6.3 Statement import (web + native)

Upload CSV/PDF → parse (CSV mapper; PDF text extraction, no OCR guessing for tables it cannot read) → AI categorize with confidence → **confirm queue** (user accepts/edits) → commit. Import is a first-class object: `import_batch` with source file reference, row count, and **one-tap "undo this import"** (deletes only rows from that batch).

#### 8.6.4 Lend / borrow ledger (`money_lent` EXISTS)

| Field | Notes |
|-------|-------|
| `direction` | `lent` \| `borrowed` |
| `person_id` | Link to People (§8.7) — required for rollups |
| `amount`, `currency` | INR default, mono display |
| `date`, `reason` | Reason is free text |
| `due_date` | Optional; drives reminders |
| `repayments[]` | Partial repayments with date + amount |
| `status` | `open` \| `partial` \| `settled` \| `written_off` |
| `proof_doc_id` | Optional vault document (screenshot/receipt) |
| `linked_tx_ids[]` | Matched transactions |

**Auto-match.** An incoming UPI credit whose counterparty matches a person with an open `lent` record proposes: "Settle ₹500 of Rahul's ₹2,400?" — an Offer, never automatic (P8-R-255).
**Rollups.** Person card shows net position; Finance overview lists top open positions; net worth includes lends as assets and borrowings as liabilities.
**Formal debt.** EMIs/loans are a distinct type with principal, rate, tenure, amortization schedule and a monthly bill — not mixed with informal IOUs.
**Social care.** Reminder copy is neutral and optional ("Send a reminder to Rahul?" produces a **draft message the user sends themselves** — AIIMIN never messages anyone on the user's behalf; P8-R-261).

#### 8.6.5 Subscriptions & bills

Recurring detection from transaction patterns (≥3 similar amounts at similar intervals) → Offer "Track as subscription?" → subscription object with next-due, category, cancel-URL note. Bills due appear on Today timeline and as reminders (opt-in).

#### 8.6.6 Cross-cutting money details

**States.** Empty (teach: "add one expense or import a statement") · review-queue pending · import parsing · partial parse (some rows failed → shown, not hidden) · offline (local queue) · conflict · error.
**Edge cases.** Duplicate transaction from both SMS and statement → dedupe by `(amount, date±1d, ref)`; flagged for user, not auto-deleted · refunds/negative amounts · split across people · currency other than INR (stored per-tx currency; totals per currency, no fake conversion unless a rate is user-set) · deleting an account with transactions (Veil: reassign or delete) · budget for a deleted category · month with zero income · lend written off then repaid (reopen).
**AI.** Analyzer for categorization; Coach for spend narrative and what-if (pro). Never infers a transaction without a source (utterance, SMS match, statement row, or manual).
**Permissions.** SMS (optional, native), storage (statement upload), camera (receipt).
**Deletion/history.** Per-row delete with undo; import-batch undo; "delete all money data" scoped wipe in Privacy; audit of source on every row (`source` = manual | logger | upi_sms | statement | ocr).

---

### 8.7 People (contacts as real humans) `[ADR-B1]`

**Purpose.** Make the graph feel like life: money, documents, events and notes attach to actual people.
**Why.** Founder requirement; also the mechanism that makes Money and Family stop feeling like spreadsheets.

**Model.** One `people` entity with **roles** (multi): `family`, `friend`, `colleague`, `lender`, `borrower`, `emergency`, `professional`. "Family member" is a role + household flag, not a separate table. (Existing `family_members` migrates in — §9.4.)

**Import options.**

| Source | Platform | Mechanism | Stored |
|--------|----------|-----------|--------|
| Device contacts | native | Contacts picker; **user selects** individuals (no bulk book read by default) | display name, normalized phone (E.164) + hash, email, photo (local ref or uploaded if user opts) |
| Google People | web | Minimal-scope OAuth, explicit "choose people" step | same |
| Manual | both | Form | same |
| vCard | web | File import with preview | same |
| Derived | both | From an utterance ("lent Rahul 500") → proposes creating person "Rahul" | name only until user links |

**Dedupe/merge.** Match on phone hash, then email, then normalized name; `F-04` merge dialog shows both records and what will combine; merge is reversible for 30 days.

**Person detail (F-02).**

```text
Rahul Sharma   friend · +91 •••• 3210          [call] [message] [⋯]
─────────────────────────────────────────────
Money        Rahul owes you ₹2,400  · 2 open
             last: received ₹500 · 2d ago
Documents    1 shared (insurance copy)
Calendar     Lunch — Thu 1:00 PM
Notes        3 notes mention Rahul
Timeline     every linked record, newest first
Care         last called 12 days ago (manual log)
```

**Quick actions.** Call (`tel:`), message (`sms:`/WhatsApp `wa.me` deep link — user-initiated only), add lend, split an expense, schedule follow-up, attach document, add note.
**Graph links.** person ↔ money_lent, transactions, family docs, calendar_events, notes, journal mentions (opt-in linking), english debate partner (no), emergency card.
**Birthdays.** From contacts (if present) or manual → calendar + a single day-of reminder.
**Relationship ledger.** "Last interaction" is derived from records the user creates (call log permission is **not** requested in V1) plus an optional manual "logged a call" action. Framed as care, never as a scoring system; can be hidden entirely.
**States.** Empty (teach: "add one person — Money and Documents get smarter") · importing · merge needed · permission denied · offline (local person creation queued).
**Edge cases.** Two people with the same name (disambiguate by phone/last-4) · person with no phone (allowed) · contact deleted on the phone (AIIMIN copy remains; a badge notes "not in your contacts anymore") · person referenced by an open loan is deleted → Veil: settle/transfer/keep-as-name-only · imported photo (stored only with consent; otherwise initials) · international numbers · person is also the account owner (self) — one `is_self` record used for "me" in splits.
**Permissions.** Contacts (device or Google) — fully optional.
**Privacy.** Never uploaded in bulk; delete-import removes AIIMIN copies and leaves the phone untouched; contacts never used for growth/invites/referral mining (explicit product promise).

---

### 8.8 Family vault + Documents OS `[ADR-B5]`

**Purpose.** Household life-admin that survives emergencies: documents, insurance, health records, vehicles, reminders — and the ability to actually **open** the files.

**Structure (route `/family`, pro+):** People (§8.7) · Documents · Insurance · Health records · Vehicles · Family finance · Reminders · Emergency contacts.

**Documents.**

| Aspect | Design |
|--------|--------|
| Types | ID (PAN/Aadhaar/passport/licence), insurance, health, vehicle, education, property, tax, other |
| Fields | title, type, owner (person), issue/expiry, number (sensitive field), file(s), tags, notes, shared-with |
| Upload | file picker, camera scan (auto-crop, multi-page → single PDF), share-to-AIIMIN |
| Viewer (`F-06`) | **PDF**: paginated, zoom, search, page thumbnails, annotate (highlight + note) · **DOCX**: read-only render, text reflow · **XLSX/CSV**: sheet tabs, frozen header, cell select, formula values (not formulas), export · **images**: zoom/rotate · unsupported type → "Open with…" system handoff |
| Expiry | reminder ladder at −60/−30/−7 days + optional calendar event; expiry badge on row |
| Sensitive fields | masked by default, reveal requires vault unlock, copy clears clipboard after 45s, never logged |
| Sharing | V1 = **visibility rules within the owner's account** (who a doc is *about*/*for*) + explicit export/share sheet. Real multi-user household accounts are POST-V1 (stated plainly in UI) |
| Emergency card | Generates a one-page PDF: blood groups, allergies, insurance numbers, emergency contacts — printable/wallet |

**Vault lock (`F-13`).** Entire Family route is gated by PIN/biometric when `vault_lock=on` (default on for native, opt-in web); auto-relock after 2 minutes background or on app switch; failed attempts backoff (5 tries → 60s).
**Storage & encryption.** Files in object storage with server-side encryption; per-object keys; signed short-lived URLs (≤5 min, single-use); no public buckets ever. Sensitive text fields encrypted at column level. E2E (client-held keys) for vault is **POST-V1** with an explicit key-recovery design (§12.6) — until then the UI says "encrypted at rest", never "end-to-end".
**Health records.** Conditions, allergies, medications, vitals, doctor contacts, reports (documents). **AIIMIN never infers medical facts** (P8-R-223) — these are user-entered only; no diagnosis, no clinical language.
**Vehicles.** RC, insurance, PUC, service log with reminders.
**Reminders.** Any family object can carry a reminder; reminders surface on Today timeline and as (opt-in) notifications.
**States.** Locked · unlocking · empty per tab (teach with one action) · uploading (progress, cancelable) · virus/type rejected · quota exceeded (tier storage cap shown) · viewer unsupported · offline (view cached docs only if previously opened and cached with consent) · shared-link expired.
**Edge cases.** 200MB scan (compress + warn) · password-protected PDF (prompt, never store the password) · corrupted file (honest error + keep the original) · duplicate upload (offer to replace or keep both) · document for a deleted person · expiry date in the past on import (immediate "expired" badge, no notification storm — one summary instead) · vault lock forgotten (PIN reset via account recovery; documented that this does **not** decrypt anything the server cannot already read).
**Permissions.** Storage/files, camera, biometric.
**Deletion/history.** 30-day recycle bin for documents; hard delete purges object + thumbnails + OCR text; access log per document (who/when opened — for a single-user account this is device-level, still useful).

---

### 8.9 English system — AIIMIN English Index (AEI) `[ADR-B2]`

**Purpose.** Measurably improve spoken English (fluency, vocabulary, pronunciation, professional register) with a real level, a real curriculum, and daily 60-second entry cost.
**Why it exists.** Founder need + placement/career linkage; existing `VocalMastery.jsx` + `SpeakingTopics.js` + `lab_speaking_logs` + `vocal_scorecard` provider chain are the seed. V1 promotes this from a Lab experiment to a first-class module inside Lab (no new top-level route).

#### 8.9.1 The index

**AEI = 0–100**, mapped to CEFR bands, computed from six skill branches (each 0–10):

| Branch | Weight | Signals |
|--------|--------|---------|
| Fluency | 0.22 | WPM within target band (110–160), pause count/length, filler rate per minute |
| Vocabulary | 0.20 | unique lemma count, CEFR band distribution of used words, word-bank retention |
| Grammar-in-speech | 0.18 | AI-detected error rate per 100 words (agreement, tense, article, preposition) |
| Pronunciation | 0.16 | accent-pack scores, shadow-match similarity, flagged phoneme improvement |
| Coherence | 0.14 | structure adherence (hook/points/close), discourse markers, on-topic ratio |
| Professional register | 0.10 | performance on HR/technical/meeting prompts |

```text
AEI = round( Σ (branch_score/10 × weight) × 100 )
band: 0–19 A1 · 20–34 A2 · 35–49 B1 · 50–64 B1+ · 65–79 B2 · 80–91 C1 · 92–100 C2
```

**Honesty rules (critical).**
- AEI is `unrated` until **3 completed sessions** (or a placement test). Never show a fabricated number.
- Each branch shows **confidence** (low/medium/high) based on sample size; low-confidence branches are excluded from AEI and shown as "needs 2 more sessions".
- AEI moves with **EWMA** (α = 0.25) over session scores, so one bad day cannot crater it and one lucky day cannot inflate it.
- Decay: after 21 days of no sessions, AEI is shown with an "as of <date>" stamp rather than silently decaying.
- The user can always see **why** a number moved (per-session contribution).

#### 8.9.2 Placement test (`L-07`, ~10 min, optional)

| Part | Task | Measures |
|------|------|----------|
| 1 | Read a 90-word paragraph aloud | pronunciation baseline, WPM, phoneme flags |
| 2 | Speak 60s on a random everyday topic | fluency, vocabulary, coherence |
| 3 | Speak 90s on a professional prompt | register, grammar |
| 4 | One debate exchange (AI counter → user rebuttal) | responsiveness, coherence under pressure |

Output: AEI, skill radar, 3 named weaknesses, and a starting **prescription**.

#### 8.9.3 Session modes (`L-03`)

| Mode | Length | Structure | Primary branches |
|------|--------|-----------|------------------|
| **Spark** | 60s | random topic → speak → scorecard | fluency, vocabulary |
| **Deep** | 3 min | hook 20s → point 1 → point 2 → close (timed section cues) | coherence, register |
| **Debate** | 3–5 min | AI takes the opposing side; 2–3 rebuttal rounds | coherence, grammar |
| **Shadow** | 1–2 min | listen to a reference line → repeat → similarity + timing compare | pronunciation |
| **Word drill** | 30s | new word (from bank/next CEFR band) → use it in a sentence → usage check | vocabulary |
| **Accent pack** | 2 min | phoneme set (e.g. /θ/-/t/, /v/-/w/, word stress, sentence stress) + minimal pairs | pronunciation |
| **Meeting English** | 2 min | standup update, disagreement politely, status escalation | register |
| **Read aloud** | 1–3 min | user's own note/article → pace + clarity | fluency, pronunciation |

Accent target is a **user choice** (`neutral international` default, `US`, `UK`) framed as "target for context", never "fix your accent". No mode is locked behind a mood/level gate other than difficulty of prompts.

#### 8.9.4 Scoring pipeline

```text
record (device) 
  → ASR transcript  [on-device where available; else server ASR with delete-after-scoring]
  → deterministic metrics (WPM, pauses, fillers, unique lemmas, CEFR bands)  ← no LLM needed
  → LLM pass (task `vocal_scorecard`, providers groq → openrouter):
        grammar errors, coherence rating, register rating, 3 upgrade words,
        one rewritten "best sentence"
  → pronunciation: phoneme flags from accent-pack expectations + shadow similarity
  → session score per branch → EWMA into english_index
  → word bank updates (struggled words, new words used)
```

Determinism first: fluency and vocabulary metrics are computed **without** the LLM, so the number is stable and cheap. The LLM adds qualitative feedback. If the LLM is unavailable, the session still scores (branches that need it show "feedback pending", and the session is retried later) — never a lost session.

#### 8.9.5 Scorecard (`L-04`)

Shows: transcript with filler/error highlights · WPM + pause profile · filler count vs your 7-day average · 3 upgrade words with the sentence they'd improve · best sentence rewrite · pronunciation flags with replay of your own audio at that word · branch deltas · "add 4 words to bank" one tap · "next drill" one swipe.

#### 8.9.6 Prescription engine (what to learn next)

Daily prescription = 3 items, generated from gaps:

```text
if filler_rate > 6/min          → Pace drill (Deep, 3min)
if vocab_band mode == B1        → Word drill ×5 (next-band words)
if phoneme_flag(/θ/) recurring  → Accent pack TH (2min)
if register_score < 5           → Meeting English
if interview within 7 days      → HR/technical lane ×2
else                            → Spark (variety topic not seen in 14 days)
```
Total daily cost target **≤ 6 minutes**. Prescription completion satisfies the "English" habit and contributes to the daily minimum.

#### 8.9.7 Goal modes

`placement` · `daily fluency` · `accent` · `meeting English` — each reweights the prescription and the AEI display emphasis (not the AEI formula itself, which stays comparable over time).

#### 8.9.8 System integration (why this beats a standalone app)

| Link | Behavior |
|------|----------|
| Depth / daily minimum | A completed drill can be one of the 3 minimum actions |
| Habits | "English 3 min" habit is auto-ticked by a real session, with the session linked as evidence |
| Career | Application card shows target band; interview in ≤7 days switches the lane and schedules drills |
| Calendar | "Voice practice" blocks; auto-suggested before interview events |
| Journal | Post-session prompt "what felt hard?" (optional, one line) |
| Lab flashcards | Word bank feeds spaced repetition |
| Reports | AEI curve + minutes practiced in weekly/monthly reports |
| Notifications | At most one drill reminder per day, at the user's chosen time |
| Health | Optional "walk & talk": if steps > 500 today, suggest a walking Spark session (motivational tie, never a gate) |

#### 8.9.9 Data, privacy, storage

| Item | Default | Options |
|------|---------|---------|
| Audio | **stays on device**; deleted after scoring unless the user saves it | opt-in encrypted cloud replay (pro), TTL 30 days, delete anytime |
| Transcript | stored (needed for progress + highlights) | can be disabled → numeric scores only |
| Metrics/scores | stored | wiped with "delete English data" |
| Cloud ASR | only if on-device ASR unavailable and user consented | provider must not retain (DPA); audio deleted post-transcription |

**States.** No mic permission · mic busy (call in progress) · too quiet / clipping (live meter + hint) · background noise warning · session interrupted (call/alarm) → partial session saved with a note, not scored · ASR failure → keep audio locally, retry, or let the user self-score (existing sliders as fallback) · offline → session recorded and queued; deterministic metrics computed locally, LLM feedback on reconnect · LLM quota exhausted (tier caps) → deterministic score now + "feedback when quota resets".
**Edge cases.** Non-English speech detected (honest message, no score) · 2-second session (discarded, no penalty) · user reads from a script in a Spark session (flagged as "read-like" only if obvious; never accusatory) · headset/Bluetooth mic latency · two sessions in the same minute · placement test abandoned midway (partial results, resumable) · user with a strong regional accent scoring low on pronunciation → wording focuses on **intelligibility and chosen target**, never "wrong".
**History/deletion.** Full session history with replay of transcripts; per-session delete; "delete all English data" (index + sessions + word bank) in Privacy.
**Other languages.** Hindi and others are **POST-V1**; the schema is language-tagged from day one (`language='en'`) so no migration is needed later. The UI shows "English" explicitly rather than implying general language support.

---

### 8.10 Health signals: steps, distance, screen time, sleep `[ADR-B4]`

**Purpose.** Make the body part of the day's truth without becoming a fitness app.

| Signal | Android source | iOS (POST-V1) | Stored server-side |
|--------|----------------|---------------|--------------------|
| Steps | Health Connect `StepsRecord` (daily aggregate) | HealthKit | daily total |
| Distance (km) | Health Connect `DistanceRecord`; **fallback** `steps × stride` | HealthKit | daily total + `estimated` flag |
| Active minutes | Health Connect | HealthKit | daily total |
| Sleep | Health Connect `SleepSessionRecord` (duration only) | HealthKit | duration + bedtime/waketime |
| Screen time | `UsageStatsManager` (PACKAGE_USAGE_STATS) | **not available** | daily total; top-3 **categories** only if opted; per-app stays on device |

**Stride estimation.** `stride_m = height_cm × 0.415` (walking) when height is known; else 0.75 m default. UI always labels estimated distance with a tap-through explanation and an option to enter a measured stride.
**OEM devices (OnePlus etc.).** No vendor SDKs. Instruction card: install/enable Health Connect and allow the OEM health app to write to it. If only steps are available, distance is estimated.
**Screen time framing.** Shown next to focus minutes as a neutral pair ("Screen 4h 12m · Focus 1h 20m"). Optional daily cap produces **one** calm nudge, never a block. Correlation with focus/sleep appears only in Reports with sample-size honesty.
**Contribution to Depth/Score.** Movement can be one of the 3 daily minimum actions (user choice: e.g. "3,000 steps"). Sleep feeds the Life Score sleep domain. Screen time **never** lowers the Life Score — it is context, not judgment (anti-shame law).
**States.** No permission · Health Connect not installed (install CTA) · no data today (honest "no data yet", not 0 steps as a fact) · stale (last sync time) · permission revoked externally · device without step sensor.
**Edge cases.** Multiple sources double-counting (prefer Health Connect aggregate; dedupe by source priority) · timezone travel (day bucket by user timezone) · phone left at home (low steps — never "you were lazy") · screen time permission granted then revoked (chip disappears, data retained per retention setting) · midnight boundary partial data · user shares phone with family (documented limitation).
**Privacy.** Daily aggregates only; per-app usage and GPS routes never leave the device; disconnect deletes stored aggregates on request.

---

### 8.11 Focus + Discipline (DOM-EXEC, core+)

**Focus.** Intent-first pomodoro: write the intent → choose length (25/50/custom) → ring → optional calendar write-back → session stats. Interruptibility **closed** during a session: no Knocks, no Coach, no upgrade prompts (P8 Ch07 prohibition). Ambient sound optional, off by default. Session end asks one honest question: "did you do what you intended?" (yes/partly/no) — feeds focus quality, never a score penalty.
**Discipline.** Streak with pledge, milestones, toolkit, **urge surfing** (15-min timer, breathing cues, +5 extend, distraction list), slip log with recovery tone, trigger patterns. Never uses the word "relapse" in UI (P5 tone), never sends shame notifications, never displays a "days wasted" counter.
**Streak freeze.** One earned freeze per month prevents a single missed day from breaking a streak; the freeze is visible and manual (user applies it) — no silent falsification of history.
**Links.** Screen-time spike → optional urge-surfing suggestion (one, dismissible). Focus block → calendar. Discipline streak → Depth minimum (user choice).
**Edge cases.** App killed mid-session (session resumed from stored start time; if >2× planned length, ask instead of assuming) · phone call interrupt · two devices running a timer (server-side single active session; second device offers to take over) · slip logged for a past date · timezone change mid-streak.

---

### 8.12 Career, Sports, Lab (other domains)

**Career (`/placements`).** Application kanban (applied → screening → interview → offer → rejected), timeline, resources, resumes (vault-linked, versioned, "sent to X on date"), readiness score, ATS analyzer. Links: interview event → calendar + English drill lane; offer → goal achieved; company → person (referrer).
**Sports (`/sports`).** Cricket/football/basketball/F1 feeds with cache and provider failover (EXISTS). Purely contextual: never generates notifications by default; team favorites from persona; a match day may optionally appear on the timeline.
**Lab (other modules).** Typing, aptitude/quant, STAR method, tech simulator, flashcards (fed by English word bank), system design, decision matrix, reading log, personality. Each module: session → score → history → mastery badge thresholds. Lab has **one** hub and no competing dashboard.

---

### 8.13 Life Score, gamification, and honesty

**Life Score 0–98** across Habits, Journal, Goals, Sleep, Wealth (existing engine + API `/api/intelligence/lhs`). V1 completes the sleep/movement pipeline.

**Honesty rules.** Score is API-computed (SYS-05) · shows per-domain contribution and **what would move it** · never uses a curve that hides bad weeks · 98 (not 100) is intentional — perfection is not claimable · missing inputs reduce **confidence**, not the score, and are labeled.
**XP/ranks/quests.** Retained but subordinate: XP is a texture, the Life Score and Depth are the truth. No loot boxes, no leaderboards, no social comparison (Article III), no confetti for existing (proportional celebration).
**Streaks.** Visible, freezable, recoverable. Never used in a notification that implies loss of worth.

---

### 8.14 Open Loops (the "inbox zero for life")

**Purpose.** One queue of things the system genuinely needs from the human — the antidote to scattered badges.

**Sources.** Unreviewed UPI drafts · unconfirmed AI Offers · unscored/partial English sessions · documents expiring ≤30 days · overdue lend/borrow · calendar conflicts · unresolved sync conflicts · failed imports · unanswered onboarding connection (once) · unread critical notifications.

**Rules.** Maximum **7** items shown; the rest are behind "more". Every loop has exactly **one** primary action and a snooze. Clearing loops contributes to Depth only if the loop represents a real action (not just dismissing). No loop may be created by marketing/upsell.
**Edge cases.** Loop whose underlying record was deleted (loop self-destructs) · loop snoozed 3× (offers "stop asking about this") · loops while offline (only local-resolvable ones are actionable).

---

### 8.15 Search (S-04) — graph query

Single entry: `⌘K` (desktop), search icon (native/tablet). Scope: notes, journal (opt-in — see privacy), transactions, people, documents, habits, goals, events, English sessions, reports.

Ranking: exact person/document match → recency → domain relevance. Result rows show domain + date + snippet + the linked person if any. Query `rahul money` returns transactions + lends + docs mentioning Rahul. Filters: `person:`, `domain:`, `before:`, `after:`, `has:file`.
**Privacy.** Journal is searchable **only** by the user's own query, never indexed into a shared/AI corpus; a setting can exclude journal from search entirely.
**Edge cases.** Very short query (≥2 chars) · zero results (teach: create instead) · offline (searches local cache only, labeled) · large result sets (virtualized, capped at 200 with "refine").

---

### 8.16 Notifications (DOM-SYSTEM, REDESIGN)

**Philosophy (P8 Ch16 + P9 Phase 3).** A notification is a **Knock** — it must earn attention. Interruptibility windows: **Breath (capture)** and **Veil** are closed; Focus is closed; Scan/Command are open.

**Catalog (each independently toggleable, all default-off except the two marked ●):**

| Type | Trigger | Default | Channel |
|------|---------|---------|---------|
| Daily minimum reminder | user-chosen hour, minimum unmet | off | push/local |
| Habit reminder | per-habit time | ● on if the user set a time | local |
| Streak at risk | ≥1 habit streak ends today | off | push |
| Weekly insight ready | Monday generation | ● on | push + in-app |
| Lend/borrow due | due date, then +3d | off | push |
| Bill / subscription due | 2 days before | off | push |
| Document expiry | −30/−7 days | off | push |
| Calendar conflict | sync detects conflict | off | in-app + push |
| Sync failed repeatedly | 3 consecutive failures | on (in-app) | in-app, push after 24h |
| English drill reminder | user-chosen time | off | local |
| Report ready | generation complete | on (in-app) | in-app |
| Security | new device sign-in, PIN changed | **always on** | push + email |
| Billing | payment failed, plan change | always on | email + in-app |

**Global controls.** Quiet hours (default 22:00–07:00) · max 3 non-critical pushes/day · digest mode (bundle into one) · per-type channel choice · one-tap "only security and billing".
**Content rules.** Specific and honest ("₹500 from Rahul is 3 days overdue") · never guilt · **never** include journal content, PIN, document numbers, or amounts if the user enabled "hide amounts in notifications" · deep link to the exact surface.
**Edge cases.** Push token invalid (silently re-register) · notification for a deleted record (opens the domain with "this no longer exists") · device time wrong · user denied OS notifications but enabled types in-app (in-app only, with a one-time hint) · duplicate Google + AIIMIN event reminders (suppressed by default).

---

### 8.17 Settings, Account, Personalization (DOM-CONFIG, MERGE)

`/settings` redirects to `/account` (BR-05). One hub, grouped like the reference: profile card on top, then sections with chevrons/toggles.

| Section | Contents |
|---------|----------|
| Profile | Name, photo, OS-ID (mono credential card + copy), email, timezone, Life Arc, height (for stride) |
| Personalization | Theme (light/dark/**dim**), monotone toggle for chart color, **font scale**, density, reduced motion override, haptics, nav pins (drag), Today widgets, persona preset, sounds |
| Privacy & data | Consent list, privacy dashboard, activity log, export, wipe life data, delete account, journal-in-search toggle, notification content masking |
| Connections | Google (Calendar/Drive/People) per-scope, Health Connect, screen time, SMS money, devices list with revoke |
| Subscription | 4 tiers, current plan chip, upgrade/switch, invoices, AI usage today |
| Security | PIN change, biometric, vault lock, active sessions, sign out everywhere |
| Notifications | Full catalog (§8.16), quiet hours, digest |
| Support & legal | Contact, status, privacy/terms/security/data-deletion, app version + build SHA |

**Edge cases.** Changing timezone rewrites day buckets going **forward** only (history keeps its original day) with an explanatory note · changing OS-ID (allowed once per 90 days; old handle reserved 30 days) · font scale ×1.3 on the densest table (table switches to card rows) · sign out with unsynced items (Veil: "3 items not synced — sync now / discard").

---

### 8.18 Billing and tiers

Same four tiers on website and Android. Android copy is **more aggressive** about capture-power unlocks (sensors, offline, widgets) — web copy emphasises command/analytics. Entitlement is always server-side.

| Tier | Price (list / founding) | Web unlocks | Android unlocks (extra punch) | AI/day |
|------|------------------------|-------------|-------------------------------|--------|
| **Explore** | Free | Today, Depth, Journal, Notes, Calendar, account | Quick capture, Depth, Journal, **1 English Spark/day**, no Health/UPI | 1 |
| **Core** | ₹29 / complimentary waitlist | Habits, goals, finance, focus, Lab English full, sports, discipline, career, Snapshot, journal AI | **Health Connect** steps/sleep · offline mutation queue · home widgets · journal packs · full English | 10 |
| **Pro** | ₹59 / ₹49 | Family+vault, PDF Review, correlations, wealth AI, what-if, cloud voice replay | **UPI on-device review queue** · Documents viewer · People import · vault lock + biometric | 25 |
| **Elite** | ₹99 / ₹79 | Interactive Intelligence, 3 Deep reports/mo, unlimited Standard PDFs | Highest priority for new native capture surfaces · same intelligence as web | 40 |

**Persona → suggested tier (user can still pick any):**

| Persona | Suggested | Why |
|---------|-----------|-----|
| Curious / testing | Explore | Feel Depth + Journal with zero card |
| Student / early pro daily loop | Core | Habits + money + focus + English + Health |
| Household + money + docs | Pro | Vault + UPI + People |
| Power / reports | Elite | Deep intelligence pools |

Rules: show **all four**, never three · founding strikethrough on Pro/Elite · "Recommended" only on Pro · **no purple premium styling** · never "unlimited AI" · downgrade never deletes data · backend entitlement authority (SYS-02) · Android uses Play Billing where store policy requires; web uses Stripe/click-upgrade; both write the same subscription row.
**Edge cases.** Payment failed (grace 7 days, banner not lockout) · refund/chargeback (revert tier, keep data) · store purchase on a different account (link flow) · offline purchase attempt (queued, honest message) · quota exhausted mid-action (current finishes; next blocked with reset time).

---

## 9. Data model — the Life Graph

### 9.1 Principle

P5 IA-1 is already law: **graph over folders**. V1 makes it explicit and queryable. This is not a graph database — it is Postgres with a **typed edge table** plus provenance, which is enough for every product surface described here and keeps operational cost near zero.

### 9.2 Entity classes

| Class | Table(s) | Key |
|-------|----------|-----|
| Person (owner) | `users` | `id` |
| **People** | `people` (new) | `id` |
| Day | `daily_logs`, derived | `(user_id, date)` |
| Habit / HabitLog | `habits`, `habit_logs` | |
| Goal | `goals` | |
| Journal entry | `journal_entries` | |
| Note | `notes` | |
| Event | `calendar_events` | |
| Transaction | `money_transactions` | |
| Lend/Borrow | `money_lent` | |
| Account/Budget/Asset | `accounts`, `budgets`, `wealth_assets` | |
| Document | `family_documents` (+ `documents` view) | |
| Family record | `family_*` | |
| Focus session | `pomodoro_sessions` | |
| Discipline | `discipline_streaks`, `discipline_logs`, `urge_events` | |
| English session | `english_sessions` (new) | |
| English index | `english_index` (new) | |
| Word bank | `english_words` (new) | |
| Health day | `health_days` (new) | `(user_id, date)` |
| Application/Resume | `job_applications`, `resumes` | |
| Report | `reports` | |
| Notification | `notifications` | |
| Consent | `user_consents` (new) | |
| Audit | `data_access_log` (new) | |
| Import batch | `import_batches` (new) | |
| **Edge** | `graph_edges` (new) | |

### 9.3 New tables (V1)

```sql
-- People: contacts as real humans
create table people (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  display_name text not null,
  roles text[] not null default '{}',          -- family|friend|colleague|lender|borrower|emergency|professional
  is_self boolean not null default false,
  household boolean not null default false,
  phone_e164 text,                             -- optional display value
  phone_hash text,                             -- sha256(e164 + per-user salt) for matching
  email text,
  photo_object_key text,
  relationship text,                           -- "mother", "roommate" (free text)
  birthday date,
  notes text,
  source text not null default 'manual',       -- manual|device_contacts|google_people|vcard|derived
  external_ref text,                           -- google resourceName (nullable)
  last_interaction_at timestamptz,
  merged_into uuid references people(id),
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on people (user_id) where deleted_at is null;
create index on people (user_id, phone_hash);

-- Typed edges = the Life Graph
create table graph_edges (
  id bigserial primary key,
  user_id uuid not null references users(id) on delete cascade,
  src_type text not null,      -- 'transaction'
  src_id text not null,
  dst_type text not null,      -- 'person'
  dst_id text not null,
  edge_type text not null,     -- paid_to|received_from|owes|about|attached_to|practiced_for|
                               -- blocks|derived_from|scheduled_for|mentions|settles|serves_goal
  weight real,
  origin text not null default 'user',   -- user|ai|system
  confidence real,                        -- for ai origin
  created_at timestamptz not null default now(),
  unique (user_id, src_type, src_id, dst_type, dst_id, edge_type)
);
create index on graph_edges (user_id, dst_type, dst_id);
create index on graph_edges (user_id, src_type, src_id);

-- Health daily aggregates (no per-app / no GPS)
create table health_days (
  user_id uuid not null references users(id) on delete cascade,
  date date not null,
  steps int,
  distance_m int,
  distance_estimated boolean not null default false,
  active_minutes int,
  sleep_minutes int,
  sleep_start time,
  sleep_end time,
  screen_minutes int,
  screen_top_categories jsonb,   -- only if consented; category level, never per-app by default
  source text,                   -- health_connect|manual|healthkit
  synced_at timestamptz,
  primary key (user_id, date)
);

-- English system
create table english_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  language text not null default 'en',
  mode text not null,             -- spark|deep|debate|shadow|word|accent|meeting|read_aloud|placement
  topic text,
  prompt text,
  duration_seconds int,
  transcript text,                -- nullable when user disables transcript storage
  audio_object_key text,          -- only when cloud replay consented
  wpm real, pause_count int, pause_avg_ms int, filler_count int,
  unique_lemmas int, cefr_band_mix jsonb,
  grammar_errors int, grammar_notes jsonb,
  coherence_score real, register_score real, pronunciation_score real,
  phoneme_flags text[],
  branch_scores jsonb not null,   -- {fluency, vocabulary, grammar, pronunciation, coherence, register}
  ai_feedback jsonb,              -- upgrade words, best-sentence rewrite
  scoring_state text not null default 'complete', -- complete|metrics_only|pending_ai|failed
  linked_application_id uuid,
  created_at timestamptz not null default now()
);

create table english_index (
  user_id uuid primary key references users(id) on delete cascade,
  aei int,                        -- null until 3 sessions
  cefr_band text,
  branch_levels jsonb not null default '{}',   -- 0..10 per branch
  branch_confidence jsonb not null default '{}',
  sessions_count int not null default 0,
  minutes_total int not null default 0,
  goal_mode text not null default 'daily_fluency',
  accent_target text not null default 'neutral',
  last_session_at timestamptz,
  updated_at timestamptz not null default now()
);

create table english_words (
  id bigserial primary key,
  user_id uuid not null references users(id) on delete cascade,
  word text not null,
  lemma text,
  cefr_band text,
  status text not null default 'learning',  -- learning|known|struggling
  times_used int not null default 0,
  first_seen_session uuid,
  next_review_at date,
  unique (user_id, word)
);

-- Consent registry (single source for permissions across surfaces)
create table user_consents (
  id bigserial primary key,
  user_id uuid not null references users(id) on delete cascade,
  scope text not null,        -- contacts|calendar|health|screen_time|sms_money|mic|voice_cloud|
                              -- ai_processing|notifications|camera|analytics|journal_search
  granted boolean not null,
  surface text not null,      -- web|native|system
  purpose_version int not null default 1,
  granted_at timestamptz,
  revoked_at timestamptz,
  device_id text,
  created_at timestamptz not null default now()
);
create index on user_consents (user_id, scope);

-- Data access / automation audit (content-free)
create table data_access_log (
  id bigserial primary key,
  user_id uuid not null references users(id) on delete cascade,
  actor text not null,         -- user|system|ai|integration:google|integration:health
  action text not null,        -- read|write|export|delete|sync|infer
  scope text not null,         -- calendar|contacts|journal|money|health|documents...
  entity_type text, entity_id text,
  surface text,
  detail jsonb,                -- counts and ids only — NEVER content
  created_at timestamptz not null default now()
);
create index on data_access_log (user_id, created_at desc);

-- Import batches (undoable ingest)
create table import_batches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  kind text not null,        -- statement_csv|statement_pdf|vcard|contacts|drive
  source_name text,
  row_count int, accepted_count int, rejected_count int,
  status text not null,      -- parsing|review|committed|undone|failed
  created_at timestamptz not null default now()
);

-- Daily minimum config + depth history (auditable, cheap)
create table day_minimum (
  user_id uuid primary key references users(id) on delete cascade,
  slots jsonb not null       -- [{type:'habit',ref:null},{type:'log'},{type:'movement',target:3000}]
);
create table depth_days (
  user_id uuid not null references users(id) on delete cascade,
  date date not null,
  minimum_met int not null default 0,
  state text not null,
  primary key (user_id, date)
);
```

### 9.4 Migration of existing family members into People

1. Create `people` rows from `family_members` (`roles = {family}`, `household = true`), keeping the original id in `external_ref = 'family_member:<id>'`.
2. Re-point `family_documents.owner_member_id`, `family_health.member_id`, `money_lent.person_*` to `people.id` via a mapping table.
3. Keep `family_members` as a **view** for one release so nothing breaks, then drop.
4. Backfill `graph_edges` for existing links (documents↔person, lends↔person).

Auth/schema changes require explicit Founder instruction (product lock) — this migration is **PLANNED, ADR-gated**.

### 9.5 Provenance and confidence on every AI-touched row

Every table that AI can populate carries: `source` (manual | logger | ai | upi_sms | statement | ocr | integration), `source_utterance` (nullable text), `ai_confidence` (nullable real), `confirmed_by_user` (boolean). This makes P8-R-263 ("person can know automation acted") mechanically true and powers the "why is this here?" affordance.

### 9.6 Row-level security

Every user table: `enable row level security` + policy `user_id = auth.uid()` (or the API's session-derived id when using the service role through the API layer). No table is exposed to clients without RLS. The generic `/api/db/:table` proxy keeps its existing write blocklist and gains a **read allowlist** in V1 (defense in depth).

### 9.7 Soft delete, retention, and purge

| Data | Soft delete window | Hard purge |
|------|--------------------|------------|
| Journal, notes | 30 days recycle bin | immediate on user request |
| Documents + objects | 30 days | purge object + thumbnails + OCR text |
| Transactions | 30 days (or import-batch undo) | on request |
| People | 30 days (merge reversible) | on request |
| English audio | none (deleted after scoring unless saved) | immediate |
| Health aggregates | none | on disconnect if requested |
| Consent/audit rows | retained while account lives (legal defensibility) | on account delete |
| Account delete | tokens revoked immediately, data purge ≤30 days incl. backups | — |

---

## 10. API specification

### 10.1 Conventions

- Base `https://api.aiimin.in/api`
- Auth: session cookie (web) or `Authorization: Bearer` (native), both resolving to one `user_id`
- JSON only; `snake_case` fields; ISO-8601 UTC timestamps; money as integer **paise** in new endpoints (existing decimal endpoints keep their contract until a versioned migration)
- Errors: `{ error: { code, message, retryable, details? } }` with codes `unauthorized`, `forbidden_tier`, `not_found`, `validation`, `conflict`, `rate_limited`, `quota_exhausted`, `upstream_unavailable`, `internal`
- Idempotency: `Idempotency-Key` accepted on all POST mutations (required from mobile)
- Pagination: `?limit=&cursor=`; responses `{ items, next_cursor }`
- Every list endpoint supports `?updated_since=` for delta sync
- Rate limits per existing `rateLimiter.js` families (auth, general, ai, mobile sync, waitlist)

### 10.2 Existing endpoint families (EXISTS — keep contracts)

`/auth/*` · `/google/*` · `/account/*` · `/billing/*` · `/daily-logs/*` · `/journal/*` · `/dashboard/*` · `/habits/*` · `/goals/*` · `/discipline/*` · `/focus/*` · `/calendar/*` · `/notes/*` · `/family/*` · `/wealth/*` · `/lab/*` · `/intelligence/*` · `/sports/*` · `/placements/*` · `/ats/*` · `/waitlist/*` · `/notifications/*` · `/admin/*` · `/cron/*` · `/db/:table` · `/mobile/*` · `/feedback` · `/user/pulse-check` · `/tasks/*`

(Full method/path inventory lives in the repo report and `04_API/`; V1 does not break these.)

### 10.3 New / extended endpoints (V1)

#### People
| Method | Path | Notes |
|--------|------|-------|
| GET | `/people` | `?role=&q=&updated_since=` |
| POST | `/people` | manual create |
| GET | `/people/:id` | includes rollups: `owed_to_you`, `you_owe`, counts per linked domain |
| PATCH/DELETE | `/people/:id` | delete = soft, Veil-gated client-side |
| POST | `/people/import` | body: `{ source, items[] }` — items are **user-selected** contacts only |
| POST | `/people/merge` | `{ keep_id, merge_id }`, reversible 30d |
| POST | `/people/:id/interaction` | manual "logged a call/message" |
| GET | `/people/:id/timeline` | merged linked records, cursor paged |

#### Graph
| Method | Path | Notes |
|--------|------|-------|
| GET | `/graph/edges` | `?src=type:id` or `?dst=type:id` |
| POST | `/graph/edges` | user-created link |
| DELETE | `/graph/edges/:id` | |
| GET | `/graph/context/:type/:id` | one call returning everything linked to an entity (powers person/loan/doc context panes) |

#### Money extensions
| Method | Path | Notes |
|--------|------|-------|
| GET/POST | `/wealth/lending` | list/create lend or borrow |
| PATCH | `/wealth/lending/:id` | status, due date |
| POST | `/wealth/lending/:id/repayment` | partial repayment |
| GET | `/wealth/lending/summary` | per-person net positions |
| POST | `/wealth/transactions/batch` | native UPI review commit (idempotent) |
| POST | `/wealth/imports` | create batch, upload reference |
| GET | `/wealth/imports/:id` | parse status + rows for review |
| POST | `/wealth/imports/:id/commit` | commit accepted rows |
| POST | `/wealth/imports/:id/undo` | delete all rows from batch |
| GET | `/wealth/subscriptions` | detected + confirmed |
| GET | `/wealth/bills` | upcoming dues |

#### Health
| Method | Path | Notes |
|--------|------|-------|
| POST | `/health/days` | upsert daily aggregates (native), idempotent by `(date, source)` |
| GET | `/health/days` | `?from=&to=` |
| DELETE | `/health/days` | scoped delete on disconnect |

#### English
| Method | Path | Notes |
|--------|------|-------|
| GET | `/english/index` | AEI, branches, confidence, goal mode |
| PATCH | `/english/index` | goal mode, accent target |
| GET | `/english/prescription` | today's 3 items, generated server-side |
| POST | `/english/sessions` | create session with deterministic metrics (client-computed or server-computed) |
| POST | `/english/sessions/:id/score` | request LLM feedback (consumes AI quota) |
| GET | `/english/sessions` | history, cursor |
| DELETE | `/english/sessions/:id` | |
| GET/POST | `/english/words` | word bank |
| POST | `/english/placement` | submit placement parts → baseline |
| GET | `/english/certificate` | pro: signed PDF |
| DELETE | `/english/all` | delete all English data |

#### Consent, privacy, audit
| Method | Path | Notes |
|--------|------|-------|
| GET | `/privacy/consents` | current state per scope |
| POST | `/privacy/consents` | `{ scope, granted, surface, purpose_version }` |
| GET | `/privacy/dashboard` | per-tier holdings: counts, bytes, last sync, sources |
| GET | `/privacy/activity` | audit log, cursor paged, content-free |
| POST | `/privacy/export` | async full export job → email/download link (supersedes sync export for large accounts) |
| GET | `/privacy/export/:jobId` | status + signed URL |
| POST | `/privacy/scoped-delete` | `{ domain: 'money'|'english'|'health'|'contacts'|'journal'|'documents' }` |
| POST | `/account/wipe-life-data` | EXISTS (`confirm: "WIPE ALL DATA"`) |
| DELETE | `/account` | EXISTS (`confirm: "DELETE"`) |

#### Documents
| Method | Path | Notes |
|--------|------|-------|
| POST | `/documents/upload-url` | short-lived signed PUT; server records intent |
| POST | `/documents` | finalize metadata after upload |
| GET | `/documents/:id/view-url` | ≤5 min single-use signed GET |
| POST | `/documents/:id/ocr` | queue text extraction (for search + receipt→tx) |
| GET | `/documents/expiring` | `?within_days=30` |

#### Sync (native, extended)
| Method | Path | Notes |
|--------|------|-------|
| GET | `/mobile/bootstrap` | EXISTS — extended with `depth`, `open_loops`, `health_today`, `english_prescription`, `sync_cursor` |
| POST | `/mobile/sync/batch` | EXISTS — mutation types extended (§13.3) |
| GET | `/mobile/sync/pull?cursor=` | **new**: incremental server→client deltas |
| POST | `/mobile/devices` | EXISTS — device registration + push token |
| DELETE | `/mobile/devices/:id` | revoke device |

#### Today
| Method | Path | Notes |
|--------|------|-------|
| GET | `/today` | single aggregated payload: depth, minimum, loops, habits, timeline, health, score, insight ref — one round trip for the most-loaded screen |

### 10.4 Versioning and deprecation

New endpoints are unversioned but additive-only. Any breaking change ships as `/api/v2/...` with a 90-day overlap and a vault ADR. Clients send `X-App-Version` (EXISTS on native) so the server can serve compatible payload shapes and force-upgrade below a floor version.

---

## 11. AI system

### 11.1 Roles (P8 Ch07 — exactly five)

| Role | Jobs in V1 |
|------|-----------|
| **Router** | Universal Logger classification; SMS template → domain; voice command intent |
| **Inferencer** | Fill fields (amount, person, category, date, habit) with confidence |
| **Analyzer** | Post-capture enrichment: transaction categorization, journal tags, note link suggestions, English transcript analysis, correlations |
| **Coach** | Weekly insight, micro-task, at-risk goal narrative, money narrative, English feedback and prescription rationale |
| **Composer** | Goal milestones, Life Arc sharpening, report prose, reminder draft text, best-sentence rewrite |

A sixth role requires a Founder ADR.

### 11.2 Orchestration (mandatory order)

```text
1 raw persist (life entity created)            ← ALWAYS FIRST
2 parse intent (Router)
3 identify target entities (+ graph candidates)
4 kill-list / policy check
5 persist inferred structure (with confidence + provenance)
6 emit telemetry (counts only; never content)
7 surface coaching ONLY IF interruptibility window is open
```

### 11.3 Confidence bands (P8 Ch07)

| Band | Behavior | UI |
|------|----------|-----|
| ≥70% | auto-fill and persist | Settled with correction chips available |
| 40–70% | pre-fill, require confirm | Offer stack with "Confirm" |
| <40% | ask one minimal question | Single question, not a form |
| Safety/legal class | **never infer** | Always ask (meds, allergies, PIN-class, legal/tax categorization) |

### 11.4 Provider routing (extends existing `aiService.js` map)

| Task | Chain | Notes |
|------|-------|-------|
| `universal_log` (Router) | Gemini flash-lite → OpenRouter → Groq | latency-critical; ≤1.5s budget |
| `tx_categorize` (Analyzer) | Groq → OpenRouter | batchable; runs on import |
| `journal_analyze` | Groq → OpenRouter | **opt-in per entry** |
| `vocal_scorecard` | Groq → OpenRouter (EXISTS in map) | wire to the real pipeline in V1 (currently manual sliders — PARTIAL) |
| `debate_turn` | Gemini flash → Groq | conversational latency |
| `weekly_insight` (Coach) | Groq 70B → OpenRouter | scheduled, not interactive |
| `report_prose` (Composer) | Groq 70B → OpenRouter | separate monthly pool |
| `arc_sharpen` | Gemini → Groq | short |
| ASR (transcription) | on-device (Android SpeechRecognizer / Web Speech) → server ASR fallback | consent-gated |

Every call is logged to `api_usage_log` with tier-aware quota checks (`apiUsageService.js` EXISTS) and per-provider global ceilings.

### 11.5 Streaming, latency, and fallback

- Interactive tasks stream tokens; the UI shows partial text with a "thinking" **signal** (never labeled Hold, never blocking Catch).
- Hard budgets: Router 1.5s, debate turn 3s, scorecard 8s, insight 30s (background job).
- On timeout: fall to the next provider once, then degrade honestly ("feedback pending — will finish in the background") and enqueue.
- Deterministic fallbacks exist for the important paths: logger without AI still saves raw text; English session still scores on deterministic metrics; transactions still import uncategorized.

### 11.6 Prompt minimization and privacy in prompts

| Task | Sent to provider | Never sent |
|------|------------------|------------|
| `universal_log` | the single utterance + a compact domain schema | history, other entities, names not in the utterance |
| `tx_categorize` | merchant string, amount, date | account numbers, full statement, person identifiers |
| `journal_analyze` | **only the entry the user asked about** | other entries, mood history, identifiers |
| `weekly_insight` | numeric aggregates + habit/goal names | journal text, document contents, contact details, amounts if masking on |
| `vocal_scorecard` | transcript of that session | audio (unless cloud replay consented), other sessions |
| `report_prose` | aggregates and labels | raw journal, raw transactions |

Rules: no user identifiers (email, OS-ID, phone) in prompts — a per-request opaque id only · no PIN/document numbers ever · **journal-class content never enters analytics or insight prompts** (P8-R-219) · zero-retention/no-training terms required from providers (contract obligation; recorded in `07_DEPLOYMENT`).

### 11.7 Memory

Durable "memory" is the **life graph itself** — not a chat transcript silo (P8 Ch07 prohibition). Coach reads facts from entities; there is no hidden profile the user cannot inspect. Anything the AI "remembers" must be visible as a record the user can edit or delete.

### 11.8 Trust UX for AI

Every AI-produced element shows: what it is, **where it came from** ("from your text", "from 12 transactions"), confidence when <70%, and Accept / Adjust / Dismiss. Insights link to source records (`R-06` provenance drawer). AI never changes auth, billing, tier, permissions, or deletes anything (P8-R-230/256/261). Automation failure is stated, never hidden (P8-R-265).

### 11.9 AI off mode

A single Personalization toggle disables all outbound AI calls. In that mode: logger saves raw text with a manual domain picker; transactions import uncategorized; English scores on deterministic metrics; insights are rule-based summaries clearly labeled "computed, not written by AI". No feature becomes invisible — each states what it would add.

### 11.10 Abuse and safety

Prompt-injection defense: user content is never treated as instructions (system prompts pinned; content wrapped and escaped; tool use restricted to a fixed allowlist). No tool can write outside the requesting user's rows. Output filters block clinical/diagnostic framing, self-harm advice (replaced with a resource message and a human handoff line), and financial/legal directives (reframed as "consider" + "verify with a professional"). Rate/abuse: per-user caps, per-IP caps, and a global provider circuit breaker.

---

## 12. Privacy and trust architecture (highest priority chapter)

### 12.1 Tiered Privacy Architecture (TPA)

Every field in the product is classified at design time. A feature cannot ship without its tier recorded.

| Tier | Contents | Default handling | Encryption | In prompts? | In analytics? |
|------|----------|------------------|------------|-------------|---------------|
| **T0 Public** | Waitlist email, marketing metrics | Consent for non-essential analytics | TLS + at rest | no | aggregate only |
| **T1 Account** | Auth, OS-ID, tier, sessions, devices | Required for service | TLS + at rest; PIN hashed | no | counts only |
| **T2 Life OS** | Habits, goals, tasks, calendar meta, transactions, budgets, reports | Cloud sync; export; wipe | TLS + at rest (RLS) | aggregates only | aggregates only |
| **T3 Sensitive** | Contacts, UPI-derived, voice, health, screen time | **On-device first**, opt-in cloud, revocable | TLS + at rest; raw never stored | minimal, purpose-bound | never raw |
| **T4 Ultra** | Journal body, vault documents, family IDs/health, PIN | Strictest: no analytics, no telemetry, column/object encryption; **E2E roadmap** | at rest + column/object level | only on explicit user request, per item | **never** |

### 12.2 Per-domain option matrix and V1 choice

| Domain | Options | **V1 default** | Rationale |
|--------|---------|----------------|-----------|
| UPI money | (a) on-device parse, upload structured (b) server parse, discard raw (c) manual/statement only | **(a)**, with (c) always available | Raw SMS never leaves the device; trust and Play compliance |
| Contacts | (a) device picker, store name+hash (b) Google People minimal (c) manual | **(a)** + (c); (b) optional on web | No bulk upload; no growth mining |
| Voice/English | (a) audio local, sync scores+transcript (b) encrypted cloud replay (c) cloud ASR delete-after | **(a)**; (b) opt-in Pro; (c) only if no on-device ASR and consented | Audio is the most intimate signal |
| Health | (a) daily aggregates (b) full records | **(a)** | Aggregates satisfy every product surface described |
| Screen time | (a) daily total server, detail local (b) full upload | **(a)** | Per-app usage is highly revealing |
| Journal | (a) at-rest encryption + excluded from analytics (b) E2E with device keys | **(a)** in V1; **(b)** roadmap with key recovery | E2E without recovery UX loses user data |
| Documents | (a) server-side encrypted objects, signed URLs (b) client-side encryption | **(a)** in V1; (b) with vault E2E | Viewer/OCR requires server access in V1 |
| AI | (a) no training + prompt minimization (b) AI off | **(a)** with (b) toggle | — |
| Analytics | (a) consent-gated GA4/Sentry with scrubbing (b) none | **(a)** — consent first, off until granted | Launch blocker in Home is satisfied honestly |

### 12.3 Consent architecture

- **Registry:** `user_consents` (§9.3) is the single source; both web and native read/write it. A scope with no granted row is treated as denied, everywhere.
- **Purpose versioning:** if the purpose text changes materially, `purpose_version` increments and the user is re-asked in context (not with a blocking modal).
- **Revocation:** immediate effect; the client stops collecting, the server stops accepting that scope's writes, and the user is offered scoped deletion of what was collected.
- **OS vs product consent:** an OS permission is necessary but not sufficient — the product-level consent row must also exist. Revoking in product does not require revoking in the OS (and vice versa the UI explains both).
- **No dark patterns:** equal visual weight for allow/deny; deny is never a dead end; no repeated prompting (max once per 30 days, in context).

### 12.4 Privacy dashboard (`G-04`) — user-facing

```text
What AIIMIN holds                                    Export ⤓   Delete ⌫
──────────────────────────────────────────────────────────────────────
Account            email, OS-ID, plan                         required
Life OS            1,284 records · 2.4 MB       [Export] [Wipe life data]
People             12 people · from your picks   [Delete imported]
Money              847 transactions · 3 lends   [Delete money data]
  UPI reading      ON · 0 raw messages stored   [Turn off]
Health             daily totals since 12 Jun    [Disconnect] [Delete]
Screen time        daily totals only            [Turn off]
English            41 sessions · audio: on device [Delete English data]
Documents          9 files · 14 MB · encrypted  [Open vault]
Journal            excluded from analytics       [Exclude from search]
AI                 ON · 6 of 25 calls today     [Turn AI off]
Connections        Google Calendar, Drive        [Manage]
Devices            Pixel 8 (2h ago), Mac (now)   [Revoke]
Activity log       last 30 days, content-free    [View]
```

Every row answers: what, how much, where it lives, and how to stop it. Numbers come from `/privacy/dashboard` and must be real (no estimates presented as facts).

### 12.5 Activity log

`data_access_log` records actor/action/scope/entity-id/counts — **never content**. Surfaced as: "Calendar synced · 14 events · 09:02 · Pixel 8", "Weekly insight generated · used 12 aggregates · 06:00", "Export downloaded · Mac · 21:14". Retained while the account exists; included in export; purged on delete.

### 12.6 Encryption plan

| Layer | V1 | Roadmap |
|-------|-----|---------|
| Transit | TLS 1.2+ everywhere; HSTS; certificate pinning on native for `api.aiimin.in` | — |
| At rest (DB) | Managed encryption + column encryption for OAuth tokens (EXISTS), document numbers, health notes | — |
| At rest (objects) | Server-side encryption, per-object keys, private buckets, signed short-lived URLs | client-side encryption for vault |
| Journal | at-rest + analytics exclusion; `encrypted_content` column already used on the native path | **E2E** with device keypair + recovery kit (24-word phrase or platform keystore + printable recovery code); explicit warning that lost keys = lost data; search becomes local-only for E2E content |
| Secrets | host env / secret manager only; never in vault or git | rotation schedule |

**Claim discipline:** until E2E ships, the product says "encrypted in transit and at rest" — never "end-to-end", never "we can't read it" (which would be false).

### 12.7 Website ↔ app trust unity

| Requirement | Implementation |
|-------------|----------------|
| One policy | `/privacy` defines Services = website + web app + `/m` + native + API; one document, per-surface sections for permissions |
| One account, one control panel | Account → Privacy is the master; native mirrors the toggles it can affect and deep-links the rest |
| Store disclosure parity | Play **Data safety** form generated from the same source table as `/privacy` (a checklist in `07_DEPLOYMENT`), reviewed on every release that changes scopes |
| Scope separation | Google **login** OAuth ≠ Calendar OAuth ≠ People OAuth — three separate consent moments (login already separate — EXISTS) |
| Marketing vs product | Waitlist analytics are consent-gated and never joined to product identity; no cross-site tracking; no third-party pixels on product routes (Privacy.jsx already claims none — keep it true) |
| Identical delete/export | Same API, same result, regardless of surface (SYS-06) |
| Session honesty | Devices list shows every active session with revoke |

### 12.8 Compliance targets

| Framework | V1 obligations |
|-----------|----------------|
| **India DPDP** | Notice + purpose limitation, verifiable consent, data-principal rights (access, correction, erasure, grievance), **grievance officer contact published**, breach notification process, retention limits |
| **Google API Services User Data Policy (Limited Use)** | Already asserted in Privacy.jsx — re-audit for Calendar write + People scopes; no ads, no human reading, no model training on Google user data |
| **Play Store** | Data safety form; SMS/Call-Log policy justification (money reading is a **core feature** declaration with in-app disclosure before the permission); Health Connect declared use; sensitive permission review |
| **GDPR-ready** | Lawful basis table, DPA with subprocessors, export/erasure, records of processing |
| **Children** | Age gate (13/16/18 decision open — see §22); product is not directed at children |

### 12.9 Threat model (abbreviated)

| Threat | Mitigation |
|--------|------------|
| Stolen device | PIN + biometric, vault auto-relock, remote session revoke |
| Session theft | Short-lived cookie cache, secure/httpOnly/SameSite, device binding on native, revoke-all |
| IDOR | RLS + server-side `user_id` derivation only (never client-supplied), automated tests per endpoint |
| SQL injection | Parameterized queries only; the generic `/db/:table` proxy validated against allowlists |
| Prompt injection | §11.10 |
| Malicious upload | Type/size validation, no execution, image/PDF sanitization, virus scan hook, never serve from a user-controlled path |
| Signed-URL leakage | ≤5 min, single-use, no directory listing |
| Rate abuse / cost attack | Per-user and per-IP limits, AI quotas, provider circuit breaker, cost alarms |
| Insider access | Least privilege, no production data in dev, access logged; support access requires user-initiated request |
| Backup exposure | Encrypted backups, restore drill documented, purge propagation ≤30 days |
| Open SSH (current) | **Fix in V1:** restrict port 22 to a known IP/SSM Session Manager (see §14.7) |

### 12.10 Do-not list (privacy)

Never sell/share lifelog · never train models on user data · never upload raw SMS or full contact books · never claim E2E without recovery · never differ delete behavior by surface · never enable analytics before consent · never put journal content or document numbers in notifications, logs, or prompts for analytics · never request Location or Call Log in V1 · never use contacts for invites/growth.

---

## 13. Synchronization and offline architecture

### 13.1 Model choice

**Per-entity last-write-wins with field-level merge for a named set, plus explicit conflict UI for calendar and documents.** CRDTs are rejected for V1: the entity set is mostly append-only or single-owner, and CRDT complexity would not pay for itself. This is a deliberate, documented trade-off (native doc 12 lists the options).

| Entity | Strategy |
|--------|----------|
| Habit tick | Idempotent set operation on `(habit_id, date)` — conflict impossible |
| Daily log | Field-level merge (last writer per field) |
| Journal / Note | Body is single-owner; if both sides changed since base → **keep both** (creates a `(conflict copy)` with a banner) — never destroy text |
| Transaction / Lend | Last-write-wins on scalar fields; repayments are append-only |
| Calendar event | Compare-and-set on `etag`; on divergence → `ConflictResolver` |
| Document metadata | LWW; the **file object is immutable** (new version = new object) |
| English session | Append-only |
| Health day | Idempotent upsert by `(date, source)` |
| Settings/consents | LWW with server timestamp authority |

### 13.2 Client architecture

| Client | Local store | Queue | Trigger |
|--------|-------------|-------|---------|
| Web (desktop/tablet) | In-memory + IndexedDB cache for reads; **optimistic UI** | outbox in IndexedDB | on action, on reconnect, on focus |
| `/m` phone web | IndexedDB log queue (EXISTS) | same | reconnect |
| Native | Room (EXISTS) | mutation outbox + WorkManager (EXISTS) | on action, periodic 15m, on connectivity, on app open |

### 13.3 Mutation types (extend `/mobile/sync/batch`)

EXISTS: `habit.tick`, `journal.upsert`, `note.upsert`.
V1 adds: `dailylog.upsert`, `transaction.create`, `transaction.update`, `lend.create`, `lend.repayment`, `focus.session`, `discipline.log`, `urge.event`, `english.session`, `health.day`, `document.meta`, `person.create`, `person.interaction`, `loop.resolve`, `consent.set`, `event.upsert`, `event.delete`.

Envelope:
```json
{ "mutations": [ { "id": "uuid-v4 client", "type": "lend.create",
                   "payload": { }, "client_mutated_at": "2026-07-30T15:04:05Z",
                   "base_version": 3 } ] }
```
Response per item: `{ id, ok, server_id?, version?, error?, conflict? }`. Batch max **50**; client chunks larger queues. `Idempotency-Key` guarantees replay safety (`mobile_idempotency`, 48h TTL — EXISTS).

### 13.4 Pull path

`GET /mobile/sync/pull?cursor=` returns `{ changes: [{type, id, op, data, version}], next_cursor, server_time }`. Cursor is an opaque monotonic marker (updated_at + id). Full re-bootstrap if the cursor is older than the retention window (30 days) or after a schema epoch bump.

### 13.5 Honest offline semantics (P9 law)

| Situation | UI |
|-----------|-----|
| Write while offline | **Settled locally + Hold badge**; Sync pill shows "3 held" |
| Read while offline | Cached values with "as of HH:MM" |
| AI while offline | Disabled with reason ("needs connection"), never a spinner that never ends |
| Sync succeeds | Hold → Settled, count decrements, single light haptic |
| Sync partially fails | Per-item error listed in the Sync tray with retry; the rest settle |
| Conflict | Explicit resolver; nothing silently overwritten |
| Repeated failure | After 3 attempts, a persistent (non-modal) banner + Open Loop |

Never: claim remote Settle while offline (forbidden state pair) · silent data loss · a spinner as the only offline indication.

### 13.6 Cross-device continuity guarantees

| Guarantee | Mechanism |
|-----------|-----------|
| Log on phone appears on desktop within one cycle | push-triggered pull or 15-min periodic + on-focus |
| Tier change on web reflects on phone at next bootstrap | entitlement in bootstrap payload |
| Depth/score identical on both | server-computed only (SYS-05) |
| Unsettled Pulse survives a crash | Drift restore card on next open |
| Two devices editing the same note | keep-both with banner |
| Clock skew | server time authoritative for ordering and day boundary |

---

## 14. Backend and cloud architecture (efficient, not cheapest)

### 14.1 Current state

Node (Hono) on a **single EC2** instance behind `api.aiimin.in`, Supabase Postgres, Vercel frontend, Upstash Redis, Vercel Blob + two empty S3 buckets, GitHub Actions deploys, PM2 process management. Known risks: root disk 97% full, SSH open to `0.0.0.0/0`, no CloudWatch alarms/SNS, single point of failure, no autoscaling.

### 14.2 Target V1 topology (optimized for reliability, latency, and future AI load)

```text
                         Route 53 (aiimin.in, api.aiimin.in)
                                     │
        ┌────────────────────────────┴───────────────────────────┐
        ▼                                                        ▼
   Vercel (web app, edge CDN)                        CloudFront (API + assets)
   - static + SSR-less SPA                                  │  WAF (rate, geo, bot)
   - preview per PR                                         ▼
                                              ALB (ap-south-1, 2 AZ, TLS 1.2+)
                                                            │
                                          ┌─────────────────┴─────────────────┐
                                          ▼                                   ▼
                             ECS Fargate service "api"            ECS Fargate service "worker"
                             (2 tasks min, autoscale 2→8)         (queue consumers, 1→4)
                                          │                                   │
                                          ├── Secrets Manager / SSM Params    │
                                          ├── ElastiCache or Upstash Redis ───┤ (cache, rate, locks)
                                          ├── SQS: ai-jobs, sync-fanout, ─────┤
                                          │        imports, notifications      │
                                          ├── S3: aiimin-vault (docs, KMS SSE) │
                                          │   S3: aiimin-exports (lifecycle 7d)│
                                          │   S3: aiimin-uploads (staging 1d)  │
                                          └── Supabase Postgres (primary)      │
                                                    │ read replica (reports)   │
                          EventBridge Scheduler → SQS → worker (cron jobs)     │
                          CloudWatch logs/metrics/alarms → SNS → email/Slack ──┘
```

### 14.3 Why each service (explicit justification)

| Service | Chosen because | Alternative rejected because |
|---------|----------------|------------------------------|
| **ECS Fargate** (not EC2, not Lambda) | No host patching, per-task isolation, rolling deploys, autoscale on CPU/requests; keeps the existing long-lived Node/Hono app unchanged; predictable latency (no cold starts) for the Router path | **EC2**: current single-instance risk, manual patching, disk-full incidents. **Lambda**: cold starts hurt the 1.5s Router budget; long AI streaming and PDF generation fit poorly; per-request pricing is worse at steady traffic |
| **ALB + 2 AZ** | Health checks, zero-downtime deploys, TLS termination, WebSocket-capable if needed later | Single instance = single point of failure |
| **CloudFront + WAF** | Global TLS termination close to user, DDoS/bot/rate protection ahead of compute, cheap caching for public GETs (sports feed, waitlist count) | Direct-to-ALB exposes origin, no edge caching |
| **SQS + worker service** | Moves AI scoring, imports, OCR, PDF generation, notification fan-out, and weekly insight generation off the request path; retries with DLQ; smooths provider rate limits | In-process background work dies with the container and cannot retry safely |
| **EventBridge Scheduler** | Replaces cron-on-a-box (`deploy/cron.sh`); no missed jobs when an instance recycles; per-job IAM | Crontab on EC2 is invisible and unmonitored |
| **S3 + KMS** | Durable object storage for vault documents, resumes, exports; lifecycle rules; signed short-lived URLs; separate buckets per sensitivity | Vercel Blob is fine for small resumes but weaker for KMS/lifecycle/vault-grade control (keep Blob only for legacy resume paths during migration) |
| **Supabase Postgres + read replica** | Keeps existing schema, RLS, and migrations; replica isolates heavy report/correlation queries from interactive traffic | Self-managed RDS adds ops burden with no product gain today |
| **Redis** (Upstash now, ElastiCache when in-VPC latency matters) | Rate limiting (already in use), hot caches (bootstrap, sports, tier), distributed locks for cron and single-active-focus-session | DB-only rate limiting adds write load to Postgres |
| **Secrets Manager / SSM** | Rotation, audit, no secrets in env files on a box | `.env` on EC2 is unauditable |
| **CloudWatch + SNS** | Alarms on API 5xx, p95 latency, queue age, DLQ depth, AI spend, DB connections, disk/task health — closes the current gap | No alarms = silent outages (present state) |
| **ap-south-1 (Mumbai)** | India-first users: lowest latency; aligns with the DPDP data-locality narrative; keep Supabase in the same region | Cross-region hops add 100–200ms per call |

### 14.4 Cost-efficiency (efficient use, not cheap-out)

- Fargate **ARM (Graviton)** tasks: ~20% better price/performance for Node.
- Right-size tasks (0.5 vCPU / 1 GB) and scale on request count, not CPU alone.
- Cache aggressively where the data is not personal: sports feed, waitlist count, provider metadata (CloudFront + Redis).
- The `/today` aggregate endpoint removes 6–8 round trips on the most-loaded screen (bandwidth + latency + cost win).
- Deterministic-first AI: fluency/vocab metrics, categorization heuristics, and correlations run **without** LLM calls; the LLM is used where it adds judgment. This is the single biggest AI cost lever.
- Provider ladder (lite → heavy) plus per-tier daily caps and global provider ceilings (EXISTS) prevent runaway spend.
- Batch AI work in the worker (categorize 200 rows in one call, not 200 calls).
- S3 lifecycle: exports expire in 7 days; upload staging in 1 day; vault objects Standard-IA after 90 days.
- Log retention 30 days hot, then compressed to S3 (Athena for rare queries).
- No idle GPU, no vector DB in V1 (search is Postgres full-text + trigram; add pgvector only when a real semantic-search feature is specified).

### 14.5 Migration path (no big-bang)

| Phase | Action | Risk control |
|-------|--------|--------------|
| 0 | Fix the current fire: expand/clean EC2 disk, lock SSH to SSM/known IP, add CloudWatch alarms + SNS | Immediate, no architecture change |
| 1 | Containerize the API (Dockerfile), push to ECR via existing GitHub Actions | Same code, verified locally |
| 2 | Stand up ALB + Fargate in parallel; run both; shift `api.aiimin.in` DNS with a low TTL; keep EC2 warm for rollback | Instant rollback by DNS |
| 3 | Introduce SQS + worker; move weekly insight, report PDFs, imports, OCR, notification fan-out off the request path | Feature-flagged per job |
| 4 | EventBridge replaces `cron.sh`; delete crontab | Verify each job's last-run metric |
| 5 | CloudFront + WAF in front | Monitor cache-hit and 4xx |
| 6 | Move vault objects to S3 + KMS; dual-read during migration | Checksums verified before cutover |
| 7 | Add read replica; point reports/correlations at it | Compare query plans |
| 8 | Decommission EC2 | After 2 weeks clean |

### 14.6 Environments

| Env | Purpose | Data |
|-----|---------|------|
| `local` | Dev | seeded synthetic only |
| `preview` (Vercel per PR + Fargate dev service) | Review | synthetic |
| `staging` | Release candidate, E2E, load smoke | synthetic + a small anonymized set |
| `production` | Live | real |

**Never** copy production data into non-production. Seed scripts generate realistic synthetic accounts (the existing `/seed-data` becomes a dev-only tool).

### 14.7 Security hardening checklist (V1 exit criteria)

SSH via SSM only (port 22 closed) · WAF managed rules + rate limits · least-privilege task roles (no wildcard S3) · KMS CMK for vault bucket · Secrets Manager with rotation for DB/AI keys · TLS 1.2+ and HSTS · certificate pinning on native · dependency scanning (Dependabot) + `npm audit` gate in CI · container image scanning in ECR · quarterly restore drill from backup · signed release APK with Play App Signing · IDOR test suite green on every endpoint.

### 14.8 Reliability targets

| Metric | Target |
|--------|--------|
| API availability | 99.5% monthly (single-region, 2 AZ) |
| p95 latency (`/today`, bootstrap) | < 400 ms in-region |
| p95 latency (Router AI) | < 1.5 s |
| Sync batch success | > 99.5% (excluding client offline) |
| RPO / RTO | 24 h / 4 h (documented, drill-verified) |
| Error budget policy | If 5xx > 0.5% for 1 h, feature work pauses until fixed |

---

## 15. Website and app as one system

### 15.1 Job split

| Job | Website (public) | Web Life OS | `/m` | Native |
|-----|------------------|-------------|------|--------|
| Acquire, explain, price | ✅ | — | — | — |
| Waitlist / OS-ID reservation | ✅ | — | — | — |
| Legal, brand, storage ledger | ✅ | link | link | link |
| Sign in | ✅ | ✅ | ✅ | ✅ |
| Full command + analytics | — | ✅ | ✗ | partial (reads) |
| Deep editing (goals, reports, budgets) | — | ✅ | ✗ | limited |
| Fast capture | — | ✅ | ✅ | ✅ |
| Health, screen time | — | read | ✗ | **source** |
| UPI money reading | — | read | ✗ | **source** |
| Voice / English drills | — | ✅ (browser mic) | ✗ | ✅ (best) |
| Documents: view | — | ✅ | ✗ | ✅ |
| Documents: scan | — | upload | ✗ | **camera** |
| Billing / tier change | — | ✅ | ✗ | Store or link to web |
| Export / delete account | — | ✅ (master) | ✗ | initiate → confirms via web |
| Consent toggles | — | ✅ (master) | ✗ | mirrors + OS-level |
| Widgets, biometric unlock | — | — | — | ✅ |

### 15.2 Identity and session continuity

One `user_id`; OS-ID is a public handle, not a second account. Sign-in on any surface creates a session bound to that surface; the Devices list shows all of them with revoke. Web↔native handoff uses the same Better Auth session (native CookieJar — EXISTS). Deep links from marketing emails land on the web app; if the native app is installed, Android App Links open it (verified `assetlinks.json`).

### 15.3 Onboarding across surfaces

Waitlist email → approval → first login (web or native) → onboarding runs **once**, server-persisted. If a user starts on the phone and continues on desktop, the desktop resumes at the same step. Native-only asks (health, screen time, biometric, widgets) appear on first native launch even if web onboarding is complete, framed as "3 things only your phone can do".

### 15.4 Settings consistency

Account → Privacy/Personalization/Notifications is the **master**. Native shows the same sections; anything it cannot change (billing, export download, account deletion final confirm) opens the web surface in a system browser with the session handed over via a one-time token. Nothing is silently different between surfaces; where a control is unavailable, the reason is stated.

### 15.5 Subscriptions across surfaces

Backend is the entitlement authority. Web uses Stripe (or click-upgrade in the current mode); native uses Play Billing where store policy requires it; both write to the same subscription record, and the client renders the plan chip from the server value only. Restoring purchases re-reconciles server-side. Tier is never cached beyond the bootstrap cycle.

### 15.6 Notifications across surfaces

Native = push (FCM) + local; web = in-app + email for critical; `/m` = in-app only. The **type registry and quiet hours are shared**, so muting "streak at risk" mutes it everywhere. Security and billing notifications go to email regardless of surface.

### 15.7 Brand continuity

Split brand lockup is identical everywhere (mark → `/brand`, wordmark → Today). Waitlist and product share the same **tokens** but not the same layout components (T8 isolation) so marketing polish never leaks template chrome into the OS, and product density never makes the marketing site feel like a dashboard.

---

## 16. States, errors, and edge cases

### 16.1 Required state coverage

Every surface must implement the applicable subset: `ST-LOAD, ST-PART, ST-BG, ST-AI, ST-EMPTY, ST-OK, ST-FAIL, ST-EXP, ST-FRESH, ST-OFF, ST-CONN, ST-SYNC, ST-AUTH, ST-SESS, ST-PERM, ST-UNDO, ST-RETRY, ST-RECOV, ST-CONF`. A missing applicable state is a **defect**, not a polish item (SA-*). A per-surface state matrix is the acceptance artifact for QA (§19.3).

### 16.2 Error message contract

Four parts, always: **what happened · what it means for your data · what to do now · a way out**.

| Bad | Good |
|-----|------|
| "Something went wrong" | "Couldn't reach the server. Your entry is saved on this device and will sync — 1 item held. Retry now?" |
| "Error 500" | "Our side failed while saving your budget. Nothing was changed. Try again, or copy the details for support." |
| "Sync failed" | "Google refused the last 3 syncs (permission changed). Reconnect Google Calendar to continue; your AIIMIN events are untouched." |

### 16.3 "What happens if…" register

**Connectivity / device**
- Offline at first launch → login impossible; explain honestly, offer retry; nothing pretends to work.
- Offline mid-onboarding → steps that write locally continue; connection steps are deferred with a "finish later" card.
- Airplane mode for a week → queue persists; on reconnect chunked batches with progress; conflicts surfaced.
- Device storage full → local queue write fails → banner "can't save locally, free space"; never lose the in-memory entry without warning.
- Low battery / doze mode → WorkManager honors constraints; sync resumes; no false "synced" claim.
- App killed during a Veil action → nothing was committed (Veil commits are atomic server-side).
- Clock set wrong → server time wins; a one-time notice if skew > 10 min.
- OS upgrade removes a permission → the feature degrades with a re-consent card, data retained per settings.

**Auth / account**
- Session expires mid-edit → local draft preserved, re-auth inline, then the write completes.
- PIN forgotten → email-based reset; explicitly states that it does not decrypt E2E content (when E2E ships).
- Email changed at the provider → re-verify.
- Two devices, PIN changed on one → other sessions invalidated, security notification sent.
- Waitlist not approved → Pending screen, not an error.
- Account deleted then the user returns → new account, prior data gone (stated in the delete Veil).
- Google account revoked externally → Reconnect state per integration; login unaffected if login used a different provider.

**Data / integrity**
- Duplicate entity from two sources → dedupe proposal, never silent deletion.
- Conflicting edits → resolver; text never destroyed.
- Import with 40% unparsable rows → those rows shown as rejected with reasons; the rest importable.
- Currency mismatch in totals → per-currency subtotals, no invented conversion.
- Deleting a person with open money → Veil offering settle / reassign / keep as name.
- Deleting a habit with a 200-day streak → Veil showing exactly what will be lost; archive offered first.
- Timezone move → forward-only day bucketing with a notice.
- Leap day / DST → covered by test fixtures.
- Very large account (10k transactions, 500 documents) → pagination, virtualized lists, async export.

**AI / quota**
- Provider down → next provider once, then honest degrade + queued retry.
- Quota exhausted → the current action finishes; the next is blocked with the reset time and an upgrade path stated without pressure.
- AI returns nonsense/off-schema → schema validation rejects it; user sees "couldn't structure that — saved as text" (the raw entry is already safe).
- AI proposes a duplicate → dedupe check before the Offer.
- User disabled AI → all paths still function (§11.9).

**Payments**
- Card fails → 7-day grace, banner, no data lockout, no feature "trap".
- Store purchase not reflected → "Restore purchases" + server reconcile, with a support path.
- Refund → tier reverts, data intact, gated features become read-only with export.

**Platform-specific**
- Health Connect not installed → install CTA, manual fallback.
- SMS permission granted but no bank templates match → silent no-op (never blame the user).
- Screen-time API unavailable (iOS) → chip hidden, no broken promise in the UI.
- Mic in use by a call → session cannot start; clear reason.
- Predictive back mid-sheet → sheet dismisses, draft kept as Drift.
- Foldable / split-screen → layout uses container queries; the Today spine reflows to one column.
- Android 15+ edge-to-edge insets → safe-area padding on bottom nav and sheets.

**Abuse / safety**
- User writes self-harm content in the journal → no diagnosis, no alarm UI; a single, quiet, dismissible resource card (region-appropriate), never repeated, never a notification, never sent to analytics.
- Repeated failed PIN → backoff, then email alert.
- Automated scraping of the API → WAF + rate limits + anomaly alarm.

---

## 17. Analytics, telemetry, and observability

### 17.1 Product analytics rules

Consent-gated (off until granted), **event-count only**, no content, no journal, no document, no PIN, no amounts, no contact identifiers. Events use a fixed schema registry (name, surface, tier, anonymized user hash). GA4 and Sentry initialize **only after** consent (this closes the launch blocker honestly).

**Core event set (V1):** `app_open`, `onboarding_step_completed`, `first_settle`, `capture_settled{domain}`, `minimum_met{count}`, `depth_state{state}`, `loop_resolved{type}`, `habit_ticked`, `english_session_completed{mode}`, `aei_updated`, `money_tx_created{source}`, `upi_draft_reviewed{action}`, `lend_created`, `doc_uploaded`, `calendar_synced{direction,count}`, `conflict_resolved{choice}`, `report_generated{type}`, `permission_prompted{scope}`, `permission_result{scope,granted}`, `consent_changed{scope,granted}`, `tier_changed`, `ai_call{task,provider,outcome}`, `error_shown{code,surface}`, `sync_batch{items,failures}`.

### 17.2 North-star and guardrail metrics

| Metric | Definition | Why |
|--------|------------|-----|
| **Honest Days** (north star) | days where the daily minimum was met with real records | Measures value delivered, not sessions |
| Time-to-first-Settle | signup → first real capture | Onboarding quality |
| Week-1 retention | returned on ≥3 of days 2–7 | Activation |
| Loop clearance rate | resolved / created | Whether the system's asks are worth answering |
| Capture latency | tap→Settle p95 | Sacred path health |
| AEI progression | median AEI delta over 30 days for users with ≥8 sessions | English system efficacy |
| Sync integrity | conflicts / mutations | Trust |
| Guardrail: notification opt-out rate | — | Detects nagging |
| Guardrail: consent revocation rate | — | Detects over-asking |
| Guardrail: AI correction rate | Offers adjusted or dismissed / total | Detects bad inference |

### 17.3 Observability

Structured JSON logs (request id, user hash, route, latency, outcome — never content) · traces on the AI and sync paths · RED metrics per route · dashboards: API health, sync health, AI spend and outcome mix, queue age, DB slow queries · alarms per §14.3 with SNS to email/Slack · Sentry for client errors with PII scrubbing and a deny-list for journal/document fields · release health per app version (native crash-free rate target ≥ 99.5%).

---

## 18. Accessibility

Accessibility is structural (C-UX-18), not a pass at the end.

| Requirement | Implementation |
|-------------|----------------|
| Contrast | Text ≥ 4.5:1, large text ≥ 3:1 — verified for **all three** themes including the soft dark ramp |
| Color independence | Every status has icon or text (MD-03) |
| Focus | Visible 2px `color.action` ring, 2px offset, never removed; logical tab order; focus trapped in sheets/dialogs and restored on close |
| Touch targets | ≥44px web, ≥48dp native |
| Font scale | ×0.9–×1.3 in-app plus OS scaling; layouts must not clip or truncate meaning at ×1.3 |
| Screen readers | Semantic landmarks, labelled controls, `aria-live` for async states, chart text alternatives, meaningful reading order for the Today spine; Compose semantics with `contentDescription` and merged nodes for rows |
| Reduced motion | §5.4 with behavioral fallbacks |
| Gesture alternatives | Every swipe/drag has a button/menu/keyboard path (IP-16) |
| Captions/transcripts | English drills always show the transcript; reference audio has text |
| Timeouts | Focus/urge timers are user-controlled; no forced time limits on input |
| Errors | Announced, associated to fields, never color-only |
| Language | `lang` attributes; plain-language microcopy; no idioms in critical paths |

Target: **WCAG 2.2 AA** for the web app, Android accessibility scanner clean for native.

---

## 19. Testing and quality plan

### 19.1 Layers

| Layer | Scope | Tooling intent |
|-------|-------|----------------|
| Unit | Score engine, AEI computation, depth state machine, parsers (SMS templates, CSV, RRULE), dedupe, stride estimate, quota math | Jest / Vitest; Kotlin unit tests |
| Contract | Every API endpoint: auth required, tier gate, RLS isolation (user A cannot read B), idempotency replay, validation errors | API test suite in CI |
| Integration | Sync batch + pull round trip; Google two-way sync against a sandbox; import→commit→undo; upload→view-url; consent gates blocking writes | Staging |
| E2E | Onboarding (all 12 steps, plus skip-everything path), first Settle, offline capture→reconnect, conflict resolution, tier upgrade, delete account, English session end-to-end | Playwright (web), Espresso/Compose UI (native) |
| Accessibility | Axe on every route, contrast matrix for 3 themes, screen-reader script for Today/Capture/Money, ×1.3 font-scale screenshots | CI + manual |
| Performance | `/today` p95, bootstrap p95, list scroll jank, cold start (native < 2s to Today skeleton), bundle budget | Lighthouse CI, Macrobenchmark |
| Security | IDOR sweep, injection fuzz, upload abuse, signed-URL expiry, rate-limit behavior, secret scanning | CI + pre-launch pen pass |
| Data | Migration dry-run + rollback, backup restore drill, export completeness (every table represented), delete completeness (no orphans) | Staging with synthetic |
| Device matrix | Android 10–15, 3 OEMs incl. OnePlus (Health Connect path), small phone, tablet, foldable; iPad Safari; Chrome/Safari/Firefox desktop | Manual + cloud device farm |

### 19.2 Golden test cases (must never regress)

1. Capture works with AI off, offline, and on a fresh account.
2. Depth never shows a shaming state before 11:00 or on day 1.
3. `/m` shows no score, no analytics, no tools (CS-13 assertion test).
4. Deleting an account purges every table containing `user_id` (schema-driven test that fails when a new table is added without a delete path).
5. Export contains every user table and re-imports into a fresh dev DB.
6. A revoked consent immediately blocks that scope's writes server-side.
7. Two devices ticking the same habit produce one row.
8. Calendar conflict never silently overwrites.
9. Journal content never appears in any log, prompt for analytics, notification, or export sent to a third party.
10. AEI stays `unrated` below 3 sessions and never regresses from a single bad session by more than 3 points.

### 19.3 Definition of done (per feature)

Code + tests + state matrix complete + a11y pass + privacy tier recorded + consent wired (if sensitive) + offline behavior defined + analytics events added + **vault note and changelog updated in the same unit of work** + Genesis cross-check (no invented hub/verb/state).

---

## 20. Implementation roadmap

Sequenced so each wave leaves the product shippable. No wave is "the MVP" — V1 is the sum.

| Wave | Theme | Contents | Exit criteria |
|------|-------|----------|---------------|
| **W0** | Fire + foundations | EC2 disk, SSH lockdown, CloudWatch alarms, consent-gated GA4/Sentry, LC-01…14 verification | Alarms firing correctly; no open SSH; launch checklist green |
| **W1** | Visual + a11y base | Soft Monotone ramp `[ADR-B3]`, dim mode, font scale, text-opacity caps, monotone chip rules, metric family MERGE, T9 removal, focus rings | Contrast matrix passes for 3 themes; one metric component in use |
| **W2** | Today + Depth + Loops | `/today` endpoint, depth state machine, daily minimum config, Open Loops queue, widget arrangement | Depth reacts After-Settle; loops resolve; reduced-motion parity |
| **W3** | Graph + People | `graph_edges`, `people` + migration, person detail, `/graph/context`, contact import (device + Google), merge | Person card shows real cross-domain links |
| **W4** | Money depth | Lending ledger + rollups, subscriptions, bills, import batches with undo, statement parse + confirm queue | Lend↔person↔transaction linked; import undo works |
| **W5** | Native capture power | Health Connect, screen time, UPI on-device parse + review queue, camera scan, widgets, haptics, swipe grammar | Review queue commits idempotently; aggregates only on server |
| **W6** | Calendar two-way | Write scope, AIIMIN calendar, syncToken/watch, conflict resolver, focus write-back | Conflict UI verified against sandbox; no silent overwrite |
| **W7** | English / AEI | Sessions, deterministic metrics, `vocal_scorecard` wiring, placement test, skill tree, prescription, word bank, accent packs, history | AEI honest gating; offline session scores locally |
| **W8** | Vault + Documents OS | Document model, viewer (PDF/DOCX/XLSX), expiry ladder, vault lock, emergency card, OCR→tx | Viewer handles the three formats + graceful unsupported |
| **W9** | Privacy surfaces | Consent registry UI, privacy dashboard, activity log, scoped delete, async export, store/policy parity | Dashboard numbers are real; revoke blocks writes |
| **W10** | Intelligence | Graph-cited insights, correlations, reports (snapshot/PDF/interactive), provenance drawer | Every insight cites sources |
| **W11** | Notifications + retention | Type registry, quiet hours, digest, streak freeze, weekly/monthly rhythm, re-engagement rules | Opt-out rate guardrail instrumented |
| **W12** | Backend migration | Containerize → Fargate → SQS/worker → EventBridge → CloudFront/WAF → S3 vault → read replica | Alarms + rollback verified at each step |
| **W13** | Hardening + launch | Pen pass, IDOR sweep, device matrix, restore drill, Play data-safety, legal review, load smoke | All golden tests green |

**Parallelizable:** W1 with W0; W7 with W4/W5 (different owners); W12 continuously after W0.

---

## 21. Validation passes

### Pass 1 — Missing features (resolved)

Added during review: `depth.dawn` state (avoided a shaming early-morning state) · streak freeze · import batch undo · subscriptions/bills detection · emergency card export · document annotation · read-aloud English mode · meeting-English lane · person "care" interaction log · devices list with revoke · scoped per-domain deletion · async export for large accounts · `/today` aggregate endpoint · AI-off mode · notification content masking · font-scale control · dim theme · single-active-focus-session rule.

**Consciously deferred (POST-V1, stated in UI where relevant):** multi-user household accounts, Office **editing**, iOS app, Hindi/other languages, E2E for journal/vault, recurring-rule editing, call-log-based relationship ledger, semantic search/pgvector, public sharing of anything.

### Pass 2 — Missing journeys (resolved)

Added: pending-access (waitlist-approved-not-yet) as a non-error state · native-first install for an existing web user · web-after-native (no repeated asks) · guest tour → signup with no orphan data · permission refused then re-offered in context · consent revoked → scoped delete offer · account deleted → return as new user · payment failed grace · store-purchase reconcile · tier downgrade read-only path · offline for a week → chunked catch-up · device lost → revoke sessions · timezone move · onboarding resumed across devices · English session interrupted by a call · UPI draft for an unknown counterparty → create person inline · document expiring while offline.

### Pass 3 — Missing components (resolved)

Added: `SyncPill`, `ConflictResolver`, `LoopRow`, `LendRow`, `PersonRow`, `DocumentRow`, `DrillRow`, `DocumentViewer`, `SessionRunner`, `VeilGate` typed variant, `EmptyCoach` teaching variant, provenance drawer, permission-rationale sheet, Drift restore card, sync tray, consent list rows, activity-log rows, `Metric` unified family, chart text-alternative wrapper, widget components.

### Pass 4 — Backend / privacy / sync gaps (resolved)

Added: consent registry as the cross-surface source of truth · content-free audit log · idempotency on every mutation · pull cursor endpoint · field-level merge table per entity · signed short-lived single-use URLs · KMS-backed vault bucket · SQS worker for AI/imports/OCR/PDF/notifications · EventBridge replacing box cron · read replica for reports · WAF · SSM-only SSH · secret rotation · schema-driven delete-completeness test · store/policy parity checklist · prompt-minimization table · provider zero-retention requirement · per-currency totals · backup restore drill · error-budget policy.

### Pass 5 — Genesis and prior-work cross-reference

| Genesis / prior law | How this Blueprint complies |
|---------------------|-----------------------------|
| P8 Ch03/04 IA + BR-01…12 | No new top-level hubs; People inside Family (`ADR-B1`), English inside Lab (`ADR-B2`), Documents as a component (`ADR-B5`), Health as signals (`ADR-B4`); `/m/score` stays removed and deep links redirect |
| P8 Ch08 anti-surfaces | No Dashboard; Today owns the day; no Tasks/Projects primary surface |
| P8 Ch11 visual | Palette roles unchanged; only the neutral ramp is proposed, ADR-gated; four locked type families; density modes used |
| P8 Ch12 motion | After-Settle, Honest Hold, One Motion, Interruptibility, reduced-motion parity, proportional celebration; forbidden motions excluded |
| P8 Ch07/Ch17 AI | Five roles only; confidence bands; persist-before-coach; no auth/billing changes by AI; prediction ≠ permission; failure never shown as success; uncertainty fails closed |
| P8 Ch15 privacy | Ownership/stewardship language, export always, real delete, journal excluded from analytics, no inference of high-sensitivity meanings, opt-in revocable non-explicit collection, no lifelog commerce |
| P8 Ch16 notifications | Knock discipline, closed windows during Breath/Veil/Focus, quiet hours, no coercive escalation |
| P8 Ch20 onboarding | Identity formation (Life Arc mandatory), no infinite customization, no mode gate before capture |
| P9 Phase 1 grammar | Catch/Settle/Hold/Offer/Adjust/Commit/Veil/Hand-back/Knock/Drift used exactly; forbidden state pairs avoided |
| P9 Phase 4 ceilings | `S-M` capture-only asserted and tested; `S-NATIVE` ≠ `S-M`; command/ambient bounded |
| C-UX-01…18 | One OS, capture-first, one write primitive, day spine primary, honest device roles, calm command, express-not-invent, full state coverage, calm recovery, AI trust, cross-surface honesty, user-owned nav within locks, merged read surfaces, terminology alignment (Today/`overview`, Career/`placements` documented), identity locks, evidence-bound scope, a11y structural |
| P5 Non-Negotiables + Never-Build | No social feed, no leaderboards, no AI therapist, no auto-posting, no dark-pattern upgrades, no second mood/theme/arc editor, no `window.confirm`, no analytics on `/m`, no journal in push, no PIN in telemetry, no new brand colors, no emoji IA, no Capacitor-as-primary |
| D05 (score location) | Today primary, Reports secondary, native Home analogue, never `/m` |
| D11 (metric merge) | One Metric family |
| BR-04/BR-05 | `/insights` → `/reports`; `/identity` → Goals/Arc; `/settings` → `/account` |
| UX-Intelligence debts D08/D10 | Desktop offline visible; Undo/Hand-back specified as required |
| Monorepo law | Waves specify which client each change belongs to; no mixed commits |
| Proof-or-stop | §19 defines evidence; no wave may claim done without its exit criteria |

**Open items that must be resolved by ADR before the affected wave starts:** `ADR-B1` People placement · `ADR-B2` English promotion · `ADR-B3` soft dark ramp · `ADR-B4` health signals · `ADR-B5` documents viewer · plus §22 items.

---

## 22. Open decisions register (Founder input required)

| ID | Decision | Options | Recommendation | Blocks |
|----|----------|---------|----------------|--------|
| OD-01 | Soft Monotone dark ramp | (a) adopt §4.3 (b) keep `#1a1a1a`/`#2d2d2d` and only cap text opacity | **(a)** — the reported eye strain comes mostly from the canvas/text contrast pair | W1 |
| OD-02 | People placement | (a) tab inside `/family` (b) new `/people` route | **(a)** — respects BR-03 and keeps depth ≤3 | W3 |
| OD-03 | English route | (a) `/lab?module=english` (b) `/english` top-level | **(a)** now; revisit after usage data | W7 |
| OD-04 | Voice audio storage | (a) device-only (b) opt-in encrypted cloud replay for Pro | **(a)** default + (b) opt-in | W7 |
| OD-05 | Accent target framing | (a) neutral/US/UK picker (b) neutral only | **(a)** with non-judgmental copy | W7 |
| OD-06 | Journal E2E timing | (a) V1 (b) V1.1 with recovery kit | **(b)** — E2E without recovery risks real data loss | W9 |
| OD-07 | Screen-time detail | (a) daily total only (b) top-3 categories opt-in | **(b)** as opt-in | W5 |
| OD-08 | `/m` future | (a) keep as capture stopgap (b) retire after native GA | **(a)** through native GA (D1b) | — |
| OD-09 | iOS | (a) after Android V1 (b) parallel (c) **not planned** | **(c) for now** — Android-only native; avoid Screen Time parity lies | closed for V1 |
| OD-10 | Age gate | 13 / 16 / 18 | **18** for V1 (money + documents reduce complexity) | W13 |
| OD-11 | Legal entity, DPO/grievance officer, registered address | — | Required for DPDP + Play | W13 |
| OD-12 | Billing on native | (a) Play Billing (b) web-only purchase with native read-only | **(a)** where store policy requires; entitlement stays server-side | W13 |
| OD-13 | Vault storage cap per tier | e.g. Explore 0, Core 100MB, Pro 2GB, Elite 10GB | Pro 2GB / Elite 10GB | W8 |
| OD-14 | Household multi-user | POST-V1 confirmation | POST-V1, stated in UI | — |
| OD-15 | Region | ap-south-1 for API + Supabase | Confirm Supabase region matches | W12 |
| OD-16 | Waitlist founding perks final wording | — | Align marketing with actual caps | W13 |

---

## 23. Traceability index

| Artifact to derive | Source sections |
|--------------------|-----------------|
| PRD | §1, §2, §3, §7, §8, §18, §20 |
| UX architecture spec | §3, §5, §6, §16 |
| Design system | §4, §5, §6, §18 |
| Database schema + migrations | §9 |
| API specification | §10, §13 |
| AI architecture | §11 |
| Privacy / trust / legal pack | §12, §17.1, §22 |
| Sync + offline engineering | §13 |
| Cloud/infra runbook | §14, §17.3 |
| Native app spec | §2.2, §3.4, §5.5–5.6, §8.5–8.10, §13 |
| Website spec | §7.2, §15 |
| Test plan | §19, §16.3 |
| Analytics plan | §17 |
| Roadmap / sprint plan | §20, §22 |

### Vault upkeep obligation

When any wave ships, the same unit of work updates: the relevant `09_FEATURES/<Entity>/` MOC + changelog, `_manifest.json` if contracts change, `03_DATABASE/` notes for new tables, `04_API/` notes for new endpoints, `08_DESIGN/Palette.md` if OD-01 is approved, `10_DECISIONS/` for each ADR above, and `15_MEMORY/Current-Context.md`. Documentation is part of done, not a follow-up.

---

---

# Amendment A — 2026-07-31

> Chapters §24–§28 were added on 2026-07-31. They do not replace §1–§23; they deepen four areas the founder called out: an evidence base for the features where evidence is actually possible, the Journal as an Android flagship, an aggressive Android tier architecture with user categories, and the store-policy corrections that force a redesign of payment capture. §28 replaces the blocked Mobbin research dependency.

---

## 24. Evidence base — which features are research-backed, and which are not

### 24.0 Why this chapter exists, and its honesty rule

The founder's instruction was to make features "research and study backed so they stay effective," using post-2020 work — and, critically, to be honest that **not every feature can be**. That second half matters more than the first. A product that cites a study for a contacts list is a product that will cite a study for anything, and then nobody can trust the citations that are real.

So this chapter has two halves:

- **§24.1–24.5** — features where a real, post-2020 empirical literature exists, what it actually says (including where it says the effect is *small* or *conditional*), and the concrete design rules we adopt because of it.
- **§24.6** — features where no such literature exists or applies. These are justified by job-to-be-done, craft, and heuristic evaluation instead, and we say so in our own docs. We never claim otherwise in marketing.

**Rule E-01.** A feature may only be described as "research-backed" in user-facing copy if it appears in §24.1–24.5 *and* the copy states the effect honestly (no inflating a small effect into a promise).

**Rule E-02.** Where the research says an effect is conditional, the *conditions become product requirements*, not optional polish. This is the whole point of doing the reading: the moderators are the spec.

### 24.1 Journaling / expressive writing

**What the literature actually says.**

| Finding | Source |
|---|---|
| Across 31 RCTs with follow-up (N = 4,012), expressive writing had a **small but significant** effect on depression, anxiety and stress (Hedges' g ≈ −0.12), and the effect **emerged at follow-up, not immediately** — it is delayed and durable | Meta-analysis of long-term-follow-up studies, 2022 (PubMed 36536513) |
| The single intervention feature that moderated effect size was **interval**: sessions spaced **1–3 days apart** outperformed 4–7 day or >7 day spacing | same |
| Effects are hard to replicate; **writer engagement** (indexed by essay length) moderated outcomes — condition differences appeared *only* among participants who wrote longer entries. Adding **emotion-acceptance framing** to the instructions outperformed both classic instructions and control | Frontiers in Psychology, 2023 — "Chasing elusive expressive writing effects" |
| In a general (non-clinical) population meta-analysis, effect ≈ 0.33 uncorrected, ≈ 0.16 after correcting publication bias — small, but "at least harmless" and worthwhile given how cheap the intervention is | Frontiers in Psychiatry, 2023 (Korean sample meta-analysis) |
| Earlier meta-analytic work found brief, self-directed writing did **not** reliably reduce depressive symptoms, but effects were **larger with more sessions and a more specific writing topic** | Reinhold et al. meta-analysis (context for the above) |
| Universal, untargeted deployment fails; adherence was low and intent-to-treat differences were null in a large RCT, though within-session stress *did* drop | Postpartum expressive-writing RCT |

**Design rules adopted (each maps to a moderator above).**

| ID | Rule | Because |
|---|---|---|
| J-R1 | The default cadence target is **every 2 days**, not daily. The app never shames a non-daily journaller. | 1–3 day intervals produced the strongest effects; daily-or-nothing framing creates false failure |
| J-R2 | **Depth over streak.** The primary journal metric is *sessions completed* and *median entry length*, never an unbroken-days counter. A "streak" is not shown on journal at all. | Engagement (length) moderates outcome; session count is the dose |
| J-R3 | At ~40 words the editor offers one gentle "keep going?" affordance and then goes silent. It never blocks saving. | Longer entries carried the effect; nagging kills adherence, which is the failure mode of the null trials |
| J-R4 | Prompts are written in **acceptance framing** ("what would it look like to let this feeling be here?") rather than pure catharsis framing. | Acceptance-enhanced instructions beat traditional instructions |
| J-R5 | Prompts are **specific**, drawn from the user's own Life Graph, not generic. | More specific topics produced larger effects |
| J-R6 | The app **never promises a mood improvement today**. Reflection insight is shown on a 2–4 week horizon. | The effect is delayed; an immediate promise would be a lie the user can falsify on day one |
| J-R7 | Journaling is offered, not pushed, and is **targeted**: the invitation appears when the Life Graph suggests a hard day, not on a fixed schedule for everyone. | Universal deployment fails; targeted use works |
| J-R8 | We surface a **within-session** signal ("how does that feel now?" 1-tap, optional) because the acute stress drop is the one reliably observed immediate effect. | Within-session stress reduction was significant even where ITT effects were null |

**What we will not claim.** "Journaling reduces depression." "Journal daily to feel better." "Clinically proven." The honest line, which is also better copy: *"Writing for a few minutes, a few times a week, is one of the cheapest things you can do for your head. The research says the benefit is small and shows up later — so we count your sessions, not your streak."*

### 24.2 Habits

**What the literature actually says.**

| Finding | Source |
|---|---|
| There is **no magic number**. Time to reach peak automaticity for a self-selected nutrition behaviour had a **median of 59 days** and an individual range of **4 to 335 days** | Keller et al., *British Journal of Health Psychology*, 2021 (RCT) |
| **Routine-based cues and time-based cues were equally effective.** Neither beat the other | same |
| **Repeated plan enactment was the key predictor** of automaticity — not intention, not motivation | same |
| Habit formation time is **behaviour-specific**: machine-learning analysis of 12M gym visits and 40M handwashing events found gym habits take *months* while handwashing takes *weeks* | Buyalskaya et al., *PNAS*, 2023 |
| Systematic review/meta-analysis: median 59–66 days, means 106–154 days, range 4–335; determinants were frequency and timing of practice, context stability, enjoyment, implementation plans, and daily routines; automaticity plateaus around ~12 weeks | *Healthcare*, 2024 systematic review |
| Implementation intentions (if-then plans) accelerate formation by making the cue cognitively accessible | consistent across the above |

**Design rules adopted.**

| ID | Rule | Because |
|---|---|---|
| H-R1 | **The "21 days" claim is banned** from product, marketing, and notification copy. | It is false and the literature is unambiguous |
| H-R2 | Creating a habit **requires a cue**, chosen as either *after [existing routine]* or *at [time]* — both offered as equals, neither recommended over the other. | Routine-based ≈ time-based |
| H-R3 | The habit engine tracks **plan enactment** (done *at/after the planned cue*) separately from **ad-hoc completion** (done, but off-plan). Automaticity is modelled from enactment, not raw completions. | Plan enactment is *the* predictor |
| H-R4 | Each habit shows an **automaticity curve** with an honest band: "most people reach automatic around 2 months; it ranges from a few weeks to most of a year." No countdown to a fake finish line. | Median 59, range 4–335 |
| H-R5 | The automaticity estimate is **per habit**, and heavier behaviours (gym, study block) are modelled as slower than light ones (water, vitamin). | Behaviour-specificity is the PNAS headline |
| H-R6 | If the user's context changes (the cue routine stops happening, or the location changes), the app **flags the cue, not the person**: "your 7am cue hasn't fired in 9 days — want a different cue?" | Context stability determines habit strength |
| H-R7 | Enjoyment is a first-class field. A habit rated unpleasant three weeks running triggers a redesign prompt, not more nagging. | Enjoyment is a listed determinant |
| H-R8 | Streaks exist but are **secondary**, breakable without loss of history, and repairable (one freeze per week). The headline number is *automaticity*, not streak length. | Streak is a proxy the literature does not use; automaticity is the construct |

### 24.3 English — vocabulary and retention

**What the literature actually says.**

| Finding | Source |
|---|---|
| Spaced practice has a **medium-to-large** effect on L2 learning (98 effect sizes, 48 experiments, N = 3,411). Shorter spacing equals longer spacing on immediate tests, but **longer spacing wins on delayed tests** | *Language Learning* meta-analysis of spaced practice in L2 |
| **Equal and expanding schedules were statistically equivalent** | same, and Latimier et al. |
| Spaced retrieval practice beat massed retrieval strongly (**g = 0.74**); expanding vs uniform difference was negligible (g = 0.034), with expanding gaining an edge only when the item is tested many times | Latimier et al., *Educational Psychology Review*, 2021 |
| In an actual web app, **optimal spacing + corrective feedback + testing together improved learning by 29 percentage points** over massed practice with no corrective feedback. Spacing and feedback were the significant main effects | Frontiers/PMC 2021 web-application study |
| Technology-assisted L2 vocabulary learning: **d = 0.64**, and **mobile beat desktop** | *CALL* meta-analysis, 2021 |
| Mobile-app vocabulary learning over treatments of **≥ 10 weeks**: large pooled effect (**≈ 1.28**, Bayesian meta-analysis of 65 studies, 2010–2024) | *ReCALL* meta-analysis |

**Design rules adopted.**

| ID | Rule | Because |
|---|---|---|
| E-R1 | The word bank uses a **simple fixed/equal interval ladder** (e.g. 1 · 3 · 7 · 16 · 35 · 90 days) rather than a bespoke expanding algorithm. Do not spend engineering weeks on SM-2 tuning in V1. | Equal ≈ expanding; the gain is in *spacing at all* |
| E-R2 | **Retrieval, not recognition.** Every review is a production or recall attempt before the answer is shown. | Retrieval practice is half the g = 0.74 |
| E-R3 | **Corrective feedback is mandatory and immediate** on every item — show what was wrong and the right form, not just a red cross. This is the single highest-leverage requirement in the chapter. | Feedback × testing interaction; +29pp |
| E-R4 | Intervals lengthen toward durability rather than optimising tomorrow's quiz score. The UI states the goal is remembering in a month, not today. | Longer spacing wins on delayed tests |
| E-R5 | Progress is judged on a **10-week horizon**; the AEI trend view defaults to 10 weeks. | The large mobile effects appear at ≥10 weeks |
| E-R6 | Daily dose is **small and capped** (default 8 items, hard cap 25) to protect adherence. | Adherence is the failure mode; spacing beats volume |

### 24.4 English — speaking, shadowing, and the AEI

**What the literature actually says — including an inconvenient result.**

| Finding | Source |
|---|---|
| A 42-day daily shadowing programme improved learners' **perception** of segments and prosody significantly *without explicit instruction* — but **production did not significantly improve in the self-learning condition** | Kunihara et al., Interspeech 2022 |
| Learners struggled to reproduce a model-like pitch pattern **from text alone**; audio input mattered | same |
| Shadowing practice with structured comparison improves fluency and pronunciation accuracy in classroom studies | EFL shadowing studies, 2020–2025 |
| Automated speech scoring correlates strongly with human/standardised measures when it combines several features (pronunciation goodness, word recognition rate, silence ratio, alignment likelihood) rather than a single score; open-source scoring correlates moderately with commercial scoring | automated speech scoring literature, incl. 2022 comparison study |

**Design rules adopted.**

| ID | Rule | Because |
|---|---|---|
| S-R1 | **Shadowing without feedback is not a feature.** Every shadowing drill ends with an explicit **model-vs-you comparison**: aligned A/B playback, a per-word timing/stress diff, and one named target for next time. | Self-directed shadowing improved perception but *not* production — feedback is the missing ingredient |
| S-R2 | Drills always provide **audio**, never text-only, when prosody is the target. | Learners could not produce model pitch from text alone |
| S-R3 | The AEI is **multi-feature** (pronunciation goodness, fluency/pause profile, lexical range, grammatical accuracy, task completion) and never a single opaque number derived from one signal. | Multi-feature scoring is what correlates with human raters |
| S-R4 | The AEI is presented as an **estimate with a confidence band and a CEFR band**, explicitly not a certification, in both UI and legal copy. | Honest limits of automated scoring; see Legal Pack L8 |
| S-R5 | The 42-day framing is used for the "Marathon" programme structure: **6 weeks, daily short sessions, four passages a day** — because that is the dose the study actually ran. | Direct transfer of a tested protocol |
| S-R6 | Perception drills (minimal pairs, prosody discrimination) are **first-class**, not warm-ups, since that is where the reliable self-study gain was found. | Perception improved without instruction; harvest the easy win |

### 24.5 Cross-cutting behaviour-change rules

| ID | Rule | Grounding |
|---|---|---|
| X-R1 | Self-monitoring is the mechanism the whole product rests on, so **capture must be near-frictionless** — every domain reachable in ≤2 taps from Today. Friction, not motivation, is the binding constraint. | Adherence collapse is the common failure across all the null results above |
| X-R2 | **Implementation-intention scaffolding** is offered in habits, goals, and English ("when X, I will Y"), because if-then plans are the most consistently supported technique in the set. | Habit literature |
| X-R3 | Effects are **small and delayed**. Every insight surface must therefore show *trend over weeks*, and no surface may show a day-over-day mood claim. | Delayed-effect findings in §24.1 |
| X-R4 | Every research-derived number in the product (59 days, 10 weeks, 1–3 day interval) is stored in **one config module** with a citation string, so copy and logic cannot drift apart. | Traceability |

### 24.6 Features where no research claim is available — and how they are justified instead

The founder's point stands: you cannot cite a study for a contacts list. These features are justified by **job-to-be-done, craft quality, and heuristic evaluation**, and our docs say so plainly.

| Feature | Justification basis | What "good" means here |
|---|---|---|
| People / contacts | Job-to-be-done: money, events and documents are *about people*; without person entities the graph is a pile of strings | Zero duplicate-person confusion; linking never requires a full address-book upload |
| Family vault & documents | Job-to-be-done: document panic is a real, dateable event (expiry, renewal, emergency) | Retrieval in under 10 seconds, offline, and expiry never surprises you |
| Calendar sync | Utility + platform convention | Two-way sync with no duplicate events, ever |
| Lend & borrow ledger | Job-to-be-done: informal debt in India is socially awkward and badly tracked | Net position per person is always correct and reconciles |
| Sports | Interest/retention feature; no efficacy claim | Fast, accurate, never a notification you didn't ask for |
| Depth / Human Momentum | Brand and emotional design; **explicitly not a clinical construct** | Legible in one glance, never punitive |
| Life Score | Composite index of the user's own inputs; not a validated psychometric | Fully explainable — every point traceable to a source |
| Documents OS / file viewing | Platform utility | Opens what it says it opens |
| Notifications | Design discipline, not efficacy research | Fewer than 3/day by default, each one earning its interruption |

**Rule E-03.** For every feature in this table, marketing copy describes *what it does for you*, never *what it does to your outcomes*.

---

## 25. Journal — Android flagship specification

> Journal is a flagship on the Android app, not a port of the web studio. Web (`09_FEATURES/Journal/Journal.md`, craft B1) is an editorial *writing room* built for a keyboard and a wide canvas. Android is a **thumb-first reflection surface** built for two minutes in bed with one hand. Same data, same table, different product.

### 25.1 What it is for

One job: **get the thought out of your head and into your life record, with the least possible resistance, and let it come back to you later when it is useful.**

Three failure modes it must design against, all observed in the literature (§24.1): the blank page, the daily-streak guilt spiral, and writing that disappears into a void and never returns.

### 25.2 Modes

Modes are presented as a single row of chips in the capture bar. Free Write is the default and always one tap away; nobody is forced through a mode picker.

| Mode | Shape | Target dose | Research anchor |
|---|---|---|---|
| **Free Write** (default) | Blank, one prompt shown faintly, dismissible | Any length | Baseline expressive writing |
| **Reflect** (acceptance-framed) | 3 sequential prompts: what happened · what it brought up · what it would look like to let that be here | 5–8 min | J-R4 — acceptance framing beat classic instructions |
| **CBT Record** | Situation → automatic thought → evidence for/against → balanced thought → feeling before/after (0–10) | 6–10 min | Structured/specific topic → larger effects |
| **Morning Pages** | Timer-led, no editing, no word count shown | 10 min or 3 screens | Engagement-by-volume (J-R2) |
| **Weekly Review** | Pulls the week's Life Graph facts in as read-only context, then asks 4 questions | 10–15 min | Specificity from own data (J-R5) |
| **Gratitude / Three Good Things** | Three short fields, ships with a hard 3-item cap | 2 min | Lowest-friction entry point for hard days |
| **Voice note** | Hold-to-talk, on-device transcription, transcript is the entry, audio discarded after transcription unless kept | 1–3 min | Removes the blank-page barrier entirely |

### 25.3 The Android capture flow (the thing that must be perfect)

```
Today ──[FAB long-press]──▶ Journal sheet opens at 45% height, cursor already in the field,
                            keyboard already up, mode = last used
        ──[swipe up]──────▶ full screen writing
        ──[swipe down]────▶ collapses; draft saved, nothing lost, no dialog
```

Non-negotiables:

1. **Zero-tap-to-typing.** Opening the sheet places the cursor and raises the keyboard. No title field. No mode gate. No date picker (defaults to today, editable in the header).
2. **Local-first save.** Every keystroke persists to the on-device database on a 400 ms debounce. Sync is a background concern. The word "draft" never appears — it is simply saved.
3. **Backdating** is a single tap on the date in the header, with a 7-day quick strip plus a calendar for older.
4. **Never lose text.** Process death, low memory, call interruption, battery kill — recovery on next open shows the text exactly as it was, with a one-line "recovered" note.
5. **Save happens before AI.** Any AI action operates on already-persisted text (Blueprint §11 rule; Legal Pack L8 rule 1).
6. **No streak UI anywhere in Journal.** Session count and median length only (J-R2).
7. **Optional 1-tap "how does that feel now?"** on save — a 5-point face row, skippable, feeding the within-session signal from J-R8. This is the *only* rating in the whole feature.

### 25.4 Prompt engine

Prompts are the difference between a text box and a journal. The engine is deterministic and local; AI is not required to produce a prompt.

**Selection order:**

1. **Graph-grounded** (highest priority) — built from a fact in the user's own data: a broken habit cue, a heavy spend day, a missed goal milestone, a person not seen in a long time, a hard discipline day. Specificity is the moderator (J-R5).
2. **Acceptance-framed** rotation — a curated bank, phrased per J-R4.
3. **Mode-native** — CBT and Weekly Review carry their own fixed structures.
4. **Neutral fallback** — five evergreen prompts, so the engine never shows nothing.

Prompts are **always dismissible in one tap**, never mandatory, and never repeat within 21 days. If the user dismisses three prompts of a category in a row, that category is suppressed for 30 days.

**Cadence.** The invitation targets **every 2 days** (J-R1) and is delivered at the user's chosen reflection time. If the user writes daily, nothing changes and nothing is praised for the daily-ness. If they write twice a week, the app treats that as success, because the evidence does.

### 25.5 Return — the half of journaling that products always skip

Writing that never comes back is a diary, not a system. Android gets four return surfaces:

| Surface | Behaviour |
|---|---|
| **On this day** | A quiet card on Today when an entry exists from 1 month / 6 months / 1 year ago. Tap to read. Dismiss forever per anniversary. |
| **Thread** | Entries the graph links to the same person, goal, or theme, readable as a sequence. Shows *change over time*, which is the payoff of the delayed effect (J-R6). |
| **Reflection digest** | Every 2–4 weeks: session count, median length, the themes that recurred, and one honest observation. Explicitly framed on a multi-week horizon. Never a mood score. |
| **Search** | Full-text over your own entries, on device, with an opt-out that removes journal from global search results. |

### 25.6 Privacy contract (stricter than the rest of the app)

| Guarantee | Implementation |
|---|---|
| Journal content is never sent to analytics or crash reporting | Field-level deny-list in the telemetry layer, plus a test that fails the build if journal text can reach the analytics adapter |
| No AI touches an entry unless the user presses AI on that entry | Per-entry action only; no batch, no background job, no "analyse my journal" |
| Journal is never quoted in a notification | Notification builder receives entry *metadata* only, never body text |
| Encrypted at rest, column-level | Beyond database-level encryption |
| Vault lock covers Journal optionally | Biometric/PIN gate, auto-relock on background |
| Excluded from Family sharing, permanently | No share affordance exists to build later |
| Export includes journal in full | Never a hostage |

This is written into Legal Pack L1 §6 and must stay consistent with it.

### 25.7 Offline, sync, and conflict

Journal is **offline-complete**: create, edit, read, search, and delete all work with no network. Sync is last-write-wins per entry at field level, except the body, where a conflict creates a **second entry** appended with a "conflicted copy" marker rather than silently discarding a version. Losing writing is the one unacceptable outcome.

### 25.8 Tier placement (see §26)

| Capability | Explore | Core | Pro | Elite |
|---|---|---|---|---|
| Free Write, Gratitude, unlimited entries, backdating, export | ✓ | ✓ | ✓ | ✓ |
| Reflect / CBT / Morning Pages / Weekly Review modes | 1 mode | all | all | all |
| Graph-grounded prompts | generic only | ✓ | ✓ | ✓ |
| Voice journal with on-device transcription | 3 / month | ✓ | ✓ | ✓ |
| On this day + Thread | On this day | ✓ | ✓ | ✓ |
| AI per-entry actions (tag, summarise, reframe) | — | ✓ (quota) | ✓ | ✓ |
| Reflection digest | — | monthly | fortnightly | fortnightly + theme correlations |
| Journal in Vault lock | — | ✓ | ✓ | ✓ |

**Never gated at any tier:** writing, saving, reading your own history, searching it, exporting it, deleting it. Charging for access to your own words is a line we do not cross.

### 25.9 Metrics that judge this feature

| Metric | Target | Note |
|---|---|---|
| Time from FAB long-press to first keystroke | < 400 ms | The whole feature lives or dies here |
| Entries per active journaller per week | ≥ 2.5 | Matches the 1–3 day interval target |
| Median entry length | ≥ 90 words, trending up | Engagement is the moderator |
| Prompt dismissal rate | < 55% | Above that, the prompt bank is bad |
| Return-surface engagement (On this day / Thread opens) | ≥ 20% of journallers weekly | Proves return works |
| Text-loss incidents | **0** | Any occurrence is a P0 |

### 25.10 Vault obligation

Shipping this updates `09_FEATURES/Journal/Journal.md` (add Android surface + mode table + prompt engine), appends `09_FEATURES/Journal/Changelog.md`, and patches `_manifest.json` `entities.journal` when contracts change.

---

## 26. Android tier architecture and user categories

### 26.1 Principle

Web tiering gates **surfaces** (which pages open). That is fine on a browser, where the user has room to explore. On Android that model is weak — it makes free users feel walled out and paying users feel they bought a menu.

Android tiering gates **capability, automation, and depth** instead. The ladder answers one question at each step: *what does the app now do for me that I previously had to do myself?*

| Tier | The one-sentence promise on Android |
|---|---|
| **Explore** | "You can capture your whole life here, free, forever." |
| **Core** | "It starts keeping score for you." |
| **Pro** | "It starts doing the work for you." |
| **Elite** | "It starts telling you things you didn't know." |

Prices are unchanged from `15_MEMORY/Business-Rules.md`: Explore free · Core ₹29 · Pro ₹59 (founding ₹49) · Elite ₹99 (founding ₹79). Entitlement is always resolved **server-side**; the client never decides its own tier.

### 26.2 The four ladder rungs, in detail

**Explore — capture is never paywalled**

Today · Depth · full capture in every domain · unlimited journal entries · notes · calendar (AIIMIN-only events) · manual money entry · 1 English drill/day · 7-day history · export · delete. One widget. No AI automation. Manual everything.

*Why generous:* a life OS with a crippled capture tier has no data, and with no data it can prove nothing. Explore exists to make the graph real.

**Core — the app keeps score (₹29)**

Everything in Explore, plus: habits with the cue/automaticity engine (§24.2) · goals · budgets and money categories · focus timer · Health Connect daily sync (steps, distance, sleep) · screen-time daily total · Life Score with full explainability · 90-day history · weekly insight · journal modes and per-entry AI (quota) · 3 widgets · Vault lock · 10 AI units/month.

**Pro — the app does the work (₹59 / ₹49 founding)**

Everything in Core, plus: **two-way Google Calendar sync** · **document vault with OCR, expiry tracking and reminders** · **payment-capture automation** (share-to-AIIMIN, statement import, and the opt-in notification reader — §27) · **people linking and net position per person** · family (2 seats) · correlations and patterns · PDF Life OS Review · unlimited history · unlimited widgets · full shadowing lab with model-vs-you comparison (§24.4) · offline document access · 25 AI units/month.

*Why this is the recommended rung:* every item is a chore removed, and the automation cluster is what a daily user will actually pay for.

**Elite — the app tells you things (₹99 / ₹79 founding)**

Everything in Pro, plus: interactive Intelligence web (cross-domain graph exploration) · 3 deep reports/month · bulk statement/history import · household seats (up to 5) · priority AI routing and higher context · AEI deep diagnostics with phoneme-level breakdown · early access to new capability · 40 AI units/month.

### 26.3 Aggressive — but honest — merchandising rules

"Aggressive" must not mean hostile. Six rules:

| ID | Rule |
|---|---|
| T-R1 | **Show, don't hide.** Locked capability is visible with a real preview of the user's own data, blurred at the value line — never an empty page or a grey box. A user must be able to see what they are missing. |
| T-R2 | **Contextual, single upgrade point.** The upsell appears at the exact moment of need (tapping "sync my Google Calendar"), as a bottom sheet naming *that* capability first, price second. Never an interstitial on launch. Never more than one upsell per session. |
| T-R3 | **Honest quota meters.** AI units are shown as a visible counter with a plain explanation of what consumes one. No silent throttling, ever. |
| T-R4 | **Downgrade is safe.** Losing a tier never deletes data. Paid features become read-only; export stays available at every tier. This is stated *before* purchase, which is exactly why people purchase. |
| T-R5 | **No dark patterns.** Cancel is as easy as subscribe (Legal Pack L7). No fake scarcity, no countdown timers, no pre-ticked upgrades, no "are you sure you want to miss out" guilt screen. |
| T-R6 | **Never gate safety or ownership.** Data export, deletion, security settings, privacy controls, and reading your own history are free at every tier, forever. |

### 26.4 User categories — how a new user picks their AIIMIN

The product is broad. Breadth is the founder's intent and also the clutter risk. The resolution is not fewer features — it is **fewer features visible on day one**, chosen by the user.

During onboarding (Blueprint §7) the user picks **1–2 categories** from six. Each category is a **starter kit**: which surfaces are pinned to the nav, which widgets are proposed, which prompts and drills are prioritised, and what the first-week plan looks like. Nothing is deleted — everything else lives in "More" and can be pinned any time.

| Category | Who | Pinned surfaces | First-week plan | Natural tier |
|---|---|---|---|---|
| **The Student** | Exams, semesters, tight money | Today · Focus · English · Journal | 2 focus blocks/day, 8 word-bank items, weekly review | Core |
| **The Builder** | Founder/freelancer, income is lumpy | Today · Goals · Money · Focus | Goal with milestones, weekly money reconcile, deep-work streaks | Pro |
| **The Professional** | 9-to-5, calendar-driven, wants their evenings back | Today · Calendar · Habits · Screen time | Calendar sync, 2 habits with cues, screen-time baseline | Pro |
| **The Rebuilder** | Discipline, urges, getting out of a hole | Today · Discipline · Journal · Habits | Urge log, daily 2-minute Reflect, one keystone habit | Core |
| **The Family Anchor** | Holds the household's paperwork and dates | Today · Family · Documents · Calendar | Vault set-up, 5 documents with expiries, shared dates | Pro |
| **The Speaker** | English fluency and accent are the goal | Today · English · Journal | AEI placement, 6-week Marathon, daily perception drill | Core → Elite |

**Rules.** Selection is reversible from Settings at any time, with no data consequence. Maximum two categories, because three is the same as none. The category never restricts access — it only sets defaults. After 30 days, if actual usage disagrees with the chosen category, the app offers to re-tune the nav once, and then stops asking.

### 26.5 Anti-clutter contract

The founder's hardest constraint: many features, no clutter. Seven enforceable rules.

| ID | Rule |
|---|---|
| C-R1 | **Five nav items maximum**, ever. Today · one category surface · FAB · one category surface · More. |
| C-R2 | **Today shows at most 6 cards.** Cards are earned by relevance, not by feature existence. A feature with nothing to say today shows nothing. |
| C-R3 | **One primary action per screen.** If a screen has two equally weighted primary buttons, the screen is wrong. |
| C-R4 | **Progressive disclosure by default:** every feature has a simple mode that works with zero configuration, and depth behind an explicit "more" affordance. |
| C-R5 | **Empty means empty.** An unused feature renders a single quiet line, not a marketing card. |
| C-R6 | **Feature budget:** adding a card to Today requires removing or demoting one. Enforced in review. |
| C-R7 | **The category system is the clutter valve.** A Student never sees Family cards on Today until they ask for them. |

---

## 27. Store and permission compliance — amendments to §8.6 and §12

> **This chapter overrides earlier drafting.** Blueprint §8.6.2 assumed reading UPI **SMS** on Android. Google Play policy does not permit that for AIIMIN. Detail and rationale live in `Roadmap/Legal-Pack-V1.md` §11; the product consequences are recorded here.

### 27.1 SMS is not available — and it does not need to be

Google Play grants the SMS permission group only to apps **actively registered as the device's default SMS or Assistant handler**, and explicitly prohibits obtaining the same data by alternative means. AIIMIN will not become a default SMS app. Therefore:

**AIIMIN V1 declares no SMS permission and no call-log permission.** No marketing may say "reads your SMS".

**Replacement design, in shipping order:**

| Wave | Path | User experience | Permission cost |
|---|---|---|---|
| **1 (V1)** | **Share-to-AIIMIN** | Share any payment confirmation from any app into AIIMIN; it parses and shows a draft to confirm | None |
| **1 (V1)** | **Statement import** | Upload a bank CSV/PDF; confirm queue; one-tap undo of the whole batch | None |
| **2 (V1, opt-in)** | **Notification reader** (`NotificationListenerService`) | Payment alerts from a curated bank/UPI template list are matched **on device**; only the draft you approve is stored; raw text never leaves the device | Special access, off by default, prominent disclosure required, independently revocable |
| **3 (V1.1)** | **RBI Account Aggregator** | Regulated, consent-artefact-based bank data through a licensed AA | Requires an FIU relationship — the correct long-term answer for India |

The user-visible promise changes from "we read your messages" to something better: **"forward it, or upload the statement, and it becomes a confirmed record."**

### 27.2 Permissions AIIMIN requests, and the ones it refuses

| Permission | Status | Feature | Disclosure |
|---|---|---|---|
| `POST_NOTIFICATIONS` | runtime | Reminders | Standard rationale |
| `CAMERA` | runtime | Document/receipt scan | Rationale at first scan |
| `RECORD_AUDIO` | runtime | Practice sessions | Rationale + "audio stays on device" |
| `READ_MEDIA_IMAGES` / picker | runtime | Attach a photo | Prefer the photo picker over broad access |
| Health Connect read: steps, distance, active minutes, sleep | Health Connect grant | Health day | Health apps declaration form + policy naming |
| `PACKAGE_USAGE_STATS` | special access via settings | Screen time | In-app explanation before the settings hand-off; daily totals only |
| `NotificationListenerService` | special access via settings | Payment capture (opt-in) | Full disclosure sheet; off by default |
| Google Calendar / Tasks / Drive / People | OAuth | Sync features | Limited Use; per-scope explanation |
| **Location** | **refused** | — | Not requested at any precision |
| **SMS / call log** | **refused** | — | Policy-prohibited for this app class |
| **Accessibility service, device admin, bulk contact read** | **refused** | — | Never |
| Background health read, 30-day health history | **not in V1** | — | Foreground daily sync is sufficient |

### 27.3 Mandatory disclosure pattern

Every special-access permission uses the sheet in Legal Pack L11.6: exactly what is read, exactly what is not read, where it is stored and for how long, how to turn it off, and two equally prominent buttons where "Not now" is never a dead end. Denial must always leave a working manual path — this is the difference between a product and a hostage situation.

### 27.4 Play submission gates (blocking for launch)

Data safety form matching Legal Pack §10 · Health apps declaration form · account-deletion URL (`/data-deletion`) in the listing · target API level current for the August 2026 requirement · prominent-disclosure screen recordings for each special-access permission · privacy policy URL live and naming Health Connect explicitly.

### 27.5 Consequential edits

`§8.6.2` payment capture — replaced by §27.1 · `§12.2` permission table — replaced by §27.2 · `§22 OD-10` age gate — **closed at 18** (DPDP requires verifiable parental consent below 18) · `§22 OD-11` legal entity — now blocking, tracked in Legal Pack §0.2 · new open decision **OD-17**: whether to pursue an FIU/Account Aggregator relationship for V1.1, and with which AA.

---

## 28. Design reference and inspiration sources

### 28.1 Why this chapter exists

Blueprint §4–§6 were written with the Mobbin MCP unavailable (paid tier). This chapter replaces that dependency permanently: a named set of sources, a method for using them, and the actual visual direction decisions taken from them.

### 28.2 Reference sources (Mobbin replacements)

| Source | What it is good for | Cost | How we use it |
|---|---|---|---|
| **Refcat** (`refcat.app`) | Real app flows searchable **by intent** — onboarding, paywall, settings — with Figma export | Free tier: top 10 trending flows/week + 5 exports; Pro ≈ $2/mo | **Primary Mobbin replacement.** Search by intent before designing any flow |
| **UIguana** (`uiguana.com`) | 7,700+ screens across 126 flows, grouped by journey, fully free | Free | Journey-level reference; good for capture and onboarding sequences |
| **Banani references** (`banani.co/references/apps`) | Screens from Duolingo, Things 3, Calm, Perplexity, Reddit, Substack etc., no sign-up | Free | Pattern reference for the apps closest to AIIMIN's domains |
| **Material 3 Expressive guidelines + Compose docs** | The authoritative Android target: components, motion physics, type scale, shape scale | Free | **Normative for the native app**, not merely inspirational |
| **Android Large Screen / adaptive guidance** | Foldables and tablets | Free | Track D device tier |
| **Mobbin** | Best breadth, if a seat is ever bought | Paid | Optional; re-run the searches listed in §28.5 if purchased |

**Method.** Search by *intent*, not by app name. Collect 3–5 references per flow. Extract the **structural decision** (where the primary action sits, how many steps, what is deferred) — never the visual skin. Map every borrowed structure onto the locked palette and Genesis interaction law. Record the decision in the vault; do not keep a scrapbook of screenshots.

### 28.3 Visual direction decisions

The four GPT-generated concept boards the founder supplied (light clean / light playful / dark focus / dark soft-neutral) are useful as a **decision forcing function**. Assessment:

| Board | Verdict |
|---|---|
| 1 — Light, clean & focused | **Adopt as the light theme base.** Correct information density, clear grouping, right hierarchy |
| 2 — Light, playful & illustrative | **Reject.** Stock illustrations are exactly the generic-AI-product look the design rules forbid, and they age badly |
| 3 — Dark, focus & flow with blue accents | **Reject the blue.** The accent is locked to `#ff6b35`. Keep its calm card rhythm |
| 4 — Dark, soft & neutral | **Adopt as the dark theme base.** This directly answers the "dark mode hurts my eyes" feedback — warm neutrals, softer contrast, no pure black, no pure white text |

Concrete adoptions from those boards, now normative for §4:

1. **Sectioned settings with muted uppercase group labels** (ACCOUNT · PREFERENCES · DATA & SYNC · SUPPORT) and a value preview on the right of each row. This is the settings pattern.
2. **Profile card at the top of Settings**, avatar + name + email, tappable to the profile.
3. **Today = greeting + one hero metric + plan list + two stat tiles + quick actions + recent activity.** That is six blocks — exactly the C-R2 budget.
4. **Bottom nav of 4 + centre FAB.** Matches C-R1.
5. **Warm neutral dark**, not blue-black: background near `#1a1a1a`, cards `#2d2d2d`, primary text off-white rather than `#ffffff`.

### 28.4 Modern-not-dated checklist (Material 3 Expressive derived)

M3 Expressive is Google's current direction and is research-backed by their own studies on hierarchy and glanceability. What we take:

| Element | Decision |
|---|---|
| **Motion** | Physics-based **spring** tokens, not fixed-duration easing, for spatial transitions; short duration tokens for opacity/colour effects |
| **Typography** | Use the **emphasised** type styles — larger, heavier headlines — to build hierarchy, so we can drop decorative chrome |
| **Shape** | A shape *scale* (not one radius everywhere); shape-morph on state change for the FAB and primary controls |
| **Components** | Adopt button groups, split buttons, FAB menu, and toolbars where they replace bespoke widgets |
| **Haptics** | Paired with dismissal, completion, and threshold crossings — never decorative |
| **Containment** | Group with containers and blur/depth rather than with borders everywhere |
| **What we refuse** | Neon gradients, glassmorphism everywhere, purple-and-cream AI-startup palette, stock illustrations, and dense data walls |

**Dated signals to avoid** (audit list for review): hamburger menu as primary navigation · tab bars with 5+ items and tiny labels · drop shadows on everything · centred 1990s-style dialogs · full-screen loading spinners · text-only tables on mobile · pure `#000000` dark mode with pure `#ffffff` text · fixed-duration linear animations.

### 28.5 If a Mobbin seat is purchased, run exactly these

`search_flows`: onboarding permission education (ios/android) · subscription paywall with tiers · finance transaction confirmation queue · journaling daily entry · habit creation with reminder · document scan and save · language-learning speaking drill · account deletion.
`search_screens`: settings index sectioned · empty state productivity · today dashboard single metric hero · bottom-sheet quick capture · streak and progress display.
`search_sections`: pricing four tiers · trust and privacy section · FAQ.

### 28.6 Prototype artifact

The interactive reference implementation of §4, §5, §7, §25 and §26 is now `frontend/prototypes/AIIMIN-Drafting-Table.html` (locked 2026-08). The older `frontend/prototypes/personal-os/` HTML shells were deleted 2026-08-14; see `docs/knowledge/16_DOCUMENTATION/Completed-Work-Ledger.md`. When the prototype and this document disagree, this document wins.

---

*End of Blueprint v1.0 + Amendment A (2026-07-31). This document is living: append changes with dates; do not silently rewrite decisions. It expresses Genesis and cannot amend it.*

