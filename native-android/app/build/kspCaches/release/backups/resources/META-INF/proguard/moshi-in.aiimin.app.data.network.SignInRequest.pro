-if class in.aiimin.app.data.network.SignInRequest
-keepnames class in.aiimin.app.data.network.SignInRequest
-if class in.aiimin.app.data.network.SignInRequest
-keep class in.aiimin.app.data.network.SignInRequestJsonAdapter {
    public <init>(com.squareup.moshi.Moshi);
}
