package aiimin.core.sensing.logic

/** On phones that drop ACTIVITY_PAUSED, end a session [limitMs] after the last sign of use. */
object GapFill {
    fun cap(sessionStart: Long, sessionEnd: Long, interactions: List<Long>, limitMs: Long): Long {
        var last = sessionStart
        for (t in interactions.filter { it in sessionStart..sessionEnd }.sorted()) {
            if (t - last > limitMs) return last + limitMs
            last = t
        }
        return if (sessionEnd - last > limitMs) last + limitMs else sessionEnd
    }
}
