package `in`.aiimin.app.ui.auth

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import `in`.aiimin.app.ui.components.AiiminPrimaryButton
import `in`.aiimin.app.ui.components.AiiminTextButton
import `in`.aiimin.app.ui.theme.Accent
import `in`.aiimin.app.ui.theme.Figtree
import `in`.aiimin.app.ui.theme.Success

data class TierOption(
    val id: String,
    val name: String,
    val price: String,
    val blurb: String,
    val popular: Boolean = false,
)

private val tierOptions = listOf(
    TierOption("explore", "Explore", "Free", "Capture + glance"),
    TierOption("core", "Core", "₹29/mo", "Habits + journal sync"),
    TierOption("pro", "Pro", "₹49/mo", "Full Life OS mobile", popular = true),
    TierOption("elite", "Elite", "₹79/mo", "Everything + priority"),
)

@Composable
fun SignupTierForm(
    selected: String,
    onSelect: (String) -> Unit,
    onBack: () -> Unit,
    onContinue: () -> Unit,
) {
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Text(
            "You're on Elite till trial ends on desktop. This is awareness only — billing stays on web.",
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            fontFamily = Figtree,
        )
        tierOptions.forEach { tier ->
            val picked = selected == tier.id
            Column(
                Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(14.dp))
                    .background(if (picked) Accent.copy(0.1f) else MaterialTheme.colorScheme.surface)
                    .border(
                        width = if (picked) 2.dp else 1.dp,
                        color = if (picked) Accent else MaterialTheme.colorScheme.outline,
                        shape = RoundedCornerShape(14.dp),
                    )
                    .clickable { onSelect(tier.id) }
                    .padding(14.dp),
            ) {
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                    Text(tier.name, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    Text(tier.price, color = Accent, fontWeight = FontWeight.SemiBold)
                }
                Text(tier.blurb, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                if (tier.popular) {
                    Spacer(Modifier.height(6.dp))
                    Box(
                        Modifier
                            .background(Success.copy(0.15f), RoundedCornerShape(50))
                            .padding(horizontal = 8.dp, vertical = 2.dp),
                    ) {
                        Text("MOST POPULAR", fontSize = 10.sp, color = Success, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
        AiiminPrimaryButton(text = "Continue", onClick = onContinue, enabled = true)
        AiiminTextButton(text = "← Back", onClick = onBack)
    }
}

@Composable
fun SignupLifeArcForm(
    value: String,
    onValue: (String) -> Unit,
    loading: Boolean,
    onBack: () -> Unit,
    onSkip: () -> Unit,
    onContinue: () -> Unit,
) {
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Text(
            "Where is your story headed?",
            fontWeight = FontWeight.SemiBold,
            fontSize = 16.sp,
        )
        OutlinedTextField(
            value = value,
            onValueChange = onValue,
            modifier = Modifier.fillMaxWidth(),
            placeholder = { Text("Crack placements this year…") },
            minLines = 3,
        )
        Text(
            "Examples: Be healthier than last year · Ship my startup · Master placements",
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
        AiiminPrimaryButton(text = "Create account", onClick = onContinue, loading = loading, enabled = true)
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
            AiiminTextButton(text = "← Back", onClick = onBack)
            AiiminTextButton(text = "Skip", onClick = onSkip)
        }
    }
}

fun defaultSignupTier(): String = "pro"
