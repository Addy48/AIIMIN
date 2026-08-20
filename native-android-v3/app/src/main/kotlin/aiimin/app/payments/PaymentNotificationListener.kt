package aiimin.app.payments

import android.app.Notification
import android.os.Build
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import aiimin.core.data.money.PaymentDraftSource
import aiimin.core.data.money.PaymentInboxStore
import dagger.hilt.android.AndroidEntryPoint
import javax.inject.Inject

/**
 * Opt-in payment-alert ingest via notification listener — **not SMS**.
 *
 * Play forbids READ_SMS for AIIMIN. This service only runs after the user
 * enables it in system Settings → Notification access. Matched drafts go to
 * [PaymentInboxStore] for human approve; raw text never leaves the device.
 *
 * Bank apps often put the amount in InboxStyle lines / MessagingStyle —
 * not only `android.text`.
 */
@AndroidEntryPoint
class PaymentNotificationListener : NotificationListenerService() {

    @Inject lateinit var inbox: PaymentInboxStore

    override fun onNotificationPosted(sbn: StatusBarNotification?) {
        val n = sbn?.notification ?: return
        val extras = n.extras ?: return
        val parts = mutableListOf<String>()
        fun add(cs: CharSequence?) {
            val s = cs?.toString()?.trim().orEmpty()
            if (s.isNotBlank()) parts += s
        }
        add(extras.getCharSequence(Notification.EXTRA_TITLE))
        add(extras.getCharSequence(Notification.EXTRA_TEXT))
        add(extras.getCharSequence(Notification.EXTRA_BIG_TEXT))
        add(extras.getCharSequence(Notification.EXTRA_SUB_TEXT))
        add(extras.getCharSequence(Notification.EXTRA_INFO_TEXT))
        add(extras.getCharSequence(Notification.EXTRA_SUMMARY_TEXT))
        extras.getCharSequenceArray(Notification.EXTRA_TEXT_LINES)?.forEach { add(it) }
        if (Build.VERSION.SDK_INT >= 24) {
            @Suppress("UNCHECKED_CAST")
            val messages = extras.getParcelableArray(Notification.EXTRA_MESSAGES)
            messages?.forEach { msg ->
                // Bundle-shaped message from MessagingStyle
                val bundle = msg as? android.os.Bundle ?: return@forEach
                add(bundle.getCharSequence("text"))
            }
        }
        val body = parts.distinct().joinToString(" · ")
        if (body.length < 12) return
        val lower = body.lowercase()
        val moneyish = listOf(
            "rs.", "rs ", "₹", "inr", "debited", "credited", "spent",
            "paid", "upi", "a/c", "account", "txn", "transaction",
            "sent", "received", "withdrawn",
        ).any { it in lower }
        if (!moneyish) return
        inbox.ingest(body, PaymentDraftSource.NOTIFICATION)
    }
}
