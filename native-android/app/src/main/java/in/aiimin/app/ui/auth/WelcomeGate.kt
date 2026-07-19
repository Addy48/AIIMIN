package `in`.aiimin.app.ui.auth

import android.content.Intent
import android.net.Uri
import androidx.browser.customtabs.CustomTabsIntent
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.EditNote
import androidx.compose.material.icons.outlined.Folder
import androidx.compose.material.icons.outlined.Sync
import androidx.compose.material3.Icon
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import `in`.aiimin.app.R
import `in`.aiimin.app.ui.components.AiiminPrimaryButton
import `in`.aiimin.app.ui.components.AiiminSecondaryButton
import `in`.aiimin.app.ui.theme.Accent
import `in`.aiimin.app.ui.theme.FamiljenGrotesk
import `in`.aiimin.app.ui.theme.Figtree

private val Ivory = Color(0xFFEDE4D3)

/** Top-app pattern: value prop first, thumb-zone CTAs at bottom. */
@Composable
fun WelcomeGate(
    onSignIn: () -> Unit,
    onSignUp: () -> Unit,
) {
    val context = LocalContext.current
    val heroGradient = Brush.verticalGradient(
        0f to Color(0xFFFF7A45),
        0.5f to Accent,
        1f to Color(0xFF9A3412),
    )

    Box(Modifier.fillMaxSize().background(Ivory)) {
        Column(Modifier.fillMaxSize()) {
            // Hero — emotional hook
            Box(
                Modifier
                    .fillMaxWidth()
                    .weight(1f)
                    .background(heroGradient)
                    .statusBarsPadding(),
            ) {
                Box(
                    Modifier.matchParentSize().background(
                        Brush.radialGradient(listOf(Color.White.copy(0.14f), Color.Transparent), radius = 480f),
                    ),
                )
                Column(
                    Modifier
                        .fillMaxSize()
                        .padding(horizontal = 28.dp, vertical = 32.dp),
                    verticalArrangement = Arrangement.SpaceBetween,
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.fillMaxWidth()) {
                        Image(
                            painter = painterResource(R.drawable.ic_aiimin_mark),
                            contentDescription = "AIIMIN",
                            modifier = Modifier.size(72.dp),
                        )
                        Spacer(Modifier.height(16.dp))
                        Text(
                            "AIIMIN",
                            fontFamily = FamiljenGrotesk,
                            fontWeight = FontWeight.Black,
                            fontSize = 36.sp,
                            color = Color.White,
                            letterSpacing = (-1).sp,
                        )
                        Text(
                            "Human Momentum",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Medium,
                            color = Color.White.copy(0.85f),
                            fontFamily = Figtree,
                        )
                    }

                    Column(
                        verticalArrangement = Arrangement.spacedBy(12.dp),
                        modifier = Modifier.fillMaxWidth(),
                    ) {
                        Text(
                            "Your Life OS\nin your pocket.",
                            fontFamily = FamiljenGrotesk,
                            fontWeight = FontWeight.ExtraBold,
                            fontSize = 32.sp,
                            lineHeight = 38.sp,
                            color = Color.White,
                            letterSpacing = (-0.5).sp,
                        )
                        Text(
                            "Same account as aiimin.in. Habits, journal, notes — in sync.",
                            fontSize = 15.sp,
                            lineHeight = 22.sp,
                            color = Color.White.copy(0.9f),
                            fontFamily = Figtree,
                        )
                        Spacer(Modifier.height(20.dp))
                        ValueRow(Icons.Outlined.EditNote, "Journal", "Voice + type, synced")
                        ValueRow(Icons.Outlined.Folder, "Vault", "Family docs & resumes")
                        ValueRow(Icons.Outlined.Sync, "Sync", "Same account as desktop")
                    }
                }
            }

            // Thumb-zone CTA deck (Revolut / Duolingo pattern)
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .graphicsLayer { translationY = -24f },
                shape = RoundedCornerShape(topStart = 32.dp, topEnd = 32.dp),
                color = Ivory,
                shadowElevation = 20.dp,
            ) {
                Column(
                    Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 24.dp, vertical = 28.dp)
                        .navigationBarsPadding(),
                    verticalArrangement = Arrangement.spacedBy(12.dp),
                ) {
                    AiiminPrimaryButton("Sign in", onClick = onSignIn)
                    AiiminSecondaryButton("Create free account", onClick = onSignUp)
                    Spacer(Modifier.height(4.dp))
                    OrDivider()
                    GoogleAuthButton {
                        val url = Uri.parse("https://aiimin.in/login")
                        runCatching {
                            CustomTabsIntent.Builder().setShowTitle(true).build().launchUrl(context, url)
                        }.onFailure {
                            context.startActivity(Intent(Intent.ACTION_VIEW, url))
                        }
                    }
                    Text(
                        "By continuing you agree to AIIMIN Terms & Privacy on aiimin.in",
                        fontSize = 11.sp,
                        color = Color(0xFF6B7280),
                        textAlign = TextAlign.Center,
                        modifier = Modifier.fillMaxWidth().padding(top = 4.dp),
                        fontFamily = Figtree,
                    )
                }
            }
        }
    }
}

@Composable
private fun ValueRow(icon: ImageVector, title: String, subtitle: String) {
    Row(
        Modifier
            .fillMaxWidth()
            .background(Color.Black.copy(0.22f), RoundedCornerShape(16.dp))
            .padding(horizontal = 14.dp, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        Icon(icon, null, tint = Color.White, modifier = Modifier.size(22.dp))
        Column {
            Text(title, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 14.sp, fontFamily = Figtree)
            Text(subtitle, color = Color.White.copy(0.78f), fontSize = 12.sp, fontFamily = Figtree)
        }
    }
}

@Composable
internal fun OrDivider() {
    Row(Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
        Box(Modifier.weight(1f).height(1.dp).background(Color(0xFFD1D5DB)))
        Text("or", Modifier.padding(horizontal = 12.dp), color = Color(0xFF14171A), fontSize = 12.sp, fontWeight = FontWeight.Bold, fontFamily = Figtree)
        Box(Modifier.weight(1f).height(1.dp).background(Color(0xFFD1D5DB)))
    }
}

@Composable
internal fun GoogleAuthButton(onClick: () -> Unit) {
    Row(
        Modifier
            .fillMaxWidth()
            .height(52.dp)
            .clip(RoundedCornerShape(14.dp))
            .background(Color.White)
            .border(1.dp, Color(0xFFD1D5DB), RoundedCornerShape(14.dp))
            .clickable(onClick = onClick),
        horizontalArrangement = Arrangement.Center,
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Image(painterResource(R.drawable.ic_google), null, Modifier.size(18.dp))
        Spacer(Modifier.size(10.dp))
        Text(
            "Continue with Google",
            fontWeight = FontWeight.SemiBold,
            color = Color(0xFF14171A),
            fontSize = 15.sp,
            fontFamily = Figtree,
        )
    }
}
