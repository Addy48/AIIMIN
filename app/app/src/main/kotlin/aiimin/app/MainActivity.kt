package aiimin.app

import aiimin.app.ui.LaunchRequest
import aiimin.app.ui.Shell
import aiimin.core.data.money.MoneyRepository
import aiimin.core.data.notify.NotificationRepository
import aiimin.core.data.settings.AppTheme
import aiimin.core.data.settings.SettingsStore
import aiimin.core.data.vault.ME
import aiimin.core.data.vault.VaultRepository
import aiimin.designsystem.component.AppButton
import aiimin.designsystem.nav.Route
import aiimin.designsystem.theme.Aiimin
import aiimin.designsystem.theme.AiiminTheme
import aiimin.designsystem.theme.ThemeMode
import aiimin.feature.onboarding.OnboardingScreen
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.biometric.BiometricManager.Authenticators.BIOMETRIC_WEAK
import androidx.biometric.BiometricManager.Authenticators.DEVICE_CREDENTIAL
import androidx.biometric.BiometricPrompt
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.material3.Text
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.core.content.ContextCompat
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import androidx.fragment.app.FragmentActivity
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.lifecycleScope
import dagger.hilt.android.AndroidEntryPoint
import javax.inject.Inject
import kotlinx.coroutines.launch

@AndroidEntryPoint
class MainActivity : FragmentActivity() {

    @Inject lateinit var settings: SettingsStore
    @Inject lateinit var money: MoneyRepository
    @Inject lateinit var vault: VaultRepository

    private var request by mutableStateOf<LaunchRequest?>(null)
    private var unlocked by mutableStateOf(false)
    private var backgroundedAt = 0L

    override fun onCreate(savedInstanceState: Bundle?) {
        val splash = installSplashScreen()
        enableEdgeToEdge()
        super.onCreate(savedInstanceState)
        var ready = false
        splash.setKeepOnScreenCondition { !ready }
        handle(intent)
        setContent {
            val s by settings.settings.collectAsStateWithLifecycle(initialValue = null)
            val st = s
            AiiminTheme(
                when (st?.theme) {
                    AppTheme.LIGHT -> ThemeMode.LIGHT
                    AppTheme.DARK -> ThemeMode.DARK
                    else -> ThemeMode.SYSTEM
                },
            ) {
                if (st == null) return@AiiminTheme
                LaunchedEffect(Unit) { ready = true }
                when {
                    !st.onboarded -> OnboardingScreen(onDone = { unlocked = true })
                    st.appLock && !unlocked -> Locked { authenticate() }
                    else -> Shell(request, onRequestHandled = { request = null })
                }
                LaunchedEffect(st.appLock) { if (st.appLock && !unlocked) authenticate() }
            }
        }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        handle(intent)
    }

    override fun onStop() {
        super.onStop()
        backgroundedAt = System.currentTimeMillis()
    }

    override fun onStart() {
        super.onStart()
        // Re-lock after five minutes away.
        if (backgroundedAt > 0 && System.currentTimeMillis() - backgroundedAt > 5 * 60_000L) unlocked = false
    }

    private fun authenticate() {
        val prompt = BiometricPrompt(
            this, ContextCompat.getMainExecutor(this),
            object : BiometricPrompt.AuthenticationCallback() {
                override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
                    unlocked = true
                }
            },
        )
        runCatching {
            prompt.authenticate(
                BiometricPrompt.PromptInfo.Builder().setTitle("Unlock AIIMIN").setAllowedAuthenticators(BIOMETRIC_WEAK or DEVICE_CREDENTIAL).build(),
            )
        }.onFailure { unlocked = true }
    }

    /** Notification taps, shared text (bank SMS or a quick note) and shared files. */
    private fun handle(intent: Intent?) {
        intent ?: return
        intent.getStringExtra(NotificationRepository.EXTRA_ROUTE)?.let { route ->
            val arg = intent.getStringExtra(NotificationRepository.EXTRA_ARG)
            request = LaunchRequest.Open(
                when (route) {
                    "doc" -> arg?.let { Route.Doc(it) } ?: Route.Vault
                    "money" -> Route.MoneyInbox
                    "score" -> Route.Score
                    "focus" -> Route.Focus()
                    "journal" -> Route.JournalWrite()
                    else -> Route.Today
                },
            )
            return
        }
        if (intent.action != Intent.ACTION_SEND) return
        val text = intent.getStringExtra(Intent.EXTRA_TEXT)
        @Suppress("DEPRECATION")
        val stream = intent.getParcelableExtra<Uri>(Intent.EXTRA_STREAM)
        when {
            stream != null -> lifecycleScope.launch {
                runCatching { vault.import(stream, ME) }.onSuccess { request = LaunchRequest.Open(Route.Doc(it.docId)) }
            }
            text != null -> lifecycleScope.launch {
                when (money.capture(text, "paste")) {
                    is MoneyRepository.Capture.Added, MoneyRepository.Capture.Duplicate -> request = LaunchRequest.Open(Route.MoneyInbox)
                    MoneyRepository.Capture.NotABankAlert -> request = LaunchRequest.Capture(text)
                }
            }
        }
    }
}

@androidx.compose.runtime.Composable
private fun Locked(onUnlock: () -> Unit) {
    Box(Modifier.fillMaxSize().background(Aiimin.colors.base), contentAlignment = Alignment.Center) {
        Column(horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.Center) {
            Text("AIIMIN is locked", style = Aiimin.type.headline)
            Spacer(Modifier.height(16.dp))
            AppButton("Unlock", onUnlock)
        }
    }
}
