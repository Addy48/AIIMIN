-if class in.aiimin.app.data.network.BootstrapUser
-keepnames class in.aiimin.app.data.network.BootstrapUser
-if class in.aiimin.app.data.network.BootstrapUser
-keep class in.aiimin.app.data.network.BootstrapUserJsonAdapter {
    public <init>(com.squareup.moshi.Moshi);
}
-if class in.aiimin.app.data.network.BootstrapUser
-keepnames class kotlin.jvm.internal.DefaultConstructorMarker
-if class in.aiimin.app.data.network.BootstrapUser
-keepclassmembers class in.aiimin.app.data.network.BootstrapUser {
    public synthetic <init>(java.lang.String,java.lang.String,java.lang.String,int,kotlin.jvm.internal.DefaultConstructorMarker);
}
