package aiimin.core.engine.today

import aiimin.core.engine.raahi.RaahiMode
import java.time.LocalTime
import java.time.format.DateTimeFormatter
import java.util.Locale

/**
 * What the home-screen widget shows (PRD 1.4). Built from the same "What now?" line as Today, so phone and widget
 * agree. Titles stay hidden until the person turns them on; money amounts, bill names, document names and anything
 * from the vault never reach the widget, whatever the setting.
 */
data class WidgetView(
    /** The "What now?" line, or its title-free form. */
    val line: String,
    /** "3 of 5 minimums", or empty when no minimum is planned today. */
    val minimums: String,
    /** One entry per planned minimum: kept or not, in order. */
    val segments: List<Boolean>,
    /** Where now sits on the waking day, 0 at wake to 1 at day end; clamped. */
    val sun: Float,
    /** Before wake or after day end: the moon instead of the sun. */
    val night: Boolean,
    /** Raahi on the widget: null in Off. [WidgetRaahi.EVENING] is pose 14, the sunset scene. */
    val raahi: WidgetRaahi?,
)

enum class WidgetRaahi { DAY, EVENING }

object WidgetSnapshot {
    fun of(
        line: NowLine, minimumsDone: Int, minimumsTotal: Int, kept: List<Boolean>, showTitles: Boolean,
        raahi: RaahiMode, now: LocalTime, wake: LocalTime, dayEnd: LocalTime, clock24: Boolean,
    ): WidgetView {
        val span = minutesBetween(wake, dayEnd).coerceAtLeast(1)
        val into = minutesBetween(wake, now)
        val night = into >= span
        return WidgetView(
            line = text(line, showTitles, clock24),
            minimums = if (minimumsTotal <= 0) "" else "$minimumsDone of $minimumsTotal ${if (minimumsTotal == 1) "minimum" else "minimums"}",
            segments = kept,
            sun = if (night) 1f else into.toFloat() / span,
            night = night,
            raahi = when {
                raahi == RaahiMode.OFF -> null
                night || WhatNow.afterDayEnd(now, dayEnd) -> WidgetRaahi.EVENING
                else -> WidgetRaahi.DAY
            },
        )
    }

    /** Minutes from [a] forward to [b], wrapping past midnight. */
    private fun minutesBetween(a: LocalTime, b: LocalTime): Int = ((b.toSecondOfDay() - a.toSecondOfDay()) / 60 + 24 * 60) % (24 * 60)

    private fun clock(t: LocalTime, h24: Boolean) = DateTimeFormatter.ofPattern(if (h24) "H:mm" else "h:mm a", Locale.ENGLISH).format(t)

    /** The widget's line. A bill is never named or priced here (1.4); other kinds hide their title unless allowed. */
    fun text(l: NowLine, showTitles: Boolean, clock24: Boolean): String = when (l.kind) {
        NowKind.BILL -> if (l.count > 1) "${l.count} bills due today" else "A bill is due today"
        NowKind.WRAP_UP, NowKind.LANDMARK, NowKind.CLEAR -> WhatNowText.line(l, clock24)
        else -> if (showTitles) WhatNowText.line(l, clock24) else when (l.kind) {
            NowKind.FOCUS -> "Focus · ${l.minutesLeft} min left"
            NowKind.SOON -> {
                val what = if (l.isEvent) "event" else "task"
                if (l.happeningNow) "1 $what now" else "1 $what at ${clock(l.at!!, clock24)}"
            }
            NowKind.MINIMUM -> "${l.count} ${if (l.count == 1) "minimum" else "minimums"} left"
            else -> "1 task up next"
        }
    }
}
