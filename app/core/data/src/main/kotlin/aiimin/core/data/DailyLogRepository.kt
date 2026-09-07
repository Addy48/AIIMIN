package aiimin.core.data

import aiimin.core.network.AiiminApi
import aiimin.core.network.DailyLogRequest
import javax.inject.Inject
import javax.inject.Singleton

/** POST /daily-logs for the local day mark. Published LHS stays GET /intelligence/lhs. */
@Singleton
class DailyLogRepository @Inject constructor(
    private val api: AiiminApi,
) {
    suspend fun postMark(date: String, mood: Int): Result<Unit> = runCatching {
        val rung = mood.coerceIn(1, 5)
        api.postDailyLog(DailyLogRequest(date = date, mood = rung, energyLevel = rung))
        Unit
    }
}
