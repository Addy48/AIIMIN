package `in`.aiimin.app.ui.home

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.pulltorefresh.PullToRefreshBox
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.foundation.Canvas
import `in`.aiimin.app.AppContainer
import `in`.aiimin.app.data.local.HabitCacheEntity
import `in`.aiimin.app.ui.brand.AiiminLogoLockup
import `in`.aiimin.app.ui.components.AiiminCard
import `in`.aiimin.app.ui.components.SyncBanner
import `in`.aiimin.app.ui.theme.Accent
import `in`.aiimin.app.ui.theme.FamiljenGrotesk
import `in`.aiimin.app.ui.theme.Success
import kotlinx.coroutines.launch
import java.time.LocalDate
import java.time.format.TextStyle
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(container: AppContainer) {
    val habits by container.repository.habits().collectAsState(initial = emptyList())
    val journalEntries by container.repository.journal().collectAsState(initial = emptyList())
    val vault by container.repository.vault.collectAsState()
    val syncUi by container.repository.syncUi.collectAsState()
    val focusStats by container.appPrefs.focusStats.collectAsState(initial = `in`.aiimin.app.data.prefs.FocusStats())
    val disciplineStreak by container.appPrefs.disciplineStreak.collectAsState(initial = 0)
    var refreshing by remember { mutableStateOf(false) }
    val scope = rememberCoroutineScope()
    val haptics = LocalHapticFeedback.current
    val today = remember { LocalDate.now() }
    val greeting = remember {
        val hour = java.time.LocalTime.now().hour
        when {
            hour < 12 -> "Good morning"
            hour < 17 -> "Good afternoon"
            else -> "Good evening"
        }
    }
    val name = vault.user?.name?.split(" ")?.firstOrNull() ?: vault.user?.email?.substringBefore("@")
    val lifeScore = remember(vault.lifeScore) { parseLifeScore(vault.lifeScore) }
    val latestJournal = remember(journalEntries) { journalEntries.firstOrNull()?.content.orEmpty() }
    val doneCount = habits.count { it.doneToday }
    val visibleHabits = habits.take(6)
    val overflow = (habits.size - visibleHabits.size).coerceAtLeast(0)

    LaunchedEffect(Unit) {
        runCatching { container.repository.syncAll() }
    }

    Column(Modifier.fillMaxSize()) {
        SyncBanner(
            syncUi = syncUi,
            onRetry = { scope.launch { container.repository.syncAll() } },
        )
        PullToRefreshBox(
            isRefreshing = refreshing,
            onRefresh = {
                refreshing = true
                scope.launch {
                    runCatching { container.repository.syncAll() }
                    refreshing = false
                }
            },
            modifier = Modifier.fillMaxSize(),
        ) {
            LazyColumn(
                contentPadding = PaddingValues(bottom = 24.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp),
            ) {
                item {
                    Box(
                        Modifier
                            .fillMaxWidth()
                            .background(
                                Brush.verticalGradient(
                                    listOf(
                                        MaterialTheme.colorScheme.background,
                                        MaterialTheme.colorScheme.surfaceVariant.copy(0.35f),
                                    ),
                                ),
                            )
                            .padding(horizontal = 20.dp, vertical = 20.dp),
                    ) {
                        Column {
                            Row(
                                Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically,
                            ) {
                                Column(Modifier.weight(1f)) {
                                    Text(
                                        greeting,
                                        style = MaterialTheme.typography.bodyMedium,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                                    )
                                    Text(
                                        if (name != null) "$name." else "Today.",
                                        fontFamily = FamiljenGrotesk,
                                        fontWeight = FontWeight.ExtraBold,
                                        fontSize = 28.sp,
                                        color = MaterialTheme.colorScheme.onBackground,
                                    )
                                    Text(
                                        today.dayOfWeek.getDisplayName(TextStyle.FULL, Locale.getDefault()) +
                                            " · " + today.toString(),
                                        style = MaterialTheme.typography.bodySmall,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                                    )
                                }
                                AiiminLogoLockup(
                                    markSize = 36.dp,
                                    wordmarkColor = MaterialTheme.colorScheme.onBackground,
                                    horizontal = false,
                                )
                            }
                        }
                    }
                }

                item {
                    AiiminCard(Modifier.padding(horizontal = 20.dp)) {
                        Row(
                            Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically,
                        ) {
                            Column(Modifier.weight(1f)) {
                                Text("LIFE SCORE", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                Text(
                                    lifeScore?.toString() ?: "—",
                                    fontFamily = FamiljenGrotesk,
                                    fontWeight = FontWeight.Black,
                                    fontSize = 48.sp,
                                    color = MaterialTheme.colorScheme.onBackground,
                                )
                                Text(
                                    if (lifeScore != null) "Synced from desktop" else "Open desktop to compute score",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                )
                            }
                            if (lifeScore != null) {
                                val trackColor = MaterialTheme.colorScheme.outline
                                Canvas(Modifier.size(72.dp)) {
                                    val sweep = (lifeScore.coerceIn(0, 100) / 100f) * 270f
                                    drawArc(
                                        color = trackColor,
                                        startAngle = 135f,
                                        sweepAngle = 270f,
                                        useCenter = false,
                                        style = Stroke(width = 4.dp.toPx(), cap = StrokeCap.Round),
                                    )
                                    drawArc(
                                        color = Accent,
                                        startAngle = 135f,
                                        sweepAngle = sweep,
                                        useCenter = false,
                                        style = Stroke(width = 4.dp.toPx(), cap = StrokeCap.Round),
                                    )
                                }
                            }
                        }
                    }
                }

                item {
                    Column(Modifier.padding(horizontal = 20.dp)) {
                        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text("TODAY'S HABITS", style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            Text("$doneCount/${habits.size}", style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        }
                        Spacer(Modifier.height(10.dp))
                        if (habits.isEmpty()) {
                            Text(
                                "No habits yet — create on desktop, pull to sync.",
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                                style = MaterialTheme.typography.bodySmall,
                            )
                        } else {
                            LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                items(visibleHabits, key = { it.id }) { habit ->
                                    HabitChip(habit) {
                                        if (!habit.doneToday) {
                                            haptics.performHapticFeedback(HapticFeedbackType.LongPress)
                                            scope.launch {
                                                container.repository.tickHabit(habit.id)
                                                container.syncEngine.syncNow()
                                            }
                                        }
                                    }
                                }
                                if (overflow > 0) {
                                    item {
                                        Box(
                                            Modifier
                                                .height(40.dp)
                                                .clip(RoundedCornerShape(50))
                                                .background(MaterialTheme.colorScheme.surfaceVariant)
                                                .padding(horizontal = 14.dp),
                                            contentAlignment = Alignment.Center,
                                        ) {
                                            Text("+$overflow more", style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                if (latestJournal.isNotBlank()) {
                    item {
                        AiiminCard(Modifier.padding(horizontal = 20.dp)) {
                            Text("JOURNAL", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            Spacer(Modifier.height(8.dp))
                            Text(
                                latestJournal.take(120) + if (latestJournal.length > 120) "…" else "",
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                                maxLines = 3,
                            )
                        }
                    }
                }

                if (vault.agenda.isNotEmpty()) {
                    item {
                        Text("Next up", modifier = Modifier.padding(horizontal = 20.dp), style = MaterialTheme.typography.titleLarge)
                    }
                    item {
                        AiiminCard(Modifier.padding(horizontal = 20.dp)) {
                            vault.agenda.take(3).forEachIndexed { i, ev ->
                                if (i > 0) Spacer(Modifier.height(10.dp))
                                Text(ev.title ?: "Event", style = MaterialTheme.typography.titleMedium)
                                ev.startAt?.let {
                                    Text(it, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                }
                            }
                        }
                    }
                }

                item {
                    Row(
                        Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 20.dp),
                        horizontalArrangement = Arrangement.spacedBy(12.dp),
                    ) {
                        AiiminCard(Modifier.weight(1f)) {
                            Text("DISCIPLINE", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            Text(
                                if (disciplineStreak > 0) disciplineStreak.toString() else "—",
                                fontSize = 32.sp,
                                fontWeight = FontWeight.Bold,
                                color = Accent,
                            )
                            Text("days streak", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        }
                        AiiminCard(Modifier.weight(1f)) {
                            Text("FOCUS TODAY", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            Text(
                                if (focusStats.todayMinutes > 0) focusStats.todayMinutes.toString() else "—",
                                fontSize = 32.sp,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onBackground,
                            )
                            Text("min", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun HabitChip(habit: HabitCacheEntity, onClick: () -> Unit) {
    val bg = if (habit.doneToday) Accent else MaterialTheme.colorScheme.surface
    val borderColor = if (habit.doneToday) Accent else MaterialTheme.colorScheme.outline
    val textColor = if (habit.doneToday) Color.White else MaterialTheme.colorScheme.onSurfaceVariant
    Row(
        Modifier
            .height(40.dp)
            .clip(RoundedCornerShape(50))
            .background(bg)
            .border(1.dp, borderColor, RoundedCornerShape(50))
            .clickable(onClick = onClick)
            .padding(horizontal = 12.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(6.dp),
    ) {
        Text("${habit.emoji} ${habit.name}", style = MaterialTheme.typography.labelMedium, color = textColor, maxLines = 1)
        if (habit.doneToday) {
            Icon(Icons.Default.Check, contentDescription = null, tint = Color.White, modifier = Modifier.size(14.dp))
        }
    }
}

private fun parseLifeScore(raw: Any?): Int? = when (raw) {
    is Number -> raw.toInt()
    is Map<*, *> -> (raw["score"] as? Number)?.toInt()
        ?: (raw["total"] as? Number)?.toInt()
        ?: (raw["life_score"] as? Number)?.toInt()
    else -> null
}
