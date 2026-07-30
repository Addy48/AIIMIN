# 03 — Information Architecture

## Purpose
Evaluate how AIIMIN groups, names, and discloses life information — and whether the structure matches human mental models or database tables.

## Confidence
★★★★★ — Route tree, NAV_REGISTRY, Device-Tiers, native IA, and Product Guide layer model all cross-checked 2026-07-22.

## Evidence Sources
`App.js`; `navItems.js`; `navigation.md` (partially stale); Device-Tiers; Product Guide §4; native `03_INFORMATION_ARCHITECTURE.md`; `AiiminRoot.kt`.

## Files Used
`frontend/src/App.js`, `constants/navItems.js`, `AccountPage.jsx`, `Settings.jsx`, native shell.

## Reasoning
Users navigate labels, not schemas. IA audit follows labels and grouping as experienced.

## Dependencies
[[00_EXECUTIVE_SUMMARY]] · [[05_NAVIGATION_AUDIT]]

## Consumers
Nav redesign, native IA, Today composition.

## Known Unknowns
User card-sort research (none on disk); whether life-mode presets measurably reduce nav confusion.

---

## Organizing principle: data vs people?

**Verdict: primarily around data domains, secondarily around people/intents.**

Evidence:
- Primary nav labels: Today, Habits, Goals, Journal, Notes, Finance, Family, Calendar, Career, Sports, Discipline, Focus, Lab, Reports — **noun domains**.
- Capture intents (vent, spent money, urge) are routed by user knowing which domain owns the feeling.
- Product Bible wants intent-first; Universal Logger / ⌘K are the only strong intent routers — and they are easy to miss (Space→L chord).

**People-shaped pockets:** Family Vault, Identity/Life Arc, Account profile — still nested inside domain OS.

---

## Conceptual model (Product Guide)

```
TODAY (command surface)
LIFE DOMAINS (capture & structure)
INTELLIGENCE (tier-gated)
ACCOUNT & TRUST
```

This model is sound. Shipped Today often behaves like a **widget gallery** more than a single command surface (Craft J0 aimed to fix: logger-only). Right rail Command Center + Trajectory compete with left-column insight/logger/timeline.

---

## Web IA map (authenticated desktop/tablet)

### Primary registry (NAV_REGISTRY)

| Label | Route | Mental job |
|-------|-------|------------|
| Today | `/overview` | Command / daily hub |
| Habits | `/habits` | Routine execution |
| Goals | `/goals` | Direction + milestones |
| Journal | `/journal` | Reflection archive |
| Notes | `/notes` | Reference sources |
| Finance | `/finance` | Money |
| Family | `/family` | Household vault |
| Calendar | `/calendar` | Time |
| Career | `/placements` | Applications (label ≠ URL) |
| Sports | `/sports` | Cricket context |
| Discipline | `/discipline` | Urge / recovery |
| Focus | `/focus` | Deep work timer |
| Lab | `/lab` | Skill modules (14) |
| Reports | `/reports` | Patterns / review |

### Outside primary nav (discoverability risk)

| Route | How found |
|-------|-----------|
| `/identity` | Indirect / arc |
| `/settings` | Palette + legacy |
| `/account` | Avatar |
| `/insights` | Redirects → Reports |
| Legal / Brand | Footer / lockup |

**Naming inconsistency:** Career label vs `/placements` path; Insights vs Reports; Settings vs Account (8 sections) — two preference homes.

---

## Phone web IA (`/m`)

| Tab | Job |
|-----|-----|
| Today | Daily capture |
| Score | Life Score glance |
| Account | Lite account |

Dramatically smaller. Correct per Device-Tiers stopgap. Mental model ≠ desktop.

---

## Native Android IA (shipped)

| Tab | Job | Spec completeness |
|-----|-----|-------------------|
| Home | Ritual glance, habit ticks, next-up | Partial (no habit create) |
| Journal | Write + history read-only detail | Partial |
| Notes | Keep-style compose; cards not editable | Partial vs Keep promise |
| Vault | Read family docs | Read-only |
| More | Focus, Discipline, Goals lite, Settings, web escapes | Thin companion |

**Documented D2c (Practice/Revise/You)** not shipped. Spec IA and shipped IA diverge.

---

## HTML prototype IA (aspirational)

Screens in `index-opus.html`: Today, Dashboard, Tasks, Projects, Calendar, Notes, Documents, Family, AI, Knowledge, Search.

**Continuity break:** Tasks/Projects/Knowledge/AI as first-class — production uses Habits/Goals/Lab/Reports instead. Prototype teaches a different OS.

---

## Hierarchy & progressive disclosure

| Area | Disclosure quality | Evidence |
|------|--------------------|----------|
| Habit daily use | Excellent | One tap |
| Journal free write | Good if mode skipped | Mode chips still present |
| Universal Logger | Good promise | Mid-page, not always dominant |
| Onboarding | Poor | 10 steps before baseline |
| Family emergency | Poor | 20+ fields fronted |
| Lab | Poor | 14-module choice wall |
| Tier gates | Abrupt | Same upgrade modal pattern ×8 routes |

---

## Terminology audit (IA-critical)

| Term | Risk |
|------|------|
| Day Control / Operational Intelligence / Mission Control | Military-ops metaphor; conflicts with Human Momentum calm |
| OS-ID | Unique brand identity; learning cost |
| Life Arc | Powerful; blank-page syndrome |
| Life Score | Core; can feel judgmental |
| Career vs Placements | Label mismatch |
| Notes = sources (tour) vs Keep notes (native) | Cross-platform semantic drift |
| Lab | Playground vs core — unclear membership |

---

## Relationships users must invent

Without AI linking UX fully visible, users mentally connect:
- Habit ↔ Goal ↔ Focus session
- Journal mood ↔ Daily Log mood ↔ Discipline
- Finance ↔ Reports wealth pillar
- Calendar ↔ Today commitments

Doctrine promises connected graph (`anchor_edges`). Experience still often feels **siloed pages**.

---

## IA verdict

AIIMIN organizes information **around life-data domains**, with a Today hub and two intent valves (Logger, ⌘K). It aspires to organize around **human intents and momentum**, but navigation and onboarding still teach domain filing.

**Five-year risk:** Domain filing scales feature count; intent routing scales calm. Current IA favors feature count.

---

## Cross-link
[[05_NAVIGATION_AUDIT]] · [[04_USER_JOURNEYS]] · [[12_PLATFORM_CONTINUITY]] · [[07_COGNITIVE_LOAD]]
