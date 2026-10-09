package aiimin.core.sensing

import aiimin.core.sensing.logic.SleepMath
import aiimin.core.sensing.logic.StepCounterMath
import aiimin.core.sensing.logic.UsageTimeline
import aiimin.core.sensing.logic.UsageTimeline.Event
import aiimin.core.sensing.logic.UsageTimeline.Kind
import com.google.common.truth.Truth.assertThat
import org.junit.Test

/** The accuracy rules, one test per v3 failure mode. Times are minutes from window start. */
class UsageTimelineTest {

    private val min = 60_000L
    private val day = 24 * 60 * min
    private fun t(m: Long) = m * min
    private val chrome = setOf("launcher", "systemui")

    private fun run(events: List<Event>, work: Set<String> = emptySet(), lateFrom: Long = Long.MAX_VALUE) = UsageTimeline.compute(
        events = events,
        windowStart = 0,
        windowEnd = day,
        counted = { it !in chrome },
        isHome = { it == "launcher" },
        isWork = { it in work },
        lateFrom = lateFrom,
        hourOf = { ((it.coerceAtLeast(0) / 3_600_000L) % 24).toInt() },
        hourStart = { it - Math.floorMod(it, 3_600_000L) },
    )

    @Test
    fun `plain session counts once`() {
        val r = run(listOf(Event(t(60), Kind.RESUMED, "yt", "Main"), Event(t(90), Kind.PAUSED, "yt", "Main")))
        assertThat(r.totalMs).isEqualTo(t(30))
        assertThat(r.apps.single().opens).isEqualTo(1)
    }

    @Test
    fun `screen off closes the session even when the pause event never arrives`() {
        val r = run(listOf(Event(t(60), Kind.RESUMED, "yt", "Main"), Event(t(75), Kind.SCREEN_OFF)))
        assertThat(r.totalMs).isEqualTo(t(15))
    }

    @Test
    fun `an app left resumed overnight does not count the night`() {
        val r = run(listOf(Event(t(22 * 60), Kind.RESUMED, "reader", "A"), Event(t(22 * 60 + 5), Kind.KEYGUARD_SHOWN)))
        assertThat(r.totalMs).isEqualTo(t(5))
    }

    @Test
    fun `session started before midnight counts only its after-midnight minutes`() {
        val r = run(listOf(Event(-t(10), Kind.RESUMED, "chat", "A"), Event(t(20), Kind.PAUSED, "chat", "A")))
        assertThat(r.totalMs).isEqualTo(t(20))
        assertThat(r.apps.single().opens).isEqualTo(0) // opened yesterday
    }

    @Test
    fun `two activities of one app do not cancel each other`() {
        val r = run(
            listOf(
                Event(t(0), Kind.RESUMED, "mail", "Inbox"),
                Event(t(5), Kind.RESUMED, "mail", "Compose"),
                Event(t(6), Kind.PAUSED, "mail", "Inbox"),
                Event(t(15), Kind.PAUSED, "mail", "Compose"),
            ),
        )
        assertThat(r.totalMs).isEqualTo(t(15))
        assertThat(r.apps.single().opens).isEqualTo(1)
    }

    @Test
    fun `a new app in front closes the previous one when its pause was dropped`() {
        val r = run(
            listOf(
                Event(t(0), Kind.RESUMED, "a", "X"),
                Event(t(10), Kind.RESUMED, "b", "Y"),
                Event(t(20), Kind.PAUSED, "b", "Y"),
            ),
        )
        assertThat(r.apps.first { it.pkg == "a" }.ms).isEqualTo(t(10))
        assertThat(r.totalMs).isEqualTo(t(20))
    }

    @Test
    fun `home ends the session but a System UI flicker does not`() {
        val r = run(
            listOf(
                Event(t(0), Kind.RESUMED, "a", "X"),
                Event(t(5), Kind.RESUMED, "systemui", "Shade"),
                Event(t(10), Kind.RESUMED, "launcher", "Home"),
                Event(t(40), Kind.SCREEN_OFF),
            ),
        )
        assertThat(r.totalMs).isEqualTo(t(10))
    }

    @Test
    fun `unlocks are debounced, notifications counted, work split out, late time measured`() {
        val r = run(
            listOf(
                Event(t(100), Kind.KEYGUARD_HIDDEN),
                Event(t(100) + 300, Kind.KEYGUARD_HIDDEN),
                Event(t(200), Kind.KEYGUARD_HIDDEN),
                Event(t(201), Kind.NOTIFICATION, "chat"),
                Event(t(300), Kind.RESUMED, "slack", "A"),
                Event(t(330), Kind.PAUSED, "slack", "A"),
                Event(t(23 * 60), Kind.RESUMED, "chat", "A"),
                Event(t(23 * 60 + 20), Kind.PAUSED, "chat", "A"),
            ),
            work = setOf("slack"),
            lateFrom = t(23 * 60),
        )
        assertThat(r.unlocks).isEqualTo(2)
        assertThat(r.notifications).isEqualTo(1)
        assertThat(r.workMs).isEqualTo(t(30))
        assertThat(r.personalMs).isEqualTo(t(20))
        assertThat(r.lateMs).isEqualTo(t(20))
        assertThat(r.hourlyMs[23]).isEqualTo(t(20))
        assertThat(r.firstUnlockAt).isEqualTo(t(100))
    }

    @Test
    fun `step counter carries across a reboot`() {
        val (s1, a) = StepCounterMath.update(null, "2026-10-09", bootAt = 0, counter = 10_000)
        val (s2, b) = StepCounterMath.update(s1, "2026-10-09", bootAt = 0, counter = 12_500)
        val (s3, c) = StepCounterMath.update(s2, "2026-10-09", bootAt = 9_000_000, counter = 300)
        assertThat(a).isEqualTo(0)
        assertThat(b).isEqualTo(2_500)
        assertThat(c).isEqualTo(2_500)
        assertThat(StepCounterMath.update(s3, "2026-10-09", 9_000_000, 1_300).second).isEqualTo(3_500)
    }

    @Test
    fun `the night belongs to the day you woke up, and regular sleep scores high`() {
        val dayStart = 10 * day
        val night = SleepMath.nightFor(
            listOf(SleepMath.Session(dayStart - t(90), dayStart + t(390)), SleepMath.Session(dayStart + t(800), dayStart + t(830))),
            dayStart,
        )!!
        assertThat(night.minutes).isEqualTo(480 + 30)
        assertThat(SleepMath.regularity(listOf(900, 905, 895, 910))).isAtLeast(90)
        assertThat(SleepMath.regularity(listOf(780, 960, 870, 1020))!!).isLessThan(30)
        assertThat(SleepMath.regularity(listOf(900, 905))).isNull()
    }
}
