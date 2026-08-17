# 03 — Component Principles Governance Index

```yaml
document: Component Principles Governance Index
phase: P7
twin_json: 02_GOVERNANCE_DECISIONS.json
twin_report: 01_GOVERNANCE_REPORT.md
```

## Canonical Decisions (new)

| GOV ID | Title | Category | Status | Confidence | Cost | Depends On | Source |
|--------|-------|----------|--------|------------|------|------------|--------|
| GOV-142 | Components encode behavior contracts — not duplicate cards | Component — Existence Justification | Approved | High | Medium | GOV-040, GOV-106, GOV-062 | C-1 — Components exist to encode behavior contracts; Purpose |
| GOV-143 | Prefer primitives over snowflakes — extract on second demand | Component — Extraction Rule | Approved | High | Medium | GOV-142, GOV-040, GOV-020 | C-2 — Prefer primitives over page-specific snowflakes |
| GOV-144 | One component owns a primitive — variants not parallel inventions | Component — Ownership | Approved | High | High | GOV-142, GOV-143, GOV-065, GOV-066, GOV-126 | C-3 — One component owns a primitive; Reasoning |
| GOV-145 | Interactive component states are mandatory design work | Component — States | Approved | High | High | GOV-142, GOV-077, GOV-067, GOV-132 | C-4 — States are mandatory design work |
| GOV-146 | Composition over configuration explosion | Component — API Shape | Approved | High | Medium | GOV-142, GOV-143 | C-5 — Composition over configuration explosion; Known risks |
| GOV-147 | Accessibility is part of the component API | Component — Accessibility | Approved | High | High | GOV-133, GOV-071, GOV-142, GOV-056 | C-6 — Accessibility is part of the component API |
| GOV-148 | Capture components are sacred — no ceremony wrapping Enter-to-save | Component — Capture | Approved | High | Medium | GOV-066, GOV-116, GOV-059, GOV-008, GOV-144 | C-8 — Capture components are sacred |
| GOV-149 | Read components stay calm — score, chart, digest do not demand input | Component — Read Surfaces | Approved | High | Medium | GOV-029, GOV-109, GOV-142 | C-9 — Read components stay calm |
| GOV-150 | Navigation components obey locks — BrandLockup split and device-tier shells | Component — Navigation | Needs Discussion | High | High | GOV-012, GOV-039, GOV-013, GOV-041, GOV-085, GOV-075 | C-12 — Navigation components obey locks |
| GOV-151 | No decorative AI components — intelligence via outcomes and chips | Component — AI Refusal | Approved | High | Low | GOV-053, GOV-126, GOV-136, GOV-112, GOV-142 | C-13 — No decorative AI components |
| GOV-152 | Component versioning by contract — vault note when behavior defaults change | Component — Versioning / Governance | Approved | High | Low | GOV-017, GOV-044, GOV-142, GOV-144 | C-14 — Versioning by contract |

## Existing GOV referenced (no new ID)

| C item | Existing GOV | Note |
|--------|--------------|------|
| C-7 (feedback belongs to system) | GOV-077, GOV-089, GOV-132 | Mandatory feedback + sync/latency honesty — shared toast/error patterns elevated lightly via C-7 reuse; no new feedback-existence GOV |
| C-10 (destructive branded confirm) | GOV-065, GOV-015, GOV-046, GOV-125 | Branded ConfirmDialog + ban window.confirm + optimistic/confirm already canon — no re-mint |
| C-11 (chips first-class) | GOV-126, GOV-136 | Infer-then-chip + mixed-initiative already Interaction/AI canon — no re-mint |
| C-8 capture speed anchors | GOV-066, GOV-116, GOV-059, GOV-008 | Enter-to-save / after-commit / capture speed / anti-form — sacred capture components elevated in GOV-148 |
| C-9 calm read anchors | GOV-029, GOV-109 | Calm read + density modes — read-component law elevated in GOV-149 |
| C-12 lockup + ceilings | GOV-012, GOV-039, GOV-013, GOV-041, GOV-085, GOV-075 | Split lockup + /m ceiling + native≠/m + nav primacy ND — nav component obedience elevated in GOV-150 |
| C-6 / C-13 a11y + anti-AI-magic | GOV-133, GOV-053, GOV-112 | A11y as interaction quality + no AI magic + motion refuse AI-awake — component API / decorative AI bans elevated |
| C-14 vault ship gate | GOV-017, GOV-044 | Vault ships with behavior change — component contract versioning elevated in GOV-152 |
| Shared primitives / one primitive many surfaces | GOV-040, GOV-020, GOV-110 | Shared primitives + native token extension — ownership/extract laws elevated in GOV-143/144 |
| Empty / cards / icons | GOV-067, GOV-106, GOV-111 | Empty teach + cards-for-interaction + icons-keep-words support component states/composition |

## Governance Recommendations (NOT CANON)

| REC ID | Title | Priority | Status | Related GOV |
|--------|-------|----------|--------|-------------|
| REC-062 | Ratify Approved Component GOVs (142–149, 151–152) as citeable component canon | P0 | Pending Founder | GOV-142, GOV-143, GOV-144, GOV-145… |
| REC-063 | Audit and kill parallel Mood / Confirm / Capture inventions under GOV-144 | P0 | Pending Founder | GOV-144, GOV-065, GOV-066 |
| REC-064 | Publish mandatory state matrix checklist for interactive components | P0 | Pending Founder | GOV-145, GOV-077, GOV-067 |
| REC-065 | Founder align GOV-150 nav shells with GOV-012 lockup ND and GOV-075/097 primacy | P0 | Pending Founder | GOV-150, GOV-012, GOV-039, GOV-075… |
| REC-066 | Cross-client component contract parity audit (web vs native) | P0 | Pending Founder | GOV-144, GOV-110, GOV-118, GOV-040 |
| REC-067 | Ban design-system theater — tokens without behavior contracts | P1 | Pending Founder | GOV-142, GOV-073, GOV-145 |
| REC-068 | Next P7: 16_COMPONENT_BLUEPRINTS or 14_DESIGN_SYSTEM_SPECIFICATION or 11_ACCESSIBILITY | P0 | Pending Founder | GOV-142, GOV-147, GOV-145, GOV-073 |

## Quick filters

### Needs Discussion
- GOV-150 — Navigation components obey locks — BrandLockup split and device-tier shells

### High cost
- GOV-144 — One component owns a primitive — variants not parallel inventions
- GOV-145 — Interactive component states are mandatory design work
- GOV-147 — Accessibility is part of the component API
- GOV-150 — Navigation components obey locks — BrandLockup split and device-tier shells

### Conflicts
- CF-C-001 — Dependency on open ND — BrandLockup / nav primacy
- CF-C-002 — Known risk — design-system theater
- CF-C-003 — Known risk — mega-components
- CF-C-004 — Known risk — web/native behavior drift
- CF-C-005 — Complementary reuse — Confirm/chips already canon
