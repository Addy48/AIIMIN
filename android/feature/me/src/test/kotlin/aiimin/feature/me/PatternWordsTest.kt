package aiimin.feature.me

import org.junit.Assert.assertEquals
import org.junit.Test

class PatternWordsTest {
    @Test fun `plural measures take are`() {
        assertEquals("are", copulaFor("steps"))
        assertEquals("are", copulaFor("unlocks"))
    }

    @Test fun `singular words ending in s take is`() {
        assertEquals("is", copulaFor("focus"))
        assertEquals("is", copulaFor("stress"))
        assertEquals("is", copulaFor("fitness"))
    }

    @Test fun `ordinary singular takes is`() = assertEquals("is", copulaFor("sleep"))
}
