package aiimin.core.data.money

import aiimin.core.data.core.DayClock
import aiimin.core.data.core.EventLogger
import aiimin.core.data.notify.NotificationRepository
import aiimin.core.data.settings.SettingsStore
import aiimin.core.database.MoneyDao
import aiimin.core.database.TxnDraftEntity
import aiimin.core.engine.Tier
import aiimin.core.nlp.SiftResult
import aiimin.core.nlp.SiftedSms
import aiimin.core.nlp.SkipReason
import aiimin.core.nlp.SmsFilter
import aiimin.core.nlp.SmsMessage
import aiimin.core.nlp.SmsSift
import android.content.Context
import androidx.work.CoroutineWorker
import androidx.work.ExistingWorkPolicy
import androidx.work.OneTimeWorkRequestBuilder
import androidx.work.WorkManager
import androidx.work.WorkerParameters
import dagger.hilt.EntryPoint
import dagger.hilt.InstallIn
import dagger.hilt.android.EntryPointAccessors
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import java.time.Instant
import java.time.LocalDate
import java.time.YearMonth
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.distinctUntilChanged
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.withContext

/**
 * Past bank messages, three ways (plan §3A): one by one, a month at a time, or a whole year in
 * the background. Messages are read and parsed on this phone, sorted by [SmsSift] (OTPs, offers,
 * collect requests, failed payments and statements never become payments), narrowed by the
 * person's [SmsFilter], and land in Review. Nothing is booked until the person confirms.
 */
@Singleton
class SmsImporter @Inject constructor(
    @ApplicationContext private val context: Context,
    private val money: MoneyRepository,
    private val dao: MoneyDao,
    private val settings: SettingsStore,
    private val notifications: NotificationRepository,
    private val clock: DayClock,
    private val log: EventLogger,
) {
    val filter: Flow<SmsFilter> = settings.settings.map { SmsFilter.decode(it.smsFilter) }.distinctUntilChanged()
    val yearRun: Flow<SmsYearRun?> = settings.settings.map { SmsYearRun.decode(it.smsYearRun) }.distinctUntilChanged()

    fun canRead(): Boolean = money.canReadSms()

    suspend fun setFilter(f: SmsFilter) = settings.update { it.copy(smsFilter = f.encode()) }

    /** Everything a month (or several) of messages would bring in, before anything is added. */
    data class Preview(val read: Int, val sift: SiftResult, val fresh: List<SiftedSms>, val already: Int)

    data class Result(val read: Int, val added: Int, val already: Int, val skipped: Map<SkipReason, Int>)

    /** The inbox between the first day of the earliest month and the end of the latest, oldest first. Null without permission. */
    suspend fun read(months: List<YearMonth>): List<SmsMessage>? = withContext(Dispatchers.IO) {
        if (!canRead() || months.isEmpty()) return@withContext null
        val zone = clock.zone
        val from = months.min().atDay(1).atStartOfDay(zone).toInstant().toEpochMilli()
        val to = months.max().plusMonths(1).atDay(1).atStartOfDay(zone).toInstant().toEpochMilli()
        val out = mutableListOf<SmsMessage>()
        context.contentResolver.query(
            android.net.Uri.parse("content://sms/inbox"), arrayOf("address", "body", "date"),
            "date >= ? AND date < ?", arrayOf(from.toString(), to.toString()), "date ASC",
        )?.use { c ->
            val ai = c.getColumnIndexOrThrow("address")
            val bi = c.getColumnIndexOrThrow("body")
            val di = c.getColumnIndexOrThrow("date")
            while (c.moveToNext()) {
                val body = c.getString(bi) ?: continue
                out += SmsMessage(c.getString(ai).orEmpty(), body, c.getLong(di))
            }
        }
        out
    }

    suspend fun preview(months: List<YearMonth>, f: SmsFilter): Preview? {
        val msgs = read(months) ?: return null
        val sift = SmsSift.sift(msgs, f)
        val fresh = sift.kept.filterNot { seen(it) }
        return Preview(msgs.size, sift, fresh, sift.kept.size - fresh.size)
    }

    /** Already booked, already in Review, or skipped before. */
    private suspend fun seen(s: SiftedSms): Boolean {
        val ref = s.alert.reference
        return if (ref != null) dao.countByRef(ref) > 0 || dao.draftCountByRef(ref) > 0 else dao.draftCountByRaw(s.message.body.take(500)) > 0
    }

    /** A month at a time (or a list of months): every fresh payment goes to Review. */
    suspend fun importMonths(months: List<YearMonth>, f: SmsFilter): Result? {
        val p = preview(months, f) ?: return null
        openTrackFrom(months.min())
        var added = 0
        for (s in p.fresh) if (money.capture(s.message.body, "sms", s.message.at) is MoneyRepository.Capture.Added) added++
        log.log("txn.sms_import", data = mapOf("months" to months.size, "added" to added), tier = Tier.A, source = "user")
        return Result(p.read, added, p.already + (p.fresh.size - added), p.sift.skipped)
    }

    /** One by one: this payment goes to Review now, and comes back as its draft for the person to settle. */
    suspend fun addOne(s: SiftedSms): TxnDraftEntity? {
        openTrackFrom(YearMonth.from(day(s.message.at)))
        return (money.capture(s.message.body, "sms", s.message.at) as? MoneyRepository.Capture.Added)?.draft
    }

    /** One by one: skipped for good. Kept as a dismissed draft so it never comes back on the next import. */
    suspend fun skipOne(s: SiftedSms) {
        addOne(s)?.let { money.dismiss(it.id) }
    }

    /** Older alerts are ignored from the "track from" day; bringing in an earlier month moves that day back. */
    private suspend fun openTrackFrom(m: YearMonth) {
        val first = m.atDay(1)
        settings.update { st ->
            val cur = st.moneyTrackFrom?.let { runCatching { LocalDate.parse(it) }.getOrNull() }
            if (cur == null || first.isBefore(cur)) st.copy(moneyTrackFrom = first.toString()) else st
        }
    }

    private fun day(at: Long) = Instant.ofEpochMilli(at).atZone(clock.zone).toLocalDate()

    // --- a whole year, automatically ---

    /** [year] null = the last 12 months. Works through one month at a time in the background. */
    suspend fun startYear(year: Int?) {
        val now = YearMonth.from(clock.today())
        val months = SmsPeriods.yearMonths(year, now)
        if (months.isEmpty()) return
        settings.update { it.copy(smsYearRun = SmsYearRun(SmsPeriods.yearLabel(year, now), months, months.size).encode()) }
        log.log("txn.sms_year", data = mapOf("months" to months.size), tier = Tier.A, source = "user")
        SmsYearScheduler.start(context)
    }

    suspend fun stopYear() {
        SmsYearScheduler.cancel(context)
        settings.update { st -> st.copy(smsYearRun = SmsYearRun.decode(st.smsYearRun)?.copy(stopped = true)?.encode()) }
    }

    suspend fun resumeYear() {
        settings.update { st -> st.copy(smsYearRun = SmsYearRun.decode(st.smsYearRun)?.copy(stopped = false)?.encode()) }
        SmsYearScheduler.start(context)
    }

    suspend fun clearYear() = settings.update { it.copy(smsYearRun = null) }

    /** Called by [SmsYearWorker]: reads the remaining months in order, saving after each one. */
    suspend fun runYear() {
        while (true) {
            val run = SmsYearRun.decode(settings.current().smsYearRun) ?: return
            if (run.stopped || run.finished) return
            val month = run.remaining.first()
            val r = importMonths(listOf(month), SmsFilter.decode(settings.current().smsFilter))
            if (r == null) { // permission taken away mid-run
                settings.update { it.copy(smsYearRun = run.copy(stopped = true).encode()) }
                return
            }
            val next = run.copy(remaining = run.remaining.drop(1), added = run.added + r.added, skipped = run.skipped + r.skipped.values.sum())
            // Keep a Stop that landed while this month was being read.
            settings.update { st -> st.copy(smsYearRun = next.copy(stopped = SmsYearRun.decode(st.smsYearRun)?.stopped ?: false).encode()) }
            if (next.finished) {
                notifications.announce("smsyear:${next.label}:${next.total}", "Your bank messages are in", next.doneLine(), "money")
                return
            }
        }
    }
}

@EntryPoint
@InstallIn(SingletonComponent::class)
interface SmsImportDeps {
    fun importer(): SmsImporter
}

class SmsYearWorker(context: Context, params: WorkerParameters) : CoroutineWorker(context, params) {
    override suspend fun doWork(): Result {
        val importer = EntryPointAccessors.fromApplication(applicationContext, SmsImportDeps::class.java).importer()
        return if (runCatching { importer.runYear() }.isSuccess || runAttemptCount >= 3) Result.success() else Result.retry()
    }
}

object SmsYearScheduler {
    private const val NAME = "sms-year"

    fun start(context: Context) {
        WorkManager.getInstance(context).enqueueUniqueWork(NAME, ExistingWorkPolicy.REPLACE, OneTimeWorkRequestBuilder<SmsYearWorker>().build())
    }

    fun cancel(context: Context) = WorkManager.getInstance(context).cancelUniqueWork(NAME)
}
