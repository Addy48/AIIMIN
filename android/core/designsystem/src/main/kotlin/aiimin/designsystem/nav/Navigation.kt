package aiimin.designsystem.nav

import aiimin.designsystem.component.Toaster
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.staticCompositionLocalOf

/** The four dock areas. Capture (＋) is a sheet, not a tab. */
enum class Tab { TODAY, MONEY, VAULT, ME }

/**
 * Every place the app can go. Screens for viewing; sheets (inside screens) for
 * creating and editing. Features only know this contract, never each other.
 */
@Immutable
sealed interface Route {
    // dock roots
    data object Today : Route
    data object Money : Route
    data object Vault : Route
    data object Me : Route

    // today / plan
    data class Task(val id: String) : Route
    data object Calendar : Route
    data class Focus(val taskId: String? = null, val minutes: Int = 25, val label: String? = null) : Route
    data object Minimums : Route
    data object Upcoming : Route
    data class PlanDay(val tomorrow: Boolean = false) : Route
    data object Debrief : Route
    data object Goals : Route
    data class Goal(val id: String?) : Route
    data object WeeklyReview : Route
    data object MonthlyReview : Route

    // score / me
    data object Score : Route
    data object Signals : Route
    data class Signal(val key: String) : Route
    data object Battery : Route
    data object Activity : Route
    data object Notifications : Route
    data object Search : Route
    data object Settings : Route
    data object Sensors : Route
    data object AiSettings : Route
    data object Account : Route
    data object SyncSettings : Route
    data object EditProfile : Route
    data object Plans : Route
    data object Subscription : Route
    data object LinkedDevices : Route
    data object MoneySettings : Route
    data object Appearance : Route
    data object Language : Route
    data object Help : Route
    data object About : Route
    /** How AIIMIN is running: Pulse jobs and their last runs. */
    data object Running : Route
    data object Conflicts : Route
    data object Trash : Route
    data class SignIn(val createAccount: Boolean = false) : Route
    data object Privacy : Route
    data object HealthPrivacy : Route
    data object PhoneDay : Route
    data object Body : Route
    data object WhyScore : Route
    data object Patterns : Route

    // money
    data object MoneyInbox : Route
    data class Txn(val id: String) : Route
    data object Budget : Route
    data object Payments : Route
    data class Category(val name: String) : Route
    data object Accounts : Route
    data object Splits : Route
    data class SplitPerson(val who: String) : Route
    data object Recurring : Route
    data object PayeeMemory : Route
    /** Past bank messages: one by one, a month, or a whole year, with a filter. */
    data object SmsImport : Route

    // vault / family
    data class Doc(val id: String) : Route
    data class Person(val id: String) : Route
    data object Family : Route
    data object VaultBackup : Route
    data object EmergencyKits : Route
    data class EmergencyCard(val personId: String) : Route

    // notes / journal
    data object Notes : Route
    data class Note(val id: String? = null) : Route
    data object Journal : Route
    data object MoodYear : Route
    data class JournalWrite(val id: String? = null) : Route

    // assistant
    data object RecentCaptures : Route
    data class Assistant(val prompt: String? = null, val context: String? = null, val autoSend: Boolean = false) : Route
}

interface AppNavigator {
    fun open(route: Route)
    fun back()
    fun tab(tab: Tab)
    /** Open the global capture sheet (＋), optionally pre-filled or with a quick type picked ("expense"). */
    fun capture(prefill: String? = null, voice: Boolean = false, type: String? = null)
}

val LocalNavigator = staticCompositionLocalOf<AppNavigator> { error("No navigator") }
val LocalToaster = staticCompositionLocalOf { Toaster() }
