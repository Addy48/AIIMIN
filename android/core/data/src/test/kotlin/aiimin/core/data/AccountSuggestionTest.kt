package aiimin.core.data

import aiimin.core.data.money.SeenAccount
import aiimin.core.data.money.bankFromRaw
import aiimin.core.data.money.suggestAccounts
import aiimin.core.database.AccountEntity
import com.google.common.truth.Truth.assertThat
import org.junit.Test

/** Owner, 20 Oct: a masked account seen in bank messages but not in Accounts is offered, never added silently. */
class AccountSuggestionTest {
    private fun acct(name: String, last4: String?, bank: String = name, archived: Boolean = false) =
        AccountEntity(id = name + last4, name = name, bank = bank, last4 = last4, archived = archived, createdAt = 0, updatedAt = 0)

    @Test fun `bank comes from the sender header`() =
        assertThat(bankFromRaw("AD-ICICIT-S ICICI Bank Acct XX733 debited for Rs 40.00")).isEqualTo("ICICI Bank")

    @Test fun `bank comes from the text when there is no header`() =
        assertThat(bankFromRaw("Rs 250 debited from HDFC Bank A/c **1234 on 20-10-26")).isEqualTo("HDFC Bank")

    @Test fun `no bank named gives null`() = assertThat(bankFromRaw("Rs 250 debited from A/c XX1234")).isNull()

    @Test fun `an unknown number is offered once with its bank and count`() {
        val seen = listOf(
            SeenAccount("1234", "HDFC Bank", 1, 100), SeenAccount("1234", null, 1, 300), SeenAccount("733", "ICICI Bank", 2, 200),
        )
        val out = suggestAccounts(seen, listOf(acct("ICICI Bank", "733")), dismissed = emptySet())
        assertThat(out).containsExactly(SeenAccount("1234", "HDFC Bank", 2, 300))
    }

    @Test fun `numbers already added, archived or dismissed are not offered`() {
        val seen = listOf(SeenAccount("1111", null, 1, 1), SeenAccount("2222", null, 1, 1), SeenAccount("3333", null, 1, 1))
        val out = suggestAccounts(seen, listOf(acct("Old", "2222", archived = true), acct("A", "1111")), dismissed = setOf("3333"))
        assertThat(out).isEmpty()
    }

    @Test fun `newest first`() {
        val out = suggestAccounts(listOf(SeenAccount("1", null, 1, 1), SeenAccount("2", null, 1, 9)), emptyList(), emptySet())
        assertThat(out.map { it.last4 }).containsExactly("2", "1").inOrder()
    }

    @Test fun `a blank account of the same bank is the one to link`() {
        val blank = acct("ICICI Bank", null)
        val s = SeenAccount("733", "ICICI Bank", 1, 1)
        assertThat(s.linkTarget(listOf(blank, acct("Cash", null, bank = "")))).isEqualTo(blank)
        assertThat(SeenAccount("9", "HDFC Bank", 1, 1).linkTarget(listOf(blank))).isNull()
    }
}
