---
authority: engineering
derived_from: Genesis/P8 Master Specification
status: active
owner: eng
lifecycle: living
last_reviewed: 2026-07-25
can_override_genesis: false
knowledge_layer: KL-PROD
graph_role: leaf
note_type: NT-FEATURE-LEAF
migration_batch: W4
fm_source: script
---

# Gamification

## Parent

- [[09_FEATURES/Index]]

## Current state

XP engine, ranks, quests, achievements, streaks, sounds.

## Core ideas

- Ranks: Apprentice → Grandmaster style thresholds
- Daily XP from metrics + perfect day bonus
- Streak multiplier
- Pomodoro / money XP where wired
- Tables historically: `user_xp`, `xp_log`, `achievements`

## Files

- `frontend/src/utils/xpEngine.js`
- `frontend/src/utils/soundEngine.js`
- Mobile header/save bar/quests/achievements components

## Changelog

### 2026-07-10 — Vault Brain OS registration
- **What:** Gamification MOC created under brain OS
- **Why:** Project Brain cutover
- **Files:** `docs/knowledge/09_FEATURES/Gamification/Gamification.md`
- **Status:** shipped
