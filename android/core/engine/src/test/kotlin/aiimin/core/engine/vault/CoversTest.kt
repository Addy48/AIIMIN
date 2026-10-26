package aiimin.core.engine.vault

import com.google.common.truth.Truth.assertThat
import org.junit.Test
import java.time.LocalDate

/** PRD Part 5 Phase 1: covers, lifecycles, the India pack, gap and overlap. */
class CoversTest {
    private fun d(s: String) = LocalDate.parse(s)

    @Test fun `the India pack has about 40 types, each with a source, and A or D types never remind`() {
        assertThat(Registry.INDIA.size).isAtLeast(38)
        assertThat(Registry.INDIA.map { it.key }.toSet().size).isEqualTo(Registry.INDIA.size)
        Registry.INDIA.forEach { t ->
            assertThat(t.source).startsWith("https://")
            if (t.lifecycle == Lifecycle.A || t.lifecycle == Lifecycle.D) assertThat(t.leadDays).isEmpty()
        }
        assertThat(Registry.byKey("pan")!!.lifecycle).isEqualTo(Lifecycle.A)
        assertThat(Registry.byKey("car_insurance")!!.lifecycle).isEqualTo(Lifecycle.C)
    }

    @Test fun `types are found from title and text, longest phrase first`() {
        assertThat(Registry.detect("ICICI Lombard", "Private Car Package Policy MH12AB1234")!!.key).isEqualTo("car_insurance")
        assertThat(Registry.detect("HDFC Ergo", "Two Wheeler Package Policy schedule")!!.key).isEqualTo("bike_insurance")
        assertThat(Registry.detect("scan", "INCOME TAX DEPARTMENT Permanent Account Number")!!.key).isEqualTo("pan")
        assertThat(Registry.detect("Star Health", "Family Floater health insurance policy")!!.key).isEqualTo("health_insurance")
        assertThat(Registry.detect("company plan", "expansion strategy")).isNull()
    }

    @Test fun `a new car policy from another insurer for the same vehicle is the same cover`() {
        val car = Registry.byKey("car_insurance")
        assertThat(Covers.sameCover(car, "MH 12 AB 1234", "car_insurance", "MH12-AB-1234")).isTrue()
        assertThat(Covers.sameCover(car, "MH12AB1234", "car_insurance", "KA01ZZ9999")).isFalse()
        assertThat(Covers.sameCover(car, "MH12AB1234", "health_insurance", "MH12AB1234")).isFalse()
        // records never version
        assertThat(Covers.sameCover(Registry.byKey("itr"), "me", "itr", "me")).isFalse()
    }

    @Test fun `3 days after the old one ended shows a gap, a long overlap asks, a short one is a normal renewal`() {
        assertThat(Covers.renewal(d("2026-10-10"), d("2026-10-14"))).isEqualTo(Renewal.Gap(3))
        assertThat(Covers.say(Renewal.Gap(3))).isEqualTo("3 days without cover")
        assertThat(Covers.renewal(d("2026-10-10"), d("2026-10-11"))).isEqualTo(Renewal.Normal)
        assertThat(Covers.renewal(d("2026-10-31"), d("2026-10-15"))).isEqualTo(Renewal.Normal)
        assertThat(Covers.renewal(d("2026-10-31"), d("2026-09-01"))).isEqualTo(Renewal.AskBoth(60))
    }

    @Test fun `the start is read, or worked out from the end and the usual length`() {
        val car = Registry.byKey("car_insurance")
        assertThat(Covers.startOf(car, null, d("2027-10-13"))).isEqualTo(d("2026-10-14"))
        assertThat(Covers.startOf(car, d("2026-11-01"), d("2027-10-13"))).isEqualTo(d("2026-11-01"))
        assertThat(Covers.startOf(Registry.byKey("visa"), null, d("2027-01-01"))).isNull()
    }

    @Test fun `only the current version reminds, and PAN or Aadhaar never do`() {
        val car = Registry.byKey("car_insurance")
        assertThat(Covers.reminds(car, CoverVersion("1", 1, null, d("2026-10-10"), current = false))).isFalse()
        assertThat(Covers.reminds(car, CoverVersion("2", 2, null, d("2027-10-13"), current = true))).isTrue()
        assertThat(Covers.reminds(Registry.byKey("pan"), CoverVersion("3", 1, null, d("2030-01-01"), current = true))).isFalse()
        assertThat(Covers.lapsed(Registry.byKey("pan"), d("2020-01-01"), d("2026-10-21"))).isFalse()
        assertThat(Covers.lapsed(car, d("2026-10-01"), d("2026-10-21"))).isTrue()
    }

    private fun v(id: String, cover: String, ver: Int, s: String?, e: String?, cur: Boolean, type: String = "car_insurance", subj: String = "MH12AB1234") =
        CoverDoc(id, cover, type, subj, s?.let(::d), e?.let(::d), ver, cur)

    @Test fun `saving a new car policy offers the existing car cover, never a record or another vehicle`() {
        val docs = listOf(
            v("a", "a", 1, "2025-10-14", "2026-10-13", true),
            v("b", "b", 1, null, "2027-01-01", true, subj = "KA01ZZ9999"),
            v("c", "c", 1, null, null, true, type = "itr", subj = "me"),
        )
        val m = Covers.match(Registry.byKey("car_insurance"), "MH-12-AB-1234", docs)
        assertThat(m.map { it.coverId }).containsExactly("a")
        assertThat(Covers.match(Registry.byKey("itr"), "me", docs)).isEmpty()
        assertThat(Covers.match(null, "MH12AB1234", docs)).isEmpty()
    }

    @Test fun `accepting gives a two-entry timeline newest first with the gap between them`() {
        val t = Covers.timeline(
            listOf(v("a", "a", 1, "2025-10-11", "2026-10-10", false), v("n", "a", 2, "2026-10-14", "2027-10-13", true)),
        )
        assertThat(t.map { it.doc.id }).containsExactly("n", "a").inOrder()
        assertThat(t[0].before).isEqualTo(Renewal.Gap(3))
        assertThat(t[1].before).isNull()
    }

    @Test fun `the new version takes the next number and becomes the only current one`() {
        val old = listOf(v("a", "a", 1, null, "2026-10-10", true), v("b", "a", 2, null, "2026-12-10", true))
        assertThat(Covers.nextVersion(old)).isEqualTo(3)
        assertThat(Covers.nextVersion(emptyList())).isEqualTo(1)
    }

    @Test fun `a readable expiry beats the registry's usual length, which is only a suggestion`() {
        val car = Registry.byKey("car_insurance")
        assertThat(Covers.expiryFor(car, read = d("2027-05-01"), starts = d("2026-10-14"))).isEqualTo(d("2027-05-01"))
        assertThat(Covers.suggestedEnd(car, starts = d("2026-10-14"))).isEqualTo(d("2027-10-13"))
        assertThat(Covers.expiryFor(car, read = null, starts = d("2026-10-14"))).isNull()
        assertThat(Covers.suggestedEnd(Registry.byKey("pan"), d("2026-10-14"))).isNull()
    }

    @Test fun `subjects are vehicles by number, people by owner, places by the owner's home`() {
        assertThat(Covers.subjectOf(Registry.byKey("car_insurance"), "me", "MH 12 AB 1234")).isEqualTo("MH12AB1234")
        assertThat(Covers.subjectOf(Registry.byKey("car_insurance"), "me", null)).isNull()
        assertThat(Covers.subjectOf(Registry.byKey("passport"), "p1", "MH12AB1234")).isEqualTo("p1")
        assertThat(Covers.subjectOf(Registry.byKey("rent"), "me", null)).isEqualTo("home:me")
        assertThat(Covers.subjectOf(null, "me", null)).isNull()
    }

    @Test fun `asset pages group a vehicle's or a home's papers`() {
        assertThat(Covers.assetOf(Registry.byKey("puc"), "MH12AB1234")).isEqualTo(Asset("MH12AB1234", AssetKind.VEHICLE))
        assertThat(Covers.assetOf(Registry.byKey("property_tax"), "home:me")).isEqualTo(Asset("home:me", AssetKind.HOME))
        assertThat(Covers.assetOf(Registry.byKey("passport"), "me")).isNull()
    }
}
