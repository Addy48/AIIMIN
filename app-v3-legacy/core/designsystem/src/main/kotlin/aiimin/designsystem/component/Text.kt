package aiimin.designsystem.component

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import aiimin.designsystem.theme.AiiminTheme
import androidx.compose.material3.Text as MaterialText

/**
 * Text that defaults to the Drafting Table body face and ink, so no screen has
 * to restate them. Use this, not `androidx.compose.material3.Text`.
 */
@Composable
fun Text(
    text: String,
    modifier: Modifier = Modifier,
    style: TextStyle = AiiminTheme.type.body,
    color: Color = AiiminTheme.colors.text,
    textAlign: TextAlign? = null,
    maxLines: Int = Int.MAX_VALUE,
    overflow: TextOverflow = TextOverflow.Clip,
) {
    MaterialText(
        text = text,
        modifier = modifier,
        style = style,
        color = color,
        textAlign = textAlign,
        maxLines = maxLines,
        overflow = overflow,
    )
}
