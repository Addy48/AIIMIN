package aiimin.core.data.money

import android.content.Intent
import android.net.Uri
import java.io.BufferedReader
import java.io.InputStreamReader

/**
 * Pulls shared bank-alert text from every place Android share sheets put it.
 * Many apps only set ClipData or a text file stream — EXTRA_TEXT alone is not enough.
 */
object SharedTextExtractor {

    fun fromIntent(intent: Intent?, openUri: (Uri) -> java.io.InputStream?): String {
        if (intent == null) return ""
        val fromExtra = intent.getCharSequenceExtra(Intent.EXTRA_TEXT)?.toString()?.trim().orEmpty()
        if (fromExtra.isNotEmpty()) return fromExtra

        val clip = intent.clipData
        if (clip != null) {
            for (i in 0 until clip.itemCount) {
                val item = clip.getItemAt(i)
                val clipText = item?.text?.toString()?.trim().orEmpty()
                if (clipText.isNotEmpty()) return clipText
                val uri = item?.uri
                if (uri != null) {
                    val fromUri = readUri(uri, openUri)
                    if (fromUri.isNotEmpty()) return fromUri
                }
            }
        }

        @Suppress("DEPRECATION")
        val stream = intent.getParcelableExtra<Uri>(Intent.EXTRA_STREAM)
        if (stream != null) {
            val fromStream = readUri(stream, openUri)
            if (fromStream.isNotEmpty()) return fromStream
        }
        return ""
    }

    private fun readUri(uri: Uri, openUri: (Uri) -> java.io.InputStream?): String {
        return try {
            openUri(uri)?.use { input ->
                BufferedReader(InputStreamReader(input)).readText().trim()
            }.orEmpty().take(8_000)
        } catch (_: Exception) {
            ""
        }
    }
}
