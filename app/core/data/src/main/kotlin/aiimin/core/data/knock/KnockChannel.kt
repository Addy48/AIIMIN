package aiimin.core.data.knock

/**
 * Genesis Knock channels — ids match [[Native-Notification-Voice]].
 * One job per ping. Defaults from the voice plan.
 */
enum class KnockChannel(
    val id: String,
    val label: String,
    val blurb: String,
    val defaultOn: Boolean,
    val corePlus: Boolean = false,
) {
    DAY_EVENING("day.evening", "Evening close", "Unfinished minimums · blank day", true),
    DAY_MORNING("day.morning", "Morning open", "Soft open · opt-in", false),
    BODY_STEPS("body.steps", "Steps", "Halfway · near · hit", true),
    BODY_SCREEN("body.screen", "Screen ceiling", "85% · over", true),
    BODY_STILL("body.still", "Stillness", "Long seated · opt-in", false),
    LAB_ENGLISH("lab.english", "English Spark", "60s drill if none today", true, corePlus = true),
    MONEY_PULSE("money.pulse", "Money pulse", "Burn pace · never shame", false, corePlus = true),
    SYNC_HOLD("sync.hold", "Sync hold", "Outbox waiting", true),
    AGENDA_SOON("agenda.soon", "Agenda", "15 minutes before", true),
    NOTES_PARK("notes.park", "Parked notes", "Pinned and aging · opt-in", false),
    SCORE_WEEK("score.week", "Weekly score", "Sunday whisper · opt-in", false),
}

enum class KnockCase(val channel: KnockChannel, val capId: String) {
    EVENING_MINIMA(KnockChannel.DAY_EVENING, "evening_minima"),
    EMPTY_DAY(KnockChannel.DAY_EVENING, "empty_day"),
    STREAK(KnockChannel.DAY_EVENING, "streak"),
    MORNING(KnockChannel.DAY_MORNING, "morning"),
    STEPS_HALF(KnockChannel.BODY_STEPS, "steps_half"),
    STEPS_NEAR(KnockChannel.BODY_STEPS, "steps_near"),
    STEPS_HIT(KnockChannel.BODY_STEPS, "steps_hit"),
    SCREEN_NEAR(KnockChannel.BODY_SCREEN, "screen_near"),
    SCREEN_OVER(KnockChannel.BODY_SCREEN, "screen_over"),
    STILL(KnockChannel.BODY_STILL, "still"),
    ENGLISH(KnockChannel.LAB_ENGLISH, "english"),
    MONEY(KnockChannel.MONEY_PULSE, "money"),
    SYNC(KnockChannel.SYNC_HOLD, "sync"),
    AGENDA(KnockChannel.AGENDA_SOON, "agenda"),
    NOTE(KnockChannel.NOTES_PARK, "note"),
    SCORE_WEEK(KnockChannel.SCORE_WEEK, "score_week"),
}

data class KnockDecision(
    val case: KnockCase,
    val title: String,
    val body: String,
    val deepLink: String,
)
