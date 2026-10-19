package aiimin.core.data.money

import java.time.YearMonth
import java.time.format.TextStyle
import java.util.Locale

/** Which months a past-messages import covers. Pure, so the screen and the background run agree. */
object SmsPeriods {
    /** The last [n] months, newest first (for the month picker). */
    fun recentMonths(now: YearMonth, n: Int = 12): List<YearMonth> = (0 until n).map { now.minusMonths(it.toLong()) }

    /** A whole year, oldest month first. [year] null = the last 12 months; this year stops at [now]. */
    fun yearMonths(year: Int?, now: YearMonth): List<YearMonth> = when {
        year == null -> recentMonths(now, 12).reversed()
        year > now.year -> emptyList()
        else -> (1..if (year == now.year) now.monthValue else 12).map { YearMonth.of(year, it) }
    }

    fun yearLabel(year: Int?, now: YearMonth): String = when (year) {
        null -> "the last 12 months"
        now.year -> "$year so far"
        else -> year.toString()
    }

    fun monthName(m: YearMonth, now: YearMonth): String =
        m.month.getDisplayName(TextStyle.FULL, Locale.ENGLISH) + if (m.year != now.year) " ${m.year}" else ""
}

/**
 * A whole-year import running in the background, one month at a time. Saved after every month,
 * so a phone that kills the app picks up where it stopped.
 */
data class SmsYearRun(
    val label: String,
    val remaining: List<YearMonth>,
    val total: Int,
    val added: Int = 0,
    val skipped: Int = 0,
    val stopped: Boolean = false,
) {
    val doneMonths: Int get() = total - remaining.size
    val finished: Boolean get() = remaining.isEmpty()

    fun progressLine(): String = "$doneMonths of $total months read · $added payment${if (added == 1) "" else "s"} found"

    fun doneLine(): String = "Done reading $label: " + when (added) {
        0 -> "no new payments found"
        1 -> "1 payment is waiting in Review"
        else -> "$added payments are waiting in Review"
    }

    fun encode(): String = listOf(label.replace("~", " "), remaining.joinToString(","), total, added, skipped, if (stopped) 1 else 0).joinToString("~")

    companion object {
        fun decode(s: String?): SmsYearRun? {
            val p = s?.split("~") ?: return null
            if (p.size != 6) return null
            return runCatching {
                SmsYearRun(
                    p[0], p[1].split(",").filter { it.isNotBlank() }.map(YearMonth::parse),
                    p[2].toInt(), p[3].toInt(), p[4].toInt(), p[5] == "1",
                )
            }.getOrNull()
        }
    }
}
