---
authority: engineering
derived_from: Genesis · Roadmap/AIIMIN-V1-Blueprint §8.9
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-08-20
can_override_genesis: false
knowledge_layer: KL-BUILD
graph_role: feature
note_type: NT-FEATURE
tags:
  - type/feature
  - domain/lab
  - status/living
---

# Native English Lab (Spark)

## One job

Run a **60-second speaking Spark**, self-score confidence / clarity / pace, sync streak + mastery to the Lab API. No browser hop.

## Entry

- Config → **English · Spark**
- Lab tab → English card at top
- Destination: `English` (stack, not a bottom tab)

## Contract

| Piece | Detail |
|-------|--------|
| Prompt bank | `SpeakingTopics` in `core/data` (HR · Technical · Daily · Debate) |
| Timer | 60s · stop-early → score phase |
| Scores | 1–100 sliders · mean logged as confidence |
| Write | `POST /api/lab/practice/speaking` via `SpeakingStore` outbox + `GraphSyncRepository.flushSpeakingOutbox` |
| Read | `GET /api/lab/summary` → speaking streak / mastery / latest |
| Tier | Core+ (`TierFeature.LAB_FULL`) |

## Files

- `feature/english/` — `EnglishScreen` · `EnglishViewModel`
- `core/data/SpeakingStore.kt` · `SpeakingTopics.kt`
- `core/network/AiiminApi.kt` — `labSummary` · `postSpeakingPractice`

## Out of scope (this slice)

- On-device ASR / Gemini scorecard
- Debate opponent mode
- Audio upload to cloud
- Full AEI index / placement test (Blueprint §8.9 later)

## Changelog

### 2026-08-08 — Native Spark MVP
- **What:** Replaced Config web handoff with native Spark module + API sync + Lab entry card
- **Why:** Founder P0 — useful speaking practice on phone without leaving the OS
- **Files:** feature/english/*, SpeakingStore.kt, SpeakingTopics.kt, AiiminApi.kt, AiiminShell.kt, ConfigScreen.kt, LabScreen.kt
- **Status:** partial (assemble + unit tests; device QA pending — phone offline)
- **Notes:** Audio stays on-device; scores sync only

---

## Structure (Phase V4)

> Added 2026-08-20 so every living feature MOC shares the same skeleton. Fill stubs when next touching this feature.

## Current state

Status / scope / last meaningful change. Update when behavior changes.

## Why this exists

One job this feature serves for the user.

## Contracts

Routes, tables, env names (no secret values).

## Related

- [[09_FEATURES/Index|Features Index]]
- [[15_MEMORY/Current-Context]]

