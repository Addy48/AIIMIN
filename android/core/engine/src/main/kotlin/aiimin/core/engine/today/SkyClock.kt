package aiimin.core.engine.today

import java.time.LocalDate
import java.time.LocalTime
import java.time.ZoneId
import kotlin.math.PI
import kotlin.math.acos
import kotlin.math.cos
import kotlin.math.sin
import kotlin.math.tan

/**
 * The living sky (PRD 1.3, task B18). Pure maths: where the sun is today for the phone's time zone (no location,
 * no network), and which two sky keyframes the current minute sits between. Colours live in the design system.
 */
enum class SkyPhase { NIGHT, PRE_DAWN, DAWN, MORNING, MIDDAY, GOLDEN, DUSK }

/** Sunrise, sunset and the civil twilights for one day, in local time; null fields mean polar day or night. */
data class SunTimes(val civilDawn: LocalTime, val sunrise: LocalTime, val noon: LocalTime, val sunset: LocalTime, val civilDusk: LocalTime, val fallback: Boolean)

/** The sky at one minute: blend [from] into [to] by [t] (0..1); [lightX] is where the glow sits, 0 left to 1 right. */
data class SkyNow(val from: SkyPhase, val to: SkyPhase, val t: Float, val lightX: Float, val night: Boolean) {
    /** The phase that shows most at this minute. */
    val dominant: SkyPhase get() = if (t >= 0.5f) to else from
}

/** A place for the sun maths, from the time zone only: a rough centre per zone, else a longitude from the offset. */
data class SkyPlace(val lat: Double, val lon: Double)

object SkyClock {
    /** Rough centres of the zones most AIIMIN users live in; enough for 20 to 40 minutes of accuracy (1.3). */
    private val PLACES = mapOf(
        "Asia/Kolkata" to SkyPlace(22.5, 79.0), "Asia/Calcutta" to SkyPlace(22.5, 79.0),
        "Asia/Dubai" to SkyPlace(25.2, 55.3), "Asia/Singapore" to SkyPlace(1.35, 103.8), "Asia/Tokyo" to SkyPlace(35.7, 139.7),
        "Asia/Karachi" to SkyPlace(30.0, 69.0), "Asia/Dhaka" to SkyPlace(23.7, 90.4), "Asia/Kathmandu" to SkyPlace(27.7, 85.3),
        "Asia/Colombo" to SkyPlace(7.0, 80.0), "Europe/London" to SkyPlace(52.5, -1.5), "Europe/Dublin" to SkyPlace(53.3, -7.5),
        "Europe/Paris" to SkyPlace(46.6, 2.4), "Europe/Berlin" to SkyPlace(51.0, 10.4), "Europe/Madrid" to SkyPlace(40.4, -3.7),
        "Europe/Rome" to SkyPlace(42.5, 12.5), "Europe/Amsterdam" to SkyPlace(52.2, 5.3), "Europe/Stockholm" to SkyPlace(60.1, 15.0),
        "America/New_York" to SkyPlace(40.7, -76.0), "America/Chicago" to SkyPlace(39.0, -90.0), "America/Denver" to SkyPlace(39.7, -105.0),
        "America/Los_Angeles" to SkyPlace(36.0, -119.5), "America/Toronto" to SkyPlace(43.7, -79.4), "America/Vancouver" to SkyPlace(49.3, -123.1),
        "America/Sao_Paulo" to SkyPlace(-23.5, -46.6), "Australia/Sydney" to SkyPlace(-33.9, 151.2), "Australia/Melbourne" to SkyPlace(-37.8, 145.0),
        "Australia/Perth" to SkyPlace(-31.9, 115.9), "Australia/Brisbane" to SkyPlace(-27.5, 153.0), "Pacific/Auckland" to SkyPlace(-37.0, 175.0),
        "Africa/Johannesburg" to SkyPlace(-26.2, 28.0),
    )

    fun placeFor(zone: ZoneId, date: LocalDate): SkyPlace =
        PLACES[zone.id] ?: SkyPlace(25.0, zone.rules.getStandardOffset(date.atStartOfDay(zone).toInstant()).totalSeconds / 240.0)

    /** NOAA's simple solar equations. Polar days or nights, or a wrong zone, fall back to fixed hours (1.3). */
    fun sun(date: LocalDate, zone: ZoneId, place: SkyPlace = placeFor(zone, date)): SunTimes {
        val gamma = 2 * PI / 365 * (date.dayOfYear - 1)
        val eqTime = 229.18 * (0.000075 + 0.001868 * cos(gamma) - 0.032077 * sin(gamma) - 0.014615 * cos(2 * gamma) - 0.040849 * sin(2 * gamma))
        val decl = 0.006918 - 0.399912 * cos(gamma) + 0.070257 * sin(gamma) - 0.006758 * cos(2 * gamma) + 0.000907 * sin(2 * gamma) -
            0.002697 * cos(3 * gamma) + 0.00148 * sin(3 * gamma)
        val lat = Math.toRadians(place.lat)
        val offsetMin = zone.rules.getOffset(date.atTime(12, 0).atZone(zone).toInstant()).totalSeconds / 60.0
        val noonMin = 720 - 4 * place.lon - eqTime + offsetMin
        fun hourAngle(zenithDeg: Double): Double? {
            val c = cos(Math.toRadians(zenithDeg)) / (cos(lat) * cos(decl)) - tan(lat) * tan(decl)
            return if (c < -1 || c > 1) null else Math.toDegrees(acos(c))
        }
        val ha = hourAngle(90.833)
        val civil = hourAngle(96.0)
        if (ha == null || civil == null || noonMin !in 600.0..840.0) return fixed()
        fun at(min: Double) = LocalTime.ofSecondOfDay(((min.toLong() * 60) % 86_400 + 86_400) % 86_400)
        return SunTimes(at(noonMin - 4 * civil), at(noonMin - 4 * ha), at(noonMin), at(noonMin + 4 * ha), at(noonMin + 4 * civil), fallback = false)
    }

    /** Fixed hours (master plan keyframes) when the sun can't be worked out. */
    fun fixed() = SunTimes(LocalTime.of(5, 30), LocalTime.of(6, 0), LocalTime.of(12, 0), LocalTime.of(18, 30), LocalTime.of(19, 0), fallback = true)

    /** Keyframes relative to the sun (1.3): civil dawn, sunrise, +2 h, noon, sunset −1.5 h, sunset, civil dusk +30 min. */
    fun keyframes(s: SunTimes): List<Pair<Int, SkyPhase>> = listOf(
        min(s.civilDawn) to SkyPhase.PRE_DAWN,
        min(s.sunrise) to SkyPhase.DAWN,
        min(s.sunrise) + 120 to SkyPhase.MORNING,
        min(s.noon) to SkyPhase.MIDDAY,
        min(s.sunset) - 90 to SkyPhase.GOLDEN,
        min(s.sunset) to SkyPhase.DUSK,
        min(s.civilDusk) + 30 to SkyPhase.NIGHT,
    ).sortedBy { it.first }

    private fun min(t: LocalTime) = t.hour * 60 + t.minute

    /** The sky at [time]: between which keyframes, how far, and where the light comes from (left at dawn, right at dusk). */
    fun now(time: LocalTime, s: SunTimes): SkyNow {
        val m = min(time) + time.second / 60f
        val k = keyframes(s)
        val first = k.first(); val last = k.last()
        if (m < first.first || m >= last.first) {
            // Night runs from the end of dusk to the next pre-dawn; the last hour before pre-dawn eases into it.
            val toPre = (first.first - m + 1440) % 1440
            return if (toPre <= 60) SkyNow(SkyPhase.NIGHT, SkyPhase.PRE_DAWN, 1f - toPre / 60f, 0.15f, night = true)
            else SkyNow(SkyPhase.NIGHT, SkyPhase.NIGHT, 0f, 0.5f, night = true)
        }
        val i = k.indexOfLast { it.first <= m }
        val a = k[i]; val b = k[i + 1]
        val t = ((m - a.first) / (b.first - a.first).coerceAtLeast(1)).coerceIn(0f, 1f)
        val day = ((m - min(s.sunrise)) / (min(s.sunset) - min(s.sunrise)).coerceAtLeast(1)).coerceIn(0f, 1f)
        return SkyNow(a.second, b.second, t, 0.15f + 0.7f * day, night = false)
    }
}
