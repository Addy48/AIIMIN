package aiimin.designsystem.component

import aiimin.core.engine.raahi.RaahiPose
import aiimin.designsystem.R
import aiimin.designsystem.icon.AppIcons
import aiimin.designsystem.theme.Aiimin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp

/** The areas that carry Raahi's "What can I do here?" guide (PRD 31.2 item 14). */
enum class RaahiArea(
    val pose: RaahiPose,
    /** Raahi's art never shows on money or security screens (brand rule), so those guides are words only. */
    val showsArt: Boolean,
    internal val tips: List<Int>,
) {
    MONEY(RaahiPose.POINTING, false, listOf(R.string.raahi_guide_money_1, R.string.raahi_guide_money_2, R.string.raahi_guide_money_3)),
    VAULT(RaahiPose.POINTING, false, listOf(R.string.raahi_guide_vault_1, R.string.raahi_guide_vault_2, R.string.raahi_guide_vault_3)),
    NOTES(RaahiPose.SATCHEL_OPEN, true, listOf(R.string.raahi_guide_notes_1, R.string.raahi_guide_notes_2, R.string.raahi_guide_notes_3)),
    PATTERNS(RaahiPose.NOTICING, true, listOf(R.string.raahi_guide_patterns_1, R.string.raahi_guide_patterns_2, R.string.raahi_guide_patterns_3)),
    GOALS(RaahiPose.POINTING, true, listOf(R.string.raahi_guide_goals_1, R.string.raahi_guide_goals_2, R.string.raahi_guide_goals_3)),
}

/** A "?" button for a header. Opens Raahi's short guide for the area. */
@Composable
fun RaahiGuideButton(area: RaahiArea) {
    var open by rememberSaveable { mutableStateOf(false) }
    AppIconButton(AppIcons.Question, stringResource(R.string.raahi_guide_title), { open = true })
    if (open) AppSheet(onDismiss = { open = false }, title = stringResource(R.string.raahi_guide_title)) {
        Row(verticalAlignment = Alignment.Top) {
            if (area.showsArt) {
                Raahi(area.pose, RaahiSize.CARD)
                Spacer(Modifier.width(16.dp))
            }
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                area.tips.forEach { Text(stringResource(it), style = Aiimin.type.body) }
            }
        }
        Spacer(Modifier.height(8.dp))
    }
}
