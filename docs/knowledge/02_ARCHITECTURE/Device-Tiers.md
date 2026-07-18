# Device tiers (phone / iPad / desktop)

## Current state

- Status: phone shell with bottom nav (Today / Score / Account / Get App) + `/m/score` + lite account shipped (local P0)
- Last reviewed: 2026-07-19

## Rules

| Tier | Detection | Experience |
|------|-----------|------------|
| **phone** | iPhone / Android Mobile UA, or width &lt;768 (non-iPad) | `/m` capture shell: Today log, `/m/score` glance, `/m/account` lite. Bottom nav (4 tabs). `/account` redirects to `/m/account`. No full OS bottom nav |
| **tablet** | iPad (incl. iPadOS-as-Mac + touch), or width 768–1099 | **Full Life OS**. Masthead max 8 primary links + More (overflow patch). Touch ≥44px. Journal/Notes drawers ≤1099 |
| **desktop** | width ≥1100 | Full Life OS, wide layouts |

Bypass for testing: `?forceDesktop=1`

## Files

- `frontend/src/hooks/useDeviceTier.js`
- `frontend/src/components/system/DeviceGate.jsx`
- `frontend/src/components/mobile/MobileShell.jsx`
- `frontend/src/components/layout/TabRail.jsx`
- `frontend/src/styles/tabRail.css`
- `frontend/src/components/mobile/MobileBottomNav.jsx`
- `frontend/src/components/mobile/MobileScorePage.jsx`
- `frontend/src/components/mobile/MobileLiteAccount.jsx`
- `frontend/capacitor.config.json`, `frontend/android/`
- `frontend/src/utils/capacitorEnv.js`
- `frontend/src/utils/offlineLogQueue.js`
- `frontend/src/styles/deviceTiers.css`, `careerKanban.css`, `focusRoomTablet.css`
- `frontend/src/App.js` (`/m`, `/m/score`, `/m/account` routes)
- `plans/mobile-ipad-os.md` (active implementation plan)

## Changelog

### 2026-07-19 — Capacitor native polish
- **What:** Post-auth `/m` routing on phone+native; Android hardware back; offline banner; HTTPS network security
- **Why:** Native app login was landing on full OS overview
- **Files:** `mobileEntry.js`, `MobileOfflineBanner.jsx`, `capacitorEnv.js`, `AuthCallback.jsx`, `Login.jsx`, `Onboarding.jsx`, `App.js`
- **Status:** partial (local; device smoke pending)

### 2026-07-19 — Capacitor Android v1 (remote WebView)
- **What:** Capacitor 7 + `frontend/android/`; `server.url` → `https://aiimin.in/m`; native = phone tier; status bar/splash `#1A1A1A`; SW skipped in native; Get App tab hidden
- **Why:** P3 — Android capture shell without Firebase or bundled full OS
- **Files:** `capacitor.config.json`, `frontend/android/`, `capacitorEnv.js`, `useDeviceTier.js`, `MobileBottomNav.jsx`, `registerServiceWorker.js`, `package.json`
- **Status:** partial (scaffold local; Play upload + device smoke pending)

### 2026-07-19 — P2 tablet polish + phone offline queue
- **What:** Career kanban native scroll-snap + dots (arrows removed); Overview two-panel until 899px; mobile score delta/streak copy; waitlist urgency chip + honest testimonials note; Lab typing iPad chip; Focus Room 48px touch targets; `/m` offline log queue (IndexedDB) + sync on reconnect; phone water-btn 44px floor
- **Why:** Audit P2 backlog + continue mobile/iPad OS plan
- **Files:** `Placements.jsx`, `careerKanban.css`, `index.css`, `MobileScorePage.jsx`, `mobileScore.css`, `WaitlistForm.jsx`, `waitlistLanding.css`, `WaitlistTestimonialsSection.jsx`, `LabFullPage.jsx`, `lab.css`, `FocusRoom.jsx`, `focusRoomTablet.css`, `offlineLogQueue.js`, `DailyLogForm.jsx`, `MobileShell.jsx`, `deviceTiers.css`, `lifeScoreEngine.js` (import fix)
- **Status:** partial (local; device smoke pending)

### 2026-07-18 — P1 tablet rail + PWA + waitlist polish
- **What:** `TabRail` on tablet tier; PWA manifest/SW; post-log desktop nudge; waitlist input + pricing grid + launch stepper CSS
- **Why:** Audit P1 backlog
- **Files:** `TabRail.jsx`, `tabRail.css`, `manifest.json`, `sw.js`, `registerServiceWorker.js`, `MobileDesktopNudge.jsx`, `waitlistLanding.css`
- **Status:** partial (local; P2/P3 deferred)

### 2026-07-18 — Phone shell P0 + iPad nav patch
- **What:** Waitlist CTA accent fix; phone `MobileBottomNav` (Today/Score/Account/Get App); `/m/score`; `/m/account` lite; Save Session accent; tablet nav cap 8+More; account tab fade + Life Arc ellipsis
- **Why:** Audit backlog P0 — strategy leak (Habits/Goals on phone nav), brand token violations, iPad nav overflow
- **Files:** `frontend/src/components/mobile/*`, `DeviceGate.jsx`, `Navbar.jsx`, `waitlistLanding.css`, `DailyLogForm.jsx`, `AccountPage.jsx`, `ProfileSection.jsx`, `subscriptionSection.css`
- **Status:** partial (P0 local; P1 rail/PWA/Capacitor deferred)
