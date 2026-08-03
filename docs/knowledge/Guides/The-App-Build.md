---
authority: operations
derived_from: 17_NATIVE_APP_V2/AIIMIN_APP_BUILD_AGENT_PLAN · 15_MEMORY/Handoff-Native-App-Build
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-08-03
can_override_genesis: false
knowledge_layer: KL-BUILD
graph_role: hub
note_type: NT-GUIDE
tags:
  - type/guide
  - status/living
---

# The app build

> Plain-language status of the native Android app. The executable detail lives in
> [[15_MEMORY/Handoff-Native-App-Build]]; the guardrails in
> [[17_NATIVE_APP_V2/AIIMIN_APP_BUILD_AGENT_PLAN]].

## What it is

**Kotlin + Jetpack Compose, native, Android-first, built from scratch** at
`native-android-v3/`. Decided 2026-08-03 — see [[Guides/Decisions-And-Why]].

Not Expo, not React Native, not a webview. You asked for no corner cutting, and this is the
option with the highest ceiling for craft.

## The tab map — five, and only five

**DAY · MONEY · CAPTURE · LAB · CONFIG**

Everything else is reached contextually. That constraint is constitutional (GOV-165): Journal,
Notes, Timeline, Family, Search and the AI surface are **not** tabs. Adding a sixth tab is a
Genesis violation, not a design preference.

## Build order — one screen at a time

Each screen is finished, verified against a real build, and committed **before** the next
starts. No scaffolding five screens at once.

| # | Screen | Its one job |
|---|--------|-------------|
| 0 | Foundation | theme (both modes), type, brand mark, base components, 5-tab shell |
| 1 | **Capture** | turn one sentence into structured truth — **the trust surface** |
| 2 | Today | act on this day — capture-first, score *below* |
| 3 | Money | log and see money truth |
| 4 | Config | configure the OS |
| 5 | OS-ID | own your identifier |
| 6 | Onboarding | get a new user to their first capture |
| 7 | Journal | reflection capture |
| 8 | Lab | ask, review, act on patterns |
| 9 | Live Score | mark and settle the day |

## Why Capture is built first and most carefully

It is the surface the whole product rests on. If it guesses wrong and commits anyway, you stop
trusting the data — and a life OS you don't trust is worthless.

The contract:
- Free text → AI parse → **editable chips** (amount · category · merchant · people · mood ·
  duration).
- **SETTLE** commits and shows a toast with **UNDO**. **DRIFT** holds it, uncommitted.
- **Nothing writes without an explicit Settle.**
- A wrong parse is correctable in **≤ 2 taps**.
- Offline queues into the Hold tray and flushes on reconnect, with an idempotency key so a
  retry can't double-write.

## Where it stands

Three commits exist on `feat/native-android-v3`: foundation (project, Drafting Table theme,
5-tab shell), Capture — the trust surface, and a Capture craft pass. 42 Kotlin files, ~97 MB
including build output.

Live tracker: [[17_NATIVE_APP_V2/WORKFLOW-PLAN]]

## Constraints that shape it

**Your machine is 8 GB with ~70% of swap already used.** Android Studio + Gradle daemon + an
emulator will not fit together. Build with Gradle, install to a **physical phone** over `adb`,
and push release builds to the GitHub Actions runner that already exists. Cap the Gradle heap.

**Design is locked.** Match `frontend/prototypes/AIIMIN-Drafting-Table.html`. Tokens at
`frontend/src/prototypes/drafting-table/tokens.css`. Steel accent, `#ff6b35` only as the
peak-A spark, JetBrains Mono on every numeral, square corners.

**Data goes through `/api/*`** with the session cookie, same as every other client. The app
does **not** compute the Life Score — it reads `GET /intelligence/lhs`, so the number on your
phone always equals the number on the web.

## The old app

`native-android/` (V2, `2.1.8-native`, 40 hand-written Kotlin files). Its design predates the
Drafting Table language and is superseded.

**Read** its `sync/`, `session/`, `security/`, `data/network/ApiModels.kt` — that API contract
already works against production and re-deriving it wastes a day.
**Never copy its `ui/`.**

## See also

[[Guides/Start-Here]] · [[15_MEMORY/Handoff-Native-App-Build]] ·
[[17_NATIVE_APP_V2/AIIMIN_APP_BUILD_AGENT_PLAN]]
