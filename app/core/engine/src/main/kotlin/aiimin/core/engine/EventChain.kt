package aiimin.core.engine

import java.security.MessageDigest
import java.time.Duration
import java.time.Instant
import java.time.LocalDate

data class EventRef(val type: String, val id: String)

/**
 * One behavioural fact. The event log is the only source of truth: scores,
 * streaks and the battery are recomputed from it, never stored as editable
 * numbers. Fields reserved for the server (§9.6) ride along from day one so
 * events upload and replay without migration.
 */
data class LogEvent(
    val seq: Long,
    val at: Instant,
    val day: LocalDate,
    val type: String,
    val ref: EventRef?,
    /** Flat, JSON-like values only: String, Number, Boolean, null, List, Map. */
    val data: Map<String, Any?>,
    val tier: Tier,
    val source: String,
    val tz: String,
    val rulesVersion: String,
    val deviceId: String,
    val prev: String,
    val hash: String,
    val serverTs: Instant? = null,
    val attestation: String = "none",
    /** HMAC from the Android Keystore, set by the data layer. Not part of the hash. */
    val signature: String? = null,
)

/** The running tail of a chain: what the next append needs. Persist it with the log. */
data class ChainTail(val seq: Long, val lastHash: String, val maxSeenAt: Instant?) {
    companion object {
        const val GENESIS = "GENESIS"
        val EMPTY = ChainTail(0, GENESIS, null)
    }
}

data class ChainCheck(val ok: Boolean, val brokenAtSeq: Long?)

/**
 * Append-only SHA-256 hash chain (plan §10). Each event hashes the previous
 * hash plus its own canonical form, so any edit outside the app breaks every
 * hash after it. A clock moved back by more than 10 minutes marks new events
 * Tier D (§2.5).
 */
class EventChain(
    private val rules: RulesConfig,
    private val deviceId: String,
    private val tz: String,
) {

    fun append(
        tail: ChainTail,
        now: Instant,
        day: LocalDate,
        type: String,
        ref: EventRef?,
        data: Map<String, Any?>,
        tier: Tier,
        source: String,
    ): Pair<LogEvent, ChainTail> {
        val tolerance = Duration.ofMinutes(rules.day.clockSkewToleranceMin.toLong())
        val skew = tail.maxSeenAt != null && now.isBefore(tail.maxSeenAt.minus(tolerance))
        val maxSeen = if (skew) tail.maxSeenAt else maxOf(tail.maxSeenAt ?: now, now)
        val draft = LogEvent(
            seq = tail.seq + 1,
            at = now,
            day = day,
            type = type,
            ref = ref,
            data = if (skew) data + ("clockSkew" to true) else data,
            tier = if (skew) Tier.D else tier,
            source = source,
            tz = tz,
            rulesVersion = rules.version,
            deviceId = deviceId,
            prev = tail.lastHash,
            hash = "",
        )
        val event = draft.copy(hash = hashOf(draft))
        return event to ChainTail(event.seq, event.hash, maxSeen)
    }

    companion object {
        /**
         * Canonical form shared with the server verifier: a JSON array
         * `[seq, epochMillis, day, type, ref, data, tier, source, tz, rules]`
         * with object keys sorted and no whitespace.
         */
        fun canonical(e: LogEvent): String = CanonicalJson.write(
            listOf(
                e.seq,
                e.at.toEpochMilli(),
                e.day.toString(),
                e.type,
                e.ref?.let { mapOf("id" to it.id, "type" to it.type) },
                e.data,
                e.tier.name,
                e.source,
                e.tz,
                e.rulesVersion,
            ),
        )

        fun hashOf(e: LogEvent): String = sha256Hex(e.prev + canonical(e))

        fun verify(events: List<LogEvent>): ChainCheck {
            var prev: String? = null
            for (e in events) {
                if (prev != null && e.prev != prev) return ChainCheck(false, e.seq)
                if (hashOf(e) != e.hash) return ChainCheck(false, e.seq)
                prev = e.hash
            }
            return ChainCheck(true, null)
        }

        fun sha256Hex(s: String): String =
            MessageDigest.getInstance("SHA-256").digest(s.toByteArray(Charsets.UTF_8))
                .joinToString("") { "%02x".format(it) }
    }
}

/** Minimal deterministic JSON (sorted keys, no whitespace). No dependency needed. */
internal object CanonicalJson {

    fun write(value: Any?): String = StringBuilder().also { append(it, value) }.toString()

    private fun append(sb: StringBuilder, v: Any?) {
        when (v) {
            null -> sb.append("null")
            is Boolean -> sb.append(v)
            is Int, is Long, is Short, is Byte -> sb.append(v.toString())
            is Double -> appendDouble(sb, v)
            is Float -> appendDouble(sb, v.toDouble())
            is Number -> appendDouble(sb, v.toDouble())
            is String -> appendString(sb, v)
            is Enum<*> -> appendString(sb, v.name)
            is Map<*, *> -> {
                sb.append('{')
                v.entries.sortedBy { it.key.toString() }.forEachIndexed { i, (k, value) ->
                    if (i > 0) sb.append(',')
                    appendString(sb, k.toString())
                    sb.append(':')
                    append(sb, value)
                }
                sb.append('}')
            }
            is Iterable<*> -> {
                sb.append('[')
                v.forEachIndexed { i, item ->
                    if (i > 0) sb.append(',')
                    append(sb, item)
                }
                sb.append(']')
            }
            else -> appendString(sb, v.toString())
        }
    }

    /** Integral doubles print without ".0" (as JavaScript does). */
    private fun appendDouble(sb: StringBuilder, d: Double) {
        require(d.isFinite()) { "Non-finite numbers can't be logged" }
        if (d == Math.rint(d) && kotlin.math.abs(d) < 1e15) sb.append(d.toLong()) else sb.append(d.toString())
    }

    private fun appendString(sb: StringBuilder, s: String) {
        sb.append('"')
        for (c in s) {
            when (c) {
                '"' -> sb.append("\\\"")
                '\\' -> sb.append("\\\\")
                '\n' -> sb.append("\\n")
                '\r' -> sb.append("\\r")
                '\t' -> sb.append("\\t")
                '\b' -> sb.append("\\b")
                '\u000C' -> sb.append("\\f")
                else -> if (c < ' ') sb.append("\\u%04x".format(c.code)) else sb.append(c)
            }
        }
        sb.append('"')
    }
}
