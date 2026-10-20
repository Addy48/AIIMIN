package aiimin.app.notes

import aiimin.app.MainActivity
import aiimin.core.database.NoteDao
import aiimin.designsystem.theme.LightPalette
import android.content.Context
import android.content.Intent
import android.app.PendingIntent
import android.os.Build
import android.service.quicksettings.TileService
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.appwidget.action.actionStartActivity
import androidx.glance.action.clickable
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.GlanceAppWidgetReceiver
import androidx.glance.appwidget.cornerRadius
import androidx.glance.appwidget.provideContent
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.glance.appwidget.updateAll
import androidx.glance.background
import androidx.glance.layout.Alignment
import androidx.glance.layout.Column
import androidx.glance.layout.Row
import androidx.glance.layout.Spacer
import androidx.glance.layout.fillMaxSize
import androidx.glance.layout.fillMaxWidth
import androidx.glance.layout.height
import androidx.glance.layout.padding
import androidx.glance.text.FontWeight
import androidx.glance.text.Text
import androidx.glance.text.TextStyle
import androidx.glance.unit.ColorProvider
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import dagger.hilt.EntryPoint
import dagger.hilt.InstallIn
import dagger.hilt.android.EntryPointAccessors
import dagger.hilt.components.SingletonComponent
import kotlinx.coroutines.flow.first

@EntryPoint
@InstallIn(SingletonComponent::class)
interface NotesWidgetDeps {
    fun notes(): NoteDao
}

/** Opens AIIMIN at a route key ("newnote", "note" with an id). */
internal fun openIntent(context: Context, go: String, arg: String? = null): Intent =
    Intent(context, MainActivity::class.java).setAction("aiimin.go.$go.${arg.orEmpty()}")
        .putExtra("aiimin_go", go).apply { if (arg != null) putExtra("aiimin_arg", arg) }
        .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)

/**
 * Home-screen Notes widget (Part 11 "Capture"): "New note" opens straight into typing; the three latest notes open
 * with a tap. Locked notes never appear here (Part 11.6). Palette colours; no character art (Raahi's widget poses
 * belong to the Today widget, 1.4).
 */
class NotesWidget : GlanceAppWidget() {
    override suspend fun provideGlance(context: Context, id: GlanceId) {
        val dao = EntryPointAccessors.fromApplication(context.applicationContext, NotesWidgetDeps::class.java).notes()
        val p = LightPalette
        provideContent {
            // Collected inside the session so the list follows the database while the widget is alive.
            val all by dao.all().collectAsState(initial = emptyList())
            val recent = all.filter { !it.locked }.take(3)
            Column(GlanceModifier.fillMaxSize().background(ColorProvider(p.surface)).cornerRadius(16.dp).padding(14.dp)) {
                Row(GlanceModifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
                    Text("Notes", style = TextStyle(color = ColorProvider(p.text), fontSize = 16.sp, fontWeight = FontWeight.Medium), modifier = GlanceModifier.defaultWeight().clickable(actionStartActivity(openIntent(context, "notes"))))
                    Text(
                        "+ New note",
                        style = TextStyle(color = ColorProvider(p.onInk), fontSize = 14.sp, fontWeight = FontWeight.Medium),
                        modifier = GlanceModifier.background(ColorProvider(p.text)).cornerRadius(8.dp).padding(horizontal = 12.dp, vertical = 8.dp)
                            .clickable(actionStartActivity(openIntent(context, "newnote"))),
                    )
                }
                Spacer(GlanceModifier.height(8.dp))
                if (recent.isEmpty()) Text("Nothing written yet.", style = TextStyle(color = ColorProvider(p.textMuted), fontSize = 13.sp))
                recent.forEach { n ->
                    Column(GlanceModifier.fillMaxWidth().padding(vertical = 5.dp).clickable(actionStartActivity(openIntent(context, "note", n.id)))) {
                        Text(n.title, style = TextStyle(color = ColorProvider(p.text), fontSize = 14.sp, fontWeight = FontWeight.Medium), maxLines = 1)
                        val preview = aiimin.core.data.notes.notePreview(n.body)
                        if (preview.isNotBlank()) Text(preview, style = TextStyle(color = ColorProvider(p.textMuted), fontSize = 12.sp), maxLines = 1)
                    }
                }
            }
        }
    }

    companion object {
        /** Called when AIIMIN leaves the screen, so the widget shows the latest notes. */
        suspend fun refresh(context: Context) = runCatching { NotesWidget().updateAll(context) }
    }
}

class NotesWidgetReceiver : GlanceAppWidgetReceiver() {
    override val glanceAppWidget: GlanceAppWidget = NotesWidget()
}

/** Quick-settings tile "New note" (Part 11 "Capture"). */
class NewNoteTile : TileService() {
    override fun onClick() {
        super.onClick()
        val i = openIntent(this, "newnote")
        if (Build.VERSION.SDK_INT >= 34) {
            startActivityAndCollapse(PendingIntent.getActivity(this, 7, i, PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT))
        } else {
            @Suppress("DEPRECATION")
            startActivityAndCollapse(i)
        }
    }
}
