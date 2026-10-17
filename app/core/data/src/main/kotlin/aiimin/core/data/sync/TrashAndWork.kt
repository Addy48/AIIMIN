package aiimin.core.data.sync

import aiimin.core.data.core.EventLogger
import aiimin.core.data.settings.SettingsStore
import aiimin.core.database.CalendarDao
import aiimin.core.database.GoalDao
import aiimin.core.database.NoteDao
import aiimin.core.database.TaskDao
import android.content.Context
import androidx.work.BackoffPolicy
import androidx.work.Constraints
import androidx.work.CoroutineWorker
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.ExistingWorkPolicy
import androidx.work.NetworkType
import androidx.work.OneTimeWorkRequestBuilder
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import androidx.work.WorkerParameters
import dagger.hilt.EntryPoint
import dagger.hilt.InstallIn
import dagger.hilt.android.EntryPointAccessors
import dagger.hilt.components.SingletonComponent
import java.util.concurrent.TimeUnit
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.combine

/** One row in Trash (G7). */
data class TrashItem(val kind: String, val id: String, val title: String, val deletedAt: Long) {
    /** Whole days until it is removed for good (30-day window). */
    fun daysLeft(now: Long = System.currentTimeMillis()): Int =
        (TrashRepository.KEEP_DAYS - ((now - deletedAt) / 86_400_000L).toInt()).coerceAtLeast(0)
}

/**
 * Deleted tasks, notes, events and goals stay 30 days, then go for good. Restoring brings the item
 * back here and, when sync is on, back to aiimin.in as a new item. A delete still waiting to reach
 * the web is removed for good right after that sync settles it.
 */
@Singleton
class TrashRepository @Inject constructor(
    private val tasks: TaskDao,
    private val notes: NoteDao,
    private val calendar: CalendarDao,
    private val goals: GoalDao,
    private val log: EventLogger,
) {
    val items: Flow<List<TrashItem>> = combine(tasks.trashed(), notes.trashed(), calendar.trashed(), goals.trashed()) { t, n, e, g ->
        (
            t.map { TrashItem(SyncRepository.KIND_TASK, it.id, it.title, it.updatedAt) } +
                n.map { TrashItem(SyncRepository.KIND_NOTE, it.id, it.title.ifBlank { it.body.take(40) }.ifBlank { "Untitled" }, it.updatedAt) } +
                e.map { TrashItem(SyncRepository.KIND_EVENT, it.id, it.title, it.updatedAt) } +
                g.map { TrashItem(SyncRepository.KIND_GOAL, it.id, it.title, it.updatedAt) }
            ).filter { it.deletedAt > 0 }.sortedByDescending { it.deletedAt }
    }

    suspend fun restore(item: TrashItem) {
        val now = System.currentTimeMillis()
        when (item.kind) {
            SyncRepository.KIND_TASK -> tasks.get(item.id)?.let { tasks.upsert(it.copy(deleted = false, updatedAt = now)) }
            SyncRepository.KIND_NOTE -> notes.get(item.id)?.let { notes.upsert(it.copy(deleted = false, dirty = true, updatedAt = now)) }
            SyncRepository.KIND_EVENT -> calendar.get(item.id)?.let { calendar.upsert(it.copy(deleted = false, updatedAt = now)) }
            SyncRepository.KIND_GOAL -> goals.get(item.id)?.let { goals.upsert(it.copy(deleted = false, updatedAt = now)) }
        }
        log.log("trash.restore", item.kind, item.id)
    }

    /**
     * Removes it for good. If the web copy is still to be deleted, the row is kept (hidden, stamped 0)
     * until the next sync has done that, then [purge] takes it.
     */
    suspend fun deleteForever(item: TrashItem) {
        when (item.kind) {
            SyncRepository.KIND_TASK -> tasks.get(item.id)?.let { if (it.remoteId == null) tasks.deleteForever(it.id) else tasks.upsert(it.copy(updatedAt = 0)) }
            SyncRepository.KIND_NOTE -> notes.get(item.id)?.let { if (!it.dirty) notes.deleteForever(it.id) else notes.upsert(it.copy(updatedAt = 0)) }
            SyncRepository.KIND_EVENT -> calendar.get(item.id)?.let { if (it.remoteId == null) calendar.deleteForever(it.id) else calendar.upsert(it.copy(updatedAt = 0)) }
            SyncRepository.KIND_GOAL -> goals.get(item.id)?.let { if (it.remoteId == null) goals.deleteForever(it.id) else goals.upsert(it.copy(updatedAt = 0)) }
        }
        log.log("trash.delete", item.kind, item.id)
    }

    suspend fun empty(list: List<TrashItem>) = list.forEach { deleteForever(it) }

    /** Run from maintenance: everything past 30 days (and settled with the web) goes. */
    suspend fun purge(now: Long = System.currentTimeMillis()): Int {
        val before = now - KEEP_DAYS * 86_400_000L
        return tasks.purgeTrashed(before) + notes.purgeTrashed(before) + calendar.purgeTrashed(before) + goals.purgeTrashed(before)
    }

    companion object {
        const val KEEP_DAYS = 30
    }
}

@EntryPoint
@InstallIn(SingletonComponent::class)
interface SyncDeps {
    fun sync(): SyncRepository
    fun settings(): SettingsStore
    fun trash(): TrashRepository
}

/**
 * Background sync. A failed run (offline, server error) asks WorkManager to retry with exponential
 * backoff starting at 30 s; the repository applies the same schedule to foreground triggers.
 */
class SyncWorker(context: Context, params: WorkerParameters) : CoroutineWorker(context, params) {
    override suspend fun doWork(): Result {
        val deps = EntryPointAccessors.fromApplication(applicationContext, SyncDeps::class.java)
        val sync = deps.sync()
        val report = runCatching { sync.sync(force = true) }.getOrNull()
        runCatching { deps.trash().purge() }
        return when {
            report == null && sync.state.value is SyncState.SignedOut -> Result.success()
            report == null && sync.state.value is SyncState.Attention -> Result.success() // needs the person (sign in again)
            report == null -> if (runAttemptCount < 8) Result.retry() else Result.success()
            report.failed > 0 && runAttemptCount < 8 -> Result.retry()
            else -> Result.success()
        }
    }
}

object SyncScheduler {
    private const val PERIODIC = "sync-periodic"
    private const val NOW = "sync-now"

    private fun constraints(wifiOnly: Boolean) = Constraints.Builder()
        .setRequiredNetworkType(if (wifiOnly) NetworkType.UNMETERED else NetworkType.CONNECTED)
        .build()

    /** Every 30 minutes while signed in; [wifiOnly] follows the Sync settings switch. */
    fun schedulePeriodic(context: Context, wifiOnly: Boolean) {
        WorkManager.getInstance(context).enqueueUniquePeriodicWork(
            PERIODIC, ExistingPeriodicWorkPolicy.UPDATE,
            PeriodicWorkRequestBuilder<SyncWorker>(30, TimeUnit.MINUTES)
                .setConstraints(constraints(wifiOnly))
                .setBackoffCriteria(BackoffPolicy.EXPONENTIAL, Backoff.BASE_MS, TimeUnit.MILLISECONDS)
                .build(),
        )
    }

    /** One run as soon as there is a network (offline edits, network back, after sign-in). */
    fun requestNow(context: Context, wifiOnly: Boolean = false) {
        WorkManager.getInstance(context).enqueueUniqueWork(
            NOW, ExistingWorkPolicy.KEEP,
            OneTimeWorkRequestBuilder<SyncWorker>()
                .setConstraints(constraints(wifiOnly))
                .setBackoffCriteria(BackoffPolicy.EXPONENTIAL, Backoff.BASE_MS, TimeUnit.MILLISECONDS)
                .build(),
        )
    }

    fun cancel(context: Context) {
        WorkManager.getInstance(context).cancelUniqueWork(PERIODIC)
        WorkManager.getInstance(context).cancelUniqueWork(NOW)
    }
}
