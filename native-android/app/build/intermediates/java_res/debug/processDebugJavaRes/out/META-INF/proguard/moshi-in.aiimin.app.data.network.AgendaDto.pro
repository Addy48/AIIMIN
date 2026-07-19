-if class in.aiimin.app.data.network.AgendaDto
-keepnames class in.aiimin.app.data.network.AgendaDto
-if class in.aiimin.app.data.network.AgendaDto
-keep class in.aiimin.app.data.network.AgendaDtoJsonAdapter {
    public <init>(com.squareup.moshi.Moshi);
}
-if class in.aiimin.app.data.network.AgendaDto
-keepnames class kotlin.jvm.internal.DefaultConstructorMarker
-if class in.aiimin.app.data.network.AgendaDto
-keepclassmembers class in.aiimin.app.data.network.AgendaDto {
    public synthetic <init>(java.lang.String,java.lang.String,java.lang.String,int,kotlin.jvm.internal.DefaultConstructorMarker);
}
