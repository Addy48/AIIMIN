plugins {
    alias(libs.plugins.aiimin.android.feature)
}

android {
    namespace = "aiimin.feature.onboarding"
}

dependencies {
    testImplementation(libs.bundles.unit.test)
    implementation(projects.core.network)
}
