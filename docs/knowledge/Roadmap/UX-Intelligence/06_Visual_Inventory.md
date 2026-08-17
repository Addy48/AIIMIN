---
authority: operations
derived_from: Palette.md · tokens.css · themes · brandPage.css · mobile CSS · P8 Visual cite
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-25
can_override_genesis: false
program: UX-Intelligence-v1
---

# 06 — Visual Inventory

**Lock (ops):** dark `#1a1a1a` · cards `#2d2d2d` · accent `#ff6b35` · done `#10b981` · muted `#6b7280` · light canvas `#f9f9f9`. Source: [[08_DESIGN/Palette]].

## Audit by axis

| Axis | Current reality | Inconsistencies (evidence) |
|------|-----------------|----------------------------|
| Colors | Locked palette used on mobile CSS + many product surfaces | `tokens.css` header historically Nordic/forest language; eng CSS may lag ivory→`#f9f9f9`; hardcoded hex in mobile vs CSS vars elsewhere |
| Light theme | `aiimin-light` theme exists | Full product light parity unverified; brand page own system |
| Dark theme | Primary product mode | Stronger consistency than light |
| Typography | Waitlist: Familjen Grotesk + Figtree + JetBrains Mono | App body vs waitlist type split; system/default stacks risk in places |
| Spacing | Tailwind + custom CSS | Density differs Overview vs Finance vs Family |
| Elevation | Cards `#2d2d2d` / elevated tokens | Shadow language uneven; DesktopWindow metaphor |
| Radius | Mix 8–16px common | Finance drag zone 16px; cards vary |
| Icons | Lucide-heavy | Size/stroke inconsistent |
| Illustrations | EmptyIllustrations | Coverage not universal |
| Shadows | Soft card shadows | Glow/overshadow risk vs P5 calm |
| Motion | Brand reduced-motion; kokonutui motion; AnimatedNumber | No single motion constitution applied in eng |
| Imagery | Brand page photography/atmosphere | App mostly UI chrome, low imagery |
| Branding | Brand lockup split; Human Momentum | Logo/wordmark targets locked — must preserve |

## Theme tokens

- Themes named `aiimin-dark` / `aiimin-light` (product)
- CSS variables `--color-*` used in many stylesheets
- Mobile often hardcodes `#1a1a1a` / `#ff6b35` (works but bypasses tokens)

## No redesign

This inventory records drift only. Visual System / Design System programs consume this list.
