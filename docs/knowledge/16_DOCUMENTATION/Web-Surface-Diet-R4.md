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

> Source: `frontend/src/App.js` routes (2026-08-20). Labels are **proposed** until Founder edits.

| Route | Label | Why |
|-------|-------|-----|
| `/` waitlist | **ship** | Public gate |
| `/login/*` · `/auth/callback` · `/verify-email` · `/onboarding` | **ship** | Auth |
| `/m/*` | **park** | Capture-only · Capacitor sunset path |
| `/overview` · `/journal` · `/notes` · `/finance` · `/habits` · `/goals` · `/calendar` · `/account` · `/reports` · `/focus` · `/discipline` · `/family` · `/lab` · `/identity` · `/insights` · `/settings` | **ship** | Core Life OS |
| `/sports` | **ship** | Tier-gated product |
| `/brand` · `/legal` · privacy/terms/… legal set | **ship** | Trust / compliance |
| `/app` | **ship** | Android landing (new) |
| `/proto/draft` | **park** | Design lock only — not product |
| `/design-lab` | **kill** redirect already → account design |
| `/placements` | **park** | Personal/career — not core Life OS |
| `/seed-data` | **park** | Dev/seed · gate harder or remove from prod nav |
| ATS / Placements-adjacent pages if orphaned | **park** | Confirm nav links |

## Next

- Founder mark any row **kill** → remove from nav + Route in a later slice.
- Do not delete code in R4 — inventory only.
