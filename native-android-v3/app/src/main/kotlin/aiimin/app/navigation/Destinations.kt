package aiimin.app.navigation

import aiimin.designsystem.icon.AiiminIcon
import androidx.navigation3.runtime.NavKey
import kotlinx.serialization.Serializable

/**
 * The five top-level surfaces — Genesis keeps the top level minimal (GOV-165).
 * Everything else (Score, Journal, OS-ID, Search, Onboarding) is reached
 * contextually and is added here as its screen is built, never before.
 */
sealed interface Destination : NavKey

@Serializable
data object Day : Destination

@Serializable
data object Money : Destination

@Serializable
data object Capture : Destination

@Serializable
data object Lab : Destination

@Serializable
data object Config : Destination

/** Contextual — reached from Config profile, not a bottom tab. */
@Serializable
data object OsId : Destination

/** Contextual — reached from Today's score figure. */
@Serializable
data object Score : Destination

/** Contextual — reached from Config, not a bottom tab. */
@Serializable
data object Journal : Destination

/** Contextual — native English Spark from Config / Lab. */
@Serializable
data object English : Destination

/** Contextual — notes vault from Today / Config / Capture. */
@Serializable
data object Notes : Destination

/** Contextual — Knock channels from Config. */
@Serializable
data object Notifications : Destination

/** Contextual — local graph recall. */
@Serializable
data object Search : Destination

/** Contextual — chronology, not a feed. */
@Serializable
data object Timeline : Destination

/** Contextual — family documents from bootstrap. */
@Serializable
data object Family : Destination

/** Contextual — resumes from bootstrap. */
@Serializable
data object Documents : Destination

/** Contextual — goals from bootstrap. Edit on web. */
@Serializable
data object Goals : Destination

/** A tab in the bottom bar: a destination, its chrome label, and its glyph. */
enum class Tab(val destination: Destination, val label: String, val icon: AiiminIcon) {
    DAY(Day, "DAY", AiiminIcon.Day),
    MONEY(Money, "MONEY", AiiminIcon.Money),
    CAPTURE(Capture, "CAPTURE", AiiminIcon.Capture),
    LAB(Lab, "LAB", AiiminIcon.Lab),
    CONFIG(Config, "CONFIG", AiiminIcon.Config),
    ;

    companion object {
        fun of(destination: Any?): Tab? = entries.firstOrNull { it.destination == destination }
    }
}
