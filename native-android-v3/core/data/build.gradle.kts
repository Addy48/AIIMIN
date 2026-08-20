plugins {
    alias(libs.plugins.aiimin.android.library)
    alias(libs.plugins.aiimin.hilt)
    alias(libs.plugins.aiimin.kotlin.serialization)
}

android {
    namespace = "aiimin.core.data"
}

dependencies {
    api(projects.core.model)
    api(projects.core.network)
    api(libs.health.connect.client)
    implementation(libs.kotlinx.coroutines.android)
    implementation(libs.kotlinx.serialization.json)
    implementation(libs.androidx.datastore.preferences)
    implementation(libs.androidx.core.ktx)

    testImplementation(libs.bundles.unit.test)
    testImplementation(libs.kotlinx.coroutines.test)
}
