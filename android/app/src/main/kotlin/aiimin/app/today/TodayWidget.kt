package aiimin.app.today

import aiimin.app.notes.openIntent
import aiimin.core.data.today.WidgetSource
import aiimin.core.engine.today.WidgetRaahi
import aiimin.core.engine.today.WidgetView
import aiimin.designsystem.R as DsR
import aiimin.designsystem.theme.LightPalette
import android.content.Context
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Paint
import android.graphics.RectF
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.unit.DpSize
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.Image
import androidx.glance.ImageProvider
import androidx.glance.LocalSize
import androidx.glance.action.clickable
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.GlanceAppWidgetReceiver
import androidx.glance.appwidget.SizeMode
import androidx.glance.appwidget.action.actionStartActivity
import androidx.glance.appwidget.cornerRadius
import androidx.glance.appwidget.provideContent
import androidx.glance.appwidget.updateAll
import androidx.glance.background
import androidx.glance.layout.Alignment
import androidx.glance.layout.Box
import androidx.glance.layout.Column
import androidx.glance.layout.ContentScale
import androidx.glance.layout.Row
import androidx.glance.layout.Spacer
import androidx.glance.layout.fillMaxSize
import androidx.glance.layout.fillMaxWidth
import androidx.glance.layout.height
import androidx.glance.layout.padding
import androidx.glance.layout.size
import androidx.glance.layout.width
import androidx.glance.text.FontWeight
import androidx.glance.text.Text
import androidx.glance.text.TextStyle
import androidx.glance.unit.ColorProvider
import dagger.hilt.EntryPoint
import dagger.hilt.InstallIn
import dagger.hilt.android.EntryPointAccessors
import dagger.hilt.components.SingletonComponent

@EntryPoint
@InstallIn(SingletonComponent::class)
interface TodayWidgetDeps {
    fun source(): WidgetSource
}

/**
 * The Today home-screen widget (PRD 1.4): the day arc with the sun (or moon) at now, the same "What now?" line as
 * Today, minimum segments and "+" for capture. Titles are hidden unless the person allows them; no money, bill,
 * document or vault text. Raahi sits small in Quiet and Full (pose 1 by day, pose 14 at sunset), never in Off.
 */
class TodayWidget : GlanceAppWidget() {
    override val sizeMode = SizeMode.Responsive(setOf(SMALL, WIDE))

    override suspend fun provideGlance(context: Context, id: GlanceId) {
        val source = EntryPointAccessors.fromApplication(context.applicationContext, TodayWidgetDeps::class.java).source()
        val view = runCatching { source.snapshot(android.text.format.DateFormat.is24HourFormat(context)) }.getOrNull()
        val arc = view?.let { drawArc(it) }
        provideContent { Content(context, view, arc) }
    }

    @Composable
    private fun Content(context: Context, v: WidgetView?, arc: Bitmap?) {
        val p = LightPalette
        val wide = LocalSize.current.width >= WIDE.width
        val open = actionStartActivity(openIntent(context, "today"))
        Column(
            GlanceModifier.fillMaxSize().background(ColorProvider(p.surface)).cornerRadius(20.dp).padding(16.dp).clickable(open),
        ) {
            Box(GlanceModifier.fillMaxWidth(), contentAlignment = Alignment.BottomEnd) {
                arc?.let { Image(ImageProvider(it), contentDescription = null, modifier = GlanceModifier.fillMaxWidth().height(if (wide) 56.dp else 40.dp), contentScale = ContentScale.FillBounds) }
                v?.raahi?.let { r ->
                    Image(
                        ImageProvider(if (r == WidgetRaahi.EVENING) DsR.drawable.raahi_scene_sitting_sunset else DsR.drawable.raahi_pose_idle_mini),
                        contentDescription = "Raahi",
                        modifier = GlanceModifier.size(if (wide) 40.dp else 28.dp),
                    )
                }
            }
            Spacer(GlanceModifier.height(8.dp))
            if (v == null) {
                Text("Open AIIMIN to start your day.", style = TextStyle(color = ColorProvider(p.textMuted), fontSize = 13.sp))
                return@Column
            }
            if (wide) Text("WHAT NOW?", style = TextStyle(color = ColorProvider(p.textMuted), fontSize = 11.sp, fontWeight = FontWeight.Medium))
            Text(
                v.line, maxLines = if (wide) 1 else 2,
                style = TextStyle(color = ColorProvider(p.text), fontSize = if (wide) 16.sp else 14.sp, fontWeight = FontWeight.Medium),
            )
            Spacer(GlanceModifier.defaultWeight())
            Row(GlanceModifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
                Column(GlanceModifier.defaultWeight()) {
                    if (v.segments.isNotEmpty()) {
                        Row {
                            v.segments.forEachIndexed { i, kept ->
                                if (i > 0) Spacer(GlanceModifier.width(4.dp))
                                Box(GlanceModifier.width(if (wide) 20.dp else 12.dp).height(4.dp).cornerRadius(2.dp).background(ColorProvider(if (kept) p.done else p.segmentTrack))) {}
                            }
                        }
                        Spacer(GlanceModifier.height(4.dp))
                    }
                    if (v.minimums.isNotEmpty()) Text(v.minimums, style = TextStyle(color = ColorProvider(p.textMuted), fontSize = 12.sp))
                }
                if (wide) {
                    Box(
                        GlanceModifier.size(40.dp).cornerRadius(20.dp).background(ColorProvider(p.text)).clickable(actionStartActivity(openIntent(context, "capture"))),
                        contentAlignment = Alignment.Center,
                    ) { Text("+", style = TextStyle(color = ColorProvider(p.onInk), fontSize = 22.sp, fontWeight = FontWeight.Medium)) }
                }
            }
        }
    }

    companion object {
        val SMALL = DpSize(110.dp, 110.dp)
        val WIDE = DpSize(250.dp, 110.dp)

        /** After a minimum tick, a task done or a capture save (the WidgetRefresher in 1.4), and from Pulse. */
        suspend fun refresh(context: Context) = runCatching { TodayWidget().updateAll(context) }

        /**
         * The day arc as a bitmap (at most 600×180 px, 1.4): a soft sky band, the waking day as a hairline arc, the
         * part already lived drawn in ink, and the sun (accent, the widget's one orange) or a pale moon at now.
         */
        fun drawArc(v: WidgetView): Bitmap {
            val p = LightPalette
            val w = 600; val h = 180
            val bmp = Bitmap.createBitmap(w, h, Bitmap.Config.ARGB_8888)
            val c = Canvas(bmp)
            val pad = 14f
            val box = RectF(pad, pad, w - pad, (h - pad) * 2 - pad)
            val sky = Paint(Paint.ANTI_ALIAS_FLAG).apply { color = (if (v.night) p.violetSoft else p.band).toArgb(); alpha = 110; style = Paint.Style.FILL }
            c.drawArc(box, 180f, 180f, true, sky)
            val line = Paint(Paint.ANTI_ALIAS_FLAG).apply { style = Paint.Style.STROKE; strokeWidth = 4f; strokeCap = Paint.Cap.ROUND; color = p.borderStrong.toArgb() }
            c.drawArc(box, 180f, 180f, false, line)
            line.color = p.text.toArgb()
            c.drawArc(box, 180f, 180f * v.sun, false, line)
            val angle = Math.toRadians(180.0 + 180.0 * v.sun)
            val cx = box.centerX() + (box.width() / 2) * Math.cos(angle).toFloat()
            val cy = box.centerY() + (box.height() / 2) * Math.sin(angle).toFloat()
            val dot = Paint(Paint.ANTI_ALIAS_FLAG).apply { color = (if (v.night) p.violet else p.accent).toArgb() }
            c.drawCircle(cx, cy, 12f, dot)
            return bmp
        }
    }
}

class TodayWidgetReceiver : GlanceAppWidgetReceiver() {
    override val glanceAppWidget: GlanceAppWidget = TodayWidget()
}
