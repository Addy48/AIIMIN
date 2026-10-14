package aiimin.core.data.pulse

import aiimin.core.data.core.DayClock
import aiimin.core.data.day.DayRepository
import aiimin.core.data.device.DeviceRepository
import aiimin.core.data.life.LifeRepository
import aiimin.core.data.money.MoneyRepository
import aiimin.core.data.notify.NotificationRepository
import aiimin.core.data.plan.MinimumRepository
import aiimin.core.data.settings.SettingsStore
import aiimin.core.data.sync.SyncRepository
import aiimin.core.data.sync.TrashRepository
import aiimin.core.data.vault.FamilyRepository
import aiimin.core.database.PulseDao
import aiimin.core.database.PulseRunEntity
import aiimin.core.engine.pulse.Freshness
import aiimin.core.engine.pulse.Job
import aiimin.core.model.ScreenSummary
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.distinctUntilChanged
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock

/** Why a beat ran; kept with the heartbeat so the diagnostics page can say what woke AIIMIN. */
enum class Reason { START, TICK, WORKER, BOOT, ALARM, MANUAL, WRITE }

/**
 * The central heartbeat. Every trigger (app opened, a minute passing while open, the 15-minute
 * worker, boot, an alarm, a data write) calls [beat]; Pulse decides which jobs are due with
 * [Freshness], runs them in order, and records a heartbeat per job. A job the phone kept from
 * running (battery managers kill workers) is overdue on the next beat and runs first.
 */
@OptIn(ExperimentalCoroutinesApi::class)
@Singleton
class Pulse @Inject constructor(
    private val days: DayRepository,
    private val money: MoneyRepository,
    private val device: DeviceRepository,
    private val family: FamilyRepository,
    private val notifications: NotificationRepository,
    private val sync: SyncRepository,
    private val trash: TrashRepository,
    private val settings: SettingsStore,
    private val clock: DayClock,
    private val dao: PulseDao,
    life: LifeRepository,
    minimums: MinimumRepository,
) {
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Default)
    private val mutex = Mutex()
    private val extra = HashMap<Job, suspend () -> Unit>()
    private val _foreground = MutableStateFlow(false)
    val foreground: StateFlow<Boolean> = _foreground.asStateFlow()
    private var ticker: kotlinx.coroutines.Job? = null
    private var pokeJob: kotlinx.coroutines.Job? = null
    private val poked = HashSet<Job>()
    private val _running = MutableStateFlow(false)
    val running: StateFlow<Boolean> = _running.asStateFlow()

    val runs: Flow<List<PulseRunEntity>> = dao.observe()

    val liveDay: StateFlow<LiveDay?> = clock.todayFlow.distinctUntilChanged().flatMapLatest { day ->
        combine(device.observe(day), minimums.today(day), life.view, notifications.unread) { d, mins, l, unread ->
            val shown = mins.filter { it.planned || it.done }
            LiveDay(
                date = day,
                device = d,
                screen = d?.screenMs?.let { ScreenSummary.of(it, d.screenPersonalMs ?: it, emptyList(), 0) },
                minimumsDone = shown.count { it.done },
                minimumsTotal = shown.size,
                life = l,
                unread = unread,
            )
        }
    }.stateIn(scope, SharingStarted.WhileSubscribed(5_000), null)

    /** Lets the app module plug in jobs that live there (the Glance widget). */
    fun register(job: Job, runner: suspend () -> Unit) {
        extra[job] = runner
    }

    /** App came to the front (or left). While in front, a beat runs at the top of every minute. */
    fun setForeground(fg: Boolean) {
        _foreground.value = fg
        ticker?.cancel()
        ticker = null
        if (fg) {
            scope.launch { beat(Reason.START) }
            ticker = scope.launch {
                while (isActive) {
                    delay(60_000L - System.currentTimeMillis() % 60_000L)
                    beat(Reason.TICK)
                }
            }
        }
    }

    /** A write happened; refresh just these jobs half a second later, coalescing bursts. */
    fun poke(vararg jobs: Job) {
        synchronized(poked) { poked += jobs }
        pokeJob?.cancel()
        pokeJob = scope.launch {
            delay(500)
            val only = synchronized(poked) { poked.toSet().also { poked.clear() } }
            beat(Reason.WRITE, force = only, only = only)
        }
    }

    /** Runs every due job (plus [force]); with [only], nothing outside it. Safe to call from anywhere. */
    suspend fun beat(reason: Reason, force: Set<Job> = emptySet(), only: Set<Job>? = null) {
        // A tick that lands while a beat is running has nothing new to add.
        if (reason == Reason.TICK && mutex.isLocked) return
        mutex.withLock {
            if (!runCatching { settings.current().onboarded }.getOrDefault(false)) return
            _running.value = true
            try {
                val now = System.currentTimeMillis()
                val prev = dao.all().associateBy { it.job }
                val lastOk = prev.mapNotNull { (k, v) -> v.lastOkAt?.let { t -> runCatching { Job.valueOf(k) }.getOrNull()?.to(t) } }.toMap()
                val plan = Freshness.plan(lastOk, now, _foreground.value, force).filter { only == null || it in only }
                for (job in plan) {
                    val runner = runnerFor(job, job in force) ?: continue
                    val started = System.currentTimeMillis()
                    val result = runCatching { runner() }
                    val ended = System.currentTimeMillis()
                    val old = prev[job.name]
                    dao.upsert(
                        PulseRunEntity(
                            job = job.name,
                            lastRunAt = ended,
                            lastOkAt = if (result.isSuccess) ended else old?.lastOkAt,
                            lastError = result.exceptionOrNull()?.let { "${reason.name.lowercase()}: ${it.javaClass.simpleName}: ${it.message.orEmpty().take(120)}" },
                            lastMs = ended - started,
                            runs = (old?.runs ?: 0) + 1,
                            fails = if (result.isSuccess) 0 else (old?.fails ?: 0) + 1,
                        ),
                    )
                }
            } finally {
                _running.value = false
                // Screens roll over at midnight from this tick.
                clock.pulse()
            }
        }
    }

    private fun runnerFor(job: Job, forced: Boolean): (suspend () -> Unit)? = when (job) {
        Job.DEVICE -> suspend { device.refreshRecent() }
        Job.DAY -> suspend {
            days.ensureToday()
            runCatching { money.ensureBudgetCarried() }
            runCatching { family.tick() }
            Unit
        }
        // Automatic runs respect sync's backoff after failures; a forced run does not.
        Job.SYNC -> suspend { sync.sync(force = forced); Unit }
        Job.NOTIFY -> suspend { notifications.run() }
        Job.TRASH -> suspend { trash.purge(); Unit }
        Job.WIDGET -> extra[Job.WIDGET]
    }
}
