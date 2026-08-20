package aiimin.feature.notes

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import aiimin.core.data.NoteItem
import aiimin.core.data.NoteState
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
import java.time.Instant
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.util.Locale

@Composable
fun NotesRoute(
    onBack: () -> Unit = {},
    modifier: Modifier = Modifier,
    viewModel: NotesViewModel = hiltViewModel(),
) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    NotesScreen(
        state = state,
        onBack = onBack,
        onNew = viewModel::onNew,
        onEdit = viewModel::onEdit,
        onCancel = viewModel::onCancel,
        onTitle = viewModel::onTitle,
        onBody = viewModel::onBody,
        onSave = viewModel::onSave,
        onTogglePin = viewModel::onTogglePin,
        onDelete = viewModel::onDelete,
        onDismissNotice = viewModel::onDismissNotice,
        modifier = modifier,
    )
}

/**
 * One job: **park thoughts.** Composer + vault list. Not a second journal.
 * VP0 ref: paper-notes (pinned + list) — adapted to Drafting Table.
 */
@Composable
fun NotesScreen(
    state: NoteState,
    onBack: () -> Unit,
    onNew: () -> Unit,
    onEdit: (String) -> Unit,
    onCancel: () -> Unit,
    onTitle: (String) -> Unit,
    onBody: (String) -> Unit,
    onSave: () -> Unit,
    onTogglePin: (String) -> Unit,
    onDelete: (String) -> Unit,
    onDismissNotice: () -> Unit,
    modifier: Modifier = Modifier,
) {
    Column(
        modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(horizontal = AiiminTheme.space.page)
            .padding(bottom = AiiminTheme.space.s8),
    ) {
        GhostButton(label = "BACK", onClick = onBack, modifier = Modifier.padding(top = AiiminTheme.space.s2))
        ScreenHead(title = "Notes", meta = state.headMeta)

        state.notice?.let { notice ->
            TapSurface(onClick = onDismissNotice, modifier = Modifier.padding(top = AiiminTheme.space.s3)) {
                Text(
                    text = notice.message.uppercase(Locale.US),
                    style = AiiminTheme.type.mono(10.5),
                    color = AiiminTheme.colors.accent,
                )
            }
        }

        Text(
            text = "Park a thought. Not a diary — that’s Journal. Syncs with the graph.",
            style = AiiminTheme.type.bodySmall,
            color = AiiminTheme.colors.muted,
            modifier = Modifier.padding(top = AiiminTheme.space.s2),
        )

        if (state.composing) {
            SectionRule(
                label = if (state.editingId == null) "New note" else "Edit note",
                value = "DRAFT",
            )
            BlueprintBox(
                accent = true,
                tinted = true,
                modifier = Modifier.padding(top = AiiminTheme.space.s3),
            ) {
                BasicTextField(
                    value = state.draftTitle,
                    onValueChange = onTitle,
                    textStyle = AiiminTheme.type.body.copy(
                        fontSize = 16.sp,
                        color = AiiminTheme.colors.text,
                    ),
                    cursorBrush = SolidColor(AiiminTheme.colors.accent),
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth(),
                    decorationBox = { inner ->
                        if (state.draftTitle.isEmpty()) {
                            Text("Title (optional)", style = AiiminTheme.type.body, color = AiiminTheme.colors.muted)
                        }
                        inner()
                    },
                )
                HairRule(Modifier.padding(vertical = AiiminTheme.space.s3))
                BasicTextField(
                    value = state.draftBody,
                    onValueChange = onBody,
                    textStyle = AiiminTheme.type.body.copy(
                        fontSize = 15.sp,
                        lineHeight = 22.sp,
                        color = AiiminTheme.colors.text,
                    ),
                    cursorBrush = SolidColor(AiiminTheme.colors.accent),
                    modifier = Modifier
                        .fillMaxWidth()
                        .heightIn(min = 120.dp),
                    decorationBox = { inner ->
                        if (state.draftBody.isEmpty()) {
                            Text(
                                "Write the thing before it evaporates…",
                                style = AiiminTheme.type.body,
                                color = AiiminTheme.colors.muted,
                            )
                        }
                        inner()
                    },
                )
            }
            Row(
                Modifier
                    .fillMaxWidth()
                    .padding(top = AiiminTheme.space.s3),
                horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s3),
            ) {
                GhostButton(label = "CANCEL", onClick = onCancel, modifier = Modifier.weight(1f))
                PrimaryButton(
                    label = "SAVE",
                    onClick = onSave,
                    enabled = state.canSave,
                    modifier = Modifier.weight(1f),
                )
            }
        } else {
            PrimaryButton(
                label = "NEW NOTE",
                onClick = onNew,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = AiiminTheme.space.s4),
            )
        }

        val pinned = state.pinnedFirst.filter { it.pinned }
        val rest = state.pinnedFirst.filterNot { it.pinned }

        if (pinned.isNotEmpty()) {
            SectionRule(label = "Pinned", value = "${pinned.size}")
            pinned.forEach { note ->
                NoteCard(
                    note = note,
                    onOpen = { onEdit(note.id) },
                    onPin = { onTogglePin(note.id) },
                    onDelete = { onDelete(note.id) },
                )
            }
        }

        SectionRule(label = "Vault", value = "${rest.size}")
        if (rest.isEmpty() && pinned.isEmpty()) {
            Text(
                text = "Empty vault. First note is free — the forgetting is expensive.",
                style = AiiminTheme.type.bodySmall,
                color = AiiminTheme.colors.muted,
                modifier = Modifier.padding(top = AiiminTheme.space.s3),
            )
        } else {
            rest.forEach { note ->
                NoteCard(
                    note = note,
                    onOpen = { onEdit(note.id) },
                    onPin = { onTogglePin(note.id) },
                    onDelete = { onDelete(note.id) },
                )
            }
        }
    }
}

@Composable
private fun NoteCard(
    note: NoteItem,
    onOpen: () -> Unit,
    onPin: () -> Unit,
    onDelete: () -> Unit,
) {
    val whenLabel = if (note.updatedAt <= 0L) {
        "—"
    } else {
        Instant.ofEpochMilli(note.updatedAt)
            .atZone(ZoneId.systemDefault())
            .format(DateTimeFormatter.ofPattern("EEE d · HH:mm", Locale.US))
    }
    Column(Modifier.padding(top = AiiminTheme.space.s3)) {
        TapSurface(onClick = onOpen, modifier = Modifier.fillMaxWidth()) {
            Column(
                Modifier
                    .fillMaxWidth()
                    .border(Hairline, if (note.pinned) AiiminTheme.colors.accent else AiiminTheme.colors.hair)
                    .background(if (note.pinned) AiiminTheme.colors.tint else AiiminTheme.colors.surface)
                    .padding(AiiminTheme.space.s3),
            ) {
                Row(
                    Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Text(
                        text = note.title,
                        style = AiiminTheme.type.body.copy(fontSize = 15.sp),
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis,
                        modifier = Modifier.weight(1f),
                    )
                    Text(
                        text = when {
                            note.pending -> "QUEUE"
                            note.pinned -> "PIN"
                            else -> whenLabel.uppercase(Locale.US)
                        },
                        style = AiiminTheme.type.mono(10.0),
                        color = AiiminTheme.colors.accent,
                        modifier = Modifier.padding(start = AiiminTheme.space.s2),
                    )
                }
                if (note.excerpt.isNotBlank() && note.excerpt != note.title) {
                    Text(
                        text = note.excerpt,
                        style = AiiminTheme.type.bodySmall,
                        color = AiiminTheme.colors.muted,
                        maxLines = 3,
                        overflow = TextOverflow.Ellipsis,
                        modifier = Modifier.padding(top = AiiminTheme.space.s2),
                    )
                }
            }
        }
        Row(
            Modifier
                .fillMaxWidth()
                .padding(top = AiiminTheme.space.s2),
            horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s2),
        ) {
            GhostButton(
                label = if (note.pinned) "UNPIN" else "PIN",
                onClick = onPin,
                modifier = Modifier.weight(1f),
            )
            GhostButton(
                label = "DELETE",
                onClick = onDelete,
                modifier = Modifier.weight(1f),
            )
        }
    }
}
