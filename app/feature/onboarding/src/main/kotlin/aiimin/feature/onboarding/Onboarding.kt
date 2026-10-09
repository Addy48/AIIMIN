package aiimin.feature.onboarding

import aiimin.core.data.app.SetupRepository
import aiimin.core.data.device.DeviceRepository
import aiimin.core.engine.BatteryMode
import aiimin.core.engine.RolePreset
import aiimin.designsystem.component.AppButton
import aiimin.designsystem.component.AppTextField
import aiimin.designsystem.component.ButtonKind
import aiimin.designsystem.component.CheckCircle
import aiimin.designsystem.component.ListRow
import aiimin.designsystem.component.Segmented
import aiimin.designsystem.theme.Aiimin
import aiimin.designsystem.theme.Motion
import aiimin.designsystem.theme.Shapes
import android.Manifest
import android.os.Build
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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.launch

@HiltViewModel
class OnboardingViewModel @Inject constructor(private val setup: SetupRepository, private val device: DeviceRepository) : ViewModel() {
    /** ViewModel scope: the screen leaves composition the moment setup completes. */
    fun finish(name: String, role: String, battery: BatteryMode, mins: List<String>, plan: Long?) =
        viewModelScope.launch { setup.complete(name, role, emptyList(), battery, mins, plan) }

    fun usageIntent() = device.usageSettingsIntent()
    fun healthContract() = device.healthContract()
    val healthPermissions get() = device.healthPermissions
}

private val SUGGESTED = listOf(
    "Walk 20 minutes" to "Walk to the gate",
    "Read 10 pages" to "Read 1 page",
    "Journal 3 lines" to "Write 1 line",
    "No phone in bed" to "Phone off the bed",
    "Log every spend" to "Log one spend",
    "Drink 2 litres of water" to "One glass",
    "10 minutes of stretching" to "One stretch",
    "Plan tomorrow" to "Pick tomorrow's one thing",
)

@Composable
fun OnboardingScreen(onDone: () -> Unit, vm: OnboardingViewModel = hiltViewModel()) {
    val c = Aiimin.colors
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    var step by remember { mutableIntStateOf(0) }
    var name by remember { mutableStateOf("") }
    var role by remember { mutableStateOf("default") }
    val mins = remember { mutableStateListOf("Walk 20 minutes", "Read 10 pages", "Journal 3 lines") }
    var custom by remember { mutableStateOf("") }
    var battery by remember { mutableStateOf(BatteryMode.GENTLE) }
    var plan by remember { mutableStateOf("") }
    var saving by remember { mutableStateOf(false) }
    val health = rememberLauncherForActivityResult(vm.healthContract()) {}
    val notif = rememberLauncherForActivityResult(ActivityResultContracts.RequestPermission()) {}
    val last = 6

    Column(Modifier.fillMaxSize().background(c.base).statusBarsPadding().navigationBarsPadding().imePadding()) {
        if (step > 0) {
            Row(Modifier.fillMaxWidth().padding(horizontal = 24.dp, vertical = 16.dp), horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                (1..last).forEach { i -> Box(Modifier.weight(1f).height(3.dp).clip(Shapes.tag).background(if (i <= step) c.accent else c.raised)) }
            }
        }
        AnimatedContent(
            step,
            transitionSpec = {
                val fwd = targetState > initialState
                (slideInHorizontally(tween(Motion.SLOW, easing = Motion.enter)) { if (fwd) it / 4 else -it / 4 } + fadeIn(tween(Motion.BASE)))
                    .togetherWith(slideOutHorizontally(tween(Motion.BASE, easing = Motion.exit)) { if (fwd) -it / 4 else it / 4 } + fadeOut(tween(Motion.FAST)))
            },
            label = "onboarding",
            modifier = Modifier.weight(1f),
        ) { s ->
            Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(horizontal = 24.dp)) {
                when (s) {
                    0 -> {
                        Spacer(Modifier.height(96.dp))
                        Text("AIIMIN", style = Aiimin.type.eyebrow.copy(color = c.accent, fontSize = 13.sp))
                        Spacer(Modifier.height(16.dp))
                        Text("Your days, your money and your family's papers — in one app that only ever compares you with you.", style = Aiimin.type.title)
                        Spacer(Modifier.height(16.dp))
                        Text("Steps and screen time are measured, not typed. Bank alerts are read on this phone. Nothing is ranked, and nothing is shared unless you share it.", style = Aiimin.type.body.copy(color = c.textMuted))
                    }
                    1 -> Step("What should we call you?", "Just a first name is fine.") {
                        AppTextField(name, { name = it }, placeholder = "Name")
                    }
                    2 -> Step("Who are you here?", "This only pre-fills what counts. You change any of it later, and nobody is scored against a preset.") {
                        RolePreset.ALL.forEach { p ->
                            Option(p.name, p.description, role == p.key) { role = p.key }
                        }
                    }
                    3 -> Step("Your daily minimums", "The floor for a day you keep — small enough for a bad day. Pick two to four.") {
                        SUGGESTED.forEach { (m, tiny) ->
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                CheckCircle(m in mins, { if (m in mins) mins.remove(m) else mins.add(m) }, m)
                                Column { Text(m, style = Aiimin.type.bodyStrong); Text("Tiny version: $tiny", style = Aiimin.type.caption) }
                            }
                        }
                        mins.filter { it !in SUGGESTED.map { s -> s.first } }.forEach { m ->
                            Row(verticalAlignment = Alignment.CenterVertically) { CheckCircle(true, { mins.remove(m) }, m); Text(m, style = Aiimin.type.bodyStrong) }
                        }
                        AppTextField(custom, { custom = it }, placeholder = "Your own…", onDone = { if (custom.isNotBlank()) { mins.add(custom.trim()); custom = "" } })
                    }
                    4 -> Step("How firm should it be?", "The discipline battery shows how this week is going. You can change mode once a week.") {
                        Segmented(listOf("Gentle", "Standard", "Hardcore"), battery.ordinal, { battery = BatteryMode.entries[it] })
                        Spacer(Modifier.height(14.dp))
                        Text(
                            when (battery) {
                                BatteryMode.GENTLE -> "Misses cost little, the first each week is free, and it never hits zero. Most people should start here."
                                BatteryMode.STANDARD -> "Misses cost more. At zero, a three-day comeback restores it. Nothing is ever deleted."
                                BatteryMode.HARDCORE -> "No free misses, no freezes, no repairs. For people who want it to bite."
                            },
                            style = Aiimin.type.body,
                        )
                    }
                    5 -> Step("A monthly plan for spending?", "Optional. Money is scored as keeping your own pace — never as spending less.") {
                        AppTextField(plan, { plan = it.filter(Char::isDigit) }, placeholder = "₹ per month", keyboardType = KeyboardType.Number)
                    }
                    else -> Step("Let the phone do the logging", "Each is optional and can be changed in Me → Sensors.") {
                        ListRow("Screen time", subtitle = "Usage access — per-app time, unlocks, late nights", onClick = { context.startActivity(vm.usageIntent()) })
                        ListRow("Steps and sleep", subtitle = "Health Connect — the same numbers your phone and watch show", onClick = { runCatching { health.launch(vm.healthPermissions) } })
                        if (Build.VERSION.SDK_INT >= 33) ListRow("Reminders", subtitle = "Expiring documents and minimums left today", onClick = { notif.launch(Manifest.permission.POST_NOTIFICATIONS) })
                    }
                }
            }
        }
        Row(Modifier.fillMaxWidth().padding(24.dp), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            if (step > 0) AppButton("Back", { step-- }, kind = ButtonKind.GHOST)
            Spacer(Modifier.weight(1f))
            val canNext = when (step) {
                1 -> name.isNotBlank()
                else -> !saving
            }
            AppButton(
                when (step) { 0 -> "Begin"; last -> "Start my day"; 5 -> if (plan.isBlank()) "Skip" else "Next"; else -> "Next" },
                {
                    if (step < last) step++ else {
                        saving = true
                        vm.finish(name, role, battery, mins.toList(), plan.toLongOrNull())
                        onDone()
                    }
                },
                enabled = canNext,
            )
        }
    }
}

@Composable
private fun Step(title: String, body: String, content: @Composable () -> Unit) {
    Spacer(Modifier.height(24.dp))
    Text(title, style = Aiimin.type.title)
    Spacer(Modifier.height(8.dp))
    Text(body, style = Aiimin.type.body.copy(color = Aiimin.colors.textMuted))
    Spacer(Modifier.height(24.dp))
    content()
}

@Composable
private fun Option(title: String, body: String, selected: Boolean, onClick: () -> Unit) {
    val c = Aiimin.colors
    Column(
        Modifier.fillMaxWidth().padding(vertical = 4.dp).clip(Shapes.row)
            .border(1.dp, if (selected) c.accent else c.border, Shapes.row)
            .background(if (selected) c.accentSoft else c.base)
            .clickable(onClick = onClick).padding(14.dp),
    ) {
        Text(title, style = Aiimin.type.bodyStrong)
        Text(body, style = Aiimin.type.caption)
    }
}
