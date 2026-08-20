package aiimin.core.model

/**
 * The split that lets a person who codes fourteen hours a day and a person who
 * walks fifteen kilometres a day use the same OS honestly.
 *
 * A **pursuit** is something you chose. Missing it moves your score, because you
 * are the one who said it mattered.
 *
 * A **floor** is what your body or your ledger requires. It is derived from
 * facts — hours seated, hours on a screen, a sleep window, a budget — and
 * confirmed by you. **A floor never touches the score.** Breaching one raises a
 * single quiet warning and nothing else. Nobody should lose points for having a
 * body.
 */
enum class CommitmentKind { PURSUIT, FLOOR }

/** How a commitment is satisfied. Not everything is "do more of it". */
enum class CommitmentShape {
    /** More is better, up to a target: steps, deep work, pages. */
    MORE,

    /** Less is better, ideally none: delivery orders, doom-scrolling, a habit being broken. */
    LESS,

    /** Inside a range: sleep between 7 and 9 hours, spend inside a budget. */
    BAND,

    /** Presence, not quantity: journalled at all, walked at all, called someone at all. */
    SHOW_UP,
}

/**
 * One thing a person is holding themselves to.
 *
 * @param target for [CommitmentShape.MORE] the number that counts as a full day;
 *   for [CommitmentShape.LESS] the tolerated count per 30 days (usually 0).
 * @param bandLow / @param bandHigh for [CommitmentShape.BAND].
 * @param softFloorRatio where attainment reaches zero, as a fraction of target.
 *   Not a cliff at the target — a floor far below it, so that a near miss reads
 *   as a near hit and a genuine no-show reads as one.
 */
data class Commitment(
    val id: Long,
    val instrument: Instrument,
    val kind: CommitmentKind,
    val shape: CommitmentShape,
    val label: String,
    val unit: String = "",
    val target: Double = 1.0,
    val bandLow: Double = 0.0,
    val bandHigh: Double = 0.0,
    val weight: Double = 1.0,
    val softFloorRatio: Double = DEFAULT_SOFT_FLOOR,
    /** Why this floor exists, in the user's own terms. Shown, never hidden. */
    val reason: String = "",
    /** Server habit UUID when hydrated from `/mobile/bootstrap`. */
    val serverId: String? = null,
) {
    init {
        require(target > 0.0 || shape == CommitmentShape.LESS) { "target must be positive" }
        require(weight > 0.0) { "weight must be positive" }
    }

    /** Floors are advisory by construction. Nothing here reaches the score. */
    val scored: Boolean get() = kind == CommitmentKind.PURSUIT

    companion object {
        const val DEFAULT_SOFT_FLOOR = 0.4
    }
}

/** What actually happened, for one commitment on one day. */
data class Observation(
    val commitmentId: Long,
    /** `null` means nothing was recorded. It does **not** mean zero. */
    val value: Double?,
) {
    val observed: Boolean get() = value != null
}
