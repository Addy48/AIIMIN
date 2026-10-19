package aiimin.core.nlp

import java.time.LocalDate
import java.time.LocalDateTime

/** Reference clock used by every capture test: Tuesday 20 Oct 2026, 10:00. */
val TEST_NOW: LocalDateTime = LocalDateTime.of(2026, 10, 20, 10, 0)
val TEST_TODAY: LocalDate = TEST_NOW.toLocalDate()

fun analyze(text: String) = CaptureEngine.analyze(text, TEST_NOW)
fun first(text: String) = analyze(text).items.first()
