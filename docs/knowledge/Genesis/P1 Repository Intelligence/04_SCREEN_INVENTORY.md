---
Purpose: Every screen (web routes, mobile /m, native Compose) with purpose, nav, users, actions, data, states.
Confidence: 0.90 (web routes); 0.75 (native — screen list verified, prop/state depth partial)
Generated From: frontend/src/App.js; nav inventories; native *Screen.kt list; mobile README
Dependencies: [03_FEATURE_INVENTORY.md](03_FEATURE_INVENTORY.md), [06_NAVIGATION_GRAPH.md](06_NAVIGATION_GRAPH.md)
Consumers: [05_COMPONENT_LIBRARY.md](05_COMPONENT_LIBRARY.md), design passes 2–6
Last Updated: 2026-07-22
Pass: 1/6
---

# 04 — Screen Inventory

Shared fields used below:

- **Primary user:** Owner / Tester / Public / Guest
- **Permissions:** Auth, waitlist access, email verified, tier minimum
- **Offline:** Web generally online-first unless noted; native Room-backed

---

## A. Public / auth screens (web)

### `/` — WaitlistLanding OR redirect

| Field | Value |
|-------|-------|
| Purpose | Marketing waitlist OR bounce into app/login |
| Navigation | Entry; CTAs to login / brand / legal |
| Primary user | Public |
| Primary action | Reserve spot / sign in |
| Secondary | Feedback, theme toggle, pricing |
| Inputs | Waitlist form fields |
| Outputs | Position, referral code → `localStorage` `aiimin_waitlist` |
| Data sources | `/api/waitlist`, `/api/waitlist/count` |
| States | Waitlist mode on/off; signed-in pending |
| Loading / Offline / Errors | Form pending; network toast patterns |
| Permissions | Public |
| Related | `/brand`, `/login`, pending screen |
| Components | `components/waitlist/**` |

### `/login/*` — Login

| Field | Value |
|-------|-------|
| Purpose | Email/password + Google + OS-ID flows |
| Primary action | Authenticate |
| Data sources | Better Auth `/api/auth/*` |
| Permissions | Public |
| Notes | Forces light theme via ThemeContext |

### `/auth/callback` — AuthCallback

OAuth return handler → post-auth path (`mobileEntry.js`: phone → `/m` else `/overview`).

### `/verify-email` — VerifyEmail

Session required; blocks unverified users from app writes/pages per guard.

### `/onboarding` — Onboarding

Life Arc / onboarding stages; ArcGuard redirects here when arc missing.

### Legal: `/privacy` `/terms` `/data-deletion` `/security` `/about` `/contact`

Public; `LegalLayout`; no auth.

### `/brand` — Brand

Public brand book (Human Momentum). Logo mark always navigates here. Waitlist theme sync applies with `/`.

---

## B. Mobile capture shell `/m`

Parent: `MobileShell` + `EmailVerifiedGuard` + access.

| Route | Purpose | Primary action | Data | Components |
|-------|---------|----------------|------|------------|
| `/m` | Daily capture | Log metrics | daily-logs, habits | `MobileCaptureApp` |
| `/m/score` | Score glance | View XP/score | user_xp / life score | `MobileScorePage` |
| `/m/account` | Lite account + theme | Toggle theme, account links | profile | `MobileLiteAccount` |

Bottom nav: Today / Score / Account / optional Get App.

**Product lock:** no analytics, insights, pomodoro, tools on `/m`.

Offline: `MobileOfflineBanner`.

Phone `/account` redirects to `/m/account`.

---

## C. Dashboard Life OS screens (web)

All under `DashboardLayout` unless noted. Auth + access + verified.

| Route | Page file | Purpose | Primary action | Tier | Data sources (primary) |
|-------|-----------|---------|----------------|------|------------------------|
| `/overview` | Overview.jsx | Today OS | Capture + review widgets | explore | dashboard, daily-logs, widgets |
| `/insights` | Insights.jsx | **Redirect** to `/reports?tab=…` | — | — | — |
| `/calendar` | CalendarPage.jsx | Schedule | Create/edit events; sync | explore | `/api/calendar` |
| `/sports` | Sports.jsx | Scores/news | Refresh | core | `/api/sports` |
| `/journal` | Journal.jsx | Reflect | Write modes | explore | `/api/journal` |
| `/finance` | Finance.jsx | Money OS | CRUD money/wealth | core | `/api/wealth` |
| `/settings` | Settings.jsx | Legacy settings | Edit prefs | explore | account APIs |
| `/lab` | LabFullPage.jsx | Skill lab | Run modules | core | `/api/lab` |
| `/placements` | Placements.jsx | Career | Applications + ATS | core | placements, ats |
| `/habits` | Habits.jsx | Habits | CRUD + log | core | `/api/habits` |
| `/goals` | Goals.jsx | Goals | CRUD goals | core | `/api/goals` |
| `/identity` | Identity.jsx | Identity stack | Edit identity UI | explore | local/profile |
| `/notes` | Notes.jsx | Notes OS | CRUD + Drive/OCR | explore | `/api/notes` |
| `/discipline` | Discipline.jsx | Urge/streak | Log urge/reset | core | `/api/discipline` |
| `/focus` | FocusRoom.jsx | Deep work | Start session | core | `/api/focus` |
| `/family` | Family.jsx | Family vault | CRUD entities (9 tabs) | pro | `/api/family` |
| `/account` | account/AccountPage.jsx | Settings hub | `?section=` | explore | `/api/account`, billing |
| `/reports` | Reports.jsx | Intelligence | View tabs report/patterns/skills | explore paywall | `/api/intelligence` |
| `/seed-data` | SeedData.jsx | Dev seed | Seed demo | explore | admin/db |

### Account sections (`?section=`)

profile · personalization · design · notifications · privacy · subscription · data · legal

Design section hidden on narrow mobile widths.

### Common dashboard states

| State | Mechanism |
|-------|-----------|
| Loading | Skeletons (`ui/Skeleton`, Shipped loaders), React Query `isLoading` |
| Empty | `EmptyState` + illustrations |
| Errors | toasts, ErrorBoundary, StatusAlert |
| Guest | GuestGate overlays; some nav items `hideFromGuest` |
| Tier blocked | `TierRouteGuard` / FeatureGate |

---

## D. Native Android screens

| Screen | File | Purpose | Primary action |
|--------|------|---------|----------------|
| Auth | `ui/auth/AuthScreen.kt` | Sign in | OS-ID + PIN / session |
| Biometric gate | `BiometricGateScreen.kt` | Unlock | Biometric |
| Home | `ui/home/HomeScreen.kt` | Today companion | Bootstrap data |
| Journal list | `JournalScreen.kt` | Entries | Open/create |
| Journal detail | `JournalDetailScreen.kt` | Edit entry | Save → outbox |
| Notes | `NotesScreen.kt` | Notes | CRUD sync |
| Vault | `VaultScreen.kt` | Vault docs | View family/docs lite |
| Goals lite | `GoalsLiteScreen.kt` | Goals glance | View/edit lite |
| Focus timer | `FocusTimerScreen.kt` | Timer | Run focus |
| Discipline urge | `DisciplineUrgeScreen.kt` | Urge flow | Start/resolve |
| More | `MoreScreen.kt` | Hub | Navigate tools |
| Settings | `SettingsScreen.kt` | Prefs | Theme, security |

Chrome: `ScreenChrome.kt`. Shell under `ui/shell`.

Data: Room + `/api/mobile/bootstrap` + `/api/mobile/sync/batch`. Offline: outbox + WorkManager.

---

## E. Overlay-only “screens” (not routes)

Documented in [06_NAVIGATION_GRAPH.md](06_NAVIGATION_GRAPH.md): CommandPalette, ProductTour, GuestTour, FeedbackWidget, page modals (Finance, Family×9, Discipline urge, PulseCheck, EventModal, etc.).

---

## Cross-references

- Nav graph → [06_NAVIGATION_GRAPH.md](06_NAVIGATION_GRAPH.md)
- Components → [05_COMPONENT_LIBRARY.md](05_COMPONENT_LIBRARY.md)
