package aiimin.core.data.knock

import aiimin.core.model.SubscriptionTier
import com.google.common.truth.Truth.assertThat
import org.junit.Test

class KnockEvaluatorTest {

    private fun base(
        minute: Int = 21 * 60,
        fired: Set<String> = emptySet(),
        master: Boolean = true,
        quietStart: Int = 22 * 60 + 30,
        quietEnd: Int = 7 * 60,
    ) = KnockSnapshot(
        nowMs = 1_724_000_000_000L,
        minuteOfDay = minute,
        dayOfWeek = 4,
        osId = "AADI0837",
        masterOn = master,
        quietStartMin = quietStart,
        quietEndMin = quietEnd,
        channelOn = KnockChannel.entries.associateWith { it.defaultOn },
        firedToday = fired,
        openedThisEvening = false,
        openMinimums = 2,
        settleCount = 1,
        tickCount = 1,
        streakAtRisk = null,
        steps = 4_000L,
        stepsTarget = 10_000L,
        screenMs = 2L * 3_600_000,
        screenTargetMs = 4L * 3_600_000,
        speakingToday = 1,
        tier = SubscriptionTier.CORE,
        pendingOutbox = 0,
        pendingForMs = 0L,
        lastError = null,
        agendaTitle = null,
        agendaInMs = null,
        agingPinnedTitle = null,
        lifeScore = 54,
    )

    @Test
    fun quiet_hours_block_evening_but_sync_still_fires() {
        val s = base(
            minute = 23 * 60,
            master = true,
        ).copy(lastError = "held", pendingOutbox = 6, pendingForMs = 40L * 60_000L)
        val out = KnockEvaluator.evaluate(s)
        assertThat(out.map { it.case }).containsExactly(KnockCase.SYNC)
    }

    @Test
    fun master_off_fires_nothing() {
        assertThat(KnockEvaluator.evaluate(base(master = false))).isEmpty()
    }

    @Test
    fun evening_unfinished_minimums() {
        val out = KnockEvaluator.evaluate(base(minute = 21 * 60))
        assertThat(out.map { it.case }).contains(KnockCase.EVENING_MINIMA)
        assertThat(out.map { it.deepLink }).contains("day")
    }

    @Test
    fun evening_prefers_empty_day_over_minimums() {
        val out = KnockEvaluator.evaluate(
            base(minute = 21 * 60).copy(settleCount = 0, tickCount = 0, openMinimums = 3),
        )
        assertThat(out.map { it.case }).contains(KnockCase.EMPTY_DAY)
        assertThat(out.map { it.case }).doesNotContain(KnockCase.EVENING_MINIMA)
    }

    @Test
    fun cap_skips_already_fired() {
        val out = KnockEvaluator.evaluate(
            base(minute = 21 * 60, fired = setOf("evening_minima")),
        )
        assertThat(out.map { it.case }).doesNotContain(KnockCase.EVENING_MINIMA)
    }

    @Test
    fun screen_over_not_twenty_minute_spam_and_not_near() {
        val out = KnockEvaluator.evaluate(
            base(minute = 16 * 60).copy(
                screenMs = 5L * 3_600_000,
                screenTargetMs = 4L * 3_600_000,
                openMinimums = 0,
            ),
        )
        assertThat(out.map { it.case }).contains(KnockCase.SCREEN_OVER)
        assertThat(out.map { it.case }).doesNotContain(KnockCase.SCREEN_NEAR)
    }

    @Test
    fun steps_half() {
        val out = KnockEvaluator.evaluate(
            base(minute = 14 * 60).copy(steps = 6_000L, stepsTarget = 10_000L, openMinimums = 0),
        )
        assertThat(out.map { it.case }).contains(KnockCase.STEPS_HALF)
    }

    @Test
    fun english_core_only_in_window() {
        val explore = KnockEvaluator.evaluate(
            base(minute = 18 * 60 + 30).copy(
                tier = SubscriptionTier.EXPLORE,
                speakingToday = 0,
                isCorePlus = false,
                openMinimums = 0,
            ),
        )
        assertThat(explore.map { it.case }).doesNotContain(KnockCase.ENGLISH)
        val core = KnockEvaluator.evaluate(
            base(minute = 18 * 60 + 30).copy(speakingToday = 0, openMinimums = 0),
        )
        assertThat(core.map { it.case }).contains(KnockCase.ENGLISH)
    }

    @Test
    fun quiet_wraps_midnight() {
        assertThat(KnockEvaluator.inQuietHours(23 * 60, 22 * 60 + 30, 7 * 60)).isTrue()
        assertThat(KnockEvaluator.inQuietHours(6 * 60, 22 * 60 + 30, 7 * 60)).isTrue()
        assertThat(KnockEvaluator.inQuietHours(12 * 60, 22 * 60 + 30, 7 * 60)).isFalse()
    }
}
