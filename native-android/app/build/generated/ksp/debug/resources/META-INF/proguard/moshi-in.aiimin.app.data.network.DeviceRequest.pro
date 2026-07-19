-if class in.aiimin.app.data.network.DeviceRequest
-keepnames class in.aiimin.app.data.network.DeviceRequest
-if class in.aiimin.app.data.network.DeviceRequest
-keep class in.aiimin.app.data.network.DeviceRequestJsonAdapter {
    public <init>(com.squareup.moshi.Moshi);
}
-if class in.aiimin.app.data.network.DeviceRequest
-keepnames class kotlin.jvm.internal.DefaultConstructorMarker
-if class in.aiimin.app.data.network.DeviceRequest
-keepclassmembers class in.aiimin.app.data.network.DeviceRequest {
    public synthetic <init>(java.lang.String,java.lang.String,java.lang.String,int,kotlin.jvm.internal.DefaultConstructorMarker);
}
