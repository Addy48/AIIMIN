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
import aiimin.designsystem.component.BlueprintBox
import aiimin.designsystem.component.HairRule
import aiimin.designsystem.component.ScreenHead
import aiimin.designsystem.component.SectionRule
import aiimin.designsystem.component.TapSurface
import aiimin.designsystem.component.Text
import aiimin.designsystem.theme.AiiminTheme

@Composable
fun GoalsRoute(
    onBack: () -> Unit = {},
    modifier: Modifier = Modifier,
    viewModel: VaultListViewModel = hiltViewModel(),
) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    GoalsScreen(state = state, onBack = onBack, modifier = modifier)
}

/** One job: list goals from bootstrap. Edit on the web. */
@Composable
fun GoalsScreen(
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
        ScreenHead(title = "Goals", meta = state.goalsMeta)
        if (state.goals.isEmpty()) {
            Text(
                text = "No goals on this graph yet. Set them on the website.",
                style = AiiminTheme.type.bodySmall,
                color = AiiminTheme.colors.muted,
                modifier = Modifier.padding(top = AiiminTheme.space.s3),
            )
        } else {
            SectionRule(label = "This OS")
            state.goals.forEachIndexed { i, row ->
                Text(
                    text = row.title,
                    style = AiiminTheme.type.body,
                    modifier = Modifier.padding(vertical = 10.dp),
                )
                if (i < state.goals.lastIndex) HairRule()
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
                    text = "EDIT ON WEB · AIIMIN.IN",
                    style = AiiminTheme.type.cellLabel,
                    color = AiiminTheme.colors.accent,
                )
            }
        }
    }
}
