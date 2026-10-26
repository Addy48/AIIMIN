package aiimin.designsystem.component

import aiimin.designsystem.theme.Aiimin
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.dp

/** The fixed consent texts of PRD Part 23, word for word. Shown immediately before the system prompt. */
object ConsentText {
    const val READ_SMS = "To find your bank payments, AIIMIN reads text messages on this phone. It uses only messages from banks and ignores one-time codes, offers and personal chats. The text never leaves your phone. You can turn this off any time in Settings."
    const val NOTIFICATION_ACCESS = "AIIMIN can read payment alerts from your bank and UPI apps to prepare drafts. It ignores everything else. Nothing leaves your phone."
    const val HEALTH = "AIIMIN reads steps, sleep, resting heart rate and exercise to show your day. They stay on this phone and are never sold or used for ads."
    const val USAGE = "To show your screen time, AIIMIN needs usage access. It reads how long apps are open, on this phone only."
    const val MICROPHONE = "To turn your voice into text, AIIMIN uses the microphone. Your phone's speech recogniser does the work and may send audio to its provider unless an offline pack is installed. AIIMIN keeps no audio."
    const val NOTIFICATIONS = "I'll remind you of what you set, and a few gentle nudges you can turn off. No guilt, no streak warnings."
    const val UNDER_18 = "Thanks for telling me the truth. AIIMIN is for people 18 and over, so I can't set you up yet. I haven't saved anything, not even your name. I'll be here when you're 18."
    const val FOOTER = "You can change this any time in Settings > Privacy. Questions: support@aiimin.in. You may also complain to the Data Protection Board of India."
}

/** The consent text, the plain footer, and a clear Allow and Not now (Part 23). Closing the sheet counts as no. */
@Composable
fun ConsentBody(text: String, onAllow: () -> Unit, onNotNow: () -> Unit, modifier: Modifier = Modifier, extra: (@Composable () -> Unit)? = null) {
    androidx.compose.foundation.layout.Column(modifier) {
        Text(text, style = Aiimin.type.body)
        extra?.let { androidx.compose.foundation.layout.Spacer(Modifier.padding(top = 12.dp)); it() }
        Row(Modifier.fillMaxWidth().padding(top = 20.dp), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            AppButton("Not now", onNotNow, Modifier.weight(1f), kind = ButtonKind.SECONDARY)
            AppButton("Allow", onAllow, Modifier.weight(1f))
        }
        Text(ConsentText.FOOTER, style = Aiimin.type.caption, modifier = Modifier.padding(top = 12.dp))
    }
}

@Composable
fun ConsentSheet(text: String, onAllow: () -> Unit, onNotNow: () -> Unit) {
    AppSheet(onNotNow) { ConsentBody(text, onAllow, onNotNow, Modifier.padding(bottom = 16.dp)) }
}

/**
 * Raahi asks before the person has to mute AIIMIN (PRD 2.1): the last three nudges of one kind went unopened.
 * "Stop these" keeps them in the inbox only; "Keep them" asks no more.
 */
@Composable
fun StopTheseCard(kind: String, onStop: () -> Unit, onKeep: () -> Unit, modifier: Modifier = Modifier) {
    val c = Aiimin.colors
    val shape = aiimin.designsystem.theme.Shapes.card
    androidx.compose.foundation.layout.Column(
        modifier.fillMaxWidth().clip(shape).background(c.surface).border(1.dp, c.border, shape).padding(16.dp),
    ) {
        Text("Stop these?", style = Aiimin.type.bodyStrong)
        Text("The last 3 \"$kind\" notes went unopened. Stop them and they wait in the inbox instead.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 4.dp))
        Row(Modifier.padding(top = 12.dp), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            AppButton("Stop these", onStop, compact = true)
            AppButton("Keep them", onKeep, kind = ButtonKind.SECONDARY, compact = true)
        }
    }
}
