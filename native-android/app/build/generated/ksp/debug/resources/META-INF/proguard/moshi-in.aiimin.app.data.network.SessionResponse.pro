-if class in.aiimin.app.data.network.SessionResponse
-keepnames class in.aiimin.app.data.network.SessionResponse
-if class in.aiimin.app.data.network.SessionResponse
-keep class in.aiimin.app.data.network.SessionResponseJsonAdapter {
    public <init>(com.squareup.moshi.Moshi);
}
-if class in.aiimin.app.data.network.SessionResponse
-keepnames class kotlin.jvm.internal.DefaultConstructorMarker
-if class in.aiimin.app.data.network.SessionResponse
-keepclassmembers class in.aiimin.app.data.network.SessionResponse {
    public synthetic <init>(in.aiimin.app.data.network.SessionTokenDto,in.aiimin.app.data.network.BootstrapUser,int,kotlin.jvm.internal.DefaultConstructorMarker);
}
