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
            .filter { it.isFile && it.extension == "kt" && it.name !in ALLOWED }
            .sortedBy { it.path }
            .flatMap { file ->
                file.readLines().mapIndexedNotNull { i, line ->
                    val code = line.substringBefore("//")
                    if (FORBIDDEN.any { it.containsMatchIn(code) }) "${file.path}:${i + 1}: ${line.trim()}" else null
                }
            }
        report.get().asFile.writeText(hits.joinToString("\n"))
        if (hits.isNotEmpty()) {
            throw GradleException(
                "Theme tokens only (PRD Part 29): ${hits.size} raw colour or system font use(s) outside Palette.kt/Type.kt:\n" +
                    hits.joinToString("\n"),
            )
        }
    }

    companion object {
        val ALLOWED = setOf("Palette.kt", "Type.kt")
        val FORBIDDEN = listOf(
            Regex("""\bColor\(0x"""),
            Regex("""\bColor\.(Black|White|Red|Gray|Grey|Blue|Green|Yellow|Cyan|Magenta|DarkGray|LightGray)\b"""),
            Regex("""\bFontFamily\.(Serif|SansSerif|Monospace|Cursive|Default)\b"""),
        )
    }
}
