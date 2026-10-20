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
import java.io.File
import java.time.LocalDate
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

/** Something a note can link to with [[ ]] (N3). */
data class LinkTarget(val kind: String, val id: String, val title: String, val subtitle: String)

@Singleton
class LinkSearch @Inject constructor(
    private val notes: NoteDao,
    private val tasks: aiimin.core.database.TaskDao,
    private val docs: aiimin.core.database.VaultDao,
    private val people: aiimin.core.database.FamilyDao,
    private val money: aiimin.core.database.MoneyDao,
) {
    /** Notes, tasks, documents, people and payments matching [q], best matches first. */
    suspend fun find(q: String, excludeNote: String? = null): List<LinkTarget> {
        val like = "%${q.trim()}%"
        val out = mutableListOf<LinkTarget>()
        notes.search(like).filter { it.id != excludeNote && it.title.isNotBlank() }.take(8).forEach { out += LinkTarget("note", it.id, it.title, "Note") }
        tasks.search(like).take(6).forEach { out += LinkTarget("task", it.id, it.title, "Task" + (it.day?.let { d -> " · $d" } ?: " · Someday")) }
        docs.search(like).filter { !it.sensitive }.take(6).forEach { out += LinkTarget("doc", it.id, it.title, "Document · ${it.category}") }
        people.allNow().filter { q.isBlank() || it.name.contains(q.trim(), true) }.filter { it.id != "household" }.take(6).forEach { out += LinkTarget("person", it.id, it.name, it.relation.ifBlank { "Person" }) }
        money.search(like).take(5).forEach { out += LinkTarget("txn", it.id, it.title, "Payment · ${aiimin.core.data.util.Money.whole(it.amountPaise)} · ${it.day}") }
        val ql = q.trim().lowercase()
        return out.sortedBy { if (it.title.lowercase().startsWith(ql)) 0 else 1 }
    }

    /** What a [[Title]] chip opens: a note first, then a task, document, person or payment with that exact title. */
    suspend fun resolve(title: String): LinkTarget? = find(title).firstOrNull { it.title.equals(title.trim(), ignoreCase = true) }
}

/** A note ready to show: a locked note's title and body come back decrypted only through [NoteRepository.open]. */
data class NoteText(val note: NoteEntity, val title: String, val body: String)

/** What a chosen set of files holds, before anything is saved (Part 11.7: a guided import with a preview). */
data class NotesImportPreview(val plan: NoteImport.Plan, val files: Int, val pictures: Map<String, File>)

@Singleton
class NoteRepository @Inject constructor(
    private val dao: NoteDao,
    private val log: EventLogger,
    private val crypto: Crypto,
    @dagger.hilt.android.qualifiers.ApplicationContext private val context: android.content.Context,
    private val ocr: aiimin.core.data.vault.TextExtractor,
) {
    fun all(): Flow<List<NoteEntity>> = dao.all()
    fun archived(): Flow<List<NoteEntity>> = dao.archived()
    fun observe(id: String) = dao.observe(id)
    suspend fun get(id: String) = dao.get(id)

    /** Pictures and scans live here, in the app's private files. */
    val pictureDir: File get() = File(context.filesDir, "notes").apply { mkdirs() }

    /** The note with its real title and body (decrypted when locked). Call only after the person unlocked it. */
    suspend fun open(id: String): NoteText? = dao.get(id)?.let(::textOf)

    fun textOf(n: NoteEntity): NoteText {
        val c = n.cipher
        val iv = n.iv
        if (!n.locked || c == null || iv == null) return NoteText(n, n.title, n.body)
        val plain = crypto.decryptText(c, iv, ALIAS)
        val i = plain.indexOf('\n')
        return NoteText(n, if (i < 0) plain else plain.substring(0, i), if (i < 0) "" else plain.substring(i + 1))
    }

    /**
     * Saves as you type (Part 11 "Reliability"): every other field of the note is kept. A locked note is stored
     * only as ciphertext; its title and body columns stay empty, so search, the widget and notices never see them.
     */
    suspend fun save(id: String?, title: String, body: String, pinned: Boolean = false, source: String = "typed"): String {
        val now = System.currentTimeMillis()
        val existing = id?.let { dao.get(it) }
        val nid = existing?.id ?: id ?: newId()
        val shownTitle = title.trim().ifBlank { body.lineSequence().firstOrNull { it.isNotBlank() }?.take(60)?.trim().orEmpty().ifBlank { "Untitled" } }
        val tags = TAG.findAll(body).map { it.groupValues[1].lowercase() }.distinct().toList()
        val base = existing ?: NoteEntity(id = nid, title = "", body = "", createdAt = now, updatedAt = now, source = source)
        val locked = base.locked
        val (cipher, iv) = if (locked) crypto.encryptText(shownTitle + "\n" + body, ALIAS) else (null to null)
        dao.upsert(
            base.copy(
                title = if (locked) "" else shownTitle, body = if (locked) "" else body,
                tags = Codecs.encodeList(if (locked) emptyList() else tags), pinned = pinned,
                cipher = cipher, iv = iv, updatedAt = now, dirty = true,
            ),
        )
        log.log(if (existing == null) "note.create" else "note.edit", "note", nid)
        return nid
    }

    private suspend fun change(id: String, f: (NoteEntity) -> NoteEntity) {
        dao.get(id)?.let { dao.upsert(f(it).copy(dirty = true, updatedAt = System.currentTimeMillis())) }
    }

    suspend fun setPinned(id: String, pinned: Boolean) = change(id) { it.copy(pinned = pinned) }
    suspend fun setColor(id: String, color: String) = change(id) { it.copy(color = color) }
    suspend fun setArchived(id: String, archived: Boolean) { change(id) { it.copy(archived = archived) }; log.log(if (archived) "note.archive" else "note.unarchive", "note", id) }
    suspend fun setReminder(id: String, at: Long?) { change(id) { it.copy(reminderAt = at) }; log.log("note.remind", "note", id) }

    /** Locks a note: its title and body move into ciphertext under the device key. */
    suspend fun lock(id: String) {
        val n = dao.get(id) ?: return
        if (n.locked) return
        val (cipher, iv) = crypto.encryptText(n.title + "\n" + n.body, ALIAS)
        dao.upsert(n.copy(locked = true, cipher = cipher, iv = iv, title = "", body = "", tags = "[]", dirty = true, updatedAt = System.currentTimeMillis()))
        log.log("note.lock", "note", id)
    }

    suspend fun unlock(id: String) {
        val n = dao.get(id) ?: return
        if (!n.locked) return
        val t = textOf(n)
        val tags = TAG.findAll(t.body).map { it.groupValues[1].lowercase() }.distinct().toList()
        dao.upsert(n.copy(locked = false, cipher = null, iv = null, title = t.title, body = t.body, tags = Codecs.encodeList(tags), dirty = true, updatedAt = System.currentTimeMillis()))
        log.log("note.unlock", "note", id)
    }

    /** A picture or scanned page: copied into the app, read on the phone, kept with its text for search. */
    suspend fun addPicture(id: String, uri: android.net.Uri, mime: String = "image/jpeg"): NoteAttachment? {
        val ext = if (mime == "application/pdf") "pdf" else "jpg"
        val f = File(pictureDir, newId() + "." + ext)
        runCatching { context.contentResolver.openInputStream(uri)?.use { i -> f.outputStream().use { o -> i.copyTo(o) } } }.getOrNull() ?: return null
        val text = ocr.extract(f, if (ext == "pdf") aiimin.core.data.vault.DocKind.PDF else aiimin.core.data.vault.DocKind.IMAGE).trim()
        val a = NoteAttachment(f.name, mime, text.take(4000))
        change(id) { it.copy(attachments = Attachments.encode(Attachments.decode(it.attachments) + a)) }
        log.log("note.picture", "note", id)
        return a
    }

    /** A shared picture as a new note (Part 11.6): the note exists only if the picture could be read in. */
    suspend fun newFromPicture(uri: android.net.Uri, mime: String, title: String, text: String): String? {
        val id = newId()
        val now = System.currentTimeMillis()
        dao.upsert(NoteEntity(id = id, title = title.trim().ifBlank { "Picture" }, body = text, createdAt = now, updatedAt = now, source = "share"))
        if (addPicture(id, uri, mime) == null) { dao.deleteNow(id); return null }
        log.log("note.create", "note", id, mapOf("src" to "share"))
        return id
    }

    suspend fun removePicture(id: String, file: String) {
        change(id) { it.copy(attachments = Attachments.encode(Attachments.decode(it.attachments).filterNot { a -> a.file == file })) }
        File(pictureDir, file).delete()
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

    // ------------------------------------------------------------------ import and export (Part 11.7 Q-1)

    /**
     * Reads the chosen files (a Google Takeout zip, Keep JSON files, Markdown, text, Apple Notes HTML, or an AIIMIN
     * export) and says what would come in. Nothing is saved yet; pictures wait in the cache.
     */
    suspend fun previewImport(uris: List<android.net.Uri>): NotesImportPreview = kotlinx.coroutines.withContext(kotlinx.coroutines.Dispatchers.IO) {
        val texts = ArrayList<Pair<String, ByteArray>>()
        val pictures = HashMap<String, File>()
        val cache = File(context.cacheDir, "notes-import").apply { deleteRecursively(); mkdirs() }
        fun take(name: String, bytes: () -> ByteArray) {
            val base = name.substringAfterLast('/')
            val ext = base.lowercase().substringAfterLast('.')
            when (ext) {
                "json", "md", "markdown", "txt", "html", "htm" -> texts += name to bytes()
                "jpg", "jpeg", "png", "webp", "gif", "pdf" -> { val f = File(cache, newId() + "-" + base.takeLast(40)); f.writeBytes(bytes()); pictures[base] = f }
            }
        }
        for (u in uris) {
            val name = displayName(u)
            if (name.lowercase().endsWith(".zip")) {
                context.contentResolver.openInputStream(u)?.use { input ->
                    java.util.zip.ZipInputStream(input).use { z ->
                        while (true) {
                            val e = z.nextEntry ?: break
                            if (!e.isDirectory) take(e.name) { z.readBytes() }
                        }
                    }
                }
            } else {
                take(name) { context.contentResolver.openInputStream(u)?.use { it.readBytes() } ?: ByteArray(0) }
            }
        }
        val found = NoteImport.pick(texts.map { it.first }).mapNotNull { name ->
            val text = String(texts.first { it.first == name }.second)
            val base = name.substringAfterLast('/')
            if (base.lowercase().endsWith(".json")) KeepTakeout.parse(text, base) else MarkdownNote.parse(base, text)
        }
        val files = found.size
        val plan = NoteImport.plan(found, dao.importKeys().toSet(), dao.ids().toSet())
        NotesImportPreview(plan, files, pictures)
    }

    /** Saves what [previewImport] found; returns how many came in. */
    suspend fun commitImport(p: NotesImportPreview): Int {
        val now = System.currentTimeMillis()
        var n = 0
        for (i in p.plan.fresh) {
            val pics = i.attachments.mapNotNull { name ->
                p.pictures[name.substringAfterLast('/')]?.let { src ->
                    val dst = File(pictureDir, newId() + "." + name.substringAfterLast('.', "jpg"))
                    src.copyTo(dst, overwrite = true)
                    val kind = if (dst.extension.lowercase() == "pdf") aiimin.core.data.vault.DocKind.PDF else aiimin.core.data.vault.DocKind.IMAGE
                    NoteAttachment(dst.name, if (kind == aiimin.core.data.vault.DocKind.PDF) "application/pdf" else "image/jpeg", ocr.extract(dst, kind).trim().take(4000))
                }
            }
            val id = i.id?.takeIf { dao.get(it) == null } ?: newId()
            val tags = TAG.findAll(i.body).map { it.groupValues[1].lowercase() }.distinct().toList()
            val created = i.createdAt ?: now
            val note = NoteEntity(
                id = id, title = i.title.ifBlank { "Untitled" }, body = i.body, tags = Codecs.encodeList(tags), pinned = i.pinned,
                createdAt = created, updatedAt = i.updatedAt ?: created, color = i.color, archived = i.archived,
                source = "import", sourceApp = i.sourceApp, importKey = i.importKey, attachments = Attachments.encode(pics),
            )
            dao.upsert(note)
            if (i.locked) lock(id)
            n++
        }
        File(context.cacheDir, "notes-import").deleteRecursively()
        log.log("note.import", data = mapOf("added" to n, "skipped" to p.plan.already))
        return n
    }

    /** Every kept note as Markdown with front matter, plus its pictures, in one zip; returns how many notes. */
    suspend fun exportAll(target: android.net.Uri): Int = kotlinx.coroutines.withContext(kotlinx.coroutines.Dispatchers.IO) {
        val notes = dao.keptNow()
        context.contentResolver.openOutputStream(target)?.use { out ->
            java.util.zip.ZipOutputStream(out).use { z ->
                val used = HashSet<String>()
                notes.forEach { n ->
                    val t = textOf(n)
                    var name = MarkdownNote.fileName(n, t.title)
                    while (!used.add(name)) name = "x-$name"
                    z.putNextEntry(java.util.zip.ZipEntry(name)); z.write(MarkdownNote.export(n, t.title, t.body).toByteArray()); z.closeEntry()
                    Attachments.decode(n.attachments).forEach { a ->
                        val f = File(pictureDir, a.file)
                        if (f.exists() && used.add(a.file)) { z.putNextEntry(java.util.zip.ZipEntry(a.file)); f.inputStream().use { it.copyTo(z) }; z.closeEntry() }
                    }
                }
            }
        } ?: error("Could not write the file")
        log.log("note.export", data = mapOf("notes" to notes.size))
        notes.size
    }

    private fun displayName(u: android.net.Uri): String =
        runCatching {
            context.contentResolver.query(u, arrayOf(android.provider.OpenableColumns.DISPLAY_NAME), null, null, null)?.use { c -> if (c.moveToFirst()) c.getString(0) else null }
        }.getOrNull() ?: u.lastPathSegment.orEmpty()

    companion object {
        private val TAG = Regex("""(?<![\w#])#([\p{L}\d_\-]{2,30})""")
        private val LINK = Regex("""\[\[([^\[\]]{1,80})]]""")
        /** Device key for locked notes, apart from the journal's. */
        const val ALIAS = "aiimin.notes.v1"
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
                existing?.createdAt ?: now, now, remoteId = existing?.remoteId,
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

/**
 * A note body as one readable line for lists and Today: checkboxes become ✓ / ○,
 * [[links]] show the linked name, bullets lose their dash, lines join with " · ".
 */
fun notePreview(body: String): String = body.lineSequence()
    .map { it.trim() }
    .filter { it.isNotEmpty() }
    .map { line ->
        when {
            line.startsWith("- [x]", ignoreCase = true) -> "✓ " + line.drop(5).trim()
            line.startsWith("- [ ]") -> "○ " + line.drop(5).trim()
            line.startsWith("- ") || line.startsWith("* ") -> line.drop(2).trim()
            else -> line
        }
    }
    .map { it.replace(Regex("""\[\[([^\[\]]{1,80})]]"""), "$1") }
    .joinToString(" · ")
