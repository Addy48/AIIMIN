---
authority: product
derived_from: Roadmap/AIIMIN-V1-Blueprint
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-08-20
can_override_genesis: false
knowledge_layer: KL-PROD
graph_role: leaf
note_type: NT-APPENDIX
tags:
  - type/appendix
  - domain/product
  - status/living
---

# Blueprint appendix — Website, states, analytics, a11y, testing (§15–19)

> Parent spine: [[Roadmap/AIIMIN-V1-Blueprint]] · Full dump: [[Roadmap/Blueprint-Appendices/00_FULL_ARCHIVE]]

## 15. Website and app as one system

### 15.1 Job split

| Job | Website (public) | Web Life OS | `/m` | Native |
|-----|------------------|-------------|------|--------|
| Acquire, explain, price | ✅ | — | — | — |
| Waitlist / OS-ID reservation | ✅ | — | — | — |
| Legal, brand, storage ledger | ✅ | link | link | link |
| Sign in | ✅ | ✅ | ✅ | ✅ |
| Full command + analytics | — | ✅ | ✗ | partial (reads) |
| Deep editing (goals, reports, budgets) | — | ✅ | ✗ | limited |
| Fast capture | — | ✅ | ✅ | ✅ |
| Health, screen time | — | read | ✗ | **source** |
| UPI money reading | — | read | ✗ | **source** |
| Voice / English drills | — | ✅ (browser mic) | ✗ | ✅ (best) |
| Documents: view | — | ✅ | ✗ | ✅ |
| Documents: scan | — | upload | ✗ | **camera** |
| Billing / tier change | — | ✅ | ✗ | Store or link to web |
| Export / delete account | — | ✅ (master) | ✗ | initiate → confirms via web |
| Consent toggles | — | ✅ (master) | ✗ | mirrors + OS-level |
| Widgets, biometric unlock | — | — | — | ✅ |

### 15.2 Identity and session continuity

One `user_id`; OS-ID is a public handle, not a second account. Sign-in on any surface creates a session bound to that surface; the Devices list shows all of them with revoke. Web↔native handoff uses the same Better Auth session (native CookieJar — EXISTS). Deep links from marketing emails land on the web app; if the native app is installed, Android App Links open it (verified `assetlinks.json`).

### 15.3 Onboarding across surfaces

Waitlist email → approval → first login (web or native) → onboarding runs **once**, server-persisted. If a user starts on the phone and continues on desktop, the desktop resumes at the same step. Native-only asks (health, screen time, biometric, widgets) appear on first native launch even if web onboarding is complete, framed as "3 things only your phone can do".

### 15.4 Settings consistency

Account → Privacy/Personalization/Notifications is the **master**. Native shows the same sections; anything it cannot change (billing, export download, account deletion final confirm) opens the web surface in a system browser with the session handed over via a one-time token. Nothing is silently different between surfaces; where a control is unavailable, the reason is stated.

### 15.5 Subscriptions across surfaces

Backend is the entitlement authority. Web uses Stripe (or click-upgrade in the current mode); native uses Play Billing where store policy requires it; both write to the same subscription record, and the client renders the plan chip from the server value only. Restoring purchases re-reconciles server-side. Tier is never cached beyond the bootstrap cycle.

### 15.6 Notifications across surfaces

Native = push (FCM) + local; web = in-app + email for critical; `/m` = in-app only. The **type registry and quiet hours are shared**, so muting "streak at risk" mutes it everywhere. Security and billing notifications go to email regardless of surface.

### 15.7 Brand continuity

Split brand lockup is identical everywhere (mark → `/brand`, wordmark → Today). Waitlist and product share the same **tokens** but not the same layout components (T8 isolation) so marketing polish never leaks template chrome into the OS, and product density never makes the marketing site feel like a dashboard.

---


## 16. States, errors, and edge cases

### 16.1 Required state coverage

Every surface must implement the applicable subset: `ST-LOAD, ST-PART, ST-BG, ST-AI, ST-EMPTY, ST-OK, ST-FAIL, ST-EXP, ST-FRESH, ST-OFF, ST-CONN, ST-SYNC, ST-AUTH, ST-SESS, ST-PERM, ST-UNDO, ST-RETRY, ST-RECOV, ST-CONF`. A missing applicable state is a **defect**, not a polish item (SA-*). A per-surface state matrix is the acceptance artifact for QA (§19.3).

### 16.2 Error message contract

Four parts, always: **what happened · what it means for your data · what to do now · a way out**.

| Bad | Good |
|-----|------|
| "Something went wrong" | "Couldn't reach the server. Your entry is saved on this device and will sync — 1 item held. Retry now?" |
| "Error 500" | "Our side failed while saving your budget. Nothing was changed. Try again, or copy the details for support." |
| "Sync failed" | "Google refused the last 3 syncs (permission changed). Reconnect Google Calendar to continue; your AIIMIN events are untouched." |

### 16.3 "What happens if…" register

**Connectivity / device**
- Offline at first launch → login impossible; explain honestly, offer retry; nothing pretends to work.
- Offline mid-onboarding → steps that write locally continue; connection steps are deferred with a "finish later" card.
- Airplane mode for a week → queue persists; on reconnect chunked batches with progress; conflicts surfaced.
- Device storage full → local queue write fails → banner "can't save locally, free space"; never lose the in-memory entry without warning.
- Low battery / doze mode → WorkManager honors constraints; sync resumes; no false "synced" claim.
- App killed during a Veil action → nothing was committed (Veil commits are atomic server-side).
- Clock set wrong → server time wins; a one-time notice if skew > 10 min.
- OS upgrade removes a permission → the feature degrades with a re-consent card, data retained per settings.

**Auth / account**
- Session expires mid-edit → local draft preserved, re-auth inline, then the write completes.
- PIN forgotten → email-based reset; explicitly states that it does not decrypt E2E content (when E2E ships).
- Email changed at the provider → re-verify.
- Two devices, PIN changed on one → other sessions invalidated, security notification sent.
- Waitlist not approved → Pending screen, not an error.
- Account deleted then the user returns → new account, prior data gone (stated in the delete Veil).
- Google account revoked externally → Reconnect state per integration; login unaffected if login used a different provider.

**Data / integrity**
- Duplicate entity from two sources → dedupe proposal, never silent deletion.
- Conflicting edits → resolver; text never destroyed.
- Import with 40% unparsable rows → those rows shown as rejected with reasons; the rest importable.
- Currency mismatch in totals → per-currency subtotals, no invented conversion.
- Deleting a person with open money → Veil offering settle / reassign / keep as name.
- Deleting a habit with a 200-day streak → Veil showing exactly what will be lost; archive offered first.
- Timezone move → forward-only day bucketing with a notice.
- Leap day / DST → covered by test fixtures.
- Very large account (10k transactions, 500 documents) → pagination, virtualized lists, async export.

**AI / quota**
- Provider down → next provider once, then honest degrade + queued retry.
- Quota exhausted → the current action finishes; the next is blocked with the reset time and an upgrade path stated without pressure.
- AI returns nonsense/off-schema → schema validation rejects it; user sees "couldn't structure that — saved as text" (the raw entry is already safe).
- AI proposes a duplicate → dedupe check before the Offer.
- User disabled AI → all paths still function (§11.9).

**Payments**
- Card fails → 7-day grace, banner, no data lockout, no feature "trap".
- Store purchase not reflected → "Restore purchases" + server reconcile, with a support path.
- Refund → tier reverts, data intact, gated features become read-only with export.

**Platform-specific**
- Health Connect not installed → install CTA, manual fallback.
- SMS permission granted but no bank templates match → silent no-op (never blame the user).
- Screen-time API unavailable (iOS) → chip hidden, no broken promise in the UI.
- Mic in use by a call → session cannot start; clear reason.
- Predictive back mid-sheet → sheet dismisses, draft kept as Drift.
- Foldable / split-screen → layout uses container queries; the Today spine reflows to one column.
- Android 15+ edge-to-edge insets → safe-area padding on bottom nav and sheets.

**Abuse / safety**
- User writes self-harm content in the journal → no diagnosis, no alarm UI; a single, quiet, dismissible resource card (region-appropriate), never repeated, never a notification, never sent to analytics.
- Repeated failed PIN → backoff, then email alert.
- Automated scraping of the API → WAF + rate limits + anomaly alarm.

---


## 17. Analytics, telemetry, and observability

### 17.1 Product analytics rules

Consent-gated (off until granted), **event-count only**, no content, no journal, no document, no PIN, no amounts, no contact identifiers. Events use a fixed schema registry (name, surface, tier, anonymized user hash). GA4 and Sentry initialize **only after** consent (this closes the launch blocker honestly).

**Core event set (V1):** `app_open`, `onboarding_step_completed`, `first_settle`, `capture_settled{domain}`, `minimum_met{count}`, `depth_state{state}`, `loop_resolved{type}`, `habit_ticked`, `english_session_completed{mode}`, `aei_updated`, `money_tx_created{source}`, `upi_draft_reviewed{action}`, `lend_created`, `doc_uploaded`, `calendar_synced{direction,count}`, `conflict_resolved{choice}`, `report_generated{type}`, `permission_prompted{scope}`, `permission_result{scope,granted}`, `consent_changed{scope,granted}`, `tier_changed`, `ai_call{task,provider,outcome}`, `error_shown{code,surface}`, `sync_batch{items,failures}`.

### 17.2 North-star and guardrail metrics

| Metric | Definition | Why |
|--------|------------|-----|
| **Honest Days** (north star) | days where the daily minimum was met with real records | Measures value delivered, not sessions |
| Time-to-first-Settle | signup → first real capture | Onboarding quality |
| Week-1 retention | returned on ≥3 of days 2–7 | Activation |
| Loop clearance rate | resolved / created | Whether the system's asks are worth answering |
| Capture latency | tap→Settle p95 | Sacred path health |
| AEI progression | median AEI delta over 30 days for users with ≥8 sessions | English system efficacy |
| Sync integrity | conflicts / mutations | Trust |
| Guardrail: notification opt-out rate | — | Detects nagging |
| Guardrail: consent revocation rate | — | Detects over-asking |
| Guardrail: AI correction rate | Offers adjusted or dismissed / total | Detects bad inference |

### 17.3 Observability

Structured JSON logs (request id, user hash, route, latency, outcome — never content) · traces on the AI and sync paths · RED metrics per route · dashboards: API health, sync health, AI spend and outcome mix, queue age, DB slow queries · alarms per §14.3 with SNS to email/Slack · Sentry for client errors with PII scrubbing and a deny-list for journal/document fields · release health per app version (native crash-free rate target ≥ 99.5%).

---


## 18. Accessibility

Accessibility is structural (C-UX-18), not a pass at the end.

| Requirement | Implementation |
|-------------|----------------|
| Contrast | Text ≥ 4.5:1, large text ≥ 3:1 — verified for **all three** themes including the soft dark ramp |
| Color independence | Every status has icon or text (MD-03) |
| Focus | Visible 2px `color.action` ring, 2px offset, never removed; logical tab order; focus trapped in sheets/dialogs and restored on close |
| Touch targets | ≥44px web, ≥48dp native |
| Font scale | ×0.9–×1.3 in-app plus OS scaling; layouts must not clip or truncate meaning at ×1.3 |
| Screen readers | Semantic landmarks, labelled controls, `aria-live` for async states, chart text alternatives, meaningful reading order for the Today spine; Compose semantics with `contentDescription` and merged nodes for rows |
| Reduced motion | §5.4 with behavioral fallbacks |
| Gesture alternatives | Every swipe/drag has a button/menu/keyboard path (IP-16) |
| Captions/transcripts | English drills always show the transcript; reference audio has text |
| Timeouts | Focus/urge timers are user-controlled; no forced time limits on input |
| Errors | Announced, associated to fields, never color-only |
| Language | `lang` attributes; plain-language microcopy; no idioms in critical paths |

Target: **WCAG 2.2 AA** for the web app, Android accessibility scanner clean for native.

---


## 19. Testing and quality plan

### 19.1 Layers

| Layer | Scope | Tooling intent |
|-------|-------|----------------|
| Unit | Score engine, AEI computation, depth state machine, parsers (SMS templates, CSV, RRULE), dedupe, stride estimate, quota math | Jest / Vitest; Kotlin unit tests |
| Contract | Every API endpoint: auth required, tier gate, RLS isolation (user A cannot read B), idempotency replay, validation errors | API test suite in CI |
| Integration | Sync batch + pull round trip; Google two-way sync against a sandbox; import→commit→undo; upload→view-url; consent gates blocking writes | Staging |
| E2E | Onboarding (all 12 steps, plus skip-everything path), first Settle, offline capture→reconnect, conflict resolution, tier upgrade, delete account, English session end-to-end | Playwright (web), Espresso/Compose UI (native) |
| Accessibility | Axe on every route, contrast matrix for 3 themes, screen-reader script for Today/Capture/Money, ×1.3 font-scale screenshots | CI + manual |
| Performance | `/today` p95, bootstrap p95, list scroll jank, cold start (native < 2s to Today skeleton), bundle budget | Lighthouse CI, Macrobenchmark |
| Security | IDOR sweep, injection fuzz, upload abuse, signed-URL expiry, rate-limit behavior, secret scanning | CI + pre-launch pen pass |
| Data | Migration dry-run + rollback, backup restore drill, export completeness (every table represented), delete completeness (no orphans) | Staging with synthetic |
| Device matrix | Android 10–15, 3 OEMs incl. OnePlus (Health Connect path), small phone, tablet, foldable; iPad Safari; Chrome/Safari/Firefox desktop | Manual + cloud device farm |

### 19.2 Golden test cases (must never regress)

1. Capture works with AI off, offline, and on a fresh account.
2. Depth never shows a shaming state before 11:00 or on day 1.
3. `/m` shows no score, no analytics, no tools (CS-13 assertion test).
4. Deleting an account purges every table containing `user_id` (schema-driven test that fails when a new table is added without a delete path).
5. Export contains every user table and re-imports into a fresh dev DB.
6. A revoked consent immediately blocks that scope's writes server-side.
7. Two devices ticking the same habit produce one row.
8. Calendar conflict never silently overwrites.
9. Journal content never appears in any log, prompt for analytics, notification, or export sent to a third party.
10. AEI stays `unrated` below 3 sessions and never regresses from a single bad session by more than 3 points.

### 19.3 Definition of done (per feature)

Code + tests + state matrix complete + a11y pass + privacy tier recorded + consent wired (if sensitive) + offline behavior defined + analytics events added + **vault note and changelog updated in the same unit of work** + Genesis cross-check (no invented hub/verb/state).

---

