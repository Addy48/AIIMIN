package aiimin.core.data.vault

import aiimin.core.data.core.Crypto
import aiimin.core.data.core.EventLogger
import aiimin.core.data.util.newId
import aiimin.core.database.DocEntity
import aiimin.core.database.FamilyDao
import aiimin.core.database.PersonEntity
import aiimin.core.database.VaultDao
import aiimin.core.engine.Tier
import android.content.Context
import android.content.Intent
import android.graphics.Paint
import android.graphics.Typeface
import android.graphics.pdf.PdfDocument
import android.net.Uri
import android.provider.DocumentsContract
import dagger.hilt.android.qualifiers.ApplicationContext
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
import java.io.File
import java.nio.ByteBuffer
import java.security.SecureRandom
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.util.Locale
import java.util.zip.ZipEntry
import java.util.zip.ZipInputStream
import java.util.zip.ZipOutputStream
import javax.crypto.Cipher
import javax.crypto.SecretKeyFactory
import javax.crypto.spec.GCMParameterSpec
import javax.crypto.spec.PBEKeySpec
import javax.crypto.spec.SecretKeySpec
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject

/**
 * The `.aiimin` container used for vault backups (VB1) and emergency kits (EK1).
 *
 * Layout: "AIIMIN1" · kind byte · salt (16) · iterations (int) · nonce (12) · AES-256-GCM ciphertext.
 * The key comes from the passphrase or kit code with PBKDF2-HMAC-SHA256 at 600,000 iterations
 * (the platform has no Argon2id; this is the OWASP 2023 setting for PBKDF2). The header is bound
 * as associated data, so a changed header fails to open.
 */
object Seal {
    private val MAGIC = "AIIMIN1".toByteArray()
    const val KIND_BACKUP: Byte = 1
    const val KIND_KIT: Byte = 2
    const val ITERATIONS = 600_000
    private val rng = SecureRandom()

    fun key(secret: CharArray, salt: ByteArray, iterations: Int): ByteArray =
        SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256").generateSecret(PBEKeySpec(secret, salt, iterations, 256)).encoded

    fun seal(plain: ByteArray, secret: CharArray, kind: Byte, iterations: Int = ITERATIONS): ByteArray {
        val salt = ByteArray(16).also(rng::nextBytes)
        val nonce = ByteArray(12).also(rng::nextBytes)
        val header = ByteBuffer.allocate(MAGIC.size + 1 + 16 + 4 + 12).put(MAGIC).put(kind).put(salt).putInt(iterations).put(nonce).array()
        val c = Cipher.getInstance("AES/GCM/NoPadding")
        c.init(Cipher.ENCRYPT_MODE, SecretKeySpec(key(secret, salt, iterations), "AES"), GCMParameterSpec(128, nonce))
        c.updateAAD(header)
        return header + c.doFinal(plain)
    }

    class WrongSecret : Exception("That code or passphrase doesn't open this file")
    class NotAiimin : Exception("This isn't an AIIMIN backup or kit")

    fun kindOf(data: ByteArray): Byte? =
        if (data.size > MAGIC.size + 1 && data.copyOfRange(0, MAGIC.size).contentEquals(MAGIC)) data[MAGIC.size] else null

    fun open(data: ByteArray, secret: CharArray): ByteArray {
        val headerLen = MAGIC.size + 1 + 16 + 4 + 12
        if (data.size < headerLen + 16 || !data.copyOfRange(0, MAGIC.size).contentEquals(MAGIC)) throw NotAiimin()
        val b = ByteBuffer.wrap(data)
        b.position(MAGIC.size + 1)
        val salt = ByteArray(16).also { b.get(it) }
        val iterations = b.int
        if (iterations !in 100_000..5_000_000) throw NotAiimin()
        val nonce = ByteArray(12).also { b.get(it) }
        val c = Cipher.getInstance("AES/GCM/NoPadding")
        c.init(Cipher.DECRYPT_MODE, SecretKeySpec(key(secret, salt, iterations), "AES"), GCMParameterSpec(128, nonce))
        c.updateAAD(data.copyOfRange(0, headerLen))
        return try { c.doFinal(data, headerLen, data.size - headerLen) } catch (_: javax.crypto.AEADBadTagException) { throw WrongSecret() }
    }

    private const val ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789" // no 0/O, 1/I

    /** 30 characters from a 32-symbol alphabet (150 bits), shown as six groups of five. */
    fun newCode(): String = (1..30).map { ALPHABET[rng.nextInt(ALPHABET.length)] }.chunked(5).joinToString("-") { it.joinToString("") }

    /** Accepts the code typed with spaces, lower case or without dashes. */
    fun normalizeCode(typed: String): String =
        typed.uppercase().filter { it in ALPHABET }.chunked(5).joinToString("-")
}

data class BackupHealth(
    val lastAt: Long?,
    val where: String?,
    val folderSet: Boolean,
    val docs: Int,
    /** Weekly automatic backup is set up (passphrase and recovery code chosen, key wrapped on this phone). */
    val weekly: Boolean = false,
    /** When the last weekly write could not be saved, and why; cleared by the next good one. */
    val failAt: Long? = null,
    val failWhy: String? = null,
) {
    val overdue: Boolean get() = docs > 0 && (lastAt == null || System.currentTimeMillis() - lastAt > 14 * 86_400_000L)
}

data class Kit(val id: String, val to: String, val docIds: List<String>, val createdAt: Long) {
    val dueForRefresh: Boolean get() = System.currentTimeMillis() - createdAt > 90 * 86_400_000L
}

data class RestoreResult(val docs: Int, val skipped: Int, val people: Int, val from: String?)

/**
 * Vault backups to a place the person picks (their own Google Drive, USB, SD card or a phone
 * folder through Android's file picker), and emergency kits for a trusted person. Files are
 * decrypted for the archive and re-encrypted on restore, because Keystore keys never leave this
 * phone. AIIMIN never uploads any of it.
 */
@Singleton
class VaultBackupRepository @Inject constructor(
    @ApplicationContext private val context: Context,
    private val vault: VaultRepository,
    private val vaultDao: VaultDao,
    private val familyDao: FamilyDao,
    private val log: EventLogger,
    private val crypto: Crypto,
) {
    private val prefs = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)

    fun health(docs: Int): BackupHealth = BackupHealth(
        prefs.getLong("last_at", 0L).takeIf { it > 0 }, prefs.getString("where", null), prefs.getString("tree", null) != null, docs,
        weekly = prefs.getBoolean("weekly", false) && prefs.getString("dk", null) != null,
        failAt = prefs.getLong("fail_at", 0L).takeIf { it > 0 }, failWhy = prefs.getString("fail_why", null),
    )

    // ------------------------------------------------------------------ weekly (VB2, PRD Part 5 Phase 3)

    /**
     * Sets up weekly backups once. A random data key seals every backup; it is kept on this phone wrapped by the
     * Keystore, and in each file inside two slots: one for [passphrase], one for the recovery code returned here.
     * The code is shown once and never stored.
     */
    suspend fun setupWeekly(passphrase: CharArray): String = withContext(Dispatchers.Default) {
        val dk = KeySlots.newDataKey()
        val code = KeySlots.newRecoveryCode()
        val slots = listOf(KeySlots.slot(dk, passphrase), KeySlots.slot(dk, KeySlots.normalize(code).toCharArray()))
        val (wrapped, iv) = crypto.encrypt(dk, Crypto.BACKUP)
        dk.fill(0)
        prefs.edit()
            .putString("dk", b64(wrapped)).putString("dk_iv", b64(iv))
            .putString("slots", slots.joinToString(",") { b64(it) })
            .putBoolean("weekly", true).remove("fail_at").remove("fail_why").apply()
        log.log("vault.weekly.setup", tier = Tier.A)
        code
    }

    fun setWeekly(on: Boolean) = prefs.edit().putBoolean("weekly", on && prefs.getString("dk", null) != null).apply()

    /** The weekly job: no secret needed. A failure is remembered for the notice and the Vault line. */
    suspend fun weeklyNow(): String = withContext(Dispatchers.IO) {
        try {
            val tree = prefs.getString("tree", null)?.let(Uri::parse) ?: error("No backup folder chosen")
            val dk = crypto.decrypt(unb64(prefs.getString("dk", null) ?: error("Weekly backup isn't set up")), unb64(prefs.getString("dk_iv", "")!!), Crypto.BACKUP)
            val slots = prefs.getString("slots", "")!!.split(',').filter { it.isNotBlank() }.map(::unb64)
            val docs = vaultDao.allNow().filter { !it.deleted }
            val people = familyDao.allNow()
            val sealed = KeySlots.seal(archive(docs, people, "backup", people.firstOrNull { it.id == ME }?.name.orEmpty()), dk, slots)
            dk.fill(0)
            val name = write(tree, sealed)
            prefs.edit().putLong("last_at", System.currentTimeMillis()).remove("fail_at").remove("fail_why").apply()
            log.log("vault.backup", data = mapOf("docs" to docs.size, "bytes" to sealed.size, "weekly" to true), tier = Tier.A, source = "system")
            name
        } catch (e: Exception) {
            prefs.edit().putLong("fail_at", System.currentTimeMillis()).putString("fail_why", e.message ?: "The folder couldn't be written").apply()
            log.log("vault.backup.fail", data = mapOf("why" to (e.message ?: "")), tier = Tier.A, source = "system")
            throw e
        }
    }

    private fun write(tree: Uri, sealed: ByteArray): String {
        val name = "aiimin-vault-" + DateTimeFormatter.ofPattern("yyyy-MM-dd-HHmm", Locale.ENGLISH).format(Instant.now().atZone(ZoneId.systemDefault())) + ".aiimin"
        val parent = DocumentsContract.buildDocumentUriUsingTree(tree, DocumentsContract.getTreeDocumentId(tree))
        val out = DocumentsContract.createDocument(context.contentResolver, parent, "application/octet-stream", name) ?: error("Couldn't write to that folder")
        context.contentResolver.openOutputStream(out)?.use { it.write(sealed) } ?: error("Couldn't write to that folder")
        pruneOld(tree)
        return name
    }

    /** A one-page PDF with the recovery code, to save or print. Made in cache and shared; never kept. */
    suspend fun recoverySheet(code: String): File = withContext(Dispatchers.IO) {
        val pdf = PdfDocument()
        val page = pdf.startPage(PdfDocument.PageInfo.Builder(595, 842, 1).create())
        val cv = page.canvas
        val ink = Paint().apply { isAntiAlias = true; color = 0xFF1A1916.toInt() }
        var y = 64f
        fun line(t: String, size: Float, bold: Boolean = false, gap: Float = 8f) {
            ink.textSize = size; ink.typeface = Typeface.create(Typeface.SANS_SERIF, if (bold) Typeface.BOLD else Typeface.NORMAL)
            cv.drawText(t, 48f, y + size, ink); y += size + gap
        }
        line("AIIMIN · Backup recovery code", 20f, bold = true, gap = 20f)
        val mono = Paint(ink).apply { typeface = Typeface.MONOSPACE; textSize = 26f }
        code.split("-").chunked(3).forEach { row -> cv.drawText(row.joinToString("  "), 48f, y + 26f, mono); y += 38f }
        y += 12f
        listOf(
            "This code opens your AIIMIN vault backups if you forget the passphrase.",
            "On a new phone: AIIMIN › Vault › Backups › Restore, pick the newest backup, type this code.",
            "Spaces and dashes don't matter.",
            "Keep it somewhere safe and apart from the phone. Anyone with it and a backup file can open the backup.",
            "If both the passphrase and this code are lost, the backup can't be opened by anyone, AIIMIN included.",
        ).forEach { line(it, 11f, gap = 7f) }
        pdf.finishPage(page)
        val f = File(File(context.cacheDir, "exports").apply { mkdirs() }, "aiimin-recovery-code.pdf")
        f.outputStream().use { pdf.writeTo(it) }
        pdf.close()
        f
    }

    private fun b64(b: ByteArray) = android.util.Base64.encodeToString(b, android.util.Base64.NO_WRAP)
    private fun unb64(s: String) = android.util.Base64.decode(s, android.util.Base64.NO_WRAP)

    /** Remembers the folder the person picked (with a persistable grant) for this and later backups. */
    fun setFolder(tree: Uri) {
        runCatching {
            context.contentResolver.takePersistableUriPermission(tree, Intent.FLAG_GRANT_READ_URI_PERMISSION or Intent.FLAG_GRANT_WRITE_URI_PERMISSION)
        }
        val label = DocumentsContract.getTreeDocumentId(tree).let { id ->
            when {
                tree.authority?.contains("google.android.apps.docs") == true -> "your Google Drive"
                id.startsWith("primary:") -> "this phone · " + id.removePrefix("primary:").ifBlank { "Internal storage" }
                else -> id.substringAfter(':').ifBlank { "the folder you chose" }
            }
        }
        prefs.edit().putString("tree", tree.toString()).putString("where", label).apply()
    }

    // ------------------------------------------------------------------ archive

    private suspend fun archive(docs: List<DocEntity>, people: List<PersonEntity>, kind: String, from: String): ByteArray = withContext(Dispatchers.IO) {
        val bos = ByteArrayOutputStream()
        ZipOutputStream(bos).use { zip ->
            val manifest = JSONObject()
                .put("format", 1).put("kind", kind).put("from", from).put("createdAt", System.currentTimeMillis())
                .put("docs", JSONArray(docs.map { d ->
                    JSONObject().put("id", d.id).put("owner", d.owner).put("title", d.title).put("category", d.category).put("mime", d.mime)
                        .put("ext", d.ext).put("sensitive", d.sensitive).put("expires", d.expires ?: JSONObject.NULL).put("number", d.number ?: JSONObject.NULL)
                        .put("createdAt", d.createdAt)
                }))
                .put("people", JSONArray(people.map { p ->
                    JSONObject().put("id", p.id).put("name", p.name).put("relation", p.relation).put("role", p.role).put("blood", p.blood)
                        .put("allergies", p.allergies).put("meds", p.meds).put("doctor", p.doctor).put("contacts", p.contacts)
                }))
            zip.putNextEntry(ZipEntry("manifest.json")); zip.write(manifest.toString().toByteArray()); zip.closeEntry()
            for (d in docs) {
                val f = vault.fileFor(d, "backup")
                zip.putNextEntry(ZipEntry("files/${d.id}.${d.ext}")); f.inputStream().use { it.copyTo(zip) }; zip.closeEntry()
                if (d.encrypted) f.delete()
            }
        }
        bos.toByteArray()
    }

    // ------------------------------------------------------------------ backup (VB1)

    /** Writes one encrypted backup into the chosen folder and keeps the newest three. */
    suspend fun backupNow(passphrase: CharArray): String = withContext(Dispatchers.IO) {
        val tree = prefs.getString("tree", null)?.let(Uri::parse) ?: error("Choose where to keep backups first")
        val docs = vaultDao.allNow().filter { !it.deleted }
        val people = familyDao.allNow()
        val sealed = Seal.seal(archive(docs, people, "backup", people.firstOrNull { it.id == ME }?.name.orEmpty()), passphrase, Seal.KIND_BACKUP)
        val name = write(tree, sealed)
        prefs.edit().putLong("last_at", System.currentTimeMillis()).remove("fail_at").remove("fail_why").apply()
        log.log("vault.backup", data = mapOf("docs" to docs.size, "bytes" to sealed.size), tier = Tier.A)
        name
    }

    private fun pruneOld(tree: Uri) {
        val children = DocumentsContract.buildChildDocumentsUriUsingTree(tree, DocumentsContract.getTreeDocumentId(tree))
        val found = mutableListOf<Pair<String, String>>()
        context.contentResolver.query(children, arrayOf(DocumentsContract.Document.COLUMN_DOCUMENT_ID, DocumentsContract.Document.COLUMN_DISPLAY_NAME), null, null, null)?.use { c ->
            while (c.moveToNext()) {
                val name = c.getString(1) ?: continue
                if (name.startsWith("aiimin-vault-") && name.endsWith(".aiimin")) found += c.getString(0) to name
            }
        }
        found.sortedByDescending { it.second }.drop(3).forEach { (id, _) ->
            runCatching { DocumentsContract.deleteDocument(context.contentResolver, DocumentsContract.buildDocumentUriUsingTree(tree, id)) }
        }
    }

    /** Restore a backup or open a kit: decrypt, then add what this phone doesn't have yet. */
    suspend fun restore(uri: Uri, secret: CharArray, kitOwnerName: String? = null): RestoreResult = withContext(Dispatchers.IO) {
        val data = context.contentResolver.openInputStream(uri)?.use { it.readBytes() } ?: error("Can't read that file")
        val kind = Seal.kindOf(data) ?: throw Seal.NotAiimin()
        // A weekly backup opens with the passphrase or the recovery code; older ones with the passphrase.
        val plain = if (KeySlots.isWeekly(data)) KeySlots.open(data, secret) else Seal.open(data, secret)
        var manifest: JSONObject? = null
        val files = HashMap<String, ByteArray>()
        ZipInputStream(ByteArrayInputStream(plain)).use { zip ->
            var e = zip.nextEntry
            while (e != null) {
                if (e.name == "manifest.json") manifest = JSONObject(zip.readBytes().decodeToString())
                else if (e.name.startsWith("files/") && !e.name.contains("..")) files[e.name.removePrefix("files/")] = zip.readBytes()
                e = zip.nextEntry
            }
        }
        val m = manifest ?: throw Seal.NotAiimin()
        val from = m.optString("from").ifBlank { null }
        val isKit = kind == Seal.KIND_KIT
        val existingPeople = familyDao.allNow().associateBy { it.id }
        var newPeople = 0
        // A kit's documents land in a profile for the person who made it; a backup restores its people.
        val kitOwner = if (isKit) {
            val name = kitOwnerName ?: from ?: "Emergency kit"
            val p = familyDao.allNow().firstOrNull { it.relation == "Emergency kit" && it.name == name }
                ?: PersonEntity(newId(), name, "Emergency kit", "ADULT", createdAt = System.currentTimeMillis()).also { familyDao.upsert(it); newPeople++ }
            p.id
        } else null
        val peopleJson = m.optJSONArray("people") ?: JSONArray()
        if (!isKit) for (i in 0 until peopleJson.length()) {
            val o = peopleJson.getJSONObject(i)
            val id = o.getString("id")
            if (id !in existingPeople) {
                familyDao.upsert(
                    PersonEntity(
                        id, o.optString("name"), o.optString("relation"), o.optString("role", "ADULT"),
                        blood = o.optString("blood"), allergies = o.optString("allergies"), meds = o.optString("meds"), doctor = o.optString("doctor"),
                        contacts = o.optString("contacts", "[]"), createdAt = System.currentTimeMillis(),
                    ),
                )
                newPeople++
            }
        }
        val docs = m.optJSONArray("docs") ?: JSONArray()
        var added = 0
        var skipped = 0
        val tmpDir = File(context.cacheDir, "restore").apply { mkdirs() }
        for (i in 0 until docs.length()) {
            val o = docs.getJSONObject(i)
            val ext = o.optString("ext", "bin")
            val bytes = files["${o.getString("id")}.$ext"] ?: continue
            val hash = java.security.MessageDigest.getInstance("SHA-256").digest(bytes).joinToString("") { "%02x".format(it) }
            if (vaultDao.byHash(hash) != null) { skipped++; continue }
            val tmp = File(tmpDir, newId() + "." + ext).apply { writeBytes(bytes) }
            val owner = kitOwner ?: o.optString("owner", ME)
            val r = vault.importFile(tmp, owner, o.optString("mime", "application/octet-stream"), ext, o.optString("title", "Document"), o.optBoolean("sensitive"))
            vault.get(r.docId)?.let { d ->
                vault.edit(d.copy(category = o.optString("category", d.category), expires = o.optString("expires").takeIf { it.isNotBlank() && it != "null" } ?: d.expires))
            }
            added++
        }
        tmpDir.deleteRecursively()
        log.log(if (isKit) "kit.open" else "vault.restore", data = mapOf("docs" to added, "skipped" to skipped), tier = Tier.A)
        RestoreResult(added, skipped, newPeople, from)
    }

    // ------------------------------------------------------------------ emergency kits (EK1 / EK2)

    fun kits(): List<Kit> = runCatching {
        val a = JSONArray(prefs.getString("kits", "[]"))
        (0 until a.length()).map { i ->
            val o = a.getJSONObject(i)
            Kit(o.getString("id"), o.getString("to"), (0 until o.getJSONArray("docs").length()).map { o.getJSONArray("docs").getString(it) }, o.getLong("at"))
        }
    }.getOrDefault(emptyList())

    private fun saveKits(list: List<Kit>) {
        prefs.edit().putString("kits", JSONArray(list.map { k -> JSONObject().put("id", k.id).put("to", k.to).put("docs", JSONArray(k.docIds)).put("at", k.createdAt) }).toString()).apply()
    }

    /**
     * Builds the encrypted kit for [to]. Returns the file to send and the code that opens it. The
     * code is shown once and printed on the emergency sheet; it is never stored on this phone.
     */
    suspend fun buildKit(to: String, docIds: List<String>, replaceId: String? = null): Pair<File, String> = withContext(Dispatchers.IO) {
        val docs = docIds.mapNotNull { vaultDao.get(it) }.filter { !it.deleted }
        val me = familyDao.get(ME)
        val code = Seal.newCode()
        val sealed = Seal.seal(archive(docs, listOfNotNull(me), "kit", me?.name.orEmpty()), code.toCharArray(), Seal.KIND_KIT)
        val f = File(File(context.cacheDir, "exports").apply { mkdirs() }, "aiimin-emergency-kit-${to.lowercase().replace(Regex("[^a-z0-9]+"), "-")}.aiimin")
        f.writeBytes(sealed)
        val kit = Kit(replaceId ?: newId(), to, docs.map { it.id }, System.currentTimeMillis())
        saveKits(kits().filter { it.id != kit.id } + kit)
        log.log("kit.build", data = mapOf("docs" to docs.size), tier = Tier.A)
        f to code
    }

    fun deleteKit(id: String) = saveKits(kits().filter { it.id != id })

    /** EK2 · a one-page sheet to print: the kit code, how to open it, and the emergency card. */
    suspend fun printableSheet(code: String, kitFor: String): File = withContext(Dispatchers.IO) {
        val me = familyDao.get(ME)
        val pdf = PdfDocument()
        val page = pdf.startPage(PdfDocument.PageInfo.Builder(595, 842, 1).create())
        val cv = page.canvas
        val ink = Paint().apply { isAntiAlias = true; color = 0xFF1A1916.toInt() }
        val muted = Paint(ink).apply { color = 0xFF625E57.toInt(); textSize = 11f }
        var y = 64f
        fun line(t: String, size: Float, bold: Boolean = false, p: Paint = ink, gap: Float = 8f) {
            p.textSize = size; p.typeface = Typeface.create(Typeface.SANS_SERIF, if (bold) Typeface.BOLD else Typeface.NORMAL)
            cv.drawText(t, 48f, y + size, p); y += size + gap
        }
        line("AIIMIN · Emergency sheet", 20f, bold = true)
        line("${me?.name?.ifBlank { null } ?: "Owner"} · made ${DateTimeFormatter.ofPattern("d MMM yyyy", Locale.ENGLISH).format(LocalDate.now())} · kit for $kitFor", 11f, p = muted, gap = 22f)
        line("Kit code", 12f, bold = true, gap = 6f)
        val mono = Paint(ink).apply { typeface = Typeface.MONOSPACE; textSize = 22f }
        code.split("-").chunked(3).forEach { row -> cv.drawText(row.joinToString("  "), 48f, y + 22f, mono); y += 32f }
        y += 8f
        listOf(
            "1. On $kitFor's phone, open AIIMIN › Vault › ⋯ › Open an emergency kit.",
            "2. Pick the kit file (aiimin-emergency-kit-….aiimin) that was sent to them.",
            "3. Type the code above. Spaces and dashes don't matter.",
            "Keep this sheet somewhere safe: anyone with the sheet and the kit file can open the kit.",
        ).forEach { line(it, 11f, gap = 6f) }
        y += 16f
        if (me != null) {
            line("Emergency card", 14f, bold = true)
            listOf(
                "Blood group" to me.blood, "Allergies" to me.allergies, "Medicines" to me.meds, "Doctor" to me.doctor,
            ).filter { it.second.isNotBlank() }.forEach { (k, v) -> line("$k: $v", 12f, gap = 6f) }
            runCatching {
                val a = JSONArray(me.contacts)
                (0 until a.length()).forEach { i -> val o = a.getJSONObject(i); line("Contact: ${o.optString("n")} ${o.optString("p")}", 12f, gap = 6f) }
            }
        }
        y = 800f
        line("Entered by the owner, not verified by AIIMIN. In an emergency call 112.", 10f, p = muted)
        pdf.finishPage(page)
        val f = File(File(context.cacheDir, "exports").apply { mkdirs() }, "aiimin-emergency-sheet.pdf")
        f.outputStream().use { pdf.writeTo(it) }
        pdf.close()
        f
    }

    companion object {
        const val PREFS = "vault_backup"
    }
}

/** Writes the weekly backup with the app closed (PRD Part 5 Phase 3). A failure shows a notice from the next Pulse beat. */
class WeeklyBackupWorker(context: Context, params: androidx.work.WorkerParameters) : androidx.work.CoroutineWorker(context, params) {
    @dagger.hilt.EntryPoint
    @dagger.hilt.InstallIn(dagger.hilt.components.SingletonComponent::class)
    interface Deps { fun backups(): VaultBackupRepository }

    override suspend fun doWork(): Result {
        val repo = dagger.hilt.android.EntryPointAccessors.fromApplication(applicationContext, Deps::class.java).backups()
        if (!repo.health(0).weekly) return Result.success()
        return runCatching { repo.weeklyNow() }.fold({ Result.success() }, { if (runAttemptCount < 3) Result.retry() else Result.success() })
    }

    companion object {
        private const val NAME = "vault-weekly"
        fun schedule(context: Context, on: Boolean) {
            val wm = androidx.work.WorkManager.getInstance(context)
            if (!on) { wm.cancelUniqueWork(NAME); return }
            wm.enqueueUniquePeriodicWork(
                NAME, androidx.work.ExistingPeriodicWorkPolicy.KEEP,
                androidx.work.PeriodicWorkRequestBuilder<WeeklyBackupWorker>(7, java.util.concurrent.TimeUnit.DAYS)
                    .setConstraints(androidx.work.Constraints.Builder().setRequiresBatteryNotLow(true).setRequiresStorageNotLow(true).build())
                    .setBackoffCriteria(androidx.work.BackoffPolicy.EXPONENTIAL, 1, java.util.concurrent.TimeUnit.HOURS)
                    .build(),
            )
        }
    }
}
