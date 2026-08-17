package aiimin.core.network

import java.io.IOException
import javax.inject.Inject
import javax.inject.Singleton
import retrofit2.HttpException

data class BillingSnapshot(
    val tierId: String,
    val periodEndIso: String? = null,
    val upgradeOnly: Boolean = false,
)

/**
 * Web Account twin: [GET billing/status] + [POST billing/select-tier].
 * Returns null / failure when unsigned or offline — Config keeps local tier.
 */
@Singleton
class BillingRepository @Inject constructor(
    private val api: AiiminApi,
) {
    suspend fun refreshStatus(): BillingSnapshot? {
        if (ApiAuth.token.isNullOrBlank()) return null
        return try {
            val res = api.billingStatus()
            val id = res.tier?.trim()?.lowercase().orEmpty()
            if (id.isEmpty()) null
            else BillingSnapshot(
                tierId = id,
                periodEndIso = res.currentPeriodEnd,
                upgradeOnly = res.upgradeOnly == true,
            )
        } catch (_: HttpException) {
            null
        } catch (_: IOException) {
            null
        } catch (_: Exception) {
            null
        }
    }

    /**
     * @return success snapshot, or failure with message (UPGRADE_ONLY / network).
     */
    suspend fun selectTier(tierId: String): Result<BillingSnapshot> {
        if (ApiAuth.token.isNullOrBlank()) {
            return Result.failure(IllegalStateException("offline"))
        }
        return try {
            val res = api.selectBillingTier(SelectTierRequest(tierId))
            val id = (res.tier ?: res.newTier ?: tierId).trim().lowercase()
            Result.success(
                BillingSnapshot(
                    tierId = id,
                    periodEndIso = res.subscriptionPeriodEnd,
                    upgradeOnly = res.upgradeOnly == true,
                ),
            )
        } catch (e: HttpException) {
            val body = e.response()?.errorBody()?.string().orEmpty()
            val msg = when {
                body.contains("UPGRADE_ONLY") -> "Downgrades disabled until billing is live"
                e.code() == 403 -> "Billing checkout required"
                else -> "Could not change plan (${e.code()})"
            }
            Result.failure(IllegalStateException(msg))
        } catch (_: IOException) {
            Result.failure(IllegalStateException("offline"))
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
