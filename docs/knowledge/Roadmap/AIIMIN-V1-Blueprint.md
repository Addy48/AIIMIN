---
authority: engineering
derived_from: Genesis P5/P7/P8/P9 · UX-Architecture v1.0 · UX-Intelligence v1.0 · Program-0
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-08-20
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

# AIIMIN V1 — Product Blueprint (spine)

> [!important] Spine (Phase V5)
> Full 3000-line body split into appendices on 2026-08-20. Agents load **this spine first**.
> Open one appendix only when the job needs that chapter. Full searchable dump: [[Blueprint-Appendices/00_FULL_ARCHIVE]].

**Authority:** subordinate to Genesis · implementation contract for V1.
**Tracker:** [[16_DOCUMENTATION/Simplification-Phase-Tracker]]

## 0. How to use

1. Read this spine (~few minutes).
2. Open **one** appendix for the chapter you need.
3. Do not paste the full archive into agent context.
4. Product scope changes → ADR or Blueprint amendment — not Current Context dumps.

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


## 1. One-screen product shape

| Surface | Path | Job |
|---------|------|-----|
| Web Life OS | `frontend/` | Deep desktop/tablet OS |
| Native V3 | `native-android-v3/` | Companion app |
| Capacitor `/m` | `frontend/android/` | Legacy capture — sunset path |
| API | `server/` + `api.aiimin.in` | Single backend truth |

Law: [[Maps of Content/Genesis]] · Living leftover: [[17_NATIVE_APP_V2/V3-LEFTOVER-CHECKLIST]] · Monorepo: [[02_ARCHITECTURE/Monorepo]]

## 2. Appendices

| # | Appendix | Contents |
|---|----------|----------|
| 01 | [[Blueprint-Appendices/01_Vision-Architecture]] | §1–3 Vision, ecosystem, IA |
| 02 | [[Blueprint-Appendices/02_Design-Motion-Components]] | §4–6 Design, motion, components |
| 03 | [[Blueprint-Appendices/03_Onboarding-Features]] | §7–8 Onboarding, features |
| 04 | [[Blueprint-Appendices/04_Data-API-AI]] | §9–11 Data, API, AI |
| 05 | [[Blueprint-Appendices/05_Privacy-Sync-Backend]] | §12–14 Privacy, sync, backend |
| 06 | [[Blueprint-Appendices/06_Web-Quality]] | §15–19 Web, states, analytics, a11y, testing |
| 07 | [[Blueprint-Appendices/07_Roadmap-Validation-Decisions]] | §20–23 Roadmap, validation, open decisions, trace |
| 08 | [[Blueprint-Appendices/08_Amendment-A]] | Amendment A §24–28 |
| FULL | [[Blueprint-Appendices/00_FULL_ARCHIVE]] | Unsplit archive (search only) |

## 3. Open decisions

Open Founder decisions live in appendix [[Blueprint-Appendices/07_Roadmap-Validation-Decisions]] (§22). Do not re-litigate locked palette, Genesis, or Life Score taxonomy ([[10_DECISIONS/2026-08-03-life-score-taxonomy]]).

## 4. Related

- [[15_MEMORY/Current-Context]]
- [[Maps of Content/Cold-Roadmap]]
- [[10_DECISIONS/2026-07-30-vault-operating-model]]
- [[00_HOME]]
