package aiimin.core.data.session

import aiimin.core.model.OsIdRules

/**
 * Phone login law: OS-ID + PIN (same plate as the website).
 * Google stays on the website — Gmail is already bound to the OS-ID there.
 * Biometrics identify the remembered OS-ID and resume a **stored** session.
 * They never mint a session and never replace the PIN.
 */
object BiometricUnlock {

    fun plate(sessionLabel: String?, storedOsId: String?): String? {
        val candidates = listOf(sessionLabel, storedOsId)
        for (raw in candidates) {
            if (raw.isNullOrBlank()) continue
            if (OsIdRules.isEmailIdentifier(raw)) continue
            val id = OsIdRules.normalize(raw)
            if (OsIdRules.isValid(id)) return id
        }
        return null
    }

    fun canDirectUnlock(
        biometricEnabled: Boolean,
        sessionSignedIn: Boolean,
        plate: String?,
    ): Boolean = biometricEnabled && sessionSignedIn && !plate.isNullOrBlank()
}
