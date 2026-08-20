package aiimin.app.security

import androidx.biometric.BiometricManager
import androidx.biometric.BiometricPrompt
import androidx.core.content.ContextCompat
import androidx.fragment.app.FragmentActivity
import kotlin.coroutines.resume
import kotlinx.coroutines.suspendCancellableCoroutine

/**
 * Device gate for a remembered OS-ID. Success resumes the stored session.
 * Cancel / error → PIN. Never invent credentials.
 */
object BiometricGate {

    fun canAuthenticate(activity: FragmentActivity): Boolean {
        val mgr = BiometricManager.from(activity)
        val code = mgr.canAuthenticate(BiometricManager.Authenticators.BIOMETRIC_WEAK)
        return code == BiometricManager.BIOMETRIC_SUCCESS
    }

    /**
     * Login prompt. `true` only on success. Cancel / no hardware → `false` (use PIN).
     */
    suspend fun authenticateForLogin(
        activity: FragmentActivity,
        osId: String?,
    ): Boolean {
        if (!canAuthenticate(activity)) return false
        val title = if (!osId.isNullOrBlank()) "Unlock $osId" else "Unlock AIIMIN"
        return suspendCancellableCoroutine { cont ->
            val prompt = BiometricPrompt(
                activity,
                ContextCompat.getMainExecutor(activity),
                object : BiometricPrompt.AuthenticationCallback() {
                    override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
                        if (cont.isActive) cont.resume(true)
                    }

                    override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
                        if (cont.isActive) cont.resume(false)
                    }

                    override fun onAuthenticationFailed() {
                        // Keep listening; user can retry or tap Use PIN.
                    }
                },
            )
            prompt.authenticate(
                BiometricPrompt.PromptInfo.Builder()
                    .setTitle(title)
                    .setSubtitle("OS-ID + PIN is the phone path. Google stays on the website.")
                    .setNegativeButtonText("Use PIN")
                    .build(),
            )
            cont.invokeOnCancellation { prompt.cancelAuthentication() }
        }
    }
}
