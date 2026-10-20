package aiimin.designsystem.nav

import aiimin.designsystem.icon.AppIcons
import androidx.compose.runtime.Immutable
import androidx.compose.ui.graphics.vector.ImageVector

/** One place the app can open, described in the owner's own words. */
@Immutable
class FeatureEntry(
    val title: String,
    val subtitle: String,
    val keywords: List<String>,
    val route: Route,
    icon: () -> ImageVector,
) {
    val icon: ImageVector by lazy(icon)
}

/**
 * The single list of features. Search ("Go to"), the ＋ sheet's type-to-open and
 * Me all read from here, so a feature added once is findable everywhere.
 * Detail screens (one task, one payment) are content, found by content search.
 */
object FeatureIndex {

    private fun f(title: String, subtitle: String, route: Route, icon: () -> ImageVector, vararg keywords: String) =
        FeatureEntry(title, subtitle, keywords.toList(), route, icon)

    val all: List<FeatureEntry> = listOf(
        // Today and planning
        f("Today", "Your day on one screen", Route.Today, { AppIcons.CalendarCheck }, "home", "dashboard", "day"),
        f("Calendar", "Events and plans by day", Route.Calendar, { AppIcons.Calendar }, "events", "schedule", "agenda", "meetings"),
        f("Focus", "Timer for one thing", Route.Focus(), { AppIcons.Timer }, "pomodoro", "deep work", "timer", "concentrate"),
        f("Daily minimums", "The few things you keep every day", Route.Minimums, { AppIcons.CheckSquare }, "minimums", "habits", "routine", "kept days"),
        f("Upcoming tasks", "Everything planned ahead", Route.Upcoming, { AppIcons.ListChecks }, "tasks", "todo", "to do", "later"),
        f("Plan my day", "Pick what today is for", Route.PlanDay(), { AppIcons.Sunrise }, "plan", "morning", "schedule today"),
        f("Plan tomorrow", "Set up tomorrow tonight", Route.PlanDay(tomorrow = true), { AppIcons.MoonStars }, "tomorrow", "evening plan"),
        f("Evening debrief", "Close the day in two minutes", Route.Debrief, { AppIcons.Moon }, "debrief", "reflect", "end of day", "review day"),
        f("Goals", "What you're working towards", Route.Goals, { AppIcons.Target }, "goal", "targets", "ambitions", "okr"),
        f("Weekly review", "Look back at the week", Route.WeeklyReview, { AppIcons.CalendarDots }, "week", "weekly", "sunday"),
        f("Assistant", "Ask or tell AIIMIN anything", Route.Assistant(), { AppIcons.Sparkle }, "ai", "chat", "ask", "voice"),

        // Score and you
        f("Life Score", "How today is going", Route.Score, { AppIcons.Gauge }, "score", "points", "xp", "level"),
        f("Why this score", "Day by day, what moved it", Route.WhyScore, { AppIcons.ChartLineUp }, "explain score", "score history"),
        f("What counts for you", "Intentions, targets, weights", Route.Signals, { AppIcons.Sliders }, "signals", "weights", "intentions"),
        f("Discipline battery", "Energy left for hard things", Route.Battery, { AppIcons.BatteryHigh }, "battery", "energy", "willpower"),
        f("Phone day", "Screen time and unlocks", Route.PhoneDay, { AppIcons.DeviceMobile }, "screen time", "phone use", "unlocks", "pickups", "digital wellbeing", "apps"),
        f("Body", "Steps, sleep, heart rate", Route.Body, { AppIcons.Heartbeat }, "steps", "sleep", "heart", "health", "walk"),
        f("Patterns", "What goes with what", Route.Patterns, { AppIcons.ChartScatter }, "insights", "correlations", "trends"),
        f("Activity", "Everything you did, in order", Route.Activity, { AppIcons.ClockCounter }, "history", "log", "timeline"),
        f("Recent captures", "What you typed or said lately", Route.RecentCaptures, { AppIcons.Waveform }, "captures", "voice notes", "inbox"),
        f("Notifications", "Alerts and reminders", Route.Notifications, { AppIcons.Bell }, "alerts", "reminders", "bell"),

        // Notes and journal
        f("Notes", "Everything you wrote down", Route.Notes, { AppIcons.Note }, "note", "memo", "write"),
        f("Journal", "Private, encrypted on this phone", Route.Journal, { AppIcons.BookOpen }, "diary", "mood", "gratitude"),
        f("Write in journal", "Start today's entry", Route.JournalWrite(), { AppIcons.PenNib }, "new entry", "write journal", "dear diary"),
        f("Mood year", "A year of moods at a glance", Route.MoodYear, { AppIcons.Smiley }, "mood", "year in pixels", "feelings"),

        // Money
        f("Money", "Spending and your plan", Route.Money, { AppIcons.Wallet }, "spending", "expenses", "finance"),
        f("Review payments", "Bank messages waiting for a check", Route.MoneyInbox, { AppIcons.Receipt }, "sms", "bank sms", "review", "inbox", "approve", "transactions"),
        f("Budget", "Monthly plan and pace", Route.Budget, { AppIcons.PiggyBank }, "monthly plan", "limit", "pace"),
        f("All payments", "Every payment, searchable", Route.Payments, { AppIcons.ListBullets }, "payments", "transactions", "expenses list"),
        f("Bank and cash accounts", "Where your money sits", Route.Accounts, { AppIcons.Bank }, "accounts", "bank", "cash", "wallets"),
        f("Splits", "Who owes whom", Route.Splits, { AppIcons.HandCoins }, "split", "owe", "lent", "borrowed", "settle up"),
        f("Bills and subscriptions", "What's due next", Route.Recurring, { AppIcons.Repeat }, "bills", "recurring", "subscriptions", "emi", "rent"),
        f("Places and categories", "Shops AIIMIN remembers and your own categories", Route.PayeeMemory, { AppIcons.Bookmark }, "payee memory", "payees", "merchants", "places", "rules", "categories", "new category"),
        f("Money settings", "Ledgers, bank messages, payee memory", Route.MoneySettings, { AppIcons.Coins }, "ledgers", "currency", "sms import"),
        f("Past bank messages", "Bring in SMS one by one, by month or a whole year", Route.SmsImport, { AppIcons.ChatText }, "sms", "import", "bank sms", "old messages", "parse", "filter"),

        // Vault and family
        f("Vault", "Your family's papers", Route.Vault, { AppIcons.Archive }, "documents", "papers", "files"),
        f("Emergency card", "Blood group, allergies, contacts", Route.EmergencyCard("me"), { AppIcons.FirstAid }, "emergency", "medical", "blood group", "allergies", "sos", "ice"),
        f("Emergency kits", "What to grab when it matters", Route.EmergencyKits, { AppIcons.FirstAidKit }, "kit", "go bag", "disaster"),
        f("Family", "People and their papers", Route.Family, { AppIcons.Users }, "people", "members", "household"),
        f("Backups", "Keep a copy of your vault", Route.VaultBackup, { AppIcons.CloudArrowUp }, "backup", "export", "restore", "copy"),

        // Account and settings
        f("You", "Your progress, things and settings", Route.Me, { AppIcons.UserCircle }, "profile", "you"),
        f("Search", "Find anything", Route.Search, { AppIcons.Search }, "find", "look up"),
        f("Settings", "Every setting in one place", Route.Settings, { AppIcons.Gear }, "preferences", "options"),
        f("Account and sync", "Sign in, profile, what syncs", Route.Account, { AppIcons.Key }, "pin", "password", "sign in", "login", "os-id", "osid", "account"),
        f("What syncs", "Choose what leaves this phone", Route.SyncSettings, { AppIcons.ArrowsClockwise }, "sync", "cloud", "upload"),
        f("Edit profile", "Name and photo", Route.EditProfile, { AppIcons.Pencil }, "name", "photo", "avatar"),
        f("Plans", "Free, Plus, Pro, Family", Route.Plans, { AppIcons.StarFour }, "pricing", "upgrade", "pro", "plus"),
        f("Subscription", "Your current plan and billing", Route.Subscription, { AppIcons.CreditCard }, "billing", "payment method", "cancel"),
        f("Linked devices", "Browsers and phones on your account", Route.LinkedDevices, { AppIcons.Devices }, "devices", "sessions", "logout other", "browsers"),
        f("Phone data", "What the phone measures for you", Route.Sensors, { AppIcons.Pulse }, "sensors", "permissions", "health connect", "usage access"),
        f("Assistant and voice", "What it may read, recent captures", Route.AiSettings, { AppIcons.Mic }, "ai settings", "voice", "microphone"),
        f("Notification settings", "How many, which kinds, lock screen", Route.NotifySettings, { AppIcons.Bell }, "notification settings", "nudges", "quiet", "lock screen", "playful"),
        f("Raahi", "How chatty Raahi is: Full, Quiet or Off", Route.RaahiSettings, { AppIcons.ChatCircleText }, "raahi", "companion", "chatty", "greeting", "character"),
        f("About Raahi", "Who Raahi is and what it can see", Route.AboutRaahi, { AppIcons.Info }, "about raahi", "ai", "who is raahi"),
        f("Appearance", "Text size, motion", Route.Appearance, { AppIcons.TextAa }, "theme", "font size", "text size", "dark mode", "motion"),
        f("Language and region", "Language, currency, dates", Route.Language, { AppIcons.Translate }, "language", "hindi", "region", "date format"),
        f("How AIIMIN is running", "Background jobs and their last run", Route.Running, { AppIcons.Wrench }, "background", "jobs", "battery saver", "not updating"),
        f("Sync conflicts", "Two versions of the same thing", Route.Conflicts, { AppIcons.Swap }, "conflicts", "duplicates", "merge"),
        f("Trash", "Restore what you deleted", Route.Trash, { AppIcons.Trash }, "deleted", "restore", "bin", "undo delete"),
        f("Privacy", "What leaves this phone, and why", Route.Privacy, { AppIcons.ShieldCheck }, "data", "privacy policy", "delete my data"),
        f("Health data privacy", "How steps and sleep are used", Route.HealthPrivacy, { AppIcons.Stethoscope }, "health connect privacy", "health data"),
        f("Help", "Questions and contact", Route.Help, { AppIcons.Lifebuoy }, "support", "contact", "faq", "how to"),
        f("About and legal", "Version, privacy policy, terms", Route.About, { AppIcons.Info }, "version", "terms", "legal", "licences"),
    )

    private val verbs = listOf("open ", "go to ", "goto ", "show ", "show me ", "take me to ")

    private fun clean(q: String): String {
        var s = q.trim().lowercase().replace(Regex("\\s+"), " ")
        verbs.sortedByDescending { it.length }.firstOrNull { s.startsWith(it) }?.let { s = s.removePrefix(it) }
        return s.trim()
    }

    private fun score(e: FeatureEntry, q: String): Int {
        val title = e.title.lowercase()
        val words = title.split(' ')
        val keys = e.keywords.map { it.lowercase() }
        return when {
            title == q -> 100
            keys.any { it == q } -> 90
            title.startsWith(q) -> 80
            words.any { it.startsWith(q) } -> 70
            keys.any { it.startsWith(q) } -> 60
            keys.any { k -> k.split(' ').any { it.startsWith(q) } } -> 50
            q.length >= 4 && (title.contains(q) || keys.any { it.contains(q) }) -> 30
            else -> 0
        }
    }

    /**
     * For the ＋ sheet: offer "Go to …" only when the text reads like a place, not a capture —
     * it starts with open/go to/show, or it is a short phrase. "Spent 240 on lunch" stays quiet.
     */
    fun navigationMatches(text: String): List<FeatureEntry> {
        val t = text.trim().lowercase()
        val command = verbs.any { t.startsWith(it) }
        val words = t.split(Regex("\\s+")).count { it.isNotBlank() }
        if (!command && words > 3) return emptyList()
        if (!command && t.any { it.isDigit() }) return emptyList()
        return match(text, limit = 2)
    }

    /** Best matches for what was typed, strongest first. Needs at least two letters. */
    fun match(query: String, limit: Int = 6): List<FeatureEntry> {
        val q = clean(query)
        if (q.length < 2) return emptyList()
        return all.asSequence()
            .map { it to score(it, q) }
            .filter { it.second > 0 }
            .sortedWith(compareByDescending<Pair<FeatureEntry, Int>> { it.second }.thenBy { it.first.title.length })
            .take(limit)
            .map { it.first }
            .toList()
    }
}

/** Opens a feature: dock areas switch tabs (so the dock stays right), everything else opens on top. */
fun AppNavigator.go(route: Route) = when (route) {
    Route.Today -> tab(Tab.TODAY)
    Route.Money -> tab(Tab.MONEY)
    Route.Vault -> tab(Tab.VAULT)
    Route.Me -> tab(Tab.ME)
    else -> open(route)
}
