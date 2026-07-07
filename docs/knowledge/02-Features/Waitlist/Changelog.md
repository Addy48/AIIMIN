# Waitlist Changelog

## 2026-07-08 (Arch Bracket logo everywhere + theme-aware marks)

- Replaced legacy leaf logo (`Logo.jsx`) with **Arch Bracket** (`ThemedMark` / `BrandLockup`) across navbar, login, onboarding, auth callback, waitlist.
- Light: Editor Pick · Dark: Route Y (`DARK_PICK`) — switches with app/waitlist theme.
- Regenerated `favicon-light.svg`, `favicon-dark.svg`, `AIIMIN_logo.svg`, `AIIMIN_logo_dark.svg`.
- Email header: dual logo images via `prefers-color-scheme`.
- Files: `ThemedMark.jsx`, `archBracketMark.js`, `BrandLockup.jsx`, `Navbar.jsx`, `export-logo-assets.mjs`, favicons, email templates.

## 2026-07-08 (Dual light/dark email — prefers-color-scheme)

- Waitlist confirmation adapts to device theme: **light c6** (default) + **dark Route Y** via `prefers-color-scheme`.
- Dark palette: `#0A0A0C` panel, ivory text, `#4C9770` accent — matches user mockup.
- Logo: real `AIIMIN_logo.svg` in header (left-aligned, both themes).
- Shared styles: `server/lib/waitlistEmailStyles.js`; Resend template re-synced.
- Status: deployed — test in Apple Mail / Gmail dark mode.

## 2026-07-07 (Resend template published — cap 300, prototypes removed)

- Deleted preview/prototype artifacts: `scripts/preview-waitlist-emails.mjs`, `deploy/email-preview/`.
- Published Resend template `aiimin-waitlist-confirmation` (c6 Gradient Grove); sends via `RESEND_WAITLIST_TEMPLATE_ID` when set.
- Member counter: **#123 of 300** (`WAITLIST_MEMBER_OFFSET=122`, `WAITLIST_DISPLAY_CAP=300`).
- Sync script: `node scripts/sync-resend-waitlist-template.mjs`
- Test: `node scripts/test-email.mjs <email>`
- Files: `server/lib/waitlistResendTemplate.js`, `server/lib/email.js`, `server/lib/waitlistEmailVariants.js`, `scripts/sync-resend-waitlist-template.mjs`, env examples
- Status: deployed — ready for E2E waitlist test

## 2026-07-07 (Waitlist UX — hide position, OS-ID emails, confirmation polish)

- Removed public waitlist position from UI (`WaitlistForm.jsx`) and confirmation email — replaced with "Founding member · perks locked" messaging (low signup count no longer shown).
- Fixed: post-signup OS-ID reserve (`source: post_signup_osid`) now sends `waitlist_osid_locked` to user and `waitlist_owner_notify` with `event: osid_reserved` to owner (was silent after duplicate-email UPDATE).
- Redesigned post-signup confirmation panel: founder pill, perks recap, OS-ID locked card, share copy without queue numbers.
- Redesigned `waitlist_confirmation` + owner notify emails; added `waitlist_osid_locked` template.
- Fixed Explore (₹0) pricing card alignment — same price-block structure as paid tiers (`WaitlistPricingSection.jsx`, `waitlistLanding.css`).
- Added `frontend/src/utils/osId.js` for name-based OS-ID suggestions on waitlist + onboarding.
- Added `scripts/clear-waitlist.mjs` to wipe `waitlist_emails` when resetting test data.
- Why: OS-ID showed "Not claimed" in owner email despite user reserving; position #2 hurt early traction; ₹0 card misaligned.
- Files: `server/routes/waitlist.js`, `server/lib/emailTemplates.js`, `WaitlistForm.jsx`, `WaitlistPricingSection.jsx`, `waitlistLanding.css`, `waitlistLandingData.js`, `frontend/src/utils/osId.js`, `scripts/clear-waitlist.mjs`
- Status: ready for deploy — run `node scripts/clear-waitlist.mjs` to reset waitlist DB before go-live test

## 2026-07-07 (Final founder closing copy)

- Bottom sign-off: "Thanks for believing in AIIMIN this early…" with reply-to-founder CTA.
- Production theme c6 locked. Email work complete.

## 2026-07-07 (c6 production copy — It starts here, no duplicate)

- Final theme **c6 Gradient Grove** only; removed c1–c5.
- Fixed duplicate headline: H1 "It starts here." · hero "You're shaping AIIMIN."
- Marketing copy: personal founder tone, concrete perks, closing beat, non-repetitive.
- Subject: `#N — FirstName, it starts here`
- Default env: `WAITLIST_EMAIL_THEME=c6`

## 2026-07-07 (v8 final — website colors, Personal OS, count from #123)

- Locked production template to **v8** only; removed v1–v7 variants.
- **6 color themes** (c1–c6) preview gallery — website-native greens/parchment, no dark ink blocks.
- Tagline: **Personal OS** (under AIIMIN). Headline: **It starts here.**
- Member display: `position + 122` → first signup shows **#123 of 500** (`WAITLIST_MEMBER_OFFSET`, `WAITLIST_DISPLAY_CAP`).
- Default theme: `WAITLIST_EMAIL_THEME=c1` (Forest Classic).
- Preview: `node scripts/preview-waitlist-emails.mjs`

## 2026-07-07 (8 waitlist email variants + design critique fixes)

- Added `server/lib/waitlistEmailVariants.js` with **8 A/B variants** (v1–v8).
- Critique fixes: ink/ivory contrast, JetBrains Mono OS-ID on `#0A0A0C`, green accent **only on CTA**, live `member_number` from Supabase, concrete perk copy.
- Default production variant: **v8 Hybrid Recommended** (`WAITLIST_EMAIL_VARIANT`).
- Preview gallery: `node scripts/preview-waitlist-emails.mjs` → `deploy/email-preview/index.html`
- Test send: `node scripts/test-email.mjs email --variant v3` or `--all`

## 2026-07-07 (Premium waitlist email redesign)

- Rewrote `waitlist_confirmation` with hero band, Life Score teaser, "What happens next" timeline, founder note, referral CTA (Superhuman/Linear-style exclusivity).
- Upgraded `waitlist_invite` to VIP early-access tone.
- Waitlist cleared for fresh signups.
- Files: `server/lib/emailTemplates.js`, `deploy/email-preview/waitlist-confirmation.html`

## 2026-07-07 (Resend from address — admin.aiimin.in)

- Fixed production send failure: verified domain is `admin.aiimin.in`, not root `aiimin.in`.
- Default + env examples now use `noreply@admin.aiimin.in`.
- EC2 + local test sends confirmed. SES IAM user + group deleted via AWS MCP.
- Files: `server/lib/email.js`, env examples, `scripts/test-email.mjs`, `deploy/RESEND-SETUP.md`

## 2026-07-07 (Resend-only migration — SES removed)

- Replaced AWS SES/nodemailer with official `resend` SDK in `server/lib/email.js`.
- Removed all SES env vars from examples; added `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_REPLY_TO`.
- Redesigned `waitlist_confirmation` email: Life Score teaser, founding perks, punchier subject line.
- Added `deploy/RESEND-SETUP.md`, `deploy/LAUNCH-PLAN.md`; updated `POST-SES-STEPS.md`.
- **Action:** verify `aiimin.in` in Resend DNS; rotate API key; set EC2 env; decommission SES SMTP IAM user.
- Files: `server/lib/email.js`, `server/lib/emailTemplates.js`, `package.json`, deploy docs
- Status: code ready — domain verification + EC2 env required

## 2026-07-07 (Email — Resend provider + setup guide)

- Added Resend HTTP API alongside SES SMTP in `server/lib/email.js` (`EMAIL_PROVIDER=auto|resend|ses`).
- Resend preferred when `RESEND_API_KEY` set; SES fallback on Resend failure in auto mode.
- Added `scripts/test-email.mjs` and `deploy/EMAIL-SETUP.md` (sandbox verify, Resend, AWS escalation).
- Why: SES production case pending; sandbox blocks unverified waitlist recipients.
- Files: `server/lib/email.js`, `scripts/test-email.mjs`, `deploy/EMAIL-SETUP.md`, `deploy/.env.production.example`
- Status: add Resend key + domain DNS on EC2 to unblock user confirmation emails

## 2026-07-07 (Waitlist — inline OS-ID, single owner email)

- Moved optional OS-ID to signup form (below email) with live @preview — no post-signup reserve step.
- One owner notify per new signup (includes OS-ID when provided); removed second owner email on post-reserve.
- API returns `confirmation_email_sent` so UI explains when SES fails to deliver (sandbox unverified addresses).
- Files: `WaitlistForm.jsx`, `waitlistLanding.css`, `server/routes/waitlist.js`
- Status: ready for deploy

## 2026-07-07 (Onboarding + API URL fix)

- Fixed: `frontend/src/utils/api.js` `buildApiUrl` — absolute `REACT_APP_API_URL` (e.g. `https://api.aiimin.in/api`) no longer double-prefixes `window.location.origin`.
- Fixed: `getCurrentAccessToken` refreshes from `supabase.auth.getSession()` before localStorage fallback.
- Fixed: `Onboarding.jsx` uses `apiPost`/`apiPatch`/`apiGet` instead of raw `fetch` for profile, habits, goals, and OS-ID resolve; habits body uses `name` not `title`.
- Fixed: `AuthCallback.jsx` uses `apiGet('/auth/me')`; incomplete profile = `onboarding_stage === 0` or missing username (not string `'pending'`).
- Fixed: `server/routes/auth.js` — `onboarding_stage` upserts use integer `1` (complete), not string `'complete'`.
- Added: `suggestOsIdFromName()` dynamic OS-ID placeholder in onboarding step 2.
- Why: Step 8 "Unauthorized: session error" — onboarding hit Vercel `/api` instead of EC2; stale tokens and wrong habit field blocked completion.
- Files: `frontend/src/utils/api.js`, `frontend/src/pages/Onboarding.jsx`, `frontend/src/pages/AuthCallback.jsx`, `server/routes/auth.js`
- Status: ready for Vercel (frontend) + EC2 (API) deploy

## 2026-07-07 (Task 3 — tester allowlist + login restore)

- Seeded `tester_allowlist` via `scripts/seed-access-allowlist.mjs` (1 dev + 4 testers).
- Restored Supabase auth: `AuthContext.jsx`, `Login.jsx`, `/auth/callback` route.
- Fixed missing `resolveAccess` import in `server/routes/auth.js`.
- Cognito Phase 2 guide: `deploy/COGNITO-SETUP.md`.

## 2026-07-07 (GHA health-check retry)

- Deploy workflow waits up to 60s for `localhost:3001/api/health` after PM2 reload (`deploy/wait-for-api.sh`).
- Fixes false failures: `curl: (7) Failed to connect to localhost port 3001` on t4g.nano cold start.

## 2026-07-07 (GitHub Actions deploy fix)

- `.github/workflows/deploy-api.yml`: auto-clone if `~/AIIMIN` has no `.git`, preserve `.env`, `npm install` instead of `npm ci`, longer SSH timeouts, `workflow_dispatch`.
- Added `deploy/github-ec2-deploy.sh` and `deploy/GITHUB-ACTIONS.md`.
- Root cause of failures: rsync deploy had no git; intermittent SSH timeout from GitHub runner IPs not in EC2 security group.

## 2026-07-07 (Waitlist email redesign — Nordic brand)

- Rebuilt `waitlist_confirmation`, `waitlist_owner_notify`, and `waitlist_invite` in `server/lib/emailTemplates.js`.
- Nordic palette (#F0EDE8 parchment, #1E5C3A forest accent), Familjen Grotesk + Figtree, hosted logo from `aiimin.in/AIIMIN_logo.svg`.
- Confirmation: position badge, OS-ID block, founding perks list, referral link, founder note.
- Owner notify: structured signup table + total count; feedback uses same branded layout.
- Files: `server/lib/emailTemplates.js`, `server/routes/waitlist.js`

## 2026-07-07 (EC2 DB fix — Supavisor aws-1 pooler)

- Fixed waitlist DB on EC2: use `aws-1-ap-south-1.pooler.supabase.com:5432` (session pooler), user `postgres.yubxgftugxbwtywyhcsv`, not `db.*.supabase.co` (IPv6-only) or `aws-0` shard.
- `server/lib/db.js`: explicit `.env` load, strip `sslmode=require`, `resolveDatabaseUrl()` for legacy direct URLs.
- Added `scripts/verify-db-connection.mjs` and `scripts/probe-supabase-pooler.mjs`.
- Production waitlist signup verified: position + count increment on `api.aiimin.in`.

## 2026-07-06 (cleanup + ship modular waitlist v9)

- Removed dead CSS: old roadmap timeline/bar, pre-signup OS-ID checkbox, founder-signal.
- Vault: updated `Waitlist.md` + `_manifest.json` status for modular landing + phase ladder.
- Ready to push: frontend landing modules, brand page, waitlist API duplicate-email OS-ID attach.

## 2026-07-06 (launch journey — phase ladder)

- Replaced cluttered 3-column journey+module grid with vertical **4-phase ladder**: Reserve access → Founding launch → Module rollout → Full OS expansion.
- Each phase shows window, status pill, "Your move" vs "What unlocks", and access/approval note (waitlist vs tester).
- Legend row: Open now · At launch · Rollout · Expansion.
- Files: `WaitlistLaunchJourney.jsx`, `waitlistLandingData.js`, `waitlistLanding.css`

## 2026-07-06 (modular refactor, hero parity, premium pricing, launch journey)

- Refactored monolithic `WaitlistLanding.jsx` (~1000 lines) into thin orchestrator + `frontend/src/components/waitlist/landing/*` modules with shared `waitlistLandingData.js`.
- Hero: full-width `waitlist-top-bar` (brand lockup + exclusive badge + theme toggle); equal-height split panels via stretch grid + flex columns.
- Pricing: premium tier cards with icons, checkmark feature lists, elevated Pro glow/gradient; extracted `WaitlistPricingSection.jsx`.
- Journey: merged "How it works" + roadmap into `WaitlistLaunchJourney.jsx` — three user steps woven with module ship cards.
- Testimonials: credible regional personas (2 professors, 1 student, 1 working professional) — no IIT/IIM celebrity tone.
- Files: `WaitlistLanding.jsx`, `waitlistLanding.css`, `components/waitlist/landing/*`

## 2026-07-06 (pricing personality, access parity, roadmap motion, Life OS copy)

- Hero: **One screen. Every day.** on top; habits/money/focus line below. Aggressive Life OS positioning (web + native app) — removed "dashboard" marketing.
- Early access: tester card +2 perks (6 each); equal-height flex cards with CTAs pinned to bottom.
- Roadmap: phased timeline with animated progress rail, status nodes (done/building/planned), phase labels + tooltips inline.
- Pricing: per-tier accent bar, watermark letter, tagline, tinted gradients (slate/teal/green/amber).
- Comparison: replaced long bar chart + table with compact **stack vs AIIMIN** visual + tier pills.
- Files: `WaitlistLanding.jsx`, `waitlistLanding.css`

## 2026-07-06 (conversion hero — less friction, fixed typography)

- Fixed: hero left column top-aligned; preview moved to left, form-only on right (sticky).
- Removed: duplicate 3-bullet checklist, preview pill tabs, segmented Light/Dark toggle.
- Fixed: "money" uses same display font + accent color (no Bodoni italic bug).
- Moved: OS-ID reservation to post-signup confirmation with Skip; removed pre-CTA checkbox.
- Backend: duplicate email signup can attach `reserved_username` if not yet set.
- Files: `WaitlistLanding.jsx`, `WaitlistForm.jsx`, `waitlistLanding.css`, `server/routes/waitlist.js`

## 2026-07-06 (hero alignment, pricing polish, brand story page)

- Fixed: hero left column top-aligned with form card (`align-items: start`) — no longer vertically centered between form + preview.
- Removed: founder credit line from hero and footer.
- Changed: pricing cards — neutral typography, single "Recommended" eyebrow on Pro, strikethrough list + founding price stack (no green FOUNDING PRICE pills).
- Changed: "AIIMIN tiers at a glance" → clean 3-column table (Plan / Standard / Waitlist).
- Changed: `/brand` waitlist brand page — Editor Pick logo only, name + mark story, removed forest green palette, pillars, compliance block, and product system brand link.
- Files: `WaitlistLanding.jsx`, `WaitlistBrand.jsx`, `waitlistLanding.css`, `brandPage.css`

## 2026-07-06 (backend audit — migrations + approve fix)

- Applied on Supabase: `034_waitlist_referrals.sql` (referral_code, referred_by, referral_count) and `033_tester_allowlist_role_guard.sql`.
- Fixed: `POST /api/waitlist/approve` — INSERT used non-existent `approved_at`/`approved_by` columns; now uses live schema (`email`, `role`, `tier`, `invited_by`).
- Status: DB ready for referral signups; EC2 deploy + SES env still required for production email; sign-in placeholder blocks tester login until Cognito/Supabase OAuth restored.
- Files: `server/routes/waitlist.js`, Supabase migrations via MCP.

## 2026-07-06 (navless hero, left-column brand lockup)

- Removed: sticky top navbar on waitlist landing.
- Added: **AIIMIN** brand lockup (mark + wordmark) top of left hero column → links to `/brand`; theme toggle floats top-right of hero.
- Changed: left column parchment panel (NORD-style split); preview pills + glass stat cards on dashboard mock.
- Files: `WaitlistLanding.jsx`, `waitlistLanding.css`

## 2026-07-06 (reference-inspired hero polish)

- Changed: Garnerly/QriosX-style split hero — copy + checkmark features left, elevated form card + preview right.
- Added: exclusive early access badge, Bodoni serif accent on "money", avatar stack social proof, muted trust tool pills.
- Added: form card header ("Get early access", launching badge), segmented Light/Dark nav toggle, static orbital background rings.
- Files: `WaitlistLanding.jsx`, `WaitlistForm.jsx`, `WaitlistSocialProof.jsx`, `waitlistLanding.css`
- Status: pending build verify.

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
