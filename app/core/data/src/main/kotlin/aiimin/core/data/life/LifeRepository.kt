package aiimin.core.data.life

import aiimin.core.data.core.DayClock
import aiimin.core.data.core.EventLogger
import aiimin.core.data.day.DayRepository
import aiimin.core.data.settings.AppSettings
import aiimin.core.data.settings.SettingsStore
import aiimin.core.database.DeviceDayDao
import aiimin.core.database.EventDao
import aiimin.core.engine.Battery
import aiimin.core.engine.DaySnapshot
import aiimin.core.engine.IntentionSet
import aiimin.core.engine.LifeEngine
import aiimin.core.engine.LifeReadout
import aiimin.core.engine.ScoreEngine
import aiimin.core.engine.Signals
import aiimin.core.engine.Tier
import aiimin.core.engine.VerifiedConsistency
import aiimin.core.engine.VerifiedConsistencyEngine
import aiimin.core.engine.XpAward
import aiimin.core.engine.XpEvent
import aiimin.core.engine.XpPolicy
import aiimin.core.engine.XpState
import java.time.LocalDate
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.FlowPreview
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.debounce
import kotlinx.coroutines.flow.flowOn
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.mapLatest
import kotlinx.coroutines.flow.stateIn

/** One "Move it today" idea with its projected gain to today's index. */
data class Nudge(val label: String, val gain: Double, val action: NudgeAction)

enum class NudgeAction { FINISH_TASK, KEEP_MINIMUM, FOCUS_25, JOURNAL, WALK }

data class LifeView(
    val readout: LifeReadout,
    val today: DaySnapshot,
    val todayIndex: Double?,
    val nudges: List<Nudge>,
    val vcs: VerifiedConsistency,
    val intentions: IntentionSet,
    val settings: AppSettings,
    /** History used, oldest first (settled + closed days). */
    val history: List<DaySnapshot>,
) {
    val battery: Battery get() = readout.battery
}

/**
 * The Life Score is never stored. This recomputes it from closed snapshots +
 * today's live snapshot whenever the log, the phone metrics or the settings change.
 */
@OptIn(ExperimentalCoroutinesApi::class, FlowPreview::class)
@Singleton
class LifeRepository @Inject constructor(
    private val days: DayRepository,
    private val settings: SettingsStore,
    private val clock: DayClock,
    events: EventDao,
    device: DeviceDayDao,
) {
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Default)
    private val engine = LifeEngine(clock.rules)

    val view: StateFlow<LifeView?> = combine(
        events.countFlow(),
        settings.settings,
        days.closedDays,
        clock.tick,
        device.since(LocalDate.now().minusDays(1).toString()),
    ) { _, s, _, _, _ -> s }
        .debounce(120)
        .mapLatest { s -> compute(s) }
        .flowOn(Dispatchers.Default)
        .stateIn(scope, SharingStarted.Eagerly, null)

    suspend fun compute(): LifeView = compute(settings.current())

    suspend fun compute(s: AppSettings): LifeView {
        val today = days.liveSnapshot()
        val history = days.history().filter { it.day < today.day }
        val readout = engine.evaluate(s.intentions, history, today, s.batteryMode, today.day)
        val score = ScoreEngine(clock.rules, s.intentions.applyPending(today.day))
        val base = readout.today?.value
        val nudges = buildList {
            fun gain(label: String, a: NudgeAction, change: (DaySnapshot) -> DaySnapshot) {
                val g = score.projectedGain(today, history, change)
                if (g > 0.05) add(Nudge(label, g, a))
            }
            val t = today.minimums
            if (t.kept < t.planned) {
                gain("Keep one more minimum", NudgeAction.KEEP_MINIMUM) {
                    it.copy(values = it.values + (Signals.MINIMUMS to (t.kept + 1.0) / t.planned * 100), minimums = t.copy(kept = t.kept + 1))
                }
            }
            val tasksV = today.value(Signals.TASKS)
            if (tasksV != null && tasksV < 100) {
                gain("Finish your next planned task", NudgeAction.FINISH_TASK) { it.copy(values = it.values + (Signals.TASKS to minOf(100.0, tasksV + 25))) }
            }
            val f = today.value(Signals.FOCUS) ?: 0.0
            gain("A 25-minute focus block", NudgeAction.FOCUS_25) {
                it.copy(values = it.values + (Signals.FOCUS to f + 25), evidence = it.evidence + (Signals.FOCUS to Tier.A))
            }
            if ((today.value(Signals.JOURNAL) ?: 0.0) < 1.0) {
                gain("Journal 40 words", NudgeAction.JOURNAL) {
                    it.copy(values = it.values + (Signals.JOURNAL to 1.0), evidence = it.evidence + (Signals.JOURNAL to Tier.B))
                }
            }
            today.value(Signals.STEPS)?.let { st ->
                gain("A 20-minute walk", NudgeAction.WALK) { it.copy(values = it.values + (Signals.STEPS to st + 2000)) }
            }
        }.sortedByDescending { it.gain }.take(3)
        val vcs = VerifiedConsistencyEngine(clock.rules).compute(readout.series, readout.streak.keptDays)
        return LifeView(readout, today, base, nudges, vcs, s.intentions, s, history)
    }
}

/** XP: outcomes and verified effort only; creating earns nothing. Never feeds the score. */
@Singleton
class XpRepository @Inject constructor(
    private val settings: SettingsStore,
    private val clock: DayClock,
    private val log: EventLogger,
) {
    private val policy = XpPolicy(clock.rules)

    val state: Flow<XpState> = settings.settings.map { it.xp }

    suspend fun award(event: XpEvent): XpAward {
        val today = clock.today()
        var award: XpAward? = null
        settings.update { s ->
            val a = policy.award(s.xp, event, today)
            award = a
            s.copy(xp = a.state)
        }
        val a = award!!
        if (a.awarded > 0) log.log("xp.award", data = mapOf("n" to a.awarded, "what" to event::class.simpleName), tier = Tier.C, source = "system")
        return a
    }

    suspend fun reverse(amount: Int) {
        if (amount <= 0) return
        settings.update { it.copy(xp = policy.reverse(it.xp, amount)) }
    }
}
