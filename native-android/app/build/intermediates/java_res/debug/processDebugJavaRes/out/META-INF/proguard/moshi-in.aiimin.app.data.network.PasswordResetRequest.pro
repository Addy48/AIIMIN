-if class in.aiimin.app.data.network.PasswordResetRequest
-keepnames class in.aiimin.app.data.network.PasswordResetRequest
-if class in.aiimin.app.data.network.PasswordResetRequest
-keep class in.aiimin.app.data.network.PasswordResetRequestJsonAdapter {
    public <init>(com.squareup.moshi.Moshi);
}
-if class in.aiimin.app.data.network.PasswordResetRequest
-keepnames class kotlin.jvm.internal.DefaultConstructorMarker
-if class in.aiimin.app.data.network.PasswordResetRequest
-keepclassmembers class in.aiimin.app.data.network.PasswordResetRequest {
    public synthetic <init>(java.lang.String,java.lang.String,int,kotlin.jvm.internal.DefaultConstructorMarker);
}
