package aiimin.app

import aiimin.app.ui.LaunchRequest
import aiimin.designsystem.nav.Route
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

class AppShortcutsTest {

    @Test fun `four shortcuts at most, as Android recommends`() =
        assertTrue(AppShortcuts.specs.size <= 4)

    @Test fun `labels fit the launcher menu`() = AppShortcuts.specs.forEach {
        assertTrue("short label too long: ${it.short}", it.short.length <= 10)
        assertTrue("long label too long: ${it.long}", it.long.length <= 25)
    }

    @Test fun `ids are unique`() =
        assertEquals(AppShortcuts.specs.size, AppShortcuts.specs.map { it.id }.toSet().size)

    @Test fun `each shortcut opens its screen`() {
        assertEquals(LaunchRequest.Capture(""), AppShortcuts.requestFor("capture"))
        assertEquals(LaunchRequest.Open(Route.MoneyInbox), AppShortcuts.requestFor("review"))
        assertEquals(LaunchRequest.Open(Route.EmergencyCard("me")), AppShortcuts.requestFor("emergency"))
        assertEquals(LaunchRequest.Open(Route.PhoneDay), AppShortcuts.requestFor("phoneday"))
    }

    @Test fun `every published shortcut is handled`() = AppShortcuts.specs.forEach {
        assertTrue("no screen for ${it.id}", AppShortcuts.requestFor(it.id) != null)
    }

    @Test fun `unknown ids open nothing`() = assertNull(AppShortcuts.requestFor("nope"))
}
