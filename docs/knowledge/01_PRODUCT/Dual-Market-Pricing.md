---
authority: product
derived_from: 01_PRODUCT/Massive-Upgrade-Research-Pack · frontend legal Refunds · waitlistLandingData
status: proposed
owner: founder
lifecycle: living
last_reviewed: 2026-08-20
can_override_genesis: false
knowledge_layer: KL-PROD
graph_role: leaf
note_type: NT-PRICING
tags:
  - type/pricing
  - domain/product
  - status/proposed
---

# Dual-market pricing — India (INR) + Americas (USD)

> **Status:** proposed 2026-08-20 — Founder-approved INR stays. USD ladder is **planned list prices** for US / Americas launch, not live Stripe SKUs yet.  
> **Markets (priority):** (1) Indian subcontinent · (2) United States / American subcontinent (US + Canada + LATAM later).

## 1. Locked INR (unchanged)

| Tier | List (INR/mo) | Founding (waitlist) | Notes |
|------|---------------|---------------------|-------|
| **Explore** | ₹0 | ₹0 | Free forever |
| **Core** | ₹29 | Complimentary at go-live (stated period) | Waitlist perk |
| **Pro** | ₹59 | **₹49** (~17% off) for 12 mo | |
| **Elite** | ₹99 | **₹79** (~20% off) for 12 mo | |

Source of truth today: waitlist copy + [[frontend/src/pages/legal/Refunds.jsx]].

## 2. Proposed USD ladder (Americas)

Founder target sticker: **$0 · $3 · $7 · $16**.

| Tier | USD list / mo | Founding (waitlist, 12 mo) | Rationale |
|------|---------------|----------------------------|-----------|
| **Explore** | **$0** | $0 | Same freemium door |
| **Core** | **$3** | **$0** for founding window (mirrors complimentary Core) then $3 | Entry paid habit |
| **Pro** | **$7** | **$6** (~14% off; closest clean dollar to INR ~17% off) | Daily OS power |
| **Elite** | **$16** | **$13** (~19% off; mirrors ~20% Elite cut) | Reports + Deep pool |

### 2.1 Artificial / display prices (marketing)

Use **strikethrough list → founding** on Americas waitlist/pricing:

- Pro: ~~$7~~ **$6**/mo founding  
- Elite: ~~$16~~ **$13**/mo founding  
- Annual optional later: 2 months free (standard SaaS), not required for waitlist.

Do **not** FX-convert ₹29→USD live (looks like $0.35 and destroys positioning). Dual catalog is intentional PPP + market anchoring.

### 2.2 Rough PPP check (honesty)

India Core ₹29 ≈ very low absolute; US $3 is still “coffee-cheap” but not insulting for a Life OS. Elite $16 sits under typical Notion AI / Finch+ / Habitica subscription bands while staying craft-premium.

## 3. Geo serve rules (implementation later)

| Visitor | Catalog | Billing |
|---------|---------|---------|
| IN / BD / LK / NP / PK (phase-1 IN-first) | INR | Razorpay / UPI when live |
| US / CA | USD | Stripe |
| Other | Default **USD** until local catalog exists | Stripe |
| Override | Account setting “Billing region” | Prevents VPN surprise |

**Never** show both currencies mixed on one card without a region switcher.

## 4. Age / sensing / content policy (Life OS for everyone)

| Band | Access | Sensing | Content / AI |
|------|--------|---------|--------------|
| **Under 18** | Block account creation (existing 18+ gate) OR future supervised mode `[ADR]` | No Health Connect / SMS / screen-time without guardian consent | Strict: no adult content, no dating, no gambling modules |
| **18–24** | Full Explore+ | Opt-in sensors | Default AI-on for Capture Offer; journal AI opt-in |
| **25–40** | Full | Opt-in | Same + finance AI categorizers |
| **40+** | Full | Opt-in with larger type / dim | Prefer less “quest” language; more steward tone |

“Uncensored for ages” **does not** mean illegal or CSAM. It means: **adults get full honesty** (discipline lapses, money stress, mood) without infantilizing UX — while **minors never get adult-only modules**. Journal stays private; no analytics on journal (Genesis).

## 5. Related

- [[01_PRODUCT/Massive-Upgrade-Research-Pack]]
- [[01_PRODUCT/Marketing-And-Go-To-Market]]
- [[01_PRODUCT/AI-Preference-Map]]
