---
authority: operations
derived_from: 15_MEMORY/Current-Context
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-08-08
can_override_genesis: false
---

# Handoff — Latest (copy pack)

> Paste into new chat. Boot still: Home → Routing → Current-Context. No secrets.

**Date:** 2026-08-08 · Branch `feat/native-android-v3` · Device AIN065 `9597fdea` · APK `native-android-v3/dist/aiimin-v3-current.apk`

## Shipped this thread

- Screen time: prefer **SCREEN_INTERACTIVE** (DW), not unlocked. Proof: DW 3h8 / unlocked 2h47 / interactive 3h4 · unlocks 35=35. Log: `15_MEMORY/Reliability-Log.md`
- Splash: `One screen. Every day.` travel→stick under AIIMIN (`BrandMark.kt`)
- Plan cards: sharp rect `RoundedCornerShape(0.dp)` (`SubscriptionPlan.kt`)
- Onboarding: BrandMark + Bodoni + law (`OnboardingScreen.kt`)
- Journal: write-first + optional prompts (`JournalScreen.kt`)
- Config: English → `https://aiimin.in/lab?module=speaking` (`ConfigScreen.kt`)

## Do next

1. Founder DW same-minute eye-QA (DW UI lags live UsageEvents)
2. Deeper sync: bootstrap notes/agenda/goals/lifeScore still ignored (`GraphSyncRepository`)
3. Native English Lab (not web tab)
4. Config visual depth · feature discovery on Capture/Day

## Touch paths

`UsageDayParser.kt` · `DeviceMetricsRepository.kt` · `BrandMark.kt` · `SubscriptionPlan.kt` · `OnboardingScreen.kt` · `JournalScreen.kt` · `ConfigScreen.kt` · `09_FEATURES/Subscription/Native-Plan-System.md`

## Locks

Drafting Table steel · `#ff6b35` BrandSpark/Pro only · no auth/schema unless asked · commit/push only on ask · `/m` capture-only · proof-or-stop
