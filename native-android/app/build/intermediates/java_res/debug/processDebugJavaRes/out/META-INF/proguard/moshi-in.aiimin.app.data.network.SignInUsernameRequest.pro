-if class in.aiimin.app.data.network.SignInUsernameRequest
-keepnames class in.aiimin.app.data.network.SignInUsernameRequest
-if class in.aiimin.app.data.network.SignInUsernameRequest
-keep class in.aiimin.app.data.network.SignInUsernameRequestJsonAdapter {
    public <init>(com.squareup.moshi.Moshi);
}
