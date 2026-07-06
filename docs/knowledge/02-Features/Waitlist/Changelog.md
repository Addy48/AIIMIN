# Waitlist Changelog

## 2026-07-06 (split waitlist vs system brand, theme sync)

- Changed: `/brand` routes to **WaitlistBrand** (forest-green, nordic/vercel) for waitlist visitors; **SystemBrand** (`legal/Brand.jsx`) for authenticated app users or non-waitlist builds.
- Added: `/brand/system` — always serves OAuth/system brand page.
- Added: `useWaitlistSurfaceTheme` hook — reads/writes `aiimin-waitlist-theme`; forces theme on waitlist landing + waitlist brand; theme toggle on brand nav.
- Files: `frontend/src/pages/WaitlistBrand.jsx`, `frontend/src/pages/Brand.jsx`, `frontend/src/hooks/useWaitlistSurfaceTheme.js`, `frontend/src/pages/WaitlistLanding.jsx`, `frontend/src/App.js`, `frontend/src/pages/brandPage.css`
- Status: frontend build passes.

## 2026-07-06 (audit fixes — honest chart, rounded pricing, hero UX)

- Fixed: comparison chart split into **external proportional bar chart** (competitors only, no min-width hack) + **AIIMIN tier price list** (honest ₹0/29/49 founding/79 founding; single green hue with tier progression).
- Fixed: empty Pro "Most popular" pill — white text on green background; consolidated label `Most popular · Founding ₹49`.
- Changed: rounded founding price ladder — Core **₹29/mo**, Pro **₹59 → ₹49/mo** (most popular), Elite **₹99 → ₹79/mo**; updated meta/OG/FAQ/share copy.
- Fixed: email placeholder `you@example.com`; OS-ID one-line helper under checkbox.
- Changed: hero headline weight — bold **money** and **One screen.**; founder line → `Personal project · launching Sept 2026`.
- Changed: hero mock chart labels (`Daily completion %`, `Last 7 days`); nav CTA outline vs solid form submit; pricing detail defaults closed with tier tabs when expanded; chevron on "Tap to see full breakdown".
- Files: `frontend/src/pages/WaitlistLanding.jsx`, `frontend/src/styles/waitlistLanding.css`, `frontend/src/components/waitlist/WaitlistForm.jsx`, `frontend/src/pages/Brand.jsx`, `docs/knowledge/02-Features/Waitlist/Waitlist.md`, `docs/knowledge/00-Command-Center.md`
- Status: frontend build passes.

## 2026-07-06 (brand page fix, Pro founding price, tier accents)

- Fixed: `/brand` now serves **forest-green brand guidelines** at `frontend/src/pages/Brand.jsx` (ArchBracketMark + Wordmark, Life OS copy) — reverted wrong Human Momentum restore from `f443558e`. OAuth compliance page remains at `legal/Brand.jsx`.
- Fixed: duplicate "Already invited? Sign in" — removed from `WaitlistLanding.jsx` hero wrapper and mobile essentials; kept once in `WaitlistForm.jsx` for non-compact forms.
- Changed: **Pro** is most popular (`highlight: true`); founding price **₹48/mo** (~21% off ₹61) with FOUNDING PRICE badge; Core standard ₹25/mo (no discount badge); Elite keeps 16% off (₹83/mo).
- Changed: per-tier pricing card accents (Explore gray, Core teal, Pro forest green, Elite amber); comparison chart adds Pro ₹61 + Elite ₹99 rows.
- Changed: nav uses ArchBracketMark + Wordmark lockup; meta/OG/FAQ/WhatsApp share copy updated for Pro founding price.
- Files: `frontend/src/pages/Brand.jsx`, `frontend/src/pages/brandPage.css`, `frontend/src/pages/WaitlistLanding.jsx`, `frontend/src/styles/waitlistLanding.css`, `frontend/src/components/waitlist/WaitlistForm.jsx`, `docs/knowledge/02-Features/Waitlist/Waitlist.md`, `docs/knowledge/00-Command-Center.md`
- Status: frontend build passes.

## 2026-07-06 (brand restore, pricing correction, light previews, FAQ)

- Restored: `/brand` now serves original **Human Momentum** brand page from git (`f443558e`) at `frontend/src/pages/Brand.jsx` with Logo + Wordmark; `App.js` import updated. OAuth compliance page remains at `legal/Brand.jsx` but is no longer the `/brand` route.
- Fixed: desktop-notice banner moved inside mobile hero container (`.waitlist-desktop-notice`); hidden on desktop; no longer floats in left margin.
- Fixed: pricing — Explore Free, Core ₹25, Pro ₹61, Elite ₹99; **only Elite** gets 16% waitlist discount (₹83/mo). Removed all 40% off / ₹15 Core / ₹37 Pro copy.
- Changed: hero + mobile previews replaced dark dashboard screenshots with **light CSS mocks** matching waitlist nordic palette (#EDE4D3 tones, forest green accents).
- Fixed: comparison chart minimum 8% bar width for AIIMIN rows; wider price column; updated caption with date disclaimer.
- Changed: FAQ expanded — what AIIMIN is, website vs mobile app roadmap, desktop-first rationale; reordered logically.
- Files: `frontend/src/pages/Brand.jsx`, `frontend/src/App.js`, `frontend/src/pages/WaitlistLanding.jsx`, `frontend/src/styles/waitlistLanding.css`, `frontend/src/components/waitlist/WaitlistForm.jsx`, `docs/knowledge/02-Features/Waitlist/Waitlist.md`, `docs/knowledge/00-Command-Center.md`
- Status: frontend build passes.

## 2026-07-06 (brand link, campus strip removal, comparison chart fix)

- Changed: nav + footer wordmark use React Router `Link` to `/brand` (brand guidelines; already bypasses waitlist pending gate in `App.js`).
- Removed: campus strip (`CAMPUS_STRIP` / BITS Pilani, IIT Delhi, etc.) and related CSS; social proof line no longer mentions college count.
- Fixed: competitor comparison chart uses proportional bar widths (`price / ₹1,600 max` for combined-stack row), three-column layout (label | track | price), forest-green AIIMIN highlights, price outside tiny bars; added combined Notion + Todoist + Headspace row at ₹1,600/mo.
- Changed: OG/twitter meta titles mention Core at ₹25/mo.
- Files: `frontend/src/pages/WaitlistLanding.jsx`, `frontend/src/styles/waitlistLanding.css`, `docs/knowledge/02-Features/Waitlist/Waitlist.md`, `docs/knowledge/00-Command-Center.md`
- Status: frontend build passes.

## 2026-07-06 (pricing correction + animation cleanup + WebP previews)

- Fixed: reverted incorrect execution-guide Core pricing from ₹225/₹135 to product truth **₹25/mo** (waitlist **₹15/mo**); competitor bar AIIMIN Core at ₹25 with shortest green highlight bar vs Notion ₹650 / Headspace ₹550 / Todoist ₹400.
- Fixed: removed annoying infinite animations — rotating `borderShimmer` conic gradient on hero form (radar sweep), `heroGlowShift` pulse, `ctaPulse` on sticky CTA, `badgeShimmer`; dashboard cross-fade slowed to 36s opacity-only; `prefers-reduced-motion` disables decorative motion.
- Changed: hero + mobile previews load `/images/preview-*.webp` with SVG fallback on error; aspect-ratio containers + min-height to prevent layout collapse.
- Changed: meta/OG/twitter titles to ₹0–₹99/mo; WhatsApp share text uses ₹25/₹15 waitlist pricing.
- Files: `frontend/src/pages/WaitlistLanding.jsx`, `frontend/src/styles/waitlistLanding.css`, `frontend/src/components/waitlist/WaitlistForm.jsx`, `frontend/public/index.html`, `docs/knowledge/00-Command-Center.md`, `docs/knowledge/02-Features/Waitlist/Waitlist.md`
- Status: frontend build passes; preview at `http://localhost:3000/` with `REACT_APP_WAITLIST_MODE=true`.

## 2026-07-06 (real dashboard preview screenshots)

- Changed: replaced SVG placeholder previews with real WebP screenshots captured from local `/overview` and `/insights` via Playwright (`scripts/capture-waitlist-screenshots.mjs`).
- Changed: `WaitlistLanding.jsx` hero + mobile preview now reference `/images/preview-*.webp`; regenerated `og-image-v2.png` from live dashboard crop.
- Added: `GET/PATCH /api/account/user-profile` alias in `server/routes/account.js` so dev mock-token auth can load session for screenshot tooling.
- Files: `frontend/public/images/preview-*.webp`, `frontend/src/pages/WaitlistLanding.jsx`, `frontend/public/og-image-v2.png`, `scripts/capture-waitlist-screenshots.mjs`, `server/routes/account.js`
- Status: frontend build passes; waitlist preview at `http://localhost:3000/` with `REACT_APP_WAITLIST_MODE=true`.

## 2026-07-06 (execution-guide landing upgrade — phases 6→1→2→3→4→5)

- Changed: full waitlist landing restructure per execution guide — hero headline/subhead, 40/60 form+dashboard cross-fade preview, benefit strip, founder signal, pricing moved to section 5 with Core ₹225/mo + competitor comparison bar + 40% waitlist discount badges.
- Changed: consolidated sections (18→13) — removed standalone "Why AIIMIN exists", launch timeline, perks breakdown, after-signup, and on-page feature voting; merged onboarding into How it works; horizontal roadmap bar; testimonials reframed as "What testers are saying".
- Changed: mobile product context above form, timeline-only essentials, social proof hidden below 100 signups, sticky CTA overlap fix via padding + Intersection Observer, enlarged OS-ID checkbox tap target.
- Changed: post-signup confirmation with position, WhatsApp/X/copy share, inline feature vote, `localStorage` returning-visitor state (`aiimin_waitlist`), referral `?ref=` capture.
- Changed: fonts to Familjen Grotesk + Figtree + JetBrains Mono; meta/OG/schema updated for aiimin.in; `og-image-v2.png`; FAQ "Why is AIIMIN desktop-only?" at position 2.
- Added: backend referral codes + position in `POST /api/waitlist` response (`server/migrations/034_waitlist_referrals.sql`); confirmation email includes position + referral link.
- Files: `frontend/src/pages/WaitlistLanding.jsx`, `frontend/src/styles/waitlistLanding.css`, `frontend/src/components/waitlist/WaitlistForm.jsx`, `frontend/public/index.html`, `frontend/public/images/*`, `frontend/public/og-image-v2.png`, `server/routes/waitlist.js`, `server/lib/emailTemplates.js`, `server/migrations/034_waitlist_referrals.sql`
- Status: frontend build passes; migration 034 must be applied for full referral backend.

## 2026-07-05 (perks fix + pricing expand + pattern consistency)

- Fixed: inverted perks hierarchy — invited testers now shown as VIP package (Elite 1yr free + beta access + priority OS-ID + prototypes + support).
- Fixed: unified tester/waitlist comparison cards to identical layout pattern (tag, title, deadline, perk list, CTA button).
- Changed: pricing tiers are clickable — tap any tier to expand full feature breakdown panel.
- Changed: testimonials use weighted personas (Dr. Meera Iyer, Arnav Desai, Kavya Srinivasan, Prof. Vikram Hegde).
- Changed: feedback idea starters append to textarea instead of replacing user input.
- Changed: dummy placeholders to `arnav.desai@mail.com`, `NEXUS42`, `meera.iyer@mail.com`.
- Files: `frontend/src/pages/WaitlistLanding.jsx`, `frontend/src/styles/waitlistLanding.css`, `frontend/src/components/waitlist/WaitlistForm.jsx`, `frontend/src/components/waitlist/WaitlistQuickFeedback.jsx`
- Status: build passes.

## 2026-07-05 (nav buttons + perks restructure)

- Changed: replaced floating top buttons with a proper glass sticky nav — logo left, theme toggle + primary CTA right.
- Changed: introduced shared button system (gradient primary, ghost theme toggle with sun/moon icons, pill shape, hover lift).
- Changed: restructured launch messaging — end of September go-live target, tester registration by 31 July, two-path perks model.
- Changed: testers get Elite (₹99/mo) free for 1 year only; waitlist gets starter kit + complimentary Core + 40% off Elite + OS-ID + priority onboarding.
- Changed: added launch timeline section and side-by-side tester vs waitlist comparison cards.
- Why: clarify uncertain launch dates, differentiate tester vs waitlist packages, and fix weak header button design/placement.
- Files: `frontend/src/pages/WaitlistLanding.jsx`, `frontend/src/styles/waitlistLanding.css`, `frontend/src/components/waitlist/WaitlistForm.jsx`, `frontend/src/components/waitlist/WaitlistQuickFeedback.jsx`, `docs/knowledge/_manifest.json`, `docs/knowledge/02-Features/Waitlist/Waitlist.md`, `docs/knowledge/00-Command-Center.md`, `docs/knowledge/02-Features/Waitlist/Changelog.md`
- Status: local update complete; validated with frontend build.

## 2026-07-05 (feedback + social proof v4 pass)

- Changed: upgraded quick feedback panel with feature-area tags, one-tap prompt suggestions, priority banner, character counter, and two-column launch-shaping layout.
- Changed: replaced generic testimonial placeholders with named fictional early-user cards (avatar initials + role + city).
- Changed: added campus credibility strip, after-signup timeline, featured perk highlight, mock browser preview card, and mini bar charts in screen previews.
- Changed: form placeholders now use fictional examples (`Arjun`, `KAIROX07`, `rohan@university.edu`) instead of owner-specific names.
- Why: improve data-sharing quality and social proof depth so visitors can contribute useful launch feedback faster.
- Files: `frontend/src/pages/WaitlistLanding.jsx`, `frontend/src/styles/waitlistLanding.css`, `frontend/src/components/waitlist/WaitlistForm.jsx`, `frontend/src/components/waitlist/WaitlistQuickFeedback.jsx`, `docs/knowledge/_manifest.json`, `docs/knowledge/02-Features/Waitlist/Waitlist.md`, `docs/knowledge/00-Command-Center.md`
- Status: local update complete; validated with frontend build.

## 2026-07-05 (theme toggle + top CTA pass)

- Changed: added sticky top action row with "Get early access" CTA at the very top of the waitlist page.
- Changed: waitlist now defaults to light theme (`nordic`) and includes on-page theme toggle (light/dark).
- Changed: waitlist theme preference persists via `localStorage` (`aiimin-waitlist-theme`) and applies through ThemeContext forced theme while on the page.
- Why: improve first-action visibility and satisfy request for light-default waitlist with explicit user control.
- Files: `frontend/src/pages/WaitlistLanding.jsx`, `frontend/src/styles/waitlistLanding.css`, `docs/knowledge/_manifest.json`, `docs/knowledge/02-Features/Waitlist/Waitlist.md`, `docs/knowledge/00-Command-Center.md`
- Status: local update complete; validated with build + lints.

## 2026-07-05 (conversion redesign v3 polish pass)

- Changed: added cinematic motion polish, countdown chip, roadmap timeline treatment, preview screens strip, testimonial cards, and mobile sticky CTA.
- Changed: integrated `react-helmet-async` for waitlist title/meta/OG/Twitter handling plus JSON-LD structured data.
- Changed: added waitlist render error boundary and cleaned pending-screen inline styles into token-based classes.
- Changed: added success celebration burst + haptic feedback in waitlist signup success state.
- Why: close remaining CRO and quality gaps from deep audit (trust depth, objection handling, interaction polish, metadata hygiene, and mobile conversion affordances).
- Files: `frontend/src/pages/WaitlistLanding.jsx`, `frontend/src/styles/waitlistLanding.css`, `frontend/src/components/waitlist/WaitlistForm.jsx`, `frontend/src/components/waitlist/WaitlistQuickFeedback.jsx`, `frontend/src/index.js`, `frontend/package.json`, `frontend/package-lock.json`, `package.json`, `package-lock.json`, `docs/knowledge/_manifest.json`, `docs/knowledge/02-Features/Waitlist/Waitlist.md`, `docs/knowledge/00-Command-Center.md`
- Status: local update complete; validate with build + manual mobile smoke before deploy.

## 2026-07-05 (conversion redesign v2)

- Changed: waitlist landing redesigned with token-aligned visual system, new hero layout, "who it is for", "how it works", roadmap/perks polish, FAQ accordion, trust strip, and bottom secondary CTA.
- Changed: signup flow switched to email-first (required email, optional first name, optional OS-ID reservation) to reduce initial conversion friction.
- Changed: waitlist API `POST /api/waitlist` now accepts optional `first_name` and optional `reserved_username`; owner notifications and confirmation flow handle missing OS-ID safely.
- Why: improve pre-launch conversion, reduce cognitive load on first-touch traffic, and align landing-brand experience with the current AIIMIN design token system.
- Files: `frontend/src/pages/WaitlistLanding.jsx`, `frontend/src/styles/waitlistLanding.css`, `frontend/src/components/waitlist/WaitlistForm.jsx`, `frontend/src/components/waitlist/WaitlistQuickFeedback.jsx`, `server/routes/waitlist.js`, `docs/knowledge/_manifest.json`, `docs/knowledge/02-Features/Waitlist/Waitlist.md`, `docs/knowledge/00-Command-Center.md`
- Status: local update complete; run frontend build + waitlist signup smoke test before deploy.

## 2026-07-05

- Removed: all Clerk auth integration (frontend SDK, backend JWT verify, env-based Clerk ID gates)
- Why: Clerk project deleted; migrating to AWS Cognito; waitlist uses email allowlist only
- Files: `frontend/src/context/AuthContext.jsx`, `frontend/src/App.js`, `frontend/src/pages/Login.jsx`, `server/middleware/auth.js`, `server/services/accessService.js`, `server/routes/auth.js` (`GET /auth/access`), deleted `ClerkAuthContext.jsx`, `clerkUserId.js`
- Status: local; push + redeploy Vercel/EC2 when ready

## 2026-07-04

- Added: required first name + OS-ID username reservation on waitlist signup
- Why: exclusive waitlist perk; lock usernames before launch; improve owner notifications
- Files: `server/migrations/031_waitlist_username_reservation.sql`, `server/routes/waitlist.js`, `server/middleware/validate.js`, `frontend/src/components/waitlist/WaitlistForm.jsx`, `frontend/src/pages/WaitlistLanding.jsx`, `server/lib/emailTemplates.js`, `scripts/seed-access-allowlist.mjs`, `deploy/.env.production.example`
- Status: shipped; run migration 031 on RDS before deploy

## 2026-07-04 (access + security)

- Added: dev/tester email allowlist seeded (1 dev, 4 testers + 3 future slots documented)
- Added: `feedbackLimiter` on public feedback endpoints; HTML escape on owner emails
- Removed: debug agent ingest calls from `wealth.js` and `validate.js`
- Files: `server/middleware/rateLimiter.js`, `server/routes/feedback.js`, `server/routes/wealth.js`, `server/services/accessService.js` (unchanged — env-driven)
- Status: shipped

## 2026-07-04 (reserved username auto-apply)

- Added: on sign-in/sign-up, if email matches `waitlist_emails`, auto-set `users.username` from `reserved_username` when user has no username yet
- Why: honor waitlist OS-ID reservations without manual admin steps
- Files: `server/services/userProfileService.js` (`applyReservedUsernameFromWaitlist`), `server/middleware/auth.js`
- Status: live
