---
Purpose: Document AIIMIN color system — locked palette, semantics, dark/light, conflicts, emotional meaning.
Confidence: 0.93
Evidence Sources: Palette.md; DESIGN.md; tokens.css themes; themes.js; Theme.kt; brandPage.css; craft Track I
Files Used: docs/knowledge/08_DESIGN/Palette.md; DESIGN.md; frontend/src/styles/tokens.css; frontend/src/constants/themes.js; native-android/.../Theme.kt; frontend/src/pages/brandPage.css
Reasoning: Color is the primary recognition channel; semantic clarity is the difference between brand and decoration.
Dependencies: 02, 12, 14
Consumers: All UI work; theme agents; native theming
Known Unknowns: Live user theme preference distribution; WCAG matrix not re-measured this pass for every pair
Last Updated: 2026-07-22
Pass: 4/6
---

# 04 — Color System

## Locked product palette (law)

From `docs/knowledge/08_DESIGN/Palette.md` + product locks:

### Dark

| Role | Hex | Meaning |
|------|-----|---------|
| Background | `#1a1a1a` | App canvas |
| Cards / surface | `#2d2d2d` | Elevated work surface |
| Accent | `#ff6b35` | Action, selection, brand ember |
| Completion | `#10b981` | Done / success |
| Incomplete / muted | `#6b7280` | Quiet / incomplete |

### Light

| Role | Hex | Meaning |
|------|-----|---------|
| Background | `#EDE4D3` | Warm ivory canvas |
| Elevated soft | `#F7F1E6` | Secondary panels |
| Cards | `#ffffff` | Surfaces |
| Body text | `#14171A` | Charcoal ink |
| Accent | `#ff6b35` (calm `#E85A24` OK) | Action |
| Completion | `#10b981` | Done |
| Muted | `#6b7280` | Quiet |

**Contrast lock:** `#14171A` on `#EDE4D3` ≥ 4.5:1 for body.

**Do not** invent new brand colors without founder approval.

## Canonical runtime themes

`themes.js`: only `aiimin-dark` and `aiimin-light`. Legacy IDs alias into these.

### `aiimin-dark` (tokens.css) — slight drift from Palette.md

| Token | Hex |
|-------|-----|
| base | `#14171A` |
| surface | `#1E2228` |
| elevated | `#262B33` |
| accent | `#FF6B35` |
| success | `#10B981` |
| text-1 | `#F0EDE8` |

### `aiimin-light`

| Token | Hex |
|-------|-----|
| base | `#EDE4D3` |
| surface | `#FFFFFF` |
| elevated | `#F7F1E6` |
| accent | `#E85A24` |
| success | `#1E5C3A` |

Native dark **matches** Palette.md (`#1A1A1A` / `#2D2D2D`). Web dark is a **graphite refinement** — document as intentional drift or reconcile.

## Semantic colors (observed)

| Semantic | Typical hex | Meaning status |
|----------|-------------|----------------|
| Success / done | `#10B981` / light `#1E5C3A` | **Meaningful** |
| Warning | `#FACC15` / `#D97706` | Meaningful |
| Danger | `#EF4444` / `#DC2626` | Meaningful |
| Info | `#3B82F6` / `#1D4ED8` | Meaningful but overused in charts |
| Gym / rust | `#E2725B` | Domain tint |
| Water | blue family | Domain tint |
| Sleep | yellow family | Domain tint |
| Tier metals | diamond/platinum/gold… | Gamification — keep contained |
| Purple card tint | `#8B5CF6` / purple rgba | **Decorative / slop** |

## Legacy themes still in tokens.css (debt)

| Theme | Accent | Risk |
|-------|--------|------|
| `:root` / `vercel` | `#22C55E` forest | **Brand inversion** if theme attr missing |
| `nordic` | `#1E5C3A` | Green-as-brand |
| `studio` | `#000000` | Notion pastiche |
| `midnight` | `#00F0FF` | Cyber aesthetic |

## Emotional meaning

| Color | Intended emotion | When violated |
|-------|------------------|---------------|
| Burnt orange | Urgency with warmth — act now | Used as wallpaper → fatigue |
| Green | Closure, integrity of completion | Used as primary brand → fitness-app confusion |
| Ivory | Human paper, editorial calm | Replaced by cool gray → generic |
| Charcoal | Focused control room | Pure black void → Vercel clone |
| Purple | *None in DNA* | Appears → “AI SaaS” |

## Dark / light philosophy

- **Dark-first** product (`DESIGN.md`)
- Brand manifesto `/brand` is **always light ivory** — intentional exception
- Native: system default + user override in Settings
- Craft Track I: light ivory work must **not** mutate dark tokens

## Accessibility notes

- AA body contrast locked for ivory/charcoal
- Native: color-blind safe streak states should use shape+color (vault intent)
- Do not rely on green alone for “done” without icon/check

## Board challenge

- **Color Scientist:** Three “official” dark bases (`#1a1a1a`, `#14171A`, `#0A0A0A`) is an identity bug. Pick one canonical and demote others to legacy aliases.
- **Brand Design Director:** Light accent calm `#E85A24` is fine for large fills; hot `#ff6b35` for ember moments — document as intentional duo, not inconsistency.
- **Accessibility Expert:** Rainbow chart palettes (growth correlations include purple/indigo) undermine semantic trust — prefer sequential brand-adjacent scales.

## Verdict

Colors **have meaning** when canonical theme is active. Colors become **decorative** when purple/domain rainbows and legacy green themes leak.
