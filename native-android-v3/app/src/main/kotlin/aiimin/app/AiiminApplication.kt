package aiimin.app

import android.app.Application
import aiimin.app.knock.KnockScheduler
import aiimin.app.sync.SyncWorkScheduler
import aiimin.app.widget.WidgetBridge
import aiimin.core.data.ConfigStore
import aiimin.core.data.PublishedLifeScoreStore
import aiimin.core.data.WidgetSnapshotStore
import aiimin.core.data.device.DeviceMetricsRepository
import aiimin.core.data.di.ApplicationScope
import dagger.hilt.android.HiltAndroidApp
import javax.inject.Inject
import kotlinx.coroutines.CoroutineScope

@HiltAndroidApp
class AiiminApplication : Application() {

    @Inject lateinit var device: DeviceMetricsRepository
    @Inject lateinit var publishedScore: PublishedLifeScoreStore
    @Inject lateinit var config: ConfigStore
    @Inject lateinit var widgets: WidgetSnapshotStore
    @Inject @ApplicationScope lateinit var appScope: CoroutineScope

    override fun onCreate() {
        super.onCreate()
        SyncWorkScheduler.schedulePeriodic(this)
        KnockScheduler.schedulePeriodic(this)
        WidgetBridge.start(
            context = this,
            scope = appScope,
            device = device,
            score = publishedScore,
            config = config,
            widgets = widgets,
        )
    }
}
