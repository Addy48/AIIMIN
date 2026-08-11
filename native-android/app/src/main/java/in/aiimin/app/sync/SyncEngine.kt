package `in`.aiimin.app.sync

import android.content.Context
import `in`.aiimin.app.data.local.AiiminDatabase
import `in`.aiimin.app.data.repo.MobileRepository
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch

class SyncEngine(
    private val repository: MobileRepository,
    private val db: AiiminDatabase,
    private val context: Context,
) {
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.IO)

    init {
        scope.launch {
            db.outbox().observePendingCount().collectLatest { count ->
                repository.updatePendingOutboxCount(count)
            }
        }
    }

    fun scheduleBackgroundSync() {
        SyncWorkScheduler.schedulePeriodic(context)
    }

    fun syncNow() {
        SyncWorkScheduler.enqueueNow(context)
        scope.launch { repository.syncAll() }
    }
}
