---
authority: engineering
derived_from: Genesis/P8 Master Specification
status: active
owner: eng
lifecycle: living
last_reviewed: 2026-08-20
can_override_genesis: false
knowledge_layer: KL-PROD
graph_role: leaf
note_type: NT-FEATURE-LEAF
migration_batch: W4
fm_source: script
---
# Daily Log

## Current state

Core daily metrics logging on desktop and mobile. Mobile is capture-only.

## Fields (product)

Sleep, gym, breakfast, steps, water, mood, energy, learning, journal, brain fog, headache, wins, DSA, reset counter (clean streak), tasks/money/notes sections on mobile.

## Data

- Table: [[03_DATABASE/daily_logs]]
- API: [[04_API/daily-logs]]

## Files

- Mobile: `frontend/src/components/mobile/*`
- Desktop daily log components under `frontend/src/components/`
- Backend: `server/routes/dailyLogs.js`

## Rules

- Mobile = data collection only
- Do not re-add protein input to mobile

## Changelog

### 2026-07-10 — Vault Brain OS registration
- **What:** Daily Log MOC created under brain OS
- **Why:** Project Brain cutover
- **Files:** `docs/knowledge/09_FEATURES/DailyLog/DailyLog.md`
- **Status:** shipped

---

## Structure (Phase V4)

> Added 2026-08-20 so every living feature MOC shares the same skeleton. Fill stubs when next touching this feature.

## Why this exists

One job this feature serves for the user.

## Contracts

Routes, tables, env names (no secret values).

## Related

- [[09_FEATURES/Index|Features Index]]
- [[15_MEMORY/Current-Context]]

