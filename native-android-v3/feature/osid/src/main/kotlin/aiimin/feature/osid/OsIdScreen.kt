package aiimin.feature.osid

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import aiimin.core.model.OsIdRules
import aiimin.designsystem.component.BlueprintBox
import aiimin.designsystem.component.HairRule
import aiimin.designsystem.component.PrimaryButton
import aiimin.designsystem.component.ScreenHead
import aiimin.designsystem.component.SectionRule
import aiimin.designsystem.component.Text
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
        onDismissNotice = viewModel::onDismissNotice,
        modifier = modifier,
    )
}

/**
 * **One job: own your identifier.**
 *
 * Part-number card · specification · appears-on · copy. Claim / revision flows
 * land with Onboarding — this surface shows what you already hold.
 */
@OptIn(ExperimentalLayoutApi::class)
@Composable
fun OsIdScreen(
    state: OsIdUiState,
    onCopy: () -> Unit,
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
                modifier = Modifier.padding(top = AiiminTheme.space.s3),
            )
        }

        BlueprintBox(
            legend = "Part no.",
            accent = true,
            modifier = Modifier.padding(top = AiiminTheme.space.s6),
        ) {
            Text(
                text = state.osId,
                style = AiiminTheme.type.mono.copy(
                    fontSize = 36.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.5.sp,
                    lineHeight = 36.sp,
                ),
            )
            if (!state.isValid) {
                Text(
                    text = "This id fails the specification — claim is blocked until fixed.",
                    style = AiiminTheme.type.bodySmall,
                    color = AiiminTheme.colors.danger,
                    modifier = Modifier.padding(top = AiiminTheme.space.s3),
                )
            }
            Box(
                Modifier
                    .fillMaxWidth()
                    .padding(vertical = AiiminTheme.space.s4),
            ) {
                HairRule()
            }
            Row(Modifier.fillMaxWidth()) {
                MetaCell("HOLDER", state.holder, Modifier.weight(1f))
                MetaCell("ISSUED", state.issued, Modifier.weight(1f))
            }
            Row(Modifier.fillMaxWidth().padding(top = AiiminTheme.space.s2)) {
                MetaCell("MEMBER", state.memberNo, Modifier.weight(1f))
                MetaCell("TIER", state.tierLabel, Modifier.weight(1f))
            }
        }

        SectionRule(label = "Specification")
        SPEC.forEachIndexed { i, (k, v) ->
            Row(
                Modifier
                    .fillMaxWidth()
                    .padding(vertical = 9.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
            ) {
                Text(text = k, style = AiiminTheme.type.body)
                Text(
                    text = v,
                    style = AiiminTheme.type.mono(12.0),
                    color = AiiminTheme.colors.accent,
                )
            }
            if (i < SPEC.lastIndex) HairRule()
        }

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

        Text(
            text = "Revisions left · ${state.revisionsLeft} lifetime",
            style = AiiminTheme.type.mono(10.0),
            color = AiiminTheme.colors.muted,
            modifier = Modifier.padding(top = AiiminTheme.space.s4),
        )

        PrimaryButton(
            label = "Copy identifier",
            onClick = onCopy,
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = AiiminTheme.space.s6),
        )
    }
}

@Composable
private fun MetaCell(label: String, value: String, modifier: Modifier = Modifier) {
    Text(
        text = "$label · $value",
        style = AiiminTheme.type.mono(10.5),
        color = AiiminTheme.colors.muted,
        modifier = modifier,
    )
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
                tierLabel = "CORE",
                revisionsLeft = 1,
                isValid = true,
                isSeed = true,
            ),
            onCopy = {},
            onDismissNotice = {},
        )
    }
}
