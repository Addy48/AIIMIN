package aiimin.core.data.notify

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build

/**
 * One exact alarm for the next due notice (PRD 2.1, fixes NF1): the engine runs again at that minute. Without the
 * exact-alarm permission it uses a one-minute window instead. The receivers live in the app module.
 */
object NotifyAlarms {
    private const val ALARM = "aiimin.app.notify.NotifyAlarmReceiver"
    private const val ACTION = "aiimin.app.notify.NotifyActionReceiver"
    const val EXTRA_ACTION = "aiimin.notify.action"

    private fun alarmIntent(context: Context): PendingIntent = PendingIntent.getBroadcast(
        context, 4401, Intent().setClassName(context.packageName, ALARM), PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT,
    )

    fun arm(context: Context, atMs: Long) {
        val am = context.getSystemService(AlarmManager::class.java) ?: return
        val pi = alarmIntent(context)
        runCatching {
            if (Build.VERSION.SDK_INT < 31 || am.canScheduleExactAlarms()) am.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, atMs, pi)
            else am.setWindow(AlarmManager.RTC_WAKEUP, atMs, 60_000L, pi)
        }
    }

    fun cancel(context: Context) {
        runCatching { context.getSystemService(AlarmManager::class.java)?.cancel(alarmIntent(context)) }
    }

    /** Done, Snooze, Mark paid and the shade's swipe-away, handled without opening the app. */
    fun actionIntent(context: Context, key: String, action: String, arg: String?): PendingIntent = PendingIntent.getBroadcast(
        context, (key + action).hashCode(),
        Intent().setClassName(context.packageName, ACTION).putExtra(NotificationRepository.EXTRA_KEY, key).putExtra(EXTRA_ACTION, action).putExtra(NotificationRepository.EXTRA_ARG, arg),
        PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT,
    )
}
