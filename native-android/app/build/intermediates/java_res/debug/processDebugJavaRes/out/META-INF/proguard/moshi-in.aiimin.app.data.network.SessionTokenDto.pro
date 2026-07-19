-if class in.aiimin.app.data.network.SessionTokenDto
-keepnames class in.aiimin.app.data.network.SessionTokenDto
-if class in.aiimin.app.data.network.SessionTokenDto
-keep class in.aiimin.app.data.network.SessionTokenDtoJsonAdapter {
    public <init>(com.squareup.moshi.Moshi);
}
-if class in.aiimin.app.data.network.SessionTokenDto
-keepnames class kotlin.jvm.internal.DefaultConstructorMarker
-if class in.aiimin.app.data.network.SessionTokenDto
-keepclassmembers class in.aiimin.app.data.network.SessionTokenDto {
    public synthetic <init>(java.lang.String,java.lang.String,int,kotlin.jvm.internal.DefaultConstructorMarker);
}
