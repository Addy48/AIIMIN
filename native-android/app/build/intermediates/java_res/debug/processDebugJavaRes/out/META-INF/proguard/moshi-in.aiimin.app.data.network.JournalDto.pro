-if class in.aiimin.app.data.network.JournalDto
-keepnames class in.aiimin.app.data.network.JournalDto
-if class in.aiimin.app.data.network.JournalDto
-keep class in.aiimin.app.data.network.JournalDtoJsonAdapter {
    public <init>(com.squareup.moshi.Moshi);
}
-if class in.aiimin.app.data.network.JournalDto
-keepnames class kotlin.jvm.internal.DefaultConstructorMarker
-if class in.aiimin.app.data.network.JournalDto
-keepclassmembers class in.aiimin.app.data.network.JournalDto {
    public synthetic <init>(java.lang.String,java.lang.String,java.lang.String,java.lang.String,int,kotlin.jvm.internal.DefaultConstructorMarker);
}
