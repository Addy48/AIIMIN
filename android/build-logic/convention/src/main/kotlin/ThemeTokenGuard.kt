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
                val rules = RULES.filter { file.name !in it.allowedIn }
                file.readLines().mapIndexedNotNull { i, line ->
                    val code = line.substringBefore("//")
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
        private val COLOUR = setOf("Palette.kt")
        private val FONT = setOf("Type.kt", "Palette.kt")
        // BootMark.kt keeps its own timings until B1b replaces it with the Part 26 opening screen.
        private val MOTION = setOf("Motion.kt", "BootMark.kt")
        val RULES = listOf(
            Rule("raw colour", Regex("""\bColor\(0x"""), COLOUR),
            Rule("named colour", Regex("""\bColor\.(Black|White|Red|Gray|Grey|Blue|Green|Yellow|Cyan|Magenta|DarkGray|LightGray)\b"""), COLOUR),
            Rule("system font", Regex("""\bFontFamily\.(Serif|SansSerif|Monospace|Cursive|Default)\b"""), FONT),
            Rule("raw duration", Regex("""\btween\(\s*\d"""), MOTION),
            Rule("raw spring", Regex("""\bspring\(\s*(dampingRatio|stiffness)"""), MOTION),
            Rule("colour animation", Regex("""\banimateColorAsState\b"""), MOTION),
            Rule("size animation", Regex("""\banimateContentSize\b"""), MOTION),
        )
    }
}
