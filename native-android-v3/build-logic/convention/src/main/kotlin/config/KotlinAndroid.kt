package config

import com.android.build.api.dsl.CommonExtension
import org.gradle.api.JavaVersion
import org.gradle.api.Project
import org.gradle.api.plugins.JavaPluginExtension
import org.gradle.kotlin.dsl.assign
import org.gradle.kotlin.dsl.configure
import org.gradle.kotlin.dsl.dependencies
import org.gradle.kotlin.dsl.withType
import org.jetbrains.kotlin.gradle.dsl.JvmTarget
import org.jetbrains.kotlin.gradle.dsl.KotlinJvmProjectExtension
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

/** Shared Android + Kotlin config: SDK levels, Java 17, desugaring, compiler opt-ins. */
internal fun Project.configureKotlinAndroid(commonExtension: CommonExtension) {
    // AGP 9 keeps the block DSL on ApplicationExtension / LibraryExtension only;
    // CommonExtension exposes these as plain properties.
    commonExtension.compileSdk {
        version = release(libs.findVersion("compileSdk").get().toString().toInt())
    }
    commonExtension.defaultConfig.minSdk = libs.findVersion("minSdk").get().toString().toInt()
    commonExtension.compileOptions.apply {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
        isCoreLibraryDesugaringEnabled = true
    }

    configureKotlinCompileTasks()

    dependencies {
        add("coreLibraryDesugaring", libs.findLibrary("androidx.core.desugaring").get())
    }
}

/** Shared config for pure-JVM modules (no Android). */
internal fun Project.configureKotlinJvm() {
    extensions.configure<JavaPluginExtension> {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    extensions.configure<KotlinJvmProjectExtension> {
        compilerOptions {
            jvmTarget = JvmTarget.JVM_17
            allWarningsAsErrors = warningsAsErrors()
        }
    }
}

private fun Project.warningsAsErrors() =
    providers.gradleProperty("warningsAsErrors").map { it.toBoolean() }.orElse(false)

/**
 * AGP 9 ships Kotlin built in, so `KotlinAndroidProjectExtension` is not registered.
 * Compiler options are set on the compile tasks instead.
 */
private fun Project.configureKotlinCompileTasks() {
    val warningsAsErrors = warningsAsErrors()
    tasks.withType<KotlinCompile>().configureEach {
        compilerOptions {
            jvmTarget = JvmTarget.JVM_17
            allWarningsAsErrors = warningsAsErrors
            freeCompilerArgs.addAll(
                "-opt-in=kotlinx.coroutines.ExperimentalCoroutinesApi",
                "-opt-in=androidx.compose.material3.ExperimentalMaterial3Api",
                "-opt-in=androidx.compose.foundation.ExperimentalFoundationApi",
            )
        }
    }
}
