package aiimin.feature.me

import aiimin.core.data.app.PreferencesRepository
import aiimin.core.data.util.Dates
import aiimin.core.engine.Band
import aiimin.core.engine.BatteryMode
import aiimin.core.engine.BatteryState
import aiimin.core.engine.Direction
import aiimin.core.engine.Domain
import aiimin.core.engine.IntentionChange
import aiimin.core.engine.RolePreset
import aiimin.core.engine.Signals
import aiimin.core.engine.StreakMark
import aiimin.designsystem.component.AppButton
import aiimin.designsystem.component.AppIconButton
import aiimin.designsystem.component.AppSheet
import aiimin.designsystem.component.AppTextField
import aiimin.designsystem.component.Avatar
import aiimin.designsystem.component.ButtonKind
import aiimin.designsystem.component.Chevron
import aiimin.designsystem.component.CountingNumber
import aiimin.designsystem.component.EvidenceDot
import aiimin.designsystem.component.IconTile
import aiimin.designsystem.component.LargeHeader
import aiimin.designsystem.component.ListRow
import aiimin.designsystem.component.Meter
import aiimin.designsystem.component.Panel
import aiimin.designsystem.component.Pill
import aiimin.designsystem.component.PillRow
import aiimin.designsystem.component.ScoreArc
import aiimin.designsystem.component.SectionHeader
import aiimin.designsystem.component.Segmented
import aiimin.designsystem.component.Skeleton
import aiimin.designsystem.component.Sparkline
import aiimin.designsystem.component.Stepper
import aiimin.designsystem.component.SwitchRow
import aiimin.designsystem.component.Tag
import aiimin.designsystem.component.TopBar
import aiimin.designsystem.icon.AppIcons
import aiimin.designsystem.nav.LocalNavigator
import aiimin.designsystem.nav.LocalToaster
import aiimin.designsystem.nav.Route
import aiimin.designsystem.nav.Tab
import aiimin.designsystem.theme.Aiimin
import aiimin.designsystem.theme.Shapes
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import kotlin.math.roundToInt
import kotlinx.coroutines.launch

// =================================================================== Me

@Composable
fun MeScreen(vm: MeViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val life by vm.life.collectAsStateWithLifecycle()
    val s by vm.settings.collectAsStateWithLifecycle()
    val session by vm.session.collectAsStateWithLifecycle()
    val c = Aiimin.colors
    val settings = s ?: return
    LazyColumn(Modifier.fillMaxSize().background(c.base), contentPadding = PaddingValues(bottom = 120.dp)) {
        item {
            LargeHeader("Me") {
                AppIconButton(AppIcons.Gear, "Settings", { nav.open(Route.Settings) })
            }
        }
        item {
            Panel(Modifier.padding(horizontal = Aiimin.space.gutter, vertical = 4.dp), onClick = { nav.open(Route.Account) }) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Avatar(settings.name.ifBlank { "You" }, 0, size = 52.dp)
                    Spacer(Modifier.width(14.dp))
                    Column(Modifier.weight(1f)) {
                        Text(settings.name.ifBlank { "You" }, style = Aiimin.type.headline)
                        Text(if (session?.signedIn == true) "Synced with aiimin.in · ${session?.label}" else "On this phone only · tap to connect aiimin.in", style = Aiimin.type.caption)
                    }
                    Chevron()
                }
                if (!settings.hideXp) {
                    Spacer(Modifier.height(14.dp))
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text("Level ${settings.xp.level}", style = Aiimin.type.label, modifier = Modifier.width(72.dp))
                        Meter(settings.xp.xp.toFloat() / settings.xp.xpToNext, Modifier.weight(1f), color = c.violet)
                        Text("  ${settings.xp.xp}/${settings.xp.xpToNext}", style = Aiimin.type.caption.copy(fontFeatureSettings = "tnum"))
                    }
                    Text("XP is for finishing what you chose. It never feeds your score.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 4.dp))
                }
            }
        }
        item {
            val r = life?.readout
            Column(Modifier.padding(horizontal = Aiimin.space.gutter)) {
                SectionHeader("You")
                Panel(padding = PaddingValues(horizontal = 12.dp, vertical = 4.dp)) {
                    ListRow("Life Score", subtitle = when {
                        settings.hideScore -> "Number hidden"
                        r?.score == null -> "Calibrating"
                        else -> "${r.score} · ${r.band.label}"
                    }, leading = { IconTile(AppIcons.Pulse) }, trailing = { Chevron() }, onClick = { nav.open(Route.Score) })
                    ListRow("What counts for you", subtitle = "Your intentions, targets and weights", leading = { IconTile(AppIcons.Sliders) }, trailing = { Chevron() }, onClick = { nav.open(Route.Signals) })
                    ListRow("Discipline battery", subtitle = r?.battery?.let { "${it.value}% · ${it.mode.name.lowercase().replaceFirstChar(Char::uppercase)}" }, leading = { IconTile(AppIcons.BatteryHigh) }, trailing = { Chevron() }, onClick = { nav.open(Route.Battery) })
                    ListRow("Phone & body", subtitle = "Steps, screen time, sleep", leading = { IconTile(AppIcons.Phone) }, trailing = { Chevron() }, onClick = { nav.open(Route.PhoneDay) })
                }
            }
        }
        item {
            Column(Modifier.padding(horizontal = Aiimin.space.gutter)) {
                SectionHeader("Workspace")
                Panel(padding = PaddingValues(horizontal = 12.dp, vertical = 4.dp)) {
                    ListRow("Notes", leading = { IconTile(AppIcons.Note) }, trailing = { Chevron() }, onClick = { nav.open(Route.Notes) })
                    ListRow("Journal", subtitle = "Private and encrypted", leading = { IconTile(AppIcons.BookOpen) }, trailing = { Chevron() }, onClick = { nav.open(Route.Journal) })
                    ListRow("Calendar", leading = { IconTile(AppIcons.Calendar) }, trailing = { Chevron() }, onClick = { nav.open(Route.Calendar) })
                    ListRow("Focus", leading = { IconTile(AppIcons.Timer) }, trailing = { Chevron() }, onClick = { nav.open(Route.Focus()) })
                    ListRow("Daily minimums", leading = { IconTile(AppIcons.ListChecks) }, trailing = { Chevron() }, onClick = { nav.open(Route.Minimums) })
                    ListRow("Upcoming tasks", leading = { IconTile(AppIcons.Flag) }, trailing = { Chevron() }, onClick = { nav.open(Route.Upcoming) })
                }
            }
        }
        item {
            Column(Modifier.padding(horizontal = Aiimin.space.gutter)) {
                SectionHeader("Family & vault")
                Panel(padding = PaddingValues(horizontal = 12.dp, vertical = 4.dp)) {
                    ListRow("My vault", leading = { IconTile(AppIcons.Vault) }, trailing = { Chevron() }, onClick = { nav.tab(Tab.VAULT) })
                    ListRow("Family", leading = { IconTile(AppIcons.Users) }, trailing = { Chevron() }, onClick = { nav.open(Route.Family) })
                    ListRow("My emergency card", leading = { IconTile(AppIcons.FirstAid) }, trailing = { Chevron() }, onClick = { nav.open(Route.EmergencyCard("me")) })
                }
            }
        }
        item {
            Column(Modifier.padding(horizontal = Aiimin.space.gutter)) {
                SectionHeader("System")
                Panel(padding = PaddingValues(horizontal = 12.dp, vertical = 4.dp)) {
                    ListRow("Sensors & permissions", subtitle = "What the phone measures for you", leading = { IconTile(AppIcons.Footprints) }, trailing = { Chevron() }, onClick = { nav.open(Route.Sensors) })
                    ListRow("Assistant", subtitle = "What it may read, and smart mode", leading = { IconTile(AppIcons.Chat) }, trailing = { Chevron() }, onClick = { nav.open(Route.AiSettings) })
                    ListRow("Activity", subtitle = "Everything you did, from the log", leading = { IconTile(AppIcons.ClockCounter) }, trailing = { Chevron() }, onClick = { nav.open(Route.Activity) })
                    ListRow("Account & sync", leading = { IconTile(AppIcons.CloudCheck) }, trailing = { Chevron() }, onClick = { nav.open(Route.Account) })
                }
            }
        }
    }
}

// =================================================================== Score

@Composable
fun ScoreScreen(vm: MeViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val l by vm.life.collectAsStateWithLifecycle()
    val s by vm.settings.collectAsStateWithLifecycle()
    var range by remember { mutableIntStateOf(1) }
    var rules by remember { mutableStateOf(false) }
    val c = Aiimin.colors
    val life = l
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar("Life Score", onBack = { nav.back() }) { AppIconButton(AppIcons.Info, "How it's scored", { rules = true }) }
        if (life == null) {
            Skeleton(Modifier.padding(Aiimin.space.gutter).fillMaxWidth().height(260.dp))
            return@Column
        }
        val r = life.readout
        val hidden = s?.hideScore == true
        LazyColumn(contentPadding = PaddingValues(start = Aiimin.space.gutter, end = Aiimin.space.gutter, bottom = 40.dp)) {
            item {
                Box(Modifier.fillMaxWidth().padding(vertical = 8.dp), contentAlignment = Alignment.Center) {
                    ScoreArc(if (hidden) null else r.score?.toFloat(), size = 210.dp, color = bandColor(r.band))
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        when {
                            hidden -> Text("Hidden", style = Aiimin.type.headline.copy(color = c.textMuted))
                            r.score == null -> {
                                Text("Calibrating", style = Aiimin.type.headline)
                                Text("${r.calibrating.values.sorted().getOrNull(3) ?: 14} days to your first score", style = Aiimin.type.caption)
                            }
                            else -> {
                                CountingNumber(r.score!!, Aiimin.type.display)
                                Text(r.band.label, style = Aiimin.type.label.copy(color = bandColor(r.band)))
                            }
                        }
                    }
                }
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceEvenly) {
                    MiniFigure("${(r.verifiedShare28 * 100).roundToInt()}%", "verified")
                    MiniFigure("${r.streak.current}d", "streak")
                    MiniFigure("${r.battery.value}%", "battery")
                    MiniFigure(life.todayIndex?.roundToInt()?.toString() ?: "—", "today")
                }
                Text(
                    "Scored only against your own history and your own intentions. Nobody else sees it unless you share it.",
                    style = Aiimin.type.caption.copy(textAlign = TextAlign.Center), modifier = Modifier.fillMaxWidth().padding(top = 12.dp),
                )
            }
            if (r.score == null) {
                item {
                    SectionHeader("Calibrating")
                    Panel {
                        r.calibrating.entries.sortedBy { it.value }.forEach { (k, left) ->
                            Row(Modifier.padding(vertical = 5.dp), verticalAlignment = Alignment.CenterVertically) {
                                Text(life.intentions.def(k)?.name ?: k, style = Aiimin.type.body, modifier = Modifier.weight(1f))
                                Meter((14 - left) / 14f, Modifier.width(90.dp), color = c.textMuted)
                                Text("  ${14 - left}/14", style = Aiimin.type.caption.copy(fontFeatureSettings = "tnum"))
                            }
                        }
                    }
                }
            }
            if (life.nudges.isNotEmpty()) {
                item {
                    SectionHeader("Move it today")
                    life.nudges.forEach { n -> ListRow(n.label, trailing = { Text("+%.1f".format(n.gain), style = Aiimin.type.numberSmall.copy(color = c.done)) }) }
                }
            }
            item {
                SectionHeader("Why this score · last 7 days")
                val ups = r.contributors.filter { it.points > 0 }.take(3)
                val downs = r.contributors.filter { it.points < 0 }.sortedBy { it.points }.take(3)
                Panel {
                    if (ups.isEmpty() && downs.isEmpty()) Text("Not enough history yet.", style = Aiimin.type.caption)
                    ups.forEach { ContributionRow(life.intentions.def(it.signal)?.name ?: it.signal, it.points) }
                    downs.forEach { ContributionRow(life.intentions.def(it.signal)?.name ?: it.signal, it.points) }
                }
            }
            item {
                SectionHeader("Trend")
                Segmented(listOf("Week", "Month", "Quarter"), range, { range = it })
                Spacer(Modifier.height(10.dp))
                val n = listOf(7, 30, 90)[range]
                val pts = r.series.takeLast(n).map { it.score?.toFloat() }
                if (pts.count { it != null } >= 2) Sparkline(pts, height = 96.dp, color = bandColor(r.band)) else Text("The trend appears after a few days.", style = Aiimin.type.caption)
            }
            item {
                SectionHeader("By area")
                Panel {
                    Domain.BUILT_IN.forEachIndexed { i, d ->
                        val keys = life.intentions.cards.filter { (k, card) -> card.isScored && life.intentions.def(k)?.domain == d.key }.keys
                        if (keys.isEmpty()) return@forEachIndexed
                        val vals = keys.mapNotNull { k -> life.readout.today?.parts?.get(k)?.score }
                        Row(Modifier.padding(vertical = 6.dp), verticalAlignment = Alignment.CenterVertically) {
                            Text(d.name, style = Aiimin.type.body, modifier = Modifier.width(110.dp))
                            Meter(if (vals.isEmpty()) 0f else (vals.average() / 100).toFloat(), Modifier.weight(1f), color = c.domains[i])
                            Text(if (vals.isEmpty()) "  —" else "  ${vals.average().roundToInt()}", style = Aiimin.type.caption.copy(fontFeatureSettings = "tnum"), modifier = Modifier.width(36.dp))
                        }
                    }
                }
            }
            item { SectionHeader("Day ledger") }
            items(r.series.takeLast(14).reversed().zip(r.streak.marks.takeLast(14).reversed())) { (d, mark) ->
                Row(Modifier.padding(vertical = 8.dp), verticalAlignment = Alignment.CenterVertically) {
                    Text(Dates.short(d.snapshot.day), style = Aiimin.type.body, modifier = Modifier.weight(1f))
                    if (d.clipped) Tag("Clipped", color = c.warn)
                    Spacer(Modifier.width(8.dp))
                    Text(d.di?.let { "%.0f".format(it) } ?: "—", style = Aiimin.type.numberSmall, modifier = Modifier.width(36.dp), textAlign = TextAlign.End)
                    Spacer(Modifier.width(10.dp))
                    MarkDot(mark)
                }
            }
        }
    }
    if (rules) RulesSheet { rules = false }
}

@Composable
private fun MarkDot(m: StreakMark) {
    val c = Aiimin.colors
    val (col, label) = when (m) {
        StreakMark.KEPT -> c.done to "Kept"
        StreakMark.FROZEN -> c.domains[4] to "Freeze"
        StreakMark.REPAIRED -> c.violet to "Repaired"
        StreakMark.PAUSED -> c.textFaint to "Paused"
        StreakMark.MISSED -> c.raised to "Missed"
    }
    Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.width(78.dp)) {
        Box(Modifier.size(10.dp).clip(CircleShape).background(col))
        Spacer(Modifier.width(6.dp))
        Text(label, style = Aiimin.type.caption)
    }
}

@Composable
private fun ContributionRow(name: String, pts: Double) {
    val c = Aiimin.colors
    Row(Modifier.padding(vertical = 6.dp), verticalAlignment = Alignment.CenterVertically) {
        Text(name, style = Aiimin.type.body, modifier = Modifier.weight(1f))
        Text((if (pts > 0) "+" else "") + "%.1f".format(pts), style = Aiimin.type.numberSmall.copy(color = if (pts > 0) c.done else c.warn))
    }
}

@Composable
private fun MiniFigure(value: String, label: String) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(value, style = Aiimin.type.numberSmall)
        Text(label, style = Aiimin.type.caption)
    }
}

@Composable
internal fun bandColor(b: Band): Color = when (b) {
    Band.ELITE, Band.STRONG -> Aiimin.colors.done
    Band.GOOD -> Aiimin.colors.accent
    Band.STEADY -> Aiimin.colors.domains[4]
    Band.REBUILDING -> Aiimin.colors.warn
    Band.CALIBRATING -> Aiimin.colors.textFaint
}

@Composable
private fun RulesSheet(onDismiss: () -> Unit) {
    AppSheet(onDismiss, title = "How your score works") {
        listOf(
            "Personal" to "You decide what each signal means — more is better, less is better, a range, or just tracked.",
            "Against yourself" to "Half of each signal is hitting your target; half is beating your own normal. Easy targets can't lift the second half.",
            "Evidence" to "What the phone observed counts fully; a plain tap counts less. Taps alone can't reach the top.",
            "Fair pace" to "It rises no faster than your own variability allows and falls faster than it rises, so it stays honest.",
            "Never" to "Mood, creating things and other people's numbers never move it. It's never ranked against anyone.",
        ).forEach { (h, b) ->
            Text(h, style = Aiimin.type.bodyStrong, modifier = Modifier.padding(top = 8.dp))
            Text(b, style = Aiimin.type.caption)
        }
        Spacer(Modifier.height(8.dp))
        Row(verticalAlignment = Alignment.CenterVertically) {
            listOf('A' to "Observed", 'B' to "Corroborated", 'C' to "Claimed", 'D' to "Doubtful").forEach { (t, l) ->
                EvidenceDot(t)
                Text(" $l   ", style = Aiimin.type.caption)
            }
        }
    }
}

// =================================================================== Signals

@Composable
fun SignalsScreen(vm: MeViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val toaster = LocalToaster.current
    val scope = rememberCoroutineScope()
    val s by vm.settings.collectAsStateWithLifecycle()
    var presets by remember { mutableStateOf(false) }
    var custom by remember { mutableStateOf(false) }
    val c = Aiimin.colors
    val set = s?.intentions ?: return
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar("What counts for you", onBack = { nav.back() }) { AppIconButton(AppIcons.Plus, "Add your own signal", { custom = true }) }
        LazyColumn(contentPadding = PaddingValues(Aiimin.space.gutter)) {
            item {
                Text("Nothing is good or bad until you say what it means for your life. Harder targets apply now; easier ones wait 7 days.", style = Aiimin.type.caption)
                Spacer(Modifier.height(10.dp))
                ListRow("Start from a role", subtitle = RolePreset.byKey(set.role)?.name ?: "Balanced", leading = { IconTile(AppIcons.Compass) }, trailing = { Chevron() }, onClick = { presets = true })
            }
            Domain.BUILT_IN.forEach { d ->
                val keys = set.cards.keys.filter { set.def(it)?.domain == d.key }
                if (keys.isEmpty()) return@forEach
                item { SectionHeader(d.name) }
                items(keys) { k ->
                    val card = set.card(k)!!
                    val def = set.def(k)!!
                    val cal = vm.calibration(k)
                    ListRow(
                        def.name,
                        subtitle = listOfNotNull(
                            card.direction.label,
                            if (card.direction in setOf(Direction.MORE, Direction.LESS)) "target ${fmtTarget(card.target)} ${def.unit}" else if (card.direction == Direction.BAND) card.band?.let { "${fmtTarget(it.start)}–${fmtTarget(it.endInclusive)} ${def.unit}" } else null,
                            if (card.isScored && cal < 14) "calibrating $cal/14" else null,
                            card.pending?.let { "change on ${Dates.short(it.applyOn)}" },
                        ).joinToString(" · "),
                        leading = { EvidenceDot(def.defaultTier.name.first()) },
                        trailing = { Text(listOf("Off", "Low", "Normal", "High").getOrElse(card.weight) { "" }.takeIf { card.isScored } ?: "", style = Aiimin.type.caption) },
                        onClick = { nav.open(Route.Signal(k)) },
                    )
                }
            }
        }
    }
    if (presets) {
        AppSheet({ presets = false }, title = "Who are you here?", subtitle = "Pre-fills your cards. Nobody is ever scored against a preset.") {
            RolePreset.ALL.forEach { p ->
                ListRow(p.name, subtitle = p.description, maxSubtitleLines = 2, trailing = { if (set.role == p.key) Tag("Current") }, onClick = {
                    scope.launch { vm.applyPreset(p.key); toaster.show("Applied: ${p.name}"); presets = false }
                })
            }
        }
    }
    if (custom) {
        var name by remember { mutableStateOf("") }
        var unit by remember { mutableStateOf("") }
        var domain by remember { mutableStateOf("mind") }
        var target by remember { mutableStateOf("1") }
        AppSheet({ custom = false }, title = "Your own signal", subtitle = "Guitar minutes, client calls, glasses of water. It calibrates over 14 days.") {
            AppTextField(name, { name = it }, placeholder = "Name")
            Spacer(Modifier.height(8.dp))
            AppTextField(unit, { unit = it }, placeholder = "Unit (min, count, glasses)")
            Spacer(Modifier.height(8.dp))
            AppTextField(target, { target = it.filter { ch -> ch.isDigit() || ch == '.' } }, placeholder = "Daily target", keyboardType = KeyboardType.Decimal)
            PillRow { Domain.BUILT_IN.forEach { d -> Pill(d.name, domain == d.key, { domain = d.key }) } }
            Spacer(Modifier.height(12.dp))
            AppButton("Add", {
                scope.launch { vm.addCustom(name, unit, domain, target.toDoubleOrNull() ?: 1.0); custom = false; toaster.show("$name added") }
            }, Modifier.fillMaxWidth(), enabled = name.isNotBlank())
        }
    }
}

private fun fmtTarget(v: Double) = if (v == v.roundToInt().toDouble()) "%,d".format(v.roundToInt()) else "%.1f".format(v)

@Composable
fun SignalScreen(key: String, vm: MeViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val toaster = LocalToaster.current
    val scope = rememberCoroutineScope()
    val s by vm.settings.collectAsStateWithLifecycle()
    val l by vm.life.collectAsStateWithLifecycle()
    val c = Aiimin.colors
    val set = s?.intentions ?: return
    val card = set.card(key) ?: return
    val def = set.def(key) ?: return
    var dir by remember(key) { mutableStateOf(card.direction) }
    var target by remember(key) { mutableStateOf(card.target) }
    var weight by remember(key) { mutableIntStateOf(card.weight.coerceIn(1, 3)) }
    var why by remember(key) { mutableStateOf(card.why) }
    var ifThen by remember(key) { mutableStateOf(card.ifThen) }
    var suggestion by remember { mutableStateOf<Double?>(null) }
    var logValue by remember { mutableStateOf("") }
    LaunchedEffect(key) { suggestion = vm.suggestion(key) }
    val normal = vm.normal(key)
    val step = when {
        target >= 2000 -> 500.0
        target >= 200 -> 10.0
        target >= 20 -> 5.0
        else -> 1.0
    }
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar(def.name, onBack = { nav.back() })
        LazyColumn(Modifier.weight(1f), contentPadding = PaddingValues(Aiimin.space.gutter)) {
            item {
                Text(def.how, style = Aiimin.type.caption)
                Spacer(Modifier.height(10.dp))
                val hist = l?.history.orEmpty().takeLast(28).map { it.value(key)?.toFloat() }
                if (hist.count { it != null } >= 2) {
                    Panel {
                        Text("LAST 4 WEEKS", style = Aiimin.type.eyebrow)
                        Sparkline(hist, baseline = normal?.first?.toFloat(), height = 80.dp)
                        normal?.let { (med, p40, p60) -> Text("Your normal: ${fmtTarget(med)} ${def.unit} · typical range ${fmtTarget(p40)}–${fmtTarget(p60)}", style = Aiimin.type.caption) }
                    }
                } else {
                    Tag("Calibrating · ${vm.calibration(key)} of 14 days")
                }
            }
            item {
                SectionHeader("What this means for me")
                PillRow { Direction.entries.forEach { d -> Pill(d.label, dir == d, { dir = d }) } }
                if (dir in setOf(Direction.MORE, Direction.LESS, Direction.BAND)) {
                    SectionHeader(if (dir == Direction.LESS) "Limit" else "Target")
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text("${fmtTarget(target)} ${def.unit}", style = Aiimin.type.numberMedium, modifier = Modifier.weight(1f))
                        Stepper("", { target = (target - step).coerceAtLeast(0.0) }, { target += step })
                    }
                    suggestion?.let { sug ->
                        Text("Suggested from your last 9 days: ${fmtTarget(sug)}", style = Aiimin.type.caption.copy(color = c.accent), modifier = Modifier.padding(top = 4.dp).clip(Shapes.small).clickable { target = sug })
                    }
                    SectionHeader("Weight")
                    Segmented(listOf("Low", "Normal", "High"), weight - 1, { weight = it + 1 })
                }
                SectionHeader("Why it matters")
                AppTextField(why, { why = it }, placeholder = "One line, in your words")
                Spacer(Modifier.height(8.dp))
                AppTextField(ifThen, { ifThen = it }, placeholder = "If-then: “If it's 10 PM, the phone goes on the charger”", singleLine = false)
                Text("Writing a why and an if-then plan roughly doubles follow-through.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 4.dp))
            }
            if (def.key.startsWith("c_")) {
                item {
                    SectionHeader("Log today")
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        AppTextField(logValue, { logValue = it.filter { ch -> ch.isDigit() || ch == '.' } }, placeholder = def.unit, keyboardType = KeyboardType.Decimal, modifier = Modifier.weight(1f))
                        Spacer(Modifier.width(8.dp))
                        AppButton("Log", { scope.launch { logValue.toDoubleOrNull()?.let { vm.logCustom(key, it, false); toaster.show("Logged"); logValue = "" } } }, compact = true)
                    }
                }
            }
        }
        AppButton("Save", {
            scope.launch {
                val next = card.copy(direction = dir, target = target, weight = if (dir.scored) weight else 0, why = why, ifThen = ifThen,
                    band = if (dir == Direction.BAND) (target * 0.9)..(target * 1.15) else card.band)
                when (val r = vm.change(key, next)) {
                    is IntentionChange.Applied -> { toaster.show("Saved · applies now"); nav.back() }
                    is IntentionChange.Scheduled -> { toaster.show("Easier setting starts ${Dates.short(r.applyOn)} (7-day rule)"); nav.back() }
                    is IntentionChange.Rejected.BelowYourFloor -> toaster.show("Can't go below your recent normal (${fmtTarget(r.floor)})")
                    is IntentionChange.Rejected.AboveYourCeiling -> toaster.show("Limit can't be above your recent normal (${fmtTarget(r.ceiling)})")
                    IntentionChange.Rejected.NotRelevantLimit -> toaster.show("Two “not relevant” changes already this month")
                    IntentionChange.Rejected.Coverage -> toaster.show("Keep at least 4 scored signals across 3 areas")
                    IntentionChange.Rejected.UnknownSignal -> Unit
                }
            }
        }, Modifier.fillMaxWidth().padding(Aiimin.space.gutter))
    }
}

// =================================================================== Battery

@Composable
fun BatteryScreen(vm: MeViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val toaster = LocalToaster.current
    val scope = rememberCoroutineScope()
    val l by vm.life.collectAsStateWithLifecycle()
    val s by vm.settings.collectAsStateWithLifecycle()
    val c = Aiimin.colors
    val b = l?.battery ?: return
    val mode = s?.batteryMode ?: BatteryMode.GENTLE
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar("Discipline battery", onBack = { nav.back() })
        LazyColumn(contentPadding = PaddingValues(Aiimin.space.gutter)) {
            item {
                Text(if (b.state == BatteryState.COMEBACK) "Comeback ${b.comebackDays}/3" else "${b.value}%", style = Aiimin.type.display)
                Meter(b.value / 100f, color = when (b.state) { BatteryState.OK -> c.done; BatteryState.LOW -> c.warn; BatteryState.COMEBACK -> c.violet }, height = 10.dp)
                Spacer(Modifier.height(8.dp))
                Text(
                    when (b.state) {
                        BatteryState.OK -> "Kept minimums charge it; a kept day adds a bonus. Your first miss each week is free."
                        BatteryState.LOW -> "Low battery — minimums shrink to their tiny versions, tiny ones count double, and misses cost half. The lower it is, the easier it climbs."
                        BatteryState.COMEBACK -> "A rough patch, so let's restart small: keep any one minimum on 3 days and the battery returns to 40%. Nothing is deleted."
                    },
                    style = Aiimin.type.body,
                )
                Spacer(Modifier.height(4.dp))
                Text("Not part of your Life Score. Gains are always shown before losses.", style = Aiimin.type.caption)
            }
            item {
                SectionHeader("Mode")
                Segmented(listOf("Gentle", "Standard", "Hardcore"), mode.ordinal, { i ->
                    scope.launch {
                        when (val r = vm.setBattery(BatteryMode.entries[i])) {
                            is PreferencesRepository.Result.Wait -> toaster.show("You can change mode again on ${Dates.short(r.until)}")
                            PreferencesRepository.Result.Done -> toaster.show("Mode set")
                        }
                    }
                })
                Spacer(Modifier.height(10.dp))
                Panel {
                    val rows = when (mode) {
                        BatteryMode.GENTLE -> listOf("Misses cost 2, at most 6 a day", "No zero state", "Two rest days a week plus pause", "Unlimited streak repair")
                        BatteryMode.STANDARD -> listOf("Misses cost 3, at most 10 a day", "At zero, a 3-day comeback", "One rest day a week plus pause", "One repair per break")
                        BatteryMode.HARDCORE -> listOf("Misses cost 5, at most 20 a day", "No free weekly miss, no freezes", "Declared illness only", "No streak repair")
                    }
                    rows.forEach { Text("· $it", style = Aiimin.type.body, modifier = Modifier.padding(vertical = 3.dp)) }
                }
                Text("Mode can change once every 7 days. If things get rough, the app will offer Gentle — it never switches for you.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 8.dp))
            }
            item {
                SectionHeader("Streak")
                val st = l!!.readout.streak
                Row(horizontalArrangement = Arrangement.SpaceEvenly, modifier = Modifier.fillMaxWidth()) {
                    MiniFigure("${st.current}", "current")
                    MiniFigure("${st.longest}", "longest")
                    MiniFigure("${st.totalKept}", "days kept")
                    MiniFigure("${st.freezesBanked}", "freezes")
                }
                Text("A freeze is earned every 7 kept days (bank up to 2). Never sold. Two missed days in a row can't both be covered.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 8.dp))
            }
        }
    }
}
