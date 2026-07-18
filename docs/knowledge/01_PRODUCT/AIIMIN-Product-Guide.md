# AIIMIN Product Guide

> **Canonical product document.** What AIIMIN is, why it exists, what it does, where it runs, and how the pieces fit together.  
> **Audience:** founders, testers, agents, collaborators.  
> **Last updated:** 2026-07-18

---

## 1. Executive summary

**AIIMIN** (pronounced *aim-in*) is a **personal Life OS** — a browser-based behavioural operating system for people who want disciplined execution, honest reflection, and compounding momentum across habits, money, focus, goals, and recovery.

**Tagline (product):** *One screen. Every day.*

**Brand frame:** *Human Momentum* — the infrastructure for human momentum, not another engagement-optimised dashboard.

**Owner:** Aaditya Upadhyay  
**Stack (one line):** React 19 frontend on Vercel · Node API on EC2 (`api.aiimin.in`) · Supabase Postgres · Better Auth + Google OAuth

**Live surfaces:**
- **Web app** — full Life OS at `aiimin.in` (desktop + tablet)
- **Mobile capture** — `/m` on phones (data collection only; native app planned)
- **Brand / legal** — `/brand`, privacy, terms, security, contact

---

## 2. The problem we solve

Modern productivity software optimises for **engagement**, not **intent**. Users accumulate:

- **Fragmented truth** — habits in one app, money in another, journal elsewhere, calendar disconnected
- **Context switching** — hours lost moving between tools that do not talk to each other
- **Vanity analytics** — charts that look good but do not change behaviour
- **Shame loops** — streak punishment and wellness theatre instead of recovery-oriented design
- **Data anxiety** — behavioural archives trapped in platforms that harvest or sell attention

**AIIMIN’s answer:** one Life OS where **capture → score → insight → action** is a closed loop. Every feature must earn its place by helping someone **see truth**, **act today**, and **compound tomorrow**.

We refuse: ad tracking, data harvesting, streak shame, and feature bloat that dilutes focus.

---

## 3. Motivation & purpose

### Why we built this

AIIMIN exists because the founder and early users live under **real cognitive load** — students, early-career builders, athletes, founders — and need a system that:

1. **Reduces chaos** — goals become daily behaviours, not wish lists
2. **Keeps truth visible** — what you log is what the score reflects
3. **Builds consistency** — streaks, rituals, focus sessions, and gentle recovery after slips
4. **Respects privacy** — your behavioural archive is yours; exportable, deletable, not sold

### Human Momentum (brand philosophy)

The `/brand` manifesto defines nine pillars. In product terms they map to:

| Pillar | Product expression |
|--------|-------------------|
| Absolute Precision | Minimal UI, locked palette, no decorative chrome |
| Feedback Loops | Log → Life Score → Weekly Insight → next action |
| Behavioral Intelligence | Reports Patterns, correlations (Pro+), AI summaries |
| Data Sovereignty | Export, wipe-life-data, account deletion, no ads |
| Momentum Engineering | Streaks, XP/ranks, habit heatmaps, trajectory widgets |
| Deep Mode State | Focus Room — pomodoro with intent, reduced noise |
| Dimensional Analysis | Cross-domain Life Score (habits, journal, goals, sleep, wealth) |
| Disciplined Growth | Features ship only when they reinforce momentum |
| Adaptive Interventions | Urge surfing, micro-tasks, Monday insight nudges |

**We are:** a Life OS for intent · a private behavioural archive · cheap daily capture with honest patterns.

---

## 4. What AIIMIN is (conceptual model)

AIIMIN is not a single feature. It is four layers:

```text
┌─────────────────────────────────────────────────────────┐
│  TODAY (command surface)                                 │
│  Insight · Life Score · Logger · Timeline · Trajectory   │
├─────────────────────────────────────────────────────────┤
│  LIFE DOMAINS (capture & structure)                      │
│  Habits · Goals · Journal · Notes · Finance · Family     │
│  Calendar · Career · Sports · Discipline · Focus · Lab   │
├─────────────────────────────────────────────────────────┤
│  INTELLIGENCE (optional, tier-gated)                     │
│  Weekly insight · Journal AI · Reports · Correlations    │
├─────────────────────────────────────────────────────────┤
│  ACCOUNT & TRUST                                         │
│  Profile · Personalization · Subscription · Data · Legal │
└─────────────────────────────────────────────────────────┘
```

### Core loop

1. **Capture** — log a habit, journal entry, transaction, focus session, or free-text via Universal Logger
2. **Score** — Life Score (0–98) aggregates habits, journal, goals, sleep, wealth from API data
3. **Reflect** — Weekly Insight, journal modes, Reports
4. **Act** — Goals pipeline, calendar blocks, Focus Room, Discipline toolkit

### Life Score (headline metric)

Composite score across five domains: **Habits**, **Journal**, **Goals**, **Sleep**, **Wealth**. Shown on Today → Command Center. API-backed (not localStorage-only) so seeded accounts reflect real data.

---

## 5. Who it’s for

### Primary personas (built into nav presets)

| Persona | Emphasis |
|---------|----------|
| **Student** | Study rhythm, placements, habits, money, focus, calendar |
| **Working professional** | Calendar, finance, family, goals, career growth |
| **Founder / builder** | Execution, lab experiments, finance, discipline, shipping momentum |
| **Family / household** | Shared routines, family vault, finances, calendar |
| **Athlete / fitness** | Training consistency, discipline, sports, recovery, goals |

### Anti-personas (not optimised for)

- Casual wellness browsers who want passive content feeds
- Teams needing multi-user collaboration (v1 is personal OS)
- Users who want ad-supported free tools with social graphs

---

## 6. Devices & where AIIMIN runs

Canonical reference: [[02_ARCHITECTURE/Device-Tiers]]

| Device | Detection | Experience | URL |
|--------|-----------|------------|-----|
| **Desktop** | viewport ≥ 1100px | Full Life OS — wide layouts, masthead, all routes | `/overview`, `/habits`, … |
| **Tablet (iPad)** | iPad UA or 768–1099px width | Full Life OS — touch targets ≥44px, scrollable nav | Same as desktop |
| **Phone** | mobile UA or width &lt;768 (non-iPad) | **Capture only** — daily log, no analytics/tools | `/m` |
| **Testing bypass** | — | Force desktop shell on phone | `?forceDesktop=1` |

### Platform support (current)

| Platform | Status |
|----------|--------|
| **Modern browsers** (Chrome, Safari, Firefox, Edge) | Supported — primary target |
| **iPad / tablet** | Full web app |
| **iPhone / Android phone** | `/m` capture shell only |
| **Native iOS / Android app** | Roadmap — not shipped |
| **Offline** | Partial (localStorage fallbacks); not offline-first |

### Hosting

- **Frontend:** Vercel (auto-deploy from `main`)
- **API:** EC2 — `https://api.aiimin.in`
- **Database:** Supabase PostgreSQL (row-level security per user)

---

## 7. Complete feature map

All primary nav routes: `frontend/src/constants/navItems.js`  
Route guards: `frontend/src/utils/tierGating.js`

### 7.1 Today (`/overview`) — Explore+

**Purpose:** Daily command surface — one screen to orient, capture, and act.

**Widgets** (user-toggleable):

| Widget | What it does |
|--------|----------------|
| Weekly Insight | AI summary of the week (Core+); local fallback if model leaks |
| Week in Numbers | Stat bullets for the week |
| Execution Window | Countdown / execution framing |
| Recent Wins | Positive recap chips |
| Micro Task | Single small action for today |
| Command Timeline | Day timeline view |
| Capture (Universal Logger) | Natural-language log → AI routes to domain (Explore+) |
| Command Center | Life Score + five domain chips |
| Trajectory | Momentum arc over time |

**Also on Today:** XP/gamification hooks, persona-driven widget defaults.

---

### 7.2 Habits (`/habits`) — Core+

- Create, edit, delete habits with categories
- Daily completion toggle per habit
- Streak counter and 7-day week strip
- Monthly dot grid per habit
- **Yearly Habit Matrix** (GitHub-style heatmap)
- Completion colors: 8/8 green, 6–7 lighter green, &lt;6 gray (see [[08_DESIGN/Palette]])

---

### 7.3 Goals (`/goals`) — Core+

- **Views:** Pipeline (kanban by status), Grid (by pillar), Archive (achieved)
- **Pillars:** Academic, Career, Health, Personal
- **Statuses:** Active, On Track, At Risk, Achieved
- Deadline picker (branded calendar, not native date input)
- Progress %, notes, full CRUD

---

### 7.4 Journal (`/journal`) — Explore+

| Mode | Purpose |
|------|---------|
| Today | Daily reflection |
| Free Write | Unstructured |
| CBT Record | Cognitive behavioural template |
| What Went Well | Positive recap |
| Morning Pages | Morning dump |
| Weekly Review | Week retrospective |

- Socratic prompts, legacy urge/relapse tags
- Journal AI (Core+)

---

### 7.5 Notes (`/notes`) — Explore+

- Note list + rich editor
- Search and source tags (text, voice, etc.)
- Google Drive folder watch (sync from Drive)
- Link notes to goals/tasks

---

### 7.6 Finance (`/finance`) — Core+

| Tab | Purpose |
|-----|---------|
| Overview | Net worth pulse, recent activity |
| Analytics | Charts and trends |
| Accounts | Bank, cash, credit |
| Transactions | Income / expense log |
| Budgets | Category budgets |
| Wealth | Investments and assets |

**Also:** CSV import, AI text import, INR formatting, what-if (Pro+), wealth AI (Pro+).

---

### 7.7 Family (`/family`) — Pro+

**People:** Members · Relationships · Emergency contacts  
**Records:** Documents · Insurance · Health · Vehicles · Family finance · Reminders  

Sensitive fields with show/hide. Household vault for life admin.

---

### 7.8 Calendar (`/calendar`) — Explore+

- **Views:** Month, Week, Day, Agenda
- Sidebar mini-month + upcoming list
- Create / edit / delete events
- **System types:** Work, Health, Finance, Social, Reflection, General (each has semantic color)
- All-day and timed events
- **Google Calendar pull** (sync metadata; last 90 days)

---

### 7.9 Career / Placements (`/placements`) — Core+

| Tab | Purpose |
|-----|---------|
| Kanban | Application pipeline |
| Timeline | Chronological applications |
| Resources | Prep links |
| Resumes | Vault + Google Drive preview |
| Trajectory | Career momentum metrics |

Statuses: applied → interview → offer, etc.

---

### 7.10 Sports (`/sports`) — Core+

Tabs: **Cricket · Football · Basketball · F1**

- Match feeds and next-moment aggregator
- Team favorites (persona defaults)
- Personalized feed (Core+)

---

### 7.11 Discipline (`/discipline`) — Core+

- Streak counter (primary signal)
- Pledge and milestones
- Emergency toolkit
- **Urge Surfing** — 15-min timer, breathe cues, extend +5, optional note (Core+; API-backed)
- Slip log (recovery-oriented language, not shame)
- Replacement habits, community wall, crisis/support link

*Not clinical treatment — compounding willpower tooling.*

---

### 7.12 Focus (`/focus`) — Core+

- Pomodoro presets (work / short break / long break)
- Work intent per session
- Liquid timer ring + breathing visual
- Today session count, minutes, weekly target

---

### 7.13 Lab (`/lab`) — Core+

Experimental skills and reflection tools, grouped in sidebar:

**Mental Models & Focus**
- Decision Matrix
- Dopamine Detox
- Addiction Tracker
- Personality AI (swipe quiz)

**Reflection & Growth**
- Reading Log

**Cognitive Training**
- Typing Speed (WPM, accuracy, streak)
- Aptitude Tests
- Quantitative Maths

**Interview Prep**
- Vocal Mastery (60s recording + score)
- STAR Method
- Resume ATS Matcher

**Skill Forge**
- Tech Simulator (code MCQs)
- Domain Flashcards (spaced repetition)
- System Design whiteboard

Lab hub also shows typing stats, mindset state, Life Score snapshot.

---

### 7.14 Reports (`/reports`) — tiered

| Tab | Minimum tier | Deliverable |
|-----|--------------|-------------|
| Report / Snapshot | Core+ | Ivory Snapshot (7d pulse) |
| Report (PDF) | Pro+ | Life OS Review PDF download |
| Patterns | Pro+ | Cross-domain pattern analysis |
| Skills | Pro+ | Skill tree panel |
| Intelligence (web) | Elite | Deep correlations (craft) |

`/insights` redirects to `/reports?tab=patterns|skills`.

---

### 7.15 Account (`/account`) — Explore+

| Section | Purpose |
|---------|---------|
| My Profile | Identity, location, completion % |
| Personalization | Theme, pinned nav, active sections, persona, widgets |
| Design Lab | Overview prototypes, themes, UI library |
| Notifications | Reminder toggles |
| Privacy & Security | Sessions, safety |
| Subscription | Plan and billing |
| Data & Export | Backup export, **Wipe all life data** (`WIPE ALL DATA` confirm) |
| Legal | Policy links |

`/settings` — additional settings. `/design-lab` → Account → Design.

---

### 7.16 Identity & brand (public)

| Route | Purpose |
|-------|---------|
| `/brand` | Human Momentum manifesto — problem, pillars, storage, legal, roadmap, stack |
| `/identity` | Brand story hub (animated marketing) |
| `/` | Waitlist landing when `REACT_APP_WAITLIST_MODE=true` |
| `/privacy`, `/terms`, `/data-deletion`, `/security` | Compliance |
| `/about`, `/contact` | Marketing |

**Navbar lock (product):** logo mark → `/brand`; **AIIMIN** wordmark text → `/overview`.

---

### 7.17 Mobile capture (`/m`)

**LOCKED product rule:** phones get capture only.

- Quick daily data entry
- No analytics, insights, pomodoro, lab, or full OS on phone web
- Dark shell palette hardcoded for capture UX
- Native app on roadmap

---

### 7.18 Cross-cutting systems

| System | Where |
|--------|-------|
| **Life Score** | Today Command Center, Lab hub |
| **Gamification** | XP, ranks, quests, achievements, streak multipliers, sounds |
| **Command Palette** | Global keyboard launcher |
| **Tier gating** | Route locks + feature flags (Explore / Core / Pro / Elite) |
| **Onboarding** | Post-auth life-mode tour on real routes |
| **Auth** | Better Auth + Google OAuth, email verify |
| **Seed data** | `/seed-data` (dev/demo populate) |

---

## 8. Subscription tiers

Tiers: **Explore** &lt; **Core** &lt; **Pro** &lt; **Elite**

### Route minimums

| Tier | Routes unlocked |
|------|-----------------|
| Explore | Today, Calendar, Journal, Notes, Account, Settings, Identity, Reports (paywall on deep tabs) |
| Core | + Habits, Goals, Finance, Focus, Lab, Sports, Discipline, Career, Snapshot report |
| Pro | + Family, Patterns/Skills, weekly digest, finance what-if, wealth AI, Life OS Review PDF |
| Elite | + Intelligence web, deep correlations |

### Feature flags (examples)

- `monday_insight`, `journal_ai`, `discipline_urges`, `finance_advanced` → Core
- `family_vault`, `weekly_digest`, `finance_whatif`, `wealth_ai` → Pro
- `universal_logger`, `arc_sharpen` → Explore-safe

Pricing (waitlist): Core complimentary at launch; founding Pro ₹49/mo; Elite ₹79/mo. See [[09_FEATURES/Waitlist/Waitlist]].

---

## 9. Design & color system

Full lock: [[08_DESIGN/Palette]]  
CSS tokens: `frontend/src/styles/tokens.css`  
Canonical themes: `aiimin-dark`, `aiimin-light` (`frontend/src/constants/themes.js`)

### Brand-locked colors

| Role | Dark | Light |
|------|------|-------|
| Background | `#1a1a1a` | `#EDE4D3` (ivory) |
| Cards | `#2d2d2d` | `#ffffff` |
| Accent | `#ff6b35` | `#ff6b35` (CSS may use `#E85A24` in light) |
| Done / success | `#10b981` | `#10b981` |
| Muted | `#6b7280` | `#6b7280` |

### CSS variables (runtime)

Use `var(--color-base)`, `--color-surface`, `--color-elevated`, `--color-border`, `--color-text-1/2/3`, `--color-accent`, `--color-success`, `--color-danger`, `--glass-*` on product surfaces.

### Semantic maps (not global tokens)

- **Calendar event types** — work `#ff6b35`, health `#10b981`, finance `#E8B84B`, social `#5B8DEF`, reflection `#9A7B4F`, general `#6b7280`
- **Goals pillars** — academic gold, career green, health orange, personal gray
- **Goals status** — on track green, at risk red, active gray

Do not introduce new brand colors without explicit approval.

---

## 10. Technology & data

### Architecture

- **Frontend:** React 19, Tailwind, design tokens, lazy routes
- **API:** Node Express routes under `server/`
- **DB:** Supabase Postgres, user-scoped rows
- **Auth:** Better Auth + Google OAuth
- **AI:** Gemini / Groq / OpenRouter (feature-dependent); daily vs monthly pools for reports
- **Email:** Resend (waitlist, transactional)
- **Billing:** Stripe (when subscription mode on)

### What we store (summary)

Habits, goals, journal, notes, finance, focus sessions, calendar sync metadata, discipline logs, preferences — tied to user ID. Not sold. Not used for ads.

### User data rights

Access, correction, export, wipe life data, full account deletion, Google revoke. Documented on `/brand` and legal routes.

---

## 11. What we deliberately do not do (v1)

- Phone web is **not** the full OS — `/m` capture only
- No ad tracking or behavioural ad profiles
- No multi-tenant team workspaces
- No schema/auth changes without explicit product decision
- Discipline is **not** clinical addiction treatment
- No shame-first streak punishment UX

---

## 12. Launch & access (current lens)

- Waitlist gate when `REACT_APP_WAITLIST_MODE=true`
- Go-live target: end Sep 2026; tester close 31 Jul 2026
- Dev/tester emails: elite tier + full access
- Launch checklist LC-01..LC-14 — see [[01_PRODUCT/Product]]

---

## 13. Related vault docs

| Topic | Path |
|-------|------|
| Product snapshot | [[01_PRODUCT/Product]] |
| Features index | [[09_FEATURES/Index]] |
| Device tiers | [[02_ARCHITECTURE/Device-Tiers]] |
| Palette | [[08_DESIGN/Palette]] |
| Architecture | [[02_ARCHITECTURE/Overview]] |
| Deploy | [[07_DEPLOYMENT/Deploy]] |
| Current agent context | [[15_MEMORY/Current-Context]] |
| Waitlist | [[09_FEATURES/Waitlist/Waitlist]] |
| Life Score | [[09_FEATURES/LifeScore/LifeScore]] |

---

## Changelog

### 2026-07-18 — Canonical product guide
- **What:** Created full product guide — purpose, problem, devices, complete feature map, tiers, design tokens summary
- **Why:** User requested in-depth vault doc for onboarding and agent handoff
- **Files:** `docs/knowledge/01_PRODUCT/AIIMIN-Product-Guide.md`, links from Home + Product
- **Status:** shipped
