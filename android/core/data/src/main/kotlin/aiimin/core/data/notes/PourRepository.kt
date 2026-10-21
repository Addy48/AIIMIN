package aiimin.core.data.notes

import aiimin.core.data.core.Crypto
import aiimin.core.data.plan.TaskRepository
import aiimin.core.data.util.newId
import aiimin.core.database.PourDao
import aiimin.core.database.PourItemEntity
import aiimin.core.engine.pour.PourTiming
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import java.time.LocalDate
import javax.inject.Inject
import javax.inject.Singleton

/** One of Pour's saved items, decrypted for the screen. [sealed] letters show no text until their date. */
data class PourItem(val id: String, val kind: String, val to: String, val text: String, val status: String, val dueAt: Long?, val createdAt: Long, val sealed: Boolean)

/**
 * Pour's tools that keep something (PRD 12.6): the cooling-off pen, letters never sent and the worry box. Text is
 * encrypted with the journal key; nothing here syncs, is searched, is scored, or is sent anywhere by AIIMIN.
 */
@Singleton
class PourRepository @Inject constructor(
    private val dao: PourDao,
    private val crypto: Crypto,
    private val tasks: TaskRepository,
) {
    fun items(kind: String): Flow<List<PourItem>> = dao.open(kind).map { l -> l.map(::open) }

    private fun open(e: PourItemEntity): PourItem {
        val sealed = e.kind == KIND_LETTER && PourTiming.sealed(e.dueAt?.let { java.time.Instant.ofEpochMilli(it).atZone(java.time.ZoneId.systemDefault()).toLocalDate() }, LocalDate.now())
        return PourItem(
            e.id, e.kind, if (e.toCipher.isEmpty()) "" else crypto.decryptText(e.toCipher, e.toIv),
            if (sealed) "" else crypto.decryptText(e.cipher, e.iv), e.status, e.dueAt, e.createdAt, sealed,
        )
    }

    private suspend fun write(kind: String, to: String, text: String, status: String, dueAt: Long?): String {
        val now = System.currentTimeMillis()
        val (c, iv) = crypto.encryptText(text.trim())
        val (tc, tiv) = if (to.isBlank()) "" to "" else crypto.encryptText(to.trim())
        val id = newId()
        dao.upsert(PourItemEntity(id, kind, tc, tiv, c, iv, status, dueAt, now, now))
        return id
    }

    /** Cooling-off pen: held for 24 hours, then "Still want to send it?". AIIMIN never sends it. */
    suspend fun holdMessage(to: String, text: String): String =
        write(KIND_COOL, to, text, "open", System.currentTimeMillis() + PourTiming.COOL_OFF_HOURS * 3_600_000L)

    /** A letter never sent: kept, or sealed until [until] (start of that day). */
    suspend fun keepLetter(to: String, text: String, until: LocalDate?): String =
        write(KIND_LETTER, to, text, "kept", until?.atStartOfDay(java.time.ZoneId.systemDefault())?.toInstant()?.toEpochMilli())

    suspend fun dropWorry(text: String): String = write(KIND_WORRY, "", text, "open", null)

    /** Control map: "I can act" turns the worry into a task for today and clears it from the box. */
    suspend fun act(id: String, today: LocalDate): String? {
        val e = dao.get(id) ?: return null
        val text = crypto.decryptText(e.cipher, e.iv).lineSequence().firstOrNull { it.isNotBlank() }?.take(120) ?: return null
        val task = tasks.create(text, today, source = "pour")
        dao.deleteNow(id)
        return task
    }

    /** "I can't", "Let go", or a cooling-off message not sent: gone from the phone at once. */
    suspend fun release(id: String) = dao.deleteNow(id)

    /** "Keep it" after the 24 hours: stays, without asking again. */
    suspend fun keep(id: String) {
        dao.get(id)?.let { dao.upsert(it.copy(status = "kept", dueAt = null, updatedAt = System.currentTimeMillis())) }
    }

    /** Cooling-off messages whose 24 hours end today, for the reminder (no text leaves this class). */
    suspend fun coolingDueAt(): List<Pair<String, Long>> = dao.coolingNow().mapNotNull { e -> e.dueAt?.let { e.id to it } }

    companion object {
        const val KIND_COOL = "cool"
        const val KIND_LETTER = "letter"
        const val KIND_WORRY = "worry"
    }
}
