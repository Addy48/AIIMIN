package aiimin.core.database

import androidx.room3.Entity
import androidx.room3.Index
import androidx.room3.PrimaryKey

/*
 * Conventions: ids are UUID strings; logical days are ISO "yyyy-MM-dd" strings
 * (sortable, zone-free); instants are epoch millis; money is integer paise.
 * JSON columns hold small lists only.
 */

/** The append-only behavioural log. Rows are inserted, never updated or deleted. */
@Entity(tableName = "events", indices = [Index("day"), Index("type")])
data class EventEntity(
    @PrimaryKey val seq: Long,
    val at: Long,
    val day: String,
    val type: String,
    val refType: String?,
    val refId: String?,
    val data: String,
    val tier: String,
    val source: String,
    val tz: String,
    val rules: String,
    val device: String,
    val prev: String,
    val hash: String,
)

/** Upload receipts kept apart so the log itself stays append-only. */
@Entity(tableName = "event_uploads")
data class EventUploadEntity(@PrimaryKey val seq: Long, val uploadedAt: Long)

@Entity(tableName = "tasks", indices = [Index("day"), Index("done")])
data class TaskEntity(
    @PrimaryKey val id: String,
    val title: String,
    val notes: String = "",
    /** Null = inbox / someday. */
    val day: String?,
    /** "HH:mm" or null for anytime. */
    val time: String?,
    /** MORNING / AFTERNOON / EVENING when no time is set. */
    val part: String?,
    /** 0 low · 1 normal · 2 high. */
    val priority: Int = 1,
    val createdAt: Long,
    /** When it was put on its current day — "planned" means before that day began. */
    val scheduledAt: Long,
    val done: Boolean = false,
    val doneAt: Long? = null,
    val doneDay: String? = null,
    /** Times it rolled over silently. Never shown as a red pile. */
    val carried: Int = 0,
    /** null · DAILY · WEEKDAYS · WEEKLY — set on the series template only. */
    val recurrence: String? = null,
    /** For a generated occurrence: the template task's id. */
    val seriesId: String? = null,
    val subtasks: String = "[]",
    /** Family task: who it is assigned to (person id); null = mine. */
    val assignee: String? = null,
    val remoteId: String? = null,
    val deleted: Boolean = false,
    val updatedAt: Long,
)

@Entity(tableName = "calendar_events", indices = [Index("startAt")])
data class CalendarEventEntity(
    @PrimaryKey val id: String,
    val title: String,
    val startAt: Long,
    val endAt: Long,
    val allDay: Boolean = false,
    val location: String = "",
    /** local · vault (doc expiry marker) · task. */
    val source: String = "local",
    val docId: String? = null,
    val taskId: String? = null,
    val recurrence: String? = null,
    val remindMin: Int? = 15,
    val deleted: Boolean = false,
    val updatedAt: Long,
)

@Entity(tableName = "minimums")
data class MinimumEntity(
    @PrimaryKey val id: String,
    val name: String,
    /** The tiny version used on Low Battery days ("1 push-up"). */
    val tiny: String = "",
    val domain: String = "discipline",
    /** Day it was added; it joins the planned set from the next day. */
    val addedOn: String,
    val archived: Boolean = false,
    val sort: Int = 0,
    val createdAt: Long,
)

@Entity(tableName = "minimum_ticks", primaryKeys = ["minimumId", "day"], indices = [Index("day")])
data class MinimumTickEntity(
    val minimumId: String,
    val day: String,
    val done: Boolean,
    val proofDocId: String? = null,
    /** Tick/untick count today — 3+ makes the evidence doubtful. */
    val toggles: Int = 1,
    val backfilled: Boolean = false,
    val updatedAt: Long,
)

@Entity(tableName = "txns", indices = [Index("day"), Index("reference")])
data class TxnEntity(
    @PrimaryKey val id: String,
    val at: Long,
    val day: String,
    val amountPaise: Long,
    /** in · out */
    val direction: String,
    val title: String,
    val category: String,
    /** PERSONAL · HOUSEHOLD · BUSINESS */
    val ledger: String = "PERSONAL",
    /** UPI · CARD · CASH · BANK */
    val method: String = "UPI",
    /** manual · sms · notification · ai · paste */
    val source: String = "manual",
    val reference: String? = null,
    val account4: String? = null,
    val upiId: String? = null,
    val note: String = "",
    /** Gift mode: hide merchant/note from this person until the reveal day. */
    val giftHideFrom: String? = null,
    val giftRevealOn: String? = null,
    val receiptDocId: String? = null,
    /** JSON [{who, paise, settled}] */
    val splits: String = "[]",
    val deleted: Boolean = false,
    val remoteId: String? = null,
    val createdAt: Long,
)

/** Detected but not yet booked (bank SMS / notification / paste). Nothing is booked until settled. */
@Entity(tableName = "txn_drafts", indices = [Index("status")])
data class TxnDraftEntity(
    @PrimaryKey val id: String,
    val detectedAt: Long,
    val amountPaise: Long,
    val direction: String,
    val title: String,
    val category: String,
    val reference: String?,
    val account4: String?,
    val upiId: String?,
    val raw: String,
    val source: String,
    val confidence: Double,
    /** pending · settled · dismissed */
    val status: String = "pending",
)

@Entity(tableName = "payee_rules")
data class PayeeRuleEntity(@PrimaryKey val key: String, val category: String, val ledger: String, val updatedAt: Long)

/** The plan is fixed on the 1st; mid-month edits apply next month. */
@Entity(tableName = "budgets")
data class BudgetEntity(
    @PrimaryKey val month: String,
    val totalPaise: Long,
    val fixedPaise: Long,
    /** JSON {category: paise} */
    val caps: String = "{}",
    val updatedAt: Long,
)

@Entity(tableName = "notes", indices = [Index("updatedAt")])
data class NoteEntity(
    @PrimaryKey val id: String,
    val title: String,
    val body: String,
    val tags: String = "[]",
    val pinned: Boolean = false,
    val createdAt: Long,
    val updatedAt: Long,
    val remoteId: String? = null,
    val dirty: Boolean = true,
    val deleted: Boolean = false,
)

/** Journal text is encrypted with a Keystore key; only the author reads it. */
@Entity(tableName = "journal", indices = [Index("day")])
data class JournalEntity(
    @PrimaryKey val id: String,
    val day: String,
    val cipher: String,
    val iv: String,
    /** 1–5, tracked only; never scored. */
    val mood: Int?,
    val tags: String = "[]",
    val words: Int,
    val qualityOk: Boolean,
    val createdAt: Long,
    val updatedAt: Long,
    val dirty: Boolean = true,
    val deleted: Boolean = false,
)

@Entity(tableName = "focus_sessions", indices = [Index("startAt")])
data class FocusSessionEntity(
    @PrimaryKey val id: String,
    val startAt: Long,
    val endAt: Long,
    /** Minutes actually focused (idle pauses removed). */
    val minutes: Int,
    val label: String,
    val taskId: String? = null,
    /** done · stopped */
    val status: String,
)

@Entity(tableName = "docs", indices = [Index("owner"), Index("expires")])
data class DocEntity(
    @PrimaryKey val id: String,
    /** Person id or "household". */
    val owner: String,
    /** SHA-256 of the file, for duplicate detection. */
    val sha256: String = "",
    val title: String,
    val category: String,
    val mime: String,
    val ext: String,
    val sizeBytes: Long,
    /** App-private file path (relative to filesDir). */
    val path: String,
    val encrypted: Boolean = false,
    val sensitive: Boolean = false,
    val text: String = "",
    val expires: String? = null,
    val number: String? = null,
    val vehicle: String? = null,
    val pages: Int = 1,
    val version: Int = 1,
    val createdAt: Long,
    val openedAt: Long? = null,
    val deleted: Boolean = false,
)

@Entity(tableName = "doc_shares", primaryKeys = ["docId", "who"])
data class DocShareEntity(
    val docId: String,
    val who: String,
    /** SUMMARY · VIEW · COMMENT · EDIT */
    val level: String,
    /** NOW · UNTIL · EMERGENCY · AFTER_DEATH */
    val whenKind: String,
    val until: String? = null,
)

@Entity(tableName = "people")
data class PersonEntity(
    @PrimaryKey val id: String,
    val name: String,
    val relation: String,
    val role: String,
    val pending: Boolean = false,
    /**
     * True once this person uses AIIMIN on their own account. Until then the
     * profile (and its vault) is managed by whoever created it — e.g. parents
     * without a smartphone. Linked members' private items are never readable.
     */
    val linked: Boolean = false,
    val hue: Int = 0,
    val blood: String = "",
    val allergies: String = "",
    val meds: String = "",
    val doctor: String = "",
    /** JSON [{n, p}] */
    val contacts: String = "[]",
    val delegateTo: String? = null,
    val delegateCats: String = "[]",
    val delegateConsentOn: String? = null,
    val createdAt: Long,
)

@Entity(tableName = "emergency_requests")
data class EmergencyRequestEntity(
    @PrimaryKey val id: String,
    val fromId: String,
    val ownerId: String,
    val cats: String,
    val requestedAt: Long,
    val waitHours: Int,
    val status: String,
    val grantedAt: Long? = null,
    val expiresOn: String? = null,
)

@Entity(tableName = "access_log", indices = [Index("docId")])
data class AccessLogEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val docId: String,
    val title: String,
    val owner: String,
    val by: String,
    val action: String,
    val at: Long,
)

/** One link table for every object (plan Part 2 §7.1). */
@Entity(tableName = "links", primaryKeys = ["fromType", "fromId", "toType", "toId"], indices = [Index("toType", "toId")])
data class LinkEntity(
    val fromType: String,
    val fromId: String,
    val toType: String,
    val toId: String,
    val kind: String = "related",
    val createdAt: Long,
)

@Entity(tableName = "notifications", indices = [Index(value = ["ruleKey"], unique = true)])
data class NotificationEntity(
    @PrimaryKey val id: String,
    /** Dedupe key: "doc-expiry:<id>:30". */
    val ruleKey: String,
    val title: String,
    val body: String,
    val at: Long,
    /** today · money · vault · doc · score · journal · focus */
    val route: String,
    val routeArg: String? = null,
    /** 0 low · 1 med · 2 high */
    val priority: Int,
    val read: Boolean = false,
    val dismissed: Boolean = false,
)

/** What the phone measured for one logical day. Re-measured, never typed. */
@Entity(tableName = "device_days")
data class DeviceDayEntity(
    @PrimaryKey val day: String,
    val steps: Long? = null,
    /** health_connect · sensor */
    val stepsSource: String? = null,
    val stepsHourly: String = "[]",
    val screenMs: Long? = null,
    val screenPersonalMs: Long? = null,
    val screenWorkMs: Long? = null,
    val lateScreenMs: Long? = null,
    val unlocks: Int? = null,
    val notifications: Int? = null,
    val firstUnlockAt: Long? = null,
    /** JSON [{pkg, label, ms, opens}] top apps. */
    val apps: String = "[]",
    val screenHourly: String = "[]",
    val sleepMin: Int? = null,
    val sleepStart: Long? = null,
    val sleepEnd: Long? = null,
    val restingHr: Int? = null,
    val updatedAt: Long,
)

/** The day's frozen plan and, once settled, its frozen snapshot. */
@Entity(tableName = "day_state")
data class DayStateEntity(
    @PrimaryKey val day: String,
    val plannedTasks: String = "[]",
    val plannedMins: String = "[]",
    val light: Boolean = false,
    val paused: Boolean = false,
    val pauseReason: String? = null,
    val startedAt: Long,
    val closedAt: Long? = null,
    val settled: Boolean = false,
    val settledAt: Long? = null,
    /** Frozen DaySnapshot JSON after close; the derived score is never stored. */
    val snapshot: String? = null,
    val backfills: Int = 0,
)

@Entity(tableName = "chat_threads")
data class ChatThreadEntity(@PrimaryKey val id: String, val title: String, val createdAt: Long, val updatedAt: Long)

@Entity(tableName = "chat_messages", indices = [Index("threadId")])
data class ChatMessageEntity(
    @PrimaryKey val id: String,
    val threadId: String,
    /** user · assistant */
    val role: String,
    val text: String,
    val proposals: String = "[]",
    /** proposed · applied · discarded · undone */
    val proposalState: String? = null,
    val saw: String = "[]",
    val sources: String = "[]",
    val followups: String = "[]",
    val createdAt: Long,
)
