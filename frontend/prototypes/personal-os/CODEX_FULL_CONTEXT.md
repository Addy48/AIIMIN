# AIIMIN Personal OS — Full Codex Context Pack

**Give this entire file to Codex.** It replaces codebase reading for prototype / mobile-app design work.

| Field | Value |
|-------|-------|
| **Owner** | Aaditya Upadhyay |
| **Product** | AIIMIN — Personal Life OS |
| **Tagline** | *One screen. Every day.* |
| **Brand frame** | *Human Momentum* |
| **Assembled** | 2026-07-26 |
| **Full path** | `/Users/aaditya/Desktop/DASHBOARD PROJECT/frontend/prototypes/personal-os/CODEX_FULL_CONTEXT.md` |

---

## TABLE OF CONTENTS

1. [What Codex is building](#1-what-codex-is-building)
2. [Website vs App vs Native — who does what](#2-website-vs-app-vs-native)
3. [Identity, OS-ID, seamless sync](#3-identity-os-id-seamless-sync)
4. [Complete feature catalog (≥40% ship chance)](#4-complete-feature-catalog)
5. [Four billing tiers — full spec](#5-four-billing-tiers)
6. [Onboarding — production + prototype](#6-onboarding)
7. [Navigation — better without looking template](#7-navigation)
8. [Motion & transitions](#8-motion--transitions)
9. [Eliminate AI slop — peak rules](#9-eliminate-ai-slop)
10. [Design system (locked palette)](#10-design-system)
11. [Five prototype directions](#11-five-prototype-directions)
12. [UX research — what others learned](#12-ux-research)
13. [Codex checklist (don’t make Founder remember)](#13-codex-checklist)
14. [Source assets & preserved names](#14-source-assets)
15. [Optional code pointers](#15-optional-code-pointers)
16. [Paste-ready Codex prompt](#16-paste-ready-codex-prompt)

---

## 1. What Codex is building

### Founder intent

Create **4–5 distinct HTML prototype directions** from design assets. Each direction must differ in **structure, interaction model, and information architecture** — not just color or copy.

Each prototype needs:
- **Light + dark** theme
- **Functional theme toggle**
- **Onboarding flow** (splash → setup → app)
- **Correct logo usage**
- **Settings** layout like reference image (Account / Preferences / Data & Sync / Support)
- **All 4 billing tiers** shown correctly
- **Demo-clickable** controls (toasts, navigation, toggles)
- **No AI slop** (see §9)

### Read-only inputs (do NOT modify)

| Asset | Path |
|-------|------|
| HTML prototype v1 | `/Users/aaditya/Downloads/Prototyps-APP/aiimin-prototype copy.html` |
| HTML prototype v2 | `/Users/aaditya/Downloads/Prototyps-APP/index-opus.html` |
| Design refs | Today (4 concepts), Notes/Documents/Family board, Settings screen (user-provided images) |

### Output location (when building)

`/Users/aaditya/Desktop/DASHBOARD PROJECT/frontend/prototypes/personal-os/`

Suggested files:
- `prototype-a-mission-control.html`
- `prototype-b-ai-companion.html`
- `prototype-c-card-workspace.html`
- `prototype-d-timeline-os.html`
- `prototype-e-spatial-brain.html`
- `index.html` (launcher)

### Four visual concepts → two shipping skins

Reference boards show 4 aesthetics. Map to **two final skins** using **locked AIIMIN palette** (not reference blues/purples):

| Reference concept | Character | Shipping skin |
|-------------------|-----------|---------------|
| Light · Clean & Focused | White cards, thin borders, airy | **Light Clean** — bg `#f9f9f9`, cards `#ffffff` |
| Light · Playful & Illustrative | Cream, soft cards, colored icon chips | **Light Warm** — same palette, warmer spacing; **no clipart mascots** |
| Dark · Focus & Flow | Deep charcoal, high contrast data | **Dark Focus** — bg `#1a1a1a`, cards `#2d2d2d` |
| Dark · Soft & Neutral | Warm dark gray, muted accents | **Dark Soft** — same dark tokens, softer borders |

**Accent always:** `#ff6b35` (burnt orange). **Done:** `#10b981`. **Muted:** `#6b7280`.

---

## 2. Website vs App vs Native

### 2.1 Website (`aiimin.in`) — marketing + gate

**Job:** Acquire users, explain product, reserve OS-ID, show pricing, build trust.

| Route / surface | Purpose |
|-----------------|---------|
| `/` (waitlist mode) | Landing: hero, personas, **4 tier pricing**, launch journey, testimonials, FAQ, signup form |
| `/brand` | Human Momentum manifesto — pillars, storage, privacy, roadmap |
| `/login`, `/auth` | Sign in — Google OAuth or OS-ID/email |
| `/identity` | Brand story marketing |
| `/privacy`, `/terms`, `/security`, `/data-deletion`, `/contact` | Legal / compliance |
| Guest tour | Preview slices before account |

**Website does NOT:** Run the full Life OS for anonymous users (except limited guest tour).

**Waitlist signup flow:**
1. Land on `/` → email (required), first name (optional), OS-ID (optional, 8 chars)
2. `POST /api/waitlist` → position, referral code, reserved username
3. Confirmation email; owner notified
4. Perks locked: complimentary Core at launch, founding Pro/Elite prices, referral +5 queue spots

**Navbar lock (product):**
- **Logo mark** click → `/brand`
- **AIIMIN wordmark text** click → `/overview` (when logged in) — **split targets, never unify**

---

### 2.2 Web Life OS — full product (desktop + tablet)

**Job:** Daily command surface + all life domains + intelligence + account.

| Who | Detection | Experience |
|-----|-----------|------------|
| Desktop | viewport ≥ 1100px | Full OS, wide layouts, masthead nav |
| Tablet | iPad or 768–1099px | Full OS, TabRail, touch ≥44px |
| Phone browser | &lt;768px, non-iPad | **`/m` capture only** — NOT full dashboard |

**Core loop:**
```text
Capture → Life Score → Reflect → Act
(log)     (0–98)      (insight)  (goals/focus/calendar)
```

**Primary nav routes** (web masthead — user can pin subset):
- Today (`/overview`)
- Habits, Goals, Journal, Notes, Finance, Family, Calendar, Career, Sports, Discipline, Focus, Lab, Reports
- Account (`/account`), Settings (`/settings`)

**Today widgets** (toggleable): Weekly Insight, Week in Numbers, Execution Window, Recent Wins, Micro Task, Command Timeline, Universal Logger, Command Center (Life Score), Trajectory.

---

### 2.3 Phone web `/m` — capture stopgap (LOCKED)

**Product rule:** `/m` = **data collection ONLY**.

- No analytics dashboards, pomodoro, lab, insights on phone web
- Routes: `/m`, `/m/score`, `/m/account` (lite)
- Offline log queue (IndexedDB) syncs on reconnect
- Capacitor Android may load remote `https://aiimin.in/m`

---

### 2.4 Native Android V2 — rich companion (NOT capture-only)

**Critical:** Native app ≠ `/m` ceiling. Native is a **companion** with richer IA.

| Item | Detail |
|------|--------|
| Stack | Kotlin Compose, Room, Retrofit |
| API | `GET /api/mobile/bootstrap`, `POST /api/mobile/sync/batch`, `POST /api/mobile/devices` |
| Screens | Today, Journal, Notes, Vault, Habits strip, Discipline, Focus stats, Settings, More |
| Auth | Same Better Auth user as web; cookie session + bootstrap |
| Offline | WorkManager queue, sync banner |
| Status | ~92% complete (build tracker in vault) |

**Prototype note:** Mobile HTML prototypes may explore **native-level richness** — label them “native companion exploration,” not “phone web `/m`.”

---

### 2.5 Summary matrix

| Client | Full OS? | Primary job |
|--------|----------|-------------|
| Desktop web | ✅ Yes | Command, analytics, billing, family vault |
| Tablet web | ✅ Yes | Same + touch |
| Phone web `/m` | ❌ No | Quick daily capture |
| Native Android | Partial | Fast log, journal, vault, offline sync |
| Waitlist site | N/A | Convert + explain tiers |

---

## 3. Identity, OS-ID, seamless sync

### 3.1 OS-ID (user handle)

| Rule | Detail |
|------|--------|
| Length | Exactly **8 characters** |
| Charset | `A-Z 0-9 @ , . _ - = + * ^ $ # !` |
| Digits | Max **4** digits in handle |
| Reserved | Waitlist form, onboarding step, post-signup attach |
| Login | User signs in with **OS-ID OR email** |
| Display | Monospace “credential card” on profile — copy feedback |
| Meaning | Public handle tied to one `user_id` — not a second account |

Example user for prototypes: **Aaditya Upadhyay** · `aaditya@aiimin.in` · OS-ID like `AADITYA@` or `AU******` · badge **PRO FOUNDING**

### 3.2 Auth

- **Better Auth** + Google OAuth
- Email verification required on product routes
- **6-digit PIN** set during onboarding (mobile quick re-auth)
- Session cookies; native uses CookieJar

### 3.3 Web ↔ Native sync architecture

```text
                    ┌─────────────────────┐
                    │  Supabase Postgres   │
                    │  (one user_id)       │
                    └──────────┬──────────┘
           ┌──────────────────┼──────────────────┐
           ▼                  ▼                  ▼
    Web REST routes    /api/mobile/bootstrap   /api/mobile/sync/batch
    /api/habits        (home payload)          (idempotent writes)
    /api/daily-logs
    /api/journal...
```

**Bootstrap returns:** profile snippet, today summary, habit strip, `syncCursor`, `serverTime`.

**Batch sync:** client sends typed ops with idempotency keys; server applies; returns per-item results.

**User-visible “Data Sync” toggle** in Settings = mental model for background sync (not a second login).

### 3.4 What must feel seamless

1. Waitlist email → same account at launch → native recognizes session
2. Tier upgrade on web → native plan chip updates on next bootstrap
3. Log on phone → appears on desktop Today within one sync cycle
4. OS-ID identical on waitlist confirmation, profile, settings header

---

## 4. Complete feature catalog

**Rule:** If ≥30–40% chance of shipping, include in prototype planning.

Legend: **Tier** = minimum plan · **W** = Web · **N** = Native · **M** = `/m` mobile web · **S** = Marketing site

### 4.1 Core loop (90%+ ship)

| Feature | What it does | Surfaces | Min tier |
|---------|--------------|----------|----------|
| **Today / Overview** | Daily command — score, widgets, plan | W, N | Explore |
| **Life Score** | 0–98 composite: habits, journal, goals, sleep, wealth | W, N | Explore |
| **Universal Logger** | Natural language log → AI routes to domain | W | Explore |
| **Habits** | CRUD, daily toggle, streaks, yearly heatmap matrix | W, N | Core |
| **Goals** | Pipeline kanban, grid by pillar, archive | W | Core |
| **Journal** | Modes: Today, Free Write, CBT, What Went Well, Morning Pages, Weekly Review | W, N | Explore |
| **Notes** | List + editor, search, tags, Google Drive watch | W, N | Explore |
| **Calendar** | Month/week/day/agenda; Google Calendar pull (90d) | W | Explore |
| **Account** | Profile, OS-ID, plan, security, sign out | W,N,M,S | Explore |
| **Settings / Personalization** | Theme, pinned nav, persona preset, widgets | W | Explore |
| **Onboarding** | Post-auth 10-step setup | W, N | All new users |
| **Auth** | Google + OS-ID/email | All | — |

### 4.2 Execution & focus (70%+)

| Feature | What it does | Surfaces | Min tier |
|---------|--------------|----------|----------|
| **Focus / Pomodoro** | Work intent, timer ring, session stats | W | Core |
| **Discipline Engine** | Streaks, pledge, milestones, toolkit | W, N | Core |
| **Urge Surfing** | 15-min timer, breathe cues, extend +5, slip log (recovery tone) | W | Core |
| **Tasks / Today plan** | Checkbox list, time tags, priorities | W, prototypes | Core |
| **Command timeline** | Day schedule on Today | W | Explore |
| **Command palette** | ⌘K global launcher | W desktop | Explore |
| **Notifications** | Streaks, reminders, budget alerts | W, N | Explore |
| **Search** | Cross notes/tasks/files | W | Explore |

### 4.3 Money & household (60%+)

| Feature | What it does | Surfaces | Min tier |
|---------|--------------|----------|----------|
| **Finance overview** | Net worth pulse, recent activity | W | Core |
| **Budgets** | Monthly budget, category breakdown | W | Core |
| **Transactions** | Income/expense log, INR format | W | Core |
| **CSV / AI import** | Bulk money ingest | W | Core |
| **Wealth tab** | Investments, assets | W | Core |
| **Finance what-if** | Scenario modeling | W | Pro |
| **Wealth AI** | Narrated money insights | W | Pro |
| **Family hub** | Members, relationships, emergency contacts | W | Pro |
| **Family vault** | Documents, insurance, health, vehicles, reminders | W | Pro |

### 4.4 Intelligence & reports (60%+)

| Feature | What it does | Surfaces | Min tier |
|---------|--------------|----------|----------|
| **Monday / Weekly insight** | AI week summary on Today | W | Core |
| **Ivory Snapshot** | 7-day pulse report | W | Core |
| **Life OS Review PDF** | 14-day fingerprint export | W | Pro |
| **Patterns / correlations** | Cross-domain analytics | W | Pro |
| **Skills panel** | Skill tree in reports | W | Pro |
| **Interactive Intelligence** | 30/60/90-day web report | W | Elite |
| **Deep reports** | 3/month separate AI pool | W | Elite |
| **Journal AI** | Reflection assist | W | Core |
| **Arc sharpen** | AI uses profile North Star / tagline | W | Explore |

**AI daily caps (enforced server-side):**

| Tier | Calls/day |
|------|-----------|
| Explore | 1 |
| Core | 10 |
| Pro | 25 |
| Elite | 40 |

### 4.5 Career, sports, lab (40–70%)

| Feature | What it does | Surfaces | Min tier |
|---------|--------------|----------|----------|
| **Placements / Career** | Application kanban, timeline, resumes | W | Core |
| **Sports briefing** | Cricket, football, basketball, F1 feeds | W | Core |
| **Lab** | Typing, aptitude, STAR, flashcards, tech MCQs, vocal mastery | W | Core |
| **Gamification** | XP, ranks, quests, achievements, sounds | W | Explore |
| **Vault / Documents** | PDF, DOCX, XLSX, family docs, resumes | W, N | Explore |

### 4.6 Mobile capture (40%+)

| Feature | What it does | Surfaces |
|---------|--------------|----------|
| **Daily log form** | Sleep, mood, gym, water, steps | M, N |
| **Lite score page** | Simple score view | M |
| **Lite account** | Minimal profile on phone web | M |
| **Offline queue** | Capture without network | M, N |
| **Sync banner** | Pending changes indicator | N |

### 4.7 Marketing-only (website)

| Feature | Purpose |
|---------|---------|
| Referral (+5 queue spots) | Growth loop |
| Tester VIP vs Waitlist founding packages | Segment perks |
| 4-phase launch journey ladder | Set expectations |
| Stack comparison (~₹1600/mo tools replaced) | Positioning |
| Personas (student, professional, fitness, data-driven) | Targeting |
| Testimonials | Trust |

### 4.8 Per-feature screen flows (prototype depth)

#### Today
`Splash → Onboarding skip/complete → Today → tap Life Score card → detail sheet → back`  
`Today → toggle habit → streak updates → toast`  
`Today → Quick action → Finance → back stack`

#### Tasks
`Plan tab → filter chips (All/Today/Done) → toggle checkbox → strikethrough animation`  
`FAB → New task sheet → lands in list`

#### Settings (match reference image)
`Me → Settings → Profile card (AU avatar, name, email)`  
Sections: **ACCOUNT** (Profile, Security, Subscription) · **PREFERENCES** (Appearance, Notifications, Language, Focus Reminders) · **DATA & SYNC** (Backup, Sync toggle, Export) · **SUPPORT** (Help, Feedback, About v2.4.1)

#### Subscription (inside Settings or Account)
`4 tier cards → tap Upgrade → celebration overlay (hold → land → unlocks → receipt)`  
Show Active / Upgrade / Switch per current tier

#### AI Assistant
`Open thread → suggestion chips → type message → reply bubble → action confirmation`  
Status: **Ready** — never “Thinking fast” or sparkle avatar

---

## 5. Four billing tiers

**Order:** Explore &lt; Core &lt; Pro &lt; Elite

### 5.1 Pricing table

| Tier | List price | Waitlist / founding | Icon (Lucide-style) |
|------|------------|---------------------|---------------------|
| **Explore** | ₹0 forever | — | Compass |
| **Core** | ₹29/mo | **Complimentary at go-live** (waitlist) | Layers |
| **Pro** | ₹59/mo | **₹49/mo × 12 months** (~17% off) | Zap |
| **Elite** | ₹99/mo | **₹79/mo × 12 months** (~20% off) | Crown |

**Tester VIP** (invite by **31 Aug 2026**): Elite free 12 months (₹1,188 value) + first beta access.

### 5.2 Tier includes (exact marketing copy)

**Explore** — *Log daily. Learn the loop.*
- Log sleep, mood, gym, water, steps daily
- Weekly completion ring, basic streak
- Full Life OS view, 30-day history
- 1 AI call/day (Arc sharpen + Universal Logger)
- Reports nav visible · **locked paywall** (Pro badge)

**Core** — *Run your essentials.*
- Everything in Explore
- Habits, money manager, Pomodoro focus
- Weekly pattern insights
- Goals across 8 metrics
- Ivory Snapshot · 7-day pulse on Reports
- 10 AI calls/day

**Pro** — *See the patterns.* (**Recommended** badge)
- Everything in Core
- Correlation Intelligence on Snapshot (top 3)
- Life OS Review PDF (14-day fingerprint)
- 6 Standard PDFs/month (separate from daily AI)
- Wealth AI summary + import
- 25 AI calls/day
- **Family route unlock**

**Elite** — *Interactive intelligence · two AI pools.*
- Everything in Pro
- Interactive Intelligence Report (30/60/90-day web)
- 3 Deep Reports/month · dedicated pool
- Unlimited Standard PDFs
- 40 AI calls/day (untouched by Deep gen)

### 5.3 Route gating (must respect in prototypes)

```
Explore:  /overview /calendar /journal /notes /account /settings /identity /reports (deep locked)
Core+:    /habits /goals /finance /focus /lab /sports /discipline /placements
Pro+:     /family + Patterns/Skills/PDF reports
Elite+:   Intelligence web + Deep reports
```

### 5.4 How to display tiers in UI

**Do:**
- Show all **4** tiers (never 3)
- List price + founding strikethrough on Pro/Elite
- “Recommended” only on Pro
- Plan chip on profile: `Pro · till 10 Aug 2026`
- Upgrade celebration: 3-beat animation (not confetti spam)
- CTA states: Active | Upgrade | Switch

**Don’t:**
- Purple “premium” styling
- Hide free Explore
- Fake Stripe UI unless testing checkout
- Unlimited AI marketing (caps exist)

---

## 6. Onboarding

### 6.1 Production web flow (10 steps)

| Step | Screen | Validation |
|------|--------|------------|
| 0 | Full name | Required |
| 1 | OS-ID (8 chars) | Live availability API |
| 2 | PIN (6 digits) | Length |
| 3 | Confirm PIN | Must match |
| 4 | Pick goals | ≥1 selected |
| 5 | **Life Arc** (North Star sentence) | **Mandatory** — app redirects if missing |
| 6 | Starter habits | ≥1 |
| 7 | Wake time | Default 07:00 |
| 8 | Life mode / persona | Student, professional, founder, family, athlete, custom |
| 9 | Summary + commit | Sets `onboarding_complete`, applies nav preset |
| 10 | Success → `/overview` | Optional product tour |

**Waitlist path:** email signup → optional OS-ID on form → confirmation panel → login later → full onboarding.

### 6.2 HTML prototype minimum

1. **Splash** — `AIIMIN` wordmark, solid orange (no gradient text), 1.2s
2. **Slide 1** — Value: “One screen. Every day.” + what Life OS covers
3. **Slide 2** — Pick light/dark theme (applies `TL`/`TD` on `#pi`)
4. **Slide 3** — Notifications opt-in copy (optional skip)
5. **CTA** “Get started” → primary IA (varies per direction A–E)
6. **Skip** always visible top-right
7. Store `sessionStorage.aiimin_onb = 1` so refresh doesn’t repeat

### 6.3 Onboarding principles

- Time-to-value **under 90 seconds** in demo
- Deposit user on Today with **one action completed** (e.g. one habit checked)
- Life Arc = emotional ownership — don’t skip in production fidelity mocks
- Persona preset changes default nav — show confirmation: “Student mode applied”
- No stock photo people — use product chrome previews

---

## 7. Navigation

### 7.1 Banned (AI slop nav)

- Identical 5-tab bar on every prototype (Home/Search/+/Alerts/Profile)
- Center FAB as only primary action on every screen
- Purple active tab + glow
- “AI” tab with sparkle as main nav
- Hamburger with 15 equal-weight items
- Settings buried with no profile header card

### 7.2 AIIMIN production locks

- Logo mark → `/brand`; wordmark → `/overview` (split)
- Desktop: masthead + user-pinned nav (max 12 pins)
- Tablet: left TabRail
- Phone web: bottom nav only on `/m` (Today / Score / Account)
- Native: own nav — not a clone of web masthead

### 7.3 Non-obvious improvements (use in prototypes)

| Pattern | Why | Direction |
|---------|-----|-----------|
| Command palette ⌘K | Power users skip tabs | A |
| Hub chips above composer | Context follows intent | B |
| Board columns Now/Next/Pin | Priority over alphabetical | C |
| Vertical time spine | Unifies calendar + tasks | D |
| Graph nodes by domain | Shows life relationships | E |
| Grouped settings sections | Matches reference Settings image | All |
| Back stack (not tab reset) | Sub-screens feel native | All |
| Pinning over listing | User picks 5 modules; rest in More | Web fidelity |

### 7.4 IA layers

```text
Marketing (waitlist) → Auth → Onboarding → Today (hub)
                              ↓
         Peer domains: Habits, Money, Journal, Notes, Calendar…
                              ↓
         Account meta: Profile, Billing, Data, Legal
```

**Settings ≠ Home.** Reference settings: profile card top, then grouped lists with chevrons/toggles.

---

## 8. Motion & transitions

Use **CSS** in HTML prototypes (Framer Motion equivalent timing).

### 8.1 Token easings

```css
--ease: cubic-bezier(0.32, 0.72, 0, 1);
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--stagger: 0.08s;
```

### 8.2 Interaction map

| Interaction | Motion | Duration |
|-------------|--------|----------|
| Screen forward | slide +12px X, fade in | 220ms |
| Screen back | reverse slide | 200ms |
| Bottom sheet | translateY(100%→0) spring | 280ms |
| Theme toggle | background/border cross-fade | 350ms |
| Checkbox done | scale 0.92→1 + strikethrough | 150ms |
| Life Score ring | stroke-dashoffset draw | 700ms once |
| Toast | translateY(8px) + opacity | 250ms |
| Onboarding slide | horizontal snap | 300ms |
| List enter | stagger fadeUp 40–80ms/row | max 8 rows |
| Tier upgrade | hold → land → unlock list | ~1.2s |

**fadeUp keyframes (from production waitlist):**
```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); filter: blur(4px); }
  to   { opacity: 1; transform: translateY(0); filter: blur(0); }
}
```

### 8.3 Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; }
}
```

### 8.4 Do NOT animate

- Floating cards parallax
- Pulsing glow on every CTA
- Sparkle on AI send
- Confetti on habit check (unless tier upgrade only)

---

## 9. Eliminate AI slop

### 9.1 Visual bans

| ❌ Ban | ✅ Use |
|--------|--------|
| Purple/violet gradients | `#ff6b35` accent only |
| Cyan cyber dark mode | `#1a1a1a` charcoal |
| Gradient text on numbers | solid `--t1` |
| Glowing chart shadows | 1px hairline borders |
| Sparkle ✦ AI avatar | initials “AU” |
| Emoji habit icons | SVG or initials |
| Glass stacks everywhere | one nav blur max |
| Inter/Roboto as “AI product” font | Familjen Grotesk + Figtree |

### 9.2 Copy bans

- “Thinking fast…” / “Powered by magic” / “Supercharge your productivity”
- “Your AI copilot” as hero
- Lorem ipsum — use real scenarios: Sam call, DSA trees, AIIMIN roadmap, evening 5K

### 9.3 Structural bans

- Same bottom nav on all 5 prototype directions
- Every screen = card grid
- Light/dark = simple invert (need warm neutrals)

### 9.4 AIIMIN positive signals

- Orange surgical (CTA, active nav, progress)
- Green only for completion
- Recovery tone on discipline slips (not shame)
- Export / wipe data visible in account (data sovereignty)
- Human Momentum brand — not engagement theatre

---

## 10. Design system

### 10.1 Locked palette

| Token | Dark | Light |
|-------|------|-------|
| Background | `#1a1a1a` | `#f9f9f9` |
| Cards | `#2d2d2d` | `#ffffff` |
| Accent | `#ff6b35` | `#ff6b35` |
| Done | `#10b981` | `#10b981` |
| Muted | `#6b7280` | `#6b7280` |

### 10.2 Typography

| Role | Font |
|------|------|
| Display / headings | **Familjen Grotesk** 700–800 |
| Body | **Figtree** 400–700 |
| Metrics / OS-ID | **JetBrains Mono** 500 |

### 10.3 Theme classes (preserve from source HTML)

```html
<div class="pi TL" id="pi">  <!-- light -->
<div class="pi TD" id="pi">  <!-- dark -->
```

```js
function setTheme(t) {
  const pi = document.getElementById('pi');
  pi.classList.remove('TL','TD');
  pi.classList.add(t === 'dark' ? 'TD' : 'TL');
}
```

### 10.4 Semantic colors (domain only — not global brand)

- Calendar: work `#ff6b35`, health `#10b981`, finance `#E8B84B`, social `#5B8DEF`
- Goals pillars: academic gold, career green, health orange, personal gray

---

## 11. Five prototype directions

Each must be a **different HTML file** with different IA. Light+dark in each.

### A — Mission Control
- Dashboard-first, **dense** 2-column metrics
- **⌘K / Ctrl+K** command palette → jump any screen
- Bottom nav ≤4 items; keyboard hints visible
- Settings = dense grouped table
- User: founder, power user, data-driven builder

### B — AI Companion
- **Conversation is home** after onboarding
- Hub chips (Plan, Notes, Finance, More) replace tab bar
- Composer always docked bottom
- AI = assistant thread, not purple character
- Minimal chrome

### C — Card Workspace
- **Drag-and-drop** cards between Now / Next / Pin columns
- Layout switcher: Board | List | Focus
- Settings = pinned non-draggable card
- User: visual thinkers, ADHD-friendly priority surfaces

### D — Timeline OS
- **Vertical scroll-snap** day spine
- Sticky **“Now”** marker with pulse
- Tasks + calendar + habits on one timeline
- Nav: Flow | Week | Inbox
- User: schedule-driven professionals

### E — Spatial Brain
- **Pan/zoom canvas** with domain nodes (Work, Family, Money, Health, You)
- Tap node → detail sheet
- Minimap + zoom +/-
- User: systems thinkers, knowledge graph lovers

---

## 12. UX research

| Product | Lesson for AIIMIN |
|---------|-------------------|
| **Things 3** | Today / Upcoming / Anytime &gt; folders |
| **Notion** | Blank canvas overwhelms — AIIMIN ships guided domains |
| **Linear** | ⌘K command menu — validates Direction A |
| **Day One** | Journal modes + calm type — Journal domain |
| **Bear** | Fast capture — Universal Logger |
| **YNAB** | Budget clarity without shame-red everywhere |
| **Apple Health** | Rings legible — Life Score OK if not gradient |
| **Headspace** (anti-pattern) | No clinical wellness theatre |
| **Todoist** | NL task entry — logger pattern |
| **Superhuman** | Speed via discipline, not fake metrics |

**Meta:** Users churn when setup &gt; value. Onboarding must end with **one log done**.

---

## 13. Codex checklist

### Product
- [ ] Four tiers with correct ₹ prices and founding rates?
- [ ] OS-ID on profile + onboarding?
- [ ] Phone prototype labeled native exploration if not `/m` capture-only?
- [ ] Navbar: logo → brand story, wordmark → today (split)?

### UX
- [ ] Splash → onboarding → action → settings → theme toggle works?
- [ ] Back stack consistent?
- [ ] Touch targets ≥44px?
- [ ] `prefers-reduced-motion` respected?

### Visual
- [ ] Zero purple/neon/gradient-text?
- [ ] Orange ≤~15% of screen pixels?
- [ ] Settings matches Account/Preferences/Data/Support groups?

### Demo
- [ ] Every button/link does something (screen or toast)?
- [ ] Self-contained single HTML per direction?
- [ ] Source folder `Prototyps-APP` unmodified?

---

## 14. Source assets

### Preserve these IDs from source HTML

**Functions:** `setTheme`, `goto`, `goBack`, `toggleCk`, `openSheet`, `closeSheet`, `toggleHabit`

**Screen IDs:** `sc-home`, `sc-tasks`, `sc-notes`, `sc-journal`, `sc-finance`, `sc-family`, `sc-me`, `sc-settings`, `sc-goals`, `sc-vault`, `sc-search`, `sc-notifs`, `sc-calendar`, `sc-ai`

**Nav IDs:** `ni-home`, `ni-notes`, `ni-tasks`, `ni-me`

**CSS variables:** `--brand`, `--FD`, `--FB`, `--FM`, `--bg`, `--sf`, `--el`, `--br`, `--t1`, `--t2`, `--t3`, `--soft`

**Theme classes:** `TL`, `TD` on `#pi`

---

## 15. Optional code pointers

Only if Codex must verify a contract:

| Topic | Path |
|-------|------|
| Tier gating | `frontend/src/utils/tierGating.js` |
| Nav routes | `frontend/src/constants/navItems.js` |
| Waitlist pricing copy | `frontend/src/components/waitlist/landing/waitlistLandingData.js` |
| Onboarding steps | `frontend/src/pages/Onboarding.jsx` |
| Subscription UI | `frontend/src/pages/account/sections/SubscriptionSection.jsx` |
| Mobile sync API | `server/routes/mobile.js` |
| Product guide | `docs/knowledge/01_PRODUCT/AIIMIN-Product-Guide.md` |
| Palette lock | `docs/knowledge/08_DESIGN/Palette.md` |

---

## 16. Paste-ready Codex prompt

```text
Read the full file CODEX_FULL_CONTEXT.md first. Do not scan the codebase.

Task: Build 4–5 self-contained HTML prototypes for AIIMIN Personal OS.

Read-only inputs:
- /Users/aaditya/Downloads/Prototyps-APP/aiimin-prototype copy.html
- /Users/aaditya/Downloads/Prototyps-APP/index-opus.html
- User design images: Today (4 concepts), multi-page board, Settings

Output to:
/Users/aaditya/Desktop/DASHBOARD PROJECT/frontend/prototypes/personal-os/

Directions (one HTML file each — different IA, not recolors):
A Mission Control — dashboard + ⌘K
B AI Companion — chat-first + hub chips
C Card Workspace — drag cards + layout modes
D Timeline OS — vertical day spine + now marker
E Spatial Brain — pan/zoom graph nodes

Each file must have:
- Light + dark theme toggle (TL/TD on #pi + viewer pill)
- Onboarding (splash → 3 slides → app)
- All features from §4 where relevant to that direction
- Settings layout per reference (profile card + Account/Preferences/Data/Support)
- All 4 billing tiers §5 with correct ₹ prices
- OS-ID + profile (Aaditya Upadhyay, aaditya@aiimin.in)
- Motion per §8
- Zero AI slop per §9
- Locked palette §10
- Preserve function/ID names §14
- Do NOT modify Prototyps-APP folder

Success: distinct structures, all controls clickable, themes work, tiers correct.
```

---

*End of context pack.*
