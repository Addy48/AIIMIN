plugins {
    alias(libs.plugins.aiimin.android.feature)
}

android {
    namespace = "aiimin.feature.notes"
}

dependencies {
    testImplementation(libs.bundles.unit.test)
}
