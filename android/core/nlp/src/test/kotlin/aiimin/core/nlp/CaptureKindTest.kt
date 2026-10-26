package aiimin.core.nlp

import com.google.common.truth.Truth.assertThat
import java.time.LocalDate
import org.junit.Test

class CaptureKindTest {
    private fun kind(s: String) = first(s).kind

    // ---- P0-3 / P1: spending without the old verb list
    @Test fun `verbless spending is an expense`() {
        for (s in listOf("pizza - 8000", "gas cylinder 3500", "45 for gas cylinder", "tuition fees 12000", "maid 3000", "school fees 25000")) {
            assertThat(kind(s)).isEqualTo(Kind.EXPENSE)
        }
    }
    @Test fun `Hinglish spend phrases are expenses`() {
        for (s in listOf("chai pe 20 kharch", "auto ko 120 diye", "bijli bill 1850 bhara", "mummy ko 500 bheje", "kirana 2200 ka", "bike service 1200 lagi", "dawai 340 ki li")) {
            assertThat(kind(s)).isEqualTo(Kind.EXPENSE)
        }
    }
    @Test fun `income cues`() {
        assertThat(kind("cashback 50 mila")).isEqualTo(Kind.INCOME)
        assertThat(kind("Rahul ne 2500 bheje")).isEqualTo(Kind.INCOME)
        assertThat(kind("mummy ko 500 bheje")).isEqualTo(Kind.EXPENSE)
        assertThat(kind("salary credited 45000")).isEqualTo(Kind.INCOME)
    }
    @Test fun `kal with a spend verb is yesterday`() {
        assertThat(first("kal 800 ka khana order kiya").date).isEqualTo(TEST_TODAY.minusDays(1))
    }

    // ---- P0-4 / P0-3: tasks and events
    @Test fun `tasks with the verbs the old list missed`() {
        for (v in listOf("renew", "pay", "book", "visit", "drop", "order", "cancel", "text", "message", "pick up", "print", "water")) {
            val it = first("$v the thing tomorrow")
            assertThat(it.kind).isEqualTo(Kind.TASK)
            assertThat(it.date).isEqualTo(TEST_TODAY.plusDays(1))
        }
    }
    @Test fun `Hinglish tasks`() {
        val a = first("kal 5 baje Ravi ko call karna")
        assertThat(a.kind).isEqualTo(Kind.TASK)
        assertThat(a.date).isEqualTo(LocalDate.of(2026, 10, 21))
        assertThat(a.time24).isEqualTo("17:00")
        assertThat(first("aaj shaam gym jaana hai").kind).isEqualTo(Kind.TASK)
        assertThat(first("agle somvar bill bharna").date).isEqualTo(LocalDate.of(2026, 10, 26))
        assertThat(first("raat 10 baje dawai leni hai").time24).isEqualTo("22:00")
        assertThat(first("subah 7 baje uthna").time24).isEqualTo("07:00")
    }
    @Test fun `meetings and appointments are events`() {
        assertThat(kind("meeting with Arjun at 3pm tomorrow")).isEqualTo(Kind.EVENT)
        assertThat(kind("dentist appointment Friday 11am")).isEqualTo(Kind.EVENT)
        assertThat(kind("Mom's birthday on 12 December")).isEqualTo(Kind.EVENT)
        assertThat(first("flight to Goa on 3 Nov at 6:40am").time24).isEqualTo("06:40")
    }
    @Test fun `weekday and date forms`() {
        assertThat(first("call Ravi on Friday").date).isEqualTo(LocalDate.of(2026, 10, 23))
        assertThat(first("call Ravi next Monday").date).isEqualTo(LocalDate.of(2026, 10, 26))
        assertThat(first("call Ravi on 25th").date).isEqualTo(LocalDate.of(2026, 10, 25))
        assertThat(first("call Ravi on 3 Nov").date).isEqualTo(LocalDate.of(2026, 11, 3))
        assertThat(first("wedding on 15 Feb").date).isEqualTo(LocalDate.of(2027, 2, 15))
        assertThat(first("call Ravi day after tomorrow").date).isEqualTo(LocalDate.of(2026, 10, 22))
        assertThat(first("parso Ravi ko call karna").date).isEqualTo(LocalDate.of(2026, 10, 22))
    }

    // ---- P0-6: notes stay notes
    @Test fun `prefixes make notes and digits do not change that`() {
        for (s in listOf("note: dentist number 98 followed by X", "idea: weekend trip to Lonavala", "list: milk, eggs, bread, coffee", "note: flat 302 gate code 8890", "note: pin code 560037", "list: 2 shirts, 1 jeans, 4 socks")) {
            val a = analyze(s)
            assertThat(a.items).hasSize(1)
            assertThat(a.items.first().kind).isEqualTo(Kind.NOTE)
            assertThat(a.items.first().paise).isNull()
        }
    }
    @Test fun `a bare number is never money or a task`() {
        for (s in listOf("240", "500", "1200", "5 pm", "tomorrow")) assertThat(kind(s)).isEqualTo(Kind.CHOOSE)
    }

    // ---- P0-2: unsure means ask
    @Test fun `unknown text gets the chooser not a silent note`() {
        for (s in listOf("lunch", "call", "Ravi", "rent", "dentist", "ok")) assertThat(kind(s)).isEqualTo(Kind.CHOOSE)
    }
    @Test fun `forcing a type resolves the chooser`() {
        val a = CaptureEngine.analyze("lunch", TEST_NOW, forced = Kind.NOTE)
        assertThat(a.items.single().kind).isEqualTo(Kind.NOTE)
        val b = CaptureEngine.analyze("240", TEST_NOW, forced = Kind.EXPENSE)
        assertThat(b.items.single().kind).isEqualTo(Kind.EXPENSE)
        assertThat(b.items.single().paise).isEqualTo(24_000L)
    }

    // ---- P1 types
    @Test fun `journal lines`() {
        for (s in listOf("feeling anxious about exams tomorrow", "grateful for a calm morning", "aaj ka din bahut accha tha", "thoda thaka hua hu aaj", "journal: long day but the pitch landed", "mood 4 good day")) {
            assertThat(kind(s)).isEqualTo(Kind.JOURNAL)
        }
    }
    @Test fun `recurring money and routines`() {
        val rent = first("pay rent 15000 every month on 1st")
        assertThat(rent.kind).isEqualTo(Kind.RECURRING)
        assertThat(rent.paise).isEqualTo(1_500_000L)
        assertThat(rent.recurrence).isEqualTo("monthly")
        assertThat(first("netflix 649 monthly").kind).isEqualTo(Kind.RECURRING)
        assertThat(first("every Sunday call mom").recurrence).isEqualTo("weekly")
        assertThat(first("har mahine 2000 ki sip").paise).isEqualTo(200_000L)
    }
    @Test fun `document and expiry lines`() {
        val p = first("passport expires 3 March 2029")
        assertThat(p.kind).isEqualTo(Kind.DOCUMENT)
        assertThat(p.date).isEqualTo(LocalDate.of(2029, 3, 3))
        assertThat(kind("car insurance renewal on 14 Nov")).isEqualTo(Kind.DOCUMENT)
        assertThat(kind("renew passport tomorrow")).isEqualTo(Kind.TASK)
    }
    @Test fun `minimums and focus`() {
        for (s in listOf("walked 30 min", "meditated 10 minutes", "drank 3 litres water", "read 10 pages done", "ran 5k this morning")) assertThat(kind(s)).isEqualTo(Kind.MINIMUM)
        assertThat(kind("focus 25 minutes on report")).isEqualTo(Kind.FOCUS)
        assertThat(kind("pomodoro 25")).isEqualTo(Kind.FOCUS)
    }
    @Test fun `feature words open features`() {
        for (s in listOf("vault", "budget", "screen time", "weekly review")) assertThat(kind(s)).isEqualTo(Kind.FEATURE)
    }

    // ---- multi-intent
    @Test fun `two things in one line`() {
        val a = analyze("spend 240 on lunch and call Ravi at 5").items
        assertThat(a.map { it.kind }).containsExactly(Kind.EXPENSE, Kind.TASK).inOrder()
        assertThat(analyze("lunch 200 and chai 30 and auto 80").items.map { it.paise }).containsExactly(20_000L, 3_000L, 8_000L).inOrder()
        assertThat(analyze("split 1200 dinner with Riya and Karan").items).hasSize(1)
    }

    // ---- label clean-up
    @Test fun `labels carry no stray words`() {
        assertThat(first("dinner for 1,250.50").label).isEqualTo("Dinner")
        assertThat(first("paid 999 rupees for flight tickets").label).isEqualTo("Flight tickets")
        assertThat(first("usd 12.50 coffee at starbucks").label).isEqualTo("Coffee at starbucks")
        assertThat(first("paid 45 pounds for train to London").label).isEqualTo("Train to London")
    }
}
