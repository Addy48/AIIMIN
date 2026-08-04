package aiimin.feature.journal

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.IntrinsicSize
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import aiimin.core.data.JournalEntry
import aiimin.core.data.JournalState
import aiimin.core.data.JournalTemplate
import aiimin.designsystem.component.BlueprintBox
import aiimin.designsystem.component.HairRule
import aiimin.designsystem.component.PrimaryButton
import aiimin.designsystem.component.ScreenHead
import aiimin.designsystem.component.SectionRule
import aiimin.designsystem.component.TapSurface
import aiimin.designsystem.component.Text
import aiimin.designsystem.theme.AiiminTheme
import aiimin.designsystem.theme.Hairline

@Composable
fun JournalRoute(
    modifier: Modifier = Modifier,
    viewModel: JournalViewModel = hiltViewModel(),
) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    JournalScreen(
        state = state,
        onTemplate = viewModel::onTemplate,
        onDraft = viewModel::onDraft,
        onMood = viewModel::onMood,
        onSave = viewModel::onSave,
        onDismissNotice = viewModel::onDismissNotice,
        modifier = modifier,
    )
}

/**
 * **One job: reflection capture.**
 *
 * Templates · composer · mood 1–5 · save · history. Voice later.
 */
@Composable
fun JournalScreen(
    state: JournalState,
    onTemplate: (JournalTemplate) -> Unit,
    onDraft: (String) -> Unit,
    onMood: (Int) -> Unit,
    onSave: () -> Unit,
    onDismissNotice: () -> Unit,
    modifier: Modifier = Modifier,
) {
    Column(
        modifier
            .fillMaxSize()
            .background(AiiminTheme.colors.bg)
            .verticalScroll(rememberScrollState())
            .padding(horizontal = AiiminTheme.space.page)
            .padding(bottom = AiiminTheme.space.s8),
    ) {
        ScreenHead(title = "Journal", meta = state.headMeta)

        state.notice?.let { notice ->
            LaunchedEffect(notice.message) {
                kotlinx.coroutines.delay(3_200)
                onDismissNotice()
            }
            Text(
                text = notice.message,
                style = AiiminTheme.type.bodySmall,
                color = AiiminTheme.colors.accent,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = AiiminTheme.space.s3)
                    .border(Hairline, AiiminTheme.colors.accent)
                    .padding(AiiminTheme.space.s3),
            )
        }

        TemplateStrip(selected = state.template, onSelect = onTemplate)

        BlueprintBox(
            accent = true,
            tinted = true,
            modifier = Modifier.padding(top = AiiminTheme.space.s4),
        ) {
            BasicTextField(
                value = state.draft,
                onValueChange = onDraft,
                textStyle = AiiminTheme.type.body.copy(
                    fontSize = 15.sp,
                    lineHeight = 23.sp,
                    color = AiiminTheme.colors.text,
                ),
                cursorBrush = SolidColor(AiiminTheme.colors.accent),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(120.dp),
                decorationBox = { inner ->
                    if (state.draft.isEmpty()) {
                        Text(
                            text = state.template.prompt,
                            style = AiiminTheme.type.body.copy(fontSize = 15.sp, lineHeight = 23.sp),
                            color = AiiminTheme.colors.muted,
                        )
                    }
                    inner()
                },
            )
        }

        SectionRule(label = "Mood")
        MoodGrid(selected = state.mood, onSelect = onMood)

        PrimaryButton(
            label = "Save entry",
            onClick = onSave,
            enabled = state.draft.isNotBlank(),
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = AiiminTheme.space.s6),
        )

        SectionRule(
            label = "History",
            value = "${state.entries.size} ENTRIES",
        )
        state.entries.forEachIndexed { i, entry ->
            HistoryRow(entry)
            if (i < state.entries.lastIndex) HairRule()
        }
    }
}

@Composable
private fun TemplateStrip(
    selected: JournalTemplate,
    onSelect: (JournalTemplate) -> Unit,
) {
    Row(
        Modifier
            .fillMaxWidth()
            .padding(top = AiiminTheme.space.s4)
            .height(IntrinsicSize.Min)
            .border(Hairline, AiiminTheme.colors.hair),
    ) {
        JournalTemplate.entries.forEachIndexed { i, template ->
            val on = template == selected
            if (i > 0) {
                Box(
                    Modifier
                        .width(Hairline)
                        .fillMaxHeight()
                        .background(AiiminTheme.colors.hair),
                )
            }
            TapSurface(
                onClick = { onSelect(template) },
                minTouchTarget = false,
                modifier = Modifier
                    .weight(1f)
                    .fillMaxHeight()
                    .background(if (on) AiiminTheme.colors.tint else AiiminTheme.colors.bg),
            ) {
                Text(
                    text = template.label,
                    style = AiiminTheme.type.chrome.copy(
                        fontSize = 9.sp,
                        letterSpacing = 0.8.sp,
                    ),
                    color = if (on) AiiminTheme.colors.accent else AiiminTheme.colors.muted,
                    textAlign = TextAlign.Center,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 8.dp, horizontal = 2.dp),
                )
            }
        }
    }
}

@Composable
private fun MoodGrid(selected: Int, onSelect: (Int) -> Unit) {
    Row(
        Modifier
            .fillMaxWidth()
            .padding(top = AiiminTheme.space.s3),
        horizontalArrangement = Arrangement.spacedBy(5.dp),
    ) {
        JournalState.MOOD_LABELS.forEachIndexed { i, label ->
            val mood = i + 1
            val on = mood == selected
            TapSurface(
                onClick = { onSelect(mood) },
                minTouchTarget = false,
                modifier = Modifier
                    .weight(1f)
                    .border(
                        Hairline,
                        if (on) AiiminTheme.colors.accent else AiiminTheme.colors.hair,
                    )
                    .background(if (on) AiiminTheme.colors.tint else AiiminTheme.colors.bg)
                    .padding(vertical = 9.dp),
            ) {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(4.dp),
                    modifier = Modifier.fillMaxWidth(),
                ) {
                    Text(
                        text = mood.toString(),
                        style = AiiminTheme.type.mono(13.0, FontWeight.Bold),
                        color = if (on) AiiminTheme.colors.accent else AiiminTheme.colors.text,
                    )
                    Text(
                        text = label,
                        style = AiiminTheme.type.chrome.copy(
                            fontSize = 8.sp,
                            letterSpacing = 0.8.sp,
                        ),
                        color = if (on) AiiminTheme.colors.accent else AiiminTheme.colors.muted,
                    )
                }
            }
        }
    }
}

@Composable
private fun HistoryRow(entry: JournalEntry) {
    Column(Modifier.padding(vertical = 11.dp)) {
        Row(
            Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s3),
        ) {
            Text(text = entry.date, style = AiiminTheme.type.mono(10.5, FontWeight.Medium))
            Text(
                text = entry.template.label,
                style = AiiminTheme.type.chrome.copy(fontSize = 8.5.sp, letterSpacing = 1.sp),
                color = AiiminTheme.colors.muted,
            )
            Text(
                text = "MOOD ${entry.mood}",
                style = AiiminTheme.type.mono(10.0),
                color = AiiminTheme.colors.accent,
                modifier = Modifier.weight(1f),
                textAlign = TextAlign.End,
            )
        }
        Text(
            text = entry.excerpt,
            style = AiiminTheme.type.body.copy(fontSize = 12.5.sp, lineHeight = 18.sp),
            color = AiiminTheme.colors.muted,
            modifier = Modifier.padding(top = 4.dp),
        )
    }
}

@Preview(showBackground = true, backgroundColor = 0xFF15171A, widthDp = 390, heightDp = 900)
@Composable
private fun JournalPreview() {
    AiiminTheme {
        JournalScreen(
            state = JournalState.seed(),
            onTemplate = {},
            onDraft = {},
            onMood = {},
            onSave = {},
            onDismissNotice = {},
        )
    }
}
