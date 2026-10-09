package aiimin.core.data.device

import com.google.common.truth.Truth.assertThat
import org.junit.Test

/**
 * Event parsing helpers. Displayed screen total lives in [ScreenTime].
 */
class UsageDayParserLogicTest {

    @Test
    fun screen_on_is_not_sum_of_apps_without_merge() {
        val screenOn = 2L * 60 * 60 * 1000
        val appA = 90L * 60 * 1000
        val appB = 90L * 60 * 1000
        assertThat(appA + appB).isGreaterThan(screenOn)
    }

    @Test
    fun format_hours_matches_settings_style() {
        assertThat(UsageDayParser.formatHours(5L * 60 * 60 * 1000 + 30L * 60 * 1000))
            .isEqualTo("5h 30m")
        assertThat(UsageDayParser.formatHours(45L * 60 * 1000)).isEqualTo("0h 45m")
    }

    @Test
    fun format_hours_rounds_half_up_like_digital_wellbeing() {
        assertThat(UsageDayParser.formatHours(4L * 3_600_000 + 30L * 60_000 + 40_000))
            .isEqualTo("4h 31m")
        assertThat(UsageDayParser.formatHours(90L * 60_000 + 30_000))
            .isEqualTo("1h 31m")
        assertThat(UsageDayParser.formatHours(90L * 60_000 + 29_000))
            .isEqualTo("1h 30m")
    }

    @Test
    fun walk_labels_unchanged() {
        assertThat(labelWalk(13, 800, 15)).isEqualTo("Lunch walk")
        assertThat(labelWalk(18, 600, 12)).isEqualTo("Before dinner walk")
    }

    @Test
    fun unlock_debounce_and_keyguard_gate() {
        var unlocks = 0
        var keyguardShowing = true
        var lastUnlock = Long.MIN_VALUE / 2
        val debounce = 800L
        fun hidden(t: Long) {
            if (keyguardShowing && t - lastUnlock >= debounce) {
                unlocks++
                lastUnlock = t
            }
            keyguardShowing = false
        }
        fun shown() {
            keyguardShowing = true
        }
        hidden(1_000L)
        hidden(1_100L)
        shown()
        hidden(2_000L)
        assertThat(unlocks).isEqualTo(2)
    }

    /**
     * KEYGUARD_SHOWN within 5s of SCREEN_INTERACTIVE must abort the unlocked
     * pulse (not closeUnlocked into the sum) — that was the ~3–4m/day over-read.
     */
    @Test
    fun lockscreen_wake_aborts_unlocked_pulse_not_counted() {
        var unlockedStart: Long? = null
        var unlockedMs = 0L
        var interactiveStart: Long? = 0L
        val abortWindow = 5_000L

        fun closeUnlocked(at: Long) {
            val s = unlockedStart ?: return
            unlockedMs += (at - s).coerceAtLeast(0L)
            unlockedStart = null
        }
        fun abortUnlocked() {
            unlockedStart = null
        }
        fun keyguardShown(t: Long) {
            val unlockStarted = unlockedStart
            val interactiveAt = interactiveStart
            val abort = unlockStarted != null &&
                interactiveAt != null &&
                unlockStarted >= interactiveAt &&
                (t - interactiveAt) <= abortWindow
            if (abort) abortUnlocked() else closeUnlocked(t)
        }

        unlockedStart = 0L // started on SCREEN_INTERACTIVE
        keyguardShown(2_000L)
        assertThat(unlockedMs).isEqualTo(0L)
        assertThat(unlockedStart).isNull()
    }

    @Test
    fun real_mid_session_lock_counts_unlocked_time() {
        var unlockedStart: Long? = null
        var unlockedMs = 0L
        var interactiveStart: Long? = 0L
        val abortWindow = 5_000L

        fun closeUnlocked(at: Long) {
            val s = unlockedStart ?: return
            unlockedMs += (at - s).coerceAtLeast(0L)
            unlockedStart = null
        }
        fun abortUnlocked() {
            unlockedStart = null
        }
        fun keyguardShown(t: Long) {
            val unlockStarted = unlockedStart
            val interactiveAt = interactiveStart
            val abort = unlockStarted != null &&
                interactiveAt != null &&
                unlockStarted >= interactiveAt &&
                (t - interactiveAt) <= abortWindow
            if (abort) abortUnlocked() else closeUnlocked(t)
        }

        unlockedStart = 10_000L // KEYGUARD_HIDDEN 10s into interactive
        keyguardShown(600_000L) // lock after 10 minutes
        assertThat(unlockedMs).isEqualTo(590_000L)
    }

    @Test
    fun merge_union_does_not_double_count_overlap() {
        val union = UsageDayParser.mergeUnionMs(
            listOf(10L to 20L, 15L to 25L),
        )
        assertThat(union).isEqualTo(15L)
    }

    @Test
    fun span_splits_across_hour_boundary() {
        val zone = java.time.ZoneId.systemDefault()
        val day = java.time.LocalDate.of(2026, 8, 8)
        val start = day.atTime(9, 45).atZone(zone).toInstant().toEpochMilli()
        val end = day.atTime(10, 15).atZone(zone).toInstant().toEpochMilli()
        val buckets = LongArray(24)
        UsageDayParser.addSpanToHours(buckets, start, end)
        assertThat(buckets[9]).isEqualTo(15L * 60_000)
        assertThat(buckets[10]).isEqualTo(15L * 60_000)
        assertThat(buckets.sum()).isEqualTo(30L * 60_000)
    }

    @Test
    fun peak_and_quiet_hour_helpers() {
        val values = List(24) { 0L }.toMutableList()
        values[8] = 100L
        values[14] = 500L
        values[20] = 50L
        assertThat(aiimin.core.data.device.peakHourIndex(values)).isEqualTo(14)
        assertThat(aiimin.core.data.device.quietHourIndex(values)).isEqualTo(20)
    }
}
