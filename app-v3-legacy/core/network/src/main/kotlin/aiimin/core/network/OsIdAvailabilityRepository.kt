package aiimin.core.network

import aiimin.core.model.OsIdRules
import javax.inject.Inject
import javax.inject.Singleton
import retrofit2.HttpException
import java.io.IOException

enum class OsIdAvailability {
    IDLE,
    CHECKING,
    AVAILABLE,
    TAKEN,
    INVALID,
    OFFLINE,
}

data class OsIdCheckResult(
    val status: OsIdAvailability,
    val message: String,
)

/**
 * Live OS-ID check against api.aiimin.in (waitlist + users + Better Auth user).
 * Shape validation stays local ([OsIdRules]); network only answers taken/free.
 */
@Singleton
class OsIdAvailabilityRepository @Inject constructor(
    private val api: AiiminApi,
) {
    suspend fun check(raw: String): OsIdCheckResult {
        val id = OsIdRules.normalize(raw)
        if (!OsIdRules.isValid(id)) {
            return OsIdCheckResult(
                OsIdAvailability.INVALID,
                OsIdRules.issues(id).firstOrNull() ?: "Invalid OS-ID",
            )
        }
        return try {
            val res = api.osIdAvailable(id)
            when {
                res.error != null -> OsIdCheckResult(OsIdAvailability.OFFLINE, res.error)
                res.available == true -> OsIdCheckResult(
                    OsIdAvailability.AVAILABLE,
                    res.message ?: "Available.",
                )
                res.reason == "invalid" -> OsIdCheckResult(
                    OsIdAvailability.INVALID,
                    res.message ?: "Invalid OS-ID",
                )
                else -> OsIdCheckResult(
                    OsIdAvailability.TAKEN,
                    res.message ?: "Already claimed.",
                )
            }
        } catch (_: HttpException) {
            OsIdCheckResult(OsIdAvailability.OFFLINE, "Could not reach AIIMIN. Try again.")
        } catch (_: IOException) {
            OsIdCheckResult(OsIdAvailability.OFFLINE, "Offline — shape only until the line returns.")
        } catch (_: Exception) {
            OsIdCheckResult(OsIdAvailability.OFFLINE, "Could not check availability.")
        }
    }
}
