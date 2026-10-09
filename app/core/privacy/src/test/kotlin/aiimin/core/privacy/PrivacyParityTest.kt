package aiimin.core.privacy

import com.google.common.truth.Truth.assertThat
import java.time.Duration
import java.time.Instant
import java.time.LocalDate
import kotlin.test.Test

/** Prototype harness T14–T17 (v2_80_tests.js), plus the family rules they stand for. */
class PrivacyParityTest {

    private val today = LocalDate.of(2026, 10, 9)
    private val now = Instant.parse("2026-10-09T06:30:00Z")

    private val people = listOf(
        Person("me", "Aaditya", Role.OWNER),
        Person("mom", "Mom", Role.CO_ADMIN),
        Person("dad", "Dad", Role.ELDER, delegate = Delegate("me", setOf("Insurance", "Health", "Vehicle"), today)),
        Person("riya", "Riya", Role.ADULT, pending = true),
    )
    private val home = Household(people)

    private val dadCar = VaultDoc("d1", "dad", "Vehicle")
    private val householdBudget = VaultDoc("d2", HOUSEHOLD, "Finance & Tax")
    private val momMediclaim = VaultDoc("d3", "mom", "Insurance", shares = listOf(Share("me", AccessLevel.VIEW, ShareWhen.Now)))
    private val riyaPassport = VaultDoc("d4", "riya", "Identity")

    @Test
    fun `T14 family member cannot read your private document - admin manages but cannot read`() {
        val asOwner = AccessPolicy.canSee(riyaPassport, "me", home, today)
        val asCoAdmin = AccessPolicy.canSee(riyaPassport, "mom", home, today)

        assertThat(asOwner.ok).isFalse()
        assertThat(asCoAdmin.ok).isFalse()
        assertThat(asOwner).isEqualTo(Access.Denied(Access.Why.MANAGING_IS_NOT_READING))
    }

    @Test
    fun `T15 caregiver sees only delegated categories`() {
        assertThat(AccessPolicy.canSee(dadCar, "me", home, today))
            .isEqualTo(Access.Granted(AccessLevel.VIEW, Access.Why.CAREGIVER))
        assertThat(AccessPolicy.canSee(VaultDoc("d5", "dad", "Finance & Tax"), "me", home, today).ok).isFalse()
        assertThat(AccessPolicy.canSee(dadCar, "mom", home, today).ok).isFalse()
    }

    @Test
    fun `T16 household vault is visible to adults, not to guests`() {
        val withGuest = home.copy(people = people + Person("ca", "CA", Role.GUEST))

        assertThat(AccessPolicy.canSee(householdBudget, "mom", withGuest, today).ok).isTrue()
        assertThat(AccessPolicy.canSee(householdBudget, "ca", withGuest, today).ok).isFalse()

        // A guest sees exactly the items shared with them, and only until the share ends.
        val sharedWithCa = householdBudget.copy(shares = listOf(Share("ca", AccessLevel.VIEW, ShareWhen.Until(today))))
        assertThat(AccessPolicy.canSee(sharedWithCa, "ca", withGuest, today).ok).isTrue()
        assertThat(AccessPolicy.canSee(sharedWithCa, "ca", withGuest, today.plusDays(1)).ok).isFalse()
    }

    @Test
    fun `T17 emergency access - waiting, then read-only within scope, then expires`() {
        val request = EmergencyRequest(
            id = "tem", from = "mom", owner = "riya", categories = setOf("Identity"),
            requestedAt = now.minus(Duration.ofHours(73)), waitHours = 72,
        )
        val waiting = AccessPolicy.tickEmergency(listOf(request.copy(requestedAt = now.minus(Duration.ofHours(10)))), now, today)
        assertThat(waiting.single().status).isEqualTo(EmergencyStatus.WAITING)
        assertThat(AccessPolicy.canSee(riyaPassport, "mom", home.copy(emergencyRequests = waiting), today).ok).isFalse()

        val granted = AccessPolicy.tickEmergency(listOf(request), now, today)
        val withGrant = home.copy(emergencyRequests = granted)
        assertThat(granted.single().status).isEqualTo(EmergencyStatus.GRANTED)
        assertThat(AccessPolicy.canSee(riyaPassport, "mom", withGrant, today))
            .isEqualTo(Access.Granted(AccessLevel.VIEW, Access.Why.EMERGENCY_GRANT))
        // Out of scope stays private even during an emergency.
        assertThat(AccessPolicy.canSee(VaultDoc("d6", "riya", "Finance & Tax"), "mom", withGrant, today).ok).isFalse()

        val later = today.plusDays(31)
        val expired = AccessPolicy.tickEmergency(granted, now.plus(Duration.ofDays(31)), later)
        assertThat(expired.single().status).isEqualTo(EmergencyStatus.EXPIRED)
        assertThat(AccessPolicy.canSee(riyaPassport, "mom", home.copy(emergencyRequests = expired), later).ok).isFalse()
    }

    @Test
    fun `explicit share works and pending invitees see nothing`() {
        assertThat(AccessPolicy.canSee(momMediclaim, "me", home, today).ok).isTrue()
        assertThat(AccessPolicy.canSee(householdBudget, "riya", home, today))
            .isEqualTo(Access.Denied(Access.Why.INVITE_PENDING))
    }

    @Test
    fun `a teen's journal is never visible to a parent and no override exists`() {
        assertThat(AccessPolicy.canReadJournal(authorId = "teen", viewerId = "me").ok).isFalse()
        assertThat(AccessPolicy.canReadJournal(authorId = "teen", viewerId = "teen").ok).isTrue()
    }

    @Test
    fun `life score is private unless the owner shares it`() {
        assertThat(AccessPolicy.canSeeLifeScore("riya", "me", emptySet()).ok).isFalse()
        assertThat(AccessPolicy.canSeeLifeScore("riya", "me", setOf("me")))
            .isEqualTo(Access.Granted(AccessLevel.SUMMARY, Access.Why.SHARED_WITH_YOU))
    }
}
