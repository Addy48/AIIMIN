package aiimin.core.data.plan

/** How much of a feature a plan gets. [rank] orders them so a higher plan never gives less. */
sealed class Access(val rank: Int) {
    data object No : Access(0)
    data class UpTo(val n: Int) : Access(1 + n.coerceAtMost(9_998))
    data class Months(val n: Int) : Access(1 + n)
    data object Yes : Access(10_000)
}

enum class FeatureGroup(val title: String) { DAY("Day"), MONEY("Money"), VAULT("Vault & family"), INSIGHT("Insight"), SYNC("Sync & storage"), SUPPORT("Support") }

/**
 * Every plan difference as data (plan §13.2). The Plans screen, the Compare table and every gate
 * read this; nothing else may hard-code what a plan includes. [shipped] means built and working on
 * a real phone; unshipped features still show under their plan, marked "(coming)".
 */
enum class Feature(
    val title: String,
    val group: FeatureGroup,
    val free: Access,
    val plus: Access,
    val pro: Access,
    val family: Access,
    val shipped: Boolean,
    val heroFor: Set<Plan> = emptySet(),
    val safety: Boolean = false,
) {
    DAY_CORE("Today, tasks, calendar, focus, minimums, journal, notes", FeatureGroup.DAY, Access.Yes, Access.Yes, Access.Yes, Access.Yes, shipped = true),
    VOICE_CAPTURE("Voice capture", FeatureGroup.DAY, Access.Yes, Access.Yes, Access.Yes, Access.Yes, shipped = true),
    LIFE_SCORE("Life Score, kept days, battery", FeatureGroup.INSIGHT, Access.Yes, Access.Yes, Access.Yes, Access.Yes, shipped = true),
    CHART_HISTORY("Chart history", FeatureGroup.INSIGHT, Access.Months(3), Access.Yes, Access.Yes, Access.Yes, shipped = true, heroFor = setOf(Plan.PLUS)),
    PATTERNS("Patterns: what goes with what", FeatureGroup.INSIGHT, Access.No, Access.No, Access.Yes, Access.Yes, shipped = false, heroFor = setOf(Plan.PRO)),
    MONTHLY_REVIEW("Monthly review PDF", FeatureGroup.INSIGHT, Access.No, Access.No, Access.Yes, Access.Yes, shipped = false, heroFor = setOf(Plan.PRO)),
    WEEKLY_DRAFTS("Weekly review drafts", FeatureGroup.INSIGHT, Access.No, Access.No, Access.Yes, Access.Yes, shipped = false, heroFor = setOf(Plan.PRO)),
    LEDGERS("Ledgers", FeatureGroup.MONEY, Access.UpTo(1), Access.UpTo(3), Access.UpTo(3), Access.UpTo(3), shipped = true, heroFor = setOf(Plan.PLUS)),
    SPLIT_PEOPLE("People in splits", FeatureGroup.MONEY, Access.UpTo(3), Access.Yes, Access.Yes, Access.Yes, shipped = true),
    SMART_RULES("Smart categorisation rules", FeatureGroup.MONEY, Access.No, Access.No, Access.Yes, Access.Yes, shipped = true, heroFor = setOf(Plan.PRO)),
    CA_EXPORT("CSV export for your CA", FeatureGroup.MONEY, Access.No, Access.Yes, Access.Yes, Access.Yes, shipped = true),
    VAULT_DOCS("Documents (always on your phone)", FeatureGroup.VAULT, Access.Yes, Access.Yes, Access.Yes, Access.Yes, shipped = true),
    FAMILY_PROFILES("Family profiles", FeatureGroup.VAULT, Access.UpTo(2), Access.UpTo(6), Access.UpTo(6), Access.UpTo(6), shipped = true, heroFor = setOf(Plan.PLUS)),
    DOC_VERSIONS("Document versions", FeatureGroup.VAULT, Access.No, Access.Yes, Access.Yes, Access.Yes, shipped = true, heroFor = setOf(Plan.PLUS)),
    AUTO_BACKUP("Automatic weekly vault backup", FeatureGroup.VAULT, Access.No, Access.Yes, Access.Yes, Access.Yes, shipped = true, heroFor = setOf(Plan.PLUS)),
    EMERGENCY_CARD("Emergency card and expiry reminders", FeatureGroup.VAULT, Access.Yes, Access.Yes, Access.Yes, Access.Yes, shipped = true, safety = true),
    TRUSTED_PEOPLE("Trusted people for emergency access", FeatureGroup.VAULT, Access.UpTo(1), Access.UpTo(1), Access.UpTo(3), Access.Yes, shipped = false, safety = true),
    MEMBER_PHONES("Each member on their own phone", FeatureGroup.VAULT, Access.No, Access.No, Access.No, Access.Yes, shipped = false, heroFor = setOf(Plan.FAMILY)),
    BROWSERS("Linked browsers on aiimin.in", FeatureGroup.SYNC, Access.UpTo(1), Access.UpTo(4), Access.UpTo(4), Access.UpTo(4), shipped = true),
    EXPORT_ALL("Export everything", FeatureGroup.SYNC, Access.Yes, Access.Yes, Access.Yes, Access.Yes, shipped = true, safety = true),
    PRIORITY_SUPPORT("Priority support", FeatureGroup.SUPPORT, Access.No, Access.No, Access.Yes, Access.Yes, shipped = true),
    ;

    fun accessFor(plan: Plan): Access = when (plan) {
        Plan.FREE -> free
        Plan.PLUS -> plus
        Plan.PRO -> pro
        Plan.FAMILY -> family
    }
}
