package aiimin.feature.config

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
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import aiimin.core.data.ConfigIdentity
import aiimin.core.data.ConfigState
import aiimin.core.data.SyncState
import aiimin.core.data.formatInr
import aiimin.core.model.LifeMode
import aiimin.designsystem.brand.BrandMark
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
fun ConfigRoute(
    onOpenOsId: () -> Unit,
    onOpenJournal: () -> Unit = {},
    modifier: Modifier = Modifier,
    viewModel: ConfigViewModel = hiltViewModel(),
) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    ConfigScreen(
        state = state,
        onToggleTheme = viewModel::onToggleTheme,
        onToggleReduceMotion = viewModel::onToggleReduceMotion,
        onSelectMode = viewModel::onSelectMode,
        onSyncNow = viewModel::onSyncNow,
        onOpenOsId = onOpenOsId,
        onOpenJournal = onOpenJournal,
        onOpenMinimums = viewModel::onOpenMinimums,
        onReplayCalibration = viewModel::onReplayCalibration,
        onOpenConnections = viewModel::onOpenConnections,
        onExport = viewModel::onExport,
        onOpenDelete = viewModel::onOpenDelete,
        onCloseDelete = viewModel::onCloseDelete,
        onDeleteDraft = viewModel::onDeleteDraft,
        onConfirmDelete = viewModel::onConfirmDelete,
        onDismissNotice = viewModel::onDismissNotice,
        modifier = modifier,
    )
}

/**
 * **One job: configure the OS.**
 *
 * Profile → rank → Life Arc → life mode → sync → preferences → data.
 * Settings stay the penalty box (GOV-100) — no daily capture actions migrate here.
 */
@Composable
fun ConfigScreen(
    state: ConfigUiState,
    onToggleTheme: () -> Unit,
    onToggleReduceMotion: () -> Unit,
    onSelectMode: (LifeMode) -> Unit,
    onSyncNow: () -> Unit,
    onOpenOsId: () -> Unit,
    onOpenJournal: () -> Unit = {},
    onOpenMinimums: () -> Unit,
    onReplayCalibration: () -> Unit,
    onOpenConnections: () -> Unit,
    onExport: () -> Unit,
    onOpenDelete: () -> Unit,
    onCloseDelete: () -> Unit,
    onDeleteDraft: (String) -> Unit,
    onConfirmDelete: () -> Unit,
    onDismissNotice: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val prefs = state.prefs
    Column(
        modifier
            .fillMaxSize()
            .background(AiiminTheme.colors.bg)
            .verticalScroll(rememberScrollState())
            .padding(horizontal = AiiminTheme.space.page)
            .padding(bottom = AiiminTheme.space.s8),
    ) {
        ScreenHead(
            title = "Configuration",
            meta = if (prefs.isSeed) "SEED" else null,
        )

        prefs.notice?.let { notice ->
            LaunchedEffect(notice.message) {
                kotlinx.coroutines.delay(4_200)
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

        ProfileBlock(prefs.identity, onOpenOsId)
        LifeArc(prefs.identity.arc)

        SectionRule(label = "Life mode")
        ModeStrip(selected = state.lifeMode, onSelect = onSelectMode)

        SectionRule(
            label = "Sync",
            value = prefs.sync.label,
            valueColor = if (prefs.sync == SyncState.LIVE) AiiminTheme.colors.accent else AiiminTheme.colors.muted,
        )
        SyncCard(prefs, onSyncNow)

        SectionRule(label = "Preferences")
        PrefRow(
            label = "Appearance",
            value = prefs.themeName,
            valueAccent = true,
            onClick = onToggleTheme,
        )
        PrefRow(
            label = "Reduce motion",
            trailing = {
                MotionToggle(on = prefs.reduceMotion, onToggle = onToggleReduceMotion)
            },
        )
        PrefRow(label = "Notifications", value = prefs.notificationsLabel)
        PrefRow(label = "Daily minimums", value = prefs.minimumsLabel, onClick = onOpenMinimums)
        PrefRow(label = "Journal", value = "4 templates", onClick = onOpenJournal)
        PrefRow(label = "Replay calibration", value = "6 steps", onClick = onReplayCalibration, last = true)

        SectionRule(label = "Data")
        PrefRow(label = "Connections", value = prefs.connectionsLabel, onClick = onOpenConnections)
        PrefRow(label = "Export everything", value = prefs.exportLabel, onClick = onExport)
        PrefRow(label = "Delete account", danger = true, onClick = onOpenDelete, last = true)

        if (prefs.deleteOpen) {
            DeleteVeil(
                draft = prefs.deleteDraft,
                onDraft = onDeleteDraft,
                onConfirm = onConfirmDelete,
                onCancel = onCloseDelete,
            )
        }

        Text(
            text = prefs.buildLabel,
            style = AiiminTheme.type.mono(10.0),
            color = AiiminTheme.colors.muted,
            textAlign = TextAlign.Center,
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = AiiminTheme.space.s6),
        )
    }
}

@Composable
private fun ProfileBlock(identity: ConfigIdentity, onOpenOsId: () -> Unit) {
    Column(
        Modifier
            .fillMaxWidth()
            .padding(top = AiiminTheme.space.s6)
            .border(Hairline, AiiminTheme.colors.hair),
    ) {
        TapSurface(
            onClick = onOpenOsId,
            minTouchTarget = false,
            modifier = Modifier
                .fillMaxWidth()
                .padding(AiiminTheme.space.s4),
        ) {
            Row(
                Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s4),
            ) {
                Box(
                    Modifier
                        .size(40.dp)
                        .border(Hairline, AiiminTheme.colors.hair)
                        .padding(6.dp),
                    contentAlignment = Alignment.Center,
                ) {
                    BrandMark(size = 28.dp)
                }
                Column(Modifier.weight(1f)) {
                    Text(text = identity.name, style = AiiminTheme.type.body.copy(fontWeight = FontWeight.Medium))
                    Text(
                        text = "${identity.osId} · ${identity.tierLabel}",
                        style = AiiminTheme.type.mono(10.5),
                        color = AiiminTheme.colors.muted,
                        modifier = Modifier.padding(top = 2.dp),
                    )
                }
                Text(text = "›", style = AiiminTheme.type.chrome, color = AiiminTheme.colors.muted)
            }
        }
        HairRule()
        Column(
            Modifier
                .fillMaxWidth()
                .padding(horizontal = AiiminTheme.space.s4, vertical = AiiminTheme.space.s3),
        ) {
            Row(
                Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Bottom,
            ) {
                Text(
                    text = "RANK ${identity.rankNo}/${identity.rankTotal} · ${identity.rank}",
                    style = AiiminTheme.type.cellLabel,
                    color = AiiminTheme.colors.accent,
                )
                Text(
                    text = "${formatInr(identity.xp).removePrefix("₹")} XP",
                    style = AiiminTheme.type.mono(11.0, FontWeight.Medium),
                )
            }
            Box(
                Modifier
                    .fillMaxWidth()
                    .padding(top = 8.dp)
                    .height(2.dp)
                    .background(AiiminTheme.colors.hair),
            ) {
                Box(
                    Modifier
                        .fillMaxHeight()
                        .fillMaxWidth(identity.xpPct.coerceIn(0f, 1f))
                        .background(AiiminTheme.colors.accent),
                )
            }
            Text(
                text = "${formatInr(identity.xpToNext).removePrefix("₹")} XP TO ${identity.nextRank}",
                style = AiiminTheme.type.mono(9.5),
                color = AiiminTheme.colors.muted,
                modifier = Modifier.padding(top = 5.dp),
            )
        }
    }
}

@Composable
private fun LifeArc(arc: String) {
    Row(
        Modifier
            .fillMaxWidth()
            .padding(top = AiiminTheme.space.s4)
            .background(AiiminTheme.colors.tint)
            .border(Hairline, AiiminTheme.colors.hair),
    ) {
        Box(
            Modifier
                .width(3.dp)
                .height(72.dp)
                .background(AiiminTheme.colors.accent),
        )
        Column(
            Modifier
                .weight(1f)
                .padding(AiiminTheme.space.s3),
        ) {
            Text(
                text = "LIFE ARC",
                style = AiiminTheme.type.cellLabel,
                color = AiiminTheme.colors.accent,
            )
            Text(
                text = arc,
                style = AiiminTheme.type.body.copy(lineHeight = 19.sp),
                modifier = Modifier.padding(top = 4.dp),
            )
        }
    }
}

@Composable
private fun ModeStrip(selected: LifeMode, onSelect: (LifeMode) -> Unit) {
    Row(
        Modifier
            .fillMaxWidth()
            .padding(top = AiiminTheme.space.s3)
            .height(IntrinsicSize.Min)
            .border(Hairline, AiiminTheme.colors.hair),
    ) {
        LifeMode.entries.forEachIndexed { i, mode ->
            val on = mode == selected
            if (i > 0) {
                Box(
                    Modifier
                        .width(Hairline)
                        .fillMaxHeight()
                        .background(AiiminTheme.colors.hair),
                )
            }
            TapSurface(
                onClick = { onSelect(mode) },
                minTouchTarget = false,
                modifier = Modifier
                    .weight(1f)
                    .fillMaxHeight()
                    .background(if (on) AiiminTheme.colors.tint else Color.Transparent),
            ) {
                Text(
                    text = mode.label,
                    style = AiiminTheme.type.chrome.copy(fontSize = 10.sp, letterSpacing = 1.2.sp),
                    color = if (on) AiiminTheme.colors.accent else AiiminTheme.colors.muted,
                    textAlign = TextAlign.Center,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 11.dp),
                )
            }
        }
    }
}

@Composable
private fun SyncCard(prefs: ConfigState, onSyncNow: () -> Unit) {
    Column(
        Modifier
            .fillMaxWidth()
            .padding(top = AiiminTheme.space.s3)
            .border(Hairline, AiiminTheme.colors.hair)
            .padding(AiiminTheme.space.s4),
    ) {
        Row(
            Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Column(Modifier.weight(1f)) {
                Text(text = "aiimin.in", style = AiiminTheme.type.body.copy(fontWeight = FontWeight.Medium))
                Text(
                    text = prefs.syncMeta,
                    style = AiiminTheme.type.mono(10.0),
                    color = AiiminTheme.colors.muted,
                    modifier = Modifier.padding(top = 2.dp),
                )
            }
            GhostButton(
                label = if (prefs.sync == SyncState.SYNCING) "SYNCING" else "Sync",
                onClick = onSyncNow,
                enabled = prefs.sync != SyncState.SYNCING,
            )
        }
        Text(
            text = "Capture through the week on the phone. Sunday, the site opens the full drawing — charts, reports, the Lab.",
            style = AiiminTheme.type.bodySmall,
            color = AiiminTheme.colors.muted,
            modifier = Modifier.padding(top = AiiminTheme.space.s3),
        )
    }
}

@Composable
private fun PrefRow(
    label: String,
    value: String? = null,
    valueAccent: Boolean = false,
    danger: Boolean = false,
    last: Boolean = false,
    onClick: (() -> Unit)? = null,
    trailing: (@Composable () -> Unit)? = null,
) {
    val rowMod = Modifier
        .fillMaxWidth()
        .then(if (onClick != null) Modifier else Modifier)
    val content = @Composable {
        Row(
            Modifier
                .fillMaxWidth()
                .padding(vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s3),
        ) {
            Text(
                text = label,
                style = AiiminTheme.type.body,
                color = if (danger) AiiminTheme.colors.danger else AiiminTheme.colors.text,
                modifier = Modifier.weight(1f),
            )
            trailing?.invoke()
            if (value != null) {
                Text(
                    text = value,
                    style = AiiminTheme.type.bodySmall,
                    color = when {
                        danger -> AiiminTheme.colors.danger
                        valueAccent -> AiiminTheme.colors.accent
                        else -> AiiminTheme.colors.muted
                    },
                )
            }
        }
        if (!last) HairRule()
    }
    if (onClick != null) {
        TapSurface(onClick = onClick, minTouchTarget = false, modifier = rowMod) {
            content()
        }
    } else {
        Column(rowMod) { content() }
    }
}

@Composable
private fun MotionToggle(on: Boolean, onToggle: () -> Unit) {
    TapSurface(
        onClick = onToggle,
        minTouchTarget = false,
        modifier = Modifier
            .width(36.dp)
            .height(19.dp)
            .border(Hairline, AiiminTheme.colors.rule),
    ) {
        Box(
            Modifier
                .fillMaxSize()
                .padding(2.dp),
        ) {
            Box(
                Modifier
                    .size(13.dp)
                    .align(if (on) Alignment.CenterEnd else Alignment.CenterStart)
                    .background(if (on) AiiminTheme.colors.accent else AiiminTheme.colors.muted),
            )
        }
    }
}

@Composable
private fun DeleteVeil(
    draft: String,
    onDraft: (String) -> Unit,
    onConfirm: () -> Unit,
    onCancel: () -> Unit,
) {
    Column(
        Modifier
            .fillMaxWidth()
            .padding(top = AiiminTheme.space.s4)
            .border(Hairline, AiiminTheme.colors.danger)
            .padding(AiiminTheme.space.s4),
    ) {
        Text(
            text = "TYPE DELETE TO CONTINUE",
            style = AiiminTheme.type.sectionLabel,
            color = AiiminTheme.colors.danger,
        )
        Text(
            text = "This veil is local. Confirming still refuses — account wipe needs the live API.",
            style = AiiminTheme.type.bodySmall,
            color = AiiminTheme.colors.muted,
            modifier = Modifier.padding(top = AiiminTheme.space.s2),
        )
        BasicTextField(
            value = draft,
            onValueChange = onDraft,
            singleLine = true,
            textStyle = AiiminTheme.type.mono.copy(color = AiiminTheme.colors.text),
            cursorBrush = SolidColor(AiiminTheme.colors.accent),
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = AiiminTheme.space.s3)
                .border(Hairline, AiiminTheme.colors.rule)
                .padding(horizontal = AiiminTheme.space.s3, vertical = 10.dp),
            decorationBox = { inner ->
                if (draft.isEmpty()) {
                    Text(text = "DELETE", style = AiiminTheme.type.mono, color = AiiminTheme.colors.muted)
                }
                inner()
            },
        )
        Row(
            Modifier
                .fillMaxWidth()
                .padding(top = AiiminTheme.space.s3),
            horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s3),
        ) {
            GhostButton(label = "Cancel", onClick = onCancel, modifier = Modifier.weight(1f))
            PrimaryButton(label = "Confirm", onClick = onConfirm, modifier = Modifier.weight(1f))
        }
    }
}

@Preview(showBackground = true, backgroundColor = 0xFF15171A)
@Composable
private fun ConfigSeedPreview() {
    AiiminTheme {
        ConfigScreen(
            state = ConfigUiState(ConfigState.seed(), LifeMode.BUILD),
            onToggleTheme = {},
            onToggleReduceMotion = {},
            onSelectMode = {},
            onSyncNow = {},
            onOpenOsId = {},
            onOpenMinimums = {},
            onReplayCalibration = {},
            onOpenConnections = {},
            onExport = {},
            onOpenDelete = {},
            onCloseDelete = {},
            onDeleteDraft = {},
            onConfirmDelete = {},
            onDismissNotice = {},
        )
    }
}
