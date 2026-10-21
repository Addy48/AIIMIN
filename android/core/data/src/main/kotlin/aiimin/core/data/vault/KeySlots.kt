package aiimin.core.data.vault

import java.nio.ByteBuffer
import java.security.SecureRandom
import javax.crypto.Cipher
import javax.crypto.spec.GCMParameterSpec
import javax.crypto.spec.SecretKeySpec

/**
 * Weekly backups (PRD Part 5 Phase 3), container VB2. One random data key seals the archive; the key itself sits
 * in two slots in the file header, one opened by the passphrase and one by the 24-character recovery code. On the
 * phone the data key is kept wrapped by the Android Keystore, so the weekly job needs neither secret, and a phone
 * that lost its Keystore key (data cleared) can still open the folder backup with either secret.
 *
 * Layout: "AIIMIN1" · kind 3 · slot count (1) · slots · nonce (12) · AES-256-GCM(archive), header bound as AAD.
 * Slot: salt (16) · iterations (int) · nonce (12) · AES-GCM(data key) = 16 + 4 + 12 + 48 bytes.
 */
object KeySlots {
    private val MAGIC = "AIIMIN1".toByteArray()
    const val KIND_WEEKLY: Byte = 3
    const val SLOT_SIZE = 16 + 4 + 12 + 48
    private val rng = SecureRandom()

    fun newDataKey(): ByteArray = ByteArray(32).also(rng::nextBytes)

    private const val ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"

    /** 24 characters (120 bits), shown once as six groups of four. */
    fun newRecoveryCode(): String = (1..24).map { ALPHABET[rng.nextInt(ALPHABET.length)] }.chunked(4).joinToString("-") { it.joinToString("") }

    fun normalize(typed: String): String = typed.uppercase().filter { it in ALPHABET }

    /** The data key locked with one secret. */
    fun slot(dataKey: ByteArray, secret: CharArray, iterations: Int = Seal.ITERATIONS): ByteArray {
        val salt = ByteArray(16).also(rng::nextBytes)
        val nonce = ByteArray(12).also(rng::nextBytes)
        val c = Cipher.getInstance("AES/GCM/NoPadding")
        c.init(Cipher.ENCRYPT_MODE, SecretKeySpec(Seal.key(secret, salt, iterations), "AES"), GCMParameterSpec(128, nonce))
        return ByteBuffer.allocate(SLOT_SIZE).put(salt).putInt(iterations).put(nonce).put(c.doFinal(dataKey)).array()
    }

    private fun unslot(slot: ByteArray, secret: CharArray): ByteArray? {
        val b = ByteBuffer.wrap(slot)
        val salt = ByteArray(16).also { b.get(it) }
        val it = b.int
        if (it !in 100_000..5_000_000) return null
        val nonce = ByteArray(12).also { b.get(it) }
        val body = ByteArray(48).also { b.get(it) }
        return runCatching {
            Cipher.getInstance("AES/GCM/NoPadding").apply { init(Cipher.DECRYPT_MODE, SecretKeySpec(Seal.key(secret, salt, it), "AES"), GCMParameterSpec(128, nonce)) }.doFinal(body)
        }.getOrNull()
    }

    /** Seals [plain] with [dataKey], carrying the ready-made [slots] (passphrase first, then recovery code). */
    fun seal(plain: ByteArray, dataKey: ByteArray, slots: List<ByteArray>): ByteArray {
        require(slots.isNotEmpty() && slots.all { it.size == SLOT_SIZE })
        val nonce = ByteArray(12).also(rng::nextBytes)
        val header = ByteBuffer.allocate(MAGIC.size + 2 + slots.size * SLOT_SIZE + 12).put(MAGIC).put(KIND_WEEKLY).put(slots.size.toByte())
            .apply { slots.forEach { put(it) } }.put(nonce).array()
        val c = Cipher.getInstance("AES/GCM/NoPadding")
        c.init(Cipher.ENCRYPT_MODE, SecretKeySpec(dataKey, "AES"), GCMParameterSpec(128, nonce))
        c.updateAAD(header)
        return header + c.doFinal(plain)
    }

    /** Opens with the passphrase or the recovery code (dashes and case don't matter for the code). */
    fun open(data: ByteArray, secret: CharArray): ByteArray {
        if (data.size < MAGIC.size + 2 || !data.copyOfRange(0, MAGIC.size).contentEquals(MAGIC) || data[MAGIC.size] != KIND_WEEKLY) throw Seal.NotAiimin()
        val n = data[MAGIC.size + 1].toInt()
        val headerLen = MAGIC.size + 2 + n * SLOT_SIZE + 12
        if (n !in 1..4 || data.size < headerLen + 16) throw Seal.NotAiimin()
        val tries = listOf(secret, normalize(String(secret)).toCharArray()).distinctBy { String(it) }
        val key = (0 until n).firstNotNullOfOrNull { i ->
            val s = data.copyOfRange(MAGIC.size + 2 + i * SLOT_SIZE, MAGIC.size + 2 + (i + 1) * SLOT_SIZE)
            tries.firstNotNullOfOrNull { unslot(s, it) }
        } ?: throw Seal.WrongSecret()
        val nonce = data.copyOfRange(headerLen - 12, headerLen)
        val c = Cipher.getInstance("AES/GCM/NoPadding")
        c.init(Cipher.DECRYPT_MODE, SecretKeySpec(key, "AES"), GCMParameterSpec(128, nonce))
        c.updateAAD(data.copyOfRange(0, headerLen))
        return try { c.doFinal(data, headerLen, data.size - headerLen) } catch (_: javax.crypto.AEADBadTagException) { throw Seal.NotAiimin() }
    }

    fun isWeekly(data: ByteArray) = data.size > MAGIC.size && data.copyOfRange(0, MAGIC.size).contentEquals(MAGIC) && data[MAGIC.size] == KIND_WEEKLY
}
