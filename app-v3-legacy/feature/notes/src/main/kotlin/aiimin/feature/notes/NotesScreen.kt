package aiimin.feature.notes

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.gestures.detectHorizontalDragGestures
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.staggeredgrid.LazyVerticalStaggeredGrid
import androidx.compose.foundation.lazy.staggeredgrid.StaggeredGridCells
import androidx.compose.foundation.lazy.staggeredgrid.StaggeredGridItemSpan
import androidx.compose.foundation.lazy.staggeredgrid.items
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
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
    LazyVerticalStaggeredGrid(
        columns = StaggeredGridCells.Fixed(2),
        modifier = modifier.fillMaxSize(),
        contentPadding = PaddingValues(
            horizontal = AiiminTheme.space.page,
            vertical = AiiminTheme.space.s4
        ),
        horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s3),
        verticalItemSpacing = AiiminTheme.space.s3,
    ) {
        item(span = StaggeredGridItemSpan.FullLine) {
            Column {
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
            }
        }

        if (state.composing) {
            item(span = StaggeredGridItemSpan.FullLine) {
                Column {
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
                }
            }
        } else {
            item(span = StaggeredGridItemSpan.FullLine) {
                PrimaryButton(
                    label = "NEW NOTE",
                    onClick = onNew,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = AiiminTheme.space.s4),
                )
            }
        }

        val pinned = state.pinnedFirst.filter { it.pinned }
        val rest = state.pinnedFirst.filterNot { it.pinned }

        if (pinned.isNotEmpty()) {
            item(span = StaggeredGridItemSpan.FullLine) {
                SectionRule(label = "Pinned", value = "${pinned.size}")
            }
            items(pinned, key = { it.id }) { note ->
                NoteCard(
                    note = note,
                    onOpen = { onEdit(note.id) },
                    onPin = { onTogglePin(note.id) },
                    onDelete = { onDelete(note.id) },
                )
            }
        }

        item(span = StaggeredGridItemSpan.FullLine) {
            SectionRule(label = "Vault", value = "${rest.size}")
        }

        if (rest.isEmpty() && pinned.isEmpty()) {
            item(span = StaggeredGridItemSpan.FullLine) {
                Text(
                    text = "Empty vault. First note is free — the forgetting is expensive.",
                    style = AiiminTheme.type.bodySmall,
                    color = AiiminTheme.colors.muted,
                    modifier = Modifier.padding(top = AiiminTheme.space.s3),
                )
            }
        } else {
            items(rest, key = { it.id }) { note ->
                NoteCard(
                    note = note,
                    onOpen = { onEdit(note.id) },
                    onPin = { onTogglePin(note.id) },
                    onDelete = { onDelete(note.id) },
                )
            }
        }

        item(span = StaggeredGridItemSpan.FullLine) {
            Box(Modifier.heightIn(min = AiiminTheme.space.s8))
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
        java.time.Instant.ofEpochMilli(note.updatedAt)
            .atZone(java.time.ZoneId.systemDefault())
            .format(java.time.format.DateTimeFormatter.ofPattern("EEE d · HH:mm", Locale.US))
    }

    var showDeleteConfirm by remember { mutableStateOf(false) }

    if (showDeleteConfirm) {
        Dialog(onDismissRequest = { showDeleteConfirm = false }) {
            Column(
                Modifier
                    .fillMaxWidth()
                    .background(AiiminTheme.colors.surface)
                    .border(Hairline, AiiminTheme.colors.rule)
                    .padding(AiiminTheme.space.s4),
                verticalArrangement = Arrangement.spacedBy(AiiminTheme.space.s3),
            ) {
                Text(
                    text = "DELETE NOTE?",
                    style = AiiminTheme.type.cellLabel,
                    color = AiiminTheme.colors.danger,
                )
                Text(
                    text = "Permanently remove \"${note.title.ifBlank { "Untitled" }}\" from your local vault and server?",
                    style = AiiminTheme.type.bodySmall,
                    color = AiiminTheme.colors.text,
                )
                Row(
                    Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s2),
                ) {
                    GhostButton(
                        label = "CANCEL",
                        onClick = { showDeleteConfirm = false },
                        modifier = Modifier.weight(1f),
                    )
                    GhostButton(
                        label = "DELETE",
                        onClick = {
                            showDeleteConfirm = false
                            onDelete()
                        },
                        color = AiiminTheme.colors.danger,
                        modifier = Modifier.weight(1f),
                    )
                }
            }
        }
    }

    TapSurface(
        onClick = onOpen,
        modifier = Modifier
            .fillMaxWidth()
            .padding(top = AiiminTheme.space.s3),
    ) {
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
                    text = note.title.ifBlank { "Untitled" },
                    style = AiiminTheme.type.body.copy(fontSize = 15.sp, fontWeight = FontWeight.SemiBold),
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                    modifier = Modifier.weight(1f),
                )
                Row(
                    horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s2),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    TapSurface(
                        onClick = onPin,
                        minTouchTarget = false,
                        modifier = Modifier.padding(2.dp),
                    ) {
                        Text(
                            text = if (note.pinned) "◈ PINNED" else "◇ PIN",
                            style = AiiminTheme.type.mono(9.5, if (note.pinned) FontWeight.Bold else FontWeight.Normal),
                            color = if (note.pinned) AiiminTheme.colors.accent else AiiminTheme.colors.muted,
                        )
                    }
                    TapSurface(
                        onClick = { showDeleteConfirm = true },
                        minTouchTarget = false,
                        modifier = Modifier.padding(2.dp),
                    ) {
                        Text(
                            text = "×",
                            style = AiiminTheme.type.mono(14.0, FontWeight.Bold),
                            color = AiiminTheme.colors.muted,
                        )
                    }
                }
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
            Row(
                Modifier
                    .fillMaxWidth()
                    .padding(top = AiiminTheme.space.s2),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Text(
                    text = when {
                        note.pending -> "QUEUE · SYNCING"
                        else -> whenLabel.uppercase(Locale.US)
                    },
                    style = AiiminTheme.type.mono(9.0),
                    color = if (note.pending) AiiminTheme.colors.accent else AiiminTheme.colors.muted,
                )
            }
        }
    }
}

