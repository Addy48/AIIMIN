package aiimin.core.network

import okhttp3.Cookie
import okhttp3.CookieJar
import okhttp3.HttpUrl
import javax.inject.Inject
import javax.inject.Singleton

/**
 * In-memory cookie jar for Better Auth session cookies.
 * Matches V2 Android — loadForRequest uses Cookie.matches(url).
 */
@Singleton
class SessionCookieJar @Inject constructor() : CookieJar {

    private val lock = Any()
    private val all = mutableListOf<Cookie>()

    private val sessionCookieNames = setOf(
        "better-auth.session_token",
        "__Secure-better-auth.session_token",
    )

    override fun loadForRequest(url: HttpUrl): List<Cookie> = synchronized(lock) {
        all.filter { it.matches(url) }
    }

    override fun saveFromResponse(url: HttpUrl, cookies: List<Cookie>) = synchronized(lock) {
        for (cookie in cookies) {
            all.removeAll { it.name == cookie.name && it.domain == cookie.domain }
            all.add(cookie)
        }
    }

    fun clear() = synchronized(lock) { all.clear() }

    fun sessionToken(): String? = synchronized(lock) {
        all.firstOrNull { it.name in sessionCookieNames }?.value
    }
}
