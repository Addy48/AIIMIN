package aiimin.core.network

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.JsonElement

@Serializable
data class OsIdAvailableResponse(
    val id: String? = null,
    val available: Boolean? = null,
    val reason: String? = null,
    val message: String? = null,
    val error: String? = null,
)

@Serializable
data class ParseRequest(val text: String)

@Serializable
data class ParseChipDto(
    val field: String,
    val value: String,
    val included: Boolean = true,
)

@Serializable
data class ParseResponse(
    val text: String? = null,
    val chips: List<ParseChipDto> = emptyList(),
    val source: String? = null,
    val error: String? = null,
)

@Serializable
data class BootstrapResponse(
    val user: BootstrapUser? = null,
    val habits: List<HabitDto> = emptyList(),
    val habitCompletedToday: List<String> = emptyList(),
    val journal: List<JournalDto> = emptyList(),
    val notes: List<NoteDto> = emptyList(),
    val discipline: DisciplineSummaryDto? = null,
    val agenda: List<AgendaDto> = emptyList(),
    val lifeScore: JsonElement? = null,
    val familyDocuments: List<FamilyDocDto> = emptyList(),
    val resumes: List<ResumeDto> = emptyList(),
    val goals: List<GoalDto> = emptyList(),
    val drive: DriveStatusDto? = null,
    val serverTime: String? = null,
    val syncCursor: String? = null,
    val error: String? = null,
)

@Serializable
data class BootstrapUser(
    val id: String? = null,
    val email: String? = null,
    val name: String? = null,
    val username: String? = null,
)

@Serializable
data class HabitDto(
    val id: String,
    val name: String? = null,
    val emoji: String? = null,
    val category: String? = null,
    val status: String? = null,
)

@Serializable
data class JournalDto(
    val id: String? = null,
    val date: String? = null,
    val content: String? = null,
    val mood: String? = null,
)

@Serializable
data class NoteDto(
    val id: String? = null,
    val title: String? = null,
    val content: String? = null,
    val color: String? = null,
    val pinned: Boolean? = null,
    @SerialName("updated_at") val updatedAt: String? = null,
    @SerialName("created_at") val createdAt: String? = null,
)

@Serializable
data class DisciplineSummaryDto(
    @SerialName("streak_days") val streakDays: Int = 0,
    @SerialName("total_logs") val totalLogs: Int = 0,
    @SerialName("last_outcome") val lastOutcome: String? = null,
)

@Serializable
data class GoalDto(
    val id: String? = null,
    val metric: String? = null,
    val target: Double? = null,
    val frequency: String? = null,
)

@Serializable
data class AgendaDto(
    val id: String? = null,
    val title: String? = null,
    @SerialName("start_at") val startAt: String? = null,
    @SerialName("end_at") val endAt: String? = null,
    @SerialName("all_day") val allDay: Boolean? = null,
    @SerialName("event_type") val eventType: String? = null,
)

/** Canonical LHS from `/intelligence/lhs` + bootstrap `lifeScore`. */
@Serializable
data class LifeHealthDto(
    val globalScore: Double? = null,
    val systemScores: LifeHealthSystemsDto? = null,
    val meta: LifeHealthMetaDto? = null,
)

@Serializable
data class LifeHealthSystemsDto(
    val physical: Double? = null,
    val cognitive: Double? = null,
    val discipline: Double? = null,
    val financial: Double? = null,
    val emotional: Double? = null,
)

@Serializable
data class LifeHealthMetaDto(
    val days: Int? = null,
    val daysWithData: Int? = null,
    val start: String? = null,
    val end: String? = null,
    val calculationVersion: String? = null,
    val profileVersion: String? = null,
    val referenceDatasetVersion: String? = null,
    val coverage: Double? = null,
    val scoreConfidence: String? = null,
    val confidenceScore: Double? = null,
    val uncertaintyBand: Double? = null,
    val effectiveSampleSize: Double? = null,
    val trend: LifeHealthTrendDto? = null,
)

@Serializable
data class LifeHealthTrendDto(
    val direction: String? = null,
    val delta: Double? = null,
    val volatility: Double? = null,
    val recentScore: Double? = null,
    val priorScore: Double? = null,
)

@Serializable
data class LabSummaryResponse(
    val practice: LabPracticeSummaryDto? = null,
    val error: String? = null,
)

@Serializable
data class LabPracticeSummaryDto(
    val speaking: LabSpeakingSummaryDto? = null,
)

@Serializable
data class LabSpeakingSummaryDto(
    @SerialName("latest_score") val latestScore: Double? = null,
    val mastery: String? = null,
    @SerialName("streak_days") val streakDays: Int? = null,
)

@Serializable
data class SpeakingPracticeRequest(
    @SerialName("confidence_score") val confidenceScore: Int,
    @SerialName("clarity_score") val clarityScore: Int? = null,
    @SerialName("pace_score") val paceScore: Int? = null,
    @SerialName("prompt_id") val promptId: String? = null,
    val notes: String? = null,
)

@Serializable
data class SpeakingPracticeResponse(
    val id: String? = null,
    val error: String? = null,
)

@Serializable
data class FamilyDocDto(
    val id: String? = null,
    @SerialName("doc_type") val docType: String? = null,
)

@Serializable
data class ResumeDto(
    val id: String? = null,
    val title: String? = null,
)

@Serializable
data class DriveStatusDto(
    val connected: Boolean? = null,
)

@Serializable
data class DeviceRequest(
    @SerialName("device_id") val deviceId: String,
    val platform: String = "android",
    @SerialName("app_version") val appVersion: String = "3.0.0-alpha01",
    @SerialName("push_token") val pushToken: String? = null,
)

@Serializable
data class SyncBatchRequest(val mutations: List<SyncMutationDto>)

@Serializable
data class SyncMutationDto(
    val id: String,
    val type: String,
    val payload: Map<String, String?> = emptyMap(),
    @SerialName("client_mutated_at") val clientMutatedAt: String? = null,
)

@Serializable
data class SyncBatchResponse(
    val results: List<SyncResultDto> = emptyList(),
    val error: String? = null,
)

@Serializable
data class SyncResultDto(
    val id: String? = null,
    val ok: Boolean? = null,
    @SerialName("entity_id") val entityId: String? = null,
    val error: String? = null,
)

@Serializable
data class SignInRequest(val email: String, val password: String)

@Serializable
data class SignInUsernameRequest(val username: String, val password: String)

@Serializable
data class ResolveResponse(
    val email: String? = null,
    val error: String? = null,
)

@Serializable
data class SessionResponse(
    val session: SessionTokenDto? = null,
    val user: BootstrapUser? = null,
)

@Serializable
data class SessionTokenDto(val token: String? = null)

@Serializable
data class MoneyTransactionDto(
    val id: String? = null,
    val amount: Double? = null,
    val type: String? = null,
    val category: String? = null,
    val description: String? = null,
    val name: String? = null,
    val date: String? = null,
    val notes: String? = null,
)

@Serializable
data class MoneyBudgetDto(
    val id: String? = null,
    val category: String? = null,
    @SerialName("category_name") val categoryName: String? = null,
    val amount: Double? = null,
    val limit_amount: Double? = null,
    val name: String? = null,
)

@Serializable
data class CreateMoneyTransactionRequest(
    val amount: Double,
    val type: String,
    val category: String? = null,
    val description: String? = null,
    val date: String? = null,
    val notes: String? = null,
    val source: String? = null,
)

@Serializable
data class AiImportRequest(
    val text: String,
)

@Serializable
data class WealthImportResponse(
    val success: Boolean? = null,
    val message: String? = null,
    val imported: Int? = null,
    val transactionsImported: Int? = null,
    val budgetsImported: Int? = null,
)

/** GET /billing/status — web Account twin. */
@Serializable
data class BillingStatusResponse(
    val tier: String? = null,
    @SerialName("prev_tier") val prevTier: String? = null,
    @SerialName("current_period_end") val currentPeriodEnd: String? = null,
    val renewal: String? = null,
    @SerialName("subscription_mode") val subscriptionMode: Boolean? = null,
    @SerialName("click_upgrade") val clickUpgrade: Boolean? = null,
    @SerialName("upgrade_only") val upgradeOnly: Boolean? = null,
    val error: String? = null,
)

@Serializable
data class SelectTierRequest(val tier: String)

@Serializable
data class SelectTierResponse(
    val tier: String? = null,
    @SerialName("oldTier") val oldTier: String? = null,
    @SerialName("newTier") val newTier: String? = null,
    @SerialName("subscription_period_end") val subscriptionPeriodEnd: String? = null,
    @SerialName("click_upgrade") val clickUpgrade: Boolean? = null,
    @SerialName("upgrade_only") val upgradeOnly: Boolean? = null,
    val error: String? = null,
    val code: String? = null,
)

@Serializable
data class CorrelationsResponse(
    val correlations: List<CorrelationDto> = emptyList(),
    val insights: List<CorrelationInsightDto> = emptyList(),
    val insufficientData: Boolean = false,
    val error: String? = null,
)

@Serializable
data class CorrelationDto(
    val signalA: String? = null,
    val signalB: String? = null,
    val signalALabel: String? = null,
    val signalBLabel: String? = null,
    val rho: Double? = null,
    val n: Int? = null,
    val pValue: Double? = null,
    val bhPassed: Boolean = false,
    val headline: String? = null,
)

@Serializable
data class CorrelationInsightDto(
    val headline: String? = null,
    val rho: Double? = null,
    @SerialName("n_samples") val nSamples: Int? = null,
)

@Serializable
data class DailyLogRequest(
    val date: String,
    val mood: Int? = null,
    val energyLevel: Int? = null,
)

@Serializable
data class DailyLogDto(
    val date: String? = null,
    val mood: Int? = null,
    val error: String? = null,
)
