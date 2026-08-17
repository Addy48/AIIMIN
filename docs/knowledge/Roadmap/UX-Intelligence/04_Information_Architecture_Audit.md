---
authority: operations
derived_from: navItems.js · App.js · Navigation.md · Sidebar.jsx existence · DeviceGate
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-25
can_override_genesis: false
program: UX-Intelligence-v1
---

# 04 — Information Architecture Audit

## Primary navigation (desktop)

**Pattern:** Free-pin masthead (`NAV_REGISTRY`, max 12 pins). No forced global sidebar in doctrine; `Sidebar.jsx` still exists in tree (legacy risk).

| Nav label | Route | Notes |
|-----------|-------|-------|
| Today | `/overview` | **Terminology mismatch** — label Today, path overview |
| Habits | `/habits` | |
| Goals | `/goals` | |
| Journal | `/journal` | |
| Notes | `/notes` | |
| Finance | `/finance` | Tier guard |
| Family | `/family` | Tier · Documents nested |
| Calendar | `/calendar` | |
| Career | `/placements` | **Label≠path** |
| Sports | `/sports` | Guest hide · tier |
| Discipline | `/discipline` | Guest hide · tier |
| Focus | `/focus` | Tier |
| Lab | `/lab` | Tier · FUTURE-ish |
| Reports | `/reports` | Tier |

**Not in NAV_REGISTRY but routed:** Insights `/insights`, Identity `/identity`, Account `/account`, Settings `/settings`, Seed `/seed-data`.

**Brand lockup:** Logo → `/brand`; wordmark → `/overview` (LOCKED).

## Hierarchy sketch

```
Public
├── / (Waitlist)
├── /brand
├── /login · /auth/callback · /verify-email
└── Legal (/privacy /terms /security /about /contact /data-deletion)

App shell (session + access)
├── Masthead pins (persona-filtered)
├── /overview (Today)
├── Domain pages (habits…reports)
├── /insights · /identity (orphan-ish from masthead)
├── /account · /settings (dual settings)
├── Command palette (cross-cut)
└── Dev: /seed-data · /design-lab→account?section=design

Phone web
└── /m
    ├── index capture
    ├── score
    └── account lite

Native (Compose tabs/screens)
├── Auth · Biometric
├── Home · Journal · Notes · Vault · GoalsLite
├── DisciplineUrge · FocusTimer
├── More · Settings
```

## Discoverability issues

| Issue | Evidence | Type |
|-------|----------|------|
| Today ≠ overview | `navItems.js` label vs path | Inconsistent terminology |
| Career ≠ placements | same | Inconsistent terminology |
| Insights/Identity off masthead | App.js routes, not NAV_REGISTRY | Orphan / secondary |
| Account vs Settings dual | both routes live | Duplicate destinations |
| Documents under Family only | Family.jsx tabs | Nested; no top Documents |
| No Health / Tasks / AI hubs | user domains map to subsets | Missing top-level IA vs mental model |
| Sidebar.jsx remnant | file exists | Legacy / dead-end risk |
| `/m/score` under capture | App.js nested | Ceiling / discoverability conflict |
| Design lab redirect | `/design-lab` → account | Dev leak in prod router |

## Depth

- Typical: 1 (page) + 1 (tabs/sections) = depth 2
- Family Documents: depth 3
- Account sections: depth 2–3
- Native Journal detail: depth 2

## Cross-links

- Command palette → many destinations
- Overview widgets → habits/goals/logger
- Brand → legal
- Weak: Insights ↔ Reports ↔ Overview redundancy

## Dead ends

- Pending access wait (intentional gate)
- TierRouteGuard lock screens (upgrade CTA needed clarity)
- Empty Insights/Reports when no data

## IA verdict for UX Architecture

IA is **persona-pin driven**, not Genesis Day-spine first. Highest debt: terminology (Today/overview, Career/placements), dual Account/Settings, Insights/Identity orphans, `/m` score exception.
