package aiimin.core.network

/**
 * Process-wide bearer for the AIIMIN API. Empty = anonymous.
 * Sign-in UI sets this later — founder types credentials; never invent auth.
 */
object ApiAuth {
    @Volatile
    var token: String? = null
        private set

    fun set(value: String?) {
        token = value?.trim()?.takeIf { it.isNotEmpty() }
    }

    fun clear() {
        token = null
    }
}
