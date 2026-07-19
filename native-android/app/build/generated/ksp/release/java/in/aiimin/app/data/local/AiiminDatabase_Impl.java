package in.aiimin.app.data.local;

import androidx.annotation.NonNull;
import androidx.room.DatabaseConfiguration;
import androidx.room.InvalidationTracker;
import androidx.room.RoomDatabase;
import androidx.room.RoomOpenHelper;
import androidx.room.migration.AutoMigrationSpec;
import androidx.room.migration.Migration;
import androidx.room.util.DBUtil;
import androidx.room.util.TableInfo;
import androidx.sqlite.db.SupportSQLiteDatabase;
import androidx.sqlite.db.SupportSQLiteOpenHelper;
import java.lang.Class;
import java.lang.Override;
import java.lang.String;
import java.lang.SuppressWarnings;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import javax.annotation.processing.Generated;

@Generated("androidx.room.RoomProcessor")
@SuppressWarnings({"unchecked", "deprecation"})
public final class AiiminDatabase_Impl extends AiiminDatabase {
  private volatile OutboxDao _outboxDao;

  private volatile HabitCacheDao _habitCacheDao;

  private volatile NoteCacheDao _noteCacheDao;

  private volatile JournalCacheDao _journalCacheDao;

  @Override
  @NonNull
  protected SupportSQLiteOpenHelper createOpenHelper(@NonNull final DatabaseConfiguration config) {
    final SupportSQLiteOpenHelper.Callback _openCallback = new RoomOpenHelper(config, new RoomOpenHelper.Delegate(1) {
      @Override
      public void createAllTables(@NonNull final SupportSQLiteDatabase db) {
        db.execSQL("CREATE TABLE IF NOT EXISTS `outbox` (`id` TEXT NOT NULL, `type` TEXT NOT NULL, `payloadJson` TEXT NOT NULL, `createdAt` INTEGER NOT NULL, `retries` INTEGER NOT NULL, `status` TEXT NOT NULL, PRIMARY KEY(`id`))");
        db.execSQL("CREATE TABLE IF NOT EXISTS `habit_cache` (`id` TEXT NOT NULL, `name` TEXT NOT NULL, `emoji` TEXT NOT NULL, `doneToday` INTEGER NOT NULL, PRIMARY KEY(`id`))");
        db.execSQL("CREATE TABLE IF NOT EXISTS `note_cache` (`id` TEXT NOT NULL, `title` TEXT NOT NULL, `content` TEXT NOT NULL, `color` TEXT NOT NULL, `pinned` INTEGER NOT NULL, `updatedAt` INTEGER NOT NULL, PRIMARY KEY(`id`))");
        db.execSQL("CREATE TABLE IF NOT EXISTS `journal_cache` (`id` TEXT NOT NULL, `date` TEXT NOT NULL, `content` TEXT NOT NULL, `updatedAt` INTEGER NOT NULL, PRIMARY KEY(`id`))");
        db.execSQL("CREATE TABLE IF NOT EXISTS room_master_table (id INTEGER PRIMARY KEY,identity_hash TEXT)");
        db.execSQL("INSERT OR REPLACE INTO room_master_table (id,identity_hash) VALUES(42, '38311e1a9fc9a9bb4877aa4179844da3')");
      }

      @Override
      public void dropAllTables(@NonNull final SupportSQLiteDatabase db) {
        db.execSQL("DROP TABLE IF EXISTS `outbox`");
        db.execSQL("DROP TABLE IF EXISTS `habit_cache`");
        db.execSQL("DROP TABLE IF EXISTS `note_cache`");
        db.execSQL("DROP TABLE IF EXISTS `journal_cache`");
        final List<? extends RoomDatabase.Callback> _callbacks = mCallbacks;
        if (_callbacks != null) {
          for (RoomDatabase.Callback _callback : _callbacks) {
            _callback.onDestructiveMigration(db);
          }
        }
      }

      @Override
      public void onCreate(@NonNull final SupportSQLiteDatabase db) {
        final List<? extends RoomDatabase.Callback> _callbacks = mCallbacks;
        if (_callbacks != null) {
          for (RoomDatabase.Callback _callback : _callbacks) {
            _callback.onCreate(db);
          }
        }
      }

      @Override
      public void onOpen(@NonNull final SupportSQLiteDatabase db) {
        mDatabase = db;
        internalInitInvalidationTracker(db);
        final List<? extends RoomDatabase.Callback> _callbacks = mCallbacks;
        if (_callbacks != null) {
          for (RoomDatabase.Callback _callback : _callbacks) {
            _callback.onOpen(db);
          }
        }
      }

      @Override
      public void onPreMigrate(@NonNull final SupportSQLiteDatabase db) {
        DBUtil.dropFtsSyncTriggers(db);
      }

      @Override
      public void onPostMigrate(@NonNull final SupportSQLiteDatabase db) {
      }

      @Override
      @NonNull
      public RoomOpenHelper.ValidationResult onValidateSchema(
          @NonNull final SupportSQLiteDatabase db) {
        final HashMap<String, TableInfo.Column> _columnsOutbox = new HashMap<String, TableInfo.Column>(6);
        _columnsOutbox.put("id", new TableInfo.Column("id", "TEXT", true, 1, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsOutbox.put("type", new TableInfo.Column("type", "TEXT", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsOutbox.put("payloadJson", new TableInfo.Column("payloadJson", "TEXT", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsOutbox.put("createdAt", new TableInfo.Column("createdAt", "INTEGER", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsOutbox.put("retries", new TableInfo.Column("retries", "INTEGER", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsOutbox.put("status", new TableInfo.Column("status", "TEXT", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        final HashSet<TableInfo.ForeignKey> _foreignKeysOutbox = new HashSet<TableInfo.ForeignKey>(0);
        final HashSet<TableInfo.Index> _indicesOutbox = new HashSet<TableInfo.Index>(0);
        final TableInfo _infoOutbox = new TableInfo("outbox", _columnsOutbox, _foreignKeysOutbox, _indicesOutbox);
        final TableInfo _existingOutbox = TableInfo.read(db, "outbox");
        if (!_infoOutbox.equals(_existingOutbox)) {
          return new RoomOpenHelper.ValidationResult(false, "outbox(in.aiimin.app.data.local.OutboxEntity).\n"
                  + " Expected:\n" + _infoOutbox + "\n"
                  + " Found:\n" + _existingOutbox);
        }
        final HashMap<String, TableInfo.Column> _columnsHabitCache = new HashMap<String, TableInfo.Column>(4);
        _columnsHabitCache.put("id", new TableInfo.Column("id", "TEXT", true, 1, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsHabitCache.put("name", new TableInfo.Column("name", "TEXT", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsHabitCache.put("emoji", new TableInfo.Column("emoji", "TEXT", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsHabitCache.put("doneToday", new TableInfo.Column("doneToday", "INTEGER", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        final HashSet<TableInfo.ForeignKey> _foreignKeysHabitCache = new HashSet<TableInfo.ForeignKey>(0);
        final HashSet<TableInfo.Index> _indicesHabitCache = new HashSet<TableInfo.Index>(0);
        final TableInfo _infoHabitCache = new TableInfo("habit_cache", _columnsHabitCache, _foreignKeysHabitCache, _indicesHabitCache);
        final TableInfo _existingHabitCache = TableInfo.read(db, "habit_cache");
        if (!_infoHabitCache.equals(_existingHabitCache)) {
          return new RoomOpenHelper.ValidationResult(false, "habit_cache(in.aiimin.app.data.local.HabitCacheEntity).\n"
                  + " Expected:\n" + _infoHabitCache + "\n"
                  + " Found:\n" + _existingHabitCache);
        }
        final HashMap<String, TableInfo.Column> _columnsNoteCache = new HashMap<String, TableInfo.Column>(6);
        _columnsNoteCache.put("id", new TableInfo.Column("id", "TEXT", true, 1, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsNoteCache.put("title", new TableInfo.Column("title", "TEXT", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsNoteCache.put("content", new TableInfo.Column("content", "TEXT", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsNoteCache.put("color", new TableInfo.Column("color", "TEXT", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsNoteCache.put("pinned", new TableInfo.Column("pinned", "INTEGER", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsNoteCache.put("updatedAt", new TableInfo.Column("updatedAt", "INTEGER", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        final HashSet<TableInfo.ForeignKey> _foreignKeysNoteCache = new HashSet<TableInfo.ForeignKey>(0);
        final HashSet<TableInfo.Index> _indicesNoteCache = new HashSet<TableInfo.Index>(0);
        final TableInfo _infoNoteCache = new TableInfo("note_cache", _columnsNoteCache, _foreignKeysNoteCache, _indicesNoteCache);
        final TableInfo _existingNoteCache = TableInfo.read(db, "note_cache");
        if (!_infoNoteCache.equals(_existingNoteCache)) {
          return new RoomOpenHelper.ValidationResult(false, "note_cache(in.aiimin.app.data.local.NoteCacheEntity).\n"
                  + " Expected:\n" + _infoNoteCache + "\n"
                  + " Found:\n" + _existingNoteCache);
        }
        final HashMap<String, TableInfo.Column> _columnsJournalCache = new HashMap<String, TableInfo.Column>(4);
        _columnsJournalCache.put("id", new TableInfo.Column("id", "TEXT", true, 1, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsJournalCache.put("date", new TableInfo.Column("date", "TEXT", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsJournalCache.put("content", new TableInfo.Column("content", "TEXT", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsJournalCache.put("updatedAt", new TableInfo.Column("updatedAt", "INTEGER", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        final HashSet<TableInfo.ForeignKey> _foreignKeysJournalCache = new HashSet<TableInfo.ForeignKey>(0);
        final HashSet<TableInfo.Index> _indicesJournalCache = new HashSet<TableInfo.Index>(0);
        final TableInfo _infoJournalCache = new TableInfo("journal_cache", _columnsJournalCache, _foreignKeysJournalCache, _indicesJournalCache);
        final TableInfo _existingJournalCache = TableInfo.read(db, "journal_cache");
        if (!_infoJournalCache.equals(_existingJournalCache)) {
          return new RoomOpenHelper.ValidationResult(false, "journal_cache(in.aiimin.app.data.local.JournalCacheEntity).\n"
                  + " Expected:\n" + _infoJournalCache + "\n"
                  + " Found:\n" + _existingJournalCache);
        }
        return new RoomOpenHelper.ValidationResult(true, null);
      }
    }, "38311e1a9fc9a9bb4877aa4179844da3", "1a6018c2a7ed266d3b29f38db89f3f73");
    final SupportSQLiteOpenHelper.Configuration _sqliteConfig = SupportSQLiteOpenHelper.Configuration.builder(config.context).name(config.name).callback(_openCallback).build();
    final SupportSQLiteOpenHelper _helper = config.sqliteOpenHelperFactory.create(_sqliteConfig);
    return _helper;
  }

  @Override
  @NonNull
  protected InvalidationTracker createInvalidationTracker() {
    final HashMap<String, String> _shadowTablesMap = new HashMap<String, String>(0);
    final HashMap<String, Set<String>> _viewTables = new HashMap<String, Set<String>>(0);
    return new InvalidationTracker(this, _shadowTablesMap, _viewTables, "outbox","habit_cache","note_cache","journal_cache");
  }

  @Override
  public void clearAllTables() {
    super.assertNotMainThread();
    final SupportSQLiteDatabase _db = super.getOpenHelper().getWritableDatabase();
    try {
      super.beginTransaction();
      _db.execSQL("DELETE FROM `outbox`");
      _db.execSQL("DELETE FROM `habit_cache`");
      _db.execSQL("DELETE FROM `note_cache`");
      _db.execSQL("DELETE FROM `journal_cache`");
      super.setTransactionSuccessful();
    } finally {
      super.endTransaction();
      _db.query("PRAGMA wal_checkpoint(FULL)").close();
      if (!_db.inTransaction()) {
        _db.execSQL("VACUUM");
      }
    }
  }

  @Override
  @NonNull
  protected Map<Class<?>, List<Class<?>>> getRequiredTypeConverters() {
    final HashMap<Class<?>, List<Class<?>>> _typeConvertersMap = new HashMap<Class<?>, List<Class<?>>>();
    _typeConvertersMap.put(OutboxDao.class, OutboxDao_Impl.getRequiredConverters());
    _typeConvertersMap.put(HabitCacheDao.class, HabitCacheDao_Impl.getRequiredConverters());
    _typeConvertersMap.put(NoteCacheDao.class, NoteCacheDao_Impl.getRequiredConverters());
    _typeConvertersMap.put(JournalCacheDao.class, JournalCacheDao_Impl.getRequiredConverters());
    return _typeConvertersMap;
  }

  @Override
  @NonNull
  public Set<Class<? extends AutoMigrationSpec>> getRequiredAutoMigrationSpecs() {
    final HashSet<Class<? extends AutoMigrationSpec>> _autoMigrationSpecsSet = new HashSet<Class<? extends AutoMigrationSpec>>();
    return _autoMigrationSpecsSet;
  }

  @Override
  @NonNull
  public List<Migration> getAutoMigrations(
      @NonNull final Map<Class<? extends AutoMigrationSpec>, AutoMigrationSpec> autoMigrationSpecs) {
    final List<Migration> _autoMigrations = new ArrayList<Migration>();
    return _autoMigrations;
  }

  @Override
  public OutboxDao outbox() {
    if (_outboxDao != null) {
      return _outboxDao;
    } else {
      synchronized(this) {
        if(_outboxDao == null) {
          _outboxDao = new OutboxDao_Impl(this);
        }
        return _outboxDao;
      }
    }
  }

  @Override
  public HabitCacheDao habits() {
    if (_habitCacheDao != null) {
      return _habitCacheDao;
    } else {
      synchronized(this) {
        if(_habitCacheDao == null) {
          _habitCacheDao = new HabitCacheDao_Impl(this);
        }
        return _habitCacheDao;
      }
    }
  }

  @Override
  public NoteCacheDao notes() {
    if (_noteCacheDao != null) {
      return _noteCacheDao;
    } else {
      synchronized(this) {
        if(_noteCacheDao == null) {
          _noteCacheDao = new NoteCacheDao_Impl(this);
        }
        return _noteCacheDao;
      }
    }
  }

  @Override
  public JournalCacheDao journal() {
    if (_journalCacheDao != null) {
      return _journalCacheDao;
    } else {
      synchronized(this) {
        if(_journalCacheDao == null) {
          _journalCacheDao = new JournalCacheDao_Impl(this);
        }
        return _journalCacheDao;
      }
    }
  }
}
