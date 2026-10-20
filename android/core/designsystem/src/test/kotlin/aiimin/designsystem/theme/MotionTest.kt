package aiimin.designsystem.theme

import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.SpringSpec
import androidx.compose.animation.core.TweenSpec
import org.junit.Test
import kotlin.test.assertEquals
import kotlin.test.assertSame

/** The Part 26.5 token table, row by row. */
class MotionTest {
    private fun tween(spec: Any) = spec as TweenSpec<*>

    @Test fun tap_is_90ms_linear_out() {
        assertEquals(90, tween(Motion.tap<Float>()).durationMillis)
        assertEquals(CubicBezierEasing(0f, 0f, 0.58f, 1f), tween(Motion.tap<Float>()).easing)
    }

    @Test fun quick_is_160ms_standard_curve() {
        assertEquals(160, tween(Motion.quick<Float>()).durationMillis)
        assertEquals(CubicBezierEasing(0.2f, 0f, 0f, 1f), tween(Motion.quick<Float>()).easing)
    }

    @Test fun standard_is_280ms() {
        assertEquals(280, tween(Motion.standard<Float>()).durationMillis)
        assertEquals(CubicBezierEasing(0.2f, 0f, 0f, 1f), tween(Motion.standard<Float>()).easing)
    }

    @Test fun emphasised_is_420ms() {
        assertEquals(420, tween(Motion.emphasised<Float>()).durationMillis)
        assertEquals(CubicBezierEasing(0.05f, 0.7f, 0.1f, 1f), tween(Motion.emphasised<Float>()).easing)
    }

    @Test fun exit_is_200ms_and_faster_than_entering() {
        assertEquals(200, tween(Motion.exit<Float>()).durationMillis)
        assertEquals(CubicBezierEasing(0.3f, 0f, 0.8f, 0.15f), tween(Motion.exit<Float>()).easing)
        assert(Motion.EXIT < Motion.STANDARD)
    }

    @Test fun ambient_stays_between_2_4_and_4_seconds() {
        assertEquals(2400, tween(Motion.ambient<Float>(1000)).durationMillis)
        assertEquals(3000, tween(Motion.ambient<Float>(3000)).durationMillis)
        assertEquals(4000, tween(Motion.ambient<Float>(9000)).durationMillis)
    }

    @Test fun spring_soft_is_stiffness_300_damping_0_8() {
        val s = Motion.springSoft<Float>() as SpringSpec<*>
        assertEquals(300f, s.stiffness)
        assertEquals(0.8f, s.dampingRatio)
    }

    @Test fun reduce_motion_is_a_200ms_fade() {
        assertEquals(200, tween(Motion.reducedFade<Float>()).durationMillis)
        assertSame(LinearEasing, tween(Motion.reducedFade<Float>()).easing)
    }

    @Test fun stagger_is_30ms_per_item_for_at_most_8_items() {
        assertEquals(0, Motion.staggerDelay(0))
        assertEquals(90, Motion.staggerDelay(3))
        assertEquals(210, Motion.staggerDelay(7))
        assertEquals(210, Motion.staggerDelay(40))
    }

    @Test fun day_arc_dot_slides_600ms_standard() {
        assertEquals(600, tween(Motion.arc<Float>()).durationMillis)
        assertEquals(CubicBezierEasing(0.2f, 0f, 0f, 1f), tween(Motion.arc<Float>()).easing)
    }

    @Test fun list_items_rise_12dp() = assertEquals(12f, Motion.RISE_DP)

    @Test fun plus_turns_45_degrees() = assertEquals(45f, Motion.PLUS_OPEN_DEGREES)
}
