package aiimin.core.data.knock

import aiimin.core.model.SubscriptionTier

data class KnockSnapshot(
    val nowMs: Long,
    val minuteOfDay: Int,
    val dayOfWeek: Int,
    val osId: String,
    val masterOn: Boolean,
    val quietStartMin: Int,
    val quietEndMin: Int,
    val channelOn: Map<KnockChannel, Boolean>,
    val firedToday: Set<String>,
    val openedThisEvening: Boolean,
    val openMinimums: Int,
    val settleCount: Int,
    val tickCount: Int,
    val streakAtRisk: Int?,
    val steps: Long?,
    val stepsTarget: Long,
    val screenMs: Long?,
    val screenTargetMs: Long,
    val seatedMinutes: Long? = null,
    val speakingToday: Int,
    val tier: SubscriptionTier,
    val pendingOutbox: Int,
    val pendingForMs: Long,
    val lastError: String?,
    val agendaTitle: String?,
    val agendaInMs: Long?,
    val agingPinnedTitle: String?,
    val lifeScore: Int?,
    val daySpendPct: Float? = null,
    val isCorePlus: Boolean = tier.rank >= SubscriptionTier.CORE.rank,
)

object KnockEvaluator {

    fun inQuietHours(minuteOfDay: Int, start: Int, end: Int): Boolean {
        return if (start <= end) {
            minuteOfDay in start until end
        } else {
            minuteOfDay >= start || minuteOfDay < end
        }
    }

    fun evaluate(s: KnockSnapshot): List<KnockDecision> {
        if (!s.masterOn) return emptyList()
        if (inQuietHours(s.minuteOfDay, s.quietStartMin, s.quietEndMin)) {
            return syncOnly(s)
        }
        val out = mutableListOf<KnockDecision>()
        val userHandle = if (s.osId.isNotBlank()) s.osId.trim() else "you"

        fun add(case: KnockCase, vars: Map<String, String> = emptyMap(), link: String) {
            if (!channelOk(s, case.channel)) return
            if (case.capId in s.firedToday) return
            val mergedVars = mutableMapOf("user" to userHandle, "osId" to userHandle).apply {
                putAll(vars)
            }
            val line = KnockCopy.pick(case, s.osId + localDay(s.nowMs), mergedVars)
            out += KnockDecision(case, line.title, line.body, link)
        }

        if (s.minuteOfDay in (20 * 60 + 30) until (21 * 60 + 30)) {
            when {
                s.settleCount == 0 && s.tickCount == 0 ->
                    add(KnockCase.EMPTY_DAY, link = "capture")
                s.openMinimums >= 1 ->
                    add(
                        KnockCase.EVENING_MINIMA,
                        mapOf(
                            "open" to s.openMinimums.toString(),
                            "done" to s.tickCount.toString(),
                            "streak" to (s.streakAtRisk ?: 1).toString(),
                        ),
                        link = "day",
                    )
                else -> s.streakAtRisk?.let { n ->
                    if (n >= 3) add(KnockCase.STREAK, mapOf("n" to n.toString()), "day")
                }
            }
        }
        if (s.minuteOfDay in (7 * 60 + 30) until (9 * 60) && !s.openedThisEvening) {
            add(
                KnockCase.MORNING,
                mapOf("open" to s.openMinimums.toString()),
                link = "day",
            )
        }
        val steps = s.steps
        val st = s.stepsTarget
        if (steps != null && st > 0) {
            val frac = steps.toFloat() / st
            val targetStr = formatNum(st)
            val stepsStr = formatNum(steps)
            val leftStr = formatNum((st - steps).coerceAtLeast(0))
            when {
                frac >= 1f -> add(
                    KnockCase.STEPS_HIT,
                    mapOf("n" to stepsStr, "target" to targetStr),
                    "day",
                )
                frac >= 0.90f -> add(
                    KnockCase.STEPS_NEAR,
                    mapOf("left" to leftStr, "target" to targetStr, "n" to stepsStr),
                    "day",
                )
                frac >= 0.50f -> add(
                    KnockCase.STEPS_HALF,
                    mapOf("n" to stepsStr, "target" to targetStr),
                    "day",
                )
            }
        }
        val screen = s.screenMs
        val ceil = s.screenTargetMs
        if (screen != null && ceil > 0L) {
            val frac = screen.toFloat() / ceil
            when {
                frac >= 1f -> add(
                    KnockCase.SCREEN_OVER,
                    mapOf(
                        "over" to formatHours(screen - ceil),
                        "used" to formatHours(screen),
                    ),
                    "day",
                )
                frac >= 0.85f -> add(
                    KnockCase.SCREEN_NEAR,
                    mapOf(
                        "left" to formatHours(ceil - screen),
                        "used" to formatHours(screen),
                    ),
                    "day",
                )
            }
        }
        if ((s.seatedMinutes ?: 0L) >= 90L) {
            add(KnockCase.STILL, mapOf("min" to (s.seatedMinutes ?: 90L).toString()), link = "day")
        }
        if (s.isCorePlus && s.speakingToday == 0 && s.minuteOfDay in (18 * 60) until (20 * 60)) {
            add(KnockCase.ENGLISH, link = "english")
        }
        if (s.isCorePlus && (s.daySpendPct ?: 0f) >= 0.80f) {
            val pct = ((s.daySpendPct ?: 0.8f) * 100).toInt().toString()
            add(KnockCase.MONEY, mapOf("pct" to pct), link = "money")
        }
        out += syncOnly(s)
        val agendaIn = s.agendaInMs
        if (agendaIn != null && agendaIn in 0L..(16L * 60_000L)) {
            add(
                KnockCase.AGENDA,
                mapOf("title" to (s.agendaTitle ?: "event").take(28)),
                "day",
            )
        }
        s.agingPinnedTitle?.let { add(KnockCase.NOTE, mapOf("title" to it.take(28)), "notes") }
        if (s.dayOfWeek == 7 && s.minuteOfDay in (10 * 60) until (10 * 60 + 20)) {
            add(KnockCase.SCORE_WEEK, mapOf("n" to (s.lifeScore?.toString() ?: "—")), "score")
        }
        return out.distinctBy { it.case.capId }
    }

    private fun syncOnly(s: KnockSnapshot): List<KnockDecision> {
        if (!channelOk(s, KnockChannel.SYNC_HOLD)) return emptyList()
        if (KnockCase.SYNC.capId in s.firedToday && s.lastError == null) return emptyList()
        val held = s.pendingOutbox >= 5 && s.pendingForMs >= 30L * 60_000L
        if (!held && s.lastError == null) return emptyList()
        val userHandle = if (s.osId.isNotBlank()) s.osId.trim() else "you"
        val line = KnockCopy.pick(
            KnockCase.SYNC,
            s.osId + localDay(s.nowMs),
            mapOf("n" to s.pendingOutbox.toString(), "user" to userHandle),
        )
        return listOf(KnockDecision(KnockCase.SYNC, line.title, line.body, "config"))
    }

    private fun formatNum(n: Long): String {
        return try {
            java.text.NumberFormat.getIntegerInstance().format(n)
        } catch (_: Exception) {
            n.toString()
        }
    }

    private fun channelOk(s: KnockSnapshot, ch: KnockChannel): Boolean {
        if (ch.corePlus && !s.isCorePlus) return false
        return s.channelOn[ch] ?: ch.defaultOn
    }

    private fun localDay(nowMs: Long): String = (nowMs / 86_400_000L).toString()

    private fun formatHours(ms: Long): String {
        val m = (ms.coerceAtLeast(0) / 60_000L)
        val h = m / 60
        val r = m % 60
        return if (h > 0) "${h}h ${r}m" else "${r}m"
    }
}
