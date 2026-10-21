package aiimin.feature.me

import com.google.common.truth.Truth.assertWithMessage
import java.io.File
import org.junit.Assume.assumeTrue
import org.junit.Test

/** B13: the Your rights screen quotes Part 21 s.9, 9a and 11a word for word (skipped where the PRD isn't on disk). */
class RightsVerbatimTest {
    private val prd = (System.getenv("AIIMIN_PRD") ?: "../../../../../AIIMIN-PRD.md").let(::File)

    @Test fun `rights texts are the policy's own words`() {
        assumeTrue(prd.exists())
        val p21 = prd.readText().substringAfter("# Part 21:").substringBefore("\n# Part 22").replace("\\\"", "\"")
        listOf(Rights.ASK, Rights.WITHDRAW, Rights.NOMINATE, Rights.BOARD, Rights.BREACH).forEach {
            // The policy puts some of these after a bold label, so their first letter is lower case there.
            assertWithMessage(it.take(40)).that(p21.contains(it) || p21.contains(it.replaceFirstChar(Char::lowercase))).isTrue()
        }
    }
}
