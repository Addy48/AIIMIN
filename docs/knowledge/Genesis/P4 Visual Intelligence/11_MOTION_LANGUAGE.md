---
Purpose: Document motion language across web and native — principles, tokens, catalog, risks.
Confidence: 0.86
Evidence Sources: DESIGN.md; motionPresets.js; animations.js; native 07_MOTION.md; Framer usage samples; Compose animation samples
Files Used: DESIGN.md; frontend/src/utils/motionPresets.js; frontend/src/constants/animations.js; docs/knowledge/17_NATIVE_APP_V2/07_MOTION.md; Theme/UI audit notes; FocusRoom; ShippedMotion.jsx
Reasoning: Motion either explains hierarchy or becomes decoration — DNA demands the former.
Dependencies: 02, 12
Consumers: Motion work, FE/native polish
Known Unknowns: Reduced-motion coverage completeness; PageTransition wiring gap may have changed
Last Updated: 2026-07-22
Pass: 4/6
---

# 11 — Motion Language

## Principles (aligned across DESIGN.md + native vault)

1. Motion explains hierarchy — never decorates emptiness  
2. Interruptible always  
3. Reduced motion → opacity cuts only  
4. Peak moments rare (≤2 memorable / session native; max 2–3 motions / surface web)  
5. Opacity + transform preferred; ease-out  
6. No hover-lift card carnivals on dense lists  

## Web tokens (`tokens.css`)

| Token | Value |
|-------|-------|
| `--dur-fast` | 80ms |
| `--dur-normal` | 150ms |
| `--dur-enter` | 200ms |
| `--dur-feedback` | 300ms |
| `--dur-progress` | 400ms |
| `--dur-hero` | 800ms |
| `--ease` | cubic-bezier(0.16, 1, 0.3, 1) |
| `--ease-spring` | cubic-bezier(0.34, 1.56, 0.64, 1) |

DESIGN.md target band: **150–250ms** UI.

## Web presets

`motionPresets.js`: EASE_OUT, springs (snappy/soft/bounce), fadeUp, stagger, hoverLift, progressTween.  
**Low adoption** (~4 direct consumers); ~85 files import Framer directly — **vocabulary drift**.

`animations.js`: pageVariants, listVariants, cardVariants, reducedMotionVariants, scrollReveal.  
App-shell PageTransition **not consistently wired** (comment vs App.js).

## Native catalog (vault + code)

Vault specifies short/medium/long M3-like tiers + springs for sheets.  
Code reality: tab AnimatedContent, auth step slides, mic color, timer floats, waveform infinite — **light functional**. Shared elements largely absent.

## Does motion reinforce understanding?

| Motion | Role |
|--------|------|
| Habit tick / check | Feedback — yes |
| Sheet present | Hierarchy — yes |
| Score count-up | Meaning — yes when used |
| Stagger card enter on dashboards | Borderline decoration |
| Focus ambient pulse | Mood — allowed as peak |
| hoverLift on metric grids | **Decorative / anti-DNA** when dense |
| Skeleton shimmer | Loading — yes |

## Board challenge

- **Motion Design Lead:** Unify on `motionPresets` — ban one-off spring constants per file.
- **Accessibility Expert:** `reducedMotionVariants` must be the default path when `prefers-reduced-motion`.
- **Creative Director:** Celebration (tier upgrade, day complete) must stay rare or Life Score honesty dies.
