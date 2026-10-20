package aiimin.core.data

import aiimin.core.data.notify.minimumsNudgeBody
import com.google.common.truth.Truth.assertThat
import org.junit.Test

/** PRD 13.2 / 8.3: the evening reminder never mentions a streak or what was not done (C-001). */
class MinimumsNudgeTest {
    @Test fun `several left`() = assertThat(minimumsNudgeBody(left = 3)).isEqualTo("Keep them if you can. The tiny versions count.")

    @Test fun `one left`() = assertThat(minimumsNudgeBody(left = 1)).isEqualTo("Keep it if you can. The tiny version counts.")

    @Test fun `never a guilt word`() {
        val words = Regex("""\b(streak|missed|late|behind|failed|overdue)\b""", RegexOption.IGNORE_CASE)
        (1..5).forEach { assertThat(words.containsMatchIn(minimumsNudgeBody(it))).isFalse() }
    }
}
