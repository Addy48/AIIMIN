# 01 — IA Principles Governance Report

```yaml
document: IA Principles Governance Report
phase: P7
standard: AIIMIN GENESIS/P7 Governance/00_GOVERNANCE_STANDARD.md
standard_version: 1.0
source: AIIMIN GENESIS/P5 Constitution/06_INFORMATION_ARCHITECTURE_PRINCIPLES.md
source_version: 3.0
source_status: FROZEN
governance_date: 2026-07-22
gov_ids_new: GOV-094…GOV-103
gov_ids_referenced: GOV-001…GOV-093 (prior; not re-minted)
```

> Machine-readable twin: `02_GOVERNANCE_DECISIONS.json` · Index: `03_GOVERNANCE_INDEX.md` · Standard: `../00_GOVERNANCE_STANDARD.md`

Source IA Principles **not modified**. Constitution, Non-Negotiables, and Governance Standard **not modified**. New GOV IDs only for genuinely new canon; duplicates reference existing GOV IDs.

---

## 1. Artifact Overview

| Field | Value |
|-------|-------|
| Source | `06_INFORMATION_ARCHITECTURE_PRINCIPLES.md` v3.0 FROZEN |
| Structure | Principles IA-1…IA-12 + Future impact + Known risks |
| New canonical GOV | GOV-094…GOV-103 (10) |
| Existing GOV referenced | 19 unique IDs from prior registry (no re-mint) |
| Recommendations | REC-027…REC-033 (7) — not canon |
| Conflicts flagged | CF-IA-001…CF-IA-006 |
| Needs Discussion | GOV-095, GOV-097, GOV-099 |
| Governance score | **78 / 100** |

**Separation law:** Canonical Decisions ≠ Governance Recommendations.

### Existing GOV references (duplicates — do not re-mint)

| IA item | Existing GOV | Note |
|---------|--------------|------|
| IA-3 | `GOV-020`, `GOV-080` | One primitive, many surfaces; anti-picker proliferation |
| IA-5 | `GOV-032` | Progressive disclosure by stakes |
| IA-8 | `GOV-013`, `GOV-041`, `GOV-085`, `GOV-092` | Device ceilings as product law (/m, native, marketing honesty) |
| IA-2 (intent core) | `GOV-027`, `GOV-028` | Intent over interface + capture-first; five named intents elevated in GOV-095 |
| IA-1 (graph integrity) | `GOV-019`, `GOV-043` | One linking system; IA-1 elevates graph-over-folders presentation as GOV-094 |
| IA-4 (derived calm) | `GOV-029`, `GOV-052`, `GOV-009` | Calm read / structure-after-capture / Life Score derived; layers elevated in GOV-096 |
| IA-6 (forced taxonomy ban) | `GOV-008`, `GOV-075` | No form-builder/sidebar sermons; no duplicate nav; free-pin elevated in GOV-097 |
| IA-7 (calm read) | `GOV-029` | Read surfaces stay calm; consolidation rule elevated in GOV-098 |
| IA-11 (GoodNotes mush) | `GOV-010` | GoodNotes PWA refuse; concept split elevated in GOV-101 |
| IA-12 (social refuse) | `GOV-005`, `GOV-078` | No social feed/auto-post; timeline chronology elevated in GOV-102 |
| Purpose/Reasoning (free-pin + consolidated read locked) | `GOV-075`, `GOV-029` | Reasoning asserts free-pin + consolidated read already locked — elevated as GOV-097/GOV-098 this pass; cite GOV-075/GOV-029 as prior anchors |

---

## 2. CANONICAL DECISIONS

Only new decisions supported by IA Principles (Confidence High or Medium). Binding when Status is Approved.

### Canonical Product Decisions

### GOV-101 — Knowledge/Notes ≠ Journal ≠ Documents

| Field | Value |
|-------|-------|
| Category | IA — Concept Separation |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | High |
| Canon Class | canonical |

**Decision:** Knowledge/Notes (source-grounded reference library), Journal (reflection capture), and Documents (files/artifacts, often family/vault-linked) must remain distinct concepts in IA to prevent GoodNotes/Notion mush.

**Reason:** Principle IA-11 — Knowledge ≠ Journal ≠ Documents.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** Principle IA-11 — Knowledge ≠ Journal ≠ Documents
  - **Quote:** IA must keep these distinct to prevent GoodNotes/Notion mush.
- **Articles:** _n/a_
  - **Sections:** Principle IA-11 — Knowledge ≠ Journal ≠ Documents — table
  - **Quote:** Knowledge / Notes | Source-grounded reference library
- **Articles:** _n/a_
  - **Sections:** Principle IA-11 — Knowledge ≠ Journal ≠ Documents — table
  - **Quote:** Journal | Reflection capture
- **Articles:** _n/a_
  - **Sections:** Principle IA-11 — Knowledge ≠ Journal ≠ Documents — table
  - **Quote:** Documents | Files/artifacts (often family/vault-linked)

**Depends On:** `GOV-010`, `GOV-020`, `GOV-096`

**Blocks:** Notes/Knowledge IA, Journal IA, Documents/Vault IA, Page Blueprints

**Referenced By:** P8, Android Build, Website, Backend, AI

**Implementation Impact:** Separate nav/routes/primitives for Notes, Journal, Documents; no unified mush editor identity.


### Canonical UX Decisions

### GOV-094 — Graph-over-folders IA — edges not table names

| Field | Value |
|-------|-------|
| Category | IA — Graph Structure |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Extreme |
| Canon Class | canonical |

**Decision:** Life entities relate through edges. IA must express relationships (e.g. goal→habit→log→score) rather than forcing users to know table names or navigate as folders mirroring engineering schemas.

**Reason:** Principle IA-1 — Graph over folders. Protects connected life-graph claim.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** Principle IA-1 — Graph over folders
  - **Quote:** Life entities relate through edges. IA must express relationships (goal→habit→log→score) rather than forcing users to know table names.
- **Articles:** _n/a_
  - **Sections:** Reasoning
  - **Quote:** AIIMIN's core claim is a connected life graph. IA that mirrors engineering tables or vendor modules will recreate the fragmentation the product exists to solve.

**Depends On:** `GOV-019`, `GOV-043`, `GOV-001`, `GOV-004`

**Blocks:** Information Architecture, Entity Model UX, Android Navigation, Master Product Specification

**Referenced By:** P8, P9, Android Build, Website, AI, Design System

**Implementation Impact:** Nav/labels/entity UIs show relationships; forbid folder-tree IA that mirrors DB table names.


### GOV-095 — Primary IA intents: capture, review, plan, prepare, configure

| Field | Value |
|-------|-------|
| Category | IA — Intent Entry Points |
| Status | Needs Discussion |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | High |
| Canon Class | canonical |

**Decision:** Primary entry points serve intents: capture, review, plan, prepare, configure. Domain nouns (Finance, Family) are valid destinations, not mandatory first gates for every utterance.

**Reason:** Principle IA-2 — Intent before taxonomy.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** Principle IA-2 — Intent before taxonomy
  - **Quote:** Primary entry points serve intents: capture, review, plan, prepare, configure. Domain nouns (Finance, Family) are valid destinations, not mandatory first gates for every utterance.

**Depends On:** `GOV-027`, `GOV-028`, `GOV-002`

**Blocks:** Primary Navigation Map, Bottom Nav, Command Palette Routing, Android Navigation

**Referenced By:** P8, Android Build, Website, AI, Design System

**Implementation Impact:** Needs destination map under each intent (closes M-001 / GOV-075 partially). Until then: reject taxonomy-first utterance gates.


### GOV-096 — Four IA node layers: Capture, Execution, Planning, Derived

| Field | Value |
|-------|-------|
| Category | IA — Node Layers |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | High |
| Canon Class | canonical |

**Decision:** IA distinguishes four layers: Capture (fast write; minimal fields), Execution (direct action), Planning (direction first), Derived (calm read; no fake input). Do not force derived-node UI patterns onto capture nodes.

**Reason:** Principle IA-4 — Capture nodes vs derived nodes.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** Principle IA-4 — Capture nodes vs derived nodes
  - **Quote:** Do not force derived-node UI patterns onto capture nodes.
- **Articles:** _n/a_
  - **Sections:** Principle IA-4 — Capture nodes vs derived nodes — table
  - **Quote:** Capture | Journal, notes, transactions, logs | Fast write; minimal fields
- **Articles:** _n/a_
  - **Sections:** Principle IA-4 — Capture nodes vs derived nodes — table
  - **Quote:** Derived | Life Score, insights, reports | Calm read; no fake input

**Depends On:** `GOV-028`, `GOV-029`, `GOV-052`, `GOV-032`

**Blocks:** Page Blueprints, Entity Intake, Life Score UX, Capture UX

**Referenced By:** P8, P9, Android Build, Website, AI, Design System

**Implementation Impact:** Every entity/page declares layer; capture UIs stay minimal; derived surfaces never fake write controls.


### GOV-097 — User-owned masthead free-pin navigation (bounded); honest More

| Field | Value |
|-------|-------|
| Category | IA — Navigation Ownership |
| Status | Needs Discussion |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | High |
| Canon Class | canonical |

**Decision:** Masthead free-pin (bounded) beats forced sidebar taxonomy sermons. Overflow is honest ("More") — do not hide essential capture behind personalization debt.

**Reason:** Principle IA-6 — User-owned navigation. Reasoning states free-pin already locked.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** Principle IA-6 — User-owned navigation
  - **Quote:** Masthead free-pin (bounded) beats forced sidebar taxonomy sermons. Overflow is honest ("More") — do not hide essential capture behind personalization debt.
- **Articles:** _n/a_
  - **Sections:** Reasoning
  - **Quote:** Free-pin navigation and consolidated read surfaces are already locked decisions; principles must protect them.
- **Articles:** _n/a_
  - **Sections:** Known risks
  - **Quote:** Free-pin chaos without sensible defaults for new users.

**Depends On:** `GOV-008`, `GOV-075`, `GOV-066`, `GOV-028`

**Blocks:** Masthead Spec, Sidebar Spec, Android Navigation, Onboarding Defaults

**Referenced By:** P8, Android Build, Website, Design System

**Implementation Impact:** Implement bounded free-pin + More overflow. Needs founder defaults for new users (Known risks). Complements GOV-075; does not alone name primary destinations.


### GOV-098 — Consolidate read surfaces; new dashboard must kill an old one

| Field | Value |
|-------|-------|
| Category | IA — Read Surface Consolidation |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** When two pages answer the same "how am I doing?" question, merge. Insights redirecting into Reports is the template. New dashboard pages require killing an old one.

**Reason:** Principle IA-7 — Consolidate read surfaces.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** Principle IA-7 — Consolidate read surfaces
  - **Quote:** When two pages answer the same "how am I doing?" question, merge. Insights redirecting into Reports is the template. New dashboard pages require killing an old one.
- **Articles:** _n/a_
  - **Sections:** Known risks
  - **Quote:** "Everything page" dumping grounds.

**Depends On:** `GOV-029`, `GOV-076`, `GOV-034`

**Blocks:** Dashboard Proposals, Insights/Reports IA, Page Blueprints

**Referenced By:** P8, Website, Android Build, Design System

**Implementation Impact:** Feature intake for new dashboards must name the page killed or the merge target. Ban everything-page dumps.


### GOV-099 — Command Palette / universal search are first-class IA

| Field | Value |
|-------|-------|
| Category | IA — Routing Spine |
| Status | Needs Discussion |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Extreme |
| Canon Class | canonical |

**Decision:** Command Palette / universal search are not power-user Easter eggs; they are the routing spine for "one utterance, many tables."

**Reason:** Principle IA-9 — Search and palette are first-class IA.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** Principle IA-9 — Search and palette are first-class IA
  - **Quote:** Command Palette / universal search are not power-user Easter eggs; they are the routing spine for "one utterance, many tables."

**Depends On:** `GOV-027`, `GOV-047`, `GOV-094`, `GOV-095`

**Blocks:** Command Palette Spec, Universal Search, Android Search, AI Routing

**Referenced By:** P8, Android Build, Website, AI, Backend

**Implementation Impact:** Needs scope/spec (surfaces, actions, privacy). Treat palette/search as primary routing, not optional power feature.


### GOV-100 — Settings are a penalty box — no daily actions or junk drawer

| Field | Value |
|-------|-------|
| Category | IA — Settings Policy |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** Settings hold rare preference and account risk. Do not park daily actions in Settings. Do not use Settings as a junk drawer for unfinished features.

**Reason:** Principle IA-10 — Settings are a penalty box.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** Principle IA-10 — Settings are a penalty box
  - **Quote:** Settings hold rare preference and account risk. Do not park daily actions in Settings. Do not use Settings as a junk drawer for unfinished features.

**Depends On:** `GOV-032`, `GOV-095`, `GOV-066`

**Blocks:** Settings IA, Feature Placement Reviews, Android Settings

**Referenced By:** P8, Android Build, Website, Design System

**Implementation Impact:** Audit Settings for daily actions; relocate to intent surfaces. Unfinished features do not land in Settings.


### GOV-102 — Timeline/Calendar is chronology, not a social feed

| Field | Value |
|-------|-------|
| Category | IA — Timeline Role |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** Timeline/Calendar surfaces organize by time for planning and memory. They must not become social feeds or infinite engagement scrolls.

**Reason:** Principle IA-12 — Timeline is chronology, not a feed.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** Principle IA-12 — Timeline is chronology, not a feed
  - **Quote:** Timeline/Calendar surfaces organize by time for planning and memory. They must not become social feeds or infinite engagement scrolls.

**Depends On:** `GOV-005`, `GOV-078`, `GOV-029`

**Blocks:** Timeline UX, Calendar UX, Engagement Metrics

**Referenced By:** P8, Android Build, Website, AI

**Implementation Impact:** Timeline/Calendar UX optimized for planning/memory; ban social-feed patterns and infinite engagement scroll goals.


### Canonical Governance Process Decisions

### GOV-103 — New entities must declare IA contract (layer, write owner, edges, ceiling, blueprint)

| Field | Value |
|-------|-------|
| Category | IA — Entity Intake Contract |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Low |
| Canon Class | canonical |

**Decision:** New entities must declare: capture vs derived (layer), write primitive owner, edges, device ceiling, and which page blueprint owns them.

**Reason:** Future impact section — operationalizes IA principles for entity intake.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** Future impact
  - **Quote:** New entities must declare: capture vs derived, write primitive owner, edges, device ceiling, and which page blueprint owns them.

**Depends On:** `GOV-096`, `GOV-020`, `GOV-094`, `GOV-013`, `GOV-074`

**Blocks:** Entity Intake, Feature Intake, Schema Field Intake, Page Blueprints

**Referenced By:** P8, P9, Backend, Android Build, Website

**Implementation Impact:** Add entity IA declaration checklist to feature/schema intake; reject entities missing any field.


---

## 3. GOVERNANCE RECOMMENDATIONS (NOT CANON)

### REC-027 — Publish free-pin sensible defaults for new users

- **Priority:** P0
- **Status:** Pending Founder
- **Reason:** GOV-097 Known risk: free-pin chaos without defaults.
- **Impact:** Onboarding pins start coherent; personalization after.
- **Risk:** High if skipped — navigation thrash for new users.
- **Related GOV:** `GOV-097`, `GOV-075`

### REC-028 — Publish primary destination map under five intents (capture/review/plan/prepare/configure)

- **Priority:** P0
- **Status:** Pending Founder
- **Reason:** GOV-095 Needs Discussion; closes M-001 / advances GOV-075.
- **Impact:** Bottom nav / masthead destinations become citeable.
- **Risk:** Extreme if delayed — duplicate nav returns.
- **Related GOV:** `GOV-095`, `GOV-075`, `GOV-097`, `GOV-012`

### REC-029 — Add entity IA declaration checklist to feature/schema intake

- **Priority:** P0
- **Status:** Pending Founder
- **Reason:** Operationalize GOV-103.
- **Impact:** Every new entity ships with layer/owner/edges/ceiling/blueprint.
- **Risk:** Low process friction.
- **Related GOV:** `GOV-103`, `GOV-074`

### REC-030 — Publish Command Palette / universal search scope spec

- **Priority:** P0
- **Status:** Pending Founder
- **Reason:** GOV-099 Needs Discussion — spine asserted, scope undefined.
- **Impact:** Unblocks Android/web search routing.
- **Risk:** High if vague — privacy or power-user-only drift.
- **Related GOV:** `GOV-099`, `GOV-047`

### REC-031 — Page Blueprint review gate against everything-page dumps

- **Priority:** P1
- **Status:** Pending Founder
- **Reason:** Known risk + GOV-098 consolidation law.
- **Impact:** Stops dumping-ground dashboards.
- **Risk:** Low.
- **Related GOV:** `GOV-098`, `GOV-076`

### REC-032 — Founder confirm GOV-075 primacy model = free-pin masthead (GOV-097); destinations still via REC-028

- **Priority:** P1
- **Status:** Pending Founder
- **Reason:** CF-IA-001 status hygiene between GOV-075 and GOV-097.
- **Impact:** Clarifies what Needs Discussion remains (destinations only).
- **Risk:** Low.
- **Related GOV:** `GOV-075`, `GOV-097`

### REC-033 — Next P7 artifact after founder OK: 15_PAGE_BLUEPRINTS or 13_NAMING_LANGUAGE

- **Priority:** P0
- **Status:** Pending Founder
- **Reason:** IA principles depend on blueprints + naming for destinations.
- **Impact:** Continues build-without-reread completeness.
- **Risk:** Low.
- **Related GOV:** `GOV-095`, `GOV-098`, `GOV-103`

---

## 4. Conflicts

Flagged only — **not** auto-resolved. Prior governance unchanged.

| Conflict ID | Type | Detail | Recommendation |
|-------------|------|--------|----------------|
| CF-IA-001 | Complementary Needs Discussion (not contradiction) | Non-Negotiables GOV-075 forbids duplicate navigation systems but lacks primacy model. IA-6 / GOV-097 names masthead free-pin as primacy model. Destinations still missing. Do not auto-close GOV-075. | REC-032 + REC-028. Flag only. |
| CF-IA-002 | Incomplete vs Constitution route bind | GOV-095 names five intents; Constitution GOV-012 still Needs Discussion for Today≡/overview. Intents do not resolve route alias. | Keep REC-003. Intent map separate from brand lockup route. |
| CF-IA-003 | Known risk — cross-client IA divergence | Known risks: Native and web IA diverging until brand feels like two products (tokens must still unify). Touches GOV-040/GOV-073. Not a source contradiction. | Keep REC-020 token SoT; IA destination map must cover native+web. |
| CF-IA-004 | Known risk — free-pin without defaults | GOV-097 Approved intent but Known risks warn free-pin chaos without sensible defaults. | REC-027. Status Needs Discussion until defaults named. |
| CF-IA-005 | Incomplete — linking system still unnamed | GOV-094 requires edge expression; GOV-043 linking system still unnamed (Constitution CF-009). | Keep REC-005. Do not invent linking name here. |
| CF-IA-006 | Incomplete — Command Palette scope | GOV-099 asserts first-class palette/search without action inventory, privacy bounds, or client parity. | REC-030. |

---

## 5. Missing Decisions

| Gap ID | Missing | Why | Next |
|--------|---------|-----|------|
| M-IA-001 | Primary destination map under five intents | GOV-095 incomplete | REC-028 |
| M-IA-002 | Free-pin default pin set for new users | GOV-097 Known risk | REC-027 |
| M-IA-003 | Command Palette / search action scope + privacy | GOV-099 incomplete | REC-030 |
| M-IA-004 | Named linking system for graph edges | GOV-094 depends on GOV-043 | REC-005 |
| M-IA-005 | Page Blueprint catalog for layer ownership | GOV-103 + GOV-098 | Govern 15_PAGE_BLUEPRINTS |
| M-IA-006 | Naming language for intent vs domain labels | IA-2 domain nouns vs intents | Govern 13_NAMING_LANGUAGE |
| M-IA-007 | Settings inventory audit (daily actions parked) | GOV-100 enforcement | Product audit + REC-029 process |

---

## 6. Questions for Founder

1. Confirm free-pin primacy model (GOV-097) closes GOV-075 model gap — destinations still open (REC-032)?
2. Approve default free-pin set for new users (REC-027) — propose list?
3. Publish five-intent destination map now or after Page Blueprints (REC-028)?
4. Command Palette: desktop-first only, or Android parity required for GOV-099?
5. Is Insights→Reports redirect still the live template for GOV-098?
6. Confirm Knowledge/Notes vs Journal vs Documents route IDs for GOV-101?
7. Does prepare intent include Focus/pre-session only, or also packing/travel/rituals?
8. Next artifact: 15_PAGE_BLUEPRINTS or 13_NAMING_LANGUAGE (REC-033)?

---

## 7. Dependency Graph Summary

### Highest fan-in (from new GOV-094…103)

| GOV ID | Count | Title |
|--------|-------|-------|
| GOV-028 | 3 | Capture first, structure later |
| GOV-029 | 3 | Read surfaces stay calm |
| GOV-027 | 2 | Intent over interface |
| GOV-032 | 2 | Progressive disclosure by stakes |
| GOV-066 | 2 | Ceremony-free Enter/primary save on every capture path |
| GOV-094 | 2 | Graph-over-folders IA — edges not table names |
| GOV-095 | 2 | Primary IA intents: capture, review, plan, prepare, configure |
| GOV-020 | 2 | One primitive, many surfaces |
| GOV-096 | 2 | Four IA node layers: Capture, Execution, Planning, Derived |
| GOV-019 | 1 | One linking system for life entities |
| GOV-043 | 1 | Single linking system (unnamed) |
| GOV-001 | 1 | Personal Life OS category lock |

### Extreme cost (new)

| GOV ID | Title | Blocks |
|--------|-------|--------|
| GOV-094 | Graph-over-folders IA — edges not table names | Information Architecture, Entity Model UX, Android Navigation, Master Product Specification |
| GOV-099 | Command Palette / universal search are first-class IA | Command Palette Spec, Universal Search, Android Search, AI Routing |

### Needs Discussion

| GOV ID | Title |
|--------|-------|
| GOV-095 | Primary IA intents: capture, review, plan, prepare, configure |
| GOV-097 | User-owned masthead free-pin navigation (bounded); honest More |
| GOV-099 | Command Palette / universal search are first-class IA |

---

## 8. Final Governance Score

| Dimension | Score (/10) |
|-----------|-------------|
| Identity clarity | 9 |
| Enforceability | 8 |
| Cross-platform readiness | 7 |
| AI readiness | 7 |
| Conflict hygiene | 8 |
| Metric rigor | 6 |
| Amendment process | 8 |
| Completeness for build-without-reread | 7 |
| Traceability / evidence | 9 |
| Machine-readability | 9 |

### Final Governance Score: **78 / 100**

IA Principles supply navigation/entity organization canon missing from Constitution. GOV-094…103 add graph IA, intents, layers, free-pin, consolidation, palette spine, settings penalty, concept splits, timeline role, entity contract. Still Needs Discussion on destination map, free-pin defaults, and Command Palette scope. No hard contradiction with Constitution or Non-Negotiables; conflicts flagged only.

---

## Evidence (process)

- Source read: `06_INFORMATION_ARCHITECTURE_PRINCIPLES.md` v3.0 FROZEN
- Cross-ref: Constitution + Non-Negotiables + MASTER_DECISION_REGISTRY
- Untouched: Constitution/, Non-Negotiables/, 00_GOVERNANCE_STANDARD.md
- New GOV: GOV-094…GOV-103
- Validation: continuous IDs, schema, dup GOV, dup decision, broken deps/refs, evidence — PASSED

