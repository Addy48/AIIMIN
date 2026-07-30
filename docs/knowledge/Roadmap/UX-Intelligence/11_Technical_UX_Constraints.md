---
authority: operations
derived_from: DeviceGate · sync · mobile.js · Vercel · EC2 API · Capacitor · Compose · TierRouteGuard
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-25
can_override_genesis: false
program: UX-Intelligence-v1
---

# 11 — Technical UX Constraints

Constraints only — not redesign proposals.

| Constraint | Reality | UX implication |
|------------|---------|----------------|
| Three clients | Web Life OS · `/m` Capacitor/web · Native Compose | Cannot assume one interaction grammar |
| `/m` ceiling | Capture-only product lock | No analytics/tools on `/m` (score route = tension) |
| Auth | Better Auth · Google · PIN | Flows must respect session/callback; no silent auth invent |
| Schema lock | No schema change without ask | UX cannot invent new entities without eng/Founder |
| Tier gates | `TierRouteGuard` | Locked surfaces need honest upgrade UX |
| API host | `api.aiimin.in` EC2 | Latency/offline when API down |
| Frontend host | Vercel | SPA routing; cold loads on lazy routes |
| Lazy routes | App.js Lazy wrappers | Loading skeletons required |
| Sync / offline | Stronger native + `/m` banners | Desktop offline incomplete |
| Caching | Sports/API caches | Stale data states needed |
| Storage | Local prefs · native storage | Persona pins client-side |
| Network | Multi AI providers · Google OAuth | Failure modes for each dependency |
| Permissions | OAuth calendar · biometric native · notifications immature | Permission-denied states |
| Device tiers | `data-device-tier` tablet CSS | Layout forks (Focus, TabRail) |
| Performance | Chart-heavy Reports/Finance | Heavy first paint risk |
| Rendering | React 19 SPA | Client-side empty before fetch |
| Native ≠ web | Parallel screens | Feature parity not guaranteed |
| Browser | Desktop Chrome-class assumed | Safari mobile quirks on `/m` |
| Env secrets | AI/OAuth/Stripe keys host-side | Features degrade when unset — UX must show Unavailable |
| Waitlist gate | Allowlist | Authenticated-but-blocked state |
| Design lab / seed | Dev routes in router | Must not leak into GA IA |

## Platform difference matrix

| Capability | Desktop web | `/m` | Native |
|------------|-------------|------|--------|
| Full domains | Yes | No (ceiling) | Subset |
| Offline | Weak | Partial | Stronger intent |
| Biometric | No | No | Yes |
| Command palette | Yes | No | No |
| Widgets Today | Yes | No | Ritual Home different |

These bound UX Architecture choices.
