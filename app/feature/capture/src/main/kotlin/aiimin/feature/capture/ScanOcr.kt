package aiimin.feature.capture

import android.content.Context
import android.net.Uri
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.text.TextRecognition
import com.google.mlkit.vision.text.latin.TextRecognizerOptions
import kotlin.coroutines.resume
import kotlinx.coroutines.suspendCancellableCoroutine

/**
 * On-device OCR for Capture · Scan. Seeds THE LINE with recognized text.
 */
internal object ScanOcr {

    suspend fun readText(context: Context, uri: Uri): String? =
        suspendCancellableCoroutine { cont ->
            val image = try {
                InputImage.fromFilePath(context, uri)
            } catch (e: Exception) {
                cont.resume(null)
                return@suspendCancellableCoroutine
            }
            val client = TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS)
            cont.invokeOnCancellation { client.close() }
            client.process(image)
                .addOnSuccessListener { result ->
                    val text = result.text?.trim().orEmpty()
                    client.close()
                    cont.resume(text.ifBlank { null })
                }
                .addOnFailureListener {
                    client.close()
                    cont.resume(null)
                }
        }

    fun seedFromOcr(raw: String?): String {
        val cleaned = raw
            ?.lines()
            ?.map { it.trim() }
            ?.filter { it.isNotEmpty() }
            ?.joinToString(" ")
            ?.take(280)
            ?.trim()
        return if (cleaned.isNullOrBlank()) {
            "scan receipt · image ready · describe amount/merchant: "
        } else {
            "scan · $cleaned"
        }
    }
}
