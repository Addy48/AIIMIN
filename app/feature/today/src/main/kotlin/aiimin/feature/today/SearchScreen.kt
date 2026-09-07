package aiimin.feature.today

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import aiimin.core.data.GraphSearchResult
import aiimin.designsystem.component.BlueprintBox
import aiimin.designsystem.component.HairRule
import aiimin.designsystem.component.ScreenHead
import aiimin.designsystem.component.SectionRule
import aiimin.designsystem.component.TapSurface
import aiimin.designsystem.component.Text
import aiimin.designsystem.theme.AiiminTheme

@Composable
fun SearchRoute(
    onBack: () -> Unit = {},
    modifier: Modifier = Modifier,
    viewModel: SearchViewModel = hiltViewModel(),
) {
    val query by viewModel.query.collectAsStateWithLifecycle()
    val result by viewModel.result.collectAsStateWithLifecycle()
    SearchScreen(
        query = query,
        result = result,
        onQuery = viewModel::onQuery,
        onBack = onBack,
        modifier = modifier,
    )
}

/** One job: recall across the local graph. */
@Composable
fun SearchScreen(
    query: String,
    result: GraphSearchResult,
    onQuery: (String) -> Unit,
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
        ScreenHead(title = "Search", meta = "LOCAL GRAPH")
        BlueprintBox(modifier = Modifier.padding(top = AiiminTheme.space.s3)) {
            BasicTextField(
                value = query,
                onValueChange = onQuery,
                textStyle = AiiminTheme.type.body.copy(fontSize = 15.sp, color = AiiminTheme.colors.text),
                cursorBrush = SolidColor(AiiminTheme.colors.accent),
                modifier = Modifier.fillMaxWidth(),
                decorationBox = { inner ->
                    if (query.isEmpty()) {
                        Text(
                            text = "Notes · journal · money · agenda",
                            style = AiiminTheme.type.body.copy(fontSize = 15.sp),
                            color = AiiminTheme.colors.muted,
                        )
                    }
                    inner()
                },
            )
        }
        if (query.isBlank()) {
            Text(
                text = "Type to search. Empty query dumps nothing.",
                style = AiiminTheme.type.bodySmall,
                color = AiiminTheme.colors.muted,
                modifier = Modifier.padding(top = AiiminTheme.space.s3),
            )
        } else if (result.isEmpty) {
            Text(
                text = "NOTHING MATCHES",
                style = AiiminTheme.type.bodySmall,
                color = AiiminTheme.colors.muted,
                modifier = Modifier.padding(top = AiiminTheme.space.s3),
            )
        } else {
            SearchGroup("Notes", result.notes.map { it.title })
            SearchGroup("Journal", result.journal.map { it.excerpt })
            SearchGroup("Money", result.money.map { it.name })
            SearchGroup("Agenda", result.agenda.map { it.title })
        }
    }
}

@Composable
private fun SearchGroup(label: String, rows: List<String>) {
    if (rows.isEmpty()) return
    SectionRule(label = label, value = rows.size.toString())
    rows.forEachIndexed { i, line ->
        Text(
            text = line,
            style = AiiminTheme.type.body.copy(fontSize = 13.sp),
            modifier = Modifier.padding(vertical = 10.dp),
        )
        if (i < rows.lastIndex) HairRule()
    }
}
