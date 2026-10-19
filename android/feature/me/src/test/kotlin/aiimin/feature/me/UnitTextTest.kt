package aiimin.feature.me

import org.junit.Assert.assertEquals
import org.junit.Test

class UnitTextTest {
    @Test fun `percent and out-of sit against the number`() {
        assertEquals("70%", withUnit("70", "%"))
        assertEquals("75/100", withUnit("75", "/100"))
    }

    @Test fun `words keep a space`() = assertEquals("150 min", withUnit("150", "min"))

    @Test fun `no unit is just the number`() = assertEquals("3", withUnit("3", ""))
}
