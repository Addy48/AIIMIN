# 10 — Component Principles

```yaml
document: Component Principles
version: 3.0
last_updated: 2026-07-22
```

## Purpose

Define how reusable components earn existence, behave, and relate — without styling recipes.

## Reasoning

AIIMIN’s debt includes duplicate primitives and lingering `window.confirm`. Component principles prevent library growth from becoming identity fracture.

## Evidence

Interaction audit duplicates; ConfirmDialog migration; Universal Logger as single capture primitive; Radix/Vaul usage patterns; Native shared tokens.

---

## C-1 — Components exist to encode behavior contracts

A component is justified when it standardizes interaction, accessibility, and state — not when it duplicates a slightly different card.

## C-2 — Prefer primitives over page-specific snowflakes

If two pages need the same behavior, extract. If one page needs a one-off, keep it local until the second demand appears.

## C-3 — One component owns a primitive

Examples: one Mood control family; one Confirm destructive pattern; one Capture input family. Variants are sizes/contexts, not parallel inventions.

## C-4 — States are mandatory design work

Every interactive component defines: default, hover/focus (as applicable), active, disabled, loading, error, empty, success. Missing states ship as bugs.

## C-5 — Composition over configuration explosion

Prefer slots/composition to 40 boolean props that recreate the universe.

## C-6 — Accessibility is part of the component API

Focus management, labels, roles, hit targets ship with the component — not as a consumer afterthought.

## C-7 — Feedback belongs to the system

Toasts, inline errors, and confirmations follow shared patterns so trust feels consistent.

## C-8 — Capture components are sacred

CaptureBar / Logger / Palette routing components may not be wrapped in ceremony that slows Enter-to-save.

## C-9 — Read components stay calm

Score, chart, and digest components optimize scan and comprehension; they do not demand input.

## C-10 — Destructive components are branded and interrupting on purpose

ConfirmDialog (and typed confirm for extreme stakes) replaces system confirms. Interruption is correct when irreversible.

## C-11 — Chips are first-class

Inference correction chips are not secondary decorations; they are the UI of mixed-initiative trust.

## C-12 — Navigation components obey locks

BrandLockup split targets; device-tier nav shells (BottomNav / TabRail / Masthead) respect ceilings.

## C-13 — No decorative AI components

Components named or styled to signify “AI” without behavior are banned. Intelligence appears as outcomes and chips, not badges.

## C-14 — Versioning by contract

Changing a component’s default behavior requires vault/Bible note when it alters product contracts (e.g., confirm patterns, capture submit).

## Dependencies

[[08_INTERACTION_PRINCIPLES]] · [[16_COMPONENT_BLUEPRINTS]] · [[14_DESIGN_SYSTEM_SPECIFICATION]].

## Future impact

Cross-platform components share contracts first; rendering engines second.

## Tradeoffs

Strict ownership slows drive-by UI. Consistency is the compounding asset.

## Known risks

- Design-system theater (tokens without behavior contracts).
- Mega-components that do everything poorly.
- Web and native drifting into differently behaving “same” components.

## Related sections

[[16_COMPONENT_BLUEPRINTS]] · [[18_NON_NEGOTIABLES]]
