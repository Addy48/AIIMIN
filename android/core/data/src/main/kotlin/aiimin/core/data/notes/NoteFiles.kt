package aiimin.core.data.notes

import aiimin.core.data.settings.Codecs
import aiimin.core.database.NoteEntity
import java.security.MessageDigest
import java.time.Instant
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.booleanOrNull
import kotlinx.serialization.json.contentOrNull
import kotlinx.serialization.json.jsonArray
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive
import kotlinx.serialization.json.longOrNull

/** A picture or scan kept with a note, and the text read from it on the phone (Part 11 "Content"). */
@Serializable
data class NoteAttachment(val file: String, val mime: String = "image/jpeg", val text: String = "")

object Attachments {
    private val json = Json { ignoreUnknownKeys = true }
    fun decode(s: String): List<NoteAttachment> = runCatching { json.decodeFromString<List<NoteAttachment>>(s) }.getOrDefault(emptyList())
    fun encode(l: List<NoteAttachment>): String = json.encodeToString(l)
}

/** One note found in a file being brought in, before it is saved. */
data class ImportedNote(
    val title: String,
    val body: String,
    val pinned: Boolean = false,
    val archived: Boolean = false,
    val color: String = "",
    val locked: Boolean = false,
    val createdAt: Long? = null,
    val updatedAt: Long? = null,
    /** Same note, same key: a second import adds nothing twice. */
    val importKey: String,
    /** keep · apple · file · aiimin */
    val sourceApp: String,
    /** File names next to the note in the export (pictures). */
    val attachments: List<String> = emptyList(),
    /** An AIIMIN export keeps the note's own id, so re-importing on a new phone gives the same note. */
    val id: String? = null,
    /** A reminder the note had when it was saved out. */
    val reminderAt: Long? = null,
)

internal fun sha1(s: String): String = MessageDigest.getInstance("SHA-1").digest(s.toByteArray()).joinToString("") { "%02x".format(it) }.take(20)

/** Labels and #tags share one form: lower case, spaces as dashes ("Weekly shop" → weekly-shop). */
fun tagOf(label: String): String = label.trim().lowercase().replace(Regex("""\s+"""), "-").replace(Regex("""[^\p{L}\d_\-]"""), "").take(30)

/**
 * Google Keep in a Takeout export (11.2): one JSON file per note with title, text or list items, labels, pin,
 * archive, colour and microsecond timestamps. Trashed notes and files that are not notes give null.
 */
object KeepTakeout {
    private val json = Json { ignoreUnknownKeys = true; isLenient = true }

    /** Keep's twelve colours onto AIIMIN's five tints (no red in AIIMIN). */
    private val COLORS = mapOf(
        "RED" to "peach", "ORANGE" to "peach", "PINK" to "peach", "YELLOW" to "sun", "GREEN" to "leaf", "TEAL" to "leaf",
        "BLUE" to "lilac", "CERULEAN" to "lilac", "DARK_BLUE" to "lilac", "PURPLE" to "lilac", "BROWN" to "stone", "GRAY" to "stone",
    )

    fun parse(text: String, fileName: String): ImportedNote? {
        val o = runCatching { json.parseToJsonElement(text).jsonObject }.getOrNull() ?: return null
        if (o.bool("isTrashed")) return null
        val list = o["listContent"]?.let { runCatching { it.jsonArray }.getOrNull() }
        val content = o.str("textContent")
        if (list == null && content == null && o.str("title") == null) return null
        val main = list?.joinToString("\n") { item ->
            val i = item.jsonObject
            (if (i.bool("isChecked")) "- [x] " else "- [ ] ") + i.str("text").orEmpty().replace("\n", " ")
        } ?: content.orEmpty()
        val labels = o["labels"]?.let { runCatching { it.jsonArray }.getOrNull() }.orEmpty()
            .mapNotNull { it.jsonObject.str("name")?.let(::tagOf)?.takeIf(String::isNotEmpty) }.distinct()
        val body = listOf(main.trimEnd(), labels.joinToString(" ") { "#$it" }).filter { it.isNotEmpty() }.joinToString("\n\n")
        val title = o.str("title")?.trim()?.ifEmpty { null }
            ?: main.lineSequence().map { it.removePrefix("- [x] ").removePrefix("- [ ] ").trim() }.firstOrNull { it.isNotEmpty() }?.take(60)
            ?: fileName.substringBeforeLast('.')
        val created = o.long("createdTimestampUsec")?.div(1000)
        val edited = o.long("userEditedTimestampUsec")?.div(1000)
        val files = o["attachments"]?.let { runCatching { it.jsonArray }.getOrNull() }.orEmpty().mapNotNull { it.jsonObject.str("filePath") }
        return ImportedNote(
            title = title, body = body, pinned = o.bool("isPinned"), archived = o.bool("isArchived"),
            color = COLORS[o.str("color").orEmpty()] ?: "", createdAt = created, updatedAt = edited ?: created,
            importKey = "keep:" + sha1(o.str("title").orEmpty() + "|" + o.long("createdTimestampUsec") + "|" + main),
            sourceApp = "keep", attachments = files,
        )
    }

    private fun JsonObject.str(k: String) = this[k]?.let { runCatching { it.jsonPrimitive.contentOrNull }.getOrNull() }
    private fun JsonObject.bool(k: String) = this[k]?.let { runCatching { it.jsonPrimitive.booleanOrNull }.getOrNull() } ?: false
    private fun JsonObject.long(k: String) = this[k]?.let { runCatching { it.jsonPrimitive.longOrNull }.getOrNull() }
}

/** An Apple Notes HTML export (or any simple HTML) as plain lines; lists keep their dashes. */
fun htmlToText(html: String): String {
    val s = html
        .replace(Regex("""(?is)<(script|style|head)[^>]*>.*?</\1>"""), "")
        .replace(Regex("""(?i)<br\s*/?>"""), "\n")
        .replace(Regex("""(?i)</(div|p|h[1-6]|li|tr)>"""), "\n")
        .replace(Regex("""(?i)<li[^>]*>"""), "- ")
        .replace(Regex("""<[^>]+>"""), "")
        .replace("&nbsp;", " ").replace("&lt;", "<").replace("&gt;", ">").replace("&quot;", "\"").replace("&#39;", "'").replace("&amp;", "&")
    return s.lines().map { it.trimEnd() }.joinToString("\n").replace(Regex("""\n{3,}"""), "\n\n").trim()
}

/** Markdown and text files in and out; AIIMIN's own export carries a small front matter so nothing is lost. */
object MarkdownNote {
    fun parse(fileName: String, text: String): ImportedNote {
        val lower = fileName.lowercase()
        val name = fileName.substringAfterLast('/').substringBeforeLast('.')
        if (text.startsWith("---\n")) {
            val end = text.indexOf("\n---\n", 4)
            if (end > 0) return fromFrontMatter(text.substring(4, end), text.substring(end + 5), fileName)
        }
        val isHtml = lower.endsWith(".html") || lower.endsWith(".htm")
        val plain = (if (isHtml) htmlToText(text) else text).replace("\r\n", "\n")
        val lines = plain.lines()
        val first = lines.indexOfFirst { it.isNotBlank() }
        val heading = lines.getOrNull(first)?.takeIf { it.startsWith("# ") }?.removePrefix("# ")?.trim()
        val (title, body) = when {
            heading != null -> heading to lines.drop(first + 1).joinToString("\n").trim('\n')
            isHtml && first >= 0 -> lines[first].trim().take(60) to lines.drop(first + 1).joinToString("\n").trim('\n')
            else -> name to plain.trim('\n')
        }
        return ImportedNote(
            title = title.ifBlank { name }, body = body, importKey = "file:" + sha1(fileName.substringAfterLast('/') + "|" + text),
            sourceApp = if (isHtml) "apple" else "file",
        )
    }

    private fun fromFrontMatter(fm: String, body: String, fileName: String): ImportedNote {
        val m = fm.lines().mapNotNull { l -> l.indexOf(": ").takeIf { it > 0 }?.let { l.substring(0, it).trim() to l.substring(it + 2).trim() } }.toMap()
        fun time(k: String) = m[k]?.let { runCatching { Instant.parse(it).toEpochMilli() }.getOrNull() }
        val id = m["id"]
        return ImportedNote(
            title = m["title"].orEmpty().ifBlank { fileName.substringBeforeLast('.') }, body = body,
            pinned = m["pinned"] == "true", archived = m["archived"] == "true", color = m["color"].orEmpty(), locked = m["locked"] == "true",
            createdAt = time("created"), updatedAt = time("updated"),
            importKey = if (id != null) "aiimin:$id" else "file:" + sha1(fileName + "|" + body),
            sourceApp = if (id != null) "aiimin" else "file", id = id,
            attachments = m["attachments"]?.split(',')?.map { it.trim() }?.filter { it.isNotEmpty() }.orEmpty(),
            reminderAt = time("remind"),
        )
    }

    /** One note as Markdown with front matter; [title] and [body] are given when the stored ones are locked away. */
    fun export(n: NoteEntity, title: String = n.title, body: String = n.body): String = buildString {
        append("---\n")
        append("id: ").append(n.id).append('\n')
        append("title: ").append(title.replace("\n", " ")).append('\n')
        if (n.pinned) append("pinned: true\n")
        if (n.archived) append("archived: true\n")
        if (n.locked) append("locked: true\n")
        if (n.color.isNotEmpty()) append("color: ").append(n.color).append('\n')
        append("created: ").append(Instant.ofEpochMilli(n.createdAt)).append('\n')
        append("updated: ").append(Instant.ofEpochMilli(n.updatedAt)).append('\n')
        n.reminderAt?.let { append("remind: ").append(Instant.ofEpochMilli(it)).append('\n') }
        val files = Attachments.decode(n.attachments).map { it.file }
        if (files.isNotEmpty()) append("attachments: ").append(files.joinToString(", ")).append('\n')
        append("---\n")
        append(body)
    }

    fun fileName(n: NoteEntity, title: String = n.title): String {
        val safe = title.replace(Regex("""[^\p{L}\d \-]"""), " ").replace(Regex("""\s+"""), " ").trim().take(60).ifEmpty { "Note" }
        return "$safe-${n.id.take(8)}.md"
    }
}

/** What a chosen set of files would bring in: new notes, and how many are already here. */
object NoteImport {
    data class Plan(val fresh: List<ImportedNote>, val already: Int)

    /**
     * Which files to read as notes. Google Takeout puts an HTML twin beside each Keep JSON and adds a Labels.txt;
     * in a folder that has Keep JSON, those are left out, so one note is one note.
     */
    fun pick(paths: List<String>): List<String> {
        val json = paths.filter { it.lowercase().endsWith(".json") }.map { it.substringBeforeLast('.') }.toSet()
        val keepDirs = paths.filter { it.lowercase().endsWith(".json") }.map { it.substringBeforeLast('/', "") }.toSet()
        return paths.filter { p ->
            val lower = p.lowercase()
            val dir = p.substringBeforeLast('/', "")
            when {
                lower.endsWith(".json") -> true
                (lower.endsWith(".html") || lower.endsWith(".htm")) && p.substringBeforeLast('.') in json -> false
                p.substringAfterLast('/') == "Labels.txt" && dir in keepDirs -> false
                else -> true
            }
        }
    }

    fun plan(found: List<ImportedNote>, existingKeys: Set<String>, existingIds: Set<String>): Plan {
        val seen = HashSet<String>()
        val fresh = found.filter { n -> n.importKey !in existingKeys && (n.id == null || n.id !in existingIds) && seen.add(n.importKey) }
        return Plan(fresh, found.size - fresh.size)
    }
}

object Checklist {
    private fun isCheck(l: String) = l.startsWith("- [ ]") || l.startsWith("- [x]", ignoreCase = true)
    private fun isDone(l: String) = l.startsWith("- [x]", ignoreCase = true)

    /** In each run of checklist lines, open items first and done ones after, each keeping its order. */
    fun moveDoneToBottom(body: String): String {
        val out = ArrayList<String>()
        val run = ArrayList<String>()
        fun flush() { out += run.filterNot(::isDone); out += run.filter(::isDone); run.clear() }
        body.split("\n").forEach { l -> if (isCheck(l)) run += l else { flush(); out += l } }
        flush()
        return out.joinToString("\n")
    }

    /** Drag to reorder: the item at [from] lands at [to]. */
    fun <T> move(items: List<T>, from: Int, to: Int): List<T> {
        if (from !in items.indices) return items
        val l = items.toMutableList()
        val x = l.removeAt(from)
        l.add(to.coerceIn(0, l.size), x)
        return l
    }
}

/** Search and filters on the list (Part 11 "Find"): a locked note matches nothing but an empty search. */
object NoteSearch {
    fun filter(notes: List<NoteEntity>, q: String, tag: String?, color: String?): List<NoteEntity> = notes.filter { n ->
        val words = q.trim()
        if (n.locked) return@filter words.isEmpty() && tag == null && color == null
        (tag == null || tag in Codecs.decodeList(n.tags)) &&
            (color == null || n.color == color) &&
            (words.isEmpty() || n.title.contains(words, true) || n.body.contains(words, true) || Attachments.decode(n.attachments).any { it.text.contains(words, true) })
    }
}

/**
 * "Sort it" (Part 11 "Links to the rest", 4.6 move 5): lines of a note that read clearly as a task, an event or a
 * payment, offered as chips to file with the "+" sheet. Clear patterns only; nothing leaves the phone.
 */
object SortIt {
    data class Chip(val line: String, val kind: aiimin.core.nlp.Kind, val label: String)

    private val KINDS = setOf(aiimin.core.nlp.Kind.TASK, aiimin.core.nlp.Kind.EVENT, aiimin.core.nlp.Kind.EXPENSE, aiimin.core.nlp.Kind.INCOME)

    fun chips(body: String, now: java.time.LocalDateTime = java.time.LocalDateTime.now()): List<Chip> = body.lines()
        .map { it.trim().removePrefix("- [ ] ").removePrefix("- [x] ").removePrefix("- ").trim() }
        .filter { it.length in 4..140 && !it.startsWith("#") }
        .mapNotNull { line ->
            val items = aiimin.core.nlp.CaptureEngine.analyze(line, now).items
            val one = items.singleOrNull() ?: return@mapNotNull null
            if (one.kind !in KINDS || one.confidence < 0.6) return@mapNotNull null
            if (one.kind in setOf(aiimin.core.nlp.Kind.EXPENSE, aiimin.core.nlp.Kind.INCOME) && one.paise == null) return@mapNotNull null
            if (one.kind in setOf(aiimin.core.nlp.Kind.TASK, aiimin.core.nlp.Kind.EVENT) && one.date == null && one.time24 == null) return@mapNotNull null
            Chip(line, one.kind, one.label.ifBlank { line })
        }
        .distinctBy { it.line }
        .take(8)
}
