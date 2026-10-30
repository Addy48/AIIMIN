package aiimin.feature.me

import aiimin.designsystem.component.Hairline
import aiimin.designsystem.component.LinePoint
import aiimin.designsystem.component.ScrubLineChart
import androidx.compose.ui.unit.sp
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.shape.RoundedCornerShape
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
import aiimin.designsystem.component.RootActions
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
import androidx.compose.foundation.layout.widthIn
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

// =================================================================== Library

@Composable
fun LibraryScreen(vm: MeViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val life by vm.life.collectAsStateWithLifecycle()
    val (noteCount, pinned) = vm.noteCounts.collectAsStateWithLifecycle().value
    val events by vm.eventsThisWeek.collectAsStateWithLifecycle()
    val c = Aiimin.colors
    val r = life?.readout
    LazyColumn(Modifier.fillMaxSize().background(c.base), contentPadding = PaddingValues(bottom = 180.dp)) {
        item { LargeHeader("Library") { RootActions(0) } }
        item {
            Row(
                Modifier.padding(horizontal = Aiimin.space.gutter, vertical = 4.dp).fillMaxWidth().clip(RoundedCornerShape(10.dp))
                    .background(c.raised).clickable { nav.open(Route.Search) }.heightIn(min = 48.dp).padding(horizontal = 16.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                androidx.compose.material3.Icon(AppIcons.Search, null, tint = c.textMuted, modifier = Modifier.size(20.dp))
                Spacer(Modifier.width(12.dp))
                Text("Search papers, notes and features", style = Aiimin.type.body.copy(color = c.textMuted), maxLines = 1, overflow = androidx.compose.ui.text.style.TextOverflow.Ellipsis)
            }
        }
        meGroup("Papers", listOf(
            MeLink(AppIcons.FileText, "Documents", "Your vault") { nav.open(Route.Vault) },
            MeLink(AppIcons.Users, "Family", "People and their papers") { nav.open(Route.Family) },
            MeLink(AppIcons.FirstAid, "My emergency card", "Blood group, allergies, contacts") { nav.open(Route.EmergencyCard("me")) },
        ))
        meGroup("Writing", listOf(
            MeLink(AppIcons.Note, "Notes", if (noteCount == 0) null else "$noteCount ${if (noteCount == 1) "note" else "notes"}${if (pinned > 0) " · $pinned pinned" else ""}") { nav.open(Route.Notes) },
            MeLink(AppIcons.Drop, "Pour", "Private writing · on this phone") { nav.open(Route.Journal) },
        ))
        meGroup("Plans", listOf(
            MeLink(AppIcons.Calendar, "Calendar", "$events ${if (events == 1) "event" else "events"} this week") { nav.open(Route.Calendar) },
            MeLink(AppIcons.ListChecks, "Upcoming tasks", null) { nav.open(Route.Upcoming) },
            MeLink(AppIcons.Flag, "Goals", null) { nav.open(Route.Goals) },
            MeLink(AppIcons.CheckSquare, "Daily minimums", null) { nav.open(Route.Minimums) },
            MeLink(AppIcons.Timer, "Focus", null) { nav.open(Route.Focus()) },
            MeLink(AppIcons.ListChecks, "Weekly review", "Sundays, or any time") { nav.open(Route.WeeklyReview) },
        ))
        meGroup("Insights", listOf(
            MeLink(AppIcons.Pulse, "Life Score", r?.score?.let { "$it · ${r.band.label}" } ?: "Calibrating") { nav.open(Route.Score) },
            MeLink(AppIcons.Sparkle, "Patterns", "What goes with what") { nav.open(Route.Patterns) },
            MeLink(AppIcons.Phone, "Phone day", "Screen time and unlocks") { nav.open(Route.PhoneDay) },
            MeLink(AppIcons.Footprints, "Body", "Steps, sleep, heart rate") { nav.open(Route.Body) },
            MeLink(AppIcons.ClockCounter, "Activity", "Everything you did, from the log") { nav.open(Route.Activity) },
            MeLink(AppIcons.Sliders, "What counts for you", "Intentions, targets, weights") { nav.open(Route.Signals) },
            MeLink(AppIcons.BatteryHigh, "Discipline battery", r?.battery?.let { "${it.value}% · ${it.mode.name.lowercase().replaceFirstChar(Char::uppercase)}" }) { nav.open(Route.Battery) },
        ))
        meGroup("Raahi", listOf(
            MeLink(AppIcons.ChatCircleText, "Assistant", "Ask or tell Raahi anything") { nav.open(Route.Assistant()) },
        ))
    }
}

// =================================================================== You (pushed from the avatar)

@Composable
fun MeScreen(vm: MeViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val context = androidx.compose.ui.platform.LocalContext.current
    val s by vm.settings.collectAsStateWithLifecycle()
    val session by vm.session.collectAsStateWithLifecycle()
    val plan by vm.plan.collectAsStateWithLifecycle()
    val c = Aiimin.colors
    val settings = s ?: return
    val name = settings.name.ifBlank { "You" }
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar("You", onBack = { nav.back() })
        LazyColumn(Modifier.weight(1f), contentPadding = PaddingValues(bottom = 48.dp)) {
            item {
                Row(
                    Modifier.fillMaxWidth().clickable { nav.open(Route.EditProfile) }.padding(horizontal = Aiimin.space.gutter, vertical = 8.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Box(Modifier.size(56.dp).clip(RoundedCornerShape(12.dp)).background(c.text), contentAlignment = Alignment.Center) {
                        Text(name.split(" ").filter { it.isNotBlank() }.take(2).joinToString("") { it.take(1).uppercase() }, style = Aiimin.type.cardTitle.copy(color = c.base))
                    }
                    Spacer(Modifier.width(16.dp))
                    Column(Modifier.weight(1f)) {
                        Text(name, style = Aiimin.type.cardTitle)
                        Text(
                            listOfNotNull(settings.city.ifBlank { null }, plan.label + " plan", if (session?.signedIn == true) "synced" else "only on this phone").joinToString(" · "),
                            style = Aiimin.type.body.copy(color = c.textMuted),
                        )
                    }
                }
            }
            meGroup("Settings", listOf(
                MeLink(AppIcons.Sliders, "Settings", "Day, notifications, privacy, phone data, money, appearance") { nav.open(Route.Settings) },
                MeLink(AppIcons.CloudCheck, "Account and sync", if (session?.signedIn == true) "Synced with aiimin.in" else "Only on this phone") { nav.open(Route.Account) },
                MeLink(AppIcons.Star, "Plan", plan.label + if (plan == aiimin.core.data.plan.Plan.FREE) " · see what plans add" else "") { nav.open(if (plan == aiimin.core.data.plan.Plan.FREE) Route.Plans else Route.Subscription) },
            ))
            meGroup("Help and legal", listOf(
                MeLink(AppIcons.Lifebuoy, "Help and feedback", null) { nav.open(Route.Help) },
                MeLink(AppIcons.Share, "Tell a friend", "Send them a link to the beta") {
                    val send = android.content.Intent(android.content.Intent.ACTION_SEND).setType("text/plain").putExtra(android.content.Intent.EXTRA_TEXT, inviteText())
                    runCatching { context.startActivity(android.content.Intent.createChooser(send, "Tell a friend about AIIMIN")) }
                },
                MeLink(AppIcons.Info, "About and legal", null) { nav.open(Route.About) },
            ))
        }
    }
}

internal class MeLink(val icon: androidx.compose.ui.graphics.vector.ImageVector, val title: String, val sub: String?, val onClick: () -> Unit)

internal fun androidx.compose.foundation.lazy.LazyListScope.meGroup(title: String, links: List<MeLink>) {
    item {
        val c = Aiimin.colors
        Column(Modifier.padding(horizontal = Aiimin.space.gutter)) {
            SectionHeader(title)
            links.forEach { l ->
                Row(
                    Modifier.fillMaxWidth().clickable(onClick = l.onClick).heightIn(min = 60.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    androidx.compose.material3.Icon(l.icon, null, tint = c.text, modifier = Modifier.size(24.dp))
                    Spacer(Modifier.width(16.dp))
                    Column(Modifier.weight(1f).padding(vertical = 12.dp)) {
                        Text(l.title, style = Aiimin.type.body.copy(color = c.text))
                        if (l.sub != null) Text(l.sub, style = Aiimin.type.caption)
                    }
                    Chevron()
                }
                aiimin.designsystem.component.Hairline()
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
    var selected by remember { mutableStateOf<Int?>(null) }
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
                val n = listOf(7, 30, 90)[range]
                val scored = r.series.takeLast(n)
                val pts = scored.map { LinePoint(it.score) }
                val vals = pts.mapNotNull { it.value }
                val last = pts.lastIndex
                val sel = selected?.coerceIn(0, last.coerceAtLeast(0))
                val idx = sel ?: last
                val shown = scored.getOrNull(idx)?.score?.roundToInt() ?: r.score
                val band = if (sel == null) r.band else bandOf(shown)
                val prior = r.series.getOrNull(r.series.size - 8)?.score
                val delta = if (prior != null && r.score != null) (r.score!! - prior).roundToInt() else null
                val day = scored.getOrNull(idx)?.snapshot?.day
                val dateLine = if (sel == null || idx == last) "Today · " + Dates.dayMonth(java.time.LocalDate.now()).replace(",", "") else Dates.dayMonth(day!!).replace(",", "")
                val ups = r.contributors.filter { it.points > 0 }
                val downs = r.contributors.filter { it.points < 0 }.sortedBy { it.points }
                fun nm(k: String) = (life.intentions.def(k)?.name ?: k).replaceFirstChar { it.lowercase() }
                Column(Modifier.fillMaxWidth()) {
                    Text(dateLine, style = Aiimin.type.body.copy(color = c.textMuted), modifier = Modifier.padding(top = 4.dp))
                    when {
                        hidden -> Text("Score hidden", style = Aiimin.type.title, modifier = Modifier.padding(top = 8.dp))
                        r.score == null -> {
                            Text("Calibrating", style = Aiimin.type.title, modifier = Modifier.padding(top = 8.dp))
                            Text("${r.calibrating.values.sorted().getOrNull(3) ?: 14} days to your first score", style = Aiimin.type.caption)
                        }
                        else -> {
                            Row(verticalAlignment = Alignment.Bottom, modifier = Modifier.padding(top = 2.dp)) {
                                Text(shown?.toString() ?: "—", style = Aiimin.type.heroNumber.copy(color = c.text))
                                Spacer(Modifier.width(16.dp))
                                Column(Modifier.padding(bottom = 16.dp)) {
                                    Text(band.label, style = Aiimin.type.headline.copy(color = c.text))
                                    Text(
                                        if (sel == null || idx == last) when {
                                            delta == null -> "Steady"
                                            delta > 0 -> "Rising ↑ · +$delta this week"
                                            delta < 0 -> "Falling ↓ · −${-delta} this week"
                                            else -> "Steady · same as last week"
                                        } else {
                                            val before = scored.getOrNull(idx - 1)?.score
                                            val now = scored.getOrNull(idx)?.score
                                            if (before != null && now != null && now >= before) "up from the day before" else "down from the day before"
                                        },
                                        style = Aiimin.type.body.copy(color = c.textMuted),
                                    )
                                }
                            }
                            if (sel == null && (ups.isNotEmpty() || downs.isNotEmpty())) Text(
                                buildString {
                                    ups.firstOrNull()?.let { append(nm(it.signal).replaceFirstChar { ch -> ch.uppercase() }); append(" lifted you this week") }
                                    downs.firstOrNull()?.let { append(if (isEmpty()) nm(it.signal).replaceFirstChar { ch -> ch.uppercase() } else "; ${nm(it.signal)}"); append(" held you back") }
                                    append('.')
                                },
                                style = Aiimin.type.headline.copy(fontWeight = androidx.compose.ui.text.font.FontWeight.Normal, lineHeight = 26.sp),
                                modifier = Modifier.padding(top = 12.dp),
                            )
                        }
                    }
                }
                Spacer(Modifier.height(20.dp))
                Segmented(listOf("W", "M", "3M"), range, { range = it; selected = null })
                if (!hidden && vals.size >= 2) {
                    val sorted = vals.sorted()
                    val lo = sorted[(sorted.size * 0.25).toInt()]
                    val hi = sorted[(sorted.size * 0.75).toInt().coerceAtMost(sorted.lastIndex)]
                    Spacer(Modifier.height(8.dp))
                    // D-041: while calibrating the line is short and flat; a lower chart leaves no empty block above it.
                    ScrubLineChart(pts, sel, { selected = it }, bandLow = lo, bandHigh = hi, height = if (scored.none { it.score != null }) 120.dp else 200.dp)
                    Hairline(Modifier.padding(top = 8.dp))
                    Row(Modifier.fillMaxWidth().padding(top = 12.dp), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text(scored.firstOrNull()?.snapshot?.day?.let { Dates.short(it) } ?: "", style = Aiimin.type.caption)
                        Text("Today", style = Aiimin.type.caption)
                    }
                    // Its own line, so the dates never collide with it at large text sizes.
                    Text("Drag along the line to see a day", style = Aiimin.type.caption, modifier = Modifier.padding(top = 4.dp))
                } else if (!hidden) {
                    Text("The line appears after a few days.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 16.dp))
                }
                Spacer(Modifier.height(4.dp))
            }
            if (r.score == null) {
                item {
                    SectionHeader("Calibrating")
                    Panel {
                        r.calibrating.entries.sortedBy { it.value }.forEach { (k, left) ->
                            Row(Modifier.padding(vertical = 4.dp), verticalAlignment = Alignment.CenterVertically) {
                                Text(life.intentions.def(k)?.name ?: k, style = Aiimin.type.body, modifier = Modifier.weight(1f))
                                Meter((14 - left) / 14f, Modifier.width(90.dp), color = c.textMuted)
                                Text("  ${14 - left}/14", style = Aiimin.type.caption.copy(fontFeatureSettings = "tnum"))
                            }
                        }
                    }
                }
            }
            item {
                SectionHeader("Why it moved · last 7 days", action = "Day by day", onAction = { nav.open(Route.WhyScore) })
                val ups = r.contributors.filter { it.points > 0 }.take(3)
                val downs = r.contributors.filter { it.points < 0 }.sortedBy { it.points }.take(3)
                val rows = ups + downs
                val maxContribution = rows.maxOfOrNull { kotlin.math.abs(it.points) }?.coerceAtLeast(0.1) ?: 1.0
                if (rows.isEmpty()) Text("Not enough history yet.", style = Aiimin.type.caption)
                rows.forEachIndexed { i, it ->
                    ContributionRow(life.intentions.def(it.signal)?.name ?: it.signal, it.points, signalDetail(it.signal, life.history), maxContribution)
                    if (i < rows.lastIndex) Hairline()
                }
            }
            if (life.nudges.isNotEmpty()) {
                item {
                    SectionHeader("Move it today")
                    life.nudges.forEach { n -> ListRow(n.label, trailing = { Text("+%.1f".format(n.gain), style = Aiimin.type.numberSmall.copy(color = c.done)) }) }
                }
            }
            item {
                SectionHeader("By area · last 7 days")
                // Ink bars; only the weakest area is orange, so the eye goes where the score can grow (audit A-024).
                val weakest = Domain.BUILT_IN.mapNotNull { d -> life.areas[d.key]?.let { d.key to it } }.minByOrNull { it.second }?.first
                Column {
                    Domain.BUILT_IN.forEach { d ->
                        val keys = life.intentions.cards.filter { (k, card) -> card.isScored && life.intentions.def(k)?.domain == d.key }.keys
                        if (keys.isEmpty()) return@forEach
                        val v = life.areas[d.key]
                        Row(Modifier.padding(vertical = 8.dp), verticalAlignment = Alignment.CenterVertically) {
                            Text(d.name, style = Aiimin.type.body, maxLines = 1, softWrap = false, modifier = Modifier.widthIn(min = 110.dp).padding(end = 8.dp)) // "Work / Craft" on one line (A-043)
                            Meter(((v ?: 0.0) / 100).toFloat().coerceIn(0f, 1f), Modifier.weight(1f), color = if (d.key == weakest) c.accent else c.text)
                            Text(if (v == null) "  —" else "  ${v.roundToInt()}", style = Aiimin.type.caption.copy(fontFeatureSettings = "tnum"), maxLines = 1, softWrap = false, modifier = Modifier.widthIn(min = 36.dp))
                        }
                    }
                    if (Domain.BUILT_IN.any { d -> life.areas[d.key] == null && life.intentions.cards.any { (k, card) -> card.isScored && life.intentions.def(k)?.domain == d.key } }) {
                        Text("— means nothing was measured for that area this week.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 4.dp))
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
                    Spacer(Modifier.width(12.dp))
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
        StreakMark.MISSED -> c.raised to "Not kept"
    }
    // At least 78 dp, never a broken word: "Repaire / d" at 1.3× text (audit A-044).
    Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.widthIn(min = 78.dp)) {
        Box(Modifier.size(12.dp).clip(CircleShape).background(col))
        Spacer(Modifier.width(8.dp))
        Text(label, style = Aiimin.type.caption, maxLines = 1, softWrap = false)
    }
}

@Composable
private fun ContributionRow(name: String, pts: Double, detail: String?, maxContribution: Double) {
    val c = Aiimin.colors
    Row(Modifier.fillMaxWidth().padding(vertical = 16.dp), verticalAlignment = Alignment.Top) {
        Column(Modifier.weight(1f)) {
            Text(name, style = Aiimin.type.headline.copy(fontWeight = androidx.compose.ui.text.font.FontWeight.Normal))
            if (detail != null) Text(detail, style = Aiimin.type.body.copy(color = c.textMuted), modifier = Modifier.padding(top = 2.dp))
            Meter((kotlin.math.abs(pts) / maxContribution).toFloat(), Modifier.fillMaxWidth().padding(top = 8.dp), color = if (pts > 0) c.done else c.textMuted, height = 4.dp)
        }
        Text(
            (if (pts > 0) "+" else "−") + "%.1f".format(kotlin.math.abs(pts)),
            style = Aiimin.type.numberSmall.copy(color = if (pts > 0) c.done else c.warn, fontWeight = androidx.compose.ui.text.font.FontWeight.Medium),
        )
    }
}

private fun bandOf(score: Int?): Band = when {
    score == null -> Band.CALIBRATING
    score >= 80 -> Band.PEAK
    score >= 72 -> Band.STRONG
    score >= 60 -> Band.GOOD
    score >= 40 -> Band.STEADY
    else -> Band.REBUILDING
}

private fun fmtMinutes(m: Double): String {
    val t = m.roundToInt()
    return if (t >= 60) (if (t % 60 == 0) "${t / 60}h" else "${t / 60}h ${t % 60}m") else "${t}m"
}

/** One plain line about a signal over the last week, against the weeks before it. */
private fun signalDetail(key: String, history: List<aiimin.core.engine.DaySnapshot>): String? {
    val recent = history.takeLast(7)
    val before = history.dropLast(7).takeLast(21)
    fun avg(list: List<aiimin.core.engine.DaySnapshot>) = list.mapNotNull { it.value(key) }.takeIf { it.isNotEmpty() }?.average()
    val now = avg(recent) ?: return null
    val was = avg(before)
    fun cmp(fmt: (Double) -> String, unit: String = "") =
        if (was == null) "${fmt(now)}$unit" else "${fmt(now)}$unit, ${if (now >= was) "up" else "down"} from ${fmt(was)}"
    return when (key) {
        aiimin.core.engine.Signals.FOCUS -> cmp(::fmtMinutes, " a day")
        aiimin.core.engine.Signals.STEPS -> {
            val low = was?.let { w -> recent.count { (it.value(key) ?: w) < w } } ?: 0
            if (low > 0) "below your normal $low ${if (low == 1) "day" else "days"}" else "%,d a day".format(now.roundToInt())
        }
        aiimin.core.engine.Signals.SLEEP -> cmp({ fmtMinutes(it) }, " a night")
        aiimin.core.engine.Signals.MINIMUMS -> "${recent.count { it.minimums.planned > 0 && it.minimums.kept == it.minimums.planned }} of ${recent.size} days"
        aiimin.core.engine.Signals.SCREEN_PERSONAL, aiimin.core.engine.Signals.LATE_SCREEN -> cmp(::fmtMinutes, " a day")
        aiimin.core.engine.Signals.TASKS, aiimin.core.engine.Signals.MONEY_LOGGING, aiimin.core.engine.Signals.JOURNAL -> "${now.roundToInt()}% on average"
        else -> null
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
    Band.PEAK, Band.STRONG -> Aiimin.colors.done
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
                // D-021: the dot shapes get a legend in words.
                Row(Modifier.padding(top = 12.dp), verticalAlignment = Alignment.CenterVertically) {
                    EvidenceDot('A'); Text("measured by the phone", style = Aiimin.type.caption, modifier = Modifier.padding(end = 12.dp))
                    EvidenceDot('C'); Text("your tap", style = Aiimin.type.caption)
                }
                Spacer(Modifier.height(12.dp))
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
                            if (card.direction in setOf(Direction.MORE, Direction.LESS)) "target ${withUnit(fmtTarget(card.target), def.unit)}" else if (card.direction == Direction.BAND) card.band?.let { "${fmtTarget(it.start)}–${withUnit(fmtTarget(it.endInclusive), def.unit)}" } else null,
                            if (card.isScored && cal < 14) "calibrating $cal/14" else null,
                            card.pending?.let { "change on ${Dates.short(it.applyOn)}" },
                            // D-021: the weight reads with the rest of the line instead of floating at the right edge.
                            listOf("Off", "Low", "Normal", "High").getOrNull(card.weight)?.takeIf { card.isScored }?.let { "${it.lowercase()} weight" },
                        ).joinToString(" · "),
                        maxSubtitleLines = 3,
                        leading = { EvidenceDot(def.defaultTier.name.first()) },
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
        var more by remember { mutableStateOf(true) }
        var kind by remember { mutableStateOf("Number") }
        AppSheet({ custom = false }, title = "Your own signal", subtitle = "Guitar minutes, client calls, glasses of water. It calibrates over 14 days.") {
            PillRow { listOf("Number", "Yes or no", "Duration").forEach { k -> Pill(k, kind == k, { kind = k; if (k == "Yes or no") { unit = "done"; target = "1" } else if (k == "Duration") unit = "min" }) } }
            Spacer(Modifier.height(8.dp))
            AppTextField(name, { name = it }, placeholder = "Name")
            Spacer(Modifier.height(8.dp))
            AppTextField(unit, { unit = it }, placeholder = "Unit (min, count, glasses)")
            Spacer(Modifier.height(8.dp))
            AppTextField(target, { target = it.filter { ch -> ch.isDigit() || ch == '.' } }, placeholder = "Daily target", keyboardType = KeyboardType.Decimal)
            PillRow { Domain.BUILT_IN.forEach { d -> Pill(d.name, domain == d.key, { domain = d.key }) } }
            if (kind != "Yes or no") PillRow { Pill("More is better", more, { more = true }); Pill("Less is better", !more, { more = false }) }
            Text("Log it from the signal's page or the Today strip. It counts from tomorrow.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 8.dp))
            Spacer(Modifier.height(12.dp))
            AppButton("Add", {
                scope.launch { vm.addCustom(name, unit, domain, target.toDoubleOrNull() ?: 1.0, more || kind == "Yes or no"); custom = false; toaster.show("$name added · calibrates over 14 days") }
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
    var blocked by remember(key) { mutableStateOf<String?>(null) }
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
                Spacer(Modifier.height(12.dp))
                val hist = l?.history.orEmpty().takeLast(28).map { it.value(key)?.toFloat() }
                if (hist.count { it != null } >= 2) {
                    Panel {
                        Text("LAST 4 WEEKS", style = Aiimin.type.eyebrow)
                        Sparkline(hist, baseline = normal?.first?.toFloat(), height = 80.dp)
                        normal?.let { (med, p40, p60) -> Text("Your normal: ${withUnit(fmtTarget(med), def.unit)} · typical range ${fmtTarget(p40)}–${fmtTarget(p60)}", style = Aiimin.type.caption) }
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
                        Text("${withUnit(fmtTarget(target), def.unit)}", style = Aiimin.type.numberMedium, modifier = Modifier.weight(1f))
                        Stepper("", { target = (target - step).coerceAtLeast(0.0); blocked = null }, { target += step; blocked = null })
                    }
                    // Live challenge label (§4.21): where this target sits in your own last 28 days.
                    val hist28 = l?.history.orEmpty().takeLast(28).mapNotNull { it.value(key) }
                    if (dir != Direction.BAND && hist28.size >= 7) {
                        val r = aiimin.core.engine.Score3.targetRank(dir == Direction.MORE, target, hist28)
                        val label = when { r < 0.5 -> "Easy"; r <= 0.8 -> "Stretch"; else -> "Hard" }
                        val med = aiimin.core.engine.Stats.median(hist28)
                        val gap = if (med != 0.0) ((target - med) / med * 100).roundToInt() else 0
                        Text(
                            "$label · " + when { gap > 0 -> "$gap% above"; gap < 0 -> "${-gap}% below"; else -> "at" } + " your typical day",
                            style = Aiimin.type.caption.copy(color = if (label == "Easy") c.textMuted else c.warn), modifier = Modifier.padding(top = 4.dp),
                        )
                    }
                    suggestion?.let { sug ->
                        Text("Suggested: ${fmtTarget(sug)} (your 60th percentile)", style = Aiimin.type.caption.copy(color = c.textMuted), modifier = Modifier.padding(top = 4.dp).clip(Shapes.small).clickable { target = sug; blocked = null })
                    }
                    blocked?.let { Text(it, style = Aiimin.type.body.copy(color = c.warn), modifier = Modifier.padding(top = 8.dp)) }
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
                    is IntentionChange.Rejected.BelowYourFloor -> blocked = "Can't go below ${fmtTarget(r.floor)}, your own 40th percentile over 28 days."
                    is IntentionChange.Rejected.AboveYourCeiling -> blocked = "Can't go above ${fmtTarget(r.ceiling)}, your own 60th percentile over 28 days."
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
                        BatteryState.OK -> "Kept minimums charge it; a kept day adds a bonus. One unkept day each week is free."
                        BatteryState.LOW -> "Low battery: minimums shrink to their tiny versions, tiny ones count double, and unkept ones cost half. The lower it is, the easier it climbs."
                        BatteryState.COMEBACK -> "A lighter stretch: keep any one minimum on 3 days and the battery returns to 40%. Nothing is deleted."
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
                Spacer(Modifier.height(12.dp))
                Panel {
                    val rows = when (mode) {
                        BatteryMode.GENTLE -> listOf("An unkept minimum costs 2, at most 6 a day", "No zero state", "Two rest days a week plus pause", "Unlimited repairs")
                        BatteryMode.STANDARD -> listOf("An unkept minimum costs 3, at most 10 a day", "At zero, a 3-day comeback", "One rest day a week plus pause", "One repair per break")
                        BatteryMode.HARDCORE -> listOf("An unkept minimum costs 5, at most 20 a day", "No free day, no freezes", "Declared illness only", "No repairs")
                    }
                    aiimin.designsystem.component.BulletList(rows, style = Aiimin.type.body)
                }
                Text("Mode can change once every 7 days. If things get rough, the app will offer Gentle — it never switches for you.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 8.dp))
            }
            item {
                SectionHeader("Kept days")
                val st = l!!.readout.streak
                Row(horizontalArrangement = Arrangement.SpaceEvenly, modifier = Modifier.fillMaxWidth()) {
                    MiniFigure("${st.current}", "in a row")
                    MiniFigure("${st.longest}", "longest run")
                    MiniFigure("${st.totalKept}", "days kept")
                    MiniFigure("${st.freezesBanked}", "freezes")
                }
                Text("A freeze is earned every 7 kept days (bank up to 2). Never sold. One freeze covers one day off.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 8.dp))
            }
        }
    }
}

/** "70%", "75/100", but "150 min": symbols sit against the number, words get a space (audit A-021). */
internal fun withUnit(value: String, unit: String): String = when {
    unit.isBlank() -> value
    unit.startsWith("%") || unit.startsWith("/") -> value + unit
    else -> "$value $unit"
}

/** What "Tell a friend" sends: what AIIMIN is, the privacy promise, where to join. No claims we can't back. */
internal fun inviteText(): String =
    "I keep my day, money and family's papers in one calm place with AIIMIN. " +
        "It reads bank SMS on the phone and never uploads them. No ads, no loans. Join the beta: https://aiimin.in/waitlist"
