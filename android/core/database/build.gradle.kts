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


dependencies {
    androidTestImplementation(libs.androidx.junit)
    androidTestImplementation(libs.androidx.espresso.core)
    androidTestImplementation(libs.google.truth)
}
