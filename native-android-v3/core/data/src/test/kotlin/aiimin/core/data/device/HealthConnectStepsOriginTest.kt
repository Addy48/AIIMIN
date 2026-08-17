package aiimin.core.data.device

import com.google.common.truth.Truth.assertThat
import org.junit.Test

class HealthConnectStepsOriginTest {

    @Test
    fun phone_origin_accepts_android_and_spn() {
        assertThat(HealthConnectSteps.isOnDevicePhoneOrigin("android")).isTrue()
        assertThat(
            HealthConnectSteps.isOnDevicePhoneOrigin(
                "com.android.healthconnect.phone.jd5bdd37e1a8d3667a05d0abebfc4a89e",
            ),
        ).isTrue()
        assertThat(HealthConnectSteps.isOnDevicePhoneOrigin("com.nothing.health")).isTrue()
    }

    @Test
    fun phone_origin_rejects_fit_and_watches() {
        assertThat(HealthConnectSteps.isExcludedMixOrigin("com.google.android.apps.fitness")).isTrue()
        assertThat(HealthConnectSteps.isExcludedMixOrigin("com.samsung.android.watch")).isTrue()
        assertThat(HealthConnectSteps.isOnDevicePhoneOrigin("com.google.android.apps.fitness")).isFalse()
    }

    @Test
    fun resolve_keeps_android_and_discovered_spn_drops_fit() {
        val resolved = HealthConnectSteps.resolvePhoneOrigins(
            seenOrigins = setOf(
                "android",
                "com.android.healthconnect.phone.abc123",
                "com.google.android.apps.fitness",
                "com.garmin.android.apps.connectmobile",
            ),
            deviceSpn = "com.android.healthconnect.phone.fromplatform",
        )
        assertThat(resolved).contains("android")
        assertThat(resolved).contains("com.android.healthconnect.phone.abc123")
        assertThat(resolved).contains("com.android.healthconnect.phone.fromplatform")
        assertThat(resolved).doesNotContain("com.google.android.apps.fitness")
        assertThat(resolved).doesNotContain("com.garmin.android.apps.connectmobile")
    }

    @Test
    fun pick_best_prefers_highest_count_not_rank() {
        // SPN lagging android — Settings shows the higher stream (android).
        val breakdown = mapOf(
            "android" to 3_041L,
            "com.android.healthconnect.phone.abc" to 3_031L,
        )
        val best = HealthConnectSteps.pickBestPhoneOrigin(breakdown.keys, breakdown)
        assertThat(best).isEqualTo("android")
        assertThat(breakdown[best]).isEqualTo(3_041L)
    }

    @Test
    fun pick_best_prefers_spn_when_counts_equal() {
        val breakdown = mapOf(
            "android" to 8_000L,
            "com.android.healthconnect.phone.abc" to 8_000L,
        )
        val best = HealthConnectSteps.pickBestPhoneOrigin(breakdown.keys, breakdown)
        assertThat(best).isEqualTo("com.android.healthconnect.phone.abc")
    }

    @Test
    fun pick_best_falls_back_to_android() {
        val breakdown = mapOf("android" to 5_500L)
        val best = HealthConnectSteps.pickBestPhoneOrigin(setOf("android"), breakdown)
        assertThat(best).isEqualTo("android")
    }

    @Test
    fun merge_raises_hc_with_sensor_lag() {
        assertThat(HealthConnectSteps.mergePhoneSteps(3_031L, 3_041L)).isEqualTo(3_041L)
        assertThat(HealthConnectSteps.mergePhoneSteps(3_041L, 3_031L)).isEqualTo(3_041L)
        // Sensor baseline drift — do not trust huge lead.
        assertThat(HealthConnectSteps.mergePhoneSteps(3_000L, 8_000L)).isEqualTo(3_000L)
    }
}
