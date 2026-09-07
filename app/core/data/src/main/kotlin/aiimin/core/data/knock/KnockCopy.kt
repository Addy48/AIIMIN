package aiimin.core.data.knock

/**
 * Voice-plan copy. Title ≤42 · body ≤90. Seeded A/B so the same day stays stable.
 */
object KnockCopy {

    data class Line(val title: String, val body: String)

    fun pick(case: KnockCase, seed: String, vars: Map<String, String> = emptyMap()): Line {
        val lines = linesFor(case)
        val idx = kotlin.math.abs((seed + case.capId).hashCode()) % lines.size
        return fill(lines[idx], vars)
    }

    private fun fill(line: Line, vars: Map<String, String>): Line {
        var title = line.title
        var body = line.body
        vars.forEach { (k, v) ->
            title = title.replace("{$k}", v)
            body = body.replace("{$k}", v)
        }
        return Line(title.take(42), body.take(90))
    }

    private fun linesFor(case: KnockCase): List<Line> = when (case) {
        KnockCase.EVENING_MINIMA -> listOf(
            Line("Your day left the chat", "Three ticks still waiting. Ghost them or finish them — either is a choice."),
            Line("Plot twist: unfinished", "The minimums didn’t complete themselves. Shocking, we know."),
            Line("Soft close available", "Not a lecture. Just a door. Tap if you want it shut clean."),
        )
        KnockCase.EMPTY_DAY -> listOf(
            Line("Blank day sheet", "Nothing logged. Rest day or reboot day — you decide the label."),
            Line("Silence on the wire", "No captures. If that’s intentional, respect. If not, one line fixes it."),
        )
        KnockCase.STREAK -> listOf(
            Line("Streak’s watching", "Day {n} streak. One tick keeps the lore intact."),
            Line("Chain wants a link", "Not pressure — continuity. Tick if you still want the story."),
        )
        KnockCase.MORNING -> listOf(
            Line("Day sheet’s warm", "No agenda speech. Just open if you want the board."),
            Line("Fresh page energy", "Yesterday’s score stayed home. Today’s still hiring."),
        )
        KnockCase.STEPS_HALF -> listOf(
            Line("Halfway isn’t nothing", "{n} steps. The couch has opinions. You’re winning the argument."),
            Line("Legs clocked in", "Mid-goal. Keep walking like the elevator’s broken."),
        )
        KnockCase.STEPS_NEAR -> listOf(
            Line("So close it hurts (nicely)", "{left} steps left. The goal can taste the drama."),
            Line("Final boss: sidewalk", "Almost there. Don’t let the last {left} ghost you."),
        )
        KnockCase.STEPS_HIT -> listOf(
            Line("Goal clocked", "{n} steps. The shoes send their regards."),
            Line("Movement: filed", "Target hit. Sit if you want — you earned the chair."),
        )
        KnockCase.SCREEN_NEAR -> listOf(
            Line("Screen’s getting clingy", "{left} left before the ceiling. Maybe blink once for science."),
            Line("Glow budget low", "You’re dating the pixels again. Cute. Budget’s not."),
        )
        KnockCase.SCREEN_OVER -> listOf(
            Line("Ceiling called. It lost", "Over by {over}. No fine. Just a mirror."),
            Line("Doomscroll: overtime", "Past the line you set. The line is still your friend."),
        )
        KnockCase.STILL -> listOf(
            Line("Chair loyalty program", "90 minutes. Standing is free and mildly rebellious."),
            Line("Blood flow called", "It wants a short walk and a better story later."),
        )
        KnockCase.ENGLISH -> listOf(
            Line("60 seconds of bravery", "Spark’s waiting. The prompt doesn’t bite. Much."),
            Line("Mouth gym open", "One drill. Then you can go back to typing heroically."),
        )
        KnockCase.MONEY -> listOf(
            Line("Burn rate’s spicy", "Day’s budget is sweating. Not judging — just math."),
            Line("Ledger side-eye", "Pace is hot. Check Money if you want the receipts."),
        )
        KnockCase.SYNC -> listOf(
            Line("Graph’s in the lobby", "{n} writes waiting. Open Config · Sync when the line’s friendly."),
            Line("Outbox doing cardio", "Still queued. Not lost — just patient."),
        )
        KnockCase.AGENDA -> listOf(
            Line("In 15: {title}", "Calendar didn’t forget. Neither should you."),
            Line("Coming up", "{title}. Shoes optional. Being there isn’t."),
        )
        KnockCase.NOTE -> listOf(
            Line("That note still exists", "“{title}” is collecting dust. Open, pin harder, or let it go."),
            Line("Thought in storage", "You parked it. Want it back on the windshield?"),
        )
        KnockCase.SCORE_WEEK -> listOf(
            Line("Week’s number landed", "Life Score {n}. Tap Score if you’re curious — not obligated."),
            Line("Quiet report card", "Server did the math. You can peek or ignore. Both valid."),
        )
    }
}
