package aiimin.app.knock

import android.content.Context
import androidx.work.Constraints
import androidx.work.CoroutineWorker
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import androidx.work.WorkerParameters
import aiimin.core.data.AgendaStore
import aiimin.core.data.ConfigStore
import aiimin.core.data.DayStore
import aiimin.core.data.NoteStore
import aiimin.core.data.SpeakingStore
import aiimin.core.data.device.DeviceMetricsRepository
import aiimin.core.data.knock.KnockEvaluator
import aiimin.core.data.knock.KnockSnapshot
import aiimin.core.data.knock.KnockStore
import aiimin.core.data.session.SessionRepository
import aiimin.core.data.sync.GraphSyncRepository
import aiimin.core.model.CommitmentShape
import dagger.hilt.EntryPoint
import dagger.hilt.InstallIn
import dagger.hilt.android.EntryPointAccessors
import dagger.hilt.components.SingletonComponent
import java.time.Instant
import java.time.ZoneId
import java.util.concurrent.TimeUnit

@EntryPoint
@InstallIn(SingletonComponent::class)
interface KnockWorkerEntryPoint {
    fun knocks(): KnockStore
    fun day(): DayStore
    fun device(): DeviceMetricsRepository
    fun sync(): GraphSyncRepository
    fun agenda(): AgendaStore
    fun notes(): NoteStore
    fun speaking(): SpeakingStore
    fun config(): ConfigStore
    fun session(): SessionRepository
}

class KnockWorker(
    appContext: Context,
    params: WorkerParameters,
) : CoroutineWorker(appContext, params) {

    override suspend fun doWork(): Result {
        KnockNotifier.ensureChannels(applicationContext)
        val ep = EntryPointAccessors.fromApplication(
            applicationContext,
            KnockWorkerEntryPoint::class.java,
        )
        val now = System.currentTimeMillis()
        val zone = ZoneId.systemDefault()
        val zoned = Instant.ofEpochMilli(now).atZone(zone)
        val knocks = ep.knocks()
        val prefs = knocks.read()
        val day = ep.day().state.value
        val device = ep.device().state.value
        val sync = ep.sync().ui.value
        val pendingFor = knocks.notePending(sync.pendingOutbox, now)
        val next = ep.agenda().state.value.events
            .filter { !it.allDay && it.startEpochMs >= now }
            .minByOrNull { it.startEpochMs }
        val aging = ep.notes().state.value.notes
            .filter { it.pinned && now - it.updatedAt >= 3L * 86_400_000L }
            .minByOrNull { it.updatedAt }
        val snapshot = KnockSnapshot(
            nowMs = now,
            minuteOfDay = zoned.hour * 60 + zoned.minute,
            dayOfWeek = zoned.dayOfWeek.value,
            osId = ep.config().state.value.identity.osId,
            masterOn = prefs.masterOn,
            quietStartMin = prefs.quietStartMin,
            quietEndMin = prefs.quietEndMin,
            channelOn = knocks.channelMap(),
            firedToday = knocks.firedToday(now),
            openedThisEvening = knocks.openedThisEvening(now),
            openMinimums = day.pursuits.count {
                val v = it.observation.value
                v == null || (it.commitment.shape == CommitmentShape.SHOW_UP && v <= 0.0)
            },
            settleCount = day.captures.size,
            tickCount = day.pursuits.count { (it.observation.value ?: 0.0) > 0.0 },
            streakAtRisk = null,
            steps = device.steps,
            stepsTarget = device.stepsTarget,
            screenMs = device.screenTimeMs,
            screenTargetMs = device.screenTargetMs,
            speakingToday = ep.speaking().state.value.sessions.count { session ->
                Instant.ofEpochMilli(session.loggedAtMs).atZone(zone).toLocalDate() ==
                    zoned.toLocalDate()
            },
            tier = ep.config().state.value.identity.tier,
            pendingOutbox = sync.pendingOutbox,
            pendingForMs = pendingFor,
            lastError = sync.lastError,
            agendaTitle = next?.title,
            agendaInMs = next?.let { it.startEpochMs - now },
            agingPinnedTitle = aging?.title,
            lifeScore = null,
            isCorePlus = ep.config().state.value.identity.tier.rank >= 1,
        )
        val decisions = KnockEvaluator.evaluate(snapshot)
        decisions.forEach { KnockNotifier.show(applicationContext, it) }
        knocks.markFired(now, decisions.map { it.case.capId })
        return Result.success()
    }
}

object KnockScheduler {
    private const val NAME = "aiimin_v3_knocks"

    fun schedulePeriodic(context: Context) {
        KnockNotifier.ensureChannels(context)
        val work = PeriodicWorkRequestBuilder<KnockWorker>(15, TimeUnit.MINUTES)
            .setConstraints(Constraints.Builder().build())
            .build()
        WorkManager.getInstance(context).enqueueUniquePeriodicWork(
            NAME,
            ExistingPeriodicWorkPolicy.UPDATE,
            work,
        )
    }
}
