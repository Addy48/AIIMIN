package aiimin.core.engine

import java.time.DayOfWeek
import java.time.Duration
import java.time.Instant
import java.time.LocalDate
import java.time.LocalTime
import java.time.ZoneId
import java.time.ZonedDateTime
import java.time.temporal.ChronoUnit

/** How a person's day is cut (plan §2.2). Midnight unless they choose otherwise. */
sealed interface DayMode {
    data object Midnight : DayMode

    /** Night owls: the day ends at [endHour] (0–5) the next morning. */
    data class FixedEnd(val endHour: Int) : DayMode

    /**
     * Repeating roster, e.g. "D,D,N,N,O,O" from [start]. A night shift belongs to
     * the date it started; the next day begins at [nightEndHour].
     */
    data class Roster(val pattern: List<Char>, val start: LocalDate, val nightEndHour: Int = 8) : DayMode
}

/**
 * The one logical day every module shares: Today, minimums, journal date, money
 * totals, focus stats and settlement. All java.time, zone passed in, no clock
 * reads — callers own "now".
 */
class LogicalDay(
    private val mode: DayMode,
    private val zone: ZoneId,
    private val rules: RulesConfig = RulesConfig.V2,
) {

    fun rosterKind(date: LocalDate): Char {
        val m = mode as? DayMode.Roster ?: return 'D'
        if (m.pattern.isEmpty()) return 'D'
        val diff = ChronoUnit.DAYS.between(m.start, date)
        val n = m.pattern.size
        return m.pattern[(((diff % n) + n) % n).toInt()].uppercaseChar()
    }

    /** When logical day [day] begins. */
    fun startOf(day: LocalDate): ZonedDateTime = when (mode) {
        DayMode.Midnight -> day.atStartOfDay(zone)
        is DayMode.FixedEnd -> day.atTime(LocalTime.of(mode.endHour.coerceIn(0, 5), 0)).atZone(zone)
        is DayMode.Roster -> if (rosterKind(day.minusDays(1)) == 'N') {
            day.atTime(LocalTime.of(mode.nightEndHour.coerceIn(0, 11), 0)).atZone(zone)
        } else {
            day.atStartOfDay(zone)
        }
    }

    fun endOf(day: LocalDate): ZonedDateTime = startOf(day.plusDays(1))

    fun dayOf(instant: Instant): LocalDate {
        val date = instant.atZone(zone).toLocalDate()
        return if (instant.isBefore(startOf(date).toInstant())) date.minusDays(1) else date
    }

    fun dayType(day: LocalDate): DayType = when (mode) {
        is DayMode.Roster -> if (rosterKind(day) == 'O') DayType.REST else DayType.WORK
        else -> if (day.dayOfWeek == DayOfWeek.SATURDAY || day.dayOfWeek == DayOfWeek.SUNDAY) DayType.REST else DayType.WORK
    }

    /** A focus session crossing the boundary is split proportionally (plan §2.3, matrix T12). */
    fun splitMinutes(start: Instant, end: Instant): Map<LocalDate, Long> {
        if (!end.isAfter(start)) return emptyMap()
        val out = LinkedHashMap<LocalDate, Long>()
        var cursor = start
        while (cursor.isBefore(end)) {
            val day = dayOf(cursor)
            val boundary = endOf(day).toInstant()
            val sliceEnd = if (boundary.isBefore(end)) boundary else end
            out[day] = (out[day] ?: 0L) + Duration.between(cursor, sliceEnd).toMinutes()
            cursor = sliceEnd
        }
        return out
    }

    /** Yesterday settles (freezes) at 12:00 noon on the following calendar day. */
    fun settlesAt(day: LocalDate): ZonedDateTime =
        day.plusDays(1).atTime(LocalTime.of(rules.day.backfillUntilHour, 0)).atZone(zone)

    sealed interface Backfill {
        /** Filed to yesterday at one evidence tier lower. */
        data class Allowed(val day: LocalDate, val remaining: Int) : Backfill
        data object Settled : Backfill
        data object LimitReached : Backfill
    }

    /** "This was for yesterday" (plan §2.4, matrix T10/T11). */
    fun backfill(now: Instant, usedForYesterday: Int): Backfill {
        val yesterday = dayOf(now).minusDays(1)
        if (!now.isBefore(settlesAt(yesterday).toInstant())) return Backfill.Settled
        val left = rules.day.backfillMax - usedForYesterday
        return if (left <= 0) Backfill.LimitReached else Backfill.Allowed(yesterday, left - 1)
    }

    companion object {
        /** Day-mode changes apply tomorrow and at most once every 14 days. */
        fun canChangeMode(lastChangedOn: LocalDate?, today: LocalDate, rules: RulesConfig = RulesConfig.V2): Boolean =
            lastChangedOn == null || !lastChangedOn.plusDays(rules.day.modeChangeCooldownDays.toLong()).isAfter(today)
    }
}
