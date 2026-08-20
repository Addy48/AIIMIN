# P8 — AIIMIN Master Product Specification

```yaml
document: P8 Master Product Specification
version: P8 v1.0
status: PUBLISHED
publication_date: 2026-07-23
publication_certificate: P8_v1.0_Publication_Certificate.md
governance_source: P7 Governance v1.0 (FROZEN)
governance_registry: AIIMIN GENESIS/P7 Governance/02_MASTER_DECISION_REGISTRY.json
date_started: 2026-07-22
last_freeze: 2026-07-23 — Subsystem Batch 7 (Ch 19–21)
constitutional_completion: 2026-07-23 — All 21 chapters FROZEN
publication_remediation: 2026-07-23 — ADR-P8-001 Resolved (pointer + FB registry)
certificate_batch_7: Batch_7_Freeze_Certificate.md
live_rules: 337
constitutional_chapters: 21
```

## Purpose

Canonical product architecture for AIIMIN. **Officially published P8 v1.0** (2026-07-23). Single constitutional source of truth for all future contributors. Certificate: `P8_v1.0_Publication_Certificate.md`. Every statement traces to frozen P7 governance (GOV-001…GOV-170). Recommendations (REC-*) are not canon unless founder-ratified.

Constitutional drafting program: **CLOSED**. Amendment requires Founder ADR only.

## Execution rule

- Draft **dependency batches**, not isolated chapters.
- Review at **subsystem** level.
- Freeze the **entire subsystem** together.
- Maintain the **P8 Architecture Ledger** (below) as master audit log.

---

## Table of contents

| # | Chapter | File | Status | Rules |
|---|---------|------|--------|-------|
| 01 | Product Identity | `01_Product_Identity.md` | **FROZEN v1.0** | P8-R-001…019 |
| 02 | Core Product Philosophy | `02_Core_Product_Philosophy.md` | **FROZEN v1.0** | P8-R-020…048 |
| 03 | Information Architecture | `03_Information_Architecture.md` | **FROZEN v1.0** | P8-R-050…064 |
| 04 | Navigation | `04_Navigation.md` | **FROZEN v1.0** | P8-R-065…079 |
| 05 | Core Objects & Data Model | `05_Core_Objects_and_Data_Model.md` | **FROZEN v1.0** | P8-R-080…093 |
| 06 | Capture System | `06_Capture_System.md` | **FROZEN v1.0** | P8-R-094…108 |
| 07 | AI Architecture | `07_AI_Architecture.md` | **FROZEN v1.0** | P8-R-109…123 |
| 08 | Surface Specifications | `08_Surface_Specifications.md` | **FROZEN v1.0** | P8-R-124…138 |
| 09 | Interaction System | `09_Interaction_System.md` | **FROZEN v1.0** | P8-R-139…150 |
| 10 | Component System | `10_Component_System.md` | **FROZEN v1.0** | P8-R-151…162 |
| 11 | Visual System | `11_Visual_System.md` | **FROZEN v1.0** | P8-R-163…174 |
| 12 | Motion System | `12_Motion_System.md` | **FROZEN v1.0** | P8-R-175…186 |
| 13 | Platform Specifications | `13_Platform_Specifications.md` | **FROZEN v1.0** | P8-R-187…201 |
| 14 | Offline & Synchronization | `14_Offline_and_Synchronization.md` | **FROZEN v1.0** | P8-R-202…214 |
| 15 | Privacy & Security | `15_Privacy_and_Security.md` | **FROZEN v1.0** | P8-R-215…233 |
| 16 | Notification System | `16_Notification_System.md` | **FROZEN v1.0** | P8-R-234…245, 247…251, 288 |
| 17 | Intelligence & Automation | `17_Intelligence_and_Automation.md` | **FROZEN v1.0** | P8-R-252…256, 258…269 |
| 18 | Personalization & Adaptation | `18_Personalization_and_Adaptation.md` | **FROZEN v1.0** | P8-R-270…277, 279, 281…285, 287 |
| 19 | Settings & Configuration | `19_Settings_and_Configuration.md` | **FROZEN v1.0** | P8-R-289…305, 340–341 |
| 20 | Onboarding & Identity Formation | `20_Onboarding_and_Identity_Formation.md` | **FROZEN v1.0** | P8-R-306…322 |
| 21 | Extensibility & Integrations | `21_Extensibility_and_Integrations.md` | **FROZEN v1.0** | P8-R-323…339, 342–343 |
| 22 | Accessibility | — | Pending | — |
| 23 | Error States & Recovery | — | Pending | — |
| 24 | Implementation Constraints | — | Pending | — |
| 25 | Future Expansion | — | Pending | — |

**Rule gap:** P8-R-049 reserved. Batch 6 retirements 246/257/278/280/286 unused. Batch 7 frozen with 289…339 + 340–343.

**TOC note:** Chapters 01–21 constitutional core **FROZEN**. Ch 22+ = post-constitution expansion tracks. Certificate: `Batch_7_Freeze_Certificate.md`.

---

# P8 Architecture Ledger

> Master audit log. Updated on each subsystem freeze.

## Frozen chapters

| Subsystem | Chapters | Frozen | Rules |
|-----------|----------|--------|-------|
| Identity & Philosophy | 01, 02 | 2026-07-22 | P8-R-001…048 |
| Information Model | 03, 04, 05 | 2026-07-22 | P8-R-050…093 |
| Operational Model | 06, 07, 08 | 2026-07-22 | P8-R-094…138 |
| Interaction Layer | 09, 10, 11, 12 | 2026-07-22 | P8-R-139…186 |
| **Continuity & Trust** | **13, 14, 15** | **2026-07-22** | **P8-R-187…233** |
| **Agency & Adaptation** | **16, 17, 18** | **2026-07-23** | **50 rules (gaps 246/257/278/280/286)** |

**Cumulative frozen rule surface:** P8-R-001…288 with reserved 049 and Batch 6 retirements 246/257/278/280/286 — **Batch 6 certificate:** `Batch_6_Freeze_Certificate.md`

**Open ADRs:** none (ADR-P8-001 **Resolved** — `ADR-P8-001.md`)

**Open Founder Decision Blocks:** FB-P8-001, 002, 004, 005, 006, 007–017, 018–027 (26 open; FB-003 merged into FB-018)

---

## Subsystem Batch 4 — Interaction Layer (FROZEN v1.0)

**Research Layer:** REFERENCED (not copied into chapters)

| ID | Document | Role | Status |
|----|----------|------|--------|
| RL-001 | `P8 Research/Interaction_Layer_Pre-Design_Study.md` | Comparative research, anti-patterns | REFERENCED |
| RL-002 | `P8 Research/Interaction_Language.md` | Exhale Interaction vocabulary, laws, state machine | REFERENCED |
| RL-003 | `P8 Research/Interaction_Grammar.md` | Composition, rhythm, universal patterns | REFERENCED |
| RL-004 | `P8 Research/Interaction_Decision_Matrix.md` | Tie-breaker when principles conflict | REFERENCED |

Chapters 09–12 codify research — they do not duplicate it. Research remains subordinate to P7 and frozen P8 Ch 01–08.

### Subsystem question

| Layer | Chapter | Answers |
|-------|---------|---------|
| Behavior | 09 — Interaction | What interaction truths MUST hold (Exhale Interaction) |
| Structure | 10 — Component | What families implement interaction law |
| Appearance | 11 — Visual | What visual semantics MUST hold (tone, truth) |
| Movement | 12 — Motion | How state may animate after truth |

### Dependency chain (normative)

```text
Chapter 09 — Interaction System
        ↓
Chapter 10 — Component System
        ↓
Chapter 11 — Visual System
        ↓
Chapter 12 — Motion System
```

### Interaction Layer — Architecture Ledger

| Field | Value |
|-------|-------|
| **Owned concepts** | Exhale Interaction model; state machine; contracts; invariants; laws; outcomes; grammar refs; component families; mandatory states; semantic tokens; tone/density; motion laws; Catch latency guarantee |
| **Research inputs** | RL-001…RL-004 REFERENCED (subordinate to P7 + frozen P8) |
| **Upstream dependencies** | Ch 01–02 Identity/Philosophy; Ch 06 Capture; Ch 07 AI; Ch 08 Surfaces; Ch 04 Navigation (cross-ref only) |
| **Downstream dependencies** | Ch 13+ Platform Specifications; client design systems |
| **Frozen interfaces** | Ch 01–08 unchanged; Batch 4 references Catch sacred, AI correction, surface jobs without redefinition |
| **Related chapters** | 09, 10, 11, 12 |
| **Batch 4 unique GOV IDs (§5)** | 66 |
| **Batch 4 rules** | 48 (P8-R-139…186) |
| **Founder Decision Blocks (new)** | 0 |

### Ownership map

| Concept | Owner | Cross-ref |
|---------|-------|-----------|
| Interaction model, state machine, grammar, Anchor/Pulse/Chip/Settle/Hold/Knock/Veil | Ch 09 | RL-002, RL-003, RL-004; Ch 06–08 |
| Component families, contracts, states, composition, a11y contracts | Ch 10 | Ch 09 nouns |
| Tone-to-density, truth-state visuals, semantic tokens, typography roles | Ch 11 | Palette.md values; Ch 09 tones |
| Motion laws, timing bands, after-Settle guarantee, reduced motion | Ch 12 | Ch 09 states; Ch 11 layering |

### Final Constitutional Audit (2026-07-22 freeze)

| # | Audit | Result |
|---|-------|--------|
| 01 | Platform independence | PASS |
| 02 | Testability | PASS |
| 03 | Vocabulary | PASS |
| 04 | Derivability | PASS |
| 05 | Engineering determinism | PASS |
| 06 | Rule quality P8-R-139…186 | PASS |
| 07 | Ownership | PASS |
| 08 | Research alignment | PASS |
| 09 | Implementation leakage | PASS |
| 10 | Frozen Ch 01–08 compatibility | PASS |
| Founder blocks (new) | 0 | — |
| Ch 01–12 consistency | PASS | see Ch 12 §10 |

*Batch 4 is **FROZEN v1.0**.*

---

## Subsystem Batch 5 — Continuity & Trust (FROZEN v1.0)

### Subsystem question

| Layer | Chapter | Answers |
|-------|---------|---------|
| Environment | 13 — Platform | What must remain true across every execution environment |
| Continuity | 14 — Offline & Sync | What continuity, durability, and life-graph preservation must guarantee |
| Trust | 15 — Privacy & Security | What ownership, authority, and dignity obligations endure |

### Dependency chain (normative)

```text
Chapter 13 — Platform Specifications
        ↓
Chapter 14 — Offline & Synchronization
        ↓
Chapter 15 — Privacy & Security
```

### Ownership map

| Concept | Owner | Cross-ref |
|---------|-------|-----------|
| Execution environment, modality, ceiling, continuability, admission | Ch 13 | GOV-153…161 abstracted; life entity meaning from Ch 05 |
| Continuity guarantees, durability honesty, one personal life graph | Ch 14 | Ch 05 `P8-R-080`/`081`; GOV-089; FB-015…017 for mechanisms |
| Ownership, authn/authz, confidentiality, portability, non-regression | Ch 15 | Ch 05 life entities; GOV-011/014/016/058/070 |

### Freeze status

| Field | Value |
|-------|-------|
| **Rules** | 47 (P8-R-187…233) |
| **Version** | FROZEN v1.0 |
| **Founder Decision Blocks** | FB-P8-013…020 (open — intentional) |
| **Freeze date** | 2026-07-22 |
| **Certificate** | Batch 5 Freeze Certificate |

*Batch 5 is **FROZEN v1.0**. Amendment requires Founder ADR.*

---

## Subsystem Batch 6 — Agency & Adaptation (FROZEN v1.0)

### Subsystem question

| Layer | Chapter | Answers |
|-------|---------|---------|
| Attention | 16 — Notification System | What interruption and notice law must hold |
| Agency | 17 — Intelligence & Automation | What automation and human-authority law must hold |
| Fit | 18 — Personalization & Adaptation | What personalization and adaptation law must hold |

### Dependency chain (normative)

```text
Chapter 16 — Notification System
        ↓
Chapter 17 — Intelligence & Automation
        ↓
Chapter 18 — Personalization & Adaptation
```

### Ownership map

| Concept | Owner | Cross-ref |
|---------|-------|-----------|
| Interruption worthiness, urgency, digest, escalation, dismiss, persistence, mute precedence | Ch 16 | GOV-064 ND → FB-P8-021/022; Knock grammar Ch 09 |
| Suggestion vs action, delegation, autonomy, restraint | Ch 17 | Roles/confidence Ch 07; authz `P8-R-230` Ch 15; FB-P8-023 |
| Preference sovereignty, non-destructive adaptation, anti-manipulation fit | Ch 18 | Identity Ch 01; FB-P8-024; Settings Ch 19 FROZEN |

### Freeze status

| Field | Value |
|-------|-------|
| **Rules** | 50 |
| **Version** | FROZEN v1.0 |
| **Founder Decision Blocks** | FB-P8-019, 021…024 (open — intentional, bound) |
| **Retired IDs** | P8-R-246, 257, 278, 280, 286 |
| **Freeze date** | 2026-07-23 |
| **Certificate** | `Batch_6_Freeze_Certificate.md` |
| **Ratification** | PASS · integrity 91 · readiness 92 |

*Batch 6 is **FROZEN v1.0**. Amendment requires Founder ADR.*

---

## Subsystem Batch 7 — Continuity of Control (FROZEN v1.0)

### Subsystem question

| Layer | Chapter | Answers |
|-------|---------|---------|
| Configuration | 19 — Settings & Configuration | What configuration law must hold |
| Formation | 20 — Onboarding & Identity Formation | What first-run formation law must hold |
| Extension | 21 — Extensibility & Integrations | What external-capability law must hold |

### Dependency chain (normative)

```text
Chapter 19 — Settings & Configuration
        ↓
Chapter 20 — Onboarding & Identity Formation
        ↓
Chapter 21 — Extensibility & Integrations
```

### Ownership map

| Concept | Owner | Cross-ref |
|---------|-------|-----------|
| Configuration ownership, config-source precedence (no Ch18 amend), non-person mutation limits, reset≠delete, invalid fail-closed | Ch 19 | Preference Ch 18; FB-P8-025 |
| First-run, consent-in-formation, identity continuity, re-onboarding | Ch 20 | Ownership Ch 15; identity Ch 01; FB-P8-026 |
| External guest posture, non-ownership of Capture/Connect/Coach, permission/revocation, post-revocation honesty, isolation, one graph; subordination Ch15–20 | Ch 21 | Privacy Ch 15; admission spirit Ch 13; FB-P8-027 |

### Freeze status

| Field | Value |
|-------|-------|
| **Rules** | 55 (Ch19: 19 · Ch20: 17 · Ch21: 19; `P8-R-289`…`343` with 340–343) |
| **Version** | P8 v1.0 |
| **Founder Decision Blocks (bound open)** | FB-P8-025…027 |
| **Freeze date** | 2026-07-23 |
| **Certificate** | `Batch_7_Freeze_Certificate.md` |
| **Freeze** | **FROZEN** |

*Batch 7 is **FROZEN**. P8 constitutional drafting (Ch 01–21) is **COMPLETE**.*

---

## Subsystem Batch 3 — Operational Model

### Subsystem question

| Layer | Chapter | Answers |
|-------|---------|---------|
| Ingress | 06 — Capture | How information enters |
| Intelligence | 07 — AI | How AI reasons |
| Interaction locus | 08 — Surfaces | Where users interact |

### Dependency chain (normative)

```text
Chapter 06 — Capture System
        ↓
Chapter 07 — AI Architecture
        ↓
Chapter 08 — Surface Specifications
```

### Ownership map

| Concept | Owner | Cross-ref |
|---------|-------|-----------|
| Universal capture, pipeline, ingestion, lifecycle | Ch 06 | All ingress → canonical pipeline |
| AI roles, orchestration, confidence, memory, safety | Ch 07 | Post-raw-save; model-independent |
| Surface one-job + I/O contracts (9 surfaces) | Ch 08 | UI-technology independent |

### Architecture review (2026-07-22 freeze)

| Audit | Result |
|-------|--------|
| Capture universal | PASS |
| AI mixed-initiative / non-authoritative | PASS |
| Surface one-job + I/O | PASS |
| Boundaries (06/07/08) | PASS |
| Rules 094–138 | PASS |
| GOV traceability | PASS |
| Terminology | PASS |
| Founder blocks (new) | 0 |
| Implementation leakage | PASS |
| Surface UI independence | PASS |
| AI model independence | PASS |

---

## Subsystem Batch 2 — Information Model

### Dependency chain (normative)

```text
Chapter 05 — Core Objects & Data Model
        ↓
Chapter 03 — Information Architecture
        ↓
Chapter 04 — Navigation
```

### Ownership map

| Concept | Owner | Cross-ref |
|---------|-------|-----------|
| Life entity, edges, intake contract | Ch 05 | Ch 03, Ch 04 reference |
| Graph topology, layers, intents | Ch 03 | Ch 05 for entity binding |
| Routes, shells, deep links | Ch 04 | Ch 03 regions |

### Global terminology (frozen source: Ch 01 §6)

| Term | Owner | Notes |
|------|-------|-------|
| Life entity | Ch 01 → Ch 05 | Not redefined downstream |
| Primitive | Ch 01 → Ch 05 | One write owner per concept |
| Connected graph | Ch 01 → Ch 05/03 | IA topology vs object edges |
| Today | Ch 01 → Ch 04 / Ch 08 | Route: FB-P8-001; surface job: Ch 08 |
| Human Momentum | Ch 01 | Philosophy in Ch 02 |

---

## Open Founder Decision Blocks

> Single source of truth. **Canonical home** = sole constitutional owner. Mirrors allowed; duplicate ownership forbidden. ADR-P8-001.

| ID | Canonical home | Mirrors | Issue | Status |
|----|----------------|---------|-------|--------|
| FB-P8-001 | 04 | 01 | Today route canonical name | Pending |
| FB-P8-002 | 02 | 01 | Success metric measurement rigor | Pending |
| FB-P8-003 | — | 01 (stub) | **Merged into FB-P8-018** — do not resolve separately | Merged |
| FB-P8-004 | 02 | 01 | Connected graph vs optional domains | Pending |
| FB-P8-005 | 01 | — | Life Score formula / XP roles | Pending |
| FB-P8-006 | 02 | — | Sparring vs shame tone bounds | Pending |
| FB-P8-007 | 05 | — | Named linking system | Pending |
| FB-P8-008 | 05 | — | Entity ID / lifecycle state model | Pending |
| FB-P8-009 | 05 | 03 | Knowledge region vs entity separation | Pending |
| FB-P8-010 | 03 | — | Intent → destination map | Pending |
| FB-P8-011 | 04 | — | Phone shell primacy (fixed vs free-pin) | Pending |
| FB-P8-012 | 04 | — | Command palette scope | Pending |
| FB-P8-013 | 13 | — | Full vs companion vs capture-limited capability matrices (incl. desktop/tablet companions) | Pending |
| FB-P8-014 | 13 | — | Cross-client token/blueprint SoT arbitration order | Pending |
| FB-P8-015 | 14 | — | Offline authority under conflict when user unavailable | Pending |
| FB-P8-016 | 14 | — | Consistency model per entity class | Pending |
| FB-P8-017 | 14 | — | Conflict merge strategy | Pending |
| FB-P8-018 | 15 | 01 (ex-003) | Anonymized aggregates under lifelog non-commerce (absorbs FB-003) | Pending |
| FB-P8-019 | 15 | 17 (cite) | AI execution boundary for private data | Pending |
| FB-P8-020 | 15 | — | Export format / delete cascade completeness definition | Pending |
| FB-P8-021 | 16 | — | Attention-worthiness bar / notification taxonomy (channels, urgency, mute) | Pending |
| FB-P8-022 | 16 | — | Escalation ladder thresholds | Pending |
| FB-P8-023 | 17 | — | Standing-delegation automation classes (no per-act approval) | Pending |
| FB-P8-024 | 18 | — | Adaptation stability windows / material-change disclosure | Pending |
| FB-P8-025 | 19 | — | Immutable vs mutable configuration class list | Pending |
| FB-P8-026 | 20 | — | Minimum onboarding completion criteria | Pending |
| FB-P8-027 | 21 | — | Extension / integration capability class taxonomy | Pending |

**Inventory count:** 27 IDs listed (001–027). **Open Pending:** 26. **Merged:** 1 (003→018).

*Batch 5 freeze retains FB-P8-013…020 as open intentional architecture questions.*  
*Batch 6 freeze retains FB-P8-019, 021…024 as open intentional architecture questions (bound).*  
*Batch 7 freeze adds FB-P8-025…027 — open; obligations bound in frozen rules.*  
*2026-07-23 publication remediation: registry completed; FB homes canonicalized (ADR-P8-001).*

---

## Founder ADRs

| ADR | Reason | Status |
|-----|--------|--------|
| **ADR-P8-001** | Complete chapter-pointer migration ledger (pre-renumber → final map) for Ch 01/02/15; FB canonicalization 001/002/004 homes + 003→018. File: `ADR-P8-001.md`. Doctrine unchanged. | **Resolved** (2026-07-23) |

---

## Cross-chapter dependencies (frozen)

```text
Ch 01 ─┬─► Ch 02
       ├─► Ch 05 ─► Ch 03 ─► Ch 04
       ├─► Ch 06 ─► Ch 07 ─► Ch 08
       ├─► Ch 09 ─► Ch 10 ─► Ch 11 ─► Ch 12 (FROZEN)
       ├─► Ch 13 ─► Ch 14 ─► Ch 15 (FROZEN)
       ├─► Ch 16 ─► Ch 17 ─► Ch 18 (FROZEN Batch 6)
       └─► Ch 19 ─► Ch 20 ─► Ch 21 (FROZEN Batch 7)
```

**P8 constitutional drafting (Ch 01–21): COMPLETE.**

---

## Chapter format (mandatory)

Every chapter contains, in order:

1. Purpose
2. Scope
3. Canonical Model
4. Canonical Rules (numbered `P8-R-###`)
5. Referenced GOV IDs
6. Dependencies
7. Edge Cases
8. Founder Decision Blocks (only when governance is incomplete)
9. Acceptance Criteria

---

## Law

- P7 Governance v1.0 is READ ONLY.
- Do not reinterpret, improve, or invent governance.
- Prefer omission over invention.
- Flag conflicts explicitly; do not silently resolve.
- Frozen chapters are immutable; contradictions require Founder ADR.
