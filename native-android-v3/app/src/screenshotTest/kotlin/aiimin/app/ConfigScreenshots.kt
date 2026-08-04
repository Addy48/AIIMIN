package aiimin.app

import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import com.android.tools.screenshot.PreviewTest
import aiimin.core.data.ConfigState
import aiimin.core.data.SyncState
import aiimin.core.model.LifeMode
import aiimin.designsystem.theme.AiiminTheme
import aiimin.feature.config.ConfigScreen
import aiimin.feature.config.ConfigUiState

private const val PHONE_W = 390
private const val TALL = 1400

@PreviewTest
@Preview(name = "Config · dark", widthDp = PHONE_W, heightDp = TALL)
@Composable
fun ConfigDark() {
    AiiminTheme(darkTheme = true) {
        Config(ConfigUiState(ConfigState.seed(), LifeMode.BUILD))
    }
}

@PreviewTest
@Preview(name = "Config · light", widthDp = PHONE_W, heightDp = TALL)
@Composable
fun ConfigLight() {
    AiiminTheme(darkTheme = false) {
        Config(ConfigUiState(ConfigState.seed().copy(darkTheme = false), LifeMode.RECOVER))
    }
}

@PreviewTest
@Preview(name = "Config · syncing", widthDp = PHONE_W, heightDp = TALL)
@Composable
fun ConfigSyncing() {
    AiiminTheme(darkTheme = true) {
        Config(
            ConfigUiState(
                ConfigState.seed().copy(
                    sync = SyncState.SYNCING,
                    syncMeta = "Pulling the graph…",
                ),
                LifeMode.EXAM,
            ),
        )
    }
}

@PreviewTest
@Preview(name = "Config · delete veil", widthDp = PHONE_W, heightDp = TALL)
@Composable
fun ConfigDeleteVeil() {
    AiiminTheme(darkTheme = true) {
        Config(
            ConfigUiState(
                ConfigState.seed().copy(deleteOpen = true, deleteDraft = "DEL"),
                LifeMode.BUILD,
            ),
        )
    }
}

@Composable
private fun Config(state: ConfigUiState) {
    ConfigScreen(
        state = state,
        onToggleTheme = {},
        onToggleReduceMotion = {},
        onSelectMode = {},
        onSyncNow = {},
        onOpenOsId = {},
        onOpenMinimums = {},
        onOpenConnections = {},
        onExport = {},
        onOpenDelete = {},
        onCloseDelete = {},
        onDeleteDraft = {},
        onConfirmDelete = {},
        onDismissNotice = {},
    )
}
