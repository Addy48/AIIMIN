package aiimin.core.data

/**
 * Bundled speaking prompt bank — port of web SpeakingTopics (HR + technical + daily).
 * Offline-first; server only stores scores.
 */
object SpeakingTopics {

    data class Prompt(val id: String, val category: String, val text: String)

    val ALL: List<Prompt> = buildList {
        fun addAll(category: String, texts: List<String>) {
            texts.forEachIndexed { i, text ->
                add(Prompt(id = "${category.lowercase().replace(' ', '-')}-$i", category = category, text = text))
            }
        }
        addAll(
            "HR",
            listOf(
                "Tell me about yourself — give a 60-second professional introduction.",
                "What is your greatest weakness and how are you working on it?",
                "Why do you want to work at this company specifically?",
                "Describe a challenge you faced and how you overcame it.",
                "Where do you see yourself in 5 years?",
                "Tell me about a time you disagreed with a manager.",
                "How do you handle working under tight deadlines?",
                "Tell me about a time you failed and what you learned.",
                "Why should we hire you over other candidates?",
                "What motivates you to do your best work?",
                "Describe a time you had to learn a new skill quickly.",
                "How do you prioritize multiple urgent tasks?",
                "Tell me about a time you took initiative on a project.",
                "How do you handle receiving critical feedback?",
                "What is your proudest professional achievement?",
            ),
        )
        addAll(
            "Technical",
            listOf(
                "Explain what REST APIs are to a non-technical person in simple terms.",
                "Describe Object-Oriented Programming — give a real-world analogy.",
                "Explain cloud computing and why companies are moving to it.",
                "What is the difference between Frontend and Backend development?",
                "Explain how a web browser renders a web page.",
                "What is version control and why is Git important?",
                "Explain the difference between SQL and NoSQL databases.",
                "Describe what a container (like Docker) is using an analogy.",
                "What is an API rate limit and why do services need them?",
                "Explain caching — when it helps and when it hurts.",
            ),
        )
        addAll(
            "Daily",
            listOf(
                "Describe your morning in one minute — what you did and why it mattered.",
                "Argue for one habit you want to keep for the next 30 days.",
                "Explain a decision you made today without hedging.",
                "Summarize a news story as if briefing a busy founder.",
                "Teach a 10-year-old one idea you learned this week.",
                "Pitch your current project in 60 seconds.",
                "Describe a conflict without naming villains — only facts and next steps.",
                "Say what you need help with — clear, short, no apology padding.",
            ),
        )
        addAll(
            "Debate",
            listOf(
                "AI will completely replace junior developers in 5 years. Argue for or against.",
                "Remote work is destroying company culture. Take a side and defend it.",
                "A 4-year university degree is obsolete for tech careers. Argue.",
                "Hustle culture is toxic and leads to burnout. Defend or refute.",
                "Smartphones have ruined interpersonal communication. Take a position.",
            ),
        )
    }

    fun random(excludingId: String? = null): Prompt {
        val pool = if (excludingId == null) ALL else ALL.filter { it.id != excludingId }
        return pool.random()
    }

    fun byCategory(category: String): List<Prompt> =
        ALL.filter { it.category.equals(category, ignoreCase = true) }
}
