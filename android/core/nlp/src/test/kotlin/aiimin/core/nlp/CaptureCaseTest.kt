package aiimin.core.nlp

import com.google.common.truth.Truth.assertThat
import org.junit.Test

/** Labels keep the person's acronyms and names (B3 phone check: "call CA tomorrow 4:30" read "Call ca"). */
class CaptureCaseTest {
    private fun label(s: String) = CaptureEngine.analyze(s, TEST_NOW).items.first().label

    @Test fun `acronyms stay upper case`() {
        assertThat(label("call CA tomorrow 4:30")).isEqualTo("Call CA")
        assertThat(label("pay HDFC EMI on friday")).contains("HDFC EMI")
    }

    @Test fun `names stay capitalised`() = assertThat(label("call Ravi at 5")).isEqualTo("Call Ravi")
}
