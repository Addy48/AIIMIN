---
authority: engineering
derived_from: Genesis/P8 Master Specification
status: active
owner: eng
lifecycle: living
last_reviewed: 2026-07-25
can_override_genesis: false
knowledge_layer: KL-BUILD
graph_role: leaf
note_type: NT-ENG-LEAF
migration_batch: W4
fm_source: script
---
# Frontend Architecture

## Stack

- React 19 + Tailwind CSS
- Pages under `frontend/src/pages/`
- Components under `frontend/src/components/`
- Hooks: `useAuth`, `useTheme`, `useFeatureFlag`, `useNotifications`, query hooks
- Services: API clients under `frontend/src/services/`
- Utils: `api.js`, theme, toast, xp/sound engines where still used

## Key pages (non-exhaustive)

Overview, Habits, Goals, FocusRoom, Journal, Finance, CalendarPage, Sports, AccountPage, Discipline, Insights, Placements, WaitlistLanding, Login, Onboarding, Brand

## Mobile

- Phone web: `/m` capture-only (`MobileCaptureApp`) — DeviceGate redirects phones away from full OS
- iPad / tablet: full Life OS — [[02_ARCHITECTURE/Device-Tiers]]
- Rule: phones collect; tablets/desktops command

## Waitlist UI

- Orchestrator: `WaitlistLanding.jsx`
- Modules: `frontend/src/components/waitlist/landing/*`
- Styles: `waitlistLanding.css`

## Related

- [[Overview]]
- [[05_FRONTEND/Frontend-Map]]
- [[08_DESIGN/Palette]]
