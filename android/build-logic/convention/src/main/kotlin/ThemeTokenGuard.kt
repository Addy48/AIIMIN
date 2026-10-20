import org.gradle.api.DefaultTask
import org.gradle.api.GradleException
import org.gradle.api.file.ConfigurableFileCollection
import org.gradle.api.file.RegularFileProperty
import org.gradle.api.tasks.CacheableTask
import org.gradle.api.tasks.InputFiles
import org.gradle.api.tasks.OutputFile
import org.gradle.api.tasks.PathSensitive
import org.gradle.api.tasks.PathSensitivity
import org.gradle.api.tasks.TaskAction

/**
 * PRD Part 29: colours come only from `Palette.kt` and fonts only from `Type.kt`.
 * PRD Part 26.5: durations and curves come only from `Motion.kt`; only transform and opacity animate.
 * Runs before `preBuild` (the release command skips lint, so a lint rule would never fail it).
 */
@CacheableTask
abstract class ThemeTokenGuard : DefaultTask() {
    @get:InputFiles
    @get:PathSensitive(PathSensitivity.RELATIVE)
    abstract val sources: ConfigurableFileCollection

    @get:OutputFile
    abstract val report: RegularFileProperty

    @TaskAction
    fun scan() {
        val hits = sources.files
            .filter { it.isFile && it.extension == "kt" }
            .sortedBy { it.path }
            .flatMap { file ->
                val path = file.invariantSeparatorsPath
                val rules = RULES.filter { r -> r.allowedIn.none { path.endsWith(it) } }
                file.readLines().mapIndexedNotNull { i, line ->
                    val code = codeOf(line)
                    rules.firstOrNull { it.pattern.containsMatchIn(code) }?.let { "${file.path}:${i + 1}: [${it.why}] ${line.trim()}" }
                }
            }
        report.get().asFile.writeText(hits.joinToString("\n"))
        if (hits.isNotEmpty()) {
            throw GradleException(
                "Design tokens only (PRD Parts 26.5 and 29): ${hits.size} use(s) outside Palette.kt / Type.kt / Motion.kt:\n" +
                    hits.joinToString("\n"),
            )
        }
    }

    data class Rule(val why: String, val pattern: Regex, val allowedIn: Set<String>)

    companion object {
        // Allowed by path suffix, so another module's file of the same name is not exempt.
        private val COLOUR = setOf("designsystem/theme/Palette.kt")
        private val FONT = setOf("designsystem/theme/Type.kt", "designsystem/theme/Palette.kt")
        private val MOTION = setOf("designsystem/theme/Motion.kt")
        // The printable emergency sheet is a PDF drawn with android.graphics, not a screen.
        private val PRINT = setOf("core/data/vault/VaultBackup.kt") + FONT
        val RULES = listOf(
            Rule("raw colour", Regex("""\bColor\(\s*(0x|red\s*=|[0-9.]+f\b)"""), COLOUR),
            Rule("named colour", Regex("""\bColor\.(Black|White|Red|Gray|Grey|Blue|Green|Yellow|Cyan|Magenta|DarkGray|LightGray)\b"""), COLOUR),
            Rule("system font", Regex("""\bFontFamily\.(Serif|SansSerif|Monospace|Cursive|Default)\b"""), FONT),
            Rule("system typeface", Regex("""\bTypeface\.(DEFAULT|SANS_SERIF|SERIF|MONOSPACE|create)\b"""), PRINT),
            Rule("raw duration", Regex("""\btween(<[^>]*>)?\(\s*(durationMillis\s*=\s*)?\d"""), MOTION),
            Rule("raw spring", Regex("""\bspring(<[^>]*>)?\("""), MOTION),
            Rule("raw keyframes", Regex("""\bkeyframes(<[^>]*>)?\s*\{"""), MOTION),
            Rule("colour animation", Regex("""\banimateColorAsState\b"""), MOTION),
            Rule("size animation", Regex("""\banimateContentSize\b"""), MOTION),
        )

        /** The line without its // comment; a "//" inside a string ("https://…") is kept. */
        fun codeOf(line: String): String {
            var inString = false
            var i = 0
            while (i < line.length) {
                val ch = line[i]
                if (ch == '\\' && inString) { i += 2; continue }
                if (ch == '"') inString = !inString
                if (!inString && ch == '/' && i + 1 < line.length && line[i + 1] == '/') return line.substring(0, i)
                i++
            }
            return line
        }
    }
}
