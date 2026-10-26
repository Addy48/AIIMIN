package aiimin.app

import aiimin.designsystem.component.AppButton
import aiimin.designsystem.component.AppSheet
import aiimin.designsystem.component.AppTextField
import aiimin.designsystem.component.SwitchRow
import aiimin.designsystem.icon.AppIcons
import aiimin.designsystem.theme.Aiimin
import android.app.Activity
import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.view.PixelCopy
import androidx.compose.foundation.Image
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.core.content.FileProvider
import java.io.File
import kotlin.math.sqrt

/**
 * Shake the phone on any screen to send feedback (owner, 26 Oct). Three parts:
 *  - [ShakeDetector] listens to the accelerometer while the app is on screen. It is created only when the setting is on.
 *  - [captureWindow] copies the current screen into a bitmap before the sheet covers it.
 *  - [FeedbackSheet] shows the screenshot, takes a note, and hands both to the user's mail app.
 * AIIMIN itself sends nothing: the mail app does, after the person presses send there.
 */
class ShakeDetector(context: Context, private val onShake: () -> Unit) : SensorEventListener {
    private val sm = context.getSystemService(Context.SENSOR_SERVICE) as SensorManager
    private val accel: Sensor? = sm.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)
    private var strong = 0
    private var firstAt = 0L
    private var lastFired = 0L

    val available get() = accel != null

    fun start() { accel?.let { sm.registerListener(this, it, SensorManager.SENSOR_DELAY_UI) } }
    fun stop() { sm.unregisterListener(this); strong = 0 }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) = Unit

    override fun onSensorChanged(e: SensorEvent) {
        val g = sqrt(e.values[0] * e.values[0] + e.values[1] * e.values[1] + e.values[2] * e.values[2]) / SensorManager.GRAVITY_EARTH
        if (g < THRESHOLD_G) return
        val now = e.timestamp / 1_000_000L
        if (now - lastFired < COOLDOWN_MS) return
        // A real shake is several hard jolts close together; one bump on a table is not.
        if (strong == 0 || now - firstAt > WINDOW_MS) { strong = 0; firstAt = now }
        strong++
        if (strong >= JOLTS) { strong = 0; lastFired = now; onShake() }
    }

    private companion object {
        const val THRESHOLD_G = 2.6f
        const val JOLTS = 4
        const val WINDOW_MS = 900L
        const val COOLDOWN_MS = 2500L
    }
}

/** Copies what the window shows right now. Calls back with null when the system refuses (for example FLAG_SECURE). */
fun captureWindow(activity: Activity, onResult: (Bitmap?) -> Unit) {
    val view = activity.window.decorView
    if (view.width == 0 || view.height == 0 || Build.VERSION.SDK_INT < 26) { onResult(null); return }
    val bmp = Bitmap.createBitmap(view.width, view.height, Bitmap.Config.ARGB_8888)
    runCatching {
        PixelCopy.request(activity.window, bmp, { code -> onResult(if (code == PixelCopy.SUCCESS) bmp else null) }, Handler(Looper.getMainLooper()))
    }.onFailure { onResult(null) }
}

private fun versionLine(context: Context): String = runCatching {
    val p = context.packageManager.getPackageInfo(context.packageName, 0)
    "AIIMIN ${p.versionName} · Android ${Build.VERSION.RELEASE} · ${Build.MANUFACTURER} ${Build.MODEL}"
}.getOrDefault("AIIMIN")

/** Opens the share sheet with an email-ready message. The screenshot is a temporary file that is deleted by Android's cache cleanup. */
private fun send(context: Context, note: String, screenshot: Bitmap?, withDevice: Boolean) {
    val body = buildString {
        append(note.trim())
        if (withDevice) append("\n\n—\n").append(versionLine(context))
    }
    val i = Intent(Intent.ACTION_SEND).apply {
        putExtra(Intent.EXTRA_EMAIL, arrayOf(FEEDBACK_EMAIL))
        putExtra(Intent.EXTRA_SUBJECT, "AIIMIN feedback")
        putExtra(Intent.EXTRA_TEXT, body)
        if (screenshot != null) {
            val dir = File(context.cacheDir, "share").apply { mkdirs() }
            val file = File(dir, "feedback.png")
            file.outputStream().use { screenshot.compress(Bitmap.CompressFormat.PNG, 100, it) }
            putExtra(Intent.EXTRA_STREAM, FileProvider.getUriForFile(context, "${context.packageName}.files", file))
            type = "image/png"
            addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
        } else {
            type = "text/plain"
        }
    }
    runCatching { context.startActivity(Intent.createChooser(i, "Send feedback with").addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)) }
}

private const val FEEDBACK_EMAIL = "support@aiimin.in"

@Composable
fun FeedbackSheet(screenshot: Bitmap?, onDismiss: () -> Unit) {
    val context = LocalContext.current
    val c = Aiimin.colors
    var note by remember { mutableStateOf("") }
    var withShot by remember { mutableStateOf(screenshot != null) }
    var withDevice by remember { mutableStateOf(true) }
    AppSheet(onDismiss = onDismiss, title = "Send feedback", subtitle = "What worked, what didn’t, what you expected.") {
        if (screenshot != null) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Image(
                    screenshot.asImageBitmap(), contentDescription = "Screenshot of the screen you shook the phone on",
                    contentScale = ContentScale.Crop, alignment = Alignment.TopCenter,
                    modifier = Modifier.size(width = 72.dp, height = 112.dp).clip(RoundedCornerShape(10.dp)).border(1.dp, c.border, RoundedCornerShape(10.dp)),
                )
                Spacer(Modifier.width(12.dp))
                Column(Modifier.weight(1f)) {
                    Text("This screen, as it looked when you shook", style = Aiimin.type.headline)
                    Text("It may show your own data. Switch it off to send words only.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 2.dp))
                }
            }
            SwitchRow("Attach the screenshot", withShot, { withShot = it })
        }
        AppTextField(note, { note = it }, placeholder = "Tell us what happened", singleLine = false, minLines = 3)
        SwitchRow("Include app version and phone model", withDevice, { withDevice = it })
        Spacer(Modifier.height(12.dp))
        AppButton(
            "Choose mail app", { send(context, note, screenshot.takeIf { withShot }, withDevice); onDismiss() },
            Modifier.fillMaxWidth(), enabled = note.isNotBlank(), icon = AppIcons.EnvelopeSimple,
        )
        Text("Opens your mail app. Nothing is sent until you press send there.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 8.dp))
    }
}
