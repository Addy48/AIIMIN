package `in`.aiimin.app.sync

import android.content.Context
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import `in`.aiimin.app.AiiminApp

class SyncWorker(
    appContext: Context,
    params: WorkerParameters,
) : CoroutineWorker(appContext, params) {

    override suspend fun doWork(): Result {
        val app = applicationContext as? AiiminApp ?: return Result.failure()
        if (app.container.sessionStore.currentToken().isNullOrBlank()) {
            return Result.success()
        }
        val hadPending = app.container.db.outbox().pendingCount() > 0
        val syncResult = app.container.repository.syncAll()
        return when {
            syncResult.isSuccess -> Result.success()
            hadPending && runAttemptCount < 5 -> Result.retry()
            else -> Result.failure()
        }
    }
}
