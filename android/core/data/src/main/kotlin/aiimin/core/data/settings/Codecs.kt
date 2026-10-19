package aiimin.core.data.settings

import aiimin.core.data.util.AppJson
import aiimin.core.engine.DayMode
import aiimin.core.engine.DaySnapshot
import aiimin.core.engine.DayType
import aiimin.core.engine.Direction
import aiimin.core.engine.Intention
import aiimin.core.engine.IntentionSet
import aiimin.core.engine.MinimumsTally
import aiimin.core.engine.PendingChange
import aiimin.core.engine.SignalDef
import aiimin.core.engine.Tier
import aiimin.core.engine.XpState
import java.time.LocalDate
import kotlinx.serialization.Serializable

/** Wire forms for engine types (the engine stays free of serialization). */
object Codecs {

    @Serializable
    private data class CardW(
        val dir: String, val target: Double, val weight: Int,
        val lo: Double? = null, val hi: Double? = null,
        val byType: Map<String, Double> = emptyMap(),
        val why: String = "", val ifThen: String = "",
        val pendingOn: String? = null, val pending: CardW? = null,
        val changedOn: String? = null,
    )

    @Serializable
    private data class DefW(val key: String, val name: String, val unit: String, val domain: String)

    @Serializable
    private data class SetW(val role: String, val cards: Map<String, CardW>, val custom: List<DefW> = emptyList(), val notRelevant: List<String> = emptyList())

    private fun Intention.w(): CardW = CardW(
        direction.name, target, weight, band?.start, band?.endInclusive,
        targetsByDayType.mapKeys { it.key.name }, why, ifThen,
        pending?.applyOn?.toString(), pending?.next?.w(), changedOn?.toString(),
    )

    private fun CardW.i(): Intention = Intention(
        direction = Direction.valueOf(dir),
        target = target,
        weight = weight,
        band = if (lo != null && hi != null) lo..hi else null,
        targetsByDayType = byType.mapKeys { DayType.valueOf(it.key) },
        why = why,
        ifThen = ifThen,
        pending = if (pendingOn != null && pending != null) PendingChange(LocalDate.parse(pendingOn), pending.i()) else null,
        changedOn = changedOn?.let(LocalDate::parse),
    )

    fun encodeIntentions(s: IntentionSet): String = AppJson.encodeToString(
        SetW.serializer(),
        SetW(
            s.role,
            s.cards.mapValues { it.value.w() },
            s.customDefs.values.map { DefW(it.key, it.name, it.unit, it.domain) },
            s.notRelevantChanges.map { it.toString() },
        ),
    )

    fun decodeIntentions(json: String): IntentionSet {
        val w = AppJson.decodeFromString(SetW.serializer(), json)
        val base = IntentionSet.default()
        // New built-in signals added in later versions appear with their defaults.
        val cards = base.cards + w.cards.mapValues { it.value.i() }
        return IntentionSet(
            role = w.role,
            cards = cards,
            customDefs = w.custom.associate { it.key to SignalDef(it.key, it.name, it.unit, it.domain, Tier.C, "Logged by you") },
            notRelevantChanges = w.notRelevant.map(LocalDate::parse),
        )
    }

    fun encodeDayMode(m: DayMode): String = when (m) {
        DayMode.Midnight -> "midnight"
        is DayMode.FixedEnd -> "fixed:${m.endHour}"
        is DayMode.Roster -> "roster:${m.pattern.joinToString("")}:${m.start}:${m.nightEndHour}"
    }

    fun decodeDayMode(s: String): DayMode = runCatching {
        val p = s.split(':')
        when (p[0]) {
            "fixed" -> DayMode.FixedEnd(p[1].toInt())
            "roster" -> DayMode.Roster(p[1].toList(), LocalDate.parse(p[2]), p[3].toInt())
            else -> DayMode.Midnight
        }
    }.getOrDefault(DayMode.Midnight)

    @Serializable
    private data class XpW(val level: Int, val xp: Int, val next: Int, val day: String? = null, val dayTotal: Int = 0, val showed: Boolean = false)

    fun encodeXp(x: XpState): String = AppJson.encodeToString(XpW.serializer(), XpW(x.level, x.xp, x.xpToNext, x.day?.toString(), x.dayTotal, x.showedUpToday))

    fun decodeXp(s: String): XpState = AppJson.decodeFromString(XpW.serializer(), s).let {
        XpState(it.level, it.xp, it.next, it.day?.let(LocalDate::parse), it.dayTotal, it.showed)
    }

    @Serializable
    private data class SnapW(
        val day: String,
        val v: Map<String, Double?>,
        val ev: Map<String, String>,
        val planned: Int, val kept: Int, val keptAB: Int,
        val type: String, val light: Boolean, val paused: Boolean, val mood: Int? = null,
    )

    fun encodeSnapshot(s: DaySnapshot): String = AppJson.encodeToString(
        SnapW.serializer(),
        SnapW(
            s.day.toString(), s.values, s.evidence.mapValues { it.value.name },
            s.minimums.planned, s.minimums.kept, s.minimums.keptWithProof,
            s.type.name, s.light, s.paused, s.mood,
        ),
    )

    fun decodeSnapshot(json: String): DaySnapshot = AppJson.decodeFromString(SnapW.serializer(), json).let {
        DaySnapshot(
            LocalDate.parse(it.day), it.v, it.ev.mapValues { e -> Tier.valueOf(e.value) },
            MinimumsTally(it.planned, it.kept, it.keptAB), DayType.valueOf(it.type), it.light, it.paused, it.mood,
        )
    }

    fun encodeList(list: List<String>): String = AppJson.encodeToString(kotlinx.serialization.builtins.ListSerializer(kotlinx.serialization.serializer<String>()), list)

    fun decodeList(json: String?): List<String> =
        if (json.isNullOrBlank()) emptyList() else runCatching { AppJson.decodeFromString<List<String>>(json) }.getOrDefault(emptyList())
}
