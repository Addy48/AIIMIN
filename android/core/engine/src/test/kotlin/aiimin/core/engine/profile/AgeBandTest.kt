package aiimin.core.engine.profile

import java.time.LocalDate
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

class AgeBandTest {
    private val today = LocalDate.of(2026, 10, 20)

    @Test fun underEighteenGetsNoBand() {
        assertNull(AgeBand.of(LocalDate.of(2010, 1, 1), today))
        // The day before the 18th birthday is still under 18.
        assertNull(AgeBand.of(LocalDate.of(2008, 10, 21), today))
        assertFalse(AgeBand.isAdult(LocalDate.of(2008, 10, 21), today))
    }

    @Test fun eighteenthBirthdayIsAdult() {
        assertEquals("18-24", AgeBand.of(LocalDate.of(2008, 10, 20), today))
        assertTrue(AgeBand.isAdult(LocalDate.of(2008, 10, 20), today))
    }

    @Test fun bandsCoverEveryAdultAge() {
        assertEquals("24", AgeBand.of(today.minusYears(24), today)!!.substringAfter('-'))
        assertEquals("25-34", AgeBand.of(today.minusYears(25), today))
        assertEquals("35-44", AgeBand.of(today.minusYears(44), today))
        assertEquals("55-64", AgeBand.of(today.minusYears(64), today))
        assertEquals("65+", AgeBand.of(today.minusYears(65), today))
        assertEquals("65+", AgeBand.of(today.minusYears(99), today))
        (18..110).forEach { assertTrue(AgeBand.of(today.minusYears(it.toLong()), today) in AgeBand.BANDS) }
    }

    @Test fun futureDateIsNotAdult() {
        assertNull(AgeBand.of(today.plusDays(1), today))
    }

    @Test fun eighteenthBirthdayDate() {
        assertEquals(LocalDate.of(2026, 3, 5), AgeBand.eighteenth(LocalDate.of(2008, 3, 5)))
        assertEquals(LocalDate.of(2026, 2, 28), AgeBand.eighteenth(LocalDate.of(2008, 2, 29)))
    }
}
