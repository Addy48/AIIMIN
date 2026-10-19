package aiimin.app

import aiimin.app.ui.LaunchRequest
import aiimin.designsystem.nav.Route
import android.content.Context
import android.content.Intent
import androidx.annotation.DrawableRes
import androidx.core.content.pm.ShortcutInfoCompat
import androidx.core.content.pm.ShortcutManagerCompat
import androidx.core.graphics.drawable.IconCompat

/**
 * Long-press the app icon: four ways straight in. Android recommends at most four,
 * short labels ≤ 10 characters and long labels ≤ 25.
 */
object AppShortcuts {
    const val EXTRA = "aiimin_shortcut"

    data class Spec(val id: String, val short: String, val long: String, @DrawableRes val icon: Int)

    val specs = listOf(
        Spec("capture", "Capture", "Capture anything", R.drawable.ic_shortcut_capture),
        Spec("review", "Review pay", "Review bank payments", R.drawable.ic_shortcut_review),
        Spec("emergency", "Emergency", "My emergency card", R.drawable.ic_shortcut_emergency),
        Spec("phoneday", "Phone day", "Screen time today", R.drawable.ic_shortcut_phoneday),
    )

    fun requestFor(id: String?): LaunchRequest? = when (id) {
        "capture" -> LaunchRequest.Capture("")
        "review" -> LaunchRequest.Open(Route.MoneyInbox)
        "emergency" -> LaunchRequest.Open(Route.EmergencyCard("me"))
        "phoneday" -> LaunchRequest.Open(Route.PhoneDay)
        else -> null
    }

    /** Publishes the shortcuts with this build's own package name, so no app ID is hard-coded. */
    fun publish(context: Context) = runCatching {
        val shortcuts = specs.map { s ->
            ShortcutInfoCompat.Builder(context, s.id)
                .setShortLabel(s.short)
                .setLongLabel(s.long)
                .setIcon(IconCompat.createWithResource(context, s.icon))
                .setIntent(
                    Intent(context, MainActivity::class.java)
                        .setAction(Intent.ACTION_VIEW)
                        .putExtra(EXTRA, s.id)
                        .addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP),
                )
                .build()
        }
        ShortcutManagerCompat.setDynamicShortcuts(context, shortcuts)
    }

    /** Tells the launcher which shortcut was used, so it can rank them. */
    fun reportUsed(context: Context, id: String) = runCatching { ShortcutManagerCompat.reportShortcutUsed(context, id) }
}
