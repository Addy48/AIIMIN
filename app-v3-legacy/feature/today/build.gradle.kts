plugins {
    alias(libs.plugins.aiimin.android.feature)
}

android {
    namespace = "aiimin.feature.today"
}

dependencies {
    testImplementation(libs.bundles.unit.test)
    implementation(libs.androidx.activity.compose)
}
