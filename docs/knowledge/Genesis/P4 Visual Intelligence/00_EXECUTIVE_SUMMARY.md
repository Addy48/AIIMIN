---
Purpose: One-page verdict on AIIMIN visual recognition, DNA strength, and what must stay sacred.
Confidence: 0.91
Evidence Sources: Palette.md; DESIGN.md; tokens.css; themes.js; Theme.kt; Brand.jsx; archBracketMark.js; page CSS inventory; native UI audit; Knowledge Context philosophy; Today/report prototypes
Files Used: docs/knowledge/08_DESIGN/Palette.md; DESIGN.md; frontend/src/styles/tokens.css; frontend/src/constants/themes.js; native-android/.../Theme.kt; frontend/src/pages/Brand.jsx; frontend/src/components/brand/archBracketMark.js
Reasoning: Primary question is logo-off recognition. Answer requires separating brand surfaces from dashboard chassis.
Dependencies: 01–19 for detail
Consumers: Founders, design leads, Genesis Phase 5–6, any agent about to “restyle”
Known Unknowns: Exact pixel parity between Vercel prod and local tokens at paint time; user perception studies not run
Last Updated: 2026-07-22
Pass: 4/6
---

# 00 — Executive Summary

## Primary question

**If every screenshot of AIIMIN lost its logo — would people still recognize it?**

### Verdict

**Partially — on brand and ritual surfaces. No — on most Life OS dashboard pages.**

| Surface class | Logo-off recognition | Why |
|---------------|----------------------|-----|
| `/brand` manifesto, waitlist hero, Arch Bracket chip | **High** | Warm ivory, ember accent, Bodoni/Familjen lockup, Human Momentum copy |
| Native Auth / Home LIFE SCORE / Notes Keep grid | **Medium–High** | Orange-on-charcoal, Familjen display, Keep-tinted cards |
| Today / Finance / Settings / Family / Goals grids | **Low** | Glass cards, Lucide rows, auto-fit metric tiles — could be any dark productivity app |
| `/m` capture | **Medium** | Hardcoded palette lock colors, but layout is generic capture shell |

Without the Arch Bracket + burnt orange `#ff6b35` + warm ivory `#EDE4D3` triad, dense pages collapse toward **Linear/Notion/Vercel-adjacent dark SaaS**.

## What currently makes AIIMIN recognizable

1. **Burnt orange action** vs **green completion** (semantic split, not rainbow accents)
2. **Arch Bracket mark** — squircle + nested peaks + ember dot (not a letter “A” alone)
3. **Warm ivory light canvas** (`#EDE4D3`) — not cool gray SaaS light mode
4. **Charcoal dark** (`#1a1a1a` / `#14171A` family) with restrained 1px borders
5. **Human Momentum** editorial voice on brand surfaces
6. **Device split** — phone capture vs desktop command (structural, not just visual)

## What is generic / forgettable

- Inter as effective body font despite Figtree intent
- Lucide-everywhere icon language
- 20–24px glass cards with identical hover lifts
- Purple (`#8B5CF6`) and chart rainbow accents on Settings/Finance/growth
- Legacy `:root` forest-green Vercel theme still in `tokens.css`
- Stock Material Compose cards on Vault / Goals / Settings native

## Board challenge (self-review)

- **Creative Director:** “Orange + dark is not enough — Arc and many fitness apps use orange.” Counter: AIIMIN’s *pair* is orange-action + green-done + ivory light + Arch Bracket geometry. That combination is rarer.
- **Color Scientist:** Palette lock hexes disagree slightly across Palette.md (`#1a1a1a`), `aiimin-dark` (`#14171A`), DESIGN.md light (`#f9f9f9` vs ivory). Recognition suffers from **internal drift**, not competitor theft.
- **Principal Product Designer:** Page identity is uneven — Journal/Notes/Brand have studios; Family/Settings feel templated. Recognition is a **page lottery**, not a system.

## Package scores (preview — see 18)

| Dimension | Score /10 |
|-----------|-----------|
| Brand DNA clarity (intent) | 8.5 |
| Brand DNA consistency (shipped) | 5.5 |
| Typography system | 5.0 |
| Color semantics | 7.0 |
| Page identity differentiation | 4.5 |
| Component character | 5.0 |
| Motion language | 6.0 |
| Token hygiene | 3.5 |
| Anti-slop posture (docs) | 8.0 |
| Anti-slop posture (code) | 4.0 |
| **Overall visual recognizability** | **5.5** |

## Top 5 risks

1. `:root` forest green / Inter defaults leak before theme attribute
2. Multi-font competition (Bodoni + Familjen + Inter + Playfair + Jost)
3. Glass + identical card grids erase page personality
4. Native secondary screens = accent-tinted Material
5. Design Lab / kokonutui purple kits tempt future paste

## Top 5 opportunities (non-redesign)

1. Make `:root` = canonical AIIMIN tokens (identity fire drill)
2. Enforce Figtree body / Familjen display / Bodoni wordmark-only
3. Kill purple as decorative accent; reserve brand orange + semantic green
4. Give every primary route one signature layout cue (already true for Notes/Journal/Brand)
5. Align web dark base hex with Palette lock OR update lock to match `aiimin-dark` — pick one

## Status of this package

Visual DNA **extracted and challenged**. Not a redesign. Ready for Phase 5 consumers.
