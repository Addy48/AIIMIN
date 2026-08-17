import config.configureKotlinJvm
import config.libs
import org.gradle.api.Plugin
import org.gradle.api.Project
import org.gradle.kotlin.dsl.apply
import org.gradle.kotlin.dsl.dependencies

/** Pure-Kotlin modules (domain models, use cases) — no Android on the classpath. */
class JvmLibraryConventionPlugin : Plugin<Project> {
    override fun apply(target: Project) {
        with(target) {
            apply(plugin = "org.jetbrains.kotlin.jvm")
            apply(plugin = "aiimin.android.lint")

            configureKotlinJvm()

            dependencies {
                add("testImplementation", libs.findLibrary("kotlin.test").get())
            }
        }
    }
}
