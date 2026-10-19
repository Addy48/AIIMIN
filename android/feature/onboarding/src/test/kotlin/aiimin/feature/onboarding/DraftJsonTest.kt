package aiimin.feature.onboarding

import com.google.common.truth.Truth.assertThat
import org.junit.Test

class DraftJsonTest {
    @Test fun `draft survives a round trip through JSON`() {
        val d = Draft(
            step = 5, name = "Meera", dob = "1996-04-12", role = "shift",
            mins = listOf(MinPick("Walk 20 minutes", "Walk to the gate"), MinPick("Read 10 pages", "")),
            minsTouched = true, battery = "STANDARD", banks = listOf("HDFC", "SBI Card"), cash = false,
            plan = "40000", firstWin = "Task · Call CA", roster = "DDNNOO",
        )
        assertThat(Draft.fromJson(d.toJson())).isEqualTo(d)
    }

    @Test fun `nulls stay null and garbage is rejected`() {
        val d = Draft(name = "A")
        assertThat(Draft.fromJson(d.toJson())).isEqualTo(d)
        assertThat(Draft.fromJson("not json")).isNull()
    }
}
