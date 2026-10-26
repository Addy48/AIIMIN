package aiimin.core.nlp

import com.google.common.truth.Truth.assertThat
import java.io.File
import org.junit.Assume.assumeTrue
import org.junit.Test

/**
 * Runs the anonymised bank-SMS corpus (733 messages from a public 100k Indian SMS set; labels are automatic, not verified)
 * through the bank-message parser. The corpus is not committed (data rule): point AIIMIN_SMS_CSV at sms_samples.csv.
 * Direction for messages that say both "credited" and "debited" is checked against hand labels (sms_both_handlabels.csv, id,direction).
 */
class SmsCorpusTest {
    private val csv = File(System.getenv("AIIMIN_SMS_CSV") ?: "/Users/aaditya/Desktop/aiimin/12-datasets/aiimin-test-corpus/sms_samples.csv")
    private val hand = File(System.getenv("AIIMIN_SMS_HAND") ?: "/Users/aaditya/Desktop/aiimin/12-datasets/aiimin-test-corpus/sms_both_handlabels.csv")

    private val fixes = File(System.getenv("AIIMIN_SMS_FIXES") ?: "/Users/aaditya/Desktop/aiimin/12-datasets/aiimin-test-corpus/sms_label_fixes.csv")

    private data class Row(val id: Int, val sender: String, val text: String, val label: String, val amount: Double?)

    private fun parseCsv(f: File): List<List<String>> {
        val out = ArrayList<List<String>>()
        val text = f.readText(Charsets.UTF_8)
        var row = ArrayList<String>(); val cell = StringBuilder(); var q = false; var i = 0
        while (i < text.length) {
            val ch = text[i]
            when {
                q && ch == '"' && text.getOrNull(i + 1) == '"' -> { cell.append('"'); i++ }
                ch == '"' -> q = !q
                !q && ch == ',' -> { row.add(cell.toString()); cell.clear() }
                !q && (ch == '\n') -> { row.add(cell.toString()); cell.clear(); out.add(row); row = ArrayList() }
                ch == '\r' -> Unit
                else -> cell.append(ch)
            }
            i++
        }
        if (cell.isNotEmpty() || row.isNotEmpty()) { row.add(cell.toString()); out.add(row) }
        return out
    }

    private fun load(): List<Row> = parseCsv(csv).drop(1).filter { it.size >= 5 }.map {
        Row(it[0].toInt(), it[1], it[2], it[3], it[4].toDoubleOrNull())
    }

    @Test fun `bank messages through the parser`() {
        assumeTrue("SMS corpus not found at $csv", csv.exists())
        val rows = load()
        val handLabels: Map<Int, String> = if (hand.exists()) parseCsv(hand).drop(1).filter { it.size >= 2 }.associate { it[0].toInt() to it[1].trim().uppercase() } else emptyMap()
        // labels corrected by reading the message (the automatic label was wrong)
        val fixed: Map<Int, String> = if (fixes.exists()) parseCsv(fixes).drop(1).filter { it.size >= 2 }.associate { it[0].toInt() to it[1].trim() } else emptyMap()
        val report = StringBuilder("id,label,kind,direction,amount,verdict\n")
        var paymentsOk = 0; var paymentsTotal = 0
        val problems = ArrayList<String>()
        var bothTotal = 0; var bothRight = 0; var bothHand = 0; var bothHandRight = 0
        for (r0 in rows) {
            val r = fixed[r0.id]?.let { f -> r0.copy(label = if (f.startsWith("not_payment")) "otp" else f) } ?: r0
            val sender = "AX-${r.sender}-S"
            val kind = SmsSift.kind(sender, r.text)
            val alert = if (kind == SmsKind.PAYMENT) BankSms.parse(r.text) else null
            val dir = alert?.direction
            var verdict = "ok"
            when (r.label) {
                "txn_debit", "txn_credit" -> {
                    paymentsTotal++
                    val want = if (r.label == "txn_debit") MoneyDirection.OUT else MoneyDirection.IN
                    val amountOk = alert != null && r.amount != null && Math.abs(alert.paise / 100.0 - r.amount) < 0.005
                    if (kind == SmsKind.PAYMENT && dir == want && amountOk) paymentsOk++ else { verdict = "FAIL kind=$kind dir=$dir"; problems += "#${r.id} ${r.label} $verdict ${r.text.take(110)}" }
                }
                "txn_ambiguous_both" -> {
                    bothTotal++
                    val h = handLabels[r.id]
                    if (kind != SmsKind.PAYMENT || alert == null) { verdict = "FAIL not a payment ($kind)"; problems += "#${r.id} both $verdict ${r.text.take(110)}" }
                    else if (h != null) { bothHand++; if (dir?.name == h) bothHandRight++ else { verdict = "WRONG direction $dir, hand $h"; problems += "#${r.id} both $verdict ${r.text.take(110)}" } }
                    if (dir == MoneyDirection.OUT) bothRight++ // only for the count of OUT
                }
                "otp", "promo_or_notice", "no_amount", "fake_alert", "phishing" -> if (kind == SmsKind.PAYMENT) { verdict = "FAIL created a payment"; problems += "#${r.id} ${r.label} $verdict ${r.text.take(110)}" }
            }
            report.append("${r.id},${r.label},$kind,${dir ?: ""},${alert?.amount ?: ""},$verdict\n")
        }
        val bySender = rows.groupBy { it.sender }
        val verdictById = report.lines().drop(1).filter { it.isNotBlank() }.associate { it.split(",")[0].toInt() to it.split(",").last() }
        val perSender = bySender.entries.sortedByDescending { it.value.size }.joinToString("\n") { (k, v) ->
            val ok = v.count { verdictById[it.id] == "ok" }
            "$k,${v.size},$ok,${"%.1f".format(100.0 * ok / v.size)}"
        }
        File("build/sms-per-sender.csv").writeText("sender,messages,right,percent\n$perSender\n")
        File("build/sms-corpus-results.csv").also { it.parentFile.mkdirs() }.writeText(report.toString())
        println("SMS rows=${rows.size} single-direction payments right $paymentsOk/$paymentsTotal; both-words ${bothTotal} (hand-labelled $bothHand, direction right $bothHandRight); read as OUT $bothRight")
        problems.take(40).forEach { println("SMS PROBLEM $it") }
        val bad = problems.filter { it.contains("created a payment") }
        assertThat(bad).isEmpty() // an OTP, promo or fake message must never create a payment
        if (bothHand > 0) assertThat(bothHandRight.toDouble() / bothHand).isAtLeast(0.95)
    }
}
