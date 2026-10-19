package aiimin.designsystem.component

import android.Manifest
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.ui.platform.LocalContext
import androidx.core.content.ContextCompat

/**
 * Speech to text inside AIIMIN: no system pop-up. Uses the phone's on-device recogniser when it
 * has one (Android 12+), so audio stays on the phone and it works offline; otherwise the phone's
 * default recogniser, still without its dialog. Partial text arrives while you speak
 * ([onPartial]) and the mic level drives the meter ([onLevel], 0..1).
 *
 * Returns a toggle: call it to start listening, call it again to stop early.
 */
@Composable
fun rememberVoiceInput(
    prompt: String = "Speak",
    onText: (String) -> Unit,
    onUnavailable: () -> Unit = {},
    onPartial: (String) -> Unit = {},
    onLevel: (Float) -> Unit = {},
    onListening: (Boolean) -> Unit = {},
    language: String = "en-IN",
): () -> Unit {
    val context = LocalContext.current
    val text = rememberUpdatedState(onText)
    val partial = rememberUpdatedState(onPartial)
    val level = rememberUpdatedState(onLevel)
    val listening = rememberUpdatedState(onListening)
    val unavailable = rememberUpdatedState(onUnavailable)
    val session = remember { VoiceSession(context.applicationContext) }
    DisposableEffect(Unit) { onDispose { session.release() } }
    val mic = rememberLauncherForActivityResult(ActivityResultContracts.RequestPermission()) { ok ->
        if (ok) session.start(language, text.value, partial.value, level.value, listening.value, unavailable.value) else unavailable.value()
    }
    return {
        when {
            session.active -> session.stop()
            ContextCompat.checkSelfPermission(context, Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED -> mic.launch(Manifest.permission.RECORD_AUDIO)
            else -> session.start(language, text.value, partial.value, level.value, listening.value, unavailable.value)
        }
    }
}

private class VoiceSession(private val context: Context) {
    private var recognizer: SpeechRecognizer? = null
    var active = false
        private set

    fun start(language: String, onText: (String) -> Unit, onPartial: (String) -> Unit, onLevel: (Float) -> Unit, onListening: (Boolean) -> Unit, onUnavailable: () -> Unit) {
        release()
        val onDevice = Build.VERSION.SDK_INT >= 31 && SpeechRecognizer.isOnDeviceRecognitionAvailable(context)
        if (!onDevice && !SpeechRecognizer.isRecognitionAvailable(context)) { onUnavailable(); return }
        val r = runCatching {
            if (onDevice) SpeechRecognizer.createOnDeviceSpeechRecognizer(context) else SpeechRecognizer.createSpeechRecognizer(context)
        }.getOrNull() ?: run { onUnavailable(); return }
        recognizer = r
        r.setRecognitionListener(object : RecognitionListener {
            override fun onReadyForSpeech(params: Bundle?) { active = true; onListening(true) }
            override fun onBeginningOfSpeech() = Unit
            override fun onRmsChanged(rmsdB: Float) = onLevel(((rmsdB + 2f) / 12f).coerceIn(0f, 1f))
            override fun onBufferReceived(buffer: ByteArray?) = Unit
            override fun onEndOfSpeech() = Unit
            override fun onError(error: Int) {
                active = false; onListening(false); onLevel(0f)
                if (error == SpeechRecognizer.ERROR_LANGUAGE_NOT_SUPPORTED || error == SpeechRecognizer.ERROR_LANGUAGE_UNAVAILABLE ||
                    error == SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS || error == SpeechRecognizer.ERROR_CLIENT
                ) onUnavailable()
            }
            override fun onResults(results: Bundle?) {
                active = false; onListening(false); onLevel(0f)
                results?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)?.firstOrNull()?.takeIf { it.isNotBlank() }?.let(onText)
            }
            override fun onPartialResults(partialResults: Bundle?) {
                partialResults?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)?.firstOrNull()?.takeIf { it.isNotBlank() }?.let(onPartial)
            }
            override fun onEvent(eventType: Int, params: Bundle?) = Unit
        })
        val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH)
            .putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
            .putExtra(RecognizerIntent.EXTRA_LANGUAGE, if (language == "auto") java.util.Locale.getDefault().toLanguageTag() else language)
            .putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true)
            .putExtra(RecognizerIntent.EXTRA_PREFER_OFFLINE, true)
            .putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS, 2500L)
        runCatching { r.startListening(intent) }.onFailure { release(); onUnavailable() }
    }

    fun stop() { runCatching { recognizer?.stopListening() } }

    fun release() {
        runCatching { recognizer?.destroy() }
        recognizer = null
        active = false
    }
}
