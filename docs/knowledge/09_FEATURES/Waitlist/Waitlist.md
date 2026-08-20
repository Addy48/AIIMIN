---
authority: engineering
derived_from: Genesis/P8 Master Specification
status: active
owner: eng
lifecycle: living
last_reviewed: 2026-08-20
can_override_genesis: false
knowledge_layer: KL-PROD
graph_role: leaf
note_type: NT-FEATURE-LEAF
migration_batch: W4
fm_source: script
---

# Waitlist

## Parent

- [[09_FEATURES/Index]]

## Current state

Public waitlist gate active when `REACT_APP_WAITLIST_MODE=true` (frontend) and `WAITLIST_MODE=true` (backend).

Landing (modular v9 — Aug 2026 overhaul):

- **Orchestrator:** `frontend/src/pages/WaitlistLanding.jsx` (~160 lines)
- **Modules:** `frontend/src/components/waitlist/landing/*` + shared `waitlistLandingData.js`
- **Hero:** full-width top bar (brand lockup + exclusive badge + theme toggle); equal-height split panels — copy + preview left, form + `WaitlistHeroAside` right
- **Mobile (<720px):** mobile headline/preview context + **join form always visible** (`#waitlist-join` not wrapped in desktop-only). Sticky “Reserve my spot” CTA. Theme toggle in mobile topbar only (no second fixed button).
- **Headline:** **One screen. Every day.** → habits, money, focus, mood. Life OS positioning (web + native app)
- **Pricing:** premium tier cards with icons, checkmarks, elevated Pro; compact stack-vs-AIIMIN comparison (INR + Americas $ footnote)
- **Launch journey:** 4-phase ladder (2-up tablet / 4-up wide); Phase 0 CTAs to join/sign-in; Phase 3 → `/app`
- **Early access:** tester VIP vs waitlist founding packages (6 perks each)
- **Testimonials:** 2 professors, 1 student, 1 working professional (regional credible tone)
- **Brand:** `/brand` → **Human Momentum manifesto** (`Brand.jsx` + `brandPage.css`): brand-first hero, numbered pillars, storage ledger, trust/legal, roadmap, architecture. Cursor spot is a dedicated layer (no laggy background transition). Navbar: logo → `/brand`, text → `/overview`.
- **Post-signup:** OS-ID reserve panel inline; referral share; `localStorage` key `aiimin_waitlist`
- **SEO:** canonical `aiimin.in`, `og-image-v2.png`, JSON-LD Desktop Web
- **Timeline pack:** [[01_PRODUCT/Complete-Overhaul-Pack]]

## Section order

1. Hero (top bar + split panels)
2. Personas
3. Pricing
4. Launch journey (phases)
5. **Android companion status** (mobile + desktop — `/app`, no APK)
6. Preview screens
7. Early access (tester vs waitlist)
8. Testimonials
9. FAQ (includes APK / Android status)
10. Bottom CTA
11. Footer (links to `/app`)

### Android status (2026-08-05)

- Public route: `/app` (`AndroidApp.jsx`) — closed device testing, Play not listed, **no APK host**
- Waitlist module: `WaitlistAndroidSection.jsx` + `ANDROID_APP_STATUS` in `waitlistLandingData.js`
- Hero / FAQ / Brand roadmap / About copy aligned

### 2026-08-05 — Android status + /app area
- **What:** Waitlist Android section; `/app` status page (no APK); hero/FAQ/Brand/About updated; APK retention script keeps current+previous only
- **Why:** Founder — honest app status on waitlist/website; stop APK pile-up; no public sideload
- **Files:** `AndroidApp.jsx`, `appPage.css`, `WaitlistAndroidSection.jsx`, `waitlistLandingData.js`, `WaitlistLanding.jsx`, `WaitlistHeroSection.jsx`, `WaitlistFooter.jsx`, `App.js`, `Brand.jsx`, `About.jsx`, `scripts/promote-v3-apk.sh`, `native-android-v3/dist/`
- **Status:** partial (code ready; Vercel deploy when pushed)
- **Notes:** Mobbin paid tier unavailable — designed from locked palette + existing waitlist craft

## Signup flow

1. User lands on `/` → `WaitlistLanding.jsx`
2. Hero form: email (required), first name (optional)
3. `POST /api/waitlist` — validates, optional referral link, returns `position`, `referral_code`, `referral_count`, `reserved_username` (duplicate email can attach OS-ID)
4. Optional OS-ID on signup form; confirmation email via Resend
5. Owner notified

## Waitlist exclusives

| Perk | Detail |
|------|--------|
| OS-ID lock | 8-char handle reserved post-signup (optional) |
| Starter kit | Launch onboarding bundle (waitlist only) |
| Core subscription | Complimentary Core at launch (waitlist only) |
| Pro founding price | **₹49/mo** (~17% off ₹59) for 12 months |
| Elite founding price | **₹79/mo** (~20% off ₹99) for 12 months |
| Tester perk | Elite free for 1 year if registered by **30 September 2026** (invite only) |
| Referral queue | Share link moves position up 5 spots per signup |

## Pricing tiers (public landing copy)

| Tier | List price | Waitlist founding |
|------|------------|-------------------|
| Explore | Free | — |
| Core | ₹29/mo | — (complimentary at launch) |
| Pro | ₹59/mo | ₹49/mo |
| Elite | ₹99/mo | ₹79/mo |

## Related files

- `frontend/src/pages/WaitlistLanding.jsx`
- `frontend/src/pages/AndroidApp.jsx`
- `frontend/src/styles/appPage.css`
- `frontend/src/components/waitlist/landing/*`
- `frontend/src/components/waitlist/WaitlistForm.jsx`
- `frontend/src/components/waitlist/WaitlistHeroAside.jsx`
- `frontend/src/components/waitlist/WaitlistSocialProof.jsx`
- `frontend/src/components/waitlist/WaitlistQuickFeedback.jsx`
- `frontend/src/components/waitlist/WaitlistThemeSync.jsx`
- `frontend/src/pages/Brand.jsx`
- `frontend/src/styles/waitlistLanding.css`
- `scripts/promote-v3-apk.sh`
- `server/routes/waitlist.js`
- `server/migrations/034_waitlist_referrals.sql`

---

## Structure (Phase V4)

> Added 2026-08-20 so every living feature MOC shares the same skeleton. Fill stubs when next touching this feature.

## Why this exists

One job this feature serves for the user.

## Contracts

Routes, tables, env names (no secret values).

## Files

Frontend / backend / native paths.

