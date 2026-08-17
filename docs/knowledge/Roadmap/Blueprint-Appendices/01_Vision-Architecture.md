---
authority: product
derived_from: Roadmap/AIIMIN-V1-Blueprint
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-08-20
can_override_genesis: false
knowledge_layer: KL-PROD
graph_role: leaf
note_type: NT-APPENDIX
tags:
  - type/appendix
  - domain/product
  - status/living
---

# Blueprint appendix — Vision & product architecture (§1–3)

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


> Parent spine: [[Roadmap/AIIMIN-V1-Blueprint]] · Full dump: [[Roadmap/Blueprint-Appendices/00_FULL_ARCHIVE]]

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

