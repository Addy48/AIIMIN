package aiimin.core.data.device

import com.google.common.truth.Truth.assertThat
import org.junit.Test

class ScreenTimeTest {

    @Test
    fun busy_day_never_reads_twenty_minutes_above_union() {
        // Founder 2026-08-13: app +20m vs widget. Old w2 = (2U+E)/3 overweight unlocked.
        val interactive = 409L * 60_000L
        val unlocked = 340L * 60_000L
        val union = 300L * 60_000L
        val shown = ScreenTime.digitalWellbeingTotalMs(
            eventInteractiveMs = interactive,
            unlockedMs = unlocked,
            exclusiveAppUnionMs = union,
        )
        assertThat(shown).isAtMost(union + 12L * 60_000L)
        assertThat(shown).isAtMost(unlocked)
        assertThat(shown).isEqualTo(union + 12L * 60_000L)
    }

    @Test
    fun busy_day_cap_is_unlocked_not_interactive() {
        val interactive = 500L * 60_000L
        val unlocked = 310L * 60_000L
        val union = 200L * 60_000L
        val shown = ScreenTime.digitalWellbeingTotalMs(
            eventInteractiveMs = interactive,
            unlockedMs = unlocked,
            exclusiveAppUnionMs = union,
        )
        assertThat(shown).isEqualTo(union + 12L * 60_000L)
        assertThat(shown).isAtMost(unlocked)
        assertThat(shown).isLessThan(interactive)
    }

    @Test
    fun uses_daily_foreground_to_recover_a_truncated_activity_union() {
        val shown = ScreenTime.digitalWellbeingTotalMs(
            eventInteractiveMs = 400L * 60_000L,
            unlockedMs = 300L * 60_000L,
            exclusiveAppUnionMs = 80L * 60_000L,
            dailyForegroundByPackage = mapOf(
                "com.instagram.android" to 180L * 60_000L,
                "com.whatsapp" to 90L * 60_000L,
            ),
        )

        assertThat(shown).isEqualTo(270L * 60_000L)
    }

    @Test
    fun prefers_union_when_near_unlocked() {
        val interactive = 200L * 60_000L
        val unlocked = 100L * 60_000L
        val union = 95L * 60_000L // 95% ≥ 92%
        val shown = ScreenTime.digitalWellbeingTotalMs(
            eventInteractiveMs = interactive,
            unlockedMs = unlocked,
            exclusiveAppUnionMs = union,
        )
        assertThat(shown).isEqualTo(union)
    }

    @Test
    fun prefers_reliable_union_when_gap_small() {
        val interactive = 3L * 3_600_000
        val unlocked = 2L * 3_600_000 + 50L * 60_000 // gap 10m < 45m
        val union = 2L * 3_600_000 + 55L * 60_000
        val shown = ScreenTime.digitalWellbeingTotalMs(
            eventInteractiveMs = interactive,
            unlockedMs = unlocked,
            exclusiveAppUnionMs = union,
        )
        assertThat(shown).isEqualTo(union)
    }

    @Test
    fun digital_wellbeing_is_sum_of_foreground_when_near_events() {
        val fg = mapOf(
            "com.instagram.android" to 2L * 3_600_000,
            "com.whatsapp" to 45L * 60_000,
            "com.android.chrome" to 30L * 60_000,
        )
        val event = 3L * 3_600_000 + 20L * 60_000
        val shown = ScreenTime.digitalWellbeingTotalMs(fg, eventInteractiveMs = event)
        assertThat(shown).isEqualTo(2L * 3_600_000 + 45L * 60_000 + 30L * 60_000)
    }

    @Test
    fun prefers_event_interactive_when_daily_fg_inflated() {
        val fg = mapOf("com.reddit.frontpage" to 9L * 3_600_000)
        val event = 6L * 3_600_000 + 11L * 60_000
        val shown = ScreenTime.digitalWellbeingTotalMs(
            appForegroundByPackage = fg,
            eventInteractiveMs = event,
        )
        assertThat(shown).isEqualTo(event)
    }

    @Test
    fun prefers_lower_fg_when_under_events() {
        val fg = mapOf("com.whatsapp" to 4L * 3_600_000)
        val event = 6L * 3_600_000
        val shown = ScreenTime.digitalWellbeingTotalMs(fg, eventInteractiveMs = event)
        assertThat(shown).isEqualTo(4L * 3_600_000)
    }

    @Test
    fun falls_back_to_event_interactive_when_fg_empty() {
        val shown = ScreenTime.digitalWellbeingTotalMs(
            appForegroundByPackage = emptyMap(),
            eventInteractiveMs = 90L * 60_000,
        )
        assertThat(shown).isEqualTo(90L * 60_000)
    }

    @Test
    fun scale_apps_to_total_preserves_weights() {
        val apps = mapOf(
            "com.instagram.android" to 200L * 60_000,
            "in.aiimin.app.v3" to 100L * 60_000,
        )
        val scaled = ScreenTime.scaleAppForegroundToTotal(apps, 150L * 60_000)
        assertThat(scaled.values.sum()).isEqualTo(150L * 60_000)
        assertThat(scaled.getValue("com.instagram.android"))
            .isEqualTo(100L * 60_000)
    }

    @Test
    fun excludes_os_shell_packages() {
        assertThat(ScreenTime.countsTowardDigitalWellbeing("android")).isFalse()
        assertThat(ScreenTime.countsTowardDigitalWellbeing("com.android.systemui")).isFalse()
        assertThat(ScreenTime.countsTowardDigitalWellbeing("com.google.android.gms")).isFalse()
        assertThat(ScreenTime.countsTowardDigitalWellbeing("com.google.android.dialer")).isTrue()
        assertThat(ScreenTime.countsTowardDigitalWellbeing("com.google.android.deskclock")).isTrue()
        assertThat(ScreenTime.countsTowardDigitalWellbeing("com.instagram.android")).isTrue()
        assertThat(ScreenTime.isDonutChrome("com.nothing.launcher")).isTrue()
        assertThat(ScreenTime.isDonutChrome("com.instagram.android")).isFalse()
    }
}
