package aiimin.core.data.money

import aiimin.core.data.util.Money

/**
 * The numbers behind the month chart (plan Phase 20): money spent so far as a climbing line,
 * the even pace to the plan, where the month is likely to land, and the one day worth labelling.
 * Pure, so the chart and the old "Likely to land" card can never disagree.
 */
object MoneyChartMath {

    /** "₹400 – ₹600", or just "₹400" when both ends round to the same amount. */
    fun rangeLabel(lowPaise: Long, highPaise: Long, sep: String = " – "): String =
        if (Money.whole(lowPaise) == Money.whole(highPaise)) Money.whole(lowPaise)
        else Money.whole(lowPaise) + sep + Money.whole(highPaise)

    /** Running total per day. */
    fun cumulative(days: List<Long>): List<Long> {
        var sum = 0L
        return days.map { sum += it; sum }
    }

    /** Where spending would be at the end of each day if it ran exactly to plan. */
    fun pace(planPaise: Long, days: Int): List<Long> = (1..days).map { planPaise * it / days }

    /** Low and high month-end totals: the typical day (or the running average) at 0.8× and 1.2×. */
    fun projection(spentPaise: Long, typicalDayPaise: Long, elapsedDays: Int, daysLeft: Int): Pair<Long, Long> {
        val rate = typicalDayPaise.takeIf { it > 0 } ?: (spentPaise / elapsedDays.coerceAtLeast(1))
        val left = daysLeft.coerceAtLeast(0)
        return (spentPaise + (rate * 0.8 * left).toLong()) to (spentPaise + (rate * 1.2 * left).toLong())
    }

    /** Index of the biggest day when it is at least [ratio]× the median spending day; otherwise none. */
    fun spike(days: List<Long>, ratio: Double = 2.5): Int? {
        val spent = days.filter { it > 0 }.sorted()
        if (spent.size < 3) return null
        val median = spent[spent.size / 2]
        val i = days.indices.maxByOrNull { days[it] } ?: return null
        return i.takeIf { days[i] >= median * ratio }
    }

    /** True for each day the running total was above the even pace. */
    fun overPace(cumulative: List<Long>, pace: List<Long>): List<Boolean> =
        cumulative.mapIndexed { i, v -> v > (pace.getOrNull(i) ?: Long.MAX_VALUE) }
}
