package aiimin.core.database

import androidx.room3.Dao
import androidx.room3.Insert
import androidx.room3.OnConflictStrategy
import androidx.room3.Query
import androidx.room3.Upsert
import kotlinx.coroutines.flow.Flow

@Dao
interface EventDao {
    /** ABORT on conflict: a sequence number is written once, ever. */
    @Insert(onConflict = OnConflictStrategy.ABORT)
    suspend fun append(e: EventEntity)

    @Query("SELECT * FROM events ORDER BY seq")
    suspend fun all(): List<EventEntity>

    @Query("SELECT * FROM events ORDER BY seq DESC LIMIT 1")
    suspend fun last(): EventEntity?

    @Query("SELECT MAX(at) FROM events")
    suspend fun maxAt(): Long?

    @Query("SELECT * FROM events WHERE day = :day ORDER BY seq")
    suspend fun forDay(day: String): List<EventEntity>

    @Query("SELECT COUNT(*) FROM events WHERE day = :day AND type = :type AND refId = :refId")
    suspend fun count(day: String, type: String, refId: String): Int

    @Query("SELECT * FROM events ORDER BY seq DESC LIMIT :limit")
    fun recent(limit: Int): Flow<List<EventEntity>>

    @Query("SELECT * FROM events WHERE day = :day AND type = :type ORDER BY seq")
    suspend fun forDayType(day: String, type: String): List<EventEntity>

    @Query("SELECT e.* FROM events e LEFT JOIN event_uploads u ON e.seq = u.seq WHERE u.seq IS NULL ORDER BY e.seq LIMIT :limit")
    suspend fun notUploaded(limit: Int): List<EventEntity>

    @Insert(onConflict = OnConflictStrategy.IGNORE)
    suspend fun markUploaded(rows: List<EventUploadEntity>)

    @Query("SELECT COUNT(*) FROM events")
    fun countFlow(): Flow<Int>
}

@Dao
interface TaskDao {
    @Upsert suspend fun upsert(t: TaskEntity)

    @Query("SELECT * FROM tasks WHERE id = :id")
    suspend fun get(id: String): TaskEntity?

    @Query("SELECT * FROM tasks WHERE id = :id")
    fun observe(id: String): Flow<TaskEntity?>

    @Query("SELECT * FROM tasks WHERE deleted = 0 AND day = :day ORDER BY done, CASE WHEN time IS NULL THEN 1 ELSE 0 END, time, priority DESC, createdAt")
    fun forDay(day: String): Flow<List<TaskEntity>>

    @Query("SELECT * FROM tasks WHERE deleted = 0 AND day = :day")
    suspend fun forDayNow(day: String): List<TaskEntity>

    @Query("SELECT * FROM tasks WHERE deleted = 0 AND done = 0 AND day IS NOT NULL AND day < :day")
    suspend fun openBefore(day: String): List<TaskEntity>

    @Query("SELECT * FROM tasks WHERE deleted = 0 AND done = 0 AND (day IS NULL OR day > :day) ORDER BY CASE WHEN day IS NULL THEN 1 ELSE 0 END, day, time")
    fun upcoming(day: String): Flow<List<TaskEntity>>

    @Query("SELECT * FROM tasks WHERE deleted = 0 AND done = 1 ORDER BY doneAt DESC LIMIT :limit")
    fun recentDone(limit: Int): Flow<List<TaskEntity>>

    @Query("SELECT * FROM tasks WHERE deleted = 0 AND assignee IS NOT NULL AND done = 0")
    fun family(): Flow<List<TaskEntity>>

    @Query("SELECT * FROM tasks WHERE deleted = 0 AND recurrence IS NOT NULL")
    suspend fun recurring(): List<TaskEntity>

    @Query("SELECT COUNT(*) FROM tasks WHERE seriesId = :seriesId AND day = :day")
    suspend fun occurrenceCount(seriesId: String, day: String): Int

    @Query("SELECT * FROM tasks WHERE id IN (:ids)")
    suspend fun byIds(ids: List<String>): List<TaskEntity>

    @Query("SELECT * FROM tasks WHERE deleted = 0 AND remoteId IS NULL")
    suspend fun unsynced(): List<TaskEntity>

    @Query("SELECT * FROM tasks WHERE remoteId = :remoteId")
    suspend fun byRemote(remoteId: String): TaskEntity?

    @Query("SELECT * FROM tasks WHERE deleted = 0 AND (title LIKE :q OR notes LIKE :q) LIMIT 30")
    suspend fun search(q: String): List<TaskEntity>
}

@Dao
interface CalendarDao {
    @Upsert suspend fun upsert(e: CalendarEventEntity)

    @Query("SELECT * FROM calendar_events WHERE id = :id")
    suspend fun get(id: String): CalendarEventEntity?

    @Query("SELECT * FROM calendar_events WHERE deleted = 0 AND startAt < :to AND endAt > :from ORDER BY allDay DESC, startAt")
    fun between(from: Long, to: Long): Flow<List<CalendarEventEntity>>

    @Query("SELECT * FROM calendar_events WHERE deleted = 0 AND startAt < :to AND endAt > :from ORDER BY startAt")
    suspend fun betweenNow(from: Long, to: Long): List<CalendarEventEntity>

    @Query("SELECT * FROM calendar_events WHERE deleted = 0 AND docId = :docId")
    suspend fun forDoc(docId: String): List<CalendarEventEntity>

    @Query("SELECT * FROM calendar_events WHERE deleted = 0 AND title LIKE :q LIMIT 30")
    suspend fun search(q: String): List<CalendarEventEntity>
}

@Dao
interface MinimumDao {
    @Upsert suspend fun upsert(m: MinimumEntity)

    @Query("SELECT * FROM minimums WHERE archived = 0 ORDER BY sort, createdAt")
    fun active(): Flow<List<MinimumEntity>>

    @Query("SELECT * FROM minimums WHERE archived = 0 ORDER BY sort, createdAt")
    suspend fun activeNow(): List<MinimumEntity>

    @Query("SELECT * FROM minimums WHERE id = :id")
    suspend fun get(id: String): MinimumEntity?

    @Upsert suspend fun upsertTick(t: MinimumTickEntity)

    @Query("SELECT * FROM minimum_ticks WHERE day = :day")
    fun ticks(day: String): Flow<List<MinimumTickEntity>>

    @Query("SELECT * FROM minimum_ticks WHERE day = :day")
    suspend fun ticksNow(day: String): List<MinimumTickEntity>

    @Query("SELECT * FROM minimum_ticks WHERE minimumId = :id AND day = :day")
    suspend fun tick(id: String, day: String): MinimumTickEntity?

    @Query("SELECT * FROM minimums")
    suspend fun allNow(): List<MinimumEntity>

    @Query("SELECT * FROM minimum_ticks WHERE day >= :from ORDER BY day")
    fun ticksSince(from: String): Flow<List<MinimumTickEntity>>
}

@Dao
interface MoneyDao {
    @Upsert suspend fun upsert(t: TxnEntity)

    @Query("SELECT * FROM txns WHERE id = :id")
    suspend fun get(id: String): TxnEntity?

    @Query("SELECT * FROM txns WHERE deleted = 0 AND day >= :from AND day <= :to ORDER BY at DESC")
    fun between(from: String, to: String): Flow<List<TxnEntity>>

    @Query("SELECT * FROM txns WHERE deleted = 0 AND day >= :from AND day <= :to ORDER BY at DESC")
    suspend fun betweenNow(from: String, to: String): List<TxnEntity>

    @Query("SELECT * FROM txns WHERE deleted = 0 ORDER BY at DESC LIMIT :limit")
    fun recent(limit: Int): Flow<List<TxnEntity>>

    @Query("SELECT COUNT(*) FROM txns WHERE reference = :ref AND deleted = 0")
    suspend fun countByRef(ref: String): Int

    @Query("SELECT * FROM txns WHERE deleted = 0 AND (title LIKE :q OR note LIKE :q OR category LIKE :q) ORDER BY at DESC LIMIT 30")
    suspend fun search(q: String): List<TxnEntity>

    @Upsert suspend fun upsertDraft(d: TxnDraftEntity)

    @Query("SELECT * FROM txn_drafts WHERE status = 'pending' ORDER BY detectedAt DESC")
    fun pendingDrafts(): Flow<List<TxnDraftEntity>>

    @Query("SELECT * FROM txn_drafts WHERE status = 'pending'")
    suspend fun pendingDraftsNow(): List<TxnDraftEntity>

    @Query("SELECT * FROM txn_drafts WHERE id = :id")
    suspend fun draft(id: String): TxnDraftEntity?

    @Query("SELECT COUNT(*) FROM txn_drafts WHERE reference = :ref")
    suspend fun draftCountByRef(ref: String): Int

    @Upsert suspend fun upsertRule(r: PayeeRuleEntity)

    @Query("SELECT * FROM payee_rules WHERE `key` = :key")
    suspend fun rule(key: String): PayeeRuleEntity?

    @Upsert suspend fun upsertBudget(b: BudgetEntity)

    @Query("SELECT * FROM budgets WHERE month = :month")
    fun budget(month: String): Flow<BudgetEntity?>

    @Query("SELECT * FROM budgets WHERE month = :month")
    suspend fun budgetNow(month: String): BudgetEntity?

    @Query("SELECT * FROM budgets WHERE month <= :month ORDER BY month DESC LIMIT 1")
    suspend fun latestBudget(month: String): BudgetEntity?
}

@Dao
interface NoteDao {
    @Upsert suspend fun upsert(n: NoteEntity)

    @Query("SELECT * FROM notes WHERE id = :id")
    suspend fun get(id: String): NoteEntity?

    @Query("SELECT * FROM notes WHERE id = :id")
    fun observe(id: String): Flow<NoteEntity?>

    @Query("SELECT * FROM notes WHERE deleted = 0 ORDER BY pinned DESC, updatedAt DESC")
    fun all(): Flow<List<NoteEntity>>

    @Query("SELECT * FROM notes WHERE deleted = 0 AND (title LIKE :q OR body LIKE :q) ORDER BY updatedAt DESC LIMIT 30")
    suspend fun search(q: String): List<NoteEntity>

    @Query("SELECT * FROM notes WHERE deleted = 0 AND body LIKE :needle")
    suspend fun mentioning(needle: String): List<NoteEntity>

    @Query("SELECT * FROM notes WHERE dirty = 1")
    suspend fun dirty(): List<NoteEntity>

    @Query("SELECT * FROM notes WHERE remoteId = :remoteId")
    suspend fun byRemote(remoteId: String): NoteEntity?
}

@Dao
interface JournalDao {
    @Upsert suspend fun upsert(j: JournalEntity)

    @Query("SELECT * FROM journal WHERE deleted = 0 ORDER BY createdAt DESC")
    fun all(): Flow<List<JournalEntity>>

    @Query("SELECT * FROM journal WHERE deleted = 0 AND day = :day ORDER BY createdAt")
    suspend fun forDay(day: String): List<JournalEntity>

    @Query("SELECT * FROM journal WHERE deleted = 0 ORDER BY createdAt DESC LIMIT :n")
    suspend fun latest(n: Int): List<JournalEntity>

    @Query("SELECT * FROM journal WHERE id = :id")
    suspend fun get(id: String): JournalEntity?

    @Query("SELECT * FROM journal WHERE dirty = 1")
    suspend fun dirty(): List<JournalEntity>
}

@Dao
interface FocusDao {
    @Upsert suspend fun upsert(s: FocusSessionEntity)

    @Query("SELECT * FROM focus_sessions WHERE startAt < :to AND endAt > :from ORDER BY startAt")
    fun between(from: Long, to: Long): Flow<List<FocusSessionEntity>>

    @Query("SELECT * FROM focus_sessions WHERE startAt < :to AND endAt > :from ORDER BY startAt")
    suspend fun betweenNow(from: Long, to: Long): List<FocusSessionEntity>
}

@Dao
interface VaultDao {
    @Upsert suspend fun upsert(d: DocEntity)

    @Query("SELECT * FROM docs WHERE id = :id")
    suspend fun get(id: String): DocEntity?

    @Query("SELECT * FROM docs WHERE id = :id")
    fun observe(id: String): Flow<DocEntity?>

    @Query("SELECT * FROM docs WHERE deleted = 0 ORDER BY createdAt DESC")
    fun all(): Flow<List<DocEntity>>

    @Query("SELECT * FROM docs WHERE deleted = 0")
    suspend fun allNow(): List<DocEntity>

    @Query("SELECT * FROM docs WHERE deleted = 0 AND expires IS NOT NULL ORDER BY expires")
    suspend fun withExpiry(): List<DocEntity>

    @Query("SELECT * FROM docs WHERE deleted = 0 AND sha256 = :hash LIMIT 1")
    suspend fun byHash(hash: String): DocEntity?

    @Query("SELECT * FROM docs WHERE deleted = 0 AND (title LIKE :q OR text LIKE :q OR number LIKE :q OR category LIKE :q) LIMIT 40")
    suspend fun search(q: String): List<DocEntity>

    @Upsert suspend fun upsertShare(s: DocShareEntity)

    @Query("DELETE FROM doc_shares WHERE docId = :docId AND who = :who")
    suspend fun deleteShare(docId: String, who: String)

    @Query("SELECT * FROM doc_shares")
    fun shares(): Flow<List<DocShareEntity>>

    @Query("SELECT * FROM doc_shares")
    suspend fun sharesNow(): List<DocShareEntity>

    @Insert suspend fun log(a: AccessLogEntity)

    @Query("SELECT * FROM access_log ORDER BY at DESC LIMIT :limit")
    fun accessLog(limit: Int): Flow<List<AccessLogEntity>>
}

@Dao
interface FamilyDao {
    @Upsert suspend fun upsert(p: PersonEntity)

    @Query("SELECT * FROM people ORDER BY createdAt")
    fun all(): Flow<List<PersonEntity>>

    @Query("SELECT * FROM people ORDER BY createdAt")
    suspend fun allNow(): List<PersonEntity>

    @Query("SELECT * FROM people WHERE id = :id")
    suspend fun get(id: String): PersonEntity?

    @Query("DELETE FROM people WHERE id = :id")
    suspend fun delete(id: String)

    @Upsert suspend fun upsertRequest(r: EmergencyRequestEntity)

    @Query("SELECT * FROM emergency_requests ORDER BY requestedAt DESC")
    fun requests(): Flow<List<EmergencyRequestEntity>>

    @Query("SELECT * FROM emergency_requests")
    suspend fun requestsNow(): List<EmergencyRequestEntity>
}

@Dao
interface LinkDao {
    @Upsert suspend fun upsert(l: LinkEntity)

    @Query("DELETE FROM links WHERE fromType = :ft AND fromId = :fi AND toType = :tt AND toId = :ti")
    suspend fun delete(ft: String, fi: String, tt: String, ti: String)

    @Query("SELECT * FROM links WHERE (fromType = :type AND fromId = :id) OR (toType = :type AND toId = :id)")
    fun of(type: String, id: String): Flow<List<LinkEntity>>
}

@Dao
interface NotificationDao {
    @Insert(onConflict = OnConflictStrategy.IGNORE)
    suspend fun insertIfNew(n: NotificationEntity): Long

    @Query("SELECT * FROM notifications WHERE dismissed = 0 ORDER BY at DESC LIMIT 100")
    fun all(): Flow<List<NotificationEntity>>

    @Query("SELECT COUNT(*) FROM notifications WHERE read = 0 AND dismissed = 0")
    fun unread(): Flow<Int>

    @Query("UPDATE notifications SET read = 1")
    suspend fun markAllRead()

    @Query("UPDATE notifications SET dismissed = 1 WHERE id = :id")
    suspend fun dismiss(id: String)
}

@Dao
interface DeviceDayDao {
    @Upsert suspend fun upsert(d: DeviceDayEntity)

    @Query("SELECT * FROM device_days WHERE day = :day")
    fun observe(day: String): Flow<DeviceDayEntity?>

    @Query("SELECT * FROM device_days WHERE day = :day")
    suspend fun get(day: String): DeviceDayEntity?

    @Query("SELECT * FROM device_days WHERE day >= :from ORDER BY day")
    fun since(from: String): Flow<List<DeviceDayEntity>>

    @Query("SELECT * FROM device_days WHERE day >= :from AND day <= :to ORDER BY day")
    suspend fun range(from: String, to: String): List<DeviceDayEntity>
}

@Dao
interface DayStateDao {
    @Upsert suspend fun upsert(d: DayStateEntity)

    @Query("SELECT * FROM day_state WHERE day = :day")
    suspend fun get(day: String): DayStateEntity?

    @Query("SELECT * FROM day_state WHERE day = :day")
    fun observe(day: String): Flow<DayStateEntity?>

    @Query("SELECT * FROM day_state WHERE snapshot IS NOT NULL ORDER BY day")
    fun closed(): Flow<List<DayStateEntity>>

    @Query("SELECT * FROM day_state WHERE snapshot IS NOT NULL ORDER BY day")
    suspend fun closedNow(): List<DayStateEntity>

    @Query("SELECT * FROM day_state ORDER BY day DESC LIMIT 1")
    suspend fun latest(): DayStateEntity?
}

@Dao
interface ChatDao {
    @Upsert suspend fun upsertThread(t: ChatThreadEntity)

    @Upsert suspend fun upsertMessage(m: ChatMessageEntity)

    @Query("SELECT * FROM chat_threads ORDER BY updatedAt DESC")
    fun threads(): Flow<List<ChatThreadEntity>>

    @Query("SELECT * FROM chat_messages WHERE threadId = :threadId ORDER BY createdAt")
    fun messages(threadId: String): Flow<List<ChatMessageEntity>>

    @Query("SELECT * FROM chat_messages WHERE id = :id")
    suspend fun message(id: String): ChatMessageEntity?

    @Query("DELETE FROM chat_threads WHERE id = :id")
    suspend fun deleteThread(id: String)

    @Query("DELETE FROM chat_messages WHERE threadId = :id")
    suspend fun deleteMessages(id: String)
}
