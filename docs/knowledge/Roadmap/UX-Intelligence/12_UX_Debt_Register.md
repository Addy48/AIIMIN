---
authority: operations
derived_from: UX-Intelligence 01–11 · Program-0 · Palette eng lag · P9 cite
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-25
can_override_genesis: false
program: UX-Intelligence-v1
---

# 12 — UX Debt Register

Severity: S0 blocker · S1 high · S2 med · S3 low

| ID | Description | Location | Evidence | Impact | Sev | Users | Genesis | Handling | Priority |
|----|-------------|----------|----------|--------|-----|-------|---------|----------|----------|
| D01 | Today label ≠ `/overview` | Masthead | navItems.js | Confusion | S1 | All desktop | P8 Day naming | Align label/route in UX Arch | P0 |
| D02 | Career ≠ placements | Masthead | navItems.js | Confusion | S2 | Career users | — | Align naming | P1 |
| D03 | Account + Settings dual hubs | `/account` `/settings` | App.js | Duplicate IA | S1 | All | P8 Ch19 | MERGE decision | P0 |
| D04 | Insights/Identity off nav | Routes only | App.js vs NAV_REGISTRY | Orphans | S2 | Power users | Derived | MERGE or pin | P1 |
| D05 | `/m/score` vs capture ceiling | `/m/score` | App.js · product lock | Doctrine conflict | S1 | Phone | `/m` ceiling | Founder resolve | P0 |
| D06 | Overview widget overload | Overview | persona widgets | Cognitive load | S1 | Daily users | Day spine | REDESIGN Today | P0 |
| D07 | Empty/error voice not constitutional | Domains | EmptyState uneven | Trust | S2 | All | P5 empty teach | Message kit | P1 |
| D08 | Desktop offline weak | Desktop | vs MobileOfflineBanner | Fail opacity | S1 | Travel users | P8 Ch14 | State kit | P1 |
| D09 | Conflict states missing | Sync surfaces | State inventory | Data loss fear | S1 | Sync users | Sync | Conflict UX | P1 |
| D10 | Undo absent | Global | Interaction inventory | Error recovery | S1 | All | Recovery | Interaction Arch | P1 |
| D11 | Metric card triplication | ui/* | HeroMetric/MetricTile/Metric | Visual debt | S3 | — | Visual | DS merge | P2 |
| D12 | Charts + kokonutui dual language | charts · kokonutui | dir counts | Inconsistent look | S2 | Analytics users | Visual | Audit/KEEP | P2 |
| D13 | tokens.css Nordic legacy language | styles | header comments/history | Eng drift | S2 | Eng | P8 Visual | Token cleanup | P1 |
| D14 | Light theme parity unverified | Themes | Palette note | Light users | S2 | Light mode | P8 | Visual audit | P2 |
| D15 | Reduced motion not global | App CSS | brand only | Vestibular | S2 | A11y | Motion | Global prefer | P1 |
| D16 | Notifications immature | notifications | Feature % ~40 | Missed signals | S1 | All | P8 Ch16 · P9 Ph3 | Build states | P1 |
| D17 | Subscription UX stub | Account | Feature inventory | Monetization | S1 | Paying | Ch21 | Launch P | P1 |
| D18 | Sidebar.jsx legacy | components | file exists | Doctrine drift | S3 | — | Nav no sidebar | REMOVE/confirm | P2 |
| D19 | Dev routes in prod router | seed-data · design-lab | App.js | Leak risk | S2 | Prod | — | REMOVE/gate | P1 |
| D20 | Native≠web journey gap | Native vs web | Journey inventory | Fragmented OS | S1 | Native users | P9 Ph4 | Companion IA | P0 |
| D21 | Tier lock messaging | TierRouteGuard | App routes | Frustration | S2 | Free tier | Pricing | CTA kit | P1 |
| D22 | AI confirm-write uneven | Logger/palette | Interaction | Trust/cost | S1 | AI users | P8 AI | Confirm pattern | P1 |
| D23 | A11y charts/SR | charts | A11y audit | Exclusion | S2 | SR users | — | Text alt | P2 |
| D24 | Onboarding density | Onboarding.jsx | Journey | Drop-off | S1 | New users | P8 Ch20 | REDESIGN | P0 |

## Counts

| Sev | n |
|-----|---|
| S0 | 0 |
| S1 | 14 |
| S2 | 9 |
| S3 | 2 |
