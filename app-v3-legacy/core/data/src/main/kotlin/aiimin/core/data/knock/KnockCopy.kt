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
        return Line(title.take(48), body.take(120))
    }

    private fun linesFor(case: KnockCase): List<Line> = when (case) {
        KnockCase.EVENING_MINIMA -> listOf(
            Line("Evening check-in · @{user}", "{open} daily minimums waiting. A few quiet minutes close your day clean."),
            Line("Day wrap · @{user}", "{done} completed, {open} remaining. Finish strong or close out for tonight."),
            Line("Close your day · @{user}", "Review your board before bed. A clean close sets up tomorrow."),
        )
        KnockCase.EMPTY_DAY -> listOf(
            Line("Daily log open · @{user}", "No captures logged yet today. Jot a quick note or log an entry to keep continuity."),
            Line("Quiet day check", "Take 30 seconds to capture what mattered today on your board."),
        )
        KnockCase.STREAK -> listOf(
            Line("Day {n} streak active", "One logged minimum keeps your unbroken momentum going, @{user}."),
            Line("Momentum check · Day {n}", "Your {n}-day streak is on the line. Log an entry to keep the lore intact."),
        )
        KnockCase.MORNING -> listOf(
            Line("Good morning, @{user}", "Your day board is clear and ready. Set your daily minimums and focus."),
            Line("Morning briefing", "Fresh board open for today. One deliberate step at a time."),
        )
        KnockCase.STEPS_HALF -> listOf(
            Line("Halfway to your goal · {n} steps", "You've crossed 50% of your {target} step target today. Strong rhythm, @{user}."),
            Line("Strong stride today", "{n} steps logged so far towards {target}. Keep the momentum going."),
        )
        KnockCase.STEPS_NEAR -> listOf(
            Line("Almost at your goal!", "Only {left} steps to hit your {target} goal tonight, @{user}. A short walk wraps it."),
            Line("Final stretch · {left} steps", "You're within reach of today's movement target. Finish strong tonight."),
        )
        KnockCase.STEPS_HIT -> listOf(
            Line("Daily step goal reached! · {n}", "You achieved your {target} target today, @{user}. Excellent movement."),
            Line("Movement target completed", "{n} steps filed. Great discipline and pacing today."),
        )
        KnockCase.SCREEN_NEAR -> listOf(
            Line("Screen time check · @{user}", "{used} used today · {left} left before your daily ceiling."),
            Line("Approaching screen ceiling", "{used} of screentime logged. Prepare to unplug and rest your eyes."),
        )
        KnockCase.SCREEN_OVER -> listOf(
            Line("Screen ceiling exceeded", "Past your daily limit by {over}. Time to step away from the display, @{user}."),
            Line("Time to unplug · @{user}", "Over ceiling by {over}. Step away and reset your focus."),
        )
        KnockCase.STILL -> listOf(
            Line("Posture & stretch check", "You've been seated for 90 minutes. A quick 2-minute walk resets circulation."),
            Line("Movement break · @{user}", "90 minutes of stillness logged. Stand up and reset blood flow."),
        )
        KnockCase.ENGLISH -> listOf(
            Line("60s English Spark", "Your daily vocal drill is waiting, @{user}. 60 seconds to keep your fluency sharp."),
            Line("Fluency pulse · @{user}", "One quick 60-second speaking drill keeps your verbal streak alive."),
        )
        KnockCase.MONEY -> listOf(
            Line("Burn pace alert · {pct}%", "Today's expenses reached {pct}% of your daily budget. Keep an eye on the ledger."),
            Line("Daily spend pace", "Pacing at {pct}% today. Check your Money ledger to stay within your targets, @{user}."),
        )
        KnockCase.SYNC -> listOf(
            Line("Cloud sync queued", "{n} updates waiting to upload. Reconnecting to the cloud ledger."),
            Line("Offline writes held", "{n} entries stored locally on device. Will sync once network is stable."),
        )
        KnockCase.AGENDA -> listOf(
            Line("In 15m: {title}", "Scheduled on your calendar. Take a moment to prepare."),
            Line("Starting soon: {title}", "Next session begins in 15 minutes. Clear your deck."),
        )
        KnockCase.NOTE -> listOf(
            Line("Pinned thought: {title}", "Parked 3 days ago. Tap to review, action, or archive."),
            Line("Memory check · @{user}", "“{title}” is still pinned. Review when you have a quiet moment."),
        )
        KnockCase.SCORE_WEEK -> listOf(
            Line("Weekly Life Score: {n}", "Your comprehensive weekly Life Score is ready to view, @{user}."),
            Line("Sunday life review", "Score: {n}. Tap to explore your movement, focus, habits, and balance."),
        )
    }
}
