package aiimin.app

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.android.tools.screenshot.PreviewTest
import aiimin.app.navigation.Tab
import aiimin.app.ui.AiiminShellContent
import aiimin.feature.today.TodayScreen
import aiimin.core.data.DayState
import aiimin.designsystem.brand.BrandMark
import aiimin.designsystem.component.DraftedBox
import aiimin.designsystem.component.EmptyState
import aiimin.designsystem.component.GhostButton
import aiimin.designsystem.component.PrimaryButton
import aiimin.designsystem.component.ScreenHead
import aiimin.designsystem.component.SectionRule
import aiimin.designsystem.component.Text
import aiimin.designsystem.icon.AiiminGlyph
import aiimin.designsystem.icon.AiiminIcon
import aiimin.designsystem.theme.AiiminTheme

/**
 * Render proof, run on the JVM: `./gradlew :app:validateDebugScreenshotTest`
 * compares these against the PNGs recorded by `updateDebugScreenshotTest`.
 *
 * Every surface gets a pair here — dark and the light Industry sheet — so a
 * palette or type regression fails the build instead of reaching the phone.
 */
private const val PHONE_W = 390
private const val PHONE_H = 844

@PreviewTest
@Preview(name = "Shell · dark", widthDp = PHONE_W, heightDp = PHONE_H)
@Composable
fun ShellDark() {
    AiiminTheme(darkTheme = true) { Shell() }
}

@PreviewTest
@Preview(name = "Shell · light", widthDp = PHONE_W, heightDp = PHONE_H)
@Composable
fun ShellLight() {
    AiiminTheme(darkTheme = false) { Shell() }
}

@PreviewTest
@Preview(name = "Specimen · dark", widthDp = PHONE_W, heightDp = PHONE_H)
@Composable
fun SpecimenDark() {
    AiiminTheme(darkTheme = true) { Specimen() }
}

@PreviewTest
@Preview(name = "Specimen · light", widthDp = PHONE_W, heightDp = PHONE_H)
@Composable
fun SpecimenLight() {
    AiiminTheme(darkTheme = false) { Specimen() }
}

/** The shell as it draws: the Day surface above, the five-tab bar below. */
@Composable
private fun Shell() {
    AiiminShellContent(currentTab = Tab.DAY, onSelectTab = {}) {
        TodayScreen(
            state = DayState.seed(),
            onOpenCapture = {},
            onToggle = {},
            onMicroTaskChange = {},
        )
    }
}

/** The whole design system on one sheet — the thing to look at when a token moves. */
@Composable
private fun Specimen() {
    Column(
        Modifier
            .fillMaxSize()
            .background(AiiminTheme.colors.bg)
            .padding(horizontal = AiiminTheme.space.page, vertical = AiiminTheme.space.s6),
        verticalArrangement = Arrangement.spacedBy(AiiminTheme.space.s3),
    ) {
        Row(
            horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s3),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            BrandMark(size = 28.dp)
            Text(text = "AIIMIN", style = AiiminTheme.type.chrome)
            Text(
                text = "DRAFTING TABLE",
                style = AiiminTheme.type.mono,
                color = AiiminTheme.colors.muted,
            )
        }

        ScreenHead(title = "Specimen", meta = "02.08.26 TUE")

        SectionRule(label = "Type", value = "3 faces")
        Text(text = "Barlow body — the reading face, 13sp with a 1.5 line.")
        Text(text = "1,240 · 78 · 09:37", style = AiiminTheme.type.mono(16.0))
        Text(text = "78", style = AiiminTheme.type.figure, color = AiiminTheme.colors.text)

        SectionRule(label = "Objects")
        DraftedBox(Modifier.padding(top = AiiminTheme.space.s3)) {
            Text(
                text = "Log anything — AIIMIN sorts it. 'paid 240 metro, felt sharp 8/10'",
                style = AiiminTheme.type.bodySmall,
                color = AiiminTheme.colors.muted,
            )
        }
        Row(
            horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s3),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            PrimaryButton(label = "Settle", onClick = {})
            GhostButton(label = "Drift", onClick = {})
        }

        SectionRule(label = "Glyphs")
        Row(
            horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s6),
            modifier = Modifier.padding(top = AiiminTheme.space.s3),
        ) {
            AiiminIcon.entries.forEach { icon ->
                AiiminGlyph(icon = icon, color = AiiminTheme.colors.text, size = 22.dp)
            }
        }

        EmptyState(
            label = "Nothing held",
            message = "Captures you drift instead of settling wait here until you decide.",
        )
    }
}
