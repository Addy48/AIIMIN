package aiimin.app.notify

import aiimin.core.data.money.BillRepository
import aiimin.core.data.notify.NotificationRepository
import aiimin.core.data.notify.NotifyAlarms
import aiimin.core.data.plan.TaskRepository
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import dagger.hilt.EntryPoint
import dagger.hilt.InstallIn
import dagger.hilt.android.EntryPointAccessors
import dagger.hilt.components.SingletonComponent
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch

@EntryPoint
@InstallIn(SingletonComponent::class)
interface NotifyDeps {
    fun notifications(): NotificationRepository
    fun tasks(): TaskRepository
    fun bills(): BillRepository
}

private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Default)

private fun BroadcastReceiver.work(context: Context, block: suspend (NotifyDeps) -> Unit) {
    val pending = goAsync()
    val deps = EntryPointAccessors.fromApplication(context.applicationContext, NotifyDeps::class.java)
    scope.launch {
        try { runCatching { block(deps) } } finally { pending.finish() }
    }
}

/** The exact alarm for the next due notice: run the engine now (PRD 2.1, NF1). */
class NotifyAlarmReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) = work(context) { it.notifications().run() }
}

/** Done, Snooze and Mark paid from the notification itself, and the shade's swipe-away (master plan 14.7). */
class NotifyActionReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val key = intent.getStringExtra(NotificationRepository.EXTRA_KEY) ?: return
        val arg = intent.getStringExtra(NotificationRepository.EXTRA_ARG)
        when (intent.getStringExtra(NotifyAlarms.EXTRA_ACTION)) {
            "dismissed" -> work(context) { it.notifications().dismissedInShade(key) }
            "done" -> work(context) { d ->
                d.notifications().opened(key)
                if (arg != null && d.tasks().get(arg)?.done == false) d.tasks().toggle(arg)
                d.notifications().cancel(key)
            }
            "paid" -> work(context) { d ->
                d.notifications().opened(key)
                arg?.let { d.bills().markPaid(it) }
                d.notifications().cancel(key)
            }
            "snooze" -> work(context) { d -> d.notifications().snooze(key, if (key.startsWith("event:")) 5 else 60) }
        }
    }
}
