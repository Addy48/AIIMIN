# Account Personalization

## Current state

- Theme and text-size controls exist in account personalization UI
- Text-size now persists in `user_profiles.font_scale` and hydrates on profile fetch
- Local bootstrap still applies immediately from localStorage and is reconciled with profile state after auth
- Life-mode presets (Student, Founder, etc.) now apply nav pins, overview widget visibility, and sports defaults in one click

## Key files

- `frontend/src/pages/account/sections/PersonalizationSection.jsx`
- `frontend/src/pages/account/sections/SubscriptionSection.jsx`
- `frontend/src/components/account/TierUpgradeCelebration.jsx`
- `frontend/src/components/account/PlanStatusChip.jsx`
- `frontend/src/components/settings/NavPinEditor.jsx`
- `frontend/src/constants/navItems.js`
- `frontend/src/hooks/useNavPreferences.js`
- `frontend/src/components/overview/OverviewWidgetGrid.jsx`
- `frontend/src/index.js`
- `frontend/src/hooks/useUserProfile.js`
- `server/services/userProfileService.js`
- `server/services/billingService.js`
- `server/routes/billing.js`
- `server/routes/account.js`

## Changelog

### 2026-07-11 — Account plan UX polish (desktop width + profile chip)
- **What:** Account page uses wider desktop layout (~1680px). Plan status lives only on My Profile via `PlanStatusChip` (tier icon + color, copy like `till 10 aug 2026`) — removed from sidebar. Stripe/testing billing banner and celebration “Testing · no charge” removed; celebration receipt shows Valid till date. Celebration modal wider on laptop/desktop.
- **Why:** Desktop felt cramped; plan letter badges (C/P/E) and duplicate sidebar chip; Stripe copy premature.
- **Files:** `frontend/src/pages/account/AccountPage.jsx`, `frontend/src/pages/account/sections/ProfileSection.jsx`, `frontend/src/pages/account/sections/SubscriptionSection.jsx`, `frontend/src/components/account/PlanStatusChip.jsx`, `frontend/src/components/account/TierUpgradeCelebration.jsx`, `frontend/src/styles/subscriptionSection.css`, `frontend/src/styles/tierUpgradeCelebration.css`
- **Status:** shipped

### 2026-07-11 — Fix live upgrade 500 + plan badge + active-until
- **What:** Removed top-level `stripe` import that crashed the whole billing router on EC2 (`ERR_MODULE_NOT_FOUND`). Upgrades always use `POST /billing/select-tier`. Added `subscription_period_end` (1 month from plan change). Account sidebar + profile show colored plan mark; click opens Subscription. CTAs show price (`Upgrade to Core · ₹29/mo`). Banner shows Active until date.
- **Why:** Live Internal Server Error on every upgrade click; user asked for plan indicator + month active window + clear prices.
- **Files:** `server/routes/billing.js`, `server/services/billingService.js`, `server/services/userProfileService.js`, `server/migrations/040_subscription_period_end.sql`, `frontend/src/pages/account/AccountPage.jsx`, `frontend/src/pages/account/sections/ProfileSection.jsx`, `frontend/src/pages/account/sections/SubscriptionSection.jsx`, `frontend/src/styles/subscriptionSection.css`, `frontend/src/utils/tierGating.js`
- **Status:** shipped


- **What:** Plan changes work for every signed-in user without Stripe. `POST /api/billing/select-tier` enabled when Stripe is not configured (or `SUBSCRIPTION_MODE=true`). Access service honors profile tier in click-upgrade mode (no force-elite overwrite). Subscription UI: per-tier card colors + identity-shift celebration overlay (hold → land → unlocks → receipt). `UPGRADE_ONLY=true` later blocks downgrades.
- **Why:** Upgrade buttons returned errors in prod; no payment provider yet; testing needs instant up/down for all accounts.
- **Files:** `server/services/billingService.js`, `server/routes/billing.js`, `server/services/accessService.js`, `frontend/src/pages/account/sections/SubscriptionSection.jsx`, `frontend/src/components/account/TierUpgradeCelebration.jsx`, `frontend/src/styles/tierUpgradeCelebration.css`, `frontend/src/styles/subscriptionSection.css`, `deploy/.env.production.example`
- **Status:** shipped
- **Notes:** Set `UPGRADE_ONLY=true` when ready to lock downgrades. Stripe checkout resumes automatically once price env vars are set and `SUBSCRIPTION_MODE=false`.


- **What:** Fixed `column "nav_preferences" does not exist` on Life Arc save; inline Arc mark + wordmark alignment; quieter onboarding copy (no orange stub message); `?northStar=1` redirects to `?arc=1`; quote stripping on sharpen/save
- **Why:** Continue failed on onboarding; stacked logo and dev-facing orange text hurt usability
- **Files:** `server/services/userProfileService.js`, `frontend/src/components/brand/ArcLockup.jsx`, `frontend/src/components/profile/ArcEditor.jsx`, `frontend/src/pages/Onboarding.jsx`, `frontend/src/index.css`
- **Status:** shipped

### 2026-07-09 — Arc rebrand (Life Arc)
- **What:** North Star renamed to **Arc** — tagline *Where your story is headed*; layers Daily Arc / Weekly Arc / Life Arc; custom `ArcMark` icon; API `/intelligence/arc/sharpen`; DB field `tagline` unchanged
- **Why:** User wanted minimal, beautiful Arc branding wired through the OS
- **Files:** `frontend/src/constants/arc.js`, `frontend/src/components/brand/ArcMark.jsx`, `frontend/src/components/profile/ArcEditor.jsx`, `server/lib/arcContext.js`
- **Status:** shipped

### 2026-07-09 — North Star OS wiring + mandatory onboarding
- **What:** Renamed presentation to **North Star / Your OS priority**; mandatory onboarding step with AI sharpen (64-token cap) + rule-based fallback; `NorthStarGuard` blocks app until set; banner on Overview + context in Command Center priorities
- **Why:** User wanted active OS context users care to set up, not decorative copy
- **Files:** `frontend/src/components/profile/NorthStarEditor.jsx`, `frontend/src/pages/Onboarding.jsx`, `server/routes/intelligence.js`, `server/lib/northStarSharpen.js`
- **Status:** shipped

### 2026-07-09 — North Star + light logo default
- **What:** Replaced Signal line with **North Star** — active AI context with examples and purpose copy (DB field `tagline`); server injects North Star into `/intelligence/generate` and `/intelligence/chat`; `user_profiles` GET/PATCH now returns `tagline` and full profile fields; light Arch Bracket logo is default in navbar/waitlist (dark variant only on login hero)
- **Why:** Profile field should shape planning and nudges, not act as decoration; dark logo was showing on surfaces where light mark reads better
- **Files:** `frontend/src/pages/account/sections/ProfileSection.jsx`, `server/lib/northStarContext.js`, `server/routes/intelligence.js`, `server/services/userProfileService.js`, `frontend/src/components/brand/archBracketMark.js`, `frontend/src/components/brand/BrandLockup.jsx`
- **Status:** shipped

### 2026-07-09 — Subscription mode + tier gating
- **What:** `SUBSCRIPTION_MODE` / `REACT_APP_SUBSCRIPTION_MODE` enable instant plan selection (no Stripe); `POST /api/billing/select-tier`; subscription cards show Active / Upgrade / Switch; route guards block Core+ and Pro+ pages by tier; `FeatureGate` blocks in-feature upsells
- **Why:** User requested workable upgrade buttons and tier-wise restrictions before billing integration
- **Files:** `server/services/billingService.js`, `server/routes/billing.js`, `server/services/accessService.js`, `frontend/src/pages/account/sections/SubscriptionSection.jsx`, `frontend/src/utils/tierGating.js`, `frontend/src/components/account/TierRouteGuard.jsx`, `frontend/src/components/account/FeatureGate.jsx`, `frontend/src/App.js`, `frontend/src/hooks/useUserProfile.js`
- **Status:** shipped (billing deferred)

### 2026-07-09 — Profile status label, ranks ladder, calendar UX
- **What:** Renamed UI label "Tagline" → "Profile status" (API field `tagline` unchanged); Life ranks section collapsible with current rank, XP progress bar, next-tier unlock hint; OS-ID card compact collapsible header with tighter letter-spacing; Security section hides Reconnect when Google already connected
- **Why:** Discord-style status copy; ranks should feel worth earning; OS-ID polish; Reconnect + Disconnect together was confusing
- **Files:** `frontend/src/pages/account/sections/ProfileSection.jsx`, `frontend/src/components/gamification/RankLadder.jsx`, `frontend/src/pages/account/sections/SecuritySection.jsx`
- **Status:** shipped

### 2026-07-09 — Account sign-out, subscription tiers, OS-ID credential
- **What:** Sign out button in account sidebar footer; subscription section shows all 4 tiers (Explore/Core/Pro/Elite) with waitlist-aligned prices and founding rates for Pro/Elite; profile OS-ID card redesigned as locked credential with monospace brackets and copy feedback
- **Why:** User could not log out from account page; subscription UI showed 3 tiers at stale prices (₹25/₹61); OS-ID presentation felt generic
- **Files:** `frontend/src/pages/account/AccountPage.jsx`, `frontend/src/pages/account/sections/SubscriptionSection.jsx`, `frontend/src/pages/account/sections/ProfileSection.jsx`, `frontend/src/styles/subscriptionSection.css`
- **Status:** shipped

### 2026-07-08
- Added: persona presets now configure pinned nav, active sections, overview widgets, and sports/team defaults
- Why: one-size nav was not matching student/founder/athlete workflows from Design Lab prototypes
- Files: `frontend/src/constants/navItems.js`, `frontend/src/hooks/useNavPreferences.js`, `frontend/src/components/overview/OverviewWidgetGrid.jsx`, `frontend/src/pages/account/sections/PersonalizationSection.jsx`
- Status: shipped

### 2026-07-04
- Moved: text scale from localStorage-only to backend-backed profile field
- Why: cross-device persistence and consistent login hydration
- Files: `server/migrations/029_user_profile_font_scale.sql`, `server/services/userProfileService.js`, `frontend/src/hooks/useFontScale.js`, `frontend/src/hooks/useUserProfile.js`
- Status: shipped
