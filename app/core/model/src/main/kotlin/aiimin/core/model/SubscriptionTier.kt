package aiimin.core.model

/**
 * Same ladder as web `tierGating.js`:
 * explore < core < pro < elite.
 *
 * Souls / copy / icons: [[Native-Plan-System]] — Account `PLAN_TIER_META` +
 * `STATIC_TIERS` + `TIER_SOUL` (not waitlist green marketing).
 */
enum class SubscriptionTier(
    val id: String,
    val label: String,
    val rank: Int,
) {
    EXPLORE("explore", "Explore", 0),
    CORE("core", "Core", 1),
    PRO("pro", "Pro", 2),
    ELITE("elite", "Elite", 3),
    ;

    fun atLeast(required: SubscriptionTier): Boolean = rank >= required.rank

    val soul: TierSoul get() = TierSouls.of(this)

    companion object {
        fun fromId(raw: String?): SubscriptionTier {
            val key = raw?.trim()?.lowercase().orEmpty()
            return entries.firstOrNull { it.id == key || it.label.equals(raw, ignoreCase = true) }
                ?: CORE
        }
    }
}

enum class TierFeature(val min: SubscriptionTier, val title: String) {
    DAY(SubscriptionTier.EXPLORE, "Day"),
    CAPTURE(SubscriptionTier.EXPLORE, "Capture"),
    JOURNAL(SubscriptionTier.EXPLORE, "Journal"),
    SCORE_READ(SubscriptionTier.EXPLORE, "Life Score"),
    MONEY(SubscriptionTier.CORE, "Money"),
    LAB_FULL(SubscriptionTier.CORE, "Lab · full"),
    DISCIPLINE(SubscriptionTier.CORE, "Discipline"),
    UPI_REVIEW(SubscriptionTier.PRO, "UPI review"),
    FAMILY(SubscriptionTier.PRO, "Family vault"),
    INTELLIGENCE(SubscriptionTier.ELITE, "Intelligence"),
}

enum class TierIconKind { Compass, Layers, Zap, Crown }

/**
 * Full identity pack for one tier — colors, prices, App|Web, celebration.
 * ARGB soul as Long `0xFF______` for Compose Color(soulArgb).
 */
data class TierSoul(
    val tier: SubscriptionTier,
    val soulArgb: Long,
    val icon: TierIconKind,
    /** Founding / shown price INR per month. */
    val priceInr: Int,
    /** Marketing list price when higher than founding; null if same. */
    val listPriceInr: Int?,
    val description: String,
    val taglineWaitlist: String,
    val featuresAccount: List<String>,
    val unlocksCelebration: List<String>,
    val taglineCelebration: String,
    val appUnlocks: List<String>,
    val webUnlocks: List<String>,
    val aiCallsPerDay: Int,
    val recommended: Boolean,
    val bestFor: String,
) {
    val label: String get() = tier.label
    val id: String get() = tier.id

    fun priceLabel(): String = when {
        priceInr <= 0 -> "₹0"
        else -> "₹$priceInr/mo"
    }

    fun whisper(from: SubscriptionTier): String =
        if (tier.rank < from.rank) "Switching to $label" else "Updating your plan"

    fun ctaContinue(): String = "Continue on $label"
}

object TierSouls {
    val all: List<TierSoul> = listOf(
        TierSoul(
            tier = SubscriptionTier.EXPLORE,
            soulArgb = 0xFF6B7280L,
            icon = TierIconKind.Compass,
            priceInr = 0,
            listPriceInr = null,
            description = "Log daily. Learn the loop.",
            taglineWaitlist = "Capture the day. Feel the loop.",
            featuresAccount = listOf(
                "Log sleep, mood, gym, water, and steps daily",
                "Weekly completion ring and basic streak view",
                "Full Life OS view with 30-day history",
                "1 AI call per day (Arc sharpen + Universal Logger)",
                "Reports nav visible · locked (Pro badge)",
            ),
            unlocksCelebration = listOf(
                "Daily log", "Basic streaks", "30-day history", "1 AI call/day",
            ),
            taglineCelebration =
                "Daily logging stays. Advanced tools pause until you upgrade again.",
            appUnlocks = listOf(
                "Day · minimums · Depth meter",
                "Capture · 1 Spark / day",
                "Journal · evening debrief",
                "OS-ID · Config",
            ),
            webUnlocks = listOf(
                "Today + Calendar + Notes",
                "Journal + daily log",
                "Reports visible · deep tabs locked",
                "1 AI call / day",
            ),
            aiCallsPerDay = 1,
            recommended = false,
            bestFor = "Anyone testing whether one Life OS sticks",
        ),
        TierSoul(
            tier = SubscriptionTier.CORE,
            soulArgb = 0xFF2DD4BFL,
            icon = TierIconKind.Layers,
            priceInr = 29,
            listPriceInr = null,
            description = "Run your essentials.",
            taglineWaitlist = "Run the operating loop.",
            featuresAccount = listOf(
                "Everything in Explore",
                "Habits, money manager, and Pomodoro focus timer",
                "Weekly pattern insights and review loops",
                "Goals across 8 metrics (daily / weekly / monthly)",
                "Ivory Snapshot · 7-day pulse on Reports",
                "10 AI calls per day",
            ),
            unlocksCelebration = listOf(
                "Habits & money", "Focus timer", "Weekly patterns", "10 AI calls/day",
            ),
            taglineCelebration =
                "Habits, money, and focus — unlocked across your Life OS.",
            appUnlocks = listOf(
                "Everything in Explore",
                "Money ledger + lending",
                "Lab English (full) · Health Connect",
                "Home widget · score · steps · screen",
            ),
            webUnlocks = listOf(
                "Habits · Goals · Focus · Discipline",
                "Finance + Career + Lab",
                "Journal packs · Ivory Snapshot",
                "10 AI calls / day",
            ),
            aiCallsPerDay = 10,
            recommended = false,
            bestFor = "Students & early pros who live in the app daily",
        ),
        TierSoul(
            tier = SubscriptionTier.PRO,
            soulArgb = 0xFFFF6B35L,
            icon = TierIconKind.Zap,
            priceInr = 49,
            listPriceInr = 59,
            description = "See the patterns.",
            taglineWaitlist = "Household + patterns.",
            featuresAccount = listOf(
                "Everything in Core",
                "Correlation Intelligence on Snapshot (top 3)",
                "Life OS Review PDF (14-day fingerprint)",
                "6 Standard PDFs / month · separate from daily AI",
                "Wealth AI summary + import",
                "25 AI calls per day",
            ),
            unlocksCelebration = listOf(
                "Correlation insights", "Habit recovery", "Monthly reports", "25 AI calls/day",
            ),
            taglineCelebration =
                "Deeper patterns, reports, and higher AI quota — now open.",
            appUnlocks = listOf(
                "Everything in Core",
                "UPI payment-alert review",
                "Cloud voice replay (opt-in)",
                "Priority capture surfaces",
            ),
            webUnlocks = listOf(
                "Family vault · Documents · People",
                "Wealth AI · What-if · Correlations",
                "Life OS Review PDF · 6 / mo",
                "25 AI calls / day",
            ),
            aiCallsPerDay = 25,
            recommended = true,
            bestFor = "People who manage money + family docs in one place",
        ),
        TierSoul(
            tier = SubscriptionTier.ELITE,
            soulArgb = 0xFFFBBF24L,
            icon = TierIconKind.Crown,
            priceInr = 79,
            listPriceInr = 99,
            description = "Interactive intelligence · two AI pools.",
            taglineWaitlist = "Full intelligence · two AI pools.",
            featuresAccount = listOf(
                "Everything in Pro",
                "Interactive Intelligence Report (web · 30/60/90-day)",
                "3 Deep Reports / month · dedicated generation pool",
                "Unlimited Standard PDFs",
                "40 AI calls per day (daily pool never drained by Deep gen)",
                "Early access to every new module at launch",
            ),
            unlocksCelebration = listOf(
                "40 AI calls/day", "Sports briefing", "Priority support", "Early access",
            ),
            taglineCelebration =
                "Full access — highest AI quota, priority queue, early modules.",
            appUnlocks = listOf(
                "Everything in Pro",
                "Highest Android priority",
                "Deep capture betas first",
            ),
            webUnlocks = listOf(
                "Interactive Intelligence Report",
                "3 Deep Reports / mo · unlimited Standard PDFs",
                "40 AI calls / day (Deep pool separate)",
            ),
            aiCallsPerDay = 40,
            recommended = false,
            bestFor = "Founders & power users who want the full OS",
        ),
    )

    fun of(tier: SubscriptionTier): TierSoul = all.first { it.tier == tier }
}

/** @deprecated Prefer [TierSouls] — kept for call sites during migrate. */
data class TierUnlock(
    val tier: SubscriptionTier,
    val app: List<String>,
    val web: List<String>,
    val aiCallsPerDay: Int,
)

object TierCatalog {
    val all: List<TierUnlock>
        get() = TierSouls.all.map {
            TierUnlock(it.tier, it.appUnlocks, it.webUnlocks, it.aiCallsPerDay)
        }

    fun unlock(tier: SubscriptionTier): TierUnlock =
        all.first { it.tier == tier }

    fun soul(tier: SubscriptionTier): TierSoul = TierSouls.of(tier)

    fun can(user: SubscriptionTier, feature: TierFeature): Boolean =
        user.atLeast(feature.min)

    fun can(user: SubscriptionTier, required: SubscriptionTier): Boolean =
        user.atLeast(required)
}
