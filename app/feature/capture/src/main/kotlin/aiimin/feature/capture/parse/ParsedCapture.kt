package aiimin.feature.capture.parse

/**
 * The six things AIIMIN offers to read out of one sentence.
 *
 * Order is the order they are shown, and it is not arbitrary: money first
 * because a wrong amount is the costliest mistake, mood last because it is the
 * softest reading.
 */
enum class CaptureField {
    AMOUNT,
    CATEGORY,
    MERCHANT,
    PEOPLE,
    MOOD,
    DURATION,
    ;

    /** The label above the field's editor. */
    val label: String
        get() = when (this) {
            AMOUNT -> "Amount"
            CATEGORY -> "Category"
            MERCHANT -> "Merchant"
            PEOPLE -> "People"
            MOOD -> "Mood"
            DURATION -> "Duration"
        }
}

/**
 * One read field: what the parser thinks it is, and whether it will be written.
 *
 * [included] starts `true` for confident readings and `false` for guesses, so
 * the default commit is the conservative one. Nothing here is written until the
 * user settles.
 */
data class CaptureChip(
    val field: CaptureField,
    val value: String,
    val included: Boolean,
) {
    /** What the chip says on the sheet. `this.field` — bare `field` is the backing field. */
    val label: String
        get() = when (this.field) {
            CaptureField.AMOUNT -> "₹$value"
            CaptureField.PEOPLE -> "+ $value"
            CaptureField.MOOD -> "Mood $value"
            CaptureField.DURATION -> "$value min"
            else -> value
        }
}

/** The whole offer: the sentence as read, correctable, uncommitted. */
data class ParsedCapture(
    val text: String,
    val chips: List<CaptureChip>,
) {
    val isEmpty: Boolean get() = chips.isEmpty()

    fun chip(field: CaptureField): CaptureChip? = chips.firstOrNull { it.field == field }

    /** The amount that would be written, in rupees; `null` when nothing will be. */
    fun settledAmount(): Int? = chips
        .firstOrNull { it.field == CaptureField.AMOUNT && it.included }
        ?.value
        ?.filter(Char::isDigit)
        ?.toIntOrNull()

    fun withValue(field: CaptureField, value: String): ParsedCapture {
        val existing = chip(field)
        return when {
            value.isBlank() && existing != null -> copy(chips = chips - existing)
            existing != null -> copy(
                chips = chips.map {
                    if (it.field == field) it.copy(value = value, included = true) else it
                },
            )
            else -> copy(
                chips = (chips + CaptureChip(field, value, included = true))
                    .sortedBy { it.field.ordinal },
            )
        }
    }

    fun toggle(field: CaptureField): ParsedCapture = copy(
        chips = chips.map { if (it.field == field) it.copy(included = !it.included) else it },
    )
}
