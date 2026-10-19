package aiimin.core.data.plan

import com.google.common.truth.Truth.assertThat
import org.junit.Test

class GateTest {
    @Test fun `third family profile on free is over the limit and names plus`() {
        assertThat(Gate.check(Plan.FREE, Feature.FAMILY_PROFILES, used = 2, soft = false)).isEqualTo(GateResult.OverLimit(limit = 2, liftedBy = Plan.PLUS))
    }

    @Test fun `soft mode lets it through but still reports`() {
        assertThat(Gate.check(Plan.FREE, Feature.FAMILY_PROFILES, used = 2, soft = true)).isEqualTo(GateResult.AllowedOnce(limit = 2, liftedBy = Plan.PLUS))
    }

    @Test fun `under the limit is allowed`() {
        assertThat(Gate.check(Plan.FREE, Feature.FAMILY_PROFILES, used = 1, soft = false)).isEqualTo(GateResult.Allowed)
    }

    @Test fun `safety features are always allowed`() {
        assertThat(Gate.check(Plan.FREE, Feature.EMERGENCY_CARD, used = 99, soft = false)).isEqualTo(GateResult.Allowed)
    }

    @Test fun `a feature not in the plan names the cheapest plan that has it`() {
        assertThat(Gate.check(Plan.FREE, Feature.PATTERNS, soft = false)).isEqualTo(GateResult.NotInPlan(Plan.PRO))
        assertThat(Gate.check(Plan.PLUS, Feature.CA_EXPORT, soft = false)).isEqualTo(GateResult.Allowed)
    }

    @Test fun `chart range beyond 3 months on free names plus`() {
        assertThat(Gate.months(Plan.FREE, requested = 6)).isEqualTo(GateResult.OverLimit(limit = 3, liftedBy = Plan.PLUS))
        assertThat(Gate.months(Plan.FREE, requested = 3)).isEqualTo(GateResult.Allowed)
        assertThat(Gate.months(Plan.PLUS, requested = 24)).isEqualTo(GateResult.Allowed)
    }
}
