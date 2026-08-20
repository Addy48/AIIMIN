package aiimin.designsystem.component

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import aiimin.designsystem.theme.AiiminTheme
import aiimin.designsystem.theme.Hairline

/**
 * One parsed field, drawn as a correctable object.
 *
 * [included] `false` means the field was read but will not be written — an
 * outline instead of a fill. Tapping the label opens its editor; tapping the
 * mark drops or restores it. Both are one tap, which is what keeps a wrong parse
 * fixable in two (the trust surface's whole promise).
 */
@Composable
fun FieldChip(
    label: String,
    included: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    onToggle: (() -> Unit)? = null,
    selected: Boolean = false,
) {
    val colors = AiiminTheme.colors
    val ink = if (included) colors.onAccent else colors.muted
    val edge = when {
        selected -> colors.text
        included -> colors.accent
        else -> colors.rule
    }

    Row(
        modifier
            .background(if (included) colors.accent else colors.bg)
            .border(Hairline, edge),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        TapSurface(onClick = onClick, minTouchTarget = false) {
            Text(
                text = label,
                style = AiiminTheme.type.body.copy(
                    fontSize = 11.5.sp,
                    fontWeight = FontWeight.Medium,
                ),
                color = ink,
                modifier = Modifier.padding(start = 9.dp, end = 6.dp, top = 7.dp, bottom = 7.dp),
            )
        }
        if (onToggle != null) {
            TapSurface(onClick = onToggle, minTouchTarget = false) {
                Text(
                    text = if (included) "×" else "+",
                    style = AiiminTheme.type.body.copy(fontSize = 13.sp),
                    color = ink,
                    modifier = Modifier.padding(start = 3.dp, end = 9.dp, top = 7.dp, bottom = 7.dp),
                )
            }
        }
    }
}

@Preview(showBackground = true, backgroundColor = 0xFF15171A)
@Composable
private fun ChipPreview() {
    AiiminTheme {
        Row(
            Modifier.padding(20.dp),
            horizontalArrangement = Arrangement.spacedBy(5.dp),
        ) {
            FieldChip(label = "₹1,240", included = true, onClick = {}, onToggle = {})
            FieldChip(label = "Swiggy", included = false, onClick = {}, onToggle = {})
        }
    }
}
