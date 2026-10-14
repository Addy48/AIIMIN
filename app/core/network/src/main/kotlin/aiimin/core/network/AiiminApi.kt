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
    @GET("tasks")
    suspend fun tasks(@Query("date") date: String? = null): TaskListResponse

    @POST("tasks")
    suspend fun createTask(@Body body: CreateTaskRequest): TaskItemResponse

    @retrofit2.http.PATCH("tasks/{id}")
    suspend fun updateTask(@retrofit2.http.Path("id") id: String, @Body body: UpdateTaskRequest): TaskItemResponse

    @retrofit2.http.DELETE("tasks/{id}")
    suspend fun deleteTask(@retrofit2.http.Path("id") id: String): Response<ResponseBody>

    /** Server-side model call; the app sends only what the person allowed (AI scope). */
    @POST("intelligence/chat")
    suspend fun chat(@Body body: ChatRequest): ChatResponse

    @GET("auth/osid-available")
    suspend fun osIdAvailable(@Query("id") id: String): OsIdAvailableResponse

    @GET("auth/resolve")
    suspend fun resolve(@Query("identifier") identifier: String): Response<ResolveResponse>

    @GET("auth/get-session")
    suspend fun getSession(): Response<SessionResponse>

    @POST("auth/sign-in/email")
    suspend fun signInEmail(@Body body: SignInRequest): Response<ResponseBody>

    @POST("auth/sign-up/email")
    suspend fun signUpEmail(@Body body: SignUpRequest): Response<ResponseBody>

    @POST("auth/send-verification-email")
    suspend fun sendVerification(@Body body: VerifyEmailRequest): Response<ResponseBody>

    @POST("auth/forget-password")
    suspend fun forgetPassword(@Body body: ForgetPasswordRequest): Response<ResponseBody>

    /** Better Auth: every signed-in browser and phone on this account (SE2). */
    @GET("auth/list-sessions")
    suspend fun listSessions(): Response<List<SessionInfoDto>>

    @POST("auth/revoke-session")
    suspend fun revokeSession(@Body body: RevokeSessionRequest): Response<ResponseBody>

    @GET("auth/me")
    suspend fun authMe(): Response<MeResponse>

    @POST("auth/logout")
    suspend fun logout(): Response<ResponseBody>

    /** Better Auth's own delete-user; needs the PIN as the password. */
    @POST("auth/delete-user")
    suspend fun deleteUser(@Body body: DeleteUserRequest): Response<ResponseBody>

    @GET("account/export")
    suspend fun accountExport(): Response<ResponseBody>

    @POST("account/wipe-life-data")
    suspend fun wipeLifeData(@Body body: WipeRequest): Response<ResponseBody>

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

    @retrofit2.http.DELETE("wealth/transactions/{id}")
    suspend fun deleteMoneyTransaction(@retrofit2.http.Path("id") id: String): Response<ResponseBody>

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

    // Calendar: phone-made events travel both ways. Google-imported rows are read-only here.
    @GET("calendar/events")
    suspend fun calendarEvents(@Query("start") start: String, @Query("end") end: String): List<CalendarEventDto>

    @POST("calendar/events")
    suspend fun createCalendarEvent(@Body body: CalendarEventRequest): CalendarEventDto

    @retrofit2.http.PATCH("calendar/events/{id}")
    suspend fun updateCalendarEvent(@retrofit2.http.Path("id") id: String, @Body body: CalendarEventRequest): CalendarEventDto

    @retrofit2.http.DELETE("calendar/events/{id}")
    suspend fun deleteCalendarEvent(@retrofit2.http.Path("id") id: String): Response<ResponseBody>

    @GET("goals")
    suspend fun goals(): List<RemoteGoalDto>

    @POST("goals")
    suspend fun createGoal(@Body body: GoalRequest): RemoteGoalDto

    @retrofit2.http.PUT("goals/{id}")
    suspend fun updateGoal(@retrofit2.http.Path("id") id: String, @Body body: GoalRequest): RemoteGoalDto

    @retrofit2.http.DELETE("goals/{id}")
    suspend fun deleteGoal(@retrofit2.http.Path("id") id: String): Response<ResponseBody>

    /** Minimums are habits on the web. Ticks go through mobile/sync/batch (habit.tick / habit.untick). */
    @GET("habits")
    suspend fun habits(@Query("status") status: String = "active"): List<RemoteHabitDto>

    @POST("habits")
    suspend fun createHabit(@Body body: HabitRequest): RemoteHabitDto

    @retrofit2.http.PUT("habits/{id}")
    suspend fun updateHabit(@retrofit2.http.Path("id") id: String, @Body body: HabitRequest): RemoteHabitDto

    @retrofit2.http.DELETE("journal/{id}")
    suspend fun deleteJournal(@retrofit2.http.Path("id") id: String): Response<ResponseBody>

    @POST("daily-logs")
    suspend fun postDailyLog(@Body body: DailyLogRequest): DailyLogDto
}
