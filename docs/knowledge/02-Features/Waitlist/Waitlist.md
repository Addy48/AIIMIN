# Waitlist

## Current state

Public waitlist gate active when `REACT_APP_WAITLIST_MODE=true` (frontend) and `WAITLIST_MODE=true` (backend).

Landing (modular v9 — July 2026):

- **Orchestrator:** `frontend/src/pages/WaitlistLanding.jsx` (~160 lines)
- **Modules:** `frontend/src/components/waitlist/landing/*` + shared `waitlistLandingData.js`
- **Hero:** full-width top bar (brand lockup + exclusive badge + theme toggle); equal-height split panels — copy + preview left, form + `WaitlistHeroAside` right
- **Headline:** **One screen. Every day.** → habits, money, focus, mood. Life OS positioning (web + native app)
- **Pricing:** premium tier cards with icons, checkmarks, elevated Pro; compact stack-vs-AIIMIN comparison
- **Launch journey:** 4-phase vertical ladder (Reserve access → Founding launch → Module rollout → Full OS expansion) with access/approval notes
- **Early access:** tester VIP vs waitlist founding packages (6 perks each)
- **Testimonials:** 2 professors, 1 student, 1 working professional (regional credible tone)
- **Brand:** `/brand` → `WaitlistBrand.jsx` (theme-synced via `aiimin-waitlist-theme`)
- **Post-signup:** OS-ID reserve panel inline; referral share; `localStorage` key `aiimin_waitlist`
- **SEO:** canonical `aiimin.in`, `og-image-v2.png`, JSON-LD Desktop Web

## Section order

1. Hero (top bar + split panels)
2. Personas
3. Pricing
4. Launch journey (phases)
5. Preview screens
6. Early access (tester vs waitlist)
7. Testimonials
8. FAQ
9. Bottom CTA
10. Footer

## Signup flow

1. User lands on `/` → `WaitlistLanding.jsx`
2. Hero form: email (required), first name (optional)
3. `POST /api/waitlist` — validates, optional referral link, returns `position`, `referral_code`, `referral_count`, `reserved_username` (duplicate email can attach OS-ID)
4. Post-signup: optional OS-ID reserve; confirmation email via SES
5. Owner notified

## Waitlist exclusives

| Perk | Detail |
|------|--------|
| OS-ID lock | 8-char handle reserved post-signup (optional) |
| Starter kit | Launch onboarding bundle (waitlist only) |
| Core subscription | Complimentary Core at launch (waitlist only) |
| Pro founding price | **₹49/mo** (~17% off ₹59) for 12 months |
| Elite founding price | **₹79/mo** (~20% off ₹99) for 12 months |
| Tester perk | Elite free for 1 year if registered by 31 July (invite only) |
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
- `frontend/src/components/waitlist/landing/*`
- `frontend/src/components/waitlist/WaitlistForm.jsx`
- `frontend/src/components/waitlist/WaitlistHeroAside.jsx`
- `frontend/src/components/waitlist/WaitlistSocialProof.jsx`
- `frontend/src/components/waitlist/WaitlistQuickFeedback.jsx`
- `frontend/src/components/waitlist/WaitlistThemeSync.jsx`
- `frontend/src/pages/WaitlistBrand.jsx`
- `frontend/src/styles/waitlistLanding.css`
- `server/routes/waitlist.js`
- `server/migrations/034_waitlist_referrals.sql`
