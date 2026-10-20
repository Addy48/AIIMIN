package aiimin.core.engine.profile

import java.time.LocalDate
import java.time.Period

/**
 * Age handling (PRD 1.6, 4.7): the date of birth is used once, on onboarding screen 1, and only the band is
 * kept. Under 18 stops onboarding before anything is saved (Part 23).
 */
object AgeBand {
    const val ADULT = 18
    val BANDS = listOf("18-24", "25-34", "35-44", "45-54", "55-64", "65+")

    fun years(dob: LocalDate, today: LocalDate): Int = Period.between(dob, today).years

    fun isAdult(dob: LocalDate, today: LocalDate): Boolean = !dob.isAfter(today) && years(dob, today) >= ADULT

    /** The band to store, or null for anyone under 18 (nothing is stored for them). */
    fun of(dob: LocalDate, today: LocalDate): String? {
        if (!isAdult(dob, today)) return null
        return when (years(dob, today)) {
            in 18..24 -> "18-24"
            in 25..34 -> "25-34"
            in 35..44 -> "35-44"
            in 45..54 -> "45-54"
            in 55..64 -> "55-64"
            else -> "65+"
        }
    }

    /** The day of the 18th birthday, for the reminder the under-18 screen offers (29 Feb falls on 28 Feb). */
    fun eighteenth(dob: LocalDate): LocalDate = dob.plusYears(ADULT.toLong())
}
