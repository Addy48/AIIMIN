package `in`.aiimin.app.data.network

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass
import com.squareup.moshi.Moshi
import com.squareup.moshi.Types
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import `in`.aiimin.app.BuildConfig
import `in`.aiimin.app.session.SessionStore
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.runBlocking
import okhttp3.Cookie
import okhttp3.CookieJar
import okhttp3.HttpUrl
import okhttp3.HttpUrl.Companion.toHttpUrlOrNull
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.ResponseBody
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.moshi.MoshiConverterFactory
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.POST
import java.util.concurrent.TimeUnit

@JsonClass(generateAdapter = true)
data class BootstrapResponse(
    val user: BootstrapUser? = null,
    val habits: List<HabitDto> = emptyList(),
    @Json(name = "habitCompletedToday") val habitCompletedToday: List<String> = emptyList(),
    val journal: List<JournalDto> = emptyList(),
    val notes: List<NoteDto> = emptyList(),
    val agenda: List<AgendaDto> = emptyList(),
    val lifeScore: Any? = null,
    val familyDocuments: List<FamilyDocDto> = emptyList(),
    val resumes: List<ResumeDto> = emptyList(),
    val goals: List<GoalDto> = emptyList(),
    val drive: DriveStatusDto? = null,
    val serverTime: String? = null,
    val syncCursor: String? = null,
    val error: String? = null,
)

@JsonClass(generateAdapter = true)
data class BootstrapUser(val id: String? = null, val email: String? = null, val name: String? = null)

@JsonClass(generateAdapter = true)
data class HabitDto(
    val id: String,
    val name: String? = null,
    val emoji: String? = null,
    val category: String? = null,
    val status: String? = null,
)

@JsonClass(generateAdapter = true)
data class JournalDto(
    val id: String? = null,
    val date: String? = null,
    val content: String? = null,
    val mood: String? = null,
)

@JsonClass(generateAdapter = true)
data class NoteDto(
    val id: String? = null,
    val title: String? = null,
    val content: String? = null,
    val color: String? = null,
    val pinned: Boolean? = false,
)

@JsonClass(generateAdapter = true)
data class GoalDto(
    val id: String? = null,
    val metric: String? = null,
    val target: Any? = null,
    val frequency: String? = null,
    @Json(name = "start_date") val startDate: String? = null,
    val meta: Any? = null,
)

@JsonClass(generateAdapter = true)
data class AgendaDto(
    val id: String? = null,
    val title: String? = null,
    @Json(name = "start_at") val startAt: String? = null,
)

@JsonClass(generateAdapter = true)
data class FamilyDocDto(
    val id: String? = null,
    @Json(name = "doc_type") val docType: String? = null,
    @Json(name = "doc_number") val docNumber: String? = null,
    val notes: String? = null,
    @Json(name = "expiry_date") val expiryDate: String? = null,
    @Json(name = "member_name") val memberName: String? = null,
)

@JsonClass(generateAdapter = true)
data class ResumeDto(
    val id: String? = null,
    val title: String? = null,
    @Json(name = "target_role") val targetRole: String? = null,
    @Json(name = "link_url") val linkUrl: String? = null,
)

@JsonClass(generateAdapter = true)
data class DriveStatusDto(
    val connected: Boolean? = false,
    val watches: List<DriveWatchDto> = emptyList(),
)

@JsonClass(generateAdapter = true)
data class DriveWatchDto(
    val id: String? = null,
    @Json(name = "folder_name") val folderName: String? = null,
    val enabled: Boolean? = null,
)

data class SyncBatchRequest(val mutations: List<SyncMutation>)

data class SyncMutation(
    val id: String,
    val type: String,
    val payload: Map<String, @JvmSuppressWildcards Any?> = emptyMap(),
    @Json(name = "client_mutated_at") val clientMutatedAt: String? = null,
)

@JsonClass(generateAdapter = true)
data class SyncBatchResponse(
    val results: List<SyncResult> = emptyList(),
    val serverTime: String? = null,
    val error: String? = null,
)

@JsonClass(generateAdapter = true)
data class SyncResult(
    val id: String? = null,
    val ok: Boolean = false,
    val error: String? = null,
    @Json(name = "entity_id") val entityId: String? = null,
)

@JsonClass(generateAdapter = true)
data class DeviceRequest(
    @Json(name = "device_id") val deviceId: String,
    val platform: String = "android",
    @Json(name = "app_version") val appVersion: String = BuildConfig.VERSION_NAME,
)

@JsonClass(generateAdapter = true)
data class SignInRequest(val email: String, val password: String)

@JsonClass(generateAdapter = true)
data class SignInUsernameRequest(val username: String, val password: String)

@JsonClass(generateAdapter = true)
data class SignUpRequest(
    val email: String,
    val password: String,
    val name: String,
    val username: String,
)

@JsonClass(generateAdapter = true)
data class PasswordResetRequest(
    val email: String,
    @Json(name = "redirectTo") val redirectTo: String = "https://aiimin.in/login?reset=1",
)

@JsonClass(generateAdapter = true)
data class ResolveResponse(
    val email: String? = null,
    val error: String? = null,
)

@JsonClass(generateAdapter = true)
data class SessionResponse(
    val session: SessionTokenDto? = null,
    val user: BootstrapUser? = null,
)

@JsonClass(generateAdapter = true)
data class SessionTokenDto(
    val token: String? = null,
    val id: String? = null,
)

interface MobileApi {
    @GET("mobile/bootstrap")
    suspend fun bootstrap(): BootstrapResponse

    @POST("mobile/sync/batch")
    suspend fun syncBatch(
        @Body body: SyncBatchRequest,
        @Header("Idempotency-Key") idempotencyKey: String? = null,
    ): SyncBatchResponse

    @POST("mobile/devices")
    suspend fun registerDevice(@Body body: DeviceRequest): Map<String, Any?>

    @GET("mobile/health")
    suspend fun health(): Map<String, Any?>
}

interface AuthApi {
    @GET("auth/resolve")
    suspend fun resolve(@retrofit2.http.Query("identifier") identifier: String): retrofit2.Response<ResolveResponse>

    @GET("auth/get-session")
    suspend fun getSession(): retrofit2.Response<SessionResponse>

    @POST("auth/sign-in/email")
    suspend fun signInEmail(@Body body: SignInRequest): retrofit2.Response<ResponseBody>

    @POST("auth/sign-in/username")
    suspend fun signInUsername(@Body body: SignInUsernameRequest): retrofit2.Response<ResponseBody>

    @POST("auth/sign-up/email")
    suspend fun signUpEmail(@Body body: SignUpRequest): retrofit2.Response<ResponseBody>

    @POST("auth/request-password-reset")
    suspend fun requestPasswordReset(@Body body: PasswordResetRequest): retrofit2.Response<ResponseBody>
}

object ApiClient {
    const val COOKIE_ONLY_TOKEN = "__cookie_session__"

    private val sessionCookieNames = setOf(
        "better-auth.session_token",
        "__Secure-better-auth.session_token",
    )

    private val moshi: Moshi = Moshi.Builder().add(KotlinJsonAdapterFactory()).build()
    private val mapType = Types.newParameterizedType(Map::class.java, String::class.java, Any::class.java)
    private val mapAdapter = moshi.adapter<Map<String, Any?>>(mapType)

    /** Fixed: loadForRequest must use Cookie.matches(url), not host-key lookup only. */
    private val cookieJar = object : CookieJar {
        private val all = mutableListOf<Cookie>()

        override fun loadForRequest(url: HttpUrl): List<Cookie> =
            all.filter { it.matches(url) }.distinctBy { it.name }

        override fun saveFromResponse(url: HttpUrl, cookies: List<Cookie>) {
            cookies.forEach { fresh ->
                all.removeAll { it.name == fresh.name && it.domain == fresh.domain }
                all.add(fresh)
            }
        }

        fun clear() {
            all.clear()
        }

        fun sessionToken(): String? =
            all.firstOrNull { it.name in sessionCookieNames }?.value
                ?: all.firstOrNull { it.name.contains("session_token", ignoreCase = true) }?.value
    }

    private var httpClient: OkHttpClient? = null
    private var boundStore: SessionStore? = null

    private fun apiHost(): String? =
        (BuildConfig.API_BASE_URL.trimEnd('/') + "/").toHttpUrlOrNull()?.host

    fun sessionTokenFromJar(): String? = cookieJar.sessionToken()

    fun clearCookies() = cookieJar.clear()

    fun httpClient(sessionStore: SessionStore): OkHttpClient {
        if (httpClient == null || boundStore !== sessionStore) {
            boundStore = sessionStore
            httpClient = buildClient(sessionStore)
        }
        return httpClient!!
    }

    private fun buildClient(sessionStore: SessionStore): OkHttpClient {
        val authInterceptor = Interceptor { chain ->
            val stored = runBlocking { sessionStore.tokenFlow.first() }
            val bearer = resolveBearer(stored)
            val builder = chain.request().newBuilder()
                .header("X-App-Version", BuildConfig.VERSION_NAME)
                .header("X-Platform", "android")
            if (!bearer.isNullOrBlank()) {
                builder.header("Authorization", "Bearer $bearer")
            }
            chain.proceed(builder.build())
        }
        val logging = HttpLoggingInterceptor().apply {
            level = if (BuildConfig.DEBUG) HttpLoggingInterceptor.Level.BODY else HttpLoggingInterceptor.Level.NONE
        }
        return OkHttpClient.Builder()
            .cookieJar(cookieJar)
            .connectTimeout(45, TimeUnit.SECONDS)
            .readTimeout(45, TimeUnit.SECONDS)
            .addInterceptor(authInterceptor)
            .addInterceptor(logging)
            .build()
    }

    private fun resolveBearer(stored: String?): String? {
        if (!stored.isNullOrBlank() && stored != COOKIE_ONLY_TOKEN) return stored
        return sessionTokenFromJar()
    }

    private fun retrofit(sessionStore: SessionStore): Retrofit =
        Retrofit.Builder()
            .baseUrl(BuildConfig.API_BASE_URL.trimEnd('/') + "/")
            .client(httpClient(sessionStore))
            .addConverterFactory(MoshiConverterFactory.create(moshi))
            .build()

    fun create(sessionStore: SessionStore): MobileApi =
        retrofit(sessionStore).create(MobileApi::class.java)

    fun authApi(sessionStore: SessionStore): AuthApi =
        retrofit(sessionStore).create(AuthApi::class.java)

    fun tokenFromAuthBody(body: String?): String? {
        if (body.isNullOrBlank()) return null
        return runCatching {
            val map = mapAdapter.fromJson(body) ?: return@runCatching null
            (map["token"] as? String)?.takeIf { it.isNotBlank() }?.let { return it }
            @Suppress("UNCHECKED_CAST")
            val session = map["session"] as? Map<String, Any?>
            (session?.get("token") as? String)?.takeIf { it.isNotBlank() }
        }.getOrNull()
    }

    fun extractSessionToken(res: retrofit2.Response<*>): String? {
        res.headers()["set-auth-token"]?.takeIf { it.isNotBlank() }?.let { return it }
        res.headers()["Set-Auth-Token"]?.takeIf { it.isNotBlank() }?.let { return it }
        val cookies = res.headers().values("set-cookie") + res.headers().values("Set-Cookie")
        for (c in cookies) {
            val m = Regex("(?:__Secure-)?(?:better-auth\\.)?session_token=([^;]+)").find(c)
            if (m != null) return m.groupValues[1]
        }
        (res.body() as? ResponseBody)?.let { body ->
            tokenFromAuthBody(body.string())?.let { return it }
        }
        return sessionTokenFromJar()
    }

    suspend fun resolveSessionToken(auth: AuthApi, res: retrofit2.Response<*>): String {
        extractSessionToken(res)?.takeIf { it.isNotBlank() && it != COOKIE_ONLY_TOKEN }?.let { return it }
        runCatching {
            val sess = auth.getSession()
            if (sess.isSuccessful) {
                sess.body()?.session?.token?.takeIf { it.isNotBlank() }?.let { return it }
            }
        }
        sessionTokenFromJar()?.let { return it }
        error("Could not establish session after sign-in. Try again.")
    }
}
