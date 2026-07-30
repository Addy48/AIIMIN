# Architecture Overview

## Current state

- Frontend: React app under `frontend/src`
- Backend: Express/Hono-style routes under `server/routes` (entry via `server/` + `api/`)
- Data: Supabase PostgreSQL with route-level auth and RLS where applicable
- Auth: Better Auth + Google OAuth (login callback under Better Auth path)

## Product split

| Surface | Route | Role |
|---------|-------|------|
| Desktop | app routes (`/overview`, …) | Full Life OS — analytics, tools, pages |
| Tablet / iPad | same routes | Full Life OS — touch masthead; see [[Device-Tiers]] |
| Phone web | `/m` | Capture-only daily log (native app coming) |
| Waitlist | `/` when waitlist mode | Marketing + signup gate |
| Brand | `/brand` | Public waitlist brand or system brand |

## Subsystem map

| Area | Doc |
|------|-----|
| Frontend | [[Frontend]] |
| Backend | [[Backend]] |
| Database | [[Database]] |
| Authentication | [[Authentication]] |
| Notifications | [[Notifications]] |
| Calendar sync | [[Calendar-Sync]] |
| AI pipeline | [[AI-Pipeline]] |

## Canonical docs

- Home: [[00_HOME]]
- Product: [[01_PRODUCT/Product]]
- Design: [[08_DESIGN/Palette]]
- Deploy: [[07_DEPLOYMENT/Deploy]]

## Constraints

- Solo developer; one feature at a time preferred
- MacBook Air M2 8GB — avoid high-memory local processes
- Do not change auth or schema without explicit user instruction
- Palette locked
