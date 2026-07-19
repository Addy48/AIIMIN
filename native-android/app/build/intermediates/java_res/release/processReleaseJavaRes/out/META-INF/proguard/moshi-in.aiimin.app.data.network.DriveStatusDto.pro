-if class in.aiimin.app.data.network.DriveStatusDto
-keepnames class in.aiimin.app.data.network.DriveStatusDto
-if class in.aiimin.app.data.network.DriveStatusDto
-keep class in.aiimin.app.data.network.DriveStatusDtoJsonAdapter {
    public <init>(com.squareup.moshi.Moshi);
}
-if class in.aiimin.app.data.network.DriveStatusDto
-keepnames class kotlin.jvm.internal.DefaultConstructorMarker
-if class in.aiimin.app.data.network.DriveStatusDto
-keepclassmembers class in.aiimin.app.data.network.DriveStatusDto {
    public synthetic <init>(java.lang.Boolean,java.util.List,int,kotlin.jvm.internal.DefaultConstructorMarker);
}
