# 04 — Founder Review Packet

```yaml
document: Founder Review Packet
artifact: Component Principles
phase: P7
source: AIIMIN GENESIS/P5 Constitution/10_COMPONENT_PRINCIPLES.md
source_alias: exact match
governance_trio: AIIMIN GENESIS/P7 Governance/Component-Principles/
date: 2026-07-22
```

> Decide and mark. No new GOV/REC IDs here.

---

## Summary

Component Principles define how shared UI earns existence: behavior contracts, extract-on-second-demand, one-owner primitives, mandatory states, composition-over-props, a11y-in-API, sacred capture, calm read, nav lock obedience, no decorative AI chrome, contract versioning. C-10/C-11 reused (Confirm/chips).

**11 new GOV** (142–152). **32 existing reused**. **7 REC**. **1 Needs Discussion** (GOV-150).

## Governance Score

**80 / 100**

## New GOV

| ID | Title | Status | Cost |
|----|-------|--------|------|
| GOV-142 | Components encode behavior contracts — not duplicate cards | Approved | Medium |
| GOV-143 | Prefer primitives over snowflakes — extract on second demand | Approved | Medium |
| GOV-144 | One component owns a primitive — variants not parallel inventions | Approved | High |
| GOV-145 | Interactive component states are mandatory design work | Approved | High |
| GOV-146 | Composition over configuration explosion | Approved | Medium |
| GOV-147 | Accessibility is part of the component API | Approved | High |
| GOV-148 | Capture components are sacred — no ceremony wrapping Enter-to-save | Approved | Medium |
| GOV-149 | Read components stay calm — score, chart, digest do not demand input | Approved | Medium |
| GOV-150 | Navigation components obey locks — BrandLockup split and device-tier shells | Needs Discussion | High |
| GOV-151 | No decorative AI components — intelligence via outcomes and chips | Approved | Low |
| GOV-152 | Component versioning by contract — vault note when behavior defaults change | Approved | Low |

## Existing reused

GOV-008, GOV-012, GOV-013, GOV-015, GOV-017, GOV-020, GOV-029, GOV-039, GOV-040, GOV-041, GOV-044, GOV-046, GOV-053, GOV-059, GOV-065, GOV-066, GOV-067, GOV-075, GOV-077, GOV-085, GOV-089, GOV-106, GOV-109, GOV-110, GOV-111, GOV-112, GOV-116, GOV-125, GOV-126, GOV-132, GOV-133, GOV-136

## REC

| ID | Title | Priority |
|----|-------|----------|
| REC-062 | Ratify Approved Component GOVs (142–149, 151–152) as citeable component canon | P0 |
| REC-063 | Audit and kill parallel Mood / Confirm / Capture inventions under GOV-144 | P0 |
| REC-064 | Publish mandatory state matrix checklist for interactive components | P0 |
| REC-065 | Founder align GOV-150 nav shells with GOV-012 lockup ND and GOV-075/097 primacy | P0 |
| REC-066 | Cross-client component contract parity audit (web vs native) | P0 |
| REC-067 | Ban design-system theater — tokens without behavior contracts | P1 |
| REC-068 | Next P7: 16_COMPONENT_BLUEPRINTS or 14_DESIGN_SYSTEM_SPECIFICATION or 11_ACCESSIBILITY | P0 |

## Conflicts

| ID | Meaning | Action |
|----|---------|--------|
| CF-C-001 | Dependency on open ND — BrandLockup / nav primacy | REC-065 |
| CF-C-002 | Known risk — design-system theater | REC-067 |
| CF-C-003 | Known risk — mega-components | REC-063 + API review |
| CF-C-004 | Known risk — web/native behavior drift | REC-066 |
| CF-C-005 | Complementary reuse — Confirm/chips already canon | Keep REC-018 ConfirmDialog CI ban |

## Needs Discussion

GOV-150

## Decide now

- [ ] Approve GOV-142…149, 151–152  
- [ ] GOV-150 nav shells — Approve / Amend after lockup ADR / Reject  
- [ ] Run primitive ownership audit (REC-063)  
- [ ] Next (REC-068): Blueprints / DSS / Accessibility / Other: ___  

## Stop

**STOP — founder review.**
