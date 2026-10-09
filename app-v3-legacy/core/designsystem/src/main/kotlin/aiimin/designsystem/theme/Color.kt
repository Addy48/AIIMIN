package aiimin.designsystem.theme

import androidx.compose.runtime.Immutable
import androidx.compose.ui.graphics.Color

/**
 * Drafting Table palette. Ported 1:1 from
 * `frontend/src/prototypes/drafting-table/tokens.css`.
 *
 * LOCKED (guardrail G4): these values are founder-approved. Do not redesign them.
 */
@Immutable
data class AiiminColors(
    /** Page ground. */
    val bg: Color,
    /** Raised paper — cards, sheets, the toast. */
    val surface: Color,
    /** Primary ink. */
    val text: Color,
    /** Steel accent: the one active colour. */
    val accent: Color,
    /** Faintest line — cell edges, inactive chips. */
    val hair: Color,
    /** The drawing rule — section dividers, screen head. */
    val rule: Color,
    /** Secondary ink — labels, meta, settled rows. */
    val muted: Color,
    /** Accent wash behind a selected row. */
    val tint: Color,
    /** Destructive. */
    val danger: Color,
    val isDark: Boolean,
) {
    /**
     * Ink that reads on top of [accent] fills. The accent is light enough in dark
     * mode that the page ground is the correct contrast partner.
     */
    val onAccent: Color get() = if (isDark) bg else Color.White
}

/** Dark — "Drafting Table" (default). Pure neutral architectural charcoal. */
val DraftingTableDark = AiiminColors(
    bg = Color(0xFF141414),
    surface = Color(0xFF1E1E1E),
    text = Color(0xFFEDEDED),
    accent = Color(0xFF749DC4),
    hair = Color(0xFF262626),
    rule = Color(0xFF333333),
    muted = Color(0xFF888888),
    tint = Color(0xFF262626),
    danger = Color(0xFFE8735C),
    isDark = true,
)

/** Light — "Industry sheet". */
val IndustrySheetLight = AiiminColors(
    bg = Color(0xFFF2F2F3),
    surface = Color(0xFFFFFFFF),
    text = Color(0xFF1D1F20),
    accent = Color(0xFF416180),
    hair = Color(0xFFD4D4D7),
    rule = Color(0xFFB7B7BA),
    muted = Color(0xFF6C6C6F),
    tint = Color(0xFFEEF6FF),
    danger = Color(0xFF9E3526),
    isDark = false,
)

/**
 * The single warm spark. It belongs to the peak-A brand mark and nothing else —
 * never a UI accent, never a state colour.
 */
val BrandSpark = Color(0xFFFF6B35)
