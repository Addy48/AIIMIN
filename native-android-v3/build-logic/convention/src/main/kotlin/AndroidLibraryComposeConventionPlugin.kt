import com.android.build.api.dsl.LibraryExtension
import config.configureAndroidCompose
import org.gradle.api.Plugin
import org.gradle.api.Project
import org.gradle.kotlin.dsl.apply
import org.gradle.kotlin.dsl.getByType

/** Apply after `aiimin.android.library` — assumes `com.android.library` is present. */
class AndroidLibraryComposeConventionPlugin : Plugin<Project> {
    override fun apply(target: Project) {
        with(target) {
            apply(plugin = "org.jetbrains.kotlin.plugin.compose")
            configureAndroidCompose(extensions.getByType<LibraryExtension>())
        }
    }
}
