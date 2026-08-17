package aiimin.app.widget

import android.content.Context
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.action.actionStartActivity
import androidx.glance.action.clickable
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.GlanceAppWidgetReceiver
import androidx.glance.appwidget.provideContent
import androidx.glance.background
import androidx.glance.color.ColorProvider as glanceColor
import androidx.glance.layout.Alignment
import androidx.glance.layout.Column
import androidx.glance.layout.Row
import androidx.glance.layout.Spacer
import androidx.glance.layout.fillMaxSize
import androidx.glance.layout.fillMaxWidth
import androidx.glance.layout.height
import androidx.glance.layout.padding
import androidx.glance.text.FontFamily
import androidx.glance.text.FontWeight
import androidx.glance.text.Text
import androidx.glance.text.TextStyle
import androidx.glance.unit.ColorProvider
import aiimin.app.MainActivity
import aiimin.app.di.WidgetEntryPoint
import aiimin.core.data.WidgetSnapshot
import dagger.hilt.android.EntryPointAccessors

/**
 * Ambient Day plate. Steel, square, no purple.
 * Score is server-published only — never recomputed here.
 */
class DayGlanceWidget : GlanceAppWidget() {

    override suspend fun provideGlance(context: Context, id: GlanceId) {
        val snap = runCatching {
            EntryPointAccessors.fromApplication(
                context.applicationContext,
                WidgetEntryPoint::class.java,
            ).widgetSnapshot().state.value
        }.getOrDefault(WidgetSnapshot.empty())
        provideContent {
            DayPlate(snap)
        }
    }
}

@Composable
private fun DayPlate(snap: WidgetSnapshot) {
    val bg = glanceColor(day = Color(0xFF15171A), night = Color(0xFF15171A))
    val steel = glanceColor(day = Color(0xFF749DC4), night = Color(0xFF749DC4))
    val ink = glanceColor(day = Color(0xFFE8EAED), night = Color(0xFFE8EAED))
    val mute = glanceColor(day = Color(0xFF8B919A), night = Color(0xFF8B919A))
    val hair = glanceColor(day = Color(0xFF2A2E33), night = Color(0xFF2A2E33))
    Column(
        modifier = GlanceModifier
            .fillMaxSize()
            .background(bg)
            .clickable(actionStartActivity<MainActivity>())
            .padding(14.dp),
        verticalAlignment = Alignment.Top,
        horizontalAlignment = Alignment.Start,
    ) {
        Text(
            text = "AIIMIN · ${snap.osId ?: "DAY"}",
            style = TextStyle(
                color = steel,
                fontSize = 10.sp,
                fontWeight = FontWeight.Medium,
                fontFamily = FontFamily.Monospace,
            ),
        )
        Spacer(GlanceModifier.height(8.dp))
        Row(modifier = GlanceModifier.fillMaxWidth()) {
            Figure("SCORE", snap.score?.toString() ?: "—", ink, mute, GlanceModifier.defaultWeight())
            Figure("STEPS", snap.steps?.let { "%,d".format(it) } ?: "—", ink, mute, GlanceModifier.defaultWeight())
            Figure("SCREEN", snap.screenLabel ?: "—", ink, mute, GlanceModifier.defaultWeight())
        }
        Spacer(GlanceModifier.height(10.dp))
        Spacer(GlanceModifier.fillMaxWidth().height(1.dp).background(hair))
    }
}

@Composable
private fun Figure(
    label: String,
    value: String,
    ink: ColorProvider,
    mute: ColorProvider,
    modifier: GlanceModifier,
) {
    Column(modifier = modifier, horizontalAlignment = Alignment.Start) {
        Text(
            text = label,
            style = TextStyle(color = mute, fontSize = 9.sp, fontFamily = FontFamily.Monospace),
        )
        Text(
            text = value,
            style = TextStyle(
                color = ink,
                fontSize = 16.sp,
                fontWeight = FontWeight.Medium,
                fontFamily = FontFamily.Monospace,
            ),
        )
    }
}

class DayGlanceWidgetReceiver : GlanceAppWidgetReceiver() {
    override val glanceAppWidget: GlanceAppWidget = DayGlanceWidget()
}
