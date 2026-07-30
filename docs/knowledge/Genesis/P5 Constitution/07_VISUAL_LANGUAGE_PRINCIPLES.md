# 07 — Visual Language Principles

```yaml
document: Visual Language Principles
version: 3.0
last_updated: 2026-07-22
```

## Purpose

Define timeless visual principles for AIIMIN recognition and craft — without prescribing pixel mockups.

## Reasoning

Palette is locked; type and motion have craft history; anti-looks are explicit. Visual language principles translate locks into durable rules that survive redesign tooling.

## Evidence

Palette.md; Design History; Design Philosophy anti-looks; Typography notes; Native M3 token mapping; brand always-light manifesto.

---

## VL-1 — Color is identity, not decoration

| Role | Token | Meaning |
|------|-------|---------|
| Canvas | Dark `#1a1a1a` / Light ivory `#EDE4D3` (Palette authority) | Place |
| Surface | `#2d2d2d` / `#ffffff` | Work area |
| Action | `#ff6b35` | Primary action / Human Momentum ember |
| Done | `#10b981` | Completion truth |
| Muted | `#6b7280` | Incomplete / secondary |

**Orange acts; green completes — never invert.** Neutrals should dominate the majority of pixels. Decorative purple/cyan/rainbow = identity leak.

No new brand colors without founder approval. Accent never means shame. Conflicting token sources (`:root` forest green, cool `#f9f9f9`, void black) are **debt**, not options — Palette.md arbitrates.

## VL-2 — Contrast is non-negotiable

Light mode body `#14171A` on ivory must remain ≥4.5:1. Dark mode must preserve readable hierarchy without neon glow crutches.

## VL-3 — Typography has jobs (not a font buffet)

| Role | Family | Where |
|------|--------|-------|
| Wordmark / manifesto display | Bodoni Moda | Brand lockup & `/brand` only |
| Ritual / display headlines | Familjen Grotesk | Brand moments, key OS headlines |
| Product body / UI | Figtree | Nav, buttons, page titles, body |
| Measure | JetBrains Mono | Scores, money, timers, OS IDs |

Do not adopt Inter/Roboto/Arial as *brand identity*. Do not employ Playfair/Jost/etc. as unemployed decorative fonts. Platform defaults may appear in native system chrome; controlled product surfaces prefer declared jobs.

## VL-4 — Composition over dashboard collage

First viewport of branded/marketing surfaces: one composition. Product Today: one primary capture story, not a widget flea market. Cards exist for interaction containers, not for looking “designed.”

## VL-5 — Atmosphere without trend costumes

Gradients, subtle texture, and depth may support calm atmosphere. They must not become purple mesh, glassmorphism-as-personality, or cream-terracotta editorial costume.

## VL-6 — Iconography serves recognition

Icons support wayfinding; they do not replace words for critical actions. Emoji is not IA.

## VL-7 — Brand lockup geometry is sacred

Split click targets remain: mark → `/brand`; wordmark → Today/overview. Do not unify without founder ask. Do not replace with mini-story or OAuth purple chrome.

## VL-8 — Light and dark are one system

Two appearances; one identity. Brand manifesto may be always-light. Product dark tokens are not to be casually rewritten during light craft. Resolve conflicts via Palette.md authority.

## VL-9 — Density matches cognitive mode

| Mode | Density |
|------|---------|
| Capture | Low chrome, high focus |
| Command / power | Higher density allowed |
| Review | Calm, scannable |
| Brand | Expressive, sparse hero |

## VL-10 — Native extends tokens, does not invent a cousin brand

Material 3 roles map from AIIMIN tokens. Platform behaviors may differ; color meaning must not.

## Dependencies

[[03_DESIGN_PHILOSOPHY]] · Palette.md · [[14_DESIGN_SYSTEM_SPECIFICATION]].

## Future impact

New platforms (watch, car, AR) inherit token meaning first, pixel recipes second.

## Tradeoffs

Strict palette reduces seasonal rebrands. Continuity is the asset.

## Known risks

- Document drift between `#f9f9f9` and ivory — Palette.md wins.
- Marketing freelancers introducing banned looks “just for landing.”
- Over-carding product UI under dashboard habit.

## Related sections

[[09_MOTION_PRINCIPLES]] · [[11_ACCESSIBILITY_PRINCIPLES]] · [[14_DESIGN_SYSTEM_SPECIFICATION]]
