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
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import aiimin.core.data.JournalEntry
import aiimin.core.data.JournalState
import aiimin.core.data.JournalTemplate
import aiimin.designsystem.component.BlueprintBox
import aiimin.designsystem.component.GhostButton
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
    onBack: () -> Unit = {},
    modifier: Modifier = Modifier,
    viewModel: JournalViewModel = hiltViewModel(),
) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    val context = LocalContext.current
    val speech = rememberLauncherForActivityResult(
        ActivityResultContracts.StartActivityForResult(),
    ) { result ->
        val spoken = result.data
            ?.getStringArrayListExtra(android.speech.RecognizerIntent.EXTRA_RESULTS)
            ?.firstOrNull()
        if (!spoken.isNullOrBlank()) viewModel.onAppendDraft(spoken)
        else if (result.resultCode != android.app.Activity.RESULT_OK) viewModel.onVoiceFailed()
    }
    JournalScreen(
        state = state,
        onBack = onBack,
        onTemplate = viewModel::onTemplate,
        onDraft = viewModel::onDraft,
        onQuery = viewModel::onQuery,
        onMood = viewModel::onMood,
        onSave = viewModel::onSave,
        onVoice = {
            val intent = android.content.Intent(android.speech.RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
                putExtra(
                    android.speech.RecognizerIntent.EXTRA_LANGUAGE_MODEL,
                    android.speech.RecognizerIntent.LANGUAGE_MODEL_FREE_FORM,
                )
                putExtra(android.speech.RecognizerIntent.EXTRA_PROMPT, "Speak the journal line")
                putExtra(android.speech.RecognizerIntent.EXTRA_MAX_RESULTS, 3)
            }
            try {
                speech.launch(intent)
            } catch (_: Exception) {
                viewModel.onVoiceFailed()
            }
        },
        onExport = {
            val send = android.content.Intent(android.content.Intent.ACTION_SEND).apply {
                type = "text/plain"
                putExtra(android.content.Intent.EXTRA_SUBJECT, "AIIMIN journal")
                putExtra(android.content.Intent.EXTRA_TEXT, viewModel.exportText())
            }
            context.startActivity(android.content.Intent.createChooser(send, "Export journal"))
        },
        onDismissNotice = viewModel::onDismissNotice,
        modifier = modifier,
    )
}

/**
 * **One job: reflection capture.**
 *
 * Type-first. Voice is a bar. Search filters history. Export shares TXT.
 */
@Composable
fun JournalScreen(
    state: JournalState,
    onTemplate: (JournalTemplate) -> Unit,
    onDraft: (String) -> Unit,
    onMood: (Int) -> Unit,
    onSave: () -> Unit,
    onDismissNotice: () -> Unit,
    onBack: () -> Unit = {},
    onQuery: (String) -> Unit = {},
    onVoice: () -> Unit = {},
    onExport: () -> Unit = {},
    modifier: Modifier = Modifier,
) {
    Column(
        modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(horizontal = AiiminTheme.space.page)
            .padding(bottom = AiiminTheme.space.s8),
    ) {
        Row(
            Modifier.fillMaxWidth().padding(top = AiiminTheme.space.s2),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            TapSurface(onClick = onBack) {
                Text(
                    text = "← BACK",
                    style = AiiminTheme.type.cellLabel,
                    color = AiiminTheme.colors.accent,
                    modifier = Modifier.padding(vertical = 8.dp, horizontal = 4.dp),
                )
            }
            Text(
                text = state.headMeta,
                style = AiiminTheme.type.cellLabel,
                color = AiiminTheme.colors.muted,
            )
        }
        ScreenHead(title = "Journal", meta = "REFLECT")

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

        // One job: write. Prompts optional — not four competing modes.
        SectionRule(label = "Today", value = "OPEN")
        BlueprintBox(
            accent = true,
            tinted = true,
            modifier = Modifier.padding(top = AiiminTheme.space.s2),
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
                    .height(180.dp),
                decorationBox = { inner ->
                    if (state.draft.isEmpty()) {
                        Text(
                            text = if (state.template == JournalTemplate.FREE_WRITE) {
                                "What's landing today — thoughts, friction, wins."
                            } else {
                                state.template.prompt
                            },
                            style = AiiminTheme.type.body.copy(fontSize = 15.sp, lineHeight = 23.sp),
                            color = AiiminTheme.colors.muted,
                        )
                    }
                    inner()
                },
            )
        }

        SectionRule(label = "Need a prompt?", value = "OPTIONAL")
        Text(
            text = "Tap a starter if you want a nudge. Writing stays free.",
            style = AiiminTheme.type.bodySmall,
            color = AiiminTheme.colors.muted,
            modifier = Modifier.padding(top = AiiminTheme.space.s2),
        )
        PromptChips(selected = state.template, onSelect = onTemplate)

        SectionRule(label = "Mood")
        MoodGrid(selected = state.mood, onSelect = onMood)

        GhostButton(
            label = "Voice · append",
            onClick = onVoice,
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = AiiminTheme.space.s3),
        )

        PrimaryButton(
            label = "Save entry",
            onClick = onSave,
            enabled = state.draft.isNotBlank(),
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = AiiminTheme.space.s4),
        )

        SectionRule(label = "History", value = "${state.visibleEntries.size} / ${state.entries.size}")
        BlueprintBox(modifier = Modifier.padding(top = AiiminTheme.space.s2)) {
            BasicTextField(
                value = state.query,
                onValueChange = onQuery,
                textStyle = AiiminTheme.type.body.copy(
                    fontSize = 13.sp,
                    color = AiiminTheme.colors.text,
                ),
                cursorBrush = SolidColor(AiiminTheme.colors.accent),
                modifier = Modifier.fillMaxWidth(),
                decorationBox = { inner ->
                    if (state.query.isEmpty()) {
                        Text(
                            text = "Search history",
                            style = AiiminTheme.type.body.copy(fontSize = 13.sp),
                            color = AiiminTheme.colors.muted,
                        )
                    }
                    inner()
                },
            )
        }
        GhostButton(
            label = "Export · TXT",
            onClick = onExport,
            enabled = state.visibleEntries.isNotEmpty(),
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = AiiminTheme.space.s3),
        )
        if (state.visibleEntries.isEmpty()) {
            Text(
                text = if (state.query.isBlank()) "No entries yet." else "NOTHING MATCHES",
                style = AiiminTheme.type.bodySmall,
                color = AiiminTheme.colors.muted,
                modifier = Modifier.padding(top = AiiminTheme.space.s3),
            )
        } else {
            state.visibleEntries.forEachIndexed { i, entry ->
                HistoryRow(entry)
                if (i < state.visibleEntries.lastIndex) HairRule()
            }
        }
    }
}

@Composable
private fun PromptChips(
    selected: JournalTemplate,
    onSelect: (JournalTemplate) -> Unit,
) {
    Column(
        Modifier
            .fillMaxWidth()
            .padding(top = AiiminTheme.space.s2)
            .border(Hairline, AiiminTheme.colors.hair),
    ) {
        JournalTemplate.entries.forEachIndexed { index, template ->
            if (index > 0) HairRule()
            val on = template == selected
            TapSurface(
                onClick = { onSelect(template) },
                minTouchTarget = false,
                modifier = Modifier.fillMaxWidth(),
            ) {
                Row(
                    Modifier
                        .fillMaxWidth()
                        .background(if (on) AiiminTheme.colors.tint else AiiminTheme.colors.bg)
                        .padding(horizontal = AiiminTheme.space.s3, vertical = AiiminTheme.space.s3),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Column(Modifier.weight(1f)) {
                        Text(
                            text = template.label.uppercase(),
                            style = AiiminTheme.type.cellLabel,
                            color = if (on) AiiminTheme.colors.accent else AiiminTheme.colors.text,
                        )
                        Text(
                            text = template.prompt,
                            style = AiiminTheme.type.bodySmall,
                            color = AiiminTheme.colors.muted,
                            maxLines = 2,
                            overflow = TextOverflow.Ellipsis,
                            modifier = Modifier.padding(top = 2.dp),
                        )
                    }
                    Text(
                        text = if (on) "ON" else "USE",
                        style = AiiminTheme.type.mono(9.5),
                        color = if (on) AiiminTheme.colors.accent else AiiminTheme.colors.muted,
                    )
                }
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
