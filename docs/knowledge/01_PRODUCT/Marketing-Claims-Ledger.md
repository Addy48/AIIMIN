---
authority: operations
derived_from: 01_PRODUCT/Stage1-Marketing-Ops-Plan · frontend waitlist · legal.js
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-08-20
can_override_genesis: false
knowledge_layer: KL-PROD
graph_role: leaf
note_type: NT-COMPLIANCE
tags:
  - type/compliance
  - domain/growth
  - status/living
---

# Marketing Claims Ledger

> Every public marketing sentence should be taggable. **Before changing live copy, founder ACK.**  
> Tags: **FACT** · **TARGET** · **FOUNDING** · **FORBID**  
> Product context: `.agents/product-marketing.md`

## Tag definitions

| Tag | Meaning | Legal posture |
|-----|---------|---------------|
| **FACT** | True in product/ops today | Prefer; cite surface |
| **TARGET** | Aspiration / schedule | Always hedge (“targeting”, “window”) — not SLA |
| **FOUNDING** | Waitlist / tester perk | Must match Terms/Refunds; time-bounded; no bait-and-switch |
| **FORBID** | Never publish | Manipulation, medical/financial advice claims, fake social proof |

## Audit — Waitlist / site (2026-08-20)

| Claim (paraphrase) | Tag | Evidence / hedge | Action |
|--------------------|-----|------------------|--------|
| Explore free forever (Journal, Depth, Today ceiling) | **FOUNDING**/product policy | Tier table in `waitlistLandingData` | Keep; ensure Refunds/Terms don’t contradict |
| Core ₹29 / Pro founding ₹49 / Elite founding ₹79 | **FOUNDING** | Waitlist + Dual-Market INR | Keep; “as described at signup / Terms” |
| Complimentary Core at go-live | **FOUNDING** | Waitlist perks | Keep; define duration in Terms if not already |
| Elite free 12 mo for VIP testers (₹1,188 value) | **FOUNDING** | Invited testers only · register by 30 Sep | Keep; invite-only explicit |
| Pro/Elite founding ~17%/20% off for 12 mo | **FOUNDING** | FAQ + packages | Keep |
| Launching / go-live Oct 2026 · end of Oct | **TARGET** | Public timeline | Prefer “targeting end of October 2026” over hard “Launching” where possible |
| Tester registration closes 30 September | **TARGET**/ops deadline | Cutoff for VIP package | OK as deadline for perk eligibility |
| Waitlist instant signup | **FACT** | Current API flow | Keep |
| Android closed device testing · Play not listed · no APK | **FACT** | `/app` + ANDROID_APP_STATUS | Keep |
| UPI review / Family vault in Pro | **TARGET**/partial | Ship gates Phase C / vault waves | Soften to “includes when module ships” if not live at go-live |
| Life Score across sleep, gym, mood, focus | **FACT**/product | Server LHS 5D — copy should use BODY·MIND·DISCIPLINE·MONEY·MOOD labels carefully | Align journey unlock text with taxonomy |
| “Spots filling for Oct 2026” | **TARGET** | Social proof line | Avoid fake scarcity; only show counts when ≥100 |
| Join free — perks lock in at signup | **FOUNDING** | Hero CTA | OK if Terms say perks locked at signup |
| Americas $0/$3/$7/$16 footnote | **TARGET** | Dual-Market proposed | Footnote OK; not live checkout |
| AI therapist / doctor / wealth manager | **FORBID** | AI-Preference-Map | Never |
| Guaranteed outcomes / cure ADHD | **FORBID** | — | Never |
| Fake user counts | **FORBID** | Waitlist rule ≥100 | Never invent |
| Streak shame / engagement drip Knocks | **FORBID** | Genesis Hold/Knock | Never |
| Brand “promise” language on `/brand` | Review | Storage/control language | Prefer concrete rights (export/delete) over absolute “promise” |

## Brand page notes

`/brand` uses strong accountability language (“If we break a promise…”). Keep **concrete remedies** (export, delete, contact) — avoid absolute uptime/warranty (Terms already disclaim uninterrupted operation — FACT).

## Manipulation ban (real company posture)

1. No fake countdown that resets.  
2. No “limited spots” without inventory.  
3. No silent tier bait (advertise Elite features as Explore).  
4. No AI that writes life data without Commit.  
5. Dates = TARGET; perks = FOUNDING with Terms pointer.  
6. Notifications = Signal System — deserve attention.

## Day-1+ workflow

1. Founder ACK this ledger — **treated ACK 2026-08-20 via “keep going”**.  
2. `copy-editing` + `stop-slop` on rows marked soften — **in progress same day**.  
3. Pre-Ship 10× before push.  
4. Any new feature marketing line → new ledger row same day.

### Changelog

### 2026-08-20 — TARGET hedges applied
- **What:** “Launching” → “Targeting”; social proof without fake scarcity; Life Score hint → 5D taxonomy; FAQ SLA hedge; Pro UPI/vault “as they ship”.
- **Why:** Claims Ledger soften rows + founder keep-going.
- **Files:** WaitlistForm, WaitlistSocialProof, waitlistLandingData
- **Status:** shipped-code (pending push)

### 2026-08-20 — Initial audit
- **What:** First ledger from waitlist + `/app` + brand posture.
- **Why:** Founder — defensible marketing, no lawsuit-grade overclaim.
- **Status:** shipped-docs · live copy changes pending ACK
