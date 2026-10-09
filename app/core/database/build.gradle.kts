plugins {
    alias(libs.plugins.aiimin.android.library)
    alias(libs.plugins.aiimin.android.room)
    alias(libs.plugins.aiimin.hilt)
}

android {
    namespace = "aiimin.core.database"
}

dependencies {
    api(libs.room3.runtime)
    implementation(libs.kotlinx.coroutines.android)
}
