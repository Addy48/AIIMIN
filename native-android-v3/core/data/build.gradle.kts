plugins {
    alias(libs.plugins.aiimin.android.library)
    alias(libs.plugins.aiimin.hilt)
}

android {
    namespace = "aiimin.core.data"
}

dependencies {
    api(projects.core.model)
    implementation(libs.kotlinx.coroutines.android)
    implementation(libs.androidx.datastore.preferences)

    testImplementation(libs.bundles.unit.test)
    testImplementation(libs.kotlinx.coroutines.test)
}
