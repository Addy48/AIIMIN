---
authority: operations
derived_from: App.js · navItems.js · mobile · native-android · Features Index
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-25
can_override_genesis: false
program: UX-Intelligence-v1
---

# 01 — Surface Inventory

Evidence: `frontend/src/App.js` routes · `frontend/src/constants/navItems.js` · `components/mobile/*` · `native-android/.../ui/*` · vault feature MOCs.

**Maturity key:** shipped · partial · prototype · stub · legal/static  
**Classification:** KEEP · REDESIGN · MERGE · REMOVE · FUTURE

| Name | Purpose | Platforms | Implementation | Maturity | Owner | Genesis authority | Docs | Status | Class |
|------|---------|-----------|----------------|----------|-------|-------------------|------|--------|-------|
| Waitlist landing | Acquire founding/testers | Web public | `WaitlistLanding.jsx` + `components/waitlist/*` | shipped | product | P8 identity/marketing | [[09_FEATURES/Waitlist/Waitlist]] | live | KEEP |
| Brand book | Human Momentum manifesto | Web public | `Brand.jsx` + `brandPage.css` | shipped | product | Brand lockup GOV | Waitlist/Brand notes | live | KEEP |
| Legal — Privacy/Terms/etc. | Compliance | Web public | `pages/legal/*` | shipped | product | P8 privacy | legal pages | live | KEEP |
| Login / auth | Sign-in Google + PIN | Web · Native | `Login.jsx` · `AuthScreen.kt` | shipped | eng | Auth | [[09_FEATURES/Auth/Auth]] | live | KEEP |
| Onboarding | Name OS-ID PIN goals habits | Web | `Onboarding.jsx` | shipped | eng | P8 Ch20 | [[09_FEATURES/Onboarding/Onboarding]] | live | REDESIGN |
| Pending access | Waitlist gate without allowlist | Web | access gate hooks | shipped | eng | Waitlist | Auth/Waitlist | live | KEEP |
| Today (nav label) / Overview (route) | Day surface / hub | Desktop · Tablet | `Overview.jsx` · `/overview` | partial | eng | P8 Day / Ch08 | [[09_FEATURES/Overview/Overview]] | live | REDESIGN |
| Habits | Habit tracking | Desktop · Tablet · `/m` partial | `Habits.jsx` | shipped | eng | Capture | Features Index | live | KEEP |
| Goals | Goals & vision | Desktop · Tablet · Native lite | `Goals.jsx` · `GoalsLiteScreen.kt` | shipped | eng | P8 objects | [[09_FEATURES/Goals/Goals]] | live | KEEP |
| Journal | Reflection capture | Desktop · Tablet · Native | `Journal.jsx` · `JournalScreen.kt` | partial | eng | Capture · P9 flows | [[09_FEATURES/Journal/Journal]] | live | REDESIGN |
| Notes | Notes grid/list | Desktop · Tablet · Native | `Notes.jsx` · `NotesScreen.kt` | shipped | eng | Knowledge | [[09_FEATURES/Notes/Notes]] | live | KEEP |
| Finance | Money OS | Desktop · Tablet | `Finance.jsx` + money tabs | shipped | eng | Objects | Product guide | live | KEEP |
| Family | Family vault people/records | Desktop · Tablet | `Family.jsx` + tabs | shipped | eng | Family | [[09_FEATURES/Family/Family]] | live | KEEP |
| Family Documents | Docs inside Family | Desktop | `DocumentsTab.jsx` | shipped | eng | Family | Family | live | MERGE |
| Calendar | Events + Google sync | Desktop · Tablet | `CalendarPage.jsx` | shipped | eng | P8 calendar | [[09_FEATURES/Calendar/Calendar]] | live | KEEP |
| Career / Placements | Placement pipeline | Desktop | `Placements.jsx` · ATS | shipped | eng | Extensibility | nav Career | live | KEEP |
| Sports | Scores context | Desktop | `Sports.jsx` | shipped | eng | Context | [[09_FEATURES/Sports/Sports]] | live | KEEP |
| Discipline | Streak + urge | Desktop · Native urge | `Discipline.jsx` · `DisciplineUrgeScreen.kt` | partial | eng | P9 initiative | [[09_FEATURES/Discipline/Discipline]] | live | REDESIGN |
| Focus / Pomodoro | Deep work timer | Desktop · Native | `FocusRoom.jsx` · `FocusTimerScreen.kt` | shipped | eng | Focus | Focus page | live | KEEP |
| Lab | Learning experiments | Desktop | `LabFullPage.jsx` + lab modules | shipped | eng | FUTURE growth | Lab | live | FUTURE |
| Reports | Period reports | Desktop | `Reports.jsx` | shipped | eng | Derived read | [[09_FEATURES/Reports/Reports]] | live | KEEP |
| Insights | Insights surface | Desktop | `Insights.jsx` | shipped | eng | Derived | Insights | live | MERGE |
| Identity / Arc | Life arc identity | Desktop | `Identity.jsx` | shipped | eng | Onboarding identity | Identity | live | MERGE |
| Account | Profile/settings hub | Desktop · Mobile lite | `AccountPage.jsx` sections | shipped | eng | Settings P8 Ch19 | Account | live | KEEP |
| Settings | App settings | Desktop · Native | `Settings.jsx` · `SettingsScreen.kt` | shipped | eng | P8 Ch19 | Settings | live | KEEP |
| Capture `/m` | Phone web capture-only | Phone web | `MobileCaptureApp.jsx` · `/m` | shipped | eng | P8/P9 `/m` ceiling | [[09_FEATURES/Mobile/*]] | live | KEEP |
| Mobile score | Score on mobile shell | `/m` related | mobile score styles/routes | partial | eng | `/m` ceiling risk | mobile | live | REDESIGN |
| Native Home | Ritual home | Native | `HomeScreen.kt` | shipped | eng | P9 Phase 4 | WORKFLOW | live | REDESIGN |
| Native Vault | Family/drive vault tab | Native | `VaultScreen.kt` | shipped | eng | Platforms | native | live | KEEP |
| Native More | Overflow | Native | `MoreScreen.kt` | shipped | eng | Nav | native | live | KEEP |
| Biometric gate | Native unlock | Native | `BiometricGateScreen.kt` | shipped | eng | Security | native | live | KEEP |
| Command palette | Global command | Desktop | `CommandPalette.jsx` | shipped | eng | P8 nav/command | Navigation | live | KEEP |
| Notifications UI | In-app notifications | Desktop | `components/notifications` | partial | eng | P8 Ch16 · P9 Ph3 | notifications | live | REDESIGN |
| Empty states | Shared empties | Multi | `EmptyState.jsx` · EmptyIllustrations | partial | eng | P5 empty teach | ui/ | live | REDESIGN |
| Error boundary | Crash UI | Multi | `ErrorBoundary.jsx` | shipped | eng | Recovery | system | live | KEEP |
| Offline banner | Offline notice | `/m` · Native | `MobileOfflineBanner` · SyncBanner | partial | eng | P8 Ch14 | mobile/native | live | REDESIGN |
| Loading skeletons | Loading UI | Desktop | `Skeleton.jsx` | shipped | eng | Calm read | ui/ | live | KEEP |
| Design lab | Internal prototypes | Desktop | `/design-lab` · account Design section | prototype | eng | none (dev) | Account Design | local | REMOVE |
| Seed data | Dev seed | Desktop | `/seed-data` | stub/dev | eng | none | SeedData | local | REMOVE |
| Widgets (Overview) | Today widgets | Desktop | Overview widgets via persona presets | partial | eng | Day surface | navItems widgets | live | REDESIGN |

## Coverage note

User-named domains **Health / Learning / Tasks / AI / Documents** map as: Health⊂Family+sleep components; Learning⊂Lab; Tasks⊂Goals/habits/micro_task widgets; AI⊂Intelligence/CommandPalette/universal-log; Documents⊂Family Documents + Notes. No separate top-level routes found for standalone Health/Learning/Tasks/AI hubs.
