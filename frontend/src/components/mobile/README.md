# Mobile capture + Capacitor (isolated surface)

Phone web (`/m/*`) and Android WebView shell. **Not** the full Life OS.

| Route | Component |
|-------|-----------|
| `/m` | `MobileCaptureApp` |
| `/m/score` | `MobileScorePage` |
| `/m/account` | `MobileLiteAccount` |
| shell | `MobileShell` + `MobileBottomNav` |

Shared wiring (keep mobile commits small): `DeviceGate`, `useDeviceTier`, `mobileEntry.js`, `App.js` routes.

Android: `frontend/capacitor.config.json`, `frontend/android/`, `npm run cap:build:android`.

Split commits: `plans/mobile-commit-split.md`.
