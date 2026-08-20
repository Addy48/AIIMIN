plugins {
    alias(libs.plugins.aiimin.android.feature)
}

android {
    namespace = "aiimin.feature.money"
}

dependencies {
    testImplementation(libs.bundles.unit.test)
}
