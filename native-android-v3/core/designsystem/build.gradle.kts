plugins {
    alias(libs.plugins.aiimin.android.library)
    alias(libs.plugins.aiimin.android.library.compose)
}

android {
    namespace = "aiimin.designsystem"
}

dependencies {
    api(platform(libs.androidx.compose.bom))
    api(libs.bundles.compose)
    implementation(libs.androidx.core.ktx)

    testImplementation(libs.bundles.unit.test)
}
