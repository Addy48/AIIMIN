package aiimin.designsystem.component

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

/** D-006: the biggest-day label ("₹3,120 · Ola") never sits on the month's running-total line. */
class SpikeChipTest {
    private val h = 20f
    private val gap = 5f

    @Test fun `a chip clear of the line stays where it was`() {
        assertEquals(150f, spikeChipTop(preferred = 150f, chipH = h, lineTop = 60f, lineBottom = 90f, gap = gap, floor = 200f), 0f)
        assertEquals(150f, spikeChipTop(150f, h, null, null, gap, 200f), 0f)
    }

    @Test fun `a chip on the line moves above it`() {
        val top = spikeChipTop(preferred = 100f, chipH = h, lineTop = 95f, lineBottom = 125f, gap = gap, floor = 200f)
        assertTrue(top + h + gap <= 95f)
    }

    @Test fun `with no room above, it goes below the line but stays above the bar`() {
        val top = spikeChipTop(preferred = 10f, chipH = h, lineTop = 12f, lineBottom = 40f, gap = gap, floor = 200f)
        assertTrue(top >= 40f + gap)
        assertTrue(top + h <= 200f)
    }
}
