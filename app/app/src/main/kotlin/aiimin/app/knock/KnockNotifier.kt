package aiimin.app.knock

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.ContentResolver
import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Paint
import android.media.AudioAttributes
import android.net.Uri
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.core.content.ContextCompat
import aiimin.app.MainActivity
import aiimin.core.data.knock.KnockChannel
import aiimin.core.data.knock.KnockDecision
import aiimin.app.R

object KnockNotifier {

    const val EXTRA_LINK = "aiimin.knock"
    private const val CHANNEL_VERSION = "v2"

    fun channelId(ch: KnockChannel): String = "aiimin.${ch.id}.$CHANNEL_VERSION"

    fun ensureChannels(context: Context) {
        if (Build.VERSION.SDK_INT < 26) return
        val nm = context.getSystemService(NotificationManager::class.java) ?: return

        val soundUri = Uri.parse(
            "${ContentResolver.SCHEME_ANDROID_RESOURCE}://${context.packageName}/${R.raw.aiimin_notification}",
        )
        val audioAttributes = AudioAttributes.Builder()
            .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
            .setUsage(AudioAttributes.USAGE_NOTIFICATION)
            .build()

        // Clean up legacy v1 channels so Android activates custom sound on v2 channels immediately
        KnockChannel.entries.forEach { ch ->
            runCatching { nm.deleteNotificationChannel(ch.id) }
        }

        KnockChannel.entries.forEach { ch ->
            val id = channelId(ch)
            val existing = nm.getNotificationChannel(id)
            if (existing != null) return@forEach

            val importance = when (ch) {
                KnockChannel.DAY_EVENING, KnockChannel.BODY_STEPS, KnockChannel.AGENDA_SOON ->
                    NotificationManager.IMPORTANCE_HIGH
                KnockChannel.DAY_MORNING, KnockChannel.LAB_ENGLISH, KnockChannel.MONEY_PULSE ->
                    NotificationManager.IMPORTANCE_DEFAULT
                KnockChannel.SYNC_HOLD, KnockChannel.SCORE_WEEK, KnockChannel.NOTES_PARK,
                KnockChannel.BODY_SCREEN, KnockChannel.BODY_STILL ->
                    NotificationManager.IMPORTANCE_DEFAULT
            }

            val channel = NotificationChannel(id, ch.label, importance).apply {
                description = ch.blurb
                setSound(soundUri, audioAttributes)
                enableVibration(true)
                vibrationPattern = longArrayOf(0, 120, 80, 160)
                lockscreenVisibility = android.app.Notification.VISIBILITY_PRIVATE
            }
            nm.createNotificationChannel(channel)
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

        val soundUri = Uri.parse(
            "${ContentResolver.SCHEME_ANDROID_RESOURCE}://${context.packageName}/${R.raw.aiimin_notification}",
        )
        val largeIcon = getLargeBrandIcon(context)

        val note = NotificationCompat.Builder(context, channelId(decision.case.channel))
            .setSmallIcon(R.drawable.ic_knock)
            .apply {
                if (largeIcon != null) setLargeIcon(largeIcon)
            }
            .setColor(0xFFFF6B35.toInt())
            .setContentTitle(decision.title)
            .setContentText(decision.body)
            .setStyle(NotificationCompat.BigTextStyle().bigText(decision.body))
            .setContentIntent(pi)
            .setAutoCancel(true)
            .setSound(soundUri)
            .setVibrate(longArrayOf(0, 120, 80, 160))
            .setPriority(
                when (decision.case.channel) {
                    KnockChannel.DAY_EVENING, KnockChannel.BODY_STEPS, KnockChannel.AGENDA_SOON ->
                        NotificationCompat.PRIORITY_HIGH
                    else -> NotificationCompat.PRIORITY_DEFAULT
                },
            )
            .setCategory(NotificationCompat.CATEGORY_REMINDER)
            .build()
        try {
            NotificationManagerCompat.from(context).notify(decision.case.capId.hashCode(), note)
        } catch (_: SecurityException) {
            // POST_NOTIFICATIONS denied — Config screen asks.
        }
    }

    private fun getLargeBrandIcon(context: Context): Bitmap? {
        return runCatching {
            val size = (64 * context.resources.displayMetrics.density).toInt().coerceAtLeast(128)
            val bitmap = Bitmap.createBitmap(size, size, Bitmap.Config.ARGB_8888)
            val canvas = Canvas(bitmap)

            // Circular dark backdrop matching Drafting Table #15171A
            val bgPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
                color = 0xFF15171A.toInt()
                style = Paint.Style.FILL
            }
            val radius = size / 2f
            canvas.drawCircle(radius, radius, radius, bgPaint)

            // Steel accent boundary
            val strokePaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
                color = 0x33749DC4
                style = Paint.Style.STROKE
                strokeWidth = 2f * context.resources.displayMetrics.density
            }
            canvas.drawCircle(radius, radius, radius - 1f, strokePaint)

            val drawable = ContextCompat.getDrawable(context, R.drawable.ic_launcher_foreground)
            if (drawable != null) {
                drawable.setBounds(0, 0, size, size)
                drawable.draw(canvas)
            }
            bitmap
        }.getOrNull()
    }
}

