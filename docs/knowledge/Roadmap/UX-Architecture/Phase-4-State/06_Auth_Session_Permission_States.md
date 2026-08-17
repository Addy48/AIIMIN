---
authority: operations
derived_from: Auth journeys · TierRouteGuard · pending access · biometric · Intelligence
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-25
can_override_genesis: false
program: UX-Architecture-v1
phase: 4-state
---

# 06 — Auth, Session, and Permission States

## ST-AUTH — Authentication

| Field | Definition |
|-------|------------|
| **Intent** | Establish trusted identity (Google/PIN/native auth) |
| **Entry** | Unauthenticated visit · logout · session dead · deep link requires auth |
| **Exit** | Authenticated → Session · Failure with recovery · Pending access |
| **Transitions** | → Session · → Failure · → Expired · → Permissions (OAuth scopes later) |
| **Ownership** | Access domain · Login · Native Auth/Biometric |
| **Recovery** | Retry · alternate method · clear callback errors (journey debt) |
| **Accessibility** | PIN/group labels (Login evidence); keyboard complete |
| **Validation** | No silent auth invent; schema/auth locks (Program locks) |

## ST-SESS — Session

| Field | Definition |
|-------|------------|
| **Intent** | Represent authenticated continuity including **pending access** waitlist gate |
| **Entry** | Auth success · app resume · biometric unlock |
| **Exit** | Logout · expiry → Auth · pending resolved → app · revoke |
| **Transitions** | → Permissions · → Expired · → Auth · → Offline (session kept local) |
| **Ownership** | Access/shell |
| **Recovery** | Re-auth · waitlist messaging honest · biometric retry |
| **Accessibility** | Gate reasons announced |
| **Validation** | Pending access ≠ Failure; distinct UX |

## ST-PERM — Permissions

| Field | Definition |
|-------|------------|
| **Intent** | Capability denied or not granted (tier, OAuth calendar, biometric, notifications) |
| **Entry** | TierRouteGuard · OAuth deny · OS permission deny · guest hide |
| **Exit** | Grant/upgrade · navigate to allowed · dismiss |
| **Transitions** | → Success (granted) · → Failure · → Auth · → Session |
| **Ownership** | Shell tier · domain OAuth · native permissions |
| **Recovery** | Honest CTA (upgrade, connect Google, open settings) — no dark pattern (NN) |
| **Accessibility** | Reason + next step textual |
| **Validation** | Intelligence tier lock Unsupported state; Family perm copy gap → REQUIRED clarity |
