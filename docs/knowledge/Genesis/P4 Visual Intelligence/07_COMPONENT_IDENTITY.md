---
Purpose: Evaluate whether AIIMIN components have character or are generic Material/SaaS primitives.
Confidence: 0.86
Evidence Sources: index.css card/glass classes; MetricTile; StatCard; BrandLockup; native AiiminButtons/Surfaces; Lucide usage; FAB/sheets
Files Used: frontend/src/index.css; frontend/src/components/ui/MetricTile.jsx; frontend/src/components/dashboard/StatCard.jsx; native-android/.../AiiminButtons.kt; AiiminSurfaces.kt; AiiminRoot.kt
Reasoning: Component identity is how brand survives at the atom level.
Dependencies: 01, 04, 12
Consumers: Component library work, native UI kit
Known Unknowns: Full prop API catalog of every shared component (see Design Context gap)
Last Updated: 2026-07-22
Pass: 4/6
---

# 07 — Component Identity

## Character spectrum

| Component | Character | Notes |
|-----------|-----------|-------|
| Arch Bracket / BrandLockup | **High** | Ownable geometry + split click targets |
| AiiminPrimaryButton (native) | Medium–High | Pill 26dp radius, accent fill |
| AiiminCard (native) | Medium | 20dp + orange-tinted shadow |
| MetricTile | Medium | Glass + left color bar |
| `.vercel-card` / `.card` | Low | Named legacy; 8px border card |
| `.nordic-card` / `.card-hover` | Low–Medium | 24px + blur + lift — trend pattern |
| Lucide icon buttons | Low | Universal SaaS |
| M3 Card / OutlinedTextField | Low | Native secondary screens |
| Notes FAB | Medium | Orange FAB — brand color on Material shape |
| Waitlist CTA | High | Orange + Figtree/Familjen context |
| Chips / pills | Medium | 999 radius + 1px border — DESIGN.md correct |
| Dialogs / Vaul drawers | Low–Medium | Functional; glass guest banners common |
| Search inputs | Low | Mostly unstyled primitives |
| Bottom nav (web `/m` + native) | Medium | Accent selected state |

## Buttons

- No single shared `.btn-primary` system on web — **page-local button styles**
- Global `button:active { scale(0.97) }` — good micro-feedback
- Native: primary/secondary AIIMIN buttons exist but Focus/Discipline still use stock M3 buttons

## Cards

Three coexisting card dialects:

1. **Token border card** (`--r-md` 8px) — restrained, closer to DESIGN.md
2. **Glass 20–24px** — StatCard / Settings / Family — soft SaaS
3. **Native AiiminCard 20dp + tinted elevation** — branded but heavier than vault “tonal over shadow”

## Navigation

- Desktop masthead + BrandLockup — **strongest product chrome identity**
- TabRail tablet — Familjen display accents
- Native NavigationBar — accent indicator 12% fill — correct
- Shell Quick Add FAB (vault) — **not implemented**; only Notes FAB

## Inputs / search

Mostly generic. Capture clusters (44px icon buttons on touch) are the distinctive input pattern when present.

## Sheets / dialogs

- Web: Vaul + custom overlays; urge surf fullscreen ring is distinctive
- Native: Notes ModalBottomSheet default chrome; Auth custom overlapping Surface (stronger brand)

## Verdict

**Atoms are mostly generic; molecules with brand color applied.**  
True character concentrates in BrandLockup, studio shells, Metric left-bar, native Home cards, Auth sheet.

## Board challenge

- **Design Systems Lead:** Without a single Button/Card primitive enforcing radius+border+type, every page invents a cousin — sameness *and* inconsistency simultaneously.
- **Principal Product Designer:** Killing glass cards is not anti-beauty — it is how page identity reappears.
