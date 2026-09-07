package aiimin.feature.osid

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.combinedClickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import aiimin.core.model.OsIdRules
import aiimin.designsystem.brand.BrandMark
import aiimin.designsystem.component.GhostButton
import aiimin.designsystem.component.PrimaryButton
import aiimin.designsystem.component.ScreenHead
import aiimin.designsystem.component.SectionRule
import aiimin.designsystem.component.Text
import aiimin.designsystem.component.riseIn
import aiimin.designsystem.theme.AiiminTheme
import aiimin.designsystem.theme.Hairline

private val APPEARS_ON = listOf(
    "Public profile",
    "Leaderboards",
    "Shared reports",
    "Money splits",
    "Login",
)

private val SPEC = listOf(
    "Length" to "EXACTLY ${OsIdRules.LENGTH}",
    "Case" to "UPPERCASE",
    "Digits" to "MAX ${OsIdRules.MAX_DIGITS}",
    "Revisions" to "1 LIFETIME",
)

@Composable
fun OsIdRoute(
    modifier: Modifier = Modifier,
    viewModel: OsIdViewModel = hiltViewModel(),
) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    val context = LocalContext.current
    OsIdScreen(
        state = state,
        onCopy = {
            val cm = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
            cm.setPrimaryClip(ClipData.newPlainText("OS-ID", state.osId))
            viewModel.onCopied()
        },
        onShare = {
            val body = buildString {
                appendLine("AIIMIN · OS-ID credential")
                appendLine()
                appendLine("Part no.  ${state.osId}")
                appendLine("Holder    ${state.holder}")
                appendLine("Member    ${state.memberNo}")
                appendLine("Tier      ${state.tierLabel}")
                appendLine("Issued    ${state.issued}")
                appendLine()
                appendLine("Revisions left · ${state.revisionsLeft} lifetime")
            }
            val send = Intent(Intent.ACTION_SEND).apply {
                type = "text/plain"
                putExtra(Intent.EXTRA_SUBJECT, "AIIMIN · ${state.osId}")
                putExtra(Intent.EXTRA_TEXT, body.trim())
            }
            context.startActivity(Intent.createChooser(send, "Share OS-ID"))
            viewModel.onShared()
        },
        onDismissNotice = viewModel::onDismissNotice,
        modifier = modifier,
    )
}

/**
 * **One job: own your identifier.**
 *
 * Industrial credential plate — not a form that ends in “Copy identifier.”
 * Tap / long-press the part number to copy; Share is the primary handoff.
 */
@OptIn(ExperimentalLayoutApi::class, androidx.compose.foundation.ExperimentalFoundationApi::class)
@Composable
fun OsIdScreen(
    state: OsIdUiState,
    onCopy: () -> Unit,
    onShare: () -> Unit,
    onDismissNotice: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val haptics = LocalHapticFeedback.current
    Column(
        modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(horizontal = AiiminTheme.space.page)
            .padding(bottom = AiiminTheme.space.s8 + AiiminTheme.space.s6),
    ) {
        ScreenHead(
            title = "Identifier · OS-ID",
            meta = if (state.isSeed) "SEED" else null,
        )

        state.notice?.let { msg ->
            LaunchedEffect(msg) {
                kotlinx.coroutines.delay(2_800)
                onDismissNotice()
            }
            Text(
                text = msg,
                style = AiiminTheme.type.bodySmall,
                color = AiiminTheme.colors.accent,
                modifier = Modifier
                    .padding(top = AiiminTheme.space.s3)
                    .fillMaxWidth()
                    .border(Hairline, AiiminTheme.colors.accent)
                    .background(AiiminTheme.colors.tint)
                    .padding(AiiminTheme.space.s3),
            )
        }

        // —— Credential plate ——
        Column(
            Modifier
                .fillMaxWidth()
                .padding(top = AiiminTheme.space.s6)
                .riseIn(40)
                .border(Hairline, AiiminTheme.colors.accent)
                .padding(AiiminTheme.space.s4),
        ) {
            Row(
                Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s3),
                ) {
                    BrandMark(size = 22.dp)
                    Text(
                        text = "CREDENTIAL",
                        style = AiiminTheme.type.cellLabel,
                        color = AiiminTheme.colors.accent,
                    )
                }
                Text(
                    text = "PART NO.",
                    style = AiiminTheme.type.mono(9.5),
                    color = AiiminTheme.colors.muted,
                )
            }

            Text(
                text = state.osId,
                style = AiiminTheme.type.mono.copy(
                    fontSize = 40.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 2.sp,
                    lineHeight = 44.sp,
                ),
                modifier = Modifier
                    .padding(top = AiiminTheme.space.s4)
                    .combinedClickable(
                        onClick = {
                            haptics.performHapticFeedback(HapticFeedbackType.TextHandleMove)
                            onCopy()
                        },
                        onLongClick = {
                            haptics.performHapticFeedback(HapticFeedbackType.LongPress)
                            onCopy()
                        },
                    ),
            )
            Text(
                text = "Tap part number to copy",
                style = AiiminTheme.type.mono(9.5),
                color = AiiminTheme.colors.muted,
                modifier = Modifier.padding(top = 4.dp),
            )

            if (!state.isValid) {
                Text(
                    text = "Fails specification — claim blocked until fixed.",
                    style = AiiminTheme.type.bodySmall,
                    color = AiiminTheme.colors.danger,
                    modifier = Modifier.padding(top = AiiminTheme.space.s3),
                )
            }

            Perforation(Modifier.padding(vertical = AiiminTheme.space.s4))

            Row(
                Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s3),
            ) {
                StampField("HOLDER", state.holder, Modifier.weight(1f))
                StampField("ISSUED", state.issued, Modifier.weight(1f))
            }
            Row(
                Modifier
                    .fillMaxWidth()
                    .padding(top = AiiminTheme.space.s3),
                horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s3),
            ) {
                StampField("MEMBER", state.memberNo, Modifier.weight(1f))
            }

            // Plan lives on the plate — not duplicated on Config profile row.
            Column(
                Modifier
                    .fillMaxWidth()
                    .padding(top = AiiminTheme.space.s3)
                    .border(Hairline, AiiminTheme.colors.hair)
                    .padding(AiiminTheme.space.s3),
            ) {
                Text(
                    text = "PLAN",
                    style = AiiminTheme.type.sectionLabel,
                    color = AiiminTheme.colors.muted,
                )
                Spacer(Modifier.height(AiiminTheme.space.s2))
                aiimin.designsystem.component.PlanStatusChip(
                    tier = state.tier,
                    onClick = {},
                    inline = false,
                    periodEndIso = state.periodEndIso,
                )
                Text(
                    text = state.tier.soul.description,
                    style = AiiminTheme.type.bodySmall.copy(fontSize = 11.5.sp, lineHeight = 16.sp),
                    color = AiiminTheme.colors.muted,
                    modifier = Modifier.padding(top = AiiminTheme.space.s2),
                )
            }
        }

        // —— Revision seal ——
        Row(
            Modifier
                .fillMaxWidth()
                .padding(top = AiiminTheme.space.s4)
                .riseIn(80)
                .border(Hairline, AiiminTheme.colors.hair)
                .padding(AiiminTheme.space.s3),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s3),
        ) {
            Box(
                Modifier
                    .size(44.dp)
                    .border(Hairline, AiiminTheme.colors.accent)
                    .background(AiiminTheme.colors.tint),
                contentAlignment = Alignment.Center,
            ) {
                Text(
                    text = state.revisionsLeft.toString(),
                    style = AiiminTheme.type.mono.copy(
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                    ),
                    color = AiiminTheme.colors.accent,
                )
            }
            Column(Modifier.weight(1f)) {
                Text(
                    text = "REVISION SEAL",
                    style = AiiminTheme.type.cellLabel,
                    color = AiiminTheme.colors.accent,
                )
                Text(
                    text = "One lifetime change. After that, the plate is fixed.",
                    style = AiiminTheme.type.bodySmall.copy(fontSize = 12.sp, lineHeight = 16.sp),
                    color = AiiminTheme.colors.muted,
                    modifier = Modifier.padding(top = 2.dp),
                )
            }
        }

        // —— Spec grid (passport fields, not a boring key/value dump) ——
        SectionRule(label = "Specification")
        SpecGrid(
            Modifier
                .padding(top = AiiminTheme.space.s3)
                .riseIn(120),
        )

        SectionRule(label = "Appears on")
        FlowRow(
            Modifier
                .fillMaxWidth()
                .padding(top = AiiminTheme.space.s3),
            horizontalArrangement = Arrangement.spacedBy(5.dp),
            verticalArrangement = Arrangement.spacedBy(5.dp),
        ) {
            APPEARS_ON.forEach { label ->
                Text(
                    text = label,
                    style = AiiminTheme.type.bodySmall,
                    modifier = Modifier
                        .border(Hairline, AiiminTheme.colors.hair)
                        .padding(horizontal = 9.dp, vertical = 5.dp),
                )
            }
        }

        // —— Actions: Share owns the handoff; Copy is quiet ——
        PrimaryButton(
            label = "Share plate",
            onClick = onShare,
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = AiiminTheme.space.s6)
                .riseIn(160),
        )
        GhostButton(
            label = "Copy to clipboard",
            onClick = onCopy,
            color = AiiminTheme.colors.muted,
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = AiiminTheme.space.s2),
        )
    }
}

@Composable
private fun StampField(label: String, value: String, modifier: Modifier = Modifier) {
    Column(
        modifier
            .border(Hairline, AiiminTheme.colors.hair)
            .padding(horizontal = AiiminTheme.space.s3, vertical = AiiminTheme.space.s2),
    ) {
        Text(text = label, style = AiiminTheme.type.cellLabel, color = AiiminTheme.colors.muted)
        Text(
            text = value,
            style = AiiminTheme.type.mono(12.0, FontWeight.Medium),
            modifier = Modifier.padding(top = 3.dp),
        )
    }
}

@Composable
private fun SpecGrid(modifier: Modifier = Modifier) {
    Column(modifier.fillMaxWidth()) {
        SPEC.chunked(2).forEachIndexed { rowIndex, pair ->
            if (rowIndex > 0) Spacer(Modifier.height(AiiminTheme.space.s2))
            Row(
                Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s2),
            ) {
                pair.forEach { (k, v) ->
                    Column(
                        Modifier
                            .weight(1f)
                            .border(Hairline, AiiminTheme.colors.hair)
                            .padding(AiiminTheme.space.s3),
                    ) {
                        Text(text = k, style = AiiminTheme.type.bodySmall, color = AiiminTheme.colors.muted)
                        Text(
                            text = v,
                            style = AiiminTheme.type.mono(12.0, FontWeight.Medium),
                            color = AiiminTheme.colors.accent,
                            modifier = Modifier.padding(top = 4.dp),
                        )
                    }
                }
                if (pair.size == 1) Spacer(Modifier.weight(1f))
            }
        }
    }
}

/** Ticket perforation — spaced ticks between plate body and stamp fields. */
@Composable
private fun Perforation(modifier: Modifier = Modifier) {
    Row(
        modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically,
    ) {
        repeat(17) {
            Box(
                Modifier
                    .width(6.dp)
                    .height(2.dp)
                    .background(AiiminTheme.colors.rule),
            )
        }
    }
}

@Preview(showBackground = true, backgroundColor = 0xFF15171A)
@Composable
private fun OsIdPreview() {
    AiiminTheme {
        OsIdScreen(
            state = OsIdUiState(
                osId = "AADI2004",
                holder = "A. UPADHYAY",
                issued = "14.03.25",
                memberNo = "#1204",
                tier = aiimin.core.model.SubscriptionTier.CORE,
                periodEndIso = null,
                revisionsLeft = 1,
                isValid = true,
                isSeed = true,
            ),
            onCopy = {},
            onShare = {},
            onDismissNotice = {},
        )
    }
}
