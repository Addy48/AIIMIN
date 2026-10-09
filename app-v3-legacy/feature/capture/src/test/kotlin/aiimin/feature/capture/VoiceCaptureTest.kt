package aiimin.feature.capture

import aiimin.feature.capture.parse.CaptureParser
import com.google.common.truth.Truth.assertThat
import org.junit.Test

class VoiceCaptureTest {

    private val parser = CaptureParser()

    @Test
    fun `elapsed formats as m colon ss`() {
        assertThat(VoiceCapture.formatElapsed(0)).isEqualTo("0:00")
        assertThat(VoiceCapture.formatElapsed(34_000)).isEqualTo("0:34")
        assertThat(VoiceCapture.formatElapsed(65_000)).isEqualTo("1:05")
    }

    @Test
    fun `reduce motion fills instantly`() {
        assertThat(VoiceCapture.fillFraction(0, reduceMotion = true)).isEqualTo(1f)
        assertThat(VoiceCapture.fillFraction(0, reduceMotion = false)).isEqualTo(0f)
        assertThat(VoiceCapture.fillFraction(30_000, reduceMotion = false)).isEqualTo(0.5f)
    }

    @Test
    fun `spoken line fills composer and does not settle`() {
        val started = VoiceCapture.start(CaptureUiState())
        val ended = VoiceCapture.end(started, "paid 240 metro", parser::parse)
        assertThat(ended.voiceHolding).isFalse()
        assertThat(ended.text).isEqualTo("paid 240 metro")
        assertThat(ended.canSettle).isTrue()
        assertThat(ended.settled).isEmpty()
        assertThat(ended.offer?.isEmpty).isFalse()
    }

    @Test
    fun `empty release is offline notice not a fake line`() {
        val ended = VoiceCapture.end(VoiceCapture.start(CaptureUiState()), "  ", parser::parse)
        assertThat(ended.text).isEmpty()
        assertThat(ended.notice?.message).isEqualTo("VOICE · OFFLINE")
        assertThat(ended.canSettle).isFalse()
    }

    @Test
    fun `partial survives if final blank`() {
        val holding = VoiceCapture.partial(VoiceCapture.start(CaptureUiState()), "walked 25 min")
        val ended = VoiceCapture.end(holding, null, parser::parse)
        assertThat(ended.text).isEqualTo("walked 25 min")
        assertThat(ended.settled).isEmpty()
    }
}
