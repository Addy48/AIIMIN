package aiimin.core.data

/**
 * Local recall across notes, journal, money, agenda. No server search this APK.
 */
object LocalGraphSearch {

    fun search(
        query: String,
        notes: List<NoteItem>,
        journal: List<JournalEntry>,
        ledger: List<LedgerEntry>,
        agenda: List<AgendaEvent>,
    ): GraphSearchResult {
        val q = query.trim()
        if (q.isEmpty()) return GraphSearchResult.EMPTY
        return GraphSearchResult(
            notes = notes.filter { it.title.contains(q, true) || it.content.contains(q, true) },
            journal = journal.filter { it.matches(q) },
            money = ledger.filter {
                it.name.contains(q, true) || it.category.contains(q, true) || it.meta.contains(q, true)
            },
            agenda = agenda.filter { it.title.contains(q, true) },
        )
    }

    fun timeline(
        notes: List<NoteItem>,
        journal: List<JournalEntry>,
        ledger: List<LedgerEntry>,
        agenda: List<AgendaEvent>,
    ): List<TimelineItem> {
        val rows = buildList {
            notes.forEach {
                add(TimelineItem(it.updatedAt, "NOTE", it.title, it.excerpt))
            }
            journal.forEach {
                add(TimelineItem(journalSortKey(it.date), "JOURNAL", it.template.label, it.excerpt))
            }
            ledger.forEach {
                add(TimelineItem(it.id, "MONEY", it.name, it.meta))
            }
            agenda.forEach {
                add(TimelineItem(it.startEpochMs, "AGENDA", it.title, it.whenLabel()))
            }
        }
        return rows.sortedByDescending { it.atMs }
    }

    private fun journalSortKey(date: String): Long {
        val bits = date.split('.', '-', '/')
        if (bits.size < 2) return 0L
        val day = bits[0].toIntOrNull() ?: return 0L
        val month = bits[1].toIntOrNull() ?: return 0L
        return month * 100L + day
    }
}

data class GraphSearchResult(
    val notes: List<NoteItem>,
    val journal: List<JournalEntry>,
    val money: List<LedgerEntry>,
    val agenda: List<AgendaEvent>,
) {
    val isEmpty: Boolean
        get() = notes.isEmpty() && journal.isEmpty() && money.isEmpty() && agenda.isEmpty()

    companion object {
        val EMPTY = GraphSearchResult(
            notes = emptyList(),
            journal = emptyList(),
            money = emptyList(),
            agenda = emptyList(),
        )
    }
}

data class TimelineItem(
    val atMs: Long,
    val kind: String,
    val title: String,
    val excerpt: String,
)
