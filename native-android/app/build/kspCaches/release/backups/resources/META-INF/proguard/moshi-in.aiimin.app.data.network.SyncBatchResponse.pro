-if class in.aiimin.app.data.network.SyncBatchResponse
-keepnames class in.aiimin.app.data.network.SyncBatchResponse
-if class in.aiimin.app.data.network.SyncBatchResponse
-keep class in.aiimin.app.data.network.SyncBatchResponseJsonAdapter {
    public <init>(com.squareup.moshi.Moshi);
}
-if class in.aiimin.app.data.network.SyncBatchResponse
-keepnames class kotlin.jvm.internal.DefaultConstructorMarker
-if class in.aiimin.app.data.network.SyncBatchResponse
-keepclassmembers class in.aiimin.app.data.network.SyncBatchResponse {
    public synthetic <init>(java.util.List,java.lang.String,java.lang.String,int,kotlin.jvm.internal.DefaultConstructorMarker);
}
