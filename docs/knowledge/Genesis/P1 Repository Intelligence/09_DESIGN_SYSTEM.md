---
Purpose: Extract factual design-system information only — no redesign.
Confidence: 0.93
Generated From: docs/knowledge/08_DESIGN/Palette.md; DESIGN.md; frontend/src/styles/tokens.css; globals.css; index.css; Typography feature note
Dependencies: [10_THEME_SYSTEM.md](10_THEME_SYSTEM.md), [05_COMPONENT_LIBRARY.md](05_COMPONENT_LIBRARY.md)
Consumers: UI implementation; Codex design fidelity
Last Updated: 2026-07-22
Pass: 1/6
---

# 09 — Design System (facts only)

## Locked brand palette (product rule)

### Dark (canonical product lock)

| Token | Hex | Use |
|-------|-----|-----|
| Background | `#1a1a1a` | App background (product lock statement) |
| Cards | `#2d2d2d` | Surfaces |
| Accent | `#ff6b35` | Burnt orange primary |
| Done | `#10b981` | Success / complete |
| Muted | `#6b7280` | Incomplete / muted |

### Light

| Token | Hex | Use |
|-------|-----|-----|
| Canvas | `#EDE4D3` | Warm ivory (`aiimin-light` `--color-base`) |
| Elevated | `#F7F1E6` | Soft panels |
| Cards | `#ffffff` | Surfaces |
| Body text | `#14171A` | Charcoal (`--color-text-1`) |
| Accent | `#ff6b35` product lock; CSS may use `#E85A24` for calm | Accent |
| Done / Muted | same as dark | |

**Contrast rule:** `#14171A` on `#EDE4D3` ≥ 4.5:1.

**Do not** change dark canvas tokens as part of light-mode work (Palette.md).

### Conflict note

`tokens.css` canonical dark block uses base `#14171A` and accent `#FF6B35` while Palette.md / product locks state dark bg `#1a1a1a`. **Both exist.** Product lock docs emphasize `#1a1a1a`; CSS token file uses `#14171A` for `aiimin-dark` base. Treat as documented inconsistency → [11_TECHNICAL_DEBT.md](11_TECHNICAL_DEBT.md).

---

## DESIGN.md register (root)

- Dark-first Life OS; restrained; 1px borders over heavy shadows
- Typography utilities: `text-h*`, `text-body`, `text-label`; journal serif via `--font-serif`; measure ~62–70ch
- Pills radius `999px`; capture row 44px touch targets; drawers below ~900px
- Journal/notes: rail + main; ≤900px rail → drawer
- Motion: 150–250ms, opacity + transform, ease-out; max 2–3 motions per surface

---

## CSS token source

Primary: `frontend/src/styles/tokens.css` keyed by `data-theme`.

Categories present: base/surface/elevated/overlay, borders, text 1–3, accent (+dim/glow), status, tier colors, metric tints, glass, ambient glow, focus shadow, fonts (`--font-sans`, `--font-serif`, `--font-mono`, `--font-display`), type scale (`--text-hero`, `--text-metric`, `--text-heading`, `--text-body`, `--text-label`, `--text-subtext`), radius, spacing, layout (`--nav-height`, `--content-max`), z-index, component heights, animation durations/easing, aliases (`--bg-primary`, `--accent`, …).

Utility classes (`index.css`): `.text-hero`, `.text-metric`, `.text-heading`, `.text-body`, `.text-label`, `.text-subtext`.

Structural: `globals.css` shadows, transitions, autofill, glass; `.aiimin-logo` uses `--logo-color`.

### Legacy theme blocks still in tokens.css

`vercel`, `nordic`, `studio`, `midnight` (+ `:root`) — legacy; runtime normalizes to `aiimin-dark` / `aiimin-light` except waitlist forced `nordic`/`vercel`.

---

## Typography

Waitlist fonts (Palette): **Familjen Grotesk** + **Figtree** + **JetBrains Mono**.  
Feature note: `docs/knowledge/09_FEATURES/Typography/Typography.md` (token-rollout-phase1-complete).  
Journal: serif prose canvas (`JournalWriteCanvas` / `--font-serif`).

---

## Spacing / radius / elevation / grid

- Spacing & radius: CSS variables in `tokens.css` (names under spacing/radius sections)
- Elevation: prefer 1px borders; theme-specific shadow overrides for `[data-theme="light|dark"]` in globals
- Grid completion colors: 8/8 `#10b981`; 6–7 lighter green; <6 `#6b7280`
- Device tiers CSS: `deviceTiers.css`
- Tab rail: `tabRail.css`

---

## Responsive behaviour

| Tier | Approx | UI |
|------|--------|-----|
| Phone | Capacitor or narrow UA | `/m` only |
| Tablet | 768–1099 | TabRail + full OS |
| Desktop | ≥1100 | Masthead |
| ≤900px | — | Rails → drawers (journal/notes) |
| Touch | — | 44px capture targets |

---

## Icons / illustrations / assets

- Icons: `lucide-react`; custom `icons/DumbbellIcon`, `gemini`; brand SVG via `archBracketMark.js`
- Empty illustrations: `ui/EmptyIllustrations.jsx` (Habits/Goals/Finance/Sports)
- Public images: `frontend/public/` (~25 image assets counted)
- Logo galleries: `logo-designs/`, exported icons via `frontend/scripts/export-logo-assets.mjs`

---

## Motion / animation

- Framer Motion / `motion` packages
- `design/ShippedMotion.jsx`: StaggerWrap, HoverLift, SpringAmount, page variants
- `animation-vocabulary` skill exists for craft work (not a runtime token file)
- Durations: DESIGN.md 150–250ms; CSS animation tokens in `tokens.css`
- KokonutUI: additional decorative motion (marketing)

---

## Stylesheet inventory (`frontend/src/styles/`)

tokens.css · globals.css · tabRail.css · deviceTiers.css · journalStudio.css · disciplinePage.css · disciplineStudio.css · notesStudio.css · todayCapture.css · productTour.css · tierUpgradeCelebration.css · subscriptionSection.css · waitlistLanding.css · careerKanban.css · focusRoomTablet.css · mobile*.css

Page-local CSS also under `pages/` (e.g. `brandPage.css`, `lab/lab.css`, `family/family.css`).

---

## Prototypes (design artifacts, not production system)

- `prototypes/reports/`
- `frontend/public/prototypes/today/` (01–12)
- Account Design Lab panels
- External HTML prototypes (Current-Context paths)

## Cross-references

- Theme switching → [10_THEME_SYSTEM.md](10_THEME_SYSTEM.md)
- Components → [05_COMPONENT_LIBRARY.md](05_COMPONENT_LIBRARY.md)
