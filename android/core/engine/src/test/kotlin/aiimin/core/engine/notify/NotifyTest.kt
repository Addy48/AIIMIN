package aiimin.core.engine.notify

import java.time.LocalDate
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotEquals
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

class NotifyPolicyTest {
    private fun c(rule: String, kind: Kind = Kind.NUDGE, cat: Category = Category.DAY, at: Int = 600, p: Int = 1) =
        Candidate(rule, "$rule:1", kind, cat, at, p, "t", "b", "today")
    private val ctx = PolicyContext(nowMinute = 600, quietFrom = 22 * 60, quietTo = 7 * 60, allowance = 4)

    @Test fun reminderArrivesOnTimeOnAFourNudgeDay() {
        val d = NotifyPolicy.decide(listOf(c("task.soon", Kind.PROMISE, Category.REMINDERS)), ctx.copy(nudgesShownToday = 4, lastNudgeMinute = 590))
        assertEquals(Delivery.POST_NOW, d.single().delivery)
        val later = NotifyPolicy.decide(listOf(c("task.soon", Kind.PROMISE, Category.REMINDERS, at = 640)), ctx.copy(nudgesShownToday = 4))
        assertEquals(Delivery.SCHEDULE, later.single().delivery)
        assertEquals(640, later.single().atMinute)
    }

    @Test fun newUserGetsAtMostOneNudgeOnDayOne() {
        val allowance = NudgeBudget.allowance(openedNudges = 0, ceiling = 4)
        assertEquals(1, allowance)
        val d = NotifyPolicy.decide(listOf(c("a", p = 2), c("b"), c("c")), ctx.copy(allowance = allowance))
        assertEquals(1, d.count { it.delivery == Delivery.POST_NOW })
        assertEquals(2, d.count { it.delivery == Delivery.DIGEST })
    }

    @Test fun threeOpenedNudgesRaiseTheBudgetUpToTheCeiling() {
        assertEquals(1, NudgeBudget.allowance(2, 4))
        assertEquals(2, NudgeBudget.allowance(3, 4))
        assertEquals(4, NudgeBudget.allowance(30, 4))
        assertEquals(6, NudgeBudget.allowance(30, 6))
        assertEquals(2, NudgeBudget.allowance(30, 2))
        assertEquals(6, NudgeBudget.allowance(30, 9))
    }

    @Test fun threeIgnoredInOneCategoryAsksStopThese() {
        val h = listOf(NudgeOutcome(Category.DAY, 1, false), NudgeOutcome(Category.DAY, 2, false), NudgeOutcome(Category.INSIGHTS, 2, true), NudgeOutcome(Category.DAY, 3, false))
        assertEquals(Category.DAY, NudgeBudget.stopAsk(h, emptySet()))
        assertNull(NudgeBudget.stopAsk(h, setOf(Category.DAY)))
        // One opened among the last three: no ask.
        assertNull(NudgeBudget.stopAsk(h.take(1) + NudgeOutcome(Category.DAY, 2, true) + h.last(), emptySet()))
        // An open earlier than the last three does not matter.
        assertEquals(Category.DAY, NudgeBudget.stopAsk(listOf(NudgeOutcome(Category.DAY, 0, true)) + h, emptySet()))
    }

    @Test fun channelOffOrPermissionDeniedGoesToTheInbox() {
        val off = NotifyPolicy.decide(listOf(c("money.bill", Kind.PROMISE, Category.MONEY)), ctx.copy(channelsOff = setOf(Category.MONEY)))
        assertEquals(Delivery.IN_APP, off.single().delivery)
        val denied = NotifyPolicy.decide(listOf(c("x", Kind.CRITICAL, Category.SECURITY), c("y")), ctx.copy(allowed = false))
        assertTrue(denied.all { it.delivery == Delivery.IN_APP })
    }

    @Test fun quietHoursHoldNudgesSilencePromisesButNotCritical() {
        val night = ctx.copy(nowMinute = 23 * 60)
        val d = NotifyPolicy.decide(listOf(c("n", at = 23 * 60), c("p", Kind.PROMISE, Category.REMINDERS, at = 23 * 60), c("s", Kind.CRITICAL, Category.SECURITY, at = 23 * 60)), night)
        assertEquals(Delivery.IN_APP, d.first { it.candidate.rule == "n" }.delivery)
        assertEquals(Delivery.POST_NOW, d.first { it.candidate.rule == "p" }.delivery)
        assertTrue(d.first { it.candidate.rule == "p" }.silent)
        assertEquals(Delivery.POST_NOW, d.first { it.candidate.rule == "s" }.delivery)
        assertFalse(d.first { it.candidate.rule == "s" }.silent)
    }

    @Test fun nudgesAreSpacedThreeHoursApart() {
        val d = NotifyPolicy.decide(listOf(c("n")), ctx.copy(lastNudgeMinute = 540))
        assertEquals(Delivery.SCHEDULE, d.single().delivery)
        assertEquals(720, d.single().atMinute)
        // Two due together: the first posts, the second waits three hours.
        val two = NotifyPolicy.decide(listOf(c("a", p = 2), c("b")), ctx)
        assertEquals(Delivery.POST_NOW, two.first { it.candidate.rule == "a" }.delivery)
        assertEquals(780, two.first { it.candidate.rule == "b" }.atMinute)
        // A wait that would land in quiet hours folds into the wrap-up instead.
        assertEquals(Delivery.DIGEST, NotifyPolicy.decide(listOf(c("n", at = 21 * 60)), ctx.copy(nowMinute = 21 * 60, lastNudgeMinute = 20 * 60)).single().delivery)
    }

    @Test fun stoppedCategoriesAndInfoStayInApp() {
        assertEquals(Delivery.IN_APP, NotifyPolicy.decide(listOf(c("n")), ctx.copy(stopped = setOf(Category.DAY))).single().delivery)
        assertEquals(Delivery.IN_APP, NotifyPolicy.decide(listOf(c("i", Kind.INFO)), ctx).single().delivery)
    }

    @Test fun timingWaitsForTwoWeeksAndFiveOpens() {
        val opens = listOf(430, 440, 450, 460, 470)
        assertEquals(480, NotifyTiming.bestMinute(opens, historyDays = 10, default = 480, window = 360..660))
        assertEquals(480, NotifyTiming.bestMinute(opens.take(4), historyDays = 20, default = 480, window = 360..660))
        assertEquals(450, NotifyTiming.bestMinute(opens, historyDays = 20, default = 480, window = 360..660))
        assertEquals(660, NotifyTiming.bestMinute(List(5) { 800 }, historyDays = 20, default = 480, window = 360..660))
    }
}

class NotifyCopyTest {
    @Test fun noLineBreaksTheVoiceRules() {
        NotifyCopy.catalogue.forEach { (rule, variants) ->
            assertTrue(rule, variants.isNotEmpty())
            variants.forEach { v ->
                val text = (v.title + " " + v.body).lowercase()
                NotifyCopy.banned.forEach { b -> assertFalse("$rule: $b", Regex("\\b${Regex.escape(b)}\\b").containsMatchIn(text)) }
                assertFalse(rule, text.contains("!"))
                assertTrue("$rule title", v.title.length <= 48)
                assertTrue("$rule body", v.body.length <= 110)
            }
        }
    }

    @Test fun plainRulesHaveOneLineAndPlayfulRotates() {
        NotifyCopy.plainRules.forEach { assertEquals(it, 1, NotifyCopy.catalogue.getValue(it).size) }
        val plain = (0L..6L).map { NotifyCopy.pick("day.light", it, emptyMap(), playful = false) }.toSet()
        assertEquals(1, plain.size)
        val playful = (0L..6L).map { NotifyCopy.pick("day.light", it, emptyMap(), playful = true) }.toSet()
        assertEquals(2, playful.size)
        assertNotEquals(NotifyCopy.pick("day.light", 0, emptyMap(), true), NotifyCopy.pick("day.light", 1, emptyMap(), true))
    }

    @Test fun nameIsDroppedWhenNotAllowedOrBlank() {
        assertEquals("Good morning", NotifyCopy.pick("day.brief", 0, mapOf("name" to "", "summary" to "x"), false).title)
        assertEquals("Good morning", NotifyCopy.pick("day.brief", 0, mapOf("name" to "Meera", "summary" to "x"), false, useName = false).title)
        assertEquals("Good morning, Meera", NotifyCopy.pick("day.brief", 0, mapOf("name" to "Meera", "summary" to "x"), false).title)
    }
}

class NotifyRulesTest {
    private val day = LocalDate.of(2026, 10, 21) // a Wednesday
    private fun snap(now: Int = 600, f: NotifySnapshot.() -> NotifySnapshot = { this }) = NotifySnapshot(today = day, nowMinute = now, installDays = 5).f()

    @Test fun noteReminderArrivesAtItsMinuteAndALockedNoteShowsNoTitle() {
        val c = NotifyRules.candidates(snap { copy(noteReminders = listOf(NoteReminder("n1", "Call the CA", 9 * 60, false), NoteReminder("n2", "Secret plan", 11 * 60, true))) })
        val open = c.first { it.rule == "note.remind" }
        assertEquals(9 * 60, open.atMinute)
        assertEquals(Kind.PROMISE, open.kind)
        assertEquals("Call the CA", open.title)
        val locked = c.first { it.rule == "note.remind.locked" }
        assertFalse(locked.title.contains("Secret") || locked.body.contains("Secret"))
        assertTrue(locked.sensitive)
    }

    @Test fun eventsAndTimedTasksAreRemindersTenMinutesBefore() {
        val cs = NotifyRules.candidates(snap { copy(events = listOf(EventSoon("e", "Standup", 630)), timedTasks = listOf(TaskTimed("t", "Call CA", 700))) })
        val e = cs.first { it.rule == "event.soon" }
        assertEquals(Kind.PROMISE, e.kind); assertEquals(620, e.atMinute); assertEquals(Category.REMINDERS, e.category)
        assertEquals("Standup in 10 minutes", e.title)
        assertEquals(690, cs.first { it.rule == "task.soon" }.atMinute)
        // A started event is not reminded again.
        assertTrue(NotifyRules.candidates(snap(now = 640) { copy(events = listOf(EventSoon("e", "Standup", 630))) }).none { it.rule == "event.soon" })
    }

    @Test fun aTaskHalfAnHourPastStaysInTheInbox() {
        val c = NotifyRules.candidates(snap(now = 760) { copy(timedTasks = listOf(TaskTimed("t", "Call CA", 700))) }).single { it.routeArg == "t" }
        assertEquals("task.still", c.rule); assertEquals(Kind.INFO, c.kind)
    }

    @Test fun billsAndDocumentsAreSensitivePromises() {
        val cs = NotifyRules.candidates(snap { copy(bills = listOf(BillTomorrow("b", "Rent", "₹18,000")), docs = listOf(DocExpiry("d", "Passport", 30), DocExpiry("p", "PAN", 80))) })
        val bill = cs.first { it.rule == "money.bill" }
        assertTrue(bill.sensitive); assertEquals(Kind.PROMISE, bill.kind); assertEquals("Rent ₹18,000 is due tomorrow", bill.title)
        assertEquals(Kind.PROMISE, cs.first { it.routeArg == "d" }.kind)
        assertEquals(Kind.INFO, cs.first { it.routeArg == "p" }.kind)
        assertTrue(cs.filter { it.category == Category.VAULT || it.category == Category.MONEY }.all { it.sensitive })
    }

    @Test fun minimumsNudgeOnlyWhenSomeAreLeftAndNotPaused() {
        assertTrue(NotifyRules.candidates(snap { copy(minimumsLeft = listOf("Walk")) }).any { it.rule == "day.minimums" })
        assertTrue(NotifyRules.candidates(snap { copy(minimumsLeft = listOf("Walk"), paused = true) }).none { it.rule == "day.minimums" })
        assertTrue(NotifyRules.candidates(snap { copy(minimumsLeft = listOf("Walk"), nudgesOn = false) }).none { it.rule == "day.minimums" })
        assertEquals("1 minimum left today", NotifyRules.candidates(snap { copy(minimumsLeft = listOf("Walk")) }).first { it.rule == "day.minimums" }.title)
    }

    @Test fun morningBriefStartsOnDayThree() {
        assertTrue(NotifyRules.candidates(snap(now = 480) { copy(installDays = 0) }).none { it.rule == "day.brief" })
        assertTrue(NotifyRules.candidates(snap(now = 480) { copy(installDays = 1) }).none { it.rule == "day.brief" })
        val b = NotifyRules.candidates(snap(now = 480) { copy(installDays = 2, firstName = "Meera", minimumsLeft = listOf("a", "b")) }).first { it.rule == "day.brief" }
        assertEquals("Good morning, Meera", b.title); assertEquals("2 minimums.", b.body)
    }

    @Test fun paymentsToReviewWaitForTheWrapUp() {
        val c = NotifyRules.candidates(snap { copy(pendingPayments = 3) }).single { it.rule == "money.review" }
        assertEquals(Kind.INFO, c.kind); assertEquals("3 payments to review", c.title)
        assertNull(NotifyRules.wrapUp(day, 21 * 60, emptyList(), false))
        assertEquals("1 thing to look at when you have a minute.", NotifyRules.wrapUp(day, 21 * 60, listOf(c), false)!!.body)
    }

    @Test fun aRenewedDocumentOrALaterBackupLapseIsRemindedAgain() {
        val old = NotifyRules.candidates(snap { copy(docs = listOf(DocExpiry("d", "Passport", 7, "2026-10-28"))) }).first { it.routeArg == "d" }.key
        val renewed = NotifyRules.candidates(snap { copy(docs = listOf(DocExpiry("d", "Passport", 7, "2036-10-28"))) }).first { it.routeArg == "d" }.key
        assertNotEquals(old, renewed)
        val a = NotifyRules.candidates(snap { copy(docCount = 1, lastBackupDays = 15, lastBackupDay = "2026-10-06") }).first { it.rule == "vault.backup" }.key
        val b = NotifyRules.candidates(snap { copy(docCount = 1, lastBackupDays = 15, lastBackupDay = "2026-12-01") }).first { it.rule == "vault.backup" }.key
        assertNotEquals(a, b)
    }

    @Test fun aWrapUpCarryingMoneyIsPrivate() {
        val money = Candidate("x", "budget:1", Kind.NUDGE, Category.MONEY, 0, 1, "80% of the month plan used", "b", "money")
        val day = Candidate("y", "light:1", Kind.NUDGE, Category.DAY, 0, 1, "A lighter day", "b", "today")
        assertTrue(NotifyRules.wrapUp(this.day, 1290, listOf(day, money), false)!!.sensitive)
        assertFalse(NotifyRules.wrapUp(this.day, 1290, listOf(day), false)!!.sensitive)
    }

    @Test fun everyRuleLineIsFreeOfGuiltWords() {
        val all = NotifyRules.candidates(snap(now = 480) {
            copy(installDays = 9, events = listOf(EventSoon("e", "Standup", 630)), timedTasks = listOf(TaskTimed("t", "Call", 700), TaskTimed("u", "Old", 400)),
                bills = listOf(BillTomorrow("b", "Rent", "₹1")), docs = listOf(DocExpiry("d", "Passport", 0), DocExpiry("x", "Card", -3)), docCount = 2,
                minimumsLeft = listOf("Walk"), lightDay = true, pendingPayments = 1, budgetShare = 85)
        }) + NotifyRules.candidates(snap { copy(today = LocalDate.of(2026, 10, 25), weekLabel = "43") })
        assertTrue(all.size >= 10)
        all.forEach { c -> NotifyCopy.banned.forEach { b -> assertFalse("${c.rule}: $b", Regex("\\b$b\\b").containsMatchIn((c.title + " " + c.body).lowercase())) } }
    }
}
