plugins {
    alias(libs.plugins.aiimin.android.feature)
}

android {
    namespace = "aiimin.feature.onboarding"
}

dependencies {
    testImplementation(libs.bundles.unit.test)
    // Real org.json on the JVM (Android's is a stub in unit tests).
    testImplementation(libs.org.json)
}
