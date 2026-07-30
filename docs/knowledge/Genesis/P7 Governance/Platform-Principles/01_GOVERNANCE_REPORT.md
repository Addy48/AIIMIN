# 01 — Platform Principles Governance Report

```yaml
document: Platform Principles Governance Report
phase: P7
standard: AIIMIN GENESIS/P7 Governance/00_GOVERNANCE_STANDARD.md
standard_version: 1.0
source: AIIMIN GENESIS/P5 Constitution/17_FUTURE_GROWTH_RULES.md
source_alias: 11_PLATFORM_PRINCIPLES.md → 17_FUTURE_GROWTH_RULES.md (P5 11_ is Accessibility Principles)
source_adjacent: Device-Tiers.md (living); P3 12_PLATFORM_CONTINUITY.md (audit)
governance_date: 2026-07-22
gov_ids_new: GOV-153…GOV-161
gov_ids_referenced: GOV-001…GOV-152 (prior; not re-minted)
```

> Machine-readable twin: `02_GOVERNANCE_DECISIONS.json` · Index: `03_GOVERNANCE_INDEX.md` · Standard: `../00_GOVERNANCE_STANDARD.md`


**ID allocation:** Component Principles already owns GOV-142…152 / REC-062…068. This pass appends **GOV-153…161** / **REC-070…076**.

**Filename note:** Requested `11_PLATFORM_PRINCIPLES.md` does not exist. P5 `11_` = Accessibility Principles. Governed frozen Discovery **`17_FUTURE_GROWTH_RULES.md`** (platform laws). Living `Device-Tiers.md` and P3 `12_PLATFORM_CONTINUITY.md` cross-referenced only — **not redesigned**. Source **not modified**. Prior trios and Governance Standard **not modified**.

---

## 1. Artifact Overview

| Field | Value |
|-------|-------|
| Source | P5 `17_FUTURE_GROWTH_RULES.md` |
| Structure | Growth axiom · Platform rules (desktop→AR) · Design evolution · Expansion gate |
| New canonical GOV | GOV-153…GOV-161 (9) |
| Existing GOV referenced | 31 unique (no re-mint) |
| Recommendations | REC-070…REC-076 (7) — not canon |
| Conflicts flagged | CF-PL-001…CF-PL-006 |
| Needs Discussion | GOV-154, GOV-160 |
| Governance score | **81 / 100** |

**Separation law:** Canonical Decisions ≠ Governance Recommendations.

### Existing GOV references (duplicates — do not re-mint)

| Platform item | Existing GOV | Note |
|---------------|--------------|------|
| OS shared primitives across surfaces | GOV-001, GOV-020, GOV-040 | Growth axiom builds on Life OS + shared primitives |
| Phone web `/m` capture-only | GOV-013, GOV-041 | Future Growth phone web — reuse |
| Native rich companion ≠ `/m`; Capacitor not primary | GOV-085, GOV-092 | Native section + anti bait-and-switch |
| Native outbox / sync honesty | GOV-089 | Reuse |
| Cross-client tokens / native extension | GOV-073, GOV-110 | Arbitration elevated in GOV-160; GOV-073 still ND |
| Article supremacy; no per-device Constitution forks | GOV-025 | Evolution rule 2 |
| Kill List on new modalities | GOV-074 | Evolution rule 4 |
| Voice = Palette intent router | GOV-099, GOV-047, GOV-136 | Elevates modality in GOV-157 |
| Infer-then-chip | GOV-126, GOV-035, GOV-051 | Wearables |
| Notifications deserve attention | GOV-064 | Speech nags — GOV-064 still ND |
| Clinical / auto-post / invented money / safety / auth-billing | GOV-050, GOV-006, GOV-078, GOV-082, GOV-070, GOV-140 | Future AI + wearable refuse |
| Future AI roles / bands / coaching window | GOV-138, GOV-137, GOV-141 | Future Growth Future AI — reuse |
| Platform vernacular / device gestures | GOV-118, GOV-134 | Already allow platform-native under shared identity |
| Entity IA contract includes ceiling | GOV-103 | Aligns with GOV-153 declarations |

### Extract coverage map

| Extract topic | Treatment |
|---------------|-----------|
| Growth axiom + four declarations | GOV-153 |
| Desktop / tablet ceilings | GOV-154 (ND — breakpoint companion) |
| Phone web `/m` | Reuse GOV-013/041 |
| Native mobile | Reuse GOV-085/089/092 |
| Watch | GOV-155 |
| Car | GOV-156 |
| Voice | GOV-157 |
| Wearables / passive | GOV-158 |
| AR | GOV-159 |
| Future AI on new platforms | Reuse GOV-138/137/050/078/082/140/141 |
| Design system evolution / arbitration | GOV-160 (ND × GOV-073) |
| Expansion decision gate | GOV-161 |
| Biometrics detail | Missing M-PL-005 — one source line only |
| Account capability matrix | Missing M-PL-003 — Continuity wish, not Future Growth |

---

## 2. CANONICAL DECISIONS

### GOV-153 — Growth axiom — identity invariant; modality variable; ceiling intentional

| Field | Value |
|-------|-------|
| Category | Platform — Growth Axiom |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | High |
| Canon Class | canonical |

**Decision:** Identity is invariant. Modality is variable. Ceiling is intentional. Every new surface must declare: (1) Constitutional articles upheld, (2) capture vs command vs review ceiling, (3) component contracts reused, (4) surface-specific never-dos.

**Reason:** Future Growth opening law. Prevents brand-internal fragmentation.

**Evidence:**

- **Sections:** Growth axiom
  - **Quote:** Identity is invariant. Modality is variable. Ceiling is intentional.
- **Sections:** Growth axiom
  - **Quote:** Every new surface must declare: 1. Which Constitutional articles it upholds. 2. Its capture vs command vs review ceiling. 3. Which component contracts it reuses. 4. What it will never do (surface-specific non-negotiables).

**Depends On:** `GOV-001`, `GOV-020`, `GOV-025`, `GOV-040`, `GOV-103`

**Blocks:** New Surface Intake, Watch Spec, Car Spec, Wearables Spec, AR Spec, Voice Surface Spec

**Referenced By:** P8, P9, Android Build, Desktop, Website, Design System, AI

**Implementation Impact:** Surface proposals missing four declarations fail intake. Pair with GOV-161.

### GOV-154 — Desktop and tablet shipped ceilings — full OS; tablet TabRail-class; no hover-only essentials

| Field | Value |
|-------|-------|
| Category | Platform — Shipped Tiers |
| Status | Needs Discussion |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | High |
| Canon Class | canonical |

**Decision:** Desktop (web ≥1100 / large windows) = full Life OS command surface (Palette/keyboard; density OK; calm review available; no hover-only essentials). Tablet (768–1099 class) = full OS with TabRail-class navigation and touch/density balance — not blown-up phone capture shell, not cramped desktop.

**Reason:** Future Growth Desktop + Tablet rules. Complements `/m` + native already governed.

**Evidence:**

- **Sections:** Platform rules — Desktop
  - **Quote:** Full Life OS command surface. … Do not assume hover-only essential actions.
- **Sections:** Platform rules — Tablet
  - **Quote:** Full OS with TabRail-class navigation. … Not a blown-up phone capture shell; not a cramped desktop.

**Depends On:** `GOV-001`, `GOV-013`, `GOV-040`, `GOV-085`, `GOV-153`

**Blocks:** Desktop Layout Spec, Tablet Nav Spec, Responsive QA, Device-Tiers Companion

**Referenced By:** P8, Desktop, Website, Design System, Android Build

**Implementation Impact:** Founder confirm breakpoint classes as companion to living Device-Tiers — **no redesign** (REC-073).

### GOV-155 — Watch ceiling — pulses and glances only; no multi-step finance; phone handoff for high stakes

| Field | Value |
|-------|-------|
| Category | Platform — Watch |
| Status | Approved |
| Priority | P1 |
| Confidence | High |
| Implementation Cost | High |
| Canon Class | canonical |

**Decision:** Watch = pulses/glances only (toggle, quick log, timer, score glance). No multi-step finance forms. Complications show truth not vanity. Prefer phone handoff for high stakes.

**Depends On:** `GOV-153`, `GOV-015`, `GOV-046`, `GOV-082`

**Blocks:** Watch Spec, Watch Complications, Wear OS Intake

**Referenced By:** P8, P9, Android Build, Design System

**Evidence:** Platform rules — Watch (full paragraph quote in JSON).

**Implementation Impact:** Reject full-OS-on-watch. Finance on watch = quick utterance or handoff.

### GOV-156 — Car ceiling — eyes-free / glance-safe; safety over completeness

| Field | Value |
|-------|-------|
| Category | Platform — Car |
| Status | Approved |
| Priority | P1 |
| Confidence | High |
| Implementation Cost | High |
| Canon Class | canonical |

**Decision:** Car = eyes-free/glance-safe (voice, read-backs, next calendar). No dense dashboards while driving. Safety > completeness; delay complex review until parked (OS rules first).

**Depends On:** `GOV-153`, `GOV-157`, `GOV-033`

**Blocks:** Car Spec, Android Auto / CarPlay Intake

**Referenced By:** P8, P9, Android Build, AI

**Evidence:** Platform rules — Car.

**Implementation Impact:** Driving mode forbids dense review UI.

### GOV-157 — Voice modality — Palette intent-router philosophy; correction path; coaching sparingly

| Field | Value |
|-------|-------|
| Category | Platform — Voice |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | High |
| Canon Class | canonical |

**Decision:** Voice uses same intent-router philosophy as Command Palette. Typed/visual correction when screen exists. Coaching sparingly; never clinical. Speech notifications must deserve attention.

**Depends On:** `GOV-099`, `GOV-047`, `GOV-136`, `GOV-050`, `GOV-064`, `GOV-126`, `GOV-153`

**Blocks:** Voice Capture Spec, STT UX, Speech Notification Taxonomy

**Referenced By:** P8, AI, Android Build, Desktop, Design System

**Evidence:** Platform rules — Voice.

**Implementation Impact:** Voice features declare Router role (GOV-138). No voice-only correction when screen available.

### GOV-158 — Wearables / passive sensing — opt-in; on-device preference; no silent clinical; not fitness-app takeover

| Field | Value |
|-------|-------|
| Category | Platform — Wearables |
| Status | Approved |
| Priority | P1 |
| Confidence | High |
| Implementation Cost | Extreme |
| Canon Class | canonical |

**Decision:** Wearables/passive = opt-in only; on-device preference; infer-then-chip; never silent clinical labeling; health data is Life OS context — not fitness-app identity takeover.

**Depends On:** `GOV-153`, `GOV-126`, `GOV-050`, `GOV-006`, `GOV-070`, `GOV-058`

**Blocks:** Wearables Spec, HealthKit/Health Connect Intake, Passive Sensing Pipeline

**Referenced By:** P8, P9, Android Build, AI, Backend

**Evidence:** Platform rules — Wearables / passive sensing.

**Implementation Impact:** Opt-in gate before sensors. Chip correction on inferences. No silent diagnosis labels.

### GOV-159 — AR ceiling — capture/memory overlays only; not social AR; no AR-inferred medical

| Field | Value |
|-------|-------|
| Category | Platform — AR |
| Status | Approved |
| Priority | P2 |
| Confidence | High |
| Implementation Cost | Extreme |
| Canon Class | canonical |

**Decision:** AR = capture/memory overlays only — not social AR network. Minimal chrome. Subtle identity tokens — not neon mesh. High-stakes family/medical never AR-inferred.

**Depends On:** `GOV-153`, `GOV-005`, `GOV-010`, `GOV-050`, `GOV-070`

**Blocks:** AR Spec, AR Prototype Gate

**Referenced By:** P8, P9, Design System, AI

**Evidence:** Platform rules — AR.

**Implementation Impact:** Reject social/feed AR. Anti-look bans still bind.

### GOV-160 — Multi-device design evolution — extend tokens by role; no per-device Constitution forks; Constitution arbitrates drift

| Field | Value |
|-------|-------|
| Category | Platform — Design Evolution |
| Status | Needs Discussion |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Extreme |
| Canon Class | canonical |

**Decision:** Extend tokens by role, not trend palette. Add modality blueprints; do not fork Constitutions per device. Prefer responsive contracts over separate product lines unless founder creates a new product. Kill List applies to new modalities. Marketing may innovate within anti-look bans; OS stays restrained. When two clients disagree, tokens + blueprints + Constitution arbitrate — not whichever shipped last.

**Depends On:** `GOV-025`, `GOV-073`, `GOV-074`, `GOV-110`, `GOV-037`, `GOV-153`

**Blocks:** Token SoT, Modality Blueprints, Cross-Client Drift Audit

**Referenced By:** P8, Design System, Android Build, Desktop, Website

**Evidence:** Design system evolution rules (extend tokens; modality blueprints; arbitration quote).

**Implementation Impact:** Align with GOV-073 / REC-020 (REC-074). Three monorepo clients remain intentional under shared Constitution.

### GOV-161 — Expansion decision gate — five questions before new platform surface; fail stays Design Lab

| Field | Value |
|-------|-------|
| Category | Platform — Expansion Gate |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** Before new platform surface, answer five questions (modality-unique human problem; blueprint roles; out-of-ceiling; trust preservation; ten-year truth vs gadget demo). Gate fail → Design Lab only; do not ship identity risk.

**Depends On:** `GOV-153`, `GOV-023`, `GOV-014`, `GOV-015`, `GOV-093`

**Blocks:** New Surface Intake, Watch Spec, Car Spec, AR Spec, Wearables Spec

**Referenced By:** P8, P9, Feature Intake, Design Lab

**Evidence:** Expansion decision gate (questions + fail path).

**Implementation Impact:** Gate sits beside GOV-093 eight-gate and GOV-153 declarations.

---

## 3. GOVERNANCE RECOMMENDATIONS (NOT CANON)

### REC-070 — Ratify Approved Platform GOVs (153, 155–159, 161)

Citeable platform canon for surface PRs.

### REC-071 — Confirm source alias: 11_PLATFORM_PRINCIPLES → 17_FUTURE_GROWTH_RULES

Lock alias; P5 `11_` remains Accessibility.

### REC-072 — Publish surface declaration checklist (GOV-153 + GOV-161)

One intake checklist for new modalities.

### REC-073 — Confirm desktop/tablet breakpoint classes as Device-Tiers companion (no redesign)

Closes GOV-154 ND without rewriting architecture.

### REC-074 — Align GOV-160 arbitration with GOV-073 / REC-020 token SoT

Named SoT + arbitration order.

### REC-075 — Add Platform QA gates

Declaration, ceilings, modality refuses, expansion gate.

### REC-076 — Next P7: 11_ACCESSIBILITY_PRINCIPLES or 07_AUTOMATION_RULES or 13_NAMING_LANGUAGE

Do not confuse Accessibility `11_` with this platform alias.

---

## 4. Conflicts

| ID | Type | Detail | Action |
|----|------|--------|--------|
| CF-PL-001 | Source alias | No `11_PLATFORM_PRINCIPLES.md` | REC-071 |
| CF-PL-002 | Complementary ND | GOV-154 breakpoints × Device-Tiers | REC-073 |
| CF-PL-003 | Complementary ND | GOV-160 × GOV-073 token SoT | REC-074 |
| CF-PL-004 | Audit vs law | Continuity “not yet one ecosystem” vs Growth passport | Continuity = evidence only |
| CF-PL-005 | Known risk | Native envy vs `/m` | Reuse GOV-013/041/085 |
| CF-PL-006 | Tone/safety | Voice coach × clinical × speech nags | REC-017 / REC-060 |

---

## 5. Missing Decisions

| ID | Missing | Next |
|----|---------|------|
| M-PL-001 | iOS native declaration | GOV-153/150 when opened |
| M-PL-002 | Desktop installer detail | GOV-154 + GOV-161 |
| M-PL-003 | Account capability matrix | Not in Future Growth — do not invent |
| M-PL-004 | Blueprint role transfer map | Govern Page Blueprints later |
| M-PL-005 | Biometrics UX detail | Optional companion |

---

## 6. Questions for Founder

1. Confirm alias `11_PLATFORM_PRINCIPLES` → `17_FUTURE_GROWTH_RULES`?
2. Confirm desktop/tablet breakpoint classes as Device-Tiers companion (GOV-154)?
3. Approve GOV-153 / 144–148 / 150 as written?
4. Resolve GOV-160 × GOV-073 (REC-074)?
5. Next: Accessibility vs Automation vs Naming (REC-076)?

---

## 7. Dependency Graph Summary

```
GOV-001/020/040/025 ──► GOV-153 (axiom)
GOV-013/041/085 ──────► (reused phone/native; not re-minted)
GOV-153 ──► GOV-154 (desktop/tablet ND)
GOV-153 ──► GOV-155 (watch)
GOV-153 + GOV-157 ──► GOV-156 (car)
GOV-099/136/050/064 ──► GOV-157 (voice)
GOV-153 + GOV-126/050 ──► GOV-158 (wearables)
GOV-153 + GOV-005/050 ──► GOV-159 (AR)
GOV-073/110/025 ──► GOV-160 (evolution ND)
GOV-153 + GOV-093 ──► GOV-161 (expansion gate)
GOV-138/137/141 ──────► (Future AI reused)
```

Cross-artifact: Constitution ceilings · NN client destiny · IA entity ceiling · VL native tokens · Motion vernacular · Interaction gestures · AI roles/bands.

---

## 8. Final Governance Score

| Dimension | Score (/10) |
|-----------|-------------|
| Identity clarity | 9 |
| Enforceability | 8 |
| Cross-platform readiness | 9 |
| AI readiness | 8 |
| Conflict hygiene | 7 |
| Metric rigor | 7 |
| Amendment process | 8 |
| Completeness (build without reread) | 7 |
| Traceability / evidence | 9 |
| Machine readability | 9 |
| **Final** | **81 / 100** |

**Interpretation:** Future Growth Rules supply growth axiom, shipped desktop/tablet ceilings, watch/car/voice/wearable/AR laws, design-evolution arbitration, and expansion gate. Heavy reuse of `/m` + native + AI + token GOVs. GOV-154 and GOV-160 Needs Discussion. Device-Tiers / Continuity not redesigned. Accessibility (`11_` real file) deferred via REC-076.

---

**STOP — founder review.**
