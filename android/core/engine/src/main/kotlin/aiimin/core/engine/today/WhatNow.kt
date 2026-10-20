package aiimin.core.engine.today

import java.time.DayOfWeek
import java.time.LocalDate
import java.time.LocalTime
import java.time.format.DateTimeFormatter
import java.time.temporal.ChronoUnit
import java.util.Locale

/**
 * Today's single job (PRD Part 3 §1.2, Decision 2): one "What now?" line from a fixed, explainable order.
 * First match wins; no AI, no network. Wording is fixed and free of guilt words (PRD 13.2).
 */
enum class NowKind { FOCUS, SOON, BILL, WRAP_UP, LANDMARK, MINIMUM, TASK, CLEAR }

data class FocusNow(val label: String, val minutesLeft: Int)

/** A timed event or task today. Tasks count as happening for their first 30 minutes. */
data class Timed(val id: String, val title: String, val start: LocalTime, val end: LocalTime?, val isEvent: Boolean)

data class BillDue(val id: String, val title: String, val amountPaise: Long)

data class OpenTask(val id: String, val title: String, val priority: Int, val time: LocalTime?, val createdAt: Long)

data class NowInput(
    val date: LocalDate,
    val time: LocalTime,
    val focus: FocusNow?,
    val timed: List<Timed>,
    val bills: List<BillDue>,
    /** The user's day-end hour: drives "Wrap up" and the Evening section only. */
    val dayEnd: LocalTime,
    val wrappedUp: Boolean,
    /** Monday or the 1st, and the plan line has not been shown on an earlier open today. */
    val landmarkDue: Boolean,
    val minimumsLeft: List<String>,
    val tasks: List<OpenTask>,
    /** Kinds the person tapped "Not now" on today. */
    val hidden: Set<NowKind>,
    /** How often each kind was skipped; three skips drop it one step. */
    val skips: Map<NowKind, Int>,
    val raahiOn: Boolean,
)

data class NowLine(
    val kind: NowKind,
    val targetId: String? = null,
    val title: String = "",
    val at: LocalTime? = null,
    val happeningNow: Boolean = false,
    val amountPaise: Long = 0,
    val count: Int = 0,
    val minutesLeft: Int = 0,
    val month: Boolean = false,
    val dayEnd: LocalTime? = null,
    val raahiOn: Boolean = true,
)

object WhatNow {
    val BASE = listOf(NowKind.FOCUS, NowKind.SOON, NowKind.BILL, NowKind.WRAP_UP, NowKind.LANDMARK, NowKind.MINIMUM, NowKind.TASK, NowKind.CLEAR)
    const val SOON_MINUTES = 90L
    const val SKIPS_TO_DROP = 3

    /** The order after learning: a kind skipped three times drops one step (never below "All clear"). */
    fun order(skips: Map<NowKind, Int>): List<NowKind> {
        val o = BASE.toMutableList()
        for (k in BASE) {
            if (k == NowKind.CLEAR || (skips[k] ?: 0) < SKIPS_TO_DROP) continue
            val i = o.indexOf(k)
            if (i + 1 < o.lastIndex) { o[i] = o[i + 1]; o[i + 1] = k }
        }
        return o
    }

    /** The evening starts at 17:00, or four hours before an early day end. */
    fun eveningStart(dayEnd: LocalTime): LocalTime = minOf(LocalTime.of(17, 0), dayEnd.minusHours(4))

    fun pick(i: NowInput): NowLine {
        for (k in order(i.skips)) {
            if (k in i.hidden && k != NowKind.CLEAR) continue
            match(k, i)?.let { return it }
        }
        return NowLine(NowKind.CLEAR, raahiOn = i.raahiOn)
    }

    private fun match(k: NowKind, i: NowInput): NowLine? = when (k) {
        NowKind.FOCUS -> i.focus?.let { NowLine(k, title = it.label, minutesLeft = it.minutesLeft) }
        NowKind.SOON -> soon(i)
        NowKind.BILL -> i.bills.firstOrNull()?.let { NowLine(k, it.id, it.title, amountPaise = it.amountPaise, count = i.bills.size) }
        NowKind.WRAP_UP -> if (!i.wrappedUp && afterDayEnd(i.time, i.dayEnd)) NowLine(k, dayEnd = i.dayEnd) else null
        NowKind.LANDMARK -> if (i.landmarkDue && (i.date.dayOfMonth == 1 || i.date.dayOfWeek == DayOfWeek.MONDAY)) NowLine(k, month = i.date.dayOfMonth == 1) else null
        NowKind.MINIMUM -> if (i.minimumsLeft.isNotEmpty() && !i.time.isBefore(eveningStart(i.dayEnd))) NowLine(k, title = i.minimumsLeft.first(), count = i.minimumsLeft.size) else null
        NowKind.TASK -> i.tasks.sortedWith(compareByDescending<OpenTask> { it.priority }.thenBy(nullsLast()) { it.time }.thenBy { it.createdAt })
            .firstOrNull()?.let { NowLine(k, it.id, it.title, at = it.time) }
        NowKind.CLEAR -> NowLine(k, raahiOn = i.raahiOn)
    }

    private fun soon(i: NowInput): NowLine? {
        fun happening(t: Timed) = !i.time.isBefore(t.start) && i.time.isBefore(t.end ?: t.start.plusMinutes(30))
        fun upcoming(t: Timed) = !t.start.isBefore(i.time) && ChronoUnit.MINUTES.between(i.time, t.start) <= SOON_MINUTES
        val pick = i.timed.filter { happening(it) || upcoming(it) }
            .sortedWith(compareByDescending<Timed> { happening(it) }.thenBy { it.start }.thenByDescending { it.isEvent }.thenBy { it.title })
            .firstOrNull() ?: return null
        return NowLine(NowKind.SOON, pick.id, pick.title, at = pick.start, happeningNow = happening(pick))
    }

    /** After the day-end hour, until 4 AM (a late day end runs past midnight). */
    fun afterDayEnd(time: LocalTime, dayEnd: LocalTime): Boolean =
        if (dayEnd.hour >= 4) !time.isBefore(dayEnd) || time.isBefore(LocalTime.of(4, 0)) else !time.isBefore(dayEnd) && time.isBefore(LocalTime.of(4, 0))
}

/** The fixed wording (PRD 13.3 voice): one short line, and the reason shown when it is tapped. */
object WhatNowText {
    private fun clock(t: LocalTime, h24: Boolean) = DateTimeFormatter.ofPattern(if (h24) "H:mm" else "h:mm a", Locale.ENGLISH).format(t)

    fun line(l: NowLine, clock24: Boolean): String = when (l.kind) {
        NowKind.FOCUS -> listOf("Focus", l.title.ifBlank { null }, "${l.minutesLeft} min left").filterNotNull().joinToString(" · ")
        NowKind.SOON -> if (l.happeningNow) "${l.title} · now" else "${l.title} at ${clock(l.at!!, clock24)}"
        NowKind.BILL -> "${l.title}: ${rupees(l.amountPaise)} due today"
        NowKind.WRAP_UP -> "Wrap up your day · 2 min"
        NowKind.LANDMARK -> if (l.month) "Plan your month" else "Plan your week"
        NowKind.MINIMUM -> "${l.title} · ${l.count} ${if (l.count == 1) "minimum" else "minimums"} left"
        NowKind.TASK -> l.title
        NowKind.CLEAR -> if (l.raahiOn) "All clear. Raahi is resting." else "All clear. The rest is yours."
    }

    fun why(l: NowLine, clock24: Boolean): String = when (l.kind) {
        NowKind.FOCUS -> "A focus session is running."
        NowKind.SOON -> if (l.happeningNow) "It is happening now." else "It starts within 90 minutes."
        NowKind.BILL -> if (l.count > 1) "${l.count} bills are due today." else "A bill is due today."
        NowKind.WRAP_UP -> "It is past your day-end hour, ${clock(l.dayEnd!!, clock24)}."
        NowKind.LANDMARK -> if (l.month) "A fresh start: the first of the month." else "A fresh start: Monday."
        NowKind.MINIMUM -> "Your evening has started and a minimum is still open."
        NowKind.TASK -> "Your top open task: highest priority, then earliest."
        NowKind.CLEAR -> "Nothing else is planned for today."
    }

    /** "₹1,845" or "₹1,845.50", Indian grouping. */
    fun rupees(paise: Long): String {
        val whole = paise / 100
        val frac = (paise % 100).toInt()
        val s = whole.toString()
        val grouped = if (s.length <= 3) s else {
            val head = s.dropLast(3)
            head.reversed().chunked(2).joinToString(",").reversed() + "," + s.takeLast(3)
        }
        return "₹" + grouped + if (frac != 0) ".%02d".format(Locale.ROOT, frac) else ""
    }
}
