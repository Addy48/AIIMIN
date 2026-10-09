package aiimin.core.data.notes

import aiimin.core.data.core.Crypto
import aiimin.core.data.core.DayClock
import aiimin.core.data.core.EventLogger
import aiimin.core.data.life.XpRepository
import aiimin.core.data.settings.Codecs
import aiimin.core.data.util.newId
import aiimin.core.database.JournalDao
import aiimin.core.database.JournalEntity
import aiimin.core.database.MinimumDao
import aiimin.core.database.MinimumTickEntity
import aiimin.core.database.NoteDao
import aiimin.core.database.NoteEntity
import aiimin.core.engine.Tier
import aiimin.core.engine.XpEvent
import java.time.LocalDate
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

@Singleton
class NoteRepository @Inject constructor(
    private val dao: NoteDao,
    private val log: EventLogger,
) {
    fun all(): Flow<List<NoteEntity>> = dao.all()
    fun observe(id: String) = dao.observe(id)
    suspend fun get(id: String) = dao.get(id)

    suspend fun save(id: String?, title: String, body: String, pinned: Boolean = false): String {
        val now = System.currentTimeMillis()
        val existing = id?.let { dao.get(it) }
        val nid = existing?.id ?: newId()
        val tags = TAG.findAll(body).map { it.groupValues[1].lowercase() }.distinct().toList()
        dao.upsert(
            NoteEntity(
                id = nid, title = title.trim().ifBlank { body.lineSequence().firstOrNull()?.take(60).orEmpty().ifBlank { "Untitled" } },
                body = body, tags = Codecs.encodeList(tags), pinned = pinned,
                createdAt = existing?.createdAt ?: now, updatedAt = now, remoteId = existing?.remoteId, dirty = true,
            ),
        )
        log.log(if (existing == null) "note.create" else "note.edit", "note", nid)
        return nid
    }

    suspend fun setPinned(id: String, pinned: Boolean) {
        dao.get(id)?.let { dao.upsert(it.copy(pinned = pinned, dirty = true, updatedAt = System.currentTimeMillis())) }
    }

    suspend fun delete(id: String): NoteEntity? {
        val n = dao.get(id) ?: return null
        dao.upsert(n.copy(deleted = true, dirty = true, updatedAt = System.currentTimeMillis()))
        log.log("note.delete", "note", id)
        return n
    }

    suspend fun restore(n: NoteEntity) = dao.upsert(n.copy(deleted = false, dirty = true, updatedAt = System.currentTimeMillis()))

    /** Notes that link here with [[Title]]. */
    suspend fun backlinks(title: String): List<NoteEntity> = if (title.isBlank()) emptyList() else dao.mentioning("%[[$title]]%")

    /** [[Title]] targets inside a body. */
    fun links(body: String): List<String> = LINK.findAll(body).map { it.groupValues[1].trim() }.distinct().toList()

    suspend fun byTitle(title: String): NoteEntity? = dao.search("%$title%").firstOrNull { it.title.equals(title, ignoreCase = true) }

    suspend fun search(q: String) = dao.search("%$q%")

    companion object {
        private val TAG = Regex("""(?<![\w#])#([\p{L}\d_\-]{2,30})""")
        private val LINK = Regex("""\[\[([^\[\]]{1,80})]]""")
    }
}

data class JournalEntry(
    val id: String,
    val day: LocalDate,
    val text: String,
    val mood: Int?,
    val tags: List<String>,
    val words: Int,
    val qualityOk: Boolean,
    val createdAt: Long,
)

data class JournalSave(val id: String, val qualityOk: Boolean, val words: Int, val xp: Int, val reason: String?)

/**
 * The journal is always private and encrypted with a device key. The
 * assistant never writes here. A quality gate decides score credit; the entry
 * always saves either way.
 */
@Singleton
class JournalRepository @Inject constructor(
    private val dao: JournalDao,
    private val minimums: MinimumDao,
    private val crypto: Crypto,
    private val clock: DayClock,
    private val log: EventLogger,
    private val xp: XpRepository,
) {
    val entries: Flow<List<JournalEntry>> = dao.all().map { list -> list.map(::decrypt) }

    private fun decrypt(e: JournalEntity) = JournalEntry(
        e.id, LocalDate.parse(e.day), crypto.decryptText(e.cipher, e.iv), e.mood, Codecs.decodeList(e.tags), e.words, e.qualityOk, e.createdAt,
    )

    suspend fun save(text: String, mood: Int?, tags: List<String>, editId: String? = null, forYesterday: Boolean = false): JournalSave {
        val day = if (forYesterday) clock.today().minusDays(1) else clock.today()
        val recent = dao.latest(30).filter { it.id != editId }.map { crypto.decryptText(it.cipher, it.iv) }
        val q = quality(text, recent)
        val (cipher, iv) = crypto.encryptText(text)
        val now = System.currentTimeMillis()
        val existing = editId?.let { dao.get(it) }
        val id = existing?.id ?: newId()
        dao.upsert(
            JournalEntity(
                id, existing?.day ?: day.toString(), cipher, iv, mood?.coerceIn(1, 5), Codecs.encodeList(tags), q.words, q.ok,
                existing?.createdAt ?: now, now,
            ),
        )
        log.log("journal.entry", "journal", id, mapOf("words" to q.words, "ok" to q.ok), if (forYesterday) Tier.D else if (q.ok) Tier.B else Tier.C, day = day)
        var award = 0
        if (existing == null && q.ok) {
            award = xp.award(XpEvent.JournalSettled(true)).awarded
            // A journalling minimum, if you have one, is kept by writing.
            minimums.activeNow().firstOrNull { it.name.contains("journal", ignoreCase = true) }?.let { m ->
                if (minimums.tick(m.id, day.toString())?.done != true) {
                    minimums.upsertTick(MinimumTickEntity(m.id, day.toString(), true, null, 1, forYesterday, now))
                }
            }
        }
        return JournalSave(id, q.ok, q.words, award, q.reason)
    }

    suspend fun delete(id: String) {
        dao.get(id)?.let { dao.upsert(it.copy(deleted = true, dirty = true)) }
        log.log("journal.delete", "journal", id)
    }

    data class Quality(val words: Int, val ok: Boolean, val reason: String?)

    /** 40+ words, varied, real words, and not a near-copy of a recent entry. */
    fun quality(text: String, recent: List<String>): Quality {
        val words = text.trim().split(Regex("\\s+")).filter { it.isNotBlank() }
        val n = words.size
        if (n < 40) return Quality(n, false, "${40 - n} more words to count toward today")
        val unique = words.map { it.lowercase() }.toSet().size.toDouble() / n
        val vowelish = words.count { Regex("[aeiouAEIOU]").containsMatchIn(it) || !Regex("[a-zA-Z]").containsMatchIn(it) }.toDouble() / n
        fun shingles(s: String): Set<String> {
            val w = s.lowercase().split(Regex("\\s+")).filter { it.isNotBlank() }
            return (0 until (w.size - 2).coerceAtLeast(0)).map { w.subList(it, it + 3).joinToString(" ") }.toSet()
        }
        val me = shingles(text)
        val sim = recent.maxOfOrNull { other ->
            val o = shingles(other)
            val inter = me.count { it in o }
            val uni = me.size + o.size - inter
            if (uni == 0) 0.0 else inter.toDouble() / uni
        } ?: 0.0
        return when {
            sim >= 0.8 -> Quality(n, false, "Too close to an earlier entry")
            unique < 0.45 -> Quality(n, false, "Lots of repeated words")
            vowelish < 0.6 -> Quality(n, false, "Doesn't read like sentences")
            else -> Quality(n, true, null)
        }
    }
}
