package aiimin.core.data

import aiimin.core.data.notes.notePreview
import com.google.common.truth.Truth.assertThat
import org.junit.Test

class NotePreviewTest {
    @Test fun `checklists read as ticks, not markdown`() =
        assertThat(notePreview("- [x] The Mom Test\n- [ ] Four Thousand Weeks"))
            .isEqualTo("✓ The Mom Test · ○ Four Thousand Weeks")

    @Test fun `links show the linked name`() =
        assertThat(notePreview("Ask [[Arjun]] to share the quote")).isEqualTo("Ask Arjun to share the quote")

    @Test fun `plain lines are joined and blank lines dropped`() =
        assertThat(notePreview("Book the venue\n\n  Budget is ₹48,000  ")).isEqualTo("Book the venue · Budget is ₹48,000")

    @Test fun `bullets lose their dash`() = assertThat(notePreview("- milk\n* eggs")).isEqualTo("milk · eggs")
}
