package aiimin.app

import android.content.Intent
import android.graphics.Color as AndroidColor
import android.os.Bundle
import android.util.Log
import androidx.fragment.app.FragmentActivity
import androidx.activity.SystemBarStyle
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.SideEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import androidx.core.view.WindowCompat
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.lifecycleScope
import aiimin.app.security.BiometricGate
import aiimin.app.ui.AiiminShell
import aiimin.app.knock.KnockNotifier
import aiimin.core.data.ConfigStore
import aiimin.core.data.knock.KnockStore
import aiimin.core.data.OnboardingStore
import aiimin.core.data.money.PaymentDraftSource
import aiimin.core.data.money.PaymentInboxStore
import aiimin.core.data.money.SharedTextExtractor
import aiimin.core.data.session.AuthRepository
import aiimin.core.data.session.BiometricUnlock
import aiimin.core.data.session.SessionRepository
import aiimin.core.data.sync.GraphSyncRepository
import aiimin.designsystem.brand.AiiminSplash
import aiimin.designsystem.theme.AiiminTheme
import aiimin.feature.onboarding.OnboardingRoute
import dagger.hilt.android.AndroidEntryPoint
import javax.inject.Inject
import kotlinx.coroutines.launch

@AndroidEntryPoint
class MainActivity : FragmentActivity() {

    @Inject lateinit var config: ConfigStore
    @Inject lateinit var onboarding: OnboardingStore
    @Inject lateinit var paymentInbox: PaymentInboxStore
    @Inject lateinit var session: SessionRepository
    @Inject lateinit var auth: AuthRepository
    @Inject lateinit var sync: GraphSyncRepository
    @Inject lateinit var moneyImport: aiimin.core.data.money.MoneyImportRepository
    @Inject lateinit var knocks: KnockStore

    @Volatile private var lastResumeSyncAt = 0L

    override fun onCreate(savedInstanceState: Bundle?) {
        val splash = installSplashScreen()
        enableEdgeToEdge()
        super.onCreate(savedInstanceState)
        // Keep blank ground until Compose owns the frame — never animate a second logo out.
        val composeSplashReady = mutableStateOf(false)
        splash.setKeepOnScreenCondition { !composeSplashReady.value }
        splash.setOnExitAnimationListener { provider ->
            provider.remove()
        }
        lifecycleScope.launch {
            session.hydrate()
            if (session.state.value.isSignedIn) {
                val ok = auth.validateSession()
                if (ok) sync.refreshAll()
            }
        }
        setContent {
            val prefs by config.state.collectAsStateWithLifecycle()
            val cal by onboarding.state.collectAsStateWithLifecycle()
            val sessionState by session.state.collectAsStateWithLifecycle()
            LaunchedEffect(prefs.darkTheme) {
                val bg = if (prefs.darkTheme) 0xFF15171A.toInt() else 0xFFF2F2F3.toInt()
                window.decorView.setBackgroundColor(bg)
                WindowCompat.getInsetsController(window, window.decorView).isAppearanceLightStatusBars =
                    !prefs.darkTheme
                enableEdgeToEdge(
                    statusBarStyle = if (prefs.darkTheme) {
                        SystemBarStyle.dark(AndroidColor.TRANSPARENT)
                    } else {
                        SystemBarStyle.light(AndroidColor.TRANSPARENT, AndroidColor.TRANSPARENT)
                    },
                    navigationBarStyle = if (prefs.darkTheme) {
                        SystemBarStyle.dark(AndroidColor.TRANSPARENT)
                    } else {
                        SystemBarStyle.light(AndroidColor.TRANSPARENT, AndroidColor.TRANSPARENT)
                    },
                )
            }

            AiiminTheme(
                darkTheme = prefs.darkTheme,
                reduceMotion = prefs.reduceMotion,
            ) {
                // Freeze reduce-motion for this cold-open so prefs hydrate cannot restart choreography.
                val splashReduceMotion = remember { prefs.reduceMotion }
                var showMark by remember { mutableStateOf(true) }
                val shellReady = sessionState.hydrated && sessionState.canEnterShell && cal.completed
                var bioPassed by remember { mutableStateOf(false) }
                var skipBioThisOpen by remember { mutableStateOf(false) }
                LaunchedEffect(shellReady) {
                    if (!shellReady) {
                        bioPassed = false
                        return@LaunchedEffect
                    }
                    if (skipBioThisOpen || !prefs.biometricEnabled || !sessionState.isSignedIn) {
                        bioPassed = true
                        return@LaunchedEffect
                    }
                    val plate = BiometricUnlock.plate(
                        sessionState.emailOrOsId,
                        prefs.identity.osId,
                    )
                    bioPassed = BiometricGate.authenticateForLogin(
                        this@MainActivity,
                        plate,
                    )
                }
                val enterShell = shellReady && bioPassed
                val showOnboarding = sessionState.hydrated && !enterShell
                Box(Modifier.fillMaxSize()) {
                    if (showOnboarding) {
                        OnboardingRoute(
                            onEntered = {
                                skipBioThisOpen = true
                                bioPassed = true
                            },
                            onRequestBiometric = {
                                val plate = BiometricUnlock.plate(
                                    session.state.value.emailOrOsId,
                                    config.state.value.identity.osId,
                                )
                                BiometricGate.authenticateForLogin(
                                    this@MainActivity,
                                    plate,
                                )
                            },
                        )
                    } else if (enterShell) {
                        AiiminShell()
                    }
                    if (showMark) {
                        AiiminSplash(
                            reduceMotion = splashReduceMotion,
                            onFirstFrame = { composeSplashReady.value = true },
                            onFinished = { showMark = false },
                        )
                    } else {
                        SideEffect { composeSplashReady.value = true }
                    }
                }
            }
        }
        window.decorView.post {
            handleShareIntent(intent)
            handleKnockIntent(intent)
        }
    }

    override fun onResume() {
        super.onResume()
        val now = System.currentTimeMillis()
        if (now - lastResumeSyncAt < 15_000L) return
        lastResumeSyncAt = now
        lifecycleScope.launch {
            if (!session.state.value.hydrated) session.hydrate()
            if (session.state.value.isSignedIn) {
                sync.refreshAll()
                aiimin.app.sync.SyncWorkScheduler.enqueueNow(applicationContext)
            }
            val local = java.time.LocalTime.now()
            if (local.hour > 20 || (local.hour == 20 && local.minute >= 30)) {
                knocks.markOpenedEvening(now)
            }
        }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        window.decorView.post {
            handleShareIntent(intent)
            handleKnockIntent(intent)
        }
    }

    private fun handleKnockIntent(intent: Intent?) {
        val link = intent?.getStringExtra(KnockNotifier.EXTRA_LINK) ?: return
        intent.removeExtra(KnockNotifier.EXTRA_LINK)
        knocks.setPendingDeepLink(link)
        lifecycleScope.launch { knocks.markOpenedEvening(System.currentTimeMillis()) }
    }

    private fun handleShareIntent(intent: Intent?) {
        if (intent?.action != Intent.ACTION_SEND) return
        val stream = intent.getParcelableExtraCompat(Intent.EXTRA_STREAM)
        val mime = intent.type?.lowercase().orEmpty()
        // Clear SEND so recreate / process death with same Intent does not re-ingest.
        intent.action = Intent.ACTION_MAIN
        val text = SharedTextExtractor.fromIntent(intent) { uri ->
            contentResolver.openInputStream(uri)
        }
        intent.removeExtra(Intent.EXTRA_TEXT)
        intent.removeExtra(Intent.EXTRA_STREAM)
        setIntent(intent)

        if (stream != null && (
                mime.contains("sheet") || mime.contains("excel") || mime == "text/csv" ||
                    mime == "application/pdf" || mime.endsWith(".sheet")
                )
        ) {
            lifecycleScope.launch {
                when (val out = moneyImport.importUri(stream)) {
                    is aiimin.core.data.money.MoneyImportRepository.ImportOutcome.Ok ->
                        config.setNotice(out.message)
                    is aiimin.core.data.money.MoneyImportRepository.ImportOutcome.Fail ->
                        config.setNotice(out.message)
                }
            }
            return
        }

        if (text.isEmpty()) {
            Log.w(TAG, "share SEND with empty text/stream")
            config.setNotice("Share had no text — paste on Money or pick Excel/CSV.")
            return
        }
        val ok = paymentInbox.ingest(text, PaymentDraftSource.SHARE)
        Log.i(TAG, "share ingest ok=$ok len=${text.length}")
        config.setNotice(
            if (ok) "Payment alert queued · approve on Money"
            else "Shared text on Money · queue, AI import, or edit, then Approve",
        )
    }

    @Suppress("DEPRECATION")
    private fun Intent.getParcelableExtraCompat(key: String): android.net.Uri? {
        return if (android.os.Build.VERSION.SDK_INT >= 33) {
            getParcelableExtra(key, android.net.Uri::class.java)
        } else {
            @Suppress("DEPRECATION")
            getParcelableExtra(key) as? android.net.Uri
        }
    }

    companion object {
        private const val TAG = "AiiminPay"
    }
}
