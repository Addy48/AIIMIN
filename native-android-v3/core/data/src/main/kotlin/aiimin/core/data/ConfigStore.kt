package aiimin.core.data

import aiimin.core.model.LifeMode
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update

/**
 * Config prefs and identity strip — local (G7). Appearance drives [AiiminTheme]
 * from MainActivity. Life mode lives on [DayStore] so Today and Config agree.
 */
@Singleton
class ConfigStore @Inject constructor() {

    private val _state = MutableStateFlow(ConfigState.seed())
    val state: StateFlow<ConfigState> = _state.asStateFlow()

    fun toggleTheme() = _state.update {
        it.copy(darkTheme = !it.darkTheme)
    }

    fun setDarkTheme(dark: Boolean) = _state.update { it.copy(darkTheme = dark) }

    fun toggleReduceMotion() = _state.update {
        it.copy(reduceMotion = !it.reduceMotion)
    }

    fun setSync(state: SyncState, meta: String = state.defaultMeta) = _state.update {
        it.copy(sync = state, syncMeta = meta)
    }

    /** Local-only "sync" — flips LIVE ↔ SYNCING, never hits the network. */
    fun syncNow() = _state.update { current ->
        when (current.sync) {
            SyncState.SYNCING -> current
            else -> current.copy(
                sync = SyncState.SYNCING,
                syncMeta = "Pulling the graph…",
                notice = null,
            )
        }
    }

    fun finishSync() = _state.update {
        it.copy(
            sync = SyncState.LIVE,
            syncMeta = "Just now · local demo",
            notice = ConfigNotice("Synced locally. Live pull arrives with the API."),
        )
    }

    fun setNotice(message: String?) = _state.update {
        it.copy(notice = message?.let(::ConfigNotice))
    }

    fun clearNotice() = _state.update { it.copy(notice = null) }

    /**
     * Destructive path refused on device. Founder must confirm on the live
     * account later — never a silent wipe (G6).
     */
    fun refuseDelete(typed: String): Boolean {
        val ok = typed.trim().equals("DELETE", ignoreCase = false)
        if (!ok) {
            _state.update {
                it.copy(notice = ConfigNotice("Type DELETE exactly to continue — still local-only."))
            }
            return false
        }
        _state.update {
            it.copy(
                deleteOpen = false,
                deleteDraft = "",
                notice = ConfigNotice("Refused. Account deletion needs the live API — nothing was erased."),
            )
        }
        return true
    }

    fun openDelete() = _state.update { it.copy(deleteOpen = true, deleteDraft = "") }

    fun closeDelete() = _state.update { it.copy(deleteOpen = false, deleteDraft = "") }

    fun setDeleteDraft(value: String) = _state.update { it.copy(deleteDraft = value) }
}

enum class SyncState(val label: String, val defaultMeta: String) {
    LIVE("LIVE", "Up to date · local demo"),
    SYNCING("SYNCING", "Pulling the graph…"),
    HELD("HELD LOCALLY", "Writes wait until the line returns"),
}

data class ConfigNotice(val message: String)

data class ConfigIdentity(
    val name: String,
    val osId: String,
    val tierLabel: String,
    val arc: String,
    val rank: String,
    val rankNo: Int,
    val rankTotal: Int,
    val xp: Int,
    val xpToNext: Int,
    val nextRank: String,
) {
    val xpPct: Float
        get() {
            val total = (xp + xpToNext).coerceAtLeast(1)
            return xp.toFloat() / total.toFloat()
        }
}

data class ConfigState(
    val darkTheme: Boolean,
    val reduceMotion: Boolean,
    val sync: SyncState,
    val syncMeta: String,
    val identity: ConfigIdentity,
    val notificationsLabel: String,
    val minimumsLabel: String,
    val connectionsLabel: String,
    val exportLabel: String,
    val buildLabel: String,
    val isSeed: Boolean,
    val deleteOpen: Boolean = false,
    val deleteDraft: String = "",
    val notice: ConfigNotice? = null,
) {
    val themeName: String get() = if (darkTheme) "Dark · Drafting Table" else "Light · Industry sheet"

    companion object {
        fun seed() = ConfigState(
            darkTheme = true,
            reduceMotion = false,
            sync = SyncState.LIVE,
            syncMeta = "Up to date · local demo",
            identity = ConfigIdentity(
                name = "Aaditya Upadhyay",
                osId = "AADI2004",
                tierLabel = "CORE",
                arc = "Become a good person — the only path worth pursuing.",
                rank = "CHAMPION",
                rankNo = 6,
                rankTotal = 10,
                xp = 17_091,
                xpToNext = 2_909,
                nextRank = "LEGEND",
            ),
            notificationsLabel = "Evening only",
            minimumsLabel = "5 set",
            connectionsLabel = "Google, HDFC, Fi",
            exportLabel = "JSON, CSV",
            buildLabel = "AIIMIN 3.0.0-alpha01 · LOCAL",
            isSeed = true,
        )
    }
}

/** Modes Config can switch — same enum Today reads. */
val ConfigLifeModes: List<LifeMode> = LifeMode.entries
