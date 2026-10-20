package aiimin.feature.onboarding

import aiimin.designsystem.theme.LocalReduceMotion
import aiimin.core.data.sync.MergePreview
import aiimin.core.sensing.HealthAvailability
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
import androidx.compose.animation.core.tween
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
import java.time.Period
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

private enum class Overlay { SIGN_IN, SIGN_UP, HEALTH, UNDER_AGE }

private const val LAST = 9

/**
 * The ten onboarding pages (plan §4.1). One decision each, skippable from O3 to O9, and no account
 * needed before the first win. The draft is saved on every change, so a killed app resumes in place.
 */
@Composable
fun OnboardingScreen(onDone: () -> Unit, vm: OnboardingViewModel = hiltViewModel()) {
    val c = Aiimin.colors
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val d by vm.draft.collectAsStateWithLifecycle()
    val session by vm.session.collectAsStateWithLifecycle(null)
    val access by vm.access.collectAsStateWithLifecycle()
    val saving by vm.saving.collectAsStateWithLifecycle()
    val merge by vm.merge.collectAsStateWithLifecycle()
    var overlay by remember { mutableStateOf<Overlay?>(null) }
    var toast by remember { mutableStateOf<String?>(null) }
    val signedInAs = session?.takeIf { it.signedIn }?.let { it.osId ?: it.label ?: it.email }

    val health = rememberLauncherForActivityResult(vm.healthContract()) { vm.recheck() }
    val notify = rememberLauncherForActivityResult(ActivityResultContracts.RequestPermission()) { vm.recheck() }
    // Android's own screens are left to come back from; re-read what is allowed each time we return.
    val owner = LocalLifecycleOwner.current
    DisposableEffect(owner) {
        val obs = LifecycleEventObserver { _, e -> if (e == Lifecycle.Event.ON_RESUME) vm.recheck() }
        owner.lifecycle.addObserver(obs)
        onDispose { owner.lifecycle.removeObserver(obs) }
    }
    LaunchedEffect(toast) { if (toast != null) { delay(2600); toast = null } }

    fun next() = vm.go(d.step + 1)
    fun back() { if (d.step > 0) vm.go(d.step - 1) }
    BackHandler(enabled = overlay != null || d.step > 0) { if (overlay != null) overlay = null else back() }

    // Signing in on O9 moves on by itself, after the person has seen the check mark.
    LaunchedEffect(signedInAs, d.step) {
        if (signedInAs != null && d.step == 8 && overlay == null) { delay(800); next() }
    }
    // A first sign-in from O1 resumes at O2 with the name filled from the account.
    LaunchedEffect(session?.name) {
        val n = session?.name
        if (session?.signedIn == true && !n.isNullOrBlank() && d.name.isBlank()) vm.update { it.copy(name = n.substringBefore(' ')) }
    }

    when (overlay) {
        Overlay.SIGN_IN, Overlay.SIGN_UP -> {
            AuthFlow(
                vm.auth, if (overlay == Overlay.SIGN_UP) AuthMode.SIGN_UP else AuthMode.SIGN_IN,
                onBack = { overlay = null },
                onSignedIn = {
                    val from = d.step
                    overlay = null
                    if (from == 0) vm.go(1)
                },
                prefillName = d.name,
            )
            merge?.takeIf { it.webHasData }?.let { MergeSheet(it, { vm.planReplace() }) { choice -> vm.mergeDone(choice) } }
            return
        }
        Overlay.HEALTH -> { HealthPrivacyScreen(onBack = { overlay = null }); return }
        Overlay.UNDER_AGE -> {
            UnderAgePage { vm.update { Draft() }; (context as? Activity)?.finish() }
            return
        }
        null -> Unit
    }
    // The merge choice can appear after sign-in even when the overlay has closed.
    merge?.takeIf { it.webHasData }?.let { MergeSheet(it, { vm.planReplace() }) { choice -> vm.mergeDone(choice) } }

    Column(Modifier.fillMaxSize().background(c.base).statusBarsPadding().navigationBarsPadding().imePadding()) {
        // Ten thin segments, no "step 3 of 10" text.
        Row(Modifier.fillMaxWidth().padding(horizontal = 24.dp).padding(top = 14.dp), horizontalArrangement = Arrangement.spacedBy(4.dp)) {
            (0..LAST).forEach { i -> Box(Modifier.weight(1f).height(3.dp).clip(RoundedCornerShape(2.dp)).background(if (i <= d.step) c.text else c.border)) }
        }
        Row(Modifier.fillMaxWidth().height(52.dp).padding(horizontal = 8.dp), verticalAlignment = Alignment.CenterVertically) {
            if (d.step >= 2) AppIconButton(AppIcons.ArrowLeft, "Back", { back() }) else Spacer(Modifier.width(48.dp))
            Spacer(Modifier.weight(1f))
            if (d.step in 2..8) Text("Skip", style = Aiimin.type.label.copy(color = c.textMuted, fontSize = 15.sp), modifier = Modifier.clickable {
                // Skipping fills a sensible default; nothing blocks.
                when (d.step) {
                    2 -> vm.update { it.copy(role = it.role ?: "default") }
                    3 -> vm.update { it.copy(mins = if (it.minsTouched) it.mins else defaultMinsFor(it.role)) }
                }
                next()
            }.padding(12.dp))
        }
        val reduce = LocalReduceMotion.current
        AnimatedContent(
            d.step,
            transitionSpec = {
                val fwd = targetState > initialState
                if (reduce) fadeIn(Motion.reducedFade()).togetherWith(fadeOut(Motion.reducedFade()))
                else (slideInHorizontally(Motion.standard()) { if (fwd) it / 5 else -it / 5 } + fadeIn(Motion.standard()))
                    .togetherWith(slideOutHorizontally(Motion.exit()) { if (fwd) -it / 5 else it / 5 } + fadeOut(Motion.exit()))
            },
            label = "onboarding", modifier = Modifier.weight(1f),
        ) { step ->
            Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(horizontal = 24.dp)) {
                when (step) {
                    0 -> Welcome()
                    1 -> NamePage(d, { n -> vm.update { it.copy(name = n) } }, { dob -> vm.update { it.copy(dob = dob.toString()) } })
                    2 -> RolePage(d, { k -> vm.update { it.copy(role = k, mins = if (it.minsTouched) it.mins else defaultMinsFor(k)) } }, { r -> vm.update { it.copy(roster = r) } })
                    3 -> {
                        LaunchedEffect(Unit) { if (!d.minsTouched && d.mins.isEmpty()) vm.update { it.copy(mins = defaultMinsFor(it.role)) } }
                        MinimumsPage(d) { list -> vm.update { it.copy(mins = list, minsTouched = true) } }
                    }
                    4 -> BatteryPage(d) { m -> vm.update { it.copy(battery = m.name) } }
                    5 -> MoneyPage(d, { b -> vm.update { it.copy(banks = b) } }, { cash -> vm.update { it.copy(cash = cash) } }, { p -> vm.update { it.copy(plan = p) } })
                    6 -> {
                        LaunchedEffect(Unit) { vm.recheck() }
                        PermissionsPage(
                            access,
                            onRequest = { key ->
                                when (key) {
                                    "usage" -> context.startActivity(vm.usageIntent().addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK))
                                    "health" -> if (access?.health == HealthAvailability.UNAVAILABLE) runCatching { context.startActivity(vm.healthInstallIntent().addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK)) } else runCatching { health.launch(vm.healthPermissions) }
                                    "listener" -> context.startActivity(vm.listenerIntent())
                                    else -> if (Build.VERSION.SDK_INT >= 33) notify.launch(Manifest.permission.POST_NOTIFICATIONS)
                                }
                            },
                            onHealthRationale = { overlay = Overlay.HEALTH },
                        )
                    }
                    7 -> VoicePage(d.firstWin, vm::preview, vm::saveWin, { label -> vm.update { it.copy(firstWin = label) } }, { toast = it })
                    8 -> KeepSafePage(signedInAs)
                    else -> ReadyPage(d, signedInAs, access) { vm.go(it) }
                }
                Spacer(Modifier.height(24.dp))
            }
        }
        // Bottom action
        Column(Modifier.fillMaxWidth().padding(horizontal = 24.dp, vertical = 16.dp), horizontalAlignment = Alignment.CenterHorizontally) {
            toast?.let { Text(it, style = Aiimin.type.caption.copy(color = c.warn), modifier = Modifier.padding(bottom = 8.dp)) }
            when (d.step) {
                0 -> {
                    AppButton("Get started", { next() }, Modifier.fillMaxWidth())
                    Spacer(Modifier.height(8.dp))
                    Row(Modifier.clickable { overlay = Overlay.SIGN_IN }.padding(10.dp)) {
                        Text("I already use aiimin.in · ", style = Aiimin.type.body.copy(color = c.textMuted))
                        Text("Sign in", style = Aiimin.type.body.copy(color = c.link, fontWeight = FontWeight.SemiBold))
                    }
                }
                1 -> AppButton("Continue", {
                    val age = d.dobDate?.let { Period.between(it, LocalDate.now()).years } ?: 0
                    if (age < 18) overlay = Overlay.UNDER_AGE else next()
                }, Modifier.fillMaxWidth(), enabled = d.dob != null)
                3 -> AppButton(if (d.mins.isEmpty()) "Skip for now" else "Continue", { next() }, Modifier.fillMaxWidth())
                7 -> AppButton(if (d.firstWin != null) "Continue" else "Skip for now", { next() }, Modifier.fillMaxWidth(), kind = if (d.firstWin != null) ButtonKind.PRIMARY else ButtonKind.SECONDARY)
                8 -> {
                    if (signedInAs == null) {
                        AppButton("Sign in", { overlay = Overlay.SIGN_IN }, Modifier.fillMaxWidth())
                        Spacer(Modifier.height(8.dp))
                        AppButton("Create an account", { overlay = Overlay.SIGN_UP }, Modifier.fillMaxWidth(), kind = ButtonKind.SECONDARY)
                        Spacer(Modifier.height(4.dp))
                        Text("Stay on this phone only", style = Aiimin.type.label.copy(color = c.link), modifier = Modifier.clickable { next() }.padding(12.dp))
                    } else AppButton("Continue", { next() }, Modifier.fillMaxWidth())
                }
                LAST -> AppButton(if (saving) "Setting up…" else "Start my day", { if (!saving) vm.finish(onDone) }, Modifier.fillMaxWidth(), enabled = !saving)
                else -> AppButton("Continue", { next() }, Modifier.fillMaxWidth())
            }
        }
    }
}

@Composable
private fun Welcome() {
    val c = Aiimin.colors
    Spacer(Modifier.height(8.dp))
    Row(verticalAlignment = Alignment.CenterVertically) {
        aiimin.designsystem.component.BrandMark(size = 26.dp)
        Spacer(Modifier.width(8.dp))
        Text("AIIMIN", style = Aiimin.type.headline.copy(fontSize = 14.sp, fontWeight = FontWeight.Bold, letterSpacing = 1.8.sp))
    }
    Spacer(Modifier.height(20.dp))
    // Hero: the day as an arc under a dawn sky, the sun a little past sunrise. The same arc lives on Today.
    val shape = androidx.compose.foundation.shape.RoundedCornerShape(24.dp)
    val sky = androidx.compose.ui.graphics.Brush.verticalGradient(listOf(c.accentSoft, c.surface))
    androidx.compose.foundation.Canvas(
        Modifier.fillMaxWidth().height(180.dp).clip(shape).background(sky).border(1.dp, c.border, shape),
    ) {
        val w = size.width
        val h = size.height
        val base = h * 0.80f
        val arc = androidx.compose.ui.graphics.Path().apply {
            moveTo(w * 0.08f, base)
            cubicTo(w * 0.30f, h * 0.10f, w * 0.70f, h * 0.10f, w * 0.92f, base)
        }
        drawLine(c.border, androidx.compose.ui.geometry.Offset(w * 0.06f, base), androidx.compose.ui.geometry.Offset(w * 0.94f, base), strokeWidth = 2f)
        drawPath(arc, c.text.copy(alpha = 0.85f), style = androidx.compose.ui.graphics.drawscope.Stroke(width = 5f, cap = androidx.compose.ui.graphics.StrokeCap.Round))
        // A point on the arc's cubic curve at t, so markers sit exactly on the line.
        fun on(t: Float): androidx.compose.ui.geometry.Offset {
            val u = 1f - t
            val x = u * u * u * w * 0.08f + 3 * u * u * t * w * 0.30f + 3 * u * t * t * w * 0.70f + t * t * t * w * 0.92f
            val y = u * u * u * base + 3 * u * u * t * h * 0.10f + 3 * u * t * t * h * 0.10f + t * t * t * base
            return androidx.compose.ui.geometry.Offset(x, y)
        }
        // three moments of a day sit on the arc
        listOf(0.2f, 0.5f, 0.8f).forEach { t ->
            drawCircle(c.surface, 9f, on(t))
            drawCircle(c.text.copy(alpha = 0.55f), 9f, on(t), style = androidx.compose.ui.graphics.drawscope.Stroke(3f))
        }
        val sun = on(0.32f)
        drawCircle(c.accent.copy(alpha = 0.18f), 34f, sun)
        drawCircle(c.accent, 18f, sun)
    }
    Spacer(Modifier.height(24.dp))
    Text(
        "Your day, your money and your family's papers, in one calm place.",
        style = Aiimin.type.title.copy(fontSize = 28.sp, lineHeight = 34.sp, letterSpacing = (-0.6).sp),
    )
    Text(
        "It only ever compares you with you.",
        style = Aiimin.type.body.copy(fontSize = 16.sp, color = c.textMuted), modifier = Modifier.padding(top = 8.dp),
    )
    Spacer(Modifier.height(22.dp))
    listOf(
        Triple(AppIcons.Mic, "Say it once", "Tasks, money and notes land in the right place."),
        Triple(AppIcons.DeviceMobile, "Your phone counts", "Screen time and steps fill in by themselves."),
        Triple(AppIcons.Lock, "Private by default", "Bank alerts are read on your phone. No ads, no loans, nothing sold."),
    ).forEach { (icon, title, line) ->
        Row(Modifier.padding(bottom = 14.dp), verticalAlignment = Alignment.CenterVertically) {
            aiimin.designsystem.component.IconTile(icon)
            Spacer(Modifier.width(14.dp))
            Column(Modifier.weight(1f)) {
                Text(title, style = Aiimin.type.bodyStrong)
                Text(line, style = Aiimin.type.caption.copy(fontSize = 14.sp, lineHeight = 19.sp))
            }
        }
    }
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
            Text("You can turn sync on later in Me › Sync.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 10.dp))
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
                "Taking it back" to "Turn any permission off in Health Connect, or in Me → Sensors and permissions. AIIMIN stops reading at once and keeps what it already measured until you delete it.",
            ).forEach { (h, b) ->
                Text(h, style = Aiimin.type.headline, modifier = Modifier.padding(top = 14.dp))
                Text(b, style = Aiimin.type.body.copy(color = c.textMuted), modifier = Modifier.padding(top = 4.dp))
            }
            Text("Wellness information only. Not a medical device and not for diagnosis. In an emergency call 112.", style = Aiimin.type.caption, modifier = Modifier.padding(vertical = 28.dp))
        }
    }
}
