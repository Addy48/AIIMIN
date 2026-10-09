import androidx.room3.gradle.RoomExtension
import com.google.devtools.ksp.gradle.KspExtension
import config.libs
import org.gradle.api.Plugin
import org.gradle.api.Project
import org.gradle.kotlin.dsl.apply
import org.gradle.kotlin.dsl.configure
import org.gradle.kotlin.dsl.dependencies

/** Room 3 with the bundled SQLite driver and exported schemas for auto-migrations. */
class AndroidRoomConventionPlugin : Plugin<Project> {
    override fun apply(target: Project) {
        with(target) {
            apply(plugin = "androidx.room3")
            apply(plugin = "com.google.devtools.ksp")

            extensions.configure<KspExtension> {
                arg("room.generateKotlin", "true")
            }

            extensions.configure<RoomExtension>("room3") {
                schemaDirectory("$projectDir/schemas")
            }

            dependencies {
                add("implementation", libs.findLibrary("room3.runtime").get())
                add("implementation", libs.findLibrary("androidx.sqlite.bundled").get())
                add("ksp", libs.findLibrary("room3.compiler").get())
            }
        }
    }
}
