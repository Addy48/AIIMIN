package aiimin.core.data

import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.Locale
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update

/**
 * Journal — local reflection (G7).
 *
 * Templates · mood 1–5 · draft · history. Voice / search / export land later.
 */
@Singleton
class JournalStore @Inject constructor() {

    private val _state = MutableStateFlow(JournalState.seed())
    val state: StateFlow<JournalState> = _state.asStateFlow()

    fun setTemplate(template: JournalTemplate) = _state.update {
        it.copy(template = template)
    }

    fun setDraft(value: String) = _state.update { it.copy(draft = value) }

    fun setMood(mood: Int) = _state.update {
        if (mood !in 1..5) return@update it
        it.copy(mood = mood)
    }

    fun save(): Boolean {
        val s = _state.value
        val body = s.draft.trim()
        if (body.isEmpty()) return false
        val entry = JournalEntry(
            date = todayLabel(),
            template = s.template,
            mood = s.mood,
            excerpt = body.take(140),
            body = body,
        )
        _state.update {
            it.copy(
                entries = listOf(entry) + it.entries,
                draft = "",
                notice = JournalNotice("Saved · ${s.template.label}"),
            )
        }
        return true
    }

    fun dismissNotice() = _state.update { it.copy(notice = null) }
}

enum class JournalTemplate(val label: String, val prompt: String) {
    FREE_WRITE("FREE WRITE", "Write freely. No structure — just the day as it lands."),
    CBT("CBT", "Situation → thought → feeling → evidence → reframe."),
    MORNING_PAGES("MORNING PAGES", "Three pages, unfiltered, before the day claims you."),
    WEEKLY_REVIEW("WEEKLY REVIEW", "What worked, what slipped, what one change next week."),
}

data class JournalEntry(
    val date: String,
    val template: JournalTemplate,
    val mood: Int,
    val excerpt: String,
    val body: String,
)

data class JournalNotice(val message: String)

data class JournalState(
    val template: JournalTemplate,
    val draft: String,
    val mood: Int,
    val entries: List<JournalEntry>,
    val headMeta: String,
    val notice: JournalNotice? = null,
) {
    companion object {
        val MOOD_LABELS = listOf("ROUGH", "OFF", "OKAY", "GOOD", "STRONG")

        fun seed() = JournalState(
            template = JournalTemplate.FREE_WRITE,
            draft = "",
            mood = 3,
            entries = listOf(
                JournalEntry(
                    date = "01.08",
                    template = JournalTemplate.MORNING_PAGES,
                    mood = 4,
                    excerpt = "Woke clear. Walked before the inbox. Want this to be the default, not the exception.",
                    body = "Woke clear. Walked before the inbox. Want this to be the default, not the exception.",
                ),
                JournalEntry(
                    date = "31.07",
                    template = JournalTemplate.CBT,
                    mood = 2,
                    excerpt = "Thought: behind on everything. Evidence: three things shipped. Reframe: crowded, not failing.",
                    body = "Thought: behind on everything. Evidence: three things shipped. Reframe: crowded, not failing.",
                ),
            ),
            headMeta = todayLabel().uppercase(Locale.US),
        )
    }
}

private fun todayLabel(): String =
    LocalDate.now().format(DateTimeFormatter.ofPattern("dd.MM", Locale.US))
