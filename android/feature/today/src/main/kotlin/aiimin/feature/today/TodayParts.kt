package aiimin.feature.today

import androidx.compose.ui.semantics.heading
import androidx.compose.foundation.combinedClickable
import aiimin.core.data.util.Dates
import aiimin.core.engine.today.NowKind
import aiimin.core.engine.today.NowLine
import aiimin.core.engine.today.SetupStep
import aiimin.core.engine.today.WhatNowText
import aiimin.designsystem.component.AppButton
import aiimin.designsystem.component.AppSheet
import aiimin.designsystem.component.ButtonKind
import aiimin.designsystem.component.armShared
import aiimin.designsystem.component.opensScreen
import aiimin.designsystem.component.pressable
import aiimin.designsystem.icon.AppIcons
import aiimin.designsystem.nav.FeatureIndex
import aiimin.designsystem.nav.LocalNavigator
import aiimin.designsystem.nav.Route
import aiimin.designsystem.theme.Aiimin
import aiimin.designsystem.theme.Shapes
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.IntrinsicSize
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import java.time.LocalTime

/** The route a Quick door key names (route class name in lower case, PRD Part 17). */
internal fun doorKeyOf(route: Route): String = route::class.simpleName.orEmpty().lowercase()

private class Door(val title: String, val icon: ImageVector, val route: Route)

private fun doorFor(key: String): Door? {
    // Pour is the private writing space (Part 12); until it is built (B7b) its door opens the private writer.
    if (key == "journalwrite") return Door("Pour", AppIcons.Drop, Route.JournalWrite())
    val f = FeatureIndex.all.firstOrNull { doorKeyOf(it.route) == key } ?: return null
    val short = when (key) { "planday" -> "Plan"; "minimums" -> "Minimums"; else -> f.title }
    return Door(short, f.icon, f.route)
}

/**
 * Today's single job (PRD 1.2): the "What now?" line, in the one orange on the page (Decision 3), with the
 * action that fits it. Tapping the line shows why it was chosen, with "Not now".
 */
@Composable
internal fun WhatNowCard(
    line: NowLine,
    onDone: (String) -> Unit,
    onKeepMinimum: (String) -> Unit,
    onNotNow: (NowKind) -> Unit,
    modifier: Modifier = Modifier,
) {
    val nav = LocalNavigator.current
    val c = Aiimin.colors
    val h24 = android.text.format.DateFormat.is24HourFormat(LocalContext.current)
    var why by remember { mutableStateOf(false) }
    val text = WhatNowText.line(line, h24)
    Column(modifier.fillMaxWidth().clip(Shapes.card).background(c.surface).border(1.dp, c.border, Shapes.card).padding(16.dp)) {
        Text("WHAT NOW?", style = Aiimin.type.eyebrow, modifier = Modifier.semantics { heading() })
        Spacer(Modifier.height(8.dp))
        Text(
            text,
            // 32.6 X3: the sun is Today's one orange element; the line is ink.
            style = Aiimin.type.cardTitle.copy(color = c.text),
            maxLines = 3, overflow = TextOverflow.Ellipsis,
            modifier = Modifier.fillMaxWidth().pressable({ why = true }, onClickLabel = "Why this?"),
        )
        val actions = actionsFor(line)
        if (actions.isNotEmpty()) {
            Spacer(Modifier.height(16.dp))
            @OptIn(ExperimentalLayoutApi::class)
            FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                actions.forEachIndexed { i, a ->
                    AppButton(a.label, {
                        when (a) {
                            NowAction.Done -> line.targetId?.let(onDone)
                            NowAction.Keep -> onKeepMinimum(line.title)
                            is NowAction.Open -> nav.open(a.route)
                        }
                    }, kind = if (i == 0) ButtonKind.PRIMARY else ButtonKind.SECONDARY, compact = true, icon = if (a == NowAction.Done) AppIcons.Check else null)
                }
            }
        }
    }
    if (why) {
        AppSheet(onDismiss = { why = false }, title = "Why this?", subtitle = WhatNowText.why(line, h24)) {
            Text(
                "Today picks one line in a fixed order: focus, the next 90 minutes, bills due, wrapping up, a fresh start, an evening minimum, your top task. Nothing is sent anywhere.",
                style = Aiimin.type.note,
            )
            Spacer(Modifier.height(16.dp))
            if (line.kind != NowKind.CLEAR) {
                AppButton("Not now", { onNotNow(line.kind); why = false }, Modifier.fillMaxWidth(), kind = ButtonKind.SECONDARY)
            }
        }
    }
}

private sealed class NowAction(val label: String) {
    data object Done : NowAction("Mark done")
    data object Keep : NowAction("Keep it")
    class Open(label: String, val route: Route) : NowAction(label)
}

private fun actionsFor(l: NowLine): List<NowAction> = when (l.kind) {
    NowKind.FOCUS -> listOf(NowAction.Open("Open focus", Route.Focus()))
    NowKind.SOON -> when {
        l.targetId == null -> emptyList()
        l.isEvent -> listOf(NowAction.Open("Open", Route.Calendar), NowAction.Open("Focus", Route.Focus(label = l.title)))
        else -> listOf(NowAction.Done, NowAction.Open("Focus", Route.Focus(taskId = l.targetId, label = l.title)))
    }
    NowKind.BILL -> listOf(NowAction.Open("Open bills", Route.Recurring))
    NowKind.WRAP_UP -> listOf(NowAction.Open("Wrap up", Route.Debrief), NowAction.Open("Plan tomorrow", Route.PlanDay(tomorrow = true)))
    NowKind.LANDMARK -> listOf(NowAction.Open(if (l.month) "Plan the month" else "Plan the week", Route.PlanDay()))
    NowKind.MINIMUM -> listOf(NowAction.Keep, NowAction.Open("All minimums", Route.Minimums))
    NowKind.TASK -> listOfNotNull(l.targetId?.let { NowAction.Done }, NowAction.Open("Focus", Route.Focus(taskId = l.targetId, label = l.title)))
    NowKind.CLEAR -> listOf(NowAction.Open("Plan tomorrow", Route.PlanDay(tomorrow = true)))
}

/** PRD 1.2: "Your evenings seem to start near 23:30. Use this?" — offered, never applied silently. */
@Composable
internal fun DayEndCard(suggested: LocalTime, current: LocalTime, onYes: () -> Unit, onKeep: () -> Unit, modifier: Modifier = Modifier) {
    val c = Aiimin.colors
    Column(modifier.fillMaxWidth().clip(Shapes.card).background(c.surface).border(1.dp, c.border, Shapes.card).padding(16.dp)) {
        Text("Your evenings seem to start near ${Dates.clock(suggested)}. Use this?", style = Aiimin.type.bodyStrong)
        Text("Learned on this phone from the last 7 nights. It only moves the wrap-up line and the Evening list.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 4.dp))
        Spacer(Modifier.height(12.dp))
        @OptIn(ExperimentalLayoutApi::class)
        FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            AppButton("Yes", onYes, compact = true)
            AppButton("Keep ${Dates.clock(current)}", onKeep, kind = ButtonKind.SECONDARY, compact = true)
        }
    }
}

/** The first-week ladder (master plan Phase 6 R1): five one-tap steps, days 1 to 7 only. */
@Composable
internal fun FirstWeekCard(steps: List<Pair<SetupStep, Boolean>>, onStep: (SetupStep) -> Unit, modifier: Modifier = Modifier) {
    val c = Aiimin.colors
    val done = steps.count { it.second }
    Column(modifier.fillMaxWidth().clip(Shapes.card).background(c.surface).border(1.dp, c.border, Shapes.card).padding(vertical = 8.dp)) {
        Row(Modifier.padding(horizontal = 16.dp, vertical = 8.dp), verticalAlignment = Alignment.CenterVertically) {
            Text("Your first week", style = Aiimin.type.bodyStrong, modifier = Modifier.weight(1f))
            Text("$done of ${steps.size} set up", style = Aiimin.type.caption)
        }
        steps.forEach { (step, isDone) ->
            Row(
                Modifier.fillMaxWidth().heightIn(min = 48.dp)
                    .then(if (isDone) Modifier else Modifier.pressable({ onStep(step) }, role = Role.Button))
                    .semantics(mergeDescendants = true) { stateDescription = if (isDone) "Done" else "Not done yet" }
                    .padding(horizontal = 16.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Icon(if (isDone) AppIcons.CheckCircle else AppIcons.Circle, null, tint = if (isDone) c.done else c.textFaint, modifier = Modifier.size(20.dp))
                Spacer(Modifier.width(12.dp))
                Text(step.label, style = Aiimin.type.body.copy(color = if (isDone) c.textMuted else c.text), modifier = Modifier.weight(1f))
                if (!isDone) Icon(AppIcons.CaretRight, null, tint = c.textFaint, modifier = Modifier.size(16.dp))
            }
        }
    }
}

/** Part 17: four Quick doors, one tap each, equal width; a door grows into its screen (26.5). */
@Composable
internal fun QuickDoorsRow(keys: List<String>, pinned: List<String>, onPin: (String) -> Unit, modifier: Modifier = Modifier) {
    val nav = LocalNavigator.current
    val c = Aiimin.colors
    val doors = keys.mapNotNull { k -> doorFor(k)?.let { k to it } }
    if (doors.isEmpty()) return
    Row(modifier.fillMaxWidth().height(IntrinsicSize.Min), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        doors.forEach { (key, d) ->
            val isPinned = key in pinned
            @OptIn(androidx.compose.foundation.ExperimentalFoundationApi::class)
            Column(
                Modifier.weight(1f).fillMaxHeight().heightIn(min = 72.dp).opensScreen(d.route).clip(Shapes.card).background(c.surface)
                    .border(1.dp, if (isPinned) c.borderStrong else c.border, Shapes.card)
                    .combinedClickable(
                        onClick = { armShared(d.route); nav.open(d.route) },
                        onLongClick = { onPin(key) },
                        onLongClickLabel = if (isPinned) "Unpin" else "Pin to Today",
                    )
                    .padding(horizontal = 4.dp, vertical = 12.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center,
            ) {
                Icon(d.icon, null, tint = c.text, modifier = Modifier.size(24.dp))
                Spacer(Modifier.height(8.dp))
                Text(d.title, style = Aiimin.type.label, maxLines = 2, overflow = TextOverflow.Ellipsis, textAlign = TextAlign.Center)
            }
        }
    }
}

