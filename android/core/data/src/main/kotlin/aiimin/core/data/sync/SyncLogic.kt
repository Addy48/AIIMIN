package aiimin.core.data.sync

import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.JsonPrimitive
import kotlinx.serialization.json.contentOrNull
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive

/**
 * The pure parts of sync, kept free of Android and the network so they can be unit-tested:
 * snapshots, the three-way merge decision, duplicate keys and the retry schedule.
 */

/** A synced item reduced to the fields both sides can change, as a stable, sorted JSON object. */
object Snap {
    private val json = Json { prettyPrint = false }

    fun of(vararg fields: Pair<String, Any?>): String =
        JsonObject(fields.sortedBy { it.first }.associate { (k, v) -> k to JsonPrimitive(v?.toString()) }).toString()

    fun parse(snapshot: String?): Map<String, String?> =
        runCatching { json.parseToJsonElement(snapshot ?: "").jsonObject.mapValues { it.value.jsonPrimitive.contentOrNull } }.getOrDefault(emptyMap())

    /** Field names whose values differ, for the conflict screen. */
    fun diff(a: String, b: String): List<String> {
        val x = parse(a)
        val y = parse(b)
        return (x.keys + y.keys).filter { x[it] != y[it] }.sorted()
    }
}

enum class MergeOutcome { SAME, TAKE_REMOTE, PUSH_LOCAL, CONFLICT }

object Merge {
    /**
     * Three-way decision for one item that exists on both sides.
     * [base] is the last state both sides agreed on (null for items linked before shadows existed);
     * [localChanged] says the phone touched the item after the last completed sync.
     */
    fun decide(base: String?, local: String, remote: String, localChanged: Boolean): MergeOutcome = when {
        local == remote -> MergeOutcome.SAME
        base == null -> if (localChanged) MergeOutcome.PUSH_LOCAL else MergeOutcome.TAKE_REMOTE
        local == base -> MergeOutcome.TAKE_REMOTE
        remote == base -> MergeOutcome.PUSH_LOCAL
        else -> MergeOutcome.CONFLICT
    }
}

/** Keys that decide "this is the same thing" when an item exists on both sides but was never linked. */
object Dedupe {
    fun norm(s: String?): String = s.orEmpty().trim().lowercase().replace(Regex("\\s+"), " ")

    fun taskKey(title: String?, day: String?): String = norm(title) + "|" + day.orEmpty().take(10)

    fun noteKey(title: String?, body: String?): String = norm(title) + "|" + norm(body).take(200)

    fun moneyKey(paise: Long, day: String, title: String): String = "$paise|${day.take(10)}|${norm(title)}"

    /** Events match on title and start minute. */
    fun eventKey(title: String?, startMillis: Long): String = norm(title) + "|" + (startMillis / 60_000L)

    fun nameKey(name: String?): String = norm(name)
}

object Backoff {
    const val BASE_MS = 30_000L
    const val MAX_MS = 30 * 60_000L

    /** 30 s, 1 min, 2 min, 4 min … capped at 30 min. [failures] counts consecutive failed runs. */
    fun delayFor(failures: Int): Long {
        if (failures <= 0) return 0L
        val shift = (failures - 1).coerceAtMost(16)
        return (BASE_MS shl shift).coerceAtMost(MAX_MS)
    }
}
