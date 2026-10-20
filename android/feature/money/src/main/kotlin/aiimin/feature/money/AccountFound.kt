package aiimin.feature.money

import aiimin.core.data.money.SeenAccount
import aiimin.designsystem.component.AppButton
import aiimin.designsystem.component.ButtonKind
import aiimin.designsystem.component.SurfaceCard
import aiimin.designsystem.theme.Aiimin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

/**
 * Owner, 20 Oct: a masked account a bank message named that is not in Accounts yet. "Add" fills in the bank
 * and last four (or links a same-bank account that has no number); "Not mine" hides the number for good.
 */
@Composable
internal fun AccountFoundCard(s: SeenAccount, linkTo: String?, onAdd: () -> Unit, onNotMine: () -> Unit, modifier: Modifier = Modifier) {
    SurfaceCard(modifier) {
        Text("Found in your bank messages", style = Aiimin.type.eyebrow)
        Spacer(Modifier.height(8.dp))
        Text(s.label, style = Aiimin.type.headline)
        Text(
            (if (s.alerts == 1) "1 alert" else "${s.alerts} alerts") + " from this account. " +
                (if (linkTo != null) "Link it to $linkTo so its payments file there." else "Add it so its payments file under it."),
            style = Aiimin.type.caption, modifier = Modifier,
        )
        Spacer(Modifier.height(12.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            AppButton(if (linkTo != null) "Link account" else "Add account", onAdd, compact = true)
            AppButton("Not mine", onNotMine, kind = ButtonKind.SECONDARY, compact = true)
        }
    }
}
