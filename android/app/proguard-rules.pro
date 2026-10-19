# kotlinx.serialization keeps its generated serializers reflectively.
-keepattributes *Annotation*, InnerClasses
-dontnote kotlinx.serialization.**
-keepclassmembers class **$$serializer { *; }
-keepclasseswithmembers class ** {
    kotlinx.serialization.KSerializer serializer(...);
}

# Navigation3 back stack keys are restored by name.
-keep class aiimin.app.navigation.** { *; }

# ML Kit (Vault text reading) builds its component registrars by reflection; R8 full mode drops their
# empty constructors unless kept, and text recognition then fails in release builds only.
-keep class * implements com.google.firebase.components.ComponentRegistrar { <init>(); }
