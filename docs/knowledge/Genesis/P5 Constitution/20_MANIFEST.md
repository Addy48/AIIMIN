# 20 — Manifest

```yaml
document: AIIMIN Design Bible Manifest
version: 3.0
phase: Genesis Phase 5 of 6
generated: 2026-07-22
status: canonical foundation
```

## Purpose

Index the Design Bible, declare consumption order, source intelligence, confidence, and maintenance rules.

## Reasoning

A constitution that cannot be found will not be followed. Manifest is the map.

## Evidence

This folder’s documents; prior Genesis/intelligence packages listed below.

---

## Package contents

| File | Title | Role |
|------|-------|------|
| `00_EXECUTIVE_SUMMARY.md` | Executive Summary | Entry |
| `01_AIIMIN_CONSTITUTION.md` | Constitution | Immutable law |
| `02_PRODUCT_PHILOSOPHY.md` | Product Philosophy | Worldview |
| `03_DESIGN_PHILOSOPHY.md` | Design Philosophy | Recognition & feel |
| `04_USER_PHILOSOPHY.md` | User Philosophy | Who & trust |
| `05_BEHAVIORAL_PHILOSOPHY.md` | Behavioral Philosophy | Ethics of change |
| `06_INFORMATION_ARCHITECTURE_PRINCIPLES.md` | IA Principles | Structure |
| `07_VISUAL_LANGUAGE_PRINCIPLES.md` | Visual Language | Sight |
| `08_INTERACTION_PRINCIPLES.md` | Interaction Principles | Behavior rules |
| `09_MOTION_PRINCIPLES.md` | Motion Principles | Movement meaning |
| `10_COMPONENT_PRINCIPLES.md` | Component Principles | System behavior |
| `11_ACCESSIBILITY_PRINCIPLES.md` | Accessibility | Access law |
| `12_CONTENT_AND_MICROCOPY.md` | Content | Voice |
| `13_NAMING_LANGUAGE.md` | Naming | Lexicon |
| `14_DESIGN_SYSTEM_SPECIFICATION.md` | Design System Spec | Contracts |
| `15_PAGE_BLUEPRINTS.md` | Page Blueprints | Surface architecture |
| `16_COMPONENT_BLUEPRINTS.md` | Component Blueprints | Control architecture |
| `17_FUTURE_GROWTH_RULES.md` | Future Growth | Multi-device evolution |
| `18_NON_NEGOTIABLES.md` | Non-Negotiables | Refuse/require |
| `19_EXECUTIVE_SCORECARD.md` | Scorecard | Grading |
| `20_MANIFEST.md` | Manifest | This file |

## Recommended consumption order

### Agents (mandatory short path)

1. `00` → `01` → `18`
2. Then task-relevant: pages (`15`), components (`16`), visual (`07`/`14`), AI/behavior (`05`/`08`)
3. Score with `19` before claiming design done

### Humans (designers / PMs)

Read `00`–`05` fully once. Keep `18` and `15`–`16` as working desks. Use `17` when opening a new modality.

### Executives

`00`, `01`, `19`, skim `18`.

## Source intelligence consumed

| Source | Status |
|--------|--------|
| `AIIMIN_DESIGN_CONTEXT/` | Consumed (partial package present) |
| `AIIMIN_KNOWLEDGE_CONTEXT/` | Consumed |
| `AIIMIN_UX_CONTEXT/` | Consumed (exec summary, behavioral, opportunities, platform continuity) |
| `AIIMIN_VISUAL_CONTEXT/` | Consumed (exec summary, Brand DNA, design principles, scorecard) |
| `docs/AIIMIN_PRODUCT_BIBLE/` | Consumed |
| `docs/product-intelligence/` | Consumed (key docs) |
| `docs/interaction-audit/` | Consumed via Interaction Model + UX friction synthesis |
| `docs/knowledge/08_DESIGN/Palette.md` | Consumed (authority) |

## Confidence

| Area | Confidence |
|------|------------|
| Constitution / product philosophy alignment | ★★★★★ |
| Interaction & non-negotiables | ★★★★★ |
| Page blueprints vs shipped routes | ★★★★☆ (aliases documented; routes evolve) |
| Visual system (with Visual Intel) | ★★★★★ intent / ★★★★☆ shipped fidelity noted as gap |
| UX behavioral & device continuity | ★★★★★ |
| Future modalities | ★★★☆☆ (principled, not empirically tested) |

## Relationship to other doctrines

| Doctrine | Relationship |
|----------|--------------|
| Product Bible | Product doctrine; must agree with Constitution |
| Vault Brain OS | Operational memory for shipping; Bible is foundational law |
| Palette.md | Color authority inside Visual/System specs |
| Design Lab prototypes | May explore; ship bar = Scorecard + Non-Negotiables |

## Maintenance rules

1. Contractual changes → amend relevant doc + note date + update this Manifest confidence if needed.
2. Never silent-edit Constitution Articles without founder process (`01` Article XI).
3. Changelogs for feature work still live in vault feature notes; Bible changes are rarer and deliberate.
4. If UX/Visual Intelligence packages appear later, reconcile into `03`, `07`, `14`, `19` and raise confidence.

## Success criteria (Phase 5)

- [x] Identity defined
- [x] Philosophies documented
- [x] Principles documented
- [x] Page architecture documented
- [x] Component architecture documented
- [x] Growth rules documented
- [x] Non-negotiables documented
- [x] Future builders can answer foundational questions from this package

## Failure criteria avoided

- Generic advice without AIIMIN locks
- Trend-driven identity
- Platform opinion replacing ceilings
- Hollow principles without rationale
- Philosophy contradictions (self-reviewed against Product Bible)

## Dependencies

All files in this folder; prior intelligence packages.

## Future impact

Phase 6+ builds against this foundation. Agents should load Manifest path from Home/Current-Context.

## Tradeoffs

Large doctrine cost upfront; cheaper than re-litigating identity each sprint.

## Known risks

- Docs diverge from code — scorecard + vault discipline required.
- Over-citation without reading — agents must load task-relevant files, not pretend.

## Related sections

[[00_EXECUTIVE_SUMMARY]] · vault `docs/knowledge/00_HOME.md` (link) · `docs/knowledge/15_MEMORY/Current-Context.md`
