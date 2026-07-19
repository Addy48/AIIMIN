-if class in.aiimin.app.data.network.NoteDto
-keepnames class in.aiimin.app.data.network.NoteDto
-if class in.aiimin.app.data.network.NoteDto
-keep class in.aiimin.app.data.network.NoteDtoJsonAdapter {
    public <init>(com.squareup.moshi.Moshi);
}
-if class in.aiimin.app.data.network.NoteDto
-keepnames class kotlin.jvm.internal.DefaultConstructorMarker
-if class in.aiimin.app.data.network.NoteDto
-keepclassmembers class in.aiimin.app.data.network.NoteDto {
    public synthetic <init>(java.lang.String,java.lang.String,java.lang.String,java.lang.String,java.lang.Boolean,int,kotlin.jvm.internal.DefaultConstructorMarker);
}
