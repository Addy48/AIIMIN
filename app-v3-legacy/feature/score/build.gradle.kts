plugins {
    alias(libs.plugins.aiimin.android.feature)
}

android {
    namespace = "aiimin.feature.score"
}

dependencies {
    testImplementation(libs.bundles.unit.test)
}
