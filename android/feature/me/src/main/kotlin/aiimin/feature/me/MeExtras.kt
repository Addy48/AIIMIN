package aiimin.feature.me

import aiimin.core.data.app.PreferencesRepository
import aiimin.core.data.plan.Entitlement
import aiimin.core.data.plan.Period
import aiimin.core.data.plan.Plan
import aiimin.core.data.plan.PlanPrices
import aiimin.core.data.plan.PlayBillingRepository
import aiimin.core.data.plan.StoreState
import aiimin.core.data.settings.AppSettings
import aiimin.core.data.sync.AuthRepository
import aiimin.core.network.SessionInfoDto
import aiimin.designsystem.component.AppButton
import aiimin.designsystem.component.AppSheet
import aiimin.designsystem.component.AppTextField
import aiimin.designsystem.component.BrandMark
import aiimin.designsystem.component.ButtonKind
import aiimin.designsystem.component.Chevron
import aiimin.designsystem.component.DatePick
import aiimin.designsystem.component.EmptyState
import aiimin.designsystem.component.Hairline
import aiimin.designsystem.component.IconTile
import aiimin.designsystem.component.ListRow
import aiimin.designsystem.component.Pill
import aiimin.designsystem.component.PillRow
import aiimin.designsystem.component.SectionHeader
import aiimin.designsystem.component.Segmented
import aiimin.designsystem.component.SwitchRow
import aiimin.designsystem.component.Tag
import aiimin.designsystem.component.TopBar
import aiimin.designsystem.component.pressable
import aiimin.designsystem.icon.AppIcons
import aiimin.designsystem.nav.LocalNavigator
import aiimin.designsystem.nav.LocalToaster
import aiimin.designsystem.nav.Route
import aiimin.designsystem.theme.Aiimin
import android.app.Activity
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.ViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import dagger.hilt.android.qualifiers.ApplicationContext
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.util.Locale
import javax.inject.Inject
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

/** One place for contact details shown in the app (Help, About, Plans). */
object AppContact {
    const val SUPPORT_EMAIL = "support@aiimin.in"
    const val WEBSITE = "https://www.aiimin.in"
    const val PRIVACY = "https://www.aiimin.in/privacy"
    const val TERMS = "https://www.aiimin.in/terms"
}

private fun open(context: Context, url: String) = runCatching { context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url))) }

private fun appVersion(context: Context): String = runCatching {
    val p = context.packageManager.getPackageInfo(context.packageName, 0)
    "${p.versionName} (${if (Build.VERSION.SDK_INT >= 28) p.longVersionCode else @Suppress("DEPRECATION") p.versionCode.toLong()})"
}.getOrDefault("—")

// =================================================================== P2 Edit profile

private val ROLES = listOf(
    "student" to "Student", "default" to "Working professional", "freelancer" to "Freelancer or creator",
    "business" to "Business owner", "shift" to "Shift worker", "homemaker" to "Running the home",
    "creator" to "Screen-heavy work", "manual" to "Hands-on or field work", "blank" to "Something else",
)

@HiltViewModel
class ProfileViewModel @Inject constructor(private val prefs: PreferencesRepository) : ViewModel() {
    val settings = prefs.state.stateIn(viewModelScope, SharingStarted.Eagerly, null)
    fun save(change: (AppSettings) -> AppSettings) = viewModelScope.launch { prefs.update(change) }
}

/** P2 · Edit profile. Changing the role never rewrites your intentions on its own. */
@Composable
fun EditProfileScreen(vm: ProfileViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val toaster = LocalToaster.current
    val c = Aiimin.colors
    val s by vm.settings.collectAsStateWithLifecycle()
    val st = s ?: return
    var name by remember { mutableStateOf(st.name) }
    var role by remember { mutableStateOf(st.role) }
    var band by remember { mutableStateOf(st.ageBand) }
    var under by remember { mutableStateOf(false) }
    var city by remember { mutableStateOf(st.city) }
    var upi by remember { mutableStateOf(st.myUpiId) }
    var pickDob by remember { mutableStateOf(false) }
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar("Edit profile", onBack = { nav.back() })
        Column(Modifier.weight(1f).verticalScroll(rememberScrollState()).padding(horizontal = Aiimin.space.gutter)) {
            Box(Modifier.padding(top = 8.dp).size(64.dp).clip(RoundedCornerShape(12.dp)).background(c.text), contentAlignment = Alignment.Center) {
                Text(name.split(" ").filter { it.isNotBlank() }.take(2).joinToString("") { it.take(1).uppercase() }.ifBlank { "?" }, style = Aiimin.type.cardTitle.copy(color = c.base))
            }
            Spacer(Modifier.height(16.dp))
            AppTextField(name, { name = it }, label = "First name")
            SectionHeader("What your days are like")
            PillRow { ROLES.forEach { (k, label) -> Pill(label, role == k, { role = k }) } }
            if (role != st.role) Text("Your intentions stay as they are. Change them in What counts for you if this role should count different things.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 8.dp))
            SectionHeader("Optional")
            // PRD 4.7: only the age band is kept; a new date of birth is turned into a band and dropped.
            ListRow("Age", subtitle = band ?: "Not set", trailing = { Chevron() }, onClick = { pickDob = true })
            if (under) Text("AIIMIN accounts are for people 18 and over.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 4.dp))
            AppTextField(city, { city = it }, label = "City", placeholder = "Only used for greetings")
            Spacer(Modifier.height(12.dp))
            AppTextField(upi, { upi = it.trim() }, label = "Your UPI ID", placeholder = "you@bank")
            Text("Used to build pay links when someone owes you. AIIMIN never sends UPI collect requests and never sees your PIN.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 4.dp))
            Spacer(Modifier.height(20.dp))
            AppButton("Save", {
                vm.save { it.copy(name = name.trim(), role = role, ageBand = band, city = city.trim(), myUpiId = upi) }
                toaster.show("Saved"); nav.back()
            }, Modifier.fillMaxWidth(), enabled = name.isNotBlank() && (upi.isBlank() || upi.contains('@')))
            Spacer(Modifier.height(32.dp))
        }
    }
    if (pickDob) DatePick(LocalDate.now().minusYears(25), { d ->
        val b = aiimin.core.engine.profile.AgeBand.of(d, LocalDate.now())
        under = b == null
        if (b != null) band = b
        pickDob = false
    }, { pickDob = false })
}

// =================================================================== P3 Plans · P3a Compare · P4 Checkout · P5 Subscription

@HiltViewModel
class PlansViewModel @Inject constructor(private val billing: PlayBillingRepository) : ViewModel() {
    val store = billing.store
    val entitlement = billing.entitlement
    val outcome = billing.outcome
    init { viewModelScope.launch { billing.load() } }
    fun reload() = viewModelScope.launch { billing.load() }
    fun restore() = viewModelScope.launch { billing.refreshPurchases() }
    fun buy(activity: Activity, p: PlanPrices, period: Period) = billing.buy(activity, p, period)
    fun manageUrl(plan: Plan) = billing.manageUrl(plan)
}

/** P3 · Plans. Prices come from Google Play; declining is always one tap. */
@Composable
fun PlansScreen(vm: PlansViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val c = Aiimin.colors
    val store by vm.store.collectAsStateWithLifecycle()
    val ent by vm.entitlement.collectAsStateWithLifecycle()
    var period by remember { mutableStateOf(Period.MONTHLY) }
    var picked by remember { mutableStateOf<Plan?>(null) }
    var compare by remember { mutableStateOf(false) }
    var checkout by remember { mutableStateOf<PlanPrices?>(null) }
    val prices = (store as? StoreState.Ready)?.prices.orEmpty()
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar("Plans", onBack = { nav.back() }) { Text("Restore", style = Aiimin.type.labelLarge.copy(color = c.link), modifier = Modifier.pressable({ vm.restore() }).padding(12.dp)) }
        Column(Modifier.weight(1f).verticalScroll(rememberScrollState()).padding(horizontal = Aiimin.space.gutter)) {
            Text(
                if (ent.plan == Plan.FREE) "AIIMIN is free for one person, for as long as you like. Plans add more people, all your history and more help." else "You're on ${ent.plan.label}. Thank you for supporting AIIMIN.",
                style = Aiimin.type.body, modifier = Modifier.padding(top = 8.dp),
            )
            Spacer(Modifier.height(16.dp))
            Segmented(listOf("Monthly", "Yearly"), period.ordinal, { period = Period.entries[it] })
            when (val st = store) {
                StoreState.Loading -> Text("Loading prices from Google Play…", style = Aiimin.type.caption, modifier = Modifier.padding(top = 12.dp))
                StoreState.Offline -> StoreNote("Plans need internet to load prices.", "Try again") { vm.reload() }
                is StoreState.Unavailable -> StoreNote(st.why, null) {}
                StoreState.NotListed -> StoreNote("Paid plans aren't on sale in Google Play yet. Everything in Free works in full meanwhile.", "Check again") { vm.reload() }
                is StoreState.Ready -> Unit
            }
            Plan.entries.forEach { plan ->
                val pp = prices.firstOrNull { it.plan == plan }
                PlanBlock(plan, pp, period, current = ent.plan == plan, selected = picked == plan) { if (plan != ent.plan) picked = plan }
            }
            Text("Compare plans", style = Aiimin.type.labelLarge.copy(color = c.link), modifier = Modifier.padding(vertical = 16.dp).pressable({ compare = true }))
            SectionHeader("Plainly")
            Text(
                "No ads. No lending. We never sell your data. Prices include GST. Cancel anytime in Google Play. If you go back to Free, nothing is deleted.",
                style = Aiimin.type.body.copy(color = c.textMuted),
            )
            SectionHeader("Questions")
            Faq("Can I cancel anytime?", "Yes, in Google Play › Subscriptions. You keep the plan until the end of the period you paid for.")
            Faq("What happens to my data if I stop paying?", "Nothing is deleted. Features beyond Free pause; your history, documents and notes stay.")
            Faq("Is my data used to train AI?", "No.")
            Faq("Why is Free so generous?", "Because the things you need for yourself shouldn't be held back. Plans pay for more people, more history and more help.")
            Spacer(Modifier.height(24.dp))
        }
        Column(Modifier.fillMaxWidth().background(c.base).padding(horizontal = Aiimin.space.gutter, vertical = 12.dp)) {
            val sel = picked?.let { p -> prices.firstOrNull { it.plan == p } }
            val price = sel?.let { if (period == Period.YEARLY) it.yearly else it.monthly }
            if (sel == null || price == null) {
                AppButton(if (ent.plan == Plan.FREE) "Stay on Free" else "Keep ${ent.plan.label}", { nav.back() }, Modifier.fillMaxWidth(), kind = ButtonKind.SECONDARY)
            } else {
                AppButton("Continue with ${sel.plan.label} · ${price.formatted}/${if (period == Period.YEARLY) "year" else "month"}", { checkout = sel }, Modifier.fillMaxWidth())
                Text("Renews every ${if (period == Period.YEARLY) "year" else "month"} at ${price.formatted} incl. GST. Cancel anytime in Google Play.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 8.dp))
                Text("Stay on ${ent.plan.label}", style = Aiimin.type.labelLarge.copy(color = c.textMuted), modifier = Modifier.padding(top = 8.dp).pressable({ picked = null }).padding(vertical = 8.dp))
            }
        }
    }
    if (compare) CompareSheet { compare = false }
    checkout?.let { pp -> CheckoutSheet(vm, pp, period) { checkout = null } }
}

@Composable
private fun StoreNote(text: String, action: String?, onAction: () -> Unit) {
    val c = Aiimin.colors
    Column(Modifier.fillMaxWidth().padding(top = 12.dp).clip(RoundedCornerShape(12.dp)).background(c.raised).padding(16.dp)) {
        Text(text, style = Aiimin.type.body)
        if (action != null) Text(action, style = Aiimin.type.labelLarge.copy(color = c.link), modifier = Modifier.padding(top = 8.dp).pressable(onAction))
    }
}

@Composable
private fun PlanBlock(plan: Plan, pp: PlanPrices?, period: Period, current: Boolean, selected: Boolean, onClick: () -> Unit) {
    val c = Aiimin.colors
    val shape = RoundedCornerShape(14.dp)
    Column(
        Modifier.fillMaxWidth().padding(top = 12.dp).clip(shape).background(c.surface)
            .border(if (selected) 2.dp else 1.dp, if (selected) c.text else c.border, shape).pressable(onClick).padding(16.dp),
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text(plan.label, style = Aiimin.type.cardTitle, modifier = Modifier.weight(1f))
            if (current) Tag("Your plan")
        }
        Text(plan.promise, style = Aiimin.type.caption.copy(color = c.accentText, fontWeight = FontWeight.SemiBold))
        val price = aiimin.core.data.plan.planPriceLabel(plan, pp?.monthly?.formatted, pp?.yearly?.formatted, pp?.yearlySavingPct, yearly = period == Period.YEARLY)
        Text(price, style = Aiimin.type.headline, modifier = Modifier.padding(top = 8.dp))
        Text(plan.hero, style = Aiimin.type.body, modifier = Modifier.padding(top = 8.dp))
        // D-032: a real list with a hanging indent.
        aiimin.designsystem.component.BulletList(plan.adds, Modifier.padding(top = 8.dp), style = Aiimin.type.note)
        if (plan.coming.isNotEmpty()) {
            // Planned, shown on purpose, never sold as included today (A-036).
            Text("COMING", style = Aiimin.type.eyebrow, modifier = Modifier.padding(top = 12.dp))
            aiimin.designsystem.component.BulletList(plan.coming, Modifier.padding(top = 8.dp), style = Aiimin.type.note.copy(color = c.textFaint))
        }
    }
}

@Composable
private fun Faq(q: String, a: String) {
    var open by remember { mutableStateOf(false) }
    Column(Modifier.fillMaxWidth().pressable({ open = !open }).padding(vertical = 12.dp)) {
        // A caret shows the row opens (audit A-038).
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text(q, style = Aiimin.type.bodyStrong, modifier = Modifier.weight(1f))
            androidx.compose.material3.Icon(if (open) AppIcons.CaretUp else AppIcons.CaretDown, null, tint = Aiimin.colors.textMuted, modifier = Modifier.size(16.dp))
        }
        if (open) Text(a, style = Aiimin.type.body.copy(color = Aiimin.colors.textMuted), modifier = Modifier.padding(top = 4.dp))
    }
    Hairline()
}

private val COMPARE: List<Pair<String, List<Pair<String, List<String>>>>> = listOf(
    "Day" to listOf("Today, capture, tasks, calendar, focus" to listOf("✓", "✓", "✓", "✓"), "Life Score, journal, notes" to listOf("✓", "✓", "✓", "✓")),
    "Money" to listOf(
        "Bank alerts, review, budget" to listOf("✓", "✓", "✓", "✓"), "Household and Business ledgers" to listOf("—", "✓", "✓", "✓"),
        "Splits" to listOf("3 people", "Unlimited", "Unlimited", "Unlimited"), "Recurring bills, CSV for your CA" to listOf("—", "✓", "✓", "✓"),
    ),
    "Vault & family" to listOf(
        "Documents on your phone" to listOf("Unlimited", "Unlimited", "Unlimited", "Unlimited"), "Family profiles" to listOf("2", "6", "6", "6 people"),
        "Automatic vault backups (coming)" to listOf("Manual", "Weekly", "Weekly", "Weekly"), "Trusted people for emergency access (coming)" to listOf("1", "1", "3", "Any"),
    ),
    "Insight" to listOf("Chart history" to listOf("3 months", "All", "All", "All"), "Patterns, monthly review (coming)" to listOf("—", "—", "✓", "✓")),
    "Sync" to listOf("Linked browsers" to listOf("1", "4", "4", "4 each")),
)

/** P3a · the full comparison. Scrolls sideways inside the table only. */
@Composable
private fun CompareSheet(onDismiss: () -> Unit) {
    AppSheet(onDismiss, title = "Compare plans") {
        Row(Modifier.horizontalScroll(rememberScrollState())) {
            Column {
                Row { Cell("", 170.dp, true); Plan.entries.forEach { Cell(it.label, 92.dp, true) } }
                COMPARE.forEach { (group, rows) ->
                    Text(group.uppercase(), style = Aiimin.type.eyebrow, modifier = Modifier.padding(top = 16.dp, bottom = 4.dp))
                    rows.forEach { (label, cells) ->
                        Row(Modifier.padding(vertical = 4.dp)) { Cell(label, 170.dp); cells.forEach { Cell(it, 92.dp) } }
                        Hairline()
                    }
                }
            }
        }
    }
}

@Composable
private fun Cell(t: String, w: androidx.compose.ui.unit.Dp, head: Boolean = false) {
    Text(t, style = if (head) Aiimin.type.bodyStrong else Aiimin.type.note.copy(color = Aiimin.colors.text), modifier = Modifier.width(w).padding(end = 8.dp))
}

/** P4 · plan details, then Google Play's own payment sheet. */
@Composable
private fun CheckoutSheet(vm: PlansViewModel, pp: PlanPrices, period: Period, onDismiss: () -> Unit) {
    val context = LocalContext.current
    val nav = LocalNavigator.current
    val outcome by vm.outcome.collectAsStateWithLifecycle()
    val price = (if (period == Period.YEARLY) pp.yearly else pp.monthly)
    AppSheet(onDismiss, title = "${pp.plan.label} · ${if (period == Period.YEARLY) "yearly" else "monthly"}") {
        when (outcome) {
            "ok" -> {
                Text("You're on ${pp.plan.label}.", style = Aiimin.type.cardTitle)
                aiimin.designsystem.component.BulletList(pp.plan.adds.take(3), Modifier.padding(top = 8.dp))
                Spacer(Modifier.height(16.dp))
                AppButton("Done", { vm.outcome.value = null; onDismiss(); nav.back() }, Modifier.fillMaxWidth())
            }
            else -> {
                Text("${price?.formatted ?: "—"} every ${if (period == Period.YEARLY) "year" else "month"}, GST included. Starts today; renews until you cancel in Google Play.", style = Aiimin.type.body)
                Text("What changes right away: ${pp.plan.adds.first().lowercase()}.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 8.dp))
                outcome?.takeIf { it != "cancelled" }?.let { Text(it, style = Aiimin.type.body.copy(color = Aiimin.colors.link), modifier = Modifier.padding(top = 12.dp)) }
                Spacer(Modifier.height(16.dp))
                AppButton("Start", { (context as? Activity)?.let { vm.buy(it, pp, period) } }, Modifier.fillMaxWidth(), enabled = price != null && pp.plan != Plan.FAMILY)
                Row(Modifier.padding(top = 12.dp), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                    Text("Terms", style = Aiimin.type.label.copy(color = Aiimin.colors.link), modifier = Modifier.pressable({ open(context, AppContact.TERMS) }))
                    Text("How to cancel", style = Aiimin.type.label.copy(color = Aiimin.colors.link), modifier = Modifier.pressable({ open(context, vm.manageUrl(pp.plan)) }))
                }
            }
        }
    }
}

/** P5 · your subscription, read from Google Play. */
@Composable
fun SubscriptionScreen(vm: PlansViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val context = LocalContext.current
    val c = Aiimin.colors
    val ent by vm.entitlement.collectAsStateWithLifecycle()
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar("Your plan", onBack = { nav.back() })
        Column(Modifier.padding(horizontal = Aiimin.space.gutter)) {
            Text(ent.plan.label, style = Aiimin.type.title, modifier = Modifier.padding(top = 8.dp))
            Text(
                when {
                    ent.plan == Plan.FREE -> "Free for as long as you like."
                    ent.autoRenewing -> "Renews automatically through Google Play" + (ent.since?.let { " · since " + DateTimeFormatter.ofPattern("d MMM yyyy", Locale.ENGLISH).format(Instant.ofEpochMilli(it).atZone(ZoneId.systemDefault())) } ?: "")
                    else -> "Cancelled. It stays on until the end of the period you paid for."
                },
                style = Aiimin.type.body.copy(color = c.textMuted),
            )
            ent.orderId?.let { Text("Order $it", style = Aiimin.type.caption, modifier = Modifier.padding(top = 4.dp)) }
            Spacer(Modifier.height(20.dp))
            AppButton(if (ent.plan == Plan.FREE) "See plans" else "Change plan", { nav.open(Route.Plans) }, Modifier.fillMaxWidth())
            if (ent.plan != Plan.FREE) {
                Spacer(Modifier.height(8.dp))
                AppButton("Manage or cancel in Google Play", { open(context, vm.manageUrl(ent.plan)) }, Modifier.fillMaxWidth(), kind = ButtonKind.SECONDARY)
                Text("If you cancel: nothing is deleted. Features beyond Free pause at the end of the period.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 12.dp))
            }
            Text("Restore purchases", style = Aiimin.type.labelLarge.copy(color = c.link), modifier = Modifier.padding(top = 16.dp).pressable({ vm.restore() }).padding(vertical = 8.dp))
        }
    }
}

// =================================================================== SE2 Linked devices

@HiltViewModel
class DevicesViewModel @Inject constructor(private val auth: AuthRepository) : ViewModel() {
    val sessions = MutableStateFlow<List<SessionInfoDto>?>(null)
    val own = MutableStateFlow<String?>(null)
    val failed = MutableStateFlow(false)
    val signedIn = auth.session.stateIn(viewModelScope, SharingStarted.Eagerly, null)
    init { load() }
    fun load() = viewModelScope.launch {
        own.value = auth.ownToken()
        val s = auth.linkedSessions()
        failed.value = s == null
        sessions.value = s.orEmpty().sortedByDescending { it.updatedAt }
    }
    fun remove(token: String) = viewModelScope.launch { if (auth.revokeSession(token)) load() }
}

private fun deviceName(ua: String?): String {
    val u = ua.orEmpty()
    val browser = when {
        "Edg/" in u -> "Edge"; "Chrome/" in u && "Android" !in u -> "Chrome"; "Firefox/" in u -> "Firefox"; "Safari/" in u && "Chrome" !in u -> "Safari"
        "okhttp" in u.lowercase() || "Android" in u -> "AIIMIN on Android"; else -> "Browser"
    }
    val os = when { "Windows" in u -> " on Windows"; "Mac OS" in u -> " on Mac"; "Linux" in u && "Android" !in u -> " on Linux"; "iPhone" in u -> " on iPhone"; else -> "" }
    return browser + os
}

/** SE2 · signed-in browsers and phones, from the account's sessions on aiimin.in. */
@Composable
fun LinkedDevicesScreen(vm: DevicesViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val c = Aiimin.colors
    val list by vm.sessions.collectAsStateWithLifecycle()
    val own by vm.own.collectAsStateWithLifecycle()
    val failed by vm.failed.collectAsStateWithLifecycle()
    val session by vm.signedIn.collectAsStateWithLifecycle()
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar("Linked devices", onBack = { nav.back() })
        if (session?.signedIn != true) {
            EmptyState(AppIcons.Devices, "Not signed in", "Sign in to aiimin.in to see the browsers and phones on your account.", action = "Sign in", onAction = { nav.open(Route.SignIn()) })
            return@Column
        }
        Column(Modifier.weight(1f).verticalScroll(rememberScrollState()).padding(horizontal = Aiimin.space.gutter)) {
            if (failed) StoreNote("Couldn't reach aiimin.in. Check your connection.", "Try again") { vm.load() }
            list.orEmpty().forEach { s ->
                val mine = s.token != null && s.token == own
                Row(Modifier.fillMaxWidth().heightIn(min = 64.dp).padding(vertical = 8.dp), verticalAlignment = Alignment.CenterVertically) {
                    IconTile(if ((s.userAgent ?: "").contains("Android") || (s.userAgent ?: "").lowercase().contains("okhttp")) AppIcons.DeviceMobile else AppIcons.Desktop)
                    Spacer(Modifier.width(12.dp))
                    Column(Modifier.weight(1f)) {
                        Text(deviceName(s.userAgent) + if (mine) " · this phone" else "", style = Aiimin.type.bodyStrong)
                        Text(listOfNotNull(s.ipAddress, s.updatedAt?.take(10)?.let { "active $it" }).joinToString(" · "), style = Aiimin.type.caption)
                    }
                    if (!mine && s.token != null) Text("Remove", style = Aiimin.type.labelLarge.copy(color = c.link), modifier = Modifier.pressable({ vm.remove(s.token!!) }).padding(12.dp))
                }
                Hairline()
            }
            Text(
                "To add a browser, sign in on aiimin.in with your OS-ID or email and PIN. Removing one signs it out at once.",
                style = Aiimin.type.caption, modifier = Modifier.padding(top = 16.dp, bottom = 32.dp),
            )
        }
    }
}

// =================================================================== SE7 Money settings

/** SE7 · Money: ledgers, accounts, payee memory, roll-ups, bills, export. */
@Composable
fun MoneySettingsScreen(vm: ProfileViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val c = Aiimin.colors
    val s by vm.settings.collectAsStateWithLifecycle()
    val st = s ?: return
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar("Money settings", onBack = { nav.back() })
        Column(Modifier.weight(1f).verticalScroll(rememberScrollState()).padding(horizontal = Aiimin.space.gutter)) {
            SectionHeader("Ledgers")
            SwitchRow("Household", "HOUSEHOLD" in st.ledgersOn, { on -> vm.save { it.copy(ledgersOn = if (on) it.ledgersOn + "HOUSEHOLD" else it.ledgersOn - "HOUSEHOLD") } }, subtitle = "Rent, groceries and bills you share at home")
            SwitchRow("Business", "BUSINESS" in st.ledgersOn, { on -> vm.save { it.copy(ledgersOn = if (on) it.ledgersOn + "BUSINESS" else it.ledgersOn - "BUSINESS") } }, subtitle = "Kept apart from personal money and never in your Life Score")
            SectionHeader("Small payments")
            Text("Payments below this roll up per payee per week on Money (each still counts once in your budget).", style = Aiimin.type.caption)
            PillRow { listOf(50, 100, 200, 500).forEach { r -> Pill("Under ₹$r", st.rollupBelow == r, { vm.save { it.copy(rollupBelow = r) } }) } }
            SectionHeader("More")
            ListRow("Bank messages", subtitle = "Bring in past SMS, choose which banks and payments count", leading = { IconTile(AppIcons.ChatText) }, trailing = { Chevron() }, opens = Route.SmsImport, onClick = { nav.open(Route.SmsImport) })
            ListRow("Accounts", subtitle = "Banks, cards, wallets, cash · primary per ledger", leading = { IconTile(AppIcons.Bank) }, trailing = { Chevron() }, opens = Route.Accounts, onClick = { nav.open(Route.Accounts) })
            ListRow("Places and rules", subtitle = "Your rules, shops AIIMIN remembers, what you bought, your own categories", leading = { IconTile(AppIcons.Tag) }, trailing = { Chevron() }, opens = Route.PayeeMemory, onClick = { nav.open(Route.PayeeMemory) })
            ListRow("Recurring and bills", subtitle = "Subscriptions, rent, AutoPay", leading = { IconTile(AppIcons.Repeat) }, trailing = { Chevron() }, opens = Route.Recurring, onClick = { nav.open(Route.Recurring) })
            ListRow("Splits", subtitle = "Who owes whom", leading = { IconTile(AppIcons.Handshake) }, trailing = { Chevron() }, opens = Route.Splits, onClick = { nav.open(Route.Splits) })
            ListRow("Monthly plan", subtitle = "Total, fixed costs and category caps", leading = { IconTile(AppIcons.Target) }, trailing = { Chevron() }, opens = Route.Budget, onClick = { nav.open(Route.Budget) })
            Text("Currency is ₹. Bank messages are read on this phone and their text stays here.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 16.dp, bottom = 32.dp))
        }
    }
}

// =================================================================== SE11 Appearance · SE12 Language

/** SE11 · Appearance and accessibility. Light is the only designed theme for now. */
@Composable
fun AppearanceScreen(vm: ProfileViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val c = Aiimin.colors
    val s by vm.settings.collectAsStateWithLifecycle()
    val st = s ?: return
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar("Appearance", onBack = { nav.back() })
        Column(Modifier.weight(1f).verticalScroll(rememberScrollState()).padding(horizontal = Aiimin.space.gutter)) {
            SectionHeader("Theme")
            ListRow("Light", subtitle = "Paper background all day.", leading = { IconTile(AppIcons.Sun) }, maxSubtitleLines = 2)
            SectionHeader("Text size")
            Text("On top of your phone's own text size.", style = Aiimin.type.caption)
            PillRow { listOf(0.9f to "Smaller", 1f to "Default", 1.15f to "Larger", 1.3f to "Largest").forEach { (v, l) -> Pill(l, kotlin.math.abs(st.textScale - v) < 0.01f, { vm.save { it.copy(textScale = v) } }) } }
            // A labelled sample, so the line reads as a preview of the chosen size, not stray text (audit A-033).
            Text("Preview", style = Aiimin.type.caption, modifier = Modifier.padding(top = 12.dp))
            Text("Your day so far · ₹1,240 spent · 3 of 3 kept", style = Aiimin.type.body.let { b -> b.copy(fontSize = b.fontSize * st.textScale, lineHeight = b.lineHeight * st.textScale) }, modifier = Modifier.padding(top = 2.dp))
            SectionHeader("Motion and touch")
            SwitchRow("Reduce motion", st.reduceMotion, { v -> vm.save { it.copy(reduceMotion = v) } }, subtitle = "Movement becomes a short fade")
            SwitchRow("Haptics", st.haptics, { v -> vm.save { it.copy(haptics = v) } }, subtitle = "A light tick when scrubbing charts and confirming")
            Spacer(Modifier.height(32.dp))
        }
    }
}

/** SE12 · Language and region. */
@Composable
fun LanguageScreen(vm: ProfileViewModel = hiltViewModel()) {
    val nav = LocalNavigator.current
    val c = Aiimin.colors
    val s by vm.settings.collectAsStateWithLifecycle()
    val st = s ?: return
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar("Language and region", onBack = { nav.back() })
        Column(Modifier.weight(1f).verticalScroll(rememberScrollState()).padding(horizontal = Aiimin.space.gutter)) {
            SectionHeader("App language")
            ListRow("English (India)", subtitle = "You can speak or type in Hindi or Hinglish too", leading = { IconTile(AppIcons.Translate) })
            SectionHeader("Voice")
            PillRow { listOf("en-IN" to "English (India)", "hi-IN" to "हिन्दी", "auto" to "Auto").forEach { (k, l) -> Pill(l, st.voiceLanguage == k, { vm.save { it.copy(voiceLanguage = k) } }) } }
            Text("What capture listens for. Auto follows your phone's language.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 4.dp))
            SectionHeader("Formats")
            ListRow("Dates", subtitle = "Day first · " + DateTimeFormatter.ofPattern("EEE, d MMM yyyy", Locale.ENGLISH).format(LocalDate.now()))
            ListRow("Numbers", subtitle = "Indian grouping · ₹1,31,600")
            ListRow("Time zone", subtitle = ZoneId.systemDefault().id + " · follows the phone")
            Spacer(Modifier.height(32.dp))
        }
    }
}

// =================================================================== SE13 Help · SE14 About

private val GUIDES = listOf(
    "Today" to "Your day as a line from 7 AM to 11 PM. Minimums are the small things you keep every day; the stat line shows your score, minimums and focus.",
    "Capture" to "Tap ＋ and type or speak several things at once: \"meeting at 3, buy milk, spent 200 on auto\". Each becomes a card you can edit before saving, and everything can be undone.",
    "Money" to "Bank alerts and pasted SMS land in Review. Nothing is booked until you confirm. Payee memory learns categories; splits and bills live under Money.",
    "Vault" to "Documents stay on your phone, are read on your phone, and their expiry dates become reminders. Back them up to a place you choose.",
    "Life Score" to "Only ever compared with you. It comes from your own intentions and settles at noon the next day. Wellness information, not medical advice.",
    "Sync" to "Signed in, the kinds you switch on in Sync settings are kept on aiimin.in as plain text so the website can show them. Documents never sync.",
)

/** SE13 · Help and feedback. */
@Composable
fun HelpScreen() {
    val nav = LocalNavigator.current
    val context = LocalContext.current
    val c = Aiimin.colors
    var feedback by remember { mutableStateOf("") }
    var diag by remember { mutableStateOf(true) }
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar("Help and feedback", onBack = { nav.back() })
        Column(Modifier.weight(1f).verticalScroll(rememberScrollState()).padding(horizontal = Aiimin.space.gutter)) {
            SectionHeader("How AIIMIN works")
            GUIDES.forEach { (t, b) -> Faq(t, b) }
            SectionHeader("Send feedback")
            AppTextField(feedback, { feedback = it }, placeholder = "What worked, what didn't, what you expected", singleLine = false, minLines = 4)
            SwitchRow("Include app version and phone model", diag, { diag = it })
            AppButton("Send by email", {
                val body = feedback + if (diag) "\n\n—\nAIIMIN ${appVersion(context)} · Android ${Build.VERSION.RELEASE} · ${Build.MANUFACTURER} ${Build.MODEL}" else ""
                val i = Intent(Intent.ACTION_SENDTO, Uri.parse("mailto:")).putExtra(Intent.EXTRA_EMAIL, arrayOf(AppContact.SUPPORT_EMAIL)).putExtra(Intent.EXTRA_SUBJECT, "AIIMIN feedback").putExtra(Intent.EXTRA_TEXT, body)
                runCatching { context.startActivity(i) }
            }, Modifier.fillMaxWidth(), enabled = feedback.isNotBlank(), icon = AppIcons.EnvelopeSimple)
            Text("Opens your mail app; nothing is sent until you press send there.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 8.dp))
            SectionHeader("Contact")
            ListRow(AppContact.SUPPORT_EMAIL, subtitle = "Support, privacy and data requests", leading = { IconTile(AppIcons.EnvelopeSimple) }, onClick = {
                runCatching { context.startActivity(Intent(Intent.ACTION_SENDTO, Uri.parse("mailto:${AppContact.SUPPORT_EMAIL}"))) }
            })
            Spacer(Modifier.height(32.dp))
        }
    }
}

/** SE14 · About and legal. */
@Composable
fun AboutScreen() {
    val nav = LocalNavigator.current
    val context = LocalContext.current
    val c = Aiimin.colors
    var licences by remember { mutableStateOf(false) }
    Column(Modifier.fillMaxSize().background(c.base)) {
        TopBar("About", onBack = { nav.back() })
        Column(Modifier.weight(1f).verticalScroll(rememberScrollState()).padding(horizontal = Aiimin.space.gutter)) {
            Row(Modifier.padding(top = 12.dp), verticalAlignment = Alignment.CenterVertically) {
                BrandMark(size = 44.dp)
                Spacer(Modifier.width(12.dp))
                Column {
                    Text("AIIMIN", style = Aiimin.type.headline.copy(fontWeight = FontWeight.Bold, letterSpacing = 1.8.sp))
                    Text("Version ${appVersion(context)} · Score Engine rules 3.0.0", style = Aiimin.type.caption)
                }
            }
            Text("Your day, your money and your family's papers, in one calm place.", style = Aiimin.type.bodyStrong, modifier = Modifier.padding(top = 16.dp))
            Text("No ads, no lending, no selling data. It only ever compares you with you.", style = Aiimin.type.body, modifier = Modifier.padding(top = 4.dp))
            ListRow("How AIIMIN is running", subtitle = "Background jobs and when each last ran", leading = { IconTile(AppIcons.Pulse) }, trailing = { Chevron() }, opens = Route.Running, onClick = { nav.open(Route.Running) }, modifier = Modifier.padding(top = 12.dp))
            SectionHeader("Legal")
            ListRow("Privacy Policy", leading = { IconTile(AppIcons.ShieldCheck) }, trailing = { Chevron() }, onClick = { open(context, AppContact.PRIVACY) })
            ListRow("Terms", leading = { IconTile(AppIcons.Scroll) }, trailing = { Chevron() }, onClick = { open(context, AppContact.TERMS) })
            ListRow("Health Connect data use", subtitle = "Steps and sleep are read to score your own day and never leave this phone", leading = { IconTile(AppIcons.Heartbeat) }, trailing = { Chevron() }, opens = Route.HealthPrivacy, onClick = { nav.open(Route.HealthPrivacy) }, maxSubtitleLines = 2)
            ListRow("Open-source licences", leading = { IconTile(AppIcons.Code) }, trailing = { Chevron() }, onClick = { licences = true })
            Text("Wellness information, not medical advice. For personal budgeting only; not investment, tax or credit advice.", style = Aiimin.type.caption, modifier = Modifier.padding(top = 16.dp, bottom = 32.dp))
        }
    }
    if (licences) AppSheet({ licences = false }, title = "Open-source licences") {
        listOf(
            "Funnel Display, Golos Text" to "SIL Open Font License 1.1",
            "Phosphor Icons" to "MIT",
            "AndroidX, Compose, Room, WorkManager, DataStore" to "Apache License 2.0",
            "Hilt and Dagger, Retrofit, OkHttp" to "Apache License 2.0",
            "kotlinx.serialization, kotlinx.coroutines" to "Apache License 2.0",
            "Vico charts" to "Apache License 2.0",
            "ML Kit, Play Billing" to "Android SDK licence",
        ).forEach { (n, l) -> ListRow(n, subtitle = l) }
    }
}
