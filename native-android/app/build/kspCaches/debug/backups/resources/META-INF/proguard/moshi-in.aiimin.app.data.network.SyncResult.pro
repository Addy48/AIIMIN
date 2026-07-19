-if class in.aiimin.app.data.network.SyncResult
-keepnames class in.aiimin.app.data.network.SyncResult
-if class in.aiimin.app.data.network.SyncResult
-keep class in.aiimin.app.data.network.SyncResultJsonAdapter {
    public <init>(com.squareup.moshi.Moshi);
}
-if class in.aiimin.app.data.network.SyncResult
-keepnames class kotlin.jvm.internal.DefaultConstructorMarker
-if class in.aiimin.app.data.network.SyncResult
-keepclassmembers class in.aiimin.app.data.network.SyncResult {
    public synthetic <init>(java.lang.String,boolean,java.lang.String,java.lang.String,int,kotlin.jvm.internal.DefaultConstructorMarker);
}
