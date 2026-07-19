-if class in.aiimin.app.data.network.ResumeDto
-keepnames class in.aiimin.app.data.network.ResumeDto
-if class in.aiimin.app.data.network.ResumeDto
-keep class in.aiimin.app.data.network.ResumeDtoJsonAdapter {
    public <init>(com.squareup.moshi.Moshi);
}
-if class in.aiimin.app.data.network.ResumeDto
-keepnames class kotlin.jvm.internal.DefaultConstructorMarker
-if class in.aiimin.app.data.network.ResumeDto
-keepclassmembers class in.aiimin.app.data.network.ResumeDto {
    public synthetic <init>(java.lang.String,java.lang.String,java.lang.String,java.lang.String,int,kotlin.jvm.internal.DefaultConstructorMarker);
}
