package aiimin.core.sensing.logic

enum class ScreenStrategy { EVENTS, EVENTS_WITH_GAP_FILL }
enum class StepStrategy { HEALTH_CONNECT_AGGREGATE, PHONE_SENSOR, UNAVAILABLE }

/** What the phone tells us about itself; read by the caller so the choice stays pure and testable. */
data class DeviceFacts(
    val maker: String,
    val sdk: Int,
    val healthConnect: Boolean,
    val stepSensor: Boolean,
    val healthApps: Set<String>,
    val secureLock: Boolean,
)

data class Profile(val screen: ScreenStrategy, val steps: StepStrategy, val preferredOrigin: String?, val needsKeepAlive: Boolean)

/**
 * How to measure on this phone (plan Phase 16). Usage events differ by maker: some Samsung and
 * MIUI-family builds drop ACTIVITY_PAUSED for floating and split windows, so their sessions need
 * a cap. Steps live in different apps per maker. And several makers kill background work unless
 * the person exempts AIIMIN.
 */
object DeviceProfile {
    private val dropsPauses = setOf("samsung", "xiaomi", "redmi", "poco", "oppo", "realme", "vivo", "iqoo")
    private val killers = setOf("xiaomi", "redmi", "poco", "oppo", "realme", "vivo", "iqoo", "oneplus", "samsung", "huawei", "honor")

    /** Step apps whose records we trust first when Health Connect holds several. */
    val originPriority = listOf("com.sec.android.app.shealth", "com.google.android.apps.fitness", "com.xiaomi.wearable", "com.mi.health")

    fun pick(f: DeviceFacts): Profile {
        val m = f.maker.trim().lowercase()
        val screen = if (m in dropsPauses) ScreenStrategy.EVENTS_WITH_GAP_FILL else ScreenStrategy.EVENTS
        val steps = when {
            f.healthConnect -> StepStrategy.HEALTH_CONNECT_AGGREGATE
            f.stepSensor -> StepStrategy.PHONE_SENSOR
            else -> StepStrategy.UNAVAILABLE
        }
        return Profile(screen, steps, originPriority.firstOrNull { it in f.healthApps }, m in killers)
    }

    /**
     * After "Check against your phone": keep whichever strategy lands closer to the number the
     * person read off Digital Wellbeing. Plain events win unless they're off by more than 10 %.
     */
    fun chooseByCalibration(eventsMs: Long, altMs: Long, userMs: Long): ScreenStrategy {
        val eventsErr = kotlin.math.abs(eventsMs - userMs).toDouble()
        if (eventsErr <= userMs * 0.10) return ScreenStrategy.EVENTS
        val altErr = kotlin.math.abs(altMs - userMs).toDouble()
        return if (altErr < eventsErr) ScreenStrategy.EVENTS_WITH_GAP_FILL else ScreenStrategy.EVENTS
    }
}
