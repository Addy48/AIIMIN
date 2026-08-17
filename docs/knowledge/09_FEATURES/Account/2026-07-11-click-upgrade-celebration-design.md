---
authority: product
derived_from: 09_FEATURES/Account/Personalization
status: shipped
owner: product
lifecycle: frozen
last_reviewed: 2026-07-30
can_override_genesis: false
knowledge_layer: KL-PROD
graph_role: leaf
note_type: NT-DOC
tags:
  - type/specification
  - domain/account
  - status/shipped
---

# Click-upgrade + identity celebration (2026-07-11)

> [!abstract] Satellite note
> Not the primary feature MOC. Primary contracts live in the folder’s main feature note + [[09_FEATURES/Index]].


## Goal

Until Stripe is live, any signed-in user can change plan by click. Upgrade shows a short identity-shift celebration (B). Per-tier color/motion. Testing: up and down allowed. Later: `UPGRADE_ONLY=true` blocks downgrades.

## Backend

- `isClickUpgradeEnabled()` — true when Stripe checkout is not fully configured, OR `SUBSCRIPTION_MODE=true`
- `POST /api/billing/select-tier` — always allowed when click-upgrade enabled (prod included)
- `isUpgradeOnlyMode()` — `UPGRADE_ONLY=true` rejects downgrades
- `accessService` — always read `subscription_tier` from profile when click-upgrade enabled (do not force elite for owner/dev/tester in that mode)

## Frontend

- Subscription section always uses select-tier when server reports `subscription_mode` / click-upgrade
- Per-tier card accents: explore gray, core teal, pro orange, elite amber
- `TierUpgradeCelebration` overlay: hold → dissolve → land → unlock chips → receipt → Continue
- Flag path for later upgrade-only UI (hide/disable lower tiers)

## Out of scope

- Real Stripe checkout
- Mobile `/m` (capture only — no subscription UI there)
