package aiimin.core.network

import java.io.IOException
import javax.inject.Inject
import javax.inject.Singleton
import retrofit2.HttpException

/**
 * Capture Offer via intelligence parse. Auth required on the server.
 * Returns null on 401 / offline / budget so the local rule parser stays honest.
 */
@Singleton
class CaptureParseRepository @Inject constructor(
    private val api: AiiminApi,
) {
    suspend fun parse(text: String): ParseResponse? {
        val trimmed = text.trim()
        if (trimmed.isEmpty()) return null
        if (ApiAuth.token.isNullOrBlank()) return null
        return try {
            api.parseCapture(ParseRequest(trimmed))
        } catch (_: HttpException) {
            null
        } catch (_: IOException) {
            null
        } catch (_: Exception) {
            null
        }
    }
}
