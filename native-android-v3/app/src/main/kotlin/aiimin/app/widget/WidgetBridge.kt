package aiimin.app.widget

import android.content.Context
import androidx.glance.appwidget.updateAll
import aiimin.core.data.ConfigStore
import aiimin.core.data.PublishedLifeScoreStore
import aiimin.core.data.WidgetSnapshot
import aiimin.core.data.WidgetSnapshotStore
import aiimin.core.data.device.DeviceMetricsRepository
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.distinctUntilChanged
import kotlinx.coroutines.launch

object WidgetBridge {

    fun start(
        context: Context,
        scope: CoroutineScope,
        device: DeviceMetricsRepository,
        score: PublishedLifeScoreStore,
        config: ConfigStore,
        widgets: WidgetSnapshotStore,
    ) {
        scope.launch {
            combine(device.state, score.state, config.state) { metrics, lhs, prefs ->
                WidgetSnapshot(
                    osId = prefs.identity.osId.takeUnless { prefs.isSeed },
                    score = lhs.global.takeIf { lhs.available },
                    steps = metrics.steps,
                    screenLabel = metrics.screenHoursLabel,
                )
            }.distinctUntilChanged().collect { snap ->
                widgets.publish(snap)
                runCatching { DayGlanceWidget().updateAll(context) }
            }
        }
    }
}
