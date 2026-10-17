package aiimin.feature.today

import aiimin.core.data.util.Money
import aiimin.designsystem.nav.Route
import java.time.LocalDate
import java.time.temporal.ChronoUnit

enum class GlanceArea { MONEY, VAULT, JOURNAL }

/** One line per area on Today, so Money review, Vault and Journal are each one tap away. */
data class GlanceLine(val area: GlanceArea, val text: String, val route: Route)

data class GlanceDoc(val id: String, val title: String, val expires: LocalDate)

/**
 * Money and Vault speak only when they have something to say; Journal always shows,
 * because writing it is a daily habit and it must stay one tap away.
 */
fun atAGlance(
    today: LocalDate,
    spentThisMonth: Long,
    toReview: Int,
    expiring: GlanceDoc?,
    journalToday: Boolean,
): List<GlanceLine> = buildList {
    val review = when (toReview) {
        0 -> null
        1 -> "1 payment to review"
        else -> "$toReview payments to review"
    }
    when {
        spentThisMonth > 0 && toReview > 0 ->
            add(GlanceLine(GlanceArea.MONEY, "${Money.whole(spentThisMonth)} this month · $toReview to review", Route.MoneyInbox))
        toReview > 0 -> add(GlanceLine(GlanceArea.MONEY, review!!, Route.MoneyInbox))
        spentThisMonth > 0 -> add(GlanceLine(GlanceArea.MONEY, "${Money.whole(spentThisMonth)} spent this month", Route.Money))
    }
    expiring?.let { d ->
        val days = ChronoUnit.DAYS.between(today, d.expires)
        val text = when {
            days < 0 -> "${d.title} has expired"
            days == 0L -> "${d.title} expires today"
            days == 1L -> "${d.title} expires tomorrow"
            else -> "${d.title} expires in $days days"
        }
        add(GlanceLine(GlanceArea.VAULT, text, Route.Doc(d.id)))
    }
    add(
        if (journalToday) GlanceLine(GlanceArea.JOURNAL, "Journal · written today", Route.Journal)
        else GlanceLine(GlanceArea.JOURNAL, "Journal · not written today", Route.JournalWrite()),
    )
}
