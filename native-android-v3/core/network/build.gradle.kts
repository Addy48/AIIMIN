plugins {
    alias(libs.plugins.aiimin.android.library)
    alias(libs.plugins.aiimin.hilt)
    alias(libs.plugins.aiimin.kotlin.serialization)
}

android {
    namespace = "aiimin.core.network"

    buildFeatures {
        buildConfig = true
    }

    defaultConfig {
        buildConfigField("String", "API_BASE_URL", "\"https://api.aiimin.in/api/\"")
    }
}

dependencies {
    api(projects.core.model)
    implementation(libs.kotlinx.coroutines.android)
    implementation(libs.kotlinx.serialization.json)
    implementation(libs.okhttp.logging.interceptor)
    implementation(libs.retrofit)
    implementation(libs.retrofit.kotlinx.serialization)

    testImplementation(libs.bundles.unit.test)
    testImplementation(libs.kotlinx.coroutines.test)
}
