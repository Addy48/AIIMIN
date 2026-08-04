package aiimin.core.network

import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Query

interface AiiminApi {
    @GET("auth/osid-available")
    suspend fun osIdAvailable(@Query("id") id: String): OsIdAvailableResponse

    /** Auth cookie / bearer required. Falls back to local CaptureParser when 401. */
    @POST("intelligence/parse")
    suspend fun parseCapture(@Body body: ParseRequest): ParseResponse
}
