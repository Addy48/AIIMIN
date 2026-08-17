package aiimin.core.data.device

import java.time.LocalDate
import java.time.ZoneId
import kotlin.math.roundToLong

/**
 * Almost-true 10-day phone ledger for thorough QA (Lab · export · insights).
 *
 * Pattern mirrors a college/work week on Nothing AIN065: morning walks on
 * good days, Instagram/WhatsApp/Chrome heavy evenings, Sunday recovery.
 * Not live usage — labelled SAMPLE wherever surfaced.
 */
object TenDaySample {

    data class Day(
        val daysAgo: Long,
        val steps: Long,
        val screenMs: Long,
        val unlocks: Int,
        val pickups: Int,
        val appOpens: Int,
        val walkMorning: Boolean,
        val top: List<Pair<String, Long>>,
        /** Life Score local mark for Day history charts. */
        val lifeScore: Double,
    )

    /** Oldest → newest (10 calendar days ending yesterday; today stays live). */
    fun days(today: LocalDate = LocalDate.now(ZoneId.systemDefault())): List<Day> {
        // daysAgo 10..1 — exclude today so live metrics stay honest.
        return listOf(
            Day(10, 3_200, h(7, 40), 72, 68, 410, false,
                listOf("Instagram" to h(3, 10), "WhatsApp" to h(1, 20), "Chrome" to h(0, 55)), 18.0),
            Day(9, 8_400, h(5, 10), 48, 44, 280, true,
                listOf("Chrome" to h(1, 40), "WhatsApp" to h(1, 5), "Instagram" to h(0, 50)), 42.0),
            Day(8, 11_200, h(4, 5), 41, 38, 220, true,
                listOf("Docs" to h(1, 15), "WhatsApp" to h(0, 50), "Maps" to h(0, 35)), 55.0),
            Day(7, 6_100, h(6, 25), 61, 55, 360, false,
                listOf("Instagram" to h(2, 30), "YouTube" to h(1, 20), "WhatsApp" to h(0, 45)), 28.0),
            Day(6, 9_800, h(4, 40), 46, 42, 250, true,
                listOf("Chrome" to h(1, 25), "Claude" to h(0, 55), "WhatsApp" to h(0, 40)), 48.0),
            Day(5, 12_600, h(3, 50), 38, 35, 190, true,
                listOf("Chrome" to h(1, 10), "WhatsApp" to h(0, 45), "Paytm" to h(0, 20)), 62.0),
            Day(4, 4_500, h(7, 5), 70, 65, 390, false,
                listOf("Instagram" to h(2, 50), "Reddit" to h(1, 30), "WhatsApp" to h(0, 55)), 22.0),
            Day(3, 10_400, h(4, 20), 44, 40, 240, true,
                listOf("Chrome" to h(1, 20), "Teams" to h(0, 50), "WhatsApp" to h(0, 35)), 51.0),
            Day(2, 7_200, h(5, 35), 52, 48, 300, true,
                listOf("Instagram" to h(1, 40), "Chrome" to h(1, 5), "WhatsApp" to h(0, 50)), 39.0),
            Day(1, 5_800, h(6, 0), 58, 52, 330, false,
                listOf("Instagram" to h(2, 10), "WhatsApp" to h(1, 0), "YouTube" to h(0, 45)), 31.0),
        ).map { d ->
            // Anchor dates relative to [today]
            d
        }
    }

    fun phoneSlices(today: LocalDate = LocalDate.now(ZoneId.systemDefault())): List<PhoneDaySlice> =
        days(today).map { d ->
            val date = today.minusDays(d.daysAgo)
            val hourly = syntheticHourly(d.screenMs, d.walkMorning)
            PhoneDaySlice(
                dateIso = date.toString(),
                screenMs = d.screenMs,
                unlocks = d.unlocks,
                pickups = d.pickups,
                appOpens = d.appOpens,
                topApps = d.top.map { (label, ms) ->
                    AppUse(
                        packageName = "sample.${label.lowercase()}",
                        label = label,
                        ms = ms,
                        opens = (ms / 60_000L).toInt().coerceIn(1, 40),
                    )
                },
                hourlyScreenMs = hourly,
                peakHour = peakHourIndex(hourly),
            )
        }

    fun lifeScores(): List<Double> = days().map { it.lifeScore }

    /** Inverse walk→screen signal for Lab demo (matches seed correlation story). */
    fun walkScreenPairs(): List<Pair<Float, Float>> = days().map { d ->
        val walk = if (d.walkMorning) 1f else 0f
        val screenH = d.screenMs / 3_600_000f
        walk to screenH
    }

    private fun h(hours: Long, mins: Long): Long =
        hours * 3_600_000L + mins * 60_000L

    private fun syntheticHourly(screenMs: Long, morningWalk: Boolean): List<Long> {
        val weights = FloatArray(24) { 0.02f }
        // Evening hump
        for (h in 19..23) weights[h] = 0.12f
        for (h in 12..14) weights[h] = 0.06f
        for (h in 9..11) weights[h] = if (morningWalk) 0.03f else 0.08f
        for (h in 0..6) weights[h] = 0.005f
        val sum = weights.sum()
        return weights.map { w ->
            (screenMs * (w / sum)).roundToLong()
        }
    }
}
