package aiimin.core.data

import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import java.time.LocalDate
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.first
import org.json.JSONArray
import org.json.JSONObject

/**
 * One motivational line for Day — never the user's name.
 * Picks a quote that has not appeared in the last [NO_REPEAT_DAYS] calendar days.
 */
@Singleton
class DayQuoteRepository @Inject constructor(
    private val dataStore: DataStore<Preferences>,
) {
    private val _quote = MutableStateFlow("")
    val quote: StateFlow<String> = _quote.asStateFlow()

    suspend fun ensureToday() {
        val today = LocalDate.now().toString()
        val prefs = dataStore.data.first()
        val cachedDay = prefs[KEY_QUOTE_DAY]
        val cachedId = prefs[KEY_QUOTE_ID]?.toIntOrNull()
        if (cachedDay == today && cachedId != null && cachedId in QUOTES.indices) {
            _quote.value = QUOTES[cachedId]
            return
        }
        val history = parseHistory(prefs[KEY_QUOTE_HISTORY])
        val cutoff = LocalDate.now().toEpochDay() - NO_REPEAT_DAYS
        val recent = history.filter { it.epochDay >= cutoff }.map { it.id }.toSet()
        val pool = QUOTES.indices.filter { it !in recent }.ifEmpty { QUOTES.indices.toList() }
        val pick = pool.random()
        val nextHistory = (history + QuoteHit(pick, LocalDate.now().toEpochDay()))
            .filter { it.epochDay >= cutoff }
            .takeLast((NO_REPEAT_DAYS + 5).toInt())
        dataStore.edit {
            it[KEY_QUOTE_DAY] = today
            it[KEY_QUOTE_ID] = pick.toString()
            it[KEY_QUOTE_HISTORY] = encodeHistory(nextHistory)
        }
        _quote.value = QUOTES[pick]
    }

    private data class QuoteHit(val id: Int, val epochDay: Long)

    private fun parseHistory(raw: String?): List<QuoteHit> {
        if (raw.isNullOrBlank()) return emptyList()
        return try {
            val arr = JSONArray(raw)
            buildList {
                for (i in 0 until arr.length()) {
                    val o = arr.getJSONObject(i)
                    add(QuoteHit(o.getInt("id"), o.getLong("d")))
                }
            }
        } catch (_: Exception) {
            emptyList()
        }
    }

    private fun encodeHistory(hits: List<QuoteHit>): String {
        val arr = JSONArray()
        hits.forEach { h ->
            arr.put(JSONObject().put("id", h.id).put("d", h.epochDay))
        }
        return arr.toString()
    }

    companion object {
        private const val NO_REPEAT_DAYS = 90L
        private val KEY_QUOTE_DAY = stringPreferencesKey("day_quote_day")
        private val KEY_QUOTE_ID = stringPreferencesKey("day_quote_id")
        private val KEY_QUOTE_HISTORY = stringPreferencesKey("day_quote_history")

        /** ≥100 lines so 90-day no-repeat stays possible. Short, steel-toned. */
        val QUOTES: List<String> = listOf(
            "One clean move beats a perfect plan.",
            "Show up before you feel ready.",
            "Protect the next hour.",
            "Small proof compounds.",
            "Finish something unfinished.",
            "Quiet work. Loud results later.",
            "Discipline is a kindness to future you.",
            "Trade noise for one sharp action.",
            "The day bends to what you repeat.",
            "Start ugly. Stay honest.",
            "Less scrolling. More settling.",
            "Your standards walk when you walk.",
            "Energy follows the first commit.",
            "Name the hard thing. Then do it.",
            "Momentum loves a short runway.",
            "Keep the promise you made at dawn.",
            "Craft over performance.",
            "Today is not a dress rehearsal.",
            "Subtract one friction.",
            "Be the person who follows through.",
            "Depth beats display.",
            "A closed loop beats an open tab.",
            "Choose the harder good.",
            "Leave evidence you were here.",
            "Calm hands. Clear mind.",
            "Build the habit that builds you.",
            "Do the boring thing that compounds.",
            "Attention is your real currency.",
            "Make the next minute useful.",
            "Integrity is private before it is public.",
            "Walk it off. Then write it down.",
            "No drama. Just delivery.",
            "Progress hides in the reps.",
            "Guard your mornings like capital.",
            "Stop negotiating with the soft excuse.",
            "Precision over panic.",
            "The floor is sacred. Hold it.",
            "Ship the draft. Iterate tonight.",
            "Courage is a calendar entry kept.",
            "Become hard to interrupt.",
            "Eat the frog. Then breathe.",
            "Measure what you can move.",
            "Patience with process. Urgency with action.",
            "Your future self is watching this choice.",
            "Reduce options. Increase output.",
            "Stay with the discomfort one more set.",
            "Clarity arrives after motion.",
            "Write the line. Settle it.",
            "Honor the body that carries the mind.",
            "Silence the feed. Hear the work.",
            "A strong day is many ordinary minutes.",
            "Replace hope with a schedule.",
            "Be early to your own life.",
            "Own the hour you are in.",
            "Excellence is maintenance, not mood.",
            "Cut the clever. Keep the true.",
            "Train when it is inconvenient.",
            "The score follows the practice.",
            "Leave the room better than you found it.",
            "Decide once. Execute many times.",
            "Protect sleep like a mission.",
            "Money listens to logged truth.",
            "Feelings visit. Habits stay.",
            "Do not wait for inspiration’s permission.",
            "Stack wins the size of a brick.",
            "Be boringly consistent.",
            "The path is the reps, not the speech.",
            "Tighten the loop between intention and act.",
            "Carry less. Finish more.",
            "Today’s edge is yesterday’s follow-through.",
            "Make friction pay rent or leave.",
            "Speak less. Capture more.",
            "Stay long enough to get good.",
            "Prefer the hard yes to the soft maybe.",
            "Your identity is what you practice.",
            "Empty the inbox of half-promises.",
            "Move the body. Clear the fog.",
            "Build systems that survive low motivation.",
            "Treat time like someone is auditing it.",
            "The work is the prayer.",
            "Choose depth in one lane today.",
            "No heroics. Just the next right step.",
            "Let results argue for you.",
            "Hold the line when it is quiet.",
            "Make today harder to regret.",
            "Replace comparison with calibration.",
            "Earn the evening.",
            "Stay teachable and relentless.",
            "Close open loops before new ones.",
            "Be the constant in a noisy room.",
            "Prefer accuracy to applause.",
            "Train the mind like a muscle.",
            "Put the phone down. Pick the tool up.",
            "A clean desk is a clean argument.",
            "Do not outsource your standards.",
            "Win the morning. Negotiate the afternoon.",
            "Keep your word to yourself first.",
            "Pressure reveals practice.",
            "Make the invisible work visible in the log.",
            "Slow is smooth. Smooth is fast.",
            "Stay kind. Stay firm.",
            "The graph remembers what you settle.",
            "Become someone you would trust with a day.",
            "Leave a trail of finished things.",
            "Trade urgency theater for real progress.",
            "One focused block beats eight half-starts.",
            "Respect the floor. Chase the ceiling later.",
            "Let boredom teach you discipline.",
            "Your life is the sum of kept appointments.",
            "Act like the person the score will describe.",
            "Today: fewer inputs, cleaner outputs.",
            "Hold still long enough to finish.",
            "Make the hard choice the default choice.",
            "Build proof, not vibes.",
            "The day is a craft. Treat it that way.",
            "Arrive as attention. Leave as evidence.",
            "Keep going when the novelty dies.",
            "You do not need a new plan. You need a next step.",
            "Protect the streak of honesty.",
            "Become reliable in private.",
            "Turn intention into a timestamp.",
            "Less wish. More walk.",
            "The mark is made by showing up again.",
        )
    }
}
