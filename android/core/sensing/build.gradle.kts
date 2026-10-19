plugins {
    alias(libs.plugins.aiimin.android.library)
    alias(libs.plugins.aiimin.hilt)
}

android {
    namespace = "aiimin.core.sensing"
    testOptions {
        unitTests.isReturnDefaultValues = true
    }
}

dependencies {
    api(libs.health.connect.client)
    implementation(libs.kotlinx.coroutines.android)
    implementation(libs.androidx.core.ktx)

    testImplementation(libs.bundles.unit.test)
}
