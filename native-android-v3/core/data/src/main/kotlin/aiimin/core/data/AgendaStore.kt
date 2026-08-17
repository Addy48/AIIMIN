package aiimin.core.data

import aiimin.core.network.AgendaDto
import java.time.Instant
import java.time.LocalDate
import java.time.OffsetDateTime
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.util.Locale
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update

/**
 * Agenda strip from bootstrap calendar_events (next window).
 * Read-only on phone until calendar capture ships.
 */
@Singleton
class AgendaStore @Inject constructor() {

    private val _state = MutableStateFlow(AgendaState.empty())
    val state: StateFlow<AgendaState> = _state.asStateFlow()

    fun hydrateFromBootstrap(rows: List<AgendaDto>) {
        val zone = ZoneId.systemDefault()
        val mapped = rows.mapNotNull { it.toEvent(zone) }
            .sortedBy { it.startEpochMs }
        _state.update {
            it.copy(
                events = mapped,
                headMeta = if (mapped.isEmpty()) "LIVE · CLEAR" else "LIVE · ${mapped.size}",
                source = AgendaSource.LIVE,
            )
        }
    }

    fun clearForLive() = _state.update {
        AgendaState.empty().copy(headMeta = "LIVE · CLEAR", source = AgendaSource.LIVE)
    }

    fun resetToSeed() {
        _state.value = AgendaState.seed()
    }
}

enum class AgendaSource { SEED, LIVE }

data class AgendaEvent(
    val id: String,
    val title: String,
    val startEpochMs: Long,
    val endEpochMs: Long?,
    val allDay: Boolean,
    val eventType: String?,
) {
    fun whenLabel(zone: ZoneId = ZoneId.systemDefault()): String {
        if (allDay) {
            val day = Instant.ofEpochMilli(startEpochMs).atZone(zone).toLocalDate()
            return when (day) {
                LocalDate.now(zone) -> "ALL DAY · TODAY"
                LocalDate.now(zone).plusDays(1) -> "ALL DAY · TOMORROW"
                else -> "ALL DAY · ${day.format(DAY)}"
            }
        }
        val start = Instant.ofEpochMilli(startEpochMs).atZone(zone)
        val today = LocalDate.now(zone)
        val dayBit = when (start.toLocalDate()) {
            today -> "TODAY"
            today.plusDays(1) -> "TOMORROW"
            else -> start.format(DAY)
        }
        return "$dayBit · ${start.format(TIME)}"
    }
}

data class AgendaState(
    val events: List<AgendaEvent>,
    val headMeta: String,
    val source: AgendaSource,
) {
    /** Next few that matter on Today — upcoming + still-today. */
    fun forTodayStrip(limit: Int = 4, nowMs: Long = System.currentTimeMillis()): List<AgendaEvent> {
        val horizon = nowMs - 3 * 60 * 60 * 1000L // keep events from 3h ago
        return events.filter { (it.endEpochMs ?: it.startEpochMs) >= horizon }.take(limit)
    }

    companion object {
        fun empty() = AgendaState(events = emptyList(), headMeta = "—", source = AgendaSource.SEED)

        fun seed() = AgendaState(
            events = emptyList(),
            headMeta = "SEED · OPEN CALENDAR ON WEB",
            source = AgendaSource.SEED,
        )
    }
}

private val DAY: DateTimeFormatter = DateTimeFormatter.ofPattern("EEE d MMM", Locale.US)
private val TIME: DateTimeFormatter = DateTimeFormatter.ofPattern("h:mm a", Locale.US)

private fun AgendaDto.toEvent(zone: ZoneId): AgendaEvent? {
    val name = title?.trim().orEmpty()
    if (name.isEmpty()) return null
    val startMs = parseAgendaInstant(startAt) ?: return null
    val endMs = parseAgendaInstant(endAt)
    return AgendaEvent(
        id = id ?: "agenda-$startMs",
        title = name,
        startEpochMs = startMs,
        endEpochMs = endMs,
        allDay = allDay == true,
        eventType = eventType,
    )
}

private fun parseAgendaInstant(raw: String?): Long? {
    if (raw.isNullOrBlank()) return null
    return runCatching { Instant.parse(raw).toEpochMilli() }.getOrNull()
        ?: runCatching { OffsetDateTime.parse(raw).toInstant().toEpochMilli() }.getOrNull()
        ?: runCatching {
            // Postgres often returns "2026-08-08 14:30:00+00" without T
            val normalized = raw.trim().replace(' ', 'T')
            OffsetDateTime.parse(normalized).toInstant().toEpochMilli()
        }.getOrNull()
}
