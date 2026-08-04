# Report Prototypes

## Locks (2026-07-17)

| Tier | Locked direction | Notes |
|------|------------------|-------|
| **Core · Snapshot** | **Ivory Light** + **Ivory Dark** | Follows app theme. Device layouts: Phone / iPad / Laptop |
| **Pro · Standard** | **Folio Life OS** | Academic Folio + Life OS identity |
| **Elite · Deep** | **Paused** | Not locked. Still missing the right artifact |

## Elite pause constraints (for later)

- Do **not** dump raw “Appendix A” daily tables at the user — feels like noise, not a premium artifact
- Single-page “architecture skins” rejected
- Multipage science packs still didn’t feel like *the* Elite report
- Resume only with a clearer job-to-be-done + craft bar, not more font swaps

## Core device shells

Matches [[02_ARCHITECTURE/Device-Tiers]]:

| Device | Exact viewport (CSS px) | Bezel |
|--------|-------------------------|-------|
| Phone | **390×844** (iPhone 14 logical) | Rounded phone + notch |
| iPad | **1024×768** landscape | Tablet bezel + side cam |
| Laptop | **1440×900** | Window chrome + traffic lights |

Preview **scales the whole frame** to fit your browser — layout math stays at those pixels (not full-window fakes).

### 2026-07-17 — Real device viewports
- **What:** Phone/iPad/Laptop now render inside fixed-resolution bezels with scale-to-fit
- **Why:** Prior “device” modes only restyled drawer on full browser — didn’t look like those resolutions
- **Files:** `device-frames.css`, `preview.js`, `snapshot.js`, `snapshot-all.css`
- **Status:** locked Core polish



Preview: open Ivory Light/Dark → **Phone / iPad / Laptop** buttons in chrome.

## Open

```bash
cd prototypes/reports && python3 -m http.server 8765
```

→ http://localhost:8765

## Production mapping (2026-07-17)

| Plan | Live product |
|------|----------------|
| Core+ | Ivory Snapshot on `/reports` (7d) |
| Pro+ | Snapshot + Folio PDF + Patterns/Skills |
| Elite | Same as Pro for now — Deep paused |

## Changelog

### 2026-07-17 — Production wire Core/Pro
- **What:** Locked directions live on `/reports`; Elite Deep still paused
- **Status:** shipping

### 2026-07-17 — Lock Core + Pro; pause Elite; Core device tiers
- **What:** Locked Ivory Light/Dark + Folio Life OS; Elite paused; Core phone/tablet/laptop prototype shells; no raw appendix for users (design rule)
- **Why:** User locked Core/Pro; Elite not right yet; Core looked phone-only
- **Files:** `prototypes/reports/**`, this note, Current Context
- **Status:** Core/Pro locked · Elite paused
