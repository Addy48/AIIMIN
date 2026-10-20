package aiimin.designsystem.component

import org.junit.Test
import kotlin.test.assertEquals

/** R6 S6: captions are built from parts, so a wrap never leaves a dangling "·". */
class MetaLineTest {
    @Test fun blanks_and_nulls_are_dropped() =
        assertEquals(listOf("₹5,825 left", "11 days to go"), metaParts("₹5,825 left", null, "  ", "11 days to go"))

    @Test fun parts_are_trimmed() = assertEquals(listOf("Pune", "Free plan"), metaParts(" Pune ", "Free plan "))

    @Test fun an_old_joined_string_is_split_on_the_dot() =
        assertEquals(listOf("Savings", "Personal", "No alerts for 5 days"), metaParts("Savings · Personal · No alerts for 5 days"))

    @Test fun nothing_gives_an_empty_list() = assertEquals(emptyList(), metaParts(null, ""))
}
