package aiimin.core.data

import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update

/**
 * Feature discovery tips — Config "Find your way" + dismiss persistence via [DiscoveryPrefs].
 */
@Singleton
class DiscoveryStore @Inject constructor(
    private val prefs: DiscoveryPrefs,
) {

    private val _state = MutableStateFlow(DiscoveryState.from(emptySet()))
    val state: StateFlow<DiscoveryState> = _state.asStateFlow()

    suspend fun hydrate() {
        val dismissed = prefs.readDismissed()
        _state.value = DiscoveryState.from(dismissed)
    }

    suspend fun dismiss(id: String) {
        prefs.dismiss(id)
        _state.update { DiscoveryState.from(prefs.readDismissed()) }
    }

    fun reset() {
        _state.value = DiscoveryState.from(emptySet())
    }
}

/** Thin prefs face — implemented by DataStore wrapper without bloating AppPreferences. */
interface DiscoveryPrefs {
    suspend fun readDismissed(): Set<String>
    suspend fun dismiss(id: String)
}

data class DiscoveryTip(
    val id: String,
    val title: String,
    val body: String,
    val actionLabel: String,
    val action: DiscoveryAction,
)

enum class DiscoveryAction {
    OPEN_ENGLISH,
    OPEN_TODAY_INSIGHTS,
    OPEN_EXPORT,
    OPEN_PLAN,
    OPEN_JOURNAL,
    NONE,
}

data class DiscoveryState(
    val tips: List<DiscoveryTip>,
    val unread: Int,
) {
    companion object {
        private val CATALOG = listOf(
            DiscoveryTip(
                id = "english_spark",
                title = "English · 60s Spark",
                body = "Native speaking drill with self-score. Syncs streak + mastery to the Lab.",
                actionLabel = "OPEN ENGLISH",
                action = DiscoveryAction.OPEN_ENGLISH,
            ),
            DiscoveryTip(
                id = "device_insights",
                title = "Long-press STEPS / SCREEN",
                body = "Deep day read — bands, pace, app share. Triple-tap edits goals.",
                actionLabel = "GO TO TODAY",
                action = DiscoveryAction.OPEN_TODAY_INSIGHTS,
            ),
            DiscoveryTip(
                id = "export_range",
                title = "Export 7 / 14 / 30",
                body = "Life pack as Markdown + JSON — share anywhere.",
                actionLabel = "EXPORT",
                action = DiscoveryAction.OPEN_EXPORT,
            ),
            DiscoveryTip(
                id = "plan_catalog",
                title = "Plans · Explore → Elite",
                body = "Tap the plan chip. Upgrade path is honest — no fake downgrade.",
                actionLabel = "SEE PLANS",
                action = DiscoveryAction.OPEN_PLAN,
            ),
            DiscoveryTip(
                id = "journal_write",
                title = "Journal · write first",
                body = "Prompts optional. Saved entries sync with the graph.",
                actionLabel = "OPEN JOURNAL",
                action = DiscoveryAction.OPEN_JOURNAL,
            ),
        )

        fun from(dismissed: Set<String>): DiscoveryState {
            val tips = CATALOG.filter { it.id !in dismissed }
            return DiscoveryState(tips = tips, unread = tips.size)
        }
    }
}
