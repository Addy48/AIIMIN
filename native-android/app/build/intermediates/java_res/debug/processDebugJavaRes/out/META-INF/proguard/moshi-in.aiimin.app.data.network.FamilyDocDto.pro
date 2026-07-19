-if class in.aiimin.app.data.network.FamilyDocDto
-keepnames class in.aiimin.app.data.network.FamilyDocDto
-if class in.aiimin.app.data.network.FamilyDocDto
-keep class in.aiimin.app.data.network.FamilyDocDtoJsonAdapter {
    public <init>(com.squareup.moshi.Moshi);
}
-if class in.aiimin.app.data.network.FamilyDocDto
-keepnames class kotlin.jvm.internal.DefaultConstructorMarker
-if class in.aiimin.app.data.network.FamilyDocDto
-keepclassmembers class in.aiimin.app.data.network.FamilyDocDto {
    public synthetic <init>(java.lang.String,java.lang.String,java.lang.String,java.lang.String,java.lang.String,java.lang.String,int,kotlin.jvm.internal.DefaultConstructorMarker);
}
