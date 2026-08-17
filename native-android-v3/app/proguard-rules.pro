# kotlinx.serialization keeps its generated serializers reflectively.
-keepattributes *Annotation*, InnerClasses
-dontnote kotlinx.serialization.**
-keepclassmembers class **$$serializer { *; }
-keepclasseswithmembers class ** {
    kotlinx.serialization.KSerializer serializer(...);
}

# Navigation3 back stack keys are restored by name.
-keep class aiimin.app.navigation.** { *; }
