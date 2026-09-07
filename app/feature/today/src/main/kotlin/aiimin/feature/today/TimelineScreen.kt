package aiimin.feature.today

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import aiimin.core.data.TimelineItem
import aiimin.designsystem.component.HairRule
import aiimin.designsystem.component.ScreenHead
import aiimin.designsystem.component.TapSurface
import aiimin.designsystem.component.Text
import aiimin.designsystem.theme.AiiminTheme

@Composable
fun TimelineRoute(
    onBack: () -> Unit = {},
    modifier: Modifier = Modifier,
    viewModel: TimelineViewModel = hiltViewModel(),
) {
    val rows by viewModel.rows.collectAsStateWithLifecycle()
    TimelineScreen(rows = rows, onBack = onBack, modifier = modifier)
}

/** One job: chronology, not a feed. */
@Composable
fun TimelineScreen(
    rows: List<TimelineItem>,
    onBack: () -> Unit,
    modifier: Modifier = Modifier,
) {
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
        ScreenHead(title = "Timeline", meta = "${rows.size} ROWS")
        if (rows.isEmpty()) {
            Text(
                text = "Nothing on the local graph yet.",
                style = AiiminTheme.type.bodySmall,
                color = AiiminTheme.colors.muted,
                modifier = Modifier.padding(top = AiiminTheme.space.s3),
            )
        } else {
            rows.forEachIndexed { i, row ->
                Row(
                    Modifier
                        .fillMaxWidth()
                        .padding(vertical = 10.dp),
                    verticalAlignment = Alignment.Top,
                ) {
                    Text(
                        text = row.kind,
                        style = AiiminTheme.type.cellLabel,
                        color = AiiminTheme.colors.accent,
                        modifier = Modifier.padding(end = AiiminTheme.space.s3),
                    )
                    Column(Modifier.weight(1f)) {
                        Text(text = row.title, style = AiiminTheme.type.body.copy(fontWeight = FontWeight.Medium))
                        Text(
                            text = row.excerpt,
                            style = AiiminTheme.type.bodySmall,
                            color = AiiminTheme.colors.muted,
                            modifier = Modifier.padding(top = 2.dp),
                        )
                    }
                }
                if (i < rows.lastIndex) HairRule()
            }
        }
    }
}
