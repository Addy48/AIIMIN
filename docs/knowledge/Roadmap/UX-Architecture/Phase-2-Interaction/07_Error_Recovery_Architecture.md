---
authority: operations
derived_from: P5 IX-2/12 · C-UX-08/09 · Intelligence 08 State · Journeys recovery · D07–D10
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-25
can_override_genesis: false
program: UX-Architecture-v1
phase: 2-interaction
---

# 07 — Error Recovery Architecture

## Purpose

Make failure, conflict, and reversal first-class interaction — not polish.

## Required state interactions (from Intelligence gaps)

| State | Architecture obligation | Trace |
|-------|------------------------|-------|
| Loading | Feedback mandatory; not fake Hold | Skeleton present · DH-66 |
| Empty | **Must teach** (not blank guilt) | NN #8 · D07 |
| Error | Calm, actionable, blame-light | C-UX-09 · Journey recovery weak |
| Offline | Visible + recoverable queue/retry | D08 desktop weak; `/m`/native stronger |
| Permission denied | Clear reason + path (OAuth, tier, bio) | State P column · Tier lock |
| Syncing | Non-blocking ambient | Sync banners |
| Conflict | **REQUIRED** resolve/choose path — currently missing | State C gaps · D09 |
| AI processing | Distinct from generic loading | State AI column weak |
| Success / Fail | Explicit feedback | StatusAlert uneven |
| Draft resume | Onboarding/journal drafts recoverable | Onboarding draft gap |
| Deleted / Recoverable | Recoverable delete where Intelligence shows Del | Recover gaps Notes/Journal |
| Fatal | ErrorBoundary path + recovery exit | Present |

## Undo architecture

| Rule | Trace |
|------|-------|
| Reversible writes SHOULD be undoable (capture, AI apply, toggles) | D10 major missing · IXA-16 |
| Irreversible: confirm (typed when peak stakes) | IX-12 · NN #5 |
| No silent AI write without correction/undo path | D22 · IX-2 |

## Auth / OAuth recovery

Login/callback failures must expose recoverable next step (Intelligence: opaque callback risk in journeys) — architecture **REQUIRED**, not new feature.

## Discipline / shame

Error and streak failure must not use shame retention (NN Forbidden #26 · IXA-18).
