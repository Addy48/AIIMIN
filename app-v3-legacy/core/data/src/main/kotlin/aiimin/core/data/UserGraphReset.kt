package aiimin.core.data

import aiimin.core.data.money.PaymentInboxStore
import aiimin.core.data.sync.GraphSyncRepository
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Wipe in-memory graph when the signed-in identity changes.
 * Prevents account B from seeing account A's seed/live rows.
 */
@Singleton
class UserGraphReset @Inject constructor(
    private val day: DayStore,
    private val money: MoneyStore,
    private val journal: JournalStore,
    private val notes: NoteStore,
    private val agenda: AgendaStore,
    private val publishedScore: PublishedLifeScoreStore,
    private val speaking: SpeakingStore,
    private val score: ScoreStore,
    private val lab: LabStore,
    private val sync: GraphSyncRepository,
    private val paymentInbox: PaymentInboxStore,
) {
    fun resetForSignOut() {
        day.resetToSeed()
        money.resetToSeed()
        journal.resetToSeed()
        notes.resetToSeed()
        agenda.resetToSeed()
        publishedScore.resetToSeed()
        speaking.resetToSeed()
        score.resetToSeed()
        lab.resetToSeed()
        paymentInbox.clear()
        sync.clearOutboxes()
    }

    /** After real sign-in, drop craft seed before first pull paints live. */
    fun clearSeedForLiveSession() {
        day.clearSeedPursuits()
        money.resetToEmpty()
        journal.clearEntriesForLive()
        notes.clearForLive()
        agenda.clearForLive()
        publishedScore.clear()
        speaking.clearForLive()
        lab.markSeedOnly()
        score.markLocalProvisional()
    }
}
