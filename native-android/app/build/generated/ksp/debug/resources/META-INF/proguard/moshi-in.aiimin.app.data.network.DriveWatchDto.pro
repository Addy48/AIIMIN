-if class in.aiimin.app.data.network.DriveWatchDto
-keepnames class in.aiimin.app.data.network.DriveWatchDto
-if class in.aiimin.app.data.network.DriveWatchDto
-keep class in.aiimin.app.data.network.DriveWatchDtoJsonAdapter {
    public <init>(com.squareup.moshi.Moshi);
}
-if class in.aiimin.app.data.network.DriveWatchDto
-keepnames class kotlin.jvm.internal.DefaultConstructorMarker
-if class in.aiimin.app.data.network.DriveWatchDto
-keepclassmembers class in.aiimin.app.data.network.DriveWatchDto {
    public synthetic <init>(java.lang.String,java.lang.String,java.lang.Boolean,int,kotlin.jvm.internal.DefaultConstructorMarker);
}
