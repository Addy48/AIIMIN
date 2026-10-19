package aiimin.core.data.demo

import aiimin.core.data.core.DayClock
import aiimin.core.data.money.Ledger
import aiimin.core.data.money.MoneyRepository
import aiimin.core.data.notes.JournalRepository
import aiimin.core.data.notes.NoteRepository
import aiimin.core.data.plan.CalendarRepository
import aiimin.core.data.plan.DayPart
import aiimin.core.data.plan.MinimumRepository
import aiimin.core.data.plan.TaskRepository
import aiimin.core.data.settings.SettingsStore
import aiimin.core.data.util.newId
import aiimin.core.data.vault.FamilyRepository
import aiimin.core.data.vault.VaultRepository
import aiimin.core.database.DayStateDao
import aiimin.core.database.DayStateEntity
import aiimin.core.database.MoneyDao
import aiimin.core.data.settings.Codecs
import aiimin.core.engine.DaySnapshot
import aiimin.core.engine.DayType
import aiimin.core.engine.MinimumsTally
import aiimin.core.engine.Signals
import aiimin.core.engine.Tier
import aiimin.core.database.TxnEntity
import aiimin.core.privacy.HOUSEHOLD
import aiimin.core.privacy.Role
import android.content.Context
import android.graphics.Paint
import android.graphics.pdf.PdfDocument
import dagger.hilt.android.qualifiers.ApplicationContext
import java.io.File
import java.time.LocalDate
import java.time.LocalTime
import java.time.ZoneId
import javax.inject.Inject
import javax.inject.Singleton
import kotlin.random.Random

/**
 * Meera Kulkarni's sample life (plan §12.7 demo profile): a Pune product manager, Plus plan,
 * family Mom / Dad / Riya. Loaded on request from Settings, never mixed in automatically.
 * Everything goes through the real repositories so the engine, the log and the charts see it.
 */
@Singleton
class DemoSeeder @Inject constructor(
    @ApplicationContext private val context: Context,
    private val clock: DayClock,
    private val tasks: TaskRepository,
    private val calendar: CalendarRepository,
    private val minimums: MinimumRepository,
    private val money: MoneyRepository,
    private val moneyDao: MoneyDao,
    private val dayState: DayStateDao,
    private val minimumDao: aiimin.core.database.MinimumDao,
    private val notes: NoteRepository,
    private val journal: JournalRepository,
    private val family: FamilyRepository,
    private val vault: VaultRepository,
    private val settings: SettingsStore,
) {
    private val zone: ZoneId get() = clock.zone

    private fun at(day: LocalDate, h: Int, m: Int = 0): Long = day.atTime(h, m).atZone(zone).toInstant().toEpochMilli()

    suspend fun load(): String {
        // Idempotent: a second load would duplicate every person, task and document.
        val marker = context.getSharedPreferences("demo", Context.MODE_PRIVATE)
        if (marker.getBoolean("loaded", false)) return "Sample profile already loaded"
        marker.edit().putBoolean("loaded", true).apply()
        val today = clock.today()
        settings.update { it.copy(name = "Meera", onboarded = true, role = "default", banks = listOf("HDFC", "SBI Card"), primaryBank = "HDFC", cashWallet = true, city = "Pune") }
        family.ensureSelf("Meera")
        val mom = family.add("Mom", "Mother", Role.ELDER, false)
        val dad = family.add("Dad", "Father", Role.ELDER, false)
        val riya = family.add("Riya", "Sister", Role.ADULT, true)

        seedHistory(today)

        // ---- today: minimums, tasks, events
        val walk = minimums.add("Walk 20 minutes", "Walk to the gate", "body", startToday = true)
        val read = minimums.add("Read 10 pages", "Read one page", "mind", startToday = true)
        val plan = minimums.add("Plan my day", "Pick one thing", "discipline", startToday = true)
        runCatching { minimums.toggle(plan) }
        seedTicks(today, listOf(walk, read, plan))

        val done1 = tasks.create("Standup notes to Slack", today, "09:45", DayPart.MORNING, notes = "")
        val done2 = tasks.create("Review pitch deck copy", today, null, DayPart.MORNING, priority = 2)
        runCatching { tasks.toggle(done1); tasks.toggle(done2) }
        tasks.create("Call the CA about advance tax", today, "16:30", DayPart.AFTERNOON, priority = 2, notes = "Ask about the 15 Dec instalment and whether the freelance invoice counts.")
        tasks.create("Buy milk and eggs", today, null, DayPart.EVENING)
        tasks.create("Reply to landlord about renewal", today.minusDays(1), null, DayPart.MORNING)
        tasks.create("Renew car insurance (Dad)", today.plusDays(3), null, DayPart.MORNING, priority = 2)
        tasks.create("Book Lonavala venue", today.plusDays(4), null, DayPart.MORNING)
        tasks.create("Send Q4 roadmap draft", today.plusDays(2), "15:00", DayPart.AFTERNOON)
        tasks.create("Pay electricity bill", today.plusDays(6), null, DayPart.MORNING)
        tasks.create("Learn the basics of options pricing", null, null, DayPart.EVENING)
        suspend fun ev(title: String, d: LocalDate, h: Int, m: Int, mins: Int, loc: String = "") =
            calendar.create(title, java.time.Instant.ofEpochMilli(at(d, h, m)), java.time.Instant.ofEpochMilli(at(d, h, m) + mins * 60_000L), location = loc)
        ev("Daily standup", today, 10, 0, 15, "Google Meet")
        ev("Design review with Arjun", today, 15, 0, 30, "Google Meet")
        ev("Sprint planning", today.plusDays(1), 11, 0, 60, "Google Meet")
        ev("Mom's eye check-up", today.plusDays(2), 17, 30, 45, "Joshi Eye Hospital")
        ev("1:1 with manager", today.plusDays(3), 14, 0, 30)
        ev("Dinner with Riya", today.plusDays(6), 20, 0, 90, "Vaishali, FC Road")

        // ---- money: plan, this month, history
        money.setBudget(4_000_000, 1_200_000, mapOf("Food" to 700_000L, "Transport" to 350_000L, "Shopping" to 300_000L))
        seedMoney(today)

        // ---- notes + journal
        notes.save(
            null, "Lonavala offsite",
            "Book the venue by Friday. Budget is ₹48,000 for 14 people.\n\nAsk [[Arjun]] to share the Venue quote from Della.\n\n- [x] Shortlist two venues\n- [ ] Collect dietary list\n- [ ] Confirm bus from Baner",
            pinned = true,
        )
        notes.save(null, "Q4 roadmap thoughts", "Three bets: onboarding drop-off, search quality, offline mode. Drop everything else until December.\n\n- [ ] Write the one-pager")
        notes.save(null, "Gift ideas for Mom", "Silk dupatta from Pune Central, or the reading lamp she mentioned.")
        notes.save(null, "Books to read", "- [x] The Mom Test\n- [ ] Four Thousand Weeks\n- [ ] Deep Work")
        runCatching {
            journal.save("Long day but the pitch landed. Walked home instead of taking an auto, and called Mom on the way. I want more days that end like this one. Slept well the night before and it showed in how patient I was in the review.", 4, listOf("Work", "Family"))
        }

        // ---- vault: real PDFs so the viewer, OCR and expiry radar all work
        seedDoc("Car insurance · ICICI Lombard", dad, listOf("ICICI Lombard General Insurance", "Motor Vehicle Policy Schedule", "Policy No. OG-26-1102-4471", "Insured: Anil Kulkarni", "Vehicle: MH-12 KT 4471", "Period: 25 Oct 2025 to 24 Oct 2026", "Valid until 24/10/2026", "Premium paid: Rs 8,420"), today.plusDays(12))
        seedDoc("Passport", riya, listOf("Republic of India Passport", "Passport No. R5530881", "Surname: Kulkarni  Given name: Riya", "Date of expiry: 09/01/2027"), today.plusDays(89))
        seedDoc("Star Health family policy", ME_ID, listOf("Star Health and Allied Insurance", "Family Health Optima", "Policy No. 3001/2345/9921", "Covers 4 members", "Renewal due 02/01/2027"), today.plusDays(81))
        seedDoc("Rent agreement · Kothrud flat", HOUSEHOLD, listOf("Leave and licence agreement", "Property: Kothrud, Pune", "Licence period ends 31/05/2027"), LocalDate.of(2027, 5, 31))
        seedDoc("ECG report · Apollo", dad, listOf("Apollo Clinic Pune", "ECG report Aug 2026", "Normal sinus rhythm"), null)
        seedDoc("Prescription · Dr Iyer", mom, listOf("Dr Sneha Iyer MD", "Metformin 500 mg twice daily", "Review in 3 months"), null)
        return "Meera's sample life is loaded"
    }

    /**
     * The same four weeks as [seedHistory], as minimum ticks: without them the Minimums grid stayed empty
     * while Battery showed a 28-day streak (audit A-019). Uses the same "kept" rule as the history.
     */
    private suspend fun seedTicks(today: LocalDate, ids: List<String>) {
        ids.forEach { id -> minimumDao.get(id)?.let { minimumDao.upsert(it.copy(addedOn = today.minusDays(29).toString())) } }
        for (back in 28 downTo 1) {
            val d = today.minusDays(back.toLong())
            val good = back <= 10 || (back * 7 + 3) % 10 > 2
            val kept = if (good) 3 else if (back % 2 == 0) 2 else 1
            ids.take(kept).forEach { id ->
                minimumDao.upsertTick(aiimin.core.database.MinimumTickEntity(id, d.toString(), done = true, updatedAt = at(d, 20)))
            }
        }
    }

    /** Four weeks of closed days (frozen snapshots) so the score, trends and streaks have something to show. */
    private suspend fun seedHistory(today: LocalDate) {
        val rnd = Random(26)
        for (back in 28 downTo 1) {
            val d = today.minusDays(back.toLong())
            val weekend = d.dayOfWeek.value >= 6
            // Roughly seven of ten days land well, and the last ten in a row do: the sample shows a live streak.
            val good = back <= 10 || (back * 7 + 3) % 10 > 2
            val trend = (28 - back) / 28.0 // steady improvement
            fun jitter(base: Double, spread: Double) = (base + (rnd.nextDouble() - 0.5) * spread)
            val v = mutableMapOf<String, Double?>()
            val ev = mutableMapOf<String, Tier>()
            v[Signals.TASKS] = if (weekend) null else jitter(if (good) 82.0 else 45.0, 24.0).coerceIn(0.0, 100.0).also { ev[Signals.TASKS] = Tier.B }
            v[Signals.FOCUS] = jitter(if (good) 110.0 else 40.0, 50.0).coerceAtLeast(0.0).also { ev[Signals.FOCUS] = Tier.A }
            val planned = 3
            val kept = if (good) 3 else if (back % 2 == 0) 2 else 1
            v[Signals.MINIMUMS] = kept * 100.0 / planned; ev[Signals.MINIMUMS] = Tier.B
            v[Signals.STEPS] = jitter(5800.0 + trend * 2400.0 + if (weekend) 1500.0 else 0.0, 2600.0).coerceAtLeast(900.0).also { ev[Signals.STEPS] = Tier.A }
            v[Signals.SLEEP] = jitter(405.0 + trend * 25.0, 70.0).also { ev[Signals.SLEEP] = Tier.A }
            v[Signals.SCREEN_PERSONAL] = jitter(185.0 - trend * 45.0, 60.0).coerceAtLeast(40.0).also { ev[Signals.SCREEN_PERSONAL] = Tier.A }
            v[Signals.JOURNAL] = if (back % 3 == 0) 0.0 else 100.0; ev[Signals.JOURNAL] = Tier.B
            v[Signals.MONEY_LOGGING] = jitter(88.0, 16.0).coerceIn(0.0, 100.0).also { ev[Signals.MONEY_LOGGING] = Tier.A }
            v[Signals.FAMILY] = if (good || back % 4 != 0) 100.0 else 50.0; ev[Signals.FAMILY] = Tier.C
            val snap = DaySnapshot(d, v, ev, MinimumsTally(planned, kept, if (good) kept else 0), if (weekend) DayType.REST else DayType.WORK, mood = if (good) 4 else 3)
            val start = at(d, 7)
            dayState.upsert(DayStateEntity(day = d.toString(), startedAt = start, closedAt = at(d, 23, 30), settled = true, settledAt = at(d.plusDays(1), 12), snapshot = Codecs.encodeSnapshot(snap)))
        }
    }

    private suspend fun seedMoney(today: LocalDate) {
        val spendCats = mapOf(
            "Sharma Kirana" to "Grocery", "Swiggy" to "Food", "Ola" to "Transport", "Chaayos" to "Food", "Zomato" to "Food", "PMPML Metro" to "Transport",
            "Apollo Pharmacy" to "Health", "DMart" to "Grocery", "BookMyShow" to "Fun", "Blinkit" to "Grocery", "Uber" to "Transport", "Airtel" to "Bills",
            "Amazon" to "Shopping", "Myntra" to "Shopping", "Starbucks" to "Food", "Netflix" to "Subs", "Rapido" to "Transport", "Café Goodluck" to "Food", "Apollo Clinic" to "Health", "Auto" to "Transport",
        )
        // October so far: [day-of-month, hour, minute, payee, rupees] — sums per day match the design (₹18,420 by the 12th).
        val oct = listOf(
            listOf(1, 9, 10, "Sharma Kirana", 420), listOf(1, 13, 5, "Swiggy", 380), listOf(1, 18, 40, "Ola", 240), listOf(1, 19, 20, "Chaayos", 200),
            listOf(2, 12, 50, "Zomato", 450), listOf(2, 9, 0, "PMPML Metro", 130), listOf(2, 17, 10, "Apollo Pharmacy", 400),
            listOf(3, 11, 0, "DMart", 860), listOf(3, 20, 15, "Swiggy", 460), listOf(3, 16, 30, "BookMyShow", 200),
            listOf(4, 10, 20, "Blinkit", 340), listOf(4, 16, 5, "Chaayos", 220), listOf(4, 21, 10, "Ola", 200),
            listOf(5, 13, 15, "Swiggy", 520), listOf(5, 8, 40, "Uber", 380), listOf(5, 18, 50, "Sharma Kirana", 280),
            listOf(6, 10, 0, "Airtel", 599), listOf(6, 13, 30, "Zomato", 380), listOf(6, 10, 50, "Sharma Tea Stall", 30), listOf(6, 12, 10, "Sharma Tea Stall", 30), listOf(6, 15, 40, "Sharma Tea Stall", 31), listOf(6, 17, 20, "Sharma Tea Stall", 30),
            listOf(7, 14, 10, "Amazon", 640), listOf(7, 20, 0, "Swiggy", 300),
            listOf(8, 17, 45, "Myntra", 1340), listOf(8, 11, 20, "Blinkit", 420), listOf(8, 15, 0, "Starbucks", 380),
            listOf(9, 7, 0, "Netflix", 649), listOf(9, 13, 0, "Swiggy", 480), listOf(9, 19, 30, "Rapido", 551),
            listOf(10, 22, 40, "Ola", 1860), listOf(10, 13, 20, "Café Goodluck", 1260),
            listOf(11, 11, 40, "DMart", 940), listOf(11, 20, 10, "Swiggy", 520), listOf(11, 18, 0, "Rapido", 330),
            listOf(12, 9, 30, "Sharma Kirana", 360), listOf(12, 10, 40, "Chaayos", 450), listOf(12, 12, 5, "Apollo Clinic", 960), listOf(12, 14, 14, "Auto", 200),
        )
        val ym = java.time.YearMonth.from(today)
        oct.forEach { r ->
            val d = ym.atDay(r[0] as Int)
            if (d > today) return@forEach
            val title = r[3] as String
            insertTxn(d, r[1] as Int, r[2] as Int, title, spendCats[title] ?: "Food", (r[4] as Int) * 100L, "out", "notification")
        }
        insertTxn(ym.atDay(1), 10, 0, "Salary — Finlytic Pvt Ltd", "Salary", 8_500_000, "in", "notification")
        // History: Feb–Sep with the plan's own rhythm, so 3M / 6M / 1Y have real shape.
        val months = listOf(19_800, 21_800, 19_600, 24_100, 26_200, 22_700, 22_950, 23_400)
        val rnd = Random(7)
        val payees = spendCats.keys.toList()
        months.forEachIndexed { i, total ->
            val m = ym.minusMonths((months.size - i).toLong())
            var left = total
            var n = 0
            while (left > 150 && n < 34) {
                val amt = (if (left < 900) left else (150 + rnd.nextInt(1250))).coerceAtMost(left)
                val p = payees[rnd.nextInt(payees.size)]
                insertTxn(m.atDay(1 + rnd.nextInt(m.lengthOfMonth())), 9 + rnd.nextInt(12), rnd.nextInt(60), p, spendCats[p] ?: "Food", amt * 100L, "out", "notification")
                left -= amt
                n++
            }
            insertTxn(m.atDay(1), 10, 0, "Salary — Finlytic Pvt Ltd", "Salary", 8_500_000, "in", "notification")
        }
        // Bills with a steady rhythm, so Recurring (M13) has something to suggest.
        for (back in 1L..2L) {
            val m = ym.minusMonths(back)
            insertTxn(m.atDay(6), 10, 0, "Airtel", "Bills", 59_900, "out", "notification")
            insertTxn(m.atDay(9), 7, 0, "Netflix", "Subs", 64_900, "out", "notification")
        }
        // Café Goodluck on the 10th was dinner with Riya: split, she owes half.
        moneyDao.betweenNow(ym.atDay(10).toString(), ym.atDay(10).toString()).firstOrNull { it.title == "Café Goodluck" }?.let { t ->
            moneyDao.upsert(t.copy(splits = aiimin.core.data.money.Splits.encode(listOf(aiimin.core.data.money.SplitShare("name:riya", t.amountPaise / 2, name = "Riya")))))
        }
        // Detected, not booked: these float above on Money and fill the review inbox.
        listOf(
            "Rs.450.00 debited from A/c XX4421 to VPA swiggy8@ybl on ${today} UPI Ref 4821093",
            "Rs.180.00 debited from A/c XX4421 to VPA olamoney@ybl on ${today} UPI Ref 7712044",
            "Rs.380.00 debited from A/c XX4421 to VPA 9822104471@ybl Sharma Kirana on ${today} UPI Ref 5530918",
            "Rs 2,890.00 spent on SBI Card XX0918 at MYNTRA DESIGNS on ${today} Ref 9011223",
            "Bill pay Rs.1210 to MSEDCL Consumer 1700451120 card XX0918 Ref 3300194",
            "Rs.760.00 debited from A/c XX4421 to VPA pvrcinemas@ybl PVR Phoenix on ${today} UPI Ref 1188042",
        ).forEach { money.capture(it, "notification") }
    }

    private suspend fun insertTxn(day: LocalDate, h: Int, m: Int, title: String, cat: String, paise: Long, dir: String, source: String) {
        val t = at(day, h, m)
        moneyDao.upsert(
            TxnEntity(
                id = newId(), at = t, day = day.toString(), amountPaise = paise, direction = dir, title = title, category = cat,
                ledger = Ledger.PERSONAL.name, method = "UPI", source = source, account4 = "4421", createdAt = t,
            ),
        )
    }

    private val ME_ID = "me"

    private suspend fun seedDoc(title: String, owner: String, lines: List<String>, expires: LocalDate?) {
        val f = File(context.cacheDir, "demo_${newId()}.pdf")
        val pdf = PdfDocument()
        val page = pdf.startPage(PdfDocument.PageInfo.Builder(595, 842, 1).create())
        val paint = Paint().apply { textSize = 15f; isAntiAlias = true }
        var y = 80f
        lines.forEachIndexed { i, l ->
            paint.isFakeBoldText = i == 0
            paint.textSize = if (i == 0) 20f else 15f
            page.canvas.drawText(l, 48f, y, paint)
            y += if (i == 0) 40f else 28f
        }
        pdf.finishPage(page)
        f.outputStream().use { pdf.writeTo(it) }
        pdf.close()
        val r = vault.importFile(f, owner, "application/pdf", "pdf", title, sensitive = false)
        if (expires != null) runCatching { vault.setExpiry(r.docId, expires, renewalTask = true) }
    }
}
