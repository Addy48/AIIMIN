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

- Entry: mobile app components under `frontend/src/components/mobile/`
- Rule: data collection only — no analytics/tools

## Waitlist UI

- Orchestrator: `WaitlistLanding.jsx`
- Modules: `frontend/src/components/waitlist/landing/*`
- Styles: `waitlistLanding.css`

## Related

- [[Overview]]
- [[05_FRONTEND/Frontend-Map]]
- [[08_DESIGN/Palette]]
