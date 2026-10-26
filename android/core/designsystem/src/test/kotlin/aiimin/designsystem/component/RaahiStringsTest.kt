package aiimin.designsystem.component

import java.io.File
import org.junit.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

/** Raahi's lines obey 13.2: no guilt words, short. Reads the string file directly. */
class RaahiStringsTest {
    private val lines: Map<String, String> by lazy {
        val f = File("src/main/res/values/raahi_strings.xml")
        Regex("""<string name="([^"]+)">(.*?)</string>""").findAll(f.readText()).associate { it.groupValues[1] to it.groupValues[2] }
    }
    private val guilt = Regex("""\b(late|overdue|missed|streak|behind|failed)\b""", RegexOption.IGNORE_CASE)

    @Test fun noGuiltWords() = lines.forEach { (k, v) -> assertTrue(!guilt.containsMatchIn(v), "$k: $v") }

    @Test fun tipsAreShort() = lines.filterKeys { it.startsWith("raahi_guide_") && it != "raahi_guide_title" }
        .forEach { (k, v) -> assertTrue(v.split(" ").size <= 20, "$k too long") }

    @Test fun everyAreaHasThreeTips() = RaahiArea.entries.forEach { a ->
        assertEquals(3, lines.keys.count { it.startsWith("raahi_guide_${a.name.lowercase()}_") }, a.name)
    }

    @Test fun moneyAndVaultShowNoArt() {
        assertTrue(!RaahiArea.MONEY.showsArt && !RaahiArea.VAULT.showsArt)
    }
}
