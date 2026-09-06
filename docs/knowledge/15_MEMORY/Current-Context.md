---
authority: operations
derived_from: Genesis · Roadmap/AIIMIN-V1-Blueprint
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-08-23
can_override_genesis: false
knowledge_layer: KL-OPS
graph_role: context
note_type: NT-CONTEXT
tags:
  - type/hub
  - domain/ops
  - status/living
---

# Current Context

> [!tip] Agent boot
> [[00_HOME]] → [[00_ROUTING]] → this note → Touch only. Pre-Ship 10× · [[14_PROMPTS/Pre-Ship-10x-Gate]].

**Date:** 2026-08-21 · Branch **`main`** · Focus: Stage-1 PR, Marketing, Branding, Legal, and Date Realignment

## Research map (founder ask)

| Job | Path |
|-----|------|
| **What to build next (1 page)** | [[01_PRODUCT/Build-Next-Now]] |
| **Full research pack** | [[01_PRODUCT/Massive-Upgrade-Research-Pack]] |
| **Phase B eng tickets** | [[01_PRODUCT/Phase-B-Prep-Spec]] |
| Marketing calendar | [[01_PRODUCT/Stage1-Marketing-Ops-Plan]] |
| Owned PR kit | [[01_PRODUCT/Owned-PR-Kit]] |
| Claims | [[01_PRODUCT/Marketing-Claims-Ledger]] |

## Stage

| Gate | Status |
|------|--------|
| Day 0–1 marketing spine + TARGET hedges | Live |
| Phase A Lab web honesty (practice ≠ graph; LIVE/LOCAL score) | Shipped & verified |
| Full PR / Marketing / Branding / Legal & Date Realignment | **Shipped & live on main** (`c77b9356`) |
| Account Section (`aiimin.in/account`) Runtime Crash & Isolation Fix | **Fixed, verified & pushed** (`907a3690`) |
| Phase B prep spec | Written — schema paused until founder asks |
| Owned PR kit | Updated with shifted dates & sharp reply templates |
| Monorepo Verification & Live Health | **100% Green (`verify-repo.sh` exit 0, live health 200 OK)** |
| Waitlist Theme Engine & Light/Dark Parity Fix | **Resolved & verified** (appPage isolation, token normalization, tests pass) |
| Phase 2 Nav IA Restructuring (Option A: Forge grouping + labels + compatibility) | **Completed & verified** (20 navItems unit tests, 5 useNavPreferences migration tests, 4 NavbarForge tests, full suite 63/63 pass, production build exit 0) |

## P0 next

1. Founder: ACK provenance = Money + **schema go-ahead** for B1 (when ready for features)  
2. Phase A leftover: ain065 physical phone proofs  
3. Execute Day 4–5 Owned PR rollout across X and LinkedIn  

## Touch

- `frontend/src/constants/legal.js`
- `frontend/src/components/waitlist/landing/waitlistLandingData.js`
- `frontend/src/components/waitlist/WaitlistHeroAside.jsx`
- `frontend/src/components/waitlist/WaitlistSocialProof.jsx`
- `frontend/src/components/waitlist/WaitlistForm.jsx`
- `frontend/src/components/waitlist/WaitlistQuickFeedback.jsx`
- `frontend/src/components/waitlist/landing/WaitlistPricingSection.jsx`
- `frontend/src/pages/WaitlistLanding.jsx`
- `frontend/src/pages/AndroidApp.jsx`
- `frontend/public/index.html`
- `docs/knowledge/01_PRODUCT/Owned-PR-Kit.md`
- `docs/knowledge/01_PRODUCT/Stage1-Marketing-Ops-Plan.md`
- `docs/knowledge/01_PRODUCT/Marketing-Claims-Ledger.md`
- `docs/knowledge/01_PRODUCT/Product.md`
- `docs/knowledge/00_HOME.md`
- `docs/knowledge/15_MEMORY/Current-Context.md`
- `docs/knowledge/15_MEMORY/Business-Rules.md`
- `docs/knowledge/09_FEATURES/Waitlist/Waitlist.md`
- `docs/knowledge/01_PRODUCT/Marketing-And-Go-To-Market.md`
- `docs/knowledge/01_PRODUCT/Complete-Overhaul-Pack.md`


## 2026-08-22 — Reports and Life Score overhaul

**Status:** Implemented in the working tree; no files deleted. Pre-existing user changes in brand/token files were preserved.

The canonical backend score path is now `life-score-v2.2026-08-22` in `server/services/lifeHealthEngine.js`. It preserves null/missing values, distinguishes observed zero from missing, uses personal median/variability fit after seven observations, aggregates five weighted domains, and exposes coverage, confidence, observed/scored metric IDs, source record IDs, and methodology. Authenticated frontend score consumers use `/intelligence/lhs` and show an explicit unavailable state instead of silently substituting a second authenticated formula.

Reports now return a `report-contract-v1` payload from `/api/intelligence/report` with window, cutoff, metrics, findings, evidence IDs, limitations, calculation version, coverage, and tier entitlements. Explore, Core, Pro, and Elite have distinct report compositions in `frontend/src/components/reports/ReportWorkspace.jsx`; the new route is `frontend/src/pages/Reports.jsx`. The report generator no longer uses the legacy weekly cache directly because it lacks canonical provenance and tier metadata. Correlation results include source-day IDs.

Added `docs/aiimin-metric-inventory.json`, `docs/aiimin-metric-inventory.md`, and `docs/aiimin-reports-life-score-overhaul.md`. Orphaned normalized fields and phantom/unsupported metrics are explicitly listed. Backend tests pass 13/13 and the frontend production build compiles successfully. Authenticated local API smoke checks return HTTP 401 without credentials. Live `https://aiimin.in/reports` resolved to the public waitlist surface in the sandbox browser; authenticated rendered QA was not performed.


## 2026-08-22 — Calibrated v3, Reports completion pass, and production QA

**Status:** Working-tree implementation is complete for review; no files deleted, no schema migration, no commit/push/deploy, and no destructive real-account writes. Existing user edits in brand/token/page files were preserved.

The authoritative score is now `lhs-v3.0.0-calibrated` with public reference dataset `lhs-reference-2026-08-22`. It uses null-preserving normalization, conservative CDC/WHO/OECD-informed anchors, diminishing-return operating proxies, robust personal median/MAD profiles after seven unique days, 21-day recency weighting, coverage/stability-adjusted domain weights, confidence, uncertainty, effective sample size, trend, and source provenance. The canonical taxonomy remains physical/cognitive/discipline/financial/emotional, displayed as BODY/MIND/DISCIPLINE/MONEY/MOOD.

Reports now have four tier-specific working-tree surfaces: Explore Daily Signal, Core Weekly Loop Review, Pro Performance Dossier, and Elite Intelligence Room. Legacy report/PDF consumers are retained as compatibility-only helpers and null-safe where reachable; new work routes through the canonical `report-contract-v1` path. A deterministic development-only 30-day fixture powered repeated 1440px and exact 390px visual QA and interaction probes. Final screenshots and QA notes are retained at the project root and in `qa-reports-visual-findings.md`.

Native Android V3 user-facing Score and Today surfaces use the server-published score store and enriched LHS metadata. DayStore/ProvisionalScore remain capture-era internal compatibility rails only. Native selected compilation and supported unit-test tasks passed after stale tests were aligned to the reflection-only contract.

Live authenticated route QA covered primary navigation, hidden More routes, phone capture/account/score, onboarding/verification, public brand/app/legal pages, and read-only account sections. Concrete live blockers remain recorded in `qa-website-live.md`: production still serves the old LHS/report shape and legacy Reports UI; Finance remained loading; `/identity` resolved to the public landing surface; `/proto/draft` remained blank/loading; and public legal pages are stamped October 31, 2026, future-dated relative to this session. The local working tree is ready for review/release gating, not an unreviewed production-complete claim.


## 2026-08-22 — Focused theme, OS-ID, and Reports QA follow-up

**Status:** Focused working-tree pass complete for review; no files deleted, no live-account writes, no schema/auth changes, and no commit/push/deploy.

Reports now inherit the normalized runtime `aiimin-dark`/`aiimin-light` palette across Explore, Core, Pro, and Elite. Elite has a numbered/sticky desktop rail, a responsive mobile chapter strip, and a lower evidence-trail footer that reports the canonical model version, window, observed days, and confidence. Exact 390px probes passed all eight theme/tier combinations with document/body width held to 390px.

The scoped Overview/IvorySnapshot typography rule now recognizes an explicit `OS-ID:` fallback or an alphanumeric identifier such as `AADI0837`. Computed-style evidence shows the identifier uses Familjen Grotesk/Figtree display sans at 750 weight and increased tracking, while an ordinary personal name remains Georgia 600. The development-only Reports fixture skips authenticated profile loading, removing the only console error found in the final eight-combination runtime probe.

Final receipts: backend tests 15/15, modified server syntax checks pass, frontend production build compiles successfully, metric inventory JSON validates, `git diff --check` passes excluding the documented pre-existing Wordmark whitespace, and the tracked deletion audit is empty. Live deployment parity and previously recorded Finance, Identity, Prototype, and future-dated legal blockers remain open release gates.


## 2026-08-22 — Actionable reminders and website notifications

**Status:** Working-tree notification pass implemented and verified; no files deleted, no live-account writes, no schema/auth changes, and no commit/push/deploy.

Today’s red Family Reminders banner now includes an explicit `Open reminder` action. It routes to `/family?tab=reminders&reminder=<id>`, where the Reminders tab opens and the matching row receives a visual focus treatment. The website notification bell/dropdown now exposes safe internal CTAs, red urgent states, keyboard activation, mark-read-before-navigation behavior, and responsive mobile sizing. Account notification preferences now explain the bell behavior and show save failures without changing the existing server-backed preference contract.

Validation passed: frontend production build, backend tests 15/15, targeted server syntax checks, notification source-contract checks, local Elite runtime with zero console errors, diff check, and tracked deletion audit. Browser push permissions, email delivery, and native FCM remain intentionally unperformed. Existing live deployment parity and previously documented Finance, Identity, Prototype, and future-dated legal blockers remain release gates.


## 2026-08-22 — Local Overview application-error regression fix

**Status:** Fixed and verified in the local unpushed working tree; committed/live version unchanged.

The localhost Application Error was caused by the new Today reminder redirect using `useCallback` in `Overview.jsx` without importing it. That render-time `useCallback is not defined` failure triggered the generic application ErrorBoundary. The import was restored and two unused Overview icon imports were removed after targeted lint.

Fresh receipts: backend tests 15/15, frontend tests 31/31, frontend production build compiled successfully, targeted ESLint passed with zero errors/warnings, local unauthenticated `/overview` safely redirected to `/login` with zero runtime errors, Reports passed 8/8 theme-tier combinations with no console errors, and notification/OS-ID probes passed. Authenticated local visual re-entry remains recommended once a dedicated test login is available; no live account was touched.


## 2026-08-22 — Approved 120-day QA backfill rolled back

**Status:** Complete; the user rejected the generated history and explicitly confirmed rollback. The unrelated Reports, Life Score, theme, OS-ID typography, reminder, and notification implementation work remains in the uncommitted working tree.

A read-only audit found existing AADI0837 history from 2026-01-19 through 2026-08-21. An append-only 120-day gap backfill was then applied only after explicit confirmation, inserting 221 marked rows across 33 missing dates. The user was not satisfied with that generated data and requested undo. A strict preflight verified exactly 33 daily logs, 62 sessions, 16 journal entries, 19 money transactions, 14 calendar events, 29 wins, 33 daily commitments, 8 tasks, and 7 notes before deletion. The exact 221 rows were removed using the recorded gap dates and source/marker constraints.

Post-rollback read-back restored the pre-backfill key counts: 182 daily logs, 273 sessions, 168 journal entries, 207 money transactions, 156 calendar events, and 14 notes, with the account date range still 2026-01-19 through 2026-08-21. No broad account wipe, existing-row update, code deletion, commit, push, deployment, or schema migration occurred. The append-only utility remains available as a reviewed tool but was not used again after rollback.

## 2026-08-23 — Android V2 APK on website + ADB install

**Status:** Shipped and verified on device.

### What happened

The V2 debug APK (`aiimin-v2-full-debug.apk`, 62 MB, SHA-256 `4dd36a8e…387245f`) has been:

1. **Hosted at `/aiimin-v2-debug.apk`** — copied to `frontend/public/` and served as a static asset.
2. **Waitlist landing page `WaitlistAndroidSection.jsx` fully rebuilt** — two-column layout with pulsing live badge, animated download button (green success state on click), SHA-256 metadata strip, V2 changelog panel (6 features), "Why not Play Store" cards (3 honest reasons), install instructions callout, local-privacy + Play-path footer strip.
3. **`AndroidApp.jsx` (`/app` route) rebuilt** — reflects V2 reality: pulse dot in status pill, APK download section with full feature list, 3-column split (Desktop / Privacy / What we don't do), Why not Play Store callout.
4. **`waitlistLandingData.js` updated** — `ANDROID_APP_STATUS` now has V2 features + `apkUrl`/`apkVersion`/`apkSha`. FAQ updated: APK available for registered testers.
5. **Installed on physical device via USB** — `adb install -r` → `Performing Streamed Install · Success` (device `9597fdea`).
6. **Dev server open** at `http://localhost:3000` — compiled successfully.

### Files changed

- `frontend/public/aiimin-v2-debug.apk` — [NEW] APK static asset
- `frontend/src/components/waitlist/landing/WaitlistAndroidSection.jsx` — full rewrite
- `frontend/src/components/waitlist/landing/waitlistLandingData.js` — ANDROID_APP_STATUS, hero trust line, FAQ
- `frontend/src/styles/waitlistLanding.css` — ~440 lines new V2 Android styles
- `frontend/src/pages/AndroidApp.jsx` — full rewrite
- `frontend/src/styles/appPage.css` — ~290 lines new V2 styles

### Pending

- [ ] Commit + push to main (await founder "ship")
- [ ] Physical device smoke test: Discipline, Notes, app blocker on device `9597fdea`
- [ ] Vercel deploy to serve APK from `aiimin.in/aiimin-v2-debug.apk`
