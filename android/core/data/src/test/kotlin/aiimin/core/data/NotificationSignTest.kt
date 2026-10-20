package aiimin.core.data

import aiimin.core.data.notify.signedAiimin
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

/** PRD 1.1 and 20.5: money, document and backup notices are signed AIIMIN; the rest speak as Raahi. */
class NotificationSignTest {
    @Test fun moneyAndDocumentsAreSignedAiimin() {
        listOf("doc:abc:30", "backup:week", "bill:b1:2026-10-21", "budget:2026-10:80", "inbox:2026-10-20").forEach { assertTrue(it, signedAiimin(it)) }
    }

    @Test fun dayNoticesSpeakAsRaahi() {
        listOf("event:e1", "task:t1:2026-10-20", "streak:2026-10-20", "battery:2026-10-20", "review:2026-W43", "whatsnew:7").forEach { assertFalse(it, signedAiimin(it)) }
    }
}
