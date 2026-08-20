---
authority: operations
derived_from: App.js · Onboarding · Login · MobileCapture · native screens · P9 flows cite
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-25
can_override_genesis: false
program: UX-Intelligence-v1
---

# 03 — User Journey Inventory

Evidence: routes + page flows. Quality = observed product maturity (not lab scores).

| Journey | Start | End | Actors | Entry | Exit | UX quality | Pain | Missing | Broken / weak |
|---------|-------|-----|--------|-------|------|------------|------|---------|---------------|
| First public visit | `/` waitlist | Submitted / browsed brand | Visitor | `/` | Confirmation / leave | Good marketing | Urgency vs honesty | Product tour | — |
| Brand manifesto | `/brand` | Scroll end / leave | Visitor | Logo mark | Legal links | Strong brand | Long scroll | — | — |
| Sign up / Google | `/login` | Session | User | Login CTA | `/overview` or onboarding | Solid | OAuth env fail | Email verify edge | Callback errors opaque |
| PIN unlock | Login PIN | Session | Returning | Login | App shell | Solid | PIN recover unclear | Recovery UX | — |
| Onboarding | `/onboarding` | Ready for app | New user | Post-auth gate | `/overview` | Partial | Multi-step density | Identity→persona clarity | Guest skip paths |
| Pending access | Auth ok, not allowlisted | Wait state | Waitlisted | Gate | Stay / logout | Functional | Anxiety | ETA clarity | — |
| Daily open Today | `/overview` | Planned day | User | Nav Today / wordmark | Pins / widgets | Partial | Widget overload | Ritual spine | Label Today≠route overview |
| Capture day log | Overview/`/m` | Log saved | User | Logger widget / `/m` | Synced | Good `/m` | Desktop vs `/m` split | Undo | Offline queue UX uneven |
| Note create | `/notes` or native | Note saved | User | Notes | List | Good | Editor depth | Cross-link | — |
| Journal entry | `/journal` · native | Entry saved | User | Journal | Detail | Partial | Studio complexity | Native parity | — |
| Habit check | `/habits` | Habit done | User | Habits | Streak UI | Good | — | Failure state teach | — |
| Goal progress | `/goals` | Updated goal | User | Goals | Vision tree | Good | Hierarchy dense | — | — |
| Task/micro task | Overview widget | Done | User | micro_task widget | Check | Partial | Not full Tasks product | Dedicated tasks IA | — |
| Calendar sync | `/calendar` | Events shown | User | Calendar | Google OAuth | Good when connected | OAuth disconnect | Conflict UI | Sync fail messaging |
| Finance log | `/finance` | Txn saved | User | Finance | Tabs | Good | Tab sprawl | — | Tier lock surprise |
| Family doc | `/family` Documents | Doc stored | Family user | Family | Card | Good | Discoverability | Search | — |
| Discipline urge | Discipline · native | Urge logged | User | Discipline | Cool-down | Partial | Shame vs calm | P9 recovery | — |
| Focus session | `/focus` · native | Session end | User | Focus | Score | Good | Tablet CSS special | — | — |
| AI / command | Command palette / logger | Action | User | ⌘K / logger | Result | Partial | Trust/cost | Confirm AI write | Provider fail |
| Career ATS | `/placements` | App tracked | User | Career pin | Pipeline | Good | Naming Career≠path | — | Tier |
| Account settings | `/account` `/settings` | Prefs saved | User | Account | Stay | Split dual hubs | Account vs Settings | Merge IA | Duplicate destinations |
| Logout | Account/session | Logged out | User | Account | `/` or login | Functional | Confirm | — | — |
| Recovery | Fail/offline | Restored | User | Error/offline | Retry | Weak | Recovery paths | Conflict/recover | Offline incomplete |
| Native first launch | AuthScreen | Home | Native user | Install | Biometric/Home | Partial | Onboarding gap vs web | Ritual onboarding | Web≠native |
| `/m` score peek | `/m/score` | View score | Phone | Bottom nav? | Back capture | Ceiling risk | Analytics on capture shell | Product lock clarity | Ceiling conflict |

## Journey quality rollup

| Quality | Count |
|---------|-------|
| Good / Solid | 10 |
| Partial / Functional | 12 |
| Weak | 2 |
