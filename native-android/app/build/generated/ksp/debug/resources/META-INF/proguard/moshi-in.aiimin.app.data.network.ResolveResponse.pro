-if class in.aiimin.app.data.network.ResolveResponse
-keepnames class in.aiimin.app.data.network.ResolveResponse
-if class in.aiimin.app.data.network.ResolveResponse
-keep class in.aiimin.app.data.network.ResolveResponseJsonAdapter {
    public <init>(com.squareup.moshi.Moshi);
}
-if class in.aiimin.app.data.network.ResolveResponse
-keepnames class kotlin.jvm.internal.DefaultConstructorMarker
-if class in.aiimin.app.data.network.ResolveResponse
-keepclassmembers class in.aiimin.app.data.network.ResolveResponse {
    public synthetic <init>(java.lang.String,java.lang.String,int,kotlin.jvm.internal.DefaultConstructorMarker);
}
