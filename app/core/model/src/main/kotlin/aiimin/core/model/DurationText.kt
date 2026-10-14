package aiimin.core.model

/** Reads a typed duration the way Digital Wellbeing and people write it: "1h 31m", "1 hr, 31 min", "1:31", "95". */
object DurationText {
    private val hm = Regex("""^\s*(\d{1,2})\s*:\s*(\d{1,2})\s*$""")
    private val hours = Regex("""(\d+)\s*(h|hr|hrs|hour|hours)\b""")
    private val mins = Regex("""(\d+)\s*(m|min|mins|minute|minutes)\b""")

    fun parseMs(text: String): Long? {
        val t = text.trim().lowercase()
        if (t.isEmpty()) return null
        val minutes = hm.matchEntire(t)?.let { it.groupValues[1].toLong() * 60 + it.groupValues[2].toLong() }
            ?: t.toLongOrNull()
            ?: run {
                val h = hours.find(t)?.groupValues?.get(1)?.toLong()
                val mm = mins.find(t)?.groupValues?.get(1)?.toLong()
                if (h == null && mm == null) null else (h ?: 0) * 60 + (mm ?: 0)
            }
        return minutes?.takeIf { it in 0..24 * 60 }?.times(60_000L)
    }
}
