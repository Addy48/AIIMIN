package aiimin.core.data.core

import aiimin.core.data.settings.SettingsStore
import aiimin.core.database.EventDao
import aiimin.core.database.EventEntity
import aiimin.core.engine.ChainTail
import aiimin.core.engine.DayMode
import aiimin.core.engine.EventChain
import aiimin.core.engine.EventRef
import aiimin.core.engine.LogEvent
import aiimin.core.engine.LogicalDay
import aiimin.core.engine.RulesConfig
import aiimin.core.engine.Tier
import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import android.util.Base64
import java.security.KeyStore
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneId
import javax.crypto.Cipher
import javax.crypto.KeyGenerator
import javax.crypto.SecretKey
import javax.crypto.spec.GCMParameterSpec
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonArray
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.JsonNull
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.JsonPrimitive
import kotlinx.serialization.json.booleanOrNull
import kotlinx.serialization.json.doubleOrNull
import kotlinx.serialization.json.longOrNull

/** Wall clock + logical day. The only place that reads "now". */
@Singleton
class DayClock @Inject constructor(private val settings: SettingsStore) {

    val zone: ZoneId get() = ZoneId.systemDefault()
    val rules: RulesConfig = RulesConfig.V2

    /** A tick every minute the app is alive; screens observe it to roll over at midnight. */
    private val _tick = MutableStateFlow(System.currentTimeMillis())
    val tick: StateFlow<Long> = _tick.asStateFlow()

    fun pulse() {
        _tick.value = System.currentTimeMillis()
    }

    fun now(): Instant = Instant.now()

    suspend fun mode(): DayMode = settings.current().dayMode

    suspend fun logical(): LogicalDay = LogicalDay(mode(), zone, rules)

    suspend fun today(): LocalDate = logical().dayOf(now())

    /** Today as a flow that changes when the logical day turns over. */
    val todayFlow: Flow<LocalDate> = tick.map { LogicalDay(settings.current().dayMode, zone, rules).dayOf(Instant.ofEpochMilli(it)) }
}

/**
 * The single write path for behaviour. Every meaningful action appends one
 * hash-chained event; scores are derived from what the log says happened.
 */
@Singleton
class EventLogger @Inject constructor(
    private val dao: EventDao,
    private val clock: DayClock,
    private val settings: SettingsStore,
) {
    private val mutex = Mutex()

    suspend fun log(
        type: String,
        refType: String? = null,
        refId: String? = null,
        data: Map<String, Any?> = emptyMap(),
        tier: Tier = Tier.C,
        source: String = "ui",
        day: LocalDate? = null,
    ): LogEvent = mutex.withLock {
        val last = dao.last()
        val tail = if (last == null) ChainTail.EMPTY else ChainTail(last.seq, last.hash, dao.maxAt()?.let(Instant::ofEpochMilli))
        val chain = EventChain(clock.rules, settings.deviceId(), clock.zone.id)
        val (e, _) = chain.append(tail, clock.now(), day ?: clock.today(), type, refType?.let { EventRef(it, refId.orEmpty()) }, data, tier, source)
        dao.append(e.toEntity())
        e
    }

    suspend fun countToday(type: String, refId: String): Int = dao.count(clock.today().toString(), type, refId)

    suspend fun verify(): Boolean = EventChain.verify(dao.all().map { it.toModel() }).ok

    fun recent(limit: Int): Flow<List<LogEvent>> = dao.recent(limit).map { list -> list.map { it.toModel() } }

    companion object {
        fun LogEvent.toEntity() = EventEntity(
            seq, at.toEpochMilli(), day.toString(), type, ref?.type, ref?.id, encodeData(data), tier.name,
            source, tz, rulesVersion, deviceId, prev, hash,
        )

        fun EventEntity.toModel() = LogEvent(
            seq, Instant.ofEpochMilli(at), LocalDate.parse(day), type, refType?.let { EventRef(it, refId.orEmpty()) },
            decodeData(data), Tier.valueOf(tier), source, tz, rules, device, prev, hash,
        )

        private fun toJson(v: Any?): JsonElement = when (v) {
            null -> JsonNull
            is Boolean -> JsonPrimitive(v)
            is Number -> JsonPrimitive(v)
            is String -> JsonPrimitive(v)
            is Map<*, *> -> JsonObject(v.entries.associate { it.key.toString() to toJson(it.value) })
            is Iterable<*> -> JsonArray(v.map(::toJson))
            else -> JsonPrimitive(v.toString())
        }

        private fun fromJson(e: JsonElement): Any? = when (e) {
            is JsonNull -> null
            is JsonPrimitive -> when {
                e.isString -> e.content
                e.booleanOrNull != null -> e.booleanOrNull
                e.longOrNull != null -> e.longOrNull
                else -> e.doubleOrNull
            }
            is JsonObject -> e.mapValues { fromJson(it.value) }
            is JsonArray -> e.map(::fromJson)
        }

        fun encodeData(m: Map<String, Any?>): String = toJson(m).toString()

        @Suppress("UNCHECKED_CAST")
        fun decodeData(s: String): Map<String, Any?> = runCatching { fromJson(Json.parseToJsonElement(s)) as Map<String, Any?> }.getOrDefault(emptyMap())
    }
}

/**
 * AES-256-GCM with a key that never leaves the Android Keystore. Used for the
 * journal and for vault files marked sensitive.
 */
@Singleton
class Crypto @Inject constructor() {

    private fun key(alias: String): SecretKey {
        val ks = KeyStore.getInstance("AndroidKeyStore").apply { load(null) }
        (ks.getEntry(alias, null) as? KeyStore.SecretKeyEntry)?.let { return it.secretKey }
        val gen = KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, "AndroidKeyStore")
        gen.init(
            KeyGenParameterSpec.Builder(alias, KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT)
                .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
                .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
                .setKeySize(256)
                .build(),
        )
        return gen.generateKey()
    }

    fun encrypt(plain: ByteArray, alias: String = JOURNAL): Pair<ByteArray, ByteArray> {
        val c = Cipher.getInstance(TRANSFORM)
        c.init(Cipher.ENCRYPT_MODE, key(alias))
        return c.doFinal(plain) to c.iv
    }

    fun decrypt(cipher: ByteArray, iv: ByteArray, alias: String = JOURNAL): ByteArray {
        val c = Cipher.getInstance(TRANSFORM)
        c.init(Cipher.DECRYPT_MODE, key(alias), GCMParameterSpec(128, iv))
        return c.doFinal(cipher)
    }

    fun encryptText(s: String): Pair<String, String> =
        encrypt(s.toByteArray()).let { (c, iv) -> b64(c) to b64(iv) }

    fun decryptText(cipher: String, iv: String): String =
        runCatching { String(decrypt(unb64(cipher), unb64(iv))) }.getOrDefault("")

    private fun b64(b: ByteArray) = Base64.encodeToString(b, Base64.NO_WRAP)
    private fun unb64(s: String) = Base64.decode(s, Base64.NO_WRAP)

    companion object {
        const val JOURNAL = "aiimin.journal.v1"
        const val VAULT = "aiimin.vault.v1"
        private const val TRANSFORM = "AES/GCM/NoPadding"
    }
}
