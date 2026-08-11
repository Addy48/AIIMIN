package `in`.aiimin.app.ui.more

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Assessment
import androidx.compose.material.icons.outlined.BusinessCenter
import androidx.compose.material.icons.outlined.Flag
import androidx.compose.material.icons.outlined.Science
import androidx.compose.material.icons.outlined.Language
import androidx.compose.material.icons.outlined.Settings
import androidx.compose.material.icons.outlined.Shield
import androidx.compose.material.icons.outlined.Timer
import androidx.compose.material.icons.outlined.Wallet
import androidx.compose.material3.Card
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import `in`.aiimin.app.AppContainer
import `in`.aiimin.app.BuildConfig
import `in`.aiimin.app.ui.components.AiiminTextButton
import `in`.aiimin.app.ui.components.ScreenChrome
import `in`.aiimin.app.ui.components.SyncBanner
import `in`.aiimin.app.ui.discipline.DisciplineUrgeScreen
import `in`.aiimin.app.ui.focus.FocusTimerScreen
import `in`.aiimin.app.ui.goals.GoalsLiteScreen
import `in`.aiimin.app.ui.settings.SettingsScreen
import `in`.aiimin.app.ui.theme.Accent
import kotlinx.coroutines.launch

private enum class MorePane { List, Focus, Discipline, Goals, Settings }

private data class FeatureTile(
    val title: String,
    val icon: ImageVector,
    val webUrl: String? = null,
    val pane: MorePane? = null,
)

@Composable
fun MoreScreen(container: AppContainer) {
    var pane by remember { mutableStateOf(MorePane.List) }
    val scope = rememberCoroutineScope()
    val vault by container.repository.vault.collectAsState()
    val syncUi by container.repository.syncUi.collectAsState()
    val context = LocalContext.current

    when (pane) {
        MorePane.Focus -> FocusTimerScreen(container = container, onBack = { pane = MorePane.List })
        MorePane.Discipline -> DisciplineUrgeScreen(container = container, onBack = { pane = MorePane.List })
        MorePane.Goals -> GoalsLiteScreen(container = container, onBack = { pane = MorePane.List })
        MorePane.Settings -> SettingsScreen(container = container, onBack = { pane = MorePane.List })
        MorePane.List -> {
            val user = vault.user
            val initials = user?.name?.split(" ")?.mapNotNull { it.firstOrNull()?.uppercaseChar() }?.take(2)?.joinToString("")
                ?: user?.email?.firstOrNull()?.uppercaseChar()?.toString()
                ?: "A"
            val tiles = listOf(
                FeatureTile("Focus", Icons.Outlined.Timer, pane = MorePane.Focus),
                FeatureTile("Discipline", Icons.Outlined.Shield, pane = MorePane.Discipline),
                FeatureTile("Goals", Icons.Outlined.Flag, pane = MorePane.Goals),
                FeatureTile("Reports", Icons.Outlined.Assessment, webUrl = "https://aiimin.in/reports"),
                FeatureTile("Career", Icons.Outlined.BusinessCenter, webUrl = "https://aiimin.in/placements"),
                FeatureTile("Lab", Icons.Outlined.Science, webUrl = "https://aiimin.in/lab"),
                FeatureTile("Finance", Icons.Outlined.Wallet, webUrl = "https://aiimin.in/finance"),
                FeatureTile("Settings", Icons.Outlined.Settings, pane = MorePane.Settings),
            )

            Column(Modifier.fillMaxSize()) {
                SyncBanner(
                    syncUi = syncUi,
                    onRetry = { scope.launch { container.repository.syncAll() } },
                )
                LazyVerticalGrid(
                    columns = GridCells.Fixed(2),
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = PaddingValues(16.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp),
                ) {
                    item(span = { androidx.compose.foundation.lazy.grid.GridItemSpan(2) }) {
                        Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                            Text("More", style = MaterialTheme.typography.headlineMedium)
                            Text(
                                "v${BuildConfig.VERSION_NAME}",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                            )
                        }
                    }
                    item(span = { androidx.compose.foundation.lazy.grid.GridItemSpan(2) }) {
                        Card(Modifier.fillMaxWidth()) {
                            Row(
                                Modifier.padding(16.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(14.dp),
                            ) {
                                Box(
                                    Modifier
                                        .size(48.dp)
                                        .clip(CircleShape)
                                        .background(Accent),
                                    contentAlignment = Alignment.Center,
                                ) {
                                    Text(initials, color = Color.White, fontWeight = FontWeight.Bold)
                                }
                                Column(Modifier.weight(1f)) {
                                    Text(user?.name ?: "AIIMIN user", style = MaterialTheme.typography.titleMedium)
                                    Text(
                                        user?.email ?: "Signed in",
                                        style = MaterialTheme.typography.bodySmall,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                                    )
                                }
                            }
                        }
                    }
                    items(tiles) { tile ->
                        Card(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(108.dp)
                                .clickable {
                                    when {
                                        tile.pane != null -> pane = tile.pane
                                        tile.webUrl != null -> context.startActivity(
                                            Intent(Intent.ACTION_VIEW, Uri.parse(tile.webUrl)),
                                        )
                                    }
                                },
                        ) {
                            Box(Modifier.padding(16.dp)) {
                                if (tile.webUrl != null) {
                                    Icon(
                                        Icons.Outlined.Language,
                                        contentDescription = "Web",
                                        modifier = Modifier
                                            .align(Alignment.TopEnd)
                                            .size(14.dp),
                                        tint = MaterialTheme.colorScheme.onSurfaceVariant,
                                    )
                                }
                                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                                    Icon(tile.icon, contentDescription = tile.title, tint = Accent)
                                    Text(tile.title, style = MaterialTheme.typography.titleSmall)
                                }
                            }
                        }
                    }
                    item(span = { androidx.compose.foundation.lazy.grid.GridItemSpan(2) }) {
                        Row(
                            Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                        ) {
                            AiiminTextButton(
                                text = "Sync now",
                                onClick = { scope.launch { container.repository.syncAll() } },
                            )
                            AiiminTextButton(
                                text = "Sign out",
                                onClick = { scope.launch { container.repository.signOut() } },
                            )
                        }
                    }
                }
            }
        }
    }
}
