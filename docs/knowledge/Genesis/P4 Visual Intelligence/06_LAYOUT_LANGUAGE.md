---
Purpose: Document layout language — composition, device tiers, rails, page chassis patterns.
Confidence: 0.87
Evidence Sources: DESIGN.md; device tier hooks; navItems; Overview grid; Journal/Notes studios; native IA; craft device track
Files Used: DESIGN.md; frontend/src/hooks/useDeviceTier.js; frontend/src/constants/navItems.js; Overview.jsx patterns; journalStudio.css; notesStudio.css; AiiminRoot.kt; docs/knowledge/02_ARCHITECTURE (device split via Home)
Reasoning: Layout communicates product philosophy (capture vs command) as much as color does.
Dependencies: 02, 05, 08
Consumers: FE layout, native navigation, design agents
Known Unknowns: Exact breakpoint matrix in CSS vs JS may differ slightly by file
Last Updated: 2026-07-22
Pass: 4/6
---

# 06 — Layout Language

## Product layout doctrine

| Tier | Experience | Visual implication |
|------|------------|--------------------|
| Phone web | Forced `/m` capture | Sparse, bottom nav, no analytics tools |
| Tablet 768–1099 | TabRail + full OS | Condensed chrome, drawers ≤900px |
| Desktop ≥1100 | Masthead Navbar | Full command density |
| Native app | Companion, not `/m` | Glance Home + capture modules + More hub |

## Composition patterns observed

### A — Shared dashboard chassis (most pages)

`.page-container` + optional `PageHeader` + card/section stacks.  
**Risk:** pages feel like the same layout with different data.

### B — Overview command

Main column + sticky rail; widget grid; Universal Logger capture.  
Simplified defaults hide redundant widgets (Typography changelog).

### C — Studio split (Journal / Notes)

List/history rail + main canvas; ≤900px rail → slide-over drawer (`DESIGN.md`).  
Capture stays above fold.

### D — Brand manifesto

Full-bleed editorial sections, always light, atmosphere — **not** dashboard chrome.

### E — Focus cinematic

Large rounded container, ambient glow, mode-colored atmosphere — peak emotional layout.

### F — Native shell

Bottom tabs (Home / Journal / Notes / More) + push stacks; Notes Keep 2-col grid; Vault segmented list.

### G — Capture mobile

`/m` single job: collect. Visual language = locked palette + compact controls.

## Grid & containers

- `--content-max: 1320px`, `--content-pad: 40px`
- Test widths called in DESIGN.md: 500, 600, 768, 1024
- Craft celebration tiers: full ≥1100, framed tablet, compact phone

## Elevation in layout (preview — also 07)

Prefer border separation between regions over stacked shadow cards.
Sticky nav / glass nav creates a second plane — use sparingly so content remains primary.

## Personality vs sameness

| Pattern | Personality | Sameness risk |
|---------|-------------|---------------|
| Studio (Journal/Notes) | High | Low |
| Brand | High | N/A |
| Focus | High | One-off (OK if rare) |
| Overview | Medium | Medium |
| Finance/Calendar/Habits | Low–Medium | High |
| Settings/Family | Low | High |
| Native Settings/Goals | Low | High |

## Board challenge

- **Creative Director:** Focus Room cinematic energy is allowed as a **peak surface**. If every page gets radial glows, DNA dies.
- **Human Interface Expert:** Masthead with 12 pins + More overflow is correct for Life OS breadth — do not collapse to 4-tab mobile web on desktop.
- **Mobile Design Specialist:** Native More grid is a hub, not a dumping ground — tile visual weight should stay equal; web badges for desktop-only features must stay visually quiet.
