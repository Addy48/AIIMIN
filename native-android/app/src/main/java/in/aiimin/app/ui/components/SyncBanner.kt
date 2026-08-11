package `in`.aiimin.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import `in`.aiimin.app.data.repo.SyncUiState
import `in`.aiimin.app.ui.theme.Accent
import `in`.aiimin.app.ui.theme.Warning
import java.util.concurrent.TimeUnit
import kotlin.math.max

@Composable
fun SyncBanner(
    syncUi: SyncUiState,
    onRetry: (() -> Unit)? = null,
    modifier: Modifier = Modifier,
) {
    val message = when {
        syncUi.isSyncing -> "Syncing with your account…"
        syncUi.pendingOutbox > 0 -> "${syncUi.pendingOutbox} change(s) queued — will sync when online"
        syncUi.lastError != null -> syncUi.lastError
        syncUi.usingCache -> "Offline · showing cached data"
        syncUi.lastSyncedAtMillis != null -> formatLastSynced(syncUi.lastSyncedAtMillis)
        else -> "Pull to refresh when online"
    }
    val bg = when {
        syncUi.isSyncing -> Color(0x1AFF6B35)
        syncUi.pendingOutbox > 0 -> Color(0x1AFF6B35)
        syncUi.lastError != null || syncUi.usingCache -> Color(0x33FACC15)
        else -> MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.35f)
    }
    val textColor = when {
        syncUi.isSyncing -> Accent
        syncUi.pendingOutbox > 0 -> Accent
        syncUi.lastError != null || syncUi.usingCache -> Warning
        else -> MaterialTheme.colorScheme.onSurfaceVariant
    }

    Row(
        modifier = modifier
            .fillMaxWidth()
            .background(bg)
            .padding(horizontal = 16.dp, vertical = 10.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(10.dp),
    ) {
        if (syncUi.isSyncing) {
            CircularProgressIndicator(
                modifier = Modifier.padding(2.dp),
                color = Accent,
                strokeWidth = 2.dp,
            )
        }
        Text(
            message,
            style = MaterialTheme.typography.labelMedium,
            color = textColor,
            modifier = Modifier.weight(1f),
        )
        if (!syncUi.isSyncing && onRetry != null &&
            (syncUi.lastError != null || syncUi.usingCache || syncUi.pendingOutbox > 0)
        ) {
            AiiminTextButton(text = "Retry", onClick = onRetry)
        }
    }
}

private fun formatLastSynced(millis: Long): String {
    val mins = max(0, TimeUnit.MILLISECONDS.toMinutes(System.currentTimeMillis() - millis))
    return when {
        mins < 1 -> "Last synced just now"
        mins == 1L -> "Last synced 1 minute ago"
        mins < 60 -> "Last synced $mins minutes ago"
        else -> "Last synced ${mins / 60}h ago"
    }
}
