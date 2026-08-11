package `in`.aiimin.app.ui.discipline

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import `in`.aiimin.app.AppContainer
import `in`.aiimin.app.ui.components.ScreenChrome
import `in`.aiimin.app.ui.components.AiiminPrimaryButton
import `in`.aiimin.app.ui.theme.Accent
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

private data class ToolkitItem(
    val id: String,
    val title: String,
    val detail: String,
    val durationSec: Int = 120,
)

private val toolkitItems = listOf(
    ToolkitItem(
        "breathe",
        "Breathe 4-4-4 for one minute",
        "Inhale 4 seconds · hold 4 · exhale 4. Repeat until the urge softens. Your nervous system cannot stay in panic and slow breathing at the same time.",
        60,
    ),
    ToolkitItem(
        "walk",
        "Walk 2 minutes away from the trigger",
        "Physical distance breaks the loop. Leave the room. Change temperature. Move your body before you decide anything.",
        120,
    ),
    ToolkitItem(
        "journal",
        "Open Journal and dump the urge as text",
        "Name the urge without acting on it. Write what you want, why, and what happens if you wait 15 minutes.",
        120,
    ),
    ToolkitItem(
        "accountability",
        "Text a friend / accountability ping",
        "One sentence: \"Urge hit — talking instead of acting.\" External witness reduces impulsive follow-through.",
        90,
    ),
    ToolkitItem(
        "water",
        "Drink water · delay 10 minutes",
        "Hydrate. Set a 10-minute timer. Most urges peak and fall inside that window if you do not feed them.",
        600,
    ),
)

private enum class DisciplinePane { Form, Active, Detail }

@Composable
fun DisciplineUrgeScreen(container: AppContainer, onBack: () -> Unit) {
    var pane by remember { mutableStateOf(DisciplinePane.Form) }
    var urge by remember { mutableStateOf("") }
    var note by remember { mutableStateOf("") }
    var saved by remember { mutableStateOf(false) }
    var activeItem by remember { mutableStateOf(toolkitItems.first()) }
    val haptics = LocalHapticFeedback.current
    val scope = rememberCoroutineScope()
    val streak by container.appPrefs.disciplineStreak.collectAsState(initial = 0)

    when (pane) {
        DisciplinePane.Active -> ToolkitActivePane(
            item = activeItem,
            onDone = { helped ->
                saved = true
                pane = DisciplinePane.Form
            },
            onBack = { pane = DisciplinePane.Form },
        )
        DisciplinePane.Detail -> ToolkitDetailPane(
            item = activeItem,
            onStart = { pane = DisciplinePane.Active },
            onBack = { pane = DisciplinePane.Form },
        )
        DisciplinePane.Form -> ScreenChrome {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .verticalScroll(rememberScrollState())
                    .padding(24.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
            ) {
            Text("Discipline", style = MaterialTheme.typography.headlineMedium)
            Card(Modifier.fillMaxWidth(), colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)) {
                Column(Modifier.padding(16.dp)) {
                    Text("DISCIPLINE STREAK", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    Text("$streak", fontSize = 32.sp, fontWeight = FontWeight.Bold, color = Accent)
                    Text("days", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
            }
            OutlinedTextField(
                value = urge,
                onValueChange = { urge = it; saved = false },
                label = { Text("What are you fighting?") },
                modifier = Modifier.fillMaxWidth(),
            )
            OutlinedTextField(
                value = note,
                onValueChange = { note = it },
                label = { Text("What will you do instead?") },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(100.dp),
            )
            AiiminPrimaryButton(
                text = if (saved) "Logged — open toolkit" else "I choose differently",
                onClick = {
                    haptics.performHapticFeedback(HapticFeedbackType.LongPress)
                    scope.launch {
                        container.appPrefs.logDisciplineUrge()
                        saved = true
                        activeItem = toolkitItems.first()
                        pane = DisciplinePane.Active
                    }
                },
                enabled = true,
            )
            Spacer(Modifier.height(8.dp))
            Text("Toolkit", style = MaterialTheme.typography.titleLarge)
            toolkitItems.forEach { item ->
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp))
                        .border(1.dp, MaterialTheme.colorScheme.outline, RoundedCornerShape(12.dp))
                        .clickable {
                            haptics.performHapticFeedback(HapticFeedbackType.TextHandleMove)
                            activeItem = item
                            pane = DisciplinePane.Detail
                        },
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                ) {
                    Text(item.title, modifier = Modifier.padding(16.dp), style = MaterialTheme.typography.bodyLarge)
                }
            }
            OutlinedButton(onClick = onBack, modifier = Modifier.fillMaxWidth()) { Text("Back to More") }
            }
        }
    }
}

@Composable
private fun ToolkitDetailPane(item: ToolkitItem, onStart: () -> Unit, onBack: () -> Unit) {
    Column(
        Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(24.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        Text(item.title, style = MaterialTheme.typography.headlineSmall)
        Text(item.detail, style = MaterialTheme.typography.bodyLarge, color = MaterialTheme.colorScheme.onSurfaceVariant)
        AiiminPrimaryButton(text = "Start ${item.durationSec / 60} min timer", onClick = onStart)
        OutlinedButton(onClick = onBack, modifier = Modifier.fillMaxWidth()) { Text("Back") }
    }
}

@Composable
private fun ToolkitActivePane(item: ToolkitItem, onDone: (Boolean) -> Unit, onBack: () -> Unit) {
    var remaining by remember(item.id) { mutableIntStateOf(item.durationSec) }
    var running by remember { mutableStateOf(true) }
    val progress by animateFloatAsState(
        1f - (remaining.toFloat() / item.durationSec.coerceAtLeast(1)),
        label = "toolkit-timer",
    )
    val haptics = LocalHapticFeedback.current

    LaunchedEffect(running, remaining) {
        if (!running || remaining <= 0) return@LaunchedEffect
        delay(1000)
        remaining -= 1
        if (remaining <= 0) {
            running = false
            haptics.performHapticFeedback(HapticFeedbackType.LongPress)
        }
    }

    Column(
        Modifier
            .fillMaxSize()
            .padding(24.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        Text("Toolkit active", style = MaterialTheme.typography.headlineMedium)
        Text(item.title, style = MaterialTheme.typography.titleMedium, color = Accent)
        Text(
            "%02d:%02d".format(remaining / 60, remaining % 60),
            fontSize = 56.sp,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.onBackground,
        )
        LinearProgressIndicator(progress = { progress }, modifier = Modifier.fillMaxWidth(), color = Accent)
        Text(item.detail, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
        if (remaining <= 0) {
            Text("Did this help?", style = MaterialTheme.typography.titleMedium)
            RowButtons(onYes = { onDone(true) }, onNo = { onDone(false) })
        } else {
            OutlinedButton(onClick = onBack, modifier = Modifier.fillMaxWidth()) { Text("Cancel") }
        }
    }
}

@Composable
private fun RowButtons(onYes: () -> Unit, onNo: () -> Unit) {
    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        AiiminPrimaryButton(text = "Yes, helped", onClick = onYes)
        OutlinedButton(onClick = onNo, modifier = Modifier.fillMaxWidth()) { Text("Not really") }
    }
}
