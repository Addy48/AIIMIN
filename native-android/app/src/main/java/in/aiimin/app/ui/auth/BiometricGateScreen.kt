package `in`.aiimin.app.ui.auth

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Fingerprint
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.fragment.app.FragmentActivity
import `in`.aiimin.app.AppContainer
import `in`.aiimin.app.security.BiometricHelper
import `in`.aiimin.app.ui.brand.AiiminLogoLockup
import `in`.aiimin.app.ui.components.AiiminPrimaryButton
import `in`.aiimin.app.ui.components.AiiminTextButton
import `in`.aiimin.app.ui.theme.Accent
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@Composable
fun BiometricGateScreen(
    container: AppContainer,
    onUnlocked: () -> Unit,
) {
    val context = LocalContext.current
    val activity = context as? FragmentActivity
    val scope = rememberCoroutineScope()
    var pinMode by remember { mutableStateOf(false) }
    var pin by remember { mutableStateOf("") }
    var loading by remember { mutableStateOf(false) }
    var error by remember { mutableStateOf<String?>(null) }
    var shake by remember { mutableStateOf(false) }
    var identifier by remember { mutableStateOf<String?>(null) }

    LaunchedEffect(Unit) {
        identifier = container.sessionStore.currentEmail()
    }

    fun triggerShake() {
        shake = true
        scope.launch { delay(450); shake = false }
    }

    fun promptBiometric() {
        val host = activity ?: return
        if (!BiometricHelper.canAuthenticate(host)) {
            pinMode = true
            return
        }
        BiometricHelper.showPrompt(
            activity = host,
            title = "Unlock AIIMIN",
            subtitle = "Confirm it's you",
            onSuccess = onUnlocked,
            onError = { msg -> error = msg },
        )
    }

    LaunchedEffect(activity, pinMode) {
        if (!pinMode && activity != null) {
            delay(300)
            promptBiometric()
        }
    }

    LaunchedEffect(pin) {
        if (pin.length != 6 || loading) return@LaunchedEffect
        val id = identifier
        if (id.isNullOrBlank()) {
            error = "No saved account — sign in again"
            triggerShake()
            pin = ""
            return@LaunchedEffect
        }
        loading = true
        error = null
        val result = container.repository.signInWithOsIdOrEmail(id, pin)
        loading = false
        if (result.isSuccess) {
            onUnlocked()
        } else {
            error = result.exceptionOrNull()?.message ?: "Wrong PIN"
            pin = ""
            triggerShake()
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
    ) {
        AiiminLogoLockup(markSize = 48.dp, subtitle = "Human Momentum", horizontal = true)
        Spacer(Modifier.height(32.dp))
        if (!pinMode) {
            Icon(
                Icons.Default.Fingerprint,
                contentDescription = null,
                modifier = Modifier.size(72.dp),
                tint = Accent,
            )
            Spacer(Modifier.height(16.dp))
            Text(
                "Unlock AIIMIN",
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.SemiBold,
            )
            Text(
                "Use fingerprint or face to continue",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                textAlign = TextAlign.Center,
            )
            error?.let {
                Spacer(Modifier.height(12.dp))
                Text(it, color = MaterialTheme.colorScheme.error, textAlign = TextAlign.Center)
            }
            Spacer(Modifier.height(24.dp))
            AiiminPrimaryButton(
                text = "Try biometric again",
                onClick = { error = null; promptBiometric() },
                modifier = Modifier.fillMaxWidth(),
            )
            Spacer(Modifier.height(8.dp))
            AiiminTextButton(
                text = "Use PIN instead",
                onClick = { pinMode = true; error = null },
            )
        } else {
            Text(
                "Enter your PIN",
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.SemiBold,
            )
            identifier?.let {
                Spacer(Modifier.height(4.dp))
                Text(
                    it,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
            Spacer(Modifier.height(24.dp))
            PinDots(value = pin, shake = shake)
            error?.let {
                Spacer(Modifier.height(12.dp))
                Text(it, color = MaterialTheme.colorScheme.error, textAlign = TextAlign.Center)
            }
            Spacer(Modifier.height(24.dp))
            if (loading) {
                CircularProgressIndicator(color = Accent)
            } else {
                PinNumpad(
                    onDigit = { if (pin.length < 6) pin += it },
                    onDelete = { if (pin.isNotEmpty()) pin = pin.dropLast(1) },
                    onClear = { pin = "" },
                )
            }
            Spacer(Modifier.height(16.dp))
            AiiminTextButton(
                text = "← Back to biometric",
                onClick = { pinMode = false; pin = ""; error = null },
            )
        }
    }
}
