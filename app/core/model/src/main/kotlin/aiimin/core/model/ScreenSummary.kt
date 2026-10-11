package aiimin.core.model

/** What screen-time surfaces show, computed once so Today, Phone day and the score never disagree. */
data class ScreenSummary(val totalMs: Long, val personalMs: Long, val otherMs: Long, val countedLine: String?) {
    companion object {
        /**
         * @param appMs per-app foreground time; [shown] of the biggest are listed, the rest become "Other apps".
         */
        fun of(totalMs: Long, personalMs: Long, appMs: List<Long>, shown: Int): ScreenSummary {
            val listed = appMs.sortedDescending().take(shown).sum()
            val work = (totalMs - personalMs).coerceAtLeast(0)
            val counted = if (work < 60_000L) null else "${fmt(personalMs)} counted · ${fmt(work)} work"
            return ScreenSummary(totalMs, personalMs, (totalMs - listed).coerceAtLeast(0), counted)
        }

        /** Unlocks are exact on a phone with a PIN or pattern; without one the keyguard never hides, so count screen-ons. */
        fun pickups(secure: Boolean, unlocks: Int, screenOns: Int): Pair<Int, String> =
            if (secure) unlocks to "unlocks" else screenOns to "pickups"

        fun fmt(ms: Long): String {
            val min = ms / 60_000L
            return when {
                min < 1 -> "<1m"
                min < 60 -> "${min}m"
                min % 60 == 0L -> "${min / 60}h"
                else -> "${min / 60}h ${min % 60}m"
            }
        }
    }
}
