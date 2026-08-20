# DESIGN.md

Visual system for AIIMIN product UI. Canonical palette: `docs/knowledge/08_DESIGN/Palette.md`.

## Theme

Dark-first Life OS. Restrained product register. 1px borders over heavy drop-shadow cards on reference surfaces (Notes). Editorial measure on Journal prose.

## Colors (locked)

| Token | Dark | Light | Role |
|-------|------|-------|------|
| bg | `#1a1a1a` | `#f9f9f9` | App background |
| surface | `#2d2d2d` | `#ffffff` | Cards / panels |
| accent | `#ff6b35` | `#ff6b35` | Primary action / selection |
| done | `#10b981` | `#10b981` | Completion |
| muted | `#6b7280` | `#6b7280` | Incomplete / quiet |

Do not invent brand colors without explicit approval.

## Typography

Product sans via app tokens (`text-h*`, `text-body`, `text-label`). Journal prose may use serif for read/write canvas only (`--font-serif`). Measure ~62–70ch.

## Components

- Chips / pills: 999px radius, 1px border, accent-dim when selected
- Capture row: bordered input cluster, 44px icon buttons on touch tiers
- Drawers: slide-over below ~900px (iPad / Split View)

## Layout

- Desktop Journal/Notes: list/history rail + main
- ≤900px: rail becomes slide-over drawer; capture stays above fold
- Test widths: 500, 600, 768, 1024 (Split View real target = 500–600)

## Motion

150–250ms UI. Opacity + transform only. Ease-out. Max 2–3 intentional motions per surface. No hover-lift card carnivals on dense lists.
