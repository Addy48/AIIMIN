---
authority: operations
derived_from: 02_Program_Charter · 05_Program_Roadmap · 04_Architecture_Principles
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-25
can_override_genesis: false
program: UX-Architecture-v1
phase: deliverable-spec
---

# 06 — Deliverable Specification

**Purpose of this file:** Define the **complete future document set** for UX Architecture v1.0.  
**Not architecture.** Does not decide surfaces, IA, journeys, or contracts.

**Numbering note:** Catalog owns filenames. Phase 2 binding docs are `08_` / `09_`. `07_` = Canonical UX Principles (constitutional product principles).

---

## Catalog (complete set)

| ID | File | Class | Exists? |
|----|------|-------|---------|
| D00 | `00_INDEX.md` | Governance | Yes |
| D01 | `01_Current_Status.md` | Governance | Yes |
| D02 | `02_Program_Charter.md` | Governance | Yes |
| D03 | `03_Validation_Checklist.md` | Governance | Yes |
| D04 | `04_Architecture_Principles.md` | Governance | Yes |
| D05 | `05_Program_Roadmap.md` | Governance | Yes |
| D06 | `06_Deliverable_Specification.md` | Governance | **This file** |
| D07 | `07_Canonical_UX_Principles.md` | Constitutional UX | Yes |
| D08 | `08_Canonical_Information_Architecture.md` | Architecture | Yes |
| D90 | `90_Architecture_Audit.md` | Founder audit | Yes |
| D91 | `91_Risk_Register.md` | Founder audit | Yes |
| D92 | `92_Audit_Traceability_Matrix.md` | Founder audit | Yes |
| D93 | `93_Freeze_Recommendation.md` | Founder audit | Yes |
| D09 | `09_Open_Decisions_Register.md` | Binding | No |
| D10 | `10_Evidence_Binding.md` | Binding | No |
| D11 | `11_Surface_Architecture.md` | Architecture | No |
| D12 | `12_Journey_Architecture.md` | Architecture | No |
| D13 | `13_State_Architecture.md` | Architecture | No |
| D14 | `14_Interaction_Architecture.md` | Architecture | No |
| D15 | `15_Cross_Surface_Contracts.md` | Architecture | No |
| D16 | `16_Terminology_and_Content_Structure.md` | Architecture | No |
| D20 | `20_Architecture_Decision_Register.md` | Traceability | No |
| D21 | `21_Traceability_Matrix.md` | Traceability | No |
| D30 | `30_Downstream_Handoff.md` | Handoff | No |
| D40 | `40_Validation_Report.md` | Gate | No |
| D41 | `41_Founder_Acceptance.md` | Gate | No |
| D50 | `50_FREEZE_CERTIFICATE.md` | Publication | No |
| D51 | `51_PUBLICATION_RECORD.md` | Publication | No |

**Out of set:** UI mocks · DS tokens · eng specs · code · Genesis edits · Intelligence edits.

---

## D00 — `00_INDEX.md`

| Field | Spec |
|-------|------|
| **Purpose** | Program entrypoint; artifact map; phase pointer |
| **Scope** | Links + status only; no architecture bodies |
| **Inputs** | All artifacts in this folder as they appear |
| **Outputs** | Navigable index of program deliverables |
| **Dependencies** | None (hub) |
| **Validation** | Every catalog ID that Exists=Yes is linked; stale links absent |
| **Freeze criteria** | Structure freezes at Phase 14 with published set; interim updates allowed |
| **Publication criteria** | Always published as living hub; final status = PUBLISHED at D51 |

---

## D01 — `01_Current_Status.md`

| Field | Spec |
|-------|------|
| **Purpose** | Living program status, open gates, next phase |
| **Scope** | Status facts; not architecture content |
| **Inputs** | Phase exits · Founder gates · D08 open decisions |
| **Outputs** | Current phase · gate table · stop/next |
| **Dependencies** | D00 · D05 |
| **Validation** | Matches actual folder + Intelligence-D05 Closed (D08) |
| **Freeze criteria** | Final snapshot frozen into D50/D51 narrative; file may archive as historical |
| **Publication criteria** | Updated through publication; final row = program COMPLETE |

---

## D02 — `02_Program_Charter.md`

| Field | Spec |
|-------|------|
| **Purpose** | Mission, in/out scope, citation law, governance |
| **Scope** | Program law for agents/Founder; not surface decisions |
| **Inputs** | Founder Approved · Genesis/P9 DH cite · Intelligence/Program 0 existence |
| **Outputs** | Charter contract |
| **Dependencies** | Phase 0 |
| **Validation** | Aligns with Principles; forbids invention/UI/eng |
| **Freeze criteria** | Frozen after Phase 0 (amend only by Founder ADR) |
| **Publication criteria** | Included in published pack as governance |

---

## D03 — `03_Validation_Checklist.md`

| Field | Spec |
|-------|------|
| **Purpose** | Reusable validation bars (init A/B; decision quality C; extend as needed) |
| **Scope** | Checklists only |
| **Inputs** | Charter · Principles · Roadmap gates |
| **Outputs** | Pass/fail criteria for phases |
| **Dependencies** | D02 · D04 · D05 |
| **Validation** | C1–C5 usable for architecture body turns |
| **Freeze criteria** | Checklist text freezes at Phase 12 start unless Founder amends |
| **Publication criteria** | Published with pack; results live in D40 |

---

## D04 — `04_Architecture_Principles.md`

| Field | Spec |
|-------|------|
| **Purpose** | P-UXA principles governing all architecture writing |
| **Scope** | Principles only; no feature architecture |
| **Inputs** | Genesis cite · Intelligence · P9 DH |
| **Outputs** | Principle set P-UXA-01… |
| **Dependencies** | Phase 0 |
| **Validation** | No principle invents product scope |
| **Freeze criteria** | Frozen after Phase 0 (Founder ADR to amend) |
| **Publication criteria** | Published with pack |

---

## D05 — `05_Program_Roadmap.md`

| Field | Spec |
|-------|------|
| **Purpose** | Phases 0–14 execution path through publication |
| **Scope** | Roadmap; not architecture bodies |
| **Inputs** | Charter · Principles · Intelligence exec · Program 0 |
| **Outputs** | Phase objectives, gates, metrics, exit criteria |
| **Dependencies** | Phase 0 |
| **Validation** | All charter in-scope topics mapped; out-of-scope excluded |
| **Freeze criteria** | Roadmap structure freeze after Founder amend window (FG-1); filename map defers to **this** D06 catalog |
| **Publication criteria** | Published with pack as process history |

---

## D06 — `06_Deliverable_Specification.md`

| Field | Spec |
|-------|------|
| **Purpose** | Define every document in the program set (this file) |
| **Scope** | Meta-specification of deliverables only |
| **Inputs** | D02 · D05 · D04 |
| **Outputs** | Complete catalog + per-artifact purpose/scope/inputs/outputs/deps/validation/freeze/publication |
| **Dependencies** | D05 |
| **Validation** | Catalog covers roadmap phases 0–14 outputs; no architecture content inside specs |
| **Freeze criteria** | Catalog freeze before Phase 3 bodies begin (Founder may add annex IDs only) |
| **Publication criteria** | Published with pack |

---

## D07 — `07_Canonical_UX_Principles.md`

| Field | Spec |
|-------|------|
| **Purpose** | Constitutional UX architecture principles (C-UX) derived only from Genesis · Program 0 · UX Intelligence |
| **Scope** | Product UX principles — not visual rules, not industry trends, not program process (see D04) |
| **Inputs** | Genesis P5–P9 cite · Program 0 readiness · UX Intelligence alignment/debt/inventories · D04 companion |
| **Outputs** | C-UX principle set with Purpose · Genesis · Evidence · Constraints · Validation · Failure cases |
| **Dependencies** | D02 · D04 · D06 |
| **Validation** | Every principle has Genesis + Program 0 and/or Intelligence evidence; no trend-only principles |
| **Freeze criteria** | Freeze before Phase 3 bodies (Founder ADR to amend) |
| **Publication criteria** | Published with pack |

---

## D08 — `08_Canonical_Information_Architecture.md`

| Field | Spec |
|-------|------|
| **Purpose** | Canonical information architecture (domains, nav, boundaries, cross-surface) |
| **Scope** | IA architecture only — not UI redesign; Intelligence-only evidence + Founder decisions |
| **Inputs** | UX Intelligence 01/02/04/09/11/12/14 · C-UX · Founder D05 |
| **Outputs** | Domains · ownership · nav hierarchy · entities · boundaries · cross-surface contracts · D05 score seat |
| **Dependencies** | D07 · Intelligence |
| **Validation** | No invented domains/hubs; `/m` ceiling held; D05 applied |
| **Freeze criteria** | After Founder review of IA; D05 closed in-doc |
| **Publication criteria** | Accepted pack |

**Note:** Supersedes earlier planned filename `11_Information_Architecture.md`.

---

## D09 — `09_Open_Decisions_Register.md`

| Field | Spec |
|-------|------|
| **Purpose** | Register Founder-open / parked / closed decisions |
| **Scope** | Decision IDs + options + status; **no** silent product invention |
| **Inputs** | Intelligence debt/alignment · Program 0 gaps · Charter · D07 · D08 (D05 closed there) |
| **Outputs** | Decision rows (Open / Parked / Closed) with citations |
| **Dependencies** | D06 · D07 · D08 · D10 (may co-author same phase) |
| **Validation** | 100% Intelligence S1 debt IDs accounted; Intelligence-D05 = Closed (per D08) |
| **Freeze criteria** | Register structure freezes; individual rows close only by Founder |
| **Publication criteria** | Published; Open/Parked rows must appear in D50 |

---

## D10 — `10_Evidence_Binding.md`

| Field | Spec |
|-------|------|
| **Purpose** | Citation rules + map from Architecture claims → Intelligence IDs → Genesis cites |
| **Scope** | Binding law for writers; not architecture conclusions |
| **Inputs** | UX Intelligence index · Genesis cite paths · Program 0 · P-UXA-02/05 · C-UX-16 |
| **Outputs** | Evidence binding protocol + ID legend |
| **Dependencies** | D04 · D06 · D07 · Intelligence read-only |
| **Validation** | States sole-evidence rule; forbids repo-invention against Intelligence |
| **Freeze criteria** | Binding rules freeze before remaining bodies (FG-2) |
| **Publication criteria** | Published with pack |

---

## D11 — `11_Surface_Architecture.md`

| Field | Spec |
|-------|------|
| **Purpose** | Canonical surface architecture (roles, platforms, ceilings, target classes) |
| **Scope** | Surfaces from Intelligence only; KEEP/REDESIGN/MERGE/REMOVE/FUTURE as **targets**, not UI redesign |
| **Inputs** | Intelligence `01_Surface_Inventory` · Program 0 surface report · P8/P9 ceilings cite · D08/D09/D10 · D07 |
| **Outputs** | Surface architecture tables + ceiling notes |
| **Dependencies** | D08 · D09 · D10 |
| **Validation** | 100% Intelligence surfaces traced; zero invented surfaces; no `/m/score` |
| **Freeze criteria** | Draft freeze after Founder review (FR-3) |
| **Publication criteria** | In pack if Founder-accepted |

---

## D12 — `12_Journey_Architecture.md`

| Field | Spec |
|-------|------|
| **Purpose** | Canonical journey structures for existing journeys |
| **Scope** | Express Intelligence journeys; mark weak/broken; no new journeys |
| **Inputs** | Intelligence `03_User_Journey_Inventory` · P9 Ph2 cite · Program 0 · D10/D11 |
| **Outputs** | Journey architecture map |
| **Dependencies** | D10 · D11 |
| **Validation** | Journey count coverage = Intelligence (24); no invention |
| **Freeze criteria** | After FR-5 |
| **Publication criteria** | Accepted pack |

---

## D13 — `13_State_Architecture.md`

| Field | Spec |
|-------|------|
| **Purpose** | Required UX states / kits at architecture level |
| **Scope** | State requirements from Intelligence; not visual empty-state design |
| **Inputs** | Intelligence `08_State_Inventory` · D07–D09 debts · P5/P8 cite · D10 · D12 |
| **Outputs** | State architecture + REQUIRED vs PARKED gaps |
| **Dependencies** | D10 · D12 |
| **Validation** | Missing Intelligence states classified; no invented state types without Genesis cite |
| **Freeze criteria** | After Founder OK (roadmap FR optional unless expansion) |
| **Publication criteria** | Accepted pack |

---

## D14 — `14_Interaction_Architecture.md`

| Field | Spec |
|-------|------|
| **Purpose** | Interaction architecture expressing P9; document interaction debt |
| **Scope** | Express-only under DH; no new Verbs/Flows as law |
| **Inputs** | Intelligence `07_Interaction_Inventory` · P9 Ph1–3 cite · D12 · D13 |
| **Outputs** | Interaction architecture + DH compliance notes |
| **Dependencies** | D12 · D13 · P9 DH |
| **Validation** | DH express-only; Intelligence interactions covered; Genesis+Intelligence cites |
| **Freeze criteria** | After FR-7 |
| **Publication criteria** | Accepted pack |

---

## D15 — `15_Cross_Surface_Contracts.md`

| Field | Spec |
|-------|------|
| **Purpose** | Contracts across desktop web · `/m` · native |
| **Scope** | Continuity + ceilings; not native UI redesign |
| **Inputs** | D10–D14 · Intelligence constraints · P9 Ph4 · product `/m` lock · D08 (Intelligence-D05) |
| **Outputs** | Three-client contract matrix |
| **Dependencies** | D10–D14 · D08 |
| **Validation** | Matrix complete; ceilings explicit; D05 status explicit |
| **Freeze criteria** | After FR-8; `/m/score` absent (D05 closed in D08) |
| **Publication criteria** | Accepted pack with annotations |

---

## D16 — `16_Terminology_and_Content_Structure.md`

| Field | Spec |
|-------|------|
| **Purpose** | Structural terminology map + content **roles** (not final copy) |
| **Scope** | Labels/roles/empty-error message architecture; no marketing rewrite |
| **Inputs** | Intelligence `09_Content` · Glossary cite · D11 · D01/D02/D07 debts |
| **Outputs** | Terminology ALIGN table + content structure requirements |
| **Dependencies** | D11 |
| **Validation** | Inconsistent pairs resolved or PARKED; no invented nouns |
| **Freeze criteria** | After FR-9 |
| **Publication criteria** | Accepted pack |

---

## D20 — `20_Architecture_Decision_Register.md`

| Field | Spec |
|-------|------|
| **Purpose** | Master architecture decisions (ADR-style) |
| **Scope** | Decisions only; each cites Genesis + Intelligence (+ Program 0 if needed) |
| **Inputs** | D10–D16 · D08 · Intelligence debt/opps · Program 0 |
| **Outputs** | Decision records (Accepted / Parked / Rejected) |
| **Dependencies** | D10–D16 drafts |
| **Validation** | Citation law 100%; Opportunities not auto-accepted |
| **Freeze criteria** | After FR-10 |
| **Publication criteria** | Core of published pack |

---

## D21 — `21_Traceability_Matrix.md`

| Field | Spec |
|-------|------|
| **Purpose** | Genesis ↔ Intelligence ↔ Architecture claim matrix |
| **Scope** | Traceability only |
| **Inputs** | Intelligence `14_Genesis_Alignment_Matrix` · D10–D20 · Program 0 gaps |
| **Outputs** | Master traceability table |
| **Dependencies** | D20 |
| **Validation** | Every architecture claim row has both Genesis and Intelligence refs |
| **Freeze criteria** | With D20 |
| **Publication criteria** | Core of published pack |

---

## D30 — `30_Downstream_Handoff.md`

| Field | Spec |
|-------|------|
| **Purpose** | Consumer contracts for DS · Motion · Eng · AI Arch · Implementation |
| **Scope** | Handoff obligations; no tokens/APIs/schemas-as-law |
| **Inputs** | D10–D21 · P9 Phase 5 DH · Program 0 parallel-ops |
| **Outputs** | Per-consumer must-respect checklists |
| **Dependencies** | D20 · D21 |
| **Validation** | DH forbidden patterns absent |
| **Freeze criteria** | After FR-11 |
| **Publication criteria** | Published for downstream start |

---

## D40 — `40_Validation_Report.md`

| Field | Spec |
|-------|------|
| **Purpose** | Full-program validation results |
| **Scope** | Evidence of PASS / PASS WITH PARKED / FAIL |
| **Inputs** | All deliverables · D03 · D05 metrics |
| **Outputs** | Validation report with metrics |
| **Dependencies** | D10–D30 complete as required |
| **Validation** | Self-consistent; lists parked IDs |
| **Freeze criteria** | Report frozen when Phase 13 begins |
| **Publication criteria** | Gate artifact; publish with pack |

---

## D41 — `41_Founder_Acceptance.md`

| Field | Spec |
|-------|------|
| **Purpose** | Record Founder verdict |
| **Scope** | ACCEPT / ACCEPT WITH PARKED / REJECT-AMEND only |
| **Inputs** | D40 · full draft pack · D08 |
| **Outputs** | Acceptance record |
| **Dependencies** | D40 PASS or PASS WITH PARKED |
| **Validation** | Explicit Founder statement present |
| **Freeze criteria** | Immutable once recorded (amend = new record) |
| **Publication criteria** | Required before D50 |

---

## D50 — `50_FREEZE_CERTIFICATE.md`

| Field | Spec |
|-------|------|
| **Purpose** | Certify frozen published file set |
| **Scope** | Certificate: file list · parked IDs · Genesis-clean · Intelligence-clean |
| **Inputs** | D41 ACCEPT* · validated pack |
| **Outputs** | Freeze certificate |
| **Dependencies** | D41 |
| **Validation** | Listed files match disk; attestations true |
| **Freeze criteria** | **This document enacts freeze** |
| **Publication criteria** | Issued at publication |

---

## D51 — `51_PUBLICATION_RECORD.md`

| Field | Spec |
|-------|------|
| **Purpose** | Declare UX Architecture v1.0 SoT for downstream |
| **Scope** | Publication metadata + consumer pointer |
| **Inputs** | D50 · Index/Home/Roadmap MOC/Current-Context updates |
| **Outputs** | Publication record |
| **Dependencies** | D50 |
| **Validation** | Vault pointers updated; status PUBLISHED |
| **Freeze criteria** | Record immutable; supersession needs Founder ADR + new version |
| **Publication criteria** | **This document completes publication** |

---

## Dependency order (documents)

```text
D00–D07 (governance + C-UX)
  → D08 Canonical IA
  → D09 · D10 (binding)
    → D11 Surface → D12 Journey → …
                → D20 → D21 → D30
                  → D40 → D41 → D50 → D51
```

---

## Forbidden deliverables (explicit)

Do **not** create under this program:

- Visual design files / mock sets as architecture law  
- Design System token sheets  
- Engineering API/schema docs as UX Architecture  
- Modified Genesis or UX Intelligence files  

---

**Stop:** Specification only. No architecture bodies written.
