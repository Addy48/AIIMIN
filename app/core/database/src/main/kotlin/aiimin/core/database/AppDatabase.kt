package aiimin.core.database

import android.content.Context
import androidx.room3.Database
import androidx.room3.Room
import androidx.room3.RoomDatabase
import androidx.sqlite.driver.bundled.BundledSQLiteDriver
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton
import kotlinx.coroutines.Dispatchers

@Database(
    entities = [
        EventEntity::class, EventUploadEntity::class, TaskEntity::class, CalendarEventEntity::class,
        MinimumEntity::class, MinimumTickEntity::class, TxnEntity::class, TxnDraftEntity::class,
        PayeeRuleEntity::class, BudgetEntity::class, NoteEntity::class, JournalEntity::class,
        FocusSessionEntity::class, DocEntity::class, DocShareEntity::class, PersonEntity::class,
        EmergencyRequestEntity::class, AccessLogEntity::class, LinkEntity::class, NotificationEntity::class,
        DeviceDayEntity::class, DayStateEntity::class, ChatThreadEntity::class, ChatMessageEntity::class,
    ],
    version = 1,
    exportSchema = true,
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun events(): EventDao
    abstract fun tasks(): TaskDao
    abstract fun calendar(): CalendarDao
    abstract fun minimums(): MinimumDao
    abstract fun money(): MoneyDao
    abstract fun notes(): NoteDao
    abstract fun journal(): JournalDao
    abstract fun focus(): FocusDao
    abstract fun vault(): VaultDao
    abstract fun family(): FamilyDao
    abstract fun links(): LinkDao
    abstract fun notifications(): NotificationDao
    abstract fun deviceDays(): DeviceDayDao
    abstract fun dayState(): DayStateDao
    abstract fun chat(): ChatDao
}

@Module
@InstallIn(SingletonComponent::class)
object DatabaseModule {

    @Provides
    @Singleton
    fun database(@ApplicationContext context: Context): AppDatabase =
        Room.databaseBuilder<AppDatabase>(context, context.getDatabasePath("aiimin-v4.db").absolutePath)
            .setDriver(BundledSQLiteDriver())
            .setQueryCoroutineContext(Dispatchers.IO)
            .build()

    @Provides fun events(db: AppDatabase) = db.events()
    @Provides fun tasks(db: AppDatabase) = db.tasks()
    @Provides fun calendar(db: AppDatabase) = db.calendar()
    @Provides fun minimums(db: AppDatabase) = db.minimums()
    @Provides fun money(db: AppDatabase) = db.money()
    @Provides fun notes(db: AppDatabase) = db.notes()
    @Provides fun journal(db: AppDatabase) = db.journal()
    @Provides fun focus(db: AppDatabase) = db.focus()
    @Provides fun vault(db: AppDatabase) = db.vault()
    @Provides fun family(db: AppDatabase) = db.family()
    @Provides fun links(db: AppDatabase) = db.links()
    @Provides fun notifications(db: AppDatabase) = db.notifications()
    @Provides fun deviceDays(db: AppDatabase) = db.deviceDays()
    @Provides fun dayState(db: AppDatabase) = db.dayState()
    @Provides fun chat(db: AppDatabase) = db.chat()
}
