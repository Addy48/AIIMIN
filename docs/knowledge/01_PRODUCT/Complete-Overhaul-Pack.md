---
authority: operations
derived_from: Genesis · Roadmap/AIIMIN-V1-Blueprint
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-08-20
can_override_genesis: false
knowledge_layer: KL-PRODUCT
graph_role: plan
note_type: NT-SPEC
tags:
  - type/plan
  - domain/product
  - domain/frontend
  - status/living
---

# AIIMIN — Complete Overhaul Pack (single file)

> **One note for everything asked across the simplification → research → waitlist → public-site UI pass.**  
> Code and vault must match this file. When they disagree, **code is fact** — update this note.

**Last updated:** 2026-08-20

---

## 0. What this file is

| Section | Covers |
|---------|--------|
| §1 | Timeline / date shift (Jul–Aug → Sep+, milestones +≥1 month) |
| §2 | Waitlist marketing UI overhaul (`/`, launch journey “graph”, pricing VS, hero mock) |
| §3 | Brand page cursor glow + atmosphere |
| §4 | `/app` Android companion surface |
| §5 | Waitlist form bugs (multi-instance + theme) |
| §6 | Dual-market pricing + AI preference + GTM (pointers) |
| §7 | Simplification / ship baseline already on `main` |
| §8 | Open founder decisions |
| §9 | Evidence / anti-lie status |

Related deep notes (do not duplicate):  
[[Massive-Upgrade-Research-Pack]] · [[Dual-Market-Pricing]] · [[AI-Preference-Map]] · [[Marketing-And-Go-To-Market]] · [[16_DOCUMENTATION/Simplification-Phase-Tracker]] · [[16_DOCUMENTATION/Web-Surface-Diet-R4]]

---

## 1. Public timeline (locked copy for marketing surfaces)

**Rule:** Every public Jul/Aug milestone becomes **September** at earliest; later milestones push **≥1 month**.

| Old | New |
|-----|-----|
| Today → Jul 2026 | Today → **Sep 2026** |
| Tester cutoff 31 August | **30 September** |
| Go-live / Launching Sept 2026 | **Oct 2026** (end of October target) |
| Module rollout Oct–Nov 2026 | **Nov–Dec 2026** |
| Expansion Q1 2027 | **Q2 2027** |
| Pricing footnote July 2026 | **Sep 2026** (+ Americas $0/$3/$7/$16 note) |
| Legal `effectiveDate` July 31, 2026 | **September 30, 2026** (`consentVersion` `v1-2026-09-30`) |

**Primary code sources:**

- `frontend/src/components/waitlist/landing/waitlistLandingData.js`
- `frontend/src/components/waitlist/WaitlistForm.jsx`
- `frontend/src/components/waitlist/WaitlistHeroAside.jsx`
- `frontend/src/components/waitlist/WaitlistSocialProof.jsx`
- `frontend/src/components/waitlist/WaitlistQuickFeedback.jsx`
- `frontend/src/pages/WaitlistLanding.jsx`
- `frontend/src/pages/AndroidApp.jsx`
- `frontend/src/constants/legal.js`

---

## 2. Waitlist / “graph” visual overhaul

### Problems (founder screenshots)

- Launch journey cards cramped on 4-up desktop → text clipped / “out of window”
- Hero mock window looked washed grey / “backed out” (cream mixes on dark surface)
- Pricing VS card flat / weak hierarchy; July footnote stale
- Weak phase CTAs / Android status not linked from journey

### Fixes shipped in code

| Surface | Change |
|---------|--------|
| Launch journey | 2-col from 901px; 4-col only ≥1280px; card padding/status wrap; Phase 0 → `#waitlist-join` + `/login`; Phase 3 → `/app` |
| Hero preview mock | Product dark window (`#2d2d2d` / `#1a1a1a`), orange chrome accent, day labels on bars, `/app` caption link |
| Pricing VS | Stronger card surface + dual-market footnote |
| CSS | `waitlistLanding.css` hero-mock + launch-phase + value-compare blocks |

**Files:**  
`HeroPreviewMock.jsx` · `WaitlistLaunchJourney.jsx` · `WaitlistPricingSection.jsx` · `waitlistLanding.css`

---

## 3. Brand page (`/brand`) — cursor orange glow

### Root cause (Verified in source)

`.brand-manifesto__veil` painted the cursor radial **and** used `transition: background 0.4s ease-out`. Every `pointermove` CSS-var update re-tweened the whole background → felt seconds late.

### Fix

1. Remove background transition from veil.
2. Dedicated `.brand-manifesto__spot` layer driven by `--bm-spot-x` / `--bm-spot-y` (no transition).
3. `requestAnimationFrame` coalesce on `pointermove` in `Brand.jsx`.

**Files:** `frontend/src/pages/Brand.jsx` · `frontend/src/pages/brandPage.css`

**Browser feel:** founder should re-check on production after deploy — agent cannot claim “instant on live” until that pass.

---

## 4. `/app` Android companion page

### Intent

Status page, not APK store. Clear Now / Next / Public path; less muddy grey cards.

### Fixes

- Tester copy → **30 Sep 2026**
- Cards: stronger border, green “Now” emphasis, elevated split panels
- CTAs remain waitlist + `/m` capture-only (no APK)

**Files:** `AndroidApp.jsx` · `appPage.css`

---

## 5. Waitlist reliability (prior fix in same program)

| Bug | Fix |
|-----|-----|
| Two `WaitlistForm`s; “Use different email” left other form stuck | Shared `waitlistSignupStorage.js` + sync events |
| Theme lag / desync | Single theme writer; `HeroBrandLockup` reads ThemeContext only |

**Files:** `waitlistSignupStorage.js` · `WaitlistForm.jsx` · `HeroBrandLockup.jsx` · `useWaitlistSurfaceTheme.js`

Remembering join on refresh is **intentional**. Hard-refresh verification after reset = founder check.

---

## 6. Product research (already written — do not fork)

| Topic | Note |
|-------|------|
| Linking > more pages; RPG mechanics without cosplay | [[Massive-Upgrade-Research-Pack]] |
| INR + USD founding proposal $0 / $3 / $7 / $16 | [[Dual-Market-Pricing]] |
| AI want vs refuse | [[AI-Preference-Map]] |
| India + Americas GTM | [[Marketing-And-Go-To-Market]] |

**Not performed:** live Stripe / geo checkout wiring.

---

## 7. Simplification & ship baseline (context)

Already on **`main`** via prior work (PR #5 and follow-ups): vault diet, web surface diet R4, native V3 path, API note.delete + migrations, waitlist `/app` public path. Tracker: [[16_DOCUMENTATION/Simplification-Phase-Tracker]].

---

## 8. Open founder decisions

1. Accept USD founding **$6 / $13** (Pro/Elite) or adjust — see Dual-Market-Pricing.
2. OS maturity ladder brand name?
3. Career surface unpark timing?
4. Browser-verify: brand glow, waitlist dual-form reset, new dates on `/` · `/brand` · `/app`.

---

## 9. Evidence / truth labels (this pass)

| Claim | Label | Receipt |
|-------|-------|---------|
| Dates rewritten in listed frontend files | **Verified** | Grep after edit — no remaining “31 August” / “Jul 2026” on waitlist surfaces |
| Brand lag cause = background transition | **Verified** | `brandPage.css` pre-fix had `transition: background 0.4s` |
| Brand fix in source | **Verified** | Spot layer + rAF in `Brand.jsx` / `brandPage.css` |
| Hero mock / journey / pricing CSS changed | **Verified** | File writes this turn |
| Live Vercel READY with this tip | **Verified** | `dpl_7ygh2F1AMvBDq5YL9QBDaLsjWU27` READY · SHA `3dc30412` · live main.js HIT `Launching Oct 2026` / `brand-manifesto__spot` |
| Founder browser “feels instant” | **Blocked** on human check |

### Mandatory forever

Always-on Cursor rule: `.cursor/rules/aiimin-pre-ship-10x.mdc` — **5× inspect + 5× anti-lie** before every push/deploy claim. Indexed in `aiimin-always-index.mdc`.

### Changelog

### 2026-08-20 — Public site overhaul + date shift + brand glow
- **What:** Marketing timeline +1mo; waitlist journey/pricing/hero mock polish; brand cursor spot instant path; `/app` card contrast; this single overhaul note; pre-ship 10× rule.
- **Why:** Founder screenshots — clipped journey, laggy brand glow, grey backed-out windows, stale Jul/Aug copy. Founder asked mandatory deep test before pushes.
- **Files:** waitlist landing set, `Brand.jsx`, `brandPage.css`, `AndroidApp.jsx`, `appPage.css`, `legal.js`, this note, `.cursor/rules/aiimin-pre-ship-10x.mdc`
- **Status:** shipped (code + vault + Vercel READY `3dc30412`; founder feel check open)
- **Notes:** VP0 search returned empty this session — proceeded with Drafting Table palette + frontend-design skill.
