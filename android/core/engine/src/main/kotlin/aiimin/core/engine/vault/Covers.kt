package aiimin.core.engine.vault

import java.time.LocalDate
import java.time.temporal.ChronoUnit

/**
 * Document covers (PRD Part 5 Phase 1, decided in 4.x "Document versions"). A cover is a document type plus its
 * subject (a person, a vehicle, a property or an account), never a policy number or an insurer. Each policy or
 * copy is a version inside it; the reminder follows the current version only.
 */
enum class Lifecycle(val label: String) {
    /** Issued once: no expiry reminder; a new copy is an update kept in History. */
    A("Issued once"),
    /** Renewed, same person or thing: the newest one counts. */
    B("Renewed"),
    /** A period contract whose provider can change: timeline, gap and overlap checks. */
    C("Contract"),
    /** Period records: never versions, grouped by year. */
    D("Record"),
    /** Belongs to an asset page (car, home). */
    E("Asset paper"),
}

enum class Subject { PERSON, VEHICLE, PROPERTY, ACCOUNT }

data class DocType(
    val key: String,
    val name: String,
    val lifecycle: Lifecycle,
    val subject: Subject,
    /** A suggested validity; a date read from the document always wins. */
    val validityMonths: Int?,
    /** Days before expiry for reminders; empty for type A. */
    val leadDays: List<Int>,
    val words: List<String>,
    val source: String,
)

/** The built-in registry (the India pack). Data, not code: one line per document type. */
object Registry {
    val INDIA: List<DocType> by lazy { parse(Registry::class.java.getResourceAsStream("/aiimin/core/engine/vault/india.tsv")!!.bufferedReader().readText()) }

    fun parse(tsv: String): List<DocType> = tsv.lineSequence().filter { it.isNotBlank() && !it.startsWith("#") }.map { line ->
        val f = line.split('\t')
        val life = Lifecycle.valueOf(f[2])
        DocType(
            key = f[0], name = f[1], lifecycle = life, subject = Subject.valueOf(f[3].uppercase()),
            validityMonths = f[4].toIntOrNull(),
            leadDays = if (life == Lifecycle.A || life == Lifecycle.D) emptyList() else f[5].split(',').mapNotNull { it.trim().toIntOrNull() },
            words = f[6].split('|').map { it.trim().lowercase() }.filter { it.isNotEmpty() },
            source = f.getOrNull(7).orEmpty(),
        )
    }.toList()

    fun byKey(key: String?): DocType? = key?.let { k -> INDIA.firstOrNull { it.key == k } }

    /**
     * The document's type from its title and read text. The longest matching phrase wins, so "two wheeler package
     * policy" is a two-wheeler policy, not a car one; short words (pan, rx, puc, itr) must stand alone.
     */
    fun detect(title: String, text: String = "", types: List<DocType> = INDIA): DocType? {
        val hay = " " + (title + " " + text).lowercase().replace(Regex("[^a-z0-9.&+ -]"), " ").replace(Regex("\\s+"), " ") + " "
        var best: Pair<DocType, Int>? = null
        for (t in types) for (w in t.words) {
            val hit = if (w.length <= 4) hay.contains(" $w ") else hay.contains(w)
            if (hit && (best == null || w.length > best.second)) best = t to w.length
        }
        return best?.first
    }
}

/** One version inside a cover, as the rules need it. */
data class CoverVersion(val id: String, val version: Int, val starts: LocalDate?, val ends: LocalDate?, val current: Boolean)

/** What saving a document next to an existing cover means (conflict rules 3 and 4). */
sealed interface Renewal {
    /** Starts as the old one ends, or a normal early renewal (under 30 days of overlap). */
    data object Normal : Renewal
    /** "N days without cover". */
    data class Gap(val days: Long) : Renewal
    /** Overlap over 30 days: "Keep both active?". */
    data class AskBoth(val overlapDays: Long) : Renewal
}

/** A saved document as the cover rules see it. [coverId] is the document's own id until it joins another cover. */
data class CoverDoc(
    val id: String,
    val coverId: String,
    val type: String?,
    val subject: String?,
    val starts: LocalDate?,
    val ends: LocalDate?,
    val version: Int,
    val current: Boolean,
)

/** One timeline row; [before] is the gap or overlap against the older version below it. */
data class TimelineRow(val doc: CoverDoc, val before: Renewal?)

enum class AssetKind { VEHICLE, HOME }

/** An asset page groups one car's or one home's papers (lifecycle E and everything with that subject). */
data class Asset(val key: String, val kind: AssetKind)

object Covers {
    const val OVERLAP_ASK_DAYS = 30L

    /** Identity is type + subject (rule 1). Records (D) never become versions. */
    fun sameCover(type: DocType?, subjectA: String?, otherType: String?, subjectB: String?): Boolean =
        type != null && type.lifecycle != Lifecycle.D && type.key == otherType && norm(subjectA) != null && norm(subjectA) == norm(subjectB)

    /** Vehicle numbers compare without spaces or dashes; people and places compare by id, case-blind. */
    fun norm(s: String?): String? = s?.uppercase()?.replace(Regex("[^A-Z0-9]"), "")?.ifEmpty { null }

    /** Start of a version: read from it, or its end minus the type's usual length plus one day. */
    fun startOf(type: DocType?, starts: LocalDate?, ends: LocalDate?): LocalDate? =
        starts ?: ends?.let { e -> type?.validityMonths?.let { e.minusMonths(it.toLong()).plusDays(1) } }

    fun renewal(oldEnds: LocalDate?, newStarts: LocalDate?): Renewal {
        if (oldEnds == null || newStarts == null) return Renewal.Normal
        val gap = ChronoUnit.DAYS.between(oldEnds, newStarts) - 1
        if (gap > 0) return Renewal.Gap(gap)
        val overlap = ChronoUnit.DAYS.between(newStarts, oldEnds)
        return if (overlap > OVERLAP_ASK_DAYS) Renewal.AskBoth(overlap) else Renewal.Normal
    }

    /** Only the current version reminds, and an issued-once document never does (Done when, rule 4). */
    fun reminds(type: DocType?, v: CoverVersion): Boolean = v.current && v.ends != null && type?.lifecycle != Lifecycle.A

    /** Lapsed shows (in the warn colour: the brand has no red) for renewed things and contracts only (rule 6). */
    fun lapsed(type: DocType?, ends: LocalDate?, today: LocalDate): Boolean =
        ends != null && ends.isBefore(today) && (type?.lifecycle == Lifecycle.B || type?.lifecycle == Lifecycle.C)

    /** The subject a document belongs to: a vehicle by its number, a place by its owner's home, else the owner. */
    fun subjectOf(type: DocType?, owner: String, vehicle: String?): String? = when (type?.subject) {
        null -> null
        Subject.VEHICLE -> norm(vehicle)
        Subject.PROPERTY -> "home:$owner"
        Subject.PERSON, Subject.ACCOUNT -> owner
    }

    /** Current versions of covers the new document could belong to ("Is this a new version of ...?"). */
    fun match(type: DocType?, subject: String?, docs: List<CoverDoc>): List<CoverDoc> {
        if (type == null) return emptyList()
        return docs.filter { it.current && sameCover(type, subject, it.type, it.subject) }.distinctBy { it.coverId }
    }

    /** Newest first; each row knows the gap or overlap from the version before it. */
    fun timeline(versions: List<CoverDoc>): List<TimelineRow> {
        val sorted = versions.sortedWith(compareByDescending<CoverDoc> { it.version }.thenByDescending { it.starts })
        return sorted.mapIndexed { i, d -> TimelineRow(d, sorted.getOrNull(i + 1)?.let { older -> renewal(older.ends, d.starts) }) }
    }

    fun nextVersion(versions: List<CoverDoc>): Int = (versions.maxOfOrNull { it.version } ?: 0) + 1

    /** The end date to use: only one read from the document; the registry's length is a suggestion the person confirms. */
    fun expiryFor(type: DocType?, read: LocalDate?, starts: LocalDate?): LocalDate? = read

    /** "Usually 1 year": the start plus the type's usual length, shown for the person to accept. */
    fun suggestedEnd(type: DocType?, starts: LocalDate?): LocalDate? =
        if (starts == null || type?.validityMonths == null || type.lifecycle == Lifecycle.A || type.lifecycle == Lifecycle.D) null
        else starts.plusMonths(type.validityMonths.toLong()).minusDays(1)

    fun assetOf(type: DocType?, subject: String?): Asset? = when {
        subject == null -> null
        type?.subject == Subject.VEHICLE -> Asset(subject, AssetKind.VEHICLE)
        type?.subject == Subject.PROPERTY -> Asset(subject, AssetKind.HOME)
        else -> null
    }

    /** The words for a gap or overlap, free of guilt words. */
    fun say(r: Renewal): String? = when (r) {
        Renewal.Normal -> null
        is Renewal.Gap -> "${r.days} ${if (r.days == 1L) "day" else "days"} without cover"
        is Renewal.AskBoth -> "These overlap by ${r.overlapDays} days. Keep both active?"
    }
}
