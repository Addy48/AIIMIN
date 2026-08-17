package aiimin.core.data.money

import android.content.Context
import android.net.Uri
import android.provider.OpenableColumns
import android.util.Log
import aiimin.core.data.session.SessionRepository
import aiimin.core.data.sync.GraphSyncRepository
import aiimin.core.network.AiiminApi
import aiimin.core.network.AiImportRequest
import dagger.hilt.android.qualifiers.ApplicationContext
import java.nio.charset.Charset
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody.Companion.toRequestBody

/**
 * Money import paths that do **not** need SMS:
 * spreadsheet (xls/xlsx/csv) → `POST /wealth/import`,
 * AI / chat / PDF-as-text → `POST /wealth/import/ai` or local draft queue.
 */
@Singleton
class MoneyImportRepository @Inject constructor(
    @ApplicationContext private val context: Context,
    private val api: AiiminApi,
    private val session: SessionRepository,
    private val sync: GraphSyncRepository,
    private val inbox: PaymentInboxStore,
) {

    suspend fun importUri(uri: Uri): ImportOutcome = withContext(Dispatchers.IO) {
        val name = displayName(uri) ?: "import.bin"
        val mime = context.contentResolver.getType(uri)?.lowercase().orEmpty()
        val bytes = context.contentResolver.openInputStream(uri)?.use { it.readBytes() }
            ?: return@withContext ImportOutcome.Fail("Could not read file")
        if (bytes.isEmpty()) return@withContext ImportOutcome.Fail("File empty")
        if (bytes.size > MAX_BYTES) {
            return@withContext ImportOutcome.Fail("File too large (max 8 MB)")
        }

        when {
            isSpreadsheet(name, mime) -> importSpreadsheet(name, mime, bytes)
            isPdf(name, mime) -> importPdfOrText(name, bytes)
            isPlainText(name, mime) -> importTextPayload(String(bytes, Charsets.UTF_8))
            else -> {
                // Unknown binary — try UTF-8 text, else ask for spreadsheet/AI paste.
                val asText = runCatching { String(bytes, Charset.forName("UTF-8")) }.getOrNull()
                if (asText != null && asText.count { it == '\uFFFD' } < asText.length / 20) {
                    importTextPayload(asText)
                } else {
                    ImportOutcome.Fail("Use .xlsx / .xls / .csv, or paste text into AI import")
                }
            }
        }
    }

    suspend fun importAiText(text: String): ImportOutcome = withContext(Dispatchers.IO) {
        importTextPayload(text)
    }

    private suspend fun importSpreadsheet(name: String, mime: String, bytes: ByteArray): ImportOutcome {
        if (!session.state.value.isSignedIn) {
            return ImportOutcome.Fail("Sign in to import spreadsheets to aiimin.in")
        }
        val media = (mime.ifBlank { guessSpreadsheetMime(name) })
            .toMediaTypeOrNull()
            ?: "application/octet-stream".toMediaTypeOrNull()!!
        val body = bytes.toRequestBody(media)
        val part = MultipartBody.Part.createFormData("file", name, body)
        return runCatching {
            val res = api.importSpreadsheet(part)
            val n = res.transactionsImported ?: 0
            sync.refreshAll()
            ImportOutcome.Ok(res.message ?: "Imported $n transactions", remoteCount = n)
        }.getOrElse {
            Log.w(TAG, "spreadsheet import failed: ${it.message}")
            ImportOutcome.Fail(it.message ?: "Spreadsheet import failed")
        }
    }

    private suspend fun importPdfOrText(name: String, bytes: ByteArray): ImportOutcome {
        // Native PDF text extract is unreliable without a heavy lib.
        // If the "PDF" is actually text-ish, treat as AI text; else guide the user.
        val asText = runCatching { String(bytes, Charsets.UTF_8) }.getOrNull()
        val printable = asText?.count { it.code in 32..126 || it == '\n' || it == '\r' || it == '\t' } ?: 0
        return if (asText != null && printable > bytes.size * 0.6) {
            importTextPayload(asText)
        } else {
            ImportOutcome.Fail(
                "PDF binary not parsed on device — export Excel/CSV, or paste statement text into AI import",
            )
        }
    }

    private suspend fun importTextPayload(text: String): ImportOutcome {
        val trimmed = text.trim()
        if (trimmed.length < 8) return ImportOutcome.Fail("Text too short")
        if (!session.state.value.isSignedIn) {
            // Offline: queue local drafts via parser (line / paragraph chunks).
            var queued = 0
            trimmed.split(Regex("""\n{2,}|\r\n{2,}""")).ifEmpty { listOf(trimmed) }.forEach { chunk ->
                if (inbox.ingest(chunk.trim(), PaymentDraftSource.AI_TEXT)) queued++
            }
            if (queued == 0) {
                // Whole blob as one paste for human edit.
                inbox.ingest(trimmed.take(4_000), PaymentDraftSource.AI_TEXT)
                return ImportOutcome.Ok("Parked on Money — Queue draft / edit, then Approve", localDrafts = 0)
            }
            return ImportOutcome.Ok("Queued $queued local drafts — Approve each", localDrafts = queued)
        }
        return runCatching {
            val res = api.importAiText(AiImportRequest(text = trimmed.take(40_000)))
            val n = res.imported ?: 0
            sync.refreshAll()
            ImportOutcome.Ok(res.message ?: "AI imported $n", remoteCount = n)
        }.getOrElse {
            Log.w(TAG, "AI import failed: ${it.message}")
            // Fall back to local drafts so the user is not stuck.
            var queued = 0
            if (inbox.ingest(trimmed.take(4_000), PaymentDraftSource.AI_TEXT)) queued++
            if (queued > 0) {
                ImportOutcome.Ok("AI import failed · queued local draft instead", localDrafts = queued)
            } else {
                ImportOutcome.Fail(it.message ?: "AI import failed — paste a bank alert and Queue draft")
            }
        }
    }

    private fun displayName(uri: Uri): String? {
        context.contentResolver.query(uri, arrayOf(OpenableColumns.DISPLAY_NAME), null, null, null)
            ?.use { c ->
                if (c.moveToFirst()) return c.getString(0)
            }
        return uri.lastPathSegment
    }

    private fun isSpreadsheet(name: String, mime: String): Boolean {
        val n = name.lowercase()
        return n.endsWith(".xlsx") || n.endsWith(".xls") || n.endsWith(".csv") ||
            mime.contains("spreadsheet") || mime.contains("excel") ||
            mime == "text/csv" || mime == "application/vnd.ms-excel" ||
            mime == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    }

    private fun isPdf(name: String, mime: String): Boolean =
        name.lowercase().endsWith(".pdf") || mime == "application/pdf"

    private fun isPlainText(name: String, mime: String): Boolean {
        val n = name.lowercase()
        return n.endsWith(".txt") || n.endsWith(".md") ||
            mime.startsWith("text/") && mime != "text/csv"
    }

    private fun guessSpreadsheetMime(name: String): String = when {
        name.endsWith(".csv", true) -> "text/csv"
        name.endsWith(".xls", true) -> "application/vnd.ms-excel"
        else -> "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    }

    sealed class ImportOutcome {
        data class Ok(
            val message: String,
            val remoteCount: Int = 0,
            val localDrafts: Int = 0,
        ) : ImportOutcome()

        data class Fail(val message: String) : ImportOutcome()
    }

    companion object {
        private const val TAG = "AiiminPay"
        private const val MAX_BYTES = 8 * 1024 * 1024
    }
}
