package aiimin.feature.me

import aiimin.core.engine.raahi.RaahiMode
import aiimin.core.engine.raahi.RaahiPose
import aiimin.designsystem.component.BulletList
import aiimin.designsystem.component.Chevron
import aiimin.designsystem.component.IconTile
import aiimin.designsystem.component.ListRow
import aiimin.designsystem.component.Raahi
import aiimin.designsystem.component.RaahiModePicker
import aiimin.designsystem.component.RaahiSize
import aiimin.designsystem.component.SectionHeader
import aiimin.designsystem.component.TopBar
import aiimin.designsystem.icon.AppIcons
import aiimin.designsystem.nav.LocalNavigator
import aiimin.designsystem.nav.Route
import aiimin.designsystem.theme.Aiimin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle

/** Settings › Raahi (PRD 1.1): how chatty Raahi is. Quiet is the default. */
@Composable
fun RaahiSettingsScreen(vm: ProfileViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val c = Aiimin.colors
    val s by vm.settings.collectAsStateWithLifecycle()
    val st = s ?: return
    val mode = RaahiMode.of(st.raahiMode)
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar("Raahi", onBack = { nav.back() })
        Column(Modifier.weight(1f).verticalScroll(rememberScrollState()).padding(horizontal = Aiimin.space.gutter)) {
            Row(Modifier.fillMaxWidth().padding(top = 8.dp), verticalAlignment = Alignment.CenterVertically) {
                Raahi(RaahiPose.IDLE, RaahiSize.CARD)
                if (mode != RaahiMode.OFF) Spacer(Modifier.width(12.dp))
                Text("How much should I talk? Quiet is my default.", style = Aiimin.type.bodyStrong, modifier = Modifier.weight(1f))
            }
            SectionHeader("How chatty")
            RaahiModePicker(mode, { m -> vm.save { it.copy(raahiMode = m.name) } })
            SectionHeader("Good to know")
            BulletList(
                listOf(
                    "Raahi sends no notifications of its own.",
                    "Reduce motion, or Remove animations in Android, keeps Raahi still.",
                    "Money, security and emergency messages are signed AIIMIN, never Raahi.",
                ),
            )
            ListRow(
                "About Raahi", subtitle = "Who Raahi is and what it can see", leading = { IconTile(AppIcons.Info) }, trailing = { Chevron() },
                opens = Route.AboutRaahi, onClick = { nav.open(Route.AboutRaahi) }, modifier = Modifier.padding(top = 12.dp),
            )
            Spacer(Modifier.height(32.dp))
        }
    }
}

/** About Raahi (PRD 1.1, 13.1): who Raahi is, stated plainly as an AI, and what it can see. */
@Composable
fun AboutRaahiScreen() {
    val nav = LocalNavigator.current
    val c = Aiimin.colors
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar("About Raahi", onBack = { nav.back() })
        Column(Modifier.weight(1f).verticalScroll(rememberScrollState()).padding(horizontal = Aiimin.space.gutter)) {
            Raahi(RaahiPose.WAVING, RaahiSize.HERO, Modifier.align(Alignment.CenterHorizontally).padding(top = 8.dp))
            Text("Raahi", style = Aiimin.type.headline, modifier = Modifier.padding(top = 12.dp))
            Text(
                "Raahi is the traveller who walks your day with you. It cannot do your day for you, and it will not hurry you.",
                style = Aiimin.type.body, modifier = Modifier.padding(top = 4.dp),
            )
            SectionHeader("What Raahi is")
            BulletList(
                listOf(
                    "Raahi is an AI and can be wrong. Check the numbers.",
                    "Greetings and short lines are fixed words we wrote. They work offline and send nothing.",
                    "In Pour, Raahi only listens. It does not answer, advise or interpret.",
                    "AIIMIN is not a medical service.",
                ),
            )
            SectionHeader("What Raahi can see")
            BulletList(
                listOf(
                    "Its lines use only your first name and how many minimums you set. Both stay on this phone.",
                    "A friendly face changes nothing about privacy. Nothing leaves the phone without your tap.",
                ),
            )
            ListRow(
                "How chatty Raahi is", subtitle = "Full, Quiet or Off", leading = { IconTile(AppIcons.ChatCircleText) }, trailing = { Chevron() },
                opens = Route.RaahiSettings, onClick = { nav.open(Route.RaahiSettings) }, modifier = Modifier.padding(top = 12.dp),
            )
            Spacer(Modifier.height(32.dp))
        }
    }
}
