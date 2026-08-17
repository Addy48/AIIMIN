---
authority: operations
derived_from: 09_FEATURES/Index · server/routes · App.js
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-25
can_override_genesis: false
program: UX-Intelligence-v1
---

# 02 — Feature Inventory

Statuses from Features Index + code presence. Completion % = engineering judgment from vault status strings (not measured coverage).

| Domain | Feature | Purpose | Implementation | % | Deps | Surfaces | Genesis | P9 | Status | Priority |
|--------|---------|---------|----------------|---|------|----------|---------|-----|--------|----------|
| Access | Waitlist gate | Public queue | waitlist routes + landing | 90 | Resend, DB | `/` | P8 identity | — | Implemented | P0 launch |
| Access | Auth Better Auth | Session + Google | auth routes, Login | 90 | OAuth env | login | Auth locks | — | Implemented | P0 |
| Access | Onboarding | Identity formation | Onboarding.jsx | 80 | Auth | /onboarding | P8 Ch20 | flows | Partial | P0 |
| Day | Today/Overview | Daily hub | Overview.jsx | 75 | many APIs | /overview | P8 Day | Ph4 | Partial | P0 |
| Capture | Daily Log | Day metrics | dailylog components + API | 85 | dailyLogs | Overview/m | Capture | Ph2 | Implemented | P0 |
| Capture | Universal logger | AI log router | intelligence API | 70 | AI keys | Overview | P8 AI | Ph1–2 | Partial | P1 |
| Habits | Habits CRUD | Consistency | Habits + habits API | 90 | DB | /habits | objects | — | Implemented | P0 |
| Goals | Goals pipeline | Direction | Goals + API | 85 | DB | /goals | objects | — | Implemented | P0 |
| Journal | Journal studio | Reflection | Journal.jsx + API | 65 | journal API | /journal · native | capture | Ph2 | Partial | P0 |
| Notes | Notes | Quick notes | Notes.jsx · native | 80 | notes API | /notes | knowledge | — | Implemented | P1 |
| Money | Finance | Transactions/budgets | Finance + wealth | 85 | wealth API | /finance | objects | — | Implemented | P1 |
| Family | Family vault | People/docs/health | Family.jsx | 85 | family API | /family | family | — | Implemented | P1 |
| Calendar | Google sync | Events | Calendar + OAuth | 80 | googleAuth | /calendar | Ch14 sync | Ph4 | Implemented | P0 |
| Career | Placements/ATS | Job hunt | Placements + ats | 75 | ats API | /placements | extensibility | — | Implemented | P2 |
| Sports | Scoreboard | Context | Sports + cache | 80 | cricket keys | /sports | — | — | Implemented | P2 |
| Discipline | Streak + urge | Willpower | Discipline + urge API | 70 | discipline | /discipline · native | non-negotiables | Ph3 | Partial | P0 |
| Focus | Pomodoro | Deep work | FocusRoom + focus API | 85 | focus | /focus · native | — | — | Implemented | P1 |
| Lab | Lab modules | Skill practice | lab components | 70 | lab API | /lab | FUTURE | — | Experimental | P3 |
| Growth | Life Score / gamification | Score + XP | growth + gamification | 75 | lifeScore | Overview | honest score | — | Partial | P1 |
| Intelligence | AI providers | Insights/log | intelligence routes | 70 | multi AI env | Command/Overview | P8 Ch07/17 | Ph1 | Partial | P1 |
| Reports | Period reports | Derived read | Reports.jsx | 70 | report services | /reports | derived | — | Partial | P2 |
| Insights | Insights page | Derived | Insights.jsx | 60 | analytics | /insights | derived | — | Partial | P2 |
| Account | Personalization | Personas/nav pins | Account sections | 85 | prefs | /account | Ch18 | — | Implemented | P1 |
| Account | Subscriptions | Billing tiers | Subscription section | 50 | Stripe env | account | Ch21 | — | Partial/stub | P1 launch |
| Mobile | `/m` capture | Phone capture | MobileCaptureApp | 80 | DeviceGate | /m | `/m` ceiling | Ph4 | Implemented | P0 |
| Native | Native V2 companion | Offline-first | Compose screens | 92 | mobile.js | native | Ch13 | Ph4 | Partial | P0 |
| System | Command palette | Quick actions | CommandPalette | 75 | nav | global | nav | — | Implemented | P1 |
| System | Notifications | Notices | notifications components | 40 | notifications API | various | Ch16 | Ph3 | Partial | P1 |
| Dev | Design lab / seed | Internal | /design-lab /seed-data | 30 | — | dev | — | — | Deprecated/dev | REMOVE |
| Legal | Legal pages | Compliance | legal/* | 90 | — | public | privacy | — | Implemented | P0 |

## Rollup

| Status | Count (approx) |
|--------|----------------|
| Implemented | 18 |
| Partial | 12 |
| Experimental | 1 |
| Deprecated/dev | 2 |
