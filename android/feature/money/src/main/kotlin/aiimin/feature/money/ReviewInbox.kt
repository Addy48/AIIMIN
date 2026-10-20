package aiimin.feature.money

import aiimin.core.data.money.Categories
import aiimin.core.data.money.Ledger
import aiimin.core.data.util.Dates
import aiimin.core.data.util.Money
import aiimin.core.database.TxnDraftEntity
import aiimin.designsystem.component.AppButton
import androidx.compose.runtime.produceState
import aiimin.designsystem.component.AppTextField
import aiimin.designsystem.component.AppIconButton
import aiimin.designsystem.component.ButtonKind
import aiimin.designsystem.component.CheckCircle
import aiimin.designsystem.component.Pill
import aiimin.designsystem.component.TopBar
import aiimin.designsystem.icon.AppIcons
import aiimin.designsystem.nav.LocalNavigator
import aiimin.designsystem.nav.Route
import aiimin.designsystem.nav.LocalToaster
import aiimin.designsystem.theme.Aiimin
import aiimin.designsystem.theme.Motion
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectHorizontalDragGestures
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import java.time.Instant
import java.time.ZoneId
import kotlin.math.abs
import kotlin.math.roundToInt
import kotlinx.coroutines.launch

/**
 * Review inbox (M2, handoff §5.14): one big card at a time, two peeking behind.
 * Swipe right = confirm, left = skip; buttons below do the same. Confirming never closes the screen.
 */
@Composable
fun MoneyInboxScreen(vm: InboxViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val toaster = LocalToaster.current
    val scope = rememberCoroutineScope()
    val pending by vm.pending.collectAsStateWithLifecycle()
    val c = Aiimin.colors
    val skipped = remember { mutableStateListOf<String>() }
    val ordered = remember(pending, skipped.toList()) { pending.sortedBy { if (it.id in skipped) 1 else 0 } }
    var menu by remember { mutableStateOf(false) }
    // edits live per card, keyed by id, so a skip keeps what you typed
    val cats = remember { mutableStateOf(mapOf<String, String>()) }
    val remember = remember { mutableStateOf(mapOf<String, Boolean>()) }
    // Merchant memory (plan §3): the place's name and what was bought, per card.
    val names = remember { mutableStateOf(mapOf<String, String>()) }
    val notes = remember { mutableStateOf(mapOf<String, String>()) }
    val spendCats by vm.categoriesOut.collectAsStateWithLifecycle()
    val incomeCats by vm.categoriesIn.collectAsStateWithLifecycle()
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar(if (pending.isEmpty()) "Review" else "Review · ${pending.size}", onBack = { nav.back() }) {
            AppIconButton(AppIcons.More, "More", { menu = !menu })
        }
        if (menu) {
            Row(Modifier.padding(horizontal = Aiimin.space.gutter).fillMaxWidth().clip(RoundedCornerShape(10.dp)).background(c.raised).padding(4.dp)) {
                Text(
                    "Confirm all as suggested",
                    style = Aiimin.type.bodyStrong,
                    modifier = Modifier.weight(1f).clip(RoundedCornerShape(8.dp)).clickable {
                        menu = false
                        scope.launch { ordered.forEach { vm.settle(it.id, cats.value[it.id] ?: it.category, Ledger.PERSONAL, it.title, true) }; toaster.show("Confirmed ${ordered.size} payments") }
                    }.padding(12.dp),
                )
                Text(
                    "Bring in past messages",
                    style = Aiimin.type.bodyStrong,
                    modifier = Modifier.weight(1f).clip(RoundedCornerShape(8.dp)).clickable { menu = false; nav.open(Route.SmsImport) }.padding(12.dp),
                )
            }
        }
        if (pending.isEmpty()) {
            Column(Modifier.fillMaxSize().padding(horizontal = 32.dp), horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.Center) {
                Icon(AppIcons.CheckCircleFill, null, tint = c.done, modifier = Modifier.size(56.dp))
                Spacer(Modifier.height(18.dp))
                Text("All caught up", style = Aiimin.type.cardTitle)
                Spacer(Modifier.height(6.dp))
                Text("New bank alerts land here as they arrive. Missed some? Bring in this month's messages, or start from an earlier month.", style = Aiimin.type.caption.copy(fontSize = 14.sp), textAlign = androidx.compose.ui.text.style.TextAlign.Center)
                Spacer(Modifier.height(24.dp))
                AppButton("Bring in past messages", { nav.open(Route.SmsImport) }, compact = true)
                Spacer(Modifier.height(8.dp))
                AppButton("Back to Money", { nav.back() }, kind = ButtonKind.GHOST, compact = true)
            }
            return@Column
        }
        val front = ordered.first()
        val index = pending.indexOf(front) + 1
        Column(Modifier.weight(1f).verticalScroll(rememberScrollState()).padding(horizontal = Aiimin.space.gutter).padding(top = 6.dp)) {
            val stackMid = c.stackMid
            val stackBack = c.stackBack
            Box(
                Modifier.padding(bottom = 20.dp).drawBehind {
                    val r = 16.dp.toPx()
                    if (ordered.size > 2) drawRoundRect(stackBack, androidx.compose.ui.geometry.Offset(18.dp.toPx(), 18.dp.toPx()), androidx.compose.ui.geometry.Size(size.width - 36.dp.toPx(), size.height), androidx.compose.ui.geometry.CornerRadius(r))
                    if (ordered.size > 1) drawRoundRect(stackMid, androidx.compose.ui.geometry.Offset(9.dp.toPx(), 9.dp.toPx()), androidx.compose.ui.geometry.Size(size.width - 18.dp.toPx(), size.height), androidx.compose.ui.geometry.CornerRadius(r))
                },
            ) {
                SwipeCard(
                    key = front.id,
                    onConfirm = { scope.launch { val place = names.value[front.id]?.trim()?.ifEmpty { null } ?: front.title; vm.settle(front.id, cats.value[front.id] ?: front.category, Ledger.PERSONAL, place, remember.value[front.id] ?: true, notes.value[front.id]); toaster.show("Confirmed ${Money.format(front.amountPaise)} · $place") } },
                    onSkip = { skipped.add(front.id) },
                ) {
                    val recent by produceState(emptyList<String>(), front.id) { value = vm.recentItems(front) }
                    ReviewCardBody(
                        front, index, pending.size,
                        name = names.value[front.id] ?: front.title, onName = { names.value = names.value + (front.id to it) },
                        cat = cats.value[front.id] ?: front.category, onCat = { cats.value = cats.value + (front.id to it) },
                        categories = if (front.direction == "in") incomeCats else spendCats,
                        onNewCategory = { raw -> scope.launch { vm.addCategory(raw, front.direction == "in")?.let { cats.value = cats.value + (front.id to it) } ?: toaster.show("That category already exists") } },
                        note = notes.value[front.id].orEmpty(), onNote = { notes.value = notes.value + (front.id to it) }, recent = recent,
                        rememberIt = remember.value[front.id] ?: true, onRemember = { remember.value = remember.value + (front.id to it) },
                    )
                }
            }
            Spacer(Modifier.height(28.dp))
        }
        Row(Modifier.fillMaxWidth().navigationBarsPadding().padding(horizontal = Aiimin.space.gutter).padding(bottom = 14.dp), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            AppButton("Skip", { skipped.add(front.id) }, Modifier.weight(1f), kind = ButtonKind.SECONDARY)
            AppButton(
                "Confirm",
                { scope.launch { val place = names.value[front.id]?.trim()?.ifEmpty { null } ?: front.title; vm.settle(front.id, cats.value[front.id] ?: front.category, Ledger.PERSONAL, place, remember.value[front.id] ?: true, notes.value[front.id]); toaster.show("Confirmed ${Money.format(front.amountPaise)} · $place") } },
                Modifier.weight(2f), icon = AppIcons.Check,
            )
        }
    }
}

/** Draggable wrapper: past a threshold the card flies off and the matching action fires. */
@Composable
private fun SwipeCard(key: String, onConfirm: () -> Unit, onSkip: () -> Unit, content: @Composable () -> Unit) {
    val density = LocalDensity.current
    val x = remember(key) { Animatable(0f) }
    val scope = rememberCoroutineScope()
    val threshold = with(density) { 110.dp.toPx() }
    val fly = with(density) { 420.dp.toPx() }
    Box(
        Modifier
            .offset { IntOffset(x.value.roundToInt(), 0) }
            .graphicsLayer { rotationZ = x.value / 40f; alpha = 1f - (abs(x.value) / (fly * 1.6f)).coerceIn(0f, 0.6f) }
            .pointerInput(key) {
                detectHorizontalDragGestures(
                    onDragEnd = {
                        scope.launch {
                            when {
                                x.value > threshold -> { x.animateTo(fly, Motion.exit()); onConfirm() }
                                x.value < -threshold -> { x.animateTo(-fly, Motion.exit()); onSkip() }
                                else -> x.animateTo(0f, Motion.springSoft())
                            }
                        }
                    },
                    onDragCancel = { scope.launch { x.animateTo(0f, Motion.springSoft()) } },
                ) { change, drag -> change.consume(); scope.launch { x.snapTo(x.value + drag) } }
            },
    ) { content() }
}

@OptIn(androidx.compose.foundation.layout.ExperimentalLayoutApi::class)
@Composable
private fun ReviewCardBody(
    d: TxnDraftEntity, index: Int, total: Int,
    name: String, onName: (String) -> Unit,
    cat: String, onCat: (String) -> Unit, categories: List<String>, onNewCategory: (String) -> Unit,
    note: String, onNote: (String) -> Unit, recent: List<String>,
    rememberIt: Boolean, onRemember: (Boolean) -> Unit,
) {
    var adding by remember(d.id) { mutableStateOf(false) }
    var newCat by remember(d.id) { mutableStateOf("") }
    val c = Aiimin.colors
    val shape = RoundedCornerShape(16.dp)
    val whenText = Instant.ofEpochMilli(d.detectedAt).atZone(ZoneId.systemDefault()).let { Dates.relative(it.toLocalDate(), java.time.LocalDate.now()) + " " + Dates.clock(it.toLocalTime()) }
    Column(Modifier.fillMaxWidth().clip(shape).background(c.surface).border(1.dp, c.border, shape).padding(18.dp)) {
        Row(Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
            Icon(if (d.source == "sms" || d.source == "paste") AppIcons.ChatText else AppIcons.BellSimple, null, tint = c.textMuted, modifier = Modifier.size(15.dp))
            Spacer(Modifier.width(6.dp))
            Text(
                when (d.source) { "sms" -> "From a bank SMS"; "paste" -> "Pasted SMS"; else -> "From a bank notification" },
                style = Aiimin.type.caption, modifier = Modifier.weight(1f),
            )
            Text("$index of $total", style = Aiimin.type.caption)
        }
        Spacer(Modifier.height(16.dp))
        Row(verticalAlignment = Alignment.Bottom) {
            Text(Money.format(d.amountPaise).removePrefix("−"), style = Aiimin.type.numberLarge.copy(fontSize = 48.sp, lineHeight = 50.sp))
            Spacer(Modifier.width(8.dp))
            Text(if (d.direction == "in") "Received" else "Paid", style = Aiimin.type.body.copy(color = c.textMuted), modifier = Modifier.padding(bottom = 6.dp))
        }
        Spacer(Modifier.height(12.dp))
        // Name the place once; the next alert from it arrives with this name (plan §3).
        AppTextField(name, onName, label = if (d.direction == "in") "From" else "Paid to", placeholder = "Shop or person")
        Spacer(Modifier.height(8.dp))
        Text(d.raw, style = Aiimin.type.code, maxLines = 3)
        if (d.confidence < 0.75) {
            Spacer(Modifier.height(12.dp))
            Text("Check the amount. The alert text was unclear.", style = Aiimin.type.label.copy(color = c.warn))
        }
        Spacer(Modifier.height(16.dp))
        Text("CATEGORY", style = Aiimin.type.eyebrow)
        Spacer(Modifier.height(8.dp))
        FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            (categories.ifEmpty { if (d.direction == "in") Categories.INCOME else Categories.SPEND }).forEach { k -> Pill(k, cat == k, { onCat(k) }) }
            Pill("New", adding, { adding = !adding }, icon = AppIcons.Plus)
        }
        if (adding) Row(Modifier.padding(top = 10.dp), verticalAlignment = Alignment.CenterVertically) {
            AppTextField(newCat, { newCat = it }, Modifier.weight(1f), placeholder = "Pet, Gym, Chai…")
            Spacer(Modifier.width(8.dp))
            AppButton("Add", { onNewCategory(newCat); newCat = ""; adding = false }, compact = true, enabled = newCat.isNotBlank())
        }
        if (d.direction != "in") {
            Spacer(Modifier.height(16.dp))
            AppTextField(note, onNote, label = "What did you buy?", placeholder = "Optional · chocolate, milk")
            if (recent.isNotEmpty()) FlowRow(Modifier.padding(top = 8.dp), horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                recent.forEach { r -> Pill(r, note.equals(r, ignoreCase = true), { onNote(r) }) }
            }
        }
        Spacer(Modifier.height(16.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(24.dp)) {
            Column {
                Text("LEDGER", style = Aiimin.type.eyebrow)
                Spacer(Modifier.height(8.dp))
                Pill("Personal", true, {})
            }
            Column {
                Text("WHEN", style = Aiimin.type.eyebrow)
                Spacer(Modifier.height(8.dp))
                Box(Modifier.heightIn(min = 36.dp).clip(RoundedCornerShape(6.dp)).background(c.raised).padding(horizontal = 12.dp), contentAlignment = Alignment.CenterStart) {
                    Text(whenText, style = Aiimin.type.label.copy(fontSize = 14.sp))
                }
            }
        }
        Spacer(Modifier.height(16.dp))
        Hairline2()
        Row(Modifier.fillMaxWidth().clickable { onRemember(!rememberIt) }.padding(top = 10.dp), verticalAlignment = Alignment.Top) {
            CheckCircle(rememberIt, { onRemember(!rememberIt) }, "Remember $name", modifier = Modifier.padding(top = 0.dp))
            Text("Remember ${name.ifBlank { d.title }} as $cat · next time it fills in by itself", style = Aiimin.type.body.copy(fontSize = 14.sp, lineHeight = 20.sp), modifier = Modifier.padding(top = 12.dp))
        }
    }
}

@Composable
private fun Hairline2() = Box(Modifier.fillMaxWidth().height(1.dp).background(Aiimin.colors.border))
