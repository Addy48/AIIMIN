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

Landing (modular v10 — Sep 2026 overhaul):

- **Orchestrator:** `frontend/src/pages/WaitlistLanding.jsx` (~160 lines)
- **Modules:** `frontend/src/components/waitlist/landing/*` + shared `waitlistLandingData.js`
- **Hero:** full-width top bar (brand lockup + exclusive badge + theme toggle); equal-height split panels — copy + preview left, form + `WaitlistHeroAside` right
- **23 Subsystems Command Drawer:** Interactive marquee ticker linked to a full 23-module Command Drawer modal (`01`–`23`). Portaled to `document.body` to prevent `contain: paint` clipping. Includes quick-rail selector strip, active diode indicator (`SYS // 01`), physical hardware tiles, and 4 clean spec blocks (Telemetry, Encryption, Interface, Graph Link).
- **Mobile (<720px):** mobile headline/preview context + **join form always visible** (`#waitlist-join` not wrapped in desktop-only). Sticky “Reserve my spot” CTA. Theme toggle in mobile topbar only (no second fixed button). Zero horizontal overflow (390px viewport certified).
- **Headline:** **One screen. Every day.** → habits, money, focus, mood. Life OS positioning (web command center + native Android companion)
- **Palette & Layout:** Strictly locked Drafting Table palette (`#000000` / `#EDE4D3` / `#ff6b35`). Radial neon green glow stripped (`.pricing-tier-glow` removed). Widened max-width to 1380px (`.waitlist-main`, `.waitlist-marquee-header`) to eliminate empty side gaps.
- **Theme Transitions:** Smooth `0.25s ease` transition between dark and light themes without flashes or contrast mismatches.
- **Privacy Hardening:** Telephone number rows completely purged from `/contact` and waitlist footer.
- **Pricing:** premium tier cards with icons, checkmarks, elevated Pro; compact stack-vs-AIIMIN comparison (INR + Americas $ footnote). Core ₹29/mo (complimentary at go-live), Pro ₹49/mo founding (standard ₹59/mo), Elite ₹79/mo founding (standard ₹99/mo), Explore free forever.
- **Launch journey:** 4-phase ladder (2-up tablet / 4-up wide); Phase 0 CTAs to join/sign-in; Phase 3 → `/app`. Cutoff: **31 October 2026**; Public launch: **November 2026**.
- **Early access:** tester VIP vs waitlist founding packages (6 perks each).
- **Testimonials:** Grounded in real engineering/tester personas (Devansh Verma Backend Engineer on Pixel 8 Pro, Ananya Sharma Founding Engineer, Rohit Patel Product Operations Lead, Karan Mehta Systems Architect on Galaxy S23).
- **Brand:** `/brand` → **Human Momentum manifesto** (`Brand.jsx` + `brandPage.css`): brand-first hero, numbered pillars, storage ledger, trust/legal, roadmap, architecture. Cursor spot is a dedicated layer (no laggy background transition). Navbar: logo → `/brand`, text → `/overview`.
- **Grounded FAQs:** Rebuilt in `waitlistLandingData.js` and `WaitlistFaqSection.jsx` to reflect 100% offline-first SQLCipher SQLite (<10ms writes, delta outbox sync), ~27 MB optimized native APK, 23-subsystem desktop command vs Android companion, 1-click JSON/CSV migration, hardware TEE StrongBox AES-256-GCM encryption, and full accessibility ARIA attributes.
- **Post-signup:** OS-ID reserve panel inline; referral share; `localStorage` key `aiimin_waitlist`
- **SEO:** canonical `aiimin.in`, `og-image-v2.png`, JSON-LD Desktop Web
- **Timeline pack:** [[01_PRODUCT/Complete-Overhaul-Pack]]

## Section order

1. Hero (top bar + split panels)
2. Subsystems marquee & 23 Modules Command Drawer (`WaitlistMarqueeSubsystems.jsx`)
3. Personas (`WaitlistPersonasSection.jsx`)
4. Pricing (`WaitlistPricingSection.jsx`)
5. Launch journey (`WaitlistLaunchJourney.jsx`)
6. **Android companion status & direct APK download** (`WaitlistAndroidSection.jsx` — `/app`, direct APK host)
7. Preview screens (`WaitlistPreviewScreensSection.jsx`)
8. Early access packages (`WaitlistAccessTiersSection.jsx`)
9. Testimonials (`WaitlistTestimonialsSection.jsx`)
10. Grounded FAQ (`WaitlistFaqSection.jsx`)
11. Bottom CTA (`WaitlistSecondaryCta.jsx`)
12. Footer (`WaitlistFooter.jsx` — links to `/app`, zero phone numbers)

### Android status (2026-09-14)

- Public route: `/app` (`AndroidApp.jsx`) — closed device testing, Play Store listing post-beta, **live APK host** at `/aiimin-v2-debug.apk` (~27 MB, Android 8.0+)
- Waitlist module: `WaitlistAndroidSection.jsx` + `ANDROID_APP_STATUS` in `waitlistLandingData.js`
- Features: 100% offline SQLCipher SQLite, Discipline Engine (AES-256 local encrypted vault), Focus Shield app blocker (Accessibility-based, no VPN drain), 30-day steps intelligence (Health Connect), notification sonification, biometric return gate (StrongBox TEE).
- SHA-256 integrity metadata displayed on landing and `/app`.
- Verified on physical test device AIN065 (`9597fdea`).

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
| Tester perk | Elite free for 1 year if registered by **31 October 2026** (invite only) |
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

