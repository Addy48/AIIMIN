package aiimin.core.data

import aiimin.core.model.Attainment
import aiimin.core.model.Commitment
import aiimin.core.model.CommitmentKind
import aiimin.core.model.Composition
import aiimin.core.model.Hold
import aiimin.core.model.Instrument
import aiimin.core.model.InstrumentReading
import aiimin.core.model.LifeMode
import aiimin.core.model.LifeScore
import aiimin.core.model.Observation
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update

/**
 * The one place today lives, in memory, for every surface that draws it.
 *
 * Capture settles into it; Today reads from it. Without this the two surfaces
 * would tell the user different stories about the same day, which is the exact
 * drift the Genesis "one graph" rule exists to prevent.
 *
 * **This is deliberately local (guardrail G7).** It holds the shape the API will
 * fill: the `/api` writes replace [recordCapture] and the profile arrives from
 * calibration instead of [SeedProfile]. Nothing above this class has to change
 * when that happens.
 */
@Singleton
class DayStore @Inject constructor() {

    private val _state = MutableStateFlow(DayState.seed())
    val state: StateFlow<DayState> = _state.asStateFlow()

    /**
     * Config Daily minimums lands on Today scrolled to the same list
     * (spec D3 — one catalog, not a dead-end notice).
     */
    private val _focusMinimums = MutableStateFlow(false)
    val focusMinimums: StateFlow<Boolean> = _focusMinimums.asStateFlow()

    fun requestFocusMinimums() {
        _focusMinimums.value = true
    }

    fun consumeFocusMinimums() {
        _focusMinimums.value = false
    }

    /** A settled capture lands on the day. Called by Capture, read by Today. */
    fun recordCapture(label: String, time: String, amount: Int?) = _state.update { day ->
        day.copy(captures = listOf(SettledLine(label, time, amount)) + day.captures)
    }

    fun removeCapture(label: String) = _state.update { day ->
        day.copy(captures = day.captures.filterNot { it.label == label })
    }

    /**
     * Mark a pursuit done, or reopen it. Attainment is continuous, so a
     * SHOW_UP pursuit is 1.0 or 0.0, but a quantity pursuit takes the value it
     * was actually given.
     */
    fun setProgress(commitmentId: Long, value: Double?) = _state.update { day ->
        day.copy(
            today = day.today.map { entry ->
                if (entry.commitment.id != commitmentId) {
                    entry
                } else {
                    entry.copy(observation = Observation(commitmentId, value))
                }
            },
        )
    }

    fun setMode(mode: LifeMode) = _state.update { it.copy(mode = mode) }

    fun setMicroTask(text: String) = _state.update { it.copy(microTask = text) }

    /** Name lives in Config — strip identity leftovers off Day. */
    fun clearIdentityMicroTask() = _state.update { day ->
        if (day.microTask.startsWith("Signed in as", ignoreCase = true)) {
            day.copy(microTask = "")
        } else {
            day
        }
    }

    /** Keep Walk pursuit target aligned with the phone steps goal. */
    fun setWalkStepsTarget(target: Long) = _state.update { day ->
        day.copy(
            today = day.today.map { entry ->
                val c = entry.commitment
                val isWalk = c.label.equals("Walk", ignoreCase = true) ||
                    c.unit.equals("steps", ignoreCase = true)
                if (!isWalk) entry
                else entry.copy(commitment = c.copy(target = target.toDouble()))
            },
        )
    }

    /** Append a settled day figure so trajectory has something to climb. */
    fun appendHistory(score: Double) = _state.update { day ->
        day.copy(history = day.history + score, baselineDays = day.baselineDays + 1)
    }

    /** Replace score history with almost-true 10-day sample (for QA charts). */
    fun loadTenDaySampleHistory(scores: List<Double> = aiimin.core.data.device.TenDaySample.lifeScores()) =
        _state.update { day ->
            day.copy(history = scores, baselineDays = scores.size)
        }

    fun clearSampleHistory() = _state.update { day ->
        day.copy(history = emptyList(), baselineDays = 0)
    }

    /**
     * Calibration replaces the seed pursuits with the ones the person picked.
     * Floors stay — physiology is not optional. Labels become SHOW_UP pursuits
     * until the live instruments API arrives.
     */
    fun applyCalibration(labels: List<String>) = _state.update { day ->
        val floors = day.floors.map { it.commitment }
        val pursuits = labels.mapIndexed { i, label ->
            Commitment(
                id = (i + 1).toLong(),
                instrument = instrumentFor(label),
                kind = CommitmentKind.PURSUIT,
                shape = aiimin.core.model.CommitmentShape.SHOW_UP,
                label = label,
            )
        }
        val nextFloors = floors.mapIndexed { i, c ->
            c.copy(id = (pursuits.size + i + 1).toLong())
        }
        val all = pursuits + nextFloors
        day.copy(
            instruments = pursuits.map { it.instrument }.distinct().ifEmpty {
                day.instruments
            },
            today = all.map { DayEntry(it, Observation(it.id, null), Hold.seed()) },
            captures = emptyList(),
            history = emptyList(),
            baselineDays = 0,
        )
    }

    /**
     * Replace seed pursuits with live habits from `/mobile/bootstrap`.
     * Floors stay local physiology until the floors API ships.
     * Same-day local captures survive the pull (flush runs before this).
     */
    fun hydrateFromBootstrap(
        habits: List<aiimin.core.network.HabitDto>,
        completedToday: Set<String>,
        userName: String?,
    ) = _state.update { day ->
        val keepCaptures = day.captures
        // Optimistic local ticks survive a lagging habitCompletedToday after flush.
        val localDoneServerIds = day.today.mapNotNull { entry ->
            val sid = entry.commitment.serverId ?: return@mapNotNull null
            if ((entry.observation.value ?: 0.0) >= 0.999) sid else null
        }.toSet()
        if (habits.isEmpty()) {
            val floorsOnly = day.floors.map { it.commitment }
            return@update day.copy(
                instruments = floorsOnly.map { it.instrument }.distinct().ifEmpty { day.instruments },
                today = floorsOnly.map { c ->
                    DayEntry(c, Observation(c.id, null), Hold.seed())
                },
                captures = keepCaptures,
                isLive = true,
                isSeed = false,
            )
        }
        val floors = day.floors.map { it.commitment }
        val pursuits = habits.mapIndexed { i, h ->
            val label = cleanHabitLabel(h.name).ifBlank { "Habit" }
            Commitment(
                id = (i + 1).toLong(),
                instrument = instrumentFor(label),
                kind = CommitmentKind.PURSUIT,
                shape = aiimin.core.model.CommitmentShape.SHOW_UP,
                label = label,
                serverId = h.id,
            )
        }
        val nextFloors = floors.mapIndexed { i, c ->
            c.copy(id = (pursuits.size + i + 1).toLong(), serverId = null)
        }
        val all = pursuits + nextFloors
        day.copy(
            instruments = pursuits.map { it.instrument }.distinct().ifEmpty { day.instruments },
            today = all.map { entryCommitment ->
                val sid = entryCommitment.serverId
                val done = when {
                    sid == null -> false
                    sid in completedToday -> true
                    // Server lag after a successful tick — keep local done.
                    sid in localDoneServerIds -> true
                    else -> false
                }
                DayEntry(
                    commitment = entryCommitment,
                    observation = Observation(
                        entryCommitment.id,
                        if (done) 1.0 else null,
                    ),
                    hold = Hold.seed(),
                )
            },
            captures = keepCaptures,
            isLive = true,
            isSeed = false,
        )
    }

    fun resetToSeed() {
        _state.value = DayState.seed()
    }

    /** Drop craft pursuits before live pull; keep floors. */
    fun clearSeedPursuits() = _state.update { day ->
        val floors = day.floors
        day.copy(
            today = floors,
            captures = emptyList(),
            isSeed = false,
            isLive = true,
            microTask = "",
        )
    }

    fun markLive() = _state.update { it.copy(isLive = true, isSeed = false) }
}

private fun instrumentFor(label: String): Instrument {
    val l = label.lowercase()
    return when {
        "walk" in l || "step" in l || "run" in l -> Instrument.BODY
        "journal" in l || "read" in l -> Instrument.MIND
        "spend" in l || "money" in l || "log" in l -> Instrument.MONEY
        "lab" in l || "shadow" in l || "deep" in l -> Instrument.CRAFT
        else -> Instrument.CRAFT
    }
}

/** Drop leading emoji / symbol noise — name only. Drafting Table, not sticker pack. */
fun cleanHabitLabel(raw: String?): String {
    if (raw.isNullOrBlank()) return ""
    val start = raw.indexOfFirst { it.isLetterOrDigit() }
    if (start < 0) return raw.trim()
    return raw.substring(start).trim()
}

/** One committed capture, as the day sees it. */
data class SettledLine(val label: String, val time: String, val amount: Int?)

/** A commitment plus what has happened to it today and how it has been holding. */
data class DayEntry(
    val commitment: Commitment,
    val observation: Observation,
    val hold: Hold,
) {
    val attainment: Double? get() = Attainment.of(commitment, observation)

    /** A floor is breached when it was observed and fell short. Warn, never score. */
    val floorBreached: Boolean
        get() {
            val recorded = observation.value ?: return false
            return commitment.kind == CommitmentKind.FLOOR && recorded < commitment.target
        }
}

/** Everything today is, in one immutable value. */
data class DayState(
    val instruments: List<Instrument>,
    val baseWeights: Map<Instrument, Double>,
    val mode: LifeMode,
    val today: List<DayEntry>,
    val captures: List<SettledLine>,
    val history: List<Double>,
    val baselineDays: Int,
    val microTask: String,
    val isSeed: Boolean = true,
    val isLive: Boolean = false,
) {
    val pursuits: List<DayEntry> get() = today.filter { it.commitment.scored }
    val floors: List<DayEntry> get() = today.filter { !it.commitment.scored }
    val breachedFloors: List<DayEntry> get() = floors.filter { it.floorBreached }

    /**
     * Today's score, composed the way the engine says: instrument readings over
     * covered commitments only, weights conditioned by the mode, missing data
     * widening the band instead of lowering the number.
     */
    val score: LifeScore
        get() {
            val readings = instruments.map { instrument ->
                val entries = pursuits.filter { it.commitment.instrument == instrument }
                val observed = entries.mapNotNull { entry ->
                    val attainment = entry.attainment ?: return@mapNotNull null
                    attainment * entry.commitment.weight to entry.commitment.weight
                }
                if (observed.isEmpty()) {
                    InstrumentReading(instrument, score = 0.0, coverage = 0.0)
                } else {
                    val weightObserved = observed.sumOf { it.second }
                    val weightAll = entries.sumOf { it.commitment.weight }
                    InstrumentReading(
                        instrument = instrument,
                        score = (observed.sumOf { it.first } / weightObserved * 100.0)
                            .coerceIn(0.0, 100.0),
                        coverage = if (weightAll <= 0.0) 0.0 else weightObserved / weightAll,
                    )
                }
            }
            return Composition.compose(
                readings = readings,
                weights = Composition.weights(baseWeights, mode),
                mode = mode,
                history = history,
                baselineDays = baselineDays,
            )
        }

    companion object {
        /**
         * The stand-in profile until calibration exists.
         *
         * It is a **seed, not a default** — every one of these is meant to be
         * replaced by what the user says about their own days. It is here so the
         * surface can be built and looked at, and it is the first thing
         * onboarding deletes.
         */
        fun seed(): DayState {
            val commitments = listOf(
                Commitment(
                    id = 1, instrument = Instrument.CRAFT, kind = CommitmentKind.PURSUIT,
                    shape = aiimin.core.model.CommitmentShape.MORE,
                    label = "Deep work", unit = "min", target = 120.0, weight = 1.5,
                ),
                Commitment(
                    id = 2, instrument = Instrument.BODY, kind = CommitmentKind.PURSUIT,
                    shape = aiimin.core.model.CommitmentShape.MORE,
                    label = "Walk", unit = "steps", target = 13_000.0,
                ),
                Commitment(
                    id = 3, instrument = Instrument.MIND, kind = CommitmentKind.PURSUIT,
                    shape = aiimin.core.model.CommitmentShape.SHOW_UP,
                    label = "Journal",
                ),
                Commitment(
                    id = 4, instrument = Instrument.MONEY, kind = CommitmentKind.PURSUIT,
                    shape = aiimin.core.model.CommitmentShape.SHOW_UP,
                    label = "Log spends",
                ),
                Commitment(
                    id = 5, instrument = Instrument.BODY, kind = CommitmentKind.FLOOR,
                    shape = aiimin.core.model.CommitmentShape.MORE,
                    label = "Steps floor", unit = "steps", target = 5_000.0,
                    reason = "physiology · not the 13k goal",
                ),
                Commitment(
                    id = 6, instrument = Instrument.RECOVERY, kind = CommitmentKind.FLOOR,
                    shape = aiimin.core.model.CommitmentShape.MORE,
                    label = "Sleep floor", unit = "h", target = 6.5,
                    reason = "you said you sleep badly",
                ),
            )
            return DayState(
                instruments = listOf(
                    Instrument.CRAFT, Instrument.BODY, Instrument.MIND, Instrument.MONEY,
                ),
                baseWeights = mapOf(
                    Instrument.CRAFT to 1.5,
                    Instrument.BODY to 1.0,
                    Instrument.MIND to 1.0,
                    Instrument.MONEY to 1.0,
                ),
                mode = LifeMode.BUILD,
                today = commitments.map { DayEntry(it, Observation(it.id, null), Hold.seed()) },
                captures = emptyList(),
                history = emptyList(),
                baselineDays = 0,
                microTask = "",
            )
        }
    }
}
