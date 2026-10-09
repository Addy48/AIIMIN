package aiimin.core.privacy

import java.time.Instant
import java.time.LocalDate

/** Roles grow with age; none of them grants reading someone else's private items (plan §8.2). */
enum class Role(val label: String, val manages: Boolean) {
    OWNER("Owner", manages = true),
    CO_ADMIN("Co-admin", manages = true),
    ADULT("Adult", manages = false),
    TEEN("Teen (13–17)", manages = false),
    CHILD("Child (<13)", manages = false),
    ELDER("Elder", manages = false),
    GUEST("Guest", manages = false),
}

/** An elder can name a caregiver for chosen categories; consent is reconfirmed yearly. */
data class Delegate(val to: String, val categories: Set<String>, val consentedOn: LocalDate)

data class Person(
    val id: String,
    val name: String,
    val role: Role,
    /** Invited but not accepted yet: sees nothing. */
    val pending: Boolean = false,
    val delegate: Delegate? = null,
)

enum class AccessLevel { SUMMARY, VIEW, COMMENT, EDIT }

/** When a share is live (plan §8.3). */
sealed interface ShareWhen {
    data object Now : ShareWhen
    data class Until(val lastDay: LocalDate) : ShareWhen
    /** Only after an emergency request for this owner is granted. */
    data object InEmergency : ShareWhen
    /** After death / incapacity, confirmed by a designated unlocker. Never live in normal use. */
    data object AfterDeath : ShareWhen
}

data class Share(val who: String, val level: AccessLevel, val whenLive: ShareWhen)

/** The household vault is a shared space, not a person. */
const val HOUSEHOLD = "household"

data class VaultDoc(
    val id: String,
    /** Person id, or [HOUSEHOLD]. */
    val owner: String,
    val category: String,
    val shares: List<Share> = emptyList(),
    val sensitive: Boolean = false,
)

enum class EmergencyStatus { WAITING, GRANTED, DENIED, EXPIRED }

/** Break-glass access: request → owner notified → wait → read-only grant that expires (§8.7). */
data class EmergencyRequest(
    val id: String,
    val from: String,
    val owner: String,
    val categories: Set<String>,
    val requestedAt: Instant,
    val waitHours: Int,
    val status: EmergencyStatus = EmergencyStatus.WAITING,
    val grantedAt: Instant? = null,
    val expiresOn: LocalDate? = null,
) {
    fun liveOn(today: LocalDate): Boolean =
        status == EmergencyStatus.GRANTED && expiresOn != null && !expiresOn.isBefore(today)
}

/** Everything access decisions read. Pass a fresh one; nothing here caches. */
data class Household(
    val people: List<Person>,
    val emergencyRequests: List<EmergencyRequest> = emptyList(),
) {
    fun person(id: String): Person? = people.firstOrNull { it.id == id }
}
