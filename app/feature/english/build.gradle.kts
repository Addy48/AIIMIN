plugins {
    alias(libs.plugins.aiimin.android.feature)
}

android {
    namespace = "aiimin.feature.english"
}

dependencies {
    testImplementation(libs.bundles.unit.test)
}
