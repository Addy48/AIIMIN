package `in`.aiimin.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import `in`.aiimin.app.data.prefs.ThemeMode
import `in`.aiimin.app.ui.auth.BiometricGateScreen
import `in`.aiimin.app.ui.auth.BrandedSplash
import `in`.aiimin.app.ui.shell.AiiminRoot
import `in`.aiimin.app.ui.theme.AiiminTheme
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

private enum class BootState { Checking, Guest, Locked, Authed }

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        val app = application as AiiminApp
        setContent {
            val themeMode by app.container.appPrefs.themeMode.collectAsState(initial = ThemeMode.SYSTEM)
            val biometricEnabled by app.container.appPrefs.biometricUnlockEnabled.collectAsState(initial = false)
            val systemDark = isSystemInDarkTheme()
            val darkTheme = when (themeMode) {
                ThemeMode.DARK -> true
                ThemeMode.LIGHT -> false
                ThemeMode.SYSTEM -> systemDark
            }
            val token by app.container.sessionStore.tokenFlow.collectAsState(initial = null)
            var boot by remember { mutableStateOf(BootState.Checking) }
            var sessionLocked by remember { mutableStateOf(biometricEnabled) }

            DisposableEffect(lifecycle) {
                val observer = LifecycleEventObserver { _, event ->
                    if (event == Lifecycle.Event.ON_STOP && biometricEnabled) {
                        sessionLocked = true
                    }
                }
                lifecycle.addObserver(observer)
                onDispose { lifecycle.removeObserver(observer) }
            }

            LaunchedEffect(biometricEnabled) {
                if (!biometricEnabled) sessionLocked = false
            }

            LaunchedEffect(token) {
                if (token.isNullOrBlank()) {
                    boot = BootState.Guest
                    sessionLocked = false
                    return@LaunchedEffect
                }
                if (boot != BootState.Authed && boot != BootState.Locked) {
                    boot = BootState.Checking
                }
                val authed = withContext(Dispatchers.IO) {
                    app.container.repository.validateSession()
                }
                boot = when {
                    !authed -> BootState.Guest
                    biometricEnabled && sessionLocked -> BootState.Locked
                    else -> BootState.Authed
                }
            }

            AiiminTheme(darkTheme = darkTheme) {
                when (boot) {
                    BootState.Checking -> BrandedSplash()
                    BootState.Guest -> AiiminRoot(hasSession = false, container = app.container)
                    BootState.Locked -> BiometricGateScreen(
                        container = app.container,
                        onUnlocked = {
                            sessionLocked = false
                            boot = BootState.Authed
                        },
                    )
                    BootState.Authed -> AiiminRoot(hasSession = true, container = app.container)
                }
            }
        }
    }
}
