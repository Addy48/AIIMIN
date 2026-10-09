plugins {
    alias(libs.plugins.aiimin.android.library)
    alias(libs.plugins.aiimin.android.library.compose)
}

android {
    namespace = "aiimin.designsystem"
}

dependencies {
    api(libs.bundles.compose)
    implementation(libs.androidx.core.ktx)
    api(libs.androidx.activity.compose)
}
