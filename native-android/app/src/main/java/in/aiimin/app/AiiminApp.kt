package `in`.aiimin.app

import android.app.Application

class AiiminApp : Application() {
    lateinit var container: AppContainer
        private set

    override fun onCreate() {
        super.onCreate()
        container = AppContainer(this)
        container.syncEngine.scheduleBackgroundSync()
    }
}
