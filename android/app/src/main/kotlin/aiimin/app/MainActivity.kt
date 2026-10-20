package aiimin.app

import androidx.compose.runtime.remember
import androidx.compose.foundation.layout.padding
import androidx.compose.ui.unit.sp
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.clickable
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
import androidx.compose.foundation.layout.widthIn
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
    @Inject lateinit var notes: aiimin.core.data.notes.NoteRepository
    @Inject lateinit var vault: VaultRepository
    @Inject lateinit var familyDao: aiimin.core.database.FamilyDao
    @Inject lateinit var notifications: NotificationRepository

    private var request by mutableStateOf<LaunchRequest?>(null)
    private var unlocked by mutableStateOf(false)
    private var backgroundedAt = 0L

    override fun onConfigurationChanged(newConfig: android.content.res.Configuration) {
        super.onConfigurationChanged(newConfig)
        // Folding or unfolding changes the smallest width; re-pick without restarting the screen.
        requestedOrientation = orientationFor(newConfig.smallestScreenWidthDp)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        val splash = installSplashScreen()
        enableEdgeToEdge(
            statusBarStyle = androidx.activity.SystemBarStyle.light(android.graphics.Color.TRANSPARENT, android.graphics.Color.TRANSPARENT),
            navigationBarStyle = androidx.activity.SystemBarStyle.light(android.graphics.Color.TRANSPARENT, android.graphics.Color.TRANSPARENT),
        )
        super.onCreate(savedInstanceState)
        requestedOrientation = orientationFor(resources.configuration.smallestScreenWidthDp)
        AppShortcuts.publish(applicationContext)
        var ready = false
        splash.setKeepOnScreenCondition { !ready }
        // The opening animation plays once per cold start; rotation or returning from the background skips it.
        val coldStart = savedInstanceState == null
        var bootDone by mutableStateOf(false)
        // A recreated activity (rotation, process restore) has already handled its share; doing it again doubles the note.
        if (savedInstanceState == null) handle(intent)
        // Opened to a specific screen (launcher shortcut, notification, deep link): go straight there, no opening (audit A-034).
        val openedToScreen = request != null
        setContent {
            val s by settings.settings.collectAsStateWithLifecycle(initialValue = null)
            val st = s
            // Light is the only designed theme right now (handoff: dark comes later; don't invert).
            AiiminTheme(ThemeMode.LIGHT, textScale = st?.textScale ?: 1f, reduceMotion = st?.reduceMotion ?: false) {
                if (st == null) return@AiiminTheme
                LaunchedEffect(Unit) { ready = true }
                // On tablets and unfolded foldables the app stays a phone-width column in the middle.
                // Raahi's mode reaches every picture of Raahi from here (Off hides them all, PRD 1.1).
                androidx.compose.runtime.CompositionLocalProvider(aiimin.designsystem.component.LocalRaahiMode provides aiimin.core.engine.raahi.RaahiMode.of(st.raahiMode)) {
                androidx.compose.foundation.layout.Box(
                    androidx.compose.ui.Modifier.fillMaxSize().background(aiimin.designsystem.theme.LightPalette.base),
                    contentAlignment = androidx.compose.ui.Alignment.TopCenter,
                ) {
                    androidx.compose.foundation.layout.Box(androidx.compose.ui.Modifier.widthIn(max = 560.dp).fillMaxSize()) {
                        when {
                            !st.onboarded -> OnboardingScreen(onDone = { unlocked = true })
                            st.appLock && !unlocked -> {
                                val card by androidx.compose.runtime.produceState<aiimin.core.database.PersonEntity?>(null) { value = familyDao.get("me") }
                                Locked(card) { authenticate() }
                            }
                            else -> Shell(request, onRequestHandled = { request = null })
                        }
                    }
                }
                }
                // The opening screen (Part 26): full on the first launch of the day, short on later cold starts,
                // none on a warm resume or a deep link, the still frame with reduce motion.
                if (!bootDone) {
                    val reduce = aiimin.designsystem.theme.LocalReduceMotion.current
                    val today = java.time.LocalDate.now().toString()
                    val mode = remember { aiimin.designsystem.component.bootMode(coldStart, openedToScreen, reduce, st.lastBootDay, today) }
                    LaunchedEffect(mode) { if (mode == aiimin.designsystem.component.BootMode.FULL) settings.update { it.copy(lastBootDay = today) } }
                    aiimin.designsystem.component.BootScene(mode, ready = true, onDone = { bootDone = true })
                }
                LaunchedEffect(st.appLock) { if (st.appLock && !unlocked) authenticate() }
                // Hide in the app switcher also blocks screenshots (FLAG_SECURE).
                LaunchedEffect(st.hideInRecents) {
                    if (st.hideInRecents) window.addFlags(android.view.WindowManager.LayoutParams.FLAG_SECURE)
                    else window.clearFlags(android.view.WindowManager.LayoutParams.FLAG_SECURE)
                }
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
        // The Notes widget shows the latest notes once AIIMIN leaves the screen.
        (application as AiiminApplication).appScope.launch { aiimin.app.notes.NotesWidget.refresh(applicationContext) }
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
    @javax.inject.Inject lateinit var demo: aiimin.core.data.demo.DemoSeeder

    private fun handle(intent: Intent?) {
        intent ?: return
        // Health Connect's "Privacy policy" / "permission usage" links land on our rationale page.
        if (intent.action == "androidx.health.ACTION_SHOW_PERMISSIONS_RATIONALE" || intent.action == "android.intent.action.VIEW_PERMISSION_USAGE") {
            request = LaunchRequest.Open(Route.HealthPrivacy)
            return
        }
        // Launcher shortcuts (long-press the app icon).
        intent.getStringExtra(AppShortcuts.EXTRA)?.let { id ->
            AppShortcuts.requestFor(id)?.let { request = it; AppShortcuts.reportUsed(this, id); return }
        }
        // Dev/demo hooks: `--es aiimin_demo load` fills Meera's sample life; `--es aiimin_go money` opens a screen.
        if (intent.getStringExtra("aiimin_demo") == "load") lifecycleScope.launch { runCatching { demo.load() } }
        // Capture test hook: opens the + sheet with this text (UTF-8 safe, unlike `adb input text`). Nothing is saved.
        intent.getStringExtra("aiimin_capture")?.let { request = LaunchRequest.Capture(it); return }
        // The Today widget's "+" opens the capture sheet empty.
        if (intent.getStringExtra("aiimin_go") == "capture") { request = LaunchRequest.Capture(""); return }
        intent.getStringExtra("aiimin_go")?.let { go ->
            request = LaunchRequest.Open(
                when (go) {
                    "money" -> Route.Money; "vault" -> Route.Vault; "me" -> Route.Me; "score" -> Route.Score; "inbox" -> Route.MoneyInbox
                    "assistant" -> Route.Assistant(); "notes" -> Route.Notes; "note" -> Route.Note(intent.getStringExtra("aiimin_arg")); "newnote" -> Route.Note(); "notesimport" -> Route.NotesImport; "journal" -> Route.Journal
                    "calendar" -> Route.Calendar; "focus" -> Route.Focus(); "minimums" -> Route.Minimums; "battery" -> Route.Battery
                    "signals" -> Route.Signals; "settings" -> Route.Settings; "family" -> Route.Family; "phoneday" -> Route.PhoneDay
                    "budget" -> Route.Budget; "notifications" -> Route.Notifications; "activity" -> Route.Activity; "search" -> Route.Search
                    "upcoming" -> Route.Upcoming; "body" -> Route.Body; "planday" -> Route.PlanDay(); "plantomorrow" -> Route.PlanDay(true)
                    "debrief" -> Route.Debrief; "goals" -> Route.Goals; "weekly" -> Route.WeeklyReview; "why" -> Route.WhyScore; "patterns" -> Route.Patterns
                    "payments" -> Route.Payments; "category" -> Route.Category("Transport"); "emergency" -> Route.EmergencyCard("me")
                    "profile" -> Route.EditProfile; "plans" -> Route.Plans; "subscription" -> Route.Subscription; "devices" -> Route.LinkedDevices
                    "moneysettings" -> Route.MoneySettings; "smsimport" -> Route.SmsImport; "appearance" -> Route.Appearance; "raahi" -> Route.RaahiSettings; "notifysettings" -> Route.NotifySettings; "aboutraahi" -> Route.AboutRaahi; "language" -> Route.Language; "help" -> Route.Help; "about" -> Route.About; "running" -> Route.Running
                    "captures" -> Route.RecentCaptures; "moodyear" -> Route.MoodYear; "backups" -> Route.VaultBackup; "kits" -> Route.EmergencyKits
                    "accounts" -> Route.Accounts; "splits" -> Route.Splits; "recurring" -> Route.Recurring; "payees" -> Route.PayeeMemory
                    "sync" -> Route.SyncSettings; "conflicts" -> Route.Conflicts; "trash" -> Route.Trash; "account" -> Route.Account; "privacy" -> Route.Privacy
                    else -> Route.Today
                },
            )
            return
        }
        intent.getStringExtra(NotificationRepository.EXTRA_ROUTE)?.let { route ->
            val arg = intent.getStringExtra(NotificationRepository.EXTRA_ARG)
            // An open from a notification is what the budget and the learned timing read (PRD 2.1).
            intent.getStringExtra(NotificationRepository.EXTRA_KEY)?.let { key -> lifecycleScope.launch { notifications.opened(key) } }
            request = LaunchRequest.Open(
                when (route) {
                    "doc" -> arg?.let { Route.Doc(it) } ?: Route.Vault
                    "money" -> Route.MoneyInbox
                    "bills" -> Route.Recurring
                    "note" -> arg?.let { Route.Note(it) } ?: Route.Notes
                    "backup" -> Route.VaultBackup
                    "score" -> Route.Score
                    "focus" -> Route.Focus()
                    "journal" -> Route.JournalWrite()
                    "notifications" -> Route.Notifications
                    else -> Route.Today
                },
            )
            return
        }
        if (intent.action != Intent.ACTION_SEND) return
        val text = intent.getStringExtra(Intent.EXTRA_TEXT)
        @Suppress("DEPRECATION")
        val stream = intent.getParcelableExtra<Uri>(Intent.EXTRA_STREAM)
        val mime = intent.type.orEmpty()
        when {
            // Part 11.6: a shared picture becomes a note with the picture and the text read from it.
            stream != null && mime.startsWith("image/") -> lifecycleScope.launch {
                val id = notes.newFromPicture(stream, mime, intent.getStringExtra(Intent.EXTRA_SUBJECT).orEmpty(), text.orEmpty())
                if (id != null) request = LaunchRequest.Open(Route.Note(id))
                else android.widget.Toast.makeText(this@MainActivity, "Could not read that picture", android.widget.Toast.LENGTH_SHORT).show()
            }
            stream != null -> lifecycleScope.launch {
                runCatching { vault.import(stream, ME) }.onSuccess { request = LaunchRequest.Open(Route.Doc(it.docId)) }
            }
            text != null -> lifecycleScope.launch {
                when (money.capture(text, "paste")) {
                    is MoneyRepository.Capture.Added, MoneyRepository.Capture.Duplicate -> request = LaunchRequest.Open(Route.MoneyInbox)
                    // Anything that is not a bank alert becomes a note at once (Part 11.6), ready to edit or sort.
                    MoneyRepository.Capture.NotABankAlert -> {
                        val id = notes.save(null, intent.getStringExtra(Intent.EXTRA_SUBJECT).orEmpty(), text, source = "share")
                        request = LaunchRequest.Open(Route.Note(id))
                    }
                }
            }
        }
    }
}

@androidx.compose.runtime.Composable
private fun Locked(card: aiimin.core.database.PersonEntity?, onUnlock: () -> Unit) {
    var showCard by remember { androidx.compose.runtime.mutableStateOf(false) }
    val c = Aiimin.colors
    val context = androidx.compose.ui.platform.LocalContext.current
    Box(Modifier.fillMaxSize().background(c.base), contentAlignment = Alignment.Center) {
        if (!showCard) Column(horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.Center) {
            aiimin.designsystem.component.BrandMark(size = 56.dp)
            Spacer(Modifier.height(16.dp))
            Text("AIIMIN is locked", style = Aiimin.type.headline)
            Spacer(Modifier.height(16.dp))
            AppButton("Unlock", onUnlock)
            // LK1: the owner's emergency card is readable without unlocking.
            if (card != null && (card.blood.isNotBlank() || card.allergies.isNotBlank() || card.contacts != "[]")) {
                Spacer(Modifier.height(24.dp))
                Text(
                    "Emergency card", style = Aiimin.type.label.copy(color = c.link),
                    modifier = Modifier.clickable { showCard = true }.padding(12.dp),
                )
            }
        } else if (card != null) {
            Column(Modifier.fillMaxSize().padding(24.dp).verticalScroll(androidx.compose.foundation.rememberScrollState())) {
                Text("Emergency card · ${card.name.ifBlank { "Owner" }}", style = Aiimin.type.title)
                if (card.blood.isNotBlank()) { Text("Blood group", style = Aiimin.type.caption, modifier = Modifier.padding(top = 16.dp)); Text(card.blood, style = Aiimin.type.display) }
                listOf("Allergies" to card.allergies, "Medicines" to card.meds, "Doctor" to card.doctor).filter { it.second.isNotBlank() }.forEach { (k, v) ->
                    Text(k, style = Aiimin.type.caption, modifier = Modifier.padding(top = 14.dp)); Text(v, style = Aiimin.type.body.copy(fontSize = 18.sp))
                }
                val contacts = remember(card.contacts) {
                    runCatching { org.json.JSONArray(card.contacts).let { a -> (0 until a.length()).map { a.getJSONObject(it).let { o -> o.optString("n") to o.optString("p") } } } }.getOrDefault(emptyList())
                }
                run {
                    contacts.forEach { (name, phone) ->
                        Text(name, style = Aiimin.type.bodyStrong, modifier = Modifier.padding(top = 14.dp))
                        Text(phone, style = Aiimin.type.body.copy(color = c.link, fontSize = 18.sp), modifier = Modifier.clickable {
                            runCatching { context.startActivity(Intent(Intent.ACTION_DIAL, android.net.Uri.parse("tel:$phone"))) }
                        })
                    }
                }
                Text("Entered by the owner, not verified by AIIMIN. In an emergency call 112.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 24.dp))
                Spacer(Modifier.height(16.dp))
                AppButton("Back", { showCard = false }, kind = aiimin.designsystem.component.ButtonKind.SECONDARY)
            }
        }
    }
}

/**
 * Phones stay upright; tablets and unfolded foldables (smallest width 600 dp and up) turn freely.
 * Decided at runtime so Android 15 doesn't letterbox big screens and Android 16+ (which ignores a
 * manifest portrait lock on them) behaves the same way.
 */
fun orientationFor(smallestWidthDp: Int): Int =
    if (smallestWidthDp >= 600) android.content.pm.ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED
    else android.content.pm.ActivityInfo.SCREEN_ORIENTATION_PORTRAIT
