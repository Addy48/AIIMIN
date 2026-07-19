package `in`.aiimin.app

import android.content.Context
import `in`.aiimin.app.data.prefs.AppPrefs
import `in`.aiimin.app.data.local.AiiminDatabase
import `in`.aiimin.app.data.network.ApiClient
import `in`.aiimin.app.data.network.AuthApi
import `in`.aiimin.app.data.network.MobileApi
import `in`.aiimin.app.data.repo.MobileRepository
import `in`.aiimin.app.session.SessionStore
import `in`.aiimin.app.sync.SyncEngine

class AppContainer(context: Context) {
    val sessionStore = SessionStore(context)
    val appPrefs = AppPrefs(context)
    val db = AiiminDatabase.create(context)
    val api: MobileApi = ApiClient.create(sessionStore)
    val authApi: AuthApi = ApiClient.authApi(sessionStore)
    val repository = MobileRepository(api, authApi, db, sessionStore)
    val syncEngine = SyncEngine(repository, db, context)
}
