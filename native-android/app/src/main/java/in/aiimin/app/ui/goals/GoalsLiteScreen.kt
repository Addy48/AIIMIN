package `in`.aiimin.app.ui.goals

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Flag
import androidx.compose.material3.Card
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import `in`.aiimin.app.AppContainer
import `in`.aiimin.app.data.network.GoalDto
import `in`.aiimin.app.ui.components.AiiminTextButton
import `in`.aiimin.app.ui.components.EmptyState
import `in`.aiimin.app.ui.components.ScreenChrome
import `in`.aiimin.app.ui.theme.Accent

@Composable
fun GoalsLiteScreen(container: AppContainer, onBack: () -> Unit) {
    val vault by container.repository.vault.collectAsState()
    val goals = vault.goals
    val context = LocalContext.current

    ScreenChrome {
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(24.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
        item {
            Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                Text("Goals", style = MaterialTheme.typography.headlineMedium)
                AiiminTextButton(
                    text = "Edit on desktop →",
                    onClick = {
                        context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse("https://aiimin.in/goals")))
                    },
                )
            }
        }
        if (goals.isEmpty()) {
            item {
                EmptyState(
                    icon = Icons.Outlined.Flag,
                    title = "No goals set yet",
                    subtitle = "Create goals on aiimin.in, then pull to refresh on Home.",
                )
            }
        }
        items(goals, key = { it.id ?: it.hashCode().toString() }) { goal ->
            GoalCard(goal)
        }
        item {
            OutlinedButton(onClick = onBack, modifier = Modifier.fillMaxWidth()) { Text("Back to More") }
        }
        }
    }
}

@Composable
private fun GoalCard(goal: GoalDto) {
    val progress = goalProgress(goal)
    Card(modifier = Modifier.fillMaxWidth()) {
        Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text(goal.metric ?: "Goal", style = MaterialTheme.typography.titleMedium)
            Text(
                listOfNotNull(
                    goal.target?.let { "Target $it" },
                    goal.frequency,
                    goal.startDate?.let { "From $it" },
                ).joinToString(" · "),
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            if (progress != null) {
                LinearProgressIndicator(
                    progress = { progress.coerceIn(0f, 1f) },
                    modifier = Modifier.fillMaxWidth(),
                    color = Accent,
                )
                Text(
                    "${(progress * 100).toInt()}% toward target",
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        }
    }
}

private fun goalProgress(goal: GoalDto): Float? {
    val meta = goal.meta as? Map<*, *> ?: return null
    val current = (meta["current"] as? Number)?.toFloat()
        ?: (meta["progress"] as? Number)?.toFloat()
    val target = (goal.target as? Number)?.toFloat()
        ?: (meta["target"] as? Number)?.toFloat()
    return when {
        current != null && target != null && target > 0f -> current / target
        current != null && current in 0f..1f -> current
        else -> null
    }
}
