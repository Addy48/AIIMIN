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
