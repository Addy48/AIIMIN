package aiimin.feature.capture

import android.Manifest
import android.content.pm.PackageManager
import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.slideInVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.gestures.awaitEachGesture
import androidx.compose.foundation.gestures.awaitFirstDown
import androidx.compose.foundation.gestures.waitForUpOrCancellation
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.core.content.ContextCompat
import androidx.core.content.FileProvider
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import java.io.File
import kotlinx.coroutines.launch
import aiimin.designsystem.component.BlueprintBox
import aiimin.designsystem.component.EmptyState
import aiimin.designsystem.component.Feedback
import aiimin.designsystem.component.FieldChip
import aiimin.designsystem.component.GhostButton
import aiimin.designsystem.component.HairRule
import aiimin.designsystem.component.PrimaryButton
import aiimin.designsystem.component.Rule
import aiimin.designsystem.component.ScreenHead
import aiimin.designsystem.component.SectionRule
import aiimin.designsystem.component.TapSurface
import aiimin.designsystem.component.Text
import aiimin.designsystem.component.UndoToast
import aiimin.designsystem.theme.AiiminTheme
import aiimin.designsystem.theme.Hairline
import aiimin.designsystem.theme.MinTouchTarget
import aiimin.feature.capture.parse.CaptureField
import aiimin.feature.capture.parse.CaptureParser
import aiimin.feature.capture.parse.ParsedCapture

@Composable
fun CaptureRoute(
    onOpenJournal: () -> Unit = {},
    modifier: Modifier = Modifier,
    viewModel: CaptureViewModel = hiltViewModel(),
) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    var showScanChooser by remember { mutableStateOf(false) }
    var pendingCameraUri by remember { mutableStateOf<Uri?>(null) }
    val voice = remember { VoiceSpeech(context) }
    androidx.compose.runtime.DisposableEffect(Unit) {
        onDispose { voice.destroy() }
    }

    fun runOcr(uri: Uri) {
        scope.launch {
            viewModel.onPresetNotice("Reading scan…")
            val ocr = ScanOcr.readText(context, uri)
            viewModel.onVoiceOrScanText(ScanOcr.seedFromOcr(ocr))
            if (ocr.isNullOrBlank()) {
                viewModel.onPresetNotice("No text found — describe amount/merchant on the line.")
            }
        }
    }

    fun beginVoiceHold() {
        viewModel.onVoiceHoldStart()
        voice.start(
            onPartial = viewModel::onVoicePartial,
            onFinal = viewModel::onVoiceHoldEnd,
            onError = viewModel::onVoiceFailed,
        )
    }

    fun endVoiceHold() {
        voice.stop()
        scope.launch {
            kotlinx.coroutines.delay(600)
            if (viewModel.state.value.voiceHolding) viewModel.onVoiceHoldEnd(null)
        }
    }

    val micPermission = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission(),
    ) { granted ->
        if (granted) viewModel.onPresetNotice("Hold VOICE to talk.")
        else viewModel.onPresetNotice("Microphone permission needed for voice.")
    }

    val galleryLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.GetContent(),
    ) { uri ->
        if (uri != null) runOcr(uri)
    }

    val cameraLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.TakePicture(),
    ) { ok ->
        val uri = pendingCameraUri
        pendingCameraUri = null
        if (ok && uri != null) runOcr(uri)
        else if (!ok) viewModel.onPresetNotice("Camera cancelled.")
    }

    val cameraPermission = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission(),
    ) { granted ->
        if (!granted) {
            viewModel.onPresetNotice("Camera permission needed to snap a receipt.")
            return@rememberLauncherForActivityResult
        }
        val uri = createScanImageUri(context) ?: run {
            viewModel.onPresetNotice("Could not open camera storage.")
            return@rememberLauncherForActivityResult
        }
        pendingCameraUri = uri
        cameraLauncher.launch(uri)
    }

    LaunchedEffect(state.notice) {
        if (state.notice != null) viewModel.onNoticeShown()
    }

    if (showScanChooser) {
        ScanSourceDialog(
            onCamera = {
                showScanChooser = false
                when {
                    ContextCompat.checkSelfPermission(
                        context,
                        Manifest.permission.CAMERA,
                    ) == PackageManager.PERMISSION_GRANTED -> {
                        val uri = createScanImageUri(context)
                        if (uri == null) {
                            viewModel.onPresetNotice("Could not open camera storage.")
                        } else {
                            pendingCameraUri = uri
                            cameraLauncher.launch(uri)
                        }
                    }
                    else -> cameraPermission.launch(Manifest.permission.CAMERA)
                }
            },
            onGallery = {
                showScanChooser = false
                galleryLauncher.launch("image/*")
            },
            onDismiss = { showScanChooser = false },
        )
    }

    CaptureScreen(
        state = state,
        onTextChange = viewModel::onTextChange,
        onEditField = viewModel::onEditField,
        onEditDraftChange = viewModel::onEditDraftChange,
        onCommitEdit = viewModel::onCommitEdit,
        onCancelEdit = viewModel::onCancelEdit,
        onToggleField = viewModel::onToggleField,
        onSettle = viewModel::onSettle,
        onDrift = viewModel::onDrift,
        onUndo = viewModel::onUndo,
        onOpenJournal = onOpenJournal,
        onVoicePress = {
            when {
                ContextCompat.checkSelfPermission(
                    context,
                    Manifest.permission.RECORD_AUDIO,
                ) == PackageManager.PERMISSION_GRANTED -> beginVoiceHold()
                else -> micPermission.launch(Manifest.permission.RECORD_AUDIO)
            }
        },
        onVoiceRelease = { endVoiceHold() },
        onPreset = { preset ->
            when (preset.kind) {
                CapturePreset.Kind.JOURNAL -> onOpenJournal()
                CapturePreset.Kind.VOICE -> Unit
                CapturePreset.Kind.SCAN -> showScanChooser = true
                else -> viewModel.onPreset(preset)
            }
        },
        modifier = modifier,
    )
}

@Composable
private fun ScanSourceDialog(
    onCamera: () -> Unit,
    onGallery: () -> Unit,
    onDismiss: () -> Unit,
) {
    Dialog(onDismissRequest = onDismiss) {
        Column(
            Modifier
                .fillMaxWidth()
                .background(AiiminTheme.colors.surface)
                .border(Hairline, AiiminTheme.colors.rule)
                .padding(AiiminTheme.space.s4),
            verticalArrangement = Arrangement.spacedBy(AiiminTheme.space.s3),
        ) {
            Text(
                text = "SCAN SOURCE",
                style = AiiminTheme.type.cellLabel,
                color = AiiminTheme.colors.accent,
            )
            Text(
                text = "Snap a receipt or pick one from the gallery.",
                style = AiiminTheme.type.bodySmall,
                color = AiiminTheme.colors.muted,
            )
            PrimaryButton(label = "Camera", onClick = onCamera, modifier = Modifier.fillMaxWidth())
            GhostButton(label = "Gallery", onClick = onGallery, modifier = Modifier.fillMaxWidth())
            TapSurface(onClick = onDismiss) {
                Text(
                    text = "CANCEL",
                    style = AiiminTheme.type.button,
                    color = AiiminTheme.colors.muted,
                    modifier = Modifier.padding(AiiminTheme.space.s2),
                )
            }
        }
    }
}

private fun createScanImageUri(context: android.content.Context): Uri? = try {
    val dir = File(context.cacheDir, "scans").apply { mkdirs() }
    val file = File(dir, "scan_${System.currentTimeMillis()}.jpg")
    FileProvider.getUriForFile(context, "${context.packageName}.files", file)
} catch (_: Exception) {
    null
}

/**
 * **One job: turn one sentence into structured truth you can correct before it
 * commits.**
 *
 * Reading order is the order of trust: what you wrote, what AIIMIN thinks it
 * means, then the two ways out — Settle writes it, Drift keeps it without
 * writing. Nothing on this screen commits anything on its own.
 */
@Composable
fun CaptureScreen(
    state: CaptureUiState,
    onTextChange: (String) -> Unit,
    onEditField: (CaptureField) -> Unit,
    onEditDraftChange: (String) -> Unit,
    onCommitEdit: () -> Unit,
    onCancelEdit: () -> Unit,
    onToggleField: (CaptureField) -> Unit,
    onSettle: () -> Unit,
    onDrift: () -> Unit,
    onUndo: (Long) -> Unit,
    onPreset: (CapturePreset) -> Unit,
    onOpenJournal: () -> Unit = {},
    onVoicePress: () -> Unit = {},
    onVoiceRelease: () -> Unit = {},
    modifier: Modifier = Modifier,
) {
    Box(
        modifier
            .fillMaxSize(),
    ) {
        Column(
            Modifier
                .fillMaxSize()
                .imePadding()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = AiiminTheme.space.page)
                .padding(bottom = AiiminTheme.space.s8),
        ) {
            ScreenHead(title = "Capture", meta = "${state.settled.size} TODAY")

            Composer(
                state = state,
                onTextChange = onTextChange,
                onEditField = onEditField,
                onEditDraftChange = onEditDraftChange,
                onCommitEdit = onCommitEdit,
                onCancelEdit = onCancelEdit,
                onToggleField = onToggleField,
                onSettle = onSettle,
                onDrift = onDrift,
                voiceHolding = state.voiceHolding,
                voiceElapsedMs = state.voiceElapsedMs,
                onVoicePress = onVoicePress,
                onVoiceRelease = onVoiceRelease,
                modifier = Modifier.padding(top = AiiminTheme.space.s6),
            )

            JournalLead(onOpenJournal = onOpenJournal, modifier = Modifier.padding(top = AiiminTheme.space.s4))

            Presets(
                onPreset = onPreset,
                modifier = Modifier.padding(top = AiiminTheme.space.s4),
            )

            if (state.holds.isEmpty() && state.settled.isEmpty()) {
                SectionRule(label = "The day so far")
                EmptyState(
                    label = "Nothing yet today",
                    message = "Write the first line. What you settle lands here; what you drift waits in the hold.",
                )
            } else {
                if (state.holds.isNotEmpty()) {
                    SectionRule(label = "Hold tray", value = "${state.holds.size} WAITING")
                    state.holds.forEach { held -> HoldRow(held) }
                }
                SectionRule(label = "Today's captures", value = "${state.settled.size}")
                if (state.settled.isEmpty()) {
                    EmptyState(
                        label = "Nothing settled yet",
                        message = "Nothing has been committed today. What you settle lands here, newest first.",
                    )
                } else {
                    state.settled.forEach { settled -> SettledRow(settled) }
                }
            }
        }

        UndoToast(
            message = state.notice?.message,
            onUndo = state.notice?.undoId?.let { id -> { onUndo(id) } },
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .padding(AiiminTheme.space.s6),
        )
    }
}

@Composable
private fun JournalLead(onOpenJournal: () -> Unit, modifier: Modifier = Modifier) {
    TapSurface(
        onClick = onOpenJournal,
        modifier = modifier
            .fillMaxWidth()
            .border(Hairline, AiiminTheme.colors.accent),
        contentPadding = AiiminTheme.space.s3,
    ) {
        Row(
            Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Text(
                text = "JOURNAL · templates · mood",
                style = AiiminTheme.type.cellLabel,
                color = AiiminTheme.colors.accent,
                modifier = Modifier.weight(1f),
            )
            Text(
                text = "OPEN",
                style = AiiminTheme.type.button,
                color = AiiminTheme.colors.accent,
            )
        }
    }
}

@Composable
private fun Composer(
    state: CaptureUiState,
    onTextChange: (String) -> Unit,
    onEditField: (CaptureField) -> Unit,
    onEditDraftChange: (String) -> Unit,
    onCommitEdit: () -> Unit,
    onCancelEdit: () -> Unit,
    onToggleField: (CaptureField) -> Unit,
    onSettle: () -> Unit,
    onDrift: () -> Unit,
    voiceHolding: Boolean,
    voiceElapsedMs: Long,
    onVoicePress: () -> Unit,
    onVoiceRelease: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val composer = remember { FocusRequester() }
    LaunchedEffect(Unit) { runCatching { composer.requestFocus() } }

    BlueprintBox(modifier = modifier, legend = "The line", accent = true, tinted = true) {
        BasicTextField(
            value = state.text,
            onValueChange = onTextChange,
            textStyle = AiiminTheme.type.body.copy(
                fontSize = 15.sp,
                lineHeight = 22.5.sp,
                color = AiiminTheme.colors.text,
            ),
            cursorBrush = SolidColor(AiiminTheme.colors.accent),
            modifier = Modifier
                .fillMaxWidth()
                .heightIn(min = 66.dp)
                .focusRequester(composer),
            decorationBox = { field ->
                if (state.text.isEmpty()) {
                    Text(
                        text = "paid 1240 swiggy dinner with rohan…",
                        style = AiiminTheme.type.body.copy(fontSize = 15.sp),
                        color = AiiminTheme.colors.muted,
                    )
                }
                field()
            },
        )

        AnimatedVisibility(
            visible = state.hasOffer && state.offer != null,
            enter = if (AiiminTheme.reduceMotion) {
                fadeIn(tween(0))
            } else {
                fadeIn(tween(200)) + slideInVertically(tween(200)) { it / 3 }
            },
        ) {
            val offer = state.offer
            if (offer != null) {
                Offer(
                    offer = offer,
                    parseSource = state.parseSource,
                    editing = state.editing,
                    editingDraft = state.editingDraft,
                    onEditField = onEditField,
                    onEditDraftChange = onEditDraftChange,
                    onCommitEdit = onCommitEdit,
                    onCancelEdit = onCancelEdit,
                    onToggleField = onToggleField,
                )
            }
        }
        if (!state.hasOffer) {
            Text(
                text = "Write anything. AIIMIN reads it and offers a structure — you correct it, then commit.",
                style = AiiminTheme.type.bodySmall,
                color = AiiminTheme.colors.muted,
                modifier = Modifier.padding(top = AiiminTheme.space.s3),
            )
        }

        if (state.canSettle) {
            Row(
                Modifier
                    .fillMaxWidth()
                    .padding(top = AiiminTheme.space.s4),
                horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s2),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                PrimaryButton(label = "Settle", onClick = onSettle, modifier = Modifier.weight(1f))
                GhostButton(
                    label = "Drift",
                    onClick = onDrift,
                    color = AiiminTheme.colors.muted,
                    feedback = Feedback.REJECT,
                    modifier = Modifier.defaultMinSize(minWidth = 88.dp),
                )
            }
        }

        VoiceHoldChip(
            holding = voiceHolding,
            elapsedMs = voiceElapsedMs,
            onPress = onVoicePress,
            onRelease = onVoiceRelease,
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = AiiminTheme.space.s3),
        )
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun Offer(
    offer: ParsedCapture,
    parseSource: ParseSource,
    editing: CaptureField?,
    editingDraft: String,
    onEditField: (CaptureField) -> Unit,
    onEditDraftChange: (String) -> Unit,
    onCommitEdit: () -> Unit,
    onCancelEdit: () -> Unit,
    onToggleField: (CaptureField) -> Unit,
) {
    Column(
        Modifier
            .fillMaxWidth()
            .padding(top = AiiminTheme.space.s3),
        verticalArrangement = Arrangement.spacedBy(AiiminTheme.space.s2),
    ) {
        Rule()
        Text(
            text = parseSource.label.uppercase(),
            style = AiiminTheme.type.mono(9.5),
            color = if (parseSource == ParseSource.AI) {
                AiiminTheme.colors.accent
            } else {
                AiiminTheme.colors.muted
            },
        )
        Text(
            text = "THE OFFER · ADJUST BEFORE COMMIT",
            style = AiiminTheme.type.cellLabel,
            color = AiiminTheme.colors.accent,
        )
        FlowRow(
            Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(5.dp),
            verticalArrangement = Arrangement.spacedBy(5.dp),
        ) {
            offer.chips.forEach { chip ->
                FieldChip(
                    label = chip.label,
                    included = chip.included,
                    selected = editing == chip.field,
                    onClick = { onEditField(chip.field) },
                    onToggle = { onToggleField(chip.field) },
                )
            }
        }
        if (editing != null) {
            FieldEditor(
                field = editing,
                draft = editingDraft,
                onDraftChange = onEditDraftChange,
                onCommit = onCommitEdit,
                onCancel = onCancelEdit,
            )
        }
    }
}

@Composable
private fun FieldEditor(
    field: CaptureField,
    draft: String,
    onDraftChange: (String) -> Unit,
    onCommit: () -> Unit,
    onCancel: () -> Unit,
) {
    val numeric = field == CaptureField.AMOUNT || field == CaptureField.DURATION

    Column(
        Modifier.padding(top = AiiminTheme.space.s1),
    ) {
        Text(
            text = field.label.uppercase(),
            style = AiiminTheme.type.cellLabel,
            color = AiiminTheme.colors.muted,
        )
        Row(
            Modifier
                .fillMaxWidth()
                .padding(top = AiiminTheme.space.s2),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s2),
        ) {
            BasicTextField(
                value = draft,
                onValueChange = onDraftChange,
                singleLine = true,
                textStyle = AiiminTheme.type.body.copy(color = AiiminTheme.colors.text),
                cursorBrush = SolidColor(AiiminTheme.colors.accent),
                keyboardOptions = KeyboardOptions(
                    imeAction = ImeAction.Done,
                    keyboardType = if (numeric) KeyboardType.Number else KeyboardType.Text,
                ),
                keyboardActions = KeyboardActions(onDone = { onCommit() }),
                modifier = Modifier
                    .weight(1f)
                    .background(AiiminTheme.colors.bg)
                    .border(Hairline, AiiminTheme.colors.rule)
                    .padding(horizontal = AiiminTheme.space.s3, vertical = 10.dp),
            )
            GhostButton(label = "Set", onClick = onCommit)
            TapSurface(onClick = onCancel, minTouchTarget = false) {
                Text(
                    text = "CANCEL",
                    style = AiiminTheme.type.button,
                    color = AiiminTheme.colors.muted,
                    modifier = Modifier.padding(AiiminTheme.space.s2),
                )
            }
        }
    }
}

@Composable
private fun Presets(
    onPreset: (CapturePreset) -> Unit,
    modifier: Modifier = Modifier,
) {
    Column(modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(AiiminTheme.space.s2)) {
        Text(
            text = "QUICK STARTS",
            style = AiiminTheme.type.cellLabel,
            color = AiiminTheme.colors.muted,
        )
        val taps = CapturePreset.entries
            .filter { it.kind != CapturePreset.Kind.VOICE }
            .sortedByDescending { it.available }
        taps.chunked(3).forEach { row ->
            Row(
                Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s2),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                row.forEach { preset ->
                    TapSurface(
                        onClick = { onPreset(preset) },
                        modifier = Modifier
                            .weight(1f)
                            .border(Hairline, AiiminTheme.colors.hair),
                        contentPadding = AiiminTheme.space.s2,
                    ) {
                        Text(
                            text = preset.label.uppercase(),
                            style = AiiminTheme.type.button,
                            color = if (preset.available) {
                                AiiminTheme.colors.text
                            } else {
                                AiiminTheme.colors.muted
                            },
                            textAlign = TextAlign.Center,
                            modifier = Modifier.fillMaxWidth(),
                        )
                    }
                }
                repeat(3 - row.size) { Spacer(Modifier.weight(1f)) }
            }
        }
    }
}

@Composable
private fun VoiceHoldChip(
    holding: Boolean,
    elapsedMs: Long,
    onPress: () -> Unit,
    onRelease: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val fill = if (holding) VoiceCapture.fillFraction(elapsedMs, AiiminTheme.reduceMotion) else 0f
    val label = if (holding) VoiceCapture.formatElapsed(elapsedMs) else "HOLD TO TALK"
    Box(
        modifier
            .defaultMinSize(minHeight = MinTouchTarget)
            .border(Hairline, if (holding) AiiminTheme.colors.accent else AiiminTheme.colors.hair)
            .pointerInput(Unit) {
                awaitEachGesture {
                    awaitFirstDown()
                    onPress()
                    try {
                        waitForUpOrCancellation()
                    } finally {
                        onRelease()
                    }
                }
            },
    ) {
        Box(Modifier.matchParentSize()) {
            Box(
                Modifier
                    .align(Alignment.CenterStart)
                    .fillMaxHeight()
                    .fillMaxWidth(fill)
                    .background(AiiminTheme.colors.accent.copy(alpha = if (holding) 0.28f else 0f)),
            )
        }
        Text(
            text = label,
            style = AiiminTheme.type.button,
            color = if (holding) AiiminTheme.colors.accent else AiiminTheme.colors.text,
            textAlign = TextAlign.Center,
            modifier = Modifier
                .align(Alignment.Center)
                .fillMaxWidth()
                .padding(horizontal = AiiminTheme.space.s3, vertical = AiiminTheme.space.s2),
        )
    }
}

@Composable
private fun HoldRow(held: HeldCapture) {
    Column {
        Row(
            Modifier
                .fillMaxWidth()
                .padding(vertical = 9.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Text(
                text = held.text,
                style = AiiminTheme.type.body,
                color = AiiminTheme.colors.muted,
                modifier = Modifier.weight(1f),
            )
            Text(
                text = held.reason.label,
                style = AiiminTheme.type.cellLabel,
                color = AiiminTheme.colors.accent,
                modifier = Modifier
                    .border(Hairline, AiiminTheme.colors.accent)
                    .padding(horizontal = 6.dp, vertical = 2.dp),
            )
        }
        HairRule()
    }
}

@Composable
private fun SettledRow(settled: SettledCapture) {
    Column {
        Row(
            Modifier
                .fillMaxWidth()
                .padding(vertical = 8.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Text(text = settled.label, style = AiiminTheme.type.body, modifier = Modifier.weight(1f))
            Text(text = settled.time, style = AiiminTheme.type.mono, color = AiiminTheme.colors.muted)
        }
        HairRule()
    }
}

@Preview(showBackground = true, backgroundColor = 0xFF15171A, heightDp = 900)
@Composable
private fun CapturePreview() {
    val parser = CaptureParser()
    val text = "paid 1240 swiggy dinner with rohan, felt sluggish after"
    AiiminTheme {
        CaptureScreen(
            state = CaptureUiState(text = text, offer = parser.parse(text)),
            onTextChange = {},
            onEditField = {},
            onEditDraftChange = {},
            onCommitEdit = {},
            onCancelEdit = {},
            onToggleField = {},
            onSettle = {},
            onDrift = {},
            onUndo = {},
            onPreset = {},
        )
    }
}
