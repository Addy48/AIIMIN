package `in`.aiimin.app.ui.brand

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import `in`.aiimin.app.R
import `in`.aiimin.app.ui.theme.FamiljenGrotesk

@Composable
fun AiiminLogoLockup(
    modifier: Modifier = Modifier,
    markSize: Dp = 44.dp,
    wordmarkColor: Color = Color.White,
    subtitle: String? = null,
    subtitleColor: Color = Color.White.copy(alpha = 0.82f),
    horizontal: Boolean = true,
) {
    if (horizontal) {
        Row(modifier = modifier, verticalAlignment = Alignment.CenterVertically) {
            Image(
                painter = painterResource(R.drawable.ic_aiimin_mark),
                contentDescription = "AIIMIN",
                modifier = Modifier.size(markSize),
            )
            Spacer(Modifier.width(12.dp))
            Column {
                Text(
                    "AIIMIN",
                    fontFamily = FamiljenGrotesk,
                    fontWeight = FontWeight.Black,
                    fontSize = (markSize.value * 0.5f).sp,
                    color = wordmarkColor,
                    letterSpacing = (-1).sp,
                )
                subtitle?.let {
                    Text(it, fontSize = 12.sp, color = subtitleColor, fontWeight = FontWeight.Medium)
                }
            }
        }
    } else {
        Column(modifier = modifier, horizontalAlignment = Alignment.CenterHorizontally) {
            Image(
                painter = painterResource(R.drawable.ic_aiimin_mark),
                contentDescription = "AIIMIN",
                modifier = Modifier.size(markSize),
            )
            Spacer(Modifier.height(10.dp))
            Text(
                "AIIMIN",
                fontFamily = FamiljenGrotesk,
                fontWeight = FontWeight.Black,
                fontSize = 22.sp,
                color = wordmarkColor,
                letterSpacing = (-1).sp,
            )
            subtitle?.let {
                Spacer(Modifier.height(4.dp))
                Text(it, fontSize = 12.sp, color = subtitleColor)
            }
        }
    }
}

@Composable
fun AuthHeroPills(modifier: Modifier = Modifier) {
    Row(modifier = modifier, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        listOf("Life OS", "Sync", "Focus").forEach { label ->
            Box(
                modifier = Modifier
                    .background(Color.Black.copy(alpha = 0.42f), RoundedCornerShape(99.dp))
                    .border(1.dp, Color.White.copy(alpha = 0.45f), RoundedCornerShape(99.dp))
                    .padding(horizontal = 14.dp, vertical = 8.dp),
            ) {
                Text(label, color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.Bold)
            }
        }
    }
}
