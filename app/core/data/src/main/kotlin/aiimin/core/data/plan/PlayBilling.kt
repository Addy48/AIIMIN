package aiimin.core.data.plan

import android.app.Activity
import android.content.Context
import com.android.billingclient.api.AcknowledgePurchaseParams
import com.android.billingclient.api.BillingClient
import com.android.billingclient.api.BillingClientStateListener
import com.android.billingclient.api.BillingFlowParams
import com.android.billingclient.api.BillingResult
import com.android.billingclient.api.PendingPurchasesParams
import com.android.billingclient.api.ProductDetails
import com.android.billingclient.api.Purchase
import com.android.billingclient.api.PurchasesUpdatedListener
import com.android.billingclient.api.QueryProductDetailsParams
import com.android.billingclient.api.QueryPurchasesParams
import com.android.billingclient.api.acknowledgePurchase
import com.android.billingclient.api.queryProductDetails
import com.android.billingclient.api.queryPurchasesAsync
import dagger.hilt.android.qualifiers.ApplicationContext
import javax.inject.Inject
import javax.inject.Singleton
import kotlin.coroutines.resume
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlinx.coroutines.withTimeoutOrNull

/** The v4.1 plans (plan Part 13). Free has no product; the others are Play subscriptions. */
enum class Plan(val label: String, val productId: String?, val promise: String, val hero: String, val adds: List<String>) {
    FREE(
        "Free", null, "Your day, your money, your papers", "Everything you need for yourself, forever.",
        listOf(
            "Today, voice capture, tasks, calendar, minimums, focus, Life Score, journal, notes",
            "Money with bank alerts, review, payee memory, budget, splits with up to 3 people",
            "Unlimited documents on your phone for you and 2 family profiles",
            "Emergency card, expiry reminders, a printed emergency kit",
            "Private sync with aiimin.in · charts up to 3 months · export anytime",
        ),
    ),
    PLUS(
        "Plus", "aiimin_plus", "Your whole history, everywhere",
        "Every ledger and every month of your history, with your vault backed up to your own storage.",
        listOf(
            "All-time charts on phone and web",
            "Household and Business ledgers, unlimited splits, receipts on payments",
            "Document versions and weekly vault backups to your own storage",
            "Up to 6 family profiles · recurring bills calendar · CSV export for your CA",
        ),
    ),
    PRO(
        "Pro", "aiimin_pro", "Does the thinking for you", "AIIMIN explains your patterns and writes your reviews.",
        listOf(
            "Everything in Plus",
            "Patterns: what goes with what",
            "Monthly review as a PDF and weekly review drafts",
            "Smart categorisation rules · 3 trusted people for emergency access",
        ),
    ),
    FAMILY(
        "Family", "aiimin_family", "Everyone you look after", "Pro for up to 6 people, each with their own private space.",
        listOf(
            "Each member on their own phone, with a private journal and score",
            "A household vault shared phone to phone",
            "Emergency kits for everyone and caregiver roles",
            "A shared household budget and family tasks",
        ),
    ),
    ;

    /** Plan §13.2 prices in whole rupees, shown whenever Google Play has no product (beta). */
    val plannedMonthlyInr: Int get() = when (this) { FREE -> 0; PLUS -> 49; PRO -> 99; FAMILY -> 179 }
    val plannedYearlyInr: Int get() = when (this) { FREE -> 0; PLUS -> 449; PRO -> 899; FAMILY -> 1599 }

    /** True when every hero feature is built. Drives the "some features coming" note; never hides a plan. */
    val complete: Boolean get() = this == FREE || Feature.entries.filter { this in it.heroFor }.let { h -> h.isNotEmpty() && h.all { it.shipped } }

    companion object {
        fun ofProduct(id: String?) = entries.firstOrNull { it.productId == id } ?: FREE
    }
}

enum class Period { MONTHLY, YEARLY }

/** A price exactly as Google Play gives it (local currency, taxes included). */
data class PlayPrice(val formatted: String, val micros: Long, val offerToken: String)

data class PlanPrices(val plan: Plan, val monthly: PlayPrice?, val yearly: PlayPrice?, val details: ProductDetails) {
    /** Yearly saving against twelve months, from Play's own numbers. */
    val yearlySavingPct: Int? get() {
        val m = monthly?.micros ?: return null
        val y = yearly?.micros ?: return null
        if (m <= 0) return null
        return (100 - (y * 100 / (m * 12))).toInt().takeIf { it > 0 }
    }
}

data class Entitlement(val plan: Plan, val period: Period?, val autoRenewing: Boolean, val purchaseToken: String?, val orderId: String?, val since: Long?)

sealed interface StoreState {
    data object Loading : StoreState
    /** No Google Play on this phone, or billing is unavailable. */
    data class Unavailable(val why: String) : StoreState
    data object Offline : StoreState
    /** Play answered but has none of AIIMIN's plans listed (not published yet). */
    data object NotListed : StoreState
    data class Ready(val prices: List<PlanPrices>) : StoreState
}

/**
 * Plans and purchases through Google Play Billing. Prices are always Play's own product details,
 * never typed into the app. What you're on comes from Play's purchase record on this phone.
 */
@Singleton
class PlayBillingRepository @Inject constructor(@ApplicationContext private val context: Context) : PurchasesUpdatedListener {
    private val _store = MutableStateFlow<StoreState>(StoreState.Loading)
    val store: StateFlow<StoreState> = _store.asStateFlow()
    private val _entitlement = MutableStateFlow(Entitlement(Plan.FREE, null, false, null, null, null))
    val entitlement: StateFlow<Entitlement> = _entitlement.asStateFlow()
    /** Last purchase outcome for the checkout sheet: null, "ok", "cancelled" or an error line. */
    val outcome = MutableStateFlow<String?>(null)
    private val scope = kotlinx.coroutines.CoroutineScope(kotlinx.coroutines.SupervisorJob() + kotlinx.coroutines.Dispatchers.IO)

    private val client: BillingClient = BillingClient.newBuilder(context)
        .setListener(this)
        .enablePendingPurchases(PendingPurchasesParams.newBuilder().enableOneTimeProducts().build())
        .build()

    private suspend fun connect(): BillingResult? = withTimeoutOrNull(8_000) {
        if (client.isReady) return@withTimeoutOrNull BillingResult.newBuilder().setResponseCode(BillingClient.BillingResponseCode.OK).build()
        suspendCancellableCoroutine { cont ->
            client.startConnection(object : BillingClientStateListener {
                override fun onBillingSetupFinished(result: BillingResult) { if (cont.isActive) cont.resume(result) }
                override fun onBillingServiceDisconnected() { /* reconnect on next call */ }
            })
        }
    }

    suspend fun load() {
        _store.value = StoreState.Loading
        val setup = connect()
        when (setup?.responseCode) {
            null -> { _store.value = StoreState.Offline; return }
            BillingClient.BillingResponseCode.OK -> Unit
            BillingClient.BillingResponseCode.SERVICE_UNAVAILABLE, BillingClient.BillingResponseCode.NETWORK_ERROR -> { _store.value = StoreState.Offline; return }
            else -> { _store.value = StoreState.Unavailable("Purchases need Google Play on this phone."); return }
        }
        refreshPurchases()
        val products = Plan.entries.mapNotNull { it.productId }.map {
            QueryProductDetailsParams.Product.newBuilder().setProductId(it).setProductType(BillingClient.ProductType.SUBS).build()
        }
        val res = client.queryProductDetails(QueryProductDetailsParams.newBuilder().setProductList(products).build())
        if (res.billingResult.responseCode != BillingClient.BillingResponseCode.OK) {
            _store.value = StoreState.Offline
            return
        }
        val list = res.productDetailsList.orEmpty().map { d ->
            fun price(period: String): PlayPrice? = d.subscriptionOfferDetails.orEmpty()
                .filter { it.offerId == null } // the base plan itself, not a promotional offer
                .firstOrNull { o -> o.pricingPhases.pricingPhaseList.lastOrNull()?.billingPeriod == period }
                ?.let { o -> o.pricingPhases.pricingPhaseList.last().let { p -> PlayPrice(p.formattedPrice, p.priceAmountMicros, o.offerToken) } }
            PlanPrices(Plan.ofProduct(d.productId), price("P1M"), price("P1Y"), d)
        }.sortedBy { it.plan.ordinal }
        _store.value = if (list.isEmpty()) StoreState.NotListed else StoreState.Ready(list)
    }

    suspend fun refreshPurchases() {
        if (connect()?.responseCode != BillingClient.BillingResponseCode.OK) return
        val r = client.queryPurchasesAsync(QueryPurchasesParams.newBuilder().setProductType(BillingClient.ProductType.SUBS).build())
        handle(r.purchasesList)
    }

    fun buy(activity: Activity, p: PlanPrices, period: Period): Boolean {
        val price = (if (period == Period.YEARLY) p.yearly else p.monthly) ?: return false
        val params = BillingFlowParams.newBuilder().setProductDetailsParamsList(
            listOf(BillingFlowParams.ProductDetailsParams.newBuilder().setProductDetails(p.details).setOfferToken(price.offerToken).build()),
        )
        _entitlement.value.purchaseToken?.let { old ->
            params.setSubscriptionUpdateParams(
                BillingFlowParams.SubscriptionUpdateParams.newBuilder().setOldPurchaseToken(old)
                    .setSubscriptionReplacementMode(BillingFlowParams.SubscriptionUpdateParams.ReplacementMode.CHARGE_PRORATED_PRICE).build(),
            )
        }
        outcome.value = null
        return client.launchBillingFlow(activity, params.build()).responseCode == BillingClient.BillingResponseCode.OK
    }

    override fun onPurchasesUpdated(result: BillingResult, purchases: MutableList<Purchase>?) {
        when (result.responseCode) {
            BillingClient.BillingResponseCode.OK -> { handle(purchases.orEmpty()); outcome.value = "ok" }
            BillingClient.BillingResponseCode.USER_CANCELED -> outcome.value = "cancelled"
            BillingClient.BillingResponseCode.ITEM_ALREADY_OWNED -> outcome.value = "You already have this plan."
            else -> outcome.value = "Payment didn't go through. You haven't been charged."
        }
    }

    private fun handle(purchases: List<Purchase>) {
        val active = purchases.filter { it.purchaseState == Purchase.PurchaseState.PURCHASED }
            .maxByOrNull { Plan.ofProduct(it.products.firstOrNull()).ordinal }
        if (active == null) {
            _entitlement.value = Entitlement(Plan.FREE, null, false, null, null, null)
            return
        }
        if (!active.isAcknowledged) {
            val token = active.purchaseToken
            scope.launch { runCatching { client.acknowledgePurchase(AcknowledgePurchaseParams.newBuilder().setPurchaseToken(token).build()) } }
        }
        _entitlement.value = Entitlement(
            Plan.ofProduct(active.products.firstOrNull()), null, active.isAutoRenewing, active.purchaseToken, active.orderId, active.purchaseTime,
        )
    }

    /** Google Play's own subscription centre for this product (cancel, payment method). */
    fun manageUrl(plan: Plan): String =
        "https://play.google.com/store/account/subscriptions?package=${context.packageName}" + (plan.productId?.let { "&sku=$it" } ?: "")
}
