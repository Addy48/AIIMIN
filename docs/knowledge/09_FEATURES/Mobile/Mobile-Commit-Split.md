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

# Mobile commit split

> [!abstract] Satellite note
> Not the primary feature MOC. Primary contracts live in the folder’s main feature note + [[09_FEATURES/Index]].


## Parent

- [[09_FEATURES/Mobile/Capacitor-Android|Mobile]] · [[09_FEATURES/Index]]

See `plans/mobile-commit-split.md` in repo root for file lists.

**Never** mix website refactors (correlation, daily logs, Discipline, etc.) with mobile/Capacitor in one commit.

Suggested branch: `feat/mobile-capture-capacitor`

**SeedData:** stays on website branch for QA — exclude from mobile commits.
