package aiimin.app

import aiimin.core.data.money.MoneyRepository
import aiimin.core.data.notify.NotificationRepository
import aiimin.core.data.pulse.Pulse
import aiimin.core.data.pulse.Reason
import aiimin.core.data.sync.AuthRepository
import android.app.Application
import android.content.Context
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.work.Constraints
import androidx.work.CoroutineWorker
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.ExistingWorkPolicy
import androidx.work.NetworkType
import androidx.work.OneTimeWorkRequestBuilder
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import androidx.work.WorkerParameters
import androidx.work.workDataOf
import dagger.hilt.EntryPoint
import dagger.hilt.InstallIn
import dagger.hilt.android.EntryPointAccessors
import dagger.hilt.android.HiltAndroidApp
import dagger.hilt.components.SingletonComponent
import java.util.concurrent.TimeUnit
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch

@HiltAndroidApp
class AiiminApplication : Application() {

    val appScope = CoroutineScope(SupervisorJob() + Dispatchers.Default)

    override fun onCreate() {
        super.onCreate()
        NotificationRepository.ensureChannels(this)
        val deps = EntryPointAccessors.fromApplication(this, AppDeps::class.java)
        appScope.launch { runCatching { deps.auth().restore() } }
        // Offline edits go as soon as the network is back, without waiting for the half-hourly job.
        runCatching {
            val cm = getSystemService(Context.CONNECTIVITY_SERVICE) as android.net.ConnectivityManager
            cm.registerDefaultNetworkCallback(object : android.net.ConnectivityManager.NetworkCallback() {
                override fun onAvailable(network: android.net.Network) {
                    appScope.launch { if (runCatching { deps.auth().current().signedIn }.getOrDefault(false)) requestSync(this@AiiminApplication) }
                }
            })
        }
        // One heartbeat for every background job (plan Phase 15). In front: a beat on open and every
        // minute. Closed: the 15-minute worker. A job the phone skipped runs first on the next beat.
        androidx.lifecycle.ProcessLifecycleOwner.get().lifecycle.addObserver(object : androidx.lifecycle.DefaultLifecycleObserver {
            override fun onStart(owner: androidx.lifecycle.LifecycleOwner) = deps.pulse().setForeground(true)
            override fun onStop(owner: androidx.lifecycle.LifecycleOwner) = deps.pulse().setForeground(false)
        })
        PulseWorker.schedule(this)
        // Home-screen widgets (PRD 1.4): Pulse refreshes them every 30 minutes (1 in front), and a change to
        // today's tasks, minimums or settings refreshes the Today widget at once.
        deps.pulse().register(aiimin.core.engine.pulse.Job.WIDGET) {
            aiimin.app.today.TodayWidget.refresh(this)
            aiimin.app.notes.NotesWidget.refresh(this)
        }
        appScope.launch { deps.widgets().changes.collect { aiimin.app.today.TodayWidget.refresh(this@AiiminApplication) } }
        // Sync has its own job: network constraint (Wi-Fi only if asked) and exponential retry.
        appScope.launch {
            val wifiOnly = runCatching { deps.settings().current().syncWifiOnly }.getOrDefault(false)
            aiimin.core.data.sync.SyncScheduler.schedulePeriodic(this@AiiminApplication, wifiOnly)
        }
    }
}

@EntryPoint
@InstallIn(SingletonComponent::class)
interface AppDeps {
    fun pulse(): Pulse
    fun widgets(): aiimin.core.data.today.WidgetSource
    fun money(): MoneyRepository
    fun auth(): AuthRepository
    fun settings(): aiimin.core.data.settings.SettingsStore
}

/** Runs a Pulse beat with the app closed: every 15 minutes, after boot, and on demand. */
class PulseWorker(context: Context, params: WorkerParameters) : CoroutineWorker(context, params) {
    override suspend fun doWork(): Result {
        val deps = EntryPointAccessors.fromApplication(applicationContext, AppDeps::class.java)
        val reason = runCatching { Reason.valueOf(inputData.getString("reason") ?: "") }.getOrDefault(Reason.WORKER)
        // After a reboot or an update, measure and re-arm reminders at once instead of waiting for freshness.
        val force = if (reason == Reason.BOOT) setOf(aiimin.core.engine.pulse.Job.DEVICE, aiimin.core.engine.pulse.Job.DAY, aiimin.core.engine.pulse.Job.NOTIFY) else emptySet()
        return runCatching { deps.pulse().beat(reason, force = force) }.fold({ Result.success() }, { Result.retry() })
    }

    companion object {
        fun schedule(context: Context) {
            val wm = WorkManager.getInstance(context)
            wm.cancelUniqueWork("maintenance") // the 30-minute job Pulse replaced
            wm.enqueueUniquePeriodicWork(
                "pulse",
                ExistingPeriodicWorkPolicy.UPDATE,
                PeriodicWorkRequestBuilder<PulseWorker>(15, TimeUnit.MINUTES, 5, TimeUnit.MINUTES).build(),
            )
        }

        fun now(context: Context, reason: Reason) = WorkManager.getInstance(context).enqueueUniqueWork(
            "pulse-now", ExistingWorkPolicy.KEEP,
            OneTimeWorkRequestBuilder<PulseWorker>().setInputData(workDataOf("reason" to reason.name)).build(),
        )
    }
}

/** After a restart nothing of ours is running; one beat brings every job back. */
class BootReceiver : android.content.BroadcastReceiver() {
    override fun onReceive(context: Context, intent: android.content.Intent) {
        if (intent.action == android.content.Intent.ACTION_BOOT_COMPLETED || intent.action == android.content.Intent.ACTION_MY_PACKAGE_REPLACED) {
            PulseWorker.now(context, Reason.BOOT)
        }
    }
}

/** "Your focus block is up" — fires once at the planned end, even with the app closed. */
class FocusDoneWorker(context: Context, params: WorkerParameters) : CoroutineWorker(context, params) {
    override suspend fun doWork(): Result {
        val label = inputData.getString("label") ?: "Focus"
        val minutes = inputData.getInt("minutes", 25)
        // Through the engine: the focus channel, Raahi's face, quiet hours and the Playful setting (PRD 2.1).
        runCatching { EntryPointAccessors.fromApplication(applicationContext, aiimin.app.notify.NotifyDeps::class.java).notifications().focusDone(label, minutes) }
        return Result.success()
    }

    companion object {
        fun schedule(context: Context, label: String, minutesLeft: Long, planned: Int) {
            WorkManager.getInstance(context).enqueueUniqueWork(
                "focus-done", ExistingWorkPolicy.REPLACE,
                OneTimeWorkRequestBuilder<FocusDoneWorker>()
                    .setInitialDelay(minutesLeft.coerceAtLeast(0), TimeUnit.MINUTES)
                    .setInputData(workDataOf("label" to label, "minutes" to planned))
                    .build(),
            )
        }

        fun cancel(context: Context) = WorkManager.getInstance(context).cancelUniqueWork("focus-done")
    }
}

/** One-off sync when the network comes back (e.g. after offline edits). */
fun requestSync(context: Context) = aiimin.core.data.sync.SyncScheduler.requestNow(context)
