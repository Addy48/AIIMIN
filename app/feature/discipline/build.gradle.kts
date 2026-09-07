plugins {
    alias(libs.plugins.aiimin.android.feature)
}
android {
    namespace = "aiimin.feature.discipline"
}
dependencies {
    testImplementation(libs.bundles.unit.test)
}
