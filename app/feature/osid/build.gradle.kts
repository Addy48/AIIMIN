plugins {
    alias(libs.plugins.aiimin.android.feature)
}

android {
    namespace = "aiimin.feature.osid"
}

dependencies {
    testImplementation(libs.bundles.unit.test)
}
