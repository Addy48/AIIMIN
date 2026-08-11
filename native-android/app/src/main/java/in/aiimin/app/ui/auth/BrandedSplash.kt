package `in`.aiimin.app.ui.auth

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import `in`.aiimin.app.R
import `in`.aiimin.app.ui.theme.Accent
import `in`.aiimin.app.ui.theme.FamiljenGrotesk
import `in`.aiimin.app.ui.theme.Figtree

@Composable
fun BrandedSplash() {
    Box(
        Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    listOf(Color(0xFFFF7A45), Accent, Color(0xFF9A3412)),
                ),
            ),
        contentAlignment = Alignment.Center,
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Image(
                painter = painterResource(R.drawable.ic_aiimin_mark),
                contentDescription = "AIIMIN",
                modifier = Modifier.size(96.dp),
            )
            Spacer(Modifier.height(16.dp))
            Text(
                "AIIMIN",
                fontFamily = FamiljenGrotesk,
                fontWeight = FontWeight.Black,
                fontSize = 32.sp,
                color = Color.White,
            )
            Spacer(Modifier.height(24.dp))
            CircularProgressIndicator(color = Color.White, strokeWidth = 2.dp)
            Spacer(Modifier.height(12.dp))
            Text("Loading your workspace…", color = Color.White.copy(0.85f), fontFamily = Figtree, fontSize = 13.sp)
        }
    }
}
