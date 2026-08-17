# 03 — Platform Principles Governance Index

```yaml
document: Platform Principles Governance Index
phase: P7
twin_json: 02_GOVERNANCE_DECISIONS.json
twin_report: 01_GOVERNANCE_REPORT.md
```

## Canonical Decisions (new)

| GOV ID | Title | Category | Status | Confidence | Cost | Depends On | Source |
|--------|-------|----------|--------|------------|------|------------|--------|
| GOV-153 | Growth axiom — identity invariant; modality variable; ceiling intentional | Platform — Growth Axiom | Approved | High | High | GOV-001, GOV-020, GOV-025, GOV-040, GOV-103 | Growth axiom |
| GOV-154 | Desktop and tablet shipped ceilings — full OS; tablet TabRail-class; no hover-only essentials | Platform — Shipped Tiers | Needs Discussion | High | High | GOV-001, GOV-013, GOV-040, GOV-085, GOV-153 | Platform rules — Desktop; Tablet |
| GOV-155 | Watch ceiling — pulses and glances only; no multi-step finance; phone handoff for high stakes | Platform — Watch | Approved | High | High | GOV-153, GOV-015, GOV-046, GOV-082 | Platform rules — Watch |
| GOV-156 | Car ceiling — eyes-free / glance-safe; safety over completeness | Platform — Car | Approved | High | High | GOV-153, GOV-157, GOV-033 | Platform rules — Car |
| GOV-157 | Voice modality — Palette intent-router philosophy; correction path; coaching sparingly | Platform — Voice | Approved | High | High | GOV-099, GOV-047, GOV-136, GOV-050, GOV-064, GOV-126, GOV-153 | Platform rules — Voice |
| GOV-158 | Wearables / passive sensing — opt-in; on-device preference; no silent clinical; not fitness-app takeover | Platform — Wearables | Approved | High | Extreme | GOV-153, GOV-126, GOV-050, GOV-006, GOV-070, GOV-058 | Platform rules — Wearables |
| GOV-159 | AR ceiling — capture/memory overlays only; not social AR; no AR-inferred medical | Platform — AR | Approved | High | Extreme | GOV-153, GOV-005, GOV-010, GOV-050, GOV-070 | Platform rules — AR |
| GOV-160 | Multi-device design evolution — extend tokens by role; no per-device Constitution forks; Constitution arbitrates drift | Platform — Design Evolution | Needs Discussion | High | Extreme | GOV-025, GOV-073, GOV-074, GOV-110, GOV-037, GOV-153 | Design system evolution rules |
| GOV-161 | Expansion decision gate — five questions before new platform surface; fail stays Design Lab | Platform — Expansion Gate | Approved | High | Medium | GOV-153, GOV-023, GOV-014, GOV-015, GOV-093 | Expansion decision gate |

## Existing GOV referenced (no new ID)

| Platform item | Existing GOV | Note |
|---------------|--------------|------|
| OS shared primitives across surfaces | GOV-001, GOV-020, GOV-040 | Growth axiom builds on these |
| Phone web `/m` capture-only | GOV-013, GOV-041 | Reuse — do not re-mint |
| Native ≠ `/m`; Capacitor not primary | GOV-085, GOV-092 | Reuse |
| Sync honesty | GOV-089 | Reuse |
| Cross-client tokens / native extension | GOV-073, GOV-110 | GOV-160 elevates; GOV-073 still ND |
| Article supremacy | GOV-025 | No per-device Constitution forks |
| Kill List on modalities | GOV-074 | Reuse |
| Voice = Palette router | GOV-099, GOV-047, GOV-136 | GOV-157 elevates modality |
| Infer-then-chip | GOV-126, GOV-035, GOV-051 | Wearables |
| Notifications deserve attention | GOV-064 | Speech — still ND |
| Clinical / auto-post / money / safety / auth-billing | GOV-050, GOV-006, GOV-078, GOV-082, GOV-070, GOV-140 | Reuse |
| Future AI roles / bands / coaching | GOV-138, GOV-137, GOV-141 | Reuse |
| Platform vernacular / gestures | GOV-118, GOV-134 | Reuse |
| Entity IA ceiling field | GOV-103 | Aligns with GOV-153 |

## Governance Recommendations (NOT CANON)

| REC ID | Title | Priority | Status | Related GOV |
|--------|-------|----------|--------|-------------|
| REC-070 | Ratify Approved Platform GOVs (153, 155–159, 161) as citeable platform canon | P0 | Pending Founder | GOV-153, GOV-155…161 |
| REC-071 | Confirm source alias: 11_PLATFORM_PRINCIPLES → 17_FUTURE_GROWTH_RULES | P0 | Pending Founder | GOV-153 |
| REC-072 | Publish surface declaration checklist from GOV-153 four fields + GOV-161 five questions | P0 | Pending Founder | GOV-153, GOV-161, GOV-093, GOV-103 |
| REC-073 | Founder confirm desktop/tablet breakpoint classes as Device-Tiers companion (no redesign) | P0 | Pending Founder | GOV-154, GOV-013, GOV-085 |
| REC-074 | Align GOV-160 client-dispute arbitration with GOV-073 / REC-020 token SoT | P0 | Pending Founder | GOV-160, GOV-073, GOV-110 |
| REC-075 | Add Platform QA gates: declaration, ceilings, modality refuses, expansion gate | P0 | Pending Founder | GOV-153…150 |
| REC-076 | Next P7 after founder OK: 11_ACCESSIBILITY or 07_AUTOMATION_RULES or 13_NAMING | P0 | Pending Founder | GOV-133, GOV-137, GOV-071, GOV-160 |

## Quick filters

### Needs Discussion

- GOV-154 — Desktop and tablet shipped ceilings (breakpoint companion)
- GOV-160 — Multi-device design evolution / client arbitration

### High / Extreme cost

- GOV-153 — Growth axiom (High)
- GOV-154 — Desktop/tablet ceilings (High)
- GOV-155 — Watch (High)
- GOV-156 — Car (High)
- GOV-157 — Voice (High)
- GOV-158 — Wearables (Extreme)
- GOV-159 — AR (Extreme)
- GOV-160 — Design evolution (Extreme)

### Conflicts

- CF-PL-001 — Source alias — no 11_PLATFORM_PRINCIPLES.md
- CF-PL-002 — Complementary ND — desktop/tablet breakpoints
- CF-PL-003 — Complementary ND — client arbitration × token SoT
- CF-PL-004 — Audit vs law — Platform Continuity not-yet-one-ecosystem
- CF-PL-005 — Known risk — native envy breaking `/m`
- CF-PL-006 — Tone/safety — voice coach × clinical × speech notifications
