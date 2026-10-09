package config

import com.android.build.api.variant.LibraryAndroidComponentsExtension
import org.gradle.api.Project

/** Skip test-APK generation for library modules that have no `src/androidTest`. */
internal fun LibraryAndroidComponentsExtension.disableUnnecessaryAndroidTests(project: Project) =
    beforeVariants {
        it.enableAndroidTest = it.enableAndroidTest &&
            project.projectDir.resolve("src/androidTest").exists()
    }
