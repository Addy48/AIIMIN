package aiimin.core.data.sync

import com.google.common.truth.Truth.assertThat
import org.junit.Test
import kotlin.math.abs

class ExpenseSignTest {

    @Test
    fun `expense amount matches website negative convention`() {
        val amountInr = 240
        val type = "expense"
        val signed = when (type.lowercase()) {
            "expense" -> -abs(amountInr.toDouble())
            "income" -> abs(amountInr.toDouble())
            else -> amountInr.toDouble()
        }
        assertThat(signed).isEqualTo(-240.0)
    }
}
