package aiimin.core.engine.pour

import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime

/**
 * Pour, the private writing space (PRD Part 12). Pure rules only: the local safety check, the helplines from the
 * dataset, Raahi's fixed lines and the timing of the tools. Nothing here reaches the network or any AI.
 */

/**
 * The local safety check (12.3). A short list of phrases about self-harm or suicide in English and Hinglish shows a
 * gentle card. False alarms are better than silence. The text is only read, never kept. The owner and a native
 * reader review the list before launch (30.C).
 */
object SafetyCheck {
    val PHRASES: List<String> = listOf(
        // English
        "kill myself", "killing myself", "end my life", "ending my life", "end it all", "take my own life", "want to die", "wanna die",
        "wish i was dead", "wish i were dead", "better off dead", "better off without me", "no reason to live", "nothing to live for",
        "don't want to live", "dont want to live", "do not want to live", "don't want to be alive", "dont want to be alive",
        "not worth living", "suicide", "suicidal", "hurt myself", "hurting myself", "harm myself", "self harm", "self-harm",
        "cut myself", "cutting myself", "can't go on", "cant go on", "disappear forever",
        // Hinglish
        "mar jaana chahta", "mar jaana chahti", "mar jana chahta", "mar jana chahti", "marna chahta", "marna chahti", "mar jaun", "mar jaaun",
        "khudkushi", "khud khushi", "aatmahatya", "atmahatya", "jeena nahi chahta", "jeena nahi chahti", "jina nahi chahta", "jina nahi chahti",
        "jeene ka mann nahi", "jine ka mann nahi", "zindagi khatam", "zindagi khatm", "khud ko khatam", "khud ko maar", "apne aap ko maar",
        "sab khatam kar du", "sab khatam kar doon", "suicide kar",
    )

    private fun norm(s: String) = " " + s.lowercase().replace('’', '\'').replace(Regex("[^a-z0-9' -]"), " ").replace(Regex("\\s+"), " ").trim() + " "

    private val normalized = PHRASES.map { " " + norm(it).trim() }

    /**
     * True when the text holds one of the phrases starting at a word start. Its end may run on into a longer word
     * (khudkushi karna, mar jaaunga), so endings in Hinglish still match.
     */
    fun flags(text: String): Boolean {
        val t = norm(text)
        return normalized.any { t.contains(it) }
    }
}

/** One country's numbers from the helplines dataset (12.3). A number that is not in the dataset is never shown. */
data class CountryHelp(val country: String, val name: String, val emergency: String?, val trust: String, val lines: List<Helpline>)

data class Helpline(val name: String, val number: String) {
    /** The first number when the dataset lists several ("143 / 0800 ..."): what the Call button dials. */
    val dial: String get() = number.split('/').first().trim()
}

object Helplines {
    private val all: List<CountryHelp> by lazy {
        val text = Helplines::class.java.getResourceAsStream("/aiimin/core/engine/pour/helplines.tsv")!!.bufferedReader().readText()
        parse(text)
    }

    fun parse(tsv: String): List<CountryHelp> = tsv.lineSequence().filter { it.isNotBlank() && !it.startsWith("#") }.mapNotNull { line ->
        val f = line.split('\t')
        if (f.size < 4 || f[3] == "C") return@mapNotNull null
        val lines = f.getOrNull(4).orEmpty().split("; ").filter { '=' in it }.map { Helpline(it.substringBeforeLast('='), it.substringAfterLast('=')) }
        CountryHelp(f[0], f[1], f[2].ifBlank { null }, f[3], lines)
    }.toList()

    /** The card's numbers for a country code from the SIM, network or region; null means "your local emergency number". */
    fun forCountry(code: String?): CountryHelp? = code?.uppercase()?.let { c -> all.firstOrNull { it.country == c } }

    /** What the card says when the country is not in the dataset (dataset rule "unknown_country"). */
    const val UNKNOWN = "Call your local emergency number. 112 works on most mobile networks. findahelpline.com lists free helplines by country."
    const val FIND_URL = "https://findahelpline.com"
}

/** Raahi's fixed lines in Pour (12.2, 12.4): written by us, a few per moment, rotated by day. Never generated. */
object PourLines {
    val OPEN = listOf("Say it all. I'm just here.", "Let it out. I'm listening.", "No one else reads this. Go on.")
    val CLOSE = listOf("That took something. Rest a little.", "Put down for now. Rest a little.", "Noted. Be easy on yourself tonight.")
    /** Openers (12.6): tapped to start a sentence when the page stays empty. */
    val OPENERS = listOf("Today I…", "What's heavy right now is…", "I keep thinking about…", "I wish someone knew…")
    val LET_GO = listOf("Gone. It doesn't have to stay with you.", "Let go. The page is clear again.")
    /** Part 23 "Pour first open", verbatim. */
    const val DISCLAIMER = "This space is private. It stays on this phone. AIIMIN is not a medical service. For support from a person, tap here."
    const val CARD_TITLE = "It sounds really heavy."
    const val CARD_BODY = "You deserve support from a person."

    fun pick(lines: List<String>, day: LocalDate): String = lines[(day.dayOfYear) % lines.size]
}

/** The feeling words for "Name the feeling" (up to three; 12.2 step 4). */
object Feelings {
    val WORDS = listOf(
        "Angry", "Annoyed", "Anxious", "Ashamed", "Calm", "Confused", "Disappointed", "Drained", "Embarrassed", "Frustrated",
        "Grateful", "Guilty", "Hopeful", "Hurt", "Jealous", "Lonely", "Lost", "Numb", "Overwhelmed", "Relieved",
        "Restless", "Sad", "Scared", "Stressed", "Tired", "Unheard", "Worried",
    )
    const val MAX = 3

    /** Tapping a word adds or removes it; a fourth word is not taken. */
    fun toggle(chosen: List<String>, word: String): List<String> =
        if (word in chosen) chosen - word else if (chosen.size >= MAX) chosen else chosen + word
}

/** The tools' timing (12.6). */
object PourTiming {
    const val COOL_OFF_HOURS = 24L
    const val SAY_IT_SECONDS = 60
    const val BREATHE_SECONDS = 60
    const val WORRY_MINUTES = 15

    /** A cooling-off message asks "Still want to send it?" 24 hours after it was written. */
    fun coolingDue(writtenAt: LocalDateTime, now: LocalDateTime): Boolean = !now.isBefore(writtenAt.plusHours(COOL_OFF_HOURS))

    /** A sealed letter opens on its date, not before. */
    fun sealed(until: LocalDate?, today: LocalDate): Boolean = until != null && today.isBefore(until)

    /** The next worry-time slot: today at [slot] if it is still ahead (or running), otherwise tomorrow. */
    fun nextWorrySlot(slot: LocalTime, now: LocalDateTime): LocalDateTime {
        val today = now.toLocalDate().atTime(slot)
        return if (now.isBefore(today.plusMinutes(WORRY_MINUTES.toLong()))) today else today.plusDays(1)
    }

    /** Inside the 15-minute window the worry box opens fully; outside it a worry is only dropped in. */
    fun inWorryTime(slot: LocalTime, now: LocalTime): Boolean {
        val end = slot.plusMinutes(WORRY_MINUTES.toLong())
        return if (end.isBefore(slot)) !now.isBefore(slot) || now.isBefore(end) else !now.isBefore(slot) && now.isBefore(end)
    }

    /** Breathing pace: 4 s in, 6 s out; returns 0..1 (circle size) at [ms] into the session. */
    fun breath(ms: Long): Float {
        val t = (ms % 10_000L).toFloat()
        return if (t < 4_000f) t / 4_000f else 1f - (t - 4_000f) / 6_000f
    }
}

/** The ready-made text for "Tell someone" (12.6). The person picks who and presses send. */
object TellSomeone {
    val TEXTS = listOf(
        "Hey, I'm having a rough day. Could we talk for a bit?",
        "Are you free for a call today? I could use a friendly voice.",
        "Not an emergency, but I'd like some company. Can I call you?",
    )
}
