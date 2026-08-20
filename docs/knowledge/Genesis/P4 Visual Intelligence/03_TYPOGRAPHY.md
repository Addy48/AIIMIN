---
Purpose: Audit AIIMIN typography — families, weights, scale, voice, consistency across surfaces.
Confidence: 0.89
Evidence Sources: index.html font loads; tokens.css; globals.css; brandPage.css; Type.kt; Design Lab LogoTypographyPanel; Typography feature note
Files Used: frontend/public/index.html; frontend/src/styles/tokens.css; frontend/src/styles/globals.css; frontend/src/pages/brandPage.css; native-android/.../Type.kt; frontend/src/pages/account/sections/design/LogoTypographyPanel.jsx; docs/knowledge/09_FEATURES/Typography/Typography.md
Reasoning: Typography is the loudest identity channel after color; conflicts here erase brand.
Dependencies: 02, 12
Consumers: Designers, FE agents, native UI work
Known Unknowns: Exact runtime computed font on every route (cascade + FOUT); Jost referenced without confirmed load
Last Updated: 2026-07-22
Pass: 4/6
---

# 03 — Typography

## Intended system (product intent)

| Role | Family | Evidence |
|------|--------|----------|
| Wordmark | Bodoni Moda | brandPage.css `--font-brand`; Wordmark component |
| Display / ritual | Familjen Grotesk | index.html preload; `--font-display`; native `displayLarge` |
| Body / UI | Figtree | index.html; Design Lab “Figtree = nav, body, page titles”; native Type.kt body |
| Data / scores | JetBrains Mono | tokens `--font-mono`; waitlist labels; vault intent |

Waitlist + brand surfaces largely honor this. **Default app body does not.**

## What actually ships

| Layer | Effective sans | Problem |
|-------|----------------|---------|
| `tokens.css` `--font-sans` | **Inter** | Identity default wrong |
| `globals.css` html/body | Inter | Reinforces |
| `index.html` shell | Inter | Pre-paint |
| `tokens.css` `@import` | Inter + **Playfair Display** + JetBrains | Extra serif + Inter network cost |
| `index.html` Google fonts | Familjen + Figtree + JetBrains | Correct load, underused for body |
| Native | Figtree + Familjen bundled | Matches intent better than web |
| Native scores | Familjen bold / default | JetBrains Mono **missing** |

## Scale (tokenized)

From `tokens.css`:

| Token | Spec |
|-------|------|
| `--text-hero` | italic 700 48px/1.05 serif |
| `--text-metric` | 700 36px/1 sans |
| `--text-heading` | 500 16px/1.4 sans |
| `--text-body` | 400 15px/1.6 sans |
| `--text-label` | 500 10px/1 mono |
| `--text-subtext` | 400 12px/1.5 sans |

Feature note also references `text-h*`, `text-body`, `text-label` utility migration (partial).

Native M3-mapped scale (Type.kt): display 40 / headline 28–22 / title 18–14 / body 16–12 / label 12–10 — **2 weights emphasized** (regular/semibold pattern in vault).

## Hierarchy quality

| Surface | Editorial quality | Notes |
|---------|-------------------|-------|
| `/brand` | High | Familjen display + Figtree body + mono labels |
| Waitlist | High | Same |
| Journal | Medium–High | Prose measure; studio CSS |
| Overview | Medium | Metric tokens partial; mixed |
| PageHeader (many pages) | Medium–Low | Serif H1 (Playfair) fights product sans |
| Settings / Family | Lower | Inline sizes, less token use |
| Native Home/Auth | Higher | Familjen ritual |
| Native Settings/Goals | Lower | Default M3 slots |

## Does type communicate…

| Trait | Verdict |
|-------|---------|
| Confidence | Partial — mono scores help; Inter softens |
| Warmth | Brand/ivory yes; Inter body cools product |
| Precision | Mono labels yes; inconsistent elsewhere |
| Professionalism | Medium |
| Friendliness | Figtree capable; underused |
| Premium | Bodoni moments yes; diluted by Inter+Playfair mix |

## Shared language across pages?

**No.** Three competing systems coexist:

1. **Brand intent** — Figtree/Familjen/Bodoni/JetBrains  
2. **Token default** — Inter/Playfair  
3. **Stray** — Jost in globals `.text-section` (load unclear)

Design Lab already recorded the conflict: *“Familjen Grotesk competes with Bodoni in the same viewport”* and proposed Bodoni wordmark-only + Figtree page titles.

## Board challenge

- **Typography Specialist:** Hero italic Playfair is a 2024 AI landing cliché. DNA wants Familjen for ritual display, not fashion magazine serif on every PageHeader.
- **Accessibility Expert:** Font-scale control exists (`useFontScale`); long-tail inline sizes still break it (Typography.md). Contrast of `#14171A` on `#EDE4D3` is locked AA for body — keep.

## Extracted rule

```
Bodoni = wordmark only.
Familjen = display / score heroes / brand headlines.
Figtree = everything interactive and readable.
JetBrains = numbers that must feel measured.
Inter/Playfair as product defaults = debt.
```
