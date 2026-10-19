package aiimin.core.sensing.logic

/** "Your phone is pausing AIIMIN in the background": when to say it, and the steps for each maker. */
object KeepAlive {
    private const val WEEK = 7 * 86_400_000L

    private const val DAY = 86_400_000L

    /**
     * [stalledAt] is when Pulse last found a job that had missed two background runs. The beat that
     * finds it also fixes it, so the card keys off the time of the stall, not the current state.
     */
    fun show(stalledAt: Long?, needsKeepAlive: Boolean, unrestricted: Boolean, dismissedAt: Long?, now: Long): Boolean =
        stalledAt != null && now - stalledAt < DAY && (needsKeepAlive || !unrestricted) && (dismissedAt == null || now - dismissedAt >= WEEK)

    fun steps(maker: String): String = when (maker.trim().lowercase()) {
        "xiaomi", "redmi", "poco" -> "In App info: turn on Autostart, then Battery saver › No restrictions."
        "samsung" -> "Settings › Battery › Background usage limits › Never sleeping apps › add AIIMIN."
        "oneplus", "oppo", "realme" -> "In App info › Battery: Allow background activity, and turn off Optimise battery use."
        "vivo", "iqoo" -> "Settings › Battery › Background power consumption › AIIMIN › Allow."
        "huawei", "honor" -> "Settings › Battery › App launch › AIIMIN › Manage manually, all three on."
        else -> "In App info › Battery, choose Unrestricted."
    }
}
