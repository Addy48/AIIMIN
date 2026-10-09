plugins {
    alias(libs.plugins.aiimin.android.feature)
}

android {
    namespace = "aiimin.feature.config"
}

dependencies {
    testImplementation(libs.bundles.unit.test)
    implementation(libs.androidx.activity.compose)
}
