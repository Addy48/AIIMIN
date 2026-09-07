import config.libs
import org.gradle.api.Plugin
import org.gradle.api.Project
import org.gradle.kotlin.dsl.apply
import org.gradle.kotlin.dsl.dependencies

/**
 * A `:feature:*` module: Android library + Compose + Hilt + the design system,
 * lifecycle and Navigation3. Core data/domain modules are added to this list as
 * they are introduced (G1 — no speculative wiring).
 */
class AndroidFeatureConventionPlugin : Plugin<Project> {
    override fun apply(target: Project) {
        with(target) {
            apply(plugin = "aiimin.android.library")
            apply(plugin = "aiimin.android.library.compose")
            apply(plugin = "aiimin.hilt")

            dependencies {
                add("implementation", project(":core:designsystem"))
                add("implementation", project(":core:model"))
                add("implementation", project(":core:data"))

                add("implementation", libs.findLibrary("androidx.lifecycle.runtime.compose").get())
                add("implementation", libs.findLibrary("androidx.lifecycle.viewmodel.compose").get())
                add("implementation", libs.findLibrary("androidx.hilt.navigation.compose").get())
                add("implementation", libs.findBundle("navigation3").get())

                add("testImplementation", libs.findBundle("unit.test").get())
            }
        }
    }
}
