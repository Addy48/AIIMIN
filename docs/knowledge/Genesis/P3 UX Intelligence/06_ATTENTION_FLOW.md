# 06 — Attention Flow

## Purpose
Predict eye path and hierarchy competition on important surfaces. Not eye-tracking — structured expert prediction with agreement test.

## Confidence
★★★☆☆ — Heuristic + source layout order. Two designers would likely agree on primary magnets; tertiary paths vary.

## Evidence Sources
`Overview.jsx` widget order; `CommandCenter.jsx`; waitlist/brand structure; native Home/Journal; Login/Onboarding.

## Files Used
Overview, CommandCenter, UniversalLogger, WaitlistHero, Brand, AiiminRoot screens.

## Reasoning
Attention follows size, contrast (orange accent), motion (LIVE), and top-left reading gravity — then right-rail score rings.

## Dependencies
[[01_FIRST_IMPRESSION]] · [[13_AI_SLOP_ANALYSIS]]

## Consumers
Today composition, craft J0, native Home.

## Known Unknowns
Empirical eye-tracking; widget customize permutations.

---

## Agreement test
Would two designers predict the same eye path?
- **Primary magnet:** usually yes (score ring, hero headline, primary CTA).
- **Second/third:** often no when multiple cards shout (Overview).

---

## Waitlist landing

| Order | Element | Attention quality |
|------:|---------|-------------------|
| 1 | “One screen. Every day.” hero | Correct |
| 2 | Habits/money/focus/mood promise | Correct |
| 3 | Join / Reserve CTA | Correct |
| 4 | Urgency chips (31 Jul / Sep 2026) | Competing — FOMO vs calm brand |
| Too much | Perk emoji rows on mobile | Noise |
| Too little | Long-term privacy story | Buried vs cutoff dates |

---

## Brand `/brand`

| Order | Element |
|------:|---------|
| 1 | Human Momentum H1 |
| 2 | Lede anti-dashboard |
| 3 | CTA Open Today / Get access |
| Note | Light ivory + glass sticky nav — attention calm; premium |

Competitors low. Hierarchy clear. Designers likely agree.

---

## Login

| Order | Element |
|------:|---------|
| 1 | Mode title (Welcome back / Create account) |
| 2 | Identity field or PIN dots |
| 3 | Numpad |
| Risk | “Intelligent workspace” sets ops expectation |

Hierarchy clear. Good a11y live regions support attention for screen-reader users differently than visual users.

---

## Onboarding

| Order | Element |
|------:|---------|
| 1 | Step heading |
| 2 | Emoji choice grids (goals/habits) | **Steal attention from meaning** |
| 3 | Primary continue |
| 4 | “Step N of 10 · privacy” footer |

**Competition:** Emoji cards vs thoughtful goal selection. Visual candy increases impulsive picks (decision fatigue still high).

---

## Overview / Today (critical)

Predicted path for default widgets:

| Order | Element | Problem |
|------:|---------|---------|
| 1 | “Day Control.” header | Ops tone; strong |
| 2 | ArcBanner | Good identity — easy to skip if long |
| 3 | Monday Insight / Your Report | Large cards |
| 4 | **Life Score ring (right rail)** | Magnets eyes early on wide screens — may beat Logger |
| 5 | Universal Logger | **Should be #1 for doctrine; often #3–4 visually** |
| 6 | Trajectory LIVE badge | Motion steals — dashboard trope |
| 7 | Timeline / micro-task | Tertiary |

**Too much attention:** Score ring, LIVE, Report cards, Execution Window (founder-specific countdown when enabled).
**Too little:** Logger as the doctrinal heart; habit execution entry from Today.
**Invisible:** Space·L shortcut badge for many users; widget customize control until sought.

**Clear hierarchy?** Contested — multi-column dashboard without single focal action.
**Designer agreement:** Low on second stop.

**Craft intent (J0):** Logger-only Today would repair attention. Treat as required UX direction, verify prod state.

---

## Journal

| Order | Element |
|------:|---------|
| 1 | Capture surface |
| 2 | Mode switch |
| 3 | Mood |
| 4 | History sidebar |

Mode/mood can preempt writing — violates “capture first.”

---

## Finance

Tabs + forms → attention fragments across accounting IA. Waterfall reorder in UI brief aims to fix hierarchy; verify ship.

---

## Family

Tab strip + card grids → eyes hunt structure before purpose. Emergency urgency not visually privileged enough vs general CRM fields.

---

## Native Home

| Order | Element |
|------:|---------|
| 1 | SyncBanner (if non-idle) |
| 2 | Habit chips |
| 3 | Life score glance |
| 4 | Next-up |

Sync errors correctly steal attention — good. Empty habits text fails to attract action.

---

## Native Journal

Composer-first — good. Mode chips above writing — mild competition. Past list secondary.

---

## Command Palette overlay

Search field first — correct. Emoji mood actions compete with nav when browsing list.

---

## Attention principles violated

1. **Multiple primary magnets** on Today.
2. **Motion as decoration** (LIVE) without task value.
3. **Demo content** (wins) can attract as if real.
4. **Accent orange** used widely — accent inflation reduces signal.

---

## Cross-link
[[07_COGNITIVE_LOAD]] · [[13_AI_SLOP_ANALYSIS]] · [[15_DELIGHT_ANALYSIS]]
