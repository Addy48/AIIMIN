# AIIMIN Reports and Life Score Overhaul

**Owner:** Aaditya Upadhyay
**Implementation date:** 2026-08-22
**Status:** Implemented and verified in the attached uncommitted working tree; not deployed, committed, or pushed.

> Life Score is a **transparent operating signal** about logged days. It is not a clinical diagnosis, a causal explanation, a population ranking, or a moral judgment. Missing is not zero, an association is not causation, and a precise-looking number is not evidence of certainty.

## Executive result

The working tree now has one authoritative server-side Life Score engine, `lhs-v3.0.0-calibrated`, consumed by authenticated web and native Android user-facing surfaces through the `/intelligence/lhs` contract. The model combines conservative reference anchors, per-metric transformations, denominator-aware aggregation, personal baselines, recency weighting, coverage and stability adjustments, confidence, uncertainty, effective sample size, trend, and source provenance. It does not silently fall back to a second authenticated browser or native score formula.

The web Reports route now has four tier-specific compositions: Explore Daily Signal, Core Weekly Loop Review, Pro Performance Dossier, and Elite Intelligence Room. Each tier has explicit entitlements, missing-data language, source/evidence presentation, canonical five-domain naming, and a deterministic development-only fixture for visual and interaction QA. Retained legacy report/PDF helpers are marked compatibility-only and have been made null-safe where they remain reachable; the authenticated Reports route is routed to the canonical workspace in the working tree.

The native Android V3 Score and Today surfaces now headline the server-published score state. Local day reflection rails remain capture inputs only; they are not user-facing authoritative Life Score values. The published-score store maps canonical BODY, MIND, DISCIPLINE, MONEY, and MOOD domains plus coverage, confidence, uncertainty, trend, effective sample size, and calculation/reference versions.

## Canonical taxonomy

The model preserves the existing ADR taxonomy exactly:

| Internal domain | User-facing label | Example input families |
| --- | --- | --- |
| `physical` | BODY | Sleep, steps, training logged, water |
| `cognitive` | MIND | Focus minutes, focus cycles, learning logged |
| `discipline` | DISCIPLINE | Habit completion, routine adherence, commitments |
| `financial` | MONEY | Budget adherence, savings rate, raw money-in/out context |
| `emotional` | MOOD | Mood check-in, journal-presence signal |

No new dimension was introduced. Raw `daily_spend` and `daily_income` remain visible context signals, but do not become a simplistic quality judgment by themselves.

## Model contract and data flow

The canonical path is:

```text
server-normalized source records
  -> metric registry and null-preserving derivation
  -> reference/objective metric scoring
  -> personal baseline profile after 7 unique observation days
  -> recency-weighted domain aggregation
  -> coverage/stability-adjusted global aggregation
  -> confidence, uncertainty, ESS, trend, provenance
  -> /intelligence/lhs and report-contract-v1
  -> authenticated web and native Android published-score stores
```

The normalized data layer combines `daily_logs`, `pomodoro_sessions`, `money_transactions`, `daily_commitments`, `routine_runs`, and `habit_logs`. Each normalized day preserves source record IDs. The system distinguishes an absent value, an observed zero, an observed false boolean, an empty reflection, and an unavailable calculation. This distinction is required for trustworthy reports.

The API emits the enriched LHS metadata from the same calculation used by the report contract. Canonical report findings include stable IDs, domain, claim type, confidence, sample size, effect, lag where applicable, supporting and counter-source IDs, limitations, method, calculation version, and window/cutoff metadata. Tier capability enforcement remains server-side.

## Calibrated Life Score model

The authoritative implementation is `server/services/lifeHealthEngine.js` with calculation version `lhs-v3.0.0-calibrated`. The public reference registry is `server/services/lifeScoreReferenceData.js` with dataset version `lhs-reference-2026-08-22`.

### Scoring layers

| Layer | Implemented behavior | Missing-data rule |
| --- | --- | --- |
| Objective metric score | Conservative operating bands, diminishing-return proxies, percentages, boolean observations, self-report normalization, and derived finance ratios | A missing value returns `null`; it is excluded from the metric/domain denominator |
| Personal fit | Robust median and MAD/standard-deviation profile for each metric after at least 7 unique observation days; metric score becomes `65% objective + 35% personal fit` when applicable | No profile means objective-only; boolean/presence metrics do not receive false precision from personal-fit modeling |
| Domain score | Weighted mean of observed scored metrics within each of the five domains | Domains with no observed scored metric do not contribute as zero |
| Domain weight | Declared domain base weights adjusted by coverage/information quality and volatility/stability, then normalized across available domains | Weight changes are disclosed in metadata; the model does not pretend unobserved domains were poor |
| Time weighting | Exponential recency weighting with a 21-day half-life | Older observations remain available but contribute less to current-window estimates |
| Global score | Weighted mean of available domain scores on a 0–100 scale | The denominator contains available domain weight only |
| Confidence | `insufficient`, `exploratory`, `moderate`, or `strong` based on scored days and coverage | Confidence is shown beside the score |
| Uncertainty | A bounded uncertainty band derived from coverage, sample size, and signal stability | Uncertainty is not hidden or replaced by a false precision claim |
| Trend | Window comparison and directional summary derived from observed scored timeline | No comparison is claimed when the comparison window is unavailable |
| Provenance | Metric IDs, source paths, source record IDs, model labels, calculation/reference versions, window and cutoff | Every report surface can state where its result came from |

### Reference and product anchors

The model uses external references to constrain defaults, not to rank a user against a population. CDC sleep guidance supports a conservative adult minimum of seven hours and an operating band of 7–9 hours.[1] WHO activity guidance is used as context for activity signals; the engine deliberately does not claim a universal step threshold.[2] OECD subjective-well-being guidance supports consistent self-report measurement alongside objective dimensions.[3]

The 8,000-step saturation value and four-bottle water saturation value are product operating proxies with diminishing returns, not medical thresholds. The registry explicitly labels them as product anchors. The boolean training signal means “training was logged,” not “all physical activity was captured.” Journal is scored only for presence; its content is not scored by the Life Score engine.

The financial model exposes raw money movement, computes budget adherence from the existing 1,500 INR product target when spend exists, and derives savings rate only when the required income/spend inputs exist. This target remains a disclosed product-policy constant and should become user-configurable before budget adherence is promoted as a strongly personalized financial measure.

## Report tiers

| Tier | User job | Working-tree surface | Entitlements and safeguards |
| --- | --- | --- | --- |
| Explore | Notice what happened today | Daily Signal | Selected-day signals, 7-day observed/missing pulse, coverage, uncertainty, raw metric groups, one descriptive observation, Core preview; no causal/correlation language |
| Core | Review and reset the weekly loop | Weekly Loop Review | Current/prior comparison, strongest/lowest observed days, five-domain change grid, weekly pulse, three reversible commitments; no predictive or association claims |
| Pro | Understand recurring patterns | Performance Dossier | 14/30/60/90/YTD/custom window controls, coverage ribbon, five-domain system balance, ranked findings, expandable evidence, domain/confidence/direction/sample filters, metric search, reversible experiment draft; no open-ended investigation |
| Elite | Investigate and test the personal system | Intelligence Room | Situation, Systems, Patterns, Investigate, Forecast, and Action chapters; signal graph, source-day rail, alternative explanations, scenario assumptions, experiment builder, deep-report status; no analytical layer is withheld beyond privacy/entitlement limits |

The backend accepts only supported windows in the 7–365 day range. Core is intentionally a weekly review. Pro and Elite have explicit window controls. The UI states when a value is descriptive, insufficient, or fixture-only.

## Evidence and export behavior

The canonical report contract is the source for the new workspace and standard PDF flow. Findings expose method, sample size, effect, source IDs, counter-source IDs, and limitations. The PDF generator requires the documented scored-day eligibility and uses the five canonical domains. It does not create fabricated findings or convert `null` into a zero. Retained `ReportSections.js`, `ReportPdfUtils.js`, `ReportPreviewModal.jsx`, and `PatternsPanel.jsx` remain available for compatibility but are labeled as legacy helpers; new Reports work must not route through them.

Stable client-side finding IDs and source IDs are present in the working tree. Persisted report-run IDs, share/deep links, durable experiment records, and metric/finding detail routes remain follow-up product work and are not represented as complete capabilities.

## Safe demo and seed-data strategy

The working tree includes `frontend/src/utils/reportDemoFixture.js`, a deterministic 30-day synthetic fixture that is enabled only in non-production development mode through `/reports-demo?demo=1&tier=explore|core|pro|elite`. The fixture is explicitly labeled “Demo data only” and never represents the authenticated user. It was used for all four-tier desktop/mobile screenshots and interaction probes.

The live authenticated account was initially treated as a read-only baseline. After explicit confirmation, a 120-day append-only QA backfill was temporarily applied to the allowlisted AADI0837 account, then precisely rolled back after the generated history was rejected. The rollback removed only the verified batch and restored the pre-backfill counts; no existing row was updated or broad account wipe was performed. The live `/seed-data` route itself redirected to `/overview` and was not used for this operation.

## Web/native parity

The authenticated web score consumer reads `/intelligence/lhs` and presents an explicit unavailable/insufficient state when the server score is unavailable. Native `PublishedLifeScoreStore` maps the same server output and enriched metadata. `GraphSyncRepository` hydrates bootstrap data and then safely refreshes the enriched Life Score endpoint. The native Score and Today surfaces no longer use the local `DayStore.score` as a visible fallback.

`DayStore.score` and the deprecated `ProvisionalScore` type remain only as internal/capture-era compatibility rails. They are not the published user-facing Life Score. This distinction is intentional: capture can hold local reflection state, but the numeric Life Score shown to users is server-authored and versioned.

## Files implemented or changed for this overhaul

| Area | Files | Result |
| --- | --- | --- |
| Engine/reference | `server/services/lifeHealthEngine.js`, `server/services/lifeScoreReferenceData.js` | Calibrated v3 engine, references, registry, personal profile, recency, uncertainty, provenance |
| Normalization/report API | `server/services/analyticsData.js`, `server/services/reportGenerator.js`, `server/routes/intelligence.js` | Null-preserving records, canonical contract, tier enforcement, enriched LHS/report metadata |
| Intelligence | `server/services/intelligenceReportService.js`, `server/services/correlationService.js` | Missing-safe drivers/drift/forecast/clusters and source-linked correlation output |
| Web score/report | `frontend/src/hooks/useLifeScore.js`, `frontend/src/utils/lifeScoreEngine.js`, `frontend/src/pages/Reports.jsx`, `frontend/src/components/reports/ReportWorkspace.jsx`, `ReportWorkspace.css` | Single authenticated score consumer and four-tier canonical workspace |
| Web legacy containment/export | `IvorySnapshot.jsx`, `PatternsPanel.jsx`, `ReportPreviewModal.jsx`, `ReportSections.js`, `ReportPdfUtils.js`, `PDFReportGenerator.jsx` | Null-safe compatibility paths and canonical standard export |
| Web overview/mobile | `CommandCenter.jsx`, `MobileScorePage.jsx`, `App.js` | Null-safe score presentation, canonical route integration, development-only demo route |
| Native | `PublishedLifeScoreStore.kt`, `ApiDtos.kt`, `GraphSyncRepository.kt`, `ScoreStore.kt`, `ScoreScreen.kt`, `ScoreViewModel.kt`, `TodayScreen.kt`, `ProvisionalScore.kt` | Server-published score surfaces and capture-only local rails |
| Tests/docs | `lifeHealthEngine.test.js`, `intelligenceReportService.test.js`, `PublishedLifeScoreStoreTest.kt`, `ScoreStoreTest.kt`, metric inventory, this report | Contract, missing-data, personal-fit, reference, parity, and documentation coverage |

Pre-existing user modifications in brand, token, page, and related files were preserved. No files were deleted. Generated QA screenshots and temporary probe scripts remain as supporting evidence. No commit, push, deployment, or schema migration was performed. The explicitly approved append-only QA backfill was applied temporarily and then fully rolled back; no existing account row was updated and no broad account wipe was performed.

## Focused follow-up pass — theme, lower-page UX, and OS-ID typography

Reports now inherit the active runtime `aiimin-dark` and `aiimin-light` tokens for canvas, cards, ink, borders, and accent rather than forcing an Elite-only dark palette. The Elite rail is a numbered, sticky desktop chapter navigation that becomes a touch-friendly horizontal strip on mobile. All four tiers remain bounded at exact 390px CSS width in both themes, and the lower evidence-trail footer carries the canonical model version, window, observed days, and confidence for every subscription tier.

The Overview/IvorySnapshot name treatment is intentionally narrow. The `ivory-snap__name--os-id` class applies when the displayed identifier is the explicit `OS-ID:` fallback or an alphanumeric OS-ID such as `AADI0837`; ordinary personal names retain the existing serif treatment. A compiled-style computed probe verified Familjen Grotesk/Figtree display sans at 750 weight with increased tracking for the identifier and Georgia 600 for an ordinary name.

The development-only Reports fixture no longer attempts the authenticated profile request. The final browser probe covered eight theme/tier combinations with zero console errors. This removes test noise without weakening normal authenticated profile loading.

## Notification and reminder wiring follow-up

The Today red Family Reminders banner now presents an explicit `Open reminder` button for each item. The button routes through the existing client router to `/family?tab=reminders&reminder=<id>`; Family reads the query, selects the Reminders tab, scrolls to the matching row, and adds a temporary visual focus ring without mutating the reminder.

The website notification center now classifies urgent reminder/system signals, gives them red row, CTA, bell, and badge treatment, and exposes a clear action label. Clicking or keyboard-activating an actionable item marks it read, navigates only to a safe internal path, and closes the dropdown. Account notification preferences explain the behavior and provide save-error feedback while retaining the existing server-backed preference contract. Browser push permission, email delivery, and native FCM were intentionally not introduced or exercised in this pass.

## Local Overview regression follow-up

The localhost Application Error was a local unpushed regression introduced while adding the Today reminder action. `Overview.jsx` called the new `useCallback` hook without importing it, causing a render-time `useCallback is not defined` failure in the authenticated route. The import was restored, and targeted lint also removed two unused icon imports. The committed/live version was not changed.

Post-fix evidence includes a successful frontend production build, frontend tests `31/31`, backend tests `15/15`, targeted lint with zero errors/warnings, a clean local unauthenticated `/overview` redirect with zero runtime errors, and passing Reports, notification, and OS-ID probes. Authenticated local visual re-entry was not performed because the attached local browser session had no active login, so that final manual check remains a release-gate recommendation rather than an unsupported claim.

## Verification receipts

| Check | Result | Evidence |
| --- | --- | --- |
| Backend tests | **Pass: 15/15** | `npm test` on current working tree |
| Server syntax | **Pass** | `node --check` on modified intelligence/report/analytics/score/reference modules |
| Frontend production build | **Pass** | `cd frontend && npm run build`; CRA reported “Compiled successfully” |
| Native selected Kotlin compilation | **Pass** | Score, Today, data, and network modules compiled in the earlier parity receipt |
| Native supported JVM/Android tests | **Pass after stale-contract alignment** | Published-score contract coverage added; old ScoreStore tests were updated to assert reflection-only behavior |
| Seeded Reports visual QA | **Pass with evidence** | Explore/Core/Pro/Elite at validated 1440px and 390px captures; final files are in the project root |
| Seeded Reports interaction QA | **Pass** | Pro finding expansion, domain filter, honest empty result, metric search; Elite chapter controls were exercised by the interaction harness |
| Local responsive layout probe | **Pass** | Exact 390 CSS-pixel emulation confirmed bounded width; Elite negative-margin defect fixed and re-captured |
| Live authenticated route QA | **Mixed; recorded in `qa-website-live.md`** | Major product routes and public/legal surfaces were opened read-only; specific blockers are listed below |
| Live deployment parity | **Not pass** | Live `/intelligence/lhs` and `/intelligence/report` still return the older deployed shape; working-tree v3 is not deployed |

## Live QA blockers and limitations

The live authenticated account is sparse and was treated as a real-data baseline, not a seed target. Live Overview and embedded legacy report cards still display the old deployed Life Score and report copy. Live Reports/Patterns still render the old legacy UX rather than the working-tree workspace. Live Finance remained in a persistent loading state after an initial wait and is a concrete production blocker. `/identity` resolved to the public product landing surface instead of an authenticated profile/identity page. `/proto/draft` displayed only a loading/blank state. `/login` correctly redirected an already-authenticated session to Overview, `/seed-data` redirected safely to Overview, and `/onboarding` exposed step 1 without submitting it.

The live public Brand, App, About, Contact, Legal Hub, Privacy, Terms, Security, Data Deletion, Cookies, Acceptable Use, Refunds, Grievance, Subprocessors, and AI Disclosure pages loaded with substantive content and legal navigation. The entire legal pack is currently stamped “October 31, 2026,” which is future-dated relative to this QA session on August 22, 2026; it should be corrected or intentionally scheduled before release.

The current evidence does not prove production export download success, account deletion, billing purchase/cancellation, Google OAuth/calendar operations, file upload/download, or native APK runtime behavior. Those actions were intentionally not triggered because they mutate data, invoke external accounts, or require a native device. They remain `not performed`, not “pass.”

## Remaining release gates

1. Deploy the working-tree backend/frontend/native-compatible contract only after review, CI, schema/API compatibility checks, and normal release approval; live output must then be re-queried for `lhs-v3.0.0-calibrated` and `report-contract-v1`.
2. Resolve or explicitly triage the live Finance loading failure, `/identity` route mismatch, and `/proto/draft` blank state.
3. Align or schedule all legal-page effective/last-updated dates.
4. Decide whether orphaned normalized metrics (`breakfast_done`, denominators, routine/habit numerators) become first-class indexed fields or remain internal, and make the contract explicit.
5. Make the budget target user-configurable before treating budget adherence as a prominent personalized finance signal.
6. Add persistence/deep-link architecture for report runs, findings, experiments, and evidence exports if those are product requirements.
7. Approve and validate a real forecast model before showing numeric forecast ranges; the current Elite forecast remains descriptive and uncertainty-aware.
8. Perform authorized destructive/payment/OAuth/export/native-device acceptance tests in dedicated test accounts or environments.

## Final assessment

The working-tree implementation is materially more production-credible than the former curated prototype: one versioned server score, robust personal calibration, recency and stability-aware aggregation, explicit uncertainty and coverage, source provenance, complete current metric inventory, four tier-specific report jobs, evidence-aware controls, responsive visual QA, and native/web published-score parity. It is not honest to call the live deployment complete because the enriched implementation is not deployed and the recorded live blockers remain open. The working tree is ready for review and release gating, not for an unreviewed production claim.

## References

[1] [CDC, FastStats: Sleep in Adults](https://www.cdc.gov/sleep/data-research/facts-stats/adults-sleep-facts-and-stats.html)
[2] [WHO, Physical activity fact sheet](https://www.who.int/news-room/fact-sheets/detail/physical-activity)
[3] [OECD, Guidelines on Measuring Subjective Well-being](https://www.oecd.org/en/publications/oecd-guidelines-on-measuring-subjective-well-being_9789264191655-en.html)
