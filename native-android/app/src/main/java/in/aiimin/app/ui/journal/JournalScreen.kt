package `in`.aiimin.app.ui.journal

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.animateColorAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Mic
import androidx.compose.material.icons.filled.Stop
import androidx.compose.material3.Card
import androidx.compose.foundation.layout.size
import androidx.compose.material3.FilledIconButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.core.content.ContextCompat
import `in`.aiimin.app.AppContainer
import `in`.aiimin.app.data.local.JournalCacheEntity
import `in`.aiimin.app.ui.components.AiiminPrimaryButton
import `in`.aiimin.app.ui.components.RecordingWaveform
import `in`.aiimin.app.ui.components.ScreenHeader
import `in`.aiimin.app.ui.components.SyncBanner
import `in`.aiimin.app.ui.theme.Accent
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.time.LocalDate
import java.util.Locale

private enum class JournalMode(val label: String, val placeholder: String) {
    Reflect("Reflect", "What's on your mind…"),
    Gratitude("Gratitude", "Three things you're grateful for…"),
    Goals("Goals", "What moved you forward today…"),
    Free("Free", "Write anything…"),
}

@Composable
fun JournalScreen(container: AppContainer) {
    val entries by container.repository.journal().collectAsState(initial = emptyList())
    val syncUi by container.repository.syncUi.collectAsState()
    var draft by remember { mutableStateOf("") }
    var journalMode by remember { mutableStateOf(JournalMode.Reflect) }
    var listening by remember { mutableStateOf(false) }
    var recordingSec by remember { mutableIntStateOf(0) }
    var voiceHint by remember { mutableStateOf("Tap mic to dictate") }
    val scope = rememberCoroutineScope()
    val haptics = LocalHapticFeedback.current
    val context = LocalContext.current
    val today = remember { LocalDate.now().toString() }
    var selectedEntry by remember { mutableStateOf<JournalCacheEntity?>(null) }

    val entry = selectedEntry
    if (entry != null) {
        JournalDetailScreen(entry = entry, onBack = { selectedEntry = null })
        return
    }

    val speechAvailable = remember {
        SpeechRecognizer.isRecognitionAvailable(context)
    }
    val recognizer = remember {
        if (speechAvailable) SpeechRecognizer.createSpeechRecognizer(context) else null
    }

    DisposableEffect(recognizer) {
        val listener = object : RecognitionListener {
            override fun onReadyForSpeech(params: Bundle?) {
                listening = true
                voiceHint = "Listening…"
            }

            override fun onBeginningOfSpeech() {}
            override fun onRmsChanged(rmsdB: Float) {}
            override fun onBufferReceived(buffer: ByteArray?) {}
            override fun onEndOfSpeech() {
                listening = false
                voiceHint = "Processing…"
            }

            override fun onError(error: Int) {
                listening = false
                voiceHint = when (error) {
                    SpeechRecognizer.ERROR_NO_MATCH -> "No speech caught — try again"
                    SpeechRecognizer.ERROR_SPEECH_TIMEOUT -> "Timed out — tap mic again"
                    SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS -> "Mic permission needed"
                    else -> "Voice error ($error) — type instead"
                }
            }

            override fun onResults(results: Bundle?) {
                listening = false
                val text = results
                    ?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                    ?.firstOrNull()
                    .orEmpty()
                if (text.isNotBlank()) {
                    draft = if (draft.isBlank()) text else "${draft.trim()} $text"
                    voiceHint = "Added from voice — edit or save"
                    haptics.performHapticFeedback(HapticFeedbackType.LongPress)
                } else {
                    voiceHint = "Empty result — try again"
                }
            }

            override fun onPartialResults(partialResults: Bundle?) {
                val partial = partialResults
                    ?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                    ?.firstOrNull()
                if (!partial.isNullOrBlank()) voiceHint = partial
            }

            override fun onEvent(eventType: Int, params: Bundle?) {}
        }
        recognizer?.setRecognitionListener(listener)
        onDispose {
            recognizer?.destroy()
        }
    }

    fun startListening() {
        if (recognizer == null) {
            voiceHint = "Speech recognition unavailable on this device"
            return
        }
        val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
            putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
            putExtra(RecognizerIntent.EXTRA_LANGUAGE, Locale.getDefault())
            putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true)
            putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 3)
        }
        recognizer.startListening(intent)
    }

    fun stopListening() {
        recognizer?.stopListening()
        listening = false
    }

    val permissionLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission(),
    ) { granted ->
        if (granted) startListening() else voiceHint = "Mic permission denied"
    }

    fun onMicClick() {
        if (listening) {
            stopListening()
            return
        }
        val granted = ContextCompat.checkSelfPermission(context, Manifest.permission.RECORD_AUDIO) ==
            PackageManager.PERMISSION_GRANTED
        if (granted) startListening()
        else permissionLauncher.launch(Manifest.permission.RECORD_AUDIO)
    }

    val micColor by animateColorAsState(
        if (listening) Accent else MaterialTheme.colorScheme.surfaceVariant,
        label = "mic",
    )

    LaunchedEffect(listening) {
        if (!listening) {
            recordingSec = 0
            return@LaunchedEffect
        }
        while (listening) {
            delay(1000)
            recordingSec += 1
        }
    }

    Column(Modifier.fillMaxSize()) {
        SyncBanner(
            syncUi = syncUi,
            onRetry = { scope.launch { container.repository.syncAll() } },
        )
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            item {
                ScreenHeader(
                    title = "Journal",
                    subtitle = "Voice + type · syncs to desktop",
                    modifier = Modifier.padding(horizontal = 0.dp),
                )
            }
            item {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        items(JournalMode.entries) { mode ->
                            FilterChip(
                                selected = journalMode == mode,
                                onClick = { journalMode = mode },
                                label = { Text(mode.label) },
                                colors = FilterChipDefaults.filterChipColors(
                                    selectedContainerColor = Accent.copy(alpha = 0.18f),
                                    selectedLabelColor = Accent,
                                ),
                            )
                        }
                    }
                    OutlinedTextField(
                        value = draft,
                        onValueChange = { draft = it },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(160.dp),
                        placeholder = { Text(journalMode.placeholder) },
                    )
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(12.dp),
                    ) {
                        FilledIconButton(
                            onClick = { onMicClick() },
                            modifier = Modifier.size(56.dp),
                            colors = IconButtonDefaults.filledIconButtonColors(
                                containerColor = micColor,
                                contentColor = if (listening) Color.White else Accent,
                            ),
                        ) {
                            Icon(
                                if (listening) Icons.Default.Stop else Icons.Default.Mic,
                                contentDescription = if (listening) "Stop" else "Voice",
                            )
                        }
                        Column(Modifier.weight(1f)) {
                            if (listening) {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                                ) {
                                    RecordingWaveform(active = true)
                                    Text(
                                        "Recording… ${recordingSec / 60}:${"%02d".format(recordingSec % 60)}",
                                        style = MaterialTheme.typography.labelLarge,
                                        fontWeight = FontWeight.SemiBold,
                                        color = Accent,
                                    )
                                }
                            } else {
                                Text(
                                    voiceHint,
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                )
                            }
                        }
                    }
                    AiiminPrimaryButton(
                        text = "Save to account",
                        onClick = {
                            if (draft.isBlank()) return@AiiminPrimaryButton
                            haptics.performHapticFeedback(HapticFeedbackType.LongPress)
                            scope.launch {
                                val body = if (journalMode == JournalMode.Free) {
                                    draft.trim()
                                } else {
                                    "**${journalMode.label}**\n\n${draft.trim()}"
                                }
                                container.repository.saveJournal(body, today)
                                draft = ""
                                voiceHint = "Saved · syncing to account"
                                container.syncEngine.syncNow()
                            }
                        },
                    )
                }
            }
            if (entries.isNotEmpty()) {
                item {
                    Text(
                        "Past entries (${entries.size})",
                        style = MaterialTheme.typography.labelLarge,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.padding(top = 8.dp),
                    )
                }
            }
            items(entries, key = { it.id }) { entry ->
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { selectedEntry = entry },
                ) {
                    Column(Modifier.padding(16.dp)) {
                        Text(entry.date.ifBlank { "Entry" }, style = MaterialTheme.typography.labelLarge, color = MaterialTheme.colorScheme.primary)
                        Text(entry.content, style = MaterialTheme.typography.bodyLarge, maxLines = 4)
                        val words = entry.content.split(Regex("\\s+")).count { it.isNotBlank() }
                        Text("$words words", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                }
            }
        }
    }
}
