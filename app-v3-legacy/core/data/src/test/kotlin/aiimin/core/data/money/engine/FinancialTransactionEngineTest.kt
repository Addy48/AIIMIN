package aiimin.core.data.money.engine

import aiimin.core.data.money.PaymentDraftSource
import com.google.common.truth.Truth.assertThat
import org.junit.Test

class FinancialTransactionEngineTest {

    @Test
    fun rejects_recharge_spam() {
        val spam = "Recharge with Rs. 299 for 28 days unlimited 5G data and calls. Click to recharge now!"
        val result = FinancialTransactionEngine.process(spam, PaymentDraftSource.SMS, "AD-AIRTEL")
        assertThat(result).isInstanceOf(FinancialTransactionEngine.EngineResult.Rejected::class.java)
        val rejected = result as FinancialTransactionEngine.EngineResult.Rejected
        assertThat(rejected.category).isEqualTo(AntiSpamGuard.SpamCategory.RECHARGE_PROMO)
    }

    @Test
    fun rejects_preapproved_loan_offer() {
        val loanSpam = "Congratulations! You are eligible for a pre-approved personal loan of Rs 5,00,000 with zero processing fee. Apply today at bit.ly/loan"
        val result = FinancialTransactionEngine.process(loanSpam, PaymentDraftSource.SMS, "VK-BAJAJ")
        assertThat(result).isInstanceOf(FinancialTransactionEngine.EngineResult.Rejected::class.java)
        val rejected = result as FinancialTransactionEngine.EngineResult.Rejected
        assertThat(rejected.category).isEqualTo(AntiSpamGuard.SpamCategory.LOAN_OFFER)
    }

    @Test
    fun rejects_bill_due_date_reminder() {
        val billReminder = "Dear Customer, bill of Rs 1,450.00 is generated for your connection, due on 20-Sep-2026. Pay before due date to avoid late fee."
        val result = FinancialTransactionEngine.process(billReminder, PaymentDraftSource.SMS, "AD-HDFCBK")
        assertThat(result).isInstanceOf(FinancialTransactionEngine.EngineResult.Rejected::class.java)
        val rejected = result as FinancialTransactionEngine.EngineResult.Rejected
        assertThat(rejected.category).isEqualTo(AntiSpamGuard.SpamCategory.BILL_DUE_REMINDER)
    }

    @Test
    fun rejects_unauthorized_sms_sender_number() {
        val spoofSms = "Rs. 500 debited from your A/c XX1234"
        val result = FinancialTransactionEngine.process(spoofSms, PaymentDraftSource.SMS, "+919876543210")
        assertThat(result).isInstanceOf(FinancialTransactionEngine.EngineResult.Rejected::class.java)
        val rejected = result as FinancialTransactionEngine.EngineResult.Rejected
        assertThat(rejected.reason).contains("Unauthorized SMS sender")
    }

    @Test
    fun rejects_unauthorized_notification_package() {
        val notif = "Win Rs. 1000 on Rummy! Deposit ₹100 now."
        val result = FinancialTransactionEngine.process(notif, PaymentDraftSource.NOTIFICATION, "com.random.gaming.app")
        assertThat(result).isInstanceOf(FinancialTransactionEngine.EngineResult.Rejected::class.java)
    }

    @Test
    fun accepts_valid_hdfc_debit_sms() {
        val sms = "HDFC Bank: Rs. 1,450.00 debited from A/c XX4092 on 13-09-26 to VPA starbucks@hdfcbank. UPI Ref 4251029384. Avail Bal: INR 35,420.00"
        val result = FinancialTransactionEngine.process(sms, PaymentDraftSource.SMS, "AD-HDFCBK")
        assertThat(result).isInstanceOf(FinancialTransactionEngine.EngineResult.Accepted::class.java)
        val accepted = result as FinancialTransactionEngine.EngineResult.Accepted
        assertThat(accepted.draft.amountInr).isEqualTo(1450)
        assertThat(accepted.draft.direction).isEqualTo(aiimin.core.data.money.PaymentAlertParser.Direction.DEBIT)
        assertThat(accepted.draft.channel).isEqualTo("UPI")
        assertThat(accepted.draft.category).isEqualTo("FOOD")
    }

    @Test
    fun accepts_valid_phonepe_notification() {
        val notif = "Paid ₹450 to Swiggy using PhonePe. Ref: 20491823901"
        val result = FinancialTransactionEngine.process(notif, PaymentDraftSource.NOTIFICATION, "com.phonepe.app")
        assertThat(result).isInstanceOf(FinancialTransactionEngine.EngineResult.Accepted::class.java)
        val accepted = result as FinancialTransactionEngine.EngineResult.Accepted
        assertThat(accepted.draft.amountInr).isEqualTo(450)
        assertThat(accepted.draft.merchant).contains("Swiggy")
        assertThat(accepted.draft.category).isEqualTo("FOOD")
    }

    @Test
    fun deduplicates_sms_and_notification_cross_channel() {
        val sms = "HDFC Bank: Rs. 450.00 debited from A/c XX4092 on 13-09-26 to VPA swiggy@hdfcbank."
        val smsResult = FinancialTransactionEngine.process(sms, PaymentDraftSource.SMS, "AD-HDFCBK")
        val acceptedSms = smsResult as FinancialTransactionEngine.EngineResult.Accepted

        // Subsequent notification arriving within 10 seconds for the same transaction
        val notif = "Paid ₹450 to Swiggy using Google Pay UPI."
        val notifResult = FinancialTransactionEngine.process(
            rawText = notif,
            source = PaymentDraftSource.NOTIFICATION,
            senderHeaderOrPackage = "com.google.android.apps.nbu.paisa.user",
            existingDrafts = listOf(acceptedSms.draft),
        )

        assertThat(notifResult).isInstanceOf(FinancialTransactionEngine.EngineResult.Duplicate::class.java)
        val dup = notifResult as FinancialTransactionEngine.EngineResult.Duplicate
        assertThat(dup.amountInr).isEqualTo(450)
        assertThat(dup.originalDraftId).isEqualTo(acceptedSms.draft.id)
    }
}
