plugins {
    alias(libs.plugins.aiimin.android.feature)
}

android {
    namespace = "aiimin.feature.capture"
}

dependencies {
    testImplementation(libs.bundles.unit.test)
}
