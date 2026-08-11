package `in`.aiimin.app.data.local

import android.content.Context
import androidx.room.Dao
import androidx.room.Database
import androidx.room.Entity
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.PrimaryKey
import androidx.room.Query
import androidx.room.Room
import androidx.room.RoomDatabase
import kotlinx.coroutines.flow.Flow

@Entity(tableName = "outbox")
data class OutboxEntity(
    @PrimaryKey val id: String,
    val type: String,
    val payloadJson: String,
    val createdAt: Long = System.currentTimeMillis(),
    val retries: Int = 0,
    val status: String = "pending",
)

@Entity(tableName = "habit_cache")
data class HabitCacheEntity(
    @PrimaryKey val id: String,
    val name: String,
    val emoji: String,
    val doneToday: Boolean,
)

@Entity(tableName = "note_cache")
data class NoteCacheEntity(
    @PrimaryKey val id: String,
    val title: String,
    val content: String,
    val color: String,
    val pinned: Boolean,
    val updatedAt: Long,
)

@Entity(tableName = "journal_cache")
data class JournalCacheEntity(
    @PrimaryKey val id: String,
    val date: String,
    val content: String,
    val updatedAt: Long,
)

@Dao
interface OutboxDao {
    @Query("SELECT * FROM outbox WHERE status = 'pending' ORDER BY createdAt ASC")
    suspend fun pending(): List<OutboxEntity>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsert(item: OutboxEntity)

    @Query("UPDATE outbox SET status = :status WHERE id = :id")
    suspend fun setStatus(id: String, status: String)

    @Query("SELECT COUNT(*) FROM outbox WHERE status = 'pending'")
    suspend fun pendingCount(): Int

    @Query("SELECT COUNT(*) FROM outbox WHERE status = 'pending'")
    fun observePendingCount(): Flow<Int>

    @Query("DELETE FROM outbox WHERE id = :id")
    suspend fun delete(id: String)
}

@Dao
interface HabitCacheDao {
    @Query("SELECT * FROM habit_cache")
    fun observe(): Flow<List<HabitCacheEntity>>

    @Query("SELECT * FROM habit_cache")
    suspend fun all(): List<HabitCacheEntity>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsertAll(items: List<HabitCacheEntity>)

    @Query("UPDATE habit_cache SET doneToday = :done WHERE id = :id")
    suspend fun setDone(id: String, done: Boolean)
}

@Dao
interface NoteCacheDao {
    @Query("SELECT * FROM note_cache ORDER BY pinned DESC, updatedAt DESC")
    fun observe(): Flow<List<NoteCacheEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsertAll(items: List<NoteCacheEntity>)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsert(item: NoteCacheEntity)
}

@Dao
interface JournalCacheDao {
    @Query("SELECT * FROM journal_cache ORDER BY updatedAt DESC")
    fun observe(): Flow<List<JournalCacheEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsertAll(items: List<JournalCacheEntity>)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsert(item: JournalCacheEntity)
}

@Database(
    entities = [OutboxEntity::class, HabitCacheEntity::class, NoteCacheEntity::class, JournalCacheEntity::class],
    version = 1,
    exportSchema = false,
)
abstract class AiiminDatabase : RoomDatabase() {
    abstract fun outbox(): OutboxDao
    abstract fun habits(): HabitCacheDao
    abstract fun notes(): NoteCacheDao
    abstract fun journal(): JournalCacheDao

    companion object {
        fun create(context: Context): AiiminDatabase =
            Room.databaseBuilder(context, AiiminDatabase::class.java, "aiimin.db")
                .fallbackToDestructiveMigration()
                .build()
    }
}
