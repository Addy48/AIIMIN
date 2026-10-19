package aiimin.app

import android.content.pm.ActivityInfo
import org.junit.Assert.assertEquals
import org.junit.Test

class OrientationTest {
    @Test fun `phones stay upright`() {
        assertEquals(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT, orientationFor(smallestWidthDp = 360))
        assertEquals(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT, orientationFor(smallestWidthDp = 411))
    }

    @Test fun `tablets and open foldables turn freely`() {
        assertEquals(ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED, orientationFor(smallestWidthDp = 600))
        assertEquals(ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED, orientationFor(smallestWidthDp = 800))
    }
}
