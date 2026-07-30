---
authority: operations
derived_from: UX-Intelligence 01 · 02 · 04 · 09 · 11 · 12 · 14 · Founder Decision D05
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-25
can_override_genesis: false
program: UX-Architecture-v1
artifact: canonical-ia
---

# 08 — Canonical Information Architecture

**Evidence sole source:** [[Roadmap/UX-Intelligence/00_INDEX]] (esp. 01 Surfaces · 02 Features · 04 IA Audit · 09 Content · 11 Constraints · 12 Debt · 14 Alignment).  
**Not:** UI redesign · visual layout · eng route renames as shipped code · feature invention.

**Founder Decision D05 (applied this document):** `/m/score` **exception removed**. Score is **not** an `/m` surface. Canonical location defined in §7.

---

## 1 — Domains

Domains = product ownership partitions evidenced in Intelligence Feature Inventory domain column + Surface Inventory. No new domains invented.

| Domain ID | Domain | Intent (from Intelligence) | Primary surfaces | Class notes |
|-----------|--------|----------------------------|------------------|-------------|
| DOM-ACCESS | Access | Waitlist, auth, onboarding, pending gate | Waitlist `/`, Login, Onboarding, Pending access | KEEP · Onboarding REDESIGN |
| DOM-PUBLIC | Public / Brand | Manifesto + legal | Brand, Legal pages | KEEP |
| DOM-DAY | Day | Daily hub / day spine | Today (`/overview`) · Overview widgets | REDESIGN · **primary** |
| DOM-CAPTURE | Capture | Fast write (logs, journal, notes, `/m`) | `/m` · Journal · Notes · Daily Log · Logger | `/m` KEEP ceiling |
| DOM-EXEC | Execution | Habits, calendar, focus, discipline | Habits, Calendar, Focus, Discipline | KEEP · Discipline REDESIGN |
| DOM-PLAN | Planning | Goals / direction | Goals · Identity/Arc (MERGE) | Goals KEEP · Identity MERGE |
| DOM-MONEY | Money | Finance | Finance | KEEP · tier |
| DOM-FAMILY | Family | People, docs, health-in-family | Family · Family Documents (MERGE nested) | KEEP · Documents nested MERGE |
| DOM-CAREER | Career | Placements / ATS | Career (`/placements`) | KEEP · label≠path ALIGN |
| DOM-CONTEXT | Context | Sports / ambient | Sports | KEEP · tier · guest hide |
| DOM-GROWTH | Growth | Life Score, XP, gamification | **Today (primary score read)** · Reports | Partial · see §7 |
| DOM-DERIVED | Derived read | Period “how am I doing?” | Reports · Insights (MERGE→Reports) | Insights MERGE |
| DOM-LEARN | Learning | Lab experiments | Lab | FUTURE / Experimental |
| DOM-CONFIG | Configuration | Account, settings, personalization, tiers | Account · Settings (MERGE target) · `/m` account lite | Dual hubs debt D03 |
| DOM-SYSTEM | System | Command, notifications, empty/error/offline chrome | Command palette · Notifications · shared states | Notifications REDESIGN |
| DOM-NATIVE | Native companion | Ritual Home + subset domains | Home, Journal, Notes, Vault, GoalsLite, DisciplineUrge, FocusTimer, More, Settings, Auth, Biometric | Continuity · ≠ `/m` |
| DOM-DEV | Dev only | Prototypes / seed | Design lab · Seed data | REMOVE from user IA |

**Mental-model aliases (Intelligence coverage note — not new hubs):**

| Alias users may say | Canonical ownership |
|---------------------|---------------------|
| Health | DOM-FAMILY (+ sleep/components inside Family) — no top-level Health domain |
| Learning | DOM-LEARN (Lab) |
| Tasks | DOM-DAY micro_task widget + DOM-EXEC Habits + DOM-PLAN Goals — no top-level Tasks hub |
| AI | DOM-SYSTEM Command + DOM-CAPTURE logger / Intelligence feature — no top-level AI hub |
| Documents | DOM-FAMILY Documents tab + DOM-CAPTURE Notes — no top-level Documents hub |

---

## 2 — Domain ownership

| Domain | Owns (write / primary) | Does not own |
|--------|------------------------|--------------|
| DOM-ACCESS | Session formation, waitlist entry, onboarding identity bootstrap | Day content, score |
| DOM-PUBLIC | Brand narrative, legal | Authenticated OS |
| DOM-DAY | Day spine, day widgets, **primary Life Score read**, day logger entry | Period reports (→ Derived), `/m` tools |
| DOM-CAPTURE | Fast capture paths including **entire `/m` tree (capture + account lite only)** | Analytics, insights, score, pomodoro, tools on `/m` |
| DOM-EXEC | Habits, calendar events action, focus sessions, discipline urge | Derived score narratives |
| DOM-PLAN | Goals vision tree; Identity MERGE into plan/onboarding identity | Duplicate Life Arc editors |
| DOM-MONEY | Transactions / budgets | |
| DOM-FAMILY | People, family docs, family health records | Standalone Health app |
| DOM-CAREER | Placement pipeline | |
| DOM-CONTEXT | Sports scores context | Life Score (different concept) |
| DOM-GROWTH | Score/XP **meaning** (honest score); primary UX seat on Day | `/m` score surface (forbidden) |
| DOM-DERIVED | Period reports; Insights merged here | Fake input on derived nodes |
| DOM-LEARN | Lab modules | Core Day spine |
| DOM-CONFIG | Profile, pins, personas, subscriptions, app settings | Domain feature logic |
| DOM-SYSTEM | Cross-cut command + notifications chrome | Domain data ownership |
| DOM-NATIVE | Native-presented subset + Home ritual | Softening `/m` ceiling; full desktop parity claim |
| DOM-DEV | None in user IA | Must not appear in global nav mental model |

---

## 3 — Surface ownership

Canonical **architectural name** vs Intelligence route (ALIGN debt — architecture names first; eng rename later).

| Surface (architectural) | Route evidence (Intelligence) | Owner domain | Nav class | Target |
|-------------------------|-------------------------------|--------------|-----------|--------|
| Waitlist | `/` | ACCESS | Public global | KEEP |
| Brand | `/brand` | PUBLIC | Brand lockup (logo) | KEEP |
| Legal * | `/privacy` etc. | PUBLIC | Footer / links | KEEP |
| Login | `/login` | ACCESS | Auth | KEEP |
| Onboarding | `/onboarding` | ACCESS | Gate | REDESIGN |
| Pending access | gate | ACCESS | Gate | KEEP |
| **Today** | `/overview` | DAY | Global pin (label Today) | REDESIGN · **Day primary** |
| Habits | `/habits` | EXEC | Pin | KEEP |
| Goals | `/goals` | PLAN | Pin | KEEP |
| Journal | `/journal` | CAPTURE | Pin | REDESIGN |
| Notes | `/notes` | CAPTURE | Pin | KEEP |
| Finance | `/finance` | MONEY | Pin · tier | KEEP |
| Family | `/family` | FAMILY | Pin · tier | KEEP |
| Family Documents | Family tab | FAMILY | Local | MERGE (nested OK) |
| Calendar | `/calendar` | EXEC | Pin | KEEP |
| Career | `/placements` | CAREER | Pin · ALIGN label/path | KEEP |
| Sports | `/sports` | CONTEXT | Pin · tier · guest hide | KEEP |
| Discipline | `/discipline` | EXEC | Pin · tier · guest hide | REDESIGN |
| Focus | `/focus` | EXEC | Pin · tier | KEEP |
| Lab | `/lab` | LEARN | Pin · tier | FUTURE |
| Reports | `/reports` | DERIVED | Pin · tier | KEEP · absorb Insights |
| Insights | `/insights` | DERIVED | Orphan → MERGE→Reports | MERGE |
| Identity | `/identity` | PLAN | Orphan → MERGE→Goals/Onboarding identity | MERGE |
| Account | `/account` | CONFIG | Global utility | KEEP · MERGE with Settings |
| Settings | `/settings` | CONFIG | Global utility | MERGE→Account (single config hub) |
| Command palette | overlay | SYSTEM | Shared global | KEEP |
| Notifications | components | SYSTEM | Shared | REDESIGN |
| Capture `/m` | `/m` | CAPTURE | Phone-web root | KEEP |
| `/m` account lite | `/m/account` | CONFIG∩CAPTURE | Local `/m` | KEEP (lite only) |
| **`/m/score`** | `/m/score` | — | — | **REMOVE** (D05) |
| Native Home | HomeScreen | NATIVE≈DAY | Native global | REDESIGN |
| Native Journal/Notes/Vault/Goals/Discipline/Focus/More/Settings/Auth/Biometric | native | NATIVE + mapped domains | Native global/local | per Surface Inventory |
| Design lab / Seed | `/design-lab` `/seed-data` | DEV | — | REMOVE from user IA |

---

## 4 — Navigation hierarchy

```text
PUBLIC
├── Waitlist (/)
├── Brand (logo lockup)
├── Legal
└── Auth (Login → Onboarding → Pending access)

AUTHENTICATED APP (desktop / tablet)
├── Brand lockup: logo → Brand · wordmark → Today
├── GLOBAL: free-pin masthead (NAV_REGISTRY · max 12) — user-owned order
│     Required architectural primary among pins: Today
│     Domain pins: Habits, Goals, Journal, Notes, Finance, Family,
│                  Calendar, Career, Sports, Discipline, Focus, Lab, Reports
├── GLOBAL UTILITY (not pin registry): Account/Settings (single config hub target),
│     Command palette, Notifications
├── ORPHANS (architecture): Insights → MERGE Reports · Identity → MERGE Plan/Onboarding
└── DEV: Design lab / Seed — excluded from user hierarchy

PHONE WEB (/m) — capture ceiling
├── /m                Capture root
├── /m/account        Account lite only
└── /m/score          REMOVED from hierarchy (D05)

NATIVE
├── Auth · Biometric
├── Home (day ritual analogue)
├── Journal · Notes · Vault · GoalsLite
├── DisciplineUrge · FocusTimer
└── More · Settings
```

**Depth caps (from Intelligence):** typical depth 2; Family Documents depth 3 OK; no deeper user IA invented.

---

## 5 — Cross-domain relationships

| From | To | Relationship | Evidence |
|------|-----|--------------|----------|
| DAY | CAPTURE | Day logger / widgets open capture intents | Overview widgets · logger |
| DAY | EXEC / PLAN | Widgets → Habits / Goals | Intelligence cross-links |
| DAY | GROWTH | **Primary Life Score seat** | Feature Growth → Overview |
| DAY | DERIVED | Weak today; period “how am I doing?” → Reports | Insights↔Reports↔Overview redundancy |
| CAPTURE `/m` | DAY / desktop | Capture stopgap sync — not full OS | Program 0 / Constraints |
| FAMILY | Documents | Nested ownership | Surface Inventory MERGE |
| PLAN | ACCESS | Identity formed in onboarding | Onboarding · Identity MERGE |
| EXEC Focus/Discipline | NATIVE | Parallel screens | Surface Inventory |
| SYSTEM Command | many domains | Cross-cut navigation | IA Audit |
| CONFIG | all pin domains | Persona presets filter pins/widgets | navItems personas |
| CAREER label | placements route | ALIGN terminology | Content Inventory |
| CONTEXT Sports | ≠ GROWTH Life Score | Different “score” senses | Content + Features |

---

## 6 — Entity hierarchy (IA entities — not schema design)

Logical user-facing entities implied by Intelligence domains/features. **No new entities.** Schema remains locked.

```text
Person (OS-ID / account)
├── Day (Today)
│   ├── Daily log / metrics
│   ├── Micro tasks (widget)
│   ├── Logger utterances
│   └── Life Score (derived read — Growth)
├── Habits
├── Goals / Vision
│   └── Identity / Arc (MERGE into this branch)
├── Journal entries
├── Notes
├── Finance transactions / budgets
├── Family
│   ├── People
│   ├── Documents
│   └── Health records (family-scoped)
├── Calendar events (↔ Google)
├── Career applications / ATS pipeline
├── Sports context preferences
├── Discipline streak / urge events
├── Focus sessions
├── Lab experiments (FUTURE)
├── Reports / Insights (MERGE — derived aggregates)
└── Configuration (pins, personas, subscription, settings)
```

Capture-vs-derived (Intelligence + C-UX): capture entities write fast; Life Score / Reports are **derived** — no fake write UI on derived nodes.

---

## 7 — Founder Decision D05 — Score location

### Decision

| Field | Value |
|-------|-------|
| **Decision** | Remove `/m/score` exception |
| **Former state** | `/m/score` nested under phone capture (Intelligence IA Audit · Surface “Mobile score” REDESIGN · Debt D05) |
| **Ceiling** | `/m` = capture-only — no analytics/insights/tools (Constraints · Surface Capture KEEP) |
| **Verdict** | `/m/score` **out of `/m` IA**. Not a capture surface. |

### Canonical architectural location

| Priority | Location | Rationale (Intelligence only) |
|----------|----------|-------------------------------|
| **Primary** | **DOM-DAY · Today surface** (`/overview`) | Feature Inventory: Growth / Life Score → surfaces **Overview**; Content: Life Score language on Overview; Day spine primary (C-UX-04 / Alignment P8 Day) |
| **Secondary** | **DOM-DERIVED · Reports** | Period derived read; Insights MERGE→Reports (IA Audit consolidate read); not a second “Score app” |
| **Native analogue** | **Native Home** (ritual home) | Native Home = day analogue (Surface Inventory); continuity without using `/m` |
| **Forbidden** | **`/m` · `/m/score`** | Ceiling + Founder D05 |

### Architectural consequences (not eng tasks)

1. `/m` hierarchy children: capture root + account lite only.  
2. Score discoverability: Today (and Reports for period) — not phone capture shell.  
3. “Mobile score” surface classification → **REMOVE** from `/m`; score UX continues as **Day/Growth read** (REDESIGN of Today widgets may include score — UI later).  
4. Split terminology “Life Score / `/m/score`” (Content Inventory) → single concept **Life Score** owned by Growth, seated on Day.

---

## 8 — Global navigation

| Client | Global nav pattern | Members |
|--------|--------------------|---------|
| Desktop / tablet | Free-pin masthead (max 12) + brand lockup + command palette | Pins from NAV_REGISTRY; Today architectural primary; wordmark → Today; logo → Brand |
| Desktop utility | Account/Settings (MERGE target), Notifications | Outside pin registry |
| `/m` | Capture shell bottom/local nav only | Capture · account lite — **no score tab** |
| Native | Tab/screen set | Home, Journal, Notes, Vault, GoalsLite, Discipline, Focus, More, Settings |
| Public | Waitlist / Brand / Legal / Login | Pre-auth |

**Excluded from global user nav:** Insights (merge), Identity (merge), Seed, Design lab, Sidebar legacy (REMOVE/confirm), `/m/score`.

---

## 9 — Local navigation

| Surface | Local nav (Intelligence) | Rules |
|---------|--------------------------|-------|
| Family | Tabs including Documents | Depth ≤3; Documents stay family-owned |
| Finance | Money tabs | Domain-local |
| Account | Sections (incl. design/dev) | Design section = DEV — not user IA |
| Today | Widgets (persona-filtered) | Widgets subordinate to Day spine; no meaningless widget primacy |
| Reports | Period controls | Derived calm read |
| `/m` | Capture sections | Capture-only; no score |
| Native Journal | List → Detail | Depth 2 |

---

## 10 — Shared navigation

| Mechanism | Scope | Owns |
|-----------|-------|------|
| Command palette | Desktop authenticated | Cross-domain jump / actions |
| Brand lockup | All web | Logo→Brand · wordmark→Today (locked) |
| Persona pin presets | Desktop | Filters which domain pins/widgets appear — does not replace Day primacy |
| TierRouteGuard | Tiered domains | Lock screen — not a domain |
| Notifications entry | System | Immature — shared chrome |
| Overflow “More” | Native | Honest overflow |

---

## 11 — Boundary rules

| ID | Rule |
|----|------|
| BR-01 | `/m` may only host **capture** (+ account lite). No score, analytics, insights, focus tools, pomodoro. |
| BR-02 | Life Score primary seat = **Today**; secondary period = **Reports**. Never `/m`. |
| BR-03 | No new top-level domains for Health / Tasks / AI / Documents aliases. |
| BR-04 | Insights MERGE→Reports; Identity MERGE→Plan/Onboarding identity — not permanent orphans. |
| BR-05 | Account + Settings → single **Configuration** hub (MERGE target). |
| BR-06 | Free-pin masthead is global app nav; Sidebar not canonical. |
| BR-07 | Dev surfaces out of user IA. |
| BR-08 | Derived nodes (Score, Reports) do not grow capture-style write UIs. |
| BR-09 | Native ≠ `/m` ceiling; Native Home may reflect Day/score — `/m` must not. |
| BR-10 | Terminology ALIGN (Today/overview, Career/placements) is IA debt — architecture uses Today + Career names; routes are evidence labels until eng. |
| BR-11 | Tier and guest hides are access boundaries, not alternate IA trees. |
| BR-12 | No feature/surface invention beyond Intelligence inventories. |

---

## 12 — Cross-surface contracts

| Contract ID | Surfaces | Contract |
|-------------|----------|----------|
| CS-DAY | Today ↔ Native Home | Day intent continuity; Home is native day analogue; score readable on Day/Home — not `/m`. |
| CS-CAPTURE | `/m` ↔ Today logger / Journal / Notes | `/m` writes capture; desktop structures/reviews; no analytics on `/m`. |
| CS-SCORE | Today · Reports · ~~`/m/score`~~ | Single Life Score concept; primary Today; period Reports; `/m/score` **null**. |
| CS-CONFIG | Account/Settings ↔ Native Settings ↔ `/m` account lite | One config domain; lite on `/m` only for account essentials — not score. |
| CS-FAMILY | Family web ↔ Native Vault | Family/vault continuity subset. |
| CS-EXEC | Focus/Discipline web ↔ Native FocusTimer/DisciplineUrge | Execution continuity. |
| CS-PLAN | Goals web ↔ GoalsLite native | Planning subset on native. |
| CS-AUTH | Login web ↔ Auth/Biometric native | Session/unlock; pending access web-only gate. |
| CS-COMMAND | Command palette | Desktop-only shared nav (Constraints matrix). |
| CS-PUBLIC | Waitlist/Brand/Legal | Pre-auth only; brand lockup persists in-app. |

---

## 13 — Alignment actions (architecture targets only)

| Intelligence debt | IA action |
|-------------------|-----------|
| D01 Today≠overview | Architectural name **Today**; route evidence `/overview` until eng ALIGN |
| D02 Career≠placements | Architectural name **Career**; route `/placements` until eng ALIGN |
| D03 Account+Settings | MERGE → Configuration hub |
| D04 Insights/Identity orphans | MERGE Insights→Reports; Identity→Plan/Onboarding |
| **D05 `/m/score`** | **CLOSED by Founder** — REMOVE from `/m`; seat on Today (+ Reports secondary) |
| D06 Widget overload | Today REDESIGN target under Day spine (not UI now) |
| D18 Sidebar | Non-canonical |
| D19 Dev routes | Out of user IA |
| D20 Native≠web | Contracts CS-* above |

---

## 14 — Traceability

| Claim | Intelligence cite |
|-------|-------------------|
| Domains / features | `02_Feature_Inventory` |
| Surfaces / classes | `01_Surface_Inventory` |
| Nav tree / orphans / `/m/score` | `04_Information_Architecture_Audit` |
| Score / terminology | `09_Content_Inventory` |
| `/m` ceiling · three clients | `11_Technical_UX_Constraints` |
| D05 and IA debts | `12_UX_Debt_Register` |
| Day / settings / `/m` / platforms | `14_Genesis_Alignment_Matrix` (cite only via Intelligence) |

---

**Stop.** Canonical IA only. No UI redesign. No eng implementation.
