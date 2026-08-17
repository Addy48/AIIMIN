import com.android.build.api.dsl.ApplicationExtension
import config.configureKotlinAndroid
import config.libs
import org.gradle.api.Plugin
import org.gradle.api.Project
import org.gradle.kotlin.dsl.apply
import org.gradle.kotlin.dsl.configure

/** `:app` baseline. AGP 9 has Kotlin built in — no `kotlin-android` plugin needed. */
class AndroidApplicationConventionPlugin : Plugin<Project> {
    override fun apply(target: Project) {
        with(target) {
            apply(plugin = "com.android.application")
            apply(plugin = "aiimin.android.lint")

            extensions.configure<ApplicationExtension> {
                configureKotlinAndroid(this)

                defaultConfig {
                    targetSdk = libs.findVersion("targetSdk").get().toString().toInt()
                    testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
                }

                testOptions {
                    animationsDisabled = true
                }
            }
        }
    }
}
