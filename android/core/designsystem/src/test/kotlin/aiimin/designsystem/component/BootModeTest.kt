package aiimin.designsystem.component

import org.junit.Test
import kotlin.test.assertEquals

/** PRD Part 26.2 rule 2 and 3: which opening plays. */
class BootModeTest {
    @Test fun first_launch_ever_is_full() = assertEquals(BootMode.FULL, bootMode(coldStart = true, openedToScreen = false, reduce = false, lastFullDay = null, today = "2026-10-20"))

    @Test fun first_launch_of_the_day_is_full() = assertEquals(BootMode.FULL, bootMode(true, false, false, "2026-10-19", "2026-10-20"))

    @Test fun later_cold_starts_are_short() = assertEquals(BootMode.SHORT, bootMode(true, false, false, "2026-10-20", "2026-10-20"))

    @Test fun warm_resume_has_none() = assertEquals(BootMode.NONE, bootMode(false, false, false, null, "2026-10-20"))

    @Test fun opened_to_a_screen_has_none() = assertEquals(BootMode.NONE, bootMode(true, true, false, null, "2026-10-20"))

    @Test fun reduce_motion_is_the_still_frame() = assertEquals(BootMode.REDUCED, bootMode(true, false, true, null, "2026-10-20"))
}
