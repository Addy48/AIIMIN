package aiimin.core.data.knock

import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.core.stringSetPreferencesKey
import java.time.Instant
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.update
import aiimin.core.data.di.ApplicationScope
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.launch

data class KnockPrefs(
    val masterOn: Boolean = true,
    val quietStartMin: Int = 22 * 60 + 30,
    val quietEndMin: Int = 7 * 60,
    val disabled: Set<String> = emptySet(),
    val optInOn: Set<String> = emptySet(),
) {
    fun isOn(ch: KnockChannel): Boolean {
        if (ch.id in disabled) return false
        return if (ch.defaultOn) true else ch.id in optInOn
    }

    val summary: String
        get() {
            if (!masterOn) return "Off"
            val n = KnockChannel.entries.count { isOn(it) }
            return "$n channels · quiet ${fmt(quietStartMin)}–${fmt(quietEndMin)}"
        }

    private fun fmt(min: Int): String =
        "%02d:%02d".format(min / 60, min % 60)
}

@Singleton
class KnockStore @Inject constructor(
    private val dataStore: DataStore<Preferences>,
    @ApplicationScope private val scope: CoroutineScope,
) {
    private val _prefs = MutableStateFlow(KnockPrefs())
    val prefs: StateFlow<KnockPrefs> = _prefs.asStateFlow()

    private var pendingSinceMs: Long? = null
    @Volatile private var pendingDeepLink: String? = null

    init {
        scope.launch { _prefs.value = read() }
    }

    suspend fun read(): KnockPrefs {
        val p = dataStore.data.first()
        val snap = KnockPrefs(
            masterOn = p[Keys.MASTER] ?: true,
            quietStartMin = p[Keys.QUIET_START] ?: (22 * 60 + 30),
            quietEndMin = p[Keys.QUIET_END] ?: (7 * 60),
            disabled = p[Keys.DISABLED] ?: emptySet(),
            optInOn = p[Keys.OPT_IN] ?: emptySet(),
        )
        _prefs.value = snap
        return snap
    }

    fun setMaster(on: Boolean) {
        _prefs.update { it.copy(masterOn = on) }
        scope.launch { dataStore.edit { it[Keys.MASTER] = on } }
    }

    fun setQuiet(startMin: Int, endMin: Int) {
        _prefs.update { it.copy(quietStartMin = startMin, quietEndMin = endMin) }
        scope.launch {
            dataStore.edit {
                it[Keys.QUIET_START] = startMin
                it[Keys.QUIET_END] = endMin
            }
        }
    }

    fun setChannel(ch: KnockChannel, on: Boolean) {
        _prefs.update { cur ->
            if (ch.defaultOn) {
                cur.copy(disabled = if (on) cur.disabled - ch.id else cur.disabled + ch.id)
            } else {
                cur.copy(optInOn = if (on) cur.optInOn + ch.id else cur.optInOn - ch.id)
            }
        }
        persistChannels()
    }

    fun channelMap(): Map<KnockChannel, Boolean> =
        KnockChannel.entries.associateWith { _prefs.value.isOn(it) }

    suspend fun firedToday(nowMs: Long): Set<String> {
        val p = dataStore.data.first()
        val day = dayKey(nowMs)
        if (p[Keys.FIRED_DAY] != day) return emptySet()
        return p[Keys.FIRED_CASES] ?: emptySet()
    }

    suspend fun markFired(nowMs: Long, cases: Collection<String>) {
        if (cases.isEmpty()) return
        val day = dayKey(nowMs)
        dataStore.edit {
            val existing = if (it[Keys.FIRED_DAY] == day) it[Keys.FIRED_CASES] ?: emptySet() else emptySet()
            it[Keys.FIRED_DAY] = day
            it[Keys.FIRED_CASES] = existing + cases
        }
    }

    fun notePending(pending: Int, nowMs: Long): Long {
        if (pending >= 5) {
            if (pendingSinceMs == null) pendingSinceMs = nowMs
        } else {
            pendingSinceMs = null
        }
        return pendingSinceMs?.let { nowMs - it } ?: 0L
    }

    suspend fun markOpenedEvening(nowMs: Long) {
        dataStore.edit { it[Keys.OPENED_EVE] = dayKey(nowMs) }
    }

    suspend fun openedThisEvening(nowMs: Long): Boolean {
        val p = dataStore.data.first()
        return p[Keys.OPENED_EVE] == dayKey(nowMs)
    }

    fun setPendingDeepLink(link: String) {
        pendingDeepLink = link
    }

    fun consumePendingDeepLink(): String? {
        val v = pendingDeepLink
        pendingDeepLink = null
        return v
    }

    private fun persistChannels() {
        val snap = _prefs.value
        scope.launch {
            dataStore.edit {
                it[Keys.DISABLED] = snap.disabled
                it[Keys.OPT_IN] = snap.optInOn
            }
        }
    }

    private fun dayKey(nowMs: Long): String =
        Instant.ofEpochMilli(nowMs).atZone(ZoneId.systemDefault())
            .toLocalDate().format(DAY)

    private object Keys {
        val MASTER = booleanPreferencesKey("knock_master")
        val QUIET_START = intPreferencesKey("knock_quiet_start")
        val QUIET_END = intPreferencesKey("knock_quiet_end")
        val DISABLED = stringSetPreferencesKey("knock_disabled")
        val OPT_IN = stringSetPreferencesKey("knock_opt_in")
        val FIRED_DAY = stringPreferencesKey("knock_fired_day")
        val FIRED_CASES = stringSetPreferencesKey("knock_fired_cases")
        val OPENED_EVE = stringPreferencesKey("knock_opened_eve")
    }

    companion object {
        private val DAY = DateTimeFormatter.ISO_LOCAL_DATE
    }
}
