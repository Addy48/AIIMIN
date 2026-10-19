package aiimin.feature.me

import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class InviteTextTest {
    @Test fun `the invite says what AIIMIN is, the privacy promise and where to join`() {
        val t = inviteText()
        assertTrue(t.contains("day, money and family's papers"))
        assertTrue(t.contains("never uploads"))
        assertTrue(t.endsWith("https://aiimin.in/waitlist"))
    }

    @Test fun `the invite makes no claims we cannot back`() {
        val t = inviteText().lowercase()
        listOf("best", "#1", "ai-powered", "users", "revolution", "free forever").forEach { assertFalse("has \"$it\"", t.contains(it)) }
    }
}
