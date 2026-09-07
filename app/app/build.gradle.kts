plugins {
    alias(libs.plugins.aiimin.android.application)
    alias(libs.plugins.aiimin.android.application.compose)
    alias(libs.plugins.aiimin.hilt)
    alias(libs.plugins.aiimin.kotlin.serialization)
    alias(libs.plugins.screenshot)
}

android {
    namespace = "aiimin.app"

    // Screenshot tests render @Preview composables to PNG on the JVM — that is
    // how a screen is proved to draw here: no device is attached, and running an
    // emulator alongside Gradle would not fit in 8 GB. The plugin wants the flag
    // in gradle.properties (before it applies) *and* on the module.
    @Suppress("UnstableApiUsage")
    experimentalProperties["android.experimental.enableScreenshotTest"] = true

    defaultConfig {
        // Kept from V2 so a Play update stays an update. The Kotlin package is
        // `aiimin.*` because `in` is a Kotlin keyword and backticking every file
        // is not craft.
        applicationId = "in.aiimin.app"
        versionCode = 1
        versionName = "3.0.0-alpha01"
    }

    buildFeatures {
        buildConfig = true
    }

    buildTypes {
        debug {
            // Installs alongside the V2 build while V3 is being brought to parity.
            applicationIdSuffix = ".v3"
            buildConfigField("String", "API_BASE_URL", "\"https://api.aiimin.in/api\"")
        }
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            buildConfigField("String", "API_BASE_URL", "\"https://api.aiimin.in/api\"")
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro",
            )
            // Signed from the environment on CI; falls back to debug locally.
            signingConfig = signingConfigs.getByName("debug")
        }
    }

    packaging {
        resources.excludes += "/META-INF/{AL2.0,LGPL2.1}"
    }
}

dependencies {
    implementation(projects.core.designsystem)
    implementation(projects.core.model)
    implementation(projects.core.data)
    implementation(projects.core.network)
    implementation(projects.feature.capture)
    implementation(projects.feature.today)
    implementation(projects.feature.money)
    implementation(projects.feature.config)
    implementation(projects.feature.osid)
    implementation(projects.feature.onboarding)
    implementation(projects.feature.score)
    implementation(projects.feature.journal)
    implementation(projects.feature.lab)
    implementation(projects.feature.english)
    implementation(projects.feature.notes)
    implementation(projects.feature.discipline)

    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.core.splashscreen)
    implementation(libs.androidx.activity.compose)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.lifecycle.runtime.compose)
    implementation(libs.androidx.lifecycle.viewmodel.compose)
    implementation(libs.bundles.compose)
    implementation(libs.bundles.navigation3)
    implementation(libs.kotlinx.coroutines.android)

    implementation(libs.androidx.work.runtime.ktx)
    implementation(libs.androidx.biometric)
    implementation(libs.androidx.glance.appwidget)

    testImplementation(libs.bundles.unit.test)
    androidTestImplementation(libs.bundles.android.test)
    debugImplementation(libs.androidx.compose.ui.test.manifest)

    screenshotTestImplementation(libs.androidx.compose.ui.tooling)
    screenshotTestImplementation(libs.screenshot.validation.api)
}
