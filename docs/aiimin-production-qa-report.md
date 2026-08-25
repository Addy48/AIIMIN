# AIIMIN Production QA Report

**QA date:** 2026-08-22
**Scope:** Reports and Life Score first, followed by authenticated website, public/legal surfaces, mobile web, native parity, builds, and static integrity.
**Working tree:** Attached desktop project on `main`; changes remain uncommitted and undeployed.

> **Evidence policy:** “Pass” means the surface was opened or exercised and the expected result was observed. “Mixed” means the route loaded but a concrete defect, stale deployment, or scope limitation was observed. “Not performed” means the action was intentionally not triggered because it would mutate data, invoke an external account, charge money, delete data, or require a native device.

## Executive summary

The working-tree Reports and Life Score implementation is ready for review and release gating. The canonical score engine is `lhs-v3.0.0-calibrated`, with null-preserving normalization, conservative reference anchors, personal median/MAD calibration after seven observation days, recency weighting, coverage/stability adjustment, confidence, uncertainty, trend, effective sample size, and source provenance. The same published server score contract is consumed by authenticated web and native Android V3 user-facing score surfaces.

All four seeded report tiers were rendered at validated desktop and exact-mobile widths. Explore, Core, Pro, and Elite each have distinct report jobs and explicit evidence/missing-data behavior. Pro finding expansion, filtering, honest empty results, metric search, and experiment drafting passed on the deterministic local fixture. Elite chapter navigation, Forecast assumptions, and Action experiment drafting passed on the same fixture.

The live authenticated website was tested read-only across the primary navigation, hidden More menu, phone-web capture tabs, account sections, onboarding/verification utilities, and public/legal surfaces. The live deployment is not the working tree: live LHS/report responses and Reports UI remain legacy. The main concrete live blockers are persistent Finance loading, `/identity` resolving to the public landing page, `/proto/draft` remaining blank/loading, and a legal-pack effective/last-updated date of October 31, 2026 that is future-dated relative to this QA session.

## Test layers and receipts

| Layer | Result | Evidence |
| --- | --- | --- |
| Backend service tests | **Pass: 15/15** | `npm test` on the current working tree |
| Modified server JavaScript syntax | **Pass** | `node --check` for intelligence route, analytics, billing, correlation, intelligence report, Life Score, reference registry, and report generator |
| Frontend production build | **Pass** | `cd frontend && npm run build`; CRA reported “Compiled successfully” |
| Native data/score/network/today compilation | **Pass** | Selected `compileDebugKotlin` tasks completed successfully |
| Native published-score/data unit tests | **Pass after contract alignment** | Supported `:core:data:testDebugUnitTest` completed after stale reflection-only tests were aligned |
| Metric inventory JSON | **Pass** | `python3 -m json.tool docs/aiimin-metric-inventory.json` |
| Diff whitespace check | **Pass for implementation changes** | `git diff --check` excluding the documented pre-existing Wordmark whitespace warning |
| Local Reports visuals | **Pass** | Four tiers × 1440px and 390px exact CSS viewport screenshots |
| Local Reports interactions | **Pass** | Pro and Elite deterministic interaction probes |
| Live authenticated website | **Mixed; blockers recorded** | Read-only route matrix below and [`qa-website-live.md`](../qa-website-live.md) |

## Reports and Life Score QA

### Canonical model checks

| Check | Result | Observation |
| --- | --- | --- |
| Single authenticated score authority | **Pass in working tree** | Web and native user-facing surfaces consume the server-published LHS contract; browser/native provisional headline paths were removed or made capture-only |
| Canonical taxonomy | **Pass** | `physical/cognitive/discipline/financial/emotional` is presented as BODY/MIND/DISCIPLINE/MONEY/MOOD |
| Missing versus zero semantics | **Pass** | Missing values remain unavailable; observed zero/false are separate observed states |
| Personalization | **Pass by unit coverage** | Robust personal profile activates after seven unique observation days; same raw values can score differently for different personal baselines |
| Recency and stability | **Pass by unit coverage** | 21-day half-life and coverage/volatility-aware domain weighting are exposed in the model metadata |
| Uncertainty and confidence | **Pass** | LHS/report metadata includes confidence, uncertainty band, effective sample size, coverage, and trend |
| Provenance | **Pass by contract coverage** | Metric IDs, source paths/record IDs, calculation/reference versions, method, limitations, and window/cutoff are carried through the contract |
| Reference use | **Pass** | CDC sleep, WHO activity context, and OECD subjective-well-being references constrain defaults [1] [2] [3]; no population ranking or unsupported universal step claim is made |

### Tier matrix

| Tier | Desktop 1440px | Mobile 390px | Interaction/evidence result |
| --- | --- | --- | --- |
| Explore | **Pass** — Daily Signal hero, score ring, uncertainty, coverage, observed pulse, descriptive observation | **Pass** — wrapped demo banner/hero, bounded score ring, no horizontal overflow | Selected-day signal, missing-day pulse, raw metric rows, and non-causal descriptive language rendered |
| Core | **Pass** — Weekly Loop hierarchy, current/prior comparison, five-domain change grid | **Pass** — hero and comparison sections wrap; no overflow observed | Weekly comparison, strongest/lowest observed days, reversible commitments, and observed-only wording rendered |
| Pro | **Pass** — Performance Dossier, window controls, system balance, evidence hierarchy | **Pass** — six window controls wrap in two rows; lower sections continue below viewport | Finding expansion exposed claim/effect/Spearman method/source IDs/limitations; Cognitive filter returned explicit honest empty state; `sleep` search returned the single metric row; experiment form remained fixture-only |
| Elite | **Pass** — dark Intelligence Room, chapter rail, five-domain map, method disclosure | **Pass** — full-width room, touch-friendly chapter rail, intentional partial-next-chapter affordance | Situation/Systems/Patterns/Investigate/Forecast/Action chapters rendered; Forecast assumptions and Action draft flow passed; saved draft remained synthetic/local fixture state |

### Visual evidence

The final screenshot set is retained in the project root:

| Evidence | File |
| --- | --- |
| Explore desktop/mobile | [`reports-demo-explore-desktop-latest.png`](../reports-demo-explore-desktop-latest.png), [`reports-demo-explore-mobile-latest.png`](../reports-demo-explore-mobile-latest.png) |
| Core desktop/mobile | [`reports-demo-core-desktop-latest.png`](../reports-demo-core-desktop-latest.png), [`reports-demo-core-mobile-latest.png`](../reports-demo-core-mobile-latest.png) |
| Pro desktop/mobile | [`reports-demo-pro-desktop-latest.png`](../reports-demo-pro-desktop-latest.png), [`reports-demo-pro-mobile-latest.png`](../reports-demo-pro-mobile-latest.png) |
| Elite desktop/mobile | [`reports-demo-elite-desktop-latest.png`](../reports-demo-elite-desktop-latest.png), [`reports-demo-elite-mobile-latest.png`](../reports-demo-elite-mobile-latest.png) |
| Visual findings | [`qa-reports-visual-findings.md`](../qa-reports-visual-findings.md) |
| Interaction evidence | [`qa-reports-interactions.md`](../qa-reports-interactions.md) |

The local fixture is visibly labeled “Demo data only” and is development-gated. It does not represent the authenticated real account and was not written to production.

### Focused follow-up pass — theme, typography, runtime, and tier controls

| Check | Result | Evidence |
| --- | --- | --- |
| Reports theme parity | **Pass** | Runtime `aiimin-dark`/`aiimin-light` probes; Explore/Core/Pro/Elite at exact 390px; desktop Explore/Elite and lower-page captures. Light Elite inherits the light canvas/card/ink palette rather than forcing a black interior. |
| Lower-page evidence trail | **Pass** | Six bottom captures across Explore/Pro/Elite × dark/light show model, window, observed days, and confidence metadata in the footer. |
| OS-ID typography | **Pass** | Compiled CSS probe: `AADI0837` uses Familjen Grotesk/Figtree display sans, 750 weight, and increased tracking; ordinary `Aaditya` remains Georgia 600 with existing tracking. |
| Demo runtime cleanliness | **Pass** | Eight theme/tier combinations at 390px; zero console errors after the no-auth fixture stopped invoking the authenticated profile fetch. |
| Tier interactions | **Pass** | Pro finding expansion/filter/search and Elite numbered rail, Forecast assumptions, and reversible Action draft all passed on the deterministic fixture. |
| Final static validation | **Pass** | Backend 15/15, server syntax checks, frontend production build, JSON validation, deletion audit, and diff whitespace check. |

### Notification and reminder wiring follow-up

| Check | Result | Evidence |
| --- | --- | --- |
| Today urgent Family reminder CTA | **Pass in working tree** | Each red reminder row now has an explicit `Open reminder` action routing to `/family?tab=reminders&reminder=<id>`. Family selects the Reminders tab, scrolls to the requested row, and applies a red focus ring. |
| Website notification actions | **Pass in working tree** | Notification rows expose `Open report`, `Review now`, or `Open details` actions, mark unread items read before navigation, close the menu, and reject protocol-relative external URLs. |
| Urgent notification styling | **Pass in working tree** | Unread urgency types such as commitment misses, drift alerts, integration errors, overdue, due, renewal, and expiry language receive red dropdown-row, CTA, bell, and badge treatment. |
| Keyboard/accessibility behavior | **Pass in working tree** | Actionable notification rows support Enter and Space; CTA, mark-read, dismiss, mark-all-read, and preference switches have labels/focus states. |
| Notification preferences | **Pass in working tree** | Account Notifications explains the bell behavior and now shows save-failure feedback while preserving the existing server-backed preference patch. |
| Notification QA receipt | **Pass** | `qa-notification-wiring.mjs`: all source-contract checks passed; local Elite fixture rendered with zero console errors. |
| Browser push/OS permissions | **Not performed** | No browser permission prompt, push subscription, email, or native FCM flow was triggered; those require an authorized dedicated acceptance environment. |

### Approved account backfill and rollback follow-up

The account audit first found existing history for AADI0837 from 2026-01-19 through 2026-08-21. A dry-run identified 33 missing dates inside a requested 120-day window. After explicit confirmation, an append-only utility inserted 221 marked rows across daily logs, focus sessions, journals, money transactions, calendar events, wins, commitments, tasks, and notes. The user then rejected the generated history and explicitly confirmed rollback.

The rollback used the recorded 33 gap dates and passed a strict preflight requiring the exact expected per-table counts before deleting anything. It removed 33 daily logs, 62 sessions, 16 journal entries, 19 money transactions, 14 calendar events, 29 wins, 33 commitments, 8 tasks, and 7 notes. Read-back restored the pre-backfill counts of 182 daily logs, 273 sessions, 168 journal entries, 207 money transactions, 156 calendar events, and 14 notes; the account date range remained 2026-01-19 through 2026-08-21. No unrelated rows, account identity, authentication state, code, or UI work was touched.

| Backfill/rollback check | Result | Evidence |
| --- | --- | --- |
| Append-only write | **Pass, then rolled back** | 221 rows inserted only after explicit confirmation; write receipt recorded the 33 gap dates |
| Rollback safety gate | **Pass** | Preflight found exactly 221 expected rows before deletion; broad rollback was refused by design |
| Post-rollback account read-back | **Pass** | Counts and date coverage restored to the pre-backfill audit |
| User-requested outcome | **Pass** | The rejected 120-day backfill is no longer present; unrelated implementation work remains in the working tree |

### Local Overview regression follow-up

The localhost Application Error was confirmed as a **local unpushed regression**, not a live deployment problem. The newly added Today reminder redirect used `useCallback` in `Overview.jsx` without importing it, producing a render-time `useCallback is not defined` failure inside the authenticated Overview route. The missing import was restored, and the two unused Overview icon imports exposed by targeted lint were removed.

| Check | Result | Evidence |
| --- | --- | --- |
| Root-cause patch | **Pass** | `Overview.jsx` now imports `useCallback`; the change is isolated to the local working tree. |
| Targeted lint | **Pass** | Overview, Family, Navbar, NotificationBell, and NotificationsSection completed with zero errors/warnings. |
| Frontend tests | **Pass: 31/31** | `CI=true npm test -- --watchAll=false`; two suites passed. Existing Family test output contains asynchronous `act(...)` warnings only, not test failures. |
| Production build | **Pass** | `npm run build` completed with “Compiled successfully.” |
| Unauthenticated local route safety | **Pass** | `/overview` redirected to `/login` with zero runtime errors in the available local browser session. Authenticated visual re-entry was not performed because the attached session was unauthenticated. |
| Prior work regression check | **Pass** | Reports 8/8 theme-tier runtime combinations, Pro/Elite interactions, notification wiring, and OS-ID typography probes remained passing after the import fix. |

## Live authenticated route matrix

### Core product routes

| Route | Status | Read-only result |
| --- | --- | --- |
| `/overview` | **Pass with stale-deployment limitation** | Full dashboard, operational intelligence, weekend review, capture box, timeline, priorities, streak/money cards, and trajectory rendered. Embedded report card showed the deployed legacy score/presentation rather than v3 metadata. |
| `/reports` | **Mixed** | Initial lazy load resolved to the deployed legacy Report/Patterns/Skills UI with legacy KPIs, 7–YTD controls, sparse-data state, and old PDF flow. The working-tree canonical workspace is not deployed. |
| `/reports?tab=patterns` | **Pass with stale-deployment limitation** | Legacy Patterns tab loaded with five domains and safe empty correlation/insight states. |
| `/habits` | **Pass** | Seeded habits, progress, filters, completion controls, weekly matrix, and yearly heatmap rendered. No completion/delete action was activated. |
| `/goals` | **Pass** | Seeded commitments, status filters, Pipeline/Grid/Archive views, milestones, deadlines, and controls rendered. No status/delete action was activated. |
| `/journal` | **Pass** | Templates, search/filter, history, export buttons, mood controls, text/voice capture, and structured templates rendered. No entry/export was submitted. |
| `/notes` | **Pass** | Loading resolved to the correct zero-source state with search, Drive/New, capture-first-note, and Text/Voice/PDF options. No source was created. |
| `/finance` | **Fail/blocker** | Authenticated shell remained on a loading spinner after waiting; no Finance content rendered. No financial mutation was attempted. |
| `/focus` | **Pass** | Focus Room modes, duration presets, timer, intent input, and Enter Flow State controls rendered. No session was started. |
| `/calendar` | **Pass** | Month/Week/Day/Agenda views, Google controls, system filters, events, and upcoming items rendered. No sync or event creation was activated. |
| `/discipline` | **Pass** | History/Urge Surfing, streak metrics, pledge/slip controls, timeline, emergency toolkit, and safe empty resolved-urge state rendered. No pledge/slip was submitted. |
| `/family` | **Pass** | Family Vault metrics, seeded members, People/Records tabs, and add/card controls rendered. No member/document mutation was activated. |
| `/lab` | **Pass** | Personal Development navigation, growth stages, practice categories, analytics, and visible `Life Score · LIVE` server-LHS labeling rendered. No practice/experiment was started. |
| `/placements` | **Pass** | Career views, filters/search, seeded applications, and status/delete controls rendered. No application mutation was activated. |
| `/sports` | **Pass** | Live feed, sync/category controls, and sports card rendered. No sync or activity action was activated. |
| `/insights` | **Pass with stale-deployment limitation** | Redirected to `/reports`; inherited the deployed legacy Reports limitation. |

### Account, mobile, and utility routes

| Route/action | Status | Read-only result |
| --- | --- | --- |
| `/account` | **Pass** | Profile, personalization, design, notifications, privacy/security, subscription, data/export, legal, sign-out, Life Arc, plan, and rank sections rendered. No field was saved. |
| `/account?section=subscription` | **Pass** | Current plan, founding rate, benefits, renewal, plans, and downgrade controls rendered. No billing/plan action was opened. |
| `/account?section=privacy` | **Pass** | PIN/email/calendar controls, disconnect, 2FA/passkey state, and AI privacy switches rendered. No setting changed. |
| `/account?section=data` | **Pass** | JSON export, reset-life-data, and permanent deletion controls rendered with warnings. No export/reset/deletion action was activated. |
| `/settings` | **Pass** | Profile, appearance, notifications, integrations, backend status, export/report links, security, and wipe/delete sections rendered. No preference or destructive action was submitted. |
| `/m` | **Pass** | Capture-only phone form rendered for sleep, gym, nutrition, steps, water, learning, reflection, and Save Session & Reflect. No capture was submitted. |
| `/m/score` | **Mixed; stale deployment** | Mobile score loaded with legacy score/streak cards but no v3 version/confidence/coverage/uncertainty metadata. Local parity changes are not deployed. |
| `/m/account` | **Pass** | Identity, plan, Life Arc, rank/XP, desktop handoff, theme, legal links, sign-out, and native companion copy rendered. No action was activated. |
| `/login` while authenticated | **Pass** | Safely redirected to `/overview` without prompting for credentials or signing out. |
| `/verify-email` | **Pass** | Read-only verification state, refresh, back-to-overview, and sign-out rendered. No email/refresh/sign-out action was activated. |
| `/onboarding` | **Pass with unsubmitted state** | Step 1 of 10 rendered with existing display name prefilled. Continue was not pressed. |
| `/seed-data` | **Pass as safe redirect** | Redirected to `/overview`; no seed UI or write was exposed and no live seed was applied. |
| `/proto/draft` | **Fail/blocker** | Only the root/loading spinner was visible after navigation; no prototype content rendered. |
| Overview More menu | **Pass** | Finance, Family, Calendar, Sports, Discipline, Focus, Lab, Reports, and Customize navigation were exposed. No customization was submitted. |
| `/identity` | **Fail/mismatch** | Resolved to the public AIIMIN landing surface rather than an authenticated identity/profile workspace. |

### Public and legal routes

| Route group | Status | Result |
| --- | --- | --- |
| `/brand`, `/app`, `/about`, `/contact` | **Pass with date blocker** | Substantive public brand, native-app status, operator/product, contact, grievance, and response-target content rendered with navigation. |
| `/legal` | **Pass with date blocker** | Legal hub indexed 12 documents and rights/export/deletion paths. |
| `/privacy`, `/terms`, `/security`, `/data-deletion` | **Pass with date blocker** | Substantive policy, security, deletion, and export content rendered. |
| `/cookies`, `/acceptable-use`, `/refunds`, `/grievance`, `/subprocessors`, `/ai-disclosure` | **Pass with date blocker** | Consent, abuse, billing, rights, provider, and AI disclosure pages rendered substantively. |
| Legal metadata | **Blocker** | The legal pages consistently state last updated/effective October 31, 2026, future-dated relative to this August 22, 2026 QA session. Correct or intentionally schedule before release. |

## Not performed by design

The following acceptance tests remain unperformed and must use dedicated test accounts, sandbox billing, OAuth test identities, or a native device: creating/editing/deleting habits, goals, journal entries, notes, finance records, calendar events, family records, placements, sports logs, and discipline records; JSON/PDF export downloads; life-data wipe and account deletion; plan upgrade/downgrade/payment/cancellation; Google OAuth/connect/disconnect/sync; file upload/download; notification/permission flows; voice/camera/scanner flows; native Android runtime/screenshots; and any future production seed write. The one explicitly approved append-only QA backfill in this pass was applied and rolled back, and is documented separately. These remaining actions are not failures of the read-only QA pass, but they are not proven passes.

## Release blockers and recommendations

1. **Deployment parity:** working-tree v3 is not deployed. After normal review/release approval, re-query `/intelligence/lhs` and `/intelligence/report` and require `lhs-v3.0.0-calibrated` and `report-contract-v1` before closing parity.
2. **Finance:** diagnose the persistent live loading state with network/console traces and an authenticated backend response check.
3. **Identity:** decide whether `/identity` should be removed, redirected intentionally, or mapped to the account identity workspace.
4. **Prototype route:** either gate/remove the blank `/proto/draft` path from production navigation or make its loading/error state explicit.
5. **Legal dates:** align the entire legal pack’s effective/last-updated dates with the actual release schedule.
6. **Export/deep-link persistence:** add persisted report-run/finding/experiment IDs and evidence links if durable sharing/export is part of the product promise.
7. **Remaining model decisions:** decide the destination of orphaned normalized metrics and make the finance budget target user-configurable before elevating it as a strong personal signal.

## Evidence index

| Artifact | Purpose |
| --- | --- |
| [`aiimin-reports-life-score-overhaul.md`](./aiimin-reports-life-score-overhaul.md) | Technical model/report implementation and release-gate record |
| [`aiimin-metric-inventory.md`](./aiimin-metric-inventory.md) | Current metric registry, source paths, orphaned and phantom metrics |
| [`qa-website-live.md`](../qa-website-live.md) | Detailed live route observations |
| [`qa-reports-interactions.md`](../qa-reports-interactions.md) | Objective seeded Pro/Elite interaction outcomes |
| [`qa-reports-visual-findings.md`](../qa-reports-visual-findings.md) | Iterative desktop/mobile visual findings and fixes |
| [`qa-capture-reports.mjs`](../qa-capture-reports.mjs) | Deterministic four-tier screenshot harness |
| [`qa-pro-interactions.mjs`](../qa-pro-interactions.mjs) | Focused Pro expansion/filter/search probe |

## Final disposition

**Working tree:** ready for code review and release gating.
**Live production:** not complete; legacy deployment and concrete blockers remain.
**Data safety:** no files were deleted, no broad or unapproved live-account mutation was made, the explicitly approved append-only QA backfill was fully rolled back, no schema migration was performed, and no commit/push/deploy was performed.

## References

[1] [CDC, FastStats: Sleep in Adults](https://www.cdc.gov/sleep/data-research/facts-stats/adults-sleep-facts-and-stats.html)
[2] [WHO, Physical activity fact sheet](https://www.who.int/news-room/fact-sheets/detail/physical-activity)
[3] [OECD, Guidelines on Measuring Subjective Well-being](https://www.oecd.org/en/publications/oecd-guidelines-on-measuring-subjective-well-being_9789264191655-en.html)
