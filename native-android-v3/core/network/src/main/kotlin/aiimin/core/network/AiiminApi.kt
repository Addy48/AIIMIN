package aiimin.core.network

import okhttp3.ResponseBody
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.Multipart
import retrofit2.http.POST
import retrofit2.http.Part
import retrofit2.http.Query

interface AiiminApi {
    @GET("auth/osid-available")
    suspend fun osIdAvailable(@Query("id") id: String): OsIdAvailableResponse

    @GET("auth/resolve")
    suspend fun resolve(@Query("identifier") identifier: String): Response<ResolveResponse>

    @GET("auth/get-session")
    suspend fun getSession(): Response<SessionResponse>

    @POST("auth/sign-in/email")
    suspend fun signInEmail(@Body body: SignInRequest): Response<ResponseBody>

    @POST("auth/sign-in/username")
    suspend fun signInUsername(@Body body: SignInUsernameRequest): Response<ResponseBody>

    /** Auth cookie / bearer required. Falls back to local CaptureParser when 401. */
    @POST("intelligence/parse")
    suspend fun parseCapture(@Body body: ParseRequest): ParseResponse

    @GET("mobile/bootstrap")
    suspend fun bootstrap(): BootstrapResponse

    @POST("mobile/sync/batch")
    suspend fun syncBatch(
        @Body body: SyncBatchRequest,
        @Header("Idempotency-Key") idempotencyKey: String? = null,
    ): SyncBatchResponse

    @POST("mobile/devices")
    suspend fun registerDevice(@Body body: DeviceRequest): Map<String, String?>

    @GET("wealth/transactions")
    suspend fun moneyTransactions(): List<MoneyTransactionDto>

    @GET("wealth/budgets")
    suspend fun moneyBudgets(): List<MoneyBudgetDto>

    @POST("wealth/transactions")
    suspend fun createMoneyTransaction(
        @Body body: CreateMoneyTransactionRequest,
        @Header("Idempotency-Key") idempotencyKey: String? = null,
    ): MoneyTransactionDto

    @POST("wealth/import/ai")
    suspend fun importAiText(@Body body: AiImportRequest): WealthImportResponse

    @Multipart
    @POST("wealth/import")
    suspend fun importSpreadsheet(
        @Part file: okhttp3.MultipartBody.Part,
    ): WealthImportResponse

    /** Same as web Account — cookie/session required. */
    @GET("billing/status")
    suspend fun billingStatus(): BillingStatusResponse

    @POST("billing/select-tier")
    suspend fun selectBillingTier(@Body body: SelectTierRequest): SelectTierResponse

    /** Published Life Score — same engine as web. Clients must not recompute. */
    @GET("intelligence/lhs")
    suspend fun lifeHealth(@Query("days") days: Int = 14): LifeHealthDto

    @GET("intelligence/correlations")
    suspend fun correlations(@Query("refresh") refresh: Int = 0): CorrelationsResponse

    @GET("lab/summary")
    suspend fun labSummary(): LabSummaryResponse

    @POST("lab/practice/speaking")
    suspend fun postSpeakingPractice(@Body body: SpeakingPracticeRequest): SpeakingPracticeResponse

    @POST("daily-logs")
    suspend fun postDailyLog(@Body body: DailyLogRequest): DailyLogDto
}
