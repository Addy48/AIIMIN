package aiimin.core.network

/**
 * Process-wide bearer for the AIIMIN API.
 * [SessionRepository] sets this after sign-in / restore. Empty = anonymous.
 */
object ApiAuth {
    const val COOKIE_ONLY = "__cookie_session__"

    @Volatile
    var token: String? = null
        private set

    fun set(value: String?) {
        token = value?.trim()?.takeIf { it.isNotEmpty() }
    }

    fun clear() {
        token = null
    }

    val isSignedIn: Boolean
        get() = !token.isNullOrBlank()
}
