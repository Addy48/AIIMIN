package aiimin.core.data.money

/**
 * How a payee is shown (D-043). Bank alerts often name a UPI payee only by a phone number; a bare
 * "9215676766" reads like an error, so it is shown masked as "Phone ••6766". Names are kept as they are.
 */
fun payeeLabel(title: String): String {
    val t = title.trim()
    val digits = t.substringBefore('@').filter { it.isDigit() }
    val numberOnly = t.substringBefore('@').all { it.isDigit() || it == ' ' || it == '+' || it == '-' }
    return if (numberOnly && digits.length in 10..12) "Phone ••${digits.takeLast(4)}" else t
}
