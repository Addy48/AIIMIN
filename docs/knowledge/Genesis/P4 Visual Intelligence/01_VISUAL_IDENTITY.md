---
Purpose: Map what makes AIIMIN visually identifiable versus generic, handcrafted, AI-generated, or competitor-adjacent.
Confidence: 0.90
Evidence Sources: Brand surfaces; palette lock; logo explorations; page CSS; native Theme; competitor-risk review against named products
Files Used: archBracketMark.js; Brand.jsx; brandPage.css; waitlistLanding.css; logo-designs/index.html; tokens.css; Theme.kt; DESIGN.md; AIIMIN_KNOWLEDGE_CONTEXT/02_PRODUCT_PHILOSOPHY.md
Reasoning: Identity is comparative — must name what is ownable vs what could be mistaken for peers.
Dependencies: 00, 02, 14
Consumers: Brand directors, product designers, agents choosing visual direction
Known Unknowns: No formal brand-lift study; competitor UI evolves weekly
Last Updated: 2026-07-22
Pass: 4/6
---

# 01 — Visual Identity

## Purpose

Determine recognizability without the wordmark.

## What currently makes AIIMIN recognizable

| Signal | Evidence | Strength |
|--------|----------|----------|
| Arch Bracket mark + ember dot | `archBracketMark.js` EDITOR_PICK / DARK_PICK | **Ownable** |
| Burnt orange `#ff6b35` as action | Palette.md, Theme.kt primary | Strong when exclusive |
| Green `#10b981` as done (not brand) | Palette.md, DESIGN.md | Strong semantic |
| Warm ivory `#EDE4D3` light | Palette.md, `aiimin-light`, brand page | Strong vs cool SaaS light |
| Charcoal layered dark | `#1a1a1a` / `#14171A` + radial washes in prototypes | Medium |
| Human Momentum editorial | Brand.jsx always-light manifesto | Strong on `/brand` only |
| Split brand lockup (mark→`/brand`, text→`/overview`) | BrandLockup + product lock rule | Unique interaction DNA |
| Dot-grid / ember atmosphere | waitlistLanding.css, brandPage.css | Medium (trend-adjacent) |

## What is generic

| Pattern | Where | Risk |
|---------|-------|------|
| Lucide outline icons | ~104 FE files | Linear/Notion feel |
| Glass panels + blur(16px) | ~45 files | 2023–25 SaaS default |
| Metric card grids auto-fit | Overview, Family, Finance | Dashboard template |
| Material Cards + OutlinedTextField | Native Vault/Goals/Settings | Android sample app |
| Inter body | tokens `--font-sans`, globals.css | Startup default |
| Purple decorative accents | Settings Appearance, growth charts | “AI product” cliché |

## What feels handcrafted

- Arch Bracket geometry (path construction, OAuth ember ring variant)
- `/brand` ember spotlight + peach radial washes + grain
- Journal studio (accent radial header, prose measure)
- Notes studio full-bleed masthead (NotebookLM-adjacent but intentional)
- Report PDF skins (18 print-quality directions in `prototypes/reports/`)
- Today HTML explorations (`frontend/public/prototypes/today/` 01–12) — fashion/editorial briefs
- Native Auth/Welcome overlapping sheet + orange gradient hero

## What feels AI-generated / copied

| Signal | Evidence |
|--------|----------|
| Forest-green “Vercel Nordic” `:root` | tokens.css header comment + `#22C55E` |
| Playfair / serif hero on product headers | `--font-serif` + PageHeader |
| Purple→pink kokonutui gradients | `components/kokonutui/` Design Lab |
| Glass mesh / spatial proto 12 | exploratory only — good that not shipped |
| Green-primary logo gallery | `logo-designs/` — **not** shipped mark |

## Competitor confusion matrix

Could someone mistake AIIMIN for…

| Product | Risk | Why yes | Why no |
|---------|------|---------|--------|
| **Notion** | Medium on Notes/settings | Soft cards, content-first | Orange ember + ivory ≠ Notion beige/gray |
| **Linear** | Medium–High on dark lists | Dark, calm hierarchy, mono labels | Linear purple/indigo; AIIMIN orange+green |
| **ClickUp / Todoist** | Low–Medium | Habit/task chrome | AIIMIN denser Life OS, not task-first |
| **Apple** | Low | Native restraint aspiration | Material Compose + Lucide ≠ HIG |
| **Google** | Low | Material on native | Brand mark + ivory contradict Material You rainbow |
| **Arc** | Low–Medium | Bold brand moments | Arc is browser chrome language |
| **Superlist / Motion** | Medium | Productivity dark UI | Motion calendar-first; Superlist checklist |
| **Reflect / Capacities / Anytype** | Medium on Notes | Knowledge surfaces | AIIMIN is Life OS (metrics+money+focus), not PKM-first |
| **Vercel dashboard** | **High on legacy tokens** | `:root` literally “Vercel-Style Nordic” | Canonical theme is orange — if theme attr fails, **yes** |

## Board challenge

- **Brand Design Director:** Green logo explorations must stay archived — shipping green-as-brand would erase the action/completion split.
- **Senior Visual Designer:** “Handcrafted” brand page does not save a generic Settings page. Identity is the **weakest link**, not the average.
- **Illustration Director:** Without a consistent empty-state / illustration language, product still looks like a component library demo on sparse screens.

## Conclusion

AIIMIN has a **real identity core** (Arch Bracket + orange/green/ivory + Human Momentum). Shipped product **dilutes** that core through legacy tokens, Inter, glass card sameness, and Material-default secondary screens.

Logo-off recognition succeeds only when the core is allowed to dominate the viewport.
