plugins {
    alias(libs.plugins.aiimin.android.feature)
}

android {
    namespace = "aiimin.feature.capture"
}

dependencies {
    testImplementation(libs.bundles.unit.test)
    implementation(projects.core.network)
    implementation(libs.mlkit.text.recognition)
    implementation(libs.kotlinx.coroutines.android)
}
