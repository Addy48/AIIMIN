package aiimin.core.data

import aiimin.core.data.plan.Plan
import aiimin.core.data.plan.planPriceLabel
import com.google.common.truth.Truth.assertThat
import org.junit.Test

class PlanPriceTest {
    @Test fun `free is zero`() = assertThat(planPriceLabel(Plan.FREE, null, null, null, yearly = false)).isEqualTo("₹0")

    @Test fun `without Google Play the planned price shows, never a dash`() {
        assertThat(planPriceLabel(Plan.PRO, null, null, null, yearly = false)).isEqualTo("₹99/month")
        assertThat(planPriceLabel(Plan.PRO, null, null, null, yearly = true)).isEqualTo("₹899/year")
    }

    @Test fun `the Play Store price wins when there is one`() =
        assertThat(planPriceLabel(Plan.PLUS, "₹59.00", "₹499.00", 30, yearly = true)).isEqualTo("₹499.00/year · save 30%")
}
