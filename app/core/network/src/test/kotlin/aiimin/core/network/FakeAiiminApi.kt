package aiimin.core.network

import okhttp3.ResponseBody
import retrofit2.Response

/** Test double — override only the methods under exercise. */
open class FakeAiiminApi : AiiminApi {
    override suspend fun osIdAvailable(id: String): OsIdAvailableResponse = error("unused")
    override suspend fun resolve(identifier: String): Response<ResolveResponse> = error("unused")
    override suspend fun getSession(): Response<SessionResponse> = error("unused")
    override suspend fun signInEmail(body: SignInRequest): Response<ResponseBody> = error("unused")
    override suspend fun signInUsername(body: SignInUsernameRequest): Response<ResponseBody> =
        error("unused")
    override suspend fun parseCapture(body: ParseRequest): ParseResponse = error("unused")
    override suspend fun bootstrap(): BootstrapResponse = error("unused")
    override suspend fun syncBatch(
        body: SyncBatchRequest,
        idempotencyKey: String?,
    ): SyncBatchResponse = error("unused")
    override suspend fun registerDevice(body: DeviceRequest): Map<String, String?> = error("unused")
    override suspend fun moneyTransactions(): List<MoneyTransactionDto> = error("unused")
    override suspend fun moneyBudgets(): List<MoneyBudgetDto> = error("unused")
    override suspend fun createMoneyTransaction(
        body: CreateMoneyTransactionRequest,
        idempotencyKey: String?,
    ): MoneyTransactionDto = error("unused")
    override suspend fun importAiText(body: AiImportRequest): WealthImportResponse = error("unused")
    override suspend fun importSpreadsheet(file: okhttp3.MultipartBody.Part): WealthImportResponse =
        error("unused")

    override suspend fun billingStatus(): BillingStatusResponse = error("unused")

    override suspend fun selectBillingTier(body: SelectTierRequest): SelectTierResponse =
        error("unused")

    override suspend fun lifeHealth(days: Int): LifeHealthDto = error("unused")

    override suspend fun correlations(refresh: Int): CorrelationsResponse = error("unused")

    override suspend fun labSummary(): LabSummaryResponse = error("unused")

    override suspend fun postSpeakingPractice(body: SpeakingPracticeRequest): SpeakingPracticeResponse =
        error("unused")

    override suspend fun postDailyLog(body: DailyLogRequest): DailyLogDto = error("unused")
}
