package `in`.aiimin.app.ui.notes

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.outlined.NoteAlt
import androidx.compose.material3.Card
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import `in`.aiimin.app.AppContainer
import `in`.aiimin.app.data.prefs.NoteDraft
import `in`.aiimin.app.ui.components.AiiminPrimaryButton
import `in`.aiimin.app.ui.components.EmptyState
import `in`.aiimin.app.ui.components.ScreenHeader
import `in`.aiimin.app.ui.components.SyncBanner
import `in`.aiimin.app.ui.theme.Accent
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

private val keepColors = listOf("#2D2D2D", "#3D2A1F", "#1F3D2A", "#1F2A3D", "#3D1F2A")

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NotesScreen(container: AppContainer) {
    val notes by container.repository.notes().collectAsState(initial = emptyList())
    val syncUi by container.repository.syncUi.collectAsState()
    var showCompose by remember { mutableStateOf(false) }
    var title by remember { mutableStateOf("") }
    var body by remember { mutableStateOf("") }
    var color by remember { mutableStateOf(keepColors[0]) }
    val savedDraft by container.appPrefs.noteDraft.collectAsState(initial = NoteDraft())
    var draftLoaded by remember { mutableStateOf(false) }
    val scope = rememberCoroutineScope()
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)

    LaunchedEffect(showCompose) {
        if (showCompose && !draftLoaded) {
            title = savedDraft.title
            body = savedDraft.body
            color = savedDraft.color.ifBlank { keepColors[0] }
            draftLoaded = true
        }
        if (!showCompose) draftLoaded = false
    }

    LaunchedEffect(title, body, color, showCompose) {
        if (!showCompose) return@LaunchedEffect
        delay(5000)
        container.appPrefs.saveNoteDraft(NoteDraft(title, body, color))
    }

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(
                onClick = { showCompose = true },
                containerColor = Accent,
                contentColor = Color.White,
            ) {
                Icon(Icons.Default.Add, contentDescription = "New note")
            }
        },
    ) { padding ->
        Column(Modifier.padding(padding).fillMaxSize()) {
            SyncBanner(
                syncUi = syncUi,
                onRetry = { scope.launch { container.repository.syncAll() } },
            )
            ScreenHeader(
                title = "Notes",
                subtitle = "Keep-style · syncs to your account",
            )
            if (notes.isEmpty()) {
                EmptyState(
                    icon = Icons.Outlined.NoteAlt,
                    title = "No notes yet",
                    subtitle = "Tap + to add your first note. Notes sync with your desktop.",
                    actionText = "Add note",
                    onAction = { showCompose = true },
                )
            } else {
                LazyVerticalGrid(
                    columns = GridCells.Fixed(2),
                    contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    modifier = Modifier.fillMaxSize(),
                ) {
                    items(notes, key = { it.id }) { note ->
                        Card(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(148.dp),
                        ) {
                            Box(
                                Modifier
                                    .fillMaxSize()
                                    .background(parseColor(note.color))
                                    .padding(12.dp),
                            ) {
                                Column {
                                    if (note.pinned) {
                                        Text("📌", style = MaterialTheme.typography.labelLarge)
                                    }
                                    Text(
                                        note.title.ifBlank { "Note" },
                                        style = MaterialTheme.typography.titleMedium,
                                        color = Color.White,
                                        maxLines = 2,
                                    )
                                    Text(
                                        note.content,
                                        style = MaterialTheme.typography.bodySmall,
                                        color = Color.White.copy(alpha = 0.85f),
                                        maxLines = 4,
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    if (showCompose) {
        ModalBottomSheet(onDismissRequest = { showCompose = false }, sheetState = sheetState) {
            Column(Modifier.padding(24.dp)) {
                Text("Quick note", style = MaterialTheme.typography.titleLarge)
                Spacer(Modifier.height(12.dp))
                OutlinedTextField(
                    value = title,
                    onValueChange = { title = it },
                    label = { Text("Title") },
                    modifier = Modifier.fillMaxWidth(),
                )
                Spacer(Modifier.height(8.dp))
                OutlinedTextField(
                    value = body,
                    onValueChange = { body = it },
                    label = { Text("Note") },
                    modifier = Modifier.fillMaxWidth().height(120.dp),
                )
                Spacer(Modifier.height(12.dp))
                Text("Color", style = MaterialTheme.typography.labelLarge)
                Spacer(Modifier.height(8.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    keepColors.forEach { c ->
                        val selected = color == c
                        Box(
                            Modifier
                                .height(40.dp)
                                .weight(1f)
                                .clip(RoundedCornerShape(8.dp))
                                .background(parseColor(c))
                                .clickable { color = c }
                                .then(
                                    if (selected) {
                                        Modifier.padding(2.dp)
                                    } else Modifier,
                                ),
                        )
                    }
                }
                Spacer(Modifier.height(16.dp))
                AiiminPrimaryButton(
                    text = "Save",
                    onClick = {
                        scope.launch {
                            container.repository.saveNote(title, body, color)
                            container.appPrefs.clearNoteDraft()
                            title = ""
                            body = ""
                            showCompose = false
                            container.syncEngine.syncNow()
                        }
                    },
                )
                Spacer(Modifier.height(24.dp))
            }
        }
    }
}

private fun parseColor(hex: String): Color = try {
    Color(android.graphics.Color.parseColor(hex))
} catch (_: Exception) {
    Color(0xFF2D2D2D)
}
