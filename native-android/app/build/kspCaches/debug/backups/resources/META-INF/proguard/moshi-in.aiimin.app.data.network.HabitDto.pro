-if class in.aiimin.app.data.network.HabitDto
-keepnames class in.aiimin.app.data.network.HabitDto
-if class in.aiimin.app.data.network.HabitDto
-keep class in.aiimin.app.data.network.HabitDtoJsonAdapter {
    public <init>(com.squareup.moshi.Moshi);
}
-if class in.aiimin.app.data.network.HabitDto
-keepnames class kotlin.jvm.internal.DefaultConstructorMarker
-if class in.aiimin.app.data.network.HabitDto
-keepclassmembers class in.aiimin.app.data.network.HabitDto {
    public synthetic <init>(java.lang.String,java.lang.String,java.lang.String,java.lang.String,java.lang.String,int,kotlin.jvm.internal.DefaultConstructorMarker);
}
