# 01 — Prototype Studio Governance Report

```yaml
document: Prototype Studio Governance Report
phase: P7
standard: AIIMIN GENESIS/P7 Governance/00_GOVERNANCE_STANDARD.md
standard_version: 1.0
source: AIIMIN GENESIS/P6 Prototype Studio/
source_primary:
  - 00_EXECUTIVE_SUMMARY.md
  - 01_CONCEPTS_AND_CRITIQUE.md
  - 02_DESIGN_DECISIONS.md
  - 03_SYSTEM_DESIGN.md
  - 04_PAGE_DESIGNS.md
  - 07_INTERACTION_DOCUMENTATION.md
  - 09_ANDROID_MAPPING.md
  - 10_WEB_TABLET_MAPPING.md
  - MANIFEST.md
governance_date: 2026-07-22
gov_ids_new: GOV-162…GOV-170
gov_ids_referenced: GOV-001…GOV-161 (prior; not re-minted)
scope: Reusable product decisions only — behaviors, navigation, interaction patterns, layouts, hierarchy. No visual-quality judgment. Ignore unfinished styling.
```

> Machine-readable twin: `02_GOVERNANCE_DECISIONS.json` · Index: `03_GOVERNANCE_INDEX.md` · Founder: `04_FOUNDER_REVIEW.md` · Standard: `../00_GOVERNANCE_STANDARD.md`

**ID note:** Appended after Component (GOV-142…152) and Platform (GOV-153…161).

**Scope law:** Do **not** judge visual quality. Govern only reusable product decisions. Source **not modified**. Prior P7 trios + Governance Standard **not modified**.

---

## 1. Artifact Overview

| Field | Value |
|-------|-------|
| Source | P6 Prototype Studio (canonical-prototype v4.0) |
| Concept | Living Momentum OS |
| New canonical GOV | GOV-162…GOV-170 (9) |
| Existing GOV referenced | 36 unique (no re-mint) |
| Recommendations | REC-077…REC-084 (8) — not canon |
| Conflicts flagged | CF-PS-001…CF-PS-006 |
| Needs Discussion | GOV-163, GOV-167 |
| Governance score | **78 / 100** |

**Separation law:** Canonical Decisions ≠ Governance Recommendations.

### Existing GOV references (duplicates — do not re-mint)

| Studio item | Existing GOV | Note |
|-------------|--------------|------|
| Personal Life OS / Human Momentum | GOV-001, GOV-003 | Living Momentum sits inside category + brand frame |
| Capture once / capture-first / Enter-save | GOV-002, GOV-028, GOV-059, GOV-066 | FAB sheet elevated in GOV-170 |
| Refuse social / clinical / form-builder / casino score | GOV-005, GOV-006, GOV-008, GOV-009 | Studio anti-decisions reuse |
| Split brand lockup (web mapping) | GOV-012, GOV-039 | Preserved — not re-minted |
| /m ceiling; native ≠ /m | GOV-013, GOV-041, GOV-085 | Studio Android ≠ /m |
| Calm Today / anti-widget / empty teach | GOV-029, GOV-076, GOV-067 | Contextual Day + no marketplace |
| No shame / Life Score vs XP | GOV-031, GOV-068 | Profile honest progress; XP roles still ND |
| Destructive confirm / optimistic | GOV-015, GOV-065, GOV-125 | Habit toggles + confirm sheet |
| Shared primitives / graph / Timeline | GOV-040, GOV-094, GOV-102 | Timeline primary placement via shell |
| Nav primacy / free-pin / intents / palette / settings | GOV-075, GOV-095, GOV-097, GOV-099, GOV-100 | Tension with Studio fixed shell |
| Knowledge ≠ Journal ≠ Documents | GOV-101 | CF-PS-002 vs GOV-167 |
| Compression / chips / forms-last / primary action | GOV-034, GOV-122, GOV-126, GOV-127, GOV-130, GOV-135 | Capture sheet teaches ~5 |
| AI never home / mixed-initiative | GOV-136 | Studio killed AI-Native Home |
| Palette identity lock | GOV-036 | Product lock only — craft out of scope |
| Family not auto-post | GOV-078 | Trust vault framing |

### Extract coverage map

| Topic | Treatment |
|-------|-----------|
| Product concept | GOV-162 |
| Phone primary nav | GOV-163 (ND) |
| Surface jobs / hierarchy | GOV-164, GOV-169 |
| Anti-primary IA | GOV-165 |
| First-run flow | GOV-166 |
| Knowledge unify | GOV-167 (ND) |
| More / pillars | GOV-168 |
| Capture FAB path | GOV-170 |
| Visual craft / tokens / polish | **Excluded** (scope) |
| Motion ms tokens | Reuse Motion GOVs — not re-judged |
| Auth biometric detail | Missing M-PS-001 |

---

## 2. CANONICAL DECISIONS

### GOV-162 — Living Momentum OS v1 product concept lock

| Field | Value |
|-------|-------|
| Category | Product — Concept |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Extreme |
| Canon Class | canonical |

**Decision:** AIIMIN v1 product concept is Living Momentum OS: Intent Capture + Calm Contextual Today + Memory/Timeline compound, with Family/Finance/Documents as trusted pillars and AI as mixed-initiative coach — never the home shell.

**Reason:** Studio merge of three surviving concepts; one-year memory test; rejects Notion/Linear/widget/chat-home shapes.

**Evidence:**

- **Sections:** Step 4 — Merge → AIIMIN v1: Living Momentum OS — Definition  
  **Quote:** "Living Momentum OS = Intent Capture + Calm Contextual Today + Memory/Timeline compound, with Family/Finance/Documents as trusted pillars and AI as mixed-initiative coach — never the home shell."
- **Sections:** 00 — Executive Summary — Verdict  
  **Quote:** "AIIMIN v1 (this studio) is Living Momentum OS"

**Depends On:** GOV-001, GOV-002, GOV-028, GOV-136  
**Blocks:** Android Navigation, Master Product Specification, Native Shell Migration, Page Blueprints  
**Referenced By:** P8, P9, Android Build, Desktop, Website, Design System  
**Implementation Impact:** Feature intake must justify fit inside Living Momentum OS. Chat-as-home, Tasks/Projects primary, and widget-dashboard homes are out of canon.

---

### GOV-163 — Phone primary shell — Today | Knowledge | Capture FAB | Timeline | More

| Field | Value |
|-------|-------|
| Category | UX — Navigation |
| Status | Needs Discussion |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Extreme |
| Canon Class | canonical |

**Decision:** Android-first phone primary shell is a bottom bar with four destinations plus center Capture FAB: Today, Knowledge, Timeline, More. Drawer may exist as optional power jump list; it must not create a second competing primary nav system.

**Reason:** Studio IA lock and Android mapping migration target. Closes nav-primacy ambiguity for phone companion.

**Evidence:**

- **Sections:** Information architecture lock — table — "Today | Knowledge | Capture FAB | Timeline | More"
- **Sections:** 03 — System Design — Navigation — "Android bottom bar: 4 destinations + center FAB."
- **Sections:** 09 — Android Mapping — Bottom nav proposal — "Studio: Today / Knowledge / FAB / Timeline / More."

**Depends On:** GOV-162, GOV-075, GOV-097, GOV-095  
**Blocks:** Android Navigation, Native Compose Bottom Bar, IA Destination Map, Tablet Rail  
**Referenced By:** P8, Android Build, Desktop, WORKFLOW-PLAN  
**Implementation Impact:** Replace native Home/Journal/Notes/Vault/More with Studio shell (or equivalent). Founder must ratify against GOV-097 free-pin masthead (REC-077).

---

### GOV-164 — Surface one-job law — every surface declares exactly one job

| Field | Value |
|-------|-------|
| Category | UX — Hierarchy / Layout |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | High |
| Canon Class | canonical |

**Decision:** Every primary and secondary surface declares exactly one job. Canonical Studio jobs: Today=Act on this day; Knowledge=Capture and revise personal memory; Documents=Store and retrieve files/vault docs; Family=Shared care + private vault trust; Finance=Log and see money truth; Timeline=Remember what happened; AI=Ask/review/act with confidence chips; Search=Recall across the graph; Settings=Control system safely; Profile=Identity + honest progress; Onboarding=Three beats to first capture; Auth=Trust entry.

**Reason:** Prevents everything-pages and competing personalities per screen.

**Evidence:**

- **Sections:** Surface jobs (one job each) — table — "Today | Act on this day"
- **Sections:** Surface jobs (one job each) — table — "Settings | Control system safely"

**Depends On:** GOV-162, GOV-098, GOV-100, GOV-122  
**Blocks:** Page Blueprints, Feature Intake, Screen Design Reviews  
**Referenced By:** P8, P9, Android Build, Desktop, Design System  
**Implementation Impact:** Page Blueprint / PR reviews reject multi-job dumps. New surfaces must publish one-job sentence before ship.

---

### GOV-165 — Refuse Tasks tab, Projects board, and widget dashboard as primary IA

| Field | Value |
|-------|-------|
| Category | Product — IA Refuse |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** AIIMIN must not ship Tasks as a primary tab, Projects board as primary navigation, or a Living Dashboard of random widgets as the home. Goals may exist as labeled entities (Search/Goals) without a Projects-board primary world.

**Reason:** Studio kill list + CPO critique — productivity-category death path.

**Evidence:**

- **Sections:** Explicit anti-decisions — "No Tasks tab as primary" / "No Projects board as primary" / "No Dashboard of random widgets"
- **Sections:** 09 — Android Mapping — Do not — "Ship Tasks/Projects primary tabs on Android — violates Living Momentum."

**Depends On:** GOV-007, GOV-074, GOV-076, GOV-162  
**Blocks:** Android Navigation, Feature Intake, Website Marketing Claims  
**Referenced By:** P8, Android Build, Desktop, Kill List  
**Implementation Impact:** Deny primary-nav proposals for Tasks/Projects/widget home. Goals naming → Naming Language (REC-084).

---

### GOV-166 — First-run flow — Splash → Onboarding ≤3 beats → Auth → App Shell

| Field | Value |
|-------|-------|
| Category | UX — Onboarding / Navigation |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** Canonical first-run sequence is Splash → Onboarding (exactly three beats: Capture once, One graph, Honest mirror) → Auth → App Shell. Skip may exist on the last beat into Auth. Onboarding must not become infinite customization.

**Reason:** Principal UX critique: ≤3 beats to first capture; NN bans infinite customization onboarding.

**Evidence:**

- **Sections:** Prototype promise — "Splash → Onboarding (3 beats) → Auth → App"
- **Sections:** 04 — Page Designs — Onboarding (3 beats)
- **Sections:** Step 3 — Critique — Role critiques — "Onboarding must be ≤3 beats to first capture."

**Depends On:** GOV-002, GOV-009, GOV-079, GOV-162  
**Blocks:** Auth UX, Android WelcomeGate, Website Onboarding  
**Referenced By:** P8, Android Build, Website  
**Implementation Impact:** Cut Welcome/onboarding to three doctrinal beats. No preference buffet before first capture path.

---

### GOV-167 — Knowledge surface unifies Journal | Notes as one memory layer

| Field | Value |
|-------|-------|
| Category | UX — Information Architecture |
| Status | Needs Discussion |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | High |
| Canon Class | canonical |

**Decision:** Phone primary Knowledge destination presents Journal and Notes as tabs of one memory capture/revise layer. Separate routes under the hood remain allowed; primary IA must not present Journal and Notes as competing peer bottom-nav destinations.

**Reason:** Studio IA lock + Android migration (Journal+Notes → Knowledge). Tensions with GOV-101 entity separation.

**Evidence:**

- **Sections:** Information architecture lock — "Knowledge | Memory capture — journal + notes as one layer (tabs, not apps)"
- **Sections:** 04 — Page Designs — Knowledge — "Tabs: Journal | Notes."
- **Sections:** 09 — Android Mapping — "Unify under Knowledge tabs in IA; keep separate routes OK"

**Depends On:** GOV-101, GOV-163, GOV-164, GOV-096  
**Blocks:** Android Navigation, Knowledge Routes, Entity IA Contracts  
**Referenced By:** P8, Android Build, Desktop, IA Spec  
**Implementation Impact:** Collapse Journal/Notes bottom peers into Knowledge. Founder reconcile with GOV-101 (REC-078).

---

### GOV-168 — More is honest overflow — pillars and meta under More on phone

| Field | Value |
|-------|-------|
| Category | UX — Navigation |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | High |
| Canon Class | canonical |

**Decision:** On phone, More is the honest overflow destination containing Family, Finance, Documents, AI, Search, Settings, and Profile. Family/Finance/Documents are trusted pillars of Living Momentum OS but are not phone bottom-bar peers. Settings remains penalty-box; no daily capture actions live only in Settings.

**Reason:** Studio More bag + GOV-100 Settings law + Living Momentum pillars.

**Evidence:**

- **Sections:** Information architecture lock — "More | Family, Finance, Documents, AI, Search, Settings, Profile"
- **Sections:** 03 — System Design — Navigation — "More → Family | Finance | Documents | AI | Search | Settings | Profile"

**Depends On:** GOV-163, GOV-100, GOV-162, GOV-097  
**Blocks:** Android More Menu, IA Destination Map, Tablet Density ADR  
**Referenced By:** P8, Android Build, Desktop  
**Implementation Impact:** Phone More lists seven overflow surfaces. Tablet Finance elevation = separate ADR (REC-080).

---

### GOV-169 — Six page hierarchy layers — System / Day / Memory / Pillars / Intelligence / Account

| Field | Value |
|-------|-------|
| Category | UX — Hierarchy |
| Status | Approved |
| Priority | P1 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** Product page hierarchy is ordered in six layers: (1) System — Splash, Onboarding, Auth; (2) Day — Today; (3) Memory — Knowledge, Timeline, Search; (4) Pillars — Family, Finance, Documents; (5) Intelligence — AI; (6) Account — Profile, Settings. New screens must declare which layer they belong to.

**Reason:** Studio system design hierarchy — prevents orphan screens and wrong-layer chrome.

**Evidence:**

- **Sections:** 03 — System Design — Page hierarchy — layers 1–3 quoted in twin JSON

**Depends On:** GOV-096, GOV-103, GOV-162, GOV-164  
**Blocks:** Page Blueprints, Entity IA Contracts, Screen Inventory  
**Referenced By:** P8, P9, Design System, Android Build  
**Implementation Impact:** Screen inventory and blueprints must tag layer 1–6.

---

### GOV-170 — Global Capture FAB sheet is primary capture path

| Field | Value |
|-------|-------|
| Category | UX — Interaction / Capture |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Extreme |
| Canon Class | canonical |

**Decision:** A global Capture FAB opens a capture sheet that is the primary daily capture path. One utterance routes to habit / journal / finance / note / event with inference confirmation chips. Median daily interaction compression targets the capture sheet as the taught primary path — not deep-link tourism through every pillar.

**Reason:** Studio interaction law + compression doctrine + Intent Capture OS survivor.

**Evidence:**

- **Sections:** Interaction decisions — "Capture | FAB → sheet → chips confirm inference"
- **Sections:** 07 — Interaction Documentation — Compression target — "Median daily interactions toward 5 — prototype teaches capture sheet as primary path."
- **Sections:** Information architecture lock — Capture FAB routes to habit / journal / finance / note / event

**Depends On:** GOV-028, GOV-066, GOV-126, GOV-127, GOV-130, GOV-163  
**Blocks:** Android Capture FAB, Capture UX, Outbox Routing, Chip UX Spec  
**Referenced By:** P8, Android Build, Desktop, AI, Backend  
**Implementation Impact:** Native must ship global FAB + sheet routing. Aligns with open GOV-127 (CF-PS-005).

---

## 3. GOVERNANCE RECOMMENDATIONS (NOT CANON)

### REC-077 — Ratify GOV-163 phone shell as nav primacy — close GOV-075 / GOV-097 / REC-022 gap

- **Reason:** Studio locks fixed bottom destinations; IA left free-pin ND.
- **Impact:** Unblocks Android bottom-bar migration and REC-028 destination map.
- **Risk:** High — wrong call forks phone vs desktop nav forever.
- **Priority:** P0 · **Status:** Pending Founder
- **Related GOV:** GOV-163, GOV-075, GOV-097, GOV-095

### REC-078 — Resolve GOV-167 Knowledge tabs vs GOV-101 entity separation

- **Reason:** Surface unify can coexist with entity distinct — or founder rejects unify.
- **Impact:** Clears Journal/Notes Compose route strategy.
- **Risk:** Medium — entity bleed if tabs erase contracts.
- **Priority:** P0 · **Status:** Pending Founder
- **Related GOV:** GOV-167, GOV-101

### REC-079 — Ratify Approved Prototype Studio GOVs (142, 144–146, 148–150) as citeable shell canon

- **Reason:** Approved items ready as law after founder ACK; ND items stay open.
- **Impact:** PRs cite GOV-IDs for shell/IA work.
- **Risk:** Low.
- **Priority:** P0 · **Status:** Pending Founder
- **Related GOV:** GOV-162, GOV-164, GOV-165, GOV-166, GOV-168, GOV-169, GOV-170

### REC-080 — Founder ADR — tablet/desktop Finance elevation vs phone Finance-in-More

- **Reason:** Tablet mapping elevates Finance; phone keeps Finance in More; Android mapping also wants Finance first-class.
- **Impact:** Density-by-device without forking primitives.
- **Risk:** High — silent elevation creates duplicate primacy (GOV-075).
- **Priority:** P0 · **Status:** Pending Founder
- **Related GOV:** GOV-168, GOV-163, GOV-075, GOV-109

### REC-081 — Map Studio shell → native WORKFLOW-PLAN / Compose bottom-nav migration

- **Reason:** 09_ANDROID_MAPPING already proposes Journal+Notes→Knowledge, add Timeline, Vault under More.
- **Impact:** Executable native epic from governed IA.
- **Risk:** Medium — migration churn without epic owner.
- **Priority:** P0 · **Status:** Pending Founder
- **Related GOV:** GOV-163, GOV-167, GOV-168, GOV-170

### REC-082 — Publish Search page + Command Palette coexistence note under GOV-099

- **Reason:** Studio puts Search in More; web mapping keeps ⌘K power path + Search browse page.
- **Impact:** Closes CF-PS-004 without killing palette.
- **Risk:** Low.
- **Priority:** P1 · **Status:** Pending Founder
- **Related GOV:** GOV-099, GOV-168, GOV-164

### REC-083 — Next P7 after founder OK — Page Blueprints or Automation Rules or Accessibility

- **Reason:** Studio shell now governed; blueprints inherit one-job + hierarchy; Automation still open from AI pass.
- **Impact:** Continues build-without-reread.
- **Risk:** Low.
- **Priority:** P0 · **Status:** Pending Founder
- **Related GOV:** GOV-164, GOV-169, GOV-137

### REC-084 — Govern Goals (not Projects board) naming in Naming Language pass

- **Reason:** Studio Search labels Goals not Projects board — naming law belongs in 13_NAMING_LANGUAGE.
- **Impact:** Prevents Projects-board language creep.
- **Risk:** Low.
- **Priority:** P1 · **Status:** Pending Founder
- **Related GOV:** GOV-165, GOV-131

---

## 4. Conflicts

| ID | Type | Detail | Action |
|----|------|--------|--------|
| CF-PS-001 | Nav primacy tension | GOV-163 fixed phone bottom destinations vs GOV-097 free-pin masthead + GOV-075 | REC-077 |
| CF-PS-002 | Knowledge surface vs entity law | GOV-167 Knowledge tabs vs GOV-101 entity separation | REC-078 |
| CF-PS-003 | Finance density by device | Phone Finance-in-More vs tablet Finance primary vs Android elevate Finance | REC-080 |
| CF-PS-004 | Search placement vs Palette | Search under More vs GOV-099 first-class palette — complementary if both kept | REC-082 |
| CF-PS-005 | Capture beats nav concrete answer | GOV-170 supplies shell answer for open GOV-127 — align, not contradict | REC-051 / GOV-127 |
| CF-PS-006 | Queue order — AI next vs Studio now | REC-061 named Automation/a11y/Naming; founder requested Studio — queue via REC-083 | REC-083 |

---

## 5. Missing Decisions

| ID | Missing | Why | Next |
|----|---------|-----|------|
| M-PS-001 | Auth biometric timing / ranking beyond Google primary | Studio says biometric later | Auth UX ADR — do not invent |
| M-PS-002 | Typed-confirm detail for account delete | Mapped, not fully prototyped | Keep GOV-065; component spec |
| M-PS-003 | Desktop free-pin defaults if GOV-097 survives beside phone shell | Studio phone-first | REC-077 + REC-027 |
| M-PS-004 | Notification grouping surface contract | Supporting page only | REC-017 |
| M-PS-005 | Visual token craft / polish bar | Out of scope this pass | Design System Spec / craft review |

---

## 6. Questions for Founder

1. Approve Living Momentum OS concept lock (GOV-162)?
2. Ratify phone shell Today | Knowledge | FAB | Timeline | More (GOV-163) and close GOV-097 free-pin for phone (REC-077)?
3. Approve surface one-job matrix (GOV-164)?
4. Approve anti-primary Tasks/Projects/widget refuse (GOV-165)?
5. Approve first-run ≤3 beats (GOV-166)?
6. Knowledge tabs unify vs GOV-101 — Approve surface-unify+entity-distinct / Amend / Reject (GOV-167, REC-078)?
7. Approve More overflow bag (GOV-168)?
8. Approve six hierarchy layers (GOV-169)?
9. Approve global Capture FAB sheet primary path (GOV-170)?
10. Tablet Finance elevation ADR now (REC-080)?
11. Next artifact (REC-083): Page Blueprints / Automation / Accessibility / Other: ___

---

## 7. Dependency Graph Summary

### Highest fan-in (from new GOV-162…150)

| GOV ID | Appears in depends_on (new) |
|--------|------------------------------|
| GOV-162 | 6 |
| GOV-163 | 4 |
| GOV-164 | 2 |
| GOV-028 | 2 |
| GOV-097 | 2 |
| GOV-075 | 1 |
| GOV-101 | 1 |
| GOV-100 | 1 |
| GOV-126 | 1 |
| GOV-127 | 1 |
| GOV-136 | 1 |

### High / Extreme cost (new)

| ID | Title | Cost |
|----|-------|------|
| GOV-162 | Living Momentum OS v1 product concept lock | Extreme |
| GOV-163 | Phone primary shell — Today \| Knowledge \| Capture FAB \| Timeline \| More | Extreme |
| GOV-170 | Global Capture FAB sheet is primary capture path | Extreme |
| GOV-164 | Surface one-job law | High |
| GOV-167 | Knowledge surface unifies Journal \| Notes | High |
| GOV-168 | More is honest overflow | High |

### Needs Discussion

| GOV-163 | Phone primary shell |
| GOV-167 | Knowledge Journal \| Notes unify |

---

## 8. Final Governance Score

| Dimension | Score (/10) |
|-----------|-------------|
| Identity Clarity | 9 |
| Enforceability | 8 |
| Cross Platform Readiness | 7 |
| Ai Readiness | 7 |
| Conflict Hygiene | 6 |
| Metric Rigor | 7 |
| Amendment Process | 8 |
| Completeness Build Without Reread | 8 |
| Traceability Evidence | 9 |
| Machine Readability | 9 |

### Final Governance Score: **78 / 100**

Studio locks Living Momentum shell IA with strong evidence. Nav primacy and Knowledge-vs-entity conflicts keep Conflict Hygiene at 6. Visual craft intentionally excluded. Finance density and free-pin remain founder ADR.

---

## Evidence (process)

- Source read: P6 Prototype Studio product/IA/interaction/mapping docs (not styling judgment)
- Cross-ref: full MASTER_DECISION_REGISTRY GOV-001…141
- Untouched: prior artifact trios + `00_GOVERNANCE_STANDARD.md` + P6 source
- New GOV: GOV-162…GOV-170
- Validation: continuous IDs, schema, dup GOV, dep resolve, evidence ≥1 — closeout
