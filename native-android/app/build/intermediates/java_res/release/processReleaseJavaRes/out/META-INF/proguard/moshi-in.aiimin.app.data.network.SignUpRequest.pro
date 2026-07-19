-if class in.aiimin.app.data.network.SignUpRequest
-keepnames class in.aiimin.app.data.network.SignUpRequest
-if class in.aiimin.app.data.network.SignUpRequest
-keep class in.aiimin.app.data.network.SignUpRequestJsonAdapter {
    public <init>(com.squareup.moshi.Moshi);
}
