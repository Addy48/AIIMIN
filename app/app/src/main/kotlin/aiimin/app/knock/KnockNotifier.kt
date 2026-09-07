package aiimin.app.knock

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import aiimin.app.MainActivity
import aiimin.core.data.knock.KnockChannel
import aiimin.core.data.knock.KnockDecision
import aiimin.app.R

object KnockNotifier {

    const val EXTRA_LINK = "aiimin.knock"

    fun ensureChannels(context: Context) {
        if (Build.VERSION.SDK_INT < 26) return
        val nm = context.getSystemService(NotificationManager::class.java) ?: return
        KnockChannel.entries.forEach { ch ->
            val existing = nm.getNotificationChannel(ch.id)
            if (existing != null) return@forEach
            val importance = when (ch) {
                KnockChannel.DAY_MORNING, KnockChannel.SCORE_WEEK, KnockChannel.NOTES_PARK ->
                    NotificationManager.IMPORTANCE_LOW
                KnockChannel.SYNC_HOLD -> NotificationManager.IMPORTANCE_DEFAULT
                else -> NotificationManager.IMPORTANCE_DEFAULT
            }
            nm.createNotificationChannel(
                NotificationChannel(ch.id, ch.label, importance).apply {
                    description = ch.blurb
                },
            )
        }
    }

    fun show(context: Context, decision: KnockDecision) {
        ensureChannels(context)
        val launch = Intent(context, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_SINGLE_TOP or Intent.FLAG_ACTIVITY_CLEAR_TOP
            putExtra(EXTRA_LINK, decision.deepLink)
        }
        val pi = PendingIntent.getActivity(
            context,
            decision.case.capId.hashCode(),
            launch,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )
        val note = NotificationCompat.Builder(context, decision.case.channel.id)
            .setSmallIcon(R.drawable.ic_knock)
            .setContentTitle(decision.title)
            .setContentText(decision.body)
            .setStyle(NotificationCompat.BigTextStyle().bigText(decision.body))
            .setContentIntent(pi)
            .setAutoCancel(true)
            .setCategory(NotificationCompat.CATEGORY_REMINDER)
            .build()
        try {
            NotificationManagerCompat.from(context).notify(decision.case.capId.hashCode(), note)
        } catch (_: SecurityException) {
            // POST_NOTIFICATIONS denied — Config screen asks.
        }
    }
}
