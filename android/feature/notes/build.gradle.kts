plugins {
    alias(libs.plugins.aiimin.android.feature)
}

android {
    namespace = "aiimin.feature.notes"
}

dependencies {
    implementation(libs.androidx.biometric)
    implementation(libs.mlkit.document.scanner)
}
