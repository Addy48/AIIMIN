package aiimin.feature.capture

import aiimin.feature.capture.parse.ParsedCapture

/**
 * Hold-to-talk law: fill the composer, never auto-Settle.
 * Fail → `VOICE · OFFLINE`. Timer is `m:ss`.
 */
object VoiceCapture {

    const val FILL_CAP_MS = 60_000L

    fun formatElapsed(ms: Long): String {
        val sec = (ms / 1000L).coerceAtLeast(0L)
        return "${sec / 60}:${(sec % 60).toString().padStart(2, '0')}"
    }

    fun fillFraction(ms: Long, reduceMotion: Boolean): Float {
        if (reduceMotion) return 1f
        return (ms.toFloat() / FILL_CAP_MS).coerceIn(0f, 1f)
    }

    fun start(state: CaptureUiState): CaptureUiState = state.copy(
        voiceHolding = true,
        voiceElapsedMs = 0L,
        voicePartial = "",
        notice = null,
    )

    fun partial(state: CaptureUiState, text: String): CaptureUiState =
        state.copy(voicePartial = text)

    fun tick(state: CaptureUiState, elapsedMs: Long): CaptureUiState =
        state.copy(voiceElapsedMs = elapsedMs.coerceAtLeast(0L))

    fun end(
        state: CaptureUiState,
        spoken: String?,
        parse: (String) -> ParsedCapture,
    ): CaptureUiState {
        val text = spoken?.trim().orEmpty().ifBlank { state.voicePartial.trim() }
        val idle = state.copy(
            voiceHolding = false,
            voiceElapsedMs = 0L,
            voicePartial = "",
        )
        if (text.isEmpty()) {
            return idle.copy(notice = Notice("VOICE · OFFLINE"))
        }
        return idle.copy(
            text = text,
            offer = parse(text),
            parseSource = ParseSource.LOCAL,
            editing = null,
            notice = null,
        )
    }
}
