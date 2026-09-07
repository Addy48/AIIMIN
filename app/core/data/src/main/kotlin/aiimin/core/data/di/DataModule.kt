package aiimin.core.data.di

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.core.handlers.ReplaceFileCorruptionHandler
import androidx.datastore.preferences.core.PreferenceDataStoreFactory
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.emptyPreferences
import androidx.datastore.preferences.preferencesDataStoreFile
import aiimin.core.data.DiscoveryPrefs
import aiimin.core.data.prefs.AppPreferences
import aiimin.core.data.prefs.DataStoreAppPreferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringSetPreferencesKey
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Qualifier
import javax.inject.Singleton
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.flow.first

@Qualifier
@Retention(AnnotationRetention.BINARY)
annotation class ApplicationScope

@Module
@InstallIn(SingletonComponent::class)
object DataModule {

    private const val PREFS_FILE = "aiimin_prefs"
    private val DISCOVERY_DISMISSED = stringSetPreferencesKey("discovery_dismissed")

    @Provides
    @Singleton
    @ApplicationScope
    fun applicationScope(): CoroutineScope =
        CoroutineScope(SupervisorJob() + Dispatchers.Default)

    @Provides
    @Singleton
    fun preferencesDataStore(
        @ApplicationContext context: Context,
        @ApplicationScope scope: CoroutineScope,
    ): DataStore<Preferences> = PreferenceDataStoreFactory.create(
        corruptionHandler = ReplaceFileCorruptionHandler { emptyPreferences() },
        scope = scope,
        produceFile = { context.preferencesDataStoreFile(PREFS_FILE) },
    )

    @Provides
    @Singleton
    fun appPreferences(dataStore: DataStore<Preferences>): AppPreferences =
        DataStoreAppPreferences(dataStore)

    @Provides
    @Singleton
    fun discoveryPrefs(dataStore: DataStore<Preferences>): DiscoveryPrefs =
        object : DiscoveryPrefs {
            override suspend fun readDismissed(): Set<String> =
                dataStore.data.first()[DISCOVERY_DISMISSED] ?: emptySet()

            override suspend fun dismiss(id: String) {
                dataStore.edit { prefs ->
                    val next = (prefs[DISCOVERY_DISMISSED] ?: emptySet()) + id
                    prefs[DISCOVERY_DISMISSED] = next
                }
            }
        }
}
