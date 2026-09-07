package aiimin.core.data

import aiimin.core.data.di.ApplicationScope
import aiimin.core.data.prefs.AppPreferences
import aiimin.core.data.prefs.InMemoryAppPreferences
import aiimin.core.data.prefs.PersistedPrefs
import aiimin.core.model.LifeMode
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

/**
 * Config prefs and identity strip — local (G7). Appearance drives [AiiminTheme]
 * from MainActivity. Durable fields (theme, reduce-motion, calibration identity)
 * land in [AppPreferences]; Day/Money seed stays in-memory until the API.
 */
@Singleton
class ConfigStore @Inject constructor(
    private val prefs: AppPreferences,
    @ApplicationScope private val scope: CoroutineScope,
) {

    /** Unit tests — in-memory prefs, no Android Context. */
    constructor() : this(
        InMemoryAppPreferences(),
        CoroutineScope(SupervisorJob() + Dispatchers.Unconfined),
    )

    private val _state = MutableStateFlow(ConfigState.seed())
    val state: StateFlow<ConfigState> = _state.asStateFlow()

    init {
        scope.launch {
            _state.value = ConfigState.seed().withPersisted(prefs.read())
        }
    }

    fun toggleTheme() {
        _state.update { it.copy(darkTheme = !it.darkTheme) }
        persist { writeTheme(_state.value.darkTheme) }
    }

    fun setDarkTheme(dark: Boolean) {
        _state.update { it.copy(darkTheme = dark) }
        persist { writeTheme(dark) }
    }

    fun toggleReduceMotion() {
        _state.update { it.copy(reduceMotion = !it.reduceMotion) }
        persist { writeReduceMotion(_state.value.reduceMotion) }
    }

    fun setBiometricEnabled(on: Boolean) {
        _state.update { it.copy(biometricEnabled = on) }
        persist { writeBiometricEnabled(on) }
    }

    fun toggleBiometric() = setBiometricEnabled(!_state.value.biometricEnabled)

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

    fun finishSyncLive(atMillis: Long, pending: Int = 0) {
        val ago = if (pending > 0) {
            "Just now · API · $pending pending"
        } else {
            "Just now · API"
        }
        _state.update {
            it.copy(
                sync = SyncState.LIVE,
                syncMeta = ago,
                isSeed = false,
                notice = ConfigNotice(
                    if (pending > 0) "Graph synced · $pending still queued"
                    else "Graph synced with aiimin.in",
                ),
            )
        }
    }

    fun applyRemoteIdentity(name: String?, email: String?, username: String? = null) {
        _state.update { current ->
            val cleanEmail = email?.takeIf { it.isNotBlank() }
            current.copy(
                identity = current.identity.copy(
                    name = name?.takeIf { it.isNotBlank() } ?: current.identity.name,
                    email = cleanEmail ?: current.identity.email,
                    // Never invent an OS-ID from the email prefix — Google on web
                    // already bound Gmail to the real plate.
                ),
                isSeed = false,
            )
        }
        username?.let { rememberOsId(it) }
    }

    /** Persist the plate the human signed in with. */
    fun rememberOsId(osId: String) {
        val id = aiimin.core.model.OsIdRules.normalize(osId)
        if (!aiimin.core.model.OsIdRules.isValid(id)) return
        _state.update {
            it.copy(
                identity = it.identity.copy(osId = id),
                isSeed = false,
            )
        }
        persist {
            writeCalibration(id, _state.value.identity.arc, _state.value.minimumsLabel)
        }
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

    /**
     * Calibration settle — local identity write. Replaces seed OS-ID / arc /
     * minimums label. Does not hit the network. Persists across process death.
     */
    fun applyCalibration(osId: String, arc: String, minimumsCount: Int) {
        val label = "$minimumsCount set"
        _state.update {
            it.copy(
                identity = it.identity.copy(osId = osId, arc = arc),
                minimumsLabel = label,
                isSeed = false,
                notice = ConfigNotice("Calibration locked locally · $osId"),
            )
        }
        persist { writeCalibration(osId, arc, label) }
    }

    /**
     * Local plan switch — same instant-apply as web when offline.
     * When signed in, [ConfigViewModel] posts `/billing/select-tier` first.
     */
    fun setSubscriptionTier(
        tier: aiimin.core.model.SubscriptionTier,
        periodEndIso: String? = null,
        upgradeOnly: Boolean? = null,
        notice: String? = "Plan · ${tier.label} · app + web unlocks updated",
    ) {
        _state.update {
            it.copy(
                identity = it.identity.copy(
                    tier = tier,
                    tierLabel = tier.label.uppercase(),
                    periodEndIso = periodEndIso ?: it.identity.periodEndIso,
                ),
                upgradeOnly = upgradeOnly ?: it.upgradeOnly,
                notice = notice?.let { msg -> ConfigNotice(msg) },
            )
        }
        persist { writeSubscriptionTier(tier.id) }
        _openPlan.value = false
        _planFocus.value = null
    }

    /** Pull remote status into local prefs (no notice unless tier changed). */
    fun applyBillingStatus(
        tier: aiimin.core.model.SubscriptionTier,
        periodEndIso: String?,
        upgradeOnly: Boolean,
    ) {
        _state.update {
            it.copy(
                identity = it.identity.copy(
                    tier = tier,
                    tierLabel = tier.label.uppercase(),
                    periodEndIso = periodEndIso,
                ),
                upgradeOnly = upgradeOnly,
            )
        }
        persist { writeSubscriptionTier(tier.id) }
    }

    private val _openPlan = MutableStateFlow(false)
    val openPlan: StateFlow<Boolean> = _openPlan.asStateFlow()

    private val _planFocus = MutableStateFlow<aiimin.core.model.SubscriptionTier?>(null)
    val planFocus: StateFlow<aiimin.core.model.SubscriptionTier?> = _planFocus.asStateFlow()

    fun requestOpenPlan(focus: aiimin.core.model.SubscriptionTier? = null) {
        _planFocus.value = focus
        _openPlan.value = true
    }

    fun dismissPlanSheet() {
        _openPlan.value = false
        _planFocus.value = null
    }

    fun consumePlanFocus(): aiimin.core.model.SubscriptionTier? {
        val v = _planFocus.value
        _planFocus.value = null
        return v
    }

    private fun persist(block: suspend AppPreferences.() -> Unit) {
        scope.launch { prefs.block() }
    }
}

enum class SyncState(val label: String, val defaultMeta: String) {
    LIVE("LIVE", "Up to date"),
    SYNCING("SYNCING", "Pulling the graph…"),
    HELD("HELD LOCALLY", "Writes wait until the line returns"),
    DEMO("DEMO", "Local demo · not synced to aiimin.in"),
}

data class ConfigNotice(val message: String)

data class ConfigIdentity(
    val name: String,
    val osId: String,
    /** Account email from remote identity — null when unsigned / seed. */
    val email: String? = null,
    val tierLabel: String,
    val tier: aiimin.core.model.SubscriptionTier =
        aiimin.core.model.SubscriptionTier.fromId(tierLabel),
    /** ISO from `/billing/status` · `current_period_end`. */
    val periodEndIso: String? = null,
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
    val biometricEnabled: Boolean = false,
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
    /** Mirrors web `upgrade_only` — block degrade CTAs when true. */
    val upgradeOnly: Boolean = false,
) {
    val themeName: String get() = if (darkTheme) "AIIMIN Dark" else "AIIMIN Light"

    fun withPersisted(p: PersistedPrefs): ConfigState = copy(
        darkTheme = p.darkTheme,
        reduceMotion = p.reduceMotion,
        biometricEnabled = p.biometricEnabled,
        isSeed = p.isSeed,
        minimumsLabel = p.minimumsLabel ?: minimumsLabel,
        identity = identity.copy(
            osId = p.osId ?: identity.osId,
            arc = p.arc ?: identity.arc,
            tier = p.subscriptionTier
                ?.let { aiimin.core.model.SubscriptionTier.fromId(it) }
                ?: identity.tier,
            tierLabel = p.subscriptionTier
                ?.let { aiimin.core.model.SubscriptionTier.fromId(it).label.uppercase() }
                ?: identity.tierLabel,
        ),
    )

    companion object {
        fun seed() = ConfigState(
            darkTheme = true,
            reduceMotion = false,
            biometricEnabled = false,
            sync = SyncState.LIVE,
            syncMeta = "Up to date · local demo",
            identity = ConfigIdentity(
                name = "Aaditya Upadhyay",
                osId = "AADI2004",
                tierLabel = "CORE",
                tier = aiimin.core.model.SubscriptionTier.CORE,
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
            connectionsLabel = "None · tap to add",
            exportLabel = "TXT + JSON · AI pack",
            buildLabel = "AIIMIN 3.0.0-alpha01 · LOCAL",
            isSeed = true,
        )
    }
}

/** Modes Config can switch — same enum Today reads. */
val ConfigLifeModes: List<LifeMode> = LifeMode.entries
