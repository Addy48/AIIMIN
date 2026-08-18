---
authority: product
derived_from: 05_FRONTEND/Frontend-Map · 10_DECISIONS/2026-08-20-client-kill-list
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-08-20
can_override_genesis: false
knowledge_layer: KL-PROD
graph_role: leaf
note_type: NT-INVENTORY
tags:
  - type/inventory
  - domain/frontend
  - status/living
---

# Web surface diet (R4) — ship / park / kill

> Source: `frontend/src/App.js` + `constants/navItems.js`. Labels **executed** 2026-08-20 (not inventory-only).

| Route | Label | Execution |
|-------|-------|-----------|
| `/` waitlist | **ship** | unchanged |
| `/login/*` · `/auth/callback` · `/verify-email` · `/onboarding` | **ship** | unchanged |
| `/m/*` | **park** | Capacitor capture shell — no feature growth (DeviceGate) |
| Core Life OS routes (`/overview` … `/settings`) | **ship** | masthead + shell |
| `/sports` | **ship** | tier-gated |
| `/brand` · `/legal` · legal set · `/app` | **ship** | public |
| `/proto/draft` | **park** | craft lock URL kept; not in product nav |
| `/design-lab` | **kill** | `Navigate` → `/account?section=design` |
| `/placements` | **park** | **out of** `NAV_REGISTRY`, personas, Command Palette, GuestTour, Overview CTA · route deep-link only |
| `/seed-data` | **park** | prod → `/overview`; tool only when `NODE_ENV === 'development'` |
| ATS in Lab | **ship** | stays inside Lab module (not a top-level Career surface) |

## Files touched (execution)

- `frontend/src/constants/navItems.js`
- `frontend/src/App.js`
- `frontend/src/pages/Overview.jsx`
- `frontend/src/components/system/CommandPalette.jsx`
- `frontend/src/components/onboarding/GuestTour.jsx`
- `frontend/src/components/layout/TabRail.jsx`
- `frontend/src/components/layout/BottomNav.jsx`

## Changelog

### 2026-08-20 — Execute R4 diet
- **What:** Park Career/placements chrome; harden seed-data; keep kill redirect for design-lab; retarget Overview countdown to Goals
- **Why:** Founder asked to do web diet properly (not leave as taste inventory)
- **Files:** listed above
- **Status:** shipped
- **Notes:** `/placements` page code kept for deep links / possible later revive; ATS remains under Lab
