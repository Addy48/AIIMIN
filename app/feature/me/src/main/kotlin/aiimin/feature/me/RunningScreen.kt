package aiimin.feature.me

import aiimin.core.data.pulse.Pulse
import aiimin.core.data.pulse.Reason
import aiimin.core.data.pulse.RunStatus
import aiimin.core.engine.pulse.Freshness
import aiimin.core.engine.pulse.Job
import aiimin.designsystem.component.AppButton
import aiimin.designsystem.component.ButtonKind
import aiimin.designsystem.component.ListRow
import aiimin.designsystem.component.SectionHeader
import aiimin.designsystem.component.TopBar
import aiimin.designsystem.nav.LocalNavigator
import aiimin.designsystem.theme.Aiimin
import android.content.Context
import android.os.PowerManager
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableLongStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.ViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

@HiltViewModel
class RunningViewModel @Inject constructor(private val pulse: Pulse, auth: aiimin.core.data.sync.AuthRepository) : ViewModel() {
    val runs = pulse.runs.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())
    val signedIn = auth.session.map { it?.signedIn == true }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), true)
    val running = pulse.running

    fun runAll() = viewModelScope.launch { pulse.beat(Reason.MANUAL, force = Job.entries.toSet()) }
}

/** Me › About › How AIIMIN is running. Makes "nothing is sitting dead" checkable. */
@Composable
fun RunningScreen(vm: RunningViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val context = LocalContext.current
    val c = Aiimin.colors
    val runs by vm.runs.collectAsStateWithLifecycle()
    val running by vm.running.collectAsStateWithLifecycle()
    val signedIn by vm.signedIn.collectAsStateWithLifecycle()
    var now by remember { mutableLongStateOf(System.currentTimeMillis()) }
    LaunchedEffect(Unit) { while (true) { delay(15_000); now = System.currentTimeMillis() } }
    val unrestricted = remember(running) {
        (context.getSystemService(Context.POWER_SERVICE) as PowerManager).isIgnoringBatteryOptimizations(context.packageName)
    }
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar("How AIIMIN is running", onBack = { nav.back() })
        Column(Modifier.weight(1f).verticalScroll(rememberScrollState()).padding(horizontal = Aiimin.space.gutter)) {
            Text(
                "One heartbeat keeps your numbers fresh: every minute while AIIMIN is open, about every 15 minutes while it's closed. If the phone skips a run, it catches up the next time anything wakes AIIMIN.",
                style = Aiimin.type.body, modifier = Modifier.padding(top = 8.dp),
            )
            SectionHeader("Jobs")
            val byJob = runs.associateBy { it.job }
            Freshness.order.forEach { job ->
                val st = RunStatus.of(job, byJob[job.name], now, signedIn = signedIn)
                ListRow(
                    job.label,
                    subtitle = st.line,
                    maxSubtitleLines = 2,
                    trailing = {
                        Box(
                            Modifier.size(8.dp).background(when { st.waiting -> c.border; st.healthy -> c.done; else -> c.accent }, CircleShape)
                                .semantics { contentDescription = when { st.waiting -> "Waiting"; st.healthy -> "Healthy"; else -> "Needs attention" } },
                        )
                    },
                )
            }
            SectionHeader("Background")
            ListRow(
                if (unrestricted) "Battery: unrestricted" else "Battery: optimised",
                subtitle = if (unrestricted) "The phone lets AIIMIN run on time." else "Some phones delay or skip background runs. If numbers look stale, set AIIMIN's battery use to Unrestricted.",
                maxSubtitleLines = 3,
            )
            AppButton(
                if (running) "Running…" else "Run everything now", { vm.runAll() },
                kind = ButtonKind.SECONDARY, enabled = !running,
                modifier = Modifier.fillMaxWidth().padding(top = 16.dp, bottom = 32.dp),
            )
        }
    }
}
