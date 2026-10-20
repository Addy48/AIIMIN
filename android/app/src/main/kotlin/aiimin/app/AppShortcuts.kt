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

    /** PRD Part 17.4: New note, Pour, Emergency card, Add expense. */
    val specs = listOf(
        Spec("note", "New note", "Write a new note", R.drawable.ic_shortcut_note),
        Spec("pour", "Pour", "Write privately", R.drawable.ic_shortcut_pour),
        Spec("emergency", "Emergency", "My emergency card", R.drawable.ic_shortcut_emergency),
        Spec("expense", "Expense", "Add an expense", R.drawable.ic_shortcut_expense),
    )

    fun requestFor(id: String?): LaunchRequest? = when (id) {
        "note" -> LaunchRequest.Open(Route.Note(null))
        // Pour is built in B7b; until then its shortcut opens the private writer.
        "pour" -> LaunchRequest.Open(Route.JournalWrite())
        "emergency" -> LaunchRequest.Open(Route.EmergencyCard("me"))
        "expense" -> LaunchRequest.Capture("", type = "expense")
        // Older pinned shortcuts keep working.
        "capture" -> LaunchRequest.Capture("")
        "review" -> LaunchRequest.Open(Route.MoneyInbox)
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
