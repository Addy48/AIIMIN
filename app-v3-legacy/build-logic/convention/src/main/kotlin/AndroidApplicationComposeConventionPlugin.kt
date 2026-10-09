import com.android.build.api.dsl.ApplicationExtension
import config.configureAndroidCompose
import org.gradle.api.Plugin
import org.gradle.api.Project
import org.gradle.kotlin.dsl.apply
import org.gradle.kotlin.dsl.getByType

/** Apply after `aiimin.android.application` — assumes `com.android.application` is present. */
class AndroidApplicationComposeConventionPlugin : Plugin<Project> {
    override fun apply(target: Project) {
        with(target) {
            apply(plugin = "org.jetbrains.kotlin.plugin.compose")
            configureAndroidCompose(extensions.getByType<ApplicationExtension>())
        }
    }
}
