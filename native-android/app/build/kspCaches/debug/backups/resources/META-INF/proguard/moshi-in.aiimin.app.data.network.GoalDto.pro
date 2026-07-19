-if class in.aiimin.app.data.network.GoalDto
-keepnames class in.aiimin.app.data.network.GoalDto
-if class in.aiimin.app.data.network.GoalDto
-keep class in.aiimin.app.data.network.GoalDtoJsonAdapter {
    public <init>(com.squareup.moshi.Moshi);
}
-if class in.aiimin.app.data.network.GoalDto
-keepnames class kotlin.jvm.internal.DefaultConstructorMarker
-if class in.aiimin.app.data.network.GoalDto
-keepclassmembers class in.aiimin.app.data.network.GoalDto {
    public synthetic <init>(java.lang.String,java.lang.String,java.lang.Object,java.lang.String,java.lang.String,java.lang.Object,int,kotlin.jvm.internal.DefaultConstructorMarker);
}
