plugins {
    alias(libs.plugins.aiimin.android.feature)
}

android {
    namespace = "aiimin.feature.lab"
}

dependencies {
    testImplementation(libs.bundles.unit.test)
}
