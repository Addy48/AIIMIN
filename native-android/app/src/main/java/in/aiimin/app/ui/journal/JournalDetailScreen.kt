package `in`.aiimin.app.ui.journal

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import `in`.aiimin.app.data.local.JournalCacheEntity

@Composable
fun JournalDetailScreen(
    entry: JournalCacheEntity,
    onBack: () -> Unit,
) {
    val words = entry.content.split(Regex("\\s+")).count { it.isNotBlank() }
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(24.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        Text("Journal entry", style = MaterialTheme.typography.headlineMedium)
        Text(
            entry.date.ifBlank { "Entry" },
            style = MaterialTheme.typography.labelLarge,
            color = MaterialTheme.colorScheme.primary,
        )
        Text(
            "$words words · read-only on phone",
            style = MaterialTheme.typography.labelSmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
        Text(
            entry.content,
            style = MaterialTheme.typography.bodyLarge.copy(lineHeight = 26.sp),
            color = MaterialTheme.colorScheme.onBackground,
        )
        Text(
            "Edit on desktop → aiimin.in",
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
        OutlinedButton(onClick = onBack, modifier = Modifier.fillMaxWidth()) {
            Text("Back to Journal")
        }
    }
}
