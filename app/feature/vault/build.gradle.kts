plugins {
    alias(libs.plugins.aiimin.android.feature)
}

android {
    namespace = "aiimin.feature.vault"
}

dependencies {
    implementation(libs.mlkit.document.scanner)
}
