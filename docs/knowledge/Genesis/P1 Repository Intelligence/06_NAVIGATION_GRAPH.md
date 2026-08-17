---
Purpose: Complete navigation graph — routes, guards, nav surfaces, modals, deep links, entry/exit.
Confidence: 0.92
Generated From: App.js; constants/navItems.js; Navbar; TabRail; BottomNav; MobileBottomNav; CommandPalette; DeviceGate; tierGating.js
Dependencies: [04_SCREEN_INVENTORY.md](04_SCREEN_INVENTORY.md)
Consumers: Codex implementing nav-safe changes; [11_TECHNICAL_DEBT.md](11_TECHNICAL_DEBT.md)
Last Updated: 2026-07-22
Pass: 1/6
---

# 06 — Navigation Graph

## Entry points

| Entry | Condition | Lands on |
|-------|-----------|----------|
| `https://aiimin.in/` | Waitlist mode + no access | WaitlistLanding |
| `/` | Has access / waitlist off | Redirect post-auth or `/login` |
| OAuth callback | Google login | `/auth/callback` → `/m` or `/overview` |
| Capacitor WebView | Installed shell | Remote `/m` |
| Native cold start | App icon | Auth → Biometric → Home |
| Deep link brand | Logo mark click | `/brand` |
| Wordmark click | Navbar | `/overview` (**LOCKED** split) |
| `?forceDesktop=1` | DeviceGate bypass | Stay on desktop routes on phone UA |

## Exit points

| Exit | Destination |
|------|-------------|
| Logout | `/api/auth/logout` → login / waitlist |
| Unverified | `/verify-email` |
| No Life Arc | `/onboarding?arc=1` |
| Phone UA on desktop path | `/m` (or `/m/account`) |
| Catch-all `*` | `/` or `/overview` or `/login` |
| `/design-lab` | `/account?section=design` |
| `/insights` | `/reports?tab=patterns|skills` |

---

## Guard flowchart

```mermaid
flowchart TD
  Hit[Route hit] --> AuthLoad{Auth loaded?}
  AuthLoad -->|no| Spin[Loading]
  AuthLoad -->|yes| Access{canAccessApp?}
  Access -->|waitlist pending| Pending[WaitlistPendingScreen]
  Access -->|ok or public| Device{DeviceGate phone?}
  Device -->|yes and not /m| M[/m]
  Device -->|no| Email{Verified?}
  Email -->|no| VE[/verify-email]
  Email -->|yes| Layout{Dashboard?}
  Layout -->|yes| Arc{Has Life Arc?}
  Arc -->|no| Onb[/onboarding]
  Arc -->|yes| Tier{TierRouteGuard}
  Tier --> Page[Page]
```

---

## Masthead NAV_REGISTRY (`constants/navItems.js`)

Pinned/customizable via Account → Personalization (`NavPinEditor`).

```text
overview → /overview (Today)
habits → /habits
goals → /goals
journal → /journal
notes → /notes
finance → /finance
family → /family
calendar → /calendar
placements → /placements (Career)
sports → /sports          hideFromGuest
discipline → /discipline  hideFromGuest
focus → /focus
lab → /lab
reports → /reports
```

**Not in registry:** `/insights`, `/identity`, `/settings`, `/account`, `/seed-data`.

Navbar extras: notifications bell, theme toggle, avatar → `/account`, More menu, mobile drawer.

BrandLockup: mark → `/brand`; text → `/overview`.

---

## Tablet TabRail

File: `layout/TabRail.jsx`

Primary fixed order: overview, habits, goals, journal, notes, finance, reports, focus  
Secondary: remaining in More  
Footer: CommandPalette + avatar → `/account`

## Dashboard BottomNav

File: `layout/BottomNav.jsx` — first 4 pins + More sheet; `!isPhone` only (phone already on `/m`).

## Mobile BottomNav

Today `/m` · Score `/m/score` · Account `/m/account` · Get App (conditional).

## Account section graph

```text
/account?section=profile|personalization|design|notifications|privacy|subscription|data|legal
```

## Command Palette destinations

`/overview`, `/habits`, `/goals`, `/discipline`, `/journal`, `/focus`, `/notes`, `/calendar`, `/finance`, `/lab`, `/lab?module=speaking`, `/family`, `/reports`, `/reports?tab=patterns`, `/placements`, `/settings`, `/sports`, `/account`

---

## Full route list (web)

See also [04_SCREEN_INVENTORY.md](04_SCREEN_INVENTORY.md).

```text
Public:  /  /login/*  /auth/callback  /privacy /terms /data-deletion /security /about /contact /brand
Auth:    /verify-email  /onboarding
Mobile:  /m  /m/score  /m/account
App:     /overview /insights /calendar /sports /journal /finance /settings /lab /placements
         /habits /goals /identity /notes /discipline /focus /family /account /reports /seed-data
Redirect:/design-lab → account?section=design
Catch:   *
```

Lab modules: **query** `?module=` (not nested routes).

Reports tabs: `?tab=report|patterns|skills`.

Journal: `?mode=`.

---

## Modals / sheets / overlays

### App-level

| Overlay | Trigger |
|---------|---------|
| ProductTour | Authed; `window.startProductTour()` |
| GuestTour | Guest surfaces |
| FeedbackWidget | Authed (+ waitlist public) |
| CommandPalette | Keyboard / TabRail search |
| ConfirmDialog | `utils/confirm.jsx` |
| NotifDropdown | Navbar bell |
| Nav drawer / BottomNav More | Narrow layouts |

### Page-level (mounted)

| Page | Overlays |
|------|----------|
| Overview | PulseCheckModal |
| Discipline | StartRecoveryModal, ResetModal, DisciplineUrgeModal |
| Finance | Account/Entry/Asset/Budget/Import modals |
| Goals | GoalModal |
| Habits | AddModal |
| Calendar | EventModal |
| Family | 9 entity modals |
| Placements | ApplicationIntakeModal, ResumeArchiveModal |
| Journal | History drawer |
| Lab | Module fullscreen via query |

### Unmounted overlay files (exist; no import found this pass)

AccountModal · PostPurchaseModal · TriggerModal · UrgeOutcomeSheet · ReportPreviewModal · PostSessionReflection · LevelUpModal

---

## Orphan navigation

`layout/Sidebar.jsx` links `/systems/physical|cognitive|behavior|reflection` — **no routes**; component **not imported**.

---

## Native navigation

Bottom tabs: Home · Journal · Notes · Vault · More → Settings / Focus / Goals / Discipline as secondary destinations per package structure.

Auth stack: AuthScreen → BiometricGateScreen → main shell.

---

## Deep links / special query params

| Param | Effect |
|-------|--------|
| `forceDesktop=1` | Skip phone redirect |
| `section=` | Account section |
| `tab=` | Reports tab |
| `module=` | Lab module |
| `mode=` | Journal mode |
| `arc=1` | Onboarding arc emphasis |

---

## Cross-references

- Tier minima → `frontend/src/utils/tierGating.js` (also [03_FEATURE_INVENTORY.md](03_FEATURE_INVENTORY.md))
- Brand lock → product locks / Palette
