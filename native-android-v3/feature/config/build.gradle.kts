plugins {
    alias(libs.plugins.aiimin.android.feature)
}

android {
    namespace = "aiimin.feature.config"
}

dependencies {
    testImplementation(libs.bundles.unit.test)
}
