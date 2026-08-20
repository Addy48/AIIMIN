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

# Blueprint appendix — Implementation roadmap, validation, decisions, traceability (§20–23)

> Parent spine: [[Roadmap/AIIMIN-V1-Blueprint]] · Full dump: [[Roadmap/Blueprint-Appendices/00_FULL_ARCHIVE]]

## 20. Implementation roadmap

Sequenced so each wave leaves the product shippable. No wave is "the MVP" — V1 is the sum.

| Wave | Theme | Contents | Exit criteria |
|------|-------|----------|---------------|
| **W0** | Fire + foundations | EC2 disk, SSH lockdown, CloudWatch alarms, consent-gated GA4/Sentry, LC-01…14 verification | Alarms firing correctly; no open SSH; launch checklist green |
| **W1** | Visual + a11y base | Soft Monotone ramp `[ADR-B3]`, dim mode, font scale, text-opacity caps, monotone chip rules, metric family MERGE, T9 removal, focus rings | Contrast matrix passes for 3 themes; one metric component in use |
| **W2** | Today + Depth + Loops | `/today` endpoint, depth state machine, daily minimum config, Open Loops queue, widget arrangement | Depth reacts After-Settle; loops resolve; reduced-motion parity |
| **W3** | Graph + People | `graph_edges`, `people` + migration, person detail, `/graph/context`, contact import (device + Google), merge | Person card shows real cross-domain links |
| **W4** | Money depth | Lending ledger + rollups, subscriptions, bills, import batches with undo, statement parse + confirm queue | Lend↔person↔transaction linked; import undo works |
| **W5** | Native capture power | Health Connect, screen time, UPI on-device parse + review queue, camera scan, widgets, haptics, swipe grammar | Review queue commits idempotently; aggregates only on server |
| **W6** | Calendar two-way | Write scope, AIIMIN calendar, syncToken/watch, conflict resolver, focus write-back | Conflict UI verified against sandbox; no silent overwrite |
| **W7** | English / AEI | Sessions, deterministic metrics, `vocal_scorecard` wiring, placement test, skill tree, prescription, word bank, accent packs, history | AEI honest gating; offline session scores locally |
| **W8** | Vault + Documents OS | Document model, viewer (PDF/DOCX/XLSX), expiry ladder, vault lock, emergency card, OCR→tx | Viewer handles the three formats + graceful unsupported |
| **W9** | Privacy surfaces | Consent registry UI, privacy dashboard, activity log, scoped delete, async export, store/policy parity | Dashboard numbers are real; revoke blocks writes |
| **W10** | Intelligence | Graph-cited insights, correlations, reports (snapshot/PDF/interactive), provenance drawer | Every insight cites sources |
| **W11** | Notifications + retention | Type registry, quiet hours, digest, streak freeze, weekly/monthly rhythm, re-engagement rules | Opt-out rate guardrail instrumented |
| **W12** | Backend migration | Containerize → Fargate → SQS/worker → EventBridge → CloudFront/WAF → S3 vault → read replica | Alarms + rollback verified at each step |
| **W13** | Hardening + launch | Pen pass, IDOR sweep, device matrix, restore drill, Play data-safety, legal review, load smoke | All golden tests green |

**Parallelizable:** W1 with W0; W7 with W4/W5 (different owners); W12 continuously after W0.

---


## 21. Validation passes

### Pass 1 — Missing features (resolved)

Added during review: `depth.dawn` state (avoided a shaming early-morning state) · streak freeze · import batch undo · subscriptions/bills detection · emergency card export · document annotation · read-aloud English mode · meeting-English lane · person "care" interaction log · devices list with revoke · scoped per-domain deletion · async export for large accounts · `/today` aggregate endpoint · AI-off mode · notification content masking · font-scale control · dim theme · single-active-focus-session rule.

**Consciously deferred (POST-V1, stated in UI where relevant):** multi-user household accounts, Office **editing**, iOS app, Hindi/other languages, E2E for journal/vault, recurring-rule editing, call-log-based relationship ledger, semantic search/pgvector, public sharing of anything.

### Pass 2 — Missing journeys (resolved)

Added: pending-access (waitlist-approved-not-yet) as a non-error state · native-first install for an existing web user · web-after-native (no repeated asks) · guest tour → signup with no orphan data · permission refused then re-offered in context · consent revoked → scoped delete offer · account deleted → return as new user · payment failed grace · store-purchase reconcile · tier downgrade read-only path · offline for a week → chunked catch-up · device lost → revoke sessions · timezone move · onboarding resumed across devices · English session interrupted by a call · UPI draft for an unknown counterparty → create person inline · document expiring while offline.

### Pass 3 — Missing components (resolved)

Added: `SyncPill`, `ConflictResolver`, `LoopRow`, `LendRow`, `PersonRow`, `DocumentRow`, `DrillRow`, `DocumentViewer`, `SessionRunner`, `VeilGate` typed variant, `EmptyCoach` teaching variant, provenance drawer, permission-rationale sheet, Drift restore card, sync tray, consent list rows, activity-log rows, `Metric` unified family, chart text-alternative wrapper, widget components.

### Pass 4 — Backend / privacy / sync gaps (resolved)

Added: consent registry as the cross-surface source of truth · content-free audit log · idempotency on every mutation · pull cursor endpoint · field-level merge table per entity · signed short-lived single-use URLs · KMS-backed vault bucket · SQS worker for AI/imports/OCR/PDF/notifications · EventBridge replacing box cron · read replica for reports · WAF · SSM-only SSH · secret rotation · schema-driven delete-completeness test · store/policy parity checklist · prompt-minimization table · provider zero-retention requirement · per-currency totals · backup restore drill · error-budget policy.

### Pass 5 — Genesis and prior-work cross-reference

| Genesis / prior law | How this Blueprint complies |
|---------------------|-----------------------------|
| P8 Ch03/04 IA + BR-01…12 | No new top-level hubs; People inside Family (`ADR-B1`), English inside Lab (`ADR-B2`), Documents as a component (`ADR-B5`), Health as signals (`ADR-B4`); `/m/score` stays removed and deep links redirect |
| P8 Ch08 anti-surfaces | No Dashboard; Today owns the day; no Tasks/Projects primary surface |
| P8 Ch11 visual | Palette roles unchanged; only the neutral ramp is proposed, ADR-gated; four locked type families; density modes used |
| P8 Ch12 motion | After-Settle, Honest Hold, One Motion, Interruptibility, reduced-motion parity, proportional celebration; forbidden motions excluded |
| P8 Ch07/Ch17 AI | Five roles only; confidence bands; persist-before-coach; no auth/billing changes by AI; prediction ≠ permission; failure never shown as success; uncertainty fails closed |
| P8 Ch15 privacy | Ownership/stewardship language, export always, real delete, journal excluded from analytics, no inference of high-sensitivity meanings, opt-in revocable non-explicit collection, no lifelog commerce |
| P8 Ch16 notifications | Knock discipline, closed windows during Breath/Veil/Focus, quiet hours, no coercive escalation |
| P8 Ch20 onboarding | Identity formation (Life Arc mandatory), no infinite customization, no mode gate before capture |
| P9 Phase 1 grammar | Catch/Settle/Hold/Offer/Adjust/Commit/Veil/Hand-back/Knock/Drift used exactly; forbidden state pairs avoided |
| P9 Phase 4 ceilings | `S-M` capture-only asserted and tested; `S-NATIVE` ≠ `S-M`; command/ambient bounded |
| C-UX-01…18 | One OS, capture-first, one write primitive, day spine primary, honest device roles, calm command, express-not-invent, full state coverage, calm recovery, AI trust, cross-surface honesty, user-owned nav within locks, merged read surfaces, terminology alignment (Today/`overview`, Career/`placements` documented), identity locks, evidence-bound scope, a11y structural |
| P5 Non-Negotiables + Never-Build | No social feed, no leaderboards, no AI therapist, no auto-posting, no dark-pattern upgrades, no second mood/theme/arc editor, no `window.confirm`, no analytics on `/m`, no journal in push, no PIN in telemetry, no new brand colors, no emoji IA, no Capacitor-as-primary |
| D05 (score location) | Today primary, Reports secondary, native Home analogue, never `/m` |
| D11 (metric merge) | One Metric family |
| BR-04/BR-05 | `/insights` → `/reports`; `/identity` → Goals/Arc; `/settings` → `/account` |
| UX-Intelligence debts D08/D10 | Desktop offline visible; Undo/Hand-back specified as required |
| Monorepo law | Waves specify which client each change belongs to; no mixed commits |
| Proof-or-stop | §19 defines evidence; no wave may claim done without its exit criteria |

**Open items that must be resolved by ADR before the affected wave starts:** `ADR-B1` People placement · `ADR-B2` English promotion · `ADR-B3` soft dark ramp · `ADR-B4` health signals · `ADR-B5` documents viewer · plus §22 items.

---


## 22. Open decisions register (Founder input required)

| ID | Decision | Options | Recommendation | Blocks |
|----|----------|---------|----------------|--------|
| OD-01 | Soft Monotone dark ramp | (a) adopt §4.3 (b) keep `#1a1a1a`/`#2d2d2d` and only cap text opacity | **(a)** — the reported eye strain comes mostly from the canvas/text contrast pair | W1 |
| OD-02 | People placement | (a) tab inside `/family` (b) new `/people` route | **(a)** — respects BR-03 and keeps depth ≤3 | W3 |
| OD-03 | English route | (a) `/lab?module=english` (b) `/english` top-level | **(a)** now; revisit after usage data | W7 |
| OD-04 | Voice audio storage | (a) device-only (b) opt-in encrypted cloud replay for Pro | **(a)** default + (b) opt-in | W7 |
| OD-05 | Accent target framing | (a) neutral/US/UK picker (b) neutral only | **(a)** with non-judgmental copy | W7 |
| OD-06 | Journal E2E timing | (a) V1 (b) V1.1 with recovery kit | **(b)** — E2E without recovery risks real data loss | W9 |
| OD-07 | Screen-time detail | (a) daily total only (b) top-3 categories opt-in | **(b)** as opt-in | W5 |
| OD-08 | `/m` future | (a) keep as capture stopgap (b) retire after native GA | **(a)** through native GA (D1b) | — |
| OD-09 | iOS | (a) after Android V1 (b) parallel (c) **not planned** | **(c) for now** — Android-only native; avoid Screen Time parity lies | closed for V1 |
| OD-10 | Age gate | 13 / 16 / 18 | **18** for V1 (money + documents reduce complexity) | W13 |
| OD-11 | Legal entity, DPO/grievance officer, registered address | — | Required for DPDP + Play | W13 |
| OD-12 | Billing on native | (a) Play Billing (b) web-only purchase with native read-only | **(a)** where store policy requires; entitlement stays server-side | W13 |
| OD-13 | Vault storage cap per tier | e.g. Explore 0, Core 100MB, Pro 2GB, Elite 10GB | Pro 2GB / Elite 10GB | W8 |
| OD-14 | Household multi-user | POST-V1 confirmation | POST-V1, stated in UI | — |
| OD-15 | Region | ap-south-1 for API + Supabase | Confirm Supabase region matches | W12 |
| OD-16 | Waitlist founding perks final wording | — | Align marketing with actual caps | W13 |

---


## 23. Traceability index

| Artifact to derive | Source sections |
|--------------------|-----------------|
| PRD | §1, §2, §3, §7, §8, §18, §20 |
| UX architecture spec | §3, §5, §6, §16 |
| Design system | §4, §5, §6, §18 |
| Database schema + migrations | §9 |
| API specification | §10, §13 |
| AI architecture | §11 |
| Privacy / trust / legal pack | §12, §17.1, §22 |
| Sync + offline engineering | §13 |
| Cloud/infra runbook | §14, §17.3 |
| Native app spec | §2.2, §3.4, §5.5–5.6, §8.5–8.10, §13 |
| Website spec | §7.2, §15 |
| Test plan | §19, §16.3 |
| Analytics plan | §17 |
| Roadmap / sprint plan | §20, §22 |

### Vault upkeep obligation

When any wave ships, the same unit of work updates: the relevant `09_FEATURES/<Entity>/` MOC + changelog, `_manifest.json` if contracts change, `03_DATABASE/` notes for new tables, `04_API/` notes for new endpoints, `08_DESIGN/Palette.md` if OD-01 is approved, `10_DECISIONS/` for each ADR above, and `15_MEMORY/Current-Context.md`. Documentation is part of done, not a follow-up.

---

---

