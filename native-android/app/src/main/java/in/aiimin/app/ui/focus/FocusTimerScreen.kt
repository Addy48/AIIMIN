package `in`.aiimin.app.ui.focus

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Tab
import androidx.compose.material3.TabRow
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import `in`.aiimin.app.AppContainer
import `in`.aiimin.app.ui.components.ScreenChrome
import `in`.aiimin.app.ui.theme.Accent
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.time.LocalDate

private data class FocusPreset(val label: String, val sub: String, val minutes: Int)

private val presets = listOf(
    FocusPreset("15", "min", 15),
    FocusPreset("25", "min", 25),
    FocusPreset("30", "min", 30),
    FocusPreset("45", "min", 45),
    FocusPreset("1", "h", 60),
    FocusPreset("2", "h", 120),
)

private val dayLabels = listOf("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun")

@Composable
fun FocusTimerScreen(container: AppContainer, onBack: () -> Unit) {
    var tab by remember { mutableIntStateOf(0) }
    val focusStats by container.appPrefs.focusStats.collectAsState(
        initial = `in`.aiimin.app.data.prefs.FocusStats(),
    )

    ScreenChrome {
        Column(Modifier.fillMaxSize()) {
            TabRow(selectedTabIndex = tab, containerColor = MaterialTheme.colorScheme.surface) {
                Tab(selected = tab == 0, onClick = { tab = 0 }, text = { Text("Timer") })
                Tab(selected = tab == 1, onClick = { tab = 1 }, text = { Text("Stats") })
            }
            when (tab) {
                0 -> FocusTimerTab(container, onBack)
                else -> FocusStatsTab(focusStats, onBack)
            }
        }
    }
}

@Composable
private fun FocusTimerTab(container: AppContainer, onBack: () -> Unit) {
    var selectedMins by remember { mutableIntStateOf(25) }
    var totalSec by remember { mutableIntStateOf(25 * 60) }
    var remaining by remember { mutableIntStateOf(25 * 60) }
    var running by remember { mutableStateOf(false) }
    var intent by remember { mutableStateOf("") }
    var logged by remember { mutableStateOf(false) }
    val haptics = LocalHapticFeedback.current
    val scope = rememberCoroutineScope()
    val progress by animateFloatAsState(
        if (totalSec == 0) 0f else 1f - (remaining.toFloat() / totalSec.toFloat()),
        label = "focus-progress",
    )

    LaunchedEffect(running, remaining) {
        if (!running || remaining <= 0) return@LaunchedEffect
        delay(1000)
        remaining -= 1
        if (remaining <= 0) {
            running = false
            logged = false
            haptics.performHapticFeedback(HapticFeedbackType.LongPress)
        }
    }

    fun format(sec: Int): String = "%02d:%02d".format(sec / 60, sec % 60)

    fun pickPreset(mins: Int) {
        running = false
        logged = false
        selectedMins = mins
        totalSec = mins * 60
        remaining = mins * 60
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        OutlinedTextField(
            value = intent,
            onValueChange = { intent = it },
            modifier = Modifier.fillMaxWidth(),
            placeholder = { Text("What will you work on?") },
            singleLine = true,
        )
        Text(format(remaining), fontSize = 72.sp, fontWeight = FontWeight.ExtraBold, color = Accent)
        LinearProgressIndicator(progress = { progress }, modifier = Modifier.fillMaxWidth(), color = Accent)
        LazyVerticalGrid(
            columns = GridCells.Fixed(3),
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            items(presets) { preset ->
                val selected = selectedMins == preset.minutes
                Column(
                    Modifier
                        .height(72.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .background(if (selected) Accent.copy(alpha = 0.1f) else MaterialTheme.colorScheme.surface)
                        .border(
                            width = if (selected) 2.dp else 1.dp,
                            color = if (selected) Accent else MaterialTheme.colorScheme.outline,
                            shape = RoundedCornerShape(12.dp),
                        )
                        .clickable { pickPreset(preset.minutes) }
                        .padding(vertical = 12.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center,
                ) {
                    Text(preset.label, fontSize = 24.sp, fontWeight = FontWeight.SemiBold)
                    Text(preset.sub, style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
            }
        }
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.fillMaxWidth()) {
            Button(
                onClick = {
                    if (remaining <= 0) remaining = totalSec
                    running = !running
                    haptics.performHapticFeedback(HapticFeedbackType.TextHandleMove)
                },
                modifier = Modifier.weight(0.6f),
            ) { Text(if (running) "Pause" else "Start") }
            OutlinedButton(
                onClick = {
                    running = false
                    remaining = totalSec
                    logged = false
                },
                modifier = Modifier.weight(0.4f),
            ) { Text("Reset") }
        }
        if (remaining <= 0 && totalSec > 0 && !logged) {
            Card(Modifier.fillMaxWidth()) {
                Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("Session done${if (intent.isNotBlank()) " · $intent" else ""}", style = MaterialTheme.typography.titleMedium)
                    Button(
                        onClick = {
                            scope.launch {
                                container.appPrefs.logFocusSession(selectedMins)
                                logged = true
                            }
                        },
                        modifier = Modifier.fillMaxWidth(),
                    ) { Text("Log session") }
                }
            }
        }
        Spacer(Modifier.weight(1f))
        OutlinedButton(onClick = onBack, modifier = Modifier.fillMaxWidth()) { Text("Back to More") }
    }
}

@Composable
private fun FocusStatsTab(
    stats: `in`.aiimin.app.data.prefs.FocusStats,
    onBack: () -> Unit,
) {
    val max = stats.weeklyMinutes.maxOrNull()?.coerceAtLeast(1) ?: 1
    val todayIndex = LocalDate.now().dayOfWeek.value - 1
    val bestDayIndex = stats.weeklyMinutes.indices.maxByOrNull { stats.weeklyMinutes[it] } ?: todayIndex
    val bestMinutes = stats.weeklyMinutes.getOrElse(bestDayIndex) { 0 }

    Column(
        Modifier
            .fillMaxSize()
            .padding(24.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        Card(Modifier.fillMaxWidth()) {
            Column(Modifier.padding(16.dp)) {
                Text("TODAY", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                Text(
                    "${stats.todaySessions} sessions · ${stats.todayMinutes} minutes",
                    style = MaterialTheme.typography.headlineSmall,
                    fontWeight = FontWeight.Bold,
                )
            }
        }
        Card(Modifier.fillMaxWidth()) {
            Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Text("THIS WEEK", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                Row(
                    Modifier
                        .fillMaxWidth()
                        .height(120.dp),
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                    verticalAlignment = Alignment.Bottom,
                ) {
                    stats.weeklyMinutes.forEachIndexed { i, mins ->
                        val isToday = i == todayIndex
                        val barFrac = mins.toFloat() / max
                        Column(
                            Modifier
                                .weight(1f)
                                .fillMaxHeight(),
                            verticalArrangement = Arrangement.Bottom,
                            horizontalAlignment = Alignment.CenterHorizontally,
                        ) {
                            Box(
                                Modifier
                                    .fillMaxWidth(0.7f)
                                    .fillMaxHeight(barFrac.coerceIn(0.05f, 1f))
                                    .clip(RoundedCornerShape(topStart = 6.dp, topEnd = 6.dp))
                                    .background(if (isToday) Accent else MaterialTheme.colorScheme.surfaceVariant),
                            )
                            Text(dayLabels[i], style = MaterialTheme.typography.labelSmall)
                        }
                    }
                }
            }
        }
        Card(Modifier.fillMaxWidth()) {
            Column(Modifier.padding(16.dp)) {
                Text("BEST DAY THIS WEEK", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                Text("$bestMinutes min", style = MaterialTheme.typography.headlineMedium, color = Accent)
                Text(dayLabels[bestDayIndex], style = MaterialTheme.typography.bodyMedium)
            }
        }
        OutlinedButton(onClick = onBack, modifier = Modifier.fillMaxWidth()) { Text("Back to More") }
    }
}
