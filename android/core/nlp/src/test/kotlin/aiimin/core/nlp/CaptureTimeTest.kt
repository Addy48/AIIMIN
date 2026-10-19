package aiimin.core.nlp

import com.google.common.truth.Truth.assertThat
import org.junit.Test

class CaptureTimeTest {
    @Test fun `call Ravi at 5 is a task at 5 in the evening`() {
        val c = CaptureParser.parse("call Ravi at 5")
        assertThat(c.time24).isEqualTo("17:00")
    }

    @Test fun `at 9 is the morning and at 5 30 keeps minutes`() {
        assertThat(CaptureParser.parse("gym at 9").time24).isEqualTo("09:00")
        assertThat(CaptureParser.parse("meet Asha at 5:30").time24).isEqualTo("17:30")
    }

    @Test fun `explicit am pm still wins and amounts are untouched`() {
        assertThat(CaptureParser.parse("call mom at 5 am").time24).isEqualTo("05:00")
        assertThat(CaptureParser.parse("spent 240 on lunch").amount).isEqualTo(240)
    }
}
