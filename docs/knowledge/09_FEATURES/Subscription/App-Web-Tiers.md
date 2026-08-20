---
authority: product
derived_from: Genesis · 01_PRODUCT/AIIMIN-Product-Guide · frontend waitlist PRICING
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-08-20
can_override_genesis: false
---

# Native app ↔ web subscription tiers

Same ladder as web `tierGating.js` / waitlist PRICING: **Explore < Core < Pro < Elite**.

One identity. Surfaces differ by client.

## Prices (founding / public)

| Tier | INR/mo | Tagline |
|------|--------|---------|
| Explore | ₹0 | Capture the day. Feel the loop. |
| Core | ₹29 | Run the operating loop. |
| Pro | ₹49 founding | Household + patterns. |
| Elite | ₹79 founding | Full intelligence · two AI pools. |

## Interlink — what each tier unlocks

### Explore
- **App:** Day · minimums · Depth · Capture (1 Spark/day) · Journal · OS-ID · Config
- **Web:** Today · Calendar · Notes · Journal · daily log · Reports visible (deep tabs locked) · 1 AI/day

### Core
- **App:** + Money ledger · Lab English full · Health Connect · widgets · offline queue
- **Web:** + Habits · Goals · Focus · Discipline · Finance · Career · Lab · Journal packs · Snapshot · 10 AI/day

### Pro
- **App:** + UPI payment-alert review · cloud voice replay · priority capture
- **Web:** + Family vault · Wealth AI · What-if · Correlations · Life OS Review PDF · 25 AI/day

### Elite
- **App:** + highest Android priority · deep capture betas first
- **Web:** + Intelligence Report · Deep Reports · 40 AI/day

## Native wiring (V3)

| Piece | Path |
|-------|------|
| Model | `native-android-v3/core/model/.../SubscriptionTier.kt` |
| Persist | `AppPreferences.writeSubscriptionTier` · `ConfigStore.setSubscriptionTier` |
| Plan UI | `designsystem/.../SubscriptionPlan.kt` (`PlanCatalogHost` + celebration + gate) |
| Config | Config → Plan section · full catalog S1 |
| Gates | Money → `TierFeature.MONEY` (Core+) · Lab → `LAB_FULL` (Core+) |
| Souls | Explore `#6b7280` · Core `#2dd4bf` · Pro `#ff6b35` · Elite `#fbbf24` |

Billing not live — pick plan applies locally (same as web Subscription mode). Celebration + degrade confirm ship with catalog.

**Full design:** [[Native-Plan-System]]

## Related

- [[Native-Plan-System]] — **full design contract** (souls, screens, upgrade/degrade motion)
- [[01_PRODUCT/AIIMIN-Product-Guide]] §8
- [[09_FEATURES/Waitlist/Waitlist]] pricing table
- `frontend/src/utils/tierGating.js`
- `frontend/src/components/waitlist/landing/waitlistLandingData.js` `PRICING`
- `frontend/src/pages/account/sections/SubscriptionSection.jsx` `STATIC_TIERS`
- `frontend/src/components/account/TierUpgradeCelebration.jsx` `TIER_SOUL`
- `frontend/src/components/account/PlanStatusChip.jsx` `PLAN_TIER_META`

---

## Structure (Phase V4)

> Added 2026-08-20 so every living feature MOC shares the same skeleton. Fill stubs when next touching this feature.

## Current state

Status / scope / last meaningful change. Update when behavior changes.

## Why this exists

One job this feature serves for the user.

## Contracts

Routes, tables, env names (no secret values).

## Files

Frontend / backend / native paths.

