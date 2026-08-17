# 04 — Founder Review Packet

```yaml
document: Founder Review Packet
artifact: Information Architecture Principles
phase: P7
source: AIIMIN GENESIS/P5 Constitution/06_INFORMATION_ARCHITECTURE_PRINCIPLES.md
governance_trio: AIIMIN GENESIS/P7 Governance/IA-Principles/
date: 2026-07-22
purpose: Decision packet only — minimize founder review time
```

> Not documentation. Not new governance. No new GOV/REC IDs. Decide and mark.

---

## Artifact

`06_INFORMATION_ARCHITECTURE_PRINCIPLES.md` v3.0 (FROZEN)  
Governed under `00_GOVERNANCE_STANDARD.md`  
Trio: `01_GOVERNANCE_REPORT.md` · `02_GOVERNANCE_DECISIONS.json` · `03_GOVERNANCE_INDEX.md`

---

## Summary

IA Principles extract navigation/entity organization law that Constitution and Non-Negotiables left incomplete (primary intents, free-pin primacy, node layers, palette spine, entity IA contract).

**10 new GOV** (094–103). **19 existing GOV reused** (no duplicates). **7 REC** pending (already minted — do not re-open extraction). **3 Needs Discussion** block nav/search ship clarity. **No hard contradiction** with Constitution or Non-Negotiables — conflicts are incompleteness/risk flags only.

---

## Governance Score

**78 / 100**

Strong identity + evidence; weak where destinations, free-pin defaults, and Command Palette scope remain unnamed.

---

## New GOV Decisions

| ID | Title | Status | Cost |
|----|-------|--------|------|
| GOV-094 | Graph-over-folders IA — edges not table names | Approved | Extreme |
| GOV-095 | Primary IA intents: capture, review, plan, prepare, configure | Needs Discussion | High |
| GOV-096 | Four IA node layers: Capture, Execution, Planning, Derived | Approved | High |
| GOV-097 | Masthead free-pin (bounded); honest More | Needs Discussion | High |
| GOV-098 | Consolidate read surfaces; new dashboard kills old one | Approved | Medium |
| GOV-099 | Command Palette / universal search first-class IA | Needs Discussion | Extreme |
| GOV-100 | Settings are a penalty box | Approved | Medium |
| GOV-101 | Knowledge/Notes ≠ Journal ≠ Documents | Approved | High |
| GOV-102 | Timeline/Calendar = chronology, not social feed | Approved | Medium |
| GOV-103 | New entities must declare IA contract | Approved | Low |

---

## Existing GOV Decisions Reused

GOV-005, GOV-008, GOV-009, GOV-010, GOV-013, GOV-019, GOV-020, GOV-027, GOV-028, GOV-029, GOV-032, GOV-041, GOV-043, GOV-052, GOV-075, GOV-078, GOV-080, GOV-085, GOV-092  
*(19 unique — IA-3/5/8 and related principles mapped to prior canon)*

---

## REC Items

| ID | Title | Priority |
|----|-------|----------|
| REC-027 | Free-pin sensible defaults for new users | P0 |
| REC-028 | Primary destination map under five intents | P0 |
| REC-029 | Entity IA declaration checklist in intake | P0 |
| REC-030 | Command Palette / search scope spec | P0 |
| REC-031 | Page Blueprint gate vs everything-page dumps | P1 |
| REC-032 | Confirm GOV-075 primacy = free-pin (GOV-097); destinations via REC-028 | P1 |
| REC-033 | Next artifact: Page Blueprints or Naming Language | P0 |

---

## Conflicts

| ID | Meaning | Action for founder |
|----|---------|-------------------|
| CF-IA-001 | GOV-075 vs GOV-097 — complementary, not contradict | Confirm free-pin = primacy model; destinations still open |
| CF-IA-002 | Five intents ≠ Today≡/overview route bind (GOV-012) | Keep route alias separate (REC-003) |
| CF-IA-003 | Native vs web IA divergence risk | Destination map + token SoT must cover both |
| CF-IA-004 | Free-pin without defaults | Decide default pin set (REC-027) |
| CF-IA-005 | Graph edges need unnamed linking system (GOV-043) | Do not invent name here — keep REC-005 |
| CF-IA-006 | Palette asserted; scope missing | Decide scope/parity (REC-030) |

---

## Needs Discussion

GOV-095 · GOV-097 · GOV-099

---

## Most Important Decisions

Highest-impact only (ship / architecture leverage):

1. **GOV-094** — Graph-over-folders (Extreme) — life graph UX vs folder/table IA  
2. **GOV-095** — Five primary intents — whole nav model  
3. **GOV-096** — Capture / Execution / Planning / Derived layers — entity & page placement  
4. **GOV-097** — Free-pin masthead primacy — desktop/web nav ownership  
5. **GOV-099** — Command Palette as routing spine (Extreme) — utterance → many tables  
6. **GOV-098** — Read-surface consolidation — anti–everything-page  
7. **GOV-101** — Notes ≠ Journal ≠ Documents — stops Notion/GoodNotes mush  
8. **GOV-103** — Entity IA contract — intake gate for all new entities  
9. **GOV-100** — Settings penalty box — placement discipline  
10. **GOV-085 / GOV-013** (reused) — Device ceilings remain IA law, not CSS

---

## Founder Decisions Required

### GOV-095 — Primary IA intents

| Field | Content |
|-------|---------|
| **Decision ID** | GOV-095 |
| **Current Proposal** | Primary entry points = **capture, review, plan, prepare, configure**. Domain nouns (Finance, Family) are destinations, not mandatory first gates for every utterance. |
| **Alternatives** | **A)** Adopt five intents as written. **B)** Collapse to 3–4 intents (e.g. merge prepare→plan). **C)** Keep intent-over-taxonomy (GOV-027) without naming five intents until Page Blueprints. |
| **Pros** | A: clear nav grammar for web + Android; unblocks destination map. B: simpler masthead. C: less premature lock. |
| **Cons** | A: `prepare` scope ambiguous. B: loses prepare/configure clarity. C: GOV-075/nav stay blocked longer. |
| **Recommended Option** | **A** — adopt five intents; define `prepare` in destination map (REC-028), not by deleting the intent. |
| **Impact if delayed** | Bottom nav, Android nav, palette routing guess; duplicate nav risk returns. |
| **Required Before** | **P8** (nav / Master Spec). Blocks Implementation of primary nav. |

---

### GOV-097 — Masthead free-pin + honest More

| Field | Content |
|-------|---------|
| **Decision ID** | GOV-097 |
| **Current Proposal** | Bounded masthead **free-pin** beats forced sidebar taxonomy. Overflow = honest **More**. Do not hide essential capture behind personalization debt. Free-pin = nav primacy model (pairs with GOV-075). |
| **Alternatives** | **A)** Ratify free-pin primacy + require default pin set now (REC-027). **B)** Ratify free-pin law but defer defaults to onboarding sprint. **C)** Reject free-pin; fixed primary nav only. |
| **Pros** | A: ship-ready ownership model. B: law clear, defaults later. C: simpler for new users. |
| **Cons** | A: needs founder pin list. B: Known risk = free-pin chaos. C: contradicts Reasoning (“free-pin already locked”) and GOV-008. |
| **Recommended Option** | **A** — ratify free-pin; founder names 4–6 default pins in same session (or ASAP). |
| **Impact if delayed** | Masthead/sidebar thrash; Android/web diverge; onboarding broken. |
| **Required Before** | **P8**. Defaults: **Implementation** (onboarding) but **decide model now**. |

---

### GOV-099 — Command Palette / universal search first-class

| Field | Content |
|-------|---------|
| **Decision ID** | GOV-099 |
| **Current Proposal** | Command Palette / universal search are the **routing spine** for “one utterance, many tables” — not power-user Easter eggs. |
| **Alternatives** | **A)** First-class on desktop web + native (parity). **B)** Desktop-first spine; Android search lighter until later. **C)** Keep as power-user only until AI confidence bands (GOV-048) exist. |
| **Pros** | A: matches utterance vision. B: cost control. C: avoids privacy/scope mistakes. |
| **Cons** | A: Extreme cost; privacy surface. B: two-product feel risk (CF-IA-003). C: contradicts IA-9 text. |
| **Recommended Option** | **B** for v1 ship — desktop spine first; Android parity scheduled; privacy/action inventory via REC-030 before broad AI routing. |
| **Impact if delayed** | Capture/intent routing stays page-hunting; AI utterance path weak. |
| **Required Before** | Scope decision: **P8**. Full parity: **Can Wait** (post-desktop), but **do not** demote to Easter egg. |

---

## Potential Risks

| Domain | Risk |
|--------|------|
| **Architectural** | Graph IA (GOV-094) without named linking system (GOV-043) → dual graphs / fake edges. |
| **Architectural** | Native vs web IA divergence (CF-IA-003) while tokens still drift (GOV-073). |
| **UX** | Free-pin without defaults → new-user chaos; capture buried in More. |
| **UX** | Five intents without destination map → taxonomy creep returns. |
| **UX** | Everything-page dumps if GOV-098 not enforced in blueprint reviews. |
| **Engineering** | Command Palette as spine (Extreme) without action inventory → unbounded search surface. |
| **Engineering** | Entity intake without GOV-103 checklist → schema/UI primitives multiply. |
| **Product** | Notes/Journal/Documents mush (fails GOV-101) → GoodNotes/Notion identity death. |
| **Product** | Settings junk drawer (fails GOV-100) → daily actions misplaced. |
| **AI** | Palette/search as utterance router without confidence bands (GOV-048) → silent wrong routing. |
| **AI** | Graph edges inferred without correctable chips (GOV-035/051) → wrong life graph. |

---

## Recommended Ratification

### APPROVE WITH CHANGES

**Justification:** Extraction is clean — Approved GOVs (094, 096, 098, 100–103) should stand as citeable IA canon. Do **not** reject. Do **not** mint more GOV/REC in this pass.

**Required changes before calling this artifact “closed”:**

1. Decide **GOV-095** (recommend: keep five intents).  
2. Decide **GOV-097** (recommend: free-pin primacy + name default pins).  
3. Decide **GOV-099** ship scope (recommend: desktop-first spine, Android parity scheduled — not Easter egg).  
4. Confirm **CF-IA-001 / REC-032**: free-pin = answer to GOV-075 primacy model; destinations still via REC-028.  
5. Choose next P7 artifact (**REC-033**): Page Blueprints vs Naming Language.

Until 1–3 are marked, treat Needs Discussion items as **blocking for P8 navigation work**, not as rejected law.

---

## Founder sign-off (fill in)

| Field | Value |
|-------|-------|
| Decision | ☐ APPROVE · ☐ APPROVE WITH CHANGES · ☐ REJECT |
| Date | |
| Notes | |
| GOV-095 choice | A / B / C |
| GOV-097 choice | A / B / C |
| GOV-099 choice | A / B / C |
| Next artifact | Page Blueprints / Naming Language / Other: ___ |
