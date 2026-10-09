package aiimin.core.sensing

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.os.SystemClock
import androidx.core.content.ContextCompat
import dagger.hilt.android.qualifiers.ApplicationContext
import javax.inject.Inject
import javax.inject.Singleton
import kotlin.coroutines.resume
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlinx.coroutines.withTimeoutOrNull

/** One reading of the hardware step counter (cumulative since boot). Fallback only. */
data class CounterReading(val counter: Long, val bootAt: Long)

@Singleton
class StepSensor @Inject constructor(@ApplicationContext private val context: Context) {

    private val sm get() = context.getSystemService(Context.SENSOR_SERVICE) as SensorManager

    fun available(): Boolean = sm.getDefaultSensor(Sensor.TYPE_STEP_COUNTER) != null

    fun permitted(): Boolean =
        ContextCompat.checkSelfPermission(context, Manifest.permission.ACTIVITY_RECOGNITION) == PackageManager.PERMISSION_GRANTED

    suspend fun read(): CounterReading? {
        val sensor = sm.getDefaultSensor(Sensor.TYPE_STEP_COUNTER) ?: return null
        if (!permitted()) return null
        return withTimeoutOrNull(4_000L) {
            suspendCancellableCoroutine { cont ->
                val listener = object : SensorEventListener {
                    override fun onSensorChanged(event: SensorEvent) {
                        sm.unregisterListener(this)
                        val bootAt = System.currentTimeMillis() - SystemClock.elapsedRealtime()
                        if (cont.isActive) cont.resume(CounterReading(event.values[0].toLong(), bootAt))
                    }

                    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) = Unit
                }
                sm.registerListener(listener, sensor, SensorManager.SENSOR_DELAY_NORMAL)
                cont.invokeOnCancellation { sm.unregisterListener(listener) }
            }
        }
    }
}
