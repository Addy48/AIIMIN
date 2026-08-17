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

/** Dark — "Drafting Table" (default). */
val DraftingTableDark = AiiminColors(
    bg = Color(0xFF15171A),
    surface = Color(0xFF1C1F23),
    text = Color(0xFFE4E5E7),
    accent = Color(0xFF749DC4),
    hair = Color(0xFF26292E),
    rule = Color(0xFF353A41),
    muted = Color(0xFF8B9098),
    tint = Color(0xFF1B232C),
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
