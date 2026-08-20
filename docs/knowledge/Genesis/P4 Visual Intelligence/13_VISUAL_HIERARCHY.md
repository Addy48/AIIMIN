---
Purpose: Evaluate visual hierarchy — focus, weight, grouping, scanning patterns across surfaces.
Confidence: 0.83
Evidence Sources: Overview composition; studio pages; Focus; Brand; native Home; DESIGN.md density guidance
Files Used: Overview.jsx patterns; journalStudio.css; notesStudio.css; FocusRoom.jsx; Brand.jsx; HomeScreen.kt; DESIGN.md
Reasoning: Hierarchy is how meaning and priority are communicated without words.
Dependencies: 06, 08
Consumers: Page composition work
Known Unknowns: Eyetracking not available; judgment from structure + type contrast
Last Updated: 2026-07-22
Pass: 4/6
---

# 13 — Visual Hierarchy

## Does every screen have one obvious focus?

| Surface | Primary focus | Clear? |
|---------|---------------|--------|
| Brand | Human Momentum statement | Yes |
| Waitlist | Hero + CTA | Yes |
| Focus | Timer | Yes |
| Native Home | LIFE SCORE | Yes |
| Journal | Editor canvas | Mostly |
| Notes | Active note / grid | Mostly |
| Overview | Competing: logger vs trajectory vs command | **Often no** |
| Finance | Metrics strip vs tables | Contested |
| Settings | Section stack | No single focus (OK for settings) |
| Family | Tab content | Contested |
| Lab | Tool grid | No — gallery |

## Weight & contrast

- Accent orange correctly pulls action when sparse
- When many cards each have accent icons/bars, **everything shouts**
- Mono metrics create good secondary hierarchy when used
- Serif H1 + eyebrow + chips + badges = stacked competition (nav prototypes called this out)

## Grouping & scanning

- Overview rail = good F-scan support when sticky
- Studio list+main = classic master/detail scan
- Auto-fit card grids = uniform weight → slow scan
- Native More 2-col tiles = equal weight hub (acceptable)

## Editorial rhythm

Brand and Journal approach editorial rhythm. Most OS pages use **dashboard rhythm** (repeated modules). DNA wants Life OS command — but still needs a **hero of the day** on Today.

## Board challenge

- **Editorial Designer:** Today must answer “what matters now” in one glance — not nine equal widgets.
- **Principal Product Designer:** Settings equal hierarchy is fine; Today equal hierarchy is a bug.
