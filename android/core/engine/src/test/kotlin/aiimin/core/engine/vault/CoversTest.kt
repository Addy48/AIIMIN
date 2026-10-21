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
}
