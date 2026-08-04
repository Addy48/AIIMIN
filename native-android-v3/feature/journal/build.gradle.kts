plugins {
    alias(libs.plugins.aiimin.android.feature)
}

android {
    namespace = "aiimin.feature.journal"
}

dependencies {
    testImplementation(libs.bundles.unit.test)
}
