---
authority: operations
derived_from: ~/Desktop/AIIMIN_PLAN.md (Part 3) · V3-COMPLETE-BUILD-SPEC
status: proposed
owner: founder
lifecycle: living
last_reviewed: 2026-10-09
can_override_genesis: false
knowledge_layer: KL-OPS
graph_role: leaf
note_type: NT-PLAN
tags:
  - type/plan
  - domain/native
  - status/proposed
---

# V4 rebuild: module structure (proposed)

Source of truth for behaviour: `~/Desktop/AIIMIN_PLAN.md`. Reference logic:
`~/Desktop/AIIMIN_archive/prototype-build-sources/v2_*.js`.

## Keep from v3

The build system is sound and stays: `build-logic` convention plugins, version
catalog (AGP 9.3, Kotlin 2.3, Room 3, Navigation 3, Hilt), `:core:network`.
Features are rebuilt, not patched.

## Module map

| Layer | Module | Status | Holds |
|---|---|---|---|
| Pure Kotlin | `:core:engine` | **Done** (28 tests) | RulesConfig 2.0.0, intentions + presets, ScoreEngine, Streak, Battery, VCS, XP policy, LogicalDay, EventChain |
| Pure Kotlin | `:core:privacy` | **Done** (7 tests) | Roles, shares, caregiver delegate, emergency access, journal / Life Score privacy |
| Pure Kotlin | `:core:nlp` | **Done** (9 tests) | Capture parser, bank SMS, document fields, assistant proposals + scope |
| Android | `:core:database` | Next | Room 3: append-only `event` table + chain tail; derived `day_result` cache (wipeable); intentions, tasks, calendar, txns, notes, journal (encrypted), docs, people, shares, emergency, notifications |
| Android | `:core:data` | Next | `EventRepository` = the only write path (every mutation is an event); `SnapshotBuilder` (events → `DaySnapshot`); `LifeRepository` (engine readout as Flow) |
| Android | `:core:sensing` | Next | Screen time, app usage, unlocks, steps, sleep, heart rate, bank-alert listener. Rewritten (see diagnosis) |
| Android | `:core:sync` | Later | aiimin.in sync, event upload with idempotency keys, server-computed score display |
| Android | `:core:ai` | Later | Runs `:core:nlp` decisions, applies proposals through `EventRepository` with one Undo, "what AI saw" log, SpeechRecognizer (en-IN, hi-IN), server proxy to Claude |
| Android | `:core:vault` | Later | App-private files, Keystore AES-GCM, BiometricPrompt, PdfRenderer, ML Kit scanner + OCR |
| Android | `:core:notifications` | Later | Rule engine + WorkManager (day boundary, 12:00 settlement, expiry radar) |
| Android | `:core:designsystem` | Later | Rebuilt in the visual redesign |
| Feature | `today`, `money`, `vault` (+ family, person), `me` (score, signals, battery, settings), `capture` (＋), `assistant`, `notes`, `journal`, `calendar`, `focus`, `onboarding` | Later | One screen family each |

Retire after migration (proposed, needs founder OK): `:feature:osid`, `:feature:lab`,
`:feature:english`, `:feature:discipline`, `:feature:config`, `:feature:score`,
and the v3 score types in `:core:model` (`LifeScore`, `Hold`, `OsIdRules`, …).

## Port deviations from the prototype (all deliberate)

1. Signal weights use water-filling, so no signal exceeds 25% even with few signals.
   The prototype capped then renormalised. Identical whenever nothing hits the cap.
2. Rest-day / shift-day targets are used in scoring (`Intention.targetFor`). The
   prototype stored them but always scored against the base target.
3. Hardcore mode has no streak repair (plan §7 table). The prototype repaired in every mode.
4. XP: capture earns nothing. The prototype still had `addXP(2,'Captured')`.
5. Assistant: Vault scope starts **off** (plan §13); the prototype started it on.
   Commas also split items ("add X, spent 200 on Y"), for the voice logger.
6. Guests can see household items explicitly shared with them; caregivers never
   see items marked sensitive.
7. Event canonical form is sorted-key JSON (`CanonicalJson`). The server verifier
   must use the same form.

## Why screen time and steps were wrong in v3

- Screen time: `queryAndAggregateUsageStats` was treated as authoritative and
  short-circuits everything. It returns whole OS buckets that overlap the range, so
  it over-counts. Behind it sit heuristics tuned to one phone (`+12m` caps, AOD
  guards). Sessions that started before midnight were dropped on purpose. Apps were
  tracked per package rather than per activity, and 30-minute chunk edges were
  inclusive on both ends.
  **Fix:** one event walk over `ACTIVITY_RESUMED/PAUSED` keyed by activity
  instance, with a lookback that clips sessions to the logical day, and no bucket
  totals.
- Steps: it picked the single highest phone origin, mixed in the raw step-counter
  sensor, and bypassed Health Connect's own de-duplicated aggregate, which applies
  the user's data-source priority (phone vs watch).
  **Fix:** use the unfiltered HC `aggregate(COUNT_TOTAL)` over the logical day. Use
  the sensor only when Health Connect is unavailable, and mark it Tier C.

## Open decision

The old vault decision `10_DECISIONS/2026-08-03-life-score-taxonomy` uses five
fixed dimensions computed on the server only. The approved plan replaces it with
personal intention cards. The pure engine can run on device (offline) and on a
Kotlin server. The plan says production scores on the server, so the server needs
this engine or a port of it.

## Status 2026-10-10 (branch `feat/native-v4`, uncommitted)

All modules built; `:app:assembleDebug` green; 56 unit tests green (engine 28,
privacy 7, nlp 11, sensing 10). Installed and driven on the AiiminLean emulator:
onboarding → Today → capture (multi-item) → money/SMS share → review → vault PDF
import with OCR (policy no. + expiry found) → in-app PDF viewer → focus → journal
(encrypted) → assistant Q&A with sources → dark mode → real usage-event screen time.

Bugs found and fixed during the run: onboarding save cancelled by recomposition;
false "yesterday open" on day one; text fields bound to StateFlow dropping keys;
Panel not filling width; "120 on auto" parsed as a note; motor policy filed as
Identity; note autosave lost on pop; misleading "Back to today" label.

Anti-slop pass: controls squared (10 dp, no pills), bare icons instead of boxed
icon tiles, no accent side-bars, Phosphor icons only, no emoji, copy written
for this product.

Not verified on a physical phone yet (Health Connect steps/sleep, bank
notification listener, document scanner need real hardware).
