package aiimin.core.data.plan

import com.google.common.truth.Truth.assertThat
import org.junit.Test

class FeatureCatalogTest {
    @Test fun `free is never empty and safety is never paid`() {
        assertThat(Feature.entries.count { it.free != Access.No }).isGreaterThan(5)
        Feature.entries.filter { it.safety }.forEach { assertThat(it.free).isNotEqualTo(Access.No) }
    }

    @Test fun `a plan is complete only when every hero feature has shipped`() {
        val heroes = Feature.entries.filter { Plan.PLUS in it.heroFor }
        assertThat(Plan.PLUS.complete).isEqualTo(heroes.all { it.shipped })
        assertThat(Plan.FREE.complete).isTrue()
    }

    @Test fun `higher plans never give less than lower ones`() {
        Feature.entries.forEach { f ->
            assertThat(f.plus.rank).isAtLeast(f.free.rank)
            assertThat(f.pro.rank).isAtLeast(f.plus.rank)
            assertThat(f.family.rank).isAtLeast(f.pro.rank)
        }
    }

    @Test fun `free family profile limit is two`() {
        assertThat(Feature.FAMILY_PROFILES.free).isEqualTo(Access.UpTo(2))
    }

    @Test fun `every paid plan has a price in both periods`() {
        Plan.entries.filter { it != Plan.FREE }.forEach {
            assertThat(it.plannedMonthlyInr).isGreaterThan(0)
            assertThat(it.plannedYearlyInr).isLessThan(it.plannedMonthlyInr * 12)
        }
    }
}
