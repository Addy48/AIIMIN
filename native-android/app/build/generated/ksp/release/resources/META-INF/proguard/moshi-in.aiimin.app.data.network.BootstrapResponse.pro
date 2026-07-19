-if class in.aiimin.app.data.network.BootstrapResponse
-keepnames class in.aiimin.app.data.network.BootstrapResponse
-if class in.aiimin.app.data.network.BootstrapResponse
-keep class in.aiimin.app.data.network.BootstrapResponseJsonAdapter {
    public <init>(com.squareup.moshi.Moshi);
}
-if class in.aiimin.app.data.network.BootstrapResponse
-keepnames class kotlin.jvm.internal.DefaultConstructorMarker
-if class in.aiimin.app.data.network.BootstrapResponse
-keepclassmembers class in.aiimin.app.data.network.BootstrapResponse {
    public synthetic <init>(in.aiimin.app.data.network.BootstrapUser,java.util.List,java.util.List,java.util.List,java.util.List,java.util.List,java.lang.Object,java.util.List,java.util.List,java.util.List,in.aiimin.app.data.network.DriveStatusDto,java.lang.String,java.lang.String,java.lang.String,int,kotlin.jvm.internal.DefaultConstructorMarker);
}
