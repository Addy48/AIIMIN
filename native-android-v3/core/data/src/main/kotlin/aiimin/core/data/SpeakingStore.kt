package aiimin.core.data

import aiimin.core.network.LabSpeakingSummaryDto
import aiimin.core.network.SpeakingPracticeRequest
import java.util.UUID
import java.util.concurrent.CopyOnWriteArrayList
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update

/**
 * Native English · Speaking practice — local history + outbox for API flush.
 */
@Singleton
class SpeakingStore @Inject constructor() {

    private val _state = MutableStateFlow(SpeakingState.seed())
    val state: StateFlow<SpeakingState> = _state.asStateFlow()

    private val outbox = CopyOnWriteArrayList<SpeakingPracticeRequest>()

    fun hydrateSummary(speaking: LabSpeakingSummaryDto?) {
        if (speaking == null) return
        _state.update {
            it.copy(
                latestScore = speaking.latestScore?.toInt(),
                mastery = speaking.mastery ?: "unranked",
                streakDays = speaking.streakDays ?: 0,
                headMeta = "LIVE · ${speaking.mastery ?: "unranked"}".uppercase(),
            )
        }
    }

    fun recordSession(
        promptId: String,
        promptText: String,
        confidence: Int,
        clarity: Int,
        pace: Int,
        durationSec: Int,
        notes: String? = null,
    ): SpeakingSession {
        val conf = confidence.coerceIn(1, 100)
        val clar = clarity.coerceIn(1, 100)
        val pac = pace.coerceIn(1, 100)
        val session = SpeakingSession(
            id = UUID.randomUUID().toString(),
            promptId = promptId,
            promptText = promptText,
            confidence = conf,
            clarity = clar,
            pace = pac,
            durationSec = durationSec,
            loggedAtMs = System.currentTimeMillis(),
            pending = true,
            notes = notes,
        )
        outbox += SpeakingPracticeRequest(
            confidenceScore = conf,
            clarityScore = clar,
            paceScore = pac,
            promptId = promptId,
            notes = notes ?: promptText.take(120),
        )
        _state.update { s ->
            s.copy(
                sessions = listOf(session) + s.sessions.take(39),
                latestScore = conf,
                notice = SpeakingNotice("Session saved · will sync when online"),
            )
        }
        return session
    }

    fun pendingRequests(): List<SpeakingPracticeRequest> = outbox.toList()

    fun removePending(req: SpeakingPracticeRequest) {
        outbox.remove(req)
    }

    fun markAllSynced() {
        outbox.clear()
        _state.update { s ->
            s.copy(
                sessions = s.sessions.map { it.copy(pending = false) },
                notice = SpeakingNotice("Speaking log synced"),
            )
        }
    }

    fun clearPending() {
        outbox.clear()
    }

    fun clearForLive() {
        outbox.clear()
        _state.value = SpeakingState.emptyLive()
    }

    fun resetToSeed() {
        outbox.clear()
        _state.value = SpeakingState.seed()
    }

    fun dismissNotice() = _state.update { it.copy(notice = null) }

    fun pendingCount(): Int = outbox.size
}

data class SpeakingSession(
    val id: String,
    val promptId: String,
    val promptText: String,
    val confidence: Int,
    val clarity: Int,
    val pace: Int,
    val durationSec: Int,
    val loggedAtMs: Long,
    val pending: Boolean,
    val notes: String? = null,
) {
    val mean: Int get() = ((confidence + clarity + pace) / 3.0).toInt()
}

data class SpeakingNotice(val message: String)

data class SpeakingState(
    val sessions: List<SpeakingSession>,
    val latestScore: Int?,
    val mastery: String,
    val streakDays: Int,
    val headMeta: String,
    val notice: SpeakingNotice? = null,
) {
    val sessionCount: Int get() = sessions.size
    val rated: Boolean get() = sessionCount >= 3

    companion object {
        fun seed() = SpeakingState(
            sessions = emptyList(),
            latestScore = null,
            mastery = "unranked",
            streakDays = 0,
            headMeta = "SPARK · 60s",
        )

        fun emptyLive() = SpeakingState(
            sessions = emptyList(),
            latestScore = null,
            mastery = "unranked",
            streakDays = 0,
            headMeta = "LIVE · EMPTY",
        )
    }
}
