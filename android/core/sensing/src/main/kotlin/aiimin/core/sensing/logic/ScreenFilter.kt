package aiimin.core.sensing.logic

/**
 * Which foreground packages count as screen time (PRD 3.3). Digital Wellbeing leaves out the launcher, System UI,
 * permission and install dialogs, and its own screens. Always-on displays and makers' screensavers are not use either:
 * on some phones they come to the front as an app after the screen dims, so they are dropped by package here.
 */
object ScreenFilter {
    /** Always-on display and screensaver packages per maker (Samsung, Xiaomi, OnePlus, Vivo, Oppo, Realme, Nothing, Google). */
    val AMBIENT = setOf(
        "com.samsung.android.app.aodservice", "com.samsung.android.app.screensaver",
        "com.miui.aod", "com.miui.screensaver", "com.mi.android.globalscreensaver",
        "com.oneplus.aod", "com.oplus.aod", "com.coloros.aod", "com.realme.aod",
        "com.vivo.nightpearl", "com.vivo.aod",
        "com.nothing.ambient", "com.nothing.aod",
        "com.google.android.deskclock.screensaver", "com.android.dreams.basic", "com.android.dreams.phototable",
        "com.google.android.apps.dreamliner",
    )

    fun counts(pkg: String, homes: Set<String>): Boolean {
        if (pkg.isEmpty() || pkg == "android" || pkg in homes || pkg in AMBIENT) return false
        if (pkg.startsWith("com.android.systemui") || pkg.startsWith("com.android.permissioncontroller") ||
            pkg.startsWith("com.google.android.permissioncontroller") || pkg.startsWith("com.android.packageinstaller") ||
            pkg.startsWith("com.google.android.packageinstaller") || pkg.startsWith("com.android.providers.") ||
            pkg.startsWith("com.google.android.gms") || pkg == "com.android.settings.intelligence" ||
            // Digital Wellbeing leaves its own screens out of its total; so do we, or a self-check never matches.
            pkg == "com.google.android.apps.wellbeing"
        ) {
            return false
        }
        return true
    }

    /** "Checked against your phone" only within 5% of the phone's own total; else it is an estimate. */
    const val CHECKED_WITHIN = 0.05

    fun checked(calibration: Double?): Boolean = calibration != null && kotlin.math.abs(calibration - 1.0) <= CHECKED_WITHIN + 1e-9
}
