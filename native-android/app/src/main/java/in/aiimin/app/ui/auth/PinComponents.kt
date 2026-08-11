package `in`.aiimin.app.ui.auth

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import `in`.aiimin.app.ui.theme.Accent

@Composable
fun PinDots(
    length: Int = 6,
    value: String,
    shake: Boolean,
    modifier: Modifier = Modifier,
) {
    val onSurface = MaterialTheme.colorScheme.onSurface
    val outline = MaterialTheme.colorScheme.outline
    val error = MaterialTheme.colorScheme.error
    Row(
        modifier = modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.Center,
    ) {
        repeat(length) { i ->
            val filled = i < value.length
            val active = !filled && i == value.length && value.length < length
            val scale by animateFloatAsState(
                when {
                    filled -> 1.06f
                    active -> 1.03f
                    else -> 1f
                },
                label = "pin-dot-$i",
            )
            Box(
                modifier = Modifier
                    .padding(horizontal = 8.dp)
                    .size(18.dp)
                    .scale(scale)
                    .clip(CircleShape)
                    .background(
                        when {
                            shake && filled -> error
                            filled -> onSurface
                            else -> Color.Transparent
                        },
                    )
                    .border(
                        width = if (active) 2.dp else 1.5.dp,
                        color = when {
                            shake && filled -> error
                            active -> Accent
                            filled -> onSurface
                            else -> outline
                        },
                        shape = CircleShape,
                    ),
            )
        }
    }
}

@Composable
fun PinNumpad(
    onDigit: (Char) -> Unit,
    onDelete: () -> Unit,
    onClear: () -> Unit,
    enabled: Boolean = true,
    modifier: Modifier = Modifier,
) {
    val haptics = LocalHapticFeedback.current
    val surface = MaterialTheme.colorScheme.surface
    val surfaceVariant = MaterialTheme.colorScheme.surfaceVariant
    val onSurface = MaterialTheme.colorScheme.onSurface
    val muted = MaterialTheme.colorScheme.onSurfaceVariant
    val outline = MaterialTheme.colorScheme.outline
    val keys = listOf(
        listOf("1", "2", "3"),
        listOf("4", "5", "6"),
        listOf("7", "8", "9"),
        listOf("Clear", "0", "Del"),
    )
    Column(
        modifier = modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(10.dp),
    ) {
        keys.forEach { row ->
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp),
            ) {
                row.forEach { key ->
                    val isAction = key == "Clear" || key == "Del"
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .aspectRatio(1.35f)
                            .clip(RoundedCornerShape(16.dp))
                            .background(if (isAction) surfaceVariant else surface)
                            .border(1.dp, outline, RoundedCornerShape(16.dp))
                            .clickable(
                                enabled = enabled,
                                indication = null,
                                interactionSource = remember { MutableInteractionSource() },
                            ) {
                                haptics.performHapticFeedback(HapticFeedbackType.TextHandleMove)
                                when (key) {
                                    "Del" -> onDelete()
                                    "Clear" -> onClear()
                                    else -> onDigit(key[0])
                                }
                            },
                        contentAlignment = Alignment.Center,
                    ) {
                        Text(
                            text = key,
                            fontSize = if (isAction) 14.sp else 22.sp,
                            fontWeight = if (isAction) FontWeight.SemiBold else FontWeight.Medium,
                            color = if (isAction) muted else onSurface,
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun AuthStepDots(current: Int, total: Int, modifier: Modifier = Modifier) {
    Row(
        modifier = modifier,
        horizontalArrangement = Arrangement.Center,
        verticalAlignment = Alignment.CenterVertically,
    ) {
        repeat(total) { i ->
            val n = i + 1
            val done = n < current
            val active = n == current
            Box(
                modifier = Modifier
                    .size(28.dp)
                    .clip(CircleShape)
                    .background(
                        when {
                            done -> Accent
                            active -> MaterialTheme.colorScheme.surface
                            else -> Color.Transparent
                        },
                    )
                    .border(
                        2.dp,
                        when {
                            done || active -> Accent
                            else -> MaterialTheme.colorScheme.outline
                        },
                        CircleShape,
                    ),
                contentAlignment = Alignment.Center,
            ) {
                Text(
                    text = if (done) "✓" else "$n",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = when {
                        done -> Color.White
                        active -> Accent
                        else -> MaterialTheme.colorScheme.onSurfaceVariant
                    },
                )
            }
            if (n < total) {
                Spacer(Modifier.width(6.dp))
                Box(
                    Modifier
                        .width(28.dp)
                        .height(2.dp)
                        .background(if (n < current) Accent else MaterialTheme.colorScheme.outline),
                )
                Spacer(Modifier.width(6.dp))
            }
        }
    }
}
