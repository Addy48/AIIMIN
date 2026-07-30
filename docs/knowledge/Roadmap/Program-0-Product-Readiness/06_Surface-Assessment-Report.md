---
authority: operations
derived_from: Genesis
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-25
can_override_genesis: false
knowledge_layer: KL-PROG
graph_role: leaf
note_type: NT-PROGRAM-LIVING
program: Program-0-Product-Readiness
migration_batch: W4
fm_source: script
---

# 06 — Surface Assessment Report

Input for upcoming **UX Architecture** (no redesign in Program 0).

## Surface inventory

### Marketing / public

| Surface | Entry | Notes |
|---------|-------|-------|
| Waitlist landing | `/` + `WaitlistLanding.jsx` | Modular sections; founding messaging |
| Brand book | `/brand` + `Brand.jsx` | Split lockup target |
| Legal | `/privacy` `/terms` `/data-deletion` `/security` `/about` `/contact` | Pages exist under `pages/legal/` |

### Auth / gate

| Surface | Entry | Notes |
|---------|-------|-------|
| Login | `/login` | Better Auth + PIN patterns |
| Onboarding | `/onboarding` | Life-mode gate |
| Auth callback | `/auth/callback` | OAuth |
| Pending access | (waitlist mode) | Public without allowlist |

### Desktop / tablet Life OS (App.js)

`/overview`, `/habits`, `/goals`, `/journal`, `/notes`, `/calendar`, `/finance`, `/family`, `/focus`, `/discipline`, `/sports`, `/lab`, `/placements`, `/insights`, `/identity`, `/reports`, `/account`, `/settings`, plus `/design-lab`, `/seed-data` (dev).

### Phone web

| Surface | Entry | Notes |
|---------|-------|-------|
| Capture shell | `/m` | `MobileCaptureApp` / `MobileShell` — capture-only lock |
| Score (mobile route fragment) | `score` in App paths | Verify vs capture-only policy |

### Native Android V2

Auth, Home, Journal (+ detail), Notes, Vault, Goals lite, Discipline urge, Focus timer, More, Settings, Biometric gate — under `native-android/.../ui/`.

## Debt themes (for UX Arch)

| Theme | Observation |
|-------|-------------|
| **Inconsistency** | Desktop density vs waitlist marketing chrome vs native sheets; three visual dialects |
| **Missing experiences** | Unified “Today” naming; post-P9 Knock/notice surfaces not expressed; status page |
| **UX debt** | Journal/Discipline unfinished craft; Lab/Placements cognitive load |
| **Visual debt** | Light canvas eng lag; historic Master Plan blue accent conflict with locked orange |
| **Interaction debt** | Capture paths not yet cited to P9 flows; urge surfing vs P9 initiative rules unaudited |
| **Redundant patterns** | Multiple loggers/prototypes under account design sections (`CaptureJ0Prototypes`) |

## Recommended UX Architecture entry order

1. Cross-surface map: Desktop · Tablet · `/m` · Native · Command (if any) against P9 Phase 4.  
2. Day surface (`Today`/`Overview`) + capture grammar.  
3. Waitlist/brand public system (keep separate from OS chrome).  
4. Journal + Discipline (highest emotional stakes).  
5. Dense tools (Lab, Placements) — kill/defer list.
