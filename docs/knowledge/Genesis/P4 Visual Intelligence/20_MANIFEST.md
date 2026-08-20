---
Purpose: Entry index for the AIIMIN Visual Design Intelligence package (Genesis Phase 4 of 6).
Confidence: 0.94
Evidence Sources: Sibling docs; vault Palette; DESIGN.md; web tokens; native Theme.kt; brand surfaces; prior Design/Knowledge Context packages
Files Used: All files in this folder; docs/knowledge/08_DESIGN/Palette.md; DESIGN.md; AIIMIN_DESIGN_CONTEXT/MANIFEST.md
Reasoning: Codex and future designers need a single reading order, confidence model, and cross-links without scanning the monorepo.
Dependencies: None (root index)
Consumers: Designers, AI coding agents, Genesis Phase 5–6, Cursor agents bootstrapping visual work
Known Unknowns: Live Vercel pixel audit not screenshot-captured this pass; some Design Lab prototypes may have shipped since last craft report
Last Updated: 2026-07-22
Pass: 4/6 Visual Design Intelligence
---

# AIIMIN Visual Context — MANIFEST

## What this package is

Reverse-engineered **visual DNA** of AIIMIN as of 2026-07-22.

This is **not** a redesign brief, mockup set, or inspiration board.
It documents what the product *already is*, where identity is strong, where it collapses into generic SaaS, and which invisible rules future screens must obey.

**Pass 4 of 6** — Visual Design Intelligence. No product code modified.

## Hard constraints observed

- No redesign proposals framed as “ship this UI”
- Opinions without evidence removed in self-review
- Palette lock respected as product law (conflicts documented, not “fixed”)
- Secrets never recorded
- Vault remains day-to-day source of truth; this folder is a Codex-facing snapshot

## Document index

| File | Purpose |
|------|---------|
| [00_EXECUTIVE_SUMMARY.md](00_EXECUTIVE_SUMMARY.md) | Verdict: logo-off recognition, scores, top risks |
| [01_VISUAL_IDENTITY.md](01_VISUAL_IDENTITY.md) | What is recognizable vs generic vs AI-slop |
| [02_BRAND_DNA.md](02_BRAND_DNA.md) | Invisible rules for 100 future screens |
| [03_TYPOGRAPHY.md](03_TYPOGRAPHY.md) | Font stack, hierarchy, conflicts |
| [04_COLOR_SYSTEM.md](04_COLOR_SYSTEM.md) | Locked palette, semantics, theme drift |
| [05_SPACING_SYSTEM.md](05_SPACING_SYSTEM.md) | Observed scale vs intended 8pt grid |
| [06_LAYOUT_LANGUAGE.md](06_LAYOUT_LANGUAGE.md) | Density, rails, device tiers, composition |
| [07_COMPONENT_IDENTITY.md](07_COMPONENT_IDENTITY.md) | Buttons, cards, nav, sheets character |
| [08_PAGE_IDENTITY.md](08_PAGE_IDENTITY.md) | Every major page personality audit |
| [09_ICONOGRAPHY.md](09_ICONOGRAPHY.md) | Lucide / Material / Arch Bracket |
| [10_ILLUSTRATION_SYSTEM.md](10_ILLUSTRATION_SYSTEM.md) | Empty states, report skins, decorative |
| [11_MOTION_LANGUAGE.md](11_MOTION_LANGUAGE.md) | Web + native motion vocabulary |
| [12_DESIGN_TOKENS.md](12_DESIGN_TOKENS.md) | Extracted tokens only (no redesign) |
| [13_VISUAL_HIERARCHY.md](13_VISUAL_HIERARCHY.md) | Focus, weight, scanning patterns |
| [14_AI_SLOP_ANALYSIS.md](14_AI_SLOP_ANALYSIS.md) | Aggressive forgettable-pattern hunt |
| [15_VISUAL_OPPORTUNITIES.md](15_VISUAL_OPPORTUNITIES.md) | High-impact, non-redesign opportunities |
| [16_DESIGN_PRINCIPLES.md](16_DESIGN_PRINCIPLES.md) | Timeless principles distilled from evidence |
| [17_FUTURE_CONSISTENCY_RULES.md](17_FUTURE_CONSISTENCY_RULES.md) | Rules agents/designers must not break |
| [18_VISUAL_SCORECARD.md](18_VISUAL_SCORECARD.md) | Scored dimensions |
| [19_RISK_REGISTER.md](19_RISK_REGISTER.md) | Visual identity risks |
| [20_MANIFEST.md](20_MANIFEST.md) | This file |

## Recommended reading order

1. **MANIFEST** (this file)
2. **00_EXECUTIVE_SUMMARY**
3. **02_BRAND_DNA** + **01_VISUAL_IDENTITY**
4. **04_COLOR_SYSTEM** + **03_TYPOGRAPHY** + **12_DESIGN_TOKENS**
5. **08_PAGE_IDENTITY** + **07_COMPONENT_IDENTITY**
6. **14_AI_SLOP_ANALYSIS** + **15_VISUAL_OPPORTUNITIES**
7. **16_DESIGN_PRINCIPLES** + **17_FUTURE_CONSISTENCY_RULES**
8. **18_VISUAL_SCORECARD** + **19_RISK_REGISTER**
9. Remaining system docs as needed (spacing, layout, motion, icons, illustration, hierarchy)

## Prior intelligence packages

| Package | Path | Use for |
|---------|------|---------|
| Repository Intelligence (partial) | `AIIMIN_DESIGN_CONTEXT/` | Architecture, screens inventory intent |
| Knowledge Intelligence (partial) | `AIIMIN_KNOWLEDGE_CONTEXT/` | Philosophy, anti-looks |
| Product Bible | `docs/AIIMIN_PRODUCT_BIBLE/` | Vision, principles |
| Native design pack | `docs/knowledge/17_NATIVE_APP_V2/` | Companion UX + motion |
| Brain OS | `docs/knowledge/` | Day-to-day truth |

## Confidence model

| Score | Meaning |
|-------|---------|
| 0.9–1.0 | Verified from primary source this pass |
| 0.7–0.89 | Strong evidence; minor inference |
| 0.5–0.69 | Partial coverage / sample only |
| <0.5 | Speculative |

## What this pass did NOT do

- Write or redesign product UI
- Capture live production screenshots for every page
- Exhaustive static analysis of every CSS radius instance
- Unify conflicting token files (documented only)
- Passes 5–6

## Generation method

Vault-first load → design skills lens (design-taste anti-slop) → parallel evidence agents on web, native, brand/prototypes → board-style challenge of conclusions → package write.
