package aiimin.core.data.util

import java.text.NumberFormat
import java.time.LocalDate
import java.time.LocalTime
import java.time.format.DateTimeFormatter
import java.util.Locale
import java.util.UUID
import kotlinx.serialization.json.Json

val AppJson = Json {
    ignoreUnknownKeys = true
    encodeDefaults = true
    explicitNulls = false
}

fun newId(): String = UUID.randomUUID().toString()

/** Indian grouping (₹1,24,500). Paise in, text out; decimals only when not whole. */
object Money {
    private val whole = NumberFormat.getIntegerInstance(Locale.forLanguageTag("en-IN"))

    fun format(paise: Long, sign: Boolean = false): String {
        val neg = paise < 0
        val abs = kotlin.math.abs(paise)
        val rupees = abs / 100
        val p = abs % 100
        val body = "₹" + whole.format(rupees) + if (p != 0L) "." + p.toString().padStart(2, '0') else ""
        return when {
            neg -> "−$body"
            sign -> "+$body"
            else -> body
        }
    }

    /** ₹1.2L / ₹45.6k for tight spaces. */
    fun short(paise: Long): String {
        val r = kotlin.math.abs(paise) / 100.0
        val s = when {
            r >= 1_00_00_000 -> "%.1fCr".format(r / 1_00_00_000)
            r >= 1_00_000 -> "%.1fL".format(r / 1_00_000)
            r >= 1_000 -> "%.1fk".format(r / 1_000)
            else -> r.toLong().toString()
        }.replace(".0", "")
        return (if (paise < 0) "−₹" else "₹") + s
    }

    fun rupeesToPaise(r: Long): Long = r * 100
}

object Dates {
    private val dayLabel = DateTimeFormatter.ofPattern("EEE d MMM", Locale.ENGLISH)
    private val longLabel = DateTimeFormatter.ofPattern("EEEE, d MMMM", Locale.ENGLISH)
    private val time12 = DateTimeFormatter.ofPattern("h:mm a", Locale.ENGLISH)

    fun key(d: LocalDate): String = d.toString()
    fun parse(s: String): LocalDate = LocalDate.parse(s)
    fun short(d: LocalDate): String = dayLabel.format(d)
    fun long(d: LocalDate): String = longLabel.format(d)
    fun clock(t: LocalTime): String = time12.format(t).replace("AM", "am").replace("PM", "pm")
    fun clock(hhmm: String?): String? = hhmm?.let { runCatching { clock(LocalTime.parse(it)) }.getOrNull() }

    /** "Today", "Tomorrow", "Yesterday", weekday within a week, else "12 Oct". */
    fun relative(d: LocalDate, today: LocalDate): String {
        val diff = java.time.temporal.ChronoUnit.DAYS.between(today, d)
        return when (diff) {
            0L -> "Today"
            1L -> "Tomorrow"
            -1L -> "Yesterday"
            in 2..6 -> d.dayOfWeek.getDisplayName(java.time.format.TextStyle.FULL, Locale.ENGLISH)
            else -> DateTimeFormatter.ofPattern("d MMM", Locale.ENGLISH).format(d)
        }
    }

    fun minutes(min: Long): String {
        val h = min / 60
        val m = min % 60
        return when {
            h == 0L -> "${m}m"
            m == 0L -> "${h}h"
            else -> "${h}h ${m}m"
        }
    }
}
