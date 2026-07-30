# 14 — Design System Specification

```yaml
document: Design System Specification
version: 3.0
last_updated: 2026-07-22
note: Contracts and tokens — not mockups or CSS dumps
```

## Purpose

Specify the design system as a set of contracts: tokens, roles, component families, motion, content, and platform mapping — sufficient for future designers to build without reinventing foundations.

## Reasoning

AIIMIN already has a locked palette, type direction, motion budget, and component principles. This specification binds them into one system definition without pretending a Figma file is the constitution.

## Evidence

Palette.md; Typography notes; Motion principles; Component principles; Native M3 mapping; Brand lockup locks.

---

## 1. System layers

```text
Constitution & Philosophies
        ↓
Principles (IA, Visual, Interaction, Motion, A11y, Content)
        ↓
Design System Specification (this doc)
        ↓
Page & Component Blueprints
        ↓
Platform implementation (web / native / future)
```

## 2. Foundational tokens (authoritative meanings)

### Color roles

| Role | Dark | Light | Meaning |
|------|------|-------|---------|
| canvas | `#1a1a1a` | `#EDE4D3` | App background (Palette.md wins conflicts) |
| surface | `#2d2d2d` | `#ffffff` | Cards / panels |
| accent | `#ff6b35` | `#ff6b35` (calm alt `#E85A24` noted) | Action |
| success | `#10b981` | same | Done |
| muted | `#6b7280` | same | Incomplete / secondary |
| text-1 (light) | — | `#14171A` | Body on ivory |

**Contract:** No new brand colors without founder approval.

### Typography roles

| Role | Family | Intent |
|------|--------|--------|
| wordmark | Bodoni Moda | Brand lockup / manifesto only |
| brand-display | Familjen Grotesk | Ritual headlines |
| ui-body / ui-label | Figtree | Product reading, nav, controls |
| metric | JetBrains Mono | Scores, money, timers, OS IDs |

**Contract:** Type has jobs. Inter-as-identity and unemployed font buffets are drift. Product must not adopt generic AI SaaS type identity.

### Space & density

Space scales serve Capture (airy), Command (compact), Review (scannable). Exact scale values live in implementation tokens; the contract is density-by-mode (VL-9).

### Motion tokens

Duration band ~150–250ms default; easing family consistent per surface class; reduced-motion nullifies decoration.

### Elevation

Elevation expresses hierarchy sparingly. Multi-shadow personality stacks are out of contract.

## 3. Component families (system catalog)

| Family | Owns |
|--------|------|
| Capture | Logger, capture field, Enter-to-save |
| Routing | Command Palette, search results |
| Feedback | Toast, inline error, sync pending |
| Confirm | ConfirmDialog, typed confirm |
| Inference | Chip, chip group |
| Navigation | BrandLockup, masthead, TabRail, BottomNav |
| Execution | HabitToggle, checklist row |
| Identity-emotion | Mood primitive (single) |
| Review | LifeScore, briefing, digest blocks |
| Form | Progressive field, wizard step |
| Overlay | Modal, drawer (Vaul-class), non-`window.confirm` |
| Empty | Teaching empty state |

Behavioral detail: [[16_COMPONENT_BLUEPRINTS]].

## 4. Pattern contracts

| Pattern | Contract |
|---------|----------|
| Infer-then-chip | Auto/prefill + visible correction |
| Optimistic toggle | Immediate UI; reconcile on failure |
| Destructive confirm | Branded dialog; typed for extreme |
| Free-pin nav | User-owned pins; overflow honest |
| Device ceiling | `/m` capture-only on phone web |
| Split lockup | Mark brand / wordmark Today |

## 5. Content system

Voice traits and verb lexicon are part of the design system: [[12_CONTENT_AND_MICROCOPY]], [[13_NAMING_LANGUAGE]].

## 6. Platform mapping

| Platform | Rule |
|----------|------|
| Web desktop/tablet | Full OS; masthead/TabRail |
| Web phone `/m` | Capture shell only |
| Native Android | M3 roles from AIIMIN tokens; rich companion IA |
| Future platforms | Inherit roles first; adapt interaction second |

## 7. Contribution rules

1. New token → justify against Constitution; update Palette/vault if color.
2. New component family → blueprint first; no styling-only components.
3. Breaking default behavior → document in vault + Bible changelog note.
4. Marketing may be expressive within anti-look bans; product OS stays restrained.

## Dependencies

[[07_VISUAL_LANGUAGE_PRINCIPLES]] · [[10_COMPONENT_PRINCIPLES]] · Palette.md.

## Future impact

This spec is the bridge between philosophy and implementation. Redesigns swap skins only inside these contracts.

## Tradeoffs

Specification without a single Figma source of truth requires discipline in code and vault. Prefer contracts over screenshot archaeology.

## Known risks

- Token drift across CSS variables, native theme, and docs.
- Light canvas conflicts (`#f9f9f9` vs ivory) — Palette.md authority.
- Design Lab prototypes leaking banned looks into production.

## Related sections

[[15_PAGE_BLUEPRINTS]] · [[16_COMPONENT_BLUEPRINTS]] · [[17_FUTURE_GROWTH_RULES]]
