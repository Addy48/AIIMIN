package aiimin.core.data.vault

import aiimin.core.data.core.Crypto
import aiimin.core.data.core.DayClock
import aiimin.core.data.core.EventLogger
import aiimin.core.data.plan.CalendarRepository
import aiimin.core.data.plan.TaskRepository
import aiimin.core.data.settings.Codecs
import aiimin.core.data.util.newId
import aiimin.core.database.AccessLogEntity
import aiimin.core.database.DocEntity
import aiimin.core.database.DocShareEntity
import aiimin.core.database.EmergencyRequestEntity
import aiimin.core.database.FamilyDao
import aiimin.core.database.PersonEntity
import aiimin.core.database.VaultDao
import aiimin.core.engine.Tier
import aiimin.core.engine.vault.CoverDoc
import aiimin.core.engine.vault.Covers
import aiimin.core.engine.vault.Lifecycle
import aiimin.core.engine.vault.Registry
import aiimin.core.engine.vault.Renewal
import aiimin.core.nlp.DocumentFields
import aiimin.core.privacy.Access
import aiimin.core.privacy.AccessLevel
import aiimin.core.privacy.AccessPolicy
import aiimin.core.privacy.Delegate
import aiimin.core.privacy.EmergencyRequest
import aiimin.core.privacy.EmergencyStatus
import aiimin.core.privacy.HOUSEHOLD
import aiimin.core.privacy.Household
import aiimin.core.privacy.Person
import aiimin.core.privacy.Role
import aiimin.core.privacy.Share
import aiimin.core.privacy.ShareWhen
import aiimin.core.privacy.VaultDoc
import android.content.Context
import android.net.Uri
import android.provider.OpenableColumns
import android.webkit.MimeTypeMap
import dagger.hilt.android.qualifiers.ApplicationContext
import java.io.File
import java.security.MessageDigest
import java.time.Instant
import java.time.LocalDate
import java.time.temporal.ChronoUnit
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.withContext

const val ME = "me"

val DOC_CATEGORIES = listOf("Identity", "Insurance", "Health", "Vehicle", "Finance & Tax", "Property", "Education", "Bills & Warranties", "Legal", "Other")

data class DocView(val doc: DocEntity, val access: Access, val ownerName: String, val shares: List<DocShareEntity>) {
    val daysToExpiry: Long? get() = doc.expires?.let { ChronoUnit.DAYS.between(LocalDate.now(), LocalDate.parse(it)) }
}

/**
 * What a save found. [covers] are current versions of covers this document may renew ("Is this a new version of ...?"),
 * each with what joining would mean (normal, a gap, or a long overlap that asks "Keep both active?").
 */
data class ImportResult(
    val docId: String,
    val duplicateOf: DocEntity?,
    val category: String,
    val expires: LocalDate?,
    val number: String?,
    val typeName: String? = null,
    val covers: List<Pair<DocEntity, Renewal>> = emptyList(),
    /** The registry's usual end, shown as a suggestion when no expiry could be read. */
    val suggestedEnd: LocalDate? = null,
)

private fun String?.day(): LocalDate? = this?.let { runCatching { LocalDate.parse(it) }.getOrNull() }

/** The rules' view of a saved document. */
fun DocEntity.coverDoc() = CoverDoc(id, cover, docType, subject, startsOn.day(), expires.day(), version, current)

/** The lifecycle in force: the person's choice, else the registry's. */
fun DocEntity.life(): Lifecycle? = lifecycle?.let { runCatching { Lifecycle.valueOf(it) }.getOrNull() } ?: Registry.byKey(docType)?.lifecycle

/** Only a cover's current version reminds, and an issued-once document (PAN, Aadhaar) never does. */
fun remindable(docs: List<DocEntity>): List<DocEntity> = docs.filter { !it.deleted && it.current && it.expires != null && it.life() != Lifecycle.A }

@Singleton
class FamilyRepository @Inject constructor(
    private val dao: FamilyDao,
    private val clock: DayClock,
    private val log: EventLogger,
) {
    val people: Flow<List<PersonEntity>> = dao.all()
    val requests = dao.requests()

    /** Who the app is being viewed as — "Preview as Mom" shows exactly what she could see. */
    private val _viewer = MutableStateFlow(ME)
    val viewer: StateFlow<String> = _viewer.asStateFlow()
    fun previewAs(id: String) { _viewer.value = id }

    suspend fun ensureSelf(name: String) {
        if (dao.get(ME) == null) {
            dao.upsert(PersonEntity(ME, name.ifBlank { "You" }, "You", Role.OWNER.name, linked = true, hue = 0, createdAt = System.currentTimeMillis()))
        } else if (name.isNotBlank()) {
            dao.get(ME)?.let { dao.upsert(it.copy(name = name)) }
        }
    }

    suspend fun get(id: String) = dao.get(id)

    suspend fun add(name: String, relation: String, role: Role, invite: Boolean): String {
        val id = newId()
        val count = dao.allNow().size
        dao.upsert(PersonEntity(id, name.trim(), relation.trim(), role.name, pending = invite, hue = count, createdAt = System.currentTimeMillis()))
        log.log("family.add", "person", id, mapOf("role" to role.name, "invite" to invite))
        return id
    }

    suspend fun update(p: PersonEntity) {
        dao.upsert(p)
        log.log("family.edit", "person", p.id)
    }

    suspend fun remove(id: String) {
        if (id == ME) return
        dao.delete(id)
        log.log("family.remove", "person", id)
    }

    /** Elder names a caregiver for chosen categories; consent is dated and renewed yearly. */
    suspend fun setDelegate(ownerId: String, to: String?, cats: Set<String>) {
        val p = dao.get(ownerId) ?: return
        dao.upsert(p.copy(delegateTo = to, delegateCats = Codecs.encodeList(cats.toList()), delegateConsentOn = if (to != null) clock.today().toString() else null))
        log.log("family.delegate", "person", ownerId, mapOf("to" to to, "cats" to cats.toList()), Tier.A)
    }

    suspend fun requestEmergency(ownerId: String, waitHours: Int = 72): String {
        val id = newId()
        dao.upsertRequest(
            EmergencyRequestEntity(
                id, _viewer.value, ownerId, Codecs.encodeList(listOf("Health", "Insurance", "Identity")),
                System.currentTimeMillis(), waitHours, EmergencyStatus.WAITING.name,
            ),
        )
        log.log("emergency.request", "person", ownerId, mapOf("from" to _viewer.value), Tier.A)
        return id
    }

    suspend fun decide(requestId: String, approve: Boolean) {
        val r = dao.requestsNow().firstOrNull { it.id == requestId } ?: return
        val next = AccessPolicy.decide(r.model(), approve, clock.now(), clock.today(), clock.rules.share.emergencyAccessDays)
        dao.upsertRequest(r.copy(status = next.status.name, grantedAt = next.grantedAt?.toEpochMilli(), expiresOn = next.expiresOn?.toString()))
        log.log("emergency.${if (approve) "grant" else "deny"}", "request", requestId, tier = Tier.A)
    }

    /** Advance waits and expire grants. */
    suspend fun tick() {
        val reqs = dao.requestsNow()
        val next = AccessPolicy.tickEmergency(reqs.map { it.model() }, clock.now(), clock.today(), clock.rules.share.emergencyAccessDays)
        reqs.zip(next).filter { (a, b) -> a.status != b.status.name }.forEach { (a, b) ->
            dao.upsertRequest(a.copy(status = b.status.name, grantedAt = b.grantedAt?.toEpochMilli(), expiresOn = b.expiresOn?.toString()))
            log.log("emergency.${b.status.name.lowercase()}", "request", a.id, tier = Tier.A, source = "system")
        }
    }

    suspend fun household(): Household = Household(dao.allNow().map { it.model() }, dao.requestsNow().map { it.model() })

    companion object {
        fun PersonEntity.model() = Person(
            id, name, runCatching { Role.valueOf(role) }.getOrDefault(Role.ADULT), pending,
            delegateTo?.let { Delegate(it, Codecs.decodeList(delegateCats).toSet(), delegateConsentOn?.let(LocalDate::parse) ?: LocalDate.now()) },
        )

        fun EmergencyRequestEntity.model() = EmergencyRequest(
            id, fromId, ownerId, Codecs.decodeList(cats).toSet(), Instant.ofEpochMilli(requestedAt), waitHours,
            runCatching { EmergencyStatus.valueOf(status) }.getOrDefault(EmergencyStatus.WAITING),
            grantedAt?.let(Instant::ofEpochMilli), expiresOn?.let(LocalDate::parse),
        )
    }
}

@Singleton
class VaultRepository @Inject constructor(
    @ApplicationContext private val context: Context,
    private val dao: VaultDao,
    private val family: FamilyRepository,
    private val familyDao: FamilyDao,
    private val extractor: TextExtractor,
    private val crypto: Crypto,
    private val clock: DayClock,
    private val log: EventLogger,
    private val calendar: CalendarRepository,
    private val tasks: TaskRepository,
) {
    private val dir get() = File(context.filesDir, "vault").apply { mkdirs() }

    /** Everything the current viewer may see, with the reason. */
    val visible: Flow<List<DocView>> = combine(dao.all(), dao.shares(), familyDao.all(), familyDao.requests(), family.viewer) { docs, shares, people, reqs, viewer ->
        val home = Household(people.map { with(FamilyRepository) { it.model() } }, reqs.map { with(FamilyRepository) { it.model() } })
        val names = people.associate { it.id to it.name }
        docs.mapNotNull { d ->
            val s = shares.filter { it.docId == d.id }
            val a = access(d, s, viewer, people, home)
            if (a.ok) DocView(d, a, if (d.owner == HOUSEHOLD) "Household" else names[d.owner] ?: "Unknown", s) else null
        }
    }

    /**
     * Profiles without their own account are managed by their creator, so
     * their vault is yours to hold. Linked members get full privacy rules.
     */
    private fun access(d: DocEntity, shares: List<DocShareEntity>, viewer: String, people: List<PersonEntity>, home: Household): Access {
        val owner = people.firstOrNull { it.id == d.owner }
        if (viewer == ME && owner != null && !owner.linked && owner.id != ME) return Access.Granted(AccessLevel.EDIT, Access.Why.OWN_ITEM)
        return AccessPolicy.canSee(d.model(shares), viewer, home, clock.zone.let { LocalDate.now(it) })
    }

    suspend fun get(id: String) = dao.get(id)
    fun observe(id: String) = dao.observe(id)
    fun accessLog(n: Int) = dao.accessLog(n)

    suspend fun import(uri: Uri, owner: String, sensitive: Boolean = false, titleHint: String? = null): ImportResult = withContext(Dispatchers.IO) {
        val cr = context.contentResolver
        val (name, size) = cr.query(uri, null, null, null, null)?.use { c ->
            val ni = c.getColumnIndex(OpenableColumns.DISPLAY_NAME)
            val si = c.getColumnIndex(OpenableColumns.SIZE)
            if (c.moveToFirst()) (if (ni >= 0) c.getString(ni) else null) to (if (si >= 0) c.getLong(si) else -1L) else null to -1L
        } ?: (null to -1L)
        val mime = cr.getType(uri) ?: "application/octet-stream"
        val ext = (name?.substringAfterLast('.', "")?.lowercase()?.takeIf { it.isNotEmpty() && it.length <= 5 }
            ?: MimeTypeMap.getSingleton().getExtensionFromMimeType(mime) ?: "bin")
        val id = newId()
        val tmp = File(context.cacheDir, "import-$id.$ext")
        cr.openInputStream(uri)?.use { input -> tmp.outputStream().use { input.copyTo(it) } } ?: error("Can't read that file")
        importFile(tmp, owner, mime, ext, titleHint ?: name?.substringBeforeLast('.') ?: "Document", sensitive, size, id)
    }

    suspend fun importFile(src: File, owner: String, mime: String, ext: String, title: String, sensitive: Boolean, size: Long = src.length(), presetId: String? = null): ImportResult = withContext(Dispatchers.IO) {
        val id = presetId ?: newId()
        val bytes = src.readBytes()
        val hash = MessageDigest.getInstance("SHA-256").digest(bytes).joinToString("") { "%02x".format(it) }
        val dup = dao.byHash(hash)
        val kind = kindOf(ext, mime)
        val text = extractor.extract(src, kind)
        val fields = DocumentFields.extract(text)
        val category = DocumentFields.guessCategory(title, text).let { if (it == "Other" && kind == DocKind.IMAGE) "Other" else it }
        val dest = File(dir, "$id.$ext${if (sensitive) ".enc" else ""}")
        if (sensitive) {
            val (cipher, iv) = crypto.encrypt(bytes, Crypto.VAULT)
            dest.outputStream().use { it.write(iv); it.write(cipher) }
        } else {
            src.copyTo(dest, overwrite = true)
        }
        val pages = if (kind == DocKind.PDF) extractor.pageCount(src) else 1
        src.delete()
        val type = Registry.detect(title, text)
        val subject = Covers.subjectOf(type, owner, fields.vehicle)
        val starts = Covers.startOf(type, fields.starts, fields.expires)
        val covers = matches(id, owner, type?.key, subject, starts)
        dao.upsert(
            DocEntity(
                id = id, owner = owner, sha256 = hash, title = title.trim().take(120), category = category, mime = mime, ext = ext,
                sizeBytes = if (size > 0) size else bytes.size.toLong(), path = dest.name, encrypted = sensitive, sensitive = sensitive,
                text = if (sensitive) "" else text, expires = fields.expires?.toString(), number = fields.number, vehicle = fields.vehicle,
                pages = pages, createdAt = System.currentTimeMillis(),
                docType = type?.key, subject = subject, startsOn = starts?.toString(), provider = fields.provider,
            ),
        )
        log.log("doc.add", "doc", id, mapOf("owner" to owner, "kind" to kind.name, "sensitive" to sensitive, "type" to type?.key), Tier.A)
        ImportResult(id, dup, category, Covers.expiryFor(type, fields.expires, starts), fields.number, type?.name, covers, if (fields.expires == null) Covers.suggestedEnd(type, starts) else null)
    }

    /**
     * "Is this a new version of ...?" Yes: the document joins [coverId] as its next version and becomes the only
     * current one, so reminders move to it. Keeping both active leaves two covers (rule 2), so nothing is called here.
     */
    suspend fun joinCover(docId: String, coverId: String) {
        val d = dao.get(docId) ?: return
        val versions = dao.cover(coverId).filter { it.id != docId }
        if (versions.isEmpty()) return
        versions.filter { it.current }.forEach { old ->
            dao.upsert(old.copy(current = false))
            calendar.forDoc(old.id).forEach { calendar.delete(it.id) }
            // The old "Renew ..." task is done: the renewal is here.
            tasks.search("Renew ${old.title}").filter { !it.done && it.title == "Renew ${old.title}" }.forEach { tasks.toggle(it.id) }
        }
        dao.upsert(d.copy(coverId = coverId, version = Covers.nextVersion(versions.map { it.coverDoc() }), current = true))
        log.log("doc.version", "doc", docId, mapOf("cover" to coverId), Tier.A)
    }

    fun observeCover(coverId: String) = dao.observeCover(coverId)

    @Volatile private var backfilled = false

    /**
     * Documents saved before covers have no type or subject. Read them once from what was already found in each
     * (title, text, vehicle, expiry), so an older policy can be offered as the cover a new one renews.
     */
    suspend fun backfillCovers() {
        if (backfilled) return
        dao.allNow().filter { it.docType == null && it.coverId == null }.forEach { d ->
            val type = Registry.detect(d.title, d.text) ?: return@forEach
            val f = DocumentFields.extract(d.text)
            dao.upsert(
                d.copy(
                    docType = type.key, subject = Covers.subjectOf(type, d.owner, d.vehicle ?: f.vehicle),
                    startsOn = Covers.startOf(type, f.starts, d.expires.day() ?: f.expires)?.toString(), provider = f.provider,
                    expires = d.expires ?: f.expires?.toString(),
                ),
            )
        }
        backfilled = true
    }

    private suspend fun matches(id: String, owner: String, type: String?, subject: String?, starts: LocalDate?, before: Long = Long.MAX_VALUE): List<Pair<DocEntity, Renewal>> {
        backfillCovers()
        val others = dao.allNow().filter { it.id != id && it.owner == owner && it.createdAt < before }
        return Covers.match(Registry.byKey(type), subject, others.map { it.coverDoc() }).mapNotNull { m ->
            others.firstOrNull { it.id == m.id }?.let { it to Covers.renewal(m.ends, starts) }
        }
    }

    /**
     * Covers an unanswered document may renew (a file shared in from another app lands here without the save sheet).
     * Only older documents count, and a document answered "No, separate" ([keepSeparate]) is never asked again.
     */
    suspend fun candidates(docId: String): List<Pair<DocEntity, Renewal>> {
        val d = dao.get(docId) ?: return emptyList()
        if (d.coverId != null || d.deleted) return emptyList()
        return matches(d.id, d.owner, d.docType, d.subject, d.startsOn.day(), before = d.createdAt)
    }

    /** "No, separate": the document is its own cover, on purpose (coverId set to itself). */
    suspend fun keepSeparate(docId: String) {
        val d = dao.get(docId) ?: return
        if (d.coverId == null) dao.upsert(d.copy(coverId = d.id))
    }

    /** Lifecycle A-E for this document; null goes back to the registry's choice (rule 9). */
    suspend fun setLifecycle(docId: String, life: Lifecycle?) {
        val d = dao.get(docId) ?: return
        dao.upsert(d.copy(lifecycle = life?.name))
        if (life == Lifecycle.A) calendar.forDoc(docId).forEach { calendar.delete(it.id) }
        log.log("doc.lifecycle", "doc", docId, mapOf("life" to life?.name))
    }
    suspend fun coverNow(coverId: String) = dao.cover(coverId)

    /** Rescanning a blurry copy replaces the file inside the same version (rule 5); dates read again only fill blanks. */
    suspend fun replaceFile(docId: String, uri: Uri) = withContext(Dispatchers.IO) {
        val d = dao.get(docId) ?: return@withContext
        val cr = context.contentResolver
        val tmp = File(context.cacheDir, "rescan-$docId")
        cr.openInputStream(uri)?.use { input -> tmp.outputStream().use { input.copyTo(it) } } ?: error("Can't read that file")
        val mime = cr.getType(uri) ?: d.mime
        val ext = MimeTypeMap.getSingleton().getExtensionFromMimeType(mime) ?: d.ext
        val bytes = tmp.readBytes()
        val kind = kindOf(ext, mime)
        val text = extractor.extract(tmp, kind)
        val fields = DocumentFields.extract(text)
        val dest = File(dir, "$docId-r${System.currentTimeMillis()}.$ext${if (d.encrypted) ".enc" else ""}")
        if (d.encrypted) {
            val (cipher, iv) = crypto.encrypt(bytes, Crypto.VAULT)
            dest.outputStream().use { it.write(iv); it.write(cipher) }
        } else {
            tmp.copyTo(dest, overwrite = true)
        }
        val pages = if (kind == DocKind.PDF) extractor.pageCount(tmp) else 1
        tmp.delete()
        File(dir, d.path).takeIf { it.name != dest.name }?.delete()
        dao.upsert(
            d.copy(
                path = dest.name, mime = mime, ext = ext, sizeBytes = bytes.size.toLong(), pages = pages,
                sha256 = MessageDigest.getInstance("SHA-256").digest(bytes).joinToString("") { "%02x".format(it) },
                text = if (d.sensitive) "" else text, number = d.number ?: fields.number, expires = d.expires ?: fields.expires?.toString(),
                startsOn = d.startsOn ?: fields.starts?.toString(), provider = d.provider ?: fields.provider,
            ),
        )
        log.log("doc.rescan", "doc", docId, tier = Tier.A)
    }

    /** Deleting a version keeps the cover; if it was current, the newest one left takes over (rule 8). */
    suspend fun deleteVersion(id: String): DocEntity? {
        val d = dao.get(id) ?: return null
        val rest = dao.cover(d.cover).filter { it.id != id }
        dao.upsert(d.copy(deleted = true))
        if (d.current && rest.none { it.current }) rest.maxByOrNull { it.version }?.let { dao.upsert(it.copy(current = true)) }
        log.log("doc.delete", "doc", id, mapOf("version" to d.version))
        return d
    }

    /** Deleting a whole cover, asked first in the UI. Returns what was removed so it can be undone. */
    suspend fun deleteCover(coverId: String): List<DocEntity> {
        val all = dao.cover(coverId)
        all.forEach { dao.upsert(it.copy(deleted = true)) }
        log.log("doc.delete_cover", "doc", coverId, mapOf("versions" to all.size))
        return all
    }

    suspend fun restoreAll(docs: List<DocEntity>) = docs.forEach { dao.upsert(it.copy(deleted = false)) }

    /** A readable copy for the viewer / share sheet. Sensitive files decrypt to cache. */
    suspend fun fileFor(doc: DocEntity, action: String = "view"): File = withContext(Dispatchers.IO) {
        val f = File(dir, doc.path)
        val out = if (doc.encrypted) {
            val raw = f.readBytes()
            val plain = crypto.decrypt(raw.copyOfRange(12, raw.size), raw.copyOfRange(0, 12), Crypto.VAULT)
            File(context.cacheDir, "view-${doc.id}.${doc.ext}").apply { writeBytes(plain); deleteOnExit() }
        } else {
            f
        }
        val viewer = family.viewer.value
        dao.upsert(doc.copy(openedAt = System.currentTimeMillis()))
        // Every access outside your own vault is logged (plan §8.1, "no silent access").
        if (doc.owner != viewer) dao.log(AccessLogEntity(docId = doc.id, title = doc.title, owner = doc.owner, by = viewer, action = action, at = System.currentTimeMillis()))
        out
    }

    suspend fun edit(doc: DocEntity) {
        dao.upsert(doc)
        log.log("doc.edit", "doc", doc.id)
    }

    suspend fun delete(id: String): DocEntity? {
        val d = dao.get(id) ?: return null
        dao.upsert(d.copy(deleted = true))
        log.log("doc.delete", "doc", id)
        return d
    }

    suspend fun restore(d: DocEntity) {
        // Undoing the delete of a current version makes it current again, alone.
        if (d.current) dao.cover(d.cover).filter { it.id != d.id && it.current }.forEach { dao.upsert(it.copy(current = false)) }
        dao.upsert(d.copy(deleted = false))
    }

    suspend fun setShare(docId: String, who: String, level: AccessLevel, whenKind: String, until: LocalDate? = null) {
        dao.upsertShare(DocShareEntity(docId, who, level.name, whenKind, until?.toString()))
        log.log("doc.share", "doc", docId, mapOf("who" to who, "level" to level.name, "when" to whenKind), Tier.A)
    }

    suspend fun removeShare(docId: String, who: String) {
        dao.deleteShare(docId, who)
        log.log("doc.unshare", "doc", docId, mapOf("who" to who), Tier.A)
    }

    /**
     * Expiry → calendar marker on the day, and optionally a renewal task two
     * weeks earlier. Reminders at 90/60/30/7/0 days come from the rules engine.
     */
    suspend fun setExpiry(docId: String, expires: LocalDate?, renewalTask: Boolean) {
        val d = dao.get(docId) ?: return
        dao.upsert(d.copy(expires = expires?.toString()))
        calendar.forDoc(docId).forEach { calendar.delete(it.id) }
        // Issued once never reminds; an older version leaves reminding to the current one.
        if (expires != null && d.current && d.life() != Lifecycle.A) {
            val l = clock.logical()
            calendar.create("${d.title} expires", l.startOf(expires).toInstant(), l.endOf(expires).toInstant(), allDay = true, source = "vault", docId = docId)
            if (renewalTask) {
                tasks.create("Renew ${d.title}", expires.minusDays(14).coerceAtLeast(clock.today()), notes = "Upload the new document to the vault when it arrives.", source = "vault")
            }
        }
        log.log("doc.expiry", "doc", docId, mapOf("expires" to expires?.toString(), "task" to renewalTask))
    }

    suspend fun expiring(withinDays: Int): List<DocEntity> {
        val today = clock.today()
        return remindable(dao.currentWithExpiry()).filter {
            val days = ChronoUnit.DAYS.between(today, LocalDate.parse(it.expires!!))
            days in -30..withinDays.toLong()
        }
    }

    suspend fun search(q: String) = dao.search("%$q%")

    suspend fun allNow() = dao.allNow()

    companion object {
        fun DocEntity.model(shares: List<DocShareEntity>) = VaultDoc(
            id, owner, category,
            shares.map {
                Share(
                    it.who, runCatching { AccessLevel.valueOf(it.level) }.getOrDefault(AccessLevel.VIEW),
                    when (it.whenKind) {
                        "UNTIL" -> ShareWhen.Until(it.until?.let(LocalDate::parse) ?: LocalDate.MIN)
                        "EMERGENCY" -> ShareWhen.InEmergency
                        "AFTER_DEATH" -> ShareWhen.AfterDeath
                        else -> ShareWhen.Now
                    },
                )
            },
            sensitive,
        )
    }
}

private fun LocalDate.coerceAtLeast(min: LocalDate) = if (this < min) min else this
