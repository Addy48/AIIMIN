package aiimin.core.nlp

import java.time.DayOfWeek
import java.time.LocalDate
import java.time.LocalDateTime

/** Dates, clock times and repeat words found in a normalised line, plus the line with those words removed. */
internal data class When(
    val date: LocalDate? = null,
    val time24: String? = null,
    val dayPart: String? = null,
    val recurrence: String? = null,
    /** "kal"/"parso" were used: their meaning (past or future) depends on the verb. */
    val relative: Boolean = false,
    /** A month or year without a day ("Dec 2026", "next month", "2031"): a date was given but it is not a day. */
    val partialDate: Boolean = false,
    /** The text with every matched date/time/repeat phrase blanked out. */
    val rest: String = "",
) {
    val hasDate get() = date != null || partialDate
    val any get() = date != null || time24 != null || dayPart != null || recurrence != null || partialDate
}

internal object WhenParser {
    private val I = RegexOption.IGNORE_CASE
    private const val MONTH = "jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?"
    private const val WEEKDAY = "monday|tuesday|wednesday|thursday|friday|saturday|sunday|somvar|mangalvar|budhvar|guruvar|shukravar|shanivar|ravivar"
    private const val WEEKDAY_ABBR = "mon|tue|tues|wed|thu|thur|thurs|fri|sat|sun"

    private val ISO = Regex("""\b(20\d{2})-(\d{2})-(\d{2})\b""")
    private val DMY = Regex("""\b(\d{1,2})(?:st|nd|rd|th)?\s+(?:of\s+)?($MONTH)\.?(?:\s+(20\d{2}))?\b""", I)
    private val MDY = Regex("""\b($MONTH)\.?\s+(\d{1,2})(?:st|nd|rd|th)?\b(?!\s*(?::|am\b|pm\b))""", I)
    private val MONTH_YEAR = Regex("""\b($MONTH)\.?\s+(20\d{2})\b""", I)
    private val ORDINAL_DAY = Regex("""\b(\d{1,2})(?:st|nd|rd|th|\s+tarikh)\b""", I)
    private val ACTIVITY_BEFORE_IN = Regex("""\b(?:ran|run|walked|walk|jogged|cycled|swam|slept|studied|read|meditated|worked|took|lasted|waited|spent)\b""", I)
    private val YEAR_AFTER_CUE = Regex("""\b(?:expiry|expires?|expiring|till|until|tak|by|valid|ends?|in)\s+((?:19|20)\d{2})\b|\b((?:19|20)\d{2})\s+tak\b""", I)

    private val EVERY_WEEKDAY = Regex("""\b(?:every|each|har)\s+($WEEKDAY|$WEEKDAY_ABBR)\b""", I)
    private val EVERY_WEEKDAYS = Regex("""\bevery\s+weekday\b""", I)
    private val EVERY_ALT = Regex("""\bevery\s+(?:alternate|other)\s+day\b""", I)
    private val MONTHLY = Regex("""\b(?:every|each|per)\s+month\b|\bmonthly\b|\bhar\s+mahine\b|\bmahine\s+ke\b""", I)
    private val WEEKLY = Regex("""\b(?:every|each)\s+week\b|\bweekly\b|\bhar\s+hafte\b""", I)
    private val DAILY = Regex("""\b(?:every\s*day|each\s+day|daily|rozana|roz|har\s+din|every\s+(?:morning|evening|night|afternoon)|har\s+(?:subah|shaam|raat))\b""", I)
    private val YEARLY = Regex("""\b(?:every\s+year|yearly|annually|har\s+saal)\b""", I)

    private val DAY_AFTER = Regex("""\bday after tomorrow\b""", I)
    private val PARSO = Regex("""\b(parso|narso)\b""", I)
    private val TOMORROW = Regex("""\b(tomorrow|tmrw|tmr|kal)\b""", I)
    private val TODAY = Regex("""\b(today|aaj|tonight)\b""", I)
    private val YESTERDAY = Regex("""\byesterday\b""", I)
    private val IN_N = Regex("""\bin\s+(\d+)\s*(hours?|hrs?|minutes?|mins?|days?|weeks?)\b""", I)
    private val NEXT_WEEK = Regex("""\b(?:next week|agle hafte)\b""", I)
    private val THIS_WEEK = Regex("""\b(?:this week|is hafte)\b""", I)
    private val WEEKEND = Regex("""\b(?:this weekend|weekend)\b""", I)
    private val NEXT_MONTH = Regex("""\b(?:next month|agle mahine)\b""", I)
    private val WEEKDAY_RX = Regex("""\b(?:(next|agle|agla|this|is|on|ko)\s+)?($WEEKDAY)\b""", I)
    private val WEEKDAY_ABBR_RX = Regex("""\b(?:next|on|this)\s+($WEEKDAY_ABBR)\b""", I)

    private val DAYPART = Regex("""\b(morning|subah|afternoon|dopahar|evening|shaam|night|raat|tonight)\b""", I)

    private val T_COLON = Regex("""\b([01]?\d|2[0-4]):([0-5]\d)\s*(am|pm)?\b""", I)
    private val T_AMPM = Regex("""\b(1[0-2]|0?\d)(?:\.([0-5]\d))?\s*(am|pm)\b""", I)
    private val T_AT = Regex("""\b(?:at|around|@)\s+([01]?\d|2[0-4])(?:\s+(15|30|45)|:([0-5]\d))?\b(?!\s*(?:rs|rupees|k\b|lakh|%|/|\.\d|\d))""", I)
    private val T_BAJE = Regex("""\b([01]?\d|2[0-4])\s+baje\b""", I)
    private val T_HALF = Regex("""\bhalf past\s+(\d{1,2})\b""", I)
    private val T_QUARTER_PAST = Regex("""\bquarter past\s+(\d{1,2})\b""", I)
    private val T_QUARTER_TO = Regex("""\bquarter to\s+(\d{1,2})\b""", I)
    private val NOON = Regex("""\b(?:noon|midday)\b""", I)
    private val MIDNIGHT = Regex("""\bmidnight\b""", I)

    private val MONTHS = listOf("jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec")
    private val WD = mapOf(
        "monday" to DayOfWeek.MONDAY, "somvar" to DayOfWeek.MONDAY, "mon" to DayOfWeek.MONDAY,
        "tuesday" to DayOfWeek.TUESDAY, "mangalvar" to DayOfWeek.TUESDAY, "tue" to DayOfWeek.TUESDAY, "tues" to DayOfWeek.TUESDAY,
        "wednesday" to DayOfWeek.WEDNESDAY, "budhvar" to DayOfWeek.WEDNESDAY, "wed" to DayOfWeek.WEDNESDAY,
        "thursday" to DayOfWeek.THURSDAY, "guruvar" to DayOfWeek.THURSDAY, "thu" to DayOfWeek.THURSDAY, "thur" to DayOfWeek.THURSDAY, "thurs" to DayOfWeek.THURSDAY,
        "friday" to DayOfWeek.FRIDAY, "shukravar" to DayOfWeek.FRIDAY, "fri" to DayOfWeek.FRIDAY,
        "saturday" to DayOfWeek.SATURDAY, "shanivar" to DayOfWeek.SATURDAY, "sat" to DayOfWeek.SATURDAY,
        "sunday" to DayOfWeek.SUNDAY, "ravivar" to DayOfWeek.SUNDAY, "sun" to DayOfWeek.SUNDAY,
    )

    /** [past]: the line talks about something already done, so "kal"/"parso" mean yesterday / the day before. */
    fun parse(norm: String, now: LocalDateTime, past: Boolean = false): When {
        val today = now.toLocalDate()
        var t = " $norm "
        var date: LocalDate? = null
        var time: String? = null
        var rec: String? = null
        var relative = false
        var partial = false

        fun blank(m: MatchResult) {
            var from = m.range.first
            // a preposition glued to the phrase goes with it ("at 8pm", "on 3 Nov", "by Friday")
            Regex("""\b(?:at|on|by|around|before|after|from|till|until)\s+$""", I).find(t.substring(0, from))?.let { from = it.range.first }
            t = t.replaceRange(from, m.range.last + 1, " ".repeat(m.range.last + 1 - from))
        }

        // --- repeats first: "every Monday" must not also become a one-off date
        EVERY_WEEKDAY.find(t)?.let { m ->
            rec = "weekly"; WD[m.groupValues[1].lowercase()]?.let { date = nextWeekday(today, it, strictNext = false) }; blank(m)
        }
        EVERY_WEEKDAYS.find(t)?.let { rec = "weekdays"; blank(it) }
        EVERY_ALT.find(t)?.let { rec = "alternate"; blank(it) }
        if (rec == null) {
            MONTHLY.find(t)?.let { rec = "monthly"; blank(it) }
                ?: YEARLY.find(t)?.let { rec = "yearly"; blank(it) }
                ?: WEEKLY.find(t)?.let { rec = "weekly"; blank(it) }
                ?: DAILY.find(t)?.let { rec = "daily"; blank(it) }
        }

        // --- calendar dates
        ISO.find(t)?.let { m -> date = runCatching { LocalDate.of(m.groupValues[1].toInt(), m.groupValues[2].toInt(), m.groupValues[3].toInt()) }.getOrNull(); blank(m) }
        if (date == null) DMY.find(t)?.let { m ->
            val d = m.groupValues[1].toInt()
            val mo = monthOf(m.groupValues[2])
            val yr = m.groupValues[3].toIntOrNull()
            date = buildDate(today, d, mo, yr); if (date != null) blank(m)
        }
        if (date == null) MDY.find(t)?.let { m ->
            val mo = monthOf(m.groupValues[1])
            val d = m.groupValues[2].toInt()
            date = buildDate(today, d, mo, null); if (date != null) blank(m)
        }
        if (date == null && !partial) MONTH_YEAR.find(t)?.let { m -> partial = true; blank(m) }
        YEAR_AFTER_CUE.find(t)?.let { m ->
            partial = true
            // blank only the year digits so the cue word ("expires") stays for classification
            val g = m.groups[1] ?: m.groups[2]!!
            t = t.replaceRange(g.range, " ".repeat(g.value.length))
        }
        if (date == null) ORDINAL_DAY.find(t)?.let { m ->
            val d = m.groupValues[1].toInt()
            if (d in 1..31) {
                var cand = runCatching { today.withDayOfMonth(d) }.getOrNull()
                if (cand == null || cand.isBefore(today)) cand = runCatching { today.plusMonths(1).withDayOfMonth(d) }.getOrNull()
                if (cand != null) { date = cand; blank(m) }
            }
        }

        // --- relative days
        if (date == null) DAY_AFTER.find(t)?.let { date = today.plusDays(2); blank(it) }
        if (date == null) PARSO.find(t)?.let { m ->
            val n = if (m.value.lowercase() == "narso") 3 else 2
            date = if (past) today.minusDays(n.toLong()) else today.plusDays(n.toLong()); relative = true; blank(m)
        }
        if (date == null) YESTERDAY.find(t)?.let { date = today.minusDays(1); blank(it) }
        if (date == null) TOMORROW.find(t)?.let { m ->
            date = if (m.value.lowercase() == "kal" && past) today.minusDays(1) else today.plusDays(1)
            relative = m.value.lowercase() == "kal"; blank(m)
        }
        var dayPartWord: String? = null
        TODAY.find(t)?.let { m ->
            if (date == null) date = today
            if (m.value.lowercase() == "tonight") dayPartWord = "night"
            blank(m)
        }
        IN_N.find(t)?.takeIf { !ACTIVITY_BEFORE_IN.containsMatchIn(t) }?.let { m ->
            val n = m.groupValues[1].toLong()
            val u = m.groupValues[2].lowercase()
            when {
                u.startsWith("h") -> { val x = now.plusHours(n); date = x.toLocalDate(); time = "%02d:%02d".format(x.hour, x.minute) }
                u.startsWith("m") -> { val x = now.plusMinutes(n); date = x.toLocalDate(); time = "%02d:%02d".format(x.hour, x.minute) }
                u.startsWith("d") -> date = today.plusDays(n)
                else -> date = today.plusWeeks(n)
            }
            blank(m)
        }
        if (date == null) NEXT_WEEK.find(t)?.let { date = nextWeekday(today, DayOfWeek.MONDAY, strictNext = true); blank(it) }
        if (date == null) THIS_WEEK.find(t)?.let { date = today; blank(it) }
        if (date == null) WEEKEND.find(t)?.let { date = nextWeekday(today, DayOfWeek.SATURDAY, strictNext = false); blank(it) }
        NEXT_MONTH.find(t)?.let { partial = true; blank(it) }
        if (date == null) WEEKDAY_RX.find(t)?.let { m ->
            val d = WD[m.groupValues[2].lowercase()]
            if (d != null) { date = nextWeekday(today, d, strictNext = false); blank(m) }
        }
        if (date == null) WEEKDAY_ABBR_RX.find(t)?.let { m ->
            WD[m.groupValues[1].lowercase()]?.let { date = nextWeekday(today, it, strictNext = false); blank(m) }
        }

        // --- day part (kept as a hint; not a clock time)
        val dp = DAYPART.find(t)
        val part = dayPartWord ?: dp?.value?.lowercase()?.let {
            when (it) { "morning", "subah" -> "morning"; "afternoon", "dopahar" -> "afternoon"; "evening", "shaam" -> "evening"; else -> "night" }
        }

        // --- clock time
        fun finish(h0: Int, m0: Int, explicit: String?): String? {
            var h = h0
            if (explicit != null) {
                h = h % 12 + if (explicit.lowercase() == "pm") 12 else 0
            } else if (h in 1..12) {
                h = when {
                    part == "evening" || part == "afternoon" -> if (h < 12) h + 12 else h
                    part == "night" -> if (h in 5..11) h + 12 else if (h == 12) 0 else h
                    part == "morning" -> if (h == 12) 0 else h
                    Regex("""\b(?:flight|train|airport|bus)\b""", I).containsMatchIn(t) -> if (h == 12) 12 else h
                    h == 12 -> 12
                    h in 1..7 -> h + 12
                    else -> h
                }
            }
            if (h !in 0..23) return null
            return "%02d:%02d".format(h, m0)
        }
        if (time == null) {
            T_COLON.find(t)?.let { m -> finish(m.groupValues[1].toInt(), m.groupValues[2].toInt(), m.groupValues[3].ifEmpty { null })?.let { time = it; blank(m) } }
        }
        if (time == null) T_AMPM.find(t)?.let { m ->
            finish(m.groupValues[1].toInt(), m.groupValues[2].ifEmpty { "0" }.toInt(), m.groupValues[3])?.let { time = it; blank(m) }
        }
        if (time == null) T_HALF.find(t)?.let { m -> finish(m.groupValues[1].toInt(), 30, null)?.let { time = it; blank(m) } }
        if (time == null) T_QUARTER_PAST.find(t)?.let { m -> finish(m.groupValues[1].toInt(), 15, null)?.let { time = it; blank(m) } }
        if (time == null) T_QUARTER_TO.find(t)?.let { m ->
            val h = (m.groupValues[1].toInt() + 11) % 12 + (if (m.groupValues[1].toInt() > 12) 12 else 0)
            finish(h, 45, null)?.let { time = it; blank(m) }
        }
        if (time == null) T_BAJE.find(t)?.let { m -> finish(m.groupValues[1].toInt(), 0, null)?.let { time = it; blank(m) } }
        if (time == null) T_AT.find(t)?.let { m ->
            val h = m.groupValues[1].toInt()
            val mm = (m.groupValues[2].ifEmpty { m.groupValues[3] }).ifEmpty { "0" }.toInt()
            finish(h, mm, null)?.let { time = it; blank(m) }
        }
        if (time == null) NOON.find(t)?.let { time = "12:00"; blank(it) }
        if (time == null) MIDNIGHT.find(t)?.let { time = "00:00"; blank(it) }
        dp?.let { blank(it) }

        return When(date, time, part, rec, relative, partial, t.replace(Regex("""\s+"""), " ").trim())
    }

    private fun monthOf(s: String): Int = MONTHS.indexOf(s.lowercase().take(3)) + 1

    /** "3 Nov", "15 Feb": this year, or next year when it has already passed. An explicit year is kept. */
    private fun buildDate(today: LocalDate, d: Int, mo: Int, yr: Int?): LocalDate? {
        if (mo !in 1..12 || d !in 1..31) return null
        if (yr != null) return runCatching { LocalDate.of(yr, mo, d) }.getOrNull()
        val thisYear = runCatching { LocalDate.of(today.year, mo, d) }.getOrNull() ?: return null
        return if (thisYear.isBefore(today)) runCatching { LocalDate.of(today.year + 1, mo, d) }.getOrNull() else thisYear
    }

    /** Next [wd] after [today] (never today itself). */
    private fun nextWeekday(today: LocalDate, wd: DayOfWeek, @Suppress("UNUSED_PARAMETER") strictNext: Boolean): LocalDate {
        var n = (wd.value - today.dayOfWeek.value + 7) % 7
        if (n == 0) n = 7
        return today.plusDays(n.toLong())
    }
}
