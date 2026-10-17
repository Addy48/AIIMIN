# AIIMIN Native — Living Sky, Mascot & Empty-State Overhaul — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Also load before starting (skill library):** `claude-android-ninja` (Compose/Hilt/Room conventions), `emil-design-eng` + `animate` (motion), `impeccable` / `polish` (finish quality), `onboard` (empty states / first run), `adapt` (small + wide phones), `audit` (accessibility), `superpowers:verification-before-completion`. Use `superpowers:systematic-debugging` for the Money performance task.

**Goal:** Make the app feel alive and premium on a real phone with *no* data: a time-of-day "living sky" on Today (sunlight spreading from top-left in the morning, overhead at noon, moonlight from top-right at night), an optional small mascot, empty states that teach instead of looking blank, and a fast Money screen.

**Architecture:** All visuals are pure Compose `Canvas` drawing in `:core:designsystem`, driven by a single `SkyPhase` value computed from the clock (pure, unit-tested). Screens only pass `nowMinute`. Empty states become a reusable `FirstRunCard` with a real next action. No fake data, no network.

**Tech Stack:** Kotlin 2.3, Jetpack Compose (Material3 as base only), Hilt, Room 3, Navigation 3. Build: `./gradlew :app:assembleDebug`, tests: `./gradlew testDebugUnitTest`.

---

## 0. Ground rules (read first — non-negotiable)

- Project root: `/Users/aaditya/Desktop/aiimin/01-repo/app` (Gradle multi-module). Branch `feat/native-v4`. applicationId `in.aiimin.app.v4`.
- **Light theme only.** Never add/modify dark palettes.
- Tokens only (no hard-coded colours in features): `core/designsystem/src/main/kotlin/aiimin/designsystem/theme/Palette.kt` (`LightPalette`), type in `Type.kt`, access via `Aiimin.colors` / `Aiimin.type`.
  Base paper `#F5F3EE`, ink `#1A1916`, accent `#FF6B35` (fills only), accent text `#C24E20`.
- Fonts: Funnel Display (display) + Golos Text (body), already bundled. Icons: Phosphor (`designsystem/icon/AppIcons.kt`).
- **No gradients that read as "glass", no purple, no emoji.** Soft *radial light* for the sky is allowed but must be low-alpha warm/cool tints on the paper, never a coloured background. Hairlines, not boxes.
- Respect `AppSettings.reduceMotion` (`core/data/.../settings/SettingsStore.kt`): when true, draw the sky static (no animation).
- Privacy copy stays honest: synced data is plain text on aiimin.in; no end-to-end encryption claims.
- Visual spec: `~/Downloads/AIIMIN Design Spec for Claude Code.md` §1–§6 and the interactive reference `~/Downloads/AIIMIN App.dc.html`. Product plan: `~/Desktop/AIIMIN_PLAN.md` (v4.1).
- QA: emulator `AiiminLean`; set phone geometry first: `adb shell wm size 1080x2412 && adb shell wm density 420` (matches the owner's Nothing Phone 2). Open any screen with `adb shell am start -S -n in.aiimin.app.v4/aiimin.app.MainActivity --es aiimin_go <route>` (route names in `app/src/main/kotlin/aiimin/app/MainActivity.kt`, function `handle`). Sample data: `--es aiimin_demo load` (only for visual comparison — never ship fake data to real users). **Never `pm clear` the owner's phone.**

## 1. File map (where things live today)

| Area | File |
|---|---|
| Today screen (hero clock, arc, Now card, stat line, Later today, minimums, phone-data card) | `feature/today/src/main/kotlin/aiimin/feature/today/TodayScreen.kt` |
| Today state | `feature/today/src/main/kotlin/aiimin/feature/today/TodayViewModel.kt` |
| Day arc (horizon) | `core/designsystem/src/main/kotlin/aiimin/designsystem/component/Horizon.kt` (`DayHorizon`) |
| Time-of-day colours | `core/designsystem/src/main/kotlin/aiimin/designsystem/theme/Palette.kt` (`Horizon`, `Horizons`) |
| Empty state component | `core/designsystem/src/main/kotlin/aiimin/designsystem/component/Chrome.kt` (`EmptyState`) |
| Surfaces / Panel / rows | `core/designsystem/.../component/Surfaces.kt` |
| Charts | `core/designsystem/.../component/Charts.kt` (Bars, Sparkline), `VicoBarChart.kt` (Money), `ScrubCharts.kt` |
| Brand mark | `core/designsystem/.../component/BrandMark.kt` |
| Money home | `feature/money/src/main/kotlin/aiimin/feature/money/MoneyHome.kt`, VM `MoneyViewModels.kt`, repo `core/data/.../money/MoneyRepository.kt` |
| Me / Score | `feature/me/src/main/kotlin/aiimin/feature/me/ScoreScreens.kt` |
| Phone day (screen time) | `feature/me/src/main/kotlin/aiimin/feature/me/InfoScreens.kt` (`PhoneDayScreen`) |
| Vault | `feature/vault/src/main/kotlin/aiimin/feature/vault/VaultScreens.kt` |
| Voice (in-app, no Google dialog) | `core/designsystem/.../component/Voice.kt` |
| Theme / density scaling | `core/designsystem/.../theme/Theme.kt` |

## 2. New/changed files in this plan

- Create `core/designsystem/src/main/kotlin/aiimin/designsystem/sky/SkyPhase.kt` — pure maths: minute → light position, colour, intensity.
- Create `core/designsystem/src/main/kotlin/aiimin/designsystem/sky/LivingSky.kt` — Composable background layer.
- Create `core/designsystem/src/main/kotlin/aiimin/designsystem/sky/Mascot.kt` — optional small companion (line-drawn, ink only).
- Create `core/designsystem/src/main/kotlin/aiimin/designsystem/component/FirstRunCard.kt` — teaching empty state.
- Create test `core/designsystem/src/test/kotlin/aiimin/designsystem/sky/SkyPhaseTest.kt`.
- Modify `TodayScreen.kt`, `Chrome.kt`, `MoneyHome.kt`, `ScoreScreens.kt`, `VaultScreens.kt`, `MoneyViewModels.kt`, `SettingsStore.kt` (one new toggle `showMascot`).

---

### Task 1: SkyPhase maths (pure, tested)

**Files:** Create `core/designsystem/src/main/kotlin/aiimin/designsystem/sky/SkyPhase.kt`, test `core/designsystem/src/test/kotlin/aiimin/designsystem/sky/SkyPhaseTest.kt`. Add to `core/designsystem/build.gradle.kts`: `testImplementation(libs.bundles.unit.test)` if missing.

- [ ] **Step 1: Write the failing test**

```kotlin
package aiimin.designsystem.sky

import com.google.common.truth.Truth.assertThat
import org.junit.Test

class SkyPhaseTest {
    @Test fun `morning light sits top-left, noon centre, night is moon on the right`() {
        val m = SkyPhase.at(7 * 60)
        assertThat(m.kind).isEqualTo(SkyPhase.Kind.SUN)
        assertThat(m.x).isLessThan(0.25f)
        val n = SkyPhase.at(13 * 60)
        assertThat(n.x).isWithin(0.08f).of(0.5f)
        val night = SkyPhase.at(22 * 60)
        assertThat(night.kind).isEqualTo(SkyPhase.Kind.MOON)
        assertThat(night.x).isGreaterThan(0.75f)
    }

    @Test fun `light is strongest near noon and faint at dawn`() {
        assertThat(SkyPhase.at(13 * 60).intensity).isGreaterThan(SkyPhase.at(6 * 60 + 30).intensity)
    }

    @Test fun `continuous across the whole day (no jumps over 0_1 per 10 minutes)`() {
        (0 until 24 * 60 step 10).forEach { t ->
            val a = SkyPhase.at(t); val b = SkyPhase.at((t + 10) % (24 * 60))
            if (a.kind == b.kind) assertThat(kotlin.math.abs(a.x - b.x)).isLessThan(0.1f)
        }
    }
}
```

- [ ] **Step 2:** Run `./gradlew :core:designsystem:testDebugUnitTest --tests '*SkyPhaseTest*'` → FAIL (unresolved `SkyPhase`).
- [ ] **Step 3: Implement**

```kotlin
package aiimin.designsystem.sky

import androidx.compose.ui.graphics.Color
import kotlin.math.PI
import kotlin.math.sin

/** Where the light is at a minute of the day. x/y are 0..1 of the screen; intensity 0..1. */
data class SkyPhase(val kind: Kind, val x: Float, val y: Float, val intensity: Float, val tint: Color) {
    enum class Kind { SUN, MOON }

    companion object {
        private const val SUNRISE = 6 * 60
        private const val SUNSET = 19 * 60

        fun at(minute: Int): SkyPhase {
            val m = ((minute % 1440) + 1440) % 1440
            return if (m in SUNRISE until SUNSET) {
                val f = (m - SUNRISE).toFloat() / (SUNSET - SUNRISE)          // 0 at sunrise, 1 at sunset
                val arc = sin(PI * f).toFloat()                                 // 0..1..0
                SkyPhase(Kind.SUN, x = 0.05f + 0.9f * f, y = 0.02f + 0.10f * (1 - arc), intensity = 0.35f + 0.65f * arc,
                    tint = if (f < 0.25f || f > 0.8f) Color(0xFFFF9A5C) else Color(0xFFFFC27A))
            } else {
                val night = if (m >= SUNSET) m - SUNSET else m + (1440 - SUNSET)    // minutes since sunset
                val f = night.toFloat() / (1440 - (SUNSET - SUNRISE))
                SkyPhase(Kind.MOON, x = 0.95f - 0.15f * f, y = 0.04f, intensity = 0.25f + 0.25f * sin(PI * f).toFloat(), tint = Color(0xFF9DB2C6))
            }
        }
    }
}
```

- [ ] **Step 4:** Re-run the test → PASS.
- [ ] **Step 5: Commit** `git add core/designsystem && git commit -m "feat(sky): pure time-of-day light model with tests"`

### Task 2: LivingSky composable

**Files:** Create `core/designsystem/src/main/kotlin/aiimin/designsystem/sky/LivingSky.kt`.

- [ ] **Step 1: Implement** (radial light on paper, behind content; tick every minute; static when reduce motion)

```kotlin
package aiimin.designsystem.sky

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

/**
 * A soft pool of light on the paper: warm sun from the top-left in the morning, overhead at
 * noon, a cool moon glow from the top-right at night. Draw it as the first child of Today.
 */
@Composable
fun LivingSky(nowMinute: Int, modifier: Modifier = Modifier, height: Dp = 360.dp, reduceMotion: Boolean = false) {
    val p = SkyPhase.at(nowMinute)
    val x by animateFloatAsState(p.x, if (reduceMotion) tween(0) else tween(1200), label = "skyX")
    val a by animateFloatAsState(p.intensity, if (reduceMotion) tween(0) else tween(1200), label = "skyA")
    Canvas(modifier.fillMaxWidth().height(height)) {
        val c = Offset(size.width * x, size.height * p.y)
        val r = size.width * (if (p.kind == SkyPhase.Kind.SUN) 0.85f else 0.6f)
        drawCircle(
            Brush.radialGradient(listOf(p.tint.copy(alpha = 0.22f * a), p.tint.copy(alpha = 0.08f * a), Color.Transparent), center = c, radius = r),
            radius = r, center = c,
        )
    }
}
```

- [ ] **Step 2: Wire into Today.** In `TodayScreen.kt` wrap the `LazyColumn` in a `Box`; first child `LivingSky(nowMinute = now.hour * 60 + now.minute, reduceMotion = u.reduceMotion)` aligned `TopCenter`. (If `TodayUi` lacks `reduceMotion`, add it from `AppSettings.reduceMotion` in `TodayViewModel`.)
- [ ] **Step 3: Visual check on emulator** at 07:00, 13:00, 22:00: `adb shell su 0 date 101407002026.00` (emulator root) then `--es aiimin_go today`, screenshot. Light must be subtle (text contrast unchanged — check with `audit` skill, WCAG AA on `textMuted` over the brightest point).
- [ ] **Step 4: Commit** `feat(today): living sky light behind the hero`

### Task 3: Mascot (optional companion, off by default)

**Files:** Create `core/designsystem/.../sky/Mascot.kt`; modify `SettingsStore.kt` (add `showMascot: Boolean = false`, key `show_mascot`, read/write like `haptics`); add a switch in `feature/me/.../MeExtras.kt` `AppearanceScreen`.

- [ ] **Step 1:** Mascot = a single-line ink figure (circle head + arc body, 1.75 dp stroke, ink `Aiimin.colors.text`) sitting on the Today arc baseline at "now". States from `SkyPhase`: morning stretch (arms up), day neutral, evening sitting, night asleep (closed eyes "‿‿"). Pure `Canvas` paths, ≤ 40 dp tall. No emoji, no colour except a 6 dp accent sun/moon dot already drawn by `DayHorizon`.
- [ ] **Step 2:** Draw it in `Horizon.kt` `DayHorizon` when a new param `mascot: Boolean` is true (pass `u.showMascot`). Content description: "Your day so far".
- [ ] **Step 3:** Reduce motion → no idle breathing animation (otherwise 4 s ease in/out scale 1.0↔1.03).
- [ ] **Step 4:** Commit `feat(today): optional line-drawn companion on the day arc`

### Task 4: FirstRunCard — teaching empty states (no fake data)

**Files:** Create `core/designsystem/.../component/FirstRunCard.kt`; modify `Chrome.kt` `EmptyState` to delegate when `steps` given.

- [ ] **Step 1: Implement**

```kotlin
package aiimin.designsystem.component

import aiimin.designsystem.theme.Aiimin
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

/** One real next step per line, ticked when done. Used wherever a screen has no data yet. */
data class FirstStep(val title: String, val done: Boolean, val action: String, val onClick: () -> Unit)

@Composable
fun FirstRunCard(eyebrow: String, title: String, steps: List<FirstStep>, modifier: Modifier = Modifier) {
    Column(modifier.fillMaxWidth().padding(vertical = 8.dp)) {
        Text(eyebrow.uppercase(), style = Aiimin.type.eyebrow.copy(color = Aiimin.colors.accentText))
        Text(title, style = Aiimin.type.headline, modifier = Modifier.padding(top = 4.dp, bottom = 8.dp))
        steps.forEach { s ->
            ListRow(
                s.title, leading = { CheckCircle(s.done, {}, s.title) },
                trailing = { if (!s.done) Text(s.action, style = Aiimin.type.label.copy(color = Aiimin.colors.accentText)) },
                onClick = if (s.done) null else s.onClick, titleColor = if (s.done) Aiimin.colors.textMuted else Aiimin.colors.text,
            )
            Hairline()
        }
    }
}
```

- [ ] **Step 2: Today with no data** (`TodayScreen.kt`): when `later.isEmpty() && u.minimums.isEmpty()` show `FirstRunCard("Start here", "Three things make AIIMIN useful", ...)` with steps: "Add your first minimum" (→ `Route.Minimums`), "Capture something with ＋" (→ `nav.capture()`), "Let the phone measure your day" (done when `access.usage && access.steps`, else open Sensors). Remove the bare "Nothing left on the plan" line in that case.
- [ ] **Step 3: Money with no payments** (`MoneyHome.kt`): replace the empty chart (all bars 0) with a FirstRunCard: "Turn on payment alerts" (→ notification-listener settings via `DeviceRepository.notificationListenerSettings()`), "Paste a bank SMS" (opens the existing paste sheet), "Set a monthly plan" (→ `Route.Budget`). Hide the range switcher until the first payment exists.
- [ ] **Step 4: Score with no history** (`ScoreScreens.kt`, `ScoreScreen`): instead of a flat empty chart show "Your score starts in N days" with a 7-dot progress (filled = days with ≥ 4 signals measured), using `life.readout.calibrating`.
- [ ] **Step 5: Vault empty** (`VaultScreens.kt`): FirstRunCard with "Scan your first document", "Add your emergency card" (→ `Route.EmergencyCard("me")`), "Add family" (→ `Route.Family`).
- [ ] **Step 6:** Screenshot each with a fresh install (onboarding completed, no demo). Commit `feat: teaching empty states on Today, Money, Score, Vault`.

### Task 5: Money opens fast (systematic-debugging)

Observed: Money shows a skeleton ~6–7 s after cold start on the emulator (Vault ~2 s).

- [ ] **Step 1: Measure.** Add temporary `android.util.Log.d("AIIMIN_T", ...)` with `.onEach{}` on `MoneyViewModel.series` and `.data` (file `feature/money/.../MoneyViewModels.kt`), plus at the start/end of `init { }`. Cold start `--es aiimin_go money`, `adb logcat -d | grep AIIMIN_T`.
- [ ] **Step 2: Likely causes to check in order:** (a) `init` runs `accountsRepo.ensureSeeded()`, `bills.refresh()` (scans 120 days), `accountsRepo.views()` on Main before flows emit — move to `viewModelScope.launch(Dispatchers.IO)` and run *after* first emission; (b) `Maintenance.run()` at app start (`core/data/.../app/AppRepositories.kt`) holding the DB writer (usage-events read in `DeviceRepository.refreshRecent`) — defer it 3 s after first frame (`AiiminApplication.kt`); (c) `stateIn(WhileSubscribed)` restarting flows on recomposition — switch `series`/`data` to `SharingStarted.Eagerly`.
- [ ] **Step 3:** Target: amount visible ≤ 1.5 s after the activity is displayed. Remove the logs. Commit `perf(money): first numbers under 1.5 s`.

### Task 6: Polish pass (impeccable + polish skills)

- [ ] Today hero: clock `heroClock` 68sp is large on 1080×2412 — verify the clock + "PM / greeting" block never wraps the clock; on widths < 360 dp drop clock to 56 sp (`Theme.kt` already scales density 0.92–1.1).
- [ ] Section spacing per spec §4: section header top margin 26 dp everywhere (search `SectionHeader(` and `padding(top = 18.dp)` in `Surfaces.kt` — change to 26 dp and re-screenshot all roots).
- [ ] Charts: all bar charts use ink bars, accent only for the selected bar (done for `Bars` in `Charts.kt` and Money `VicoBarChart.kt`); confirm `ScrubCharts.kt` line charts match spec §5 (ink line 2 dp, accent dot r6).
- [ ] Run `audit` skill (report mode) over Today, Money, Me, Vault; fix contrast/touch-target (≥ 48 dp) findings.
- [ ] `./gradlew testDebugUnitTest :app:assembleDebug` green; copy APK to `~/Desktop/AIIMIN-native-debug.apk`; `adb -s <phone> install -r` (never clear data).

## 3. Already done in this session (don't redo)

- In-app speech recogniser (`Voice.kt`), no Google pop-up; prefers on-device engine, live partial transcript and real mic level in Capture. Needs `RECORD_AUDIO` (added to manifest; requested on first use).
- "Measure your day" card on Today for missing Usage access / Health Connect / step counter (`TodayScreen.kt` `PhoneDataCard`).
- Money chart band drawn behind bars (`VicoBarChart.kt` `BehindBars`); flat Panels; Phone-day bars ink with a baseline; greeting no longer truncated; "Score in N days" on new accounts.
- Replace-this-phone guardrails, mass-delete brake in sync, Score Engine 3, sync v2 — see `docs/COVERAGE.md`.

## 4. Owner's phone checklist (manual, once)

1. Open AIIMIN → Today → "Measure your day" → **Screen time: Turn on** → Usage access → AIIMIN → Allow.
2. **Steps and sleep: Turn on** → Health Connect → allow Steps, Sleep (and Heart rate if wanted).
3. Me → Phone data: turn on Notifications and Bank alerts (notification access) if wanted.
4. First voice capture asks for the microphone once.
