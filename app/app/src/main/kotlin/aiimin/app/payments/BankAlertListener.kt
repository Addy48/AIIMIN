package aiimin.app.payments

import aiimin.app.AiiminApplication
import aiimin.app.AppDeps
import android.app.Notification
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import dagger.hilt.android.EntryPointAccessors
import kotlinx.coroutines.launch

/**
 * Reads payment alerts from bank and UPI app notifications (opt-in, Me →
 * Sensors). Text is parsed on the phone and dropped into the Money review
 * inbox; duplicates are ignored by reference number. Nothing else is read or kept.
 */
class BankAlertListener : NotificationListenerService() {

    override fun onNotificationPosted(sbn: StatusBarNotification) {
        if (sbn.packageName == packageName) return
        val extras = sbn.notification?.extras ?: return
        val text = listOfNotNull(
            extras.getCharSequence(Notification.EXTRA_TITLE),
            extras.getCharSequence(Notification.EXTRA_BIG_TEXT) ?: extras.getCharSequence(Notification.EXTRA_TEXT),
        ).joinToString(" ").trim()
        if (!PAYMENT.containsMatchIn(text) || !AMOUNT.containsMatchIn(text)) return
        val app = application as AiiminApplication
        val money = EntryPointAccessors.fromApplication(app, AppDeps::class.java).money()
        app.appScope.launch { runCatching { money.capture(text, "notification") } }
    }

    private companion object {
        val PAYMENT = Regex("""\b(debited|credited|spent|paid|received|withdrawn|sent|refund(ed)?)\b""", RegexOption.IGNORE_CASE)
        val AMOUNT = Regex("""(rs\.?|inr|₹)\s*[\d,]+""", RegexOption.IGNORE_CASE)
    }
}
