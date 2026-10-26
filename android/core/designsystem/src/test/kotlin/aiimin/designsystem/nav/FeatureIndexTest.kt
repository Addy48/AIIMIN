package aiimin.designsystem.nav

import org.junit.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class FeatureIndexTest {

    private fun first(q: String) = FeatureIndex.match(q).firstOrNull()?.route

    @Test fun `partial name finds the emergency card first`() =
        assertEquals(Route.EmergencyCard("me"), first("emerg"))

    @Test fun `exact name wins`() = assertEquals(Route.Budget, first("budget"))

    @Test fun `plain-word synonym finds the feature`() = assertEquals(Route.PhoneDay, first("screen time"))

    @Test fun `backup finds backups`() = assertEquals(Route.VaultBackup, first("backup"))

    @Test fun `pin finds the account screen`() = assertEquals(Route.Account, first("pin"))

    @Test fun `review payments is found by sms`() = assertEquals(Route.MoneyInbox, first("sms"))

    @Test fun `open and go to are ignored`() {
        assertEquals(Route.Budget, first("open budget"))
        assertEquals(Route.Journal, first("go to journal"))
    }

    @Test fun `case and spaces do not matter`() = assertEquals(Route.Trash, first("  TRASH "))

    @Test fun `one letter matches nothing`() = assertTrue(FeatureIndex.match("b").isEmpty())

    @Test fun `nonsense matches nothing`() = assertTrue(FeatureIndex.match("zqxv").isEmpty())

    @Test fun `results are capped`() = assertTrue(FeatureIndex.match("se", limit = 4).size <= 4)

    @Test fun `every feature appears once`() {
        val routes = FeatureIndex.all.map { it.route }
        assertEquals(routes.size, routes.toSet().size, "duplicate routes")
        val titles = FeatureIndex.all.map { it.title.lowercase() }
        assertEquals(titles.size, titles.toSet().size, "duplicate titles")
    }

    @Test fun `the rare tools that failed the findability audit are searchable`() {
        val audited = listOf(
            Route.MoneySettings, Route.AiSettings, Route.Appearance, Route.Language, Route.Help, Route.About,
            Route.Conflicts, Route.Trash, Route.Privacy, Route.HealthPrivacy, Route.MoodYear, Route.MoneyInbox,
            Route.Journal, Route.EmergencyCard("me"),
        )
        val indexed = FeatureIndex.all.map { it.route }.toSet()
        audited.forEach { assertTrue(it in indexed, "$it is not in the index") }
    }

    private class FakeNav : AppNavigator {
        val calls = mutableListOf<String>()
        override fun open(route: Route) { calls += "open:$route" }
        override fun back() { calls += "back" }
        override fun tab(tab: Tab) { calls += "tab:$tab" }
        override fun capture(prefill: String?, voice: Boolean, type: String?) { calls += "capture" }
    }

    @Test fun `go switches tabs for dock areas and opens everything else`() {
        val nav = FakeNav()
        nav.go(Route.Money)
        nav.go(Route.Budget)
        assertEquals(listOf("tab:MONEY", "open:${Route.Budget}"), nav.calls)
    }

    private fun nav(text: String) = FeatureIndex.navigationMatches(text).map { it.route }

    @Test fun `plus sheet offers go-to for a feature name`() = assertEquals(Route.Budget, nav("budget").first())

    @Test fun `plus sheet offers go-to for open commands`() = assertEquals(Route.EmergencyCard("me"), nav("open emergency card").first())

    @Test fun `plus sheet stays quiet for real captures`() {
        assertTrue(nav("spent 240 on lunch, call Ravi at 5").isEmpty())
        assertTrue(nav("buy milk and eggs tomorrow morning").isEmpty())
        assertTrue(nav("paid 120 for chai").isEmpty())
    }

    @Test fun `plus sheet offers at most two`() = assertTrue(nav("se").size <= 2)
}
