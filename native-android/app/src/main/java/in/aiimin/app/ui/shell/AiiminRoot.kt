package `in`.aiimin.app.ui.shell

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInHorizontally
import androidx.compose.animation.slideOutHorizontally
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Folder
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Menu
import androidx.compose.material.icons.filled.NoteAlt
import androidx.compose.material.icons.outlined.EditNote
import androidx.compose.material.icons.outlined.Folder
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.Menu
import androidx.compose.material.icons.outlined.NoteAlt
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import `in`.aiimin.app.AppContainer
import `in`.aiimin.app.ui.auth.AuthScreen
import `in`.aiimin.app.ui.home.HomeScreen
import `in`.aiimin.app.ui.journal.JournalScreen
import `in`.aiimin.app.ui.more.MoreScreen
import `in`.aiimin.app.ui.notes.NotesScreen
import `in`.aiimin.app.ui.theme.Accent
import `in`.aiimin.app.ui.theme.Muted
import `in`.aiimin.app.ui.vault.VaultScreen

private data class Tab(
    val label: String,
    val outline: ImageVector,
    val filled: ImageVector,
)

private val tabs = listOf(
    Tab("Home", Icons.Outlined.Home, Icons.Filled.Home),
    Tab("Journal", Icons.Outlined.EditNote, Icons.Filled.Edit),
    Tab("Notes", Icons.Outlined.NoteAlt, Icons.Filled.NoteAlt),
    Tab("Vault", Icons.Outlined.Folder, Icons.Filled.Folder),
    Tab("More", Icons.Outlined.Menu, Icons.Filled.Menu),
)

@Composable
fun AiiminRoot(hasSession: Boolean, container: AppContainer) {
    if (!hasSession) {
        AuthScreen(container = container)
        return
    }

    var selected by rememberSaveable { mutableIntStateOf(0) }
    var previous by remember { mutableIntStateOf(0) }
    val navBg = MaterialTheme.colorScheme.surfaceVariant

    Scaffold(
        containerColor = MaterialTheme.colorScheme.background,
        bottomBar = {
            NavigationBar(
                containerColor = navBg,
                tonalElevation = 0.dp,
                modifier = Modifier.height(64.dp),
            ) {
                tabs.forEachIndexed { index, tab ->
                    val selectedTab = selected == index
                    NavigationBarItem(
                        selected = selectedTab,
                        onClick = { previous = selected; selected = index },
                        icon = {
                            Icon(
                                if (selectedTab) tab.filled else tab.outline,
                                contentDescription = tab.label,
                                modifier = Modifier.size(24.dp),
                            )
                        },
                        label = {
                            Text(
                                tab.label,
                                fontSize = 10.sp,
                                fontWeight = if (selectedTab) FontWeight.SemiBold else FontWeight.Medium,
                            )
                        },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = Accent,
                            selectedTextColor = Accent,
                            unselectedIconColor = Muted,
                            unselectedTextColor = Muted,
                            indicatorColor = Accent.copy(alpha = 0.12f),
                        ),
                    )
                }
            }
        },
    ) { padding ->
        val forward = selected >= previous
        AnimatedContent(
            targetState = selected,
            transitionSpec = {
                if (forward) {
                    (slideInHorizontally { it / 5 } + fadeIn()) togetherWith
                        (slideOutHorizontally { -it / 7 } + fadeOut())
                } else {
                    (slideInHorizontally { -it / 5 } + fadeIn()) togetherWith
                        (slideOutHorizontally { it / 7 } + fadeOut())
                }
            },
            modifier = Modifier.padding(padding),
            label = "tab",
        ) { page ->
            when (page) {
                0 -> HomeScreen(container)
                1 -> JournalScreen(container)
                2 -> NotesScreen(container)
                3 -> VaultScreen(container)
                else -> MoreScreen(container)
            }
        }
    }
}
