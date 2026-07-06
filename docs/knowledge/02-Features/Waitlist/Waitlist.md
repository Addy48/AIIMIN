# Waitlist

## Current state

Public waitlist gate active when `REACT_APP_WAITLIST_MODE=true` (frontend) and `WAITLIST_MODE=true` (backend).

Landing experience (v8 audit polish):

- Hero: selective headline weight (**money**, **One screen.**), benefit icon strip, badge pills, founder line (`Personal project · launching Sept 2026`), 40/60 form + **light CSS dashboard mock** with chart axis labels
- Mobile: desktop-notice banner **inside** mobile hero container above form; light mobile logging mock
- Sticky nav CTA: **Reserve my spot** (outline); form submit solid primary
- Section order (12): hero → personas → **pricing (section 4)** → how it works → real screens → two paths in → roadmap bar → testimonials → FAQ → bottom CTA → footer
- Pricing: Explore Free · Core **₹29/mo** · Pro **₹59/mo** (waitlist founding **₹49/mo**, most popular) · Elite **₹99/mo** — Elite founding **₹79/mo** for waitlist
- Comparison: **split visuals** — external apps proportional bar chart (no min-width hack) + AIIMIN tier price list (single green hue progression)
- Pricing cards: no expanded detail by default; tier tab switcher when a card is clicked; chevron on tap hint
- Nav + footer link to `/brand` — **waitlist brand** (`WaitlistBrand.jsx`, forest-green, theme-synced via `aiimin-waitlist-theme`) when `isWaitlistMode && !canAccessApp`; **system brand** (`legal/Brand.jsx`) at `/brand` for app users or `/brand/system` always
- Post-signup: confirmation panel with position, share buttons, inline feature vote; `localStorage` `aiimin_waitlist` for returning visitors
- Referral: `?ref=` param → sessionStorage; backend returns `referral_code` + `position` (migration 034)
- SEO: `aiimin.in` canonical/OG, `og-image-v2.png`, JSON-LD `operatingSystem: Desktop Web`, student audience
- Fonts: Familjen Grotesk + Figtree + JetBrains Mono (Option B)
- Waitlist-only default theme light (`nordic`), toggle to dark (`vercel`) via `aiimin-waitlist-theme`

## Signup flow

1. User lands on `/` → `WaitlistLanding.jsx`
2. Hero form: email (required), first name (optional), OS-ID (optional with helper copy)
3. `POST /api/waitlist` — validates, optional referral link, returns `position`, `referral_code`, `referral_count`
4. Confirmation email via SES (position + referral link when available)
5. Owner notified

## Waitlist exclusives (documented + emailed)

| Perk | Detail |
|------|--------|
| OS-ID lock | 8-char username reserved at signup (optional) |
| Starter kit | Launch onboarding bundle (waitlist only) |
| Core subscription | Complimentary Core at launch (waitlist only) |
| Pro founding price | **₹49/mo** (~17% off ₹59) for 12 months (waitlist only) |
| Elite founding price | **₹79/mo** (~20% off ₹99) for 12 months (waitlist only) |
| Tester perk | Elite free for 1 year if registered by 31 July (invite only) |
| Referral queue | Share link moves position up 5 spots per signup (backend) |

## Pricing tiers (public landing copy)

| Tier | List price | Waitlist founding |
|------|------------|-------------------|
| Explore | Free | — |
| Core | ₹29/mo | — (complimentary at launch) |
| Pro | ₹59/mo | ₹49/mo |
| Elite | ₹99/mo | ₹79/mo |

## Related files

- `frontend/src/pages/WaitlistLanding.jsx`
- `frontend/src/pages/WaitlistBrand.jsx` (waitlist forest-green brand, light/dark nordic/vercel)
- `frontend/src/pages/Brand.jsx` (router: waitlist vs system brand)
- `frontend/src/pages/legal/Brand.jsx` (OAuth/system brand — `/brand/system`)
- `frontend/src/hooks/useWaitlistSurfaceTheme.js`
- `frontend/src/components/waitlist/WaitlistForm.jsx`
- `frontend/src/components/waitlist/WaitlistQuickFeedback.jsx` (post-signup + pending screen only)
- `frontend/src/styles/waitlistLanding.css`
- `frontend/public/index.html`
- `frontend/public/og-image-v2.png`
- `server/routes/waitlist.js`
- `server/migrations/034_waitlist_referrals.sql`
