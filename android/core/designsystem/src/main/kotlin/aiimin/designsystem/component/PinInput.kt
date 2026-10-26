package aiimin.designsystem.component

import aiimin.designsystem.theme.Aiimin
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp

/** Six square boxes over one hidden field: paste fills all six, the numeric keyboard stays up. */
@Composable
fun PinInput(value: String, onChange: (String) -> Unit, modifier: Modifier = Modifier, autoFocus: Boolean = false) {
    val c = Aiimin.colors
    val focus = remember { FocusRequester() }
    LaunchedEffect(Unit) { if (autoFocus) runCatching { focus.requestFocus() } }
    Box(modifier.fillMaxWidth().height(56.dp).clickable(indication = null, interactionSource = remember { androidx.compose.foundation.interaction.MutableInteractionSource() }) { runCatching { focus.requestFocus() } }) {
        BasicTextField(
            value = value,
            onValueChange = { onChange(it.filter(Char::isDigit).take(6)) },
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.NumberPassword),
            visualTransformation = PasswordVisualTransformation(),
            cursorBrush = SolidColor(Color.Transparent),
            textStyle = Aiimin.type.body.copy(color = Color.Transparent),
            modifier = Modifier.fillMaxSize().focusRequester(focus),
            decorationBox = {
                Row(Modifier.fillMaxSize(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    repeat(6) { i ->
                        val on = i == value.length
                        Box(
                            Modifier.weight(1f).fillMaxSize().clip(RoundedCornerShape(8.dp)).background(c.surface)
                                .border(if (on) 1.5.dp else 1.dp, if (on) c.text else c.borderStrong, RoundedCornerShape(8.dp)),
                            contentAlignment = Alignment.Center,
                        ) {
                            if (i < value.length) Box(Modifier.size(12.dp).clip(androidx.compose.foundation.shape.CircleShape).background(c.text))
                        }
                    }
                }
            },
        )
    }
}
