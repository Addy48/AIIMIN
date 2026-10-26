package aiimin.designsystem.component

import aiimin.designsystem.icon.AppIcons
import aiimin.designsystem.nav.LocalNavigator
import aiimin.designsystem.nav.Route
import aiimin.designsystem.theme.Aiimin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

enum class SyncUi { SYNCED, SYNCING, OFFLINE, ATTENTION, SIGNED_OUT }

/** The sync icon's state and what tapping it does. Provided once by the shell, read by every root bar. */
class SyncUiState(val ui: SyncUi, val onClick: () -> Unit)

val LocalSyncUi = androidx.compose.runtime.staticCompositionLocalOf { SyncUiState(SyncUi.SIGNED_OUT) {} }

/**
 * Every root bar: search and the bell (findability plan §2.3.6, at most two icons).
 * The sync icon joins them only when sync needs you (offline, attention, syncing); the calm state
 * lives in Me → Account and sync. The Assistant lives in Me, search and the ＋ sheet's voice.
 * The bell is the only place a notification count appears.
 */
@Composable
fun RowScope.RootActions(unread: Int, sync: SyncUi = LocalSyncUi.current.ui, onSync: () -> Unit = LocalSyncUi.current.onClick) {
    val nav = LocalNavigator.current
    val c = Aiimin.colors
    val syncIcon = when (sync) {
        SyncUi.SYNCED -> AppIcons.CloudCheck
        SyncUi.SYNCING -> AppIcons.CloudArrowUp
        SyncUi.OFFLINE -> AppIcons.Cloud
        SyncUi.ATTENTION -> AppIcons.CloudWarning
        SyncUi.SIGNED_OUT -> AppIcons.CloudSlash
    }
    val syncLabel = when (sync) {
        SyncUi.SYNCED -> "Synced"
        SyncUi.SYNCING -> "Syncing"
        SyncUi.OFFLINE -> "Offline. Changes are saved on this phone"
        SyncUi.ATTENTION -> "Sync needs attention"
        SyncUi.SIGNED_OUT -> "Only on this phone"
    }
    if (sync != SyncUi.SYNCED && sync != SyncUi.SIGNED_OUT) Box {
        AppIconButton(syncIcon, syncLabel, onSync, tint = if (sync == SyncUi.SYNCED || sync == SyncUi.SIGNED_OUT) c.textMuted else c.text)
        if (sync == SyncUi.OFFLINE) Box(Modifier.align(Alignment.TopEnd).padding(12.dp).size(8.dp).clip(androidx.compose.foundation.shape.CircleShape).background(c.warn))
        if (sync == SyncUi.ATTENTION) Box(Modifier.align(Alignment.TopEnd).padding(12.dp).size(8.dp).clip(androidx.compose.foundation.shape.CircleShape).background(c.danger))
    }
    AppIconButton(AppIcons.Search, "Search", { nav.open(Route.Search) })
    Box {
        AppIconButton(AppIcons.BellSimple, "Notifications", { nav.open(Route.Notifications) })
        // On the bell's top-right corner, inside the button so it never reaches the screen edge (S5, D-003).
        CountBadge(unread, Modifier.align(Alignment.TopEnd).offset(x = (-4).dp, y = 4.dp))
    }
}
