package `in`.aiimin.app.ui.vault

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Cloud
import androidx.compose.material.icons.outlined.Description
import androidx.compose.material.icons.outlined.Folder
import androidx.compose.material3.Card
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.SegmentedButton
import androidx.compose.material3.SegmentedButtonDefaults
import androidx.compose.material3.SingleChoiceSegmentedButtonRow
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import `in`.aiimin.app.AppContainer
import `in`.aiimin.app.ui.components.AiiminTextButton
import `in`.aiimin.app.ui.components.EmptyState
import `in`.aiimin.app.ui.components.ScreenChrome
import `in`.aiimin.app.ui.components.ScreenHeader
import `in`.aiimin.app.ui.components.SyncBanner
import `in`.aiimin.app.ui.theme.Accent
import kotlinx.coroutines.launch

@Composable
fun VaultScreen(container: AppContainer) {
    var segment by remember { mutableIntStateOf(0) }
    val labels = listOf("Family", "Drive", "Resumes")
    val vault by container.repository.vault.collectAsState()
    val syncUi by container.repository.syncUi.collectAsState()
    val context = LocalContext.current
    val scope = rememberCoroutineScope()

    LaunchedEffect(Unit) {
        runCatching { container.repository.syncAll() }
    }

    Column(Modifier.fillMaxSize()) {
        SyncBanner(
            syncUi = syncUi,
            onRetry = { scope.launch { container.repository.syncAll() } },
        )
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            item {
                Row(
                    Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    ScreenHeader(
                        title = "Vault",
                        subtitle = "Synced from desktop",
                        modifier = Modifier.weight(1f).padding(horizontal = 0.dp, vertical = 0.dp),
                    )
                    if (syncUi.isSyncing) {
                        CircularProgressIndicator(Modifier.padding(8.dp), color = Accent, strokeWidth = 2.dp)
                    } else {
                        AiiminTextButton(text = "Sync now", onClick = {
                            scope.launch { container.repository.syncAll() }
                        })
                    }
                }
            }
            item {
                SingleChoiceSegmentedButtonRow(modifier = Modifier.fillMaxWidth()) {
                    labels.forEachIndexed { index, label ->
                        SegmentedButton(
                            selected = segment == index,
                            onClick = { segment = index },
                            shape = SegmentedButtonDefaults.itemShape(index, labels.size),
                        ) { Text(label) }
                    }
                }
            }
            if (segment == 0 && vault.family.isEmpty()) {
                item {
                    EmptyState(
                        icon = Icons.Outlined.Folder,
                        title = "No family documents yet",
                        subtitle = "Add them on desktop under Family → Documents, then tap Sync now.",
                    )
                }
            }
            if (segment == 1 && vault.drive?.connected != true) {
                item {
                    EmptyState(
                        icon = Icons.Outlined.Cloud,
                        title = "Google Drive not connected",
                        subtitle = "Connect Google Drive on aiimin.in to see files here.",
                    )
                }
            }
            if (segment == 2 && vault.resumes.isEmpty()) {
                item {
                    EmptyState(
                        icon = Icons.Outlined.Description,
                        title = "No resumes yet",
                        subtitle = "Upload resumes on aiimin.in under Career → Vault.",
                    )
                }
            }
            if (segment == 0) {
                items(vault.family, key = { it.id ?: it.hashCode().toString() }) { doc ->
                    Card(modifier = Modifier.fillMaxWidth()) {
                        Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                            Text(doc.docType ?: "Document", style = MaterialTheme.typography.titleMedium)
                            Text(
                                listOfNotNull(doc.memberName, doc.docNumber).joinToString(" · ").ifBlank { "—" },
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                            )
                            doc.expiryDate?.let {
                                Text("Expires $it", style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.primary)
                            }
                            doc.notes?.takeIf { it.isNotBlank() }?.let {
                                Text(it, style = MaterialTheme.typography.bodySmall)
                            }
                        }
                    }
                }
            }
            if (segment == 1 && vault.drive?.connected == true) {
                item {
                    Card(Modifier.fillMaxWidth()) {
                        Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                            Text("Drive linked", style = MaterialTheme.typography.titleMedium)
                            val names = vault.drive?.watches?.mapNotNull { it.folderName }?.joinToString() ?: "folder"
                            Text("Watching: $names", color = MaterialTheme.colorScheme.onSurfaceVariant)
                        }
                    }
                }
            }
            if (segment == 2) {
                items(vault.resumes, key = { it.id ?: it.hashCode().toString() }) { resume ->
                    Card(modifier = Modifier.fillMaxWidth()) {
                        Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                            Text(resume.title ?: "Resume", style = MaterialTheme.typography.titleMedium)
                            resume.targetRole?.let {
                                Text(it, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            }
                            val url = resume.linkUrl
                            if (!url.isNullOrBlank()) {
                                TextButton(onClick = {
                                    context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
                                }) { Text("View") }
                            }
                        }
                    }
                }
            }
        }
    }
}
