import com.android.build.api.dsl.LibraryExtension
import com.android.build.api.variant.LibraryAndroidComponentsExtension
import config.configureKotlinAndroid
import config.disableUnnecessaryAndroidTests
import config.libs
import org.gradle.api.Plugin
import org.gradle.api.Project
import org.gradle.kotlin.dsl.apply
import org.gradle.kotlin.dsl.configure
import org.gradle.kotlin.dsl.dependencies

/** Baseline for every `:core:*` and `:feature:*` Android library module. */
class AndroidLibraryConventionPlugin : Plugin<Project> {
    override fun apply(target: Project) {
        with(target) {
            apply(plugin = "com.android.library")
            apply(plugin = "aiimin.android.lint")

            val targetSdkVersion = libs.findVersion("targetSdk").get().toString().toInt()

            extensions.configure<LibraryExtension> {
                configureKotlinAndroid(this)

                defaultConfig {
                    testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
                }
                testOptions {
                    targetSdk = targetSdkVersion
                    animationsDisabled = true
                }
                lint {
                    targetSdk = targetSdkVersion
                }

                // :core:designsystem -> core_designsystem_
                resourcePrefix = path.split("""\W""".toRegex())
                    .drop(1)
                    .distinct()
                    .joinToString(separator = "_")
                    .lowercase() + "_"
            }

            extensions.configure<LibraryAndroidComponentsExtension> {
                disableUnnecessaryAndroidTests(target)
            }

            dependencies {
                add("testImplementation", libs.findLibrary("kotlin.test").get())
                add("testImplementation", libs.findLibrary("junit").get())
                add("androidTestImplementation", libs.findLibrary("kotlin.test").get())
            }
        }
    }
}
