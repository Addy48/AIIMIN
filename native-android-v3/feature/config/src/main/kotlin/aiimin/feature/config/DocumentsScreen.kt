package aiimin.feature.config

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import aiimin.core.data.VaultListState
import aiimin.core.data.VaultRow
import aiimin.designsystem.component.BlueprintBox
import aiimin.designsystem.component.HairRule
import aiimin.designsystem.component.ScreenHead
import aiimin.designsystem.component.SectionRule
import aiimin.designsystem.component.TapSurface
import aiimin.designsystem.component.Text
import aiimin.designsystem.theme.AiiminTheme

@Composable
fun DocumentsRoute(
    onBack: () -> Unit = {},
    modifier: Modifier = Modifier,
    viewModel: VaultListViewModel = hiltViewModel(),
) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    DocumentsScreen(state = state, onBack = onBack, modifier = modifier)
}

/** One job: grab a resume title. No file blob on bootstrap. */
@Composable
fun DocumentsScreen(
    state: VaultListState,
    onBack: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val context = LocalContext.current
    Column(
        modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(horizontal = AiiminTheme.space.page)
            .padding(bottom = AiiminTheme.space.s8),
    ) {
        TapSurface(onClick = onBack, modifier = Modifier.padding(top = AiiminTheme.space.s2)) {
            Text(
                text = "← BACK",
                style = AiiminTheme.type.cellLabel,
                color = AiiminTheme.colors.accent,
                modifier = Modifier.padding(vertical = 8.dp),
            )
        }
        ScreenHead(title = "Documents", meta = state.resumeMeta)
        if (state.resumes.isEmpty()) {
            Text(
                text = "No resumes on this graph yet.",
                style = AiiminTheme.type.bodySmall,
                color = AiiminTheme.colors.muted,
                modifier = Modifier.padding(top = AiiminTheme.space.s3),
            )
        } else {
            SectionRule(label = "Resumes")
            state.resumes.forEachIndexed { i, row ->
                TapSurface(
                    onClick = { shareResume(context, row) },
                    modifier = Modifier.fillMaxWidth(),
                ) {
                    Text(
                        text = row.title,
                        style = AiiminTheme.type.body,
                        modifier = Modifier.padding(vertical = 10.dp),
                    )
                }
                if (i < state.resumes.lastIndex) HairRule()
            }
        }
        TapSurface(
            onClick = {
                context.startActivity(
                    android.content.Intent(
                        android.content.Intent.ACTION_VIEW,
                        android.net.Uri.parse("https://aiimin.in"),
                    ),
                )
            },
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = AiiminTheme.space.s6),
        ) {
            BlueprintBox {
                Text(
                    text = "OPEN ON WEB · AIIMIN.IN",
                    style = AiiminTheme.type.cellLabel,
                    color = AiiminTheme.colors.accent,
                )
            }
        }
    }
}

private fun shareResume(context: android.content.Context, row: VaultRow) {
    val send = android.content.Intent(android.content.Intent.ACTION_SEND).apply {
        type = "text/plain"
        putExtra(android.content.Intent.EXTRA_TEXT, row.title)
    }
    context.startActivity(android.content.Intent.createChooser(send, "Share resume"))
}
