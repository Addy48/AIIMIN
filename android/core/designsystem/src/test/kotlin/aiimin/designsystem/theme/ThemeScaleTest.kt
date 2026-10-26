package aiimin.designsystem.theme

import org.junit.Test
import kotlin.test.assertEquals

/** Part 18: text up to 2.0x must be honoured (D-047: it was capped at 1.6x). */
class ThemeScaleTest {
    @Test fun system_2x_is_honoured() = assertEquals(2.0f, clampFontScale(2.0f, 1f))

    @Test fun system_times_in_app_size_caps_at_2x() = assertEquals(2.0f, clampFontScale(1.6f, 1.5f))

    @Test fun owner_size_is_unchanged() = assertEquals(1.15f, clampFontScale(1.15f, 1f))

    @Test fun very_small_floors_at_0_85() = assertEquals(0.85f, clampFontScale(0.8f, 1f))

    @Test fun gutter_is_16dp() = assertEquals(16f, Spacing().gutter.value)
}
