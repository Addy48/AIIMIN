package aiimin.core.data.plan

sealed interface GateResult {
    data object Allowed : GateResult
    /** Soft limits (beta): the action completes; the UI may show one quiet line. */
    data class AllowedOnce(val limit: Int, val liftedBy: Plan) : GateResult
    data class OverLimit(val limit: Int, val liftedBy: Plan) : GateResult
    data class NotInPlan(val liftedBy: Plan) : GateResult
}

/** Whether a plan allows an action, and which plan lifts the limit if not. Safety features are never gated. */
object Gate {
    fun check(plan: Plan, f: Feature, used: Int = 0, soft: Boolean): GateResult {
        if (f.safety) return GateResult.Allowed
        fun lifter(need: (Access) -> Boolean) = Plan.entries.firstOrNull { it.ordinal > plan.ordinal && need(f.accessFor(it)) } ?: Plan.FAMILY
        return when (val a = f.accessFor(plan)) {
            Access.Yes -> GateResult.Allowed
            Access.No -> GateResult.NotInPlan(lifter { it != Access.No })
            is Access.UpTo -> if (used < a.n) GateResult.Allowed else {
                val up = lifter { it is Access.Yes || (it is Access.UpTo && it.n > a.n) }
                if (soft) GateResult.AllowedOnce(a.n, up) else GateResult.OverLimit(a.n, up)
            }
            is Access.Months -> GateResult.Allowed
        }
    }

    fun months(plan: Plan, requested: Int): GateResult = when (val a = Feature.CHART_HISTORY.accessFor(plan)) {
        is Access.Months -> if (requested <= a.n) GateResult.Allowed else GateResult.OverLimit(a.n, Plan.PLUS)
        else -> GateResult.Allowed
    }
}
