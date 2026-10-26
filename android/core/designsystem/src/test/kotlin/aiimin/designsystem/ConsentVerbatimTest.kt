package aiimin.designsystem

import aiimin.designsystem.component.ConsentText
import java.io.File
import org.junit.Assert.assertTrue
import org.junit.Assume.assumeTrue
import org.junit.Test

/**
 * B13: the consent texts in the app are the PRD Part 23 texts, word for word. The PRD lives outside the repo, so on a
 * machine without it the test is skipped (set AIIMIN_PRD to its path to run it anywhere).
 */
class ConsentVerbatimTest {
    private val prd = (System.getenv("AIIMIN_PRD") ?: "../../../../../AIIMIN-PRD.md").let(::File)

    @Test fun `every consent sheet text appears verbatim in Part 23`() {
        assumeTrue(prd.exists())
        val part23 = prd.readText().substringAfter("# Part 23:").substringBefore("\n# Part 24")
        listOf(
            ConsentText.READ_SMS, ConsentText.NOTIFICATION_ACCESS, ConsentText.HEALTH, ConsentText.USAGE, ConsentText.MICROPHONE,
            ConsentText.NOTIFICATIONS, ConsentText.UNDER_18, ConsentText.FOOTER,
        ).forEach { assertTrue(it.take(40), part23.contains(it)) }
    }
}
