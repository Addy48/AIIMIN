---
Purpose: Extract every observable reusable design token — no redesign, extraction only.
Confidence: 0.91
Evidence Sources: tokens.css; Palette.md; themes.js; Theme.kt; Type.kt; brandPage.css; motion files; DESIGN.md; native vault spacing/radius
Files Used: frontend/src/styles/tokens.css; docs/knowledge/08_DESIGN/Palette.md; frontend/src/constants/themes.js; native-android/.../Theme.kt; Type.kt; brandPage.css; motionPresets.js; animations.js; DESIGN.md
Reasoning: Tokens are the contract between DNA and implementation.
Dependencies: 03–05, 11
Consumers: Design system implementation, Codex token maps
Known Unknowns: Inline magic numbers not elevated to tokens; XML themes.xml partial mirror
Last Updated: 2026-07-22
Pass: 4/6
---

# 12 — Design Tokens (Extracted)

## A. Color — product lock (canonical intent)

```
bg.dark:           #1a1a1a
surface.dark:      #2d2d2d
accent:            #ff6b35
accent.calm:       #E85A24
success:           #10b981
muted:             #6b7280
bg.light:          #EDE4D3
elevated.light:    #F7F1E6
surface.light:     #ffffff
text.light:        #14171A
text.dark:         #F0EDE8
danger:            #EF4444
warning:           #FACC15
```

## B. Color — runtime `aiimin-dark` / `aiimin-light`

See 04. Note base `#14171A` vs lock `#1a1a1a`.

## C. Color — legacy (do not use for new work)

```
vercel.base:    #0A0A0A
vercel.accent:  #22C55E
nordic.accent:  #1E5C3A
midnight.accent:#00F0FF
studio.accent:  #000000
```

## D. Typography families

```
font.display:  Familjen Grotesk
font.body:     Figtree          // intent
font.sans.debt:Inter            // current --font-sans
font.serif:    Playfair Display // debt for product H1
font.brand:    Bodoni Moda
font.mono:     JetBrains Mono
```

## E. Type scale (CSS tokens)

```
text.hero:    italic 700 48/1.05 serif
text.metric:  700 36/1 sans
text.heading: 500 16/1.4 sans
text.body:    400 15/1.6 sans
text.label:   500 10/1 mono
text.subtext: 400 12/1.5 sans
```

Native (sp): display 40, headline 28/22, title 18/16/14, body 16/14/12, label 12/11/10.

## F. Spacing

```
4, 8, 12, 16, 24, 32, 40, 48, 64  // --space-1..9
content.max: 1320px
content.pad: 40px
nav.height: 68 / 64
bottom.nav: 64
```

## G. Radius

```
r.none: 0
r.sm:   4
r.md:   8
r.lg:   12
r.xl:   16
r.pill: 9999
```

Observed extra: card 20–24px; native AiiminCard 20dp; buttons 26dp; auth sheet 28–32dp.

## H. Elevation / glass

```
glass.blur:     16px (sm 8px)
glass.shadow:   0 8px 32px rgba(0,0,0,0.6) // dark
glass.shadow.sm:0 2px 12px rgba(0,0,0,0.4)
shadow.focus.accent: 0 0 0 2px rgba(255,107,53,0.32)
native.card.elevation: 6.dp with orange-tint ambient/spot
```

## I. Z-index

```
z.sticky:   900
z.drawer:   999
z.nav:      1000
z.dropdown: 1100
z.overlay:  1200
```

## J. Motion

```
dur.fast: 80
dur.normal: 150
dur.enter: 200
dur.feedback: 300
dur.progress: 400
dur.hero: 800
ease.out.product: cubic-bezier(0.16, 1, 0.3, 1)
ease.framer: [0.22, 1, 0.36, 1]
spring.snappy: stiffness 420 damping 32 mass 0.85
spring.soft: 280 / 28 / 1
```

Native vault: 50–200 short · 250–400 medium · 450–600 long · peak 600–800.

## K. Opacity / blur

```
accent.dim: ~6–8% orange wash
glass.border: rgba white 0.06 (dark)
scrim.sheet: ~0.4 (native intent)
```

## L. Brand page local tokens

```
--bm-base: #ede4d3
--bm-ink: #14171a
--bm-accent-hot: #ff6b35
--bm-accent: #e85a24
--bm-done: #1e5c3a
```

## M. Grid completion (Palette)

```
8/8: #10b981
6–7/8: lighter green
<6/8: #6b7280
```

## Extraction note

Tokens exist but **multiple sources of truth**. Canonical for agents: Palette.md + `aiimin-*` themes + this file’s lock block. Treat `:root` vercel block as legacy.
