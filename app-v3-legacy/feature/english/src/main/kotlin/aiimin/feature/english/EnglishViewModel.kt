package aiimin.feature.english

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import aiimin.core.data.ConfigStore
import aiimin.core.data.SpeakingState
import aiimin.core.data.SpeakingStore
import aiimin.core.data.SpeakingTopics
import aiimin.core.data.sync.GraphSyncRepository
import aiimin.core.model.SubscriptionTier
import aiimin.core.model.TierCatalog
import aiimin.core.model.TierFeature
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

/**
 * One job: run a 60s speaking Spark, self-score, sync to Lab.
 */
@HiltViewModel
class EnglishViewModel @Inject constructor(
    private val speaking: SpeakingStore,
    private val sync: GraphSyncRepository,
    config: ConfigStore,
) : ViewModel() {

    private val _session = MutableStateFlow(SparkSession.idle())
    val session: StateFlow<SparkSession> = _session.asStateFlow()

    val state: StateFlow<EnglishUiState> = combine(
        speaking.state,
        _session,
        config.state,
    ) { speak, spark, cfg ->
        EnglishUiState(
            speaking = speak,
            spark = spark,
            tier = cfg.identity.tier,
            gated = !TierCatalog.can(cfg.identity.tier, TierFeature.LAB_FULL),
        )
    }.stateIn(
        viewModelScope,
        SharingStarted.WhileSubscribed(5_000),
        EnglishUiState(
            speaking = speaking.state.value,
            spark = SparkSession.idle(),
            tier = SubscriptionTier.EXPLORE,
            gated = true,
        ),
    )

    private var timerJob: Job? = null

    fun spinPrompt(category: String? = null) {
        val current = _session.value.prompt?.id
        val next = if (category == null) {
            SpeakingTopics.random(excludingId = current)
        } else {
            SpeakingTopics.byCategory(category).filter { it.id != current }.randomOrNull()
                ?: SpeakingTopics.random(excludingId = current)
        }
        _session.update {
            it.copy(
                prompt = next,
                phase = SparkPhase.READY,
                secondsLeft = SparkSession.DURATION_SEC,
                confidence = 70,
                clarity = 70,
                pace = 70,
                notice = null,
            )
        }
    }

    fun startTimer() {
        if (_session.value.prompt == null) spinPrompt()
        timerJob?.cancel()
        _session.update {
            it.copy(phase = SparkPhase.RECORDING, secondsLeft = SparkSession.DURATION_SEC, elapsedSec = 0)
        }
        timerJob = viewModelScope.launch {
            var left = SparkSession.DURATION_SEC
            while (left > 0) {
                delay(1_000)
                left -= 1
                _session.update {
                    it.copy(
                        secondsLeft = left,
                        elapsedSec = SparkSession.DURATION_SEC - left,
                    )
                }
            }
            _session.update { it.copy(phase = SparkPhase.SCORE, secondsLeft = 0) }
        }
    }

    fun stopEarly() {
        timerJob?.cancel()
        _session.update {
            it.copy(
                phase = SparkPhase.SCORE,
                elapsedSec = (SparkSession.DURATION_SEC - it.secondsLeft).coerceAtLeast(5),
            )
        }
    }

    fun setConfidence(v: Int) = _session.update { it.copy(confidence = v.coerceIn(1, 100)) }
    fun setClarity(v: Int) = _session.update { it.copy(clarity = v.coerceIn(1, 100)) }
    fun setPace(v: Int) = _session.update { it.copy(pace = v.coerceIn(1, 100)) }

    fun saveScores() {
        val s = _session.value
        val prompt = s.prompt ?: return
        speaking.recordSession(
            promptId = prompt.id,
            promptText = prompt.text,
            confidence = s.confidence,
            clarity = s.clarity,
            pace = s.pace,
            durationSec = s.elapsedSec.coerceAtLeast(5),
        )
        _session.update {
            it.copy(phase = SparkPhase.DONE, notice = "Saved · syncing streak")
        }
        viewModelScope.launch {
            sync.flushPendingMutations()
            sync.refreshAll()
        }
    }

    fun resetSpark() {
        timerJob?.cancel()
        _session.value = SparkSession.idle()
        spinPrompt()
    }

    fun dismissNotice() = speaking.dismissNotice()

    override fun onCleared() {
        timerJob?.cancel()
        super.onCleared()
    }
}

enum class SparkPhase { IDLE, READY, RECORDING, SCORE, DONE }

data class SparkSession(
    val phase: SparkPhase,
    val prompt: SpeakingTopics.Prompt?,
    val secondsLeft: Int,
    val elapsedSec: Int,
    val confidence: Int,
    val clarity: Int,
    val pace: Int,
    val notice: String?,
) {
    companion object {
        const val DURATION_SEC = 60
        fun idle() = SparkSession(
            phase = SparkPhase.IDLE,
            prompt = null,
            secondsLeft = DURATION_SEC,
            elapsedSec = 0,
            confidence = 70,
            clarity = 70,
            pace = 70,
            notice = null,
        )
    }
}

data class EnglishUiState(
    val speaking: SpeakingState,
    val spark: SparkSession,
    val tier: SubscriptionTier,
    val gated: Boolean,
)
