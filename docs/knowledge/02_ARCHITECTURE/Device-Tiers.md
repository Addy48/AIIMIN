# Device tiers (phone / iPad / desktop)

## Current state

- Status: phone capture `/m` + tablet full OS shell shipped (local)
- Last reviewed: 2026-07-14

## Rules

| Tier | Detection | Experience |
|------|-----------|------------|
| **phone** | iPhone / Android Mobile UA, or width &lt;768 (non-iPad) | `/m` capture-only daily log. Native app coming. No analytics / pipelines / focus room |
| **tablet** | iPad (incl. iPadOS-as-Mac + touch), or width 768–1099 | **Full Life OS**. Masthead stays visible (scrollable links). Touch ≥44px. Journal/Notes drawers ≤1099 |
| **desktop** | width ≥1100 | Full Life OS, wide layouts |

Bypass for testing: `?forceDesktop=1`

## Files

- `frontend/src/hooks/useDeviceTier.js`
- `frontend/src/components/system/DeviceGate.jsx`
- `frontend/src/components/mobile/MobileCaptureApp.jsx`
- `frontend/src/styles/deviceTiers.css`, `mobileCapture.css`
- `frontend/src/App.js` (`/m` route)

## Changelog

See [[../09_FEATURES/Index]] + Home; details in Current Context.
