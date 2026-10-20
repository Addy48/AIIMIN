package aiimin.feature.onboarding

import aiimin.designsystem.theme.LocalReduceMotion
import aiimin.core.engine.profile.AgeBand
import aiimin.core.engine.raahi.RaahiMode
import aiimin.designsystem.component.ConsentSheet
import aiimin.designsystem.component.ConsentText
import aiimin.designsystem.component.LocalRaahiMode
import androidx.compose.animation.core.Animatable
import androidx.compose.runtime.CompositionLocalProvider
import aiimin.core.data.sync.MergePreview
import aiimin.designsystem.component.AppButton
import aiimin.designsystem.component.AppTextField
import aiimin.designsystem.component.AppIconButton
import aiimin.designsystem.component.AppSheet
import aiimin.designsystem.component.ButtonKind
import aiimin.designsystem.icon.AppIcons
import aiimin.designsystem.theme.Aiimin
import aiimin.designsystem.theme.Motion
import android.Manifest
import android.app.Activity
import android.os.Build
import androidx.activity.compose.BackHandler
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInHorizontally
import androidx.compose.animation.slideOutHorizontally
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import androidx.lifecycle.compose.LocalLifecycleOwner
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import java.time.LocalDate
import kotlinx.coroutines.launch

private enum class Overlay { SIGN_IN, SIGN_UP, UNDER_AGE }

/**
 * Onboarding in seven screens (PRD 1.6, 1.6b): Hello, Your day, Minimums, Try capture, Bank SMS, Raahi, Done.
 * Raahi speaks one fixed line per screen. One permission per screen, each after its Part 23 text. No account is
 * needed. The draft is saved on every change, so Back and a killed app keep what was entered.
 */
@Composable
fun OnboardingScreen(onDone: () -> Unit, vm: OnboardingViewModel = hiltViewModel()) {
    val c = Aiimin.colors
    val context = LocalContext.current
    val d by vm.draft.collectAsStateWithLifecycle()
    val session by vm.session.collectAsStateWithLifecycle(null)
    val saving by vm.saving.collectAsStateWithLifecycle()
    val merge by vm.merge.collectAsStateWithLifecycle()
    var overlay by remember { mutableStateOf<Overlay?>(null) }
    var under18 by remember { mutableStateOf<LocalDate?>(null) }
    var askNotify by remember { mutableStateOf(false) }
    var smsGranted by remember { mutableStateOf(vm.smsGranted()) }
    var smsAnswered by remember { mutableStateOf(false) }
    val scope = rememberCoroutineScope()
    val shrink = remember { Animatable(0f) }
    val reduce = LocalReduceMotion.current

    fun next() = vm.go(d.step + 1)
    fun back() { if (d.step > 0) vm.go(d.step - 1) else if (d.helloOpen) vm.update { it.copy(helloOpen = false) } }
    BackHandler(enabled = overlay != null || d.step > 0 || d.helloOpen) { if (overlay != null) overlay = null else back() }

    val notify = rememberLauncherForActivityResult(ActivityResultContracts.RequestPermission()) { next() }
    val sms = rememberLauncherForActivityResult(ActivityResultContracts.RequestPermission()) { ok -> smsGranted = ok; smsAnswered = true }

    // A first sign-in from screen 1 fills the name from the account.
    LaunchedEffect(session?.name) {
        val n = session?.name
        if (session?.signedIn == true && !n.isNullOrBlank() && d.name.isBlank()) vm.update { it.copy(name = n.substringBefore(' '), helloOpen = true) }
    }
    // Screen 1 confirms a guessed country (SIM, then network, then the phone's language).
    LaunchedEffect(Unit) { guessCountry(context)?.let { g -> if (d.country == "IN" && g != "IN") vm.update { it.copy(country = g) } } }

    when (overlay) {
        Overlay.SIGN_IN, Overlay.SIGN_UP -> {
            AuthFlow(
                vm.auth, if (overlay == Overlay.SIGN_UP) AuthMode.SIGN_UP else AuthMode.SIGN_IN,
                onBack = { overlay = null },
                onSignedIn = { overlay = null; vm.update { it.copy(helloOpen = true) } },
                prefillName = d.name,
            )
            merge?.takeIf { it.webHasData }?.let { MergeSheet(it, { vm.planReplace() }) { choice -> vm.mergeDone(choice) } }
            return
        }
        Overlay.UNDER_AGE -> {
            CompositionLocalProvider(LocalRaahiMode provides RaahiMode.QUIET) {
                Box(Modifier.fillMaxSize().background(c.base).statusBarsPadding().navigationBarsPadding()) {
                    Column(Modifier.verticalScroll(rememberScrollState())) {
                        UnderAgePage(
                            under18,
                            onPrint = { StartSmallPlanner.print(context) },
                            onRemind = { day -> remindOn(context, day) },
                            onClose = { (context as? Activity)?.finish() },
                        )
                    }
                }
            }
            return
        }
        null -> Unit
    }
    merge?.takeIf { it.webHasData }?.let { MergeSheet(it, { vm.planReplace() }) { choice -> vm.mergeDone(choice) } }

    // Screen 6 applies Raahi's mode at once: Off hides Raahi on every following screen too.
    CompositionLocalProvider(LocalRaahiMode provides RaahiMode.of(d.raahiMode)) {
    Column(Modifier.fillMaxSize().background(c.base).statusBarsPadding().navigationBarsPadding().imePadding()) {
        // Seven thin segments, no "step 3 of 7" text.
        Row(Modifier.fillMaxWidth().padding(horizontal = 24.dp).padding(top = 14.dp), horizontalArrangement = Arrangement.spacedBy(4.dp)) {
            (0..Draft.LAST).forEach { i -> Box(Modifier.weight(1f).height(3.dp).clip(RoundedCornerShape(2.dp)).background(if (i <= d.step) c.text else c.border)) }
        }
        Row(Modifier.fillMaxWidth().height(52.dp).padding(horizontal = 8.dp), verticalAlignment = Alignment.CenterVertically) {
            if (d.step >= 1 || d.helloOpen) AppIconButton(AppIcons.ArrowLeft, "Back", { back() }) else Spacer(Modifier.width(48.dp))
        }
        val page = d.step * 2 + if (d.step == 0 && d.helloOpen) 1 else 0
        AnimatedContent(
            page,
            transitionSpec = {
                val fwd = targetState > initialState
                if (reduce) fadeIn(Motion.reducedFade()).togetherWith(fadeOut(Motion.reducedFade()))
                else (slideInHorizontally(Motion.standard()) { if (fwd) it / 5 else -it / 5 } + fadeIn(Motion.standard()))
                    .togetherWith(slideOutHorizontally(Motion.exit()) { if (fwd) -it / 5 else it / 5 } + fadeOut(Motion.exit()))
            },
            label = "onboarding", modifier = Modifier.weight(1f),
        ) { p ->
            Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(horizontal = 24.dp)) {
                when (p) {
                    0 -> HelloPage()
                    1 -> AboutYouPage(d, { n -> vm.update { it.copy(name = n) } }, { dob -> vm.update { it.copy(dob = dob.toString(), ageOk = false) } }, { code -> vm.update { it.copy(country = code) } })
                    2 -> YourDayPage(d, { m -> vm.update { it.copy(wakeMin = m) } }, { m -> vm.update { it.copy(sleepMin = m) } })
                    4 -> {
                        LaunchedEffect(Unit) { if (!d.minsTouched && d.mins.isEmpty()) vm.update { it.copy(mins = listOf(FIRST_MIN)) } }
                        MinimumsPage(d) { list -> vm.update { it.copy(mins = list, minsTouched = true) } }
                    }
                    6 -> TryCapturePage(d.firstWin, vm::preview, vm::saveWin) { label -> vm.update { it.copy(firstWin = label) } }
                    8 -> BankSmsPage(smsGranted)
                    10 -> ChattinessPage(RaahiMode.of(d.raahiMode)) { m -> vm.update { it.copy(raahiMode = m.name) } }
                    else -> DonePage(d, shrink.value)
                }
                Spacer(Modifier.height(24.dp))
            }
        }
        // Bottom action
        Column(Modifier.fillMaxWidth().padding(horizontal = 24.dp, vertical = 16.dp), horizontalAlignment = Alignment.CenterHorizontally) {
            when (d.step) {
                0 -> if (!d.helloOpen) {
                    AppButton("Get started", { vm.update { it.copy(helloOpen = true) } }, Modifier.fillMaxWidth())
                    Spacer(Modifier.height(8.dp))
                    Row(Modifier.clickable { overlay = Overlay.SIGN_IN }.padding(10.dp)) {
                        Text("I already use aiimin.in · ", style = Aiimin.type.body.copy(color = c.textMuted))
                        Text("Sign in", style = Aiimin.type.body.copy(color = c.link, fontWeight = FontWeight.SemiBold))
                    }
                } else AppButton("Continue", {
                    val dob = d.dobDate ?: return@AppButton
                    // Under 18: stop here, keep nothing (1.6, Part 23). The date stays in memory only for the reminder.
                    if (!AgeBand.isAdult(dob, LocalDate.now())) {
                        under18 = AgeBand.eighteenth(dob).takeIf { !dob.isAfter(LocalDate.now()) }
                        vm.forget()
                        overlay = Overlay.UNDER_AGE
                    } else { vm.update { it.copy(ageOk = true) }; next() }
                }, Modifier.fillMaxWidth(), enabled = d.dob != null && d.name.isNotBlank())
                3 -> AppButton(if (d.firstWin != null) "Continue" else "Skip for now", {
                    // Notifications are asked at the first useful moment, after the first capture (1.6).
                    if (!vm.notificationsGranted()) askNotify = true else next()
                }, Modifier.fillMaxWidth(), kind = if (d.firstWin != null) ButtonKind.PRIMARY else ButtonKind.SECONDARY)
                4 -> if (smsGranted || smsAnswered) AppButton("Continue", { next() }, Modifier.fillMaxWidth())
                else {
                    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                        AppButton("Not now", { next() }, Modifier.weight(1f), kind = ButtonKind.SECONDARY)
                        AppButton("Allow", { sms.launch(Manifest.permission.READ_SMS) }, Modifier.weight(1f))
                    }
                    Text(ConsentText.FOOTER, style = Aiimin.type.caption, modifier = Modifier.padding(top = 10.dp))
                }
                Draft.LAST -> AppButton(if (saving) "Setting up…" else "Start my day", {
                    if (!saving) scope.launch {
                        shrink.animateTo(1f, Motion.move(reduce, Motion.arc()))
                        vm.finish(onDone)
                    }
                }, Modifier.fillMaxWidth(), enabled = !saving)
                else -> AppButton("Continue", { next() }, Modifier.fillMaxWidth())
            }
        }
    }
    }
    if (askNotify) ConsentSheet(
        ConsentText.NOTIFICATIONS,
        onAllow = { askNotify = false; if (Build.VERSION.SDK_INT >= 33) notify.launch(Manifest.permission.POST_NOTIFICATIONS) else next() },
        onNotNow = { askNotify = false; next() },
    )
}

/** SIM country, then network country, then the phone's region; null when none is known. */
private fun guessCountry(context: android.content.Context): String? {
    val tm = context.getSystemService(android.content.Context.TELEPHONY_SERVICE) as? android.telephony.TelephonyManager
    return listOfNotNull(tm?.simCountryIso, tm?.networkCountryIso, java.util.Locale.getDefault().country)
        .map { it.uppercase() }.firstOrNull { it.length == 2 }
}

/** Opens the phone's own calendar with an all-day reminder on the 18th birthday; AIIMIN stores nothing. */
private fun remindOn(context: android.content.Context, day: LocalDate) {
    val start = day.atStartOfDay(java.time.ZoneId.systemDefault()).toInstant().toEpochMilli()
    val intent = android.content.Intent(android.content.Intent.ACTION_INSERT)
        .setData(android.provider.CalendarContract.Events.CONTENT_URI)
        .putExtra(android.provider.CalendarContract.EXTRA_EVENT_BEGIN_TIME, start)
        .putExtra(android.provider.CalendarContract.EXTRA_EVENT_ALL_DAY, true)
        .putExtra(android.provider.CalendarContract.Events.TITLE, "Set up AIIMIN")
    runCatching { context.startActivity(intent) }
}

enum class MergeChoice { MERGE, REPLACE, SEPARATE }

/** AU3 · what is already on aiimin.in, before anything merges. */
@Composable
fun MergeSheet(p: MergePreview, plan: suspend () -> aiimin.core.data.sync.SyncRepository.ReplacePlan, onChoose: (MergeChoice) -> Unit) {
    val c = Aiimin.colors
    var confirmReplace by remember { mutableStateOf(false) }
    var typed by remember { mutableStateOf("") }
    AppSheet({ onChoose(MergeChoice.MERGE) }, title = if (confirmReplace) "Replace this phone's data?" else "Bring your data here?") {
        if (!confirmReplace) {
            Text("aiimin.in has ${p.webTasks} ${if (p.webTasks == 1) "task" else "tasks"}, ${p.webNotes} ${if (p.webNotes == 1) "note" else "notes"} and ${p.webPayments} ${if (p.webPayments == 1) "payment" else "payments"}.", style = Aiimin.type.body.copy(color = c.text))
            Text("Duplicates are matched and merged, never doubled. Documents stay on phones and are never merged.", style = Aiimin.type.body.copy(color = c.textMuted), modifier = Modifier.padding(top = 8.dp, bottom = 16.dp))
            AppButton("Merge with this phone", { onChoose(MergeChoice.MERGE) }, Modifier.fillMaxWidth())
            Spacer(Modifier.height(8.dp))
            AppButton("Replace this phone's data", { confirmReplace = true }, Modifier.fillMaxWidth(), kind = ButtonKind.SECONDARY)
            Spacer(Modifier.height(8.dp))
            AppButton("Keep this phone separate for now", { onChoose(MergeChoice.SEPARATE) }, Modifier.fillMaxWidth(), kind = ButtonKind.GHOST)
            Text("You can turn sync on later in You › Sync.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 10.dp))
        } else {
            // Measured fresh from the phone and aiimin.in before anything moves.
            val r by androidx.compose.runtime.produceState<aiimin.core.data.sync.SyncRepository.ReplacePlan?>(null) { value = plan() }
            val pl = r
            when {
                pl == null -> Text("Checking what's on aiimin.in…", style = Aiimin.type.body.copy(color = c.textMuted), modifier = Modifier.padding(bottom = 16.dp))
                pl.blocked != null -> Text(pl.blocked!!, style = Aiimin.type.body.copy(color = c.warn), modifier = Modifier.padding(bottom = 16.dp))
                else -> {
                    val parts = listOfNotNull(
                        "${pl.tasks} tasks".takeIf { pl.tasks > 0 }, "${pl.notes} notes".takeIf { pl.notes > 0 },
                        "${pl.events} events".takeIf { pl.events > 0 }, "${pl.goals} goals".takeIf { pl.goals > 0 },
                    )
                    Text(
                        (if (parts.isEmpty()) "Nothing on this phone needs to move." else "Moves to Trash: " + parts.joinToString(", ") + ". You can bring them all back in one tap from Sync settings for 30 days.") +
                            " Then aiimin.in's ${pl.webTasks} tasks, ${pl.webNotes} notes, ${pl.webEvents} events and ${pl.webGoals} goals come in.",
                        style = Aiimin.type.body,
                    )
                    Text("Never touched: payments, journal, documents, family tasks and Someday tasks.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 8.dp, bottom = 12.dp))
                    AppTextField(typed, { typed = it }, label = "Type REPLACE to confirm")
                    Spacer(Modifier.height(12.dp))
                }
            }
            AppButton("Replace", { onChoose(MergeChoice.REPLACE) }, Modifier.fillMaxWidth(), kind = ButtonKind.DANGER, enabled = pl != null && pl.blocked == null && typed.trim().equals("REPLACE", ignoreCase = false))
            Spacer(Modifier.height(8.dp))
            AppButton("Back", { confirmReplace = false }, Modifier.fillMaxWidth(), kind = ButtonKind.SECONDARY)
        }
    }
}

/** O-HC · the screen Health Connect's "Privacy policy" link opens. Back arrow only. */
@Composable
fun HealthPrivacyScreen(onBack: () -> Unit) {
    val c = Aiimin.colors
    BackHandler(onBack = onBack)
    Column(Modifier.fillMaxSize().background(c.base).statusBarsPadding().navigationBarsPadding()) {
        Row(Modifier.fillMaxWidth().padding(8.dp)) { AppIconButton(AppIcons.ArrowLeft, "Back", onBack) }
        Column(Modifier.weight(1f).verticalScroll(rememberScrollState()).padding(horizontal = 24.dp)) {
            Text("How AIIMIN uses Health Connect", style = Aiimin.type.title.copy(fontSize = 28.sp, lineHeight = 34.sp))
            Spacer(Modifier.height(20.dp))
            listOf(
                "What it reads" to "Steps, sleep sessions and resting heart rate. Nothing else, and only when you allow it.",
                "Why" to "To measure your day, not to judge it. The numbers feed your own Life Score, compared only with your own history.",
                "Where it stays" to "On this phone. If you sign in and leave sync on, only daily totals go to aiimin.in. Heart-rate samples and sleep stages never leave the phone.",
                "Never" to "Sold, shared with advertisers, used for ads or used to set insurance or loan terms.",
                "Taking it back" to "Turn any permission off in Health Connect, or in You → Sensors and permissions. AIIMIN stops reading at once and keeps what it already measured until you delete it.",
            ).forEach { (h, b) ->
                Text(h, style = Aiimin.type.headline, modifier = Modifier.padding(top = 14.dp))
                Text(b, style = Aiimin.type.body.copy(color = c.textMuted), modifier = Modifier.padding(top = 4.dp))
            }
            Text("Wellness information only. Not a medical device and not for diagnosis. In an emergency call 112.", style = Aiimin.type.caption, modifier = Modifier.padding(vertical = 28.dp))
        }
    }
}
