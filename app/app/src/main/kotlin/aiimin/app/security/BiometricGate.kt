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
        val authenticators = BiometricManager.Authenticators.BIOMETRIC_STRONG or
            BiometricManager.Authenticators.BIOMETRIC_WEAK
        val code = mgr.canAuthenticate(authenticators)
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
        val cleanId = osId?.trim()?.removePrefix("@")
        val title = if (!cleanId.isNullOrBlank()) "Welcome back, @$cleanId" else "Unlock AIIMIN"
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
                    .setSubtitle("Confirm your fingerprint to access your dashboard")
                    .setDescription("Quick and secure biometric unlock")
                    .setNegativeButtonText("Use 6-digit PIN")
                    .build(),
            )
            cont.invokeOnCancellation { prompt.cancelAuthentication() }
        }
    }
}
