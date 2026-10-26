import com.android.build.api.dsl.ApplicationExtension
import com.android.build.api.dsl.LibraryExtension
import com.android.build.api.dsl.Lint
import org.gradle.api.Plugin
import org.gradle.api.Project
import org.gradle.kotlin.dsl.apply
import org.gradle.kotlin.dsl.configure

class AndroidLintConventionPlugin : Plugin<Project> {
    override fun apply(target: Project) {
        with(target) {
            when {
                pluginManager.hasPlugin("com.android.application") ->
                    configure<ApplicationExtension> { lint(Lint::configureLint) }

                pluginManager.hasPlugin("com.android.library") ->
                    configure<LibraryExtension> { lint(Lint::configureLint) }

                else -> {
                    apply(plugin = "com.android.lint")
                    configure<Lint> { configureLint() }
                }
            }
            val guard = tasks.register("checkThemeTokens", ThemeTokenGuard::class.java) {
                sources.from(fileTree("src/main") { include("**/*.kt") })
                report.set(layout.buildDirectory.file("reports/theme-tokens.txt"))
            }
            tasks.matching { it.name == "preBuild" }.configureEach { dependsOn(guard) }
        }
    }
}

private fun Lint.configureLint() {
    // Reports are always generated on AGP 9; only the analysis scope is ours to set.
    checkDependencies = true
    disable += "GradleDependency"
}
