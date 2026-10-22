package aiimin.feature.me

import aiimin.core.data.util.Dates
import aiimin.core.engine.DaySnapshot
import aiimin.core.engine.Signals
import aiimin.designsystem.component.AppIconButton
import aiimin.designsystem.component.AxisLabel
import aiimin.designsystem.component.BarPoint
import aiimin.designsystem.component.EmptyState
import aiimin.designsystem.component.Hairline
import aiimin.designsystem.component.ScrubBarChart
import aiimin.designsystem.component.SectionHeader
import aiimin.designsystem.component.Segmented
import aiimin.designsystem.component.Skeleton
import aiimin.designsystem.component.TopBar
import aiimin.designsystem.icon.AppIcons
import aiimin.designsystem.nav.LocalNavigator
import aiimin.designsystem.nav.Route
import aiimin.designsystem.theme.Aiimin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import java.time.LocalDate
import kotlin.math.abs
import kotlin.math.roundToInt

private const val BODY_DISCLAIMER = "Wellness information only. Not a medical device and not for diagnosis. In an emergency call 112."

private fun hm(min: Double): String {
    val t = min.roundToInt()
    return "${t / 60}h ${"%02d".format(t % 60)}m"
}

/** S10 · Body: steps and sleep from the day snapshots; resting heart rate only when Health Connect shares it. */
@Composable
fun BodyScreen(vm: MeViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val l by vm.life.collectAsStateWithLifecycle()
    val c = Aiimin.colors
    var tab by remember { mutableIntStateOf(0) }
    var range by remember { mutableIntStateOf(0) }
    var sel by remember { mutableStateOf<Int?>(null) }
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar("Body", onBack = { nav.back() })
        val life = l
        if (life == null) {
            Skeleton(Modifier.padding(Aiimin.space.gutter).fillMaxWidth().height(220.dp))
            return@Column
        }
        val days = (life.history + life.today).takeLast(if (range == 0) 7 else 30)
        LazyColumn(contentPadding = PaddingValues(start = Aiimin.space.gutter, end = Aiimin.space.gutter, bottom = 40.dp)) {
            item {
                Segmented(listOf("Steps", "Sleep", "Heart rate"), tab, { tab = it; sel = null })
                Spacer(Modifier.height(16.dp))
            }
            when (tab) {
                0 -> item { MetricBlock(days, Signals.STEPS, range, sel, { sel = it }, { range = it; sel = null }, "steps",
                    fmt = { "%,d".format(it.roundToInt()) }, target = life.intentions.card(Signals.STEPS)?.target,
                    empty = "No step data yet. Turn on Health Connect in You → Sensors, or carry the phone and steps appear.", source = "Health Connect (watch preferred)") }
                1 -> item { MetricBlock(days, Signals.SLEEP, range, sel, { sel = it }, { range = it; sel = null }, "asleep",
                    fmt = { hm(it) }, target = life.intentions.card(Signals.SLEEP)?.target,
                    empty = "No sleep data last night. If you wear a watch, check its Health Connect sharing.", source = "Health Connect") }
                else -> item {
                    EmptyState(AppIcons.Heart, "No heart-rate data", "Resting heart rate appears when Health Connect shares it. It is track-only: it never moves your score.", sidePadding = 0.dp)
                }
            }
            item {
                Text(BODY_DISCLAIMER, style = Aiimin.type.caption, modifier = Modifier.padding(top = 28.dp))
            }
        }
    }
}

@Composable
private fun MetricBlock(
    days: List<DaySnapshot>, key: String, range: Int, sel: Int?, onSel: (Int?) -> Unit, onRange: (Int) -> Unit,
    unit: String, fmt: (Double) -> String, target: Double?, empty: String, source: String,
) {
    val c = Aiimin.colors
    val vals = days.map { it.value(key) }
    if (vals.none { it != null }) {
        EmptyState(AppIcons.Footprints, "Nothing yet", empty, sidePadding = 0.dp)
        return
    }
    val idx = sel ?: vals.indexOfLast { it != null }
    val shown = vals.getOrNull(idx)
    val d = days.getOrNull(idx)?.day
    Text(
        if (d == null || (sel == null && d == LocalDate.now())) "Today" else Dates.dayMonth(d).replace(",", ""),
        style = Aiimin.type.body.copy(color = c.textMuted),
    )
    Text(shown?.let(fmt) ?: "—", style = Aiimin.type.heroNumber.copy(fontSize = 52.sp, lineHeight = 54.sp), modifier = Modifier.padding(top = 2.dp))
    val avg = vals.filterNotNull().average()
    Text("$unit · average ${fmt(avg)} · $source", style = Aiimin.type.body.copy(color = c.textMuted))
    Spacer(Modifier.height(16.dp))
    Segmented(listOf("7 days", "30 days"), range, onRange)
    Spacer(Modifier.height(8.dp))
    ScrubBarChart(
        points = vals.map { BarPoint(it ?: 0.0, gap = it == null) },
        selected = sel, onSelect = onSel,
        usual = target.takeIf { it != null && it > 0 }, usualLabel = target?.let { "target ${fmt(it)}" },
        labels = listOf(AxisLabel(0, days.first().day.let { Dates.shortDm(it) }), AxisLabel(days.lastIndex, "Today")),
        height = 190.dp, description = "$unit by day",
    )
    Text("Tap a bar to read that day.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 8.dp))
}

// ------------------------------------------------------------------ patterns

private data class Pattern(val sentence: String, val a: Double, val b: Double, val aLabel: String, val bLabel: String, val n: Int, val confidence: String)

private fun pearson(x: List<Double>, y: List<Double>): Double {
    val mx = x.average(); val my = y.average()
    var sxy = 0.0; var sxx = 0.0; var syy = 0.0
    for (i in x.indices) { sxy += (x[i] - mx) * (y[i] - my); sxx += (x[i] - mx) * (x[i] - mx); syy += (y[i] - my) * (y[i] - my) }
    return if (sxx == 0.0 || syy == 0.0) 0.0 else sxy / kotlin.math.sqrt(sxx * syy)
}

/** Pairs two day series, splits on the first one's median, and says plainly what differs. */
private fun pair(history: List<DaySnapshot>, xKey: String, yKey: String, xWord: String, yWord: String, xFmt: (Double) -> String, yFmt: (Double) -> String, hiLabel: String, loLabel: String): Pattern? {
    val rows = history.mapNotNull { h -> val x = h.value(xKey); val y = h.value(yKey); if (x != null && y != null) x to y else null }
    if (rows.size < 14) return null
    val med = rows.map { it.first }.sorted()[rows.size / 2]
    val hi = rows.filter { it.first >= med }.map { it.second }
    val lo = rows.filter { it.first < med }.map { it.second }
    if (hi.size < 4 || lo.size < 4) return null
    val r = pearson(rows.map { it.first }, rows.map { it.second })
    if (abs(r) < 0.25) return null
    val conf = when { abs(r) > 0.6 && rows.size >= 30 -> "Strong"; abs(r) > 0.4 -> "Moderate"; else -> "Weak" }
    return Pattern(
        "On days your $xWord ${copulaFor(xWord)} ${xFmt(med)} or more, your $yWord averages ${yFmt(hi.average())} against ${yFmt(lo.average())}.",
        hi.average(), lo.average(), hiLabel, loLabel, rows.size, conf,
    )
}

/** S11 · Patterns. Unlocks after 21 days of paired data; every sentence says what it is not. */
@Composable
fun PatternsScreen(vm: MeViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val l by vm.life.collectAsStateWithLifecycle()
    val c = Aiimin.colors
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar("Patterns", onBack = { nav.back() }) { aiimin.designsystem.component.RaahiGuideButton(aiimin.designsystem.component.RaahiArea.PATTERNS) }
        val life = l
        if (life == null) { Skeleton(Modifier.padding(Aiimin.space.gutter).fillMaxWidth().height(160.dp)); return@Column }
        val h = life.history
        if (h.size < 21) {
            EmptyState(AppIcons.Pulse, "Patterns appear after 21 days", "${21 - h.size} to go. AIIMIN pairs your days (sleep, steps, focus, screen time) and tells you plainly what goes with what.")
            return@Column
        }
        val found = listOfNotNull(
            pair(h, Signals.STEPS, Signals.FOCUS, "steps", "focus", { "%,d".format(it.roundToInt()) }, { hm(it) }, "More steps", "Fewer steps"),
            pair(h, Signals.SLEEP, Signals.TASKS, "sleep", "task completion", { hm(it) }, { "${it.roundToInt()}%" }, "More sleep", "Less sleep"),
            pair(h, Signals.SLEEP, Signals.FOCUS, "sleep", "focus", { hm(it) }, { hm(it) }, "More sleep", "Less sleep"),
            pair(h, Signals.SCREEN_PERSONAL, Signals.FOCUS, "personal screen time", "focus", { hm(it) }, { hm(it) }, "More screen", "Less screen"),
            pair(h, Signals.STEPS, Signals.SLEEP, "steps", "sleep", { "%,d".format(it.roundToInt()) }, { hm(it) }, "More steps", "Fewer steps"),
            pair(h, Signals.FOCUS, Signals.MINIMUMS, "focus", "minimums kept", { hm(it) }, { "${it.roundToInt()}%" }, "More focus", "Less focus"),
        )
        LazyColumn(contentPadding = PaddingValues(start = Aiimin.space.gutter, end = Aiimin.space.gutter, bottom = 40.dp)) {
            if (found.isEmpty()) item {
                EmptyState(AppIcons.Pulse, "Nothing stands out yet", "Your days are steady, so no two things clearly move together. Check back as more days arrive.", sidePadding = 0.dp)
            }
            items(found.size) { i ->
                val p = found[i]
                Column(Modifier.padding(top = 24.dp)) {
                    Text(p.sentence, style = Aiimin.type.headline.copy(fontWeight = androidx.compose.ui.text.font.FontWeight.Normal, lineHeight = 26.sp))
                    Text("${p.confidence} · ${p.n} days", style = Aiimin.type.caption, modifier = Modifier.padding(top = 4.dp, bottom = 12.dp))
                    val top = maxOf(p.a, p.b).coerceAtLeast(1.0)
                    listOf(p.aLabel to p.a, p.bLabel to p.b).forEachIndexed { k, (label, v) ->
                        Row(Modifier.fillMaxWidth().padding(vertical = 4.dp), verticalAlignment = Alignment.CenterVertically) {
                            Text(label, style = Aiimin.type.caption, maxLines = 1, softWrap = false, modifier = Modifier.widthIn(min = 96.dp))
                            Box(Modifier.weight(1f).height(8.dp).clip(RoundedCornerShape(2.dp)).background(c.border)) {
                                Box(Modifier.fillMaxWidth((v / top).toFloat().coerceIn(0.03f, 1f)).height(8.dp).background(if (k == 0) c.text else c.chartInactive))
                            }
                        }
                    }
                    Spacer(Modifier.height(20.dp))
                    Hairline()
                }
            }
            item {
                Text("Patterns are not causes. They are for noticing. Not medical or financial advice.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 20.dp))
            }
        }
    }
}

// ------------------------------------------------------------------ why this score

/** S2 · Why this score: one settled day at a time, what each signal did and how the level moved. */
@Composable
fun WhyScoreScreen(vm: MeViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val l by vm.life.collectAsStateWithLifecycle()
    val c = Aiimin.colors
    var back by remember { mutableIntStateOf(0) }
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar("Why this score", onBack = { nav.back() })
        val life = l
        if (life == null) { Skeleton(Modifier.padding(Aiimin.space.gutter).fillMaxWidth().height(200.dp)); return@Column }
        val series = life.readout.series
        if (series.isEmpty()) {
            EmptyState(AppIcons.Pulse, "No days yet", "Once a day has closed, you can see exactly how it was scored here.")
            return@Column
        }
        val i = (series.lastIndex - back).coerceIn(0, series.lastIndex)
        val day = series[i]
        val prev = series.getOrNull(i - 1)?.score
        val now = day.score
        val move = if (prev != null && now != null) now - prev else null
        LazyColumn(contentPadding = PaddingValues(start = Aiimin.space.gutter, end = Aiimin.space.gutter, bottom = 40.dp)) {
            item {
                Row(Modifier.fillMaxWidth().padding(vertical = 4.dp), verticalAlignment = Alignment.CenterVertically) {
                    AppIconButton(AppIcons.CaretLeft, "Earlier day", { if (i > 0) back++ })
                    Text(Dates.dayMonth(day.snapshot.day).replace(",", ""), style = Aiimin.type.headline, modifier = Modifier.weight(1f), textAlign = androidx.compose.ui.text.style.TextAlign.Center)
                    AppIconButton(AppIcons.CaretRight, "Later day", { if (back > 0) back-- })
                }
                Text(
                    buildString {
                        // Plain words (audit A-023): the day's own score, then how the Life Score moved.
                        fun n(v: Double) = if (v % 1.0 == 0.0) "%.0f".format(v) else "%.1f".format(v)
                        append("This day scored ${day.di?.let { "%.0f".format(it) } ?: "—"}")
                        if (now != null) append(" · Life Score ${prev?.let { n(it) + " → " } ?: ""}${n(now)}")
                        if (move != null) append(" (${if (move >= 0) "+" else "−"}${n(abs(move))})")
                    },
                    style = Aiimin.type.headline, modifier = Modifier.padding(top = 12.dp),
                )
                if (day.clipped) Text("An unverified spike was held to your personal ceiling.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 4.dp))
                SectionHeader("What each signal did")
            }
            val vals = day.snapshot.values.filter { it.value != null }.entries.toList()
            if (vals.isEmpty()) item { Text("Nothing was measured on this day.", style = Aiimin.type.caption) }
            items(vals.size) { k ->
                val (key, v) = vals[k]
                val def = life.intentions.def(key)
                val tier = day.snapshot.tier(key)
                Column {
                    Row(Modifier.fillMaxWidth().heightIn(min = 56.dp).padding(vertical = 12.dp), verticalAlignment = Alignment.CenterVertically) {
                        Column(Modifier.weight(1f)) {
                            Text(def?.name ?: key, style = Aiimin.type.headline.copy(fontWeight = androidx.compose.ui.text.font.FontWeight.Normal))
                            Text(valueText(key, v!!) + " · " + when (tier.name) { "A" -> "measured"; "B" -> "backed"; "C" -> "your tap"; else -> "unverified" }, style = Aiimin.type.body.copy(color = c.textMuted))
                        }
                        aiimin.designsystem.component.EvidenceDot(tier.name[0])
                    }
                    Hairline()
                }
            }
            item {
                Text(if (back == 0) "Final at noon tomorrow; anything you add before then still counts." else "Final.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 20.dp))
            }
        }
    }
}

internal fun valueText(key: String, v: Double): String = when (key) {
    Signals.STEPS -> "%,d steps".format(v.roundToInt())
    Signals.SLEEP -> hm(v)
    Signals.FOCUS, Signals.SCREEN_PERSONAL, Signals.SCREEN_WORK, Signals.LATE_SCREEN -> hm(v)
    Signals.UNLOCKS -> "${v.roundToInt()} unlocks"
    else -> "${v.roundToInt()}%"
}

/** "is" or "are" for a measure's name: "steps are", but "focus is" (a final s is not always a plural). */
internal fun copulaFor(word: String): String {
    val w = word.trim().lowercase()
    val singularS = setOf("focus", "stress", "fitness", "progress", "status", "wellness", "news")
    return if (w.endsWith("s") && w !in singularS && !w.endsWith("ss")) "are" else "is"
}
