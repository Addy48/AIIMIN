---
Purpose: Evaluate iconography consistency, weight, semantic use, and brand alignment.
Confidence: 0.85
Evidence Sources: Lucide imports; Arch Bracket; native Material Icons; ic_aiimin_mark; Design Lab notes
Files Used: frontend Lucide imports (~104 files); archBracketMark.js; native AiiminRoot.kt icons; res/drawable/ic_aiimin_mark.xml; ArchBracketMark.kt (unused in screens)
Reasoning: Icons are a recognition layer; generic icon sets erase brand unless brand mark anchors moments.
Dependencies: 01, 07
Consumers: Icon work, nav design
Known Unknowns: Exact stroke width consistency across Lucide size props; custom icon count beyond mark + gemini
Last Updated: 2026-07-22
Pass: 4/6
---

# 09 — Iconography

## Systems in use

| System | Client | Role |
|--------|--------|------|
| **Lucide React** | Web | Dominant UI icons |
| **Material Icons (Compose)** | Native | Dominant UI icons |
| **Arch Bracket / ic_aiimin_mark** | Both | Brand / launcher / splash / auth |
| **gemini.jsx** | Web | Provider affordance |
| **kokonutui kit** | Web Design Lab | Non-production aesthetic risk |

## Consistency

- Web: Lucide family is internally consistent (stroke icons)
- Native: Outlined → Filled on tab select — good state language
- Cross-client: Lucide ≠ Material — acceptable if brand mark bridges
- Optical size: native vault wants 24; mostly followed

## Weight / stroke

Lucide default stroke reads light on dark charcoal — generally OK. Mixed sizes (16/18/20/24) across pages without a documented scale.

## Filled vs outlined

| Context | Pattern |
|---------|---------|
| Native tabs | Outline idle / filled selected |
| Web nav | Lucide mostly outline |
| Brand mark | Filled geometry + ember dot |

## Semantic usage

Generally clear (Sun/Moon theme, Bell, Menu). Risk: decorative Sparkles on AI features → “AI product” cliché if overused.

## Brand consistency

- **Strong:** mark on launcher, splash, BrandLockup, waitlist
- **Weak:** `ArchBracketMark.kt` defined but **unused** in native screens — missed reinforcement
- **Weak:** Settings/Finance icon colors sometimes purple/blue instead of muted/accent

## Accessibility

- Icon-only controls need labels (spotty)
- Color+icon for done states better than color alone
- 48dp / 44px touch targets on mobile tiers required

## Board challenge

- **Iconography Specialist:** Do not invent a custom icon font yet — enforce Lucide size/stroke tokens first. Brand mark is enough uniqueness.
- **Brand Design Director:** Ember dot must remain exclusive to Arch Bracket — never a generic notification pip color language.
