package aiimin.feature.capture

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import java.util.Locale

/**
 * Hold-to-talk mic. Results feed the Capture composer. Never settles.
 */
class VoiceSpeech(context: Context) {

    private val app = context.applicationContext
    private val main = Handler(Looper.getMainLooper())
    private var rec: SpeechRecognizer? = null
    private var lastPartial: String = ""
    private var finished = false

    fun available(): Boolean = SpeechRecognizer.isRecognitionAvailable(app)

    fun start(
        onPartial: (String) -> Unit,
        onFinal: (String?) -> Unit,
        onError: () -> Unit,
    ) {
        stop()
        if (!available()) {
            onError()
            return
        }
        lastPartial = ""
        finished = false
        val recognizer = SpeechRecognizer.createSpeechRecognizer(app)
        rec = recognizer
        recognizer.setRecognitionListener(object : RecognitionListener {
            override fun onReadyForSpeech(params: Bundle?) = Unit
            override fun onBeginningOfSpeech() = Unit
            override fun onRmsChanged(rmsdB: Float) = Unit
            override fun onBufferReceived(buffer: ByteArray?) = Unit
            override fun onEndOfSpeech() = Unit
            override fun onEvent(eventType: Int, params: Bundle?) = Unit

            override fun onPartialResults(partialResults: Bundle?) {
                val text = partialResults
                    ?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                    ?.firstOrNull()
                    ?.trim()
                    .orEmpty()
                if (text.isNotEmpty()) {
                    lastPartial = text
                    onPartial(text)
                }
            }

            override fun onResults(results: Bundle?) {
                if (finished) return
                finished = true
                val text = results
                    ?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                    ?.firstOrNull()
                    ?.trim()
                onFinal(text?.takeIf { it.isNotEmpty() } ?: lastPartial.takeIf { it.isNotEmpty() })
            }

            override fun onError(error: Int) {
                if (finished) return
                finished = true
                if (lastPartial.isNotEmpty()) onFinal(lastPartial)
                else onError()
            }
        })
        val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
            putExtra(
                RecognizerIntent.EXTRA_LANGUAGE_MODEL,
                RecognizerIntent.LANGUAGE_MODEL_FREE_FORM,
            )
            putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true)
            putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 3)
            putExtra(RecognizerIntent.EXTRA_LANGUAGE, Locale.getDefault().toLanguageTag())
        }
        recognizer.startListening(intent)
    }

    fun stop() {
        val r = rec ?: return
        rec = null
        main.post {
            runCatching { r.stopListening() }
            runCatching { r.cancel() }
            runCatching { r.destroy() }
        }
    }

    fun destroy() = stop()
}
