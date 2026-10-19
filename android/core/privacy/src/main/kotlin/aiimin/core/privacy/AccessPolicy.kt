package aiimin.core.privacy

import java.time.Duration
import java.time.Instant
import java.time.LocalDate

/** Why a reader can or can't open something. The reason is always shown. */
sealed interface Access {
    val ok: Boolean

    data class Granted(val level: AccessLevel, val why: Why) : Access {
        override val ok get() = true
    }

    data class Denied(val why: Why) : Access {
        override val ok get() = false
    }

    enum class Why {
        OWN_ITEM,
        HOUSEHOLD_SPACE,
        SHARED_WITH_YOU,
        CAREGIVER,
        EMERGENCY_GRANT,
        INVITE_PENDING,
        GUEST_ONLY_SHARED,
        /** Admins manage members; they can't read members' items. */
        MANAGING_IS_NOT_READING,
        PRIVATE,
        NEVER_SHARED,
    }
}

/**
 * Private by default, shared on purpose; managing ≠ reading (plan §8.1).
 * Prototype reference: v2_30_vault.js `canSee` / `emergencyTick`.
 */
object AccessPolicy {

    fun canSee(doc: VaultDoc, viewerId: String, household: Household, today: LocalDate): Access {
        if (doc.owner == viewerId) return Access.Granted(AccessLevel.EDIT, Access.Why.OWN_ITEM)
        val viewer = household.person(viewerId) ?: return Access.Denied(Access.Why.PRIVATE)
        if (viewer.pending) return Access.Denied(Access.Why.INVITE_PENDING)

        if (doc.owner == HOUSEHOLD) {
            return if (viewer.role == Role.GUEST) {
                doc.shares.firstOrNull { it.who == viewerId && shareLive(it, doc.owner, household, today) }
                    ?.let { Access.Granted(it.level, Access.Why.SHARED_WITH_YOU) }
                    ?: Access.Denied(Access.Why.GUEST_ONLY_SHARED)
            } else {
                Access.Granted(AccessLevel.EDIT, Access.Why.HOUSEHOLD_SPACE)
            }
        }

        doc.shares.firstOrNull { it.who == viewerId && shareLive(it, doc.owner, household, today) }
            ?.let { return Access.Granted(it.level, Access.Why.SHARED_WITH_YOU) }

        val owner = household.person(doc.owner)
        val delegate = owner?.delegate
        if (delegate != null && delegate.to == viewerId && doc.category in delegate.categories && !doc.sensitive) {
            return Access.Granted(AccessLevel.VIEW, Access.Why.CAREGIVER)
        }

        val emergency = household.emergencyRequests.firstOrNull {
            it.from == viewerId && it.owner == doc.owner && it.liveOn(today) && doc.category in it.categories
        }
        if (emergency != null) return Access.Granted(AccessLevel.VIEW, Access.Why.EMERGENCY_GRANT)

        return Access.Denied(if (viewer.role.manages) Access.Why.MANAGING_IS_NOT_READING else Access.Why.PRIVATE)
    }

    private fun shareLive(s: Share, owner: String, household: Household, today: LocalDate): Boolean = when (val w = s.whenLive) {
        ShareWhen.Now -> true
        is ShareWhen.Until -> !w.lastDay.isBefore(today)
        ShareWhen.InEmergency -> household.emergencyRequests.any { it.from == s.who && it.owner == owner && it.liveOn(today) }
        ShareWhen.AfterDeath -> false
    }

    /**
     * Journal entries are readable by their author only. There is no admin,
     * parent or emergency override (plan §8.6). After-death sharing is an
     * explicit opt-in handled outside normal access.
     */
    fun canReadJournal(authorId: String, viewerId: String): Access =
        if (authorId == viewerId) Access.Granted(AccessLevel.EDIT, Access.Why.OWN_ITEM) else Access.Denied(Access.Why.NEVER_SHARED)

    /** Life Score is private; owners may share score or trend only, per person, revocably. */
    fun canSeeLifeScore(ownerId: String, viewerId: String, sharedWith: Set<String>): Access = when {
        ownerId == viewerId -> Access.Granted(AccessLevel.EDIT, Access.Why.OWN_ITEM)
        viewerId in sharedWith -> Access.Granted(AccessLevel.SUMMARY, Access.Why.SHARED_WITH_YOU)
        else -> Access.Denied(Access.Why.PRIVATE)
    }

    /** Advance waiting requests whose wait has passed; expire old grants. */
    fun tickEmergency(
        requests: List<EmergencyRequest>,
        now: Instant,
        today: LocalDate,
        accessDays: Int = 30,
    ): List<EmergencyRequest> = requests.map { r ->
        when {
            r.status == EmergencyStatus.WAITING && Duration.between(r.requestedAt, now) >= Duration.ofHours(r.waitHours.toLong()) ->
                r.copy(status = EmergencyStatus.GRANTED, grantedAt = now, expiresOn = today.plusDays(accessDays.toLong()))
            r.status == EmergencyStatus.GRANTED && r.expiresOn != null && r.expiresOn.isBefore(today) ->
                r.copy(status = EmergencyStatus.EXPIRED)
            else -> r
        }
    }

    /** The owner can approve or deny at any point; denying keeps the contact. */
    fun decide(request: EmergencyRequest, approve: Boolean, now: Instant, today: LocalDate, accessDays: Int = 30): EmergencyRequest =
        if (approve) {
            request.copy(status = EmergencyStatus.GRANTED, grantedAt = now, expiresOn = today.plusDays(accessDays.toLong()))
        } else {
            request.copy(status = EmergencyStatus.DENIED)
        }
}
