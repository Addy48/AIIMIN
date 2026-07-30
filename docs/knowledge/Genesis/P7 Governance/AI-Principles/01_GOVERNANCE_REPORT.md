# 01 — AI Principles Governance Report

```yaml
document: AI Principles Governance Report
phase: P7
standard: AIIMIN GENESIS/P7 Governance/00_GOVERNANCE_STANDARD.md
standard_version: 1.0
source: AIIMIN GENESIS/P2 Knowledge Intelligence/supporting/product-bible/06_AI_MODEL.md
source_alias: 10_AI_PRINCIPLES.md → 06_AI_MODEL.md (P5 10_ is Component Principles)
source_twin: docs/AIIMIN_PRODUCT_BIBLE/06_AI_MODEL.md
governance_date: 2026-07-22
gov_ids_new: GOV-136…GOV-141
gov_ids_referenced: GOV-001…GOV-135 (prior; not re-minted)
```

> Machine-readable twin: `02_GOVERNANCE_DECISIONS.json` · Index: `03_GOVERNANCE_INDEX.md` · Standard: `../00_GOVERNANCE_STANDARD.md`

**Filename note:** Requested `10_AI_PRINCIPLES.md` does not exist. P5 `10_` = Component Principles. Governed frozen Discovery Product Bible **`06_AI_MODEL.md`**. Source **not modified**. Constitution, Non-Negotiables, IA, Visual Language, Motion, Interaction Principles, and Governance Standard **not modified**.

---

## 1. Artifact Overview

| Field | Value |
|-------|-------|
| Source | Product Bible `06_AI_MODEL.md` |
| Structure | Behavior thesis · Roles · Confidence bands · Input stack · Must-nots · Provider map pointer |
| New canonical GOV | GOV-136…GOV-141 (6) |
| Existing GOV referenced | 27 unique (no re-mint) |
| Recommendations | REC-055…REC-061 (7) — not canon |
| Conflicts flagged | CF-AI-001…CF-AI-005 |
| Needs Discussion | GOV-137 |
| Governance score | **80 / 100** |

**Separation law:** Canonical Decisions ≠ Governance Recommendations.

### Existing GOV references (duplicates — do not re-mint)

| AI item | Existing GOV | Note |
|---------|--------------|------|
| Philosophy — NL intent + derived structure | GOV-047, GOV-052, GOV-028 | AI-first NL + structure-after-capture + capture-first — mixed-initiative layer elevated in GOV-136 |
| Confidence bands gate action (principle without thresholds) | GOV-048 | Constitution asserts bands; numeric thresholds elevated in GOV-137 (Needs Discussion / REC-004) |
| Correctable inference / chips | GOV-035, GOV-051, GOV-126, GOV-123 | Silent-wrong forbid + infer-then-chip — one-tap correction in GOV-136 |
| Sparring / anti-magic / anti-therapist | GOV-049, GOV-053, GOV-050, GOV-006 | Sparring + no magic patronage + no clinical/therapist — reused |
| Must-not: clinical diagnose | GOV-006, GOV-050 | Refuse clinical/therapist already Constitution/AI |
| Must-not: auto-share private life / journal | GOV-078, GOV-016, GOV-083 | No auto-post + journal out of analytics/push |
| Must-not: invent finance | GOV-082 | No invented finance without utterance |
| Must-not: block capture behind modes | GOV-008, GOV-066 | Refuse form-builder/capture blockers + Enter-to-save |
| Safety never infer meds/allergies/PIN | GOV-070 | NN already — Safety/legal row in bands table confirms |
| Interruptibility / no mid-Focus coaching | GOV-033, GOV-088 | Core interruptibility; coaching-window stack step elevated in GOV-141 |
| Kill List in AI path | GOV-074 | Kill List consult — stack step 3 cites check Kill List |
| Auth/schema change control (adjacent) | GOV-018, GOV-042 | Human ask for auth/schema; AI Model adds billing+auth never without explicit user action → GOV-140 |
| Remembered context / vision | GOV-002, GOV-061 | Capture once + tomorrow lighter — memory philosophy not detailed in AI Model |
| Dev agent memory hygiene (not product AI) | GOV-086 | Cursor/agent vault hygiene ≠ product AI roles — do not conflate |

### Extract coverage map

| Extract topic | Treatment |
|---------------|-----------|
| AI philosophy | GOV-136 (+ GOV-047/053) |
| Memory behavior | Reuse GOV-002/061 — detail absent (M-AI-005) |
| Coaching behavior | GOV-141 (+ GOV-033/088) |
| Recommendation behavior | Coach role in GOV-138 + GOV-141 |
| Confidence handling | GOV-137 (ND) + GOV-048 |
| Uncertainty handling | GOV-137 <40% ask |
| Hallucination policy | Only finance invent GOV-082 — general absent (M-AI-001) |
| Explainability / Transparency | Absent — M-AI-002 |
| Personalization / Learning | Absent — M-AI-003 |
| Privacy | Reuse GOV-078/016/083/070 |
| Context usage | GOV-139 stack |
| Agent behavior | GOV-138 roles (≠ GOV-086 dev agents) |
| Automation limits | GOV-137/140 + reused must-nots |
| Human approval gates | GOV-137 confirm/ask bands |
| Feedback loops / Error recovery | GOV-126/035/051 |
| AI refusal rules | GOV-140 + reused 006/050/078/082/008 |
| Multi-model orchestration | Absent — REC-058 |
| Future AI compatibility | Horvitz pointer only — M-AI-007 |

---

## 2. CANONICAL DECISIONS

### GOV-136 — AI is mixed-initiative layer — not chatbot-on-forms; one tap from correction

| Field | Value |
|-------|-------|
| Category | AI — Philosophy |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | High |
| Canon Class | canonical |

**Decision:** AIIMIN AI is a mixed-initiative layer that routes intent, infers structure, generates insight, and proposes action — not a chatbot bolted onto forms. The user is always one tap from correction.

**Reason:** AI Model opening law. Elevates product AI posture beyond GOV-047 NL-intent statement.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** How AI should behave in AIIMIN
  - **Quote:** AIIMIN's AI is not a chatbot bolted onto forms. It is a **mixed-initiative layer** that routes intent, infers structure, generates insight, and proposes action — with the user always one tap from correction.

**Depends On:** `GOV-047`, `GOV-048`, `GOV-051`, `GOV-053`, `GOV-126`

**Blocks:** AI Feature Intake, AI UX Spec, Command Palette AI, Universal Logger, Insights/Coach

**Referenced By:** P8, AI, Design System, Android Build, Desktop, Website

**Implementation Impact:** Reject chatbot-shell features without routing/inference/correction. Every AI write path exposes correction (chips/edit). Pair with GOV-126.

### GOV-137 — Confidence band thresholds — ≥70 auto; 40–70 confirm; <40 ask; safety never infer

| Field | Value |
|-------|-------|
| Category | AI — Confidence Bands |
| Status | Needs Discussion |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Extreme |
| Canon Class | canonical |

**Decision:** AI action is gated by confidence bands: ≥70% auto-fill and save with small edit chip; 40–70% pre-fill requiring confirm via highlighted chip row; <40% ask a minimal question (single field or voice); safety/legal fields never infer — always ask (meds, allergies, PIN).

**Reason:** AI Model Confidence bands table. Supplies numeric thresholds Constitution GOV-048 deferred (REC-004).

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** Confidence bands — table
  - **Quote:** ≥70% | Auto-fill; save | Small "edit" chip
- **Articles:** _n/a_
  - **Sections:** Confidence bands — table
  - **Quote:** 40–70% | Pre-fill; require confirm | Highlighted chip row
- **Articles:** _n/a_
  - **Sections:** Confidence bands — table
  - **Quote:** <40% | Ask minimal question | Single field or voice
- **Articles:** _n/a_
  - **Sections:** Confidence bands — table
  - **Quote:** Safety/legal | Never infer | Always ask (meds, allergies, PIN)

**Depends On:** `GOV-048`, `GOV-035`, `GOV-051`, `GOV-070`, `GOV-126`, `GOV-136`

**Blocks:** AI Confidence Spec, Inferencer Implementation, Finance Category AI, Safety Field Gates

**Referenced By:** P8, AI, Android Build, Desktop, Backend, Design System

**Implementation Impact:** Implement band thresholds + UI states. Founder ratify vs GOV-048 (REC-004/REC-055). Safety row confirms GOV-070 — do not weaken.

### GOV-138 — Five AI roles — Router, Inferencer, Analyzer, Coach, Composer

| Field | Value |
|-------|-------|
| Category | AI — Role Model |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | High |
| Canon Class | canonical |

**Decision:** Product AI has five roles: Router (classify free text → entity), Inferencer (fill fields when confidence high), Analyzer (post-capture enrichment), Coach (narrative + recommendation), Composer (draft milestones, arc, summaries). Features must declare which role(s) they exercise.

**Reason:** AI Model Roles table. Role taxonomy missing from prior GOVs.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** Roles — table
  - **Quote:** Router | Classify free text → correct table/entity | Command Palette, Universal Logger
- **Articles:** _n/a_
  - **Sections:** Roles — table
  - **Quote:** Inferencer | Fill fields silently when confidence high | Finance category, mood, pillar
- **Articles:** _n/a_
  - **Sections:** Roles — table
  - **Quote:** Analyzer | Post-capture enrichment | Journal analyze, ATS, Vocal Mastery
- **Articles:** _n/a_
  - **Sections:** Roles — table
  - **Quote:** Coach | Narrative + recommendation | Insights, Monday widget, morning briefing
- **Articles:** _n/a_
  - **Sections:** Roles — table
  - **Quote:** Composer | Draft milestones, arc, summaries | Goals, Identity, Focus reflection

**Depends On:** `GOV-136`, `GOV-047`, `GOV-048`

**Blocks:** AI Feature Intake, Provider Routing, Insights Architecture, Goals/Identity AI

**Referenced By:** P8, AI, Backend, Desktop, Android Build

**Implementation Impact:** AI PRs name role(s). Do not invent sixth brand role without founder. Coach role bound by GOV-141 interruptibility.

### GOV-139 — Capture AI input stack order — intent → entities → Kill List → write → telemetry → coaching window

| Field | Value |
|-------|-------|
| Category | AI — Context / Pipeline |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Extreme |
| Canon Class | canonical |

**Decision:** When AI processes a capture, ordered stack is: (1) Parse intent (Human Intent Graph), (2) Identify target entities (Information Graph), (3) Check Kill List — which fields can be skipped, (4) Write to table(s) with inferred fields, (5) Emit telemetry event, (6) Surface coaching only if interruptibility window open.

**Reason:** AI Model Input stack order. Canonical context-usage / pipeline law.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** Input stack order
  - **Quote:** 1. Parse intent (Human Intent Graph)
- **Articles:** _n/a_
  - **Sections:** Input stack order
  - **Quote:** 2. Identify target entities (Information Graph)
- **Articles:** _n/a_
  - **Sections:** Input stack order
  - **Quote:** 3. Check Kill List — which fields can be skipped
- **Articles:** _n/a_
  - **Sections:** Input stack order
  - **Quote:** 4. Write to table(s) with inferred fields
- **Articles:** _n/a_
  - **Sections:** Input stack order
  - **Quote:** 5. Emit telemetry event
- **Articles:** _n/a_
  - **Sections:** Input stack order
  - **Quote:** 6. Surface coaching only if interruptibility window open

**Depends On:** `GOV-047`, `GOV-074`, `GOV-033`, `GOV-136`, `GOV-138`, `GOV-094`

**Blocks:** Capture AI Pipeline, Telemetry Spec, Coach Delivery, Kill List Enforcement

**Referenced By:** P8, AI, Backend, Desktop, Android Build

**Implementation Impact:** Capture AI services follow this order. No coaching before write/telemetry path. Kill List checked before field asks.

### GOV-140 — AI must not change auth or billing without explicit user action

| Field | Value |
|-------|-------|
| Category | AI — Automation Limits / Refusal |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** AI must not change authentication or billing state without explicit user action.

**Reason:** AI Model What AI must not do — auth/billing clause is new beside GOV-018 human ask for schema/auth changes.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** What AI must not do
  - **Quote:** Change auth or billing without explicit user action

**Depends On:** `GOV-018`, `GOV-042`, `GOV-136`

**Blocks:** AI Tooling Permissions, Billing Automation, Auth Agent Actions

**Referenced By:** P8, AI, Backend, Security, Desktop, Android Build

**Implementation Impact:** AI tools/agents cannot mutate auth/billing. Require explicit user gesture. Other must-nots reuse GOV-006/050/078/082/008 — not re-minted.

### GOV-141 — Coaching surfaces only when interruptibility window is open

| Field | Value |
|-------|-------|
| Category | AI — Coaching Behavior |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | High |
| Canon Class | canonical |

**Decision:** AI coaching and recommendation surfaces only when the interruptibility window is open. AI does not steal Focus or modal-interrupt protected states.

**Reason:** AI Model stack step 6 + Coach role bound by Constitution interruptibility (GOV-033/088).

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** Input stack order
  - **Quote:** 6. Surface coaching only if interruptibility window open
- **Articles:** _n/a_
  - **Sections:** Roles — table
  - **Quote:** Coach | Narrative + recommendation | Insights, Monday widget, morning briefing

**Depends On:** `GOV-033`, `GOV-088`, `GOV-138`, `GOV-139`, `GOV-030`

**Blocks:** Insights Delivery, Morning Briefing, Monday Widget Coach, Focus Protection

**Referenced By:** P8, AI, Desktop, Android Build, Design System

**Implementation Impact:** Coach/recommend delivery checks Focus/protected windows. Queue or defer coaching when closed. Aligns with GOV-088 no mid-Focus coaching modals.


---

## 3. GOVERNANCE RECOMMENDATIONS (NOT CANON)

### REC-055 — Ratify GOV-137 confidence thresholds and close REC-004 / GOV-048 gap

- **Reason:** AI Model supplies ≥70 / 40–70 / <40 / safety-never-infer; Constitution GOV-048 still Needs Discussion.
- **Impact:** Citeable band spec for Inferencer + UI chips.
- **Risk:** Extreme if delayed — inconsistent automation.
- **Priority:** P0 · **Status:** Pending Founder
- **Related GOV:** GOV-137, GOV-048, GOV-070, GOV-126

### REC-056 — Ratify Approved AI GOVs (136, 138–141) as citeable AI product canon

- **Reason:** Role model + pipeline + coaching window + auth/billing refuse newly citeable.
- **Impact:** AI PRs cite GOV-IDs.
- **Risk:** Medium drift if delayed.
- **Priority:** P0 · **Status:** Pending Founder
- **Related GOV:** GOV-136, GOV-138, GOV-139, GOV-140, GOV-141

### REC-057 — Govern 07_AUTOMATION_RULES next for infer/ask/never matrices (field-level)

- **Reason:** AI Model points Related → Automation Rules; field matrices not in this pass.
- **Impact:** Field-level automation law without inventing here.
- **Risk:** High if skipped — bands without field policy.
- **Priority:** P0 · **Status:** Pending Founder
- **Related GOV:** GOV-137, GOV-070, GOV-074, GOV-123

### REC-058 — Publish AI Provider Map operational companion (vault pointer already exists)

- **Reason:** AI Model Provider map section is pointer-only — multi-model orchestration not specified.
- **Impact:** Named providers/routing without inventing orchestration law.
- **Risk:** Medium — provider sprawl.
- **Priority:** P1 · **Status:** Pending Founder
- **Related GOV:** GOV-138, GOV-136

### REC-059 — Add AI QA gates: role declaration, band compliance, stack order, coaching window, auth/billing refuse

- **Reason:** Operationalize new AI GOVs.
- **Impact:** PR checklist for AI features.
- **Risk:** Low process; High if skipped.
- **Priority:** P0 · **Status:** Pending Founder
- **Related GOV:** GOV-136, GOV-137, GOV-138, GOV-139, GOV-140, GOV-141

### REC-060 — Define sparring vs shame bounds for Coach role (keep REC-015)

- **Reason:** Coach recommendations must not violate GOV-031 emotional refuse; REC-015 still open.
- **Impact:** Coach tone examples.
- **Risk:** Medium — sparring becomes shame.
- **Priority:** P0 · **Status:** Pending Founder
- **Related GOV:** GOV-049, GOV-031, GOV-141, GOV-138

### REC-061 — Next P7 after founder OK: 07_AUTOMATION_RULES or 11_ACCESSIBILITY or 13_NAMING

- **Reason:** AI Model Related cites Automation Rules; Interaction deferred a11y/naming still open.
- **Impact:** Continues build-without-reread.
- **Risk:** Low.
- **Priority:** P0 · **Status:** Pending Founder
- **Related GOV:** GOV-137, GOV-133, GOV-131


---

## 4. Conflicts

| ID | Type | Detail | Action |
|----|------|--------|--------|
| CF-AI-001 | Complementary Needs Discussion — bands | GOV-048 asserts bands without thresholds; GOV-137 supplies numeric bands from AI Model. Not contradiction — founder must ratify (REC-055 / R | REC-055 |
| CF-AI-002 | Source alias — no 10_AI_PRINCIPLES.md | Requested 10_AI_PRINCIPLES.md does not exist; P5 10_ is Component Principles. Governed Product Bible 06_AI_MODEL.md. | Founder confirm source alias |
| CF-AI-003 | Extract gap — memory / hallucination / explainability / personalization / learning / multi-model | Founder extract list exceeds AI Model source. Do not invent. Memory → GOV-002/061; hallucination general absent (finance invent = GOV-082 on | Missing M-AI-*; REC-058 for providers |
| CF-AI-004 | Known adjacent — Automation Rules not governed this pass | Field-level infer/ask/never matrices live in 07_AUTOMATION_RULES. AI Model Related points there. | REC-057 |
| CF-AI-005 | Tone tension — Coach sparring vs never shame | Coach recommendations (GOV-138/141) × GOV-049 sparring × GOV-031 never shame — REC-015 still open. | REC-060 |

---

## 5. Missing Decisions

| ID | Missing | Why | Next |
|----|---------|-----|------|
| M-AI-001 | General hallucination / fabrication policy beyond finance+clinical | Not stated in AI Model | Do not invent; optional later ADR |
| M-AI-002 | Explainability / transparency requirements | Not in source | Future AI Principles amendment or Automation Rules |
| M-AI-003 | Personalization and learning behavior | Not in source | Do not invent |
| M-AI-004 | Multi-model orchestration law | Provider map pointer only | REC-058 |
| M-AI-005 | Product AI memory model (what retained, retention, user control) | Only vision-level remember in Constitution | Separate memory/privacy spec |
| M-AI-006 | Field-level automation matrices | Lives in Automation Rules | REC-057 |
| M-AI-007 | Future AI compatibility beyond Horvitz citation | Related research pointer only | Future Growth Rules / Framework |

---

## 6. Questions for Founder

1. Confirm source alias: 10_AI_PRINCIPLES → Product Bible 06_AI_MODEL (CF-AI-002)?
2. Ratify confidence thresholds ≥70 / 40–70 / <40 / safety-never (GOV-137) and close GOV-048 (REC-055)?
3. Approve five-role taxonomy as sole product AI roles (GOV-138)?
4. Approve capture AI stack order as pipeline law (GOV-139)?
5. Approve AI must not change auth/billing without explicit action (GOV-140)?
6. Confirm coaching only when interruptibility window open (GOV-141)?
7. Next: Automation Rules vs Accessibility vs Naming (REC-061)?

---

## 7. Dependency Graph Summary

### Highest fan-in (from new GOV-136…141)

| GOV ID | Count |
|--------|-------|
| GOV-136 | 4 |
| GOV-047 | 3 |
| GOV-048 | 3 |
| GOV-051 | 2 |
| GOV-126 | 2 |
| GOV-033 | 2 |
| GOV-138 | 2 |
| GOV-053 | 1 |
| GOV-035 | 1 |
| GOV-070 | 1 |
| GOV-074 | 1 |
| GOV-094 | 1 |

### High / Extreme cost (new)

| GOV-136 | AI is mixed-initiative layer — not chatbot-on-forms; one tap from correction | High |
| GOV-137 | Confidence band thresholds — ≥70 auto; 40–70 confirm; <40 ask; safety never infer | Extreme |
| GOV-138 | Five AI roles — Router, Inferencer, Analyzer, Coach, Composer | High |
| GOV-139 | Capture AI input stack order — intent → entities → Kill List → write → telemetry → coaching window | Extreme |
| GOV-141 | Coaching surfaces only when interruptibility window is open | High |

### Needs Discussion

| GOV-137 | Confidence band thresholds — ≥70 auto; 40–70 confirm; <40 ask; safety never infer |

---

## 8. Final Governance Score

| Dimension | Score (/10) |
|-----------|-------------|
| Identity Clarity | 9 |
| Enforceability | 8 |
| Cross Platform Readiness | 7 |
| Ai Readiness | 9 |
| Conflict Hygiene | 7 |
| Metric Rigor | 8 |
| Amendment Process | 8 |
| Completeness Build Without Reread | 6 |
| Traceability Evidence | 9 |
| Machine Readability | 9 |

### Final Governance Score: **80 / 100**

AI Model supplies mixed-initiative philosophy, numeric confidence bands, five roles, capture stack order, auth/billing refuse, and coaching-window law. Heavy reuse of Constitution/NN AI GOVs. GOV-137 Needs Discussion to close GOV-048. Extract gaps (memory model, explainability, multi-model, learning) not invented. Automation Rules deferred (REC-057).

---

## Evidence (process)

- Source read: `06_AI_MODEL.md` (alias label AI Principles)
- Cross-ref: Constitution + NN + IA + VL + Motion + Interaction + MASTER_DECISION_REGISTRY
- Untouched: prior artifact trios + `00_GOVERNANCE_STANDARD.md` + source
- New GOV: GOV-136…GOV-141
- Validation: continuous IDs, schema, dup GOV, dup decision, broken deps/refs, evidence — closeout
