package aiimin.core.data.pulse

import aiimin.core.data.life.LifeView
import aiimin.core.database.DeviceDayEntity
import aiimin.core.model.ScreenSummary
import java.time.LocalDate

/**
 * The one picture of "today" that every surface reads: Today, Phone day, the widget and the
 * notification engine. Built from the same rows, so they can never show different numbers.
 */
data class LiveDay(
    val date: LocalDate,
    val device: DeviceDayEntity?,
    val screen: ScreenSummary?,
    val minimumsDone: Int,
    val minimumsTotal: Int,
    val life: LifeView?,
    val unread: Int,
)
