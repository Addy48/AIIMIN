package aiimin.core.data.money

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.net.Uri
import android.provider.Telephony
import android.util.Log
import androidx.core.content.ContextCompat
import aiimin.core.data.prefs.AppPreferences
import dagger.hilt.android.qualifiers.ApplicationContext
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

/**
 * Opt-in scan of the SMS inbox for **transactional** bank/UPI alerts only.
 *
 * Never runs without [Manifest.permission.READ_SMS]. OTP-only bodies are
 * rejected by [PaymentAlertParser]. Raw SMS never leaves the device — only
 * human-approved drafts hit the ledger / website.
 *
 * Play Store: SMS is a restricted permission. Sideload / internal testing OK;
 * Play release needs a permitted declaration. See Play-Store-Launch ledger.
 */
@Singleton
class TransactionalSmsScanner @Inject constructor(
    @ApplicationContext private val context: Context,
    private val inbox: PaymentInboxStore,
    private val prefs: AppPreferences,
) {

    fun hasReadPermission(): Boolean =
        ContextCompat.checkSelfPermission(context, Manifest.permission.READ_SMS) ==
            PackageManager.PERMISSION_GRANTED

    suspend fun isOptInEnabled(): Boolean = prefs.read().smsOptIn

    suspend fun setOptIn(enabled: Boolean) {
        prefs.writeSmsOptIn(enabled)
        if (!enabled) return
    }

    /**
     * Scan recent inbox messages newer than last scan (default lookback 14 days).
     * Queues drafts via [PaymentInboxStore.ingest]; returns how many new drafts.
     */
    suspend fun scanRecent(lookbackMs: Long = 14L * 24 * 60 * 60 * 1000): ScanResult =
        withContext(Dispatchers.IO) {
            if (!hasReadPermission()) {
                return@withContext ScanResult(permissionDenied = true)
            }
            if (!prefs.read().smsOptIn) {
                return@withContext ScanResult(optInOff = true)
            }
            val now = System.currentTimeMillis()
            val last = prefs.read().smsLastScanMs ?: (now - lookbackMs)
            val since = minOf(last, now - lookbackMs)
            var scanned = 0
            var queued = 0
            var parseMiss = 0
            val uri: Uri = Telephony.Sms.Inbox.CONTENT_URI
            val projection = arrayOf(
                Telephony.Sms.BODY,
                Telephony.Sms.DATE,
                Telephony.Sms.ADDRESS,
            )
            val selection = "${Telephony.Sms.DATE} > ?"
            val args = arrayOf(since.toString())
            val sort = "${Telephony.Sms.DATE} DESC"
            context.contentResolver.query(uri, projection, selection, args, sort)?.use { c ->
                val bodyIdx = c.getColumnIndex(Telephony.Sms.BODY)
                val dateIdx = c.getColumnIndex(Telephony.Sms.DATE)
                if (bodyIdx < 0 || dateIdx < 0) {
                    return@withContext ScanResult(error = "SMS inbox columns missing")
                }
                while (c.moveToNext() && scanned < MAX_ROWS) {
                    scanned++
                    val body = c.getString(bodyIdx)?.trim().orEmpty()
                    if (body.length < 12) continue
                    if (!looksTransactional(body)) {
                        parseMiss++
                        continue
                    }
                    val ok = inbox.ingest(body, PaymentDraftSource.SMS)
                    if (ok) queued++ else parseMiss++
                }
            } ?: return@withContext ScanResult(error = "Could not open SMS inbox")
            prefs.writeSmsLastScanMs(now)
            Log.i(TAG, "scan scanned=$scanned queued=$queued miss=$parseMiss since=$since")
            ScanResult(scanned = scanned, queued = queued, parseMiss = parseMiss)
        }

    private fun looksTransactional(body: String): Boolean {
        val lower = body.lowercase()
        return listOf(
            "rs.", "rs ", "₹", "inr", "debited", "credited", "spent",
            "paid", "upi", "a/c", "txn", "transaction", "sent", "received",
            "withdrawn", "neft", "imps",
        ).any { it in lower }
    }

    data class ScanResult(
        val scanned: Int = 0,
        val queued: Int = 0,
        val parseMiss: Int = 0,
        val permissionDenied: Boolean = false,
        val optInOff: Boolean = false,
        val error: String? = null,
    )

    companion object {
        private const val TAG = "AiiminPay"
        private const val MAX_ROWS = 120
    }
}
