package aiimin.feature.config

import android.os.Build
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.ViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import aiimin.core.data.knock.KnockChannel
import aiimin.core.data.knock.KnockPrefs
import aiimin.core.data.knock.KnockStore
import aiimin.designsystem.component.GhostButton
import aiimin.designsystem.component.HairRule
import aiimin.designsystem.component.ScreenHead
import aiimin.designsystem.component.SectionRule
import aiimin.designsystem.component.TapSurface
import aiimin.designsystem.component.Text
import aiimin.designsystem.theme.AiiminTheme
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject

@HiltViewModel
class NotificationsViewModel @Inject constructor(
    private val knocks: KnockStore,
) : ViewModel() {
    val prefs = knocks.prefs
    fun setMaster(on: Boolean) = knocks.setMaster(on)
    fun setChannel(ch: KnockChannel, on: Boolean) = knocks.setChannel(ch, on)
    fun cycleQuiet() {
        val cur = knocks.prefs.value
        val nextStart = when (cur.quietStartMin) {
            21 * 60 -> 22 * 60 + 30
            22 * 60 + 30 -> 23 * 60
            else -> 21 * 60
        }
        knocks.setQuiet(nextStart, cur.quietEndMin)
    }
}

@Composable
fun NotificationsRoute(
    onBack: () -> Unit,
    onSystemSettings: () -> Unit,
    modifier: Modifier = Modifier,
    viewModel: NotificationsViewModel = hiltViewModel(),
) {
    val prefs by viewModel.prefs.collectAsStateWithLifecycle()
    val permLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission(),
    ) { granted ->
        if (!granted) viewModel.setMaster(false)
    }
    NotificationsScreen(
        prefs = prefs,
        onBack = onBack,
        onMaster = { on ->
            if (on && Build.VERSION.SDK_INT >= 33) {
                permLauncher.launch(android.Manifest.permission.POST_NOTIFICATIONS)
            }
            viewModel.setMaster(on)
        },
        onChannel = viewModel::setChannel,
        onQuiet = viewModel::cycleQuiet,
        onSystemSettings = onSystemSettings,
        modifier = modifier,
    )
}

@Composable
fun NotificationsScreen(
    prefs: KnockPrefs,
    onBack: () -> Unit,
    onMaster: (Boolean) -> Unit,
    onChannel: (KnockChannel, Boolean) -> Unit,
    onQuiet: () -> Unit,
    onSystemSettings: () -> Unit,
    modifier: Modifier = Modifier,
) {
    Column(
        modifier
            .fillMaxSize()
            .background(AiiminTheme.colors.bg)
            .verticalScroll(rememberScrollState())
            .padding(horizontal = AiiminTheme.space.page),
    ) {
        ScreenHead(title = "Knocks", meta = "ONE PING · ONE JOB")
        Text(
            text = "Earned attention. Witty, never shame. Quiet hours hold everything except a held sync.",
            style = AiiminTheme.type.bodySmall.copy(fontSize = 12.sp, lineHeight = 18.sp),
            color = AiiminTheme.colors.muted,
            modifier = Modifier.padding(top = AiiminTheme.space.s2, bottom = AiiminTheme.space.s4),
        )
        SectionRule(label = "Master")
        KnockRow(
            label = "Knocks",
            value = if (prefs.masterOn) "On" else "Off",
            on = prefs.masterOn,
            onToggle = { onMaster(!prefs.masterOn) },
        )
        KnockRow(
            label = "Quiet hours",
            value = prefs.summary.substringAfter("· ").ifBlank { prefs.summary },
            on = true,
            onToggle = onQuiet,
            toggleLabel = "CYCLE",
        )
        SectionRule(label = "Channels")
        KnockChannel.entries.forEachIndexed { i, ch ->
            KnockRow(
                label = ch.label,
                value = ch.blurb,
                on = prefs.isOn(ch) && prefs.masterOn,
                onToggle = { onChannel(ch, !prefs.isOn(ch)) },
                last = i == KnockChannel.entries.lastIndex,
            )
        }
        GhostButton(
            label = "System permission",
            onClick = onSystemSettings,
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = AiiminTheme.space.s6, bottom = AiiminTheme.space.s4),
        )
        GhostButton(
            label = "Back",
            onClick = onBack,
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = AiiminTheme.space.s8),
        )
    }
}

@Composable
private fun KnockRow(
    label: String,
    value: String,
    on: Boolean,
    onToggle: () -> Unit,
    last: Boolean = false,
    toggleLabel: String? = null,
) {
    Column(Modifier.fillMaxWidth()) {
        Row(
            Modifier
                .fillMaxWidth()
                .heightIn(min = 52.dp)
                .padding(vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s3),
        ) {
            Column(Modifier.weight(1f)) {
                Text(text = label, style = AiiminTheme.type.body, color = AiiminTheme.colors.text)
                Text(
                    text = value,
                    style = AiiminTheme.type.bodySmall.copy(fontSize = 11.sp),
                    color = AiiminTheme.colors.muted,
                )
            }
            TapSurface(onClick = onToggle, minTouchTarget = false) {
                Text(
                    text = toggleLabel ?: if (on) "ON" else "OFF",
                    style = AiiminTheme.type.chrome.copy(fontSize = 11.sp),
                    color = if (on) AiiminTheme.colors.accent else AiiminTheme.colors.muted,
                    modifier = Modifier
                        .border(aiimin.designsystem.theme.Hairline, AiiminTheme.colors.rule)
                        .padding(horizontal = AiiminTheme.space.s3, vertical = 6.dp),
                )
            }
        }
        if (!last) HairRule()
    }
}
